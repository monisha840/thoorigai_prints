/**
 * Thoorigai Prints — motion tokens.
 *
 * The single source of truth for every duration, curve, distance and trigger
 * point on the site. Values are MASTER_PROJECT_PLAN.md §9.1 (conflicts C13 and
 * C14). Framer Motion reads this file directly; `globals.css` mirrors the same
 * numbers as `--d-*` / `--ease-*` custom properties so CSS hover states move at
 * the same tempo. Change one, change the other.
 *
 * Durations here are in seconds because that is Framer Motion's unit; the CSS
 * mirror carries the identical values in milliseconds.
 *
 * House rule (§9): motion is short, few and confident. Nothing bounces, nothing
 * overshoots, nothing loops. Motion clarifies a relationship; it does not
 * perform. Nothing that carries meaning may depend on animation to be read.
 */

/** §9.1 — durations. The CSS mirror is `--d-instant` … `--d-scene`. */
export const duration = {
  /** 100ms — tap feedback, checkbox, focus ring. */
  instant: 0.1,
  /** 180ms — hover, colour, border, chip. */
  fast: 0.18,
  /** 240ms — card lift, dropdown, accordion, tab indicator. */
  base: 0.24,
  /** 320ms — modal, drawer, mega panel, material cross-fade. */
  slow: 0.32,
  /** 480ms — section reveal, image scale, poster→canvas cross-fade. */
  slower: 0.48,
  /** 1200ms — 3D entrance. Nothing else earns this much time. */
  scene: 1.2,
} as const;

/** A cubic-bezier as Framer Motion expects it. */
export type Bezier = [number, number, number, number];

/**
 * §9.1 — easing curves.
 *
 * The overshoot curve that used to live here (`[0.34, 1.3, 0.64, 1]`) is
 * deliberately gone: nothing a user clicks may overshoot. If you want a spring,
 * use `spring.drawer` — and only on a surface a finger can grab.
 */
export const easing: Record<
  'standard' | 'entrance' | 'exit' | 'linear' | 'editorial',
  Bezier
> = {
  /** The default. Fast out of the gate, long confident settle. */
  standard: [0.22, 1, 0.36, 1],
  /** Elements arriving from off-screen. */
  entrance: [0.16, 1, 0.3, 1],
  /** Elements leaving. Faster than entering, always. */
  exit: [0.4, 0, 1, 1],
  /** Progress bars and spinners only. */
  linear: [0, 0, 1, 1],
  /**
   * @deprecated Alias of `standard`, kept for one release so the `ease-editorial`
   * class and existing imports keep working. Prefer `easing.standard`.
   */
  editorial: [0.22, 1, 0.36, 1],
};

/**
 * Springs, for gesture-driven surfaces only — things a finger can grab.
 *
 * Expressed as `visualDuration` + `bounce` rather than stiffness/damping:
 * `visualDuration` is the time to visually reach the target, which is the
 * number §9.3 actually specifies ("spring rise 280ms"). `bounce` is kept low
 * enough that the settle is felt rather than seen.
 */
export const spring = {
  /** §9.3 — the mobile drawer and sheets. */
  drawer: { type: 'spring', visualDuration: 0.28, bounce: 0.12 },
  /** Smooths raw scroll input before it drives a transform. */
  scroll: { type: 'spring', stiffness: 140, damping: 30, mass: 0.6, restDelta: 0.001 },
} as const;

/**
 * §9.2 — stagger.
 *
 * 60ms between grid children, **capped at six**: the seventh child onward all
 * share the sixth's delay, so a 43-tile grid never crawls in. The cap is
 * applied by `<Stagger>` rather than by Framer's own `staggerChildren`, which
 * has no ceiling.
 */
export const stagger = {
  /** Filter reflow — §9.3, 20ms. */
  reflow: 0.02,
  /** Accordion content — §9.3, 40ms. */
  tight: 0.04,
  /** The default for grid and list children. */
  base: 0.06,
  /** Nothing past this index waits any longer. */
  maxSteps: 6,
} as const;

/**
 * §9.2 — travel distance (px). "Motion distance is small — 16–24px, never
 * 100px slides." Under ~12px a fade reads as a glitch; over ~24px it reads as a
 * slide and the page feels like it is assembling itself.
 */
export const distance = {
  sm: 8,
  /** The one scroll-reveal distance. Everything rises 16px. */
  base: 16,
  lg: 24,
} as const;

/**
 * §9.2 — parallax ceiling. "No parallax on mobile, ever. No parallax over 20px
 * anywhere." `<Parallax>` clamps to this and disables itself below `lg`.
 */
export const parallax = {
  max: 20,
  base: 16,
} as const;

/**
 * §9.2 — page transitions. "Fade only — 200ms out, 300ms in, 150ms overlap."
 */
export const page = {
  out: 0.2,
  in: 0.3,
  overlap: 0.15,
} as const;

/* ---------------------------------------------------------------------------
 * The interaction layer
 *
 * Everything above describes motion the page performs on its own. What follows
 * describes motion the page performs *because of the visitor* — the pointer,
 * the wheel, the passage of time. It is the bottom tier of the motion
 * hierarchy: it must never compete with a reveal for attention, and a visitor
 * who never notices it is the intended outcome.
 * ------------------------------------------------------------------------- */

