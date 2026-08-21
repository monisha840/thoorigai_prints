# Information Architecture — Thoorigai Prints

A complete IA for the redesigned site: minimalistic, premium, Apple-inspired, mobile-first, 3D-enabled, and fast.

Grounded in the [content audit](../content-audit.md), [sitemap](../sitemap.md), and [image inventory](../image-inventory.md) captured 21 August 2026 from the existing site.

---

## Documents

| # | Document | Covers |
|---|---|---|
| 01 | [Sitemap](01-sitemap.md) | URL structure, page tiers, redirect map, rendering and SEO |
| 02 | [User Journeys](02-user-journeys.md) | Five primary journeys, entry points, friction removed |
| 03 | [Navigation Structure](03-navigation.md) | Header, mega-panels, mobile sheet, breadcrumbs, footer, search |
| 04 | [Page Hierarchy](04-page-hierarchy.md) | Templates, page purposes, content ownership, link graph, ship gates |
| 05 | [Section Hierarchy](05-section-hierarchy.md) | Section-by-section blueprint for all ten templates |
| 06 | [CTA Strategy](06-cta-strategy.md) | The CTA ladder, placement rules, microcopy, context passing |
| 07 | [Conversion Strategy](07-conversion-strategy.md) | Funnel, quote form, sample kit, trust ladder, measurement |
| 08 | [Mobile UX](08-mobile-ux.md) | Breakpoints, thumb zones, device tiers, 3D degradation, forms |
| 09 | [Reusable Components](09-components.md) | 76 components across nine groups, with cross-cutting contracts |
| 10 | [Recommended Page Order](10-page-order.md) | Build waves, presentation order, dependency map |

### Companion documents from the earlier pass

Six documents from a previous pass share this folder. They were written from the same audit and do not contradict the set above, but three of them overlap it and the file numbering now collides. **Decide whether to fold these in or remove them before the folder is handed on.**

| Document | Relationship to the set above |
|---|---|
| [02-user-flows.md](02-user-flows.md) | Overlaps [02 · User Journeys](02-user-journeys.md) — four personas rather than five journeys |
| [03-page-sections.md](03-page-sections.md) | Overlaps [05 · Section Hierarchy](05-section-hierarchy.md); adds per-section asset bindings and copy-slot notation |
| [04-component-hierarchy.md](04-component-hierarchy.md) | **Complementary** — composition layers, state ownership, data flow |
| [05-ui-components.md](05-ui-components.md) | Overlaps [09 · Reusable Components](09-components.md); adds per-component props |
| [06-animation-plan.md](06-animation-plan.md) | **Complementary** — the motion and 3D scene system in full |
| [07-mobile-strategy.md](07-mobile-strategy.md) | Overlaps [08 · Mobile UX](08-mobile-ux.md) |

---

## The strategic premise

The audit found a business with strong raw material behind a site that does almost none of the selling: eleven of seventeen commercial pages carry under 250 characters of body text, and every product is a photograph with a two-word label.

**So the redesign has one job above all others: make the site explain and prove what this business can do.** 3D is the tool for that, not the point of it. Print is a tactile product — thickness, spine, foil, flute, grain, finish — and those are precisely the qualities a flat photograph cannot convey and an interactive 3D surface can.

Three principles follow:

1. **3D must do work.** Every 3D scene must answer a question a buyer actually has ("what does gold foil look like against black rexin?"). Decorative WebGL is banned.
2. **Copy comes first in the build order.** A 3D configurator sitting above a two-word label is still a site with no words on it. Templates are designed with copy slots that must be filled before the page can ship.
3. **Fast is part of premium.** The audience is largely mid-range Android on mobile data in Chennai. A site that takes twelve seconds to load is not premium regardless of how it looks. Performance budgets are hard limits, not aspirations.

---

## Design system foundations

### Concept: Ink & Paper

The palette is derived from the product itself and from the one real brand asset that exists — the logo, which is a single flat amber, sampled at **#F3A233**.

Everything else is ink and paper. Near-black type on warm off-white, generous space, one accent used sparingly enough that it always means something. This is the Apple discipline applied to a printing company: the product is the hero, the interface gets out of the way.

### Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#FAF9F7` | `#0A0A0B` | Page background |
| `--paper-raised` | `#FFFFFF` | `#151517` | Cards, sheets, elevated surfaces |
| `--paper-sunken` | `#F2F0EC` | `#050506` | Wells, insets, code |
| `--ink` | `#111113` | `#F5F4F2` | Primary text |
| `--ink-muted` | `#6B6B70` | `#9C9CA3` | Secondary text |
| `--ink-faint` | `#A8A8AE` | `#5E5E66` | Tertiary, captions |
| `--rule` | `#E4E1DC` | `#26262A` | Hairlines, dividers |
| `--amber` | `#F3A233` | `#F3A233` | Accent — brand, single source |
| `--amber-press` | `#D98A1E` | `#FFB94D` | Accent active state |
| `--amber-wash` | `#FDF3E4` | `#2A1F0E` | Accent background tint |

**Accent discipline:** amber appears at most twice per viewport. Primary CTA, or an active state, or a single emphasis mark — never all three at once. Everything else is ink on paper. This is what separates premium from decorated.

Dark mode is a first-class target, not an afterthought: define the light palette on bare `:root`, redefine only these tokens under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.

### Type scale

A single family carries the whole site. Recommend **Inter** (variable) or the system stack for zero-cost loading; the display sizes want optical sizing, so a variable font earns its weight here.

