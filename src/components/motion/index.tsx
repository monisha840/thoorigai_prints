'use client';

/**
 * The motion surface for the whole site.
 *
 * Sections import from here and nowhere else. Nothing outside this folder — and
 * outside `src/providers/motion-provider.tsx` — should import `framer-motion`
 * directly; see ANIMATION_GUIDELINES.md § "The rules".
 */

export { FadeUp, FadeIn, Reveal } from './reveal';
/** @deprecated aliases of FadeUp — see `./reveal`. */
export { FadeUpLarge, FadeDown, FadeLeft, FadeRight, ScaleIn } from './reveal';

export { Stagger, StaggerItem } from './stagger';
export type { StaggerProps, StaggerItemProps } from './stagger';

export { Parallax } from './parallax';
export type { ParallaxProps } from './parallax';

export { MouseParallax, MouseParallaxLayer } from './mouse-parallax';
export type { MouseParallaxProps, MouseParallaxLayerProps } from './mouse-parallax';

export { Float } from './float';
export type { FloatProps } from './float';

export { ScrollProgress } from './scroll-progress';

export { SectionSeam } from './section-seam';
export { SectionTransition } from './section-transition';

export { PageTransition } from './page-transition';

export { MotionBlock } from './motion-block';
export type { MotionBlockProps, MotionTag } from './motion-block';

/** Raw `m` namespace, for the rare component that needs gesture props. */
export { m as motion, m } from 'framer-motion';

/**
 * Exit animations, for the one case the wrappers cannot cover: an element that
 * has to finish animating after React would have unmounted it. Overlays and
 * dialogs only — a scroll reveal never needs this.
 */
export { AnimatePresence } from 'framer-motion';
