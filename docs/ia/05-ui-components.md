# 05 · Reusable UI Components

The library. Roughly 60 components across five layers, sized so that every template in [03 · Page Sections](03-page-sections.md) is buildable from them with nothing bespoke.

**Conventions**
- Every interactive component ships with `default · hover · focus-visible · active · disabled · loading` states
- Every component with content ships with an **empty state** — the audit found sections that should have been hidden rather than filled with invented content
- Props listed are the meaningful ones, not the full surface
- ✱ marks a component whose absence blocks a template

---

## L1 · Foundation

| Component | Purpose | Props |
|---|---|---|
| `CapabilityProvider` ✱ | Resolves device tier A/B/C once on mount. Exposes `tier`, `reducedMotion`, `saveData`, `webgl` | — |
| `SiteConfigProvider` ✱ | Single source for phone, WhatsApp, email, address, hours. **Fixes the three-phone-number bug structurally** | `config` |
| `QuoteProvider` ✱ | Global quote sheet state + carried context | — |
| `Container` | Max-width wrapper, responsive gutters | `size: sm\|md\|lg\|full` |
| `Section` | Full-width band with vertical rhythm | `tone: paper\|raised\|sunken\|ink`, `spacing: normal\|loose\|tight` |
| `Grid` | Responsive grid | `cols`, `gap`, `align` |
| `Stack` | Vertical/horizontal flow | `direction`, `gap`, `align`, `wrap` |
| `Reveal` | Scroll-reveal wrapper. No-ops under reduced motion | `delay`, `distance`, `once` |
| `Parallax` | Translate on scroll. Tier A only | `speed`, `clamp` |
| `StickyRange` | Pins a child across a scroll range | `start`, `end` |
| `AspectBox` ✱ | Reserves aspect ratio. **Required around every media slot** — keeps CLS at zero | `ratio` |

---

## L2 · Primitives

### Typography

| Component | Props | Notes |
|---|---|---|
| `DisplayHeading` | `as`, `size`, `balance` | One per page. `text-wrap: balance` |
| `Heading` | `level: 1–4`, `size`, `tone` | Level and visual size are independent — the old site used `<h5>` for body copy; this decoupling removes the incentive |
| `LeadText` | `size: md\|lg` | Intro paragraph, capped 68ch |
| `Text` | `size`, `tone`, `weight` | Body |
| `Eyebrow` | `tone` | Uppercase micro-label above headings |
| `ProseBlock` ✱ | `content` | Rich text with vertical rhythm, 68ch measure. Carries the copy the old site lacked |

### Actions

| Component | Variants | Notes |
|---|---|---|
| `Button` ✱ | `primary` · `secondary` · `ghost` · `link` — sizes `sm\|md\|lg` | Amber reserved for `primary` only, at most one per viewport |
| `QuoteButton` ✱ | wraps `Button` | Takes `context` and opens the pre-filled sheet |
| `IconButton` | `ghost` · `solid` | 44×44 minimum hit area |
| `ButtonPair` | — | Primary + secondary, stacks below `md` |
| `TextLink` | `inline` · `standalone` | Standalone carries an arrow that translates 4px on hover |
| `WhatsAppButton` ✱ | — | Reads `SiteConfigProvider`. Accepts a `message` for prefill |
| `CallButton` ✱ | — | `tel:` from canonical config |

### Form

Every field ships with a **visible label**. The old site relied entirely on placeholders, which fail accessibility checks and vanish on typing.

| Component | Props |
|---|---|
| `Field` ✱ | `label`, `hint`, `error`, `required` — wrapper providing label, description, error, and ARIA wiring |
| `TextInput` | `type`, `inputMode`, `autoComplete` |
| `PhoneInput` ✱ | `country="IN"` — `inputMode="tel"`, formats as typed |
| `TextArea` | `rows`, `maxLength`, `autoGrow` |
| `Select` | `options`, `placeholder` |
| `QuantityInput` ✱ | `min`, `step`, `presets` — first-class for the volume buyer |
| `RadioCards` | `options`, `columns` — visual selection for service type |
| `Checkbox` · `FileDrop` | `accept`, `maxSize` |
| `FormStatus` | `state: idle\|submitting\|success\|error` — **preserves entered values on error** and surfaces a WhatsApp fallback |

### Media & display

