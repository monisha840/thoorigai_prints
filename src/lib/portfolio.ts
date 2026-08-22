import { images, type WorkImage } from './images';

/**
 * Portfolio content.
 *
 * Two deliberately separate sets, because they make different claims:
 *
 * - `projects` — work this press actually produced for a paying customer. The
 *   audit found exactly eight such images in the library, and these are they.
 *   Evidence, so it gets a case-study treatment: process, stock, finish, run.
 * - `gallery` — formats and finishes the floor can produce. Illustration, not
 *   evidence, so nothing here is captioned as a named job.
 *
 * Collapsing the two would be the easy move and the wrong one. A prospect who
 * recognises a stock template presented as your work stops believing the rest
 * of the page, which is the whole reason a portfolio exists.
 */

export type ProjectCategory = 'packaging' | 'binding' | 'stationery' | 'institutional';

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  /** Editorial index — drives the "01 / 08" numbering. */
  title: string;
  category: ProjectCategory;
  /**
   * Sector the job was for, shown in place of a trading name.
   *
   * `docs/image-usage-guide.md` flags four of these files as named client work
   * requiring **written permission before the client name is published**. Until
   * that permission is on file, the sector is what ships. `namedClient` holds
   * the real name so switching over is a one-field edit, not a re-write — it is
   * never rendered while `clientCleared` is false.
   */
  sector: string;
  namedClient?: string;
  clientCleared: boolean;
  year: string;
  summary: string;
  specs: ProjectSpec[];
  image: WorkImage;
}

export const projects: Project[] = [
  {
    id: 'broadcast-folders',
    title: 'Certificate folders for a state broadcast intake',
    category: 'institutional',
    sector: 'Public broadcasting',
    namedClient: 'Prasar Bharati / All India Radio, Madurai',
    clientCleared: false,
    year: '2025',
    summary:
      'Cream folders with a printed crest, cased and creased to hold an A4 certificate without curling. Collated and numbered before dispatch.',
    specs: [
      { label: 'Process', value: 'Offset, 2 colour' },
      { label: 'Stock', value: '300gsm board, matt' },
      { label: 'Finish', value: 'Creased and cased' },
    ],
    image: images.institutionalFolders,
  },
  {
    id: 'omr-sheets',
    title: 'OMR answer sheets for an examination cycle',
    category: 'institutional',
    sector: 'Education',
    clientCleared: true,
    year: '2025',
    summary:
      'Registration marks held to scanner tolerance across the full run. Printed, guillotined and banded in counted bundles for invigilator handover.',
    specs: [
      { label: 'Process', value: 'Offset, mono' },
      { label: 'Stock', value: '80gsm bond' },
      { label: 'Control', value: 'Scanner-tolerance marks' },
    ],
    image: images.omrAnswerSheets,
  },
  {
    id: 'rigid-box-tray',
    title: 'Rigid presentation box with a die-cut insert',
    category: 'packaging',
    sector: 'Health and wellness',
    namedClient: 'ActiveSURE',
    clientCleared: false,
    year: '2024',
    summary:
      'Lift-off lid wrapped in printed paper over greyboard, with an insert tray cut to hold the product upright through transit.',
    specs: [
      { label: 'Construction', value: 'Lid and base, rigid' },
      { label: 'Board', value: '2mm greyboard' },
      { label: 'Insert', value: 'Die-cut tray' },
    ],
    image: images.rigidBoxInsertTray,
  },
  {
    id: 'rigid-box-range',
    title: 'A four-construction rigid box range',
    category: 'packaging',
    sector: 'Retail',
    clientCleared: true,
    year: '2024',
    summary:
      'Drawer, sleeve, perforated and patterned builds developed as one family so a growing product line keeps a single shelf language.',
    specs: [
      { label: 'Constructions', value: 'Four, one family' },
      { label: 'Wrap', value: 'Printed, soft-touch' },
      { label: 'Closure', value: 'Drawer and sleeve' },
    ],
    image: images.rigidBoxConstructions,
  },
  {
    id: 'kraft-retail-boxes',
    title: 'Kraft gift boxes with printed belly bands',
    category: 'packaging',
    sector: 'Lifestyle retail',
    namedClient: 'LADORN U',
    clientCleared: false,
    year: '2024',
    summary:
      'Uncoated kraft board left deliberately bare, with the whole identity carried on a separate printed band that can change per season without a new box tool.',
    specs: [
      { label: 'Board', value: 'Uncoated kraft' },
      { label: 'Band', value: 'Printed, separate run' },
      { label: 'Benefit', value: 'Reprint band only' },
    ],
    image: images.kraftBoxes,
  },
  {
    id: 'patterned-shoe-box',
    title: 'Patterned shoe box for a retail rollout',
    category: 'packaging',
    sector: 'Footwear retail',
    clientCleared: true,
    year: '2024',
    summary:
      'All-over pattern printed to the bleed and registered across lid and base, so the artwork runs unbroken when the box is closed on the shelf.',
    specs: [
      { label: 'Process', value: 'Offset, 4 colour' },
      { label: 'Coverage', value: 'Full bleed, both parts' },
      { label: 'Register', value: 'Lid to base' },
    ],
    image: images.patternedShoeBox,
  },
  {
    id: 'spot-finish-cards',
    title: 'Business cards with a metallic spot finish',
    category: 'stationery',
    sector: 'Metals and manufacturing',
    namedClient: 'H K Nath Metals',
    clientCleared: false,
    year: '2023',
    summary:
      'A metallic spot laid over a dark uncoated stock, so the mark catches light at an angle and disappears flat on. Duplexed to weight.',
    specs: [
      { label: 'Stock', value: 'Dark uncoated, duplexed' },
      { label: 'Finish', value: 'Metallic spot' },
      { label: 'Edges', value: 'Guillotined square' },
    ],
    image: images.spotFinishCards,
  },
  {
    id: 'foiled-invitation',
    title: 'Foiled invitation suite with matching envelope',
    category: 'stationery',
    sector: 'Weddings and events',
    clientCleared: true,
    year: '2023',
    summary:
      'Gold foil blocked over a saturated red, with the envelope printed from the same make-ready so the two never drift apart in tone.',
    specs: [
      { label: 'Finish', value: 'Gold foil block' },
      { label: 'Ground', value: 'Saturated red, offset' },
      { label: 'Set', value: 'Card and envelope' },
    ],
    image: images.foiledInvitation,
  },
];

