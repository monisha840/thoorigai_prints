# 09 · Reusable Components

Seventy-six components across nine groups. Every page in [04](04-page-hierarchy.md) and every section in [05](05-section-hierarchy.md) is built from this list — nothing bespoke, which is what keeps a minimalist system coherent as the catalogue grows.

**Composition rule:** primitives know nothing about print. Domain components know nothing about layout. Sections compose both and own their spacing. A component that needs a page-specific exception is a component with the wrong boundary.

---

## Group 1 · Primitives (12)

The design-token layer. Everything else is built from these.

| # | Component | Variants | States | Notes |
|---|---|---|---|---|
| 1 | **Button** | primary · secondary · tertiary · ghost · icon | rest · pressed · focus · loading · disabled | 48px mobile / 44px desktop. Primary is the only amber-filled element on the site. No hover-only affordances. |
| 2 | **Link** | inline · arrow · nav · breadcrumb | rest · focus · current | Arrow variant translates 4px on hover |
| 3 | **Text** | display · h1–h4 · body-lg · body · small · micro | — | Maps 1:1 to the type scale. `--t-micro` is uppercase with 0.04em tracking. |
| 4 | **Icon** | 16 · 20 · 24 · 32 | — | Single stroke weight. Reuse the Phosphor set already in the assets. |
| 5 | **Surface** | paper · raised · sunken | — | Elevation is a hairline plus a background shift; shadow is the last resort |
| 6 | **Divider** | full · inset · vertical | — | 1px `--rule` |
| 7 | **Chip** | filter · tag · spec | rest · active · disabled | 40px tall, 8px gaps |
| 8 | **Badge** | neutral · accent · outline | — | Used for MOQ and turnaround flags |
| 9 | **Input** | text · tel · email · number · date · textarea | rest · focus · error · filled · disabled | **Always a visible `<label>`.** 52px, 16px font to prevent iOS zoom. |
| 10 | **Select** | native · chip-group | — | Four options or fewer render as chips, not a picker |
| 11 | **Media** | image · video · poster | loading · loaded · error | Enforces `srcset`, declared aspect ratio, and mandatory alt |
| 12 | **Container** | content (1600) · measure (68ch) · bleed | — | Full-bleed or in-measure. Never a half-inset. |

---

## Group 2 · Layout (7)

| # | Component | Purpose |
|---|---|---|
| 13 | **Section** | Vertical rhythm wrapper: `--s-8` mobile → `--s-10` desktop, `--s-11` for hero and 3D. Owns the page's spacing so no child ever sets a top margin. |
| 14 | **Grid** | Responsive 4 / 8 / 12 columns with the gutter and margin tokens |
| 15 | **Stack** | Vertical flow with a token gap |
| 16 | **Cluster** | Horizontal wrapping group — chips, tags, CTA pairs |
| 17 | **SplitPanel** | Two-up on desktop, stacked on mobile. Media-first stacking order. |
| 18 | **StickyRail** | Desktop sticky sidebar with scroll-spy; becomes ChipNav on mobile |
| 19 | **Reveal** | 12px rise + fade on intersect, once. No-ops under reduced motion. |

---

## Group 3 · Navigation (10)

| # | Component | Notes |
|---|---|---|
| 20 | **Header** | Rest / scrolled / hidden / panel-open states. Hairline only, never a shadow. |
| 21 | **MegaPanel** | Two or three link columns plus one featured slot. Focus-trapped, Escape-closable. Column headings are headings, not dead links. |
| 22 | **MobileMenuSheet** | Bottom-anchored, accordion pillars in place, search first, contact and hours at the foot |
| 23 | **StickyActionBar** | Default and contextual variants. Demotes its primary when a section CTA is in view. Hides on field focus. |
| 24 | **Breadcrumb** | Full trail on desktop, parent-only on mobile. `BreadcrumbList` schema. |
| 25 | **ChipNav** | Horizontally scrollable section index that pins under the header |
| 26 | **SiblingStrip** | "Also in {pillar}" — the internal linking the current site has none of |
| 27 | **Footer** | Four columns; accordions on mobile. Reads every contact value from `siteConfig`. |
| 28 | **SearchOverlay** | Type-ahead over a prebuilt index, grouped results, synonym mapping, quote fallback on no-match |
| 29 | **Pagination** | Journal and work indexes |

