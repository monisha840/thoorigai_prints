# Image Usage Guide &mdash; thoorigaiprints.com

A working brief for the redesign: what each image is *for*, what has to be done to it first,
and what should never be shipped again. Every one of the **168 extracted files** is accounted for.

Assessed 21 August 2026 against the 92 raster business images in `assets/`, plus 22 UI icons and
54 theme-demo leftovers. Judgements come from inspecting every image, not from filenames &mdash;
several files are named for a product but actually contain stock template art, and those are flagged.

---

## The four categories

| Category | Test it has to pass | Count |
|---|---|---|
| **Hero** | Carries a full-width band on its own at 1400px+. Composition survives a text overlay and a crop to 21:9. | **14** |
| **Portfolio** | Shows *real work you produced for a real customer*. Evidence, not illustration. | **8** |
| **Service** | Explains or represents an offering on a card, tile or explainer row. Illustration is fine here. | **68** |
| ~~**Discard**~~ | Duplicate, superseded, unusable quality, or text baked into pixels. | **78** |

Portfolio is deliberately the strictest bucket. A stock brochure template is not a sample of your
work, and captioning it as one is the fastest way to lose a commercial client who recognises it.

---

## Five things worth acting on first

**1. Your best four images are on no page at all.**
`Slide-1-Image-2.webp` (your own product range, staged), `Technology.jpg` (a Heidelberg press),
`11-Answer-Sheets.webp` (real OMR sheets) and `Page2-Img-1.webp` (the Prasar Bharati job) are all
rendered **zero times** on the live site. Between them they are the whole argument for hiring you.

**2. There are only eight images of real client work &mdash; and four are unusable at size.**
The named credentials in the library are **Prasar Bharati / All India Radio Madurai**, **ActiveSURE**,
**LADORN U** and **H K Nath Metals**. Three of those four sit in files under 500px. A half-day of
reshooting the physical samples you still have on the shelf would do more for the site than any
amount of retouching.

**3. Re-encode before you upscale.** 38 of 92 rasters are below 0.35 bits per pixel &mdash; detail has
already been thrown away. `Menus.webp` is 7 KB for 800&times;800; `board-Rounded.webp` is 30 KB for
1500&times;1500. Upscaling these amplifies the artefacts. Re-export from the originals first, and only
then decide whether an upscale is still needed.

**4. Four files have marketing copy baked into the pixels.** `5-Book-Cover.webp`,
`Offset-Featured.webp`, `Printing-Featured-Image.webp` and `Digital-BW-Featured.webp` carry headlines,
body copy and URLs as image data &mdash; invisible to search engines, impossible to translate, and soft
on retina screens. Rebuild each as a photo plus live HTML text.

**5. Every image on the site has empty alt text.** All 168, without exception. This is separate from
categorisation and cheaper than any of it.

---

## Reading the recommendations

**Background removal**

| Value | Meaning |
|---|---|
| `None` | Already has a clean alpha channel. Nothing to do. |
| `Easy` | Uniform ground, high subject contrast. One pass of any modern cut-out tool. |
| `Med` | Gradient ground, tonal overlap with the subject, or fiddly edges (ribbon, open pages, lanyards). Expect manual cleanup. |
| `Keep` | **Do not cut out.** The environment is the message &mdash; a press hall or a workshop desk is evidence, and a floating machine is not. |

**Upscaling** &mdash; a target long edge, not a blanket multiplier. Anything marked *re-encode* should be
re-exported from source before upscaling is even considered. Two files are marked **reshoot**: no
upscaler recovers detail that was never captured.

**Mockup / placement** &mdash; where the image earns its place in the new site, and for a few files, what
they are better used *as*. `Business-Cards.webp` in particular is a mockup template, not a photo:
its perspective and shadow are already correct for dropping real client artwork onto.

**3D showcase suitability**

| Value | Meaning |
|---|---|
| `Yes` | Rigid, geometrically simple, evenly lit, clean silhouette. Photogrammetry or a modelled stand-in will both work. |
| `Partial` | Usable as a flat plane in a 3D scene, or as one layer of a parallax, but not as a rotatable object. |
| `No` | Scene photography, machinery, or flat artwork. Force it into 3D and it will look like a cardboard cut-out. |

---

## `assets/gallery/` &mdash; 16 files

The most valuable and most neglected folder. It holds the only images of real client work and the only staged shot of your own product range &mdash; and most of them render on no page at all.

*6 hero &middot; 2 portfolio &middot; 3 service &middot; 5 discard*

