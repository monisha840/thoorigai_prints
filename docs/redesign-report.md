# Redesign Preparation Report - thoorigaiprints.com

Prepared 21 August 2026, following a full crawl and asset extraction. Companion documents: [content-audit.md](content-audit.md), [sitemap.md](sitemap.md), [image-inventory.md](image-inventory.md).

---

## Executive summary

Thoorigai Prints has a real business behind a website that does almost none of the selling. The current site is a well-photographed catalogue with the words missing: **eleven of the seventeen commercial pages carry under 250 characters of body text**, and the busiest page on the site, `/printing/`, has 195 characters spread across fifteen headings.

The good news is that the raw material is stronger than the site suggests. There are roughly 115 genuine product photographs, a clear and sensible service taxonomy (Printing / Packaging / Binding), a memorable tagline, and an About page that tells a real founder story in five short paragraphs. The redesign is largely a job of **writing the missing copy and rebuilding the structure**, not of finding new substance.

The bad news is that the site is carrying a significant amount of theme demo residue that has been publicly live for over a year: nine Lorem Ipsum blog posts, seven fabricated testimonials attributed to invented people, and a complete AI-course landing page at `/home-ai-2/`. All of it is indexable. Removing it is the first task, and it is urgent independent of the redesign.

**The three highest-impact fixes, in order:**

1. Write real product copy. Every tile on the site is a photograph with a two-word label.
2. Put a form, a map, and consistent contact details on the contact page. Right now the highest-intent page is a dead end with an address block on it.
3. Delete the placeholder content and fix the three conflicting phone numbers.

---

## 1. Content to retain

Retain means keep the substance. Nearly all of it still needs editing for tone and length.

### Retain as-is or with light edits

| Content | Where it lives now | Why it survives |
|---|---|---|
| **Tagline: "Ink Your Vision..! Print Your Success..!"** | Footer | Genuinely memorable and ownable. Drop the doubled exclamation marks and it works as a brand line. |
| **Service taxonomy: Printing / Packaging / Binding** | Navigation | Clean, mutually exclusive, and matches how print buyers actually shop. Keep the three-pillar structure. |
| **Founder story: Mr. R. Ambeth, 15+ years' experience** | About Us | The strongest differentiator on the site, and currently buried on the least-visited page. Promote it to the homepage. |
| **Full product list (43 named items)** | Scattered across H4 tile labels | The catalogue itself is comprehensive and accurate. Retain every item; give each one a description. |
| **"Our Commitments" four pillars** | Homepage | Leading Technology, Best Designs, On Time Delivery, Affordable Price. Sound positioning with one usable sentence each. |
| **The four FAQs** | Homepage | Real questions with real answers, particularly "I am an Individual. Will You do my design?" which handles a genuine objection. Expand from four to ten or twelve. |
| **Address: Nayar Vardha Pillai St, Balaji Nagar, Royapettah, Chennai 600014** | Contact Us | Verify, then publish consistently in the footer, the contact page, and a LocalBusiness schema block. |
| **Email: sales@thoorigaiprints.com** | Footer | Retain. Also surface it on the contact page, where it currently does not appear. |
| **Quote form field structure** | Homepage popup | Name / Mobile / Email / Service / Requirements is the right set of fields. Retain the structure, fix the labelling. |

### Retain the intent, rebuild the execution

| Content | Problem | Action |
|---|---|---|
| Homepage hero | Two competing H1s, no single proposition | One H1, one promise, one CTA |
| "From Start-Ups to Big Brands" | Good claim, zero evidence | Retain the line, add a client logo wall behind it |
| "Technology We Possess" | Heading with nothing beneath it | Retain the section, fill it with the actual machine list |
| Process diagram (`Steps-New-2.webp`) | Flattened raster image | Retain the concept, rebuild as vector or animated sequence |
| Terms & Conditions, Cookie Policy | Generic boilerplate | Retain as a base, have the client's advisor confirm entity name and Indian jurisdiction |

---

## 2. Content to rewrite

### Must be written from nothing

These pages have no meaningful copy at all. This is the bulk of the writing work.

