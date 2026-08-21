# 01 · Sitemap

## The structural problem being solved

The existing site is flat. All 25 pages sit at the domain root with `parent: 0` in WordPress, while the navigation presents a three-level hierarchy that exists only in the menu widget. Worse, the eleven child pages render their parent's grid verbatim, so `/carton-box/` competes with `/packaging/` for the same terms while adding nothing.

The new structure makes URL, CMS, navigation, and breadcrumb agree — and gives every page a reason to exist that the page above it does not already serve.

---

## Page tiers

Depth is assigned by commercial value, not by taxonomy neatness. Not every catalogue item deserves a page.

| Tier | What it is | Count | Rendering |
|---|---|---|---|
| **0** | Home | 1 | Static, ISR |
| **1** | Pillar hubs, conversion, company | 8 | Static |
| **2** | Capability pages — the technique-level splits people actually search | 13 | Static |
| **3** | Catalogue items | 43 | CMS entries, rendered as detail overlays; promoted to full pages where search volume justifies |
| **4** | Editorial, legal, utility | 7+ | Static / ISR |

**Tier 3 is the important decision.** Building 43 full pages with 3D each is not realistic, and most would be thin. Instead catalogue items live as structured CMS entries surfaced through a filterable grid with a detail overlay at `/{pillar}/{capability}/#{item}`. When a given item proves search demand, it graduates to a real page without any structural change — the data is already there.

---

## Sitemap

```
/                                          Home
│
├── /printing/                             Pillar hub
│   ├── /printing/digital-multicolour/     Capability
│   ├── /printing/digital-black-white/     Capability
│   ├── /printing/offset-multicolour/      Capability
│   ├── /printing/offset-black-white/      Capability
│   └── /printing/variable-data/           Capability  ★ new
│
├── /packaging/                            Pillar hub
│   ├── /packaging/corrugated-boxes/       Capability
│   ├── /packaging/carton-boxes/           Capability
│   ├── /packaging/paper-bags/             Capability
│   ├── /packaging/rigid-boxes/            Capability  ★ new
│   └── /packaging/files-folders/          Capability  ★ new
│
├── /binding/                              Pillar hub
│   ├── /binding/hard-case/                Capability
│   ├── /binding/perfect/                  Capability
│   ├── /binding/wiro/                     Capability
│   ├── /binding/center-pin/               Capability
│   └── /binding/board-books/              Capability  ★ new
│
├── /materials/                            Materials & finishes  ★ new — the 3D showcase
│   └── /materials/{slug}/                 Individual stock or finish (Phase 2)
│
├── /work/                                 Portfolio index  ★ new
│   └── /work/{slug}/                      Case study  ★ new
│
├── /process/                              How a job runs, start to delivery  ★ new
│
├── /about/                                Company, founder, facility
│
├── /contact/                              Contact — form, map, hours, direct lines
│
├── /quote/                                Quote request — a real page, not only a popup  ★ new
│   └── /quote/thank-you/                  Confirmation  ★ new
│
├── /journal/                              Editorial index (replaces /blog/)
│   └── /journal/{slug}/                   Article
│
├── /faq/                                  Full FAQ  ★ new
│
├── Legal
│   ├── /privacy-policy/                   ★ new — currently a 404 linked from the footer
│   ├── /terms/                            
│   └── /cookies/                          
│
└── Utility
    ├── /404/                              Designed, not default
    ├── /search/                           Site search  ★ new
    └── /sitemap.xml                       Generated
```

★ = did not exist on the old site.

**Totals:** 1 home + 8 tier-1 + 13 tier-2 + 43 catalogue entries + 7 utility/legal + editorial and case studies as content grows.

---

## Why each new page earns its place

| Page | Justification |
|---|---|
| `/materials/` | The audit's clearest 3D opportunity. Spot UV, foiling, emboss, lamination, PU leather vs rexin, flute types — all invisible in flat photography, all the upsell, all perfect for real-time lighting on a 3D surface. It also gives the 3D work a natural home rather than scattering it. |
| `/work/` | The homepage claims "From Start-Ups to Big Brands" with zero evidence. Every product shot on the old site is a generic object photo. Case studies are the single biggest credibility gap. |
| `/process/` | The old homepage had a "Technology We Possess" heading with nothing beneath it, and a flattened process diagram. Both belong here, and the scroll-driven press sequence gets a home. |
| `/quote/` | Currently a popup only. A popup cannot be linked from an ad, shared, indexed, or returned to. |
| `/rigid-boxes/`, `/files-folders/`, `/board-books/`, `/variable-data/` | Each is an existing product group with no page. Rigid boxes in particular are the premium packaging range, currently represented by six thumbnails. Variable data printing is claimed in an old H1 and never explained. |
| `/faq/` | Four good FAQs exist on the homepage. Expanded to a dozen, this is a genuine search asset for a category full of process questions. |
| `/privacy-policy/` | The footer links to it. It does not exist. Compliance gap, not just a broken link. |
| `/search/` | 43 catalogue items across three pillars — people will look for "visiting card" and need to land somewhere. |

---

## Navigation model

### Primary navigation

Seven items maximum. Apple's restraint: the nav is a table of contents, not a directory.

```
[Logo]   Printing   Packaging   Binding   Materials   Work   About      [Search] [Get a Quote]
```

