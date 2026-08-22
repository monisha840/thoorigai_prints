/**
 * Thoorigai Prints — image manifest.
 *
 * Every photograph the portfolio renders is declared here once, with its true
 * intrinsic size read from the file header. `next/image` needs exact dimensions
 * to reserve layout space, and hard-coding them at each call site is how they
 * drift.
 *
 * Two things this file exists to fix, both raised in `docs/image-usage-guide.md`:
 *
 * 1. **Alt text.** All 168 extracted images shipped with `alt=""`. Every record
 *    below carries a real description of what is in the frame.
 * 2. **Grounds.** Most of this library was shot on near-white studio sweeps. On
 *    a paper-coloured page a white-ground cut-out dissolves into the background
 *    and the product stops reading as an object. `ground` tells a tile which
 *    matte to sit the image on, so printed work looks placed rather than pasted.
 */

/** How the source image's own background behaves against the page. */
export type ImageGround =
  /** Near-white or light grey studio sweep. Needs a matte to gain an edge. */
  | 'light'
  /** Dark field or dim environment. Sits on ink without a seam. */
  | 'dark'
  /** Carries its own saturated ground or lit environment. Frame, do not matte. */
  | 'colour';

export interface WorkImage {
  src: string;
  /** Intrinsic pixel size, read from the file header — do not guess these. */
  width: number;
  height: number;
  alt: string;
  ground: ImageGround;
}

/**
 * Keyed so content refers to `images.rigidBoxConstructions` rather than a path
 * string — a renamed file then breaks the build instead of the page.
 */