| Page | Current text | Needed |
|---|---|---|
| `/printing/` | 195 chars | 400-600 words: offset vs digital explained, when to choose each, run lengths, stocks, finishes, turnaround |
| `/packaging/` | 230 chars | 400-600 words: materials, GSM, structural options, food-grade vs retail, MOQs |
| `/binding/` | 417 chars | 400-600 words: how to choose by page count, durability, and budget |
| `/digital-multicolour/` | 124 chars | 300+ words unique to digital colour work |
| `/digital-black-and-white/` | 59 chars | 300+ words. Currently the thinnest page on the site |
| `/offset-multicolour/` | 122 chars | 300+ words unique to offset colour work |
| `/offset-black-and-white/` | 58 chars | 300+ words. The thinnest page on the site |
| `/corrugation-box/` | 164 chars | 300+ words: ply, flute types, burst strength, sizing |
| `/carton-box/` | 164 chars | 300+ words: board types, lamination, die-cutting |
| `/paper-bag/` | 164 chars | 300+ words: handle types, load ratings, sizes |
| `/hard-case-binding/` | 210 chars | 300+ words: cover materials, foiling, page limits |
| `/perfect-binding/` | 145 chars | 300+ words: spine widths, adhesives, page counts |
| `/wiro-binding/` | 115 chars | 300+ words: loop sizes, colour options, capacity |
| `/center-pin/` | 169 chars | 300+ words: page limits, ideal use cases |
| `/contact-us/` | 106 chars | Full contact page: form, map, hours, directions, parking, WhatsApp |

Plus **43 product descriptions**, one for each currently-unlabelled tile, of roughly 40-60 words each.

### Rewrite existing copy

| Content | Issue |
|---|---|
| **About Us** | Substance is good, markup is broken: the entire story is inside five `<h5>` tags. Rewrite as prose, reconcile the "15 years' experience" and "inception in 2010" claims, and add a founder photograph. |
| **All 24 title tags** | Currently `Page Name – Thoorigaiprints`. Needs keyword and location intent: "Offset Printing in Chennai \| Thoorigai Prints". |
| **All 24 meta descriptions** | None exist. Every page needs one. |
| **All 168 image alt attributes** | Every one is empty. |
| **Footer copyright** | Hard-coded to 2025. Make it dynamic. |

### Delete outright

| Content | Count | Reason |
|---|---|---|
| Blog posts | 9 | Entirely Lorem Ipsum with placeholder titles |
| Testimonial records | 7 | Fabricated, attributed to invented individuals, with stock portraits. **Publishing invented testimonials attributed to named people carries real exposure under India's consumer protection rules on misleading advertising.** Remove before anything else. |
| `/home-ai-2/` | 1 page | A complete AI-course landing page, publicly indexable, unrelated to the business |
| `/sample-page/` | 1 page | WordPress default placeholder text |
| `/maintenance/` | 1 page | Theme demo splash carrying a third-party logo |
| `/demo-design-system/` | 1 page | Theme scaffolding exposed publicly |
| `/home/` | 1 page | Duplicate front page; redirect to `/` |

### Fix immediately, regardless of redesign timeline

1. **Three live phone numbers.** `99626 04017` in the footer and on the contact page, `7871451004` in the header `tel:` link, `7708298673` in the WhatsApp widget. Confirm which is correct and standardise. Two of these are silently losing enquiries today.
2. **Footer "Privacy Page" links to `/404`.** No privacy policy exists on the site.
3. **No form on the contact page.**

---

## 3. Images to retain

All 168 images were downloaded and organised. Full detail in [image-inventory.md](image-inventory.md).

```
assets/logos/               10 files    247 KB
assets/services/            49 files  2,153 KB
assets/products/            13 files    352 KB
assets/gallery/             16 files    571 KB
assets/backgrounds/          4 files    383 KB
assets/icons/               22 files      8 KB
assets/_theme-demo-unused/  54 files  6,343 KB   ← not for reuse
```

### Retain and reuse

