'use client';

import { useMediaQuery } from './use-media-query';

/**
 * True when the visitor has asked the OS for less motion.
 *
 * Framer Motion already honours this globally via `MotionConfig`; use this hook
 * for the things Framer cannot see — autoplaying video, the 3D canvas frame
 * loop, CSS keyframes driven from JS.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export default usePrefersReducedMotion;
