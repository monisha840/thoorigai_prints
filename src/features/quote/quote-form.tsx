'use client';

import { AnimatePresence, m } from '@/components/motion';
import { fadeIn } from '@/animations/variants';
import { Check, MessageCircle, Phone, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { products, services } from '@/lib/content';
import { projects } from '@/lib/portfolio';
import { siteConfig } from '@/lib/site';
import { cn, toTelHref, toWhatsAppHref } from '@/lib/utils';

/**
 * Quote request form.
 *
 * Three things matter for conversion here, in order:
 *
 * 1. A submitted brief must actually reach the studio. It posts to
 *    `/api/quote`; if that route has no transport configured, or delivery
 *    fails, the visitor is handed the same brief pre-composed into WhatsApp
 *    and email rather than a success screen. The form never claims a delivery
 *    it cannot prove.
 * 2. Required fields are the minimum that make a lead actionable — name,
 *    phone, brief. Email is optional: the studio replies by phone or WhatsApp,
 *    so demanding an address only costs completions.
 * 3. An enquiry carries context. `?ref=` from a product tile or a service row
 *    preselects the service and seeds the brief, and a hidden `source` field
 *    tells the studio which page it came from.
 */

const serviceOptions = [
  'Digital printing',
  'Offset printing',
  'Packaging',
  'Binding & finishing',
  'Prepress',
  'Something else',
];

/** `?ref=offset` -> 'Offset printing'. Falls through to the catch-all. */
function serviceForRef(ref: string | null): string {
  if (!ref) return serviceOptions[0];
  const service = services.find((item) => item.id === ref);
  if (service) {
    return serviceOptions.find((option) => option.startsWith(service.title.split(' ')[0])) ??
      serviceOptions[serviceOptions.length - 1];
  }
  const product = products.find((item) => item.id === ref);
  if (product) {
    // Packaging formats belong on the packaging line; everything else is a
    // print job until the studio says otherwise.
    return product.category === 'Packaging' ? 'Packaging' : serviceOptions[0];
  }
  // A portfolio job. Its category maps onto the same three lines the catalogue
  // uses, so "something like the kraft boxes" arrives on the packaging line
  // rather than as an unclassified print enquiry.
  const project = projects.find((item) => item.id === ref);
  if (project) {
    if (project.category === 'packaging') return 'Packaging';
    if (project.category === 'binding') return 'Binding & finishing';
    return serviceOptions[0];
  }
  return serviceOptions[0];
}

/** The human name of whatever the visitor clicked, for the seeded brief. */
function titleForRef(ref: string | null): string | null {
  if (!ref) return null;
  return (
    services.find((item) => item.id === ref)?.title ??
    products.find((item) => item.id === ref)?.title ??
    projects.find((item) => item.id === ref)?.title ??
    null
  );
}

type Status = 'idle' | 'submitting' | 'success' | 'undelivered' | 'error';

const fieldStyles = cn(
  'w-full rounded-md border border-paper-400 bg-paper-50 px-4 py-3',
  'text-body-md text-ink-800 placeholder:text-ink-300',
  'motion-tint',
  'hover:border-paper-500 focus:border-indigo-500 focus:outline-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
);

const labelStyles = 'block text-body-sm font-medium text-ink-700';

export function QuoteForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  /** Held so the fallback panel can pre-compose the brief the visitor typed. */
  const [sent, setSent] = useState<Record<string, string> | null>(null);

  const pathname = usePathname();

  /**
   * `?ref=` is read from the URL after mount, not with `useSearchParams`.
   *
   * That hook is the obvious tool and it was the wrong one here. Calling it
   * without a `<Suspense>` boundary above it makes Next bail the **entire
   * route** out of server rendering — `BAILOUT_TO_CLIENT_SIDE_RENDERING` — so
   * `/contact` was shipping a loading skeleton as its whole HTML body. Three
   * things followed from that, all of them bad on the site's highest-intent
   * page:
   *
   * - A crawler saw a skeleton. The form, the phone number, the address and
   *   the opening hours were not in the HTML at all — on the one page whose
   *   entire job is to be found and acted on.
   * - `id="quote"` did not exist server-side, so `/contact#quote` — the primary
   *   call to action in the navbar, the footer and every page's closing band —
   *   landed at the top of the page instead of on the form.
   * - Every visitor saw a flash of shimmer before the page appeared.
   *
   * Reading `location.search` on mount costs one extra render and nothing else.
   * The two prefilled fields already carry `key={default…}`, so they remount
   * with the new default the moment it arrives — the mechanism was in place
   * before this change and is what makes the deferred read invisible.
   *
   * `pathname` is a dependency so a client-side navigation that lands here with
   * a different `?ref=` is picked up even if the component never unmounts.
   */
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    setRef(new URLSearchParams(window.location.search).get('ref'));
  }, [pathname]);

  const refTitle = useMemo(() => titleForRef(ref), [ref]);
  const defaultService = useMemo(() => serviceForRef(ref), [ref]);
  const defaultBrief = refTitle ? `I am looking for ${refTitle.toLowerCase()}. ` : '';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setStatus('submitting');
    setSent(data);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as { ok?: boolean; delivered?: boolean };

      if (!response.ok || !result.ok) {
        setStatus('error');
        return;
      }

      // `ok` without `delivered` means the endpoint has no transport wired up.
      // Say so, and give the visitor a channel that works.
      setStatus(result.delivered ? 'success' : 'undelivered');
    } catch {
      setStatus('error');
    }
  }

  /** The typed brief, as a message the visitor can send on another channel. */
  const composed = sent
    ? [
        `Quote request from ${sent.name || 'the website'}`,
        sent.company ? `Company: ${sent.company}` : '',
        sent.phone ? `Phone: ${sent.phone}` : '',
        sent.service ? `Service: ${sent.service}` : '',
        sent.quantity ? `Quantity: ${sent.quantity}` : '',
        sent.deadline ? `Needed by: ${sent.deadline}` : '',
        '',
        sent.brief ?? '',
      ]
        .filter((line) => line !== '')
        .join('\n')
    : '';

  if (status === 'success') {
    return (
      <div
        className={cn(
          'flex flex-col items-start gap-5 rounded-lg border border-paper-400 bg-paper-100 p-8',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <span className="grid size-12 place-items-center rounded-full bg-gold-100 text-gold-700">
          <Check className="size-6" strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="font-display text-heading-lg text-ink-800">Brief received</h3>
          <p className="measure mt-2 text-body-sm text-ink-500">
            {siteConfig.contact.responseTime} If it is urgent, call or message the studio and
            quote your name — we will pull the brief up.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            href={toWhatsAppHref(siteConfig.contact.whatsapp ?? siteConfig.contact.phone)}
            variant="secondary"
            size="sm"
            icon={<MessageCircle />}
          >
            WhatsApp
          </Button>
          <Button
            href={toTelHref(siteConfig.contact.phone)}
            variant="ghost"
            size="sm"
            icon={<Phone />}
          >
            {siteConfig.contact.phone}
          </Button>
        </div>
      </div>
    );
  }

  // Delivery is not configured, or every transport failed. Do not pretend
  // otherwise — hand the visitor the brief they typed and a channel that works.
  if (status === 'undelivered' || status === 'error') {
    return (
      <div
        className={cn(
          'flex flex-col items-start gap-5 rounded-lg border border-gold-300 bg-gold-50 p-8',
          className,
        )}
        role="alert"
        aria-live="assertive"
      >
        <div>
          <h3 className="font-display text-heading-lg text-ink-800">
            Send this straight to the studio
          </h3>
          <p className="measure mt-2 text-body-sm text-ink-600">
            We could not deliver the form just now. Your brief is ready to send below — one tap
            and it goes through, nothing to retype.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            href={toWhatsAppHref(siteConfig.contact.whatsapp ?? siteConfig.contact.phone, composed)}
            variant="primary"
            size="md"
            icon={<MessageCircle />}
          >
            Send on WhatsApp
          </Button>
          <Button
            href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
              'Quote request',
            )}&body=${encodeURIComponent(composed)}`}
            variant="secondary"
            size="md"
          >
            Send as email
          </Button>
          <Button
            href={toTelHref(siteConfig.contact.phone)}
            variant="ghost"
            size="md"
            icon={<Phone />}
          >
            {siteConfig.contact.phone}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-body-sm text-ink-500 underline underline-offset-4 motion-tint hover:text-ink-900"
        >
          Try the form again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6', className)}>
      {/* What the visitor was looking at when they clicked through, so the
          studio can qualify the lead without asking. */}
      <input type="hidden" name="source" value={`${pathname}${ref ? ` · ${ref}` : ''}`} />

      {/* Honeypot: hidden from people, irresistible to bots. Not `display:none`,
          which some bots skip. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Do not fill this in</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {refTitle ? (
        <p className="rounded-md border border-paper-400 bg-paper-50 px-4 py-3 text-body-sm text-ink-600">
          Enquiring about <span className="font-medium text-ink-900">{refTitle}</span>.
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelStyles}>
            Name <span className="text-gold-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={fieldStyles}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className={labelStyles}>
            Phone <span className="text-gold-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91"
            className={fieldStyles}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelStyles}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Optional"
            className={fieldStyles}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="company" className={labelStyles}>
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Optional"
            className={fieldStyles}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="service" className={labelStyles}>
          What do you need?
        </label>
        <select
          id="service"
          name="service"
          defaultValue={defaultService}
          key={defaultService}
          className={fieldStyles}
        >
          {serviceOptions.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="quantity" className={labelStyles}>
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 2,000"
            className={fieldStyles}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="deadline" className={labelStyles}>
            Needed by
          </label>
          <input id="deadline" name="deadline" type="date" className={fieldStyles} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="brief" className={labelStyles}>
          The brief <span className="text-gold-600">*</span>
        </label>
        <textarea
          id="brief"
          name="brief"
          required
          rows={5}
          defaultValue={defaultBrief}
          key={defaultBrief}
          placeholder="Format, size, stock, finish — whatever you know so far."
          className={cn(fieldStyles, 'resize-y')}
        />
        <p className="text-caption text-ink-400">
          Have artwork already?{' '}
          <a
            href={toWhatsAppHref(
              siteConfig.contact.whatsapp ?? siteConfig.contact.phone,
              'Hi Thoorigai Prints — sending artwork for a quote.',
            )}
            className="text-indigo-600 underline underline-offset-4 motion-tint hover:text-indigo-700"
          >
            Send the file on WhatsApp
          </a>{' '}
          and we will quote against it.
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-paper-400 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-body-sm font-medium text-ink-700">
            {siteConfig.contact.responseTime}
          </p>
          <p className="mt-1 text-caption text-ink-400">
            Name, phone and brief are all we need to start.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={status === 'submitting'}
          iconAfter={<Send />}
          className="w-full sm:w-auto"
        >
          {status === 'submitting' ? 'Sending…' : 'Send the brief'}
        </Button>
      </div>

      <AnimatePresence>
        {status === 'submitting' ? (
          <m.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            Sending your brief.
          </m.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}

export default QuoteForm;
