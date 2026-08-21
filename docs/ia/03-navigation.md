# 03 · Navigation Structure

The old navigation presents three levels that do not exist in the CMS, routes two of its items to `href="#"`, and omits the blog entirely. The footer omits Home, Contact, and the blog as well. This document replaces all of it.

**Governing rule:** the navigation is a table of contents, not a directory. Seven top-level items maximum, and every item is a destination — no dead labels.

---

## 1. Primary navigation — desktop

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ◆ Thoorigai   Printing  Packaging  Binding  Materials  Work  About   ⌕  ⟨Get a quote⟩ │
└──────────────────────────────────────────────────────────────────────────────┘
     brand         ── mega-panel triggers ──   ── links ──       utility    primary CTA
```

| Slot | Item | Behaviour | Rationale |
|---|---|---|---|
| Brand | Logo (SVG) | Links to `/` | The old site had five separate logo links all pointing at root |
| 1 | **Printing** | Mega-panel | Pillar |
| 2 | **Packaging** | Mega-panel | Pillar |
| 3 | **Binding** | Mega-panel | Pillar |
| 4 | **Materials** | Direct link | The 3D showcase; sells the finishes that carry the margin |
| 5 | **Work** | Direct link | The credibility gap; earns a nav slot until it is filled, then keeps it |
| 6 | **About** | Direct link | Founder story is the strongest differentiator on the site |
| Utility | **Search** | Opens overlay | 43 catalogue items need a way in |
| CTA | **Get a quote** | Links to `/quote/` | A URL, not a popup |

**Contact is deliberately not in the primary nav.** The persistent CTA, the sticky mobile bar, the footer, and the WhatsApp channel all cover it. Removing it buys the room that keeps the bar uncluttered — the Apple move of trusting the CTA to carry intent.

**Process, Journal, FAQ, Contact** live in the footer and in contextual in-page links. They are destinations people arrive at with a reason, not items people browse.

### Header states

| State | Treatment |
|---|---|
| Rest (top of page) | Transparent over hero, ink-on-paper over anything else, no border |
| Scrolled > 64px | `--paper-raised` at 80% with backdrop blur, 1px `--rule` bottom hairline, height reduced 72px → 56px |
| Scrolling down | Header hides (translateY -100%), 240ms ease-out — reading room back to the content |
| Scrolling up | Header returns immediately — the Linear/Framer pattern; intent to navigate reads as scroll-up |
| Panel open | Header opaque, page dimmed behind at 40%, body scroll locked |
| Reduced motion | No hide/show, no blur transition; state changes are instant |

The header never carries a shadow. Elevation is a hairline plus a background shift — shadow is the thing that makes a premium header look like a template.

---

## 2. Mega-panel

One full-width panel per pillar. Never a nested dropdown; the old site's two-level `href="#"` cascade is the exact pattern being removed.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│   BINDING                                              Featured               │
│   Choose by page count, durability and budget.         ┌───────────────────┐  │
│                                                        │                   │  │
│   By method              By material                   │   [hard case in   │  │
│   ──────────────         ──────────────                │    gold foil]     │  │
│   Hard case              PU leather                    │                   │  │
│   Perfect                Rexin                         └───────────────────┘  │
│   Wiro                   Special sheets                Hard case binding      │
│   Centre pin             Board on board                Eight materials,       │
│   Board books                                          configurable.          │
│                                                                               │
│   ───────────────────────────────────────────────────────────────────────────│
│   All binding services →                          Not sure which? Compare →   │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Panel contract

| Element | Rule |
|---|---|
| Columns | Two or three link columns, one featured slot. Never more. |
| Column headings | Real groupings ("By method", "By material") — **not** clickable dead labels. The old "Digital" and "Offset" group labels pointed at `#`; they become headings here. |
| Featured slot | Exactly one image and one line of copy. The panel's only image, so it renders instantly. |
| Footer row | "All {pillar} services →" plus one contextual link (a comparison, a material guide) |
| Lead line | One sentence under the pillar name stating the decision this pillar involves |
| Open | Hover with 120ms intent delay, or focus, or click. Click always works — never hover-only. |
| Close | Escape, click outside, focus leaving the panel, or route change |
| Motion | Fade + 8px rise, 180ms. Height is measured, never animated from `auto`. |
| Focus | Trapped inside the panel while open; returns to the trigger on close |
| Markup | `<nav>` with `aria-expanded` on the trigger and `aria-controls` on the panel |

### Panel contents

**Printing**

