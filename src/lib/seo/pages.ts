import { keywordsFor } from './keywords';

/**
 * Per-page SEO records.
 *
 * The six routes, each defined once. Page components read from here rather than
 * declaring their own strings, so a title and the sitemap entry and the
 * breadcrumb for the same route cannot drift apart.
 *
 * ## Why the lengths are annotated
 *
 * Google truncates a title at roughly 580–600px and a description at roughly
 * 920px, neither of which is a character count — but characters are the only
 * budget you can check in a diff. Each entry below records its length so an
 * edit that pushes a title to 74 characters is visible at review time instead
 * of in a search result three weeks after launch.
 *
 * Titles are written to sit under 60 and descriptions between 140 and 158.
 * `assertLengths()` enforces it at build time.
 */

export type PageSchemaType =
  | 'WebPage'
  | 'CollectionPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'FAQPage';

export interface PageSeo {
  route: string;
  /**
   * The title segment. `layout.tsx` wraps it with `%s — Thoorigai Prints`,
   * so this is the part before the brand — keep it under 41 characters.
   * The homepage sets `absoluteTitle` instead, because Next applies the
   * template to child segments only.
   */
  title?: string;
  absoluteTitle?: string;
  description: string;
  /**
   * Social cards are read in a feed, not scanned in a result list, so they get
   * to be a sentence rather than a keyword string. Falls back to the SEO title.
   */
  ogTitle?: string;
  ogDescription?: string;
  /** Alt text for the generated card. Real description, never the page title. */
  ogImageAlt: string;
  /** Label in the breadcrumb trail and in `BreadcrumbList` JSON-LD. */
  breadcrumb: string;
  /** Drives which schema.org page type wraps the route. */
  schemaType: PageSchemaType;
  /**
   * ISO date this route's content last genuinely changed.
   *
   * The one sitemap field Google actually uses — and only while it stays
   * honest. Stamping every route with the build date, which is the default
   * most Next sitemaps ship with, tells Google the whole site changes on
   * every deploy; it responds by ignoring `lastmod` here permanently.
   * Bump a row when its copy changes. Not when the CSS does.
   */
  lastModified: string;
  /**
   * Retained for Bing and for the non-Google crawlers that still read them.
   * Google has ignored both since 2015 — see `docs/seo-launch.md`.
   */
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export const pageSeo: Record<string, PageSeo> = {
  '/': {
    route: '/',
    // 47 chars. Leads with the head term; brand second, because the legacy
    // title ("Ink Your Vision, Print Your Success") carried no keyword at all.
    absoluteTitle: 'Printing Services in Chennai | Thoorigai Prints',
    // 148 chars.
    description:
      'Digital and offset printing, packaging and binding, produced under one roof in Royapettah, Chennai since 2017. Proofed before press. Request a quote.',
    ogTitle: 'Thoorigai Prints — a printing house, not a print shop',
    ogDescription:
      'Printing, packaging and binding under one roof in Royapettah, Chennai. Digital for the deadline, offset when the quantity earns it.',
    ogImageAlt:
      'A board-on-board hard case binding photographed square-on, beside the Thoorigai Prints wordmark',
    breadcrumb: 'Home',
    lastModified: '2026-08-21',
    schemaType: 'WebPage',
    priority: 1,
    changeFrequency: 'weekly',
  },

  '/services': {
    route: '/services',
    // 34 + 19 = 53 chars with the brand template applied.
    title: 'Digital & Offset Printing Services',
    // 147 chars.
    description:
      'Digital printing for short runs, offset for long ones, plus packaging, binding, prepress and scanning — six disciplines run in one Chennai building.',
    ogTitle: 'Six printing disciplines, one building',
    ogDescription:
      'Digital and offset presses, packaging, binding, prepress and scanning — so a job never waits on a third party and never gets lost between them.',
    ogImageAlt: 'A digital press laying down full-colour sheets on the Thoorigai Prints floor',
    breadcrumb: 'Services',
    lastModified: '2026-08-21',
    schemaType: 'CollectionPage',
    // Above /products because process terms ("offset printing") carry more
    // commercial intent for this studio than format terms do.
    priority: 0.9,
    changeFrequency: 'monthly',
  },

  '/products': {
    route: '/products',
    // 33 + 19 = 52 chars.
    title: 'Business Cards, Brochures & Boxes',
    // 149 chars.
    description:
      'Business cards, brochures, books, rigid and carton boxes, paper bags, certificates and labels — printed and finished to your specification in Chennai.',
    ogTitle: 'What comes off the press',
    ogDescription:
      'Business cards, brochures, books, rigid boxes, paper bags and certificates — every format made to your dimensions, stock and finish.',
    ogImageAlt:
      'A dozen printed carton, rigid box and paper bag formats arranged together',
    breadcrumb: 'Products',
    lastModified: '2026-08-21',
    schemaType: 'CollectionPage',
    priority: 0.9,
    changeFrequency: 'monthly',
  },

  '/portfolio': {
    route: '/portfolio',
    // 30 + 19 = 49 chars.
    title: 'Printing & Packaging Portfolio',
    // 152 chars.
    description:
      'Selected printing, packaging and binding work from our Chennai floor, photographed as delivered — with the stock, process and finish noted on every piece.',
    ogTitle: 'Work, as it left the building',
    ogDescription:
      'Photographed as delivered — no renders, no mock-ups. Each entry notes the process, the stock and the finish.',
    ogImageAlt:
      'Four rigid box constructions photographed as delivered — drawer, sleeve, perforated and patterned',
    breadcrumb: 'Portfolio',
    lastModified: '2026-08-21',
    schemaType: 'CollectionPage',
    // Evidence rather than entry point: it closes a decision more often than
    // it starts one, so it sits below the two capability hubs.
    priority: 0.8,
    changeFrequency: 'monthly',
  },

  '/about': {
    route: '/about',
    // 32 + 19 = 51 chars.
    title: 'About Our Chennai Printing Press',
    // 144 chars.
    description:
      'Thoorigai Prints has printed, finished and bound from Royapettah, Chennai since 2017 — every stage under one roof, nothing sent to a third party.',
    ogTitle: 'Chennai, since 2017',
    ogDescription:
      'A press floor in Royapettah that prints, finishes and binds without sending a single stage somewhere else.',
    ogImageAlt: 'The Thoorigai Prints press floor in Royapettah, Chennai',
    breadcrumb: 'About',
    lastModified: '2026-08-21',
    schemaType: 'AboutPage',
    priority: 0.7,
    changeFrequency: 'yearly',
  },

  '/contact': {
    route: '/contact',
    // 31 + 19 = 50 chars.
    title: 'Get a Printing Quote in Chennai',
    // 138 chars.
    description:
      'Request a printing, packaging or binding quote from our Royapettah studio. Send the format, quantity and date — by form, phone or WhatsApp.',
    ogTitle: 'Tell us what you need printed',
    ogDescription:
      'Send the format, the quantity and the date you need it by. You will get a real answer — including when we are not the right press for the job.',
    ogImageAlt:
      'The Thoorigai Prints studio entrance on Nayar Vardha Pillai Street, Royapettah',
    breadcrumb: 'Contact',
    lastModified: '2026-08-21',
    schemaType: 'ContactPage',
    // High, despite being last in the nav: it is the conversion page, and the
    // legacy site published its quote form only inside a popup no crawler saw.
    priority: 0.9,
    changeFrequency: 'yearly',
  },

  '/faq': {
    route: '/faq',
    // 28 + 19 = 47 chars.
    title: 'Printing Questions, Answered',
    // 150 chars.
    description:
      'Turnarounds, minimum quantities, binding formats, artwork checks and studio visits — the questions Chennai print buyers ask us most, answered plainly.',
    ogTitle: 'The questions we get asked most',
    ogDescription:
      'Digital or offset, how fast, what sizes, what happens when the design changes — answered in the studio’s own words, with nothing invented.',
    ogImageAlt:
      'A press sheet being checked against its proof on the Thoorigai Prints floor',
    breadcrumb: 'FAQ',
    lastModified: '2026-08-21',
    schemaType: 'FAQPage',
    // Below the capability hubs: it converts a visitor who is already
    // considering, rather than attracting one who is not.
    priority: 0.6,
    changeFrequency: 'monthly',
  },

  /* ---------------------------------------------------------------------
   * Legal
   *
   * These three exist because the footer links to all three and two of them
   * are destinations for legacy WordPress redirects (`/terms-conditions` and
   * `/cookie-policy` in `./redirects`). Before this they were the only 404s a
   * visitor could reach from a link the site itself drew.
   *
   * They are deliberately absent from `seoRoutes`, so they carry a reviewed
   * title and description but no sitemap row — a boilerplate policy page has
   * nothing to rank for, and padding the sitemap with pages that cannot rank
   * is the exact failure `app/sitemap.ts` was written to avoid. They stay
   * indexable, because a policy nobody can find is not a published policy.
   * ------------------------------------------------------------------- */

  '/privacy': {
    route: '/privacy',
    // 14 + 19 = 33 chars.
    title: 'Privacy Policy',
    // 146 chars.
    description:
      'What Thoorigai Prints collects when you send an enquiry, why we hold it, how long we keep it, and how to ask us to correct or delete your details.',
    ogImageAlt: 'The Thoorigai Prints wordmark on uncoated paper stock',
    breadcrumb: 'Privacy',
    lastModified: '2026-08-21',
    schemaType: 'WebPage',
    priority: 0.2,
    changeFrequency: 'yearly',
  },

  '/terms': {
    route: '/terms',
    // 18 + 19 = 37 chars.
    title: 'Terms & Conditions',
    // 152 chars.
    description:
      'The terms Thoorigai Prints works to: quotations, artwork approval, proofs and colour, quantity tolerance, delivery, payment and liability on print jobs.',
    ogImageAlt: 'A signed press proof beside the sheet it was checked against',
    breadcrumb: 'Terms',
    lastModified: '2026-08-21',
    schemaType: 'WebPage',
    priority: 0.2,
    changeFrequency: 'yearly',
  },

  '/cookies': {
    route: '/cookies',
    // 13 + 19 = 32 chars.
    title: 'Cookie Policy',
    // 146 chars.
    description:
      'Which cookies and browser storage thoorigaiprints.com uses, what each one is for, and how to clear them. There is no advertising or tracking here.',
    ogImageAlt: 'The Thoorigai Prints wordmark on uncoated paper stock',
    breadcrumb: 'Cookies',
    lastModified: '2026-08-21',
    schemaType: 'WebPage',
    priority: 0.2,
    changeFrequency: 'yearly',
  },
};

/**
 * Route order for the sitemap and the breadcrumb trail.
 *
 * The three legal routes are recorded above but deliberately not listed here —
 * see the note beside them.
 */
export const seoRoutes = [
  '/',
  '/services',
  '/products',
  '/portfolio',
  '/about',
  '/faq',
  '/contact',
];

/**
 * The signage scaffold.
 *
 * `false` keeps every sign board reference out of the build — no title, no
 * description, no `Service` node, no sitemap row. See `./keywords` for what has
 * to be confirmed before this may flip.
 */
export const signage = {
  published: false,
  route: '/services#sign-boards',
  name: 'Sign boards',
} as const;

/** Look up a route, failing loudly rather than silently emitting a bare title. */
export function seoFor(route: string): PageSeo {
  const entry = pageSeo[route];
  if (!entry) {
    throw new Error(
      `No SEO record for "${route}". Add one to src/lib/seo/pages.ts — a route ` +
        'without a title and description should never reach production.',
    );
  }
  return entry;
}

/** Verified keywords a route owns. Re-exported so pages import from one place. */
export function keywordsForRoute(route: string): string[] {
  return keywordsFor(route);
}

/* ---------------------------------------------------------------------------
 * Build-time guards
 * ------------------------------------------------------------------------- */

export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;
/** ' — Thoorigai Prints', applied by the title template in `layout.tsx`. */
export const BRAND_SUFFIX_LENGTH = 19;

/**
 * Catch a title or description that has drifted out of budget, or two pages
 * that have ended up sharing one. Duplicate descriptions were the single most
 * common finding in the audit of the old site — every page had none at all,
 * which is the same problem wearing a different hat.
 */
export function assertLengths(): string[] {
  const problems: string[] = [];
  const descriptions = new Map<string, string>();

  for (const entry of Object.values(pageSeo)) {
    const rendered = entry.absoluteTitle ?? `${entry.title} — Thoorigai Prints`;
    const length = entry.absoluteTitle
      ? entry.absoluteTitle.length
      : (entry.title?.length ?? 0) + BRAND_SUFFIX_LENGTH;

    if (length > TITLE_MAX) {
      problems.push(`${entry.route}: title is ${length} chars (max ${TITLE_MAX}) — "${rendered}"`);
    }
    if (entry.description.length > DESCRIPTION_MAX) {
      problems.push(
        `${entry.route}: description is ${entry.description.length} chars (max ${DESCRIPTION_MAX})`,
      );
    }
    if (entry.description.length < DESCRIPTION_MIN) {
      problems.push(
        `${entry.route}: description is ${entry.description.length} chars (min ${DESCRIPTION_MIN}) — ` +
          'short descriptions get rewritten by Google',
      );
    }

    const duplicate = descriptions.get(entry.description);
    if (duplicate) {
      problems.push(`${entry.route} and ${duplicate} share a meta description`);
    } else {
      descriptions.set(entry.description, entry.route);
    }
  }

  return problems;
}
