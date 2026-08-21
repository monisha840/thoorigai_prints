'use client';

import { m, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { section, spring } from '@/lib/theme/animations';
import { useReducedMotion } from '@/providers/motion-provider';

/**
 * The settle — a band's boundary treatment when it has no rule to draw.
 *
 * Sections on this site are separated one of two ways: a hairline, or a change
 * of paper tone. `SectionSeam` handles the first by drawing the rule across as
 * the band arrives. This handles the second.
 *
 * The content starts 8px low and rises to its resting position as the band's
 * top edge travels from the bottom of the viewport to the middle. Crucially it
 * is scroll-*linked*, not time-based: the movement is bound to the scroll
 * position rather than triggered by it, so it is still moving while the visitor
 * is still moving, and the boundary reads as a handover rather than as one band
 * stopping and another starting.
 *
 * 8px is the whole budget, and it is small for a reason. The content inside is
 * already revealing on its own 16px rise, and §9.2 caps travel at 24px — so the
 * two compound to exactly the ceiling in the worst case and never past it.
 *
 * There is no exit motion. A band that animates on the way out pulls attention
 * backwards, to something the visitor has already decided to leave.
 */
export function SectionTransition({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // From the band's leading edge entering the viewport, to that edge reaching
    // the middle of the screen. The settle is finished well before the band is.
    offset: ['start end', 'start center'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [section.settle, 0]);
  // Native scroll events arrive in chunks, especially during momentum on iOS.
  // The spring is what turns those steps back into a continuous movement.
  const smoothed = useSpring(y, spring.scroll);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {/*
        `data-motion` is not decoration. Framer writes the settle's starting
        offset into the server-rendered markup, so without this marker the five
        bands that use it would sit 8px low for anyone whose JavaScript never
        arrives — and would stay there. The `[data-motion]` rules in
        `globals.css` reset the transform for both that case and reduced motion.
      */}
      <m.div data-motion="settle" style={{ y: smoothed }}>
        {children}
      </m.div>
    </div>
  );
}

export default SectionTransition;
