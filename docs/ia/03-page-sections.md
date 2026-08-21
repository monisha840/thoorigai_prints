# 03 · Page Sections

Section-by-section blueprints for every template. Each section lists its purpose, components, asset binding, copy slots, and 3D tier.

**Notation**
- `[COPY]` — a copy slot that must be filled before the page ships
- `[ASSET]` — an existing asset from `/assets/`, named
- `[NEW]` — content or asset that does not exist yet and blocks the section
- **3D: A / B / C** — the highest tier at which this section renders 3D (see [animation plan](06-animation-plan.md))

---

## Template: Home

The old homepage carried 60 headings and 14 paragraphs — a wall of image tiles with two competing H1s. This one routes: three pillars within one scroll, proof, and a single conversion path.

### H-1 · Hero
> **Purpose:** state what the business does and where, in one screen. Route to the three pillars.

| | |
|---|---|
| Components | `Hero` › `DisplayHeading` · `LeadText` · `ButtonPair` · `StageCanvas` |
| Asset | `[ASSET] backgrounds/Printing-press-BG-1.webp` (1600×1194, currently unused) as the environment plate |
| 3D | **A/B** — slow-orbiting stack of three objects: a bound book, a rigid box, a printed sheet. **C:** static poster |
| Copy | `[COPY]` H1 — one headline, keyword and location led. Replaces the old site's two competing H1s. `[COPY]` lead, 20–28 words. |
| CTA | Primary "Get a Quote" · Secondary "Explore our work" |

**LCP rule:** the poster image is the LCP element. WebGL hydrates after, never before. On mobile the hero is static by default at every tier.

### H-2 · Pillar routing
> **Purpose:** the site's core decision, made immediately.

| | |
|---|---|
| Components | `PillarGrid` › `PillarCard` ×3 |
| Assets | Printing: `[ASSET] services/Printing-Featured-Image.webp` · Packaging: `[ASSET] products/Corrugation.webp` (1363×707, best packaging shot) · Binding: `[ASSET] services/Board-on-board-hard.jpg` (2447², the only asset with real zoom headroom) |
| 3D | **A** — card tilts to parallax on pointer; the object lifts 8px on hover. **B/C:** static |
| Copy | `[COPY]` 12–18 words per pillar, naming what falls under it |

### H-3 · Proof strip
> **Purpose:** substantiate "From Start-Ups to Big Brands", which the old site claimed with zero evidence.

| | |
|---|---|
| Components | `StatRow` · `LogoWall` |
| Content | `[NEW]` client logos — **blocking; section hidden until populated** · `[COPY]` stats: years operating, jobs delivered, delivery radius |
| 3D | none |

> **Ships hidden.** The component exists and renders nothing until real logos and verified numbers are supplied. Better an absent section than an invented one.

### H-4 · Capability showcase
> **Purpose:** the site's signature moment. Show craft that photography cannot.

| | |
|---|---|
| Components | `ShowcaseSequence` › `StickyStage` · `StepCopy` ×4 |
| Asset | `[ASSET] gallery/Board-on-board-hard.jpg` as texture reference |
| 3D | **A:** scroll-scrubbed — a flat sheet folds, is bound, gains a foiled cover, closes as a finished book. **B:** three static states cross-fading. **C:** a single image with captions |
| Copy | `[COPY]` four steps, ≤14 words each |

### H-5 · Materials teaser
> **Purpose:** route to `/materials/`, the strongest differentiator.

| | |
|---|---|
| Components | `MaterialStrip` › `MaterialSwatch` ×5 (horizontal scroll on mobile) |
| Assets | `[ASSET] services/Pu-Leather-2.webp` · `Rexin-Binding.webp` · `Special-Sheets.webp` · `[NEW]` foil and spot-UV swatches |
| 3D | **A:** swatch lights respond to pointer, showing sheen. **B/C:** static |

### H-6 · Process
> **Purpose:** fill what was a bare "Technology We Possess" heading on the old site.

| | |
|---|---|
| Components | `ProcessTimeline` › `ProcessStep` ×5 |
| Assets | `[ASSET] gallery/Technology.jpg` · `Canon-Image.webp` · `Printer.webp` |
| Copy | `[COPY]` Enquiry → Design → Proof → Production → Delivery |
| Link | → `/process/` |

### H-7 · Selected work
| | |
|---|---|
| Components | `WorkCarousel` › `WorkCard` ×3 |
| Content | `[NEW]` case studies — **blocking; hidden until populated** |

### H-8 · FAQ
| | |
|---|---|
| Components | `Accordion` › `AccordionItem` ×4 |
| Copy | The four existing FAQs, retained. `[COPY]` expanded answers. `FAQPage` schema. |
| Link | → `/faq/` |