| Component | Props | Notes |
|---|---|---|
| `Image` ✱ | `src`, `alt` **required**, `ratio`, `sizes`, `priority` | `alt` is a required prop — the audit found 168 images with none. Wraps `AspectBox` |
| `MediaFrame` | `ratio`, `radius`, `tone`, `overlay` | Framed media with a hairline |
| `Poster` ✱ | `src`, `alt` | Static render standing in for a 3D scene. Always rendered first |
| `Icon` | `name`, `size` | Custom set, replacing the theme's generic Phosphor icons |
| `Logo` ✱ | `variant: full\|mark`, `theme` | **SVG required — blocks the build.** Only a 472×317 raster exists today |
| `Chip` | `tone`, `removable` | |
| `Badge` · `Divider` · `Skeleton` | | |

---

## L3 · Composites

### Cards

| Component | Purpose | Key props |
|---|---|---|
| `PillarCard` ✱ | Routes to Printing / Packaging / Binding | `pillar`, `image`, `tilt` |
| `CapabilityCard` | Routes to a Tier 2 page | `capability`, `image` |
| `ProductTile` ✱ | Catalogue item. Renders with or without copy | `product`, `openable` — `openable` is false when description or specs are missing |
| `OptionCard` | A variant within a capability | `option`, `selected` |
| `MaterialCard` | Stock or finish | `material`, `swatch` |
| `WorkCard` | Case study | `caseStudy` |
| `ArticleCard` | Journal entry | `article` |
| `ContactCard` ✱ | One contact method | `method: call\|whatsapp\|email\|visit` |
| `ReassuranceCard` ✱ | "No print-ready file? We design it for you." | `title`, `body` |

All cards share one skeleton — `AspectBox` media, body, optional footer — so the grid stays visually consistent across pillars.

### Grids & collections

| Component | Notes |
|---|---|
| `PillarGrid` | 3-up desktop, stacked mobile |
| `CapabilityGrid` | 2–3 up, auto-fit |
| `CatalogueGrid` ✱ | Filterable, virtualised past 24 items |
| `FilterBar` ✱ | Chips + sort. Horizontally scrollable on mobile, sticky under the header |
| `MaterialGrid` · `MaterialStrip` | Grid; strip is a horizontal scroller with snap |
| `WorkGrid` · `WorkCarousel` | Snap-scroll carousel on mobile |
| `RelatedGrid` · `OptionGrid` · `EquipmentGrid` · `TeamGrid` · `LogoWall` | |

Every collection component takes an `emptyState` prop and **renders nothing at all when empty** unless one is supplied. This is how `/work/` and the proof strip ship hidden rather than filled with placeholders.

### Data display

| Component | Purpose |
|---|---|
| `SpecStrip` ✱ | The decisive component. MOQ · lead time · sizes · stocks. Sticky on desktop, horizontally scrollable on mobile. **Required on every capability page** |
| `SpecItem` | Label + value + optional tooltip |
| `DataTable` | Responsive; becomes stacked key/value cards below `md` |
| `ComparisonTable` ✱ | Offset vs digital, binding types. The decision aid the old site never offered |
| `StatRow` · `StatItem` | Verified figures only |
| `HoursTable` ✱ | Business hours — never published on the old site |
| `AddressBlock` ✱ | Semantic address + `LocalBusiness` schema |
| `UseCaseList` | "Ideal for…" |
| `TrustRow` | Response time, no obligation, confidentiality |

### Disclosure & navigation

| Component | Notes |
|---|---|
| `Accordion` · `AccordionItem` ✱ | Height-animated, `FAQPage` schema, one-open or multi |
| `TabBar` | Underline indicator slides between tabs |
| `Breadcrumb` ✱ | `BreadcrumbList` schema. Absent from the old site entirely |
| `TableOfContents` | Sticky, scroll-spy. Legal and long articles |
| `Pagination` · `ShareRow` | |

### Overlays

| Component | Notes |
|---|---|
| `Sheet` ✱ | Bottom sheet on mobile with drag-to-dismiss, centred modal on desktop. Focus trap, scroll lock, `Esc` |
| `QuoteSheet` ✱ | `Sheet` + `ContextChips` + `QuoteForm` |
| `ProductDetailSheet` ✱ | Catalogue detail. Deep-linkable, back-button correct |
| `SearchOverlay` | Full-screen, keyboard-first |
| `MegaPanel` | Desktop nav panel |
| `MobileDrawer` | Nav accordion |
| `Lightbox` | Gallery zoom, pinch on touch |
| `Tooltip` · `Toast` | Tooltip is tap-to-open on touch |

### Forms (composed)

