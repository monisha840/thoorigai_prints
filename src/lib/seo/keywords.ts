/**
 * Keyword strategy.
 *
 * One file, because the alternative is keywords smeared across six page
 * components where nobody can see that two pages are chasing the same term.
 * Every title, description and H1 on the site traces back to a row here.
 *
 * ## The rule that shapes this file
 *
 * `MASTER_PROJECT_PLAN.md` §12.3 — no invented content. A keyword only earns a
 * row if the studio can actually produce the thing. `docs/content-audit.md` is
 * the evidence: a full crawl of the live site, 24 pages, 155 media records.
 *
 * ## One requested term did not survive that check
 *
 * **Sign boards.** Requested as a target, but absent from the entire business
 * record — no page, no product tile, no image, no mention across 24 crawled
 * pages. It is scaffolded below under `unverified` and deliberately excluded
 * from `targetKeywords`, so nothing it touches reaches a title, a description,
 * a sitemap entry or a `Service` node until the studio confirms the capability.
 * Publishing it is a small, reviewable edit — see `docs/seo-launch.md`.
 */

export type KeywordTier =
  /** The term the page is built to win. One per page, never shared. */
  | 'primary'
  /** Supporting terms the same page carries without competing for its primary. */
  | 'secondary'
  /** Long-tail and local variants. Live in body copy, not in the title. */
  | 'longtail';

export interface Keyword {
  term: string;
  tier: KeywordTier;
  /** The single route that owns this term. Two rows may not share a primary. */
  owner: string;
  /** Where in the crawl this capability is evidenced. */
  evidence: string;
}

/* ---------------------------------------------------------------------------
 * Verified targets — every one traceable to the audit
 * ------------------------------------------------------------------------- */

export const targetKeywords: Keyword[] = [
  /* Head term. Owned by the homepage so the six routes do not compete for it. */
  {
    term: 'printing services in Chennai',
    tier: 'primary',
    owner: '/',
    evidence: 'audit: /printing/ - "All types of Customised Personalised Printing"',
  },
  {
    term: 'printing press Chennai',
    tier: 'secondary',
    owner: '/',
    evidence: 'audit: /about-us/',
  },
  {
    term: 'printing company Royapettah',
    tier: 'longtail',
    owner: '/',
    evidence: 'audit: NAP block',
  },
  {
    term: 'custom printing Chennai',
    tier: 'longtail',
    owner: '/',
    evidence: 'audit: homepage H1 "Customised Personalised Printing"',
  },

  /* Process terms. Owned by /services — the page that explains how each runs. */
  {
    term: 'digital printing',
    tier: 'primary',
    owner: '/services',
    evidence: 'audit: /digital-multicolour/, /digital-black-and-white/',
  },
  {
    term: 'offset printing',
    tier: 'primary',
    owner: '/services',
    evidence: 'audit: /offset-multicolour/, /offset-black-and-white/',
  },
  {
    term: 'digital printing services Chennai',
    tier: 'secondary',
    owner: '/services',
    evidence: 'audit: /digital-multicolour/',
  },
  {
    term: 'offset printing services Chennai',
    tier: 'secondary',
    owner: '/services',
    evidence: 'audit: /offset-multicolour/',
  },
  {
    term: 'multicolour printing Chennai',
    tier: 'longtail',
    owner: '/services',
    evidence: 'audit: H2 "Multi Colour - Offset & Digital"',
  },
  {
    term: 'black and white printing Chennai',
    tier: 'longtail',
    owner: '/services',
    evidence: 'audit: /digital-black-and-white/',
  },
  {
    term: 'print on demand Chennai',
    tier: 'longtail',
    owner: '/services',
    evidence: 'audit: H4 "Print On Demand"',
  },

  /* Format terms. Owned by /products — the page that lists what comes off press. */
  {
    term: 'business cards',
    tier: 'primary',
    owner: '/products',
    evidence: 'audit: homepage H4 "Business Cards", twice',
  },
  {
    term: 'brochures',
    tier: 'primary',
    owner: '/products',
    evidence: 'audit: homepage H4 "Brochure", twice',
  },
  {
    term: 'business card printing Chennai',
    tier: 'secondary',
    owner: '/products',
    evidence: 'audit: homepage H4',
  },
  {
    term: 'brochure printing Chennai',
    tier: 'secondary',
    owner: '/products',
    evidence: 'audit: homepage H4',
  },
  {
    term: 'rigid box manufacturer Chennai',
    tier: 'secondary',
    owner: '/products',
    evidence: 'audit: H2 "Rigid Boxes" plus six construction H4s',
  },
  {
    term: 'paper bag printing Chennai',
    tier: 'longtail',
    owner: '/products',
    evidence: 'audit: /paper-bag/',
  },
  {
    term: 'corrugation box Chennai',
    tier: 'longtail',
    owner: '/products',
    evidence: 'audit: /corrugation-box/',
  },
  {
    term: 'carton box printing Chennai',
    tier: 'longtail',
    owner: '/products',
    evidence: 'audit: /carton-box/',
  },
  {
    term: 'certificate printing Chennai',
    tier: 'longtail',
    owner: '/products',
    evidence: 'audit: H4 "Certificates"',
  },
  {
    term: 'hard case binding Chennai',
    tier: 'longtail',
    owner: '/products',
    evidence: 'audit: /hard-case-binding/',
  },

  /* Evidence and trust routes. Lower volume, higher intent. */
  {
    term: 'printing work samples Chennai',
    tier: 'primary',
    owner: '/portfolio',
    evidence: 'audit: eight genuine client images in the media library',
  },
  {
    term: 'packaging portfolio Chennai',
    tier: 'secondary',
    owner: '/portfolio',
    evidence: 'audit: rigid box and carton imagery',
  },
  {
    term: 'printing press in Royapettah',
    tier: 'primary',
    owner: '/about',
    evidence: 'audit: NAP block, /about-us/',
  },
  {
    term: 'printing company since 2017',
    tier: 'longtail',
    owner: '/about',
    evidence: 'MASTER_PROJECT_PLAN §0.3',
  },
  {
    term: 'printing quote Chennai',
    tier: 'primary',
    owner: '/contact',
    evidence: 'audit: "Request Callback" CTA and quote popup',
  },
  {
    term: 'printing press near me Chennai',
    tier: 'secondary',
    owner: '/contact',
    evidence: 'audit: NAP block',
  },
];

