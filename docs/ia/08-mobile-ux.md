# 08 · Mobile UX

Mobile is not a breakpoint here, it is the primary case. The audience is largely mid-range Android on mobile data in Chennai, and the buying behaviour that follows — call, WhatsApp, decide in under two minutes — is a phone behaviour.

**The governing constraint:** a premium site that takes twelve seconds to load is not a premium site. Every recommendation below is downstream of that.

---

## 1. Breakpoints

| Token | Range | Columns | Gutter | Margin | Design intent |
|---|---|---|---|---|---|
| `sm` | 0–599 | 4 | 16px | 20px | **Design here first.** 360×800 is the reference device. |
| `md` | 600–904 | 8 | 20px | 32px | Tablets, large phones landscape |
| `lg` | 905–1239 | 12 | 24px | 48px | Small laptops |
| `xl` | 1240–1727 | 12 | 24px | 64px | Desktop |
| `2xl` | 1728+ | 12 | 32px | auto, 1600px max | Large displays |

Every layout is designed at 360px first and widened. The hero, the comparison table, the configurator, and the quote form are each signed off at 360px **before** a desktop composition is drawn — because those four are where mobile-last design fails hardest.

---

## 2. Thumb zones

A 6.1" phone held one-handed gives roughly the lower two thirds of the screen to the thumb. Everything actionable lives there; everything informational lives above it.

```
┌─────────────────────────────┐
│                             │
│    HARD  ── read-only zone  │   logo · breadcrumb · headings
│           no primary action │   hero image · specs
│                             │
├─────────────────────────────┤
│                             │
│    OK   ── secondary        │   body copy · cards
│                             │   in-page links
├─────────────────────────────┤
│                             │
│   EASY  ── primary actions  │   CTAs · form fields
│           everything that   │   filter chips · configurator
│           gets tapped       │   controls
│  ┌───────────────────────┐  │
│  │ 📞  💬   Get a quote  │  │   sticky action bar
│  └───────────────────────┘  │
└─────────────────────────────┘
```

| Consequence | Applied to |
|---|---|
| Menu opens as a **bottom sheet**, not a side drawer | The list starts inside the thumb arc |
| Configurator controls sit **below** the 3D canvas | Fingers do not cover the thing being evaluated |
| Filter chips pin to the **bottom** of the viewport while a grid is scrolling | Filtering is a repeated action |
| Form submit is always in the bottom third | Never at the end of a long scroll |
| The close control on a sheet is duplicated as a **swipe-down gesture** | A ✕ in the top-right corner is out of reach on a large phone |

---

## 3. Touch targets

| Element | Minimum | Used |
|---|---|---|
| Primary CTA | 44px | **48px** |
| Sticky bar actions | 44px | **56px** |
| Nav rows in the sheet | 44px | **56px** |
| Filter chips | 36px | **40px** with 8px gaps |
| Form inputs | 44px | **52px** |
| Accordion headers | 44px | **56px**, whole row tappable |
| Catalogue cards | — | Whole card, never just the label |
| Icon-only buttons | 44×44 | **48×48** |

Minimum 8px between adjacent targets. Text links inside body copy get 8px vertical padding so a mis-tap does not scroll instead of navigate.

---

## 4. Layout adaptation

Adaptation is by **reflow and disclosure**, never by hiding content. If something matters on desktop it matters on mobile; it just needs a different shape.

| Desktop pattern | Mobile pattern | Never |
|---|---|---|
| Mega-panel | Bottom sheet with in-place accordions | A second drill-down screen |
| 3-up card grid | 1-up stack; 2-up only for small tiles | Horizontal carousel for primary content |
| Comparison table | **Stacked comparison cards**, one method per card, same fields in the same order | A horizontally scrolling table |
| Sticky left rail index | Horizontal chip row pinned under the header | Removing the index |
| Split hero (copy + media) | Media, then copy, then CTA | Text over a busy image |
| Side-panel detail | Bottom sheet at 90% height, drag to dismiss | Full page navigation and a back-tap |
| Configurator side-by-side | Canvas above, swatch row below | Controls overlaying the canvas |
| 4-column footer | Accordions, brand block always open | Dumping every link into one list |
| Multi-column form | One field per row, one step per screen | Side-by-side fields |
| Breadcrumb trail | `‹ Binding` — parent only | A wrapping three-line trail |

