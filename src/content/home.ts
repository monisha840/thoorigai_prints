/**
 * Homepage content — extracted from the live site, not invented.
 *
 * Every string here traces back to `docs/content-audit.md` (crawled 21 Aug 2026)
 * or to `MASTER_PROJECT_PLAN.md §0.3`, which locks the facts that were
 * contradictory across the source documents. Light edits for tone and sentence
 * case are in scope; substance is not.
 *
 * The rule this file exists to enforce (MASTER_PROJECT_PLAN.md §12.3, "no
 * invented content"): nothing renders on the homepage that the business cannot
 * stand behind. Where real content does not exist yet — client quotes, client
 * logos, verified turnaround figures — the array is empty and the section that
 * consumes it renders nothing.
 */

export interface HomeImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/* -------------------------------------------------------------------------
 * Hero
 * ---------------------------------------------------------------------- */

export const hero = {
  eyebrow: 'Royapettah, Chennai · since 2017',
  /**
   * One H1, naming all three disciplines and the city.
   * Replaces the two competing H1s on the live homepage
   * ("We do Micro Text Variable Data Printing" / "All types of Customised
   * Personalised Printing available"), neither of which named Chennai.
   */
  headline: ['Printing, packaging', 'and binding —', 'under one roof.'],
  /** 26 words. Every fact is from the audit. */
  standfirst:
    'Digital and offset printing, rigid-box packaging and hard-case binding, produced in Royapettah since 2017 — proofed before press and finished in the same building.',
  image: {
    src: '/img/hero/hard-case-board-binding.jpg',
    alt: 'A board-on-board hard case binding, photographed square-on against white',
    width: 2447,
    height: 2447,
  } satisfies HomeImage,
} as const;

/**
 * Credibility strip. Four facts, every one verifiable from the audit —
 * replacing the invented `studioStats` in `lib/site.ts` (`1,200+ jobs`,
 * `48hr turnaround`), which must not ship.
 */
export const credibility = [
  { figure: '2017', label: 'Founded in Chennai' },
  { figure: '15+', label: "Years of the founder's experience" },
  { figure: '3', label: 'Disciplines under one roof' },
  { figure: '43', label: 'Products in the catalogue' },
] as const;

/* -------------------------------------------------------------------------
 * Services — the three pillars, exactly as the live navigation groups them
 *
 * ## On the `href`s below, and in `featuredProducts`
 *
 * Every one of these eleven links used to point at a **legacy WordPress path**
 * — `/printing`, `/packaging`, `/binding` and fragments of them. Those paths
 * are in `lib/seo/redirects.ts` precisely because they no longer exist, so each
 * card was sending a visitor through a 308 to a page that could not answer it:
 * a fragment is carried across a redirect only when the destination has none of
 * its own, so `/printing#books` arrived at `/services#books` — an anchor that
 * has never existed on a page that does not list books.
 *
 * Eleven of the homepage's most-clicked elements, every one landing at the top
 * of the wrong page. The redirects stay, for links that escaped into the world
 * on the old site; the site itself now links at the destination directly.
 *
 * Pillars go to the discipline on `/services`. Formats go to their tile on
 * `/products`, which carries a matching `id` per tile. Wiro and hard case are
 * binding formats rather than catalogue rows, so both land on the binding
 * section of `/services` — the page that actually describes them.
 * ---------------------------------------------------------------------- */

export interface Pillar {
  name: string;
  href: string;
  /** The decision this pillar actually involves. */
  lead: string;
  /** Real capability labels, taken from the live H2/H4 headings. */
  covers: readonly string[];
  image: HomeImage;
}