### H-9 · Conversion band
| | |
|---|---|
| Components | `CTABand` › `QuoteForm` (inline, 3 fields) · `ContactMethods` |
| Copy | `[COPY]` headline + reassurance line, e.g. response time |

---

## Template: Pillar hub

Used by `/printing/`, `/packaging/`, `/binding/`. Replaces pages that carried 195, 230 and 417 characters respectively.

| # | Section | Components | Notes |
|---|---|---|---|
| P-1 | **Hero** | `PageHero` › `Breadcrumb` · `H1` · `LeadText` | `[COPY]` 40–60 word lead. **3D: A** — one representative object, slow idle rotation. **B/C:** poster |
| P-2 | **Spec strip** | `SpecStrip` › `SpecItem` ×4 | `[COPY]` MOQ · turnaround · max size · formats. Sticky on desktop scroll |
| P-3 | **What we do** | `ProseBlock` | `[COPY]` 250–400 words — the copy the old page entirely lacked |
| P-4 | **Capability grid** | `CapabilityGrid` › `CapabilityCard` ×4–5 | Routes to Tier 2. `[COPY]` one line each |
| P-5 | **Catalogue** | `CatalogueGrid` › `ProductTile` ×n · `FilterBar` | The pillar's items. **Copy-gated:** a tile without a description does not open a detail view |
| P-6 | **Materials** | `MaterialStrip` | Filtered to this pillar |
| P-7 | **Comparison** | `ComparisonTable` \| `ComparisonScene` | **3D: A** — e.g. four binding types side by side, page-count thresholds revealed on scroll. **B/C:** table |
| P-8 | **Work** | `WorkCarousel` | `[NEW]` — hidden until populated |
| P-9 | **FAQ** | `Accordion` | `[COPY]` 4–6 pillar-specific questions |
| P-10 | **CTA band** | `CTABand` | Context-carrying: service pre-selected |

### Pillar-specific notes

**`/printing/`** — P-7 becomes an offset-vs-digital decision table (run length, unit cost, turnaround, colour accuracy). This is the single most-asked question in the category and the old site never addressed it.

**`/packaging/`** — P-7 is the **3D exploded cutaway**: 3-ply against 5-ply, flute profiles labelled. Explains in three seconds what a paragraph fumbles. Rigid boxes get their own capability card; six premium products currently share one thumbnail each.

**`/binding/`** — P-7 is the **binding comparison scene**: hard case, perfect, wiro and centre pin as four books, with page-count thresholds appearing on scroll. Converts the site's weakest content area (417 characters across 28 headings) into its strongest.

---

## Template: Capability page

Thirteen pages. Each must pass the standalone test: *what this is · what it costs to start · how long it takes · how to begin.*

| # | Section | Components | Notes |
|---|---|---|---|
| C-1 | **Hero** | `PageHero` · `Breadcrumb` | `[COPY]` H1 with location intent |
| C-2 | **Spec strip** | `SpecStrip` ×5–6 | **Required.** MOQ · lead time · sizes · stocks · finishes · page limits. No specs, no ship |
| C-3 | **Configurator** \| **Gallery** | `Configurator3D` \| `MediaGallery` | See tier table below |
| C-4 | **Description** | `ProseBlock` | `[COPY]` 300–500 words, unique. The old child pages had none |
| C-5 | **Options** | `OptionGrid` › `OptionCard` | Variants — e.g. hard case's eight materials |
| C-6 | **Use cases** | `UseCaseList` | `[COPY]` "Ideal for…" — how buyers self-identify |
| C-7 | **Design help** | `ReassuranceCard` | "No print-ready file? We design it for you." On every capability page |
| C-8 | **Related** | `RelatedGrid` | Cross-links within and across pillars |
| C-9 | **FAQ** | `Accordion` | `[COPY]` 3–5 questions |
| C-10 | **CTA band** | `CTABand` | Pre-fills service + capability |

### Which capability pages get a configurator

Ranked by buyer uncertainty — the amount of genuine doubt a 3D view removes.

| Page | C-3 treatment | 3D | Why |
|---|---|---|---|
| `/binding/hard-case/` | **Full configurator** | A/B | 8 materials × foil × corner style. Highest uncertainty on the site |
| `/packaging/rigid-boxes/` | **Structural viewer** | A/B | 6 box types; structure is hard to read in photographs |
| `/binding/wiro/` | **Material switcher** | A/B | Gold / black / white — a direct comparison problem |
| `/packaging/corrugated-boxes/` | **Exploded cutaway** | A/B | Ply and flute are specs, not looks |
| `/binding/perfect/` | Gallery + spine diagram | B/C | Three variants; a diagram suffices |
| `/packaging/paper-bags/` | Gallery + size diagram | B/C | Handle and load are spec-led |
| `/packaging/carton-boxes/` | Gallery | C | Photography is adequate |
| `/binding/center-pin/`, `/binding/board-books/` | Gallery | C | Low variance |
| All four printing capabilities | Gallery + sample grid | C | Print output is flat — 3D adds nothing. **Deliberate restraint.** |