**The comparison table is the important row.** It is the decision section on every pillar and capability page, and a horizontally scrolling table on a phone is a section nobody reads. Stacked cards with identical field order let the buyer compare by scrolling — which is the gesture they are already making.

---

## 5. Device tiers and 3D

3D is what makes this site distinctive and it is also the thing most likely to break it on the target device. Capability is measured, not assumed.

| Tier | Detection | 3D treatment |
|---|---|---|
| **A** | WebGL2 · ≥6 device-memory · ≥6 cores · 4G or better | Full interactive scene, all materials, real-time lighting |
| **B** | WebGL2 · ≥4 device-memory · ≥4 cores | Reduced scene: lower poly, smaller textures, no shadow maps, no post-processing |
| **C** | WebGL1, low memory, `save-data`, 3G, or a slow first paint | **Static poster + image gallery.** No WebGL loaded at all. |
| **Reduced motion** | `prefers-reduced-motion: reduce` | Scroll-driven sequences become static frames; the configurator still works but does not animate transitions |

### The loading contract

```
1. Static poster renders as part of the page      ← this is the LCP element
2. Page becomes interactive
3. Device tier assessed
4. Scene requested only when the section intersects the viewport
5. Poster cross-fades to the live scene when it is ready
6. On failure or timeout, the poster simply stays
```

**WebGL is never in the critical path, on any device.** The poster is a real image with a reserved aspect ratio; if the scene never arrives, the page is complete and nothing shifts.

| 3D budget | Limit |
|---|---|
| Scene bundle (gzipped) | 250 KB, lazy, never in the initial bundle |
| Per-model payload | 1.5 MB, Draco/Meshopt compressed |
| Textures on mobile | 1024² maximum, 2048² desktop only |
| Concurrent scenes | **One.** Scrolling past a scene disposes it. |
| Frame budget | 30fps floor on Tier B; drop quality automatically before dropping frames |
| Battery / thermal | Pause rendering when the tab is hidden or the scene leaves the viewport |

Every configurator has an equivalent **static gallery** of the same material combinations. Tier C buyers see the same information as Tier A buyers, in a less impressive form. They never see less.

---

## 6. Performance on a real connection

Budgets from the [README](README.md), restated as mobile behaviour.

| Metric | Budget | Mobile-specific note |
|---|---|---|
| LCP | < 2.0s on throttled 4G | Hero is a static image or a poster, never a WebGL first paint |
| CLS | < 0.05 | Every media slot has a reserved aspect ratio — including the 3D poster |
| INP | < 200ms | Filter chips and configurator swatches respond optimistically |
| Initial JS | < 180 KB gzipped | 3D excluded and lazy |
| Total page | < 2.5 MB with one scene | |
| Fonts | < 100 KB | One variable family, `font-display: swap`, Latin subset |

### Image strategy

The audit found 168 images, of which nine in-use product shots are under 700px wide — `Center-Pinning.webp` at 568×382, `Price-tag.webp` at 569×500, `10-Question-Papers.webp` at 571×401, `White-wiro-binding.webp` at 612×459.

| Rule | Detail |
|---|---|
| Format | AVIF with WebP fallback; source assets are already WebP |
| Sizing | Real `srcset` at 360 / 720 / 1080 / 1440, `sizes` matching the layout |
| Loading | Hero eager and `fetchpriority="high"`; everything below the fold lazy |
| Aspect ratio | Declared on every image. CLS is otherwise unavoidable on a grid-heavy site. |
| Low-resolution assets | **Capped at tile size.** A 568px asset is never used in a hero, a lightbox, or a 3D texture. |
| Alt text | Mandatory. All 155 media records currently have none. |