export const pillars: readonly Pillar[] = [
  {
    name: 'Printing',
    href: '/services#digital',
    lead: 'Offset when the quantity earns it, digital when the deadline does. Multicolour and black-and-white on both.',
    covers: ['Offset multicolour', 'Digital multicolour', 'Black & white', 'Print on demand'],
    image: {
      src: '/img/pillars/printing-digital-press.webp',
      alt: 'A digital press laying down full-colour sheets',
      width: 1000,
      height: 572,
    },
  },
  {
    name: 'Packaging',
    href: '/services#packaging',
    lead: 'Rigid boxes, cartons, corrugated outers and paper bags — structured, printed and finished to the product.',
    covers: ['Rigid boxes', 'Carton boxes', 'Corrugated', 'Paper bags'],
    image: {
      src: '/img/pillars/packaging-carton-range.webp',
      alt: 'A dozen printed carton and corrugated formats arranged together',
      width: 1363,
      height: 707,
    },
  },
  {
    name: 'Binding',
    href: '/services#binding',
    lead: 'Hard case, perfect, wiro and centre pin. Chosen by page count, durability and the life the job has to lead.',
    covers: ['Hard case', 'Perfect binding', 'Wiro', 'Board books'],
    image: {
      src: '/img/pillars/binding-board-book.webp',
      alt: 'A fanned stack of multi-coloured board books showing the bound edges',
      width: 800,
      height: 521,
    },
  },
] as const;

/* -------------------------------------------------------------------------
 * Featured products — 8 of the 43 catalogue items
 *
 * Names are the live H4 tile labels. Descriptions are new copy, written from
 * the capability list the audit recorded (Telescope Lids · Drawer Style ·
 * Hinged Lids · Magnetic Boxes · PU Leather · Rexin · Magnetic Lock · Board
 * Books · Leather Menus · Bill Pouch, and the rest). No specification is
 * quoted that the audit did not establish — MOQ, turnaround and stock live on
 * the capability pages, where they can be stated properly.
 * ---------------------------------------------------------------------- */

export interface CatalogueItem {
  name: string;
  pillar: 'Printing' | 'Packaging' | 'Binding';
  href: string;
  description: string;
  image: HomeImage;
}

export const featuredProducts: readonly CatalogueItem[] = [
  {
    name: 'Books',
    pillar: 'Printing',
    href: '/products#books',
    description: 'Case-bound, perfect-bound and centre-pinned, from a single proof copy to a full run.',
    image: {
      src: '/img/catalogue/books.webp',
      alt: 'Printed hardback and paperback books stacked and fanned',
      width: 800,
      height: 531,
    },
  },
  {
    name: 'Brochures',
    pillar: 'Printing',
    href: '/products#brochures',
    description: 'Folded, saddle-stitched or perfect-bound, on coated and uncoated stock.',
    image: {
      src: '/img/catalogue/brochures.webp',
      alt: 'An open multi-page brochure laid flat',
      width: 1000,
      height: 546,
    },
  },
  {
    name: 'Business cards',
    pillar: 'Printing',
    href: '/products#stationery',
    description: 'Offset and digital, with foil, spot UV and metallic line treatments.',
    image: {
      src: '/img/catalogue/business-cards.webp',
      alt: 'A stack of printed business cards with one card face up',
      width: 800,
      height: 800,
    },
  },
  {
    name: 'Certificates',
    pillar: 'Printing',
    href: '/products#certificates',
    description: 'Foiled and embossed, with matching convocation folders and presentation covers.',
    image: {
      src: '/img/catalogue/certificates.webp',
      alt: 'A printed certificate with a foiled border and seal',
      width: 1000,
      height: 615,
    },
  },
  {
    name: 'Rigid boxes',
    pillar: 'Packaging',
    href: '/products#boxes',
    description: 'Telescope lids, drawer style, hinged lids and magnetic closures, wrapped and lined.',
    image: {
      src: '/img/catalogue/rigid-boxes.webp',
      alt: 'Four rigid box constructions — drawer, sleeve, perforated and patterned',
      width: 980,
      height: 799,
    },
  },
  {
    name: 'Paper bags',
    pillar: 'Packaging',
    href: '/products#bags',
    description: 'Kraft and coated, rope or flat handle, printed and laminated to size.',
    image: {
      src: '/img/catalogue/paper-bags.webp',
      alt: 'Printed kraft paper bags with rope handles in four sizes',
      width: 800,
      height: 800,
    },
  },
  {
    name: 'Wiro binding',
    pillar: 'Binding',
    href: '/services#binding',
    description: 'Gold, black and white loops. Lay-flat, for calendars, diaries and manuals.',
    image: {
      src: '/img/catalogue/wiro-binding.webp',
      alt: 'A wiro-bound book opened flat, showing the metal loops through the spine',
      width: 900,
      height: 576,
    },
  },
  {
    name: 'Diaries & files',
    pillar: 'Binding',
    href: '/services#binding',
    description: 'PU leather and rexin covers with magnetic locks, card pockets and rounded corners.',
    image: {
      src: '/img/catalogue/pu-leather-diaries.webp',
      alt: 'A two-tone PU leather diary photographed closed against white',
      width: 800,
      height: 600,
    },
  },
] as const;