| Asset | Dimensions | Use in redesign |
|---|---|---|
| `Board-on-board-hard.jpg` | 2447x2447 | The only asset with real zoom headroom. Hero close-up, or a texture map on a 3D book model. |
| `board-Rounded.webp` | 1500x1500 | Binding detail, strong quality |
| `Printing-press-BG-1.webp` | 1600x1194 | Full-bleed hero backdrop. Currently unused, which is a waste. |
| `Technology.jpg` | 1920x1080 | Fills the empty "Technology We Possess" section |
| `Canon-Image.webp` | 1330x803 | Real equipment proof for a machinery strip |
| `Printer.webp` | 1000x750 | Press detail |
| `Printing-Featured-Image.webp` | 1920x1080 | Section header |
| `Offset-Featured.webp` | 1920x1080 | Section header |
| `Digital-BW-Featured.webp` | 1920x1080 | Section header |
| `Corrugation.webp` | 1363x707 | Best packaging shot in the set |
| `Perfect-Binding.webp` | 1289x800 | Binding detail |
| The 10 printing product shots (`1-Books` through `Menu-1`) | 800-1000px | Grid tiles. Adequate for cards, not for full-width use. |
| The packaging set (`Carton-Box`, `Paper-Bag`, `Drawer-Box-1`, `jewelry-box-Gift`, and similar) | 500-980px | Grid tiles only |

### Retain as reference only

`Logo-Original.png` (472x317) is the production mark but must be **redrawn as SVG**. It is the brand's only logo file, it is raster, it has baked-in whitespace, and it cannot be animated cleanly or rendered sharply on retina displays. Redrawing it is a prerequisite for any premium treatment.

The four `Fav-*.png` files and their four WordPress crops are eight variants of one favicon. Keep one as reference; regenerate the icon set from the new SVG.

### Do not reuse (54 files)

Everything in `assets/_theme-demo-unused/`: the `landsc-3x2-w*` stock landscapes attached to the fake blog posts, the `portr-1x1-*` stock portraits attached to the fake testimonials, the `logo-ai-7-*` and `open-ai-logo` marks belonging to another product entirely, the `93_*` food-and-drink slider set, and the theme's Phosphor icon library. These were downloaded rather than discarded so the client can confirm before deletion.

### Resolution ceiling

Nine currently-rendered product shots are under 700px wide, including `Center-Pinning.webp` at 568x382, `Price-tag.webp` at 569x500, `10-Question-Papers.webp` at 571x401, and `White-wiro-binding.webp` at 612x459. These will not survive enlargement into a premium layout, a lightbox, or a 3D texture map. **This is the hard constraint on how ambitious the redesign visuals can be without a re-shoot.**

---

## 4. Missing assets

Listed in rough order of commercial impact.

### Blocking

| Missing | Why it blocks |
|---|---|
| **SVG logo** | Cannot do a premium or 3D-animated brand treatment from a 472px raster |
| **Founder and team photography** | The About page's entire argument rests on Mr. R. Ambeth's experience, with no photograph of him |
| **Real testimonials** | All seven on file are fabricated and must be deleted, leaving zero social proof |
| **Client logos** | The homepage claims "From Start-Ups to Big Brands" with nothing to back it |
| **Privacy policy** | Linked from the footer, does not exist |

### High value

| Missing | Note |
|---|---|
| **Facility and press-floor photography** | Two usable machine shots exist. A print buyer choosing a vendor wants to see the plant and the finishing line. |
| **Portfolio / case studies** | Every product shot is a generic object photo. No evidence of actual delivered work. |
| **Rigid box photography** | Telescope lids, drawer style, hinged lids and magnetic boxes are the premium range, each represented by one small thumbnail. |
| **Open Graph images** | No `og:image` on any page, so every shared link renders blank. |
| **Business hours** | Not published anywhere. |
| **Machine and capability list** | Needed to fill the empty "Technology We Possess" section. |

### Supporting

Paper stock and swatch photography · finish samples (spot UV, foiling, emboss, lamination) · scale and volume shots · quality control imagery · a designed 404 page · video of the press running · GST and registration details for the footer.

---

## 5. Opportunities for a premium 3D redesign

The strategic case for 3D here is unusually strong. Print is a **tactile** product sold through a flat screen. Thickness, texture, foil, spine, flute, and finish are exactly what a buyer wants to judge and exactly what a 2D photograph cannot convey. Every one of the 43 catalogue items is a physical object with real geometry.