### Connection awareness

`save-data` or an effective 2G/3G connection forces Tier C, defers non-critical images, and skips the hero video entirely. Progressive by default: the page is readable before it is decorated.

---

## 7. Forms on mobile

The quote form is the site's revenue path and it is completed on a phone.

| Requirement | Detail |
|---|---|
| One step per screen | Three short screens beat one long scroll |
| Progress visible | "Step 2 of 3" plus a hairline bar |
| Correct keyboards | `type="tel"` + `inputmode="numeric"` for mobile numbers; `type="email"`; `type="date"` for required-by |
| Autocomplete | `name`, `tel`, `email`, `organization` — lets the browser fill three fields at once |
| Service selection is **tappable chips**, not a `<select>` | Four options; a native picker is two extra taps |
| Font size ≥ 16px on inputs | Anything smaller triggers iOS zoom on focus |
| Sticky bar hides on focus | The keyboard owns the bottom of the screen |
| Submit visible without dismissing the keyboard | Or pinned above it |
| State persists | Across steps, back-taps, and accidental navigation |
| Upload | Accepts camera capture — buyers photograph a physical sample |
| Errors above the field, in words | And the first error is scrolled into view and focused |

---

## 8. Motion

Motion carries the premium feel, and it is also the first thing to cost frames on a mid-range Android.

| Element | Motion | Reduced-motion |
|---|---|---|
| Page transition | 160ms fade | Instant |
| Section reveal | 12px rise + fade, 240ms, once, `IntersectionObserver` | Static |
| Sheet | Spring rise, 280ms | 120ms fade |
| Accordion | Height + opacity, 200ms | Instant toggle |
| Configurator material swap | 300ms cross-fade | Instant swap |
| Press sequence | Scroll-linked | **Static frames with captions** — the content survives, the animation does not |
| Sticky bar | Slide 200ms | Instant |
| Hover | Not applicable — design the pressed state instead | — |

Transforms and opacity only. No animating layout properties, no parallax on scroll containers, no scroll-jacking. Anything scroll-linked is throttled to `requestAnimationFrame` and disabled entirely below Tier B.

**There is no hover state on mobile.** Every hover affordance on desktop has an equivalent that is visible at rest on mobile: card arrows are always shown, configurator swatches carry visible labels, and the active filter chip is filled rather than merely tinted.

---

## 9. Mobile-specific behaviours

| Behaviour | Implementation |
|---|---|
| Safe areas | `env(safe-area-inset-*)` on the sticky bar, sheets, and the footer |
| Orientation | Portrait is the design case; landscape reflows to `md`. The configurator gets extra canvas height in landscape. |
| Pull-to-refresh | Not intercepted |
| Back gesture | Closes a sheet or overlay before navigating. An overlay that swallows back is the most common mobile IA failure. |
| Scroll restoration | Position preserved when returning to a filtered catalogue grid |
| Text selection | Disabled on the configurator canvas only |
| Zoom | Never blocked. `maximum-scale` and `user-scalable=no` are prohibited. |
| Tap highlight | Custom, subtle — not suppressed entirely, which removes feedback |
| Offline | Cached shell with contact details and the phone number. Someone standing outside the shop with no signal should still see the address. |
| Dark mode | Follows the system; the full palette is defined in [README](README.md) |

---

## 10. What ships without JavaScript

Every page is readable and every conversion path works with JavaScript disabled or failed:

- All copy, images, specs, and comparison content render server-side.
- `tel:`, WhatsApp, and email links are plain anchors.
- The quote form posts to a real endpoint; the three-step progression is an enhancement.
- The navigation degrades to a `<details>`-based sheet.
- Search is the only feature that requires JS, and the catalogue is fully browsable without it.

This is not a purity exercise. On a mid-range Android over patchy mobile data, a JavaScript bundle failing to arrive is a routine event, and it must not be the difference between a lead and a bounce.