/* -------------------------------------------------------------------------
 * Portfolio — the four genuinely delivered jobs in the image library
 *
 * LEGAL GATE (MASTER_PROJECT_PLAN.md §8.7): these are real, named client jobs —
 * Prasar Bharati / All India Radio Madurai, ActiveSURE, LADORN U and
 * H K Nath Metals. Written permission has NOT been obtained, so `client` is
 * null and the card renders the sector instead. Populate `client` only once
 * permission is on file.
 *
 * RESOLUTION GATE (§8.5): three of these four files are under 700px. They are
 * capped at grid-tile size here and must never be given a lightbox, a hero or
 * a detail view until the reshoot lands.
 */

export interface WorkItem {
  /** null until written permission to name the client is on file. */
  client: string | null;
  sector: string;
  job: string;
  detail: string;
  image: HomeImage;
  /** True where the source file is under 700px — tile only, never enlarged. */
  tileOnly: boolean;
}

export const featuredWork: readonly WorkItem[] = [
  {
    client: null,
    sector: 'National broadcaster',
    job: 'Presentation folders',
    detail: 'Printed folders and inserts for a Government of India broadcaster.',
    image: {
      src: '/img/work/broadcaster-convocation-folders.webp',
      alt: 'A printed presentation folder with loose inserts, photographed on black',
      width: 500,
      height: 497,
    },
    tileOnly: true,
  },
  {
    client: null,
    sector: 'Healthcare',
    job: 'Rigid box with insert',
    detail: 'Lidded rigid box with a fitted tray, printed and laminated.',
    image: {
      src: '/img/work/healthcare-rigid-box.jpg',
      alt: 'An open rigid box showing a fitted insert tray inside the lid',
      width: 455,
      height: 330,
    },
    tileOnly: true,
  },
  {
    client: null,
    sector: 'Retail',
    job: 'Kraft boxes & belly bands',
    detail: 'Kraft cartons with printed belly bands for a retail launch.',
    image: {
      src: '/img/work/retail-kraft-boxes.webp',
      alt: 'Kraft cartons wrapped in printed belly bands',
      width: 278,
      height: 330,
    },
    tileOnly: true,
  },
  {
    client: null,
    sector: 'Industrial supply',
    job: 'Business cards, metallic line',
    detail: 'Business cards with a metallic line treatment on a dark stock.',
    image: {
      src: '/img/work/industrial-business-cards.webp',
      alt: 'Business cards with a silver metallic line treatment, on slate',
      width: 800,
      height: 654,
    },
    tileOnly: false,
  },
] as const;

/* -------------------------------------------------------------------------
 * Why choose us — "Our Commitments", verbatim headings, real sentences
 * ---------------------------------------------------------------------- */

