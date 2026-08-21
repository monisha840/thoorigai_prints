# Image Optimization Report

**Thoorigai Prints** — asset audit and production image library  
Generated 21 August 2026 · 170 files inspected · measured at the pixel level, not inferred from filenames

---

## Summary

| | |
|---|---|
| Files inspected | **170** (139 raster, 31 SVG) |
| Total on disk | **9.83 MB** |
| Oversized | **32** rasters — 6.49 MB holding what should be 1.09 MB |
| Duplicates | **8** redundant copies + **5** re-graded variants (512 KB) |
| Low quality | **13** at grade D/F, **44** at grade C |
| Unused | **76** files (4.43 MB) referenced by no page |
| Missing alt text | **169 / 170** |
| Delivered library | **75** files, **2,672 KB** in `/public/images` |

Three things matter more than the rest:

1. **Two-thirds of the byte weight is dead.** `assets/_theme-demo-unused/` alone is 6.3 MB of
   stock coffee cups, lemons and popcorn left behind by the WordPress theme — heavier than every
   genuine business image put together. None of it belongs in the redesign.
2. **A second image library went live while this audit was running.** `public/images/work/` and
   `src/lib/images.ts` appeared mid-scan and now wire 31 images into the app through
   `next/image`. Every one of those 31 is also present in the six folders delivered here. That
   overlap needs reconciling before it drifts — see **Two libraries, one directory** below.
3. **Compression is the single biggest win available.** Re-encoding the kept set to AVIF takes it
   from 2,977 KB to 1,350 KB — a 55% cut with no visible loss. Next.js already does
   this at request time, which is why the files in `/public/images` are deliberately *not*
   pre-compressed. The **Compression** section explains that trade-off.

---

## How this was measured

Every file was decoded and measured rather than judged by its name or extension.

| Signal | Method | Used for |
|---|---|---|
| Bits per pixel | `bytes × 8 ÷ (w × h)` | Over-compression, gated to photographic content by entropy |
| Sharpness | Variance of the Laplacian over luma | Soft or out-of-focus source |
| Real detail | Halve the image, restore it, measure RMSE | Upscaling — a low score means nothing lives above half resolution |
| Structure | 64-bit dHash + 64-bit DCT pHash | Same-composition detection |
| Colour | 8×8 RGB grid **and** mean colour of opaque pixels only | Separating true copies from re-graded variants |
| Achievable size | Real re-encode through `sharp` to WebP q82 and AVIF q50 | Every byte figure here is measured, not estimated |
| Usage | WordPress REST manifest ∪ 41 captured page HTML files ∪ `src/` scan | Orphan detection |

Two refinements were needed after checking the first pass by eye, and both changed the answer:

- **Perceptual hashes run on luma, so they merged the gold and navy feather marks.** Adding a
  colour gate over *opaque pixels only* separated them. A plain average is dominated by the
  transparent ground on thin-line artwork, which is exactly the case that was failing.
- **Bits-per-pixel is a photographic metric.** Applied blindly it graded `Logo-Original.png` as
  over-compressed, when a flat two-colour mark is legitimately cheap per pixel. Grading is now
  role-aware: photo, background, logo and icon are held to different standards.

---

## 1. Oversized images

**32 of 139 rasters.** Together they hold 6.49 MB and should hold 1.09 MB.

| Flag | Count | Meaning |
|---|---|---|
| `recompressible` | 29 | Loses ≥50% and ≥50 KB on re-encode with no visible change |
| `heavy-file` | 13 | Over 200 KB — twelve of these on one page is a 2.4 MB payload |
| `pixel-oversize` | 4 | Wider than 1920px, the largest breakpoint `next.config.ts` declares |

The four `pixel-oversize` files were resized to 1920px on the way into `/public/images`. That is
the only lossy step taken, and it is loss nobody can see, because no breakpoint ever requests
those pixels. The worst single case, `Board-on-board-hard.jpg`, was 2447×2447 at 451 KB — a
6-megapixel file sitting behind a card tile.

Largest remaining opportunities inside the delivered library:

