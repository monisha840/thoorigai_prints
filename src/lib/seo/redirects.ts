/**
 * Legacy URL map.
 *
 * The WordPress site being replaced has seventeen live commercial URLs, and
 * whatever ranking, backlinks and directory listings this business has
 * accumulated point at those, not at the six routes replacing them. Launching
 * without this file means every one of them 404s on day one and the studio
 * starts from zero — the single most expensive thing that can go wrong at a
 * relaunch, and the most reliably avoidable.
 *
 * ## Mapping rule
 *
 * Each legacy URL points at the closest page that answers the same question,
 * with a fragment where the new page covers the topic in a section. A redirect
 * to a page that genuinely continues the old one keeps its equity; a redirect
 * to the homepage because it was easier is treated as a soft 404 and keeps
 * nothing.
 *
 * ## What is deliberately not here
 *
 * The six orphan pages, the nine Lorem Ipsum blog posts and the seven theme
 * demo testimonials (`docs/content-audit.md`, findings 4–6). Nothing links to
 * them, none of them ranks, and none has an equivalent on the new site.
 * Google's guidance for a removed page with no replacement is to let it 404 —
 * redirecting an AI-course landing page to a printing homepage is noise that
 * takes longer to drop out of the index than a clean 404 does.
 *
 * ## Trailing slashes
 *
 * WordPress served every URL with one; this site serves none. Next normalises
 * `/about-us/` to `/about-us` before matching, so those requests resolve in two
 * hops. Google follows redirect chains up to five deep and passes full equity
 * through them, so this is correct, just not maximally tidy.
 */

export interface LegacyRedirect {
  source: string;
  destination: string;
  /** Why this destination, when it is not obvious from the paths. */
  note?: string;
}

export const legacyRedirects: LegacyRedirect[] = [
  /* Printing hub and its four children. The children duplicated their parent
     verbatim on the old site, so all five land on the process that page was
     nominally about. */
  { source: '/printing', destination: '/services' },
  { source: '/digital-multicolour', destination: '/services#digital' },
  { source: '/digital-black-and-white', destination: '/services#digital' },
  { source: '/offset-multicolour', destination: '/services#offset' },
  { source: '/offset-black-and-white', destination: '/services#offset' },

  /* Packaging hub and its three children. The children were product formats
     rather than processes, so they land in the catalogue, not the services. */
  { source: '/packaging', destination: '/services#packaging' },
  {
    source: '/corrugation-box',
    destination: '/products#corrugation',
    note: 'Format, not process — the catalogue answers this, /services does not.',
  },
  { source: '/carton-box', destination: '/products#boxes' },
  { source: '/paper-bag', destination: '/products#bags' },

  /* Binding hub and its four children. All four formats are covered in the
     one binding section rather than by a page each. */
  { source: '/binding', destination: '/services#binding' },
  { source: '/hard-case-binding', destination: '/services#binding' },
  { source: '/perfect-binding', destination: '/services#binding' },
  { source: '/wiro-binding', destination: '/services#binding' },
  { source: '/center-pin', destination: '/services#binding' },

  /* Straight renames. */
  { source: '/about-us', destination: '/about' },
  { source: '/contact-us', destination: '/contact' },

  /* A second copy of the front page at its own URL — the duplicate-content
     problem `docs/sitemap.md` flags. */
  { source: '/home', destination: '/' },

  /* Legal. Both destinations are live — `app/terms` and `app/cookies`. */
  { source: '/terms-conditions', destination: '/terms' },
  { source: '/cookie-policy', destination: '/cookies' },

  /* ---------------------------------------------------------------------
   * Paths this site linked to before the routes behind them existed.
   *
   * Five internal links pointed at `/quote`, `/work`, `/process`, `/materials`
   * and `/faq` while none of those were routes. The links themselves now point
   * at the real destinations, but these rules stay: a link that shipped, even
   * briefly, can be in a bookmark, a WhatsApp thread or a crawler's queue, and
   * a redirect costs nothing where a 404 costs an enquiry.
   *
   * `/faq` is the exception — it is a real page now, so it is deliberately
   * absent from this list.
   * ------------------------------------------------------------------- */
  {
    source: '/quote',
    destination: '/contact#quote',
    note: 'The quote form lives on the contact page, not at a route of its own.',
  },
  { source: '/work', destination: '/portfolio' },
  { source: '/process', destination: '/about#process' },
  {
    source: '/materials',
    destination: '/portfolio#gallery',
    note: 'The finishes band on the portfolio is the only page that shows them.',
  },
];

/**
 * Shaped for `next.config.ts`.
 *
 * `permanent: true` emits a 308, the method-preserving successor to a 301.
 * Both consolidate equity identically for search purposes. Permanent is
 * correct here because these URLs are never coming back — a 307 would leave
 * the old URL in the index competing with its replacement.
 */
export function toNextRedirects() {
  return legacyRedirects.map(({ source, destination }) => ({
    source,
    destination,
    permanent: true,
  }));
}
