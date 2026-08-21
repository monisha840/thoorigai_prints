import { LegalDocument, type LegalClause } from '@/sections/legal';
import { PageHero } from '@/sections/shared/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

/**
 * Privacy policy.
 *
 * ## Why this page exists at all
 *
 * The footer has linked to `/privacy` since the shell was built and the route
 * did not exist, so every visit to it was a 404 — from a link the site itself
 * drew, on the page a cautious visitor checks before typing their phone number
 * into a form. That is the worst possible place on a site to have a dead link.
 *
 * ## What it describes, and what it cannot
 *
 * Everything below is written against what this codebase actually does. The
 * enquiry route in `app/api/quote/route.ts` is the only place the site collects
 * anything, it takes exactly the nine fields listed in clause 2, and it forwards
 * them to a webhook and/or Resend depending on which environment variables are
 * set. The storage clause describes `localStorage` because
 * `providers/motion-provider.tsx` is the only thing on the site that writes to
 * a browser store. There is no analytics, no advertising pixel and no
 * third-party tracker in the build — clause 5 says so because it is true today,
 * and it is the clause to revisit the day one is added.
 *
 * **Retention periods and the grievance contact are the studio's to set.** The
 * values below are the conventional ones for a business of this size under
 * India's DPDP Act 2023; they are not legal advice and have not been reviewed
 * by a lawyer. See `WEBSITE_COMPLETENESS_REPORT.md`, "Before the domain is
 * pointed" — this page is on that list.
 */
export const metadata = metadataForRoute('/privacy');

const { contact, name } = siteConfig;

const clauses: readonly LegalClause[] = [
  {
    id: 'who-we-are',
    heading: 'Who this policy is from',
    body: (
      <>
        <p>
          {name} is a printing, packaging and binding studio operating from{' '}
          {contact.address.street}, {contact.address.city}, {contact.address.state}{' '}
          {contact.address.postalCode}. This policy covers{' '}
          <strong>www.thoorigaiprints.com</strong> and the enquiries sent through it.
        </p>
        <p>
          It does not cover anything you send us by post, or a conversation on the studio floor.
          Those are governed by the same principle — we use what you tell us to quote and produce
          your job, and for nothing else — but this document is about the website.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    body: (
      <>
        <p>
          Only what you type into the quote form, and only when you submit it. That is:
        </p>
        <ul>
          <li>Your name, and your company if you give one</li>
          <li>Your phone number, and your email address if you give one</li>
          <li>The service, quantity and deadline you selected</li>
          <li>The brief you wrote</li>
          <li>Which page of this site you sent it from</li>
        </ul>
        <p>
          Name, phone number and brief are required because a quote cannot be produced without
          them. Everything else is optional and the form will submit without it.
        </p>
        <p>
          We do not ask for, and have no use for, your date of birth, your address, any government
          identifier, or any payment detail. If a brief contains something sensitive, say so and we
          will handle it accordingly.
        </p>
      </>
    ),
  },
  {
    id: 'why-we-hold-it',
    heading: 'Why we hold it',
    body: (
      <>
        <p>
          To answer your enquiry, to quote the job, and to produce it if you go ahead. That is the
          entire purpose. Sending an enquiry does not add you to a mailing list, because we do not
          run one.
        </p>
        <p>
          If we later want to use your job as an example of our work, we will ask you first, in
          writing. Nothing is published — no client name, no photograph of your job — without that
          permission.
        </p>
      </>
    ),
  },
  {
    id: 'where-it-goes',
    heading: 'Where it goes',
    body: (
      <>
        <p>
          An enquiry is delivered to the studio by email and, where configured, to the studio&rsquo;s
          own enquiry inbox through an automation service. Both are ordinary business tools acting
          on our instructions; neither is permitted to use your details for its own purposes.
        </p>
        <p>
          The site is hosted on Vercel, which processes the request in order to serve the page and
          keeps short-lived operational logs containing the requesting IP address. Those logs are
          Vercel&rsquo;s, are kept for a limited period, and are not used by us to build any profile
          of you.
        </p>
        <p>
          We do not sell your details, and we do not share them with anyone who is not directly
          involved in answering or producing your job.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies and browser storage',
    body: (
      <>
        <p>
          This site sets no advertising cookies, runs no analytics and carries no third-party
          tracking pixel. The only thing it writes to your browser is a single preference: whether
          you have switched animation off using the control in the footer.
        </p>
        <p>
          The full detail is on the <a href="/cookies">cookie policy</a>.
        </p>
      </>
    ),
  },
  {
    id: 'how-long',
    heading: 'How long we keep it',
    body: (
      <>
        <p>
          Enquiries that do not become jobs are kept while the quote is live and for a reasonable
          period afterwards in case you come back to it, then deleted.
        </p>
        <p>
          Enquiries that become jobs are kept as part of the job record, because a reprint is only
          possible if the original specification still exists — and because tax and accounting rules
          require the commercial record to be retained.
        </p>
        <p>
          If you would like your enquiry deleted sooner, ask, and we will do it.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: (
      <>
        <p>
          Under India&rsquo;s Digital Personal Data Protection Act 2023 you may ask us for a summary
          of what we hold about you, ask us to correct anything inaccurate, ask us to erase it where
          we are not required to keep it, and withdraw a consent you previously gave.
        </p>
        <p>
          Ask by email at <a href={`mailto:${contact.email}`}>{contact.email}</a> or by phone on{' '}
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>. We will
          respond within a reasonable period, and we will not charge you for it.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    heading: 'Security',
    body: (
      <p>
        The site is served over HTTPS, so what you type into the form is encrypted in transit. Once
        an enquiry reaches the studio it sits in ordinary business email and messaging accounts,
        protected by the access controls those accounts provide. We keep the number of people who
        can see an enquiry to the people who need to act on it.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <p>
        If this policy changes, the revised version is published here and the date at the top of the
        page is updated. There is no archive of previous versions; if you need to know what the
        policy said on a particular date, ask us.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={pageGraph('/privacy')} />

      <PageHero
        eyebrow="Privacy"
        title="What we do with what you send us."
        lede="We collect the details needed to quote your job, we use them to quote your job, and we do nothing else with them. This page says so in full."
      />

      <LegalDocument
        updated="2026-08-21"
        clauses={clauses}
        footnote={
          <>
            Questions about this policy go to{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>, or call the studio on{' '}
            <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a> during{' '}
            {contact.hours}.
          </>
        }
      />
    </>
  );
}