| File | Dimensions | Now | Best | Saving |
|---|---|---|---|---|
| `hero/board-book-stack.webp` | 2447×2447 | 451 KB | 47 KB | 89.6% |
| `hero/press-hall-wide.jpg` | 1600×1194 | 253 KB | 88 KB | 65.4% |
| `about/press-hall.jpg` | 1920×1080 | 169 KB | 40 KB | 76.2% |
| `services/certificate-blue.webp` | 1079×759 | 130 KB | 24 KB | 81.5% |
| `hero/packaging-plinths-warm.webp` | 2000×1125 | 65 KB | 16 KB | 74.8% |
| `hero/packaging-plinths-cool.webp` | 2000×1125 | 55 KB | 13 KB | 76.1% |
| `hero/abstract-plinths.webp` | 2560×1663 | 52 KB | 10 KB | 79.8% |

These are left uncompressed on purpose — see **Format conversion** below.

---

## 2. Duplicate images

Nine clusters of identical composition, split into three kinds because they need different
treatment. Collapsing them into one bucket would have discarded two images that only *look*
alike to a structural hash.

### Byte-identical copies — safe to delete

| Kept | Duplicate |
|---|---|
| `assets/gallery/1-Slide-1-Image-3.webp` | `assets/gallery/Slide-1-Image-3.webp` |
| `assets/logos/Logo-Header.png` | `public/brand/Logo-Header.png` |
| `assets/logos/Logo-Original.png` | `public/brand/Logo-Original.png` |

`public/brand/` is a straight copy of two files in `assets/logos/`. Both now live once, in
`/public/images/logos/`.

### Near-duplicates — same image, different encode or size

| Kept | Dropped | Why |
|---|---|---|
| `cropped-Fav-4.png` | `Fav-3-512.png`, `Fav-4.png`, `cropped-Fav-3-512.png` | Three identical navy marks; the kept one is the favicon actually referenced on 40 pages |
| `Slide-1-Feather-FIN.webp` | `Slide-1-Feather.webp` | Earlier take, rougher mask |
| `Steps-New-1.webp` | `Steps-New.webp` | Same render at 1500×844 and 0.11 bpp — superseded |
| `1-Slide-1-Image-3.webp` | `Slide-1-Image-3.webp` | Byte-identical pair |

### Re-graded variants — same shot, different colour. **Not** duplicates

| Pair | Difference | Call |
|---|---|---|
| `Printing-press-BG-1.jpg` / `.webp` | Mean ink 101 vs 50 — the WebP is the same photo with a **dark scrim baked into the pixels** | Keep the bright JPG and apply the scrim in CSS, so text contrast stays tunable |
| `Slide-1-image-4.webp` / `-4-2.webp` | Sharpness 26 vs 14; shadows crushed to solid black | Keep the clean take |
| `Fav-2-512x512-1.png` / `Fav-3-512.png` | Ink distance 121 — **gold versus navy**, two brand colourways | Keep both; they are different marks |
| `images-78.jpeg` / `.webp` | Format pair | Theme-demo, both excluded |

> The gold/navy pair is why the colour gate exists. A structure-only hash reported them as the
> same file, and would have deleted one of the two brand colourways.

---

## 3. Low-quality images

Graded per role — a 512px favicon is correctly sized, a 512px product photo is not.

| Grade | Count | Meaning |
|---|---|---|
| **A** | 26 | Clean. Full-bleed capable, real detail at native size |
| **B** | 56 | Sound, but under 1200px — fine for cards, not for heroes |
| **C** | 44 | One defect: soft, over-compressed, or undersized |
| **D** | 9 | Two defects — re-export from source before use |
| **F** | 4 | Three or more — the pixels are already gone |

**The dominant failure is over-compression, not low resolution.** 38 rasters sit below 0.35 bits
per pixel: `board-Rounded.webp` is 36 KB for 1500×1500, `Menus.webp` is 7 KB for 800×800. Detail
was thrown away at export time and no upscaler recovers it. Re-export from the originals before
anyone considers upscaling — running an upscaler over these amplifies the artefacts rather than
fixing them.