export const whyUs = {
  eyebrow: 'Our commitments',
  heading: 'For all levels of business need',
  /** Lightly edited from the live homepage copy. */
  standfirst:
    'Whether you are an individual, a small business, a start-up, an industry or a big brand, there is a custom-tailored solution here for your branding needs.',
  image: {
    src: '/img/hero/studio-range.webp',
    alt: 'Diaries, rigid boxes, calendars, bags and printed covers produced by the studio, staged together',
    width: 800,
    height: 510,
  } satisfies HomeImage,
  /** The four pillars and their real sentences, sentence-cased. */
  commitments: [
    {
      title: 'Leading technology',
      body: 'We use the latest technology to ensure the best quality in record time.',
    },
    {
      title: 'Best designs',
      body: "All custom designs are possible, to suit your brand's uniqueness.",
    },
    {
      title: 'On time delivery',
      body: 'Need immediate branding? We have got your back.',
    },
    {
      title: 'Affordable price',
      body: 'Best price guaranteed for every size of business — small scale to big brands.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------
 * Process
 *
 * The live site has a "Technology We Possess" heading with nothing beneath it
 * and a flattened raster process diagram (`Steps-New-2.webp`). This rebuilds
 * the concept as live text. Deliberately states no turnaround figure: the only
 * real source is the FAQ answer "That depends on the product and quantity",
 * and inventing a number here would be exactly the failure the audit found.
 * ---------------------------------------------------------------------- */

export const processSteps = [
  {
    n: '01',
    title: 'Enquiry',
    body: 'Tell us the format, the quantity and the date you need it by. If you are not sure which process suits the job, that is the conversation.',
  },
  {
    n: '02',
    title: 'Quote & artwork',
    body: 'A written quote against your specification. Send print-ready files, or let our team design it — most of our individual clients do.',
  },
  {
    n: '03',
    title: 'Proof',
    body: 'You see a proof before anything reaches a plate. Design changes at this stage are expected, and we make them as the product allows.',
  },
  {
    n: '04',
    title: 'Press',
    body: 'Digital for short runs, offset when the quantity earns it. Colour is signed off against the approved proof at the start of the run.',
  },
  {
    n: '05',
    title: 'Finish & deliver',
    body: 'Lamination, foiling, die-cutting and binding happen in the same building — so the job never waits on a third party between stages.',
  },
] as const;

/* -------------------------------------------------------------------------
 * Testimonials
 * ---------------------------------------------------------------------- */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * EMPTY ON PURPOSE — and it must stay empty until real, attributable client
 * quotes are collected.
 *
 * All seven testimonial records on the live site are theme demo content: they
 * describe an AI training course, are attributed to invented Western names, and
 * use stock portrait photography (`docs/content-audit.md`, "Testimonials").
 * MASTER_PROJECT_PLAN.md §12.1 makes deleting them Wave 0 task 1 — publishing
 * invented testimonials attributed to named people carries real exposure under
 * India's consumer-protection rules on misleading advertising.
 *
 * Populate this array and the quote grid renders itself. Until then the section
 * carries the founder's own words, which are genuine and attributable.
 */
export const clientTestimonials: readonly Testimonial[] = [];

/** Verbatim from the live About page. The only attributable quote on the site. */
export const founderQuote = {
  quote:
    'We believe printing is more than just ink on paper — it is a powerful tool for communication, branding and impact.',
  name: 'Mr. R. Ambeth',
  role: 'Founder · quality control, then finishing and binding specialist',
} as const;

/** Real answers from the live FAQ, reframed as the objections they remove. */
export const reassurances = [
  {
    title: 'Individuals welcome',
    body: 'Our clients include individuals, small-scale businesses and MSMEs as well as big brands.',
  },
  {
    title: 'Any size, any design',
    body: 'We can do all types of sizes for any design. Ask us and we will tell you what is possible.',
  },
  {
    title: 'Changes are expected',
    body: 'There is no limit to creativity, so changes arise. We make them to suit the client and the product.',
  },
] as const;

/* -------------------------------------------------------------------------
 * Closing CTA — verbatim from the live homepage quote block
 * ---------------------------------------------------------------------- */

export const closingCta = {
  eyebrow: 'Get started',
  heading: 'Ready to take your brand to the next level?',
  body: "Share your details and we will craft a custom quote tailored to your needs. Our team of support specialists are available to speak with you.",
} as const;