| Token | Size (mobile → desktop) | Weight | Tracking | Use |
|---|---|---|---|---|
| `--t-display` | 40px → 84px | 600 | −0.03em | Hero headline, one per page |
| `--t-h1` | 32px → 56px | 600 | −0.02em | Page title |
| `--t-h2` | 26px → 40px | 600 | −0.02em | Section heading |
| `--t-h3` | 21px → 28px | 600 | −0.01em | Subsection, card title |
| `--t-h4` | 18px → 20px | 600 | −0.01em | Product name, list heading |
| `--t-body-lg` | 18px → 21px | 400 | 0 | Lead paragraph |
| `--t-body` | 16px → 17px | 400 | 0 | Body copy |
| `--t-small` | 14px → 15px | 400 | 0 | Meta, captions |
| `--t-micro` | 12px → 13px | 500 | 0.04em | Eyebrows, labels, uppercase |

Line height: `1.1` for display and h1–h2, `1.3` for h3–h4, `1.6` for body. Measure capped at **68ch** for body copy.

### Spacing

An 8px base with a doubling rhythm. Section padding is the main lever between "dense" and "premium" — err generous.

`--s-1: 4px · --s-2: 8px · --s-3: 12px · --s-4: 16px · --s-5: 24px · --s-6: 32px · --s-7: 48px · --s-8: 64px · --s-9: 96px · --s-10: 128px · --s-11: 160px`

Section vertical rhythm: `--s-8` (64px) mobile → `--s-10` (128px) desktop. Hero and 3D showcase sections get `--s-11`.

### Radius, elevation, hairlines

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 8px | Chips, badges, inputs |
| `--r-md` | 14px | Buttons, small cards |
| `--r-lg` | 20px | Cards, sheets |
| `--r-xl` | 28px | Modals, feature panels |
| `--r-full` | 999px | Pills, avatars |

Elevation is expressed through **hairlines and background shift first, shadow last**. A `1px` `--rule` border plus `--paper-raised` reads more premium than a drop shadow. Where shadow is used, keep it soft and low-contrast: `0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px rgb(0 0 0 / 0.06)`.

### Grid

| Breakpoint | Width | Columns | Gutter | Margin |
|---|---|---|---|---|
| `sm` | 0–599 | 4 | 16px | 20px |
| `md` | 600–904 | 8 | 20px | 32px |
| `lg` | 905–1239 | 12 | 24px | 48px |
| `xl` | 1240–1727 | 12 | 24px | 64px |
| `2xl` | 1728+ | 12 | 32px | auto (max 1600px content) |

---

## Performance budget

Hard limits. A page that exceeds them does not ship.

| Metric | Budget | Notes |
|---|---|---|
| LCP (mobile, 4G) | **< 2.0s** | Hero is a static image or a pre-rendered poster, never a WebGL first paint |
| CLS | **< 0.05** | Every media slot has a reserved aspect ratio |
| INP | **< 200ms** | 3D interaction runs off the main thread where possible |
| JS (initial, gzipped) | **< 180 KB** | Excludes 3D, which is lazy-loaded and never in the initial bundle |
| 3D bundle (gzipped) | **< 250 KB** | Loaded on intersection, only on Tier A/B devices |
| Per-model payload | **< 1.5 MB** | Draco/Meshopt compressed glTF |
| Total page weight | **< 2.5 MB** | Including one 3D scene |
| Fonts | **< 100 KB** | One variable family, `font-display: swap`, subset to Latin |

**The rule that keeps this honest:** WebGL is never in the critical path. Every 3D scene has a static poster that is what actually loads first, and the interactive layer replaces it only after the page is interactive and the device has been judged capable.

---

## Constraints carried forward from the audit

These are facts about the existing material that shape what the IA can assume.

| Constraint | Consequence for the IA |
|---|---|
| Logo is a 472×317 raster, single colour | **Must be redrawn as SVG before build.** Blocks the header, the loader, and any brand animation. |
| Nine in-use product shots are under 700px wide | They can occupy a card tile and nothing larger. Templates must not require full-bleed product photography that does not exist. |
| No founder photo, team photo, or facility photography | About template designs around this gap with a photography slot marked as blocking. |
| No genuine testimonials; all seven on file are fabricated | Social proof components are built but ship empty-state-first, and are not rendered until real content exists. |
| No client logos | Same. The "From Start-Ups to Big Brands" claim gets a logo wall slot that stays hidden until populated. |
| Only one asset (`Board-on-board-hard.jpg`, 2447²) has zoom headroom | It is the single best candidate for a hero close-up or a 3D texture map. Everything else needs a re-shoot for that use. |
| 43 catalogue items exist, all with a two-word label and no description | Catalogue components are copy-gated: an item without a description does not render as a detail view. |
| Three conflicting phone numbers live today | One canonical `siteConfig.phone` value. Every `tel:` link and the WhatsApp widget read from it. |

---

## Build order

The dependency chain, shortest path to a shippable premium site:

1. **Logo as SVG** — blocks header, loader, favicon, any brand motion
2. **Copy** — 15 page bodies, 43 product descriptions, 24 title tags and meta descriptions, 168 alt attributes. The long pole; start immediately and in parallel with everything else.
3. **Design system + core components** — tokens, typography, buttons, cards, layout primitives
4. **Static templates** — every page fully functional with zero WebGL, meeting the performance budget
5. **3D layer** — added on top of working pages, scene by scene, each behind a capability check
6. **Real photography and social proof** — re-shoot, founder portrait, client logos, genuine testimonials

Steps 1–4 produce a site that is already better than the current one in every measurable way. Step 5 is what makes it distinctive. **Do not invert them.**

Page-by-page sequencing, dependencies and launch waves are in [10 · Recommended Page Order](10-page-order.md).
