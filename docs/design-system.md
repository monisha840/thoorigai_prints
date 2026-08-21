# Thoorigai Prints — Design System

**Version** 1.0 · **Prepared** 21 August 2026 · **Owner** Brand & Design
**Companion documents:** [redesign-report.md](redesign-report.md) · [ia/01-sitemap.md](ia/01-sitemap.md) · [content-audit.md](content-audit.md) · [image-inventory.md](image-inventory.md)

A design system for a printing house. Every decision here answers to one question: does this make the physical object — the sheet, the spine, the flute, the foil — easier to judge through a screen?

---

## Contents

1. [Design principles](#1-design-principles)
2. [Color system](#2-color-system)
3. [Typography system](#3-typography-system)
4. [Spacing scale](#4-spacing-scale)
5. [Border radius scale](#5-border-radius-scale)
6. [Shadows and elevation](#6-shadows-and-elevation)
7. [Grid system](#7-grid-system)
8. [Desktop design guidelines](#8-desktop-design-guidelines)
9. [Mobile design guidelines](#9-mobile-design-guidelines)
10. [Button system](#10-button-system)
11. [Card system](#11-card-system)
12. [Form system](#12-form-system)
13. [Dark section guidelines](#13-dark-section-guidelines)
14. [Motion](#14-motion)
15. [Iconography and imagery](#15-iconography-and-imagery)
16. [Accessibility contract](#16-accessibility-contract)
17. [Token export](#17-token-export)
18. [Appendix — ink, substrate and finish](#18-appendix--ink-substrate-and-finish)

---

## 1. Design principles

Five rules. When two decisions look equally good, the one that better satisfies the earlier principle wins.

### 1.1 Paper first

The page is a sheet, not a dashboard. Wide margins, one idea per horizontal band, generous air between bands. If a section needs a scrollbar inside it, it is two sections. The most premium thing on this site will be the space nothing is in.

### 1.2 Ink is the loudest thing on the page

Colour is spent, not decorated with. Deep ink `#262236` carries almost all type. Bronze `#C18546` is a **foil, not a colour** — it appears once, maybe twice, in any single viewport, on the thing you most want clicked. A page with bronze in five places has none.

### 1.3 Set it, don't style it

Hierarchy comes from size, weight and space. Not from gradients, glass, glow, rounded pills or decorative borders. A Bodoni headline at 72px against a hairline rule is the entire visual language. This is why the radius scale is nearly zero and the shadow scale is nearly invisible.

### 1.4 Show the object

The product is a physical thing with thickness, texture and a spine. Photography, material swatches and the 3D viewers are the content; the interface is the frame around them. UI chrome recedes — hairlines over shadows, flat over floating, `border-radius: 0` on every image so nothing crops the object.

### 1.5 Fast is part of premium

A meaningful share of the audience is on a mid-range Android over mobile data in Chennai. A site that takes twelve seconds to load is not a luxury site, it is a slow site with serifs. Every token here carries a performance consequence: two font families, no icon font, no shadow animation on scroll, a static fallback behind every 3D scene.

---

## 2. Color system

### 2.1 Brand foundation

Four colours, each with a job. They are not interchangeable.

| Role | Hex | RGB | HSL | The job |
|---|---|---|---|---|
| **Primary — Ink** | `#262236` | 38, 34, 54 | 252°, 23%, 17% | All body and heading type. Dark section grounds. Primary button fill. The default. |
| **Secondary — Indigo** | `#344F7C` | 52, 79, 124 | 218°, 41%, 35% | Interactive states, links, focus rings, informational cues. Never a large fill. |
| **Background — Paper** | `#F6F6F3` | 246, 246, 243 | 60°, 14%, 96% | The ground for the entire light experience. Warm, not white — it should read as uncoated stock. |
| **Accent — Bronze** | `#C18546` | 193, 133, 70 | 31°, 50%, 52% | Foil. The single highest-intent action, active states, rules under eyebrows, numerals in stat blocks. |

> **The Ink is purple, and that matters.** `#262236` is a 252° violet-black, not a neutral. Every grey, shadow and overlay in this system is tinted toward it. Pure `#000000` and pure `#808080` are forbidden — they look dirty against warm paper.

### 2.2 Ink scale (primary)

Hue held at 252°, saturation 24%.

| Token | Hex | Use |
|---|---|---|
| `ink-50` | `#F3F2F7` | Tinted surface, hover wash on ghost buttons |
| `ink-100` | `#E8E6F0` | Selected rows, subtle fills |
| `ink-200` | `#D0CCE0` | Dividers on tinted surfaces |
| `ink-300` | `#ADA6C9` | Disabled type on light |
| `ink-400` | `#847AAE` | Decorative only |
| `ink-500` | `#60558B` | Decorative only |
| `ink-600` | `#4A426C` | Dark-section raised surface |
| `ink-700` | `#393252` | Dark-section raised surface, dark borders |
| **`ink-800`** | **`#262236`** | **Brand primary.** Body type, dark ground, primary fill |
| `ink-900` | `#1A1726` | Deeper dark ground, dark cards |
| `ink-950` | `#0F0E16` | Deepest ground — 3D canvases, footer, pressed states |

### 2.3 Indigo scale (secondary)

Hue 218°, saturation 42%.

| Token | Hex | Use |
|---|---|---|
| `indigo-50` | `#F1F4F9` | Info banner ground |
| `indigo-100` | `#E2E8F3` | Info banner border |
| `indigo-200` | `#C5D2E7` | Selected state on light |
| `indigo-300` | `#9AB0D6` | **Link and interactive colour on dark sections** |
| `indigo-400` | `#6082BE` | Decorative, chart series |
| `indigo-500` | `#4366A3` | Link hover on light |
| **`indigo-600`** | **`#344F7C`** | **Brand secondary.** Links, focus ring, info |
| `indigo-700` | `#283D62` | Link active |
| `indigo-800` | `#1F304C` | Dark info surface |
| `indigo-900` | `#162236` | Dark info surface |
| `indigo-950` | `#0D1421` | Reserved |

### 2.4 Bronze scale (accent)

Hue 31°, saturation 50%.

| Token | Hex | Use |
|---|---|---|
| `bronze-50` | `#FBF8F4` | Warm tinted section ground |
| `bronze-100` | `#F6EDE4` | Accent banner ground |
| `bronze-200` | `#EDDCC9` | Accent border on light |
| `bronze-300` | `#E0C3A3` | Decorative rule |
| `bronze-400` | `#D1A575` | **Accent type on dark sections** |
| **`bronze-500`** | **`#C18546`** | **Brand accent.** Accent button fill, rules, active indicators |
| `bronze-600` | `#A87238` | Accent button hover; large-text accent on light |
| `bronze-700` | `#865B2D` | **Accent type on light backgrounds** (body-size safe) |
| `bronze-800` | `#674622` | Pressed accent |
| `bronze-900` | `#493118` | Reserved |
| `bronze-950` | `#2A1D0E` | Reserved |

> **`bronze-500` is not a text colour on paper.** `#C18546` on `#F6F6F3` measures **2.89:1** — it fails AA for body text and the 3:1 floor for large text. For bronze type on a light ground use `bronze-700` `#865B2D` (**5.47:1**, AA at all sizes) or `bronze-600` `#A87238` (**3.78:1**, large text ≥24px and non-text UI only). `bronze-500` is for fills, rules and icons ≥24px — never for words on paper.

### 2.5 Paper scale (neutral)

Warm neutrals derived from the background. This is the only grey ramp; never introduce a cool grey.

| Token | Hex | Use |
|---|---|---|
| `paper-0` | `#FFFFFF` | Card and input surfaces — the sheet on the desk |
| `paper-50` | `#FBFBF9` | Alternating band, upload-zone ground |
| **`paper-100`** | **`#F6F6F3`** | **Brand background.** Page ground |
| `paper-200` | `#EEEEE9` | Tinted band, table zebra |
| `paper-300` | `#E2E2DB` | Hairline rules, card borders, table borders |
| `paper-400` | `#CFCFC6` | Heavier dividers, disabled surfaces; **secondary type on dark** |
| `paper-500` | `#ADADA2` | Decorative; **muted type on dark** |
| `paper-600` | `#86867B` | **Form control borders** (3.40:1), placeholder text |
| `paper-700` | `#62625A` | **Secondary body type on light** (5.68:1) |
| `paper-800` | `#45453F` | Reserved |
| `paper-900` | `#2B2B27` | Reserved |
| `paper-950` | `#1A1A17` | Reserved |

### 2.6 Semantic colors

Deliberately desaturated so they never out-shout the brand.

| Role | Light hex | On-paper contrast | Ground | Border | On-dark hex |
|---|---|---|---|---|---|
| **Success** | `#2F6B4F` | 5.81:1 ✓ | `#EDF4F0` | `#C9DED4` | `#6FBF98` |
| **Warning** | `#8A5F0F` | 5.21:1 ✓ | `#F8F0DE` | `#E7D5AC` | `#E0B45C` |
| **Error** | `#A6323C` | 6.17:1 ✓ | `#F9EDEE` | `#E9C9CC` | `#E28B92` |
| **Info** | `#344F7C` | 7.59:1 ✓ | `#F1F4F9` | `#C5D2E7` | `#9AB0D6` |

> **Warning sits close to Bronze.** Ochre `#8A5F0F` and bronze `#C18546` are neighbours on the wheel. Because of that, **every warning carries its icon and a 2px left rule** — colour alone is never the signal. That is also the correct accessibility behaviour regardless.

### 2.7 Semantic aliases

Build UI against these, not against raw scale tokens. Swapping the light/dark map is then a one-line change.

```
--surface-page          paper-100   #F6F6F3
--surface-raised        paper-0     #FFFFFF
--surface-sunken        paper-200   #EEEEE9
--surface-tinted        bronze-50   #FBF8F4
--surface-inverse       ink-800     #262236

--text-primary          ink-800     #262236    14.21:1 on paper
--text-secondary        paper-700   #62625A     5.68:1 on paper
--text-muted            paper-600   #86867B     3.40:1 — non-text and placeholder only
--text-accent           bronze-700  #865B2D     5.47:1 on paper
--text-link             indigo-600  #344F7C     7.59:1 on paper
--text-inverse          paper-100   #F6F6F3    14.21:1 on ink

--border-hairline       paper-300   #E2E2DB    decorative separators
--border-default        paper-400   #CFCFC6    non-essential boundaries
--border-control        paper-600   #86867B    inputs, checkboxes — meets 3:1
--border-strong         ink-800     #262236    outline buttons, emphasis
--border-accent         bronze-500  #C18546    active tab, selected swatch

--focus-ring            indigo-600  #344F7C
--focus-ring-inverse    bronze-500  #C18546
```

### 2.8 Verified contrast table

Measured, not estimated. Every pair a designer is likely to reach for.

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `#262236` Ink | `#F6F6F3` Paper | **14.21:1** | AAA — the default pairing |
| `#62625A` paper-700 | `#F6F6F3` | **5.68:1** | AA all sizes — secondary body |
| `#86867B` paper-600 | `#F6F6F3` | **3.40:1** | Non-text UI and placeholder only |
| `#344F7C` Indigo | `#F6F6F3` | **7.59:1** | AAA large / AA body — links |
| `#865B2D` bronze-700 | `#F6F6F3` | **5.47:1** | AA all sizes — accent type |
| `#A87238` bronze-600 | `#F6F6F3` | **3.78:1** | Large text ≥24px and UI borders |
| `#C18546` bronze-500 | `#F6F6F3` | **2.89:1** | **Fails. Fills and ≥24px icons only** |
| `#F6F6F3` Paper | `#262236` Ink | **14.21:1** | AAA — dark section body |
| `#F6F6F3` Paper | `#1A1726` ink-900 | **16.23:1** | AAA |
| `#CFCFC6` paper-400 | `#1A1726` | **11.21:1** | AAA — dark secondary |
| `#ADADA2` paper-500 | `#1A1726` | **7.77:1** | AA — dark muted |
| `#C18546` bronze-500 | `#262236` Ink | **4.92:1** | AA body — accent works on dark |
| `#C18546` bronze-500 | `#1A1726` | **5.62:1** | AA all sizes |
| `#D1A575` bronze-400 | `#262236` | **6.86:1** | AAA large — dark accent headings |
| `#0F0E16` ink-950 | `#C18546` bronze fill | **6.15:1** | AA — **accent button label** |
| `#0F0E16` ink-950 | `#A87238` bronze-600 | **4.70:1** | AA — accent button hover |
| `#FFFFFF` White | `#C18546` bronze fill | **3.13:1** | **Never white on bronze** |
| `#9AB0D6` indigo-300 | `#262236` Ink | **7.00:1** | AAA large — dark links |
| `#344F7C` Indigo | `#262236` Ink | **2.14:1** | **Never indigo type on dark** |

### 2.9 Colour rules

**Do**

- Use ink for ~90% of all type, on both light and dark grounds.
- Spend bronze once per viewport, on the highest-intent element.
- Tint every overlay, scrim, shadow and grey toward `#262236`.
- Put a 1px bronze rule under a section eyebrow. It is the cheapest premium signal in the system.

**Don't**

- Don't use bronze as a text colour on paper (2.89:1).
- Don't use white type on bronze (3.13:1).
- Don't use indigo `#344F7C` as type on dark grounds (2.14:1) — use `indigo-300`.
- Don't introduce a cool grey, a pure black, or a fifth hue. There are four colours.
- Don't gradient between brand colours. Ink-to-transparent scrims are the only permitted gradients.

---

## 3. Typography system

### 3.1 The pairing

**Display: Bodoni Moda.** Giambattista Bodoni was a printer, and the typeface that carries his name was cut for the press. For a Chennai printing house selling offset, letterpress-adjacent finishing and foil, a Didone display face is not a fashion borrow — it is the trade's own typography. Extreme thick/thin contrast, flat unbracketed serifs, high waistline. It looks expensive because it *is* the expensive one to print well.

**Text: Inter.** A neutral grotesque with exceptional screen legibility at small sizes, tabular figures, a variable axis, and glyph coverage that survives Indian address formats and rupee symbols. It does the work Bodoni cannot: 14px on a 5-inch Android screen.

**Tamil: Anek Tamil.** The brand's name is Tamil (தூரிகை — *brush*). Any Tamil setting on the site, in the wordmark lockup, or on printed collateral uses Anek Tamil, a variable family with widths that let Tamil headings optically match the Latin. Never render Tamil in a system fallback.

**Mono: JetBrains Mono.** Reserved for specifications — GSM, ply, flute type, trim sizes, job numbers, quantities. A print buyer reads specs as data; setting them monospaced with tabular alignment makes a spec table scannable and signals precision.

| Role | Family | Weights loaded | Where it appears |
|---|---|---|---|
| Display | **Bodoni Moda** (variable) | 400, 500 | Display XL → H2 only, ≥32px |
| Text / UI | **Inter** (variable) | 400, 500, 600 | H3 → Micro, all UI, all body |
| Tamil | **Anek Tamil** (variable) | 400, 600 | All Tamil strings, any size |
| Mono | **JetBrains Mono** | 400, 500 | Specs, quantities, job refs, tabular figures |

**Fallback stacks**

```css
--font-display: "Bodoni Moda", "Didot", "Bodoni MT", "Playfair Display", Georgia, serif;
--font-text:    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-tamil:   "Anek Tamil", "Noto Sans Tamil", "Latha", sans-serif;
--font-mono:    "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
```

**Licensed upgrade path.** If budget appears, the substitutions that preserve the system exactly: Bodoni Moda → **Canela Deck** or **GT Sectra Display**; Inter → **Söhne** or **ABC Diatype**. Metrics are close enough that the scale below does not change.

### 3.2 The Bodoni constraint

Bodoni's hairlines are genuinely thin. Below roughly 32px on a 1× display they break up, and on a low-DPI Windows monitor they can disappear entirely.

**Rules, not suggestions:**

- Bodoni is permitted at **32px and above only**. The single documented exception is the pull quote in the testimonial card ([§11.2](#112-card-types)) at 24px / weight 500 — approved because it is short, sits on a light ground, and is never reversed. No other exception exists.
- Use weight **400 for display, 500 for H1/H2**. Never 300 or lighter on screen.
- Never set Bodoni in all-caps below 40px — the caps hairlines are the first thing to vanish.
- Never set Bodoni reversed (light on dark) below 40px; reversed hairlines optically thin further. On dark sections, bump one weight step.
- Never set a paragraph in Bodoni. It is a display face here, full stop.

### 3.3 Type scale

Fluid between 375px and 1440px viewports. Desktop value is the ceiling, mobile the floor. Base 16px = 1rem.

| Token | Desktop | Mobile | Line height | Tracking | Weight | Family |
|---|---|---|---|---|---|---|
| `display-xl` | 88px | 40px | 0.92 | −0.03em | 400 | Bodoni |
| `display-lg` | 72px | 36px | 0.96 | −0.025em | 400 | Bodoni |
| `display-md` | 60px | 32px | 1.00 | −0.02em | 400 | Bodoni |
| `h1` | 48px | 30px | 1.08 | −0.02em | 500 | Bodoni |
| `h2` | 40px | 27px | 1.15 | −0.015em | 500 | Bodoni |
| `h3` | 32px | 24px | 1.20 | −0.012em | 600 | Inter |
| `h4` | 24px | 20px | 1.30 | −0.01em | 600 | Inter |
| `h5` | 20px | 18px | 1.40 | −0.005em | 600 | Inter |
| `h6` | 17px | 16px | 1.45 | 0 | 600 | Inter |
| `body-lg` | 18px | 17px | 1.70 | 0 | 400 | Inter |
| `body-md` | 16px | 16px | 1.70 | 0 | 400 | Inter |
| `body-sm` | 14px | 14px | 1.60 | 0 | 400 | Inter |
| `caption` | 13px | 13px | 1.50 | 0.005em | 400 | Inter |
| `overline` | 12px | 12px | 1.40 | **0.16em** | 600 | Inter, uppercase |
| `micro` | 11px | 11px | 1.45 | 0.02em | 500 | Inter |
| `spec` | 14px | 13px | 1.50 | 0 | 400 | Mono, `tnum` |
| `spec-lg` | 20px | 18px | 1.30 | −0.01em | 500 | Mono, `tnum` |

**Fluid implementation**

```css
--text-display-xl: clamp(2.5rem,  1.271rem + 5.246vw, 5.5rem);   /* 40 → 88 */
--text-display-lg: clamp(2.25rem, 1.329rem + 3.932vw, 4.5rem);   /* 36 → 72 */
--text-display-md: clamp(2rem,    1.283rem + 3.059vw, 3.75rem);  /* 32 → 60 */
--text-h1:         clamp(1.875rem,1.414rem + 1.967vw, 3rem);     /* 30 → 48 */
--text-h2:         clamp(1.6875rem,1.28rem + 1.738vw, 2.5rem);   /* 27 → 40 */
--text-h3:         clamp(1.5rem,  1.295rem + 0.874vw, 2rem);     /* 24 → 32 */
--text-h4:         clamp(1.25rem, 1.148rem + 0.437vw, 1.5rem);   /* 20 → 24 */
--text-h5:         clamp(1.125rem,1.074rem + 0.219vw, 1.25rem);  /* 18 → 20 */
--text-body-lg:    clamp(1.0625rem,1.037rem + 0.109vw, 1.125rem);/* 17 → 18 */
--text-body-md:    1rem;
--text-body-sm:    0.875rem;
--text-caption:    0.8125rem;
--text-overline:   0.75rem;
--text-micro:      0.6875rem;
```

### 3.4 The eyebrow

The system's signature typographic device, used above every section heading and on every card.

```
OVERLINE · 12px / 600 / 0.16em / uppercase / bronze-700 #865B2D
    ↓ 12px gap
Section heading in Bodoni
```

Optionally preceded by a 24px × 1px bronze `#C18546` rule with 12px trailing space, inline with the text. Two forms, one system: **rule + eyebrow** for major page sections, **eyebrow alone** inside cards. Never an eyebrow without a heading beneath it.

### 3.5 Measure and rhythm

| Context | Max measure | Notes |
|---|---|---|
| Body prose (`body-lg` 18px) | **68ch** | ~628px — six grid columns. The default. |
| Body prose (`body-md` 16px) | **72ch** | ~576px. Cards, sidebars. |
| Display headline | **20ch** | Force line breaks; never let a 72px headline run past two lines. |
| H1 / H2 | **28ch** | |
| Caption / spec | **48ch** | |

- **Vertical rhythm: 8px.** Every margin, gap and section pad resolves to a multiple of 8. The 4px steps in the spacing scale exist for icon nudges and optical alignment only.
- Paragraph spacing: `1em` bottom margin (≈`space-5`). No top margins on paragraphs.
- Heading spacing: `space-10` (40px) above, `space-4` (16px) below on desktop; `space-8` / `space-3` on mobile. Headings following an eyebrow get `space-3` (12px) above.
- `text-wrap: balance` on all headings; `text-wrap: pretty` on body. Both are progressive enhancements.
- Hyphenation off in English. On for Tamil, where long compounds otherwise blow out narrow columns.

### 3.6 OpenType and numerals

```css
/* Global */
font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
font-optical-sizing: auto;

/* Bodoni display — the reason to buy this face */
.display { font-variation-settings: "opsz" 96; font-feature-settings: "kern" 1, "liga" 1; }

/* Any table, spec list, price, quantity, phone number */
.tabular { font-variant-numeric: tabular-nums lining-nums; }

/* Stat block numerals — Bodoni figures are the strongest asset in the family */
.stat-figure { font-family: var(--font-display); font-variant-numeric: lining-nums; }
```

Phone numbers, GST numbers, quantities, GSM values and prices are **always** tabular. A price list where the digits do not align is the fastest way to look like an amateur printer.

### 3.7 Font loading budget

Total webfont payload target: **≤ 180 KB**, all `woff2`, all subset.

| Family | Subset | Axes shipped | Budget |
|---|---|---|---|
| Inter var | `latin`, `latin-ext` | wght 400–600 | ~48 KB |
| Bodoni Moda var | `latin` only | wght 400–500, opsz | ~42 KB |
| Anek Tamil var | `tamil`, `latin` | wght 400–600 | ~62 KB |
| JetBrains Mono | `latin`, digits | 400, 500 | ~24 KB |

- `font-display: swap` on Inter and Anek Tamil; `optional` on Bodoni Moda and JetBrains Mono so a slow connection never blocks the fold on a decorative face.
- `<link rel="preload">` Inter and Bodoni Moda only.
- Self-host. No Google Fonts CDN — it is an extra DNS lookup and TLS handshake on the critical path for a user on 4G in Royapettah.
- Ship `size-adjust` / `ascent-override` metric-matched fallbacks for Inter and Bodoni to hold CLS at zero.
- Load Anek Tamil only on routes that render Tamil.

---

## 4. Spacing scale

### 4.1 The scale

4px base unit, 8px rhythm. Named by step, not by t-shirt size, so the scale extends without renaming.

| Token | px | rem | Primary use |
|---|---|---|---|
| `space-0` | 0 | 0 | Reset |
| `space-px` | 1 | — | Hairlines, borders |
| `space-0.5` | 2 | 0.125 | Optical nudges only |
| `space-1` | 4 | 0.25 | Icon-to-label inside a chip |
| `space-2` | 8 | 0.5 | Icon-to-label, tight inline gaps |
| `space-3` | 12 | 0.75 | Label-to-input, eyebrow-to-heading |
| `space-4` | 16 | 1 | Card padding (mobile), heading-to-body |
| `space-5` | 20 | 1.25 | Mobile page margin |
| `space-6` | 24 | 1.5 | **Card padding (desktop), grid gutter** |
| `space-7` | 28 | 1.75 | Rare, optical |
| `space-8` | 32 | 2 | Card padding (feature), between form groups |
| `space-10` | 40 | 2.5 | Heading top margin, between card rows |
| `space-12` | 48 | 3 | Sub-section separation |
| `space-14` | 56 | 3.5 | Mobile section padding (sm) |
| `space-16` | 64 | 4 | Between major content blocks |
| `space-18` | 72 | 4.5 | Mobile section padding (md) |
| `space-20` | 80 | 5 | **Desktop page margin**, section padding (sm) |
| `space-24` | 96 | 6 | Mobile section padding (lg) |
| `space-30` | 120 | 7.5 | **Desktop section padding (md) — the default band** |
| `space-40` | 160 | 10 | Desktop section padding (lg) |
| `space-50` | 200 | 12.5 | Desktop hero padding |
| `space-60` | 240 | 15 | Editorial chapter break |

### 4.2 Section rhythm

Vertical padding on a full-width band. This single table controls the pace of the whole site.

| Band type | Desktop ≥1024 | Tablet 768–1023 | Mobile <768 |
|---|---|---|---|
| **Hero** | 200 / 160 | 140 / 112 | 96 / 80 |
| **Section — large** | 160 | 120 | 96 |
| **Section — default** | **120** | 88 | 72 |
| **Section — compact** | 80 | 64 | 56 |
| **CTA band** | 120 | 96 | 72 |
| **Footer** | 96 top / 48 bottom | 80 / 40 | 64 / 32 |

Dark bands get **+16px** top and bottom over their light equivalents. Dark reads optically tighter; the extra air corrects it.

### 4.3 Density rules

- **Never invent a value.** If 44px feels right, the answer is 40 or 48.
- Related elements sit closer than unrelated ones — proximity carries grouping, not borders. A label at `space-3` from its input and `space-8` from the next group needs no dividing line.
- Component internal padding never exceeds the gap between components. A card with 32px padding sits in a 40px-gap grid, not a 24px one.
- Horizontal and vertical padding are rarely equal. Cards run `space-6` horizontal / `space-6`–`space-8` vertical; buttons run wide and short.
- **Spacing is the luxury.** When a layout looks cheap, the fix is nearly always one step up the scale, not a new colour or a shadow.

---

## 5. Border radius scale

### 5.1 The scale

This is an editorial system. Radius is close to zero and stays there. Rounded corners read as software; sharp corners read as print.

| Token | px | Applied to |
|---|---|---|
| `radius-none` | **0** | **All images, all media, all full-bleed panels, dark sections, tables, material swatches, 3D canvases** |
| `radius-xs` | **2** | **Buttons, inputs, selects, checkboxes, chips, tags, badges** |
| `radius-sm` | **4** | **Cards, popovers, dropdowns, tooltips, image captions** |
| `radius-md` | 8 | Modals, drawers, mobile bottom sheets |
| `radius-lg` | 12 | Reserved — full-screen mobile sheets only |
| `radius-xl` | 16 | Do not use without design approval |
| `radius-full` | 9999 | Radio buttons, avatars, filter pills, live-status dots, icon-only circular buttons |

### 5.2 Rules

- **Media is always 0.** A rounded corner clips the object. Product photography, material swatches, press-floor imagery and 3D canvases are square-cornered without exception.
- **Two radii per component, maximum.** A card at `radius-sm` with a `radius-xs` button inside is correct. Add a third and it stops being a system.
- **Nested radius formula:** `inner = outer − padding`, floored at 0. A 4px card with 24px padding gives every child a 0px radius — which is exactly right here.
- **Pills are for filters only.** `radius-full` on a rectangular element is reserved for the catalogue filter chips and status dots. Never on a CTA. A pill-shaped primary button would undo the entire type system above it.
- Radius does not scale with breakpoint. A 2px button is 2px on every device.

---

## 6. Shadows and elevation

### 6.1 Philosophy

**Hairline first, shadow second.** In this system a border does the job a shadow usually does. Cards sit flat on the paper with a 1px `#E2E2DB` rule and only lift on hover. Static pages should show almost no shadow at all.

Every shadow is tinted with the ink hue `rgba(38, 34, 54, α)` — never black. Every shadow above `sm` is layered in two stops: a tight contact shadow and a wide ambient one. A single-stop shadow always looks synthetic.

### 6.2 The scale

| Token | Value | Applied to |
|---|---|---|
| `shadow-none` | `none` | **The default for everything.** |
| `shadow-xs` | `0 1px 2px rgba(38,34,54,0.04)` | Sticky header once scrolled |
| `shadow-sm` | `0 1px 2px rgba(38,34,54,0.04), 0 2px 6px rgba(38,34,54,0.04)` | Resting elevated card (use sparingly) |
| `shadow-md` | `0 2px 4px rgba(38,34,54,0.04), 0 6px 16px rgba(38,34,54,0.06)` | **Card hover**, dropdown, tooltip |
| `shadow-lg` | `0 4px 8px rgba(38,34,54,0.05), 0 12px 32px rgba(38,34,54,0.08)` | Popover, filter panel, feature card hover |
| `shadow-xl` | `0 8px 16px rgba(38,34,54,0.06), 0 24px 56px rgba(38,34,54,0.10)` | Modal, quote drawer, catalogue detail overlay |
| `shadow-2xl` | `0 16px 32px rgba(38,34,54,0.08), 0 40px 96px rgba(38,34,54,0.14)` | Full-screen lightbox surface |
| `shadow-hairline` | `inset 0 0 0 1px rgba(38,34,54,0.08)` | Border substitute where a real border would shift layout |
| `shadow-sheet` | `0 1px 0 rgba(38,34,54,0.06), 0 2px 0 #FFFFFF, 0 3px 0 rgba(38,34,54,0.05), 0 4px 0 #FFFFFF, 0 6px 16px rgba(38,34,54,0.10)` | **Stacked-paper effect** — the one decorative shadow, for multi-item catalogue tiles and quantity/run-length cards |

### 6.3 Focus ring

Not part of the elevation scale. Never removed, never a plain `outline: none`.

```css
--focus-ring:         0 0 0 2px #F6F6F3, 0 0 0 4px #344F7C;   /* light grounds */
--focus-ring-inverse: 0 0 0 2px #262236, 0 0 0 4px #C18546;   /* dark grounds */
--focus-ring-field:   0 0 0 3px rgba(52,79,124,0.16);          /* inputs, paired with border change */
--focus-ring-error:   0 0 0 3px rgba(166,50,60,0.14);
```

The double ring — 2px of ground colour, then 2px of indigo — keeps the ring legible over both a card and the page behind it. Use `:focus-visible`, not `:focus`, so mouse users never see it.

### 6.4 Overlays and scrims

```css
--scrim-modal:  rgba(15,14,22,0.56);                                        /* ink-950 @ 56% */
--scrim-drawer: rgba(15,14,22,0.44);
--scrim-image:  linear-gradient(180deg, rgba(15,14,22,0) 0%,
                                        rgba(15,14,22,0.35) 55%,
                                        rgba(15,14,22,0.72) 100%);          /* text over photography */
--scrim-hero:   linear-gradient(90deg, rgba(15,14,22,0.78) 0%,
                                        rgba(15,14,22,0.40) 45%,
                                        rgba(15,14,22,0)   80%);            /* left-aligned hero copy */
```

Modal scrims get `backdrop-filter: blur(2px)` on capable browsers only, with the flat scrim as the fallback. Never blur a scrim over a 3D canvas — the compositing cost on a mid-range Android is not worth it.

### 6.5 z-index scale

| Token | Value | Layer |
|---|---|---|
| `z-base` | 0 | Page content |
| `z-raised` | 10 | Hover-lifted cards, sticky column |
| `z-sticky` | 100 | Sticky section nav, sticky table header |
| `z-header` | 200 | Site header |
| `z-mobile-cta` | 300 | Mobile sticky quote bar |
| `z-dropdown` | 400 | Menus, selects, filter panels |
| `z-scrim` | 500 | Modal and drawer backdrops |
| `z-modal` | 600 | Modals, drawers, catalogue detail overlay |
| `z-toast` | 700 | Toasts |
| `z-tooltip` | 800 | Tooltips |
| `z-skip` | 900 | Skip-to-content link |

### 6.6 Dark sections have no shadows

Shadows are invisible on dark grounds and betray a system that has not been thought through. On dark, elevation is expressed as **lightness**: `ink-950` → `ink-900` → `ink-800` → `ink-700`, plus a 1px `rgba(246,246,243,0.10)` hairline and, on raised surfaces, a `inset 0 1px 0 rgba(246,246,243,0.06)` top highlight. See [§13](#13-dark-section-guidelines).

---

## 7. Grid system

### 7.1 Breakpoints

| Token | Min width | Columns | Margin | Gutter | Represents |
|---|---|---|---|---|---|
| `xs` | 320 | 4 | 16 | 16 | Small Android |
| `sm` | 480 | 4 | 20 | 16 | Standard phone |
| `md` | 768 | 8 | 32 | 20 | Tablet portrait |
| `lg` | 1024 | 12 | 48 | 24 | Tablet landscape, small laptop |
| `xl` | 1280 | 12 | 80 | 24 | **Primary design target** |
| `2xl` | 1536 | 12 | auto | 32 | Large desktop — container caps, margins grow |

Design at **1440px** and **390px**. Everything else is interpolation.

### 7.2 Containers

| Token | Max width | Use |
|---|---|---|
| `container-prose` | **628px** | Long-form article body — 68ch at 18px |
| `container-narrow` | 768px | Forms, legal pages, single-column content |
| `container-md` | 960px | Centred feature sections, testimonial bands |
| `container-lg` | 1120px | Standard section content |
| `container-xl` | **1280px** | **Default container.** Catalogue grids, headers, footers |
| `container-max` | 1440px | Editorial spreads, full-width galleries |
| `container-bleed` | 100vw | Hero media, dark bands, 3D canvases, press photography |

At 1280px with 12 columns and 24px gutters, one column is **84.67px** and a 6-column span is **628px** — which is exactly the prose measure. The grid and the type scale are the same system.

### 7.3 Named spans (12-column desktop)

| Name | Columns | Width @1280 | Use |
|---|---|---|---|
| `span-full` | 1 → 12 | 1280 | Section headers, catalogue grids, footers |
| `span-wide` | 2 → 11 | 1109 | Feature imagery held off the edge |
| `span-text` | **3 → 8** | **628** | **Article body.** Leaves 9→12 as a margin rail |
| `span-rail` | 9 → 12 | 366 | Sidenotes, spec tables, sticky quote card, TOC |
| `span-half` | 1 → 6 / 7 → 12 | 628 | Split media + copy sections |
| `span-third` | 4 cols | 407 | Three-up capability cards |
| `span-quarter` | 3 cols | 296 | Four-up catalogue tiles, commitment blocks |
| `span-offset` | 2 → 9 | 872 | Centred-but-asymmetric editorial headline |

The **asymmetric text + rail split (3→8 / 9→12)** is the system's editorial signature. Capability pages run body copy in `span-text` with the spec table and the "Get a quote for this" card living in `span-rail`, sticky from the top of the article to its end.

### 7.4 Component grids

| Grid | Desktop ≥1280 | 1024–1279 | 768–1023 | <768 |
|---|---|---|---|---|
| Catalogue tiles | 4-up, 24 gap | 4-up, 24 | 3-up, 20 | **2-up, 16** |
| Capability cards | 3-up, 32 | 3-up, 24 | 2-up, 20 | 1-up, 16 |
| Commitment / stats | 4-up, 40 | 4-up, 32 | 2-up, 32 | 2-up, 24 |
| Case study cards | 2-up, 40 | 2-up, 32 | 2-up, 24 | 1-up, 24 |
| Material swatches | 6-up, 16 | 5-up, 16 | 4-up, 12 | 3-up, 8 |
| Logo wall | 6-up, 48 | 5-up, 40 | 4-up, 32 | 3-up, 24 |
| Team / founder | 4-up, 32 | 3-up, 32 | 2-up, 24 | 1-up, 24 |

**Catalogue tiles stay 2-up on mobile.** With 43 items, a 1-up mobile grid produces an unscrollable page and hides the breadth of the catalogue, which is one of the business's genuine strengths.

### 7.5 Baseline and alignment

- **8px vertical grid.** All section padding, card padding, and stack gaps resolve to multiples of 8.
- **Optical alignment beats mathematical alignment.** Bodoni's left sidebearing on a capital `T` is visibly larger than on an `H`; pull display headlines left by 1–3px with a negative `margin-left` so the stem, not the bounding box, aligns to the column.
- Hanging punctuation on pull quotes: `hanging-punctuation: first last;` where supported, a −0.4em `text-indent` otherwise.
- Full-bleed inside a constrained container:

```css
.bleed {
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  max-width: 100vw;
}
```

---

## 8. Desktop design guidelines

Applies at **≥1024px**, tuned for 1440px.

### 8.1 Page frame

- Container `container-xl` 1280px, page margins `space-20` 80px, growing to `auto` beyond 1536px so the content block stays centred and never exceeds 1280px.
- **Header:** 88px tall, `#F6F6F3` ground, no border at rest. On scroll past 80px it compresses to 68px, gains `shadow-xs` and a 1px `#E2E2DB` bottom rule, and switches to `paper-0` `#FFFFFF`. 220ms transition. It does not hide on scroll-down — a print buyer comparing capability pages needs the nav present.
- **Header layout:** logo left (SVG, 32px cap height, minimum clear space equal to the height of the mark on all sides), primary nav centre (Printing / Packaging / Binding / Materials / Work / About), a text-link phone number and one bronze **Get a Quote** button right.
- **Mega menu** for the three pillar hubs: full-container width, `paper-0` ground, `shadow-lg`, opens on hover after a 120ms intent delay and on click/Enter for keyboard. Three columns of capability links plus one 4:5 image tile of the pillar's strongest product shot. Closes on `Escape` and on focus leaving the panel.
- **Skip-to-content** link, visually hidden until focused, first in tab order.

### 8.2 Section anatomy

Every desktop band follows the same skeleton:

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

Alternate `#F6F6F3` and `#FFFFFF` grounds between adjacent bands so section boundaries read without rules. Never place two `#FFFFFF` bands side by side.

### 8.3 Layout patterns

| Pattern | Structure | Where |
|---|---|---|
| **Editorial split** | 6 cols media / 6 cols copy, copy vertically centred, media full-bleed to one page edge | Pillar hub intros, About |
| **Text + rail** | `span-text` 3→8 body, `span-rail` 9→12 sticky spec card | Capability pages |
| **Stepped grid** | 4-up tiles with every second column offset 40px downward | Catalogue index, Work index |
| **Full-bleed dark** | 100vw ink band, content in `container-lg` | Process sequence, 3D scenes, testimonials |
| **Spec table** | `span-full`, mono figures, 1px `#E2E2DB` row rules, no vertical rules, 56px row height | Machine list, paper stocks, size charts |
| **Comparison** | 4 equal columns, sticky header row, bronze rule under the recommended column | Binding comparison, offset vs digital |

### 8.4 Interaction

- Every interactive element has a **visible hover** and a **distinct focus-visible** state. Hover is never the only affordance.
- Standard hover: 180ms `cubic-bezier(0.22, 1, 0.36, 1)`. Never animate more than transform, opacity, colour, border-colour and box-shadow.
- **Image hover:** `scale(1.03)` inside an `overflow: hidden` frame, 400ms. The frame does not move; only the image inside it does.
- **Link hover:** underline thickens 1px → 2px, `text-underline-offset: 4px`. Colour does not change. Underline offset never collapses onto the baseline.
- **Cursor:** default arrow throughout. `pointer` on links and buttons only. `grab`/`grabbing` on 3D viewers and swatch carousels. No custom cursors.
- Hover reveals are permitted for supporting detail only — never for the product name, price or primary link.

### 8.5 Desktop-specific rules

- Maximum **three** distinct type sizes visible in any one viewport, plus the eyebrow.
- One primary CTA per viewport. If a second is genuinely needed it takes the outline variant.
- Photography is full-bleed to at least one edge in every second section. A page where every image is boxed inside the container reads as a template.
- Never centre body copy longer than three lines. Centre the heading, left-align the paragraph.
- Tables never scroll horizontally on desktop. If they do not fit at 1280px, the table has too many columns and needs a rail-side spec card instead.
- Test at **125% and 150% browser zoom** — a large share of desktop print buyers run scaled displays. Nothing may clip or overlap.

---

## 9. Mobile design guidelines

Applies **<768px**, tuned for 390px. Mobile is the majority of this audience and is designed first, not adapted.

### 9.1 Frame

- Page margin `space-5` **20px** (16px below 360px). Gutter 16px.
- **Header 60px:** logo left, a 44px icon-only tel button and a 44px menu button right. No search on mobile.
- **Menu:** full-screen overlay, `#262236` ground, 32px type, pillar accordions with the four commitments and contact details at the base. Opens in 240ms, traps focus, closes on `Escape` and on route change.
- **Sticky quote bar** at the bottom, 64px + safe-area inset, appearing after 40% scroll depth: WhatsApp icon button (56px) + full-width bronze **Get a Quote** button. This is the single highest-leverage mobile component on the site — the audit found the highest-intent page currently has no form at all.
- Respect safe areas: `padding-bottom: max(16px, env(safe-area-inset-bottom))`.

### 9.2 Type on mobile

- Display sizes drop to the mobile column of [§3.3](#33-type-scale). `display-xl` at 40px is the ceiling; nothing on a phone needs to be larger.
- **Bodoni is still ≥32px only.** In practice that means `h2` and above. `h3` and below are Inter on mobile.
- Body stays **16px minimum**. Never 14px for reading copy — and never below 16px on any input, which triggers iOS auto-zoom.
- Line height loosens slightly (1.7) and tracking returns to 0. Tight display tracking that works at 88px looks broken at 40px.
- Headlines get `text-wrap: balance` and an explicit `max-width: 20ch` so a 40px headline never produces a one-word orphan line.

### 9.3 Touch

- **Minimum target 44 × 44px; preferred 48 × 48px.** Applies to the tap area, not the visual — a 24px icon inside a 48px button is correct.
- **Minimum 8px between adjacent targets.** Catalogue tiles get 16px.
- Primary actions sit in the lower two-thirds of the screen where the thumb reaches. Destructive or secondary actions go top-right.
- No hover-dependent content. Anything on desktop hover is always visible or one tap away on mobile.
- Swipe is an enhancement, never the only route: every carousel keeps visible prev/next buttons and pagination dots.
- Tap feedback within 100ms: `scale(0.98)` plus a background shift on `:active`.

### 9.4 Mobile layout

- **Single column by default**, with two documented exceptions: catalogue tiles (2-up) and material swatches (3-up).
- Media is full-bleed edge-to-edge, breaking the 20px margin. Copy keeps the margin. This contrast is what makes a phone layout feel designed rather than squeezed.
- Section padding from [§4.2](#42-section-rhythm): 72px default, 96px for large bands.
- Reorder for mobile: heading → image → body → CTA. Never make a user scroll past a 4:5 hero image to reach the first sentence.
- Tables become stacked definition lists (label above value, mono figures) or scroll horizontally inside their own container with a visible right-edge fade and a `role="region"` with `tabindex="0"` and an accessible name.
- Sticky elements maximum **two** at once (header + quote bar). A third makes a 390px viewport unusable.

### 9.5 Mobile performance budget

Non-negotiable, from principle [§1.5](#15-fast-is-part-of-premium).

| Metric | Budget |
|---|---|
| LCP on 4G, mid-range Android | **< 2.5s** |
| CLS | **< 0.05** |
| INP | **< 200ms** |
| Initial JS | **< 120 KB** compressed |
| Webfonts | **≤ 180 KB** total |
| Hero image | ≤ 120 KB, AVIF with WebP fallback |
| Per-route images above the fold | ≤ 300 KB |

- Every image ships `width`, `height`, `srcset`, `sizes` and `loading="lazy"` below the fold. `fetchpriority="high"` on the LCP image only.
- **3D scenes never load on mobile by default.** Ship the static render; load the interactive viewer on explicit tap, behind a "View in 3D" affordance, and only on `navigator.connection.effectiveType === '4g'` where the API is available.
- Honour `prefers-reduced-motion: reduce` — no scroll-linked sequences, no parallax, no autoplay video. Reduce transitions to opacity only at 120ms.
- Honour `prefers-reduced-data` where supported: static renders, no video, no decorative imagery.

---

## 10. Button system

### 10.1 Anatomy and shared specs

```
┌──────────────────────────────────────┐
│  [icon 20]  8px  Label  8px  [icon]  │   height per size
└──────────────────────────────────────┘
   ↑ padding-inline per size
```

| Property | Value |
|---|---|
| Font | Inter, **500** (600 for `lg`/`xl`) |
| Case | **Sentence case** |
| Radius | `radius-xs` **2px** |
| Border width | 1px (all variants, transparent where not visible — so no layout shift between variants) |
| Icon size | 16px (`xs`/`sm`), 20px (`md`/`lg`), 24px (`xl`) |
| Icon gap | `space-2` 8px |
| Transition | 180ms `cubic-bezier(0.22, 1, 0.36, 1)` on background, border, colour, transform, box-shadow |
| Min touch target | 44px — smaller sizes get a transparent `::after` expanding the hit area |

> **Why sentence case, not uppercase.** Luxury fashion sets buttons in tracked caps; that pattern breaks here for three reasons. Tamil has no case, so uppercase cannot survive localisation. Tracked caps at 12px are measurably slower to read on a mid-range phone. And this system already spends its uppercase budget on the eyebrow — using it twice halves its value. The premium signal comes from height, padding and restraint. An uppercase variant (`0.08em` tracking, 12px, 600) is approved for the footer CTA band only.

### 10.2 Sizes

| Size | Height | Padding-x | Font | Icon | Use |
|---|---|---|---|---|---|
| `xs` | 32 | 12 | 13 / 500 | 16 | Table row actions, chip actions |
| `sm` | 40 | 18 | 14 / 500 | 16 | Card actions, filter bar, inline |
| **`md`** | **48** | **24** | **15 / 500** | **20** | **Default. Everything unless specified** |
| `lg` | 56 | 32 | 16 / 600 | 20 | Section CTAs, form submits |
| `xl` | 64 | 40 | 17 / 600 | 24 | Hero CTA only, one per page |

Icon-only buttons are square at the same heights: 32 / 40 / 48 / 56 / 64, `radius-xs`, except the WhatsApp and scroll-to-top buttons which use `radius-full`.

### 10.3 Variants — light grounds

**Primary — Ink.** The default action.

| State | Background | Text | Border | Extra |
|---|---|---|---|---|
| Default | `#262236` | `#F6F6F3` | transparent | — |
| Hover | `#1A1726` | `#F6F6F3` | transparent | `translateY(-1px)`, `shadow-md` |
| Active | `#0F0E16` | `#F6F6F3` | transparent | `translateY(0)`, `shadow-none` |
| Focus | `#262236` | `#F6F6F3` | transparent | `--focus-ring` |
| Disabled | `#D0CCE0` | `#86867B` | transparent | `cursor: not-allowed` |

**Accent — Bronze.** The one high-intent action: *Get a Quote*, *Request a Sample*, *Send Enquiry*. **One per page.**

| State | Background | Text | Border |
|---|---|---|---|
| Default | `#C18546` | **`#0F0E16`** (6.15:1) | transparent |
| Hover | `#A87238` | `#0F0E16` (4.70:1) | transparent — plus `translateY(-1px)`, `shadow-md` |
| Active | `#674622` | `#F6F6F3` | transparent |
| Focus | `#C18546` | `#0F0E16` | `--focus-ring` |
| Disabled | `#EDDCC9` | `#86867B` | transparent |

> Never white text on bronze — 3.13:1, a fail. The label is `ink-950`.

**Secondary — Outline.**

| State | Background | Text | Border |
|---|---|---|---|
| Default | transparent | `#262236` | `1px #262236` |
| Hover | `rgba(38,34,54,0.05)` | `#262236` | `1px #262236` |
| Active | `rgba(38,34,54,0.10)` | `#262236` | `1px #0F0E16` |
| Focus | transparent | `#262236` | `1px #262236` + `--focus-ring` |
| Disabled | transparent | `#ADA6C9` | `1px #D0CCE0` |

**Tertiary — Ghost.** Toolbars, card footers, cancel actions.

| State | Background | Text |
|---|---|---|
| Default | transparent | `#262236` |
| Hover | `#F3F2F7` | `#262236` |
| Active | `#E8E6F0` | `#262236` |
| Disabled | transparent | `#ADA6C9` |

**Link button.** Inline, reads as prose.

- Text `#344F7C`, `text-decoration: underline`, `text-underline-offset: 4px`, `text-decoration-thickness: 1px`.
- Hover: `#4366A3`, thickness 2px. Active: `#283D62`. Focus: `--focus-ring`, radius 2px.
- **Arrow-link variant** — the system's most-used navigational element: label + a 16px right arrow at `space-2`. On hover the arrow translates 4px right and a 1px bronze underline draws left-to-right in 220ms. Under `prefers-reduced-motion` the underline appears without animating.

**Destructive.** Background `#A6323C`, text `#F6F6F3`, hover `#8A2A32`. Remove-file and delete-enquiry only.

### 10.4 Variants — dark grounds

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| **Primary on dark** | `#F6F6F3` | `#262236` | transparent | bg `#FFFFFF`, `translateY(-1px)` |
| **Accent on dark** | `#C18546` | `#0F0E16` | transparent | bg `#D1A575` |
| **Outline on dark** | transparent | `#F6F6F3` | `1px rgba(246,246,243,0.40)` | bg `rgba(246,246,243,0.08)`, border `rgba(246,246,243,0.72)` |
| **Ghost on dark** | transparent | `#F6F6F3` | transparent | bg `rgba(246,246,243,0.08)` |
| **Link on dark** | — | `#9AB0D6` (7.00:1) | — | `#C5D2E7` |

Focus on dark uses `--focus-ring-inverse` — 2px of ink, then 2px of bronze.

Border alpha on dark outline buttons is **0.40, not 0.24**. Measured against `ink-900`, a 0.24 border resolves to 2.14:1 and fails the 3:1 non-text requirement; 0.40 resolves to **3.60:1** and passes.

### 10.5 States and behaviour

- **Loading:** label stays in place at 40% opacity, a 16px 2px-stroke spinner replaces the leading icon, width is locked to prevent layout shift, `aria-busy="true"`, pointer events disabled. Never swap the label for the word "Loading".
- **Disabled:** never disable a submit button to communicate an invalid form — leave it enabled, submit, and move focus to the error summary. Disabled buttons give a screen-reader user no explanation. Where disabled is genuinely correct (a sold-out size), pair it with a tooltip or helper line.
- **Success:** for enquiry submits, the button transitions to a 16px check plus "Sent" for 2s before the form is replaced by the confirmation panel.
- Buttons never wrap to two lines. If the label needs two lines, the label is too long.
- Full-width (`width: 100%`) only on mobile and inside forms narrower than 400px.

### 10.6 Pairing and hierarchy

```
[ Primary/Accent ]   16px gap   [ Outline ]   24px gap   [ Link ]
```

- Maximum **one** accent button per page and **one** primary per section.
- Order on desktop: primary leftmost. On mobile, stack vertically with the primary on top, 12px gap, both full-width.
- Never place two filled buttons adjacent. The second becomes outline.
- Never place an accent button on a bronze-tinted ground (`bronze-50`/`100`) — it disappears. Use primary there.

---

## 11. Card system

### 11.1 Base card

Cards are **sheets on a desk**, not floating panels.

| Property | Desktop | Mobile |
|---|---|---|
| Background | `#FFFFFF` (`paper-0`) | `#FFFFFF` |
| Border | `1px #E2E2DB` | `1px #E2E2DB` |
| Radius | `radius-sm` **4px** | 4px |
| Padding | `space-6` **24px** | `space-4` 16px |
| Shadow at rest | **`shadow-none`** | none |
| Media | Flush to card edges, `radius-none`, padding starts below | same |
| Gap, media → content | `space-5` 20px | `space-4` 16px |
| Internal stack gap | `space-3` 12px | 12px |

**Hover (desktop only, pointer devices):**

```css
transform: translateY(-2px);
border-color: rgba(38,34,54,0.16);
box-shadow: var(--shadow-md);
transition: 240ms cubic-bezier(0.22,1,0.36,1);
/* the image inside scales to 1.03 over 400ms; the frame does not move */
```

Under `prefers-reduced-motion`, drop the transform and the image scale; keep the border and shadow change.

### 11.2 Card types

**1 · Catalogue tile** — the workhorse. 43 of these.

```
┌─────────────────────┐
│                     │
│    4:5 product      │  radius 0, object-fit cover
│      image          │  #F6F6F3 placeholder while loading
│                     │
├─────────────────────┤
│ CAPABILITY          │  overline 12/600/0.16em, bronze-700
│ Hard Case Binding   │  h5 20/600 Inter, ink
│ Rexin or PU leather │  body-sm 14/1.6, paper-700, 2 lines clamped
│ over 3mm greyboard. │
│ ─────────────────── │  1px #E2E2DB, 16px above
│ 80–1200 pp   MOQ 25 │  spec 13px mono, paper-700, space-between
└─────────────────────┘
```

Whole card is the link (stretched-link from the title anchor, so the accessible name is the product name). Grid: 4-up desktop, 2-up mobile.

**2 · Capability card** — the fifteen tier-2 pages.

3:2 media, overline, `h4` 24px title, two-line description, arrow-link footer. `space-8` 32px padding. 3-up desktop.

**3 · Case study card** — image-led, borderless.

3:2 image at `radius-none` with **no card border and no background**; the image *is* the card. Below it: overline (sector — *Pharma · 12,000 cartons*), `h3` headline in Bodoni at 32px, one-line result. Hover scales the image only. 2-up desktop, generous 40px gutter.

**4 · Commitment / stat card** — the four homepage pillars.

No media, no border, no background — separated by a 1px `#E2E2DB` vertical rule between columns instead. 24px bronze icon, then the figure in **Bodoni 48px** (`15+`, `43`, `2010`), then a 12px overline label, then one sentence at `body-sm`. This is where the Bodoni numerals earn their place.

**5 · Testimonial card** — once real testimonials exist.

Ground `#FBF8F4` (`bronze-50`), a **2px left rule in `#C18546`**, no other border, `radius-none`. Quote in Bodoni 24px at 1.5 (the one permitted Bodoni-below-32px exception — approved because it is short, high-contrast and never reversed). Attribution in `body-sm` 600 ink; company and sector in `caption` `paper-700`. 32px padding.

**6 · Spec card** — sticky in the rail on capability pages.

Ground `#F6F6F3` on white sections / `#FFFFFF` on paper sections, 1px `#E2E2DB`, 24px padding. `h6` title, then definition rows: label `caption` `paper-700` left, value `spec` mono ink right, 1px `#E2E2DB` between rows, 40px row height. Footer holds a full-width `md` accent button: *Get a quote for this*.

**7 · Material swatch card** — the materials showcase.

1:1, `radius-none`, full-bleed texture, **no padding at all**. A 40px label bar sits over the base of the image on a `rgba(15,14,22,0.72)` ground with `#F6F6F3` 13px type. Selected state: 2px `#C18546` inset ring. 6-up desktop, 3-up mobile.

**8 · Dark card** — inside dark sections.

Ground `#1A1726` on an `ink-950` band (or `#393252` on an `ink-800` band), border `1px rgba(246,246,243,0.10)`, `inset 0 1px 0 rgba(246,246,243,0.06)` top highlight, **no shadow**. Hover raises the ground one step and the border to `0.16`.

### 11.3 Rules

- **Border or shadow, never both at rest.** The system default is border-only.
- **Every card in a row is the same height.** Use CSS Grid with `align-items: stretch` and push the footer down with `margin-top: auto`. Ragged card bottoms are the single most common way a premium grid falls apart.
- **Clamp descriptions.** `-webkit-line-clamp: 2` on tiles, `3` on capability cards. Uneven copy lengths must not change layout.
- **One CTA per card**, and it is usually an arrow-link, not a button. A grid of twelve filled buttons is noise.
- **Image ratios are fixed per card type** and never mixed within a grid: 4:5 catalogue, 3:2 capability and case study, 1:1 swatch and team, 16:9 video.
- Always reserve the image box with `aspect-ratio` and a `#F6F6F3` placeholder so lazy-loaded media contributes zero CLS.
- Do not nest cards. A bordered box inside a bordered box means the layout needs sections, not cards.

---

## 12. Form system

The audit found the highest-intent page on the site is a dead end with no form. This is the most commercially important component in the system.

### 12.1 Field specification

| Property | `sm` | **`md` (default)** | `lg` |
|---|---|---|---|
| Height | 40 | **48** | 56 |
| Padding-x | 12 | **16** | 20 |
| Font size | 15 | **16** | 17 |
| Radius | 2 | **2** | 2 |

**Never below 16px font on any input** — iOS Safari zooms the viewport on focus at 15px and below, and the user loses their place in the form.

| Element | Spec |
|---|---|
| Background | `#FFFFFF` (`paper-0`) |
| Border | `1px #86867B` (`paper-600`) — **3.40:1 against paper, meets WCAG 1.4.11** |
| Text | `#262236`, Inter 400 |
| Placeholder | `#86867B` — hints only, **never a label substitute** |
| Label | `body-sm` 14 / **500** / `#262236`, above the field, `space-3` 12px gap |
| Help text | `caption` 13 / `#62625A`, below, `space-2` 8px gap |
| Field group gap | `space-6` 24px vertical |
| Column gap (2-up) | `space-5` 20px |
| Max form width | 560px standalone; 5–6 grid columns inside a split layout |

> **Border colour is `paper-600`, not `paper-400`.** `#CFCFC6` measures 1.45:1 against the page and fails the 3:1 requirement for the boundary of a user interface component. `#86867B` measures 3.40:1 and passes. This is why inputs look slightly heavier than the rest of the system — that is deliberate and non-negotiable.

### 12.2 States

| State | Border | Ring | Other |
|---|---|---|---|
| Default | `1px #86867B` | — | — |
| Hover | `1px #62625A` | — | — |
| **Focus** | `1px #344F7C` | `0 0 0 3px rgba(52,79,124,0.16)` | Label stays ink |
| Filled | `1px #86867B` | — | — |
| **Error** | `1px #A6323C` | `0 0 0 3px rgba(166,50,60,0.14)` | Message + 14px icon below |
| Success | `1px #2F6B4F` | — | 16px check inset right |
| Disabled | `1px #E2E2DB` | — | bg `#EEEEE9`, text `#86867B`, `cursor: not-allowed` |
| Read-only | `1px transparent` | — | bg `#F6F6F3`, text ink |

Error message: `caption` 13px `#A6323C`, `space-2` 8px below the field, preceded by a 14px alert icon at `space-1` 4px. Always wired with `aria-describedby` and `aria-invalid="true"`.

### 12.3 Controls

**Textarea** — `md` metrics, `min-height: 128px`, `resize: vertical`, `padding: 12px 16px`. The Requirements field on the quote form starts at 160px.

**Select** — same metrics as input. 16px chevron at 16px from the right edge, `padding-right: 44px`. **Native `<select>` on mobile**; a custom listbox on desktop only, with full keyboard support (Up/Down, Home/End, type-ahead, `Escape` to close, `aria-activedescendant`).

**Checkbox** — 20 × 20px, `radius-xs` 2px, `1.5px #86867B` border. Checked: `#262236` fill, `#F6F6F3` check, border matches fill. Indeterminate: a 10px `#F6F6F3` bar. Label `body-sm`, `space-3` 12px gap, vertically centred to the first line. Hit area 44px via the wrapping `<label>`.

**Radio** — 20 × 20px, `radius-full`, `1.5px #86867B`. Checked: `#262236` border 6px inset, `#262236` dot. Grouped in a `<fieldset>` with a `<legend>`.

**Toggle** — 44 × 24px track, `radius-full`. Off: `#CFCFC6`. On: `#262236`. Knob 20px `#FFFFFF`, 2px inset, 180ms travel. Always paired with a text label — never colour-only.

**Quantity stepper** — for print runs, the field a buyer touches most.

```
┌────┬──────────────┬────┐
│ −  │    1,000     │ +  │   48px tall, mono tabular figures, 2px radius
└────┴──────────────┴────┘
   ↑ 48px            ↑ 48px
Minimum order 500 · in steps of 100     caption, paper-700
```

Steppers respect the product's MOQ and step. Typing is always permitted; the value clamps on blur with a short explanation, never silently.

**File upload — artwork.** Print buyers arrive with a PDF. This component decides whether the enquiry completes.

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                              │
│              [ upload icon 32 ]              │   min-height 160px
│         Drop artwork here or browse          │   body-md, ink, "browse" underlined
│   PDF, AI, CDR, PSD, TIFF, JPG · up to 100MB │   caption, paper-700
│                                              │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
   1px dashed #ADADA2 · radius 4 · bg #FBFBF9

Drag-over:  1px dashed #C18546 · bg #FBF8F4
Uploading:  file row + 2px #C18546 progress bar
Complete:   ┌──────────────────────────────────────┐
            │ [pdf 20] brochure-final.pdf   4.2 MB │  ✕
            └──────────────────────────────────────┘
              1px #E2E2DB · radius 2 · 12px padding
```

Multiple files, per-file progress and removal, a plain-text list as the no-JS fallback, and a keyboard-reachable `<input type="file">` behind the drop zone. State accepted formats and the size ceiling **before** the user tries — a rejected 240MB TIFF after a four-minute upload on mobile data loses the enquiry.

### 12.4 The quote form

The audit confirmed the existing field set is right — Name / Mobile / Email / Service / Requirements. Keep the structure, fix the execution.

| # | Field | Type | Width (desktop) | Notes |
|---|---|---|---|---|
| 1 | Name | text | 6 of 12 | `autocomplete="name"` |
| 2 | Mobile | tel | 6 of 12 | `inputmode="tel" autocomplete="tel"`, `+91` prefix, 10-digit validation |
| 3 | Email | email | 12 | `inputmode="email" autocomplete="email"` |
| 4 | Service | select | 6 of 12 | Printing / Packaging / Binding / Not sure yet |
| 5 | Quantity | stepper | 6 of 12 | Optional |
| 6 | Requirements | textarea | 12 | 160px, placeholder shows a worked example |
| 7 | Artwork | file | 12 | Optional |
| 8 | Consent | checkbox | 12 | Links to the privacy policy — **which does not yet exist and must be written** |

- Mark **optional** fields, not required ones. Most fields here are required; flagging the minority is less visual noise and reads as more confident.
- Single column on mobile, always. The 6-of-12 pairs stack.
- Submit: `lg` accent button, `width: 100%` on mobile, `auto` on desktop, label *Send enquiry* — not *Submit*.
- Below the submit, a `caption` reassurance line: *We reply to every enquiry within one working day. Mon–Sat, 9:30am–7pm.*
- Success replaces the form with a confirmation panel carrying a reference number, the expected reply window, and the WhatsApp number as a second route. Do not use a toast for something this important.

### 12.5 Validation and accessibility

- **Validate on blur first, then on change** once an error is showing. Never validate on keystroke before the first blur — it flags a half-typed email as wrong and is the fastest way to make a form feel hostile.
- Every input has a real `<label>`. Placeholder-as-label is prohibited: it vanishes on focus, fails cognitive-accessibility guidance, and breaks autofill.
- Related controls are wrapped in `<fieldset>` with a `<legend>`.
- **Forms with more than six fields get an error summary** at the top on failed submit: a heading, a count, and a list of links to each invalid field. Move focus to it and mark it `role="alert"`.
- `autocomplete` on every applicable field (WCAG 1.3.5). On a phone this is the difference between a 40-second form and a two-minute one.
- Errors are never colour-only — always icon plus text.
- Full keyboard operability, logical tab order, no positive `tabindex`.
- Never `outline: none` without a replacement ring.
- Honeypot field plus a time-to-submit check for spam. **No CAPTCHA** — it is an accessibility barrier and a conversion tax on the highest-intent page on the site.

---

## 13. Dark section guidelines

Dark bands are where this brand looks most expensive: press-floor photography, the scroll-driven press sequence, the material configurators, testimonials and the footer. They are also the easiest place to break contrast. These rules are strict for that reason.

### 13.1 When to use dark

**Do use dark for:** the press-floor and machinery band · the 3D process sequence · material and finish configurators · testimonial bands · the closing CTA · the footer.

**Don't use dark for:** long-form reading copy · forms (except the footer's single-field enquiry) · catalogue grids · spec tables · anything the user must scan comparatively.

**Maximum two or three dark bands per page**, always full-bleed (`container-bleed`), always with a hard edge — no gradient fade, no radius, no shadow at the junction. The abrupt light-to-dark cut *is* the editorial device.

### 13.2 Dark surface scale

Elevation on dark is expressed as **lightness**, never as shadow.

| Level | Token | Hex | Use |
|---|---|---|---|
| Ground 0 | `ink-950` | `#0F0E16` | Deepest band — 3D canvases, footer |
| Ground 1 | `ink-900` | `#1A1726` | Standard dark band, cards on ground 0 |
| **Ground 2** | **`ink-800`** | **`#262236`** | **Default dark band**, cards on ground 1 |
| Ground 3 | `ink-700` | `#393252` | Raised card, hovered surface, input fill |

Raised surfaces also get `inset 0 1px 0 rgba(246,246,243,0.06)` — a one-pixel top highlight that reads as an edge catching light. It replaces the shadow entirely.

### 13.3 Dark text and border tokens

| Role | Hex / value | Contrast on `ink-900` |
|---|---|---|
| Primary text | `#F6F6F3` `paper-100` | **16.23:1** |
| Secondary text | `#CFCFC6` `paper-400` | **11.21:1** |
| Muted text | `#ADADA2` `paper-500` | **7.77:1** |
| Disabled text | `#86867B` `paper-600` | 4.78:1 |
| **Accent text** | `#C18546` `bronze-500` | **5.62:1** |
| Accent heading | `#D1A575` `bronze-400` | 7.83:1 |
| **Link** | `#9AB0D6` `indigo-300` | 8.00:1 |
| Hairline border | `rgba(246,246,243,0.10)` | decorative |
| Hover border | `rgba(246,246,243,0.16)` | decorative |
| **Control border** | `rgba(246,246,243,0.40)` | **3.60:1 — the minimum for inputs and outline buttons** |
| Emphasis border | `rgba(246,246,243,0.72)` | — |

> **Two hard prohibitions.**
> **1. Never use `#344F7C` as type on a dark ground.** Indigo against ink measures **2.14:1**. Every dark-section link uses `indigo-300` `#9AB0D6` (7.00:1 on ink-800).
> **2. Never set a border for an input or outline button at `rgba(246,246,243,0.24)`.** It resolves to 2.14:1 against `ink-900` and fails 1.4.11. The floor is **0.40**, which measures 3.60:1.

### 13.4 Type on dark

- **Bump Bodoni one weight step.** Light-on-dark optically thins hairlines; a 400 that reads correctly on paper reads fragile reversed. Use 500 on dark, and never set Bodoni reversed below **40px**.
- Loosen tracking by `+0.005em` on body copy — reversed type needs marginally more air.
- Do not go below `body-md` 16px for reading copy on dark, ever.
- The eyebrow on dark uses `bronze-500` `#C18546` (5.62:1), not `bronze-700`. The bronze rule above it stays `#C18546`.

### 13.5 Components on dark

| Component | Adaptation |
|---|---|
| **Buttons** | Use the on-dark variants in [§10.4](#104-variants--dark-grounds). Focus ring becomes `--focus-ring-inverse` |
| **Cards** | Ground one step lighter than the band, `1px rgba(246,246,243,0.10)`, top highlight, **no shadow**. Hover raises the ground and the border to `0.16` |
| **Inputs** | bg `rgba(246,246,243,0.06)`, border `rgba(246,246,243,0.40)`, text `#F6F6F3`, placeholder `#ADADA2`. Focus: border `#C18546`, ring `0 0 0 3px rgba(193,133,70,0.32)` |
| **Dividers** | `1px rgba(246,246,243,0.10)`. Never a solid grey line |
| **Icons** | `#F6F6F3` at full opacity, or `#C18546` for accent. Never below 70% opacity |
| **Logo** | The reversed SVG lockup. Never the raster PNG on dark — its baked-in white box will show |

### 13.6 Imagery in dark sections

- Photography goes full-bleed with **no border, no radius, no frame**.
- Any type over an image needs `--scrim-image` (or `--scrim-hero` for left-aligned copy). Verify contrast against the **brightest pixel behind the text**, not the average. A press-floor shot has specular highlights on chrome that will eat white type.
- Where a scrim would spoil the image, move the type into an adjacent solid panel instead.
- 3D canvases sit on `ink-950` `#0F0E16` with a three-point rig: a cool key at roughly `#F6F6F3`, a warm bronze rim at `#C18546` — the accent doing real work as a light source — and a low fill so shadow detail survives.
- Every 3D scene ships a static poster render at the same framing so the band never appears empty during load, and so mobile and reduced-data users still see the object.

### 13.7 The footer

The largest dark surface on the site and the one every page ends on.

- Ground `ink-950` `#0F0E16`. Padding 96px top / 48px bottom desktop, 64 / 32 mobile.
- Four columns desktop (Printing · Packaging · Binding · Company + Contact), stacked accordions on mobile.
- The tagline — **"Ink Your Vision. Print Your Success."** — set in Bodoni 40px `#F6F6F3` at the top of the footer, with a 48px bronze rule above it. The doubled exclamation marks from the current site are dropped.
- Contact block: **one** phone number (the audit found three live and conflicting — this must be resolved before launch), `sales@thoorigaiprints.com`, the Royapettah address, and business hours, all as `tel:`/`mailto:`/`maps:` links.
- Bottom bar separated by `1px rgba(246,246,243,0.10)`: dynamic copyright year, GST number in mono, and links to Privacy, Terms and Cookies — **the privacy policy must exist before launch; it currently 404s.**
- Every footer link uses `paper-400` `#CFCFC6` at rest and `#F6F6F3` on hover with a 1px bronze underline. Not `indigo-300` — the footer has too many links for coloured type to stay calm.

---

## 14. Motion

Motion in a luxury system is short, few, and confident. Nothing bounces, nothing overshoots, nothing loops.

### 14.1 Tokens

| Token | Value | Use |
|---|---|---|
| `duration-instant` | 100ms | Tap feedback, checkbox check |
| `duration-fast` | 180ms | Hover, colour, border |
| `duration-base` | 240ms | Card lift, dropdown, accordion |
| `duration-slow` | 320ms | Modal, drawer, mega menu |
| `duration-slower` | 480ms | Page transition, image scale |
| `ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | **The default.** Fast out, long settle |
| `ease-entrance` | `cubic-bezier(0.16, 1, 0.30, 1)` | Elements arriving |
| `ease-exit` | `cubic-bezier(0.40, 0.00, 1, 1)` | Elements leaving |
| `ease-linear` | `linear` | Progress bars, spinners only |

### 14.2 Rules

- Animate **transform, opacity, colour, border-colour and box-shadow only**. Never width, height, top or left.
- Scroll reveals: `opacity 0 → 1` plus `translateY(16px → 0)` over 480ms, triggered at 15% visibility, **once**. Stagger grid children by 60ms, capped at six — the seventh onward share the sixth's delay so a 43-tile grid never crawls in.
- Never animate a heading in character by character. Never animate a price or a spec figure.
- No parallax on mobile. No autoplay video with sound, anywhere.
- Under `prefers-reduced-motion: reduce`: no transforms, no scroll-linked sequences, no parallax; transitions collapse to opacity at 120ms; 3D viewers load in a static pose and only move on direct user input.

---

## 15. Iconography and imagery

### 15.1 Icons

The existing set in [assets/icons/](../assets/icons/) is Phosphor — but it currently mixes **Light**, **Regular** and **Bold** weights in the same interface (`microscope-light.svg` next to `caret-right-bold-4.svg`). Standardise on one.

| Property | Value |
|---|---|
| Family | **Phosphor Regular** — 1.5px stroke on a 24px grid |
| Sizes | 16 / 20 / **24** / 32 / 48 |
| Colour | `currentColor`, inheriting the text colour |
| Stroke | 1.5px, round caps, round joins. Never scale the stroke with the icon — redraw at each size |
| Delivery | Inline SVG or an SVG sprite. **No icon font**, no per-icon HTTP requests |
| Accessibility | `aria-hidden="true"` when decorative; a `<title>` and `role="img"` when meaningful |

Icons are ink by default. Bronze icons are permitted at 24px and above only, and only where the icon is the accent moment of its section. Icons are never the sole carrier of meaning.

### 15.2 Imagery

| Ratio | Use |
|---|---|
| **4:5** | Catalogue tiles, product-led portrait |
| **3:2** | Capability cards, case studies, editorial |
| **1:1** | Material swatches, team, thumbnails |
| **16:9** | Video, machinery, section headers |
| **21:9** | Full-bleed hero, chapter breaks |

**Treatment**

- `radius-none` on every image, without exception.
- No filters, no duotones, no overlaid brand colour. The product's real colour is the thing being sold.
- One consistent photographic ground: the warm neutral of `paper-200` `#EEEEE9`, or a true cyclorama white for cut-out product work.
- `object-fit: cover` with `object-position` set per image. Never let an automatic crop decide where a spine or a foil edge sits.
- Always AVIF with a WebP fallback, always with `width`/`height`, always with a real `alt` — **all 168 current images have empty alt attributes.**

**The resolution ceiling.** The image inventory records nine live product shots under 700px wide, the smallest at 568×382. These cannot be enlarged into a premium layout, a lightbox or a 3D texture map. Until a re-shoot happens:

- Cap those assets at **2-up mobile / 4-up desktop catalogue tiles** and nowhere larger.
- Never place them in a lightbox, a hero, or a `span-half` editorial split.
- Commission the re-shoot on a neutral cyclorama with multiple angles and flat texture captures of PU leather, rexin, kraft and corrugated board. It is a prerequisite for the material configurators, not a nice-to-have.

---

## 16. Accessibility contract

WCAG **2.2 Level AA** is the floor, not the aspiration. A print buyer at 55 with presbyopia is a core user, not an edge case.

| Requirement | Standard | How this system meets it |
|---|---|---|
| Body text contrast | ≥ 4.5:1 | Ink on paper 14.21:1; secondary 5.68:1 |
| Large text (≥24px, or ≥19px bold) | ≥ 3:1 | Every display pairing exceeds 4.9:1 |
| Non-text UI, borders, icons | ≥ 3:1 | Control border `#86867B` 3.40:1; dark control border 0.40 alpha 3.60:1 |
| Focus visible | 2.4.7 / 2.4.11 | 2px double ring, never removed, `:focus-visible` |
| Focus not obscured | 2.4.11 (new in 2.2) | Sticky header and mobile CTA bar use `scroll-margin-top: 96px` on focusable targets |
| Target size | 2.5.8 (new in 2.2) | 44px minimum, 48px preferred, 8px minimum separation |
| Text resize | 1.4.4 | Everything in `rem`; layout holds to 200% |
| Reflow | 1.4.10 | No horizontal scroll at 320px width / 400% zoom |
| Text spacing | 1.4.12 | No fixed heights on text containers |
| Colour not alone | 1.4.1 | Errors, warnings and status all carry an icon and text |
| Motion | 2.3.3 | `prefers-reduced-motion` honoured throughout |
| Autofill | 1.3.5 | `autocomplete` on every applicable field |
| Landmarks | 1.3.1 | `header` / `nav` / `main` / `aside` / `footer`, one `h1` per page, no skipped levels |
| Language | 3.1.1 / 3.1.2 | `lang="en-IN"`, with `lang="ta"` on every Tamil string |
| Skip link | 2.4.1 | First in tab order, visible on focus |

Two items to carry into build as known gaps: **the privacy policy does not exist** (the footer links to a 404), and **every image alt attribute is currently empty**. Both are launch blockers.

---

## 17. Token export

### 17.1 CSS custom properties

```css
:root {
  /* ── Brand ──────────────────────────────────────────── */
  --color-ink:        #262236;
  --color-indigo:     #344F7C;
  --color-paper:      #F6F6F3;
  --color-bronze:     #C18546;

  /* ── Ink scale ──────────────────────────────────────── */
  --ink-50:  #F3F2F7;  --ink-100: #E8E6F0;  --ink-200: #D0CCE0;
  --ink-300: #ADA6C9;  --ink-400: #847AAE;  --ink-500: #60558B;
  --ink-600: #4A426C;  --ink-700: #393252;  --ink-800: #262236;
  --ink-900: #1A1726;  --ink-950: #0F0E16;

  /* ── Indigo scale ───────────────────────────────────── */
  --indigo-50:  #F1F4F9;  --indigo-100: #E2E8F3;  --indigo-200: #C5D2E7;
  --indigo-300: #9AB0D6;  --indigo-400: #6082BE;  --indigo-500: #4366A3;
  --indigo-600: #344F7C;  --indigo-700: #283D62;  --indigo-800: #1F304C;
  --indigo-900: #162236;  --indigo-950: #0D1421;

  /* ── Bronze scale ───────────────────────────────────── */
  --bronze-50:  #FBF8F4;  --bronze-100: #F6EDE4;  --bronze-200: #EDDCC9;
  --bronze-300: #E0C3A3;  --bronze-400: #D1A575;  --bronze-500: #C18546;
  --bronze-600: #A87238;  --bronze-700: #865B2D;  --bronze-800: #674622;
  --bronze-900: #493118;  --bronze-950: #2A1D0E;

  /* ── Paper scale ────────────────────────────────────── */
  --paper-0:   #FFFFFF;  --paper-50:  #FBFBF9;  --paper-100: #F6F6F3;
  --paper-200: #EEEEE9;  --paper-300: #E2E2DB;  --paper-400: #CFCFC6;
  --paper-500: #ADADA2;  --paper-600: #86867B;  --paper-700: #62625A;
  --paper-800: #45453F;  --paper-900: #2B2B27;  --paper-950: #1A1A17;

  /* ── Semantic ───────────────────────────────────────── */
  --success: #2F6B4F;  --success-bg: #EDF4F0;  --success-border: #C9DED4;  --success-dark: #6FBF98;
  --warning: #8A5F0F;  --warning-bg: #F8F0DE;  --warning-border: #E7D5AC;  --warning-dark: #E0B45C;
  --error:   #A6323C;  --error-bg:   #F9EDEE;  --error-border:   #E9C9CC;  --error-dark:   #E28B92;
  --info:    #344F7C;  --info-bg:    #F1F4F9;  --info-border:    #C5D2E7;  --info-dark:    #9AB0D6;

  /* ── Surfaces & text ────────────────────────────────── */
  --surface-page: var(--paper-100);
  --surface-raised: var(--paper-0);
  --surface-sunken: var(--paper-200);
  --surface-tinted: var(--bronze-50);
  --surface-inverse: var(--ink-800);

  --text-primary:   var(--ink-800);
  --text-secondary: var(--paper-700);
  --text-muted:     var(--paper-600);
  --text-accent:    var(--bronze-700);
  --text-link:      var(--indigo-600);
  --text-inverse:   var(--paper-100);

  --border-hairline: var(--paper-300);
  --border-default:  var(--paper-400);
  --border-control:  var(--paper-600);
  --border-strong:   var(--ink-800);
  --border-accent:   var(--bronze-500);

  /* ── Type ───────────────────────────────────────────── */
  --font-display: "Bodoni Moda", Didot, "Bodoni MT", "Playfair Display", Georgia, serif;
  --font-text:    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-tamil:   "Anek Tamil", "Noto Sans Tamil", Latha, sans-serif;
  --font-mono:    "JetBrains Mono", SFMono-Regular, Consolas, monospace;

  --text-display-xl: clamp(2.5rem, 1.271rem + 5.246vw, 5.5rem);
  --text-display-lg: clamp(2.25rem, 1.329rem + 3.932vw, 4.5rem);
  --text-display-md: clamp(2rem, 1.283rem + 3.059vw, 3.75rem);
  --text-h1: clamp(1.875rem, 1.414rem + 1.967vw, 3rem);
  --text-h2: clamp(1.6875rem, 1.28rem + 1.738vw, 2.5rem);
  --text-h3: clamp(1.5rem, 1.295rem + 0.874vw, 2rem);
  --text-h4: clamp(1.25rem, 1.148rem + 0.437vw, 1.5rem);
  --text-h5: clamp(1.125rem, 1.074rem + 0.219vw, 1.25rem);
  --text-h6: 1.0625rem;
  --text-body-lg: clamp(1.0625rem, 1.037rem + 0.109vw, 1.125rem);
  --text-body-md: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.8125rem;
  --text-overline: 0.75rem;
  --text-micro: 0.6875rem;

  --leading-display: 0.92;  --leading-tight: 1.15;  --leading-snug: 1.3;
  --leading-normal: 1.5;    --leading-relaxed: 1.7;
  --tracking-display: -0.03em;  --tracking-tight: -0.02em;
  --tracking-normal: 0;         --tracking-overline: 0.16em;

  /* ── Spacing ────────────────────────────────────────── */
  --space-px: 1px;   --space-0-5: 0.125rem; --space-1: 0.25rem;  --space-2: 0.5rem;
  --space-3: 0.75rem; --space-4: 1rem;      --space-5: 1.25rem;  --space-6: 1.5rem;
  --space-7: 1.75rem; --space-8: 2rem;      --space-10: 2.5rem;  --space-12: 3rem;
  --space-14: 3.5rem; --space-16: 4rem;     --space-18: 4.5rem;  --space-20: 5rem;
  --space-24: 6rem;   --space-30: 7.5rem;   --space-40: 10rem;   --space-50: 12.5rem;
  --space-60: 15rem;

  /* ── Radius ─────────────────────────────────────────── */
  --radius-none: 0;      --radius-xs: 2px;   --radius-sm: 4px;
  --radius-md: 8px;      --radius-lg: 12px;  --radius-xl: 16px;
  --radius-full: 9999px;

  /* ── Shadows ────────────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(38,34,54,0.04);
  --shadow-sm: 0 1px 2px rgba(38,34,54,0.04), 0 2px 6px rgba(38,34,54,0.04);
  --shadow-md: 0 2px 4px rgba(38,34,54,0.04), 0 6px 16px rgba(38,34,54,0.06);
  --shadow-lg: 0 4px 8px rgba(38,34,54,0.05), 0 12px 32px rgba(38,34,54,0.08);
  --shadow-xl: 0 8px 16px rgba(38,34,54,0.06), 0 24px 56px rgba(38,34,54,0.10);
  --shadow-2xl: 0 16px 32px rgba(38,34,54,0.08), 0 40px 96px rgba(38,34,54,0.14);
  --shadow-hairline: inset 0 0 0 1px rgba(38,34,54,0.08);
  --shadow-highlight: inset 0 1px 0 rgba(246,246,243,0.06);

  --focus-ring: 0 0 0 2px #F6F6F3, 0 0 0 4px #344F7C;
  --focus-ring-inverse: 0 0 0 2px #262236, 0 0 0 4px #C18546;
  --focus-ring-field: 0 0 0 3px rgba(52,79,124,0.16);
  --focus-ring-error: 0 0 0 3px rgba(166,50,60,0.14);

  --scrim-modal: rgba(15,14,22,0.56);
  --scrim-drawer: rgba(15,14,22,0.44);

  /* ── Layout ─────────────────────────────────────────── */
  --container-prose: 628px;  --container-narrow: 768px;  --container-md: 960px;
  --container-lg: 1120px;    --container-xl: 1280px;     --container-max: 1440px;
  --gutter: 1.5rem;  --page-margin: 5rem;

  /* ── Motion ─────────────────────────────────────────── */
  --duration-instant: 100ms; --duration-fast: 180ms;  --duration-base: 240ms;
  --duration-slow: 320ms;    --duration-slower: 480ms;
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-entrance: cubic-bezier(0.16, 1, 0.30, 1);
  --ease-exit: cubic-bezier(0.40, 0.00, 1, 1);

  /* ── z-index ────────────────────────────────────────── */
  --z-base: 0;      --z-raised: 10;      --z-sticky: 100;   --z-header: 200;
  --z-mobile-cta: 300; --z-dropdown: 400; --z-scrim: 500;   --z-modal: 600;
  --z-toast: 700;   --z-tooltip: 800;    --z-skip: 900;
}

@media (max-width: 767px) {
  :root { --gutter: 1rem; --page-margin: 1.25rem; }
}

/* Dark sections opt in by class, not by media query — this is an
   editorial device the design controls, not an OS preference. */
.section--dark {
  --surface-page: var(--ink-800);
  --surface-raised: var(--ink-700);
  --text-primary: var(--paper-100);
  --text-secondary: var(--paper-400);
  --text-muted: var(--paper-500);
  --text-accent: var(--bronze-500);
  --text-link: var(--indigo-300);
  --border-hairline: rgba(246,246,243,0.10);
  --border-default: rgba(246,246,243,0.16);
  --border-control: rgba(246,246,243,0.40);
  --border-strong: rgba(246,246,243,0.72);
  --focus-ring: var(--focus-ring-inverse);
  background: var(--surface-page);
  color: var(--text-primary);
}
.section--dark-deep { --surface-page: var(--ink-950); --surface-raised: var(--ink-900); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 120ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 17.2 Tailwind v4 theme

```css
@import "tailwindcss";

@theme {
  --color-ink-50: #F3F2F7;   --color-ink-100: #E8E6F0;  --color-ink-200: #D0CCE0;
  --color-ink-300: #ADA6C9;  --color-ink-400: #847AAE;  --color-ink-500: #60558B;
  --color-ink-600: #4A426C;  --color-ink-700: #393252;  --color-ink-800: #262236;
  --color-ink-900: #1A1726;  --color-ink-950: #0F0E16;

  --color-indigo-50: #F1F4F9;  --color-indigo-300: #9AB0D6; --color-indigo-500: #4366A3;
  --color-indigo-600: #344F7C; --color-indigo-700: #283D62; --color-indigo-900: #162236;

  --color-bronze-50: #FBF8F4;  --color-bronze-100: #F6EDE4; --color-bronze-200: #EDDCC9;
  --color-bronze-300: #E0C3A3; --color-bronze-400: #D1A575; --color-bronze-500: #C18546;
  --color-bronze-600: #A87238; --color-bronze-700: #865B2D; --color-bronze-800: #674622;

  --color-paper-0: #FFFFFF;   --color-paper-50: #FBFBF9;  --color-paper-100: #F6F6F3;
  --color-paper-200: #EEEEE9; --color-paper-300: #E2E2DB; --color-paper-400: #CFCFC6;
  --color-paper-500: #ADADA2; --color-paper-600: #86867B; --color-paper-700: #62625A;

  --font-display: "Bodoni Moda", Didot, Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-tamil: "Anek Tamil", "Noto Sans Tamil", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --radius-xs: 2px;  --radius-sm: 4px;  --radius-md: 8px;

  --shadow-md: 0 2px 4px rgb(38 34 54 / 0.04), 0 6px 16px rgb(38 34 54 / 0.06);
  --shadow-lg: 0 4px 8px rgb(38 34 54 / 0.05), 0 12px 32px rgb(38 34 54 / 0.08);
  --shadow-xl: 0 8px 16px rgb(38 34 54 / 0.06), 0 24px 56px rgb(38 34 54 / 0.10);

  --spacing-18: 4.5rem;  --spacing-30: 7.5rem;
  --spacing-50: 12.5rem; --spacing-60: 15rem;

  --breakpoint-xs: 20rem;  --breakpoint-sm: 30rem;  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;  --breakpoint-xl: 80rem;  --breakpoint-2xl: 96rem;

  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 18. Appendix — ink, substrate and finish

A printing company prints its own collateral. The brand has to hold on paper as well as on screen — and this is the part of a design system a print buyer will judge hardest.

### 18.1 Print equivalents

> **These are starting points for a press conversation, not specifications.** Screen hex converted to CMYK without a device profile is unreliable, and a bronze that looks right on a coated sheet will look muddy on uncoated. **Pull physical Pantone chips, then run a press proof on the actual stock, then lock the values.** For a printer, publishing unproofed CMYK builds in a brand guide would be an unforced error.

| Colour | Screen | Pantone (approximate — confirm against a physical swatch) | Notes |
|---|---|---|---|
| **Ink** | `#262236` | ≈ PANTONE 5255 C / 2380 C | On uncoated, expect it to open up and read cooler. Consider a rich-black build for large solids rather than the spot. |
| **Indigo** | `#344F7C` | ≈ PANTONE 2378 C / 7687 C | Secondary; rarely printed as a solid. |
| **Bronze** | `#C18546` | ≈ PANTONE 730 C / 7563 C | **Its true counterpart is a foil, not an ink.** See below. |
| **Paper** | `#F6F6F3` | Not an ink — a **stock** | Specify as a natural-white uncoated, 92–95 brightness, not as a printed tint. |

**Rich black build for large ink solids:** ask the press for `C60 M50 Y40 K100` as a starting point and proof it. A 100% K solid on a large area will look flat and grey next to the digital brand.

### 18.2 The bronze is a foil

This is the most important line in the appendix. `#C18546` exists on screen to *stand in for* a physical finish. On print it should be:

| Application | Specification |
|---|---|
| Business cards, folders, presentation covers | **Bronze/antique-gold hot foil** — e.g. Kurz Luxor/Alufin bronze, or PANTONE 871 C metallic where foil is not viable |
| Deboss / blind emboss | The wordmark blind-debossed on uncoated is the strongest and cheapest premium signal available |
| Spot UV | Bronze foil plus a matte laminate ground — the tactile contrast is the whole point |
| Large areas | **Never.** Foil is a highlight. A foiled panel looks cheap; a foiled rule looks expensive |

The rule is the same as on screen: **once per surface.**

### 18.3 Stock recommendations

| Piece | Stock |
|---|---|
| Business card | 600 gsm duplexed uncoated natural white, edge-painted in `#262236` |
| Letterhead | 120 gsm uncoated natural white |
| Folder / presentation cover | 350 gsm board, matte laminate, bronze foil mark |
| Sample swatch book | Mixed — the actual stocks sold, which is the whole product |
| Packaging mock-ups | The real board specification, never a substitute |

### 18.4 Logo

The current mark is a **472 × 317 raster PNG with baked-in whitespace** and is the brand's only logo file. Before any of this system ships:

1. **Redraw as SVG.** It is a prerequisite for the reversed footer lockup, retina rendering, the favicon set, animation, and every foil and deboss die above.
2. Produce four lockups: horizontal, stacked, mark-only, and a reversed variant for dark sections.
3. Set clear space equal to the height of the mark on all sides.
4. Set minimum sizes: 120px wide on screen, 24mm wide in print, mark-only below that.
5. Regenerate the full favicon and Open Graph icon set from the SVG. Eight variants of one old favicon currently sit in [assets/logos/](../assets/logos/); all should be replaced.

---

## Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 21 Aug 2026 | Initial system. Four brand colours expanded to four verified scales; Bodoni Moda / Inter / Anek Tamil / JetBrains Mono typography; 4px spacing scale; near-zero radius scale; ink-tinted layered shadows; 12-column grid with an asymmetric editorial rail; desktop, mobile, button, card, form and dark-section specifications; WCAG 2.2 AA contract with a measured contrast table; CSS and Tailwind token exports; print, foil and stock appendix. |
