/**
 * Hero carousel artwork — ingest.
 *
 *   node scripts/hero-cards.mjs            report what is in the drop folder
 *   node scripts/hero-cards.mjs --write    crop, resize and write the webp files
 *
 * Drop the five photographs in `_raw/hero-cards/` named `1-*` … `5-*` (any
 * extension). Order is what maps them onto `heroProducts`, so the leading digit
 * is the only part of the name that matters.
 *
 * `_raw/` is git-ignored, so the originals are not in the repository — the
 * webp files this writes are. Re-running needs the originals back in place.
 *
 * ## Why this exists
 *
 * The ring shows five cards of one size, and the cheapest way to get five
 * photographs into one shape is to let CSS crop them. That was tried: these are
 * product shots framed tight, and a centre crop to any common ratio lands inside
 * the product. `object-contain` avoided it at the cost of paper bars around
 * every print.
 *
 * Cropping *here* instead is better than either, because a crop chosen per
 * photograph with the result on screen is not the same operation as a crop
 * chosen once for five photographs sight unseen. Each entry below carries its
 * own `gravity`, so a subject sitting high in its frame keeps its head.
 *
 * The output is what ships: five files at one ratio, so the cards can go back
 * to full bleed and the CSS does no cropping at all.
 */

import { readdir, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const IN_DIR = '_raw/hero-cards';

/**
 * Its own folder, not `public/img/catalogue/`.
 *
 * Those five filenames are each used twice — once by `heroProducts` and once by
 * `featuredProducts`, the grid further down the same page. Overwriting them to
 * change the carousel would have changed the grid underneath it as well.
 */
const OUT_DIR = 'public/img/hero/cards';

/**
 * The shared frame: 6:5.
 *
 * Chosen from the five files rather than picked first and imposed on them.
 * Four of them arrive between 1.04 and 1.15, and the certificate at 1.36 is the
 * outlier; 1.2 sits where the worst crop is smallest. It costs the certificate
 * 5.7% off each side — which is exactly its dark margin — and the others
 * between 2% and 6.5% off top and bottom.
 *
 * The card in `hero-showcase.tsx` quotes the same number. When the files, the
 * card and the stage all agree, the CSS crops nothing at all: `object-cover`
 * has nothing left to cut.
 */
const RATIO = 6 / 5;

/**
 * Widest output, and a floor under quality.
 *
 * Never upscales: the source files run from 489px to 718px wide, and inventing
 * pixels above that adds bytes and no detail. The cap only matters if better
 * originals turn up later.
 */
const MAX_WIDTH = 900;
const QUALITY = 82;

/**
 * Where each photograph is cropped from, and what it is called on the way out.
 * Index-matched to `heroProducts` in `src/content/home.ts`.
 *
 * `gravity` is sharp's crop anchor — `centre` unless the subject sits off
 * centre in its own frame, which is a thing you can only know by looking.
 */
const CARDS = [
  { slug: 'business-cards', gravity: 'centre' },
  { slug: 'brochures', gravity: 'centre' },
  { slug: 'packaging', gravity: 'centre' },
  { slug: 'catalogues', gravity: 'centre' },
  { slug: 'certificates', gravity: 'centre' },
];

const write = process.argv.includes('--write');

const files = (await readdir(IN_DIR).catch(() => []))
  .filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.error(`Nothing in ${IN_DIR}/. Drop the five photographs there, named 1-… to 5-….`);
  process.exit(1);
}
if (files.length !== CARDS.length) {
  console.error(`Found ${files.length} file(s) in ${IN_DIR}/, expected ${CARDS.length}:`);
  files.forEach((f) => console.error(`  ${f}`));
  process.exit(1);
}

if (write) await mkdir(OUT_DIR, { recursive: true });

console.log(`frame ${RATIO.toFixed(3)}:1  ${write ? 'writing' : 'dry run'}\n`);

const manifest = [];

for (const [i, file] of files.entries()) {
  const card = CARDS[i];
  const src = join(IN_DIR, file);
  const meta = await sharp(src).metadata();
  const srcRatio = meta.width / meta.height;

  // The largest 6:5 rectangle this file can give up without being upscaled,
  // then the cap. Whichever bites first.
  const fitWidth = srcRatio > RATIO ? meta.height * RATIO : meta.width;
  const width = Math.round(Math.min(fitWidth, MAX_WIDTH));
  const height = Math.round(width / RATIO);

  // What the common frame costs this photograph, on the axis it eats.
  const loss =
    srcRatio > RATIO
      ? `-${((1 - RATIO / srcRatio) * 100).toFixed(1)}% width`
      : srcRatio < RATIO
        ? `-${((1 - srcRatio / RATIO) * 100).toFixed(1)}% height`
        : 'exact';

  const out = join(OUT_DIR, `${card.slug}.webp`);
  console.log(
    `${String(i + 1)}. ${basename(file, extname(file)).padEnd(22)} ` +
      `${meta.width}x${meta.height} (${srcRatio.toFixed(3)}:1)  ${loss.padEnd(14)} ` +
      `-> ${width}x${height}  ${card.gravity}`,
  );

  manifest.push({ slug: card.slug, width, height });
  if (!write) continue;

  await sharp(src)
    .resize(width, height, { fit: 'cover', position: card.gravity })
    .webp({ quality: QUALITY })
    .toFile(out);
}

// The numbers `src/content/home.ts` has to carry, so they are copied rather
// than guessed. A wrong intrinsic size is a layout shift nobody sees coming.
console.log(`\ncontent/home.ts dimensions:`);
for (const m of manifest) console.log(`  ${m.slug}: width ${m.width}, height ${m.height}`);

if (!write) console.log(`\nRe-run with --write to produce the files.`);
