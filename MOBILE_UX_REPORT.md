# Mobile UX & Responsiveness Audit

**Site:** Thoorigai Prints
**Date:** 2026-08-21
**Target viewports:** 320px, 375px, 768px
**Approach:** mobile-first — every fix moves the base styles and adds breakpoints upward, never the reverse.

---

## 1. Method

This audit was **measured in a real browser**, not read off the source. Findings below
carry actual pixel values from the DOM.

| | |
|---|---|
| Engine | Chrome (headless), `deviceScaleFactor: 2` |
| Viewports | 320×568, 375×667, 768×1024 |
| Routes | `/`, `/about`, `/services`, `/products`, `/portfolio`, `/contact` |
| Emulation | iPhone UA + touch events below 768px |
| Motion | `prefers-reduced-motion: reduce`, so scroll reveals sit at their final state and layout is measurable |
| States | Top of page **and** scrolled to the bottom (so the sticky action bar is included) |

18 page renders in total. For each one the harness recorded document scroll width,
every element's bounding box, every interactive element's hit box, every computed
font size, and the clip geometry of each `Reveal` wrapper.

**Detecting masked overflow.** `body { overflow-x: hidden }` in `globals.css` hides
horizontal overflow rather than preventing it, so a naive `scrollWidth` check always
reports clean. The harness therefore lifts that rule, measures, then restores it —
which is what makes the "no overflow" result below meaningful rather than an artefact.

### What this audit did *not* cover

- **Real iOS/Android Safari and Chrome.** Chrome desktop with touch emulation is not
  a phone. Momentum scrolling, the iOS keyboard, dynamic viewport units and Safari's
  `overflow: hidden` quirks all behave differently on device.
- **Interactive states.** The mobile drawer, the portfolio lightbox and the filter
  controls were read in source but not opened and measured.
- **Post-fix re-measurement.** See §7 — the browser re-run is pending a permission.

---

## 2. Verdict

**No horizontal overflow at any target viewport.** All 18 renders reported a document
scroll width exactly equal to the viewport width, *with the `overflow-x: hidden` mask
lifted*. The layout system — `Container` (20/32/48px gutters) over a mobile-first
`Section` scale — is doing its job. Nothing is bleeding.

That is the headline, and it is a good one. The defects found are narrower: one fixed
element that outgrows its gutter at the smallest width, one permanent type-clipping
bug, and a small set of undersized tap targets.

| # | Issue | Severity | Area | Status |
|---|---|---|---|---|
| 1 | Header row overflows the gutter and runs 3px off-screen at 320px | **High** | Navigation | Fixed |
| 2 | Hero headline descenders permanently clipped at every viewport | **High** | Typography | Fixed |
| 3 | Standalone links below the 24px target minimum | Medium | Cards, Footer | Fixed |
| 4 | Action-bar labels at 11px | Low | Navigation | Fixed |
| 5 | Footer link columns crushed to ~80px at 768px | Medium | Footer | Fixed |
| 6 | Portfolio tile ratio contradicted its column span below `lg` | Medium | Portfolio | Fixed |
| 7 | 40 tap targets in the 24–44px band | Advisory | Site-wide | Documented, §6 |

---

## 3. Findings by area

### 3.1 Navigation

**Issue 1 — the header row overflows its gutter at 320px. (High)**

Measured on `/` at each viewport, the header's right edge against the 20px gutter:

| Viewport | Wordmark | Actions | Actions right edge | Gutter ends at | Result |
|---|---|---|---|---|---|
| 320px | 98px | 181px | **323px** | 300px | **23px over, 3px off-screen** |
| 375px | 98px | 181px | 355px | 355px | fits exactly |
| 768px | 162px | 238px | 736px | 736px | fits exactly |