### Where 3D earns its place

**1. Configurable product viewers.** The single highest-value application. A buyer selecting a hard case binding wants to see PU leather against rexin, matte against gloss, gold foil against silver, before committing. One 3D model with swappable materials replaces a dozen photographs and does a job photography cannot: direct comparison. Highest-return candidates are hard case binding (8 material variants), rigid boxes (6 structural types), paper bags (handle and size options), and wiro binding (gold, black, white).

**2. An exploded packaging view.** Corrugated board is sold on ply count and flute type, which is precisely the kind of thing a cutaway animation explains in three seconds and a paragraph never quite manages. The same treatment works for a perfect-bound spine cross-section.

**3. A binding-type comparison.** Four binding methods currently sit as flat thumbnails with no explanation of when to choose which. A single interactive scene showing all four books, with page-count thresholds appearing as the user scrolls, converts the site's weakest content area into its strongest.

**4. A scroll-driven press sequence.** The "Steps-New-2" process diagram is a flattened raster of a genuinely good idea. As a scroll-linked 3D sequence following a sheet from plate to press to finishing to bound product, it becomes the homepage's signature moment and fills the empty "Technology We Possess" section at the same time.

**5. Material and finish close-ups.** Spot UV, foiling, emboss and lamination are invisible in a flat photograph. Real-time lighting on a 3D surface makes them obvious, and they are typically the upsell.

**6. A hero the site currently lacks.** `Printing-press-BG-1.webp` is sitting unused in the media library. Behind a subtle 3D foreground element with parallax, it gives the homepage a hero worth the name.

### What has to happen first

3D will expose weak inputs rather than hide them. In practical order:

1. **Redraw the logo as SVG.** Prerequisite for everything.
2. **Commission product photography on a neutral cyclorama**, shot for 3D reference: multiple angles, consistent lighting, and flat texture captures of PU leather, rexin, kraft, and corrugated board. The nine sub-700px assets cannot be salvaged any other way.
3. **Write the copy.** A 3D viewer with a two-word label underneath is still a site with no words on it. The writing is the larger job and it gates the visual work.
4. **Set a performance budget before modelling begins.** A significant share of the target audience is on mid-range Android over mobile data in Chennai. Every 3D scene needs a static fallback, lazy loading below the fold, and a hard cap on model complexity. A premium site that takes twelve seconds to load is not a premium site.
5. **Respect `prefers-reduced-motion`** on every scroll-driven sequence.

### Recommended scope

| Priority | Element | Effort | Return |
|---|---|---|---|
| 1 | Hard case binding material configurator | High | Highest. Premium product, eight variants, real buyer uncertainty. |
| 2 | Homepage scroll-driven press sequence | High | Signature moment, fills an empty section |
| 3 | Binding comparison scene | Medium | Converts the weakest content area on the site |
| 4 | Rigid box structural viewer | Medium | Premium packaging range, currently under-sold |
| 5 | Corrugated cutaway | Low | Explains a technical spec quickly |
| 6 | Material and finish close-ups | Low | Straightforward upsell support |

Elements 1 and 2 alone would differentiate the site from every competitor in the Chennai print market, which is uniformly served by flat catalogue sites.

---

## 6. Suggested sequence

**Do now, before any design work**

- Delete the 7 fabricated testimonials, the 9 Lorem Ipsum posts, and the 4 orphan pages
- Resolve the three phone numbers to one
- Publish a privacy policy and fix the footer link
- Add a form to the contact page

**Phase 1 - Content**

- Write 15 pages of service and product copy, plus 43 product descriptions
- Write 24 title tags and 24 meta descriptions
- Write 168 alt attributes
- Collect genuine client testimonials and permission to display client logos

**Phase 2 - Assets**

- Redraw the logo as SVG, regenerate the icon set
- Commission product, facility, founder, and material-reference photography

**Phase 3 - Structure**

- Nest the URLs, set real parent relationships, add breadcrumbs, plan the 301 map
- Give each child page unique content, or fold it into the parent hub

**Phase 4 - Design and 3D**

- Build to the performance budget, static fallbacks first, 3D layered on top

Content is the long pole. It is worth starting the writing in parallel with everything else.