> The printing pillar getting the least 3D is the plan working. 3D is applied where it removes doubt, not where it decorates. Flat printed output is exactly the case where good photography wins.

---

## Template: Catalogue detail (overlay)

Opens over the grid at `/{pillar}/{capability}/#{item}`. Deep-linkable, shareable, back-button correct. Graduates to a full page when search demand justifies, with no structural change.

```
┌─────────────────────────────────────────────┐
│  [×]                                        │
│  ┌──────────────┐   Product name        H2  │
│  │              │   Short description       │
│  │  media /     │   ───────────────────     │
│  │  3D          │   Spec list               │
│  │              │   Sizes · stocks · MOQ    │
│  └──────────────┘   ───────────────────     │
│  ○ ● ○ ○            [Get a quote]           │
│                     [WhatsApp]              │
└─────────────────────────────────────────────┘
```

Mobile: full-screen sheet, drag-to-dismiss. **Copy-gated** — an item without `description` and `specs` renders as a tile only and does not open.

---

## Template: Materials

The 3D showcase, and the reason `/materials/` exists. Spot UV, foiling, emboss and lamination are invisible in flat photography, are typically the upsell, and are exactly what real-time lighting reveals.

| # | Section | Components | Notes |
|---|---|---|---|
| M-1 | **Hero** | `PageHero` | `[COPY]` — the craft argument |
| M-2 | **Category tabs** | `TabBar` | Papers · Covers · Finishes · Foils |
| M-3 | **Material grid** | `MaterialGrid` › `MaterialCard` | `[NEW]` swatch photography — partially blocking |
| M-4 | **Finish viewer** | `FinishViewer3D` | **3D: A** — one surface, switchable finish, movable light. **B:** pre-rendered sweep video. **C:** two static images, raking and flat |
| M-5 | **Comparison** | `SplitCompare` | Drag-divider between two finishes |
| M-6 | **Spec table** | `DataTable` | `[COPY]` GSM, thickness, opacity, availability |
| M-7 | **Where used** | `RelatedGrid` | Links to capabilities using each material |
| M-8 | **CTA band** | `CTABand` | "Request a physical sample" — a distinct, high-intent action |

**The physical sample request is the highest-intent action on the site.** A buyer asking to touch the paper is nearly closed. Track it separately from the general quote.

---

## Template: Work (index + case study)

`[NEW]` — blocking. Ships only with genuine case studies. Three real ones beat twelve invented ones, and the audit already found fabricated testimonials on this site; do not repeat the pattern with fabricated work.

**Index:** hero · `FilterBar` (by pillar) · `WorkGrid` › `WorkCard` · CTA band.

**Case study:** full-bleed hero · client + brief meta bar · challenge `[COPY]` · spec panel (stock, finish, binding, quantity, turnaround) · image sequence · outcome `[COPY]` · related work · CTA band. **3D: A** — the finished piece as a rotatable object where a model exists.

---

## Template: Process

Absorbs the old homepage's empty "Technology We Possess" heading and its flattened `Steps-New-2.webp` diagram.

| # | Section | Components | Notes |
|---|---|---|---|
| PR-1 | Hero | `PageHero` | `[COPY]` |
| PR-2 | **Press sequence** | `ScrollScene3D` | **3D: A** — scroll-scrubbed: plate → press → finishing → bound product. The homepage showcase, extended. **B:** stepped stills. **C:** static diagram |
| PR-3 | Stage detail | `ProcessStep` ×5 | `[COPY]` per stage |
| PR-4 | **Equipment** | `EquipmentGrid` | `[ASSET] gallery/Canon-Image.webp` · `Printer.webp` · `Technology.jpg` · `[COPY]` machine list — fills the old empty heading |
| PR-5 | Quality control | `FeatureRow` | `[COPY]` `[NEW]` QC photography |
| PR-6 | Turnaround | `DataTable` | `[COPY]` realistic lead times by product class |
| PR-7 | CTA band | `CTABand` | |

---

## Template: About

The old page put its entire story inside five consecutive `<h5>` tags and carried zero images.

