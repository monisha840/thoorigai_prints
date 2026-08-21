import type { Transition } from 'framer-motion';

import { duration, easing, spring } from '@/lib/theme/animations';

/**
 * Named transitions — MASTER_PROJECT_PLAN.md §9.1.
 *
 * Components reach for one of these rather than inventing a duration, so the
 * whole site moves at one tempo and a change of pace is a one-file edit.
 */

/** §9.2 — the one scroll-reveal transition. 480ms, fast out, long settle. */
export const reveal: Transition = {
  duration: duration.slower,
  ease: easing.standard,
};

/** 240ms — card lift, dropdown, tab indicator. The general-purpose tween. */
export const base: Transition = {
  duration: duration.base,
  ease: easing.standard,
};

/** 180ms — hover, colour, border. */
export const fast: Transition = {
  duration: duration.fast,
  ease: easing.standard,
};

/** 100ms — tap feedback and focus rings. */
export const instant: Transition = {
  duration: duration.instant,
  ease: easing.standard,
};

/** 320ms — modal, drawer scrim, mega panel. */
export const slow: Transition = {
  duration: duration.slow,
  ease: easing.standard,
};

/** Leaving is always quicker than arriving. */
export const exit: Transition = {
  duration: duration.fast,
  ease: easing.exit,
};

/** §9.2 — the incoming half of a route change. */
export const pageIn: Transition = {
  duration: duration.slow,
  ease: easing.entrance,
};

/** Gesture-driven surfaces: the mobile drawer. The only spring in the system. */
export const drawer: Transition = spring.drawer as Transition;

/*
 * There is deliberately no `reduced` transition here. §9.4 asks for reveals to
 * become "plain visibility — content is simply there", and that is enforced in
 * `globals.css` against `[data-motion]`, where it applies before any JavaScript
 * has run. A Framer-side transition could only ever take effect after hydration,
 * which is one frame too late to be the answer.
 */

export const transitions = {
  reveal,
  base,
  fast,
  instant,
  slow,
  exit,
  pageIn,
  drawer,
} as const;

export type TransitionName = keyof typeof transitions;

export default transitions;
