import { LegalDocument, type LegalClause } from '@/sections/legal';
import { PageHero } from '@/sections/shared/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

/**
 * Cookie policy.
 *
 * ## Why it is this short
 *
 * Because the site genuinely does almost nothing. Grep the build: there is no
 * analytics script, no advertising pixel, no consent platform and no
 * third-party embed that sets a cookie. The only thing written to a visitor's
 * browser is `tp:reduce-motion` in `providers/motion-provider.tsx`, which is a
 * `localStorage` key rather than a cookie, and which exists so that somebody who
 * switched animation off in the footer does not have to switch it off again on
 * every page.
 *
 * A page that lists one preference key and says "there is nothing else" is a
 * more useful cookie policy than one padded with categories that do not apply,
 * and it is also the honest one. Two of the clauses below exist mainly to be
 * revisited: the moment analytics or a map embed is added, they are wrong.
 *
 * `lib/seo/redirects.ts` sends the legacy `/cookie-policy` here.
 */
export const metadata = metadataForRoute('/cookies');

const { contact } = siteConfig;

const clauses: readonly LegalClause[] = [
  {
    id: 'short-version',
    heading: 'The short version',
    body: (
      <>
        <p>
          This site sets <strong>no advertising cookies</strong>, runs{' '}
          <strong>no analytics</strong> and carries <strong>no third-party tracking pixel</strong>.
          Nothing here follows you to another website.
        </p>
        <p>
          One preference is stored in your browser, and only if you set it. That is the whole
          policy; the rest of this page is the detail.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-store',
    heading: 'What is stored, and why',
    body: (
      <>
        <p>
          <strong>tp:reduce-motion</strong> - a <em>local storage</em> entry, not a cookie. It is
          written only when you use the animation switch at the foot of the page, and it holds a
          single character: whether you asked for reduced motion.
        </p>
        <p>
          It exists so the choice survives you moving to another page. Without it, a visitor who
          finds animation uncomfortable would have to turn it off again on every page of the site.
        </p>
        <p>
          It is read only by this site, it is never sent to our servers, and it contains nothing
          that identifies you.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-do-not',
    heading: 'What is not stored',
    body: (
      <>
        <p>There is no:</p>
        <ul>
          <li>Analytics or measurement cookie - we do not count visitors</li>
          <li>Advertising or remarketing pixel</li>
          <li>Social network tracker or share widget</li>
          <li>Session identifier, because the site has no accounts to log in to</li>
          <li>Consent banner, because there is nothing to consent to</li>
        </ul>
        <p>
          The quote form posts what you typed and stores nothing in your browser afterwards - not
          even a draft.
        </p>
      </>
    ),
  },
  {
    id: 'hosting',
    heading: 'Our host',
    body: (
      <p>
        The site runs on Vercel, which handles the request that delivers each page and keeps
        short-lived operational logs for reliability and abuse prevention. Those logs contain the
        requesting IP address. They are not cookies, they are not set by us, and we do not use them
        to identify or profile anybody.
      </p>
    ),
  },
  {
    id: 'clearing',
    heading: 'Clearing it',
    body: (
      <>
        <p>
          Switch the animation control back and the preference is rewritten. Clear your
          browser&rsquo;s site data for this domain and it is removed entirely - the site then
          follows your operating system&rsquo;s own reduced-motion setting, which is what it does
          for a first-time visitor.
        </p>
        <p>
          Blocking storage for this site altogether costs you nothing except that the animation
          preference will not persist between pages.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    heading: 'If this changes',
    body: (
      <p>
        If we ever add analytics, a map embed or anything else that stores data in your browser,
        this page is updated before it goes live and the date at the top changes with it. Everything
        described above is what the site does today.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <>
      <JsonLd data={pageGraph('/cookies')} />

      <PageHero
        eyebrow="Cookies"
        title="One preference, and nothing else."
        lede="No analytics, no advertising, no tracking. The only thing this site stores in your browser is whether you asked it to stop moving."
      />

      <LegalDocument
        updated="2026-08-21"
        clauses={clauses}
        footnote={
          <>
            Questions go to <a href={`mailto:${contact.email}`}>{contact.email}</a>. The wider
            picture is on the <a href="/privacy">privacy policy</a>.
          </>
        }
      />
    </>
  );
}