Six D/F files were kept because nothing better exists for that slot. Each is a **reshoot or
re-export request**, not a finished asset:

| File | Dimensions | bpp | Problem |
|---|---|---|---|
| `hero/abstract-plinths.webp` | 2560×1663 | 0.10 | over-compressed, upscaled/no-detail, soft |
| `hero/packaging-plinths-cool.webp` | 2000×1125 | 0.20 | upscaled/no-detail, soft |
| `hero/packaging-plinths-warm.webp` | 2000×1125 | 0.24 | over-compressed, upscaled/no-detail, soft |
| `services/perfect-binding-open.webp` | 1289×800 | 0.14 | over-compressed, soft |
| `services/rexin-binding.webp` | 800×540 | 0.27 | over-compressed, soft, small(<1200px) |
| `services/rounded-hard-case.webp` | 800×558 | 0.14 | upscaled/no-detail, soft, small(<1200px) |

`hero/abstract-plinths.webp` is the weakest of them: 2560×1663 at 0.10 bpp with no real detail
above half resolution. It survives only because it is an abstract background where softness reads
as depth of field. It should not carry text without a scrim.

---

## 4. Unused images

**76 of 170 files (4.43 MB) are referenced by no page** — neither the captured
WordPress site nor the Next.js app.

| Source folder | Unused | Bytes |
|---|---|---|
| `assets/_theme-demo-unused` | 25 | 3,308 KB |
| `assets/gallery` | 11 | 404 KB |
| `assets/backgrounds` | 4 | 383 KB |
| `assets/services` | 7 | 222 KB |
| `assets/logos` | 7 | 211 KB |
| `assets/icons` | 22 | 8 KB |

Two cautions on reading that number:

- **`assets/icons/` shows 22 unused, and that is an artefact.** Those SVGs came from the
  WordPress media library, but the theme inlined its icons, so no filename reference exists to
  find. They total 8 KB and stay in `assets/` to be inlined as components — not a finding, and
  not a reason to delete them.
- **Unused does not mean worthless.** The four most commercially valuable images in the library
  render on zero pages: `Slide-1-Image-2.webp` (the staged own-product range), `Technology.jpg`
  (the press hall), `11-Answer-Sheets.webp` (real OMR sheets) and `Page2-Img-1.webp` (the Prasar
  Bharati / All India Radio job). All four are now in `/public/images` and should lead the
  redesign. Orphaned here means neglected, not redundant.

The genuinely dead weight is `assets/_theme-demo-unused/` — 54 files, 6.3 MB of theme filler,
excluded from the library and safe to delete once the client confirms.

---

## The delivered library

`/public/images` now holds the curated, deduplicated, correctly-sized set.

```
public/images/
  hero/         11 files     807 KB   full-bleed banners and section backdrops
  services/     38 files   1,031 KB   offering tiles and explainer rows
  portfolio/     8 files     293 KB   real client work - evidence, not illustration
  about/         4 files     243 KB   studio, press hall and equipment
  products/      8 files     155 KB   packaging and stationery range
  logos/         6 files     142 KB   brand marks, all pending SVG redraw
  TOTAL         75 files   2,672 KB
```

`assets/` is untouched and remains the archive of record. Nothing was deleted.

**Files were renamed to describe their subject** — `page2-img-1.webp` became
`portfolio/prasar-bharati.webp`. Two WordPress names were outright wrong and were corrected
against the actual pixels:

| Was | Now | Reason |
|---|---|---|
| `10-Question-Papers.webp` | `services/press-operator-check.webp` | image is a press operator at the machine |
| `9-Print-On-Demand.webp` | `services/prepress-artwork.webp` | image is prepress artwork being marked up |

---

## Recommendations

### Compression

The masters in `/public/images` are deliberately **not** pre-compressed. Only two actions were
taken on the way in:

| Action | Files | Effect |
|---|---|---|
| Copy verbatim | 71 | No generation loss |
| Resize to 1920px + re-encode | 4 | 622 KB → 317 KB |

