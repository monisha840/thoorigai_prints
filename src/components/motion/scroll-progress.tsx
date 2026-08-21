'use client';

import { m, useScroll, useSpring } from 'framer-motion';

import { spring } from '@/lib/theme/animations';
import { useReducedMotion } from '@/providers/motion-provider';
import { cn } from '@/lib/utils';

/**
 * A hairline that fills across the foot of the header as the page is read.
 *
 * ## What it is for
 *
 * These pages are long — the homepage is nine bands, the portfolio four — and
 * a fixed header gives a visitor no sense of where they are inside one. The
 * scrollbar answers that, except on the platform where the question matters
 * most: macOS hides it entirely until you scroll, and a trackpad flick never
 * shows it long enough to read. This is the same information, always visible,
 * costing one pixel of height.
 *
 * ## Why it is a hairline and not a bar
 *
 * It occupies the header's existing bottom border rather than adding a band of
 * its own, so nothing moves and no space is spent. It is bronze at low opacity
 * — present when looked for, invisible when not. A progress indicator that
 * competes with the navigation it sits under has misunderstood its own rank in
 * the hierarchy.
 *
 * ## The mechanics
 *
 * `scaleX` on a `transform-origin: left` element: one composited property, no
 * layout, no paint. Raw `scrollYProgress` is passed through the same spring the
 * parallax and section settle use, because native scroll arrives in discrete
 * chunks — especially during iOS momentum — and an unsprung rail visibly
 * staircases.
 *
 * Under reduced motion it renders nothing at all. It is ambient decoration
 * driven entirely by scroll position, which is exactly the category §9.4 asks
 * to disappear rather than be slowed down.
 */
export function ScrollProgress({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, spring.scroll);

  if (reduced) return null;

  return (
    <m.span
      aria-hidden
      data-motion="progress"
      style={{ scaleX }}
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gold-500/55',
        className,
      )}
    />
  );
}

export default ScrollProgress;