| File | Px | Category | Background removal | Upscaling | Mockup / placement | 3D |
|---|---|---|---|---|---|---|
| `Slide-1-Feather-FIN.webp` | 600&times;600 | **Hero** | None &mdash; already alpha | **Vectorise as SVG** | Brand motif: watermark, divider, loader, scroll accent | No |
| `Slide-1-Image-2.webp` | 800&times;510 | **Hero** | Keep &mdash; the spread is the message | 2&times; &rarr; 1600px | **Homepage hero**; “what we make” banner; About opener | Yes |
| `Slide-1-image-4.webp` | 1000&times;572 | **Hero** | Keep | 2&times; &rarr; 2000px | Digital printing hero; capability band | No |
| `Steps-New-1.webp` | 2000&times;1125 | **Hero** | Keep &mdash; the plinths are the composition | Re-encode (native 2000&times;1125 is ample) | Packaging hero; “how it works” backdrop | Yes |
| `Steps-New-2.webp` | 2000&times;1125 | **Hero** | Keep | Re-encode (native 2000&times;1125 is ample) | Packaging hero, warm variant; seasonal campaign | Yes |
| `Technology.jpg` | 1920&times;1080 | **Hero** | Keep &mdash; the press hall is the subject | &mdash; (1920&times;1080 native) | **About / Technology hero**; full-bleed dark band | No |
| `1-Slide-1-Image-3.webp` | 278&times;330 | **Portfolio** | Easy &mdash; alpha, clean edges | **4&times; &rarr; 1100px, or reshoot** | Client-work carousel; kraft / eco feature | Yes |
| `Page2-Img-1.webp` | 500&times;497 | **Portfolio** | Med &mdash; black field, paper edges are the work | **3&times; &rarr; 1500px, or reshoot** | **Marquee credential.** Trust strip, About page | No |
| `Canon-Image.webp` | 1330&times;803 | Service | None &mdash; already alpha | &mdash; (1330px is fine) | Equipment / capability section; press-floor spec list | No |
| `Printer.webp` | 1000&times;750 | Service | None &mdash; already alpha | &mdash; (1000px is fine) | Equipment strip; digital printing header | No |
| `Slide-Binding-3.webp` | 1384&times;650 | Service | Keep &mdash; dark field suits a dark band | Re-encode, then 2&times; | Binding page banner; process section | No |
| `Slide-1-Feather.webp` | 600&times;600 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Slide-1-Image-1.webp` | 500&times;497 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Slide-1-Image-3.webp` | 278&times;330 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Slide-1-image-4-2.webp` | 1000&times;572 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Steps-New.webp` | 1500&times;844 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |

**Notes**

- `Slide-1-Feather-FIN.webp` &mdash; The brand feather rendered as a CMYK-gradient plume &mdash; a neat visual pun on four-colour printing. Redrawn as SVG with a gradient it becomes an infinitely scalable signature element.
- `Slide-1-Image-2.webp` &mdash; The single most representative image you own: your own diaries, rigid boxes, calendars, bags and religious prints staged together. Sharpness 47.7 at 0.73 bpp &mdash; and rendered on **zero pages**. This should be the first thing a visitor sees.
- `Slide-1-image-4.webp` &mdash; A digital press laying down CMYK sheets &mdash; colour, motion and machinery in one frame. Your best press image after `Technology.jpg`.
- `Steps-New-1.webp` &mdash; Cool-toned 3D render of packaging staged on plinths. Native resolution is more than adequate &mdash; the problem is compression, not size.
- `Steps-New-2.webp` &mdash; Warmer-graded twin of `Steps-New-1.webp`. Pick one per page; running both reads as indecision.
- `Technology.jpg` &mdash; Heidelberg offset press, well exposed at 0.67 bpp. The most credible heavy-machinery image in the library &mdash; and it renders on **zero pages**. Verify it is your own press before claiming it as such.
- `1-Slide-1-Image-3.webp` &mdash; **Real branded client job** (LADORN U) &mdash; kraft boxes with printed belly bands. Genuine proof, stored at postage-stamp size. Reshooting the physical product beats any upscaler here.
- `Page2-Img-1.webp` &mdash; **Prasar Bharati / All India Radio, Madurai** &mdash; a Government of India broadcaster job. Commercially this is the most valuable image in the library, and it is a 500px file rendering on **zero pages**. Reshoot it properly and lead with it.
- `Canon-Image.webp` &mdash; Canon production press cut-out. Legitimate as a factual capability claim **if you run this machine**. Never rendered on any page &mdash; surface it on an About or Technology page.
- `Printer.webp` &mdash; Second Canon cut-out, with a cleaner mask than `Canon-Image.webp`. Use one or the other, never both.
- `Slide-Binding-3.webp` &mdash; Dark 3D render of a binding line. Reads as a technical capability diagram and works as a dark-band backdrop with text over it.
- `Slide-1-Feather.webp` &mdash; Earlier take of `Slide-1-Feather-FIN.webp` with a harsher gradient and a rougher mask.
- `Slide-1-Image-1.webp` &mdash; The same Prasar Bharati shot as `Page2-Img-1.webp`, but on a mottled blue ground that fights the cream folder. Keep the black-background version.
- `Slide-1-Image-3.webp` &mdash; Byte-identical duplicate of `1-Slide-1-Image-3.webp` (both 278&times;330, 9,678 bytes).
- `Slide-1-image-4-2.webp` &mdash; Darkened, crushed variant of `Slide-1-image-4.webp` (sharpness 7.7 against 26.2); the shadows have gone to solid black.
- `Steps-New.webp` &mdash; Smaller (1500&times;844) and softer (sharpness 5.6, 0.11 bpp) first pass of the same render, superseded by both `-1` and `-2`.

## `assets/backgrounds/` &mdash; 4 files

Four files, two of which are redundant. Everything here needs a dark scrim before text goes over it.

*2 hero &middot; 2 discard*