---

## Group 4 · Content (11)

| # | Component | Variants | Notes |
|---|---|---|---|
| 30 | **Hero** | home · pillar · capability · editorial | Poster-first. The LCP element on every page. |
| 31 | **PillarCard** | — | Image, name, one sentence, link. Three per row max. |
| 32 | **CapabilityCard** | — | Adds one spec highlight to the pillar card |
| 33 | **CredibilityStrip** | — | Four numeric facts. Numbers, not icons — icons make claims look like decoration. |
| 34 | **CommitmentGrid** | — | The four existing commitments, each with its real sentence |
| 35 | **StatBlock** | — | One large figure plus a label |
| 36 | **Accordion** | faq · footer · nav · legal | Single or multi-open. 56px rows, whole row tappable. |
| 37 | **Timeline** | — | About page milestones |
| 38 | **StepSequence** | numbered · scroll-linked | `/process/` and the homepage press sequence; degrades to static captioned frames |
| 39 | **QuoteBlock** | — | Pull quotes and, when they exist, real client quotes |
| 40 | **ArticleBody** | — | Long-form at a 68ch measure, with typographic defaults |

---

## Group 5 · Product and catalogue (9)

The components that carry the 43 catalogue items and the 13 capabilities.

| # | Component | Notes |
|---|---|---|
| 41 | **CatalogueGrid** | Filterable, URL-encoded filter state, preserved scroll position on return |
| 42 | **CatalogueCard** | Image, name, one-line description. **Renders no card without a description** — the gate against reproducing the current two-word-label site. |
| 43 | **CatalogueDetailSheet** | Bottom sheet on mobile, side panel on desktop, static route when opened directly |
| 44 | **SpecBlock** | **Fixed fields, sitewide:** sizes · stocks and GSM · finishes · page or ply range · MOQ · lead time · artwork requirements. Identical order everywhere, so the second page a buyer reads takes five seconds. |
| 45 | **KeySpecs** | The four pinned facts under a capability hero |
| 46 | **ComparisonTable** | Table on desktop, stacked cards on mobile with identical field order. The decision section on every hub. |
| 47 | **VariantSelector** | Spec rows, not a photo grid. Drives the 3D viewer. |
| 48 | **MaterialSwatch** | Name, texture, and the capabilities that use it |
| 49 | **FilterChipRow** | Pins to the bottom of the viewport while a grid scrolls on mobile |

---

## Group 6 · 3D (6)

Every one of these has a static fallback that is what actually loads first.

| # | Component | Job | Where |
|---|---|---|---|
| 50 | **SceneShell** | Device-tier detection, intersection-triggered load, poster cross-fade, disposal on exit, error fallback. **Every scene mounts inside this — no exceptions.** | All |
| 51 | **MaterialConfigurator** | Swap materials and finishes on one model. URL-encoded state. Priority 1 of the 3D scope. | `/binding/hard-case/` |
| 52 | **StructuralViewer** | Rotate and open a box or bag structure | Rigid boxes, carton, paper bags |
| 53 | **CutawaySection** | Cross-section reveal: corrugated flute and ply, perfect-bound spine | Corrugated, perfect binding |
| 54 | **ScrollSequence** | Scroll-linked press narrative: plate → press → finishing → bound | Home, `/process/` |
| 55 | **FinishCloseUp** | Real-time lighting on foil, spot UV, emboss, lamination — the qualities flat photography cannot show | `/materials/`, home |

**Static twin, required:** every configurator ships with an equivalent image gallery covering the same combinations. Tier C devices see the same information, less impressively. They never see less.

---

## Group 7 · Conversion (10)

