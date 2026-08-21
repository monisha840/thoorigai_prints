# 07 · Mobile Layout Strategy

Mobile is the design target, not a derivative of the desktop layout. The audience is largely mid-range Android on mobile data in Chennai, which means **Tier B is the realistic default** and the mobile experience determines whether the site succeeds.

The old site inverted this: a desktop Elementor layout squeezed down, a contact page with no form, and a WhatsApp widget pointing at a different number from the one in the footer.

---

## Breakpoints

Design at 390px first. Every layout decision is made there and then relaxed upward.

| Name | Range | Columns | Margin | Notes |
|---|---|---|---|---|
| `sm` | 0–599 | 4 | 20px | **Primary design target.** 390px reference |
| `md` | 600–904 | 8 | 32px | Large phones landscape, small tablets |
| `lg` | 905–1239 | 12 | 48px | Tablets, small laptops |
| `xl` | 1240–1727 | 12 | 64px | Desktop |
| `2xl` | 1728+ | 12 | auto | Content capped at 1600px |

Container queries govern components; media queries govern page layout. A `ProductTile` in a 2-up mobile grid and the same tile in a 4-up desktop grid respond to *their own width*, not the viewport's — which is what lets the same component sit in a sheet, a grid, and a carousel without variants.

---

## Navigation

### Header — 64px

```
┌──────────────────────────────────────────┐
│  [logo]                    [search] [☰]  │  64px
└──────────────────────────────────────────┘
```

Hides on scroll down past 120px, reveals on scroll up. Reveal is immediate — a delayed header on an upward scroll feels broken.

### Drawer

Full-screen, slides from the right. Pillars are accordions, not nested pushes: a nested drawer costs a tap and loses orientation.

```
┌──────────────────────────────────────────┐
│  [logo]                             [×]  │
├──────────────────────────────────────────┤
│  Printing                            ⌄   │
│    Digital Multicolour                   │
│    Digital Black & White                 │
│    Offset Multicolour                    │
│    Offset Black & White                  │
│    Variable Data                         │
│  Packaging                           ⌄   │
│  Binding                             ⌄   │
│  Materials                               │
│  Work                                    │
│  About                                   │
├──────────────────────────────────────────┤
│  [    Get a Quote    ]                   │
│  Call  ·  WhatsApp                       │
├──────────────────────────────────────────┤
│  99626 04017 · sales@…                   │  canonical, from SiteConfig
└──────────────────────────────────────────┘
```

Contact details sit at the bottom of the drawer, always. Many visitors open the menu looking for a phone number rather than a page.

### Action bar — persistent

```
┌──────────────────────────────────────────┐
│    Call    │   WhatsApp   │    Quote     │  56px + safe-area
└──────────────────────────────────────────┘
```

**Always visible. Never scroll-triggered.** Two taps to a human from anywhere on the site. WhatsApp sits centre — it is the primary channel for this audience, and the old site buried it in a floating widget wired to an inconsistent number.

Page content carries `padding-bottom: calc(56px + env(safe-area-inset-bottom))`. The bar hides only while a sheet is open or an input is focused.

---

## Layout transformations

| Desktop | Mobile | Reasoning |
|---|---|---|
| 3-up pillar grid | Stacked full-width cards | Each pillar deserves a full screen-width decision |
| 4-up catalogue | **2-up** | 1-up wastes the fold; 2-up shows four items above it |
| Sticky spec sidebar | Horizontal scroll strip under hero | Specs stay high without consuming vertical space |
| Mega panel | Drawer accordion | |
| Data table | Stacked key/value cards | Horizontally scrolling tables are read by nobody |
| Comparison table | Swipeable column cards + sticky row labels | |
| Modal | Bottom sheet, drag-to-dismiss | Thumb-reachable dismissal |
| Split hero | Stacked: copy above, media below | Copy above the fold beats a decorative image |
| Multi-column form | Single column | Always |
| Footer columns | Accordions | Except the brand block, which stays open |
| Configurator side panel | Swatches below canvas, horizontal scroll | |
| Carousel arrows | Snap scroll + dots | Native momentum outperforms custom arrows |

### The 2-up catalogue decision

Worth stating explicitly. Products carry a photograph and a short name. At 390px, a 2-up grid gives each tile ~170px — enough for a legible product photo and two lines of name, and it puts four items above the fold. 1-up would be more beautiful and would show one. For a 43-item catalogue that is the wrong trade.

---

## Typography on mobile

| Token | Mobile | Desktop |
|---|---|---|
| Display | 40px / 1.1 | 84px |
| H1 | 32px / 1.15 | 56px |
| H2 | 26px / 1.2 | 40px |
| H3 | 21px / 1.3 | 28px |
| Lead | 18px / 1.55 | 21px |
| Body | **16px** / 1.6 | 17px |
| Small | 14px | 15px |

**16px body is a floor, not a preference** — anything smaller triggers zoom-on-focus in iOS Safari for inputs and reads poorly in daylight. Measure caps at 68ch, which on mobile is simply the container width.

Scaling uses `clamp()` so there are no jumps at breakpoints:
`--t-h1: clamp(2rem, 1.4rem + 3vw, 3.5rem)`

---

## Touch

| Rule | Value |
|---|---|
| Minimum target | 44×44px, 48×48 for primary actions |
| Spacing between targets | ≥8px |
| Thumb zone | Primary actions in the bottom third |
| Top-right corner | Never the only route to a primary action |
| Hover states | None depended upon — every hover has a tap or always-visible equivalent |
| Tooltips | Tap to open, tap outside to close |
| Sheets | Drag-to-dismiss with a visible grab handle |
| Horizontal scrollers | `scroll-snap-type: x mandatory`, 16px peek showing there is more |
| Pull-to-refresh | Not intercepted |
| Double-tap zoom | Preserved except inside a 3D canvas |

