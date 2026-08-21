# 04 · Page Hierarchy

The sitemap in [01](01-sitemap.md) says what exists. This document says **what each page is for, which template renders it, what it must not duplicate, and what blocks it from shipping**.

The principle it enforces: *a page exists only if it answers a question the page above it does not*. On the old site, eleven child pages render their parent's grid verbatim — `/carton-box/` and `/packaging/` compete for the same terms and neither wins.

---

## 1. Depth model

```
Tier 0   Home                                   1 page     Orientation + proof
  │
Tier 1   Pillar hubs · Company · Conversion     8 pages    Category decision
  │
Tier 2   Capability pages                      13 pages    Technique decision
  │
Tier 3   Catalogue items                       43 entries  Item specification
  │
Tier 4   Editorial · Legal · Utility            7+ pages   Support
```

**Nothing is more than three clicks from the homepage, and nothing important is more than two.** Every catalogue item is reachable from its pillar hub in one tap via the filterable grid, and from search in one keystroke.

---

## 2. Template inventory

Ten templates carry the whole site. Every page is an instance of one of them — no bespoke layouts, which is what keeps a minimalist system coherent as it grows.

| # | Template | Instances | 3D | Rendering |
|---|---|---|---|---|
| T1 | **Home** | 1 | Scroll-driven press sequence | Static, ISR 24h |
| T2 | **Pillar hub** | 3 | Comparison scene (Binding only, at launch) | Static |
| T3 | **Capability page** | 13 | Configurator or cutaway, where it earns it | Static |
| T4 | **Catalogue detail** | 43 | Inherits parent scene | Overlay + static route |
| T5 | **Showcase** (`/materials/`) | 1 (+ children later) | Material and finish viewer | Static |
| T6 | **Editorial** (`/work/`, `/journal/`, case study, article) | Grows | None | Static, ISR |
| T7 | **Narrative** (`/about/`, `/process/`) | 2 | Press sequence reuse on `/process/` | Static |
| T8 | **Conversion** (`/quote/`, `/contact/`, thank-you) | 3 | None — never | Static shell + client form |
| T9 | **Document** (legal, FAQ) | 4 | None | Static |
| T10 | **Utility** (404, search) | 2 | None | Static / client |

**T8 carries no 3D under any circumstances.** A form that waits on a WebGL context is a form that loses leads on a mid-range Android.

---

## 3. Page-by-page hierarchy

### Tier 0

| Page | Template | Purpose | Primary CTA | Must not |
|---|---|---|---|---|
| `/` | T1 | Establish what the business does, where it is, and that it is credible. Route to the right pillar. | Get a quote | Become a catalogue. The old homepage carries 60 headings, 52 images, and 2,730 characters — a contents page pretending to be a sales page. |

**Homepage H1:** one, keyword- and location-led. The old page has two competing H1s ("We do Micro Text Variable Data Printing" and "All types of Customised Personalised Printing available"), neither of which names Chennai.

### Tier 1

| Page | Template | Answers | Primary CTA | Blocked by |
|---|---|---|---|---|
| `/printing/` | T2 | "Digital or offset, and at what quantity?" | Get a quote | 400–600 words (has 195 characters) |
| `/packaging/` | T2 | "Which material and structure for my product?" | Request a sample | 400–600 words (has 230 characters) |
| `/binding/` | T2 | "Which binding for my page count, durability and budget?" | Request a sample | 400–600 words (has 417 characters) |
| `/materials/` | T5 | "What do the finishes actually look like?" | Request a sample | Material photography + 3D scene |
| `/work/` | T6 | "Have they done this before?" | Start a job like this | **Case study content — none exists** |
| `/about/` | T7 | "Who are these people?" | Contact | Founder photo; the 2010-vs-2017 founding-year conflict |
| `/process/` | T7 | "How does a job actually run?" | Get a quote | Machine list; facility photography |
| `/contact/` | T8 | "How do I reach them and where are they?" | Send enquiry | Canonical phone; business hours |

`/quote/` is Tier 1 by traffic and Tier 8 by template; it is listed under Conversion below.

### Tier 2 — capability pages

Each owns **one technique and one decision**. If two capability pages would answer the same question, they merge.