| File | Px | Category | Background removal | Upscaling | Mockup / placement | 3D |
|---|---|---|---|---|---|---|
| `Printing-press-BG-1.jpg` | 1600&times;1194 | **Hero** | Keep &mdash; full-bleed environmental | 2&times; &rarr; 2560px | Homepage hero background under a dark scrim | No |
| `Slider-2-test-scaled.webp` | 2560&times;1663 | **Hero** | Keep &mdash; abstract by design | **Re-encode** (0.10 bpp at 2560&times;1663) | Abstract hero background; divider; card backdrop | Partial |
| `Printing-press-BG-1.webp` | 1600&times;1194 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Slider-BG-1.webp` | 1500&times;850 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |

**Notes**

- `Printing-press-BG-1.jpg` &mdash; Flexo press line on a factory floor at 1.09 bpp &mdash; the best-preserved background you have. Needs a 55&ndash;65% dark scrim before any text goes over it.
- `Slider-2-test-scaled.webp` &mdash; Paper-roll plinths in warm cream against navy, with two small printed cartons. The largest asset in the library and the most brand-neutral backdrop &mdash; but the gradients are visibly banded at this compression.
- `Printing-press-BG-1.webp` &mdash; The same frame as the JPG at a quarter the data (0.30 bpp, sharpness 19 against 36). Re-derive the WebP from the JPG master instead of keeping this.
- `Slider-BG-1.webp` &mdash; Canon press on pure black at 0.058 bpp &mdash; 9 KB for 1500&times;850. Structurally the same content as `Printer.webp` at far worse quality; composite `Printer.webp` onto black instead.

## `assets/products/` &mdash; 13 files

Packaging photography. The most consistently usable folder: near-white studio grounds, clean silhouettes, real products. Almost all of it is 3D-showcase material.

*2 hero &middot; 3 portfolio &middot; 8 service*

| File | Px | Category | Background removal | Upscaling | Mockup / placement | 3D |
|---|---|---|---|---|---|---|
| `Corrugation.webp` | 1363&times;707 | **Hero** | Easy &mdash; near-white | &mdash; (good to ~1400px wide) | Packaging hero; “range of formats” banner | Partial |
| `open-wooden-black-box-floor.webp` | 800&times;534 | **Hero** | Keep &mdash; the wood is the mood | 2&times; &rarr; 1600px | Premium packaging hero; dark section banner | Partial |
| `Box-1.jpg` | 455&times;330 | **Portfolio** | Easy &mdash; flat #D5D5D5 | **3&times; &rarr; 1400px, or reshoot** | Packaging case study; rigid-box hero | Yes |
| `Drawer-Box-1.webp` | 980&times;799 | **Portfolio** | Easy &mdash; warm off-white | &mdash; (980px is workable) | Rigid-box case study; premium packaging | Yes |
| `Shoe-Box-New.webp` | 800&times;483 | **Portfolio** | Med &mdash; box shares the orange hue family | 2&times; &rarr; 1600px | Retail packaging case study; pattern feature | Yes |
| `box-file-New.webp` | 850&times;846 | Service | Easy &mdash; near-white | Re-encode, then use natively | Box-file / lever-arch card; office row | Partial |
| `Carton-Box.webp` | 500&times;494 | Service | Easy &mdash; pure #fff | 2.5&times; &rarr; 1400px | Carton / mono-carton card | Yes |
| `Convocaton-Files.webp` | 500&times;500 | Service | Med &mdash; open-folder shadow | 2&times; &rarr; 1400px | Convocation folder card; institutional section | Yes |
| `Customised-Files.webp` | 800&times;600 | Service | Easy &mdash; pure #fff | Re-encode, then 2&times; | Office files & folders card | Partial |
| `jewelry-box-Gift.webp` | 800&times;696 | Service | Easy &mdash; pure #fff | Re-encode, then 2&times; | Gift & jewellery box card; festive campaign | Yes |
| `Paper-Bag.webp` | 800&times;800 | Service | Easy &mdash; pure #fff | Re-encode, then 2&times; | Paper-bag card; retail packaging section | Yes |
| `Presentation-Samples.webp` | 500&times;500 | Service | Easy &mdash; pure #fff | 2&times; &rarr; 1400px | Sample-book / swatch card | Partial |
| `Telescope-Lids-1-1.webp` | 800&times;621 | Service | Easy &mdash; flat #D7D7D7 | **Re-encode urgently**, then 2&times; | Telescope / lid-and-base box card | Yes |

**Notes**

- `Corrugation.webp` &mdash; Twelve-plus printed carton formats in a single frame &mdash; the best “we make all of this” image in the library. On 5 pages already and worth more prominence still.
- `open-wooden-black-box-floor.webp` &mdash; Matte black magnetic-closure box open on warm wood. The only genuinely *moody* product shot in the library and the natural anchor for a dark hero band.
- `Box-1.jpg` &mdash; **Real branded client job** (ActiveSURE) with the lid open and an insert tray visible. Highest bpp in the whole library (2.85), so it upscales unusually well &mdash; but at 455&times;330 it is the smallest business image you have, and it is on 5 pages.
- `Drawer-Box-1.webp` &mdash; Four real rigid-box constructions &mdash; drawer, sleeve, perforated and patterned &mdash; in one frame. The strongest premium-packaging proof you own.
- `Shoe-Box-New.webp` &mdash; Patterned shoe box on a bold orange field &mdash; the most *designed* packaging shot you own. Keeping the orange as a brand-colour block is a defensible alternative to cutting it out.
- `Carton-Box.webp` &mdash; ⚠️ **Contains Amazon and Flipkart branded shipping cartons.** Acceptable as an illustration of the format; do not caption it in a way that implies those are your clients. Crop to the unbranded boxes if in any doubt.
- `Convocaton-Files.webp` &mdash; The leather certificate folder is real; the “ABC University” degrees inside it are placeholder art. Caption accordingly.
- `jewelry-box-Gift.webp` &mdash; Pastel gift box with an embossed rose and a ribbon &mdash; the most premium-feeling small-format shot. The ribbon edge needs a careful mask.
- `Paper-Bag.webp` &mdash; Kraft bags with printed offer art at four sizes. Handles cut out cleanly and the form is a natural 3D subject.
- `Presentation-Samples.webp` &mdash; A-frame sample stand &mdash; niche, but nothing else in the library shows this format.
- `Telescope-Lids-1-1.webp` &mdash; Two rigid lidded boxes with embossed detail &mdash; detail that the current 0.16 bpp encoding has erased.

## `assets/services/` &mdash; 49 files

The core library and the most mixed. Roughly half is genuine product photography; the rest is stock template art that must never be captioned as your own work.

*3 hero &middot; 3 portfolio &middot; 38 service &middot; 5 discard*

| File | Px | Category | Background removal | Upscaling | Mockup / placement | 3D |
|---|---|---|---|---|---|---|
| `8-Synthetic-Prints.webp` | 800&times;450 | **Hero** | Keep | 2&times; &rarr; 1600px | Wide-format hero; homepage capability strip | No |
| `Board-on-board-hard.jpg` | 2447&times;2447 | **Hero** | Easy &mdash; pure #fff, wide margin | &mdash; (largest asset you own) | Board-book hero; binding banner; sample carousel | Yes |
| `Hard.webp` | 1000&times;1000 | **Hero** | None &mdash; alpha, 66% transparent | &mdash; | **Primary 3D object.** Hero, configurator, loading state | Yes |
| `11-Answer-Sheets.webp` | 800&times;541 | **Portfolio** | Keep &mdash; the fan reads as volume | 2&times; &rarr; 1600px | Exam/OMR case study, institutional proof strip | No |
| `7-2-Silver-Line-Business-Card.webp` | 800&times;654 | **Portfolio** | Keep &mdash; slate + shadow sell it | 2&times; &rarr; 1600px | Business-card case study; Visiting Cards hero | Partial |
| `Greeting-1.webp` | 800&times;800 | **Portfolio** | Med &mdash; red bleeds to the edge | &mdash; | Wedding & invitation hero; festive campaign | No |
| `1-Books.webp` | 800&times;531 | Service | Easy &mdash; flat #fff | 2&times; &rarr; 1600px | Books service card, category tile | Partial |
| `10-Question-Papers.webp` | 571&times;401 | Service | Keep &mdash; context is the point | 2.5&times; &rarr; 1400px | Question-paper page banner, security section | No |
| `11-Book-Scanning.webp` | 640&times;425 | Service | Keep | 2.5&times; &rarr; 1600px | Book scanning / digitisation row | No |
| `2-Brochure.webp` | 1000&times;546 | Service | Easy &mdash; solid #F0B31F | &mdash; | Brochure card &mdash; **swap in real client art** | Partial |
| `3-Stickers.webp` | 800&times;800 | Service | Easy &mdash; flat yellow | &mdash; | Sticker tile; badges cut out as UI accents | No |
| `4-1-Certificate.webp` | 1000&times;615 | Service | Med &mdash; soft gradient ground | &mdash; | Certificate card; replace when real work is shot | Partial |
| `6-Label.webp` | 800&times;800 | Service | Easy &mdash; pure #000 field | &mdash; | Label tile; badges cut out individually | No |
| `9-Print-On-Demand.webp` | 1000&times;667 | Service | Keep | &mdash; | Print-on-demand row; “how it works” step 1 | No |
| `Bill-Pouch.webp` | 800&times;600 | Service | Easy &mdash; pure #fff | Re-encode, then 2&times; | Bill-pouch product card | Partial |
| `Black-wiro-binding.webp` | 900&times;900 | Service | Med &mdash; black-on-white edges | &mdash; | Wiro card; binding comparison grid | Yes |
| `board-Book-1-New.webp` | 800&times;521 | Service | Easy &mdash; pure #fff | 2&times; &rarr; 1600px | Board-book card; fanned-pages feature | Yes |
| `board-Rounded.webp` | 1500&times;1500 | Service | Easy &mdash; pure #fff | **Re-encode urgently** | Children's board book; rounded-corner feature | Yes |
| `books.webp` | 1000&times;1000 | Service | Easy &mdash; soft ground shadow | Re-encode, then use natively | Book printing secondary; category tile | Yes |
| `Brochure-2.webp` | 800&times;800 | Service | Easy &mdash; flat #D8D8D8 | &mdash; | Brochure grid, second tile | Partial |
| `Brochure-3.webp` | 800&times;800 | Service | Easy &mdash; flat lavender | &mdash; | Brochure grid, third tile | Partial |
| `Business-Cards.webp` | 800&times;800 | Service | Easy &mdash; flat grey + cast shadow | &mdash; | **Use as a mockup base** &mdash; perspective already correct | Partial |
| `Calendar-1.webp` | 800&times;800 | Service | Easy &mdash; flat terracotta | &mdash; | Calendar card &mdash; **regenerate for the current year** | Partial |
| `Center-Pinning.webp` | 568&times;382 | Service | Keep &mdash; the staple is visible | 2.5&times; &rarr; 1400px | Centre-pin / saddle-stitch card | Partial |
| `Certificate-2.webp` | 1079&times;759 | Service | Med &mdash; blue silk gradient | &mdash; | Certificate secondary; awards section | No |
| `Curve-rounded-binding.webp` | 1000&times;716 | Service | Easy &mdash; flat #E4E4E3 | &mdash; | Binding explainer &mdash; **rebuild labels as HTML** | No |
| `Flyer.webp` | 800&times;800 | Service | Easy &mdash; flat taupe | &mdash; | Flyer / leaflet card | Partial |
| `Gold-wiro-binding-1.webp` | 850&times;880 | Service | Keep &mdash; desk grounds it | Re-encode first, then 2&times; | Gold wiro card; premium-finish section | Yes |
| `Hard-2.webp` | 800&times;800 | Service | None &mdash; already alpha | &mdash; | Book-cover card; floats over any brand colour | Yes |
| `Identity-1.webp` | 800&times;800 | Service | Med &mdash; lanyard shadow | &mdash; | ID card / badge card | Partial |
| `Magnet-Lock.webp` | 800&times;800 | Service | Easy &mdash; flat cream | &mdash; | Diary feature explainer &mdash; **callouts to HTML** | Partial |
| `Menu-1.webp` | 800&times;800 | Service | Easy &mdash; flat orange | &mdash; | Menu printing card | Partial |
| `Menus.webp` | 800&times;800 | Service | Easy &mdash; pure #fff | **Re-encode urgently**, then 2&times; | Menu-cover card; leather-finish sampler | Yes |
| `Perfect-Binding.webp` | 1289&times;800 | Service | Keep | Re-encode, then 2&times; | Perfect-binding service card | No |
| `Perfect.webp` | 800&times;534 | Service | None &mdash; already alpha | &mdash; | Board/greyboard explainer; substrate section | Partial |
| `pin-perfect-binding.webp` | 500&times;500 | Service | Easy &mdash; pure #fff | 2.5&times; &rarr; 1400px | Pin + perfect binding comparison card | Partial |
| `Price-tag.webp` | 569&times;500 | Service | Easy &mdash; flat off-white | 2.5&times; &rarr; 1400px | Tags & labels card; tags as UI accents | No |
| `Pu-Leather-2.webp` | 800&times;600 | Service | Easy &mdash; pure #fff | 2&times; &rarr; 1600px | PU-leather diary card; corporate gifting | Yes |
| `Rexin-Binding.webp` | 800&times;540 | Service | Keep &mdash; warm desk | **Reshoot** &mdash; sharpness 15.8 will not recover | Rexin binding card | Partial |
| `Rounded-Hard-Case.webp` | 800&times;558 | Service | Easy &mdash; near-white | Re-encode, then 2&times; | Rounded hard-case binding card | Yes |
| `Special-Sheets.webp` | 800&times;788 | Service | Easy &mdash; near-white | 2&times; &rarr; 1600px | Disc-bound / refill card; exploded-parts animation | Partial |
| `stitching-perfect-binding.webp` | 600&times;600 | Service | Med &mdash; open pages are fiddly | 2.5&times; &rarr; 1400px | Section-sewn card; durability explainer | No |
| `White-wiro-binding.webp` | 612&times;459 | Service | Keep | 2.5&times; &rarr; 1400px | White wiro card; comparison grid | Yes |
| `wiro-binding.webp` | 900&times;576 | Service | Easy &mdash; pure #fff | Re-encode, then 2&times; | Wiro card; stationery range | Yes |
| `5-Book-Cover.webp` | 800&times;1131 | ~~Discard~~ | &mdash; | &mdash; | Rebuild as an HTML hero block | No |
| `Digital-BW-Featured.webp` | 1920&times;1080 | ~~Discard~~ | &mdash; | &mdash; | Rebuild as a CSS layout | No |
| `gold-wiro-binding.webp` | 850&times;925 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Offset-Featured.webp` | 1920&times;1080 | ~~Discard~~ | &mdash; | &mdash; | Rebuild as an HTML hero block | No |
| `Printing-Featured-Image.webp` | 1920&times;1080 | ~~Discard~~ | &mdash; | &mdash; | Rebuild as a CSS layout | No |

