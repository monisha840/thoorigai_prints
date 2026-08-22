import { NextResponse } from 'next/server';

import { siteConfig } from '@/lib/site';

/**
 * Enquiry endpoint.
 *
 * The form used to fake a round trip and show a success screen, which meant
 * every brief a visitor sent was lost. This delivers them.
 *
 * Two transports, either or both:
 *
 *   ENQUIRY_WEBHOOK_URL   POST the enquiry as JSON (Zapier, Make, n8n, a
 *                         Google Apps Script, a CRM inbox hook).
 *   RESEND_API_KEY        Send it as email, to ENQUIRY_TO_EMAIL.
 *   + ENQUIRY_TO_EMAIL    Falls back to the address in siteConfig.
 *   + ENQUIRY_FROM_EMAIL  Must be a domain verified with Resend.
 *
 * With neither configured the route still validates, still logs, and returns
 * `delivered: false` — the form then shows the visitor a WhatsApp and email
 * fallback rather than claiming a success that did not happen. A lead should
 * never be lost to a missing environment variable.
 */

export const runtime = 'nodejs';
/** Enquiries are never cached. */
export const dynamic = 'force-dynamic';

interface Enquiry {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  quantity: string;
  deadline: string;
  brief: string;
  /** Which page and which item the enquiry came from. */
  source: string;
}

/** Trim, collapse whitespace and cap length, so one field cannot flood an inbox. */
function clean(value: unknown, max = 2000): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function validate(body: Record<string, unknown>): { enquiry: Enquiry; errors: string[] } {
  const enquiry: Enquiry = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    service: clean(body.service, 120),
    quantity: clean(body.quantity, 80),
    deadline: clean(body.deadline, 40),
    // The brief is the valuable part — keep its line breaks.
    brief: typeof body.brief === 'string' ? body.brief.trim().slice(0, 5000) : '',
    source: clean(body.source, 300),
  };

  const errors: string[] = [];
  if (enquiry.name.length < 2) errors.push('name');
  // Seven digits is the shortest plausible Indian landline without an STD code.
  if (enquiry.phone.replace(/\D/g, '').length < 7) errors.push('phone');
  if (enquiry.brief.length < 5) errors.push('brief');
  // Email is optional; only checked when given.
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) errors.push('email');

  return { enquiry, errors };
}

/** Plain text, because this is read on a phone by someone on the press floor. */
function format(enquiry: Enquiry): string {
  const rows: Array<[string, string]> = [
    ['Name', enquiry.name],
    ['Company', enquiry.company],
    ['Phone', enquiry.phone],
    ['Email', enquiry.email],
    ['Service', enquiry.service],
    ['Quantity', enquiry.quantity],
    ['Needed by', enquiry.deadline],
    ['Came from', enquiry.source],
  ];

  return [
    ...rows.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`),
    '',
    'Brief:',
    enquiry.brief,
  ].join('\n');
}

async function deliver(enquiry: Enquiry): Promise<boolean> {
  const body = format(enquiry);
  const subject = `Quote request - ${enquiry.name}${enquiry.company ? ` (${enquiry.company})` : ''}`;
  const results: boolean[] = [];

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject, text: body, ...enquiry }),
      });
      results.push(response.ok);
    } catch {
      results.push(false);
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${resendKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.ENQUIRY_FROM_EMAIL ?? 'enquiries@thoorigaiprints.com',
          to: process.env.ENQUIRY_TO_EMAIL ?? siteConfig.contact.email,
          // So a reply from the studio goes straight back to the buyer.
          ...(enquiry.email ? { reply_to: enquiry.email } : {}),
          subject,
          text: body,
        }),
      });
      results.push(response.ok);
    } catch {
      results.push(false);
    }
  }

  // No transport configured, or every configured one failed.
  return results.some(Boolean);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  // Honeypot. Accept it so the bot sees a success and does not adapt, but
  // deliver nothing.
  if (clean(body.company_website)) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const { enquiry, errors } = validate(body);
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: 'invalid', fields: errors }, { status: 422 });
  }

  const delivered = await deliver(enquiry);

  // Always log, whatever happened to the transports. If delivery is broken the
  // enquiry is still recoverable from the server logs.
  console.info(
    delivered ? '[quote] delivered' : '[quote] NOT DELIVERED - no transport succeeded',
    format(enquiry).replace(/\n/g, ' | '),
  );

  return NextResponse.json({ ok: true, delivered });
}