This is the right default **because `next/image` re-encodes at request time.** Pre-compressing a
master to WebP q82 and then letting Next re-encode it to AVIF stacks two generations of lossy
compression to produce a file the same size as one generation would. The master's job is to be
the best available source at a sane resolution; the optimizer's job is to make it small.

Pre-compress only if you drop `next/image` and serve these files statically. In that case the
measured numbers are:

| Target | Size | Saving |
|---|---|---|
| Current masters | 2,977 KB | — |
| All WebP q82 | 2,390 KB | 20% |
| All AVIF q50 | 1,350 KB | 55% |

### Format conversion

`next.config.ts` already declares `formats: ['image/avif', 'image/webp']`, which is correct and
needs no change. Next negotiates per request: AVIF where the browser accepts it, WebP otherwise,
the original as the floor. Running the whole library through it lands at roughly
**1,350 KB** across all 75 images — and no page loads all 75.

Two rules for the source files:

- **Keep PNG only where alpha is real.** All six files in `logos/` carry a genuine alpha channel
  and stay PNG. No photographic PNGs survived into the library.
- **The brand marks need vectorising, not upscaling.** `logo-primary.png` is 472×317, and there
  is no raster size at which a logo is correct. Redraw the feather and wordmark as SVG and the
  whole `logos/` folder collapses to a few KB that stays sharp at any size. This is the
  highest-value asset task on the list.

### Lazy loading

`next/image` lazy-loads everything by default, which is correct for all but the LCP element. The
rule is one `priority` image per route — the hero — and nothing else:

```tsx
// The LCP element. Eager, high fetch priority, explicitly sized.
<Image src="/images/hero/product-range.webp" alt="…"
       width={1600} height={1020} priority sizes="100vw" />

// Everything below the fold. No `priority`, no `loading` prop — the default is right.
<Image src="/images/services/books-row.webp" alt="…"
       width={800} height={531} sizes="(max-width: 768px) 100vw, 33vw" />
```

Suggested LCP image per route:

| Route | Hero |
|---|---|
| `/` | `hero/product-range.webp` — the staged own-product range, the strongest single image you own |
| `/about` | `about/press-hall.jpg` — 1920×1080, grade A |
| `/services` | `hero/synthetic-prints.webp` |
| `/portfolio` | `hero/board-book-stack.webp` |
| `/products` | `hero/premium-box-dark.webp` |

Marking more than one image `priority` per page is self-defeating: every eager image competes
with the LCP element for the same connection.

### Responsive image strategy

`deviceSizes` and `imageSizes` in `next.config.ts` are already sensible and should stay. The part
that needs care is the `sizes` prop, because getting it wrong is invisible in development and
expensive in production — omit it on a fill image and Next assumes `100vw`, shipping a 1920px
file into a 380px card.

| Slot | `sizes` |
|---|---|
| Full-bleed hero | `100vw` |
| Half-width feature | `(max-width: 768px) 100vw, 50vw` |
| Three-up card grid | `(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw` |
| Four-up product tile | `(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw` |
| Fixed logo | no `sizes` — pass explicit `width` / `height` |

Three supporting points:

1. **Always pass `width` and `height`** (or `fill` with a sized parent). Without them the layout
   shifts as each image arrives — a Cumulative Layout Shift penalty on every page.
2. **Only two files exceed 3 MP.** Most of the library maxes out around 800–1000px, so the upper
   `deviceSizes` entries will simply never be generated for those images. That is not a
   misconfiguration; it is the library telling you which images need reshooting before any
   full-bleed treatment is credible.
3. **Use `placeholder="blur"` for the 17 files over 40 KB.** Static imports generate the blur
   data at build time; for `/public` paths you must supply `blurDataURL` yourself.

---

## Flagged before publication

Four things that are not performance problems, but will cost more than performance if they ship.

**1. Every source image has empty alt text — 169 of 170.** `src/lib/images.ts` now supplies real
descriptions for the 31 images it declares, which is the right pattern and worth extending. The
other 46 files in this library still need alt text before they are used, and it needs a person
writing real descriptions rather than a generated pass.