| # | Component | Notes |
|---|---|---|
| 56 | **ConversionBlock** | full · split · inline · quiet. Closes every page. |
| 57 | **QuoteForm** | Three steps, contact last, context pre-filled and visible, persisted state, honeypot and rate limiting |
| 58 | **QuickEnquiryForm** | Three fields — name, mobile, message. Used inside conversion blocks. |
| 59 | **SampleRequestForm** | Adds a delivery address and one qualifying line |
| 60 | **ContactChannels** | Call, WhatsApp, email — one tap each, number visible so it can be saved |
| 61 | **WhatsAppLink** | Composes a first message from page context so the buyer types nothing |
| 62 | **FormField** | Label, hint, inline error on blur, correct `inputmode` and `autocomplete` |
| 63 | **FileUpload** | PDF and AI up to 25MB, accepts camera capture |
| 64 | **AddressBlock** | Semantic address, map thumbnail, hours, directions link, `LocalBusiness` schema |
| 65 | **SpecDownload** | Ungated PDF with an optional "email it to me" |

---

## Group 8 · Trust (5) — built, but empty-state-first

All five render **nothing at all** when their content is absent. None of them ship with placeholder people.

| # | Component | Blocked on |
|---|---|---|
| 66 | **CaseStudyCard** | No case studies exist |
| 67 | **CaseStudyStrip** | Same. Pulls up to two entries tagged with the current capability. |
| 68 | **TestimonialCard** | All seven records on file are fabricated and are being deleted |
| 69 | **LogoWall** | No client logos, no permissions |
| 70 | **ReviewSummary** | No Google review programme yet |

---

## Group 9 · Feedback and utility (6)

| # | Component | Notes |
|---|---|---|
| 71 | **Skeleton** | Matches the final layout exactly, so nothing shifts |
| 72 | **EmptyState** | Search, filters, work index. Always offers a route out — usually the quote form. |
| 73 | **Toast** | Form success, configuration copied. Announced politely. |
| 74 | **Modal** | Lightbox and confirmations. **Never used for conversion** — that is the popup pattern being removed. |
| 75 | **BottomSheet** | Mobile detail views, drag-to-dismiss, back-gesture closes it before navigating |
| 76 | **SkipLink** | First focusable element on every page |

---

## Cross-cutting contracts

Rules every component obeys, so the system stays coherent without a style police.

| Contract | Rule |
|---|---|
| **Tokens only** | No hard-coded colour, size, or spacing values anywhere in a component |
| **Dark mode** | Every component works in both palettes. No colour is defined only inside a media query. |
| **Reduced motion** | Every animated component has a static equivalent |
| **Focus** | Visible, 2px `--amber` ring, never suppressed |
| **Touch** | 44px minimum, 48px on primary actions |
| **No hover-only** | Every hover affordance has a rest-state equivalent on touch |
| **Aspect ratio** | Declared on every media slot, including 3D posters |
| **Alt text** | Required by the type. An image without alt does not compile. |
| **Copy gate** | Catalogue and trust components render nothing rather than rendering a label with no description |
| **Single source of contact** | Every phone, email, address, and hours value reads from `siteConfig`. The three-phone-number problem becomes structurally impossible. |
| **Server-first** | Interactivity is an enhancement. The page works without JavaScript. |

---

## Build priority

| Wave | Components | Unblocks |
|---|---|---|
| **1 · Foundation** | 1–19 primitives and layout | Everything |
| **2 · Shell** | 20–29 navigation, 56–65 conversion | A usable, converting site |
| **3 · Content** | 30–40 content, 41–49 catalogue | Every page template |
| **4 · Feedback** | 71–76 | Polish and accessibility |
| **5 · 3D** | 50–55 | The differentiator, layered onto working pages |
| **6 · Trust** | 66–70 | Ships as the content arrives |

Waves 1–4 produce a site that is better than the current one in every measurable way. Wave 5 is what makes it distinctive. **Do not invert them** — a configurator above a two-word label is still a site with no words on it.
