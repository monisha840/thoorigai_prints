# 06 · Animation Plan

Motion here has one job: make a tactile product legible through a screen. Thickness, spine, foil, flute, grain and finish are what a print buyer judges and what a flat photograph cannot show.

**The governing rule:** every animation must answer a question a buyer actually has. Decorative WebGL is banned. If a scene cannot be described as *"this shows the visitor X, which they could not otherwise see"*, it does not get built.

---

## Motion tokens

| Token | Value | Use |
|---|---|---|
| `--d-instant` | 100ms | Toggle, checkbox |
| `--d-fast` | 180ms | Hover, focus ring, chip |
| `--d-base` | 260ms | Buttons, cards, tooltips |
| `--d-slow` | 400ms | Sheets, panels, cross-fades |
| `--d-slower` | 600ms | Section reveals, page transitions |
| `--d-scene` | 1200ms | 3D entrance |

| Easing | Curve | Use |
|---|---|---|
| `--e-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default. Decisive, no overshoot |
| `--e-enter` | `cubic-bezier(0, 0, 0, 1)` | Elements arriving |
| `--e-exit` | `cubic-bezier(0.3, 0, 1, 1)` | Elements leaving — faster than entering |
| `--e-spring` | spring(1, 90, 14) | Sheets, drag release |

**Restraint rules.** No bounce, no elastic, no overshoot on anything a user clicks. Nothing rotates on hover. Nothing animates on page load except the hero. Motion distance is small — 16–24px, never 100px slides. This is the Apple discipline: motion clarifies a relationship, it does not perform.

---

## Device tiers

Resolved once by `CapabilityProvider` on mount, then never re-probed. The audience is largely mid-range Android on mobile data in Chennai, so **Tier B is the realistic default, not Tier A.**

| | **Tier A** | **Tier B** | **Tier C** |
|---|---|---|---|
| Target | Desktop, WebGL2, dGPU/modern iGPU, ≥8 cores | Modern mobile, WebGL2, 4–8 cores | Low-end, no WebGL, Save-Data, or reduced-motion |
| 3D | Full interactive | Reduced: baked lighting, half-res textures, no shadows, capped dpr 1.5 | **None** |
| Scroll-scrubbed 3D | Yes | Stepped stills cross-fading | Static image |
| Configurator | Live material swap | Live material swap, simplified shading | Image gallery per variant |
| Parallax / tilt | Yes | No | No |
| Reveals | Yes | Yes | Instant |
| Env map | 2K HDR | 512px baked | — |

### Detection

```
tier = C  if  prefers-reduced-motion: reduce
           or navigator.connection.saveData
           or no WebGL2 context
           or deviceMemory < 4
           or hardwareConcurrency < 4

tier = A  if  pointer: fine  and  hardwareConcurrency >= 8
           and deviceMemory >= 8  and  WebGL2

tier = B  otherwise
```

`PerfMonitor` then downgrades live: sustained sub-45fps for 2s drops A → B; sub-30fps for 2s drops B → poster. **Downgrades are one-way within a session.** Oscillating between tiers is worse than sitting at the lower one.

---

## Layer 1 · Interface motion

Applies at all tiers except where noted. This is most of the site's motion and it is deliberately quiet.

| Element | Motion | Duration |
|---|---|---|
| Button hover | Background shift; no scale, no lift | `--d-fast` |
| Button press | `scale(0.98)` | `--d-instant` |
| Card hover (A) | `translateY(-4px)` + shadow bloom | `--d-base` |
| Card hover (B/C) | Border colour shift only | `--d-fast` |
| Link arrow | `translateX(4px)` | `--d-fast` |
| Focus ring | Opacity fade, never a size change | `--d-instant` |
| Accordion | Height + content fade, staggered 40ms | `--d-base` |
| Tab indicator | Slides between tabs | `--d-base` |
| Sheet (mobile) | Slides from bottom, spring; scrim fades | `--e-spring` |
| Sheet (desktop) | Fade + `scale(0.98 → 1)` | `--d-slow` |
| Mega panel | Height expand + content fade-up, 30ms stagger | `--d-base` |
| Header on scroll | Background + hairline fade in past 80px | `--d-base` |
| Toast | Slide + fade from top | `--d-base` |
| Filter change | Grid items fade/reflow, 20ms stagger, max 8 staggered | `--d-base` |

### Scroll reveals

One pattern, used everywhere: `opacity 0 → 1` with `translateY(20px → 0)` over `--d-slower`, triggered at 15% visibility, **once only**.

Stagger children by 60ms to a maximum of 6 — beyond that the last item arrives late enough to feel broken. Reveals never re-trigger on scroll back up. Under reduced motion, everything is simply visible.

### Page transitions

Fade only: 200ms out, 300ms in, with a 150ms overlap. No slides, no shared-element transitions across routes. Scroll position resets to top except on back navigation.

---

## Layer 2 · Scroll-driven scenes

Three on the site. Each is a genuine explainer.

### S-1 · Binding sequence — Home H-4, Process PR-2

**Question answered:** *what actually happens to my job?*

A sticky stage holds while four copy blocks scroll past. Scroll progress drives one continuous transformation.

```
progress   stage                          copy
0.00–0.25  flat printed sheet, rotating   "It starts as a sheet."
0.25–0.50  sheet folds into signatures    "Folded, gathered, trimmed."
0.50–0.75  signatures bind, spine forms   "Bound to last."
0.75–1.00  cover wraps, foil catches      "Finished by hand."
           light, book closes
