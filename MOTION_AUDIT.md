# Motion Audit

**Thoorigai Prints** — motion, interaction and depth review
Audited and extended: 21 August 2026
Scope: every animation, transition, hover state and scroll behaviour in `src/`, on all ten routes, at three viewport classes.

---

## 1. Verdict

Most motion audits are written against a site that has none. This one is not.

The motion architecture here was already built, and built properly: one entrance pattern used everywhere, scroll-linked section handovers, a pointer field with real mass, a 3D fold sequence that is never in the critical path, and a reduced-motion brake enforced in three independent places so it cannot be forgotten. Reading it, the temptation is to add things. Almost every addition would have made it worse.

So the audit went looking for the opposite: **places where the system was built and not applied.** There were six, and one of them was the last thing on every page.

| | Before | After |
|---|---|---|
| Footer motion | none — 0 animated elements | 6 reveals, drifting mark, 4 hover treatments |
| Gallery plates with an entrance (of 35) | 0 | **35** |
| Editorial rows with scroll depth (of 14) | 0 | **14** |
| Closing CTA bands with layered depth (of 2) | 0 | **2** |
| Products grid tiles floating (of 9) | 0 | **9** |
| Ambient loops running on a phone | up to 9 per page | **0** |
| Device classes with distinct motion behaviour | 2 | **3** |
| Reading-progress indication | none | hairline in the header |
| Reduced-motion enforcement points | 3 | 3 *(verified, unchanged)* |

---

## 2. What was already right, and should not be touched

### 2.1 Smooth scrolling — Lenis, correctly conditional

[`scroll-provider.tsx`](src/providers/scroll-provider.tsx) drives the real `window.scrollY` rather than faking it with a transform. That distinction is the whole ballgame: because the scroll position is genuine, `IntersectionObserver` still fires, `useScroll` still reads correctly, the scrollbar still tracks, find-in-page still lands where it should, and anchor links still work. A transform-based fake breaks every one of those.

It is destroyed outright — not merely stopped — under reduced motion, and never constructed at all on a coarse pointer. Both are right. Touch scrolling is a problem the platform already solves better than any library, with correct rubber-banding and off-main-thread momentum; `syncTouch` would take all of that away in exchange for nothing.

Anchor handling is delegated to Lenis's own `anchors` option and CSS `scroll-behavior` is switched off whenever `html.lenis` is present, so the two never animate the same value at once. That fight is the single most common Lenis bug and it is already avoided here.

**Verdict: correct. Left alone.**

### 2.2 The entrance system

Four wrappers, one pattern: `FadeUp` (16px rise, 480ms — the default), `FadeIn` (opacity only, for photography), `Reveal` (clip-path window, hero headlines only), and `Stagger` in two modes.

The two stagger modes are the part worth defending. **Group** reveals every child from one trigger, cascading at 60ms and capping at six steps. **Stream** gives every child its own trigger. Stream exists because in group mode a nine-card grid in a single mobile column finishes animating while its bottom tiles are two screens below the fold — the visitor scrolls down to content that has already quietly arrived. Getting that distinction right is the difference between a reveal system and a reveal gimmick.

The viewport preset is `amount: 'some'` with a `-15%` bottom margin rather than a threshold ratio. That is not a stylistic choice: `amount` is a fraction of *the observed element's own area*, so an element taller than `viewport ÷ threshold` can never reach it, the observer never fires, and the content stays at `opacity: 0` permanently. A nine-card grid on a phone is already past that line.

**Verdict: correct, and better reasoned than most. Left alone.**

### 2.3 Section handovers

Every section gets exactly one boundary treatment, chosen by how the boundary is drawn:

- A `divided` section is separated by a hairline, so [`SectionSeam`](src/components/motion/section-seam.tsx) draws that hairline across as the band arrives — 1px, one shade off the background, over `--d-scene`, triggered early so it is already running when the band's own content starts revealing. That overlap is what "connected" actually means; everything else is decoration.
- A section separated by a change of paper tone cannot animate its boundary, so [`SectionTransition`](src/components/motion/section-transition.tsx) settles the content instead — 8px, scroll-*linked* rather than time-triggered, so it is still moving while the visitor is still moving.

