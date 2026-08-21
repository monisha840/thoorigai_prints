import type { Variants } from 'framer-motion';

import { distance, stagger as staggerTokens } from '@/lib/theme/animations';
import { base, drawer, exit, reveal, slow } from './transitions';

/**
 * The animation vocabulary — MASTER_PROJECT_PLAN.md §9.2.
 *
 * "Scroll reveals: one pattern, used everywhere." That pattern is `fadeUp`:
 * opacity 0→1 plus a 16px rise, over 480ms, once. Everything else in this file
 * is either that pattern with the travel removed (`fadeIn`, for media that
 * would fight a rise), the same pattern behind a clip-path window (`revealLine`,
 * for display type), or presence motion for surfaces that are not scroll
 * reveals at all (the drawer, the scrim, the route change).
 *
 * ── Delays are `custom`, not a `transition` prop ────────────────────────────
 *
 * Every entrance variant is a *function* of a delay in seconds, read from the
 * element's `custom` prop. This is not a stylistic choice. When a variant
 * defines its own `transition`, Framer uses it verbatim and discards the
 * component's `transition` prop entirely:
 *
 *   // motion-dom/animation/interfaces/visual-element-variant.mjs
 *   let { transition = visualElement.getDefaultTransition() || {} } = resolved
 *
 * `getDefaultTransition()` returns `props.transition`, so it is only ever a
 * fallback. A `<FadeUp delay={0.4}>` implemented as `transition={{ delay }}`
 * silently does nothing at all. `custom` is resolved *inside* the variant, so
 * it survives. See ANIMATION_GUIDELINES.md § "Why delay is `custom`".
 */

/** Every entrance variant takes a delay in seconds via `custom`. */
export type MotionDelay = number;

/* --------------------------------------------------------------------------
 * The one scroll-reveal pattern.
 * ------------------------------------------------------------------------ */

/** §9.2 — opacity 0→1 plus translateY(16px→0) over 480ms. The house entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.base },
  visible: (delay: MotionDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...reveal, delay },
  }),
  exit: { opacity: 0, y: distance.sm, transition: exit },
};

/**
 * The same pattern with the travel removed. For full-bleed photography, where a
 * rise fights the frame, and for anything already in its final position.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: MotionDelay = 0) => ({
    opacity: 1,
    transition: { ...reveal, delay },
  }),
  exit: { opacity: 0, transition: exit },
};

/**
 * Display type uncovered through a clip-path window, as a sheet comes off the
 * stack. Reserved for the hero headline — one line at a time, never a character
 * at a time (§9.2).
 *
 * `clipPath` is not one of Framer's positional keys, so `reducedMotion` does
 * *not* neutralise it the way it neutralises `y`. The wrapper carries
 * `data-motion="reveal"`, and `globals.css` drops the clip outright under
 * reduced motion — otherwise the wipe would survive the brake.
 */
export const revealLine: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: distance.base },
  visible: (delay: MotionDelay = 0) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    y: 0,
    transition: { ...reveal, delay },
  }),
};

/* --------------------------------------------------------------------------
 * Stagger.
 * ------------------------------------------------------------------------ */

/**
 * The parent of a staggered group. It carries no motion of its own — it exists
 * to flip its children from `hidden` to `visible` together.
 *
 * Framer's own `staggerChildren` is deliberately *not* used. §9.2 caps the
 * cascade at six steps so a long grid never crawls in, and `staggerChildren`
 * has no ceiling. `<Stagger>` computes each child's delay instead and passes it
 * as `custom` — which also means the orchestration delay is overridden rather
 * than added to, so the two can never double up.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {},
};

/** A child of `<Stagger>`. The house entrance, timed by its index. */
export const staggerItem: Variants = fadeUp;

/**
 * §9.2 — the capped cascade. Child six and everything after it share one delay.
 *
 *   staggerDelay(0) → 0      staggerDelay(5)  → 0.30
 *   staggerDelay(2) → 0.12   staggerDelay(42) → 0.30
 */
export function staggerDelay(index: number, offset = 0): number {
  const step = Math.min(Math.max(index, 0), staggerTokens.maxSteps - 1);
  return offset + step * staggerTokens.base;
}

/* --------------------------------------------------------------------------
 * Presence — surfaces that come and go rather than scroll into view.
 * ------------------------------------------------------------------------ */

/** The scrim behind the mobile drawer. Fades; never moves. */
export const scrim: Variants = {
  hidden: { opacity: 0, transition: exit },
  visible: { opacity: 1, transition: slow },
};

/** §9.3 — the mobile drawer. The only spring on the site. */
export const drawerPanel: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: drawer },
  exit: { x: '100%', transition: exit },
};

/**
 * §9.3 — "Sheet (desktop): fade + scale(0.98 → 1)". The lightbox and any
 * centred dialog. The scale is small enough to read as focus arriving rather
 * than as the panel growing.
 */
export const sheet: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: slow },
  exit: { opacity: 0, scale: 0.98, transition: exit },
};

/**
 * §9.3 — "Sheet (mobile): spring rise". The action bar that follows the
 * visitor down the page below `lg`.
 */
export const dock: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: drawer },
  exit: { y: '100%', transition: exit },
};

/**
 * §9.2 — route changes are a fade and nothing else. No slide, no shared
 * element, no scale.
 */
export const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/** The first-visit curtain lifting. */
export const curtain: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { ...base, duration: 0.4 } },
};

export const variants = {
  fadeUp,
  fadeIn,
  revealLine,
  staggerContainer,
  staggerItem,
  scrim,
  drawerPanel,
  sheet,
  dock,
  pageFade,
  curtain,
} as const;

export type VariantName = keyof typeof variants;

export default variants;