```

| Tier | Implementation |
|---|---|
| A | Scroll-scrubbed glTF, ~1.2 MB. Camera on a spline; single directional light rakes across the foil at 0.85 |
| B | Four pre-rendered stills cross-fading on scroll. ~180 KB total |
| C | One static image of the finished book; copy blocks stack beneath as normal prose |

Scrub is **damped, not linear** — lerp toward target progress at 0.1 per frame so fast flicks feel weighted rather than jumpy.

### S-2 · Corrugated cutaway — `/packaging/corrugated-boxes/`

**Question answered:** *what is the difference between 3-ply and 5-ply, and which do I need?*

Ply layers separate on scroll, flute profile rotates into view, labels fade in against each layer. This is the clearest case on the site of 3D beating prose — a paragraph about flute geometry is genuinely hard to follow.

Tier B: three stepped stills. Tier C: a labelled static diagram, which remains perfectly adequate.

### S-3 · Binding comparison — `/binding/`

**Question answered:** *which binding do I need for my page count and budget?*

Four books — hard case, perfect, wiro, centre pin — enter side by side. As the user scrolls, each rises in turn with its page-count threshold and use case. Converts the site's weakest content area (417 characters across 28 headings) into its most useful.

Tier B/C: a `ComparisonTable`, which for this particular question is arguably just as good and considerably faster.

---

## Layer 3 · Interactive 3D

### The configurator — `/binding/hard-case/`

The highest-value 3D on the site, because it answers the question with the most genuine doubt behind it: *what does this material actually look like with that foil?*

| Interaction | Behaviour |
|---|---|
| Idle | Slow rotation, 0.15 rad/s, stopping on first interaction and never resuming |
| Orbit | Damped drag, polar clamped ±35° so the object is never seen from a bad angle |
| Material swap | Cross-fade 300ms; **geometry never reloads**, only the material |
| Foil toggle | Metalness/roughness transition 400ms; a light sweep runs once to make the change legible |
| Corner style | Geometry morph 400ms |
| Reset | Camera returns along an eased path, 600ms |
| Fullscreen | Expands to viewport with a shared-element transition |

Eight materials — PU leather, rexin, special sheets, and the rest — sharing one geometry and one 2K texture atlas. Swatches are **real photographs of the actual materials**, not colour chips.

`ConfigSummary` reads the live configuration into `QuoteButton`, so the quote form arrives pre-filled with "Hard Case · Rexin · Gold Foil · Rounded Corners". **This is the conversion mechanism the whole 3D investment exists to serve.**

### Finish viewer — `/materials/`

One surface, a movable light, switchable finishes. Spot UV, foiling, emboss and lamination are invisible under flat lighting and obvious under a raking light — which is exactly why they cannot be sold from photographs.

Drag anywhere to move the light. On touch, device orientation drives it where permission is granted, falling back to drag. Tier B gets a pre-rendered light-sweep video; Tier C gets two stills, raking and flat, which still makes the point.

### Rigid box viewer — `/packaging/rigid-boxes/`

Six structures. Open/close animation on tap, 500ms. The premium packaging range currently represented by six thumbnails.

### Hero — Home H-1

Deliberately the *least* interactive 3D on the site. Three objects, slow drift, subtle pointer parallax on desktop. **Static on mobile at every tier**, because the hero is the LCP element and nothing may compete with it.

---

## Performance rules

Non-negotiable. These are what keep "premium" from meaning "slow".

1. **WebGL is never in the critical path.** `StageCanvas` renders a static poster synchronously; that poster is the LCP element. 3D mounts only after the page is interactive.
2. **Intersection-gated.** No scene initialises until it is within 200px of the viewport.
3. **One live scene at a time.** Off-screen scenes pause their render loop entirely.
4. **DPR capped** at 2 (Tier A) / 1.5 (Tier B). Retina at native resolution is the most common cause of mobile thermal throttling.
5. **Shared rig.** Environment map, tone mapping, and decoders load once and are reused, so per-scene cost is geometry plus textures only.
6. **Budgets:** ≤50k triangles per scene · ≤3 material variants in memory · 2K textures max, KTX2 compressed · ≤1 real-time light, everything else baked.
7. **Tab hidden → loop stops.** `visibilitychange` pauses rendering.
8. **Battery aware.** Below 20% and not charging, drop to Tier C.
9. **Every scene has a poster** that is a genuinely good photograph. A visitor who never sees 3D must not see a hole.
10. **Failure is silent.** Import error, context loss or timeout keeps the poster and fires `3d_load_failed`. The user is never shown an error.

### Loading

```
Page load       poster visible, LCP measured
                        ↓
