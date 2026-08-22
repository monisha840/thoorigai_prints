import {
  Box,
  BookOpen,
  Layers,
  Palette,
  Printer,
  ScanLine,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

import { images } from '@/lib/images';
import type { ProcessStep, ProductItem, ServiceItem } from '@/types';

/**
 * Placeholder content.
 *
 * Structure is real — these are the shapes the sections consume and a CMS will
 * eventually fill. The copy is a stand-in written against the studio's actual
 * capabilities, so the shell reads as a site rather than as lorem ipsum, but
 * every number and claim here needs confirming before launch.
 */

export const services: ServiceItem[] = [
  {
    id: 'digital',
    title: 'Digital printing',
    summary:
      'Short runs, variable data and same-week turnarounds. Multicolour and black-and-white, from a single proof to a few thousand sheets.',
    specs: ['1 – 3,000 sheets', 'Multicolour & mono', '48hr typical'],
    icon: Printer,
    href: '/services#digital',
    image: images.digitalPressSheets,
  },
  {
    id: 'offset',
    title: 'Offset printing',
    summary:
      'Long runs where unit cost matters and colour has to hold across the whole job. Pantone matching, coated and uncoated stocks.',
    specs: ['1,000+ sheets', 'Pantone matched', 'Coated & uncoated'],
    icon: Layers,
    href: '/services#offset',
    image: images.pressOperatorCheck,
  },
  {
    id: 'packaging',
    title: 'Packaging',
    summary:
      'Corrugation, cartons, rigid boxes and paper bags - die-cut, laminated and assembled to a structure that survives transit.',
    specs: ['Corrugation & carton', 'Rigid & drawer boxes', 'Die-cut to spec'],
    icon: Box,
    href: '/services#packaging',
    image: images.rigidBoxConstructions,
  },
  {
    id: 'binding',
    title: 'Binding & finishing',
    summary:
      'Hard case, perfect, wiro and centre pin, plus lamination, foiling and spot UV. Nine formats, all handled in house.',
    specs: ['9 binding formats', 'Foil & spot UV', 'In-house finishing'],
    icon: BookOpen,
    href: '/services#binding',
    image: images.goldWiro,
  },
  {
    id: 'prepress',
    title: 'Prepress & artwork',
    summary:
      'Files checked, imposed and proofed before anything reaches a plate. We catch the bleed, the overprint and the missing font.',
    specs: ['Preflight & imposition', 'Hard-copy proofs', 'Colour profiling'],
    icon: Palette,
    href: '/services#prepress',
    image: images.prepressArtwork,
  },
  {
    id: 'scanning',
    title: 'Scanning & reprint',
    summary:
      'Book scanning and print on demand for archives, reprints and out-of-stock titles that still need to be available.',
    specs: ['Book scanning', 'Print on demand', 'Archive-grade'],
    icon: ScanLine,
    href: '/services#scanning',
    image: images.bookScanning,
  },
];

export const products: ProductItem[] = [
  { id: 'books', title: 'Books & journals', category: 'Publishing', summary: 'Case-bound, perfect-bound and sewn, from proof copies to full print runs.', ratio: 'portrait', image: images.booksStack },
  { id: 'brochures', title: 'Brochures & catalogues', category: 'Marketing', summary: 'Saddle-stitched and perfect-bound, on coated or uncoated stock.', ratio: 'landscape', image: images.brochureTrifold },
  { id: 'boxes', title: 'Rigid & carton boxes', category: 'Packaging', summary: 'Telescope lids, magnet locks, drawer boxes and shoe boxes.', ratio: 'square', image: images.telescopeLidBoxes },
  { id: 'corrugation', title: 'Corrugated cases', category: 'Packaging', summary: 'Three- and five-ply outers, printed and die-cut to your dimensions.', ratio: 'landscape', image: images.cartonFormats },
  { id: 'bags', title: 'Paper bags', category: 'Retail', summary: 'Rope and flat handle, laminated, in kraft or coated stock.', ratio: 'portrait', image: images.paperBags },
  { id: 'stationery', title: 'Business stationery', category: 'Identity', summary: 'Cards, letterheads, compliment slips and bill pouches.', ratio: 'landscape', image: images.spotFinishCards },
  { id: 'certificates', title: 'Certificates & convocation', category: 'Institutional', summary: 'Foiled, embossed and numbered, with matching folders.', ratio: 'landscape', image: images.convocationFolders },
  { id: 'labels', title: 'Labels & stickers', category: 'Retail', summary: 'Synthetic and paper stock, die-cut on the roll or on sheets.', ratio: 'square', image: images.printedLabels },
  { id: 'calendars', title: 'Calendars & diaries', category: 'Seasonal', summary: 'Wiro, wall and desk formats, produced in season.', ratio: 'portrait', image: images.puLeatherDiaries },
];

/**
 * Removed: six `PortfolioItem` records, every one attributed to
 * "Placeholder Client".
 *
 * Nothing imported them — the real portfolio is eight photographed jobs in
 * `lib/portfolio.ts`, and `sections/portfolio/` reads only from there. But dead
 * data with an invented client name on it is not inert: it is exactly the shape
 * something reaches for when a new section needs "some case studies", and the
 * next person to wire it up publishes six fabricated client references.
 *
 * That is the same failure `docs/content-audit.md` finding 5 records against
 * the legacy site — seven theme-demo testimonials attributed to invented people
 * — and `auditSchema()` in `lib/seo/schema.ts` already fails the build if an
 * uncleared client name reaches structured data. This closes the other door.
 *
 * `lib/portfolio.ts` is where a real job goes, with `clientCleared` on it.
 */


export const processSteps: ProcessStep[] = [
  { id: 'brief', title: 'Brief', body: 'Tell us the format, the quantity and the date. We will tell you what is possible and what it costs, before anything is committed.' },
  { id: 'prepress', title: 'Prepress', body: 'Artwork is preflighted, imposed and proofed. Bleed, overprint and colour build are checked while changes are still cheap.' },
  { id: 'press', title: 'Press', body: 'Digital for short runs, offset when the quantity earns it. Colour is signed off against the proof at the start of the run.' },
  { id: 'finish', title: 'Finish', body: 'Lamination, foiling, die-cutting and binding, all in house - so the job never leaves the building between stages.' },
  { id: 'deliver', title: 'Deliver', body: 'Checked, counted, packed and dispatched. Short runs collected from Royapettah, larger jobs delivered.' },
];

/** Reasons to choose the studio, for the about and home pages. */
export const differentiators = [
  { id: 'in-house', title: 'Everything under one roof', body: 'Print, finishing and binding happen in the same building, so nothing waits on a third party and nothing gets lost between them.', icon: Sparkles },
  { id: 'proof', title: 'Proof before plates', body: 'You see a hard-copy proof before a job goes to press. What you approve is what comes off the machine.', icon: Layers },
  { id: 'range', title: 'One sheet or sixty thousand', body: 'Digital and offset side by side means the quantity picks the process, not the other way round.', icon: ShoppingBag },
];