export const images = {
  /* --------------------------------------------------------------------
   * Client work. Photographed output, not illustration.
   * ------------------------------------------------------------------ */

  institutionalFolders: {
    src: '/images/work/institutional-certificate-folders.webp',
    width: 500,
    height: 497,
    alt: 'Cream presentation folders with a printed crest, fanned open on a black field to show the certificates inside.',
    ground: 'dark',
  },
  kraftBoxes: {
    src: '/images/work/kraft-boxes-belly-band.webp',
    width: 278,
    height: 330,
    alt: 'Stacked kraft board gift boxes, each wrapped in a printed belly band.',
    ground: 'light',
  },
  rigidBoxInsertTray: {
    src: '/images/work/rigid-box-insert-tray.jpg',
    width: 455,
    height: 330,
    alt: 'A rigid presentation box with the lid lifted away, showing a die-cut insert tray seated inside.',
    ground: 'light',
  },
  rigidBoxConstructions: {
    src: '/images/work/rigid-box-constructions.webp',
    width: 980,
    height: 799,
    alt: 'Four rigid box constructions side by side - drawer, sleeve, perforated and patterned - on a warm off-white ground.',
    ground: 'light',
  },
  patternedShoeBox: {
    src: '/images/work/patterned-shoe-box.webp',
    width: 800,
    height: 483,
    alt: 'A patterned retail shoe box with its lid set beside it, photographed on a saturated orange ground.',
    ground: 'colour',
  },
  omrAnswerSheets: {
    src: '/images/work/omr-answer-sheets.webp',
    width: 800,
    height: 541,
    alt: 'Printed OMR answer sheets fanned into a wide arc so the bubble grid and registration marks are visible.',
    ground: 'light',
  },
  spotFinishCards: {
    src: '/images/work/spot-finish-business-cards.webp',
    width: 800,
    height: 654,
    alt: 'Business cards with a metallic spot treatment, angled on a slate surface under a raking light.',
    ground: 'dark',
  },
  foiledInvitation: {
    src: '/images/work/foiled-invitation-suite.webp',
    width: 800,
    height: 800,
    alt: 'A red and gold invitation card with a foiled ornament, shown with its matching envelope.',
    ground: 'colour',
  },

  /* --------------------------------------------------------------------
   * Hero and atmosphere.
   * ------------------------------------------------------------------ */

  /**
   * The source file is named `Board-on-board-hard.jpg` and both the inventory
   * and the usage guide describe it as a board-on-board case binding. The
   * photograph is not that: it is a children's board book lying open, and the
   * page text is Portuguese, which makes it very unlikely to be our own job.
   *
   * Captioned for what is actually in the frame, and used as a format sample
   * only — never as client work. It earns its place because at 2447px square it
   * is the one asset that can fill a large plate with no upscaling at all.
   */
  boardBookSpread: {
    src: '/images/work/board-book-spread.jpg',
    width: 2447,
    height: 2447,
    alt: 'A board book lying open on a white sweep, its thick laminated pages standing upright.',
    ground: 'light',
  },
  studioRange: {
    src: '/images/work/studio-product-range.webp',
    width: 800,
    height: 510,
    alt: 'The studio range staged together - diaries, rigid boxes, calendars, printed bags and bound books.',
    ground: 'light',
  },
  magneticClosureBox: {
    src: '/images/work/magnetic-closure-box.webp',
    width: 800,
    height: 534,
    alt: 'A matte black magnetic-closure box lying open on a warm wooden floor.',
    ground: 'dark',
  },
  paperRollPlinths: {
    src: '/images/work/paper-roll-plinths.webp',
    width: 2560,
    height: 1663,
    alt: 'Rolls of cream paper stock arranged on plinths against a deep navy backdrop.',
    ground: 'dark',
  },

  /* --------------------------------------------------------------------
   * Formats and finishes. What the press can do, not who it was for.
   * ------------------------------------------------------------------ */

  cartonFormats: {
    src: '/images/work/carton-formats.webp',
    width: 1363,
    height: 707,
    alt: 'More than a dozen printed carton and corrugated formats grouped in a single frame.',
    ground: 'light',
  },
  giftBoxRibbon: {
    src: '/images/work/gift-box-ribbon.webp',
    width: 800,
    height: 696,
    alt: 'A pastel gift box with an embossed rose motif and a tied ribbon.',
    ground: 'light',
  },
  paperBags: {
    src: '/images/work/printed-paper-bags.webp',
    width: 800,
    height: 800,
    alt: 'Printed kraft paper bags in four sizes, standing with rope handles upright.',
    ground: 'light',
  },
  telescopeLidBoxes: {
    src: '/images/work/telescope-lid-boxes.webp',
    width: 800,
    height: 621,
    alt: 'Two rigid telescope-lid boxes with embossed surface detail, one lid part-lifted.',
    ground: 'light',
  },
  boxFiles: {
    src: '/images/work/box-files.webp',
    width: 850,
    height: 846,
    alt: 'Lever-arch box files with printed spine labels, standing in a row.',
    ground: 'light',
  },
  customisedFiles: {
    src: '/images/work/customised-files.webp',
    width: 800,
    height: 600,
    alt: 'Customised office folders and document files in assorted printed finishes.',
    ground: 'light',
  },
  presentationStand: {
    src: '/images/work/presentation-sample-stand.webp',
    width: 500,
    height: 500,
    alt: 'An A-frame presentation stand holding bound stock samples.',
    ground: 'light',
  },
  boardBookFan: {
    src: '/images/work/board-book-fan.webp',
    width: 800,
    height: 521,
    alt: 'A board book fanned open, showing thick multi-coloured board pages.',
    ground: 'light',
  },
  blackWiro: {
    src: '/images/work/black-wiro-binding.webp',
    width: 900,
    height: 900,
    alt: 'Close-up of black wire-o binding, the twin loops threaded through punched pages.',
    ground: 'light',
  },
  goldWiro: {
    src: '/images/work/gold-wiro-binding.webp',
    width: 850,
    height: 880,
    alt: 'Gold wire-o binding on a bound notebook resting on a warm wooden desk.',
    ground: 'colour',
  },
  sectionSewnSpine: {
    src: '/images/work/section-sewn-spine.webp',
    width: 600,
    height: 600,
    alt: 'An open spine showing sewn signatures, the binding thread running across the folded sections.',
    ground: 'light',
  },
  greyboardThickness: {
    src: '/images/work/greyboard-thickness.webp',
    width: 800,
    height: 534,
    alt: 'Greyboard sheets nested to show the range of available board thicknesses.',
    ground: 'light',
  },
  discBoundComponents: {
    src: '/images/work/disc-bound-components.webp',
    width: 800,
    height: 788,
    alt: 'A flat lay of disc-bound components - cover, binding discs and index tabs laid out separately.',
    ground: 'light',
  },
  puLeatherDiaries: {
    src: '/images/work/pu-leather-diaries.webp',
    width: 800,
    height: 600,
    alt: 'Two-tone PU leather diaries with an elastic closure, stacked one on the other.',
    ground: 'light',
  },
  roundedHardCase: {
    src: '/images/work/rounded-hard-case.webp',
    width: 800,
    height: 558,
    alt: 'A hard-case bound book with a rounded spine, shown at three-quarter angle.',
    ground: 'light',
  },
  whiteWiro: {
    src: '/images/work/white-wiro-binding.webp',
    width: 612,
    height: 459,
    alt: 'White wire-o binding on a landscape-format bound document.',
    ground: 'light',
  },
  syntheticPrints: {
    src: '/images/work/synthetic-prints-press.webp',
    width: 800,
    height: 450,
    alt: 'Saturated synthetic prints coming off the press mid-run.',
    ground: 'colour',
  },
  prepressArtwork: {
    src: '/images/work/prepress-artwork.webp',
    width: 1000,
    height: 667,
    alt: 'Hands marking up printed artwork at the prepress desk, proofs spread across the surface.',
    ground: 'colour',
  },
  pressOperatorCheck: {
    src: '/images/work/press-operator-check.webp',
    width: 571,
    height: 401,
    alt: 'A press operator pulling a sheet from the stack to check colour against the proof.',
    ground: 'colour',
  },
  digitalPressSheets: {
    src: '/images/work/digital-press-sheets.webp',
    width: 1000,
    height: 572,
    alt: 'A digital press laying down full-colour sheets, printed work stacked alongside the delivery.',
    ground: 'colour',
  },
  bookScanning: {
    src: '/images/work/book-scanning.webp',
    width: 640,
    height: 425,
    alt: 'An open book face down on a flatbed scanner, mid-digitisation.',
    ground: 'colour',
  },

  /* --------------------------------------------------------------------
   * Catalogue tiles.
   *
   * Several of these are studio mockups or template artwork rather than
   * photographs of a job — see the per-image notes. That is fine on a
   * catalogue page, which advertises a *format*, and wrong anywhere that
   * implies a customer. Captions here name the format and nothing else.
   * ------------------------------------------------------------------ */

  booksStack: {
    src: '/images/work/books-stack.webp',
    width: 800,
    height: 531,
    alt: 'A stack of case-bound and perfect-bound books on a white sweep.',
    ground: 'light',
  },
  /**
   * The library has no photograph of a brochure we actually printed — all three
   * candidates are design templates. This one at least shows the *format*: the
   * panels and the folds are what the catalogue tile is selling. Replace it the
   * day a real catalogue is shot.
   */
  brochureTrifold: {
    src: '/images/work/brochure-trifold.webp',
    width: 800,
    height: 800,
    alt: 'A trifold brochure opened out, showing the printed panels and both folds.',
    ground: 'light',
  },
  /**
   * The leather folder is real; the degrees inside it are placeholder art, so
   * this is captioned as a folder format and never as a named institution.
   */
  convocationFolders: {
    src: '/images/work/convocation-folders.webp',
    width: 500,
    height: 500,
    alt: 'A convocation folder lying open, a printed certificate held in each side.',
    ground: 'light',
  },
  printedLabels: {
    src: '/images/work/printed-labels.webp',
    width: 800,
    height: 800,
    alt: 'Die-cut printed labels arranged on a black field.',
    ground: 'dark',
  },
} as const satisfies Record<string, WorkImage>;

export type ImageKey = keyof typeof images;