Never both. A rule that draws *and* content that rises is two answers to one question, and the second one always looks nervous.

**Verdict: this is the best idea in the codebase. Left alone.**

### 2.4 Hero motion

Four layers of depth, none of them decorative:

1. A feather watermark on an 11-second drift.
2. A pointer field where the copy leans slightly *against* the cursor and the photograph drifts *with* it. The opposing directions are what produce depth — both moving the same way reads as the page sliding.
3. The photograph scaled to 1.06 inside a frame that never moves, so the drift never exposes the frame edge.
4. A WebGL fold sequence that cross-fades in only after the poster has decoded *and* the browser has gone idle, on capable devices only, behind an error boundary that silently restores the photograph on any failure.

The loading order is the part to protect. The photograph is `priority`, is the LCP element, and stays the LCP element on every device — the canvas is never in the critical path. A visitor on a cheap phone gets a finished photograph of real work, which is a perfectly good hero.

**Verdict: correct. Left alone.**

### 2.5 Interface state is CSS, not Framer

Four utilities in `globals.css` — `motion-tint`, `motion-lift`, `motion-nudge`, `motion-zoom`, plus `motion-button` carrying two tempos — and the rule that a component picks the one naming what changes rather than writing its own timing.

The division is explicit: **Framer owns entrances, scroll and presence; CSS owns state; never both on the same property of the same element.** Hover states need no JavaScript, cannot desynchronise from their element, and Tailwind already scopes every `hover:` behind `@media (hover: hover)` so none of them stick to a finger on a phone.

**Verdict: correct. All new work in this audit uses these utilities rather than inventing timings.**

### 2.6 Reduced motion, in three places

`MotionConfig reducedMotion` in the provider; a CSS brake keyed off both `prefers-reduced-motion` *and* the site's own footer toggle; and `Parallax`/`Float` rendering no transform at all rather than a transform of zero.

The CSS brake matters most, and for a non-obvious reason: Framer writes each reveal's hidden state into the *server-rendered* markup, and its own `reducedMotion` handling can only undo that after hydration. One frame of a blank section is exactly what someone who asked for less motion should not get. The brake cancels it in CSS, before any JavaScript runs. `clip-path` is named separately, because it is not a Framer positional key and `reducedMotion` never touches it.

**Verdict: correct, and thorough. Verified, not changed.**

---

## 3. What was missing

### 3.1 The footer did not move — at all

**The single largest gap in the audit.**

Every band above it revealed. The seam between sections drew itself. Cards lifted, images zoomed, the mark drifted. And then the page ended on a wall of static text.

That reads as the site running out of energy at exactly the point a visitor who has scrolled the whole page is most likely to act — and the footer is not a minor surface here. It carries the closing call to action, the phone number, the WhatsApp line, the email, the address, the hours and every secondary route.

**Implemented** in [footer.tsx](src/components/layout/footer.tsx):

- A reveal sequence in reading order: closing ask → brand column → three link columns cascading → legal bar. The order is the point. Four things arriving at once is a flash; four things arriving in sequence leads the eye down the plate.
- The mark's feather at 4%, drifting, top-right — so the page closes on the note the hero opened with.
- Contact rows respond as a unit: the icon steps forward as the value lifts to `paper-50`. Two small things moving together read as one row responding; either alone reads as a stray transition.
- Footer and legal links draw the same bronze underline the navigation and the arrow links use, so one hover language runs the entire site.
- The logo lifts half a pixel on hover.

It remains a **server component**. Every reveal is one of the shared wrappers, each its own small client boundary, so the markup, links and contact details are all server-rendered and none of it depends on JavaScript arriving.

### 3.2 No sense of position in a long page