/* ---------------------------------------------------------------------------
 * Filters
 * ------------------------------------------------------------------------- */

export type FilterId = ProjectCategory | 'all';

export interface CategoryFilter {
  id: FilterId;
  label: string;
  /** One line of context under the grid while this filter is active. */
  note: string;
  count: number;
}

export function countFor(id: FilterId): number {
  return id === 'all' ? projects.length : projects.filter((p) => p.category === id).length;
}

const filterMeta: Record<FilterId, { label: string; note: string }> = {
  all: {
    label: 'All work',
    note: 'Every job below was produced on our floor and photographed as delivered.',
  },
  packaging: {
    label: 'Packaging',
    note: 'Rigid boxes, cartons and kraft builds - structure first, print second.',
  },
  stationery: {
    label: 'Stationery',
    note: 'Cards, invitations and identity pieces where the finish carries the job.',
  },
  institutional: {
    label: 'Institutional',
    note: 'Examination and certification work, run to tolerance and counted out.',
  },
  binding: {
    label: 'Binding',
    note: 'Cased, sewn and wire-bound formats.',
  },
};

const FILTER_ORDER: FilterId[] = ['all', 'packaging', 'stationery', 'institutional', 'binding'];

/**
 * Counts are derived and empty categories are dropped entirely.
 *
 * `binding` has metadata but no projects — every bound piece in the library is
 * a format sample rather than an attributable job, so it lives in the gallery.
 * Deriving the list means that chip simply does not render, instead of offering
 * a filter that returns nothing. Add a bound project and it appears on its own.
 */
export const categoryFilters: CategoryFilter[] = FILTER_ORDER.map((id) => ({
  id,
  ...filterMeta[id],
  count: countFor(id),
})).filter((filter) => filter.count > 0);