The 16px peek on horizontal scrollers matters more than it sounds — a strip that ends flush at the viewport edge reads as a complete row, and users never scroll it.

---

## 3D on mobile

The tension at the heart of this brief: premium 3D against mid-range Android on mobile data. Resolved by conceding the hero and spending the budget where it converts.

| Rule | Rationale |
|---|---|
| **Hero is static on mobile at every tier** | The hero is the LCP element. Nothing competes with it |
| **One 3D scene per page, below the fold** | Loaded on intersection, never before |
| **Tier B by default** | Baked lighting, half-res textures, no shadows, dpr capped 1.5 |
| **Configurator is portrait-first** | Canvas on top at 4:3, swatches in a scrollable row beneath, specs below |
| **Scroll-scrubbed scenes become stepped stills** | Scrubbed WebGL and touch scroll compete for the main thread |
| **Orbit disabled during page scroll** | 200ms after scroll ends, orbit re-enables. Otherwise the canvas steals vertical drags |
| **Battery below 20%** | Drops to Tier C |
| **Fullscreen available** | The one place a mobile user gets full-fidelity interaction, entered deliberately |

### Mobile configurator layout

```
┌──────────────────────────────────────────┐
│  Breadcrumb                              │
│  H1: Hard Case Binding                   │
│  Lead paragraph                          │
├──────────────────────────────────────────┤
│  MOQ 1 › 5–7 days › A4–A3 › 8 covers  →  │  spec strip, h-scroll
├──────────────────────────────────────────┤
│                                          │
│         [ 3D canvas — 4:3 ]              │  poster first
│                                          │
├──────────────────────────────────────────┤
│  ● ○ ○ ○ ○ ○ ○ ○                    →   │  swatches, h-scroll
│  Rexin · Gold Foil                       │  live config, announced
├──────────────────────────────────────────┤
│  [      Get a quote for this      ]      │  carries the configuration
├──────────────────────────────────────────┤
│  Description, options, use cases…        │
└──────────────────────────────────────────┘
```

The quote button sits **directly beneath the configuration**, not at the page foot. A buyer who has just built a spec is at peak intent; making them scroll past four sections to act loses them.

---

## Performance on mobile

Budgets are stricter than desktop and are measured on a **mid-range Android over throttled 4G**, not on a developer's laptop.

| Metric | Budget |
|---|---|
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| Initial JS (gzip) | < 180 KB |
| Total, no 3D | < 1.2 MB |
| Total, one 3D scene | < 2.5 MB |
| Time to interactive | < 3.5s |

**Tactics**

- Hero poster preloaded and `fetchpriority="high"`; every other image lazy
- AVIF with WebP fallback; the audit found the library already 48% WebP, which is a good start
- Responsive `sizes` on every image — several current assets are served at 1800px into a 170px tile
- One variable font, subset to Latin, `font-display: swap`, self-hosted
- Route-level code splitting; 3D in its own chunk, never in the initial bundle
- Map renders as a static image until tapped
- No third-party script above the fold; analytics deferred
- The nine sub-700px product shots are used **only** in tiles where their native size is adequate — a constraint the templates already respect

---

## Forms on mobile

The old forms had no visible labels, no spam protection, one field misnamed, and no form at all on the contact page.

| Rule | Implementation |
|---|---|
| Visible labels | Always. Placeholders never carry the only label |
| One column | Always |
| Input font-size | ≥16px, preventing iOS zoom-on-focus |
| Keyboards | `inputMode="tel"` for phone, `email` for email, `numeric` for quantity |
| Autocomplete | `name`, `tel`, `email` |
| Submit | Full-width, above the action bar, never obscured by the keyboard |
| Errors | Inline, below the field, **preserving every entered value** |
| Success | Inline confirmation, not a redirect that loses context |
| WhatsApp fallback | Offered on submission failure, carrying the typed message |
| Quote form | 3 required fields when context is carried in |

---

## Landscape and edge cases

| Case | Handling |
|---|---|
| Landscape phone | Header 56px; hero switches to split layout; action bar persists |
| Foldables | Container queries handle the transition without a dedicated breakpoint |
| Very small (320px) | Layout holds; 2-up catalogue becomes 1-up below 340px |
| Large text / 200% zoom | Reflows to single column, no horizontal scroll, no clipped content |
| Safe areas | `env(safe-area-inset-*)` on the action bar, sheets, and fixed elements |
| Slow network | Save-Data → Tier C, reduced image sets, no 3D |
| Offline | Cached shell with a "you're offline" state and the canonical phone number |

---

## Mobile-first checklist

Applied per page before it ships.

- [ ] Designed at 390px before any wider layout exists
- [ ] Primary CTA reachable by thumb without repositioning
- [ ] Action bar present, persistent, and not overlapping content
- [ ] Every touch target ≥44px with ≥8px separation
- [ ] Body text ≥16px, inputs ≥16px
- [ ] No horizontal page scroll at any width from 320px up
- [ ] Every media slot has a reserved aspect ratio
- [ ] Hero is static; LCP is an image
- [ ] 3D below the fold, intersection-gated, poster-first
- [ ] Full-fidelity experience without hover
- [ ] Full-fidelity experience with JavaScript disabled (minus 3D)
- [ ] Tested at Tier C — the site must still sell
- [ ] Tested on a real mid-range Android over throttled 4G, not an emulator

The last item is the one that gets skipped and the one that matters most. **Tier C is not a degraded experience to be tolerated — for a meaningful share of this audience, it is the site.**