The homepage is ten bands. The portfolio is four, one of which is a 35-image wall. A fixed header gives a visitor no sense of where they are inside that.

The scrollbar answers it — except on the platform where the question matters most. macOS hides the scrollbar entirely until you scroll, and a trackpad flick never shows it long enough to read.

**Implemented**: [`ScrollProgress`](src/components/motion/scroll-progress.tsx), a bronze hairline filling across the header's existing bottom border.

It occupies a border that is already there, so nothing moves and no vertical space is spent. It appears only once the header has taken its background — over the transparent bar on the hero it would be a bronze line floating across a photograph. `scaleX` on a left-origin element: one composited property, no layout, no paint. Raw scroll goes through the same spring the parallax and settle use, because native scroll arrives in discrete chunks and an unsprung rail visibly staircases during iOS momentum.

Under reduced motion it renders nothing at all. It is ambient decoration driven purely by scroll position — the exact category that should disappear rather than be slowed down.

### 3.3 The two closing bands were the flattest things on the site

The homepage CTA on `ink-950` and the shared CTA closing four inner pages were plain rectangles. Flat is the right default for a band carrying body copy. It is the wrong one for the band that exists purely to be acted on — **a page whose most important element is also its plainest has buried the lede.**

**Implemented** in [cta-section.tsx](src/sections/shared/cta-section.tsx) and [home-cta.tsx](src/sections/home/home-cta.tsx) — three layers, no images:

1. A hairline rule grid at ~4.5%, masked to fade out downward, so the plate has a surface for light to fall on.
2. Two radial washes — bronze arriving top-left, press blue answering bottom-right — sized in `rem` so they scale with the type rather than the viewport. This is what stops `ink-900` reading as a black rectangle.
3. The mark's feather, drifting.

All CSS gradients and one inline SVG. No request, no bitmap, no bytes past the stylesheet, and nothing that can shift the layout — every layer is absolutely positioned inside a section that already reserves its height.

**The palette is unchanged.** The washes sit at 16–24% alpha of `#C18546` and `#344F7C`, under the threshold where either would start reading as a colour of its own rather than as light falling on ink.

### 3.4 Fourteen plates with no scroll depth

The portfolio's eight project rows and the services page's six discipline rows are the site's two long alternating columns — the exact layout that reads as depth with a little parallax and as a flat list without it. Neither had any.

**Implemented**: 12px `Parallax` on every plate in both, **with the direction alternating with the row**. That last part is the whole trick. Two plates travelling the same way down a long column read as the page sliding; alternating them makes each row its own plane.

12px is well under the 20px ceiling the guidelines set, and `Parallax` clamps it regardless. It is inert below `lg` and under reduced motion, rendering *no transform at all* rather than a transform of zero — so nothing is promoted to a compositor layer for a movement that never happens.

### 3.5 The portfolio gallery assembled without a reveal

The 35-plate masonry wall — the largest single collection of imagery on the site — had hover and lightbox but no entrance. Every other grid revealed; this one appeared.

**Implemented**: `Stagger` in **stream** mode. That mode specifically: the wall is four screens tall on a phone. In group mode the plates near the bottom would finish revealing while still well below the fold.

The reveal wrapper is the CSS-column child rather than the button, because `break-inside-avoid` has to sit on whatever the column actually breaks around — putting the transform inside it would let a column slice a plate away from its caption.

### 3.6 The products grid did not float

The homepage's catalogue tiles rest on air. The products page — the same content, given more room — sat flat on the paper.

**Implemented**: `Float` at depth 0.5 with per-index desynchronisation. A step under the homepage's 0.6, because these tiles are larger and the same travel on a bigger card reads as drift rather than as weight.

---

## 4. Mobile, tablet, desktop — three behaviours

This was the audit's other real finding, and it is a performance one.

### The problem

`Parallax` was already banned below `lg`. `Float` was not — it ran everywhere, gated only by reduced motion.