**Notes**

- `8-Synthetic-Prints.webp` &mdash; Sharpest image in the entire library (60). A saturated press-in-motion frame &mdash; the strongest “we actually print” evidence you own at this size.
- `Board-on-board-hard.jpg` &mdash; **6 MP &mdash; roughly 14&times; the folder median.** The only file with the resolution for a full-bleed desktop hero with no upscaling at all. Currently used on a single page. Badly underexploited.
- `Hard.webp` &mdash; A hardcover render already carrying the **Thoorigai mark on the cover**, at 1000&times;1000 with transparency. Own-brand, dimensional, no cut-out needed &mdash; the single best asset for a rotating 3D hero.
- `11-Answer-Sheets.webp` &mdash; Genuine OMR answer sheets &mdash; real production output, and the sharpest file in the folder (56). Currently rendered on **zero** pages. Promote it.
- `7-2-Silver-Line-Business-Card.webp` &mdash; **Real client job** (H K Nath Metals) with a metallic/spot treatment visible. Get written permission before featuring a named client.
- `Greeting-1.webp` &mdash; Red-and-gold Indian invitation: sharpness 61 at 1.08 bpp, the best-preserved file in the folder and the most on-market image for your region. Confirm it is your own artwork before crediting it as a sample.
- `10-Question-Papers.webp` &mdash; Operator-at-press shot that sells the *process*, not the product. Smallest of the four exam-print images &mdash; upscale before any wide use.
- `11-Book-Scanning.webp` &mdash; On-topic but stock-feeling, and unused. Keep only if scanning stays in the service list.
- `9-Print-On-Demand.webp` &mdash; Hands-on-artwork shot covering the design/prepress step nothing else in the library shows.
- `Black-wiro-binding.webp` &mdash; Real binding close-up with visible gold loops. Strong candidate for a rotating 3D binding sampler.
- `board-Book-1-New.webp` &mdash; Fanned multi-colour board book &mdash; the most dimensional silhouette in the folder, and already on 5 pages. Excellent 3D subject.
- `board-Rounded.webp` &mdash; 1500&times;1500 for 30 KB. The resolution is there; the detail has been compressed out of it. Re-encode from source &mdash; no upscaling needed.
- `Business-Cards.webp` &mdash; This is a mockup render, not a photograph. Its real value is as a template: drop actual client card artwork onto the existing perspective and shadow.
- `Calendar-1.webp` &mdash; The wall calendar is dated **2025**. Shipping a stale year on a printing site reads as an abandoned business. Re-render, or crop the date grid out entirely.
- `Center-Pinning.webp` &mdash; Real product on 5 pages, but the smallest workhorse in the set at 568px. Upscale or reshoot before enlarging.
- `Certificate-2.webp` &mdash; Stock AI-course certificate. Highest bpp in the folder (1.30) so it upscales well, but the subject is off-brand.
- `Curve-rounded-binding.webp` &mdash; The most educational image you own: it shows a spine difference a customer cannot otherwise picture. The baked-in red “Rounded / Standard” labels should become live text for search and translation.
- `Gold-wiro-binding-1.webp` &mdash; Real gold-loop binding on warm wood. Badly over-compressed at 0.17 bpp &mdash; re-encode from the original before doing anything else with it.
- `Hard-2.webp` &mdash; Clean 3D hardcover render with transparency &mdash; ideal for a “design your cover” interactive where the front-face texture is swapped.
- `Magnet-Lock.webp` &mdash; Useful feature diagram (strap lock, binding ring, round corner, card pocket) with all four labels baked in. Right information, wrong container.
- `Menus.webp` &mdash; Real leather menu covers with gold corners &mdash; compressed to 7 KB at 0.095 bpp, the lowest in the library. The leather grain is simply gone. Re-encode from source or reshoot.
- `Perfect-Binding.webp` &mdash; Open-book shot used on 5 pages, but the softest of the binding set (21) at 0.14 bpp. Re-encode before enlarging.
- `Perfect.webp` &mdash; Nested greyboard sheets showing thickness options &mdash; genuinely informative about materials, and currently unused.
- `Pu-Leather-2.webp` &mdash; Two-tone diary, cleanly lit, clean silhouette. A strong 3D-configurator candidate for the gifting range.
- `Rexin-Binding.webp` &mdash; Real rexin hardbound on a desk, but the softest real photograph in the folder. It is on 4 pages, which makes a fresh shot worth the trip.
- `Special-Sheets.webp` &mdash; Multi-item flat-lay (cover, discs, index tabs). Each element cuts out separately, which makes an exploded-parts animation cheap to build.
- `stitching-perfect-binding.webp` &mdash; Open spine showing the sewn signature &mdash; the clearest illustration of stitched binding in the library.
- `5-Book-Cover.webp` &mdash; Marketing creative with headline, body copy, social icons and the URL **baked into the pixels** &mdash; invisible to search, untranslatable, soft on retina displays. Rebuild the layout in markup over a clean photo.
- `Digital-BW-Featured.webp` &mdash; Cut-out collage on transparency &mdash; a printer, blob shapes and three photos pasted together. It floats as a mess on any background other than the original. Rebuild from the component photos.
- `gold-wiro-binding.webp` &mdash; Near-duplicate of `Gold-wiro-binding-1.webp` at half the quality (0.10 bpp) and never rendered. Keep the `-1` version only.
- `Offset-Featured.webp` &mdash; Collage with “All types of Offset Printing Available” set in a script face and baked into the pixels. Invisible to search, illegible small. Replace with a real press photo plus live headline text.
- `Printing-Featured-Image.webp` &mdash; Third collage of the same kind &mdash; printer, ID cards, menu and certificate pasted onto transparency with blob shapes. Same failure mode as the other two.