| By process | By output | Featured |
|---|---|---|
| Digital multicolour | Books & publications | Variable data printing — "Micro text, serialised, secure." |
| Digital black & white | Marketing collateral | |
| Offset multicolour | Certificates & IDs | |
| Offset black & white | Exam stationery | |
| Variable data | | |

Footer row: *All printing services →* · *Digital or offset? →*

**Packaging**

| Boxes | Bags & files | Featured |
|---|---|---|
| Corrugated boxes | Paper bags | Rigid boxes — "Telescope, drawer, hinged, magnetic." |
| Carton boxes | Customised files | |
| Rigid boxes | Box files | |
| | Convocation files | |
| | Presentation samples | |

Footer row: *All packaging →* · *Board & flute guide →*

**Binding**

| By method | By material | Featured |
|---|---|---|
| Hard case | PU leather | Hard case binding — "Eight materials, configurable." |
| Perfect | Rexin | |
| Wiro | Special sheets | |
| Centre pin | Board on board | |
| Board books | | |

Footer row: *All binding services →* · *Compare binding types →*

---

## 3. Primary navigation — mobile

Mobile is the default case, not the fallback. The nav has two parts: a minimal header and a persistent action bar.

### Header (mobile)

```
┌─────────────────────────────────────────┐
│  ◆ Thoorigai                    ⌕   ☰   │   56px, hairline bottom
└─────────────────────────────────────────┘
```

Three targets, all at least 44×44px. No CTA in the mobile header — the action bar owns that job, and duplicating it wastes the scarcest row on the screen.

### Menu sheet

Tapping ☰ opens a **full-height sheet that rises from the bottom**, not a slide-in drawer from the side. Bottom-anchored means the list starts inside the thumb arc rather than above it.

```
┌─────────────────────────────────────────┐
│                                     ✕   │
│                                         │
│  ⌕  Search products and services        │  ← search first: 43 items
│  ───────────────────────────────────    │
│                                         │
│  Printing                           ›   │  ← accordion, not a new screen
│  Packaging                          ›   │
│  Binding                            ›   │
│  Materials                              │
│  Work                                   │
│  About                                  │
│  ───────────────────────────────────    │
│  Process    ·    FAQ    ·    Journal    │  ← secondary, smaller
│  ───────────────────────────────────    │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │          Get a quote              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  📞 +91 XXXXX XXXXX    💬 WhatsApp      │
│  Mon–Sat · 9:30am–7:00pm                │
└─────────────────────────────────────────┘
     ↑ thumb zone: everything actionable sits here
```

| Rule | Detail |
|---|---|
| Pillar expansion | Accordion in place — never a second screen. Drill-down navigation forces a back-tap for every wrong guess. |
| Accordion behaviour | One open at a time; the expanded pillar scrolls into view; header row of the pillar is itself a link to the hub |
| Sheet dismissal | Swipe down, tap the scrim, tap ✕, or hardware back |
| Scroll | Sheet scrolls internally; the page behind is locked |
| Motion | Spring rise 280ms; reduced motion gets a 120ms fade |
| Safe area | Bottom padding respects `env(safe-area-inset-bottom)` |

### Persistent action bar

```
┌─────────────────────────────────────────┐
│   📞 Call     💬 WhatsApp   ⟨Get a quote⟩│   ← fixed bottom, 64px + safe area
└─────────────────────────────────────────┘
```

Present on every page from first paint. It hides while the menu sheet or a modal is open, and it is replaced by a **context bar** on capability and catalogue pages (see [06 · CTA Strategy](06-cta-strategy.md)).

---

## 4. Secondary navigation

### Breadcrumbs

On every Tier 2 page and below. The old site had three nominal levels and no breadcrumbs anywhere.

```
Home  ›  Binding  ›  Hard case binding
```

- Rendered directly beneath the header, above the page title, in `--t-micro`.
- The current page is present but not a link.
- Marked up with `BreadcrumbList` structured data.
- On mobile, collapses to the parent only: `‹ Binding` — a back-affordance, not a trail.

### In-page section navigation

Long pages — pillar hubs, capability pages, `/process/`, `/faq/`, legal — carry a sticky section index.

| Viewport | Treatment |
|---|---|
| Desktop | Left rail, sticky, scroll-spy active state, hairline connector |
| Mobile | Horizontally scrollable chip row that pins under the header once the first section is reached |

Chips use the section's real name. This is what turns a 600-word capability page from a scroll into a document.

### Sibling navigation

At the foot of every capability page, a strip of its siblings under the same pillar: *Also in binding: Perfect · Wiro · Centre pin · Board books*. This is the internal linking the old site never had — eleven child pages, each an island duplicating its parent.