A phone renders the catalogue in a single column, so **up to nine tiles can be on screen at once, each driving an infinite transform loop**, while the only movement the visitor cares about is their own scrolling. That is a battery cost paid for decoration nobody is looking at, on the device class least able to afford it.

### The fix

Amplitude is now scaled by viewport width, from a `float.scale` token in [`lib/theme/animations.ts`](src/lib/theme/animations.ts):

| Class | Breakpoint | Float | Scroll parallax | Pointer parallax | Reason |
|---|---|---|---|---|---|
| **Mobile** | < 768px | **off** | off | off | No hover, small screen, battery. Nine idle loops for nothing. |
| **Tablet** | 768–1023px | **55%** | off | off | Tiles are larger relative to the viewport; full travel reads as drift. |
| **Desktop** | ≥ 1024px | **100%** | on, ≤ 20px | on | Room for depth, and a pointer to read it with. |

The mobile case removes the animation object entirely rather than setting it to zero. A zero-travel keyframe loop still runs, still promotes the element to its own compositor layer, and still costs the battery it was meant to save.

Because `useBreakpoint` returns `false` until it has measured, the first client render is the mobile case for everyone. That is the right way round — the conservative branch renders no animation at all, so nothing starts and then has to be taken away a frame later.

**What survives on mobile**: every scroll reveal, every section seam, every section settle, the page transition, the drawer, and every press state. What stops is the idle loop.

### Already correct on touch

- `MouseParallax` provides no context at all on a coarse pointer — layers render as plain elements with nothing to composite.
- Lenis is never constructed without a wheel to smooth.
- Every `hover:` is scoped behind `@media (hover: hover)` by Tailwind, so no state sticks to a finger.
- Tap targets are 44px minimum throughout; the FAQ rows are tappable at both ends.
- The mobile drawer traps focus, returns it to the trigger, locks body scroll, closes on Escape and on route change, and staggers its items with the same six-step cap the rest of the site uses.

---

## 5. Depth and pseudo-3D

The brief asked the site to *feel* 3D without Three.js everywhere. It largely already did. The inventory, after this audit:

| Technique | Where |
|---|---|
| Real WebGL | Hero fold sequence only — lazy, idle-deferred, capability-gated, error-bounded |
| Pointer parallax, opposing planes | Hero copy vs. photograph |
| Pointer parallax, media-scoped | Service and catalogue cards — image answers the cursor, frame stays put |
| Scroll parallax, alternating | Portfolio rows, service rows *(new)*, why-us, portfolio hero |
| Floating objects | Homepage catalogue tiles, product showcase, products grid *(new)* |
| Layered gradient depth | Both CTA bands *(new)*, honey wash, paper grain |
| Drifting ornament | Hero, catalogue band, footer *(new)*, both CTA bands *(new)* |
| Mounted-plate shadows | Every `PrintPlate` — hairline edge, low wide shadow deepening on hover, inset matte |
| Overlapping composition | Hero media bleeding through the mobile gutter; alternating row offsets |
| Overscan | 1.06 scale on parallaxed media, so drift never exposes a frame edge |

Two constraints held throughout, both from the existing guidelines:

- **The frame never moves while its image does.** A frame that moves is a layout that moves.
- **Depth is a ratio, not a distance.** A layer at `depth={1}` travels the full pointer range; everything else is a fraction. Set the front plane to 1 and work backwards, and the parallax stays coherent when someone later changes the range in one place.

---

## 6. One deliberate exception to the rules

The FAQ accordion animates `height`, which the guidelines say not to do.

A disclosure has no other honest way to open. It is held to `--d-base` and paired with an opacity fade so the text arrives as the panel finishes rather than stretching with it.

The more important decision in that component is not the animation. Panels are **always rendered** and collapsed with `height: 0`, never mounted on open. Conditional rendering inside `AnimatePresence` is the idiomatic Framer pattern and it would have put exactly one of twelve answers into the server-rendered markup — a page of questions with no answers, and find-in-page missing eleven of them. `inert` keeps the collapsed subtree out of the accessibility tree and out of the tab order while leaving it in the HTML, which is precisely the split this needs.