## `assets/logos/` &mdash; 10 files

One production mark and nine drafts or build artefacts.

*1 hero &middot; 1 service &middot; 8 discard*

| File | Px | Category | Background removal | Upscaling | Mockup / placement | 3D |
|---|---|---|---|---|---|---|
| `Logo-Original.png` | 472&times;317 | **Hero** | None &mdash; alpha clean | **Vectorise, not upscale** | Letterhead, van livery, shop board, belly band | No |
| `Fav-512x512-1.png` | 512&times;512 | Service | None | No &mdash; regenerate from SVG | Favicon set 16&ndash;512px, social avatar | No |
| `cropped-Fav-2-512x512-1.png` | 512&times;512 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `cropped-Fav-3-512.png` | 512&times;512 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `cropped-Fav-4.png` | 512&times;512 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `cropped-Fav-512x512-1.png` | 512&times;512 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Fav-2-512x512-1.png` | 512&times;512 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Fav-3-512.png` | 512&times;512 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Fav-4.png` | 512&times;512 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |
| `Logo-Header.png` | 350&times;100 | ~~Discard~~ | &mdash; | &mdash; | &mdash; | No |

**Notes**

- `Logo-Original.png` &mdash; The only production mark on the site, used on 39 pages at 472&times;317. Every downstream asset &mdash; favicon set, watermark, 3D cover art &mdash; should be regenerated from a new SVG retrace, not from this PNG.
- `Fav-512x512-1.png` &mdash; Cleanest feather-only glyph. Keep as the reference for the retrace, then replace.
- `cropped-Fav-2-512x512-1.png` &mdash; All four `cropped-*` files are WordPress site-icon auto-crops &mdash; pure build artefacts. They die with the CMS.
- `Fav-2-512x512-1.png` &mdash; `Fav-2`, `Fav-3` and `Fav-4` are abandoned colourway drafts (tan and navy variants of the feather). None was ever rendered. Archive, do not ship.
- `Logo-Header.png` &mdash; Superseded 350&times;100 lockup, unused. Archive offline as a proportion reference only.

## `assets/icons/` &mdash; 22 files

Phosphor Icons shipped with the theme, all SVG, all under 1 KB. None is tracked as rendered because
the theme injects them through CSS. They are generic, so the redesign can adopt any icon set without
loss &mdash; but Phosphor is a reasonable default and these are already on disk.

*18 service &middot; 4 discard*

| Files | Category | Background removal | Upscaling | Mockup / placement | 3D |
|---|---|---|---|---|---|
| `arrow-right-11` `arrow-up-bold-4` `caret-circle-right` `caret-left-bold-8` `caret-right-bold-4` `dot-outline-fill` `dots-three-circle-1` `list-bold-4` `magnifying-glass-bold-4` `x-bold-4` | Service | N/A &mdash; vector | **Never** &mdash; scales natively | Navigation, carousels, accordions, search | No |
| `calendar-check` `certificate` `envelope-2` `envelope-simple-2` `flag-banner-fold-light-2` `headset-4` `question-7` `user-circle-check-light` | Service | N/A &mdash; vector | **Never** | Service features, FAQ, contact, trust badges | No |
| ~~`chart-bar-light-2`~~ ~~`head-circuit-light-3`~~ ~~`microscope-light`~~ ~~`monitor-play`~~ | ~~Discard~~ | &mdash; | &mdash; | AI/SaaS theme icons with no printing use | No |

**Notes**

- Set `fill="currentColor"` on all of them so a single CSS variable drives icon colour across light and dark themes. Several currently carry hard-coded hex fills.
- These are the only assets in the library that are resolution-independent. Anywhere an icon can do the job of a small image, it should.

---

## `assets/_theme-demo-unused/` &mdash; 54 files, 6.2 MB

*54 discard*

Leftovers from the purchased WordPress theme's demo content: coffee cups, popcorn, lemons, honey
branding, a bottle render, decorative leaves, an OpenAI logo, and 20 numbered `landsc-3x2-*` /
`portr-1x1-*` filler photographs. Not one is a printing asset, and not one was ever rendered on a
public page.

| Recommendation | |
|---|---|
| **Background removal** | &mdash; |
| **Upscaling** | &mdash; |
| **Mockup placement** | &mdash; |
| **3D showcase** | No |
| **Action** | Delete the folder. It is 63% of the library's total weight (6.2 MB of 9.8 MB) and 0% of its value. |

The one caveat: `logo-ai-7-dark-top-4.svg` and `logo-ai-7-light-bottom.svg` are the *theme vendor's*
logo, not yours. Removing them is not just cleanup, it avoids shipping another company's mark.

---

## What the library does not contain

Categorisation can only sort what exists. Four things are missing that no amount of processing will produce:

| Gap | Why it matters | Cheapest fix |
|---|---|---|
| **People at work** | Two images show a human being. A print shop is a craft business, and craft businesses sell on the people doing the work. | One hour on the floor with a phone in good light. |
| **The premises** | Nothing establishes that Thoorigai is a real place in Madurai. `Technology.jpg` and `Printing-press-BG-1.jpg` are generic press halls of unverified origin. | Exterior, reception, and one wide shot of the floor. |
| **Scale and finish detail** | No macro shots of foiling, embossing, spot UV or paper texture &mdash; the things that justify a premium price. | Macro pass over samples already on the shelf. |
| **Before/after or in-use** | Every product sits alone on white. Nothing shows a box in a shop, a menu on a table, or a diary in a hand. | Stage three or four existing samples in context. |

The four named client jobs already in the library &mdash; Prasar Bharati, ActiveSURE, LADORN U,
H K Nath Metals &mdash; are the obvious subjects for that shoot, since the credential already exists and
only the photograph is inadequate.

---

## Processing pipeline

**Order of operations.** Doing these out of order wastes work: re-encoding after upscaling bakes in
the upscaler's artefacts, and cutting out before re-encoding means masking against compression noise.

1. **Re-export** from source at quality 82&ndash;88 WebP (38 files need this).
2. **Cut out** where the table says so &mdash; save the mask, not just the flattened result.
3. **Upscale** only what is still short of its target long edge.
4. **Derive** responsive sizes: 400 / 800 / 1200 / 1600 / 2400px.
5. **Write alt text.** All 168, at the point each image is placed.

**Target long edges**

| Use | Long edge | Notes |
|---|---|---|
| Full-bleed hero | 2400&ndash;2560px | Only 2 files reach 3 MP natively; the rest need upscaling or reshooting. |
| Section banner | 1600px | |
| Card / tile | 800px | Where most of this library already sits. |
| Thumbnail | 400px | |
| Icon | vector | Never rasterise. |

**Format.** WebP for photography with an AVIF sibling where the build supports it; SVG for the logo,
the feather motif and all icons. Keep a lossless master of anything that gets cut out &mdash; alpha edges
degrade badly through repeated lossy round-trips.

**Cut-outs.** Save the alpha mask separately from the composite. Every `Easy` file in this guide sits
on a near-uniform ground, so a mask made once can be reused when the source is re-encoded or reshot.

**3D showcase.** The realistic order of attack, given what exists:

1. `Hard.webp` &mdash; already transparent, already carries your mark, already dimensional. Start here.
2. `board-Book-1-New.webp`, `Paper-Bag.webp`, `wiro-binding.webp`, `Drawer-Box-1.webp` &mdash; clean silhouettes on white, straightforward to model as stand-ins.
3. `Steps-New-1.webp` / `Steps-New-2.webp` &mdash; already 3D renders. If the source scene files still exist, they are worth more than the exported frames.

Nineteen files are marked `Yes` for 3D. That is enough for a configurator across packaging and
binding, but every one is a *single* view &mdash; genuine photogrammetry needs a turntable pass, which is
another argument for the reshoot.

---

## Legal and accuracy flags

| File | Flag |
|---|---|
| `Carton-Box.webp` | Contains **Amazon** and **Flipkart** branded cartons. Fine as a format illustration; do not imply they are clients. |
| `Canon-Image.webp`, `Printer.webp`, `Slider-BG-1.webp` | **Canon** production presses. Only claim these as your equipment if you run them. |
| `Technology.jpg`, `Printing-press-BG-1.jpg` | Press halls of unverified origin. Do not caption as "our facility" without confirming provenance. |
| `Greeting-1.webp` | Confirm this is your own artwork before presenting it as a sample. |
| `7-2-Silver-Line-Business-Card.webp`, `Box-1.jpg`, `1-Slide-1-Image-3.webp`, `Page2-Img-1.webp` | Named client work. Get written permission before featuring the client name. |
| `Convocaton-Files.webp`, `4-1-Certificate.webp` | Placeholder "ABC University" / stock certificate art inside a real folder. Caption precisely. |
| `Calendar-1.webp` | Dated **2025**. Regenerate or crop the date grid. |
| Theme vendor logos in `_theme-demo-unused/` | Another company's mark. Delete. |

---


---

## Summary

| | Hero | Portfolio | Service | Discard | Total |
|---|---|---|---|---|---|
| `gallery/` | 6 | 2 | 3 | 5 | 16 |
| `backgrounds/` | 2 | 0 | 0 | 2 | 4 |
| `products/` | 2 | 3 | 8 | 0 | 13 |
| `services/` | 3 | 3 | 38 | 5 | 49 |
| `logos/` | 1 | 0 | 1 | 8 | 10 |
| `icons/` | 0 | 0 | 18 | 4 | 22 |
| `_theme-demo-unused/` | 0 | 0 | 0 | 54 | 54 |
| **Total** | **14** | **8** | **68** | **78** | **168** |

Discarding 78 files removes 46% of the library and the great majority of its weight, while losing
nothing that is rendered on a page today except four collages that should be rebuilt as markup anyway.

The harder number is the second column. Eight portfolio-grade images, three of them under 500px, is
a thin evidence base for a printing business with a Government of India credential on its shelf.
Processing the existing library is a week's work; the reshoot is a day, and it is worth more.
