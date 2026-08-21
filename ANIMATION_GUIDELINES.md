# Animation guidelines

Thoorigai Prints — the motion system, what it is for, and how to use it without
having to make a judgement call every time.

This implements **MASTER_PROJECT_PLAN.md §9**. Where this document and §9
disagree, the disagreement is deliberate and is written down in
[Deviations from §9](#deviations-from-9), with the reason.

---

## The one-paragraph version

Motion here is short, few and confident. Nothing bounces, nothing overshoots,
nothing loops. There is **one** scroll-reveal pattern — a 16px rise and a fade
over 480ms — and it is used everywhere. Framer Motion owns entrances, scroll and
presence; CSS owns hover, focus and press. Every duration and curve comes from
one token file with a CSS twin. Nothing that carries meaning depends on
animation to be read.

---

## The motion hierarchy

Four tiers. A tier may never pull attention from the one above it, and when two
want to move at the same moment, the higher tier wins.

| Tier | What it is | Timing | Examples |
|---|---|---|---|
| **1 · Subject** | The thing the page is about arriving | 480ms, once | Hero headline reveal |
| **2 · Structure** | Content and sections taking their places | 240–480ms, once | Scroll reveals, staggers, the seam, route fade |
| **3 · Response** | The interface answering an input | 100–240ms | Hover, press, focus, the filter pill |
| **4 · Ambient** | Continuous motion nobody asked for | 6s+, or scroll-linked | Smooth scroll, mouse parallax, floating tiles, the settle |

Tier 4 is the one to watch. It is the tier that makes a site feel expensive and
the tier that makes a site feel cheap, and the difference is entirely amplitude:
**if a visitor can describe what the ambient layer is doing, it is doing too
much.** Every number in it is deliberately just past the threshold of notice —
18px of pointer travel, 10px of float, 8px of settle.

The tiers also decide what gets cut first. Under reduced motion, tier 4 is
removed outright and tier 2 becomes plain visibility; tiers 1 and 3 survive as
opacity. On a phone, tiers 3 and 4's pointer-driven half never exists at all,
because there is no pointer.

---

## Where things live

| File | What it is |
|---|---|
| `src/lib/theme/animations.ts` | **The source of truth.** Durations, curves, distances, stagger, trigger points. |
| `src/styles/globals.css` | The CSS twin of the same tokens (`--d-*`, `--ease-*`), the five interface-motion utilities, and the reduced-motion brake. |
| `src/animations/transitions.ts` | Named transitions built from the tokens. |
| `src/animations/variants.ts` | The variant vocabulary. |
| `src/components/motion/` | What sections actually import. |
| `src/providers/motion-provider.tsx` | `LazyMotion`, `MotionConfig`, and the motion preference. |
| `src/providers/scroll-provider.tsx` | Lenis, and the conditions under which it is allowed to exist. |

---

## Tokens (§9.1)

Durations — seconds in TypeScript, milliseconds in CSS, same numbers.

| Token | CSS | Value | Use |
|---|---|---|---|
| `duration.instant` | `--d-instant` | 100ms | Tap feedback, checkbox, focus ring |
| `duration.fast` | `--d-fast` | 180ms | Hover, colour, border, chip |
| `duration.base` | `--d-base` | 240ms | Card lift, dropdown, tab indicator |
| `duration.slow` | `--d-slow` | 320ms | Modal, drawer, sheet, cross-fade |
| `duration.slower` | `--d-slower` | 480ms | Section reveal, image scale |
| `duration.scene` | `--d-scene` | 1200ms | 3D entrance, intro rule |

Curves:

| Token | CSS | Curve | Use |
|---|---|---|---|
| `easing.standard` | `--ease-standard` | `cubic-bezier(.22,1,.36,1)` | **The default.** Fast out, long settle |
| `easing.entrance` | `--ease-entrance` | `cubic-bezier(.16,1,.3,1)` | Arriving from off-screen |
| `easing.exit` | `--ease-exit` | `cubic-bezier(.4,0,1,1)` | Leaving — faster than arriving |
| `easing.linear` | `--ease-linear` | `linear` | Progress bars and spinners only |
| — | `--ease-editorial` | alias of `--ease-standard` | **Deprecated.** One release only |

There is no overshoot curve. The `[0.34, 1.3, 0.64, 1]` that used to be in the
token file is gone: nothing a user clicks may overshoot.

The motion tokens sit in their own `@theme static` block. `static` matters — a
plain `@theme` only emits variables that some generated utility happens to
reference, which was silently tree-shaking `--d-slow`, `--ease-entrance` and
`--ease-exit` out of the stylesheet and quietly breaking the promise that every
TypeScript token has a CSS twin.

---

## The rules (§9.2)

1. Animate **`transform`, `opacity`, `color`, `border-color`, `box-shadow`**
   only. Never `width`, `height`, `top`, `left`.
2. **One scroll-reveal pattern**: opacity 0 → 1 plus `translateY(16px → 0)` over
   480ms, once, never replayed on scroll back up.
3. Stagger grid children by 60ms, **capped at six steps**. The seventh child
   onward share the sixth's delay, so a 21-tile grid never crawls in.
4. **Travel is 16–24px.** Never a 100px slide.
5. Never animate a heading character by character. **Never animate a price or a
   spec figure.**
6. **Nothing animates on page load except the hero.**
7. No parallax on mobile, ever. No parallax over 20px anywhere.
8. Route transitions are **a fade and nothing else**.

---

## The vocabulary

### Reveals

```tsx
import { FadeUp, FadeIn, Reveal } from '@/components/motion';

<FadeUp>…</FadeUp>              // the house entrance — reach for this first
<FadeUp delay={0.1}>…</FadeUp>  // the same, held 100ms
<FadeIn>…</FadeIn>              // opacity only — photography, full-bleed media
<Reveal>Ink, paper</Reveal>     // clip-path window — hero headlines only
```

`FadeUp` is the default and usually the only one you need. `FadeIn` exists
because a 16px rise fights a full-bleed image against a frame edge. `Reveal` is
for display type, one line at a time.

There is deliberately **no** `FadeDown`, no slide-from-the-side, no scale-in.
`FadeLeft`, `FadeRight`, `FadeUpLarge` and `ScaleIn` still exist as deprecated
aliases so older files compile — they now all animate identically to `FadeUp`.
Drop the import next time you touch the file.

> One entrance is what makes a site feel composed rather than assembled. The
> moment there are four, every section starts arguing with the next one.

### Props

| Prop | Default | Notes |
|---|---|---|
| `delay` | `0` | Seconds. Passed as Framer `custom` — see [Why `delay` is `custom`](#why-delay-is-custom). |
| `as` | `'div'` | Any tag in `MotionTag`. Add to that union rather than casting. |
| `immediate` | `false` | Animate on mount instead of on scroll. **Heroes only** (rule 6). |
| `viewport` | `'enter'` | `'enter'` \| `'deep'` \| `'early'`. |
| `repeat` | `false` | Replay on re-entry. Rule 2 says don't. |
| `variants` | — | Escape hatch. If you reach for it twice, add a variant instead. |

### Stagger

```tsx
<Stagger as="ul">                         {/* one trigger, six-step cascade */}
  <StaggerItem as="li">…</StaggerItem>
</Stagger>

<Stagger as="ul" stream>                  {/* each item on its own trigger */}
```

**Group** (default) — every child reveals from one trigger, cascading at 60ms and
capping at six. Right for anything that fits roughly within one screen: a stat
strip, a three-up row, a tag list.

**Stream** — every child gets its own trigger, so a tile animates as it reaches
the fold. **Right for anything taller than a screen**: a nine-card catalogue in a
single mobile column, a twelve-row service list. In group mode those bottom tiles
finish animating while they are still two screens below the fold, and the visitor
scrolls down to content that has already quietly arrived.

In stream mode the container is a plain element rather than a variant parent,
because a Framer variant parent propagates its animation state to its children
and would override their own triggers.

> **Rule of thumb:** if the container can be taller than the viewport on a
> phone — count the items, assume one column — use `stream`.

### Presence

For things that come and go rather than scroll into view:

| Variant | Where |
|---|---|
| `scrim` | The dimmer behind a drawer or lightbox. Fades; never moves. |
| `drawerPanel` | The mobile navigation drawer. |
| `sheet` | Desktop dialogs — fade plus `scale(0.98 → 1)`. |
| `dock` | The mobile action bar rising from the bottom edge. |
| `curtain` | The first-visit intro. |
| `pageFade` | Route changes. |

These need `AnimatePresence`, which is re-exported from `@/components/motion`.

---

## Interface motion (§9.3)

**Hover, focus and press are CSS, not Framer.** They need no JavaScript, they
cannot desynchronise from the element they belong to, and Tailwind v4 already
scopes every `hover:` variant behind `@media (hover: hover)`, so none of them
stick to a finger on a phone.

What they must not do is invent their own timing. Five utilities are the only
transitions a component should declare:

| Utility | Animates | Duration | Use |
|---|---|---|---|
| `motion-tint` | colour, background, border, fill, opacity | 180ms | Links, icons, text |
| `motion-lift` | transform, shadow, border, background | 240ms | Card hover, the header on scroll |
| `motion-nudge` | transform, translate, scale | 240ms | An arrow stepping right, a rule drawing in |
| `motion-zoom` | transform, scale | 480ms | The image inside a card frame |
| `motion-button` | background, border, colour, shadow, scale | 180ms, press 100ms | Buttons — §9.3 gives them two tempos |

```html
<!-- yes -->
<a class="motion-tint hover:text-ink-900">

<!-- no -->
<a class="transition-colors duration-200 ease-editorial hover:text-ink-900">
```

If you find yourself writing `transition-[…] duration-[…]` by hand, the answer is
a sixth utility here, not a sixth tempo in a component.

**Framer owns entrances, scroll and presence. CSS owns state. Never both on the
same property of the same element** — they will fight over the transform.

The specifics §9.3 pins down, and where they now live:

- **Button hover** is a background shift. No scale, no lift, no shadow change.
- **Button press** is `scale(0.98)` at 100ms. It is the only movement a button makes.
- **Card hover** is a 2px rise, the border firming to `ink-800/16`, and one step
  of elevation — with the image inside scaling to 1.03 while the frame stays still.
- **Header on scroll** is background and hairline past 80px. Nothing else.

---

## Scroll interactions

Three, and only three.

**Scroll reveals** — everything above. Triggered as the element's leading edge
passes 85% of the viewport.

**The header** — `useScrollPosition(80)` flips a boolean past 80px; the
background and hairline fade in over 240ms.

**Parallax** — `<Parallax offset={16}>`. §9.2 caps it at 20px and bans it on
mobile outright, and the component enforces both: below `lg`, and under reduced
motion, it renders **no transform at all** rather than a transform of zero, so
nothing is promoted to its own layer for nothing. Raw scroll is passed through a
spring first, because otherwise the element tracks the wheel's discrete steps and
reads as juddering rather than as depth.

There is no scroll-progress bar and no scroll-jacking. Both were considered and
neither answers a question a visitor has.

---

## The interaction layer

Tier 4. Four mechanisms, each with a hard-coded ceiling and an off switch.

### Smooth scrolling — Lenis

`ScrollProvider` wraps the app. Lenis does not fake scrolling: it intercepts
wheel input and drives the real `window.scrollY` towards a target each frame.
That is why `IntersectionObserver` still fires, `useScroll` still reads
correctly, the scrollbar still tracks, and find-in-page still lands.

It is constructed **only** where there is a wheel to smooth:

- **Not under reduced motion.** Someone who asked for less motion did not ask
  for their scroll wheel to be reinterpreted. The instance is destroyed, not
  stopped.
- **Not on coarse pointers.** Touch scrolling is a solved problem the platform
  solves better — correct rubber-banding, correct momentum, off the main thread.
  `syncTouch` trades all of that for nothing.

Both are watched rather than sampled once, so the footer's motion switch takes
effect on the next frame.

Two integrations are load-bearing:

- **`globals.css` turns off `scroll-behavior` whenever `html.lenis` is present.**
  Lenis and CSS smooth-scroll animate the same value; with both running, a hash
  link produces a visible fight between two easing curves. Anchors are handed to
  Lenis's own `anchors` option, landing on the same offset as
  `scroll-padding-top`.
- **`useLockBodyScroll` stops Lenis as well as the body.** `overflow: hidden`
  stops the browser, but Lenis drives the scroll position itself and would keep
  going — so a wheel gesture over an open drawer would move the page underneath
  it the moment the drawer closed.

Cost: ~19kB raw, ~7kB over the wire, in a route chunk rather than the shared one.

### Mouse parallax

```tsx
<MouseParallax range={pointer.mediaRange}>
  <MouseParallaxLayer depth={0.22} invert>…copy…</MouseParallaxLayer>
  <MouseParallaxLayer depth={0.6}>…photograph…</MouseParallaxLayer>
</MouseParallax>
```

A container publishes the pointer's position inside it as two motion values,
normalised to -0.5…0.5. Layers multiply by their own `depth`. **Nothing
re-renders** — the position stays in motion values end to end, so a mouse
crossing the hero costs no React work.

Three rules:

- **Depth is a ratio, not a distance.** Set the front plane to 1, work
  backwards. Range is set once on the field, never per layer.
- **Opposing directions make the depth.** The hero's copy uses `invert`; the
  photograph does not. Both moving the same way just reads as the page sliding.
- **The frame never moves, the image inside it does.** §9.3's card rule, and it
  applies to the hero for the same reason: a frame that moves is a layout that
  moves. Drifting layers carry `scale-[1.06]` as overscan, or the drift exposes
  the background at the frame's edge.

The spring is not optional. Raw pointer position stops dead when the mouse stops;
the spring is what gives the layers mass, and mass is the whole difference
between depth and gimmick.

Off on touch and under reduced motion — in which case no field is provided at
all and the layers render as plain elements with no transform to composite.

### Floating product motion

```tsx
{items.map((item, i) => <Float key={item.id} index={i} depth={0.6}>…</Float>)}
```

The catalogue tiles — business cards, brochures, packaging — rest on air rather
than sit on the page. Four things keep it on the right side of the line:

- **Slow.** Six seconds per bob. Quicker reads as a fidget, not as weight.
- **Small.** 10px and 0.6° at full depth. The rotation is what sells it; a sheet
  that rises without changing angle reads as a lift, not a float.
- **The periods do not divide.** Rotation runs at 1.45× the travel period, so the
  cycle never repeats exactly and the eye never finds the loop.
- **A row never moves in lockstep.** `index` offsets each sibling by 450ms.
  Without it, eight tiles rising together read as one object.

It runs only while on screen — `whileInView` with `once: false` parks the
animation when the section leaves, which across eight tiles is the difference
between an idle rAF loop and a flat battery.

### Hover

Three things arrive together on a showcase card: the card lifts 2px, its shadow
deepens one step, and the photograph inside answers the cursor. They are on
three different elements on purpose — the lift is CSS on the card, the drift is a
motion value on a layer inside the frame, the zoom is CSS on the image. Nothing
shares a property with anything else, so nothing fights.

`portfolio-preview` is deliberately excluded: three of its four images are at
their resolution ceiling, and both the zoom and the overscan a drift needs would
show it.

---

## Section and route transitions

**Sections** reveal through `SectionHeader` and `SectionIntro`, which both wrap
their heading in `FadeUp` and their action in `FadeUp delay={0.1}`. They are
deliberately identical. Before this, sections built on `SectionHeader` had a
static heading above a grid that animated — the one thing on screen that did not
move was the thing you read first.

**Every section also gets exactly one boundary treatment, and which one follows
from how the boundary is drawn.** `Section` decides; no caller has to.

| Boundary | Treatment | Why |
|---|---|---|
| A hairline (`divided`) | `SectionSeam` — the rule draws itself across, left to right, over 1200ms | The rule is the one element that belongs to both sections at once, so it is the natural thing to hand the eye over with |
| A change of paper tone | `SectionTransition` — the band's content settles 8px, scroll-linked | A tone change cannot be animated without redesigning it, so the content carries the handover instead |

Never both. A rule that draws *and* content that rises is two answers to one
question, and the second one always looks nervous.

The settle is scroll-**linked**, not triggered: the movement is bound to scroll
position rather than started by it, so it is still moving while the visitor is
still moving. That is what "connected" means in practice — the boundary is a
handover rather than one band stopping and another starting. 8px is the entire
budget, because the content inside is already revealing on its own 16px and
§9.2 caps travel at 24px; the two compound to exactly the ceiling and never past
it. There is no exit motion: a band that animates on the way out pulls attention
backwards, to something the visitor has already decided to leave.

**Routes** fade in over 300ms via `<PageTransition>` in `app/layout.tsx`. Two
things about it are load-bearing:

- **The first load does not fade.** The flag lives above the keyed element, so
  the ref survives navigations while the inner element remounts on each one.
  First render is `initial={false}`. Without this, rule 6 breaks twice over: the
  whole document would fade in on top of the hero's own entrance, and the
  prerendered HTML would ship the entire page at zero opacity.
- **Only the incoming half exists.** See [Deviations](#deviations-from-9).

---

## Reduced motion (§9.4)

Enforced in three places so it cannot be forgotten:

1. **`MotionConfig reducedMotion`** in `MotionProvider` — Framer drops every
   transform-based variant to a plain opacity change.
2. **`globals.css`** — the duration brake, plus
   `[data-motion] { opacity: 1; transform: none; clip-path: none }`, which is
   what actually delivers §9.4's "content is simply there". It applies **before
   any JavaScript has run**, which a Framer-side transition cannot.
3. **`<Parallax>`** — renders no transform at all.

Two sources feed it: the operating system's setting, and the site's own
**Reduce motion** switch in the footer, persisted to `localStorage`. An inline
script in `app/layout.tsx` sets `<html data-motion-preference="reduced">` before
first paint, so someone who has turned motion off never sees a frame of it.
`MotionProvider` then mirrors the *effective* answer onto that attribute, so it
keeps up if the OS setting changes mid-session.

When the OS is already asking for reduced motion, the footer switch shows as on
and disabled. It cannot override the OS, and pretending otherwise would be a lie.

`clipPath` needs naming separately in the CSS: it is not one of Framer's
positional keys, so `reducedMotion` never touches it, and the headline wipe would
otherwise survive the brake.

**No JavaScript at all** is handled by the same `data-motion` marker: a
`<noscript>` rule in `app/layout.tsx` forces every reveal visible. Framer writes
each reveal's hidden state into the server-rendered markup — that is what makes
the entrance seamless, and it is also what would leave 53 elements on the
homepage at `opacity: 0` if the JavaScript never arrived.

---

## Two traps worth knowing

### Why `delay` is `custom`

Every entrance variant is a **function** of a delay, read from `custom`:

```ts
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.base },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { ...reveal, delay } }),
};
```

This is not a style preference. When a variant defines its own `transition`,
Framer uses it verbatim and **discards the component's `transition` prop
entirely**:

```js
// motion-dom/animation/interfaces/visual-element-variant.mjs
let { transition = visualElement.getDefaultTransition() || {} } = resolved
```

`getDefaultTransition()` returns `props.transition`, so it is only ever a
*fallback*. The previous system implemented `delay` as `transition={{ delay }}`,
which meant **every delay on the site did nothing at all** — the hero's six-step
choreography, the page heroes, the section intros, all firing simultaneously.
`custom` is resolved *inside* the variant, so it survives.

Framer 13 also offers `transition: { inherit: true }`, which shallow-merges the
component's transition in. It fixes leaf variants but not stagger containers,
whose `delayChildren` is read before that merge happens — so `custom` is the one
mechanism that works everywhere.

### Why the trigger is a margin, not an `amount`

§9.2 asks for reveals "triggered at 15% visibility". The obvious reading —
`viewport={{ amount: 0.15 }}` — is a trap.

Framer hands `amount` straight to `IntersectionObserver.threshold`, and the
threshold is a fraction of **the observed element's own area**, not of the
viewport. An element taller than `viewport ÷ 0.15` can never reach that ratio.
The observer never fires. The content stays at `opacity: 0` permanently.

That is not hypothetical. The previous default was `amount: 0.25` with a `-10%`
bottom margin, so the largest ratio a tall element could ever reach was
`0.9 x viewport / height`. On a 780px phone that is a hard ceiling of **2,808px**
— and the service list runs to roughly 8,200px in one column, the product grid to
4,200px, the portfolio grid to 4,300px. **Three page bodies that could never
appear on a phone.**

So the default is `amount: 'some'` (threshold 0), which is height-independent,
and the trigger point is set with `margin: '0px 0px -15% 0px'` — the element's
leading edge has to cross 85% of the viewport height. Visually the same moment
§9.2 describes, for an element of any size.

**Never pass a numeric `amount` to a container you have not measured.**

---

## Deviations from §9

| §9 says | What is built | Why |
|---|---|---|
| Reveals trigger at "15% visibility" | A `-15%` root margin at threshold 0 | A numeric threshold cannot fire on tall elements. Same trigger point, no failure mode. See above. |
| Page transition: 200ms out, 300ms in, 150ms overlap | 300ms in only | The App Router replaces `children` synchronously; the outgoing page has left the tree before this can hold it. Freezing `LayoutRouterContext` is a hack that breaks on Next internals. The supported route for a true cross-fade is Next's View Transitions, which would replace `<PageTransition>` rather than extend it. |
| Arrow link underline: 220ms | 240ms (`motion-nudge`) | §9.1 has no 220ms token. Keeping the system to six durations is worth 20ms nobody can perceive. |
| Card image scale: 400ms (§9.3) | 480ms (`--d-slower`) | §9.1's own table assigns "image scale" to `slower`. The two halves of the plan disagree; the token table wins. |
| Reduced motion: "transitions collapse to opacity at 120ms" | Reveals become plain visibility; CSS transitions collapse to ~0ms | The plan's delta table says to keep the existing CSS brake, which uses the standard 0.01ms pattern. §9.4's own sentence — "content is simply there" — is what the `[data-motion]` rule implements, and it works before JavaScript loads, which a 120ms Framer transition cannot. |
| Header condenses 5.5rem → 4.5rem on scroll | Constant height | §9.2 forbids animating `height`, and an un-animated 16px snap at the threshold is worse than no condense. §9.3 specifies the header's scroll motion as background and hairline only — which is now all it does. |
| Link hover: "underline thickens 1px → 2px, colour does not change" | Timing unified; which property changes left alone | Recolouring every inline link is a design-token decision, not an animation one. It belongs with the colour work in delta items 4–8, not in this pass. |
| "Nothing loops" (§9) | The catalogue tiles float continuously | Requested directly as a product requirement. Held to tier 4 discipline: 10px, 0.6°, six seconds, paused off-screen, gone under reduced motion. It is the one loop on the site and it should stay that way. |
| "No parallax on mobile, ever. No parallax over 20px" (§9.2) | Honoured, and extended to the pointer layer | Mouse parallax is desktop-only by construction — there is no pointer to track on a phone — and its 18px range sits under the same ceiling as scroll parallax. |
| Motion is "short, few and confident" (§9) | An ambient tier now runs continuously | Smooth scroll, pointer drift and float are all standing motion, which §9 did not anticipate. They are confined to tier 4, amplitude-capped, and every one of them switches off under reduced motion. If the studio wants §9 read literally, `Float` and `MouseParallax` are the two components to delete — nothing else depends on them. |
| "Never animate width" | The portfolio filter pill still animates `width` | It is `position: absolute`, so it triggers no sibling layout, and a rounded pill distorts under `scaleX`. Documented exception; the spring it used to ride is gone. |

---

## Adding motion to a new section

1. Wrap the heading block in `FadeUp` — or use `SectionHeader` / `SectionIntro`,
   which already do.
2. Wrap the grid or list in `Stagger`, its children in `StaggerItem`.
3. Count the items. **More than about four in a single mobile column? Add
   `stream`.**
4. Hover states: one of the five `motion-*` utilities. Never a bare
   `transition-*` class.
5. `immediate` only if this is the page's hero.

## Review checklist

- [ ] No hand-written `cubic-bezier(…)` or `[0.22, 1, 0.36, 1]` outside the token file
- [ ] No `duration-[…]`, `duration-200` or `ease-editorial` in a component
- [ ] No `import … from 'framer-motion'` outside `src/animations/`,
      `src/components/motion/` and `src/providers/motion-provider.tsx`
- [ ] No numeric `amount` on a container that could exceed the viewport
- [ ] Nothing animates on load except the hero
- [ ] Every reveal wrapper reaches the DOM with `data-motion` on it
- [ ] No `MouseParallaxLayer` outside a `MouseParallax`, and no field with two
      different ranges in it
- [ ] Every drifting layer carries overscan (`scale-[1.06]`), or its frame edge
      will show
- [ ] Turn on **Reduce motion** in the footer and reload — every page is fully
      readable, nothing moves, and the scroll wheel behaves natively again
- [ ] Open a drawer, scroll the wheel, close it — the page behind has not moved
- [ ] Disable JavaScript and reload — every page is fully readable
- [ ] Throttle to 4G on a phone viewport and scroll every page to the bottom —
      no section is blank
