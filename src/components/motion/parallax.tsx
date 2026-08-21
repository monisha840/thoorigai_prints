'use client';

import { m, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { parallax as parallaxTokens, spring } from '@/lib/theme/animations';
import { useBreakpoint } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/providers/motion-provider';

/**
 * Scroll-linked depth — MASTER_PROJECT_PLAN.md §9.2.
 *
 * "No parallax on mobile, ever. No parallax over 20px anywhere."
 *
 * Both are enforced here rather than left to the caller: the offset is clamped
 * to `parallax.max`, and the effect is inert below `lg` and under reduced
 * motion. When it is off, the child renders with no transform at all — not a
 * transform of zero — so nothing is promoted to its own layer for nothing.
 *
 * Raw scroll position is passed through a spring before it drives the
 * transform. Without it, the element tracks the scroll wheel's discrete steps
 * exactly, which reads as juddering rather than as depth.
 */

export interface ParallaxProps {
  children?: ReactNode;
  className?: string;
  /** Peak travel in px, clamped to 20. Negative reverses the direction. */
  offset?: number;
}

export function Parallax({ children, className, offset = parallaxTokens.base }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useBreakpoint('lg');

  const { scrollYProgress } = useScroll({
    target: ref,
    // From the element's top touching the bottom of the viewport, to its
    // bottom leaving the top — the full window in which it is on screen.
    offset: ['start end', 'end start'],
  });

  const travel = Math.sign(offset) * Math.min(Math.abs(offset), parallaxTokens.max);
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const smoothed = useSpring(y, spring.scroll);

  const enabled = isDesktop && !reduced;

  return (
    <div ref={ref} className={className}>
      <m.div style={enabled ? { y: smoothed } : undefined}>{children}</m.div>
    </div>
  );
}

export default Parallax;