At 320px the row needs `98 + 24 (gap-6) + 181 = 303px` inside a 280px content box.
Both children are `shrink-0`, so nothing gives: the row simply overhangs. The menu
button's right edge lands at 323px on a 320px screen, and because the header is
`position: fixed`, this never registers as page overflow — fixed elements do not
extend the scrollable area, and `body { overflow-x: hidden }` swallows the rest. It is
invisible to every automated check that only looks at `scrollWidth`.

The actions row breaks down as `44 (call) + 8 + 77 (Quote) + 8 + 44 (menu) = 181px`.

**Fix.** The icon call button now stands down below `xs` (360px):

```
- 'grid size-11 place-items-center rounded-full md:hidden'
+ 'hidden size-11 place-items-center rounded-full xs:grid md:hidden'
```

That returns the actions row to 129px and the total to `98 + 24 + 129 = 251px` inside
280px — a comfortable 29px of slack. From 360px up nothing changes.

Tap-to-call is not lost on a 320px phone: it remains in the drawer footer and in the
sticky `MobileActionBar`. The alternative — shrinking the 44px call button — would have
traded a layout bug for an accessibility one.

**What is already right.** The drawer close button is 44px. The hamburger is 44px. The
"Get a quote" CTA shortens to "Quote" rather than disappearing below 640px, so small
phones keep a visible CTA. The drawer traps focus, closes on Escape, restores focus to
the trigger, and is `aria-modal`. The `MobileActionBar` carries
`pb-[env(safe-area-inset-bottom)]` and is suppressed on `/contact`. This layer is in
good shape.

### 3.2 Hero

No overflow at any viewport. The H1 measured:

| Viewport | Computed size | Line height | Block width |
|---|---|---|---|
| 320px | 44px | 47.52px | 280px |
| 375px | 44px | 47.52px | 335px |
| 768px | 61.4px | 66.36px | 704px |

`clamp(2.75rem, 8vw, 5.75rem)` bottoms out at 44px, so 320px and 375px render
identically — correct behaviour, and the headline wraps cleanly at both.

The media frame deliberately bleeds through the gutter on mobile
(`-mx-5 aspect-[4/5] sm:-mx-8 sm:aspect-[3/2] lg:mx-0`) and declares its ratio at every
breakpoint, so nothing shifts as the image loads. The `priority` image is the LCP
element and no WebGL sits in the critical path.

### 3.3 Typography

**Issue 2 — hero headline descenders are permanently clipped. (High)**

`Reveal` wraps each headline line in `block overflow-hidden` to mask the clip-path wipe.
But the display tokens set `line-height: 1.08`, and Fraunces' content box is roughly
`1.23em`. The wrapper clips at the line box, so the glyph ink that sits outside it is
cut off — **and stays cut off after the animation finishes.** This is not a transient
animation artefact; it is the resting state of every hero headline on the site.

Measured overflow of the inner box beyond the clip window, on all three headline lines:

| Viewport | Type size | Clipped by |
|---|---|---|
| 320px / 375px | 44px | **6.5px** |
| 768px | 61.4px | **9.7px** |

It scales with type size, so it is worst exactly where the type is largest. The visible
symptom is a flattened descender on letters like the `p` in "packaging" and "Printing".

**Fix.**

```
- cn('block overflow-hidden', className)
+ cn('block overflow-hidden pb-[0.15em] -mb-[0.15em]', className)
```

The padding opens the clip window; the negative margin takes it back out of the flow.
`-mb` was chosen over `-my` deliberately: adjacent block siblings collapse their
margins, and a negative bottom margin collapsing against the next line's zero top
margin sums to `-0.15em`, leaving the advance at exactly one line-height. Using
`-my-[0.15em]` on both edges would collapse to `-0.15em` between two `-0.15em` margins
and *add* 0.15em of leading per line — the rhythm would drift. Bottom-only is neutral.

**Issue 4 — action-bar labels at 11px. (Low)**

The "Call" and "Chat" labels in `MobileActionBar` computed to 11px — the only sub-12px
text found anywhere on the site. Raised to 12px (`text-[0.75rem]`), which still fits the
56px button comfortably.