**2. Thirteen files in `services/` are stock templates carrying dummy text.** `certificate-blue`
says *"John Doe"* and *"Foundations and Applications of Artificial Intelligence Technologies"*;
`business-cards` reads *"Qaria Doe"* and *"Zuñiga Meza"*; `flyer` is a *"Delicious Pizza
Template"*; `identity-cards` shows *"Kate Miller"*. They work as generic illustration of a
service. They must never be captioned as your work.

**3. `products/carton-box.webp` shows Amazon- and Flipkart-branded cartons.** Third-party
trademarks on a commercial page imply a client relationship. Replace it or get it cleared.

**4. `services/magnet-lock.webp` has marketing copy baked into the pixels** — *"ULTIMATE
CONVENIENCE & SUSTAINABLE STYLE"* plus callout labels. Invisible to search engines, impossible
to translate, and soft on retina screens. Rebuild it as a photo plus live HTML text.

---

## Two libraries, one directory — needs your decision

**`public/images/work/` is not mine.** It appeared at 13:59 while this scan was running, together
with `src/lib/images.ts` and `next/image` wiring across ten components. It is **live**: those 31
paths are referenced by the running app.

**Do not delete it.** Removing `work/` would break 31 image references and fail the build. That
was this report's recommendation until the `src/` wiring was checked; it was wrong.

The two libraries fully overlap. Of the 31 files in `work/`:

- **29 are byte-identical** to a file in the six folders delivered here.
- **2** — `board-on-board-case.jpg` and `paper-roll-plinths.webp` — are the full-size originals of
  `hero/board-book-stack.webp` and `hero/abstract-plinths.webp`, which were resized to 1920px
  because both exceeded the largest declared breakpoint. Nothing exists only in `work/`.

So `work/` is a 31-file subset of the 75 delivered here, under different names, costing ~1.4 MB
of duplication inside `public/`.

**Its naming is good — better than WordPress's in several cases, and it caught two of my errors.**
Comparing `work/` against the pixels is what revealed that `10-Question-Papers.webp` is a press
operator at a machine and `9-Print-On-Demand.webp` is prepress artwork. Both corrections were
adopted into the six-folder library.

### Recommended reconciliation

A one-file change, no component edits, no UI behaviour affected:

1. Repoint the `src` values in `src/lib/images.ts` at the six-folder paths using the table below.
   The keys, dimensions, alt text and `ground` values all stay as they are — only the path
   strings change. Because content refers to `images.rigidBoxConstructions` rather than a path,
   nothing outside that file needs touching.
2. Confirm the build, then delete `public/images/work/`.
3. For the two resized files, take the dimensions from this report's appendix — they are now
   1920px wide, and `next/image` needs the true intrinsic size.

This was left for you rather than applied, because editing `src/lib/images.ts` is a UI change and
this task was scoped not to make one.