/* ---------------------------------------------------------------------------
 * Gallery — formats and finishes, not client jobs.
 * ------------------------------------------------------------------------- */

export interface GalleryEntry {
  id: string;
  /** Short caption. This is a format name, never a customer. */
  caption: string;
  /** The technique or material worth noticing. */
  detail: string;
  image: WorkImage;
}

export const gallery: GalleryEntry[] = [
  {
    id: 'board-book-spread',
    caption: 'Board book, open',
    detail: 'Laminated board pages, square cornered',
    image: images.boardBookSpread,
  },
  {
    id: 'carton-formats',
    caption: 'Carton formats',
    detail: 'Twelve die-lines from one board spec',
    image: images.cartonFormats,
  },
  {
    id: 'gold-wiro',
    caption: 'Gold wire-o',
    detail: 'Twin loop, 3:1 pitch',
    image: images.goldWiro,
  },
  {
    id: 'magnetic-box',
    caption: 'Magnetic closure box',
    detail: 'Soft-touch lamination over rigid board',
    image: images.magneticClosureBox,
  },
  {
    id: 'section-sewn',
    caption: 'Section sewn spine',
    detail: 'Thread visible across folded signatures',
    image: images.sectionSewnSpine,
  },
  {
    id: 'paper-bags',
    caption: 'Printed paper bags',
    detail: 'Four sizes, rope handle',
    image: images.paperBags,
  },
  {
    id: 'board-book',
    caption: 'Board book, fanned',
    detail: 'Thick board pages, rounded corners',
    image: images.boardBookFan,
  },
  {
    id: 'telescope-lids',
    caption: 'Telescope lid boxes',
    detail: 'Embossed surface, lid over base',
    image: images.telescopeLidBoxes,
  },
  {
    id: 'greyboard',
    caption: 'Greyboard thicknesses',
    detail: 'Nested to show available calipers',
    image: images.greyboardThickness,
  },
  {
    id: 'pu-leather',
    caption: 'PU leather diaries',
    detail: 'Two-tone, elastic closure',
    image: images.puLeatherDiaries,
  },
  {
    id: 'gift-box',
    caption: 'Gift box with ribbon',
    detail: 'Blind emboss, satin tie',
    image: images.giftBoxRibbon,
  },
  {
    id: 'black-wiro',
    caption: 'Black wire-o',
    detail: 'Punched pitch matched to spine',
    image: images.blackWiro,
  },
  {
    id: 'rounded-hard-case',
    caption: 'Rounded hard case',
    detail: 'Backed and rounded spine',
    image: images.roundedHardCase,
  },
  {
    id: 'disc-bound',
    caption: 'Disc-bound components',
    detail: 'Cover, discs and index tabs',
    image: images.discBoundComponents,
  },
  {
    id: 'box-files',
    caption: 'Box files',
    detail: 'Lever arch, printed spine label',
    image: images.boxFiles,
  },
  {
    id: 'white-wiro',
    caption: 'White wire-o',
    detail: 'Landscape format, punched long edge',
    image: images.whiteWiro,
  },
  {
    id: 'customised-files',
    caption: 'Customised files',
    detail: 'Assorted printed cover finishes',
    image: images.customisedFiles,
  },
  {
    id: 'presentation-stand',
    caption: 'Sample stand',
    detail: 'A-frame, bound stock swatches',
    image: images.presentationStand,
  },
];

/* ---------------------------------------------------------------------------
 * Floor process — the three frames that show the work happening.
 * ------------------------------------------------------------------------- */

export const floorFrames: GalleryEntry[] = [
  {
    id: 'prepress',
    caption: 'Prepress',
    detail: 'Artwork marked up before plates are made',
    image: images.prepressArtwork,
  },
  {
    id: 'on-press',
    caption: 'On press',
    detail: 'Sheet pulled and checked against the proof',
    image: images.pressOperatorCheck,
  },
  {
    id: 'run',
    caption: 'Mid-run',
    detail: 'Colour holding across the stack',
    image: images.syntheticPrints,
  },
];