**What is already right.** The fluid scale is genuinely fluid — `clamp()` on every
display and body token with no breakpoint overrides, so type never jumps. Base font
size is 16px and `input, select, textarea` are pinned to `max(16px, …)`, which is what
stops iOS zooming on focus. `text-wrap: balance` on headings, `pretty` on paragraphs,
and `measure` utilities cap the reading column. Apart from the two items above, no text
on the site computes below 12px at any viewport.

### 3.4 Cards

No overflow in any grid at any viewport. Card media declares an aspect ratio in every
case, so there is no load-time shift.

One measurement worth recording, because it looks like a defect and is not: the card
title links in `ServicesPreview` and `FeaturedProducts` measure 23×55–133px, which is
below the 24px minimum. They are **stretched links** —
`after:absolute after:inset-0 after:content-['']` over a `relative` card — so the actual
hit area is the entire card, several hundred pixels tall. The rect of the `<a>` is not
the target. No change needed; noted here so it is not "re-found" and "re-fixed" later.

### 3.5 Forms

The quote form is sound on mobile. Fields stack to one column below `sm`, inputs
measure ~52px tall (comfortably past 44px), the 16px floor prevents iOS zoom, and the
honeypot is correctly parked off-screen at `left-[-9999px]` rather than `display: none`.

One measured item, deliberately **not** changed: the "Send the file on WhatsApp" link
computes 170×16px. WCAG 2.2 §2.5.8 explicitly exempts targets whose size is constrained
by the line-height of surrounding sentence text. Padding it would break the paragraph's
leading to satisfy a rule that does not apply.

### 3.6 Footer

**Issue 5 — link columns crushed at tablet width. (Medium)**

The footer's outer grid went `sm:grid-cols-2` while the link-column wrapper inside it
was `sm:grid-cols-3`. At 768px that put three columns inside one half-row — roughly
80px each — so "Digital printing" and "Books & journals" broke across two lines apiece.

Fixed by letting the wrapper span the full row until `lg`:
`sm:col-span-2 sm:grid-cols-3 lg:col-span-7 lg:col-start-6`. Each column is now ~208px
at 768px.

**Issue 3 — standalone links below the 24px minimum. (Medium)**

Footer navigation links measured 22.5px tall with 12px gaps. WCAG 2.2 §2.5.8 requires
24px, and the spacing exception does not rescue them at `gap-3`. They now carry
`inline-block py-1.5` and the list's `gap-3` was removed — targets measure **38px** and
the visual rhythm is unchanged, because the padding replaces exactly the gap it removed.

Also fixed in the same pass: legal links 32px, contact detail links 34px, service index
jump links 35px, 404 "Or try" links, and the drawer's phone/email links to `min-h-11`.

The email link in `HomeCta` measured 201×**20px** and the phone link 194×26px — both
standalone (sole content of a `<dd>`), so neither is inline-exempt. Now 32px and 34px.

### 3.7 Portfolio

**Issue 6 — tile ratio contradicted its column span. (Medium)**

Every third portfolio tile forced `ratio="wide"` (16:9), but the two-column span that
ratio was designed for (`lg:col-span-4`) only exists from 1024px. Below `lg` the result
was a squat 16:9 tile sitting between 3:4 portraits every third row, at 320px and 768px
alike.

The ratio now follows the item below `lg`, and 16:9 applies only where the span exists:

```jsx
ratio={item.ratio ?? 'portrait'}
className={cn('rounded-lg border border-paper-400', wide && 'lg:aspect-[16/9]')}
```

---

## 4. Issues by requested category

**Overflow.** One, and only one: the fixed header row at 320px (§3.1). Document-level
overflow is clean at all three viewports with the mask lifted. Note that
`body { overflow-x: hidden }` remains in `globals.css` — nothing currently needs it, but
it will silently swallow the next regression. Consider removing it so overflow fails
loudly, or keeping it and adding a CI check that measures with it lifted.