**Printing**

| Page | Owns the decision | Distinct content | 3D |
|---|---|---|---|
| `/printing/digital-multicolour/` | Short runs, fast, variable content | Run lengths, colour accuracy, stocks, same-day options | Finish close-up |
| `/printing/digital-black-white/` | Volume mono — exam stationery, POD books | Confidentiality, bulk pricing, POD workflow, book scanning | None |
| `/printing/offset-multicolour/` | Volume colour, best unit cost | Plate process, Pantone, run-length crossover, stocks | Finish close-up |
| `/printing/offset-black-white/` | Volume mono at lowest unit cost | Text stock, book blocks, when it beats digital | None |
| `/printing/variable-data/` ★ | Serialisation, micro text, security | Micro-text printing, numbering, personalisation, data handling | Micro-text macro shot |

★ new. The old homepage claims micro text and variable data printing in an H1 and never explains it anywhere on the site.

**Packaging**

| Page | Owns the decision | Distinct content | 3D |
|---|---|---|---|
| `/packaging/corrugated-boxes/` | Shipping strength | Ply, flute type, burst strength, sizing | **Cutaway** — flute and ply explained |
| `/packaging/carton-boxes/` | Retail shelf presence | Board types, lamination, die-cutting, printing on board | Structural viewer |
| `/packaging/paper-bags/` | Carry and brand | Handle types, load ratings, sizes, kraft vs coated | Structural viewer |
| `/packaging/rigid-boxes/` ★ | Premium unboxing | Telescope, drawer, hinged, magnetic, gift; wrap materials, inserts | **Structural viewer** — six types |
| `/packaging/files-folders/` ★ | Institutional and presentation | Customised files, box files, convocation files, presentation samples | None |

★ new. Rigid boxes are the premium range and currently exist only as six thumbnails on a hub page.

**Binding**

| Page | Owns the decision | Distinct content | 3D |
|---|---|---|---|
| `/binding/hard-case/` | Durability and premium feel | 8 materials, foiling, corner and spine styles, page limits | **Material configurator** — priority 1 |
| `/binding/perfect/` | Spine printing, 60–400pp | Direct, stitched, pinned variants; spine widths, adhesives | **Spine cross-section** |
| `/binding/wiro/` | Lay-flat, low count | Gold, black, white loops; sizes, capacity | Colour swap |
| `/binding/center-pin/` | Cheapest, ≤64pp | Page limits, creep, ideal use cases | None |
| `/binding/board-books/` ★ | Children's and heavy-use | Board on board, rounded, hard case, price-tag pasting | Inherits configurator |

★ new. Board-on-board work has four catalogue items and no page, and it owns the site's single highest-resolution asset (`Board-on-board-hard.jpg`, 2447²).

### Tier 3 — catalogue

43 items. **They are CMS entries, not pages.**

```
Pillar hub or capability page
   └── filterable catalogue grid
          └── item card  ──tap──►  detail overlay at /{pillar}/{capability}/#{item}
                                        │
                                        └── deep-linkable, shareable, indexable
                                            via a static route fallback
```

| Rule | Why |
|---|---|
| An item renders as a detail view **only when it has a description of 40–60 words and a spec block** | Otherwise it reproduces the current failure: a photograph with a two-word label |
| Items promote to full pages **individually**, when search demand justifies it | The data model does not change — the entry is already structured |
| Item photography under 700px is grid-tile only | Nine in-use assets are under 700px wide and cannot survive a lightbox or a detail hero |
| Every item names its parent capability and links to it | Prevents the orphan-island problem the old child pages have |

**Launch promotion candidates** (the six with the clearest standalone search demand): Business cards · Books · Brochures · Certificates · Question papers · Paper bags.

### Tier 4 — conversion, editorial, legal, utility