That trade-off — motion pattern versus content being in the document — is worth stating because the idiomatic answer was the wrong one.

---

## 7. Motion inventory, after

Reveal counts are measured from the server-rendered document — the elements
Framer marks `data-motion` and animates in on scroll. Ambient and scroll-linked
counts are from source, since both branches are decided at runtime by viewport.

| Page | Reveals | Ambient loops (desktop) | Scroll-linked | Pointer fields |
|---|---|---|---|---|
| Home | 75 | 4 drifts + 9 floats | 7 settles + 2 parallax | 3 |
| Portfolio | 51 | 1 drift | 3 seams + 10 parallax | — |
| Services | 27 | 1 drift | 3 seams + 6 parallax | — |
| Products | 29 | 1 drift + 9 floats | 2 seams | — |
| About | 40 | 1 drift | 3 seams + 2 settles + 2 parallax | — |
| FAQ | 30 | 1 drift | 2 seams | — |
| Contact | 16 | 1 drift | 1 seam | — |
| Privacy / Terms / Cookies | 17 – 22 | 1 drift | 1 seam | — |

Every page also carries the header progress rail. Floats are counted per rendered
tile, drifts per watermark; the footer's drift and the closing band's are both
included in each page's figure.

**On mobile the ambient-loop column is 0 for every page**, and the scroll-linked
column drops to seams and settles only. That is by construction, not by
coincidence — see §4.

Because `useBreakpoint` has not measured on the first client render, the
server-rendered document contains **no** float markup at all: the mobile branch
renders a plain element. The animation is added after hydration, on devices that
qualify for it.

---

## 8. What was deliberately not added

Listed because restraint in a motion audit needs to be on the record.

- **A page-load animation.** Nothing animates on load except the hero. A whole-page entrance on every navigation is a delay wearing a costume.
- **Character-by-character text reveals.** The `Reveal` wrapper works a line at a time, the way a sheet comes off a stack. Per-character is a 2021 tic and it wrecks screen-reader output.
- **A custom cursor.** It replaces a control the operating system already got right, and it is invisible to two of the three device classes.
- **Exit animations on scroll.** A band that animates on the way out pulls attention backwards, to something the visitor has already decided to leave.
- **Layout animations between filter states.** The portfolio remounts its list on a filter change so the reveal replays. Eight rows sliding past each other looks busier and reads worse.
- **Magnetic buttons, tilt cards, blob cursors, marquee-on-scroll.** Each is a signature that belongs to whoever did it first. This site's signature is the clip-path line reveal and the seam that draws itself.
- **More than one entrance pattern.** One entrance is what makes a site feel composed rather than assembled. The moment there are four, every section starts arguing with the next.

---

## 9. Files touched

**New**

- `src/components/motion/scroll-progress.tsx`
- `src/sections/faq/faq-list.tsx`
- `src/sections/legal/legal-document.tsx`

**Modified for motion**

- `src/components/layout/footer.tsx` — full reveal sequence, hover language, drifting mark
- `src/components/layout/navbar.tsx` — reading-progress hairline
- `src/components/motion/float.tsx` — three device classes
- `src/components/motion/index.tsx` — export surface
- `src/lib/theme/animations.ts` — `float.scale` tokens
- `src/sections/shared/cta-section.tsx` — layered depth
- `src/sections/home/home-cta.tsx` — layered depth
- `src/sections/portfolio/image-gallery.tsx` — streamed reveal
- `src/sections/portfolio/project-showcase.tsx` — alternating parallax
- `src/sections/services/service-list.tsx` — alternating parallax
- `src/sections/products/product-grid.tsx` — float

**Unchanged, and deliberately so**: every file in §2.

---

*Companion document: [WEBSITE_COMPLETENESS_REPORT.md](WEBSITE_COMPLETENESS_REPORT.md).*
