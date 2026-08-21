import { LegalDocument, type LegalClause } from '@/sections/legal';
import { PageHero } from '@/sections/shared/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

/**
 * Terms and conditions.
 *
 * ## Why this page exists
 *
 * Two reasons. The footer links to `/terms`, and `lib/seo/redirects.ts` sends
 * the legacy `/terms-conditions` here — that redirect was pointing at a 404,
 * which is a soft 404 in Google's eyes and worse for the visitor than the old
 * page had been.
 *
 * ## What is deliberately vague, and why
 *
 * Every clause below states a working practice this site already describes: the
 * proof stage in `processSteps`, the in-house finishing in `services`, the
 * quote-per-job model that `productListNode()` deliberately publishes without
 * `offers`. What none of them state is a **number** — no deposit percentage, no
 * quantity tolerance figure, no payment window, no liability cap. Those are
 * commercial terms only the studio can set, and inventing one here would put a
 * figure on the website that the invoices contradict.
 *
 * Each of those gaps is marked in `WEBSITE_COMPLETENESS_REPORT.md` under
 * "Before the domain is pointed". This document is a plain-English statement of
 * how the studio works; it is not legal advice and has not been reviewed by a
 * lawyer.
 */
export const metadata = metadataForRoute('/terms');

const { contact, name } = siteConfig;

const clauses: readonly LegalClause[] = [
  {
    id: 'scope',
    heading: 'What these terms cover',
    body: (
      <>
        <p>
          These are the terms {name} works to on printing, packaging, binding and finishing jobs
          taken through this website, by phone, on WhatsApp or in person at the studio.
        </p>
        <p>
          Where we have signed a separate agreement or a purchase order with you, that document
          takes precedence over anything on this page.
        </p>
      </>
    ),
  },
  {
    id: 'quotations',
    heading: 'Quotations',
    body: (
      <>
        <p>
          Every job is quoted individually. Nothing on this site is a price list, and no page here
          constitutes an offer — the quotation we send you does.
        </p>
        <p>
          A quotation is based on the specification you gave us: format, dimensions, stock,
          quantity, finish and date. Change any one of those and the quotation changes with it,
          which is why we would rather you told us the constraint that matters most and let us build
          the rest of the specification around it.
        </p>
        <p>
          Quotations are valid for the period stated on them. Paper prices move, and a quotation
          held open indefinitely is a quotation we would have to withdraw.
        </p>
      </>
    ),
  },
  {
    id: 'artwork',
    heading: 'Your artwork',
    body: (
      <>
        <p>
          You confirm that you own or are licensed to use everything in the files you send us —
          images, typefaces, logos and copy — and that printing them does not infringe anyone
          else&rsquo;s rights. We print what we are given; we are not in a position to verify the
          provenance of a file.
        </p>
        <p>
          We preflight, impose and proof artwork before anything reaches a plate, and we will tell
          you about the bleed, the overprint and the missing font. That check is a courtesy of the
          craft, not a guarantee that a design decision was the right one.
        </p>
        <p>
          Your files stay yours. We hold them so a reprint is possible, and we do not use them for
          anything else.
        </p>
      </>
    ),
  },
  {
    id: 'approval',
    heading: 'Proofs and approval',
    body: (
      <>
        <p>
          Nothing goes to press without an approved proof. Once you have approved it, the approved
          proof is the specification — a correction found after approval is a new job, and is
          charged as one.
        </p>
        <p>
          Take the time you need over a proof. An hour spent on it is the cheapest hour in the whole
          process, and the only point at which a change costs nothing.
        </p>
      </>
    ),
  },
  {
    id: 'colour',
    heading: 'Colour and materials',
    body: (
      <>
        <p>
          A screen emits light and a printed sheet reflects it, so a colour on your monitor and the
          same colour on paper will never be identical. Where an exact colour matters, specify a
          Pantone and we will match to it on the offset line.
        </p>
        <p>
          Stocks vary batch to batch, and the same ink lays differently on coated and uncoated
          paper. Small variation between one run and a reprint of it months later is normal in
          printing and is not a defect.
        </p>
      </>
    ),
  },
  {
    id: 'quantity',
    heading: 'Quantity',
    body: (
      <p>
        Print runs are set up with allowance for make-ready, so the delivered quantity can come in
        slightly over or under the quantity ordered. Where the delivered quantity is a firm
        requirement — a numbered certificate run, for instance — tell us before we quote and we will
        run to it.
      </p>
    ),
  },
  {
    id: 'delivery',
    heading: 'Delivery and collection',
    body: (
      <>
        <p>
          Short runs are collected from the studio in {contact.address.city}; larger jobs are
          delivered. The date we give you is the date we work to, and we will tell you as soon as
          we know if anything threatens it.
        </p>
        <p>
          Delivery dates depend on artwork arriving and proofs being approved on time. A job that
          waits three days for a proof approval finishes three days later.
        </p>
      </>
    ),
  },
  {
    id: 'payment',
    heading: 'Payment',
    body: (
      <p>
        Payment terms are stated on your quotation and confirmed on the invoice. Where a job
        requires materials to be bought in specifically for it, an advance may be required before
        the order is placed; if so, it is set out in the quotation, not sprung on you afterwards.
      </p>
    ),
  },
  {
    id: 'problems',
    heading: 'If something is wrong',
    body: (
      <>
        <p>
          Tell us quickly. Check the job when you receive it and raise anything that looks wrong
          within a reasonable period of delivery, while the run, the plates and the stock are still
          available to us.
        </p>
        <p>
          Where a job is genuinely defective and it is our doing, we reprint it or credit it. That
          is the remedy. We are not able to accept liability for indirect losses — a missed event, a
          cancelled campaign, lost profit — that follow from a print fault.
        </p>
      </>
    ),
  },
  {
    id: 'cancellation',
    heading: 'Cancellation',
    body: (
      <p>
        A job can be cancelled up to the point it goes to press, and you are charged for the work
        done and the materials committed up to that point. Once a run has started it cannot be
        cancelled — printed sheets have no value to anyone but you.
      </p>
    ),
  },
  {
    id: 'law',
    heading: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of India, and the courts at {contact.address.city},{' '}
        {contact.address.state} have jurisdiction over any dispute arising from them.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd data={pageGraph('/terms')} />

      <PageHero
        eyebrow="Terms"
        title="How we work, in writing."
        lede="Quotations, proofs, colour, quantity and delivery — the practices behind every job we take, set out plainly rather than buried in small print."
      />

      <LegalDocument
        updated="2026-08-21"
        clauses={clauses}
        footnote={
          <>
            If anything here is unclear before you place an order, ask — email{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a> or call{' '}
            <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>. We would
            rather answer it now than argue about it later.
          </>
        }
      />
    </>
  );
}