Interactive     capability tier resolved
                        ↓
Intersection    dynamic import of Canvas3D (~250 KB, shared, once)
                        ↓
Model fetch     glTF streams; poster stays visible, no spinner
                        ↓
First frame     cross-fade poster → canvas, 400ms
                        ↓
Idle            prefetch the next likely model
```

**No loading spinners on 3D.** The poster is the loading state, and it is a finished image. A spinner would advertise a wait the user is not otherwise experiencing.

---

## Accessibility

| Requirement | Implementation |
|---|---|
| `prefers-reduced-motion` | Tier C. All scroll motion becomes instant state change; 3D becomes a static poster with orbit only on deliberate tap |
| Keyboard | Configurator variants are radio buttons, fully operable without the canvas. Arrow keys orbit when the canvas has focus |
| Screen readers | Canvas is `aria-hidden`. A visually-hidden live region announces variant changes: *"Material changed to Rexin, gold foil"* |
| Focus | Never trapped in a canvas. Tab moves past it in one step |
| Vestibular safety | No parallax over 20px, no rotation above 15°/s, no auto-playing camera moves outside the hero |
| Motion off | A user-facing toggle in the footer, persisted, forcing Tier C regardless of device |

**The configurator is fully usable with the canvas ignored.** Variant selection is a real radio group; the specs and the quote path work identically. The 3D is an enhancement over a complete interface, never the interface itself.

---

## Scene inventory

| Scene | Page | Tier A | Tier B | Tier C | Payload | Priority |
|---|---|---|---|---|---|---|
| Hero objects | Home | Drift + parallax | Static poster | Static | 400 KB | 2 |
| Binding sequence | Home, Process | Scroll-scrubbed | Stepped stills | Static | 1.2 MB | 2 |
| Hard case configurator | `/binding/hard-case/` | Full | Reduced | Gallery | 1.4 MB | **1** |
| Binding comparison | `/binding/` | Scroll scene | Table | Table | 900 KB | 3 |
| Corrugated cutaway | `/packaging/corrugated-boxes/` | Exploded | Stepped | Diagram | 600 KB | 3 |
| Rigid box viewer | `/packaging/rigid-boxes/` | Interactive | Reduced | Gallery | 800 KB | 4 |
| Wiro switcher | `/binding/wiro/` | Material swap | Material swap | Gallery | 500 KB | 4 |
| Finish viewer | `/materials/` | Movable light | Video sweep | Two stills | 700 KB | **1** |

**Build order: priority 1 first.** The hard case configurator and the finish viewer are the two scenes that answer real purchasing questions, and between them they prove or disprove the entire 3D investment. Instrument `configurator_interacted → quote_opened` before building anything at priority 3 or below — if the first two scenes do not move that number, the rest should not be built.