### Catalogue filtering

The catalogue grid on each pillar hub filters by chips rather than by navigation:

`All · Books · Marketing · Stationery · Retail · Institutional`

Filter state is URL-encoded (`?filter=retail`) so a filtered view can be linked and shared.

---

## 5. Footer

Four columns, replacing a three-column footer that omitted Home, Contact, and the blog, and whose legal menu linked to a 404.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ◆ Thoorigai Prints            Services         Company        Get in touch  │
│  Ink your vision.              Printing         About          Get a quote → │
│  Print your success.           Packaging        Work           Contact       │
│                                Binding          Process        WhatsApp      │
│  Nayar Vardha Pillai St,       Materials        Journal        Call          │
│  Balaji Nagar, Royapettah,                      FAQ                          │
│  Chennai, Tamil Nadu 600014                                    Mon–Sat       │
│                                                                9:30am–7:00pm │
│  +91 XXXXX XXXXX                                                             │
│  sales@thoorigaiprints.com                     Instagram · LinkedIn          │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────────│
│  © 2026 Thoorigai Prints · GSTIN XXXXXXXXXXXXXXX                             │
│  Privacy · Terms · Cookies                                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Column | Contents | Fixes |
|---|---|---|
| **Brand** | SVG logo, tagline, full postal address, canonical phone, email, hours | Address, hours and email were absent from the old footer |
| **Services** | Three pillars + Materials, each expanding to its capability list on desktop | Old footer listed four links total |
| **Company** | About · Work · Process · Journal · FAQ | Blog and Contact were both missing |
| **Get in touch** | Quote CTA, Contact, WhatsApp, Call, hours, social | Social links exist nowhere on the current site |
| **Bottom bar** | Dynamic copyright year, GSTIN, legal trio | Year was hard-coded to 2025; "Privacy Page" pointed at `/404` |

**Mobile footer:** the four columns become accordions in the order Services → Company → Get in touch, with the brand block always expanded at the top and the legal bar always visible at the bottom. An accordion footer is the one place where drill-down is right — nobody browses a footer.

---

## 6. Search

The catalogue is 43 items across three pillars. Someone looking for "visiting card" needs to land somewhere, and no amount of nav design substitutes for a search box.

| Property | Decision |
|---|---|
| Trigger | ⌕ in the header (desktop), first row of the menu sheet (mobile), `/` keyboard shortcut |
| Presentation | Centred overlay, results appear as you type — the Linear command-bar pattern |
| Index | Pre-built at build time over pages, capabilities, catalogue items, materials, FAQ answers |
| Result grouping | Services · Products · Materials · Answers |
| Empty state | The three pillars plus the top six catalogue items — never a bare "no results" |
| Synonyms | Mapped at index time: visiting card → business card, book binding → perfect binding, carry bag → paper bag, hard bound → hard case |
| No-match fallback | "Tell us what you need" → `/quote/` with the query pre-filled in the requirements field |

That last row matters more than the search itself: a failed search is a buyer describing their job in their own words, and it should become a lead rather than a dead end.

---

## 7. Navigation on entry pages

Because most sessions land on an interior page, orientation cannot depend on someone having passed through the homepage.

| Landing type | Orientation devices |
|---|---|
| Capability page | Breadcrumb · pillar name in the eyebrow · sibling strip at the foot · section chips |
| Catalogue detail | Breadcrumb to the parent capability · "Back to {capability}" · related items |
| Case study | Breadcrumb to `/work/` · services-used tags linking to capabilities |
| Journal article | Breadcrumb to `/journal/` · one contextual capability link in the body · related articles |
| 404 | Search field · three pillar cards · "Or just tell us what you need" → `/quote/` |

---

## 8. Accessibility contract

| Requirement | Implementation |
|---|---|
| Skip link | "Skip to content" as the first focusable element |
| Keyboard | Full traversal; mega-panels open on Enter/Space, close on Escape, arrow keys move within the panel |
| Focus visible | 2px `--amber` ring with 2px offset, never suppressed |
| Landmarks | `banner`, `navigation`, `main`, `contentinfo` |
| Current page | `aria-current="page"` on the active nav item and breadcrumb leaf |
| Touch targets | 44×44px minimum, 48px on primary actions, 8px minimum spacing between adjacent targets |
| Announcements | Panel open/close and search result counts announced via a polite live region |
| Reduced motion | Hide-on-scroll, panel rise, and sheet spring all reduce to instant or a short fade |
| Labels | Every form control has a real `<label>`. The old site's forms rely entirely on placeholders, and the quote popup has neither. |