| Live path in `src/lib/images.ts` | Six-folder equivalent |
|---|---|
| `/images/work/black-wiro-binding.webp` | `/images/services/black-wiro-binding.webp` |
| `/images/work/board-book-fan.webp` | `/images/services/board-book-fan.webp` |
| `/images/work/box-files.webp` | `/images/products/box-file.webp` |
| `/images/work/carton-formats.webp` | `/images/hero/corrugation-formats.webp` |
| `/images/work/customised-files.webp` | `/images/products/customised-files.webp` |
| `/images/work/disc-bound-components.webp` | `/images/services/disc-bound-notebook.webp` |
| `/images/work/foiled-invitation-suite.webp` | `/images/portfolio/greeting-card.webp` |
| `/images/work/gift-box-ribbon.webp` | `/images/products/jewelry-box-gift.webp` |
| `/images/work/gold-wiro-binding.webp` | `/images/services/gold-wiro-binding.webp` |
| `/images/work/greyboard-thickness.webp` | `/images/services/greyboard-sheets.webp` |
| `/images/work/institutional-certificate-folders.webp` | `/images/portfolio/prasar-bharati.webp` |
| `/images/work/kraft-boxes-belly-band.webp` | `/images/portfolio/ladorn-kraft-boxes.webp` |
| `/images/work/magnetic-closure-box.webp` | `/images/hero/premium-box-dark.webp` |
| `/images/work/omr-answer-sheets.webp` | `/images/portfolio/omr-answer-sheets.webp` |
| `/images/work/patterned-shoe-box.webp` | `/images/portfolio/shoe-box.webp` |
| `/images/work/prepress-artwork.webp` | `/images/services/prepress-artwork.webp` |
| `/images/work/presentation-sample-stand.webp` | `/images/products/presentation-samples.webp` |
| `/images/work/press-operator-check.webp` | `/images/services/press-operator-check.webp` |
| `/images/work/printed-paper-bags.webp` | `/images/products/paper-bag.webp` |
| `/images/work/pu-leather-diaries.webp` | `/images/services/pu-leather-diary.webp` |
| `/images/work/rigid-box-constructions.webp` | `/images/portfolio/drawer-box.webp` |
| `/images/work/rigid-box-insert-tray.jpg` | `/images/portfolio/rigid-box.jpg` |
| `/images/work/rounded-hard-case.webp` | `/images/services/rounded-hard-case.webp` |
| `/images/work/section-sewn-spine.webp` | `/images/services/stitching-perfect-binding.webp` |
| `/images/work/spot-finish-business-cards.webp` | `/images/portfolio/silver-line-business-card.webp` |
| `/images/work/studio-product-range.webp` | `/images/hero/product-range.webp` |
| `/images/work/synthetic-prints-press.webp` | `/images/hero/synthetic-prints.webp` |
| `/images/work/telescope-lid-boxes.webp` | `/images/products/telescope-lid-boxes.webp` |
| `/images/work/white-wiro-binding.webp` | `/images/services/white-wiro-binding.webp` |
| `/images/work/board-on-board-case.jpg` | `/images/hero/board-book-stack.webp` **(resized to 1920px — update `width`/`height`)** |
| `/images/work/paper-roll-plinths.webp` | `/images/hero/abstract-plinths.webp` **(resized to 1920px — update `width`/`height`)** |

---

## Appendix — full file mapping

75 files. `copy` means byte-identical to the source; `resize-1920` means downscaled to the
largest declared breakpoint and re-encoded at WebP q88.

