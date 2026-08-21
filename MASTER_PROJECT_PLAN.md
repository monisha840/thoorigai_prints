# Thoorigai Prints — Master Project Plan

**Version** 1.0 · **Consolidated** 21 August 2026 · **Owner** Lead Technical Architect
**Status** — **Single source of truth.** Where this document disagrees with any other document in the repository, this document wins.

---

## Contents

| § | Section |
|---|---|
| [0](#0-what-this-consolidates-and-what-it-supersedes) | What this consolidates · [the conflict log](#02-conflict-resolution-log) · [facts locked](#03-facts-locked-for-the-build) |
| [1](#1-final-sitemap) | **Final sitemap** — structure, redirect map, rendering, navigation |
| [2](#2-final-design-system) | **Final design system** — principles, spacing, grid, radius, elevation, budgets, accessibility |
| [3](#3-final-colour-system) | **Final colour system** — four scales, semantic aliases, dark sections, print equivalents |
| [4](#4-final-typography-system) | **Final typography system** — families, the scale, measure, loading budget |
| [5](#5-final-component-list) | **Final component list** — 158 components on five layers plus a 3D branch |
| [6](#6-final-page-structure) | **Final page structure** — the CTA ladder and all ten templates, section by section |
| [7](#7-final-asset-structure) | **Final asset structure** — the repository tree |
| [8](#8-final-image-usage-plan) | **Final image usage plan** — all 168 files, placement, legal flags |
| [9](#9-final-animation-strategy) | **Final animation strategy** — tokens, rules, reduced motion |
| [10](#10-recommended-3d-strategy) | **Recommended 3D strategy** — eight scenes, device tiers, the loading contract |
| [11](#11-codebase-delta) | What changes in the existing Next.js shell |
| [12](#12-blockers-and-build-order) | Blockers, six build waves, ship gates |
| [13](#13-open-questions-for-the-client) | Open questions for the client |

---

## 0. What this consolidates, and what it supersedes

Six workstreams were briefed. Three of them shipped under filenames other than the ones commissioned; this plan maps them and folds all of them in.

| Commissioned | Actually delivered as | Status here |
|---|---|---|
| `content-audit.md` | [docs/content-audit.md](docs/content-audit.md) (1,488 lines) | **Folded in** — accepted as the factual baseline |
| `image-inventory.md` | [docs/image-inventory.md](docs/image-inventory.md) + [docs/image-usage-guide.md](docs/image-usage-guide.md) | **Folded in** — usage-guide overrides inventory on per-file calls |
| `architecture.md` | [docs/ia/01-sitemap.md](docs/ia/01-sitemap.md) · [04-page-hierarchy](docs/ia/04-page-hierarchy.md) · [03-navigation](docs/ia/03-navigation.md) · [docs/sitemap.md](docs/sitemap.md) · [README.md](README.md) | **Folded in** — ia/01 + ia/04 win |
| `design-system.md` | [docs/design-system.md](docs/design-system.md) (1,532 lines) **plus a second, incompatible system inside** [docs/ia/README.md](docs/ia/README.md) | **Folded in** — design-system.md wins |
| `component-architecture.md` | [docs/ia/04-component-hierarchy.md](docs/ia/04-component-hierarchy.md) + [05-ui-components](docs/ia/05-ui-components.md) + [09-components](docs/ia/09-components.md) | **Merged into one list** below |
| `3d-concepts.md` | [docs/ia/06-animation-plan.md](docs/ia/06-animation-plan.md) + [docs/redesign-report.md §5](docs/redesign-report.md) + `src/three/`, `src/components/three/` | **Merged** |

Also consolidated: [05-section-hierarchy](docs/ia/05-section-hierarchy.md), [03-page-sections](docs/ia/03-page-sections.md), [06-cta-strategy](docs/ia/06-cta-strategy.md), [07-conversion-strategy](docs/ia/07-conversion-strategy.md), [08-mobile-ux](docs/ia/08-mobile-ux.md), [07-mobile-strategy](docs/ia/07-mobile-strategy.md), [02-user-journeys](docs/ia/02-user-journeys.md), [02-user-flows](docs/ia/02-user-flows.md), [10-page-order](docs/ia/10-page-order.md), and the working Next.js shell in [src/](src/).

**Housekeeping required before this plan is handed on.** `docs/ia/` carries two passes with colliding file numbers — `02-user-flows` vs `02-user-journeys`, `03-navigation` vs `03-page-sections`, `04-component-hierarchy` vs `04-page-hierarchy`, `05-section-hierarchy` vs `05-ui-components`, `06-animation-plan` vs `06-cta-strategy`, `07-conversion-strategy` vs `07-mobile-strategy`. Every collision is resolved in §0.2. Move the folder to `docs/_archive/ia/` once this plan is approved, so nobody builds from a superseded number.

### 0.1 The strategic premise, stated once

The audit found a real business behind a website that does almost none of the selling. **Eleven of seventeen commercial pages carry under 250 characters of body text.** Every product is a photograph with a two-word label. The highest-intent page — Contact — is a 106-character address block with no form, no email and no map.

Three principles govern everything below.

1. **Copy is the project.** 15 page bodies, 43 product descriptions, 24 title tags, 24 meta descriptions, 168 alt attributes. A 3D configurator sitting above a two-word label is still a site with no words on it.
2. **3D must do work.** Print is tactile — thickness, spine, foil, flute, grain, finish. Those are exactly what a flat photograph cannot convey and a lit 3D surface can. Every scene must answer a question a buyer actually has. Decorative WebGL is banned.
3. **Fast is part of premium.** The audience is largely mid-range Android on mobile data in Chennai. A site that takes twelve seconds to load is not premium regardless of how it looks. The budgets in §2.8 are gates, not aspirations.

---

### 0.2 Conflict resolution log

Every material disagreement between the source documents, and the ruling.

| # | Conflict | Sources | **Ruling** | Detail |
|---|---|---|---|---|
| C1 | Two entire colour systems — "Ink & Paper" (amber `#F3A233` on `#FAF9F7`) vs the four-colour brand system (`#262236` / `#344F7C` / `#F6F6F3` / `#C18546`) | ia/README vs design-system + codebase | **Four-colour brand system.** The amber palette ships no verified contrast table and contradicts the brand constants already in `src/lib/theme/colors.ts`. | §3 |
| C2 | Display typeface — Bodoni Moda vs Fraunces | design-system vs codebase | **Bodoni Moda.** Didone is the print trade's own typography. The fragility is real and is managed by the ≥32px rule, not by switching genre. | §4.1 |
| C3 | Font count and budget — 1 family / <100 KB vs 4 families / ≤180 KB | ia/README vs design-system | **4 families, route-scoped. ≤120 KB typical, ≤180 KB on Tamil routes.** Tamil is not optional for a brand whose name is Tamil (தூரிகை). | §4.6 |
| C4 | Radius scale — 0–8px vs 8–28px vs 4–32px | design-system vs ia/README vs codebase | **Near-zero, 0–8px.** Rounded corners read as software; sharp corners read as print. Media is always 0. | §2.4 |
| C5 | Display ceiling — 88px vs 84px vs 120px | design-system vs ia/README vs codebase | **88px (`display-xl`).** 120px cannot hold a 20ch measure inside a 1280 container. | §4.2 |
| C6 | Breakpoints — 320/480/768/1024/1280/1536 vs 599/904/1239/1727 vs Tailwind default + `3xl` | design-system vs ia/08 vs codebase | **360/640/768/1024/1280/1536.** Tailwind-native, matches the shipped `@theme`. 320px remains the reflow floor. | §2.5 |
| C7 | Sitemap — `/work/` + `/quote/` + `/materials/` vs `/portfolio/` + `/get-a-quote/` vs `/services/` + `/products/` | ia/01 vs docs/sitemap vs codebase | **ia/01.** `/services` and `/products` as top-level siblings recreate the exact duplicate-content failure the audit found. | §1 |
| C8 | Header on scroll — hides vs never hides | ia/03 vs design-system §8.1 | **Split by viewport.** Desktop never hides; mobile hides past 120px and returns instantly on scroll-up. | §2.6 |
| C9 | Mobile menu — bottom sheet vs right-side drawer vs full-screen overlay | ia/03 + ia/08 vs ia/07-mobile vs design-system | **Bottom-anchored full-height sheet.** Thumb-zone argument, and two of three sources agree. | §6.9 |
| C10 | Focus ring — 2px amber vs 2px indigo / 3px offset vs a double ring | ia vs codebase vs design-system | **Double ring.** Amber on paper is 2.89:1 and would fail as an indicator. | §3.6 |
| C11 | Component inventory — 76 vs ~108 vs ~30 built | ia/09 vs ia/05-ui vs codebase | **One merged list of 128**, on the L1–L5 + 3D-branch layer model. | §5 |
| C12 | Folder convention — `layout/ui/motion/three` vs `foundation/primitives/composites/sections/three` | codebase vs ia/04-component-hierarchy | **Layered names.** The ESLint 3D-boundary rule depends on a layer-named tree. | §7.2 |
| C13 | Motion durations — 180/240/320/480 vs 180/260/400/600 vs 240/400/600/900 | design-system vs ia/06-anim vs codebase | **100/180/240/320/480/1200.** Confident, not performed. | §9.1 |
| C14 | Default easing — `(0.22,1,0.36,1)` vs `(0.2,0,0,1)` | design-system + codebase vs ia/06-anim | **`cubic-bezier(0.22, 1, 0.36, 1)`.** Two of three, and already shipped as `--ease-editorial`. | §9.1 |
| C15 | Mobile 3D — never auto-loads, tap-only vs auto-loads on Tier A/B | design-system §9.5 vs ia/06-anim | **Tap-to-activate for interactive viewers; stepped-stills for sequences on mobile.** Never a 1.2 MB auto-download on mobile data. | §10.4 |
| C16 | 3D priority — configurator → sequence → comparison → boxes → cutaway → finishes vs configurator + finish viewer both at 1 | redesign-report §5 vs ia/06-anim | **Configurator + finish viewer at priority 1**, then the press sequence. The finish viewer is the upsell and is cheap. | §10.2 |
| C17 | Device tiers — Tier A at ≥6 memory / ≥6 cores vs ≥8 / ≥8 | ia/08 vs ia/06-anim | **ia/06-anim thresholds**, plus ia/08's slow-first-paint trigger and a battery trigger. | §10.3 |
| C18 | Dark mode — a full `prefers-color-scheme` theme vs dark *sections* only | ia/README vs design-system + codebase | **Dark sections only.** Paper is the brand metaphor; inverting it globally doubles QA across 43 catalogue items and 8 scenes for no commercial return. | §3.5 |
| C19 | Quote form — one 8-field form vs three steps, contact last | design-system §12.4 vs ia/07-conversion | **Three steps, contact last**, built to design-system's field metrics and validation rules. | §6.7 |
| C20 | Icons — Phosphor Regular vs a new custom set vs `lucide-react` | design-system + ia/09 vs ia/05-ui vs codebase | **Phosphor Regular**, inline SVG sprite. 22 files are already on disk; it drops a dependency. | §2.7 |
| C21 | The four "featured" collages — retain as section headers vs discard | redesign-report §3 vs image-usage-guide | **Discard.** They carry headlines, body copy and URLs baked into pixels — invisible to search, untranslatable, soft on retina. Rebuild as markup. | §8.4 |
| C22 | `Printing-press-BG-1` — keep the WebP vs keep the JPG | image-inventory vs image-usage-guide | **Keep the JPG master** (1.09 bpp). The WebP is a quarter of the data. Re-derive WebP/AVIF from the JPG. | §8.3 |
| C23 | `Hard.webp` / `Hard-2.webp` — "two unused duplicates" vs "primary 3D object" + "book-cover card" | image-inventory vs image-usage-guide | **Both retained, distinct roles.** `Hard.webp` carries the Thoorigai mark and is the first 3D subject. | §8.3 |
| C24 | Founding year — 2010 vs 2017 | redesign-report + ia vs content-audit + codebase | **2017.** The audit quotes the live copy: *"Since our inception in 2017."* The "15+ years" figure is the founder's personal experience, not the company's age. Client to confirm. | §0.3 |
| C25 | Location — "a real place in Madurai" vs Royapettah, Chennai | image-usage-guide vs every other source | **Royapettah, Chennai 600014.** Madurai is the *client's* location on the Prasar Bharati / All India Radio job. | §0.3 |
| C26 | Tagline — "Ink Your Vision..! Print Your Success..!" vs "A printing house, not a print shop." | content-audit vs codebase `siteConfig` | **"Ink your vision. Print your success."** — the real, ownable line with the doubled exclamation marks dropped. The codebase invented its replacement. | §0.3 |
| C27 | Homepage section count — 12 vs 9 | ia/05-section + ia/10 vs ia/03-page-sections | **12.** Two of three agree; the 9-section version drops the catalogue preview, the founder and the commitments. | §6.2 |
| C28 | Accent discipline — "twice per viewport" vs "once per viewport" vs "one accent button per page" | ia/README vs design-system §2.9 vs §10.6 | **One bronze *fill* per page; at most two bronze *marks* per viewport.** Both rules survive without contradiction. | §3.4 |
| C29 | Sticky action bar — from first paint vs after 40% scroll; 64px vs 56px | ia/03 vs design-system §9.1 | **From first paint, 64px + safe area**, hidden only on `/quote/` and `/contact/`. Delaying it forfeits the bounce cohort. | §6.9 |
| C30 | Body measure — 68ch vs 58ch | design-system vs codebase `measure` utility | **68ch.** It is also exactly a 6-column span at 1280px, so the grid and the type scale become one system. | §4.4 |

### 0.3 Facts locked for the build

These were contradictory across documents. They are settled here and must not be re-litigated in code.

| Fact | Locked value | Confidence |
|---|---|---|
| Trading address | Nayar Vardha Pillai St, Balaji Nagar, Royapettah, Chennai, Tamil Nadu 600014 | High — verify the street line |
| Founded | **2017** | Medium — **client must confirm** |
| Founder | Mr. R. Ambeth · 15+ years' personal industry experience · quality control → finishing and binding specialist | High |
| Canonical phone | **`+91 99626 04017`** | **Blocking.** Two other numbers are live (`7871451004` header `tel:`, `77082 98673` WhatsApp) and are silently dropping enquiries |
| WhatsApp | `+91 77082 98673` — may legitimately differ, but must be confirmed | **Blocking** |
| Email | `sales@thoorigaiprints.com` | High |
| Business hours | Mon–Sat, 9:30am–7:00pm IST | **Unpublished today — client must supply** |
| GSTIN | — | **Client must supply** (footer + schema) |
| Tagline | "Ink your vision. Print your success." | High |
| Catalogue | 43 named items | High |
| Image library | 168 unique files (155 WordPress media records + 13 found only in rendered markup). **Zero have alt text.** | High |

---

## 1. Final sitemap

Source of truth: [ia/01-sitemap.md](docs/ia/01-sitemap.md), with `/portfolio/` → `/work/` and `/get-a-quote/` → `/quote/` resolved in its favour (C7).

### 1.1 Structure

```
/                                          Home                          T1
│
├── /printing/                             Pillar hub                    T2
│   ├── /printing/digital-multicolour/     Capability                    T3
│   ├── /printing/digital-black-white/     Capability                    T3
│   ├── /printing/offset-multicolour/      Capability                    T3
│   ├── /printing/offset-black-white/      Capability                    T3
│   └── /printing/variable-data/           Capability                    T3   ★
│
├── /packaging/                            Pillar hub                    T2
│   ├── /packaging/corrugated-boxes/       Capability                    T3
│   ├── /packaging/carton-boxes/           Capability                    T3
│   ├── /packaging/paper-bags/             Capability                    T3
│   ├── /packaging/rigid-boxes/            Capability                    T3   ★
│   └── /packaging/files-folders/          Capability                    T3   ★
│
├── /binding/                              Pillar hub                    T2
│   ├── /binding/hard-case/                Capability                    T3
│   ├── /binding/perfect/                  Capability                    T3
│   ├── /binding/wiro/                     Capability                    T3
│   ├── /binding/center-pin/               Capability                    T3
│   └── /binding/board-books/              Capability                    T3   ★
│
├── /materials/                            Materials & finishes          T5   ★
│   └── /materials/{slug}/                 Individual stock or finish         ★ (phase 2)
│
├── /work/                                 Portfolio index               T6   ★
│   └── /work/{slug}/                      Case study                    T6   ★
│
├── /process/                              How a job runs                T7   ★
├── /about/                                Company, founder, facility    T7
├── /contact/                              Form, map, hours, direct      T8
│
├── /quote/                                Quote request — a real page   T8   ★
│   └── /quote/thank-you/                  Confirmation                  T8   ★
│
├── /journal/                              Editorial index               T6
│   └── /journal/{slug}/                   Article                       T6
│
├── /faq/                                  Full FAQ                      T9   ★
│
├── /privacy-policy/                       T9   ★  (footer links to a 404 today)
├── /terms/                                T9
├── /cookies/                              T9
│
├── /404/                                  Designed, not default         T10
├── /search/                               Site search                   T10  ★
└── /sitemap.xml, /robots.txt              Generated
```

★ = did not exist on the old site.

**Totals:** 1 Tier-0 + 8 Tier-1 (three pillar hubs · materials · work · about · process · contact) + **15** Tier-2 capability pages + 43 Tier-3 catalogue entries + 7 Tier-4 utility/legal, plus `/quote/` and its confirmation, and editorial as content arrives.

> **Arithmetic correction.** [ia/01-sitemap.md](docs/ia/01-sitemap.md) states "13 Tier-2" in its tier table and its totals line, but the tree it publishes lists **15** — five capabilities under each of the three pillars. Fifteen is correct, and every downstream count in this plan (the T3 template instance count, the Wave 3 page count, the capability-page copy estimate) uses it.

### 1.2 The Tier-3 decision

**43 catalogue items are CMS entries, not pages.** Building 43 pages with 3D each is not realistic and most would be thin. They surface through a filterable grid with a detail view at `/{pillar}/{capability}/#{item}`, deep-linkable via a static route fallback.

| Rule | Why |
|---|---|
| An item renders a **detail view** only when it has a 40–60 word description **and** a populated spec block | Otherwise it reproduces the exact failure the audit found: a photograph with a two-word label |
| Items promote to full pages individually, when search demand justifies it | The data model does not change — the entry is already structured |
| Item photography under 700px is grid-tile only | Nine in-use assets are under 700px wide and cannot survive a lightbox or a detail hero |
| Every item names its parent capability and links to it | Prevents the orphan-island problem the eleven old child pages have |

**Launch promotion candidates** — the six with the clearest standalone search demand: Business cards · Books · Brochures · Certificates · Question papers · Paper bags.

### 1.3 Redirect map

Every old URL 301s to its new home. The old paths carry whatever authority the site has.

| Old | New | Type |
|---|---|---|
| `/printing/`, `/packaging/`, `/binding/` | unchanged | — |
| `/digital-multicolour/` | `/printing/digital-multicolour/` | 301 |
| `/digital-black-and-white/` | `/printing/digital-black-white/` | 301 |
| `/offset-multicolour/` | `/printing/offset-multicolour/` | 301 |
| `/offset-black-and-white/` | `/printing/offset-black-white/` | 301 |
| `/corrugation-box/` | `/packaging/corrugated-boxes/` | 301 |
| `/carton-box/` | `/packaging/carton-boxes/` | 301 |
| `/paper-bag/` | `/packaging/paper-bags/` | 301 |
| `/hard-case-binding/` | `/binding/hard-case/` | 301 |
| `/perfect-binding/` | `/binding/perfect/` | 301 |
| `/wiro-binding/` | `/binding/wiro/` | 301 |
| `/center-pin/` | `/binding/center-pin/` | 301 |
| `/about-us/` | `/about/` | 301 |
| `/contact-us/` | `/contact/` | 301 |
| `/blog/`, `/category/uncategorized/` | `/journal/` | 301 |
| `/terms-conditions/` | `/terms/` | 301 |
| `/cookie-policy/` | `/cookies/` | 301 |
| `/home/` | `/` | 301 |
| footer "Privacy Page" → `/404` | `/privacy-policy/` | fix the link **and** write the page |
| `/home-ai-2/`, `/sample-page/`, `/maintenance/` | — | **410 Gone** |
| `/post01/` … `/post09/` (9 posts) | — | **410 Gone** |
| `/testiminials/testimonial011–017/` (7) | — | **410 Gone** |
| `/demo-design-system/` | — | remove or set private |
| `/login-customizer/` | — | leave, keep `noindex` |

**410, not 301, for the placeholder content.** A 301 from nine Lorem Ipsum posts to a new journal tells search engines those posts moved, which is untrue and unhelpful. The `testiminials` slug typo is baked into the current permalinks; relaunch is the moment to drop it.

### 1.4 Rendering and SEO

| Page type | Strategy | Revalidate |
|---|---|---|
| Home | Static, ISR | 24h |
| Pillar hubs, capability pages, materials | Static | on publish |
| Catalogue detail | Static, generated per entry | on publish |
| Work / case studies | Static, ISR | 24h |
| Journal | Static, ISR | 1h |
| Quote / Contact | Static shell, client-side form | — |
| Search | Client-side over a prebuilt index | on build |

**Per-page requirements, all absent from the old site:** unique `<title>` with location intent ("Offset Printing in Chennai | Thoorigai Prints"), unique meta description, exactly one `<h1>`, `og:image`, canonical URL, and a real `alt` on every image.

**Structured data:** `LocalBusiness` with the canonical NAP on Home, About and Contact · `Service` on every pillar and capability page · `Product` on catalogue items · `BreadcrumbList` sitewide · `FAQPage` on `/faq/` and any page with an accordion.

### 1.5 Navigation

Six primary items. The navigation is a table of contents, not a directory, and every item is a destination — no `href="#"` dead labels.

```
[◆ Thoorigai]  Printing  Packaging  Binding  Materials  Work  About    ⌕  ⟨Get a quote⟩
```

| Slot | Behaviour |
|---|---|
| Printing · Packaging · Binding | Full-width **mega-panel**, never a nested dropdown. Two or three link columns plus one featured slot with exactly one image. |
| Materials · Work · About | Direct links |
| ⌕ Search | Overlay, type-ahead over a prebuilt index, `/` shortcut |
| Get a quote | Links to `/quote/` — a URL, not a popup |

**Contact is deliberately not in the primary nav.** The persistent CTA, the sticky mobile bar, the footer and WhatsApp all carry it, and dropping it buys the room that keeps the bar uncluttered. **Process, FAQ and Journal live in the footer** — they are arrived at with a reason, not browsed.

**Order rationale:** the three pillars sit in production sequence (print → package → bind), which is how the business actually reads and which also puts the highest-search-volume pillar first. Materials follows because it is a *how*, not a *what*. Work precedes About because proof follows capability, and the founder story converts people who are already interested.

**Footer — four columns**, replacing a three-column footer that omitted Home, Contact and the blog and whose legal menu pointed at a 404:

| Column | Contents |
|---|---|
| Brand | SVG logo, tagline, full postal address, canonical phone, email, hours |
| Services | Printing · Packaging · Binding · Materials, each expanding to its capability list |
| Company | About · Work · Process · Journal · FAQ · Contact |
| Get in touch | Quote CTA · WhatsApp · Call · hours · Instagram · LinkedIn |
| Bottom bar | Dynamic copyright year · GSTIN in mono · Privacy · Terms · Cookies |

On mobile the three link columns become accordions with the brand block always expanded and the legal bar always visible. A footer is the one place drill-down is correct — nobody browses a footer.

---

## 2. Final design system

Source of truth: [docs/design-system.md](docs/design-system.md). The competing system in `docs/ia/README.md` is **rejected in full** (C1, C4, C5, C10, C18).

### 2.1 Principles

Five rules, ranked. When two decisions look equally good, the one satisfying the earlier principle wins.

1. **Paper first.** The page is a sheet, not a dashboard. Wide margins, one idea per horizontal band, generous air between bands. If a section needs a scrollbar inside it, it is two sections. The most premium thing on this site will be the space nothing is in.
2. **Ink is the loudest thing on the page.** Colour is spent, not decorated with. Deep ink `#262236` carries roughly 90% of all type. Bronze `#C18546` is a **foil, not a colour**.
3. **Set it, don't style it.** Hierarchy comes from size, weight and space — not gradients, glass, glow, pills or decorative borders. This is why the radius scale is near zero and the shadow scale is near invisible.
4. **Show the object.** The product is a physical thing with thickness, texture and a spine. Photography, swatches and the 3D viewers are the content; the interface is the frame. Hairlines over shadows, flat over floating, `border-radius: 0` on every image so nothing crops the object.
5. **Fast is part of premium.** Every token carries a performance consequence: no icon font, no shadow animation on scroll, a static poster behind every 3D scene.

### 2.2 Spacing

4px base unit, **8px rhythm**. Named by step so the scale extends without renaming. Never invent a value — if 44px feels right, the answer is 40 or 48.

| Token | px | Primary use |
|---|---|---|
| `space-px` | 1 | Hairlines, borders |
| `space-1` | 4 | Icon-to-label inside a chip |
| `space-2` | 8 | Tight inline gaps |
| `space-3` | 12 | Label-to-input, eyebrow-to-heading |
| `space-4` | 16 | Card padding (mobile), heading-to-body |
| `space-5` | 20 | Mobile page margin |
| `space-6` | **24** | **Card padding (desktop), grid gutter** |
| `space-8` | 32 | Feature card padding, between form groups |
| `space-10` | 40 | Heading top margin, between card rows |
| `space-12` | 48 | Sub-section separation |
| `space-14` | 56 | Mobile section padding (compact) |
| `space-16` | 64 | Between major content blocks |
| `space-18` | 72 | **Mobile section padding (default)** |
| `space-20` | **80** | **Desktop page margin**, section padding (compact) |
| `space-24` | 96 | Mobile section padding (large) |
| `space-30` | **120** | **Desktop section padding — the default band** |
| `space-40` | 160 | Desktop section padding (large) |
| `space-50` | 200 | Desktop hero padding |
| `space-60` | 240 | Editorial chapter break |

**Section rhythm** — the single table that controls the pace of the site:

| Band | Desktop ≥1024 | Tablet 768–1023 | Mobile <768 |
|---|---|---|---|
| Hero | 200 / 160 | 140 / 112 | 96 / 80 |
| Section — large | 160 | 120 | 96 |
| **Section — default** | **120** | 88 | 72 |
| Section — compact | 80 | 64 | 56 |
| CTA band | 120 | 96 | 72 |
| Footer | 96 / 48 | 80 / 40 | 64 / 32 |

Dark bands get **+16px** top and bottom over their light equivalents — dark reads optically tighter.

**Density rules.** Related elements sit closer than unrelated ones; proximity carries grouping, not borders. Component internal padding never exceeds the gap between components. When a layout looks cheap, the fix is nearly always one step up the scale — not a new colour and not a shadow.

### 2.3 Grid and containers

| Container | Max width | Use |
|---|---|---|
| `container-prose` | **628px** | Long-form body — 68ch at 18px |
| `container-narrow` | 768px | Forms, legal, single-column |
| `container-md` | 960px | Centred feature sections |
| `container-lg` | 1120px | Standard section content |
| `container-xl` | **1280px** | **Default.** Catalogue grids, header, footer |
| `container-max` | 1440px | Editorial spreads, full-width galleries |
| `container-bleed` | 100vw | Hero media, dark bands, 3D canvases |

At 1280px with 12 columns and 24px gutters one column is 84.67px and a **6-column span is 628px — exactly the prose measure.** The grid and the type scale are the same system.

**Named spans (12-col desktop):** `span-full` 1→12 · `span-wide` 2→11 · **`span-text` 3→8 (628px)** · `span-rail` 9→12 (366px) · `span-half` 1→6 / 7→12 · `span-third` 4 cols · `span-quarter` 3 cols · `span-offset` 2→9.

**The asymmetric text + rail split (3→8 / 9→12) is the system's editorial signature.** Capability pages run body copy in `span-text` with the spec table and the "Get a quote for this" card in `span-rail`, sticky from the top of the article to its end.

**Component grids:**

| Grid | ≥1280 | 1024–1279 | 768–1023 | <768 |
|---|---|---|---|---|
| Catalogue tiles | 4-up, 24 | 4-up, 24 | 3-up, 20 | **2-up, 16** |
| Capability cards | 3-up, 32 | 3-up, 24 | 2-up, 20 | 1-up, 16 |
| Commitments / stats | 4-up, 40 | 4-up, 32 | 2-up, 32 | 2-up, 24 |
| Case study cards | 2-up, 40 | 2-up, 32 | 2-up, 24 | 1-up, 24 |
| Material swatches | 6-up, 16 | 5-up, 16 | 4-up, 12 | 3-up, 8 |
| Logo wall | 6-up, 48 | 5-up, 40 | 4-up, 32 | 3-up, 24 |

**Catalogue tiles stay 2-up on mobile.** With 43 items a 1-up mobile grid produces an unscrollable page and hides the breadth of the catalogue, which is one of the business's genuine strengths.

### 2.4 Radius

Radius is close to zero and stays there.

| Token | px | Applied to |
|---|---|---|
| `radius-none` | **0** | **All images, all media, all full-bleed panels, dark sections, tables, swatches, 3D canvases** |
| `radius-xs` | **2** | Buttons, inputs, selects, checkboxes, chips, tags, badges |
| `radius-sm` | **4** | Cards, popovers, dropdowns, tooltips |
| `radius-md` | 8 | Modals, drawers, mobile bottom sheets |
| `radius-full` | 9999 | Radio buttons, avatars, filter pills, status dots, circular icon buttons |

**Rules.** Media is always 0 — a rounded corner clips the object. Two radii per component maximum. Nested radius is `inner = outer − padding`, floored at 0. Pills are for filter chips and status dots only, never a CTA. Radius does not scale with breakpoint.

### 2.5 Breakpoints

Design at **390px** and **1440px**. Everything else is interpolation. 320px is the reflow floor (WCAG 1.4.10) — no horizontal scroll there or at 400% zoom.

| Token | Min | Columns | Margin | Gutter | Represents |
|---|---|---|---|---|---|
| `xs` | 360 | 4 | 16 | 16 | Small Android |
| `sm` | 640 | 4 | 20 | 16 | Standard phone / large phone |
| `md` | 768 | 8 | 32 | 20 | Tablet portrait |
| `lg` | 1024 | 12 | 48 | 24 | Tablet landscape, small laptop |
| `xl` | **1280** | 12 | 80 | 24 | **Primary design target** |
| `2xl` | 1536 | 12 | auto | 32 | Large desktop — container caps at 1280 |

`3xl` (1792) is removed from the shipped theme; beyond 1536 the container is already capped and the extra step buys nothing.

### 2.6 Chrome

**Desktop header** — 88px tall, `paper-100` ground, no border at rest. Past 80px of scroll it compresses to 68px, gains `shadow-xs`, a 1px `paper-300` bottom rule, and switches to `paper-0`. 220ms. **It does not hide on scroll-down** (C8): a print buyer comparing capability pages needs the nav present, and the sticky section-chip index depends on a stable offset.

**Mobile header** — 60px: logo left, a 44px tel button and a 44px menu button right. **Hides on scroll-down past 120px, returns immediately on scroll-up** (C8): a 60px header plus a 64px action bar is 15% of a 390×844 viewport, which is too much to hold permanently.

The header never carries a shadow at rest. Elevation is a hairline plus a background shift — shadow is the thing that makes a premium header look like a template.

**Section anatomy** — every band follows one skeleton:

```
┌── full-bleed band ─────────────────────────────────────────┐
│                     120px top padding                       │
│   ┌── container-xl (1280) ─────────────────────────────┐   │
│   │  ── 24px bronze rule                                │   │
│   │  OVERLINE · 12/600/0.16em · bronze-700              │   │
│   │       12px                                          │   │
│   │  Section heading — Bodoni 40px, max 28ch            │   │
│   │       16px                                          │   │
│   │  Standfirst — Inter 18px, paper-700, max 68ch       │   │
│   │       48px                                          │   │
│   │  [ content grid ]                                   │   │
│   └─────────────────────────────────────────────────────┘   │
│                     120px bottom padding                    │
└─────────────────────────────────────────────────────────────┘
```

Alternate `paper-100` and `paper-0` grounds between adjacent bands so boundaries read without rules. Never two `paper-0` bands side by side.

**Layout patterns:** editorial split (6/6, media full-bleed to one page edge) · text + rail (`span-text` / sticky `span-rail`) · stepped grid (4-up, every second column offset 40px down) · full-bleed dark · spec table (mono figures, row rules only, 56px rows) · comparison (equal columns, sticky header row, bronze rule under the recommended column).

**Desktop rules.** Maximum three distinct type sizes in one viewport, plus the eyebrow. One primary CTA per viewport. Photography is full-bleed to at least one edge in every second section. Never centre body copy longer than three lines. Tables never scroll horizontally on desktop — if they do not fit at 1280px they have too many columns. Test at 125% and 150% browser zoom; a large share of desktop print buyers run scaled displays.

**Mobile rules.** Single column by default with exactly two documented exceptions: catalogue tiles (2-up) and material swatches (3-up). Media goes full-bleed edge-to-edge, breaking the 20px margin; copy keeps the margin. Reorder as heading → image → body → CTA. Tables become stacked definition lists or scroll inside their own `role="region" tabindex="0"` container with a right-edge fade. **Maximum two sticky elements at once** (header + action bar).

**Touch.** 44×44px minimum, 48×48px preferred, applied to the tap area rather than the visual. Minimum 8px between adjacent targets; 16px between catalogue tiles. Tap feedback within 100ms: `scale(0.98)` plus a background shift on `:active`. No hover-dependent content anywhere. Swipe is always an enhancement — every carousel keeps visible prev/next buttons and pagination dots.

### 2.7 Elevation, icons, imagery

**Hairline first, shadow second.** A 1px `paper-300` border does the job a shadow usually does. Cards sit flat on the paper and only lift on hover. Every shadow is tinted with the ink hue `rgba(38, 34, 54, α)` — never black — and every shadow above `sm` is layered in two stops.

| Token | Value | Use |
|---|---|---|
| `shadow-none` | `none` | **The default for everything** |
| `shadow-xs` | `0 1px 2px rgba(38,34,54,.04)` | Sticky header once scrolled |
| `shadow-sm` | `0 1px 2px rgba(38,34,54,.04), 0 2px 6px rgba(38,34,54,.04)` | Resting elevated card (sparingly) |
| `shadow-md` | `0 2px 4px rgba(38,34,54,.04), 0 6px 16px rgba(38,34,54,.06)` | **Card hover**, dropdown, tooltip |
| `shadow-lg` | `0 4px 8px rgba(38,34,54,.05), 0 12px 32px rgba(38,34,54,.08)` | Popover, filter panel, mega-panel |
| `shadow-xl` | `0 8px 16px rgba(38,34,54,.06), 0 24px 56px rgba(38,34,54,.10)` | Modal, quote sheet, detail overlay |
| `shadow-2xl` | `0 16px 32px rgba(38,34,54,.08), 0 40px 96px rgba(38,34,54,.14)` | Lightbox surface |
| `shadow-hairline` | `inset 0 0 0 1px rgba(38,34,54,.08)` | Border substitute where a real border would shift layout |
| `shadow-sheet` | stacked-paper stack (see design-system §6.2) | **The one decorative shadow** — multi-item catalogue tiles, run-length cards |

**Dark sections carry no shadows.** On dark, elevation is lightness: `ink-950` → `ink-900` → `ink-800` → `ink-700`, plus a 1px `rgba(246,246,243,0.10)` hairline and an `inset 0 1px 0 rgba(246,246,243,0.06)` top highlight on raised surfaces.

**z-index scale:** `base` 0 · `raised` 10 · `sticky` 100 · `header` 200 · `mobile-cta` 300 · `dropdown` 400 · `scrim` 500 · `modal` 600 · `toast` 700 · `tooltip` 800 · `skip` 900.

**Icons — Phosphor Regular** (C20). 1.5px stroke on a 24px grid. Sizes 16 / 20 / **24** / 32 / 48, `fill="currentColor"`, delivered as an inline SVG sprite — no icon font, no per-icon request. `aria-hidden="true"` when decorative; `<title>` + `role="img"` when meaningful. The 22 SVGs already in `assets/icons/` mix Light, Regular and Bold weights and several carry hard-coded hex fills; standardise on Regular and strip the fills. Four are AI/SaaS theme icons with no printing use and are discarded. **This replaces `lucide-react`, which is removed from `package.json`.**

Bronze icons are permitted at 24px and above only, and only where the icon is the accent moment of its section. Icons are never the sole carrier of meaning.

**Imagery ratios:** **4:5** catalogue tiles · **3:2** capability cards, case studies, editorial · **1:1** swatches, team, thumbnails · **16:9** video, machinery, section headers · **21:9** full-bleed hero, chapter breaks.

`radius-none` on every image without exception. No filters, no duotones, no overlaid brand colour — the product's real colour is the thing being sold. One consistent photographic ground: the warm neutral of `paper-200` `#EEEEE9`, or a true cyclorama white for cut-out work. `object-fit: cover` with `object-position` set per image; never let an automatic crop decide where a spine or a foil edge sits.

### 2.8 Performance budgets — hard gates

A page that exceeds these does not ship. Reconciled from the two competing budget tables (ia/README vs design-system §9.5).

| Metric | Target | Gate | Note |
|---|---|---|---|
| LCP (mobile, throttled 4G) | **< 2.0s** | 2.5s | Measured on the real page with real images. The LCP element is always a static image or a 3D poster — never a WebGL first paint |
| CLS | **< 0.05** | 0.05 | Every media slot has a reserved aspect ratio, including 3D posters |
| INP | **< 200ms** | 200ms | Filter chips and configurator swatches respond optimistically |
| Initial JS, gzipped | **< 150 KB** | 180 KB | Excludes 3D, which is never in the initial bundle |
| Webfonts | **≤ 120 KB** typical | 180 KB on Tamil routes | See §4.6 |
| Hero image | ≤ 120 KB | 160 KB | AVIF with WebP fallback |
| Above-the-fold images per route | ≤ 300 KB | 400 KB | |
| 3D bundle, gzipped | **≤ 250 KB** | 250 KB | Loaded once on intersection, shared across scenes |
| Per-model payload | **≤ 1.5 MB** | 1.5 MB | Draco + Meshopt compressed glTF, KTX2 textures |
| Total page weight incl. one scene | **≤ 2.5 MB** | 2.5 MB | |
| Concurrent live 3D scenes | **1** | 1 | Scrolling past a scene disposes it |

**The rule that keeps this honest:** WebGL is never in the critical path. Every 3D scene has a static poster that is what actually loads first, and the interactive layer replaces it only after the page is interactive and the device has been judged capable.

### 2.9 Accessibility contract

**WCAG 2.2 Level AA is the floor.** A print buyer at 55 with presbyopia is a core user, not an edge case.

| Requirement | Standard | How it is met |
|---|---|---|
| Body text contrast | ≥ 4.5:1 | Ink on paper 14.21:1; secondary 5.68:1 |
| Large text (≥24px, or ≥19px bold) | ≥ 3:1 | Every display pairing exceeds 4.9:1 |
| Non-text UI, borders, icons | ≥ 3:1 | Control border `#86867B` 3.40:1; dark control border at 0.40 alpha 3.60:1 |
| Focus visible | 2.4.7 / 2.4.11 | Double ring, `:focus-visible`, never removed |
| Focus not obscured | 2.4.11 | `scroll-margin-top: 96px` on focusable targets, under the sticky header and CTA bar |
| Target size | 2.5.8 | 44px minimum, 48px preferred, 8px minimum separation |
| Text resize / reflow | 1.4.4 / 1.4.10 | Everything in `rem`; holds to 200%; no horizontal scroll at 320px or 400% |
| Text spacing | 1.4.12 | No fixed heights on text containers |
| Colour not alone | 1.4.1 | Errors, warnings and status carry an icon and text |
| Motion | 2.3.3 | `prefers-reduced-motion` honoured throughout, plus a persisted user toggle in the footer |
| Autofill | 1.3.5 | `autocomplete` on every applicable field |
| Landmarks | 1.3.1 | `header` / `nav` / `main` / `aside` / `footer`; one `h1` per page; no skipped levels |
| Language | 3.1.1 / 3.1.2 | `lang="en-IN"`, with `lang="ta"` on every Tamil string |
| Skip link | 2.4.1 | First in tab order, visible on focus |

**Two known launch blockers carried from the audit:** the privacy policy does not exist (the footer links to a 404), and every one of the 168 image alt attributes is empty.

---

## 3. Final colour system

Four colours, each with a job. They are not interchangeable. Values are taken verbatim from [design-system.md §2](docs/design-system.md), whose contrast table is measured rather than estimated — which is why the codebase's ramps must be migrated to these values rather than the other way round (see §11.1).

### 3.1 Brand foundation

| Role | Hex | HSL | The job |
|---|---|---|---|
| **Primary — Ink** | `#262236` | 252°, 23%, 17% | All body and heading type. Dark-section grounds. Primary button fill. The default. |
| **Secondary — Indigo** | `#344F7C` | 218°, 41%, 35% | Interactive states, links, focus rings, informational cues. Never a large fill. |
| **Background — Paper** | `#F6F6F3` | 60°, 14%, 96% | The ground for the entire light experience. Warm, not white — it should read as uncoated stock. |
| **Accent — Bronze** | `#C18546` | 31°, 50%, 52% | Foil. The single highest-intent action, active states, rules under eyebrows, numerals in stat blocks. |

> **The ink is purple, and that matters.** `#262236` is a 252° violet-black, not a neutral. Every grey, shadow, scrim and overlay in this system is tinted toward it. **Pure `#000000` and pure `#808080` are forbidden** — they look dirty against warm paper.

### 3.2 The four scales

**Ink** (252°, 24% sat) — `50 #F3F2F7` · `100 #E8E6F0` · `200 #D0CCE0` · `300 #ADA6C9` · `400 #847AAE` · `500 #60558B` · `600 #4A426C` · `700 #393252` · **`800 #262236`** · `900 #1A1726` · `950 #0F0E16`

**Indigo** (218°, 42%) — `50 #F1F4F9` · `100 #E2E8F3` · `200 #C5D2E7` · **`300 #9AB0D6`** (dark-section links) · `400 #6082BE` · `500 #4366A3` · **`600 #344F7C`** · `700 #283D62` · `800 #1F304C` · `900 #162236` · `950 #0D1421`

**Bronze** (31°, 50%) — `50 #FBF8F4` · `100 #F6EDE4` · `200 #EDDCC9` · `300 #E0C3A3` · **`400 #D1A575`** (accent type on dark) · **`500 #C18546`** · `600 #A87238` · **`700 #865B2D`** (accent type on light) · `800 #674622` · `900 #493118` · `950 #2A1D0E`

**Paper** (warm neutral — the only grey ramp; never introduce a cool grey) — `0 #FFFFFF` · `50 #FBFBF9` · **`100 #F6F6F3`** · `200 #EEEEE9` · `300 #E2E2DB` · `400 #CFCFC6` · `500 #ADADA2` · **`600 #86867B`** (form control borders) · **`700 #62625A`** (secondary body type) · `800 #45453F` · `900 #2B2B27` · `950 #1A1A17`

> **`bronze-500` is not a text colour on paper.** `#C18546` on `#F6F6F3` measures **2.89:1** — it fails AA for body and the 3:1 floor for large text. For bronze type on a light ground use `bronze-700` `#865B2D` (**5.47:1**) or `bronze-600` `#A87238` (**3.78:1**, ≥24px and non-text UI only). `bronze-500` is for fills, rules and icons ≥24px — never for words on paper.

### 3.3 Semantic and status

Build UI against the aliases, never against raw scale tokens, so swapping the light/dark map is a one-line change.

```
--surface-page          paper-100   #F6F6F3
--surface-raised        paper-0     #FFFFFF
--surface-sunken        paper-200   #EEEEE9
--surface-tinted        bronze-50   #FBF8F4
--surface-inverse       ink-800     #262236

--text-primary          ink-800     #262236    14.21:1 on paper
--text-secondary        paper-700   #62625A     5.68:1
--text-muted            paper-600   #86867B     3.40:1 — non-text and placeholder only
--text-accent           bronze-700  #865B2D     5.47:1
--text-link             indigo-600  #344F7C     7.59:1
--text-inverse          paper-100   #F6F6F3    14.21:1 on ink

--border-hairline       paper-300   #E2E2DB    decorative separators
--border-default        paper-400   #CFCFC6    non-essential boundaries
--border-control        paper-600   #86867B    inputs, checkboxes — meets 3:1
--border-strong         ink-800     #262236    outline buttons, emphasis
--border-accent         bronze-500  #C18546    active tab, selected swatch

--focus-ring            indigo-600  #344F7C
--focus-ring-inverse    bronze-500  #C18546
```

Status colours are deliberately desaturated so they never out-shout the brand:

| Role | Light | On paper | Ground | Border | On dark |
|---|---|---|---|---|---|
| Success | `#2F6B4F` | 5.81:1 ✓ | `#EDF4F0` | `#C9DED4` | `#6FBF98` |
| Warning | `#8A5F0F` | 5.21:1 ✓ | `#F8F0DE` | `#E7D5AC` | `#E0B45C` |
| Error | `#A6323C` | 6.17:1 ✓ | `#F9EDEE` | `#E9C9CC` | `#E28B92` |
| Info | `#344F7C` | 7.59:1 ✓ | `#F1F4F9` | `#C5D2E7` | `#9AB0D6` |

> **Warning sits close to Bronze.** Ochre `#8A5F0F` and bronze `#C18546` are neighbours on the wheel, so **every warning carries its icon and a 2px left rule** — colour alone is never the signal.

### 3.4 Accent discipline (C28)

Two rules that were stated three different ways across the source documents. Both survive:

- **One bronze *fill* per page.** The accent button — *Get a quote*, *Request a sample*, *Send enquiry* — appears once. A second high-intent action takes the outline variant.
- **At most two bronze *marks* per viewport.** A rule under a section eyebrow, an active tab indicator, a stat numeral. Never all of them plus a button at once.

Everything else is ink on paper. This is what separates premium from decorated. Do not gradient between brand colours — ink-to-transparent scrims are the only permitted gradient.

### 3.5 Dark sections, not dark mode (C18)

There is **no global dark theme.** `colorScheme` stays `light`. Paper — a warm uncoated stock — is the brand metaphor, and inverting it globally would double the QA surface across 43 catalogue items, 15 capability pages and 8 3D scenes for no commercial return in this category.

What ships instead is a **dark section system**, which is where this brand looks most expensive.

**Use dark for:** the press-floor and machinery band · the 3D process sequence · material and finish configurators · testimonial bands · the closing CTA · the footer.
**Never use dark for:** long-form reading copy · forms (except the footer's single-field enquiry) · catalogue grids · spec tables · anything scanned comparatively.

Maximum **two or three dark bands per page**, always full-bleed, always with a hard edge — no gradient fade, no radius, no shadow at the junction. The abrupt light-to-dark cut *is* the editorial device.

| Level | Token | Hex | Use |
|---|---|---|---|
| Ground 0 | `ink-950` | `#0F0E16` | Deepest band — 3D canvases, footer |
| Ground 1 | `ink-900` | `#1A1726` | Standard dark band; cards on ground 0 |
| **Ground 2** | **`ink-800`** | **`#262236`** | **Default dark band**; cards on ground 1 |
| Ground 3 | `ink-700` | `#393252` | Raised card, hovered surface, input fill |

Dark text tokens: primary `#F6F6F3` (16.23:1) · secondary `paper-400 #CFCFC6` (11.21:1) · muted `paper-500 #ADADA2` (7.77:1) · accent `bronze-500 #C18546` (5.62:1) · accent heading `bronze-400 #D1A575` (7.83:1) · link `indigo-300 #9AB0D6` (8.00:1). Hairline `rgba(246,246,243,.10)`, hover `.16`, **control border `.40` (3.60:1 — the minimum for inputs and outline buttons)**, emphasis `.72`.

> **Two hard prohibitions.**
> **1.** Never use `#344F7C` as type on a dark ground — 2.14:1. Every dark-section link is `indigo-300`.
> **2.** Never set an input or outline-button border at `rgba(246,246,243,0.24)` — it resolves to 2.14:1 and fails 1.4.11. The floor is **0.40**.

**The footer** is the largest dark surface and the one every page ends on: ground `ink-950`, the tagline set in Bodoni 40px `#F6F6F3` with a 48px bronze rule above it, four columns, and links in `paper-400` at rest going `#F6F6F3` with a 1px bronze underline on hover — not `indigo-300`, because the footer has too many links for coloured type to stay calm.

### 3.6 Focus (C10)

Never removed, never a plain `outline: none`. Use `:focus-visible`, so mouse users never see it.

```css
--focus-ring:         0 0 0 2px #F6F6F3, 0 0 0 4px #344F7C;   /* light grounds  */
--focus-ring-inverse: 0 0 0 2px #262236, 0 0 0 4px #C18546;   /* dark grounds   */
--focus-ring-field:   0 0 0 3px rgba(52,79,124,0.16);          /* inputs         */
--focus-ring-error:   0 0 0 3px rgba(166,50,60,0.14);
```

The double ring — 2px of ground colour, then 2px of indigo — keeps the ring legible over both a card and the page behind it. The single-outline treatment currently in `globals.css` is replaced.

### 3.7 Print equivalents

A printing company prints its own collateral, and this is the part of a design system a print buyer will judge hardest.

> **These are starting points for a press conversation, not specifications.** Pull physical Pantone chips, run a press proof on the actual stock, then lock the values. Publishing unproofed CMYK builds in a printer's own brand guide would be an unforced error.

| Colour | Screen | Pantone (confirm against a physical swatch) | Note |
|---|---|---|---|
| Ink | `#262236` | ≈ PANTONE 5255 C / 2380 C | On uncoated, expect it to open up and read cooler. Ask the press for a rich-black build — start at `C60 M50 Y40 K100` — for large solids |
| Indigo | `#344F7C` | ≈ PANTONE 2378 C / 7687 C | Rarely printed as a solid |
| Bronze | `#C18546` | ≈ PANTONE 730 C / 7563 C | **Its true counterpart is a foil, not an ink** |
| Paper | `#F6F6F3` | Not an ink — a **stock** | Natural-white uncoated, 92–95 brightness. Never a printed tint |

**The bronze is a foil.** On print it should be bronze/antique-gold hot foil (Kurz Luxor/Alufin bronze, or PANTONE 871 C metallic where foil is not viable), a blind deboss of the wordmark on uncoated, or spot UV over a matte laminate ground. **Never a large foiled area** — a foiled panel looks cheap; a foiled rule looks expensive. Same rule as on screen: once per surface.

---

## 4. Final typography system

### 4.1 The families (C2, C3)

| Role | Family | Weights | Where it appears |
|---|---|---|---|
| Display | **Bodoni Moda** (variable, `opsz`) | 400, 500 | `display-xl` → `h2` only, **≥32px** |
| Text / UI | **Inter** (variable) | 400, 500, 600 | `h3` → micro, all UI, all body |
| Tamil | **Anek Tamil** (variable) | 400, 600 | All Tamil strings, any size |
| Mono | **JetBrains Mono** (digit-subset) | 400, 500 | Specs, GSM, ply, trim sizes, quantities, job refs |

**Why Bodoni Moda over Fraunces** (the codebase's current choice). Giambattista Bodoni was a printer, and the face that carries his name was cut for the press. For a Chennai printing house selling offset, foiling and finishing, a Didone display face is not a fashion borrow — it is the trade's own typography. Fraunces is a fine variable serif but it is a soft old-style, not a Didone: substituting it does not preserve the concept, it replaces it. Bodoni's fragility is real and is handled by rules, not by changing genre.

**Why Tamil is not optional.** The brand's name is Tamil (தூரிகை — *brush*). Any Tamil setting on the site, in the wordmark lockup, or on printed collateral uses Anek Tamil, whose widths let Tamil headings optically match the Latin. Never render Tamil in a system fallback.

**Why mono.** A print buyer reads specs as data. Setting GSM, ply, trim size and quantity monospaced with tabular alignment makes a spec table scannable and signals precision. Subset to digits, punctuation and uppercase Latin only.

```css
--font-display: "Bodoni Moda", "Didot", "Bodoni MT", "Playfair Display", Georgia, serif;
--font-text:    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-tamil:   "Anek Tamil", "Noto Sans Tamil", "Latha", sans-serif;
--font-mono:    "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
```

**Licensed upgrade path**, if budget appears, preserving the system exactly: Bodoni Moda → **Canela Deck** or **GT Sectra Display**; Inter → **Söhne** or **ABC Diatype**. Metrics are close enough that the scale below does not change.

### 4.2 The Bodoni constraint — rules, not suggestions

Bodoni's hairlines are genuinely thin. Below roughly 32px on a 1× display they break up, and on a low-DPI Windows monitor they can disappear.

- Bodoni is permitted at **32px and above only**. The single documented exception is the testimonial pull quote at 24px / weight 500 — approved because it is short, sits on a light ground and is never reversed. **No other exception exists.**
- Weight **400 for display, 500 for h1/h2**. Never 300 or lighter on screen.
- Never all-caps below 40px. Never reversed below 40px; on dark sections bump one weight step.
- **Never set a paragraph in Bodoni.** It is a display face here, full stop.
- On mobile this means `h2` and above only; `h3` and below are Inter.

### 4.3 The scale

Fluid between 375px and 1440px. Desktop is the ceiling, mobile the floor. Base 16px = 1rem.

| Token | Desktop | Mobile | Line height | Tracking | Weight | Family |
|---|---|---|---|---|---|---|
| `display-xl` | 88 | 40 | 0.92 | −0.03em | 400 | Bodoni |
| `display-lg` | 72 | 36 | 0.96 | −0.025em | 400 | Bodoni |
| `display-md` | 60 | 32 | 1.00 | −0.02em | 400 | Bodoni |
| `h1` | 48 | 30 | 1.08 | −0.02em | 500 | Bodoni |
| `h2` | 40 | 27 | 1.15 | −0.015em | 500 | Bodoni |
| `h3` | 32 | 24 | 1.20 | −0.012em | 600 | Inter |
| `h4` | 24 | 20 | 1.30 | −0.01em | 600 | Inter |
| `h5` | 20 | 18 | 1.40 | −0.005em | 600 | Inter |
| `h6` | 17 | 16 | 1.45 | 0 | 600 | Inter |
| `body-lg` | 18 | 17 | 1.70 | 0 | 400 | Inter |
| `body-md` | 16 | 16 | 1.70 | 0 | 400 | Inter |
| `body-sm` | 14 | 14 | 1.60 | 0 | 400 | Inter |
| `caption` | 13 | 13 | 1.50 | 0.005em | 400 | Inter |
| `overline` | 12 | 12 | 1.40 | **0.16em** | 600 | Inter, uppercase |
| `micro` | 11 | 11 | 1.45 | 0.02em | 500 | Inter |
| `spec` | 14 | 13 | 1.50 | 0 | 400 | Mono, `tnum` |
| `spec-lg` | 20 | 18 | 1.30 | −0.01em | 500 | Mono, `tnum` |

```css
--text-display-xl: clamp(2.5rem,   1.271rem + 5.246vw, 5.5rem);   /* 40 → 88 */
--text-display-lg: clamp(2.25rem,  1.329rem + 3.932vw, 4.5rem);   /* 36 → 72 */
--text-display-md: clamp(2rem,     1.283rem + 3.059vw, 3.75rem);  /* 32 → 60 */
--text-h1:         clamp(1.875rem, 1.414rem + 1.967vw, 3rem);     /* 30 → 48 */
--text-h2:         clamp(1.6875rem,1.28rem  + 1.738vw, 2.5rem);   /* 27 → 40 */
--text-h3:         clamp(1.5rem,   1.295rem + 0.874vw, 2rem);     /* 24 → 32 */
--text-h4:         clamp(1.25rem,  1.148rem + 0.437vw, 1.5rem);   /* 20 → 24 */
--text-h5:         clamp(1.125rem, 1.074rem + 0.219vw, 1.25rem);  /* 18 → 20 */
--text-body-lg:    clamp(1.0625rem,1.037rem + 0.109vw, 1.125rem); /* 17 → 18 */
--text-body-md:    1rem;
--text-body-sm:    0.875rem;
--text-caption:    0.8125rem;
--text-overline:   0.75rem;
--text-micro:      0.6875rem;
```

The codebase's `display-2xl` (up to 120px) is **removed** — it cannot hold a 20ch measure inside a 1280 container.

### 4.4 The eyebrow, and measure

The system's signature typographic device, above every section heading and on every card:

```
── 24px × 1px bronze #C18546 rule (major sections only)
OVERLINE · 12px / 600 / 0.16em / uppercase / bronze-700 #865B2D
    ↓ 12px
Section heading in Bodoni
```

Two forms, one system: **rule + eyebrow** for major page sections, **eyebrow alone** inside cards. **Never an eyebrow without a heading beneath it.** On dark, the eyebrow uses `bronze-500` (5.62:1), not `bronze-700`.

| Context | Max measure |
|---|---|
| Body prose (`body-lg` 18px) | **68ch** (~628px — six grid columns; the default) |
| Body prose (`body-md` 16px) | 72ch (cards, sidebars) |
| Display headline | 20ch — force line breaks; never let a 72px headline run past two lines |
| `h1` / `h2` | 28ch |
| Caption / spec | 48ch |

**Vertical rhythm is 8px.** Every margin, gap and section pad resolves to a multiple of 8; the 4px steps exist for icon nudges and optical alignment only. Paragraph spacing `1em` bottom, no top margins. Headings get `space-10` (40px) above / `space-4` (16px) below on desktop, `space-8`/`space-3` on mobile; a heading following an eyebrow gets `space-3`. `text-wrap: balance` on all headings, `pretty` on body. Hyphenation off in English, on for Tamil.

**Optical alignment beats mathematical alignment.** Bodoni's left sidebearing on a capital `T` is visibly larger than on an `H` — pull display headlines left by 1–3px so the stem, not the bounding box, aligns to the column.

### 4.5 OpenType and numerals

```css
/* Global */
font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
font-optical-sizing: auto;

/* Bodoni display — the reason to buy this face */
.display    { font-variation-settings: "opsz" 96; }

/* Any table, spec list, price, quantity, phone number */
.tabular    { font-variant-numeric: tabular-nums lining-nums; }

/* Stat block numerals — Bodoni figures are the strongest asset in the family */
.stat-figure{ font-family: var(--font-display); font-variant-numeric: lining-nums; }
```

Phone numbers, GSTIN, quantities, GSM values and prices are **always** tabular. A price list where the digits do not align is the fastest way to look like an amateur printer.

### 4.6 Font loading and budget (C3)

| Family | Subset | Axes shipped | Budget | Loading |
|---|---|---|---|---|
| Inter var | `latin`, `latin-ext` | wght 400–600 | ~48 KB | `swap`, preloaded |
| Bodoni Moda var | `latin` | wght 400–500, `opsz` | ~42 KB | **`optional`**, preloaded |
| JetBrains Mono | digits, punctuation, upper Latin | 400, 500 | ~15 KB | `optional` |
| Anek Tamil var | `tamil`, `latin` | wght 400–600 | ~62 KB | `swap`, **route-scoped** |

**Typical route: ~105 KB. Tamil route: ~167 KB.** Budget ≤120 KB / ≤180 KB.

`font-display: optional` on Bodoni and Mono means a slow connection never blocks the fold on a display face. **Self-host** via `next/font` — no Google Fonts CDN, which is an extra DNS lookup and TLS handshake on the critical path for a user on 4G in Royapettah. Ship `size-adjust` / `ascent-override` metric-matched fallbacks for Inter and Bodoni to hold CLS at zero. Load Anek Tamil only on routes that render Tamil.

---

## 5. Final component list

**158 components** across five layers plus a parallel 3D branch. This merges the 76-item list in [ia/09-components.md](docs/ia/09-components.md) with the ~108-item list in [ia/05-ui-components.md](docs/ia/05-ui-components.md), deduplicated, and organised on the layer model from [ia/04-component-hierarchy.md](docs/ia/04-component-hierarchy.md) (C11).

### 5.1 The layer rule

A component may only depend on layers below it. This single rule is what keeps a 3D-heavy site testable.

```
┌──────────────────────────────────────────────────────────────┐
│  L5  PAGES          Route-level. Compose sections. Own data   │
│                     fetching and metadata.                    │
├──────────────────────────────────────────────────────────────┤
│  L4  SECTIONS       Full-width page bands. Own their scroll    │
│                     behaviour and reveal.                     │
├──────────────────────────────────────────────────────────────┤
│  L3  COMPOSITES     Multi-part units — card grids, forms,      │
│                     configurators, accordions, overlays.      │
├──────────────────────────────────────────────────────────────┤
│  L2  PRIMITIVES     Single-purpose — Button, Heading, Field,   │
│                     Chip, Icon, Image.                        │
├──────────────────────────────────────────────────────────────┤
│  L1  FOUNDATION     Providers, layout primitives, motion       │
│                     wrappers.                                 │
└──────────────────────────────────────────────────────────────┘
```

**The 3D exception.** `Canvas3D` and everything under it form a sixth, parallel branch hanging off L3, loaded through a boundary — a dynamic import behind a capability check. **Nothing in L1–L2 may import from it, and only `StageCanvas` may cross it.** An ESLint boundary rule forbids importing `components/three/**` from anywhere except `StageCanvas`. That one rule is what keeps the performance budget from eroding as the project grows.

**Composition rule.** Primitives know nothing about print. Composites know nothing about layout. Sections compose both and own their spacing. A component that needs a page-specific exception is a component with the wrong boundary.

| Layer | Count |
|---|---|
| L1 Foundation | 14 |
| L2 Primitives | 33 |
| L3 Composites | 65 |
| L4 Sections | 26 |
| 3D branch | 20 |
| **Total** | **158** |
| L5 Page templates | 10 (not components) |

Larger than a typical marketing site, for two reasons that are both deliberate. The catalogue is genuinely large — 43 items across three pillars with real variant structure. And **every 3D component needs a designed non-3D counterpart**; that doubling is what makes Tier C a real experience rather than a broken one.

### 5.2 L1 · Foundation — 14

| # | Component | Purpose |
|---|---|---|
| 1 | `CapabilityProvider` ✱ | Resolves device tier A/B/C once on mount. Exposes `tier`, `reducedMotion`, `saveData`, `webgl`, `battery` |
| 2 | `SiteConfigProvider` ✱ | Single source for phone, WhatsApp, email, address, hours, GSTIN. **Makes the three-phone-number bug structurally impossible** |
| 3 | `QuoteProvider` ✱ | Global quote-sheet state and carried context (`service`, `item`, `variant`) |
| 4 | `MotionProvider` | `LazyMotion` + `MotionConfig reducedMotion="user"`, mounted once |
| 5 | `Container` | `size: prose \| narrow \| md \| lg \| xl \| max \| bleed` |
| 6 | `Section` | Full-width band with vertical rhythm. `tone: paper \| raised \| sunken \| ink`, `spacing: compact \| default \| large \| hero`. **Owns the page's spacing so no child ever sets a top margin** |
| 7 | `Grid` | Responsive 4 / 8 / 12 columns with the gutter and margin tokens |
| 8 | `Stack` | Vertical flow with a token gap |
| 9 | `Cluster` | Horizontal wrapping group — chips, tags, CTA pairs |
| 10 | `SplitPanel` | Two-up desktop, stacked mobile, media-first stacking order |
| 11 | `AspectBox` ✱ | Reserves aspect ratio. **Required around every media slot** — this is what holds CLS at zero |
| 12 | `Reveal` | 16px rise + fade on intersect, once. No-ops under reduced motion |
| 13 | `Parallax` | Translate on scroll. **Tier A only**, ≤20px travel |
| 14 | `StickyRange` | Pins a child across a scroll range |

✱ = its absence blocks the build.

### 5.3 L2 · Primitives — 33

**Typography (6)**

| # | Component | Note |
|---|---|---|
| 15 | `DisplayHeading` | One per page. `text-wrap: balance`, 20ch cap |
| 16 | `Heading` | `level: 1–6` and visual `size` are **independent props** — the old site used `<h5>` for body copy, and decoupling removes the incentive |
| 17 | `LeadText` | Intro paragraph, capped 68ch |
| 18 | `Text` | Body. `size`, `tone`, `weight` |
| 19 | `Eyebrow` | Overline + optional bronze rule. Never renders without a heading after it |
| 20 | `ProseBlock` ✱ | Rich text with vertical rhythm at a 68ch measure. Carries the copy the old site lacked |

**Actions (8)**

| # | Component | Note |
|---|---|---|
| 21 | `Button` ✱ | `primary` (ink) · `accent` (bronze) · `secondary` (outline) · `ghost` · `link` · `destructive`. Sizes `xs 32 / sm 40 / md 48 / lg 56 / xl 64`. `radius-xs` 2px, **sentence case**, Inter 500 (600 at lg/xl) |
| 22 | `QuoteButton` ✱ | Wraps `Button`; takes `context` and opens the pre-filled sheet |
| 23 | `IconButton` | Square at the same heights. 44×44 minimum hit area |
| 24 | `ButtonPair` | Primary + secondary, 16px gap; stacks full-width below `md` with the primary on top |
| 25 | `TextLink` | `inline` · `standalone`. Standalone is the **arrow-link** — the system's most-used navigational element; the arrow translates 4px and a 1px bronze underline draws left-to-right over 220ms |
| 26 | `WhatsAppButton` ✱ | Reads `SiteConfigProvider`; composes a first message from page context |
| 27 | `CallButton` ✱ | `tel:` from canonical config |
| 28 | `SkipLink` | First focusable element on every page |

> **Why sentence case, not tracked caps.** Tamil has no case, so uppercase cannot survive localisation; tracked caps at 12px are measurably slower to read on a mid-range phone; and the system already spends its uppercase budget on the eyebrow. An uppercase variant is approved for the footer CTA band only.

**Form (10)** — every field ships with a **visible `<label>`**. Placeholder-as-label is prohibited: it vanishes on focus, fails cognitive-accessibility guidance and breaks autofill. The old site relies on placeholders entirely, and the quote popup has neither labels nor placeholders.

| # | Component | Note |
|---|---|---|
| 29 | `Field` ✱ | Wrapper providing label, hint, error and full ARIA wiring |
| 30 | `TextInput` | 48px default, **never below 16px font** (iOS zooms at 15px and below) |
| 31 | `PhoneInput` ✱ | `country="IN"`, `inputmode="tel"`, `+91` prefix, 10-digit validation, formats as typed |
| 32 | `TextArea` | `min-height: 128px`, `resize: vertical`; the Requirements field starts at 160px |
| 33 | `Select` | **Native on mobile**; a custom listbox on desktop only, with full keyboard support |
| 34 | `QuantityInput` ✱ | Stepper with MOQ and step awareness. Mono tabular figures. Typing always permitted; clamps on blur with an explanation, never silently |
| 35 | `RadioCards` | Visual selection for service type |
| 36 | `Checkbox` | 20×20, `radius-xs`, 44px hit area via the wrapping label |
| 37 | `FileDrop` ✱ | PDF, AI, CDR, PSD, TIFF, JPG up to 100 MB. Per-file progress and removal, camera capture on mobile, plain `<input type="file">` behind the drop zone. **States the accepted formats and ceiling before the user tries** |
| 38 | `FormStatus` | `idle \| submitting \| success \| error`. **Preserves entered values on error** and surfaces a WhatsApp fallback |

**Media and display (9)**

| # | Component | Note |
|---|---|---|
| 39 | `Image` ✱ | **`alt` is a required prop** — an image without alt does not compile. Wraps `AspectBox`, enforces `srcset`/`sizes` |
| 40 | `MediaFrame` | Framed media with a hairline; `radius-none` always |
| 41 | `Poster` ✱ | Static render standing in for a 3D scene. **Always rendered first** |
| 42 | `Icon` | Phosphor Regular, `currentColor`, from the sprite |
| 43 | `Logo` ✱ | `variant: horizontal \| stacked \| mark \| reversed`. **SVG required — blocks the build.** Only a 472×317 raster exists today |
| 44 | `Chip` | `filter` · `tag` · `spec`. 40px tall, 8px gaps |
| 45 | `Badge` | MOQ and turnaround flags |
| 46 | `Divider` | 1px `paper-300` |
| 47 | `Skeleton` | Matches the final layout exactly, so nothing shifts |

### 5.4 L3 · Composites — 65

**Cards (10)** — all share one skeleton (`AspectBox` media → body → optional footer) so grids stay visually consistent across pillars.

| # | Component | Note |
|---|---|---|
| 48 | `PillarCard` | Routes to Printing / Packaging / Binding |
| 49 | `CapabilityCard` | Routes to a Tier-2 page; adds one spec highlight |
| 50 | `CatalogueCard` ✱ | The workhorse — 43 of these. **Renders no detail view without a description**: the gate against reproducing the two-word-label site |
| 51 | `OptionCard` | A variant within a capability |
| 52 | `MaterialCard` | Stock or finish, with a real swatch photograph |
| 53 | `WorkCard` | Case study. Image-led and borderless — the image *is* the card |
| 54 | `ArticleCard` | Journal entry |
| 55 | `ContactCard` ✱ | One contact method: `call \| whatsapp \| email \| visit` |
| 56 | `ReassuranceCard` ✱ | "No print-ready file? We design it for you." — answers a real objection the audit found in the existing FAQ |
| 57 | `TestimonialCard` | `bronze-50` ground, 2px bronze left rule, Bodoni 24px quote. **Empty-state-first** |

**Collections (12)** — every collection takes an `emptyState` prop and **renders nothing at all when empty** unless one is supplied.

| # | Component | Note |
|---|---|---|
| 58 | `PillarGrid` | 3-up desktop, stacked mobile |
| 59 | `CapabilityGrid` | 2–3 up, auto-fit |
| 60 | `CatalogueGrid` ✱ | Filterable, URL-encoded filter state, virtualised past 24 items, scroll position preserved on return |
| 61 | `FilterChipRow` ✱ | Chips + sort. Horizontally scrollable, **pins to the bottom of the viewport while a grid scrolls on mobile** |
| 62 | `MaterialGrid` | |
| 63 | `MaterialStrip` | Horizontal scroller with snap |
| 64 | `WorkGrid` | |
| 65 | `WorkCarousel` | Snap-scroll on mobile, visible prev/next always |
| 66 | `RelatedGrid` | |
| 67 | `EquipmentGrid` | The machine list on `/process/` |
| 68 | `TeamGrid` | Blocked on photography |
| 69 | `LogoWall` | Blocked on client logos and permission |

**Data display (11)** — the components that answer the specification buyer, and the biggest single content gap on the current site.

| # | Component | Note |
|---|---|---|
| 70 | `SpecStrip` ✱ | **The decisive component.** Four pinned facts under a capability hero: size range · quantity range · turnaround · MOQ. Sticky on desktop, horizontally scrollable on mobile. **Required on every capability page** |
| 71 | `SpecBlock` ✱ | **Fixed fields, sitewide, in an identical order everywhere:** sizes · stocks and GSM · finishes · page or ply range · MOQ · lead time · artwork requirements. The second page a buyer reads then takes five seconds |
| 72 | `SpecItem` | Label + value + optional tooltip |
| 73 | `DataTable` | Responsive; becomes stacked key/value cards below `md` |
| 74 | `ComparisonTable` ✱ | Offset vs digital, binding by page count. **The decision aid the old site never offered** |
| 75 | `StatRow` | |
| 76 | `StatItem` | Figure in Bodoni 48px, then a 12px overline label, then one sentence. Verified figures only |
| 77 | `HoursTable` ✱ | Business hours — never published on the old site |
| 78 | `AddressBlock` ✱ | Semantic address, map thumbnail, directions link, `LocalBusiness` schema |
| 79 | `UseCaseList` | "Ideal for…", each entry linking to a catalogue item |
| 80 | `TrustRow` | Response time, no obligation, confidentiality |

**Disclosure and navigation (11)**

| # | Component | Note |
|---|---|---|
| 81 | `Accordion` ✱ | `faq` · `footer` · `nav` · `legal`. 56px rows, whole row tappable, `FAQPage` schema |
| 82 | `AccordionItem` | |
| 83 | `TabBar` | Underline indicator slides between tabs |
| 84 | `Breadcrumb` ✱ | Full trail desktop, parent-only on mobile. `BreadcrumbList` schema. **Absent from the old site entirely** |
| 85 | `ChipNav` | Horizontally scrollable section index, pins under the header |
| 86 | `StickyRail` | Desktop sticky sidebar with scroll-spy; becomes `ChipNav` on mobile |
| 87 | `TableOfContents` | Legal and long articles |
| 88 | `SiblingStrip` | "Also in {pillar}" — the internal linking the current site has none of |
| 89 | `Pagination` | Journal and work indexes |
| 90 | `ShareRow` | |
| 91 | `Timeline` | About-page milestones |

**Overlays (9)**

| # | Component | Note |
|---|---|---|
| 92 | `Sheet` ✱ | Bottom sheet on mobile with drag-to-dismiss, centred modal on desktop. Focus trap, scroll lock, `Esc` |
| 93 | `QuoteSheet` ✱ | `Sheet` + `ContextChips` + `QuoteForm` |
| 94 | `CatalogueDetailSheet` ✱ | Deep-linkable, back-button correct, static route when opened directly |
| 95 | `MegaPanel` | Two or three link columns plus one featured slot. Focus-trapped, `Escape`-closable, column headings are headings — **not clickable dead labels** |
| 96 | `MobileMenuSheet` | Bottom-anchored, accordion pillars in place, search first, contact and hours at the foot |
| 97 | `SearchOverlay` | Type-ahead over a prebuilt index, grouped results, synonym mapping, quote fallback on no-match |
| 98 | `Lightbox` | Pinch on touch. **Never receives an asset under 700px** |
| 99 | `Tooltip` | Tap-to-open on touch |
| 100 | `Toast` | Announced politely. **Never used for form success on the quote form** — that gets a confirmation panel |

**Forms, composed (5)**

| # | Component | Fields |
|---|---|---|
| 101 | `QuoteForm` ✱ | Three steps — see §6.7. Variants `inline` (3 fields) · `full` · `sheet` |
| 102 | `QuickEnquiryForm` | Name, mobile, message. Used inside conversion blocks |
| 103 | `ContactForm` ✱ | Name, mobile, email, subject, message. **The contact page has no form at all today** |
| 104 | `SampleRequestForm` | Adds a delivery address and one qualifying line |
| 105 | `NewsletterForm` | Journal only |

All forms: honeypot + a time-to-submit check + rate limiting (the old forms have no spam protection at all), visible labels, validation on blur then on change, `FormStatus` preserving values on error, and a WhatsApp fallback. **No CAPTCHA** — it is an accessibility barrier and a conversion tax on the highest-intent page on the site.

**Utility (7)**

| # | Component | Note |
|---|---|---|
| 106 | `StepSequence` | `numbered` · `scroll-linked`. Degrades to static captioned frames |
| 107 | `QuoteBlock` | Pull quotes and, when they exist, real client quotes |
| 108 | `ContactChannels` | Call, WhatsApp, email — one tap each, number visible so it can be saved |
| 109 | `MapEmbed` | **Renders a static map image until tapped**, then loads the interactive embed. A third-party map iframe is otherwise one of the heaviest things on a contact page |
| 110 | `SpecDownload` | Ungated PDF with an optional "email it to me" |
| 111 | `EmptyState` | Always offers a route out — usually the quote form |
| 112 | `CookieBanner` | |

### 5.5 L4 · Sections — 26

Thin wrappers binding composites into full-width bands. Each owns its reveal and, where relevant, its scroll range.

**Shell (4):** `SiteHeader` · `PrimaryNav` · `SiteFooter` · `MobileActionBar`

**Bands (22):** `HeroSection` · `PageHero` · `PillarSection` · `ProofSection` · `ShowcaseSection` · `CatalogueSection` · `MaterialTeaserSection` · `ProcessSection` · `FounderSection` · `CommitmentSection` · `WorkSection` · `FAQSection` · `SpecSection` · `ConfiguratorSection` · `ProseSection` · `OptionSection` · `UseCaseSection` · `ComparisonSection` · `RelatedSection` · `SiblingSection` · `ContactMethodsSection` · `CTASection`

`CTASection` closes **every** page — non-negotiable. Variants: `form` (inline 3-field quote) · `split` (copy + contact methods) · `minimal` (single button). It always carries page context into the quote.

`ConfiguratorSection` is the one place where content and capability jointly decide the tree:

```
if (!capability.model3d)   → <MediaGallery>
else if (tier === 'C')     → <MediaGallery posterFrom={model3d} />
else                       → <Configurator3D reduced={tier === 'B'} />
```

The fallback is not an error state — it is a complete, well-designed gallery. A visitor on Tier C never sees a hole where 3D would have been.

### 5.6 3D branch — 20

Loaded **only** through `StageCanvas`.

**Infrastructure (11):** `StageCanvas` ✱ · `Canvas3D` · `SceneRoot` · `Lighting` · `Environment` · `Model` · `MaterialSwitch` ✱ · `Controls` · `ScrollRig` · `PerfMonitor` ✱ · `Preloader`

**Scenes and controls (9):** `Configurator3D` ✱ · `VariantPicker` · `SwatchButton` · `ConfigSummary` ✱ · `FinishViewer3D` · `SplitCompare` · `ExplodedView` · `StructuralViewer` · `ScrollSequence`

**`ConfigSummary` is where the 3D pays for itself.** It reads the live configuration and hands it to `QuoteButton` as context, so a buyer who has just built "Hard case · Rexin · Gold foil · Rounded corners" gets a quote form already carrying it. Instrument `configurator_interacted → quote_opened`; that single funnel decides whether any 3D beyond priority 1 gets built.

### 5.7 L5 · Pages — 10 templates

| # | Template | Instances | 3D | Rendering |
|---|---|---|---|---|
| T1 | Home | 1 | Press sequence + hero objects | Static, ISR 24h |
| T2 | Pillar hub | 3 | Comparison scene (Binding only, at launch) | Static |
| T3 | Capability page | 15 | Configurator, structural viewer or cutaway, where it earns it | Static |
| T4 | Catalogue detail | 43 entries | Inherits the parent scene | Overlay + static route |
| T5 | Showcase (`/materials/`) | 1 (+ children later) | Material and finish viewer | Static |
| T6 | Editorial (`/work/`, `/journal/`, case study, article) | grows | None | Static, ISR |
| T7 | Narrative (`/about/`, `/process/`) | 2 | Press-sequence reuse on `/process/` | Static |
| T8 | Conversion (`/quote/`, `/contact/`, thank-you) | 3 | **None — ever** | Static shell + client form |
| T9 | Document (legal, FAQ) | 4 | None | Static |
| T10 | Utility (404, search) | 2 | None | Static / client |

**T8 carries no 3D under any circumstances.** A form that waits on a WebGL context is a form that loses leads on a mid-range Android.

### 5.8 Cross-cutting contracts

Rules every component obeys, so the system stays coherent without a style police.

| Contract | Rule |
|---|---|
| **Tokens only** | No hard-coded colour, size or spacing value anywhere in a component |
| **Reduced motion** | Every animated component has a static equivalent |
| **Focus** | Visible double ring, never suppressed |
| **Touch** | 44px minimum, 48px on primary actions, 8px minimum separation |
| **No hover-only** | Every hover affordance has a rest-state equivalent on touch |
| **Aspect ratio** | Declared on every media slot, including 3D posters |
| **Alt text** | Required by the type. **An image without alt does not compile** |
| **Copy gate** | Catalogue and trust components render nothing rather than a label with no description. `CapabilityPage` **fails the build** if `specs.length === 0` |
| **Single source of contact** | Every phone, email, address and hours value reads from `SiteConfigProvider` |
| **Server-first** | **No primitive may need JavaScript to display its content.** Every heading, paragraph, spec and figure renders server-side. JavaScript adds interaction, never information |
| **3D boundary** | Only `StageCanvas` may import from `components/three/**`, enforced by ESLint |

### 5.9 Content model

```
Pillar          slug · title · lead · body · hero · capabilities[] · faqs[]
  └── Capability  slug · pillar→ · title · lead · body · specs[] · options[]
        │                · model3d? · gallery[] · useCases[] · faqs[] · seo
        └── Product     slug · capability→ · name · description · specs[]
                         · images[] · model3d? · materials[]

Material        slug · name · category · swatch · specs[] · usedIn[]
CaseStudy       slug · client · pillars[] · brief · specs · images[] · outcome
Article         slug · title · excerpt · body · cover · publishedAt
SiteConfig      phone · whatsapp · email · address · hours · gstin · social[]
```

`SiteConfig` is a **singleton and the only place a phone number may be authored.**

**Content ownership matrix** — each row is owned by exactly one page; everyone else links. This is the defence against the duplication that defines the current site.

| Content | Owner | Everyone else |
|---|---|---|
| Company story, founder | `/about/` | Links, with a two-line summary at most |
| How a job runs, proofing, artwork spec | `/process/` | Links |
| Machine and capability list | `/process/` | Home shows three; links for the rest |
| Material and finish detail | `/materials/` | Capability pages link to the relevant anchor |
| Turnaround and MOQ for a technique | That capability page | Hubs show a range |
| Item specs | The catalogue entry | Rendered wherever the item card appears |
| Pricing guidance | `/quote/` | Nobody publishes numbers |
| Delivered work | `/work/` | Capability pages pull the two case studies tagged with them |
| FAQ answers | `/faq/` | Home shows four; tagged pages show the three relevant ones |
| Contact details | `SiteConfig` | Every surface reads from it — never a hard-coded number again |

### 5.10 Build waves

| Wave | Components | Delivers |
|---|---|---|
| 1 · Foundation | L1 + L2 (1–47) | Tokens, type, buttons, fields, images. Nothing renders yet |
| 2 · Shell + conversion | Shell sections, 92–105, `MobileActionBar` | **The site converts.** Ship here if the timeline compresses |
| 3 · Content | 48–91, 106–112, remaining L4 bands | Every page renders statically and reads well |
| 4 · Catalogue + comparison | 60, 61, 74, 94, `SearchOverlay` | Full navigation and comparison |
| 5 · 3D | The whole 3D branch, scene by scene | Distinctiveness |
| 6 · Trust | 53, 57, 68, 69 | Ships as real content arrives |

**Waves 1–4 produce a site better than the current one on every measure in the audit.** Wave 5 is what makes it distinctive, and it is additive — nothing before it depends on it. **Do not invert them.**

---

## 6. Final page structure

Section order below is **the mobile order**. Desktop only ever widens or pairs these blocks; it never reorders them.

**Sitewide section rules**

1. One `<h1>` per page, in the first section. Sections are `<h2>`; nothing skips a level. (The old site: one page has two H1s, twenty-three have none, and the entire About story sits inside five `<h5>` tags.)
2. Vertical rhythm per §2.2. Hero and 3D showcase bands get the `hero` step.
3. Every section is either full-bleed **or** inside the content measure. Never a half-measure inset — that is the visual signature of a page builder.
4. **A section with no copy does not ship.** The old homepage carries a "Technology We Possess" heading with nothing beneath it; that is the failure mode being designed out.
5. One bronze fill per page, at most two bronze marks per viewport.
6. Every 3D section has a static poster that is what actually loads first.
7. The conversion block closes every page.

### 6.1 The CTA ladder

Five actions, ranked by the commitment they ask for. A page offers the one matching where the buyer is, and never more than one primary at a time.

| Rung | Action | Commitment | Serves | Channel |
|---|---|---|---|---|
| 5 | **Call** | Highest — synchronous, now | Urgent local buyer, returning client | `tel:` |
| 4 | **WhatsApp** | High but casual — the default business channel in Chennai | Everyone; the fastest reorder path | Deep link with page context |
| 3 | **Get a quote** | Medium — a form, 60–90 seconds | Specification buyer, institution, publisher | `/quote/` |
| 2 | **Request a sample** | Low — an address and a reason | Material-led buyers: rigid boxes, hard case, finishes | `/quote/?intent=sample` |
| 1 | **Download the spec sheet** | Lowest — no contact required | Researching publisher, designer preparing artwork | Ungated PDF |

**Counter-intuitive but correct:** *Request a sample* converts higher than *Get a quote* on material-heavy pages while asking for less. A print buyer holding the board has effectively chosen the supplier.

**Conversion channel targets:** WhatsApp 40% · Call 25% · Quote form 25% · Sample 8% · Spec download 2%. **WhatsApp and phone are the majority.** Any strategy that optimises the form while treating the phone number as a footer detail is optimising the minority channel — which is the current site's exact mistake.

Primary CTA per template: Home *Get a quote* · Printing hub *Get a quote* · Packaging and Binding hubs *Request a sample* · Capability *Get a quote (this capability)* · Catalogue detail *Get a quote (this item)* · Materials *Request the sample kit* · Work *Start a job like this* · Process *Get a quote* · **About *Contact us*** (nobody buys off an About page) · Contact *Send enquiry* · Quote *Continue / Submit*.

### 6.2 T1 · Home (12 sections)

The current homepage is a 60-heading, 52-image contents page with two competing H1s and 2,730 characters. The replacement is a **narrative that routes**: what → proof → what exactly → how → who → act.

| # | Section | The question it answers | Content | 3D | CTA |
|---|---|---|---|---|---|
| 1 | **Hero** `h1` | "Who is this and what do they do?" | One H1 naming the service **and Chennai**. One supporting line, 20–28 words. | Poster-first; the press sequence's first frame. **Static on mobile at every tier** | Get a quote · See our work |
| 2 | **Credibility strip** | "Are they real?" | Four facts: years, jobs delivered, in-house capabilities, Chennai. **Numbers only — no icons, no cards** | — | — |
| 3 | **Three pillars** `h2` | "Do they do my thing?" | Printing · Packaging · Binding. One image, one sentence (12–18 words), one link each | Tier A card tilt only | Per-card |
| 4 | **Press sequence** `h2` | "Can they actually make it?" | Scroll-linked: plate → press → finishing → bound. Four captions, ≤14 words each. **Fills the empty "Technology We Possess" heading** | **Signature scene** | Our process → |
| 5 | **Catalogue preview** `h2` | "What exactly can I order?" | 8 tiles from the 43, filter chips above | — | See all products |
| 6 | **Materials teaser** `h2` | "How premium does this get?" | Three finishes: foil, spot UV, emboss. Real-time lighting is the point | **Finish close-up** | Explore materials |
| 7 | **Founder** `h2` | "Who am I dealing with?" | Mr. R. Ambeth, 15+ years, quality control → finishing and binding specialist. Portrait + 60 words | — | About us |
| 8 | **Commitments** `h2` | "Why them over the next result?" | Leading Technology · Best Designs · On Time Delivery · Affordable Price — each with its one real sentence, rewritten | — | — |
| 9 | **Work** `h2` | "Show me delivered jobs" | 3 case studies. **Hidden entirely until real ones exist** | — | See all work |
| 10 | **Client logos** `h2` | Backs "From Start-Ups to Big Brands" | Logo wall. **Hidden until logos and permission exist** | — | — |
| 11 | **FAQ** `h2` | Removes the last objection | The four real FAQs, accordion; fifth row links to `/faq/` | — | All questions |
| 12 | **Conversion block** `h2` | "Start." | Inline 3-field quote form, address, hours, map thumbnail | — | Get a quote · WhatsApp |

**The two hidden sections must collapse cleanly.** With both absent the page runs 1–8 then 11–12 and still reads as a complete argument. That is the test every conditional section must pass.

**Cut from the old homepage:** the six duplicate product grids (they are the catalogue now), the second H1, the "Get Started Now" heading with no content, and all theme-demo imagery.

### 6.3 T2 · Pillar hub (3 instances, 11 sections)

A hub routes; it does not sell. The sale happens one level down. Replaces pages carrying 195, 230 and 417 characters.

| # | Section | Job |
|---|---|---|
| 1 | Hero `h1` | Name the pillar and the decision it involves. H1 + lead + breadcrumb |
| 2 | Section chips | Sticky scroll-spy orientation on a long page |
| 3 | Overview `h2` | 150–200 words. **The copy the current hubs do not have** |
| 4 | **Choose your method** `h2` | **The decision — the most important section on the page.** Comparison table on the axis that actually decides it |
| 5 | Capability cards `h2` | Route to the right technique: image, name, one sentence, spec highlight |
| 6 | Catalogue grid `h2` | Filterable, all items in this pillar |
| 7 | Materials `h2` | Strip of the materials relevant to this pillar |
| 8 | Process `h2` | Four steps, condensed → full process |
| 9 | Work `h2` | Case studies tagged with this pillar. Hidden until they exist |
| 10 | FAQ `h2` | 3–4 pillar-specific questions, filtered from `/faq/` |
| 11 | Conversion block `h2` | Pillar-specific CTA |

**Section 4 changes shape by pillar:**

| Pillar | Decision axis | Table columns |
|---|---|---|
| Printing | **Quantity** | Method · best run length · unit cost trend · turnaround · colour fidelity |
| Packaging | **What it protects and how it sells** | Type · strength · print surface · MOQ · typical use |
| Binding | **Page count** | Method · page range · lay-flat · spine printable · durability · cost |

Binding gets the 3D comparison scene at launch; Printing and Packaging use the table.

### 6.4 T3 · Capability page (15 instances, 13 sections)

The biggest content lift on the site — these pages currently average 130 characters each. The section order is **the buyer's questions in the order they ask them.**

| # | Section | The question | 3D |
|---|---|---|---|
| 1 | Hero `h1` | Name the technique in the buyer's words. H1 + lead + breadcrumb + pillar eyebrow | Poster of this page's scene |
| 2 | **Key specs** | *"Can they do my job at all?"* — answered in five seconds. Four pinned facts: size range · quantity range · turnaround · MOQ | — |
| 3 | What it is `h2` | 120–180 words, plain language, no jargon without a gloss | — |
| 4 | **Interactive viewer** `h2` | *"What will it actually look like?"* — **the reason 3D exists on this site** | **Primary scene.** URL-encoded state; static gallery fallback |
| 5 | Choose your options `h2` | Every variant as a **spec row, not a photo grid** | Selecting a row drives the viewer |
| 6 | Full specification `h2` | The procurement answer. `SpecBlock` fixed fields | — |
| 7 | Best for `h2` | 3–4 use cases named by segment, each linking to a catalogue item | — |
| 8 | **Compared to** `h2` | Handle the alternative honestly, **including when to choose the other one** | — |
| 9 | Products `h2` | Catalogue items using this technique | — |
| 10 | Work `h2` | Up to two tagged case studies. Hidden until they exist | — |
| 11 | FAQ `h2` | Three questions tagged to this capability | — |
| 12 | Siblings `h2` | "Also in {pillar}" — recovers a wrong guess | — |
| 13 | Conversion block `h2` | Quote CTA carrying this capability as a parameter | — |

**Specs come before the 3D deliberately.** A buyer whose quantity is outside the range should find that out in five seconds rather than after a WebGL scene loads.

**Section 8 is the one buyers remember.** Telling someone that centre pin is the wrong choice above 64 pages is what makes the rest of the page believable.

### 6.5 T4 · Catalogue detail (43 entries)

Bottom sheet on mobile, side panel on desktop, real static route when opened directly.

1. **Media** — item photography. **Assets under 700px are capped at tile size and never enlarged.**
2. **Name + parent** — item name `h2`, link to the capability that makes it
3. **Description** — 40–60 words. **Gate: no description, no detail view**
4. **Spec block** — sizes · stock · finish options · MOQ · turnaround
5. **CTA row** — Get a quote (pre-filled) · WhatsApp about this
6. **Related** — three items from the same capability

### 6.6 T5 · Showcase — `/materials/`

The dedicated home for 3D, so the technique is not scattered thinly across the site.

1. Hero `h1` — "Print is a material. Here it is." — hero surface under moving light
2. **Papers and boards** `h2` — swatch viewer: GSM, texture, opacity
3. **Cover materials** `h2` — PU leather · rexin · special sheets, side by side → *Request a sample*
4. **Finishes** `h2` — **the upsell.** Spot UV · foiling · emboss · lamination under real-time lighting → *Request a sample*
5. **Board and flute** `h2` — cutaway: ply count, flute profiles
6. **Sample kit** `h2` — converts the whole page

Every viewer state names a real, orderable material and links to the capability that uses it.

### 6.7 T8 · Conversion

#### `/quote/` — three steps, contact last (C19)

The single most valuable component on the site. It replaces a popup whose fields have neither labels nor placeholders.

| Step | Fields | Why |
|---|---|---|
| **1 · What** | Service (Printing / Packaging / Binding / Not sure yet) → product → quantity | **Pre-filled when arriving from a capability or catalogue page.** The buyer's first interaction is a tap, not typing |
| **2 · Details** | Size · pages or ply · finish · required-by date · artwork upload · notes | Everything optional except the date. Institutions arrive with a deadline |
| **3 · You** | Name · mobile · email · company (optional) · consent | **Contact last** — the buyer has already invested |

Field metrics come from [design-system §12](docs/design-system.md): 48px height, 16px minimum font, `1px #86867B` border (3.40:1 — this is why inputs look slightly heavier than the rest of the system, and that is deliberate), label above the field at 12px gap, 24px between groups. Single column on mobile always.

- **Mark optional fields, not required ones.** Most fields here are required; flagging the minority is less noise and reads as more confident.
- **Validate on blur first**, then on change once an error shows. Never on keystroke before the first blur — that flags a half-typed email as wrong and is the fastest way to make a form feel hostile.
- **Never disable a submit button to signal an invalid form.** Leave it enabled, submit, and move focus to an error summary marked `role="alert"`.
- Right rail (desktop) / collapsed summary (mobile): what happens next, the response SLA, the phone number, and WhatsApp as the alternative.
- Submit label is *Send enquiry*, not *Submit*. Below it, a reassurance line: *We reply to every enquiry within one working day. Mon–Sat, 9:30am–7pm.*
- **Success replaces the form with a confirmation panel** carrying a reference number, the expected reply window and the WhatsApp number as a second route. Not a toast — this is too important for a toast.
- The **consent checkbox links to the privacy policy, which does not yet exist and must be written.**

#### `/contact/`

The current page is 106 characters of address split across six `<h4>` tags, with no form, no email and no map.

Hero `h1` → **enquiry form** (name · mobile · email · message) → direct channels (call, WhatsApp, email, one tap each, number visible so it can be saved) → address block with a landmark and a real map → business hours → "prefer a full quote?" → `/quote/`.

#### `/quote/thank-you/`

Confirmation · what happens next with the SLA in hours · reference number · the WhatsApp shortcut if it is urgent · three links back into the site. Conversion tracking fires here.

### 6.8 Remaining templates

**T6 · `/work/`** — hero + lead → filter chips (pillar · segment) → case study grid → conversion. **Empty state is a designed state: if no case studies exist the page does not launch and the nav item does not render.**
**Case study** — hero (client, job, one-line outcome) → specs at a glance → the brief (100–150 words) → what we did (200–300 words with production detail) → gallery (4–6 images) → services used, tagged to every capability involved → client quote (real, attributed, with permission; omitted if absent) → "Start a job like this" pre-filled with those services.
**T6 · `/journal/`** — **ships only when at least three genuine articles exist.** All nine current posts are Lorem Ipsum and are deleted, not migrated.

**T7 · `/about/`** — hero `h1` → founder (200 words as **prose**, not five `<h5>` tags) → timeline → facility → commitments → numbers → contact-led conversion. Gates: **founder portrait**, founding year confirmed, facility photography.
**T7 · `/process/`** — hero → six steps (enquiry → quote → artwork → proof → print → finish → deliver, reusing the press sequence) → artwork requirements (bleed, resolution, colour mode, formats) → proofing (digital vs press proof, and what each catches) → turnaround table by job type → **machinery — the real machine list, filling the site's longest-standing empty heading** → delivery (Chennai coverage, outstation, packing) → conversion.

**T9 · `/faq/`** — hero → category filter → accordion groups (Ordering · Artwork · Printing · Binding · Packaging · Delivery · Payment) → "still stuck?" conversion. **Twelve questions minimum**, built out from the four real ones that exist. `FAQPage` schema.
**T9 · Legal** — hero, last-updated date, sticky TOC, 68ch body, contact block. `/privacy-policy/` is new and is a compliance gap until it exists.

**T10 · `/404/`** — "This page has moved or never existed" · search field · three pillar cards · "Or tell us what you need" → `/quote/`. **It will receive real traffic from day one** — twenty-plus URLs are being retired.
**T10 · `/search/`** — query field, results grouped as Services · Products · Materials · Answers, empty state showing the pillars and top six items, and a no-match state routing to `/quote/` with the query carried into the requirements field. **A failed search is a buyer describing their job in their own words; it should become a lead, not a dead end.**

### 6.9 Mobile structure

Mobile is the primary case, not a breakpoint. The buying behaviour that follows from a mid-range Android in Chennai — call, WhatsApp, decide in under two minutes — is a phone behaviour.

**Thumb zones.** A 6.1" phone held one-handed gives roughly the lower two-thirds to the thumb. Everything actionable lives there; everything informational lives above it. Consequences: the menu opens as a **bottom sheet, not a side drawer**; **configurator controls sit below the canvas** so fingers do not cover the thing being evaluated; **filter chips pin to the bottom** while a grid scrolls; the form submit is always in the bottom third; and every sheet's close control is duplicated as a swipe-down, because a ✕ in the top-right corner is out of reach on a large phone.

**Menu sheet (C9)** — full-height, rises from the bottom. Search first (43 items need a way in) → the three pillars as **accordions expanding in place, never a second screen** (drill-down forces a back-tap for every wrong guess) → Materials, Work, About → a secondary row of Process · FAQ · Journal → a full-width *Get a quote* → phone, WhatsApp and hours at the foot. **Many visitors open the menu looking for a phone number, not a page.** Dismiss by swipe-down, scrim tap, ✕, or hardware back. One pillar open at a time; the expanded pillar's header row is itself a link to the hub.

**Persistent action bar (C29)** — fixed bottom, **64px + `env(safe-area-inset-bottom)`, present from first paint**: `📞 Call · 💬 WhatsApp · ⟨Get a quote⟩`. It hides while the menu sheet or a modal is open and while a form field has focus, and it is replaced by a context bar on capability and catalogue pages. **When a section's own primary CTA scrolls into view, the sticky bar's primary demotes to secondary** so they never compete. Hidden entirely on `/quote/` and `/contact/`, where the page *is* the CTA.

**Touch minimums used:** primary CTA 48px · sticky bar actions 56px · nav rows 56px · accordion headers 56px (whole row) · form inputs 52px · filter chips 40px with 8px gaps · icon-only buttons 48×48.

**Type on mobile.** Display drops to the mobile column of §4.3; `display-xl` at 40px is the ceiling. **Bodoni is still ≥32px only**, which in practice means `h2` and above. Body stays 16px minimum, never 14px for reading copy and never below 16px on any input. Line height loosens to 1.7 and tracking returns to 0 — tight display tracking that works at 88px looks broken at 40px. Headlines get `text-wrap: balance` and an explicit 20ch cap so a 40px headline never produces a one-word orphan.

---

## 7. Final asset structure

### 7.1 The problem being fixed

All 168 extracted images live in `assets/` at the repository root. **Not one is wired into the application** — `public/` contains exactly two files (`brand/Logo-Header.png`, `brand/Logo-Original.png`), `next/image` is not used anywhere in `src/`, and every media slot renders `PlaceholderMedia`. The library is a working archive, not a shipped asset tree.

### 7.2 Final repository layout

```
thoorigai_printing/
├── MASTER_PROJECT_PLAN.md          ← this document
├── docs/
│   ├── _archive/                   superseded working documents (all of docs/ia/, redesign-report, sitemap)
│   ├── content-audit.md            retained — the factual baseline
│   ├── image-inventory.md          retained — the per-file record
│   ├── image-usage-guide.md        retained — the per-file processing brief
│   └── copy/                       ★ the copy deck: one file per page, one per catalogue item
│
├── _source/                        ★ RENAMED from assets/ — masters, never shipped, excluded from tsconfig
│   ├── logos/  services/  products/  gallery/  backgrounds/  icons/
│   ├── _theme-demo-unused/         DELETE once the client confirms (54 files, 6.2 MB, 0% value)
│   └── _reshoot/                   ★ incoming photography
│
├── _raw/                           the crawl archive — kept for provenance, never shipped
├── _work/                          the extraction scripts — kept, never shipped
│
├── public/
│   ├── brand/
│   │   ├── logo.svg  logo-stacked.svg  logo-mark.svg  logo-reversed.svg   ★ BLOCKING
│   │   ├── favicon.ico  icon.svg  apple-icon.png  icon-192.png  icon-512.png
│   │   └── og-default.png
│   ├── icons/sprite.svg            ★ Phosphor Regular, currentColor
│   ├── img/
│   │   ├── hero/                   full-bleed, 2400–2560px long edge
│   │   ├── pillars/                3 images, 3:2
│   │   ├── capabilities/           15 banners, 1600px
│   │   ├── catalogue/              43 tiles, 4:5, 800px
│   │   ├── materials/              swatches, 1:1
│   │   ├── facility/               press floor, machinery, 16:9
│   │   ├── work/                   case studies — empty until content exists
│   │   └── people/                 founder, team — empty until shot
│   ├── 3d/
│   │   ├── models/                 .glb, Draco + Meshopt
│   │   ├── textures/               .ktx2
│   │   ├── env/                    one shared compressed HDR
│   │   └── posters/                ★ one static render per scene, at the same framing
│   └── docs/                       artwork-spec.pdf, per-capability spec sheets
│
└── src/
    ├── app/                        routes — L5
    ├── components/
    │   ├── foundation/             L1 — providers, layout, motion wrappers
    │   ├── primitives/             L2
    │   ├── composites/             L3
    │   ├── sections/               L4
    │   └── three/                  3D branch — importable ONLY via StageCanvas
    ├── content/                    CMS schemas + queries
    ├── lib/                        capability detection, config, seo, analytics
    ├── hooks/
    ├── styles/                     globals.css — the Tailwind v4 @theme block
    └── types/
```

★ = does not exist yet.

**Migration of the current `src/` tree:** `components/layout/{navbar,mobile-menu,footer}` → `components/sections/` (they are L4 shell); `components/layout/{container,section}` → `components/foundation/`; `components/ui/*` → `components/primitives/`; `components/motion/*` → `components/foundation/`; `src/sections/*` → `components/sections/`; `src/features/quote/*` → `components/composites/forms/`; `src/three/config.ts` → `components/three/config.ts`. The layer-named tree is what the ESLint boundary rule keys off (C12).

### 7.3 Asset rules

| Rule | Detail |
|---|---|
| **Masters never ship** | `_source/`, `_raw/`, `_work/` are excluded from `tsconfig` and from the build. Add `_source` to the existing exclude list |
| **One optimised original per image in `public/img/**`** | `next/image` derives the responsive set from the `deviceSizes` already configured in `next.config.ts` (360–1920) |
| **Format** | AVIF with a WebP fallback — already configured. SVG for the logo, the feather motif and all icons |
| **Naming** | kebab-case, descriptive, prefixed by role: `binding-hard-case-rexin.webp`, not `Hard-2.webp` |
| **Alt text** | Written at the point each image is placed. Enforced by the `Image` component's required prop |
| **Cut-outs** | Save the alpha mask separately from the composite; alpha edges degrade badly through repeated lossy round-trips |
| **3D posters** | Every scene ships one, at the same framing as the live scene, in `public/3d/posters/` |

---

## 8. Final image usage plan

Source of truth: [docs/image-usage-guide.md](docs/image-usage-guide.md), which inspected every file, over [docs/image-inventory.md](docs/image-inventory.md) and [redesign-report §3](docs/redesign-report.md) where they disagree (C21, C22, C23).

### 8.1 The library, categorised

| Category | Test it must pass | Count |
|---|---|---|
| **Hero** | Carries a full-width band alone at 1400px+. Survives a text overlay and a crop to 21:9 | **14** |
| **Portfolio** | Shows *real work produced for a real customer*. Evidence, not illustration | **8** |
| **Service** | Explains or represents an offering on a card, tile or explainer row. Illustration is fine | **68** |
| ~~**Discard**~~ | Duplicate, superseded, unusable quality, or text baked into pixels | **78** |

| Folder | Hero | Portfolio | Service | Discard | Total |
|---|---|---|---|---|---|
| `gallery/` | 6 | 2 | 3 | 5 | 16 |
| `backgrounds/` | 2 | 0 | 0 | 2 | 4 |
| `products/` | 2 | 3 | 8 | 0 | 13 |
| `services/` | 3 | 3 | 38 | 5 | 49 |
| `logos/` | 1 | 0 | 1 | 8 | 10 |
| `icons/` | 0 | 0 | 18 | 4 | 22 |
| `_theme-demo-unused/` | 0 | 0 | 0 | 54 | 54 |
| **Total** | **14** | **8** | **68** | **78** | **168** |

**Discarding 78 files removes 46% of the library and the great majority of its weight**, while losing nothing rendered on a page today except four collages that must be rebuilt as markup anyway.

Portfolio is deliberately the strictest bucket. A stock brochure template is not a sample of your work, and captioning it as one is the fastest way to lose a commercial client who recognises it.

### 8.2 The five things to act on first

1. **The four best images are on no page at all.** `Slide-1-Image-2.webp` (the studio's own product range, staged), `Technology.jpg` (a Heidelberg press), `11-Answer-Sheets.webp` (real OMR sheets) and `Page2-Img-1.webp` (the Prasar Bharati job) render **zero times** on the live site. Between them they are the whole argument for hiring this business.
2. **There are only eight images of real client work, and four are unusable at size.** The named credentials are **Prasar Bharati / All India Radio Madurai**, **ActiveSURE**, **LADORN U** and **H K Nath Metals**. Three of the four sit in files under 500px. A half-day reshooting the physical samples still on the shelf would do more for the site than any amount of retouching.
3. **Re-encode before upscaling.** 38 of 92 rasters are below 0.35 bits per pixel — detail has already been thrown away. `Menus.webp` is 7 KB for 800×800; `board-Rounded.webp` is 30 KB for 1500×1500. Upscaling amplifies the artefacts.
4. **Four files have marketing copy baked into the pixels** — `5-Book-Cover.webp`, `Offset-Featured.webp`, `Printing-Featured-Image.webp`, `Digital-BW-Featured.webp`. Invisible to search, impossible to translate, soft on retina. **Rebuild each as a photo plus live HTML text** (C21).
5. **Every image has empty alt text.** All 168. Separate from categorisation and cheaper than any of it.

### 8.3 Placement plan — the images that carry the site

| Asset | Px | Where it goes |
|---|---|---|
| `services/Board-on-board-hard.jpg` | 2447² | **The only asset with real zoom headroom.** Binding pillar hero, full-bleed. Also the texture reference for the hard-case 3D model. Currently on one page — badly underexploited |
| `services/Hard.webp` | 1000², alpha | **The first 3D subject.** Already transparent, already carries the Thoorigai mark on the cover, already dimensional. Homepage hero object, configurator, loading state |
| `gallery/Slide-1-Image-2.webp` | 800×510 | **Homepage hero** — the single most representative image the studio owns. Upscale 2× to 1600px |
| `gallery/Technology.jpg` | 1920×1080 | `/process/` machinery band, full-bleed dark. **Verify it is the studio's own press before claiming it as such** |
| `backgrounds/Printing-press-BG-1.jpg` | 1600×1194 | Homepage hero environment plate under a 55–65% dark scrim. **Keep the JPG master** (1.09 bpp); the WebP is a quarter of the data (C22). Upscale 2× |
| `products/Corrugation.webp` | 1363×707 | Packaging pillar card and hero — the best "we make all of this" image in the library |
| `services/Printing-Featured-Image.webp` → **discarded** | — | Printing pillar card uses `gallery/Slide-1-image-4.webp` (a digital press laying down CMYK) instead |
| `gallery/Page2-Img-1.webp` | 500×497 | **Marquee credential** — Prasar Bharati / All India Radio. Commercially the most valuable image in the library, at 500px, rendering on zero pages. **Reshoot and lead with it** |
| `products/Box-1.jpg` | 455×330 | ActiveSURE client job. Highest bpp in the library (2.85) so it upscales unusually well — but it is the smallest business image there is |
| `products/Drawer-Box-1.webp` | 980×799 | Rigid-box capability hero — the strongest premium-packaging proof owned |
| `products/open-wooden-black-box-floor.webp` | 800×534 | The only genuinely *moody* product shot. Natural anchor for a dark premium-packaging band |
| `services/11-Answer-Sheets.webp` | 800×541 | Digital B/W capability — real production output, sharpest in its folder, on zero pages |
| `services/8-Synthetic-Prints.webp` | 800×450 | Sharpest image in the entire library (60). Homepage capability strip |
| `services/Curve-rounded-binding.webp` | 1000×716 | Binding hub explainer — shows a spine difference a customer cannot otherwise picture. **Rebuild the baked-in red labels as live text** |
| `services/Perfect.webp` | 800×534, alpha | Greyboard thickness explainer on `/materials/` — genuinely informative and currently unused |
| `services/Special-Sheets.webp` | 800×788 | Exploded-parts animation; each element cuts out separately |
| `gallery/Slide-1-Feather-FIN.webp` | 600², alpha | **Vectorise as SVG.** The brand feather as a CMYK-gradient plume — a visual pun on four-colour printing. Becomes the watermark, divider, loader and scroll accent |
| `gallery/Canon-Image.webp` / `Printer.webp` | 1330×803 / 1000×750 | Equipment strip on `/process/`. **Use one or the other, never both** |
| `services/Hard-2.webp` | 800², alpha | Book-cover card; the "design your cover" interactive where the front face is swapped (C23) |
| `logos/Logo-Original.png` | 472×317 | **Reference only. Vectorise, do not upscale.** Regenerate the entire favicon and OG set from the new SVG |

### 8.4 Do not ship

| What | Count | Why |
|---|---|---|
| `_theme-demo-unused/` — the entire folder | 54 | Coffee cups, popcorn, lemons, honey branding, decorative leaves, an OpenAI logo, 20 stock filler photographs. **63% of the library's weight and 0% of its value.** Two files are the *theme vendor's own logo* — deleting them avoids shipping another company's mark |
| The four baked-text collages | 4 | `5-Book-Cover` · `Offset-Featured` · `Printing-Featured-Image` · `Digital-BW-Featured`. Rebuild as markup over a clean photo |
| Superseded duplicates | ~14 | `Slide-1-Feather` (draft) · `Slide-1-Image-1` (worse ground than `Page2-Img-1`) · `Slide-1-Image-3` (byte-identical to `1-Slide-1-Image-3`) · `Slide-1-image-4-2` (crushed shadows) · `Steps-New` (softest of three) · `Printing-press-BG-1.webp` · `Slider-BG-1.webp` · `gold-wiro-binding` (keep the `-1`) · seven of the eight favicon variants |
| Four AI/SaaS theme icons | 4 | `chart-bar-light-2` · `head-circuit-light-3` · `microscope-light` · `monitor-play` — no printing use |

### 8.5 The resolution ceiling — the hard constraint

Nine currently-rendered product shots are under 700px wide: `Box-1.jpg` 455×330 · `Carton-Box.webp` 500×494 · `Convocaton-Files.webp` 500² · `Presentation-Samples.webp` 500² · `pin-perfect-binding.webp` 500² · `Center-Pinning.webp` 568×382 · `Price-tag.webp` 569×500 · `10-Question-Papers.webp` 571×401 · `stitching-perfect-binding.webp` 600² · `White-wiro-binding.webp` 612×459.

**Until a reshoot happens:**

- Cap these at **2-up mobile / 4-up desktop catalogue tiles and nowhere larger.**
- **Never** place them in a lightbox, a hero, a `span-half` editorial split, or a 3D texture map.
- Templates must not require full-bleed product photography that does not exist.

**This is the single hardest constraint on how ambitious the redesign visuals can be.** It is also the cheapest to lift: the reshoot is a day.

### 8.6 Processing pipeline

Order matters. Re-encoding after upscaling bakes in the upscaler's artefacts; cutting out before re-encoding means masking against compression noise.

1. **Re-export** from source at WebP quality 82–88 — **38 files need this**, urgently for `Menus.webp` (0.095 bpp), `board-Rounded.webp`, `Telescope-Lids-1-1.webp` and `Gold-wiro-binding-1.webp`
2. **Cut out** where the guide says so — save the mask, not just the flattened result
3. **Upscale** only what is still short of its target long edge
4. **Place** into `public/img/**` under the naming convention
5. **Write alt text** at the point of placement

**Target long edges:** full-bleed hero 2400–2560px · section banner 1600px · card/tile 800px · thumbnail 400px · icons vector, never rasterised. Only two files reach 3 MP natively.

**Two files are marked reshoot, not upscale:** `Rexin-Binding.webp` (sharpness 15.8 — on four pages) and `Calendar-1.webp` (**dated 2025** — shipping a stale year on a printing site reads as an abandoned business; re-render or crop the date grid out).

### 8.7 Legal and accuracy flags — carry these into every caption

| File | Flag |
|---|---|
| `Carton-Box.webp` | Contains **Amazon** and **Flipkart** branded cartons. Fine as a format illustration; **do not imply they are clients.** Crop to the unbranded boxes if in any doubt |
| `Canon-Image.webp`, `Printer.webp`, `Slider-BG-1.webp` | **Canon** production presses. Only claim these as your equipment if you run them |
| `Technology.jpg`, `Printing-press-BG-1.jpg` | Press halls of unverified origin. **Do not caption as "our facility"** without confirming provenance |
| `Greeting-1.webp` | Confirm it is the studio's own artwork before presenting it as a sample |
| `7-2-Silver-Line-Business-Card.webp`, `Box-1.jpg`, `1-Slide-1-Image-3.webp`, `Page2-Img-1.webp` | **Named client work. Get written permission before featuring the client name** |
| `Convocaton-Files.webp`, `4-1-Certificate.webp` | Real folder, placeholder "ABC University" / stock certificate art inside. Caption precisely |
| `Certificate-2.webp` | Stock AI-course certificate — off-brand subject |

### 8.8 What the library does not contain

Categorisation can only sort what exists. Four gaps no processing will fill, in order of commercial impact:

| Gap | Why it matters | Cheapest fix |
|---|---|---|
| **People at work** | Two images show a human being. A print shop is a craft business, and craft businesses sell on the people doing the work | One hour on the floor with a phone in good light |
| **The premises** | Nothing establishes that Thoorigai is a real place in **Royapettah, Chennai** (C25) | Exterior, reception, and one wide shot of the floor |
| **Scale and finish detail** | No macro shots of foiling, embossing, spot UV or paper texture — the things that justify a premium price, and the direct input to the finish viewer | Macro pass over samples already on the shelf |
| **Before / after, or in use** | Every product sits alone on white. Nothing shows a box in a shop, a menu on a table, a diary in a hand | Stage three or four existing samples in context |

Also missing and blocking: **an SVG logo** · **a founder portrait** · **client logos** · **genuine testimonials** · **`og:image` on any page** (every shared link currently renders blank).

The four named client jobs already in the library — Prasar Bharati, ActiveSURE, LADORN U, H K Nath Metals — are the obvious subjects for the reshoot, since the credential already exists and only the photograph is inadequate.

---

## 9. Final animation strategy

**Motion in this system is short, few, and confident. Nothing bounces, nothing overshoots, nothing loops.** Motion clarifies a relationship; it does not perform.

### 9.1 Tokens (C13, C14)

| Token | Value | Use |
|---|---|---|
| `--d-instant` | 100ms | Tap feedback, checkbox, focus ring |
| `--d-fast` | 180ms | Hover, colour, border, chip |
| `--d-base` | 240ms | Card lift, dropdown, accordion, tab indicator |
| `--d-slow` | 320ms | Modal, drawer, mega panel, material cross-fade |
| `--d-slower` | 480ms | Section reveal, image scale, poster→canvas cross-fade |
| `--d-scene` | 1200ms | 3D entrance |

| Easing | Curve | Use |
|---|---|---|
| **`--ease-standard`** | **`cubic-bezier(0.22, 1, 0.36, 1)`** | **The default.** Fast out, long settle |
| `--ease-entrance` | `cubic-bezier(0.16, 1, 0.30, 1)` | Elements arriving |
| `--ease-exit` | `cubic-bezier(0.40, 0, 1, 1)` | Elements leaving — faster than entering |
| `--ease-spring` | `spring(1, 90, 14)` | Sheets and drag release only |
| `--ease-linear` | `linear` | Progress bars and spinners only |

The codebase's `--ease-editorial` is the same curve and is retained as a deprecated alias for one release. The `spring` easing currently in `lib/theme/animations.ts` (`[0.34, 1.3, 0.64, 1]`) **overshoots and is removed** — nothing a user clicks may overshoot.

### 9.2 Rules

- **Animate `transform`, `opacity`, `color`, `border-color` and `box-shadow` only.** Never `width`, `height`, `top` or `left`.
- **Scroll reveals: one pattern, used everywhere.** `opacity 0 → 1` plus `translateY(16px → 0)` over `--d-slower`, triggered at **15% visibility, once**. Stagger grid children by 60ms **capped at six** — the seventh onward share the sixth's delay, so a 43-tile grid never crawls in. Reveals never re-trigger on scroll back up.
- **Motion distance is small** — 16–24px, never 100px slides.
- Never animate a heading character by character. **Never animate a price or a spec figure.**
- **Nothing animates on page load except the hero.**
- No parallax on mobile, ever. No parallax over 20px anywhere. No rotation above 15°/s.
- No autoplay video with sound, anywhere.
- **Page transitions are fade only** — 200ms out, 300ms in, 150ms overlap. No slides, no shared-element transitions across routes. Scroll resets to top except on back navigation.

### 9.3 Interface motion

| Element | Motion | Duration |
|---|---|---|
| Button hover | Background shift; **no scale, no lift** | `fast` |
| Button press | `scale(0.98)` | `instant` |
| Card hover (Tier A) | `translateY(-2px)`, border to `rgba(38,34,54,.16)`, `shadow-md`; the **image inside** scales to 1.03 over 400ms while the frame stays still | `base` |
| Card hover (Tier B/C) | Border colour shift only | `fast` |
| Link hover | Underline thickens 1px → 2px at 4px offset. **Colour does not change** | `fast` |
| Arrow link | Arrow `translateX(4px)` + a 1px bronze underline drawing left-to-right | 220ms |
| Focus ring | Opacity fade, never a size change | `instant` |
| Accordion | Height + content fade, 40ms stagger | `base` |
| Mega panel | Fade + 8px rise. **Height is measured, never animated from `auto`** | `base` |
| Sheet (mobile) | Spring rise 280ms; scrim fades | `spring` |
| Sheet (desktop) | Fade + `scale(0.98 → 1)` | `slow` |
| Header on scroll | Background + hairline fade past 80px | `base` |
| Filter change | Grid items fade and reflow, 20ms stagger, max 8 staggered | `base` |
| Button loading | Label holds at 40% opacity, a 16px spinner replaces the leading icon, **width locks to prevent shift**, `aria-busy="true"`. **Never swap the label for "Loading"** | — |

**Cursor:** default arrow throughout. `pointer` on links and buttons only. `grab` / `grabbing` on 3D viewers and swatch carousels. **No custom cursors.**

### 9.4 Reduced motion

Under `prefers-reduced-motion: reduce`, the visitor is treated as **Tier C** (§10.3):

- No transforms, no scroll-linked sequences, no parallax, no card lift, no image scale.
- Transitions collapse to **opacity at 120ms**.
- Scroll reveals become plain visibility — content is simply there.
- 3D viewers load in a static pose and move **only on direct user input**.
- The hairline and shadow parts of hover states are kept; only the movement is dropped.

This is enforced in three places so it cannot be forgotten: `MotionConfig reducedMotion="user"` in `MotionProvider`, the CSS brake already in `globals.css`, and the `Reveal` / `Parallax` primitives no-opping. **A user-facing motion toggle in the footer**, persisted, forces Tier C regardless of device.

---

## 10. Recommended 3D strategy

### 10.1 The case, and the constraint

The strategic case is unusually strong. Print is a **tactile** product sold through a flat screen. Thickness, texture, foil, spine, flute and finish are exactly what a buyer wants to judge and exactly what a photograph cannot convey. Every one of the 43 catalogue items is a physical object with real geometry.

**The governing rule: every scene must answer a question a buyer actually has.** If a scene cannot be described as *"this shows the visitor X, which they could not otherwise see"*, it does not get built. Decorative WebGL is banned.

**And the constraint that outranks the case: 3D exposes weak inputs rather than hiding them.** A configurator above a two-word label is still a site with no words on it. **Waves 1–4 of §12 ship first, always.**

### 10.2 Scene inventory and priority (C16)

| Priority | Scene | Page | Question it answers | Payload |
|---|---|---|---|---|
| **1** | **Hard case material configurator** | `/binding/hard-case/` | *"What does gold foil actually look like against black rexin?"* Eight materials, real buyer uncertainty, highest-value product | 1.4 MB |
| **1** | **Finish viewer** | `/materials/` | *"What does spot UV / foil / emboss look like?"* Invisible under flat light, obvious under raking light — **and it is the upsell** | 700 KB |
| **2** | **Press / binding sequence** | Home §6.2 #4, `/process/` | *"What actually happens to my job?"* The signature moment; fills the site's longest-standing empty heading | 1.2 MB |
| **2** | **Hero objects** | Home | Deliberately the *least* interactive scene on the site. Three objects, slow drift, subtle pointer parallax on desktop. **Static on mobile at every tier** — the hero is the LCP element and nothing may compete with it | 400 KB |
| **3** | **Binding comparison** | `/binding/` | *"Which binding for my page count and budget?"* Converts the site's weakest content area (417 characters across 28 headings) into its most useful | 900 KB |
| **3** | **Corrugated cutaway** | `/packaging/corrugated-boxes/` | *"What is the difference between 3-ply and 5-ply?"* The clearest case on the site of 3D beating prose | 600 KB |
| **4** | **Rigid box structural viewer** | `/packaging/rigid-boxes/` | Six structures, open/close on tap. The premium range, currently six thumbnails | 800 KB |
| **4** | **Wiro colour switcher** | `/binding/wiro/` | Gold, black, white loops | 500 KB |

**Priority 1 first, and instrument it.** The configurator and the finish viewer are the two scenes that answer real purchasing questions, and between them they prove or disprove the entire 3D investment. **Wire `configurator_interacted → quote_opened` before building anything at priority 3 or below. If the first two scenes do not move that number, the rest should not be built.**

Priority 1 and 2 alone would differentiate the site from every competitor in the Chennai print market, which is uniformly served by flat catalogue sites.

### 10.3 Device tiers (C17)

Resolved **once** by `CapabilityProvider` on mount, then never re-probed. The audience is largely mid-range Android on mobile data, so **Tier B is the realistic default, not Tier A.**

```
tier = C  if  prefers-reduced-motion: reduce
           or navigator.connection.saveData
           or effectiveType is '2g' | 'slow-2g' | '3g'
           or no WebGL2 context
           or deviceMemory < 4
           or hardwareConcurrency < 4
           or battery < 20% and not charging
           or the page's own first paint was slow

tier = A  if  pointer: fine  and  hardwareConcurrency >= 8
           and deviceMemory >= 8  and  WebGL2

tier = B  otherwise
```

| | **Tier A** | **Tier B** | **Tier C** |
|---|---|---|---|
| 3D | Full interactive | Reduced: baked lighting, half-res textures, no shadows, dpr capped 1.5 | **None — no WebGL loaded at all** |
| Scroll-scrubbed 3D | Yes | Stepped stills cross-fading (~180 KB) | Static image |
| Configurator | Live material swap | Live swap, simplified shading | Image gallery per variant |
| Finish viewer | Movable light | Pre-rendered light-sweep video | Two stills — raking and flat |
| Parallax / tilt | Yes | No | No |
| Reveals | Yes | Yes | Instant |
| Env map | 2K HDR | 512px baked | — |

`PerfMonitor` downgrades live: sustained sub-45fps for 2s drops A → B; sub-30fps for 2s drops B → poster. **Downgrades are one-way within a session** — oscillating between tiers is worse than sitting at the lower one.

### 10.4 The loading contract

`StageCanvas` is the **only** component permitted to cross the 3D boundary. Its contract:

1. Render `<Poster>` — a real static image — **synchronously, always.** This is what LCP measures.
2. **Reserve the exact aspect ratio.** CLS stays at zero whether or not 3D ever arrives.
3. Read the capability tier. **On C, stop here permanently.**
4. On A/B, wait for intersection (200px margin) **and** for the page to be interactive.
5. **On mobile, additionally require an explicit tap** on a "View in 3D" affordance for every interactive viewer (C15). Scroll sequences on mobile use the Tier-B stepped-stills path regardless of tier — a 1.2 MB auto-download on mobile data is not acceptable at any tier.
6. Dynamically import `Canvas3D`, mount it behind the poster, cross-fade over 400ms.
7. On any failure — import error, WebGL context loss, timeout — **keep the poster and report `3d_load_failed`. Never surface an error to the user.**

```
Page load       poster visible, LCP measured
                        ↓
Interactive     capability tier resolved
                        ↓
Intersection    (+ tap, on mobile interactive viewers)
                        ↓
                dynamic import of Canvas3D (~250 KB, shared, once)
                        ↓
Model fetch     glTF streams; poster stays visible, no spinner
                        ↓
First frame     cross-fade poster → canvas, 400ms
                        ↓
Idle            prefetch the next likely model
```

**No loading spinners on 3D.** The poster *is* the loading state, and it is a finished image. A spinner advertises a wait the user is not otherwise experiencing.

### 10.5 Performance rules

Non-negotiable. These are what keep "premium" from meaning "slow".

1. WebGL is never in the critical path.
2. Intersection-gated — nothing initialises until within 200px of the viewport.
3. **One live scene at a time.** Off-screen scenes pause their render loop entirely and dispose.
4. **DPR capped** at 2 (Tier A) / 1.5 (Tier B). Retina at native resolution is the most common cause of mobile thermal throttling.
5. **Shared rig.** The environment map, tone-mapping config, and Draco/KTX2 decoders load once and are reused, so per-scene cost is geometry plus textures only.
6. Budgets: **≤50k triangles per scene · ≤3 material variants in memory · 2K textures desktop / 1K mobile, KTX2 compressed · ≤1 real-time light**, everything else baked.
7. `visibilitychange` → tab hidden stops the loop.
8. **Every scene has a poster that is a genuinely good photograph.** A visitor who never sees 3D must not see a hole.
9. Failure is silent.

The `Scene` component already in `src/components/three/scene.tsx` implements rules 2, 3, 4 and 7, and `lazyScene` implements the dynamic-import half of the boundary. **Both are sound and are kept.** What they lack is the poster, the tier check and the tap gate — those become `StageCanvas`, which wraps them.

### 10.6 Interaction detail — the configurator

The highest-value 3D on the site, because it answers the question with the most genuine doubt behind it.

| Interaction | Behaviour |
|---|---|
| Idle | Slow rotation at 0.15 rad/s, **stopping on first interaction and never resuming** |
| Orbit | Damped drag, polar clamped ±35° so the object is never seen from a bad angle |
| Material swap | Cross-fade 300ms. **Geometry never reloads** — only the material |
| Foil toggle | Metalness/roughness transition 400ms, with a single light sweep to make the change legible |
| Corner style | Geometry morph 400ms |
| Reset | Camera returns along an eased path, 600ms |
| Fullscreen | Expands to viewport with a shared-element transition |

Eight materials — PU leather, rexin, special sheets and the rest — share **one geometry and one 2K texture atlas**. **Swatches are real photographs of the actual materials, not colour chips.**

`ConfigSummary` reads the live configuration into `QuoteButton`, so the quote form arrives carrying "Hard case · Rexin · Gold foil · Rounded corners". **This is the conversion mechanism the whole 3D investment exists to serve.**

### 10.7 3D accessibility

| Requirement | Implementation |
|---|---|
| Reduced motion | Tier C. Static poster; orbit only on deliberate tap |
| Keyboard | **Configurator variants are a real radio group**, fully operable without the canvas. Arrow keys orbit when the canvas has focus |
| Screen readers | Canvas is `aria-hidden`. A visually-hidden live region announces variant changes: *"Material changed to rexin, gold foil"* |
| Focus | **Never trapped in a canvas.** Tab moves past it in one step |
| Vestibular safety | No parallax over 20px, no rotation above 15°/s, no auto-playing camera moves outside the hero |

**The configurator is fully usable with the canvas ignored.** Variant selection is a real radio group; the specs and the quote path work identically. **The 3D is an enhancement over a complete interface, never the interface itself.**

### 10.8 What must happen before modelling begins

1. **Redraw the logo as SVG.** Prerequisite for everything, including the cover art on the first model.
2. **Commission product photography on a neutral cyclorama, shot for 3D reference** — multiple angles, consistent lighting, and flat texture captures of PU leather, rexin, kraft and corrugated board. Nineteen files are marked usable for 3D, but **every one is a single view**; genuine photogrammetry needs a turntable pass. The nine sub-700px assets cannot be salvaged any other way.
3. **Write the copy.**
4. **Set the performance budget before modelling** — §2.8 is that budget.
5. **Confirm whether the Steps-New source scene files still exist.** `Steps-New-1.webp` and `Steps-New-2.webp` are already 3D renders; if the scenes survive they are worth more than the exported frames and are a shortcut into the packaging viewer.

**Order of attack on existing assets:** `Hard.webp` first — already transparent, already carries the mark, already dimensional. Then `board-Book-1-New.webp`, `Paper-Bag.webp`, `wiro-binding.webp`, `Drawer-Box-1.webp` — clean silhouettes on white, straightforward to model as stand-ins.

---

## 11. Codebase delta

The Next.js shell in [src/](src/) is genuinely good work — the 3D code-splitting, the reduced-motion handling, the SEO plumbing and the token-mirroring discipline all survive. What follows is what must change to reconcile it with this plan. Nothing here is a rewrite.

### 11.1 Keep as-is

| What | Why |
|---|---|
| `lazyScene` + the `Scene` frame-loop / intersection / dpr logic | Correct, and the code-splitting note in the README (133 kB vs 372 kB First Load JS) proves it works |
| `three/config.ts` camera presets, light rig, material feel | Sound, and already brand-coloured |
| `MotionProvider` — `LazyMotion` + `domAnimation` + `MotionConfig reducedMotion="user"` | Exactly right, including the `m.*`-never-`motion.*` rule |
| The dual-token discipline (`@theme` in CSS ↔ `lib/theme/` in TS) | The right pattern for a project with R3F and Framer in it |
| `next.config.ts` — AVIF/WebP, device sizes, `transpilePackages`, `optimizePackageImports` | Correct |
| `lib/seo.ts`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, route `loading.tsx`, `error.tsx`, `not-found.tsx` | Keep. `opengraph-image` fixes the "every shared link renders blank" finding on day one |
| The reduced-motion CSS brake in `globals.css` | Keep |
| `PlaceholderMedia` | Keep **until** real photography lands; its ratio classes are already the crops the real images should use |

### 11.2 Must change

| # | Change | From → To | Why |
|---|---|---|---|
| 1 | **Colour ramps** | `ink`, `indigo`, `paper`, `gold` intermediate values → the verified scales in §3.2, with `gold` renamed **`bronze`** and `paper` re-indexed so **`paper-100 = #F6F6F3`** (currently `paper-200`) | The measured contrast table in §3.2 is invalid against the current ramps. `paper-600 #B4B4A7` fails the 3:1 control-border requirement; `#86867B` passes |
| 2 | **Display font** | `Fraunces` → **`Bodoni Moda`** (C2) | §4.1 |
| 3 | **Add fonts** | — → `Anek Tamil` (route-scoped), `JetBrains Mono` (digit subset) | §4.1, §4.6 |
| 4 | **Type scale** | `display-2xl … heading-sm` → the 17-token scale in §4.3. **Remove `display-2xl`** (120px) | C5 |
| 5 | **Radius scale** | `xs .25rem … 2xl 2rem` → `none 0 / xs 2 / sm 4 / md 8 / full` (C4) | §2.4 |
| 6 | **Focus ring** | single `2px indigo-500` outline at 3px offset → the **double ring** in §3.6 (C10) | Legibility over both a card and the page behind it |
| 7 | **Breakpoints** | remove `3xl` (1792); set `sm` behaviour per §2.5 | C6 |
| 8 | **`measure` utility** | 58ch → **68ch**; `measure-wide` 72ch retained for card body (C30) | §4.4 |
| 9 | **Motion tokens** | `duration` `.24/.4/.6/.9/1.2` → §9.1; **delete the overshoot `spring` easing** | C13 |
| 10 | **Navigation** | `mainNav` Home/Services/Products/Portfolio/About/Contact → **Printing / Packaging / Binding / Materials / Work / About** with mega-panels; `primaryCta` `/contact#quote` → **`/quote/`** (C7) | §1.5 |
| 11 | **Routes** | `/services`, `/products`, `/portfolio` → the nested pillar tree, `/work/`, `/materials/`, `/quote/`, `/process/`, `/faq/`, `/search/`, legal | §1.1 |
| 12 | **`siteConfig.tagline`** | "A printing house, not a print shop." → **"Ink your vision. Print your success."** (C26) | It is an owned brand asset; the shell invented a replacement |
| 13 | **`siteConfig` additions** | add `gstin`, `founded` confirmation, `hours` already present — and **remove the placeholder social hrefs** (`instagram.com/`, `facebook.com/`) which currently link to nowhere | Broken social links are worse than none |
| 14 | **`studioStats`** | `1,200+ jobs`, `48hr`, `9 binding formats` are **invented placeholders** and must not ship | The audit's central charge is fabricated content. Replace with verified figures or delete the section |
| 15 | **`lib/content.ts` portfolio** | six entries titled "Placeholder Client" | **Must not ship.** `/work/` launches empty-state-first (§6.8) |
| 16 | **Icons** | `lucide-react` → **Phosphor Regular sprite** (C20) | §2.7; also removes a dependency |
| 17 | **Folder tree** | `layout/ui/motion/three` → `foundation/primitives/composites/sections/three` (C12) | §7.2 — the ESLint boundary rule keys off it |
| 18 | **ESLint** | add the boundary rule: nothing may import `components/three/**` except `StageCanvas` | §5.1 |
| 19 | **`Image` wrapper** | none exists; `next/image` is used **nowhere** | Introduce the `Image` primitive with a **required `alt` prop** (§5.3) |
| 20 | **Assets** | `assets/` at repo root, unreferenced | Rename to `_source/`, add to `tsconfig` exclude, populate `public/img/**` (§7.2) |
| 21 | **Quote form** | `features/quote/quote-form.tsx` fakes the round trip; **no submit endpoint** | Wire a real handler, add honeypot + time-to-submit + rate limiting, restructure to three steps (§6.7) |
| 22 | **`h1–h4` weight** | `font-weight: 400` globally on display headings | `h1`/`h2` need **500** per §4.3, and one step heavier again when reversed on dark |
| 23 | **`body { overflow-x: hidden }`** | a global hide | Fix the offending elements instead. It masks reflow bugs and can break `position: sticky` in some browsers |
| 24 | **`themeColor` dark entry** | `brand.primary` under `prefers-color-scheme: dark` | There is no dark theme (C18). Keep one `themeColor` = `#F6F6F3` |

### 11.3 Dependency changes

```
remove:  lucide-react                        → Phosphor sprite
add:     @react-three/drei is already present; add draco/ktx2 decoders as static files
add:     a form endpoint (Resend / Formspree / a route handler + SMTP) — currently none
review:  framer-motion 13 — confirm LazyMotion domAnimation still excludes layout animations
```

---

## 12. Blockers and build order

### 12.1 Wave 0 — before any page is designed

Not pages. Two of these are live liabilities and are urgent **independent of the redesign**.

| # | Task | Blocks |
|---|---|---|
| 1 | **Delete the 7 fabricated testimonials.** They are attributed to invented individuals with stock portraits and describe an AI course. Publishing invented testimonials attributed to named people carries real exposure under India's consumer-protection rules on misleading advertising | Legal exposure |
| 2 | **Delete the 9 Lorem Ipsum posts and 4 orphan pages**, including `/home-ai-2/` — a complete, publicly indexable AI-course landing page for another business | Index hygiene |
| 3 | **Resolve the three phone numbers to one** | Every template, every schema block, the WhatsApp channel. **Two of the three are silently losing enquiries today** |
| 4 | **Redraw the logo as SVG** and regenerate the icon set | Header, footer, loader, favicon, OG, any brand motion, and the cover art on the first 3D model |
| 5 | **Confirm the founding year** (2017 per the live copy) | About, timeline, every "years in business" figure |
| 6 | **Collect business hours, GSTIN, and the machine list** | Footer, contact, `/process/`, `LocalBusiness` schema |
| 7 | **Publish a privacy policy and fix the footer link** (it points at `/404`) | Compliance, and the quote form's consent checkbox |
| 8 | **Start writing.** 15 page bodies · 43 product descriptions · 24 titles · 24 meta descriptions · 168 alt attributes | **Everything.** This is the long pole and it runs in parallel with all six waves |
| 9 | **Commission the photography** — founder portrait, facility, press floor, product reshoot on a neutral cyclorama with flat texture captures | Waves 4 and 5. **Longest lead time and widest blast radius — commission in week 1** |

### 12.2 Build waves

| Wave | Weeks | Pages | Gives the client |
|---|---|---|---|
| **1 · The converting core** | 1–3 | `/quote/` → `/contact/` → `/quote/thank-you/` → `/` → `/404/` | **Actually captures leads.** A real quote page, a contact page with a form, a homepage that says what the business does and where |
| **2 · The pillars** | 3–5 | `/binding/` → `/printing/` → `/packaging/` | **Routes buyers correctly.** Three hubs that explain a decision instead of repeating a photo grid |
| **3 · Capabilities** | 5–9 | 15 capability pages + the 43 catalogue entries, in descending commercial value | **Answers the specification buyer.** Specs, MOQs, turnarounds, comparisons — the content the whole category is missing |
| **4 · Credibility** | 8–11 | `/about/` · `/process/` · `/faq/` · legal | **Earns trust.** Founder, facility, machines, and a privacy policy that exists |
| **5 · Differentiation** | 10–14 | `/materials/` · configurator · finish viewer · press sequence · comparison · cutaway · `/search/` | **Becomes distinctive.** The 3D nobody else in the Chennai print market has |
| **6 · As content arrives** | — | `/work/` + 3–5 case studies · testimonial and logo sections · `/journal/` | **Proves itself.** Real work, real clients, real words from them |

**Build the hardest instance of each template first.** `/binding/` before the other two hubs — it has the most catalogue items, the clearest decision axis (page count), the site's best asset (`Board-on-board-hard.jpg`), and it is where 3D will land. `/binding/hard-case/` before the other fourteen capability pages, for the same reason. Solving the template on the hard case makes the rest a copy exercise.

**`/work/` is deliberately last.** It is the site's largest credibility gap, and building an empty portfolio page achieves nothing. Its components ship earlier in an empty state; the page launches the day there is something real to put in it.

### 12.3 Ship gates

A page does not go live until its gate clears. **This is the mechanism that stops the redesign from reproducing the current site in a nicer typeface.**

| Gate | Requirement |
|---|---|
| **Copy** | Body copy at the specified length. **A template with lorem in it does not deploy** |
| **Metadata** | Unique title with location intent, unique meta description, one `h1`, canonical, `og:image` |
| **Alt text** | Every image, without exception |
| **Spec block** | Every capability and catalogue entry, all fields populated or explicitly marked "on request". **The build fails a capability page with no specs** |
| **Contact parity** | Every phone, email and address reads from `SiteConfig` |
| **Performance** | LCP under 2.0s on throttled 4G, on the real page with real images |
| **Static-first** | The page is fully usable with WebGL disabled and with JavaScript disabled |
| **No invented content** | No placeholder clients, no invented statistics, no fabricated testimonials, no stock portraits |

### 12.4 The dependency chain

```
LOGO AS SVG ──────────────► header · footer · favicon · OG · loader · 3D cover art
                                     │
COPY (the long pole) ───────────────►│──► every page ships
   15 page bodies                    │
   43 product descriptions           │
   24 titles + descriptions          │
   168 alt attributes                │
                                     ▼
CANONICAL PHONE ─────────► SiteConfig ──► every CTA, schema, WhatsApp
BUSINESS HOURS ──────────►     │
GSTIN ───────────────────►     │
PRIVACY POLICY ──────────►     │
                               ▼
                        WAVE 1 · quote · contact · home · 404
                               │
                               ▼
                        WAVE 2 · three pillar hubs
                               │
                               ▼
                        WAVE 3 · 15 capability pages + 43 catalogue entries
                               │
FOUNDER PHOTO ───────────►     │
FACILITY PHOTO ──────────►     ▼
MACHINE LIST ────────────► WAVE 4 · about · process · faq · legal
                               │
PRODUCT RESHOOT ─────────►     ▼
MATERIAL TEXTURES ───────► WAVE 5 · materials · configurator · finish viewer · sequences
                               │
CASE STUDIES ────────────►     ▼
REAL TESTIMONIALS ───────► WAVE 6 · work · trust sections · journal
CLIENT LOGOS ────────────►
```

**Three things gate more than anything else: the SVG logo, the copy, and the product reshoot.** The critical path runs through copy and photography, not through 3D.

---

## 13. Open questions for the client

Every one of these blocks something. They are listed in the order they are needed.

| # | Question | Blocks | Needed by |
|---|---|---|---|
| 1 | Which of the three published phone numbers is canonical? Is the WhatsApp number deliberately different? | `SiteConfig`, every CTA, schema, WhatsApp deep links | **Week 1** |
| 2 | Business hours, and GSTIN | Footer, contact page, `LocalBusiness` schema | Week 1 |
| 3 | Founded 2017 — confirm? And is "15+ years" the founder's personal experience rather than the company's age? | About, timeline, every "years in business" figure | Week 1 |
| 4 | Can we commission the SVG logo retrace, or does the client hold vector artwork? | Header, footer, favicon, OG, 3D cover art | **Week 1** |
| 5 | Permission to delete the 7 testimonials, the 9 posts, the 4 orphan pages, and the 54 theme-demo images? | Wave 0 | **Week 1** |
| 6 | Are `Technology.jpg` and `Printing-press-BG-1.jpg` the studio's own press hall, or stock? | Whether they can be captioned as "our facility" | Week 2 |
| 7 | Does the studio run the Canon presses shown in `Canon-Image.webp` / `Printer.webp`? | Whether they can be claimed as equipment | Week 2 |
| 8 | Written permission from Prasar Bharati, ActiveSURE, LADORN U and H K Nath Metals to name them | `/work/`, the proof strip, the logo wall | Wave 4 |
| 9 | Is `Greeting-1.webp` the studio's own artwork? | Whether it can be presented as a sample | Wave 3 |
| 10 | Budget and date for the product reshoot and the founder/facility shoot? | Waves 4 and 5, and every 3D texture | **Week 1** |
| 11 | Verified figures for the credibility strip — years, jobs delivered, in-house capabilities | Homepage §6.2 #2, About | Wave 1 |
| 12 | The real machine and capability list | `/process/`, the homepage press sequence | Wave 4 |
| 13 | Instagram and LinkedIn — do accounts exist? | Footer social row (currently placeholder links to nowhere) | Wave 1 |
| 14 | Legal review of Terms and Cookie Policy for entity name and Indian jurisdiction | Wave 4 | Wave 4 |
| 15 | Where should quote submissions be delivered — email, CRM, WhatsApp Business API? | The quote form has no endpoint | **Week 1** |

---

## Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 21 Aug 2026 | Initial consolidation. Six workstreams and the working codebase merged into one plan; **30 documented conflicts resolved**; 12 contradictory facts locked; final sitemap with a 27-row redirect map; the four-colour system with measured contrast; Bodoni Moda / Inter / Anek Tamil / JetBrains Mono typography; 158 components across five layers plus a 3D branch; ten page templates with section-by-section structure; the asset tree and a per-file image plan over all 168 files; the motion token set; an eight-scene 3D strategy with device tiers, a loading contract and an instrumentation gate; a 24-item codebase delta; six build waves; eight ship gates; and fifteen open questions for the client. |