| # | Section | Components | Notes |
|---|---|---|---|
| A-1 | Hero | `PageHero` | `[COPY]` — proper prose, not headings |
| A-2 | **Founder** | `FounderBlock` | `[NEW]` portrait of Mr. R. Ambeth — **blocking.** The page's whole argument rests on his experience and no photograph exists. `[COPY]` — **reconcile "15+ years" against "inception in 2010" before writing** |
| A-3 | Story | `ProseBlock` | `[COPY]` — the existing narrative, rewritten as prose |
| A-4 | Commitments | `ValueGrid` ×4 | Leading Technology · Best Designs · On Time Delivery · Affordable Price — retained, expanded |
| A-5 | Facility | `MediaGrid` | `[NEW]` facility photography — high value, not blocking |
| A-6 | Team | `TeamGrid` | `[NEW]` — hidden until populated |
| A-7 | Numbers | `StatRow` | `[COPY]` verified figures only |
| A-8 | CTA band | `CTABand` | |

---

## Template: Contact

The old contact page was 106 characters: an address in six `<h4>` tags, no form, no map, no email, and a phone number contradicted twice elsewhere.

| # | Section | Components | Notes |
|---|---|---|---|
| CT-1 | Hero | `PageHero` | `[COPY]` |
| CT-2 | **Methods** | `ContactMethods` › `ContactCard` ×4 | Call · WhatsApp · Email · Visit. **One canonical number** |
| CT-3 | **Form** | `ContactForm` | Real labels, not placeholder-only. The old site had no form here at all |
| CT-4 | **Map** | `MapEmbed` | Lazy-loaded, static image until interaction. Directions + landmark |
| CT-5 | **Hours** | `HoursTable` | `[COPY]` — never published anywhere on the old site |
| CT-6 | Address | `AddressBlock` | Semantic markup + `LocalBusiness` schema |
| CT-7 | FAQ | `Accordion` | Parking, walk-ins, file drop-off |

---

## Template: Quote

A real page — linkable from an ad, shareable, returnable — plus a sheet variant that opens anywhere.

| # | Section | Components | Notes |
|---|---|---|---|
| Q-1 | Header | `PageHero` (compact) | `[COPY]` + stated response time |
| Q-2 | **Context chips** | `ContextChips` | Pre-filled service/item, removable. See the context-carry rule in [flows](02-user-flows.md) |
| Q-3 | **Form** | `QuoteForm` | Grouped: what · how many · when · who. Labels visible, quantity first-class, honeypot + rate limit |
| Q-4 | Alternatives | `ContactMethods` | WhatsApp for buyers who would rather talk |
| Q-5 | Reassurance | `TrustRow` | `[COPY]` response time, no-obligation, file confidentiality |

**Thank-you page:** confirmation, stated response window, WhatsApp escalation, related reading. A real URL for conversion tracking.

---

## Remaining templates

| Template | Sections |
|---|---|
| **Journal index** | Hero · `FilterBar` · `ArticleGrid` · pagination · CTA band. **Ships empty** — all nine existing posts are Lorem Ipsum and are removed at launch |
| **Article** | Breadcrumb · title · meta · cover · `ProseBlock` · `ShareRow` · related · CTA band. Max 68ch measure |
| **FAQ** | Hero · `SearchField` · category tabs · `Accordion` groups · CTA band. `FAQPage` schema |
| **Legal** | Breadcrumb · title · last-updated · `TableOfContents` (sticky) · `ProseBlock`. Covers Privacy `[NEW]`, Terms, Cookies |
| **404** | Illustration · `[COPY]` · `SearchField` · three pillar links · WhatsApp |
| **Search** | `SearchField` · result count · `ResultList` · empty state routing to the three pillars + WhatsApp |

---

## Global elements

| Element | Behaviour |
|---|---|
| `SiteHeader` | Transparent over hero, solid on scroll past 80px. Hides on scroll down, reveals on scroll up (mobile). Height 64px mobile / 72px desktop |
| `MegaPanel` | Full-width, one per pillar, single featured visual |
| `MobileActionBar` | **Persistent**, not scroll-triggered. Call · WhatsApp · Quote. Two taps to a human from anywhere |
| `SiteFooter` | Four columns; collapses to accordions below `md` |
| `QuoteSheet` | Global overlay, invocable from any CTA, carries context |
| `CookieBanner` | `[NEW]` — the old site shipped a cookie policy with no consent banner |
| `SkipLink` | First focusable element |

---

## Section inventory

| Template | Sections | Blocked by missing content |
|---|---|---|
| Home | 9 | 2 (client logos, case studies) |
| Pillar hub ×3 | 10 | 1 (work carousel) |
| Capability ×13 | 10 | 0 |
| Materials | 8 | 1 (swatch photography, partial) |
| Work | 5 + 8 | **fully blocked** |
| Process | 7 | 1 (QC photography) |
| About | 8 | 2 (founder portrait — blocking; team) |
| Contact | 7 | 0 |
| Quote | 5 | 0 |
| Journal, FAQ, Legal, 404, Search | 5–6 each | Journal ships empty |

**Everything except `/work/` can ship without new photography.** That is the deliberate design of these templates: the site gets substantially better on copy alone, and improves again as assets arrive.