/* ---------------------------------------------------------------------------
 * Scaffolded but NOT published
 * ------------------------------------------------------------------------- */

export interface UnverifiedKeyword {
  term: string;
  tier: KeywordTier;
  owner: string;
  /** What has to be true before this may move into `targetKeywords`. */
  blockedOn: string;
}

/**
 * Requested targets with no capability behind them.
 *
 * Kept here rather than deleted so the intent is not lost, and so promoting one
 * is an obvious, reviewable edit. Nothing reads this array at build time — it
 * reaches no title, no description, no sitemap entry and no JSON-LD node.
 *
 * To publish: confirm the capability, add the service to the content model with
 * real photography and copy, move the rows into `targetKeywords` with a real
 * `evidence` string, and flip `signage.published` in `./pages`.
 */
export const unverified: UnverifiedKeyword[] = [
  {
    term: 'sign boards',
    tier: 'primary',
    owner: '/services',
    blockedOn:
      'No evidence the studio produces signage. Absent from all 24 crawled pages, ' +
      'from the 155-record media library, and from the content model.',
  },
  {
    term: 'sign board makers Chennai',
    tier: 'secondary',
    owner: '/services',
    blockedOn: 'As above - capability unconfirmed.',
  },
  {
    term: 'acrylic and flex sign boards',
    tier: 'longtail',
    owner: '/services',
    blockedOn: 'Substrate range unknown; signage is not an established capability.',
  },
];

/* ---------------------------------------------------------------------------
 * Lookups
 * ------------------------------------------------------------------------- */

const TIER_ORDER: Record<KeywordTier, number> = { primary: 0, secondary: 1, longtail: 2 };

/** Every verified term a route owns, primary first. Feeds the `keywords` meta tag. */
export function keywordsFor(route: string): string[] {
  return targetKeywords
    .filter((k) => k.owner === route)
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])
    .map((k) => k.term);
}

/** The terms a route is built to win. */
export function primaryKeywords(route: string): string[] {
  return targetKeywords.filter((k) => k.owner === route && k.tier === 'primary').map((k) => k.term);
}

/**
 * Guard against the failure this file exists to prevent: two routes chasing the
 * same primary term, so neither ranks. Returns a list of clashes, empty when
 * the map is clean.
 *
 * Called from `app/sitemap.ts`, which throws on a non-empty result — so this
 * runs on every `next build` and a clash fails the deploy rather than quietly
 * shipping two pages that compete.
 */
export function findCannibalisation(): string[] {
  const seen = new Map<string, string>();
  const clashes: string[] = [];

  for (const k of targetKeywords) {
    if (k.tier !== 'primary') continue;
    const existing = seen.get(k.term);
    if (existing && existing !== k.owner) {
      clashes.push(`"${k.term}" is primary on both ${existing} and ${k.owner}`);
    } else {
      seen.set(k.term, k.owner);
    }
  }

  return clashes;
}