`Contact` moves out of the primary nav — the persistent **Get a Quote** CTA and the footer cover it, and dropping it buys the room that keeps the bar uncluttered.

### Mega-panel behaviour

Printing, Packaging and Binding open a **single full-width panel** on hover/focus (desktop) or tap (touch), never a nested dropdown. The old site's `href="#"` group labels — "Digital", "Offset" — were unclickable dead ends; they become panel column headings instead.

```
┌──────────────────────────────────────────────────────────────────────┐
│  PRINTING                                                            │
│                                                                      │
│  Digital                    Offset                    Featured       │
│  ─────────────────          ─────────────────         ──────────     │
│  Multicolour                Multicolour               ┌────────────┐ │
│  Black & White              Black & White             │            │ │
│  Print on Demand            Variable Data             │  [visual]  │ │
│                                                       │            │ │
│  ─────────────────────────────────────────────        └────────────┘ │
│  All printing services  →                             Micro-text     │
│                                                       variable data  │
└──────────────────────────────────────────────────────────────────────┘
```

The Featured slot carries one visual and one line of copy — a real capability, rotated per pillar. It is the panel's only image, keeping the panel light enough to render instantly.

### Breadcrumbs

On every Tier 2 page and below. Absent from the old site entirely despite three nominal levels.

```
Home  ›  Binding  ›  Hard Case Binding
```

Marked up with `BreadcrumbList` structured data.

### Footer

Four columns, replacing the old three-column footer that omitted Home, Contact, and the Blog.

| Column | Contents |
|---|---|
| **Brand** | SVG logo, tagline, address, canonical phone, email, hours |
| **Services** | Printing · Packaging · Binding · Materials — each with its capability list |
| **Company** | About · Work · Process · Journal · FAQ · Contact |
| **Legal & social** | Privacy · Terms · Cookies · Instagram · LinkedIn · WhatsApp · dynamic copyright year |

---

## Redirect map

Every old URL must 301 to its new home. The old paths carry whatever authority the site has.

| Old | New | Type |
|---|---|---|
| `/printing/` | `/printing/` | unchanged |
| `/digital-multicolour/` | `/printing/digital-multicolour/` | 301 |
| `/digital-black-and-white/` | `/printing/digital-black-white/` | 301 |
| `/offset-multicolour/` | `/printing/offset-multicolour/` | 301 |
| `/offset-black-and-white/` | `/printing/offset-black-white/` | 301 |
| `/packaging/` | `/packaging/` | unchanged |
| `/corrugation-box/` | `/packaging/corrugated-boxes/` | 301 |
| `/carton-box/` | `/packaging/carton-boxes/` | 301 |
| `/paper-bag/` | `/packaging/paper-bags/` | 301 |
| `/binding/` | `/binding/` | unchanged |
| `/hard-case-binding/` | `/binding/hard-case/` | 301 |
| `/perfect-binding/` | `/binding/perfect/` | 301 |
| `/wiro-binding/` | `/binding/wiro/` | 301 |
| `/center-pin/` | `/binding/center-pin/` | 301 |
| `/about-us/` | `/about/` | 301 |
| `/contact-us/` | `/contact/` | 301 |
| `/blog/` | `/journal/` | 301 |
| `/terms-conditions/` | `/terms/` | 301 |
| `/cookie-policy/` | `/cookies/` | 301 |
| `/404` (footer "Privacy Page") | `/privacy-policy/` | fix link + create page |
| `/home/` | `/` | 301 |
| `/home-ai-2/` | `/` | **410 Gone** |
| `/sample-page/` | `/` | **410 Gone** |
| `/maintenance/` | `/` | **410 Gone** |
| `/demo-design-system/` | — | remove, or keep private |
| `/post01/` … `/post09/` (9 posts) | `/journal/` | **410 Gone** — all Lorem Ipsum |
| `/testiminials/testimonial011–017/` | — | **410 Gone** — all fabricated |
| `/category/uncategorized/` | `/journal/` | 301 |

**410 rather than 301 for the placeholder content.** These pages should leave the index rather than pass signal to a live page — a 301 from nine Lorem Ipsum posts to the new journal tells search engines those posts moved, which is untrue and unhelpful.

Note the `testiminials` slug typo is permanent in the current permalinks. Relaunch is the moment to drop it.

---

## Rendering and SEO

| Page type | Strategy | Revalidate |
|---|---|---|
| Home | Static, ISR | 24h |
| Pillar hubs | Static | on publish |
| Capability pages | Static | on publish |
| Catalogue detail | Static, generated per entry | on publish |
| Materials | Static | on publish |
| Work / case studies | Static, ISR | 24h |
| Journal | Static, ISR | 1h |
| Quote / Contact | Static shell, client-side form | — |
| Search | Client-side over a prebuilt index | on build |

**Per-page requirements**, all absent from the old site: unique `<title>` with location intent, unique meta description, one `<h1>`, `og:image`, canonical URL, and `alt` on every image.

Structured data: `LocalBusiness` with the canonical NAP on Home, About and Contact · `Service` on each pillar and capability page · `Product` on catalogue items · `BreadcrumbList` sitewide · `FAQPage` on `/faq/` and any page with an accordion.