| Destination | Source | Dimensions | Size | Grade | Action |
|---|---|---|---|---|---|
| `hero/abstract-plinths.webp` | `backgrounds/Slider-2-test-scaled.webp` | 1920×1247 | 38 KB | F | resize-1920 |
| `hero/board-book-stack.webp` | `services/Board-on-board-hard.jpg` | 1920×1920 | 188 KB | C | resize-1920 |
| `hero/corrugation-formats.webp` | `products/Corrugation.webp` | 1363×707 | 49 KB | A | copy |
| `hero/digital-press-sheets.webp` | `gallery/Slide-1-image-4.webp` | 1000×572 | 30 KB | B | copy |
| `hero/hardcover-branded.webp` | `services/Hard.webp` | 1000×1000 | 43 KB | B | copy |
| `hero/packaging-plinths-cool.webp` | `gallery/Steps-New-1.webp` | 1920×1080 | 42 KB | D | resize-1920 |
| `hero/packaging-plinths-warm.webp` | `gallery/Steps-New-2.webp` | 1920×1080 | 50 KB | F | resize-1920 |
| `hero/premium-box-dark.webp` | `products/open-wooden-black-box-floor.webp` | 800×534 | 37 KB | B | copy |
| `hero/press-hall-wide.jpg` | `backgrounds/Printing-press-BG-1.jpg` | 1600×1194 | 253 KB | A | copy |
| `hero/product-range.webp` | `gallery/Slide-1-Image-2.webp` | 800×510 | 37 KB | B | copy |
| `hero/synthetic-prints.webp` | `services/8-Synthetic-Prints.webp` | 800×450 | 41 KB | B | copy |
| `about/binding-line.webp` | `gallery/Slide-Binding-3.webp` | 1384×650 | 26 KB | C | copy |
| `about/canon-press.webp` | `gallery/Canon-Image.webp` | 1330×803 | 23 KB | A | copy |
| `about/digital-printer.webp` | `gallery/Printer.webp` | 1000×750 | 25 KB | B | copy |
| `about/press-hall.jpg` | `gallery/Technology.jpg` | 1920×1080 | 169 KB | A | copy |
| `portfolio/drawer-box.webp` | `products/Drawer-Box-1.webp` | 980×799 | 44 KB | B | copy |
| `portfolio/greeting-card.webp` | `services/Greeting-1.webp` | 800×800 | 84 KB | B | copy |
| `portfolio/ladorn-kraft-boxes.webp` | `gallery/1-Slide-1-Image-3.webp` | 278×330 | 9 KB | C | copy |
| `portfolio/omr-answer-sheets.webp` | `services/11-Answer-Sheets.webp` | 800×541 | 56 KB | B | copy |
| `portfolio/prasar-bharati.webp` | `gallery/Page2-Img-1.webp` | 500×497 | 8 KB | C | copy |
| `portfolio/rigid-box.jpg` | `products/Box-1.jpg` | 455×330 | 52 KB | C | copy |
| `portfolio/shoe-box.webp` | `products/Shoe-Box-New.webp` | 800×483 | 15 KB | B | copy |
| `portfolio/silver-line-business-card.webp` | `services/7-2-Silver-Line-Business-Card.webp` | 800×654 | 25 KB | B | copy |
| `products/box-file.webp` | `products/box-file-New.webp` | 850×846 | 27 KB | C | copy |
| `products/carton-box.webp` | `products/Carton-Box.webp` | 500×494 | 19 KB | C | copy |
| `products/convocation-files.webp` | `products/Convocaton-Files.webp` | 500×500 | 25 KB | C | copy |
| `products/customised-files.webp` | `products/Customised-Files.webp` | 800×600 | 19 KB | B | copy |
| `products/jewelry-box-gift.webp` | `products/jewelry-box-Gift.webp` | 800×696 | 13 KB | B | copy |
| `products/paper-bag.webp` | `products/Paper-Bag.webp` | 800×800 | 23 KB | B | copy |
| `products/presentation-samples.webp` | `products/Presentation-Samples.webp` | 500×500 | 19 KB | C | copy |
| `products/telescope-lid-boxes.webp` | `products/Telescope-Lids-1-1.webp` | 800×621 | 10 KB | C | copy |
| `services/bill-pouch.webp` | `services/Bill-Pouch.webp` | 800×600 | 16 KB | C | copy |
| `services/black-wiro-binding.webp` | `services/Black-wiro-binding.webp` | 900×900 | 30 KB | C | copy |
| `services/board-book-fan.webp` | `services/board-Book-1-New.webp` | 800×521 | 23 KB | B | copy |
| `services/board-book-rounded.webp` | `services/board-Rounded.webp` | 1500×1500 | 36 KB | C | copy |
| `services/book-scanning.webp` | `services/11-Book-Scanning.webp` | 640×425 | 15 KB | B | copy |
| `services/books-row.webp` | `services/1-Books.webp` | 800×531 | 12 KB | B | copy |
| `services/books-stack.webp` | `services/books.webp` | 1000×1000 | 23 KB | C | copy |
| `services/brochure-business.webp` | `services/2-Brochure.webp` | 1000×546 | 29 KB | B | copy |
| `services/brochure-travel.webp` | `services/Brochure-2.webp` | 800×800 | 30 KB | B | copy |
| `services/brochure-trifold.webp` | `services/Brochure-3.webp` | 800×800 | 26 KB | B | copy |
| `services/business-cards.webp` | `services/Business-Cards.webp` | 800×800 | 26 KB | B | copy |
| `services/calendar.webp` | `services/Calendar-1.webp` | 800×800 | 37 KB | B | copy |
| `services/center-pinning.webp` | `services/Center-Pinning.webp` | 568×382 | 15 KB | C | copy |
| `services/certificate-blue.webp` | `services/Certificate-2.webp` | 1079×759 | 130 KB | B | copy |
| `services/certificate-gold.webp` | `services/4-1-Certificate.webp` | 1000×615 | 30 KB | B | copy |
| `services/curve-rounded-binding.webp` | `services/Curve-rounded-binding.webp` | 1000×716 | 44 KB | B | copy |
| `services/disc-bound-notebook.webp` | `services/Special-Sheets.webp` | 800×788 | 16 KB | C | copy |
| `services/flyer.webp` | `services/Flyer.webp` | 800×800 | 42 KB | B | copy |
| `services/gold-wiro-binding.webp` | `services/Gold-wiro-binding-1.webp` | 850×880 | 15 KB | C | copy |
| `services/greyboard-sheets.webp` | `services/Perfect.webp` | 800×534 | 31 KB | B | copy |
| `services/hardcover-book.webp` | `services/Hard-2.webp` | 800×800 | 37 KB | B | copy |
| `services/identity-cards.webp` | `services/Identity-1.webp` | 800×800 | 23 KB | B | copy |
| `services/label.webp` | `services/6-Label.webp` | 800×800 | 42 KB | B | copy |
| `services/magnet-lock.webp` | `services/Magnet-Lock.webp` | 800×800 | 29 KB | B | copy |
| `services/menu-board.webp` | `services/Menu-1.webp` | 800×800 | 39 KB | B | copy |
| `services/menus.webp` | `services/Menus.webp` | 800×800 | 7 KB | B | copy |
| `services/perfect-binding-open.webp` | `services/Perfect-Binding.webp` | 1289×800 | 18 KB | D | copy |
| `services/pin-perfect-binding.webp` | `services/pin-perfect-binding.webp` | 500×500 | 7 KB | C | copy |
| `services/prepress-artwork.webp` | `services/9-Print-On-Demand.webp` | 1000×667 | 36 KB | B | copy |
| `services/press-operator-check.webp` | `services/10-Question-Papers.webp` | 571×401 | 14 KB | C | copy |
| `services/price-tag.webp` | `services/Price-tag.webp` | 569×500 | 15 KB | C | copy |
| `services/pu-leather-diary.webp` | `services/Pu-Leather-2.webp` | 800×600 | 20 KB | B | copy |
| `services/rexin-binding.webp` | `services/Rexin-Binding.webp` | 800×540 | 14 KB | D | copy |
| `services/rounded-hard-case.webp` | `services/Rounded-Hard-Case.webp` | 800×558 | 8 KB | D | copy |
| `services/stickers.webp` | `services/3-Stickers.webp` | 800×800 | 39 KB | B | copy |
| `services/stitching-perfect-binding.webp` | `services/stitching-perfect-binding.webp` | 600×600 | 13 KB | B | copy |
| `services/white-wiro-binding.webp` | `services/White-wiro-binding.webp` | 612×459 | 23 KB | B | copy |
| `services/wiro-binding.webp` | `services/wiro-binding.webp` | 900×576 | 20 KB | C | copy |
| `logos/feather-cmyk.webp` | `gallery/Slide-1-Feather-FIN.webp` | 600×600 | 38 KB | B | copy |
| `logos/logo-horizontal.png` | `logos/Logo-Header.png` | 350×100 | 5 KB | A | copy |
| `logos/logo-primary.png` | `logos/Logo-Original.png` | 472×317 | 6 KB | A | copy |
| `logos/mark-gold-wordmark.png` | `logos/Fav-512x512-1.png` | 512×512 | 40 KB | A | copy |
| `logos/mark-gold.png` | `logos/Fav-2-512x512-1.png` | 512×512 | 29 KB | A | copy |
| `logos/mark-navy.png` | `logos/cropped-Fav-4.png` | 512×512 | 25 KB | A | copy |

### Excluded

| Reason | Files | Bytes |
|---|---|---|
| theme-demo leftover | 54 | 6,343 KB |
| curatorial discard | 11 | 574 KB |
| redundant brand mark | 5 | 142 KB |
| crushed variant of Slide-1-image-4 | 1 | 13 KB |
| byte-identical copy of assets/logos/ | 2 | 11 KB |
| UI icon - stays in assets/ | 22 | 8 KB |

---

*Measured with Pillow and sharp against every file on disk. No UI files were modified.*