| Page | Template | Note |
|---|---|---|
| `/quote/` | T8 | The most commercially important page on the site. Real URL, indexable, linkable, ad-landable. |
| `/quote/thank-you/` | T8 | Confirms, states the response SLA, offers the next step. Conversion-tracking endpoint. |
| `/faq/` | T9 | The four existing homepage FAQs expand to twelve. `FAQPage` schema. |
| `/journal/` | T6 | Ships **empty or not at all**. Nine Lorem Ipsum posts are deleted, not migrated. |
| `/privacy-policy/` | T9 | Does not exist today; the footer links to it. Compliance gap. |
| `/terms/`, `/cookies/` | T9 | Existing boilerplate, re-checked for entity name and Indian jurisdiction |
| `/404/` | T10 | Designed. Search + three pillars + quote fallback. |
| `/search/` | T10 | Client-side over a prebuilt index |

---

## 4. Content ownership matrix

The defence against the duplication that defines the current site. Each row of content is owned by exactly one page; everyone else links.

| Content | Owner | Everyone else |
|---|---|---|
| Company story, founder | `/about/` | Links, with a two-line summary at most |
| How a job runs, proofing, artwork spec | `/process/` | Links |
| Machine and capability list | `/process/` | Home shows three; links for the rest |
| Material and finish detail | `/materials/` | Capability pages link to the relevant anchor |
| Turnaround and MOQ for a technique | That capability page | Hubs show a range |
| Item specs | Catalogue entry | Rendered wherever the item card appears |
| Pricing guidance | `/quote/` | Nobody publishes numbers |
| Delivered work | `/work/` | Capability pages pull the two case studies tagged with them |
| FAQ answers | `/faq/` | Home shows four, tagged pages show the three relevant ones |
| Contact details | `siteConfig` | Every surface reads from it — never a hard-coded number again |

---

## 5. Internal link graph

The old site is a hub-and-spoke with no spokes connecting: eleven leaf pages, each linked only from the nav, each duplicating its parent. This is what replaces it.

```
                              ┌──────┐
                       ┌──────┤ HOME ├──────┐
                       │      └───┬──┘      │
                       ▼          ▼         ▼
                 ┌──────────┬──────────┬──────────┐
                 │ PRINTING │PACKAGING │ BINDING  │  ◄──┐ pillars cross-link
                 └────┬─────┴────┬─────┴────┬─────┘     │ ("finishing your
                      │          │          │           │  printed job →")
        ┌─────────────┼──────────┼──────────┼───────────┘
        ▼             ▼          ▼          ▼
   capability    capability  capability  capability   ◄── sibling strip at
        │             │          │          │             the foot of each
        └──────┬──────┴────┬─────┴────┬─────┘
               ▼           ▼          ▼
          catalogue   MATERIALS     WORK          PROCESS
           entries        │           │              │
               │          └─────┬─────┴──────┬───────┘
               └────────────────┴────────────┘
                                ▼
                             QUOTE
```

| Rule | Detail |
|---|---|
| Every capability links **up** to its pillar and **sideways** to its siblings | Breadcrumb + sibling strip |
| Every capability links to the materials it uses | Deep anchor into `/materials/` |
| Every capability pulls the case studies tagged with it | Maximum two, automatic |
| Every pillar cross-links to the pillar that follows it in the workflow | Printing → Binding → Packaging is the real production sequence |
| `/work/` case studies link back to every capability they used | Turns the portfolio into a distribution layer for the deep pages |
| No page is more than one click from `/quote/` | The sticky CTA guarantees it |

---

## 6. Ship gates

A page does not go live until its gate clears. This is the mechanism that stops the redesign from reproducing the current site in a nicer typeface.

| Gate | Requirement |
|---|---|
| **Copy** | Body copy at the specified length. A template with lorem in it does not deploy. |
| **Metadata** | Unique title with location intent, unique meta description, one H1, canonical, `og:image` |
| **Alt text** | Every image. All 155 media records currently have empty alt attributes. |
| **Spec block** | Every capability and catalogue entry, all fields populated or explicitly marked "on request" |
| **Contact parity** | Every phone, email and address reads from `siteConfig` |
| **Performance** | LCP under 2.0s on throttled 4G, on the real page with real images |
| **Static-first** | The page is fully usable with WebGL disabled |

**Pages blocked on content that does not exist yet:** `/work/` (no case studies), `/journal/` (no real articles), any testimonial or client-logo section (all seven testimonials on file are fabricated and must be deleted). These components are built and ship **empty-state-first** — they render nothing at all rather than rendering placeholder people.