**Spacing.** The footer's tablet column collapse (§3.6) was the only true spacing
defect. Section rhythm, gutters and grid gaps are mobile-first and step up cleanly.

**Typography.** The `Reveal` descender clip (§3.3) — the most consequential finding in
this audit, because it is permanent, sitewide, and scales with type size. Plus 11px
action-bar labels.

**Tap targets.** Real failures were confined to standalone text links at 20–23px. Icon
buttons were already 44px throughout. Three apparent failures were false positives —
stretched links, an off-screen honeypot, and an inline sentence link — and are
documented above so they are not "fixed" into regressions later.

---

## 5. Changes applied

| File | Change |
|---|---|
| `src/components/motion/reveal.tsx` | `pb-[0.15em] -mb-[0.15em]` on the clip wrapper |
| `src/components/layout/navbar.tsx` | Icon call button `hidden … xs:grid md:hidden` |
| `src/components/layout/mobile-action-bar.tsx` | Labels 11px → 12px |
| `src/components/layout/mobile-menu.tsx` | Close button 40 → 44px; drawer contact links `min-h-11` |
| `src/components/layout/footer.tsx` | `sm:col-span-2` on link wrapper; links to 38px; legal links to 32px; address links `min-h-11` |
| `src/sections/home/shared.tsx` | `ArrowLink` 26 → 38px |
| `src/sections/home/home-cta.tsx` | Email link 20 → 32px; phone link 26 → 34px |
| `src/sections/portfolio/portfolio-grid.tsx` | Ratio follows item below `lg` |
| `src/sections/contact/contact-details.tsx` | Contact links to 34px; map placeholder capped `max-w-md` |
| `src/sections/services/service-list.tsx` | Jump links to 35px |
| `src/sections/about/studio-story.tsx` | Stats `md:grid-cols-4` instead of `lg:` |
| `src/components/ui/badge.tsx` | `size="sm"` 11px → 12px |
| `src/app/not-found.tsx` | "Or try" links to 34.5px |

`npx tsc --noEmit` passes.

---

## 6. Not changed — recommendations

**40 tap targets measure 24–44px.** These pass WCAG 2.2 AA (24px) but miss Apple's
44px guidance. They are overwhelmingly text links — footer columns at 38px, service
jump links at 35px, contact links at 34px. Taking them all to 44px would visibly loosen
the editorial density the design is built on. Recommend leaving them unless user
testing shows mis-taps; the ones that mattered most (the 20–23px group) are fixed.

**`featured-work.tsx` and `capabilities.tsx` are orphaned.** The homepage no longer
imports either. They still compile and still carry fixes from an earlier pass in this
audit. Worth deleting so they do not drift.

**`body { overflow-x: hidden }`** — see §4.

**Test on real devices before launch.** Particularly iOS Safari, where `overflow: hidden`
body-scroll locking behind the drawer behaves differently from Chrome, and where
`100vh` and the keyboard interact badly with fixed bottom bars like `MobileActionBar`.

---

## 7. Verification status

**Verified by measurement (pre-fix):** every finding in §3. Each pixel value in this
report came out of the DOM at the stated viewport.

**Verified statically (post-fix):** the applied changes, by class-string inspection and
by arithmetic against the measured values — e.g. the header actions row drops from a
measured 181px to 129px, giving 251px inside the 280px content box.

**Not yet re-measured in a browser.** Re-running the harness needs the dev server
restarted, and that action was blocked by a permission prompt in this session. The
fixes are typecheck-clean but have not been re-measured end to end. To close that gap,
restart the server and re-run the harness — it will confirm the header fits at 320px,
`clippedBy` drops to zero on all three headline lines, and no target measures under 24px.

---

*Audit harness and screenshots are in the session scratchpad under `audit/` —
`audit.js`, `out/results.json`, and per-viewport screenshots.*