/**
 * Section boundaries.
 *
 * `settle` is how far a band's content rises as the boundary crosses the
 * screen. Small, because the content inside is already revealing on its own
 * 16px and §9.2 caps total travel at 24px.
 */
export const section = {
  settle: 8,
} as const;

/**
 * Smooth scrolling (Lenis).
 *
 * `lerp` is the fraction of the remaining distance covered each frame. The
 * library default of 0.1 is heavier than this site wants — it reads as the page
 * swimming after the wheel. 0.12 keeps the weight without the lag.
 */
export const smoothScroll = {
  lerp: 0.12,
  wheelMultiplier: 1,
  /** Where an anchor link lands. Mirrors `scroll-padding-top` in globals.css. */
  anchorOffset: -96,
} as const;

/**
 * Mouse parallax.
 *
 * `range` is the travel of a depth-1 layer at the far edge of its container.
 * 18px sounds small and is deliberately so: the effect should register as the
 * page having depth, not as things sliding around under the cursor.
 */
export const pointer = {
  /** Peak travel (px) for a depth-1 layer in a hero-scale field. */
  range: 18,
  /** Peak travel (px) for media drifting inside a card. Smaller field, smaller move. */
  mediaRange: 8,
  /**
   * Raw pointer position is jittery and stops dead when the mouse stops. The
   * spring is what turns it into something with weight; without it the effect
   * reads as cheap immediately.
   */
  spring: { stiffness: 90, damping: 20, mass: 0.7, restDelta: 0.0001 },
} as const;

/**
 * Floating product motion.
 *
 * A six-second bob with a slower, non-integer rotation period, so the two never
 * line up and the movement never looks mechanical. Amplitudes are per-depth:
 * a depth-1 tile travels 10px and turns 0.6°, which at catalogue-tile size is
 * about as far as you can go before it stops reading as a sheet resting on air
 * and starts reading as a sheet being waved about.
 */
export const float = {
  /** Peak vertical travel (px) at depth 1. */
  distance: 10,
  /** Peak rotation (deg) at depth 1. */
  rotation: 0.6,
  /** One bob, in seconds. */
  duration: 6,
  /** Ratio between the rotation and travel periods. Deliberately not a whole number. */
  rotationRatio: 1.45,
  /** Added per sibling index, so a row never moves in lockstep. */
  stagger: 0.45,
  /** Held after a tile reveals, so the float never fights its own entrance. */
  entryDelay: 0.48,
  /**
   * How much of the full amplitude each device class gets.
   *
   * §9.2 already bans parallax on mobile; the float was the one ambient loop
   * that ran everywhere, and it is the more expensive of the two. A phone
   * showing the catalogue grid in a single column has nine tiles on screen at
   * once, each driving an infinite transform — nine animation loops running
   * while the visitor's thumb is doing the only movement that matters.
   *
   * So: full amplitude on a desktop, a little over half on a tablet where the
   * tiles are larger relative to the viewport and the same travel reads as
   * drift, and nothing at all on a phone. The tiles still reveal, the section
   * still settles, the card still responds to a tap — what stops is the idle
   * loop, which on a phone was decoration nobody was looking at.
   *
   * `Float` reads these; nothing else should.
   */
  scale: {
    /** Below `md` — no ambient float. */
    mobile: 0,
    /** `md` to `lg`. */
    tablet: 0.55,
    /** `lg` and up. */
    desktop: 1,
  },
} as const;

/**
 * Viewport trigger presets for `whileInView`.
 *
 * §9.2 asks for "15% visibility, once". That is expressed here as a root margin
 * rather than as a numeric `amount`, and the difference matters:
 *
 * Framer hands `amount` straight to `IntersectionObserver.threshold`, and the
 * threshold is a fraction of *the observed element's own area* — not of the
 * viewport. An element taller than `viewport ÷ 0.15` can therefore never reach
 * a 0.15 ratio, the observer never fires, and the content stays at `opacity: 0`
 * permanently. A nine-card grid in a single column on a phone is already past
 * that line. See ANIMATION_GUIDELINES.md § "Why the trigger is a margin".
 *
 * `amount: 'some'` (threshold 0) is height-independent, and the -15% bottom
 * margin puts the trigger point at 85% of the viewport height — visually the
 * same moment §9.2 describes, for any element of any size.
 */
export const viewport = {
  /** The default: fires as the element's leading edge passes 85% of the fold. */
  enter: { once: true, amount: 'some', margin: '0px 0px -15% 0px' },
  /** Later and more deliberate, for a band that should land rather than slip in. */
  deep: { once: true, amount: 'some', margin: '0px 0px -25% 0px' },
  /** Fires the moment any part of the element is on screen. */
  early: { once: true, amount: 'some', margin: '0px 0px 0px 0px' },
} as const;

export type ViewportPreset = keyof typeof viewport;

export const animations = {
  duration,
  easing,
  spring,
  stagger,
  distance,
  parallax,
  page,
  section,
  smoothScroll,
  pointer,
  float,
  viewport,
} as const;

export type DurationToken = keyof typeof duration;
export type EasingToken = keyof typeof easing;

export default animations;