| Component | Fields |
|---|---|
| `QuoteForm` ✱ | Context chips → service → item → quantity → timeline → name → phone → email → notes → file. Variants: `inline` (3 fields) · `full` · `sheet` |
| `ContactForm` ✱ | Name, phone, email, subject, message. **The contact page had no form at all** |
| `SampleRequestForm` | Material sample request — the highest-intent action on the site |
| `NewsletterForm` | Journal only |

All forms: honeypot + rate limiting (the old forms had no spam protection at all), visible labels, inline validation on blur, `FormStatus` preserving values on error, WhatsApp fallback.

---

## L4 · Sections

Thin wrappers binding composites into full-width bands. Each owns its reveal and, where relevant, its scroll range.

`HeroSection` · `PageHero` · `PillarSection` · `ProofSection` · `ShowcaseSection` · `MaterialTeaserSection` · `ProcessSection` · `WorkSection` · `FAQSection` · `CTASection` · `SpecSection` · `ConfiguratorSection` · `ProseSection` · `OptionSection` · `UseCaseSection` · `RelatedSection` · `FounderBlock` · `ValueGrid` · `ContactMethods` · `MapEmbed`

Two worth calling out:

**`CTABand`** — closes nearly every page. Variants: `form` (inline 3-field quote) · `split` (copy + methods) · `minimal` (single button). Always carries context into the quote.

**`MapEmbed`** — renders a static map image until tapped, then loads the interactive embed. A third-party map iframe is otherwise one of the heaviest things on a contact page.

---

## 3D branch

Loaded only through `StageCanvas`. See [04 · Component Hierarchy](04-component-hierarchy.md#the-3d-boundary).

| Component | Purpose |
|---|---|
| `StageCanvas` ✱ | The boundary. Renders `Poster`, reserves ratio, reads tier, lazily mounts `Canvas3D`, cross-fades, fails silently to poster |
| `Canvas3D` | r3f canvas, dpr capped `[1,2]` |
| `SceneRoot` · `Lighting` · `Environment` | Shared rig — loaded once, reused by every scene |
| `Model` | glTF loader, Draco + Meshopt, KTX2 textures |
| `MaterialSwitch` ✱ | Swaps material on a variant change. The core of the configurator |
| `Controls` | Damped orbit, clamped polar angle, disabled during scroll on touch |
| `ScrollRig` | Binds scroll progress to a timeline |
| `PerfMonitor` ✱ | Auto-downgrades A → B → poster on sustained frame drop |
| `Preloader` | Idle-time prefetch of the next likely model |
| `Configurator3D` ✱ | `StageCanvas` + `VariantPicker` + `ViewControls` + `ConfigSummary` |
| `VariantPicker` · `SwatchButton` | Material selection. Swatches are real photographs, not colour chips |
| `FinishViewer3D` | Movable light over one surface — spot UV, foil, emboss |
| `SplitCompare` | Drag-divider between two finishes. Works with static images at Tier C |
| `ExplodedView` | Cutaway for corrugated ply and flute |

**`ConfigSummary` is where the 3D pays for itself.** It reads the current configuration and hands it to `QuoteButton` as context, so a buyer who has just built "Hard Case · Rexin · Gold Foil · Rounded Corners" gets a quote form already carrying it.

---

## Component count

| Layer | Count |
|---|---|
| L1 Foundation | 11 |
| L2 Primitives | 24 |
| L3 Composites | 38 |
| L4 Sections | 20 |
| 3D branch | 15 |
| **Total** | **~108** |

Larger than a typical marketing site, because the catalogue is genuinely large — 43 items across three pillars with real variant structure — and because every 3D component needs a designed non-3D counterpart. That doubling is deliberate: it is what makes Tier C a real experience rather than a broken one.

---

## Build order

| Phase | Components | Delivers |
|---|---|---|
| 1 | L1 + L2 | Tokens, type, buttons, fields, images. Nothing renders yet |
| 2 | Cards, grids, `SpecStrip`, `ProseBlock`, `Accordion` | Every page renders statically and reads well |
| 3 | Forms, `Sheet`, `QuoteSheet`, `MobileActionBar` | **The site converts.** Ship here if the timeline compresses |
| 4 | `FilterBar`, `CatalogueGrid`, `ComparisonTable`, `MapEmbed` | Full navigation and comparison |
| 5 | `StageCanvas` + 3D branch | Distinctiveness, scene by scene |

**Phase 3 is a shippable site** that is better than the current one on every measure in the audit: real copy, real specs, a working contact page, one phone number, labelled forms, alt text throughout. Phase 5 is what makes it premium — but it is additive, and nothing before it depends on it.
