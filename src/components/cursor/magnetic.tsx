'use client';

import { m, useSpring } from 'framer-motion';
import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/providers/motion-provider';
import { cn } from '@/lib/utils';

/**
 * A control that leans toward the pointer.
 *
 * Wrap a CTA in it and the button drifts a few pixels toward the cursor as the
 * cursor approaches, then settles back when it leaves. The pointer cannot be
 * moved - nothing can move the operating system's cursor - so the attraction is
 * shown from the other side: the target comes to the hand. Paired with the
 * spotlight tightening over the same element (`data-cursor="magnetic"`, read by
 * `SpotlightCursor`), the two together read as one magnetic field.
 *
 * ## The numbers, and why they are small
 *
 * Travel is capped at 6px and the pull is a third of the offset. Past about
 * eight pixels the control stops feeling attracted and starts feeling loose -
 * and worse, the thing you are aiming at moves out from under you, which is a
 * real cost paid for a decorative effect. Six pixels is felt without ever
 * making the target harder to hit.
 *
 * ## How it engages early
 *
 * The wrapper carries a `::before` reaching 10px past its own edge, so
 * `pointerenter` fires while the cursor is still approaching rather than at the
 * moment it crosses the button. Ten pixels is deliberately modest: the ring is
 * live to pointer events, and a generous one would sit over its neighbours.
 *
 * ## What it costs
 *
 * Two springs, and one `getBoundingClientRect` per entry rather than per frame
 * - measuring in the move handler would read layout sixty times a second on the
 * one element guaranteed to be animating. Nothing runs at all until the pointer
 * is actually near it: no listeners on the document, no shared loop.
 *
 * Off entirely without a fine pointer and under reduced motion, where it
 * renders the plain wrapper and the child behaves normally.
 */

/** Share of the pointer's offset from centre that the control travels. */
const PULL = 0.32;

/** Hard cap on that travel, in pixels, on each axis. */
const MAX = 6;

const SPRING = { stiffness: 260, damping: 22, mass: 0.6 } as const;

export interface MagneticProps {
  children: ReactNode;
  /**
   * Layout for the wrapper. It becomes the element in the flow, so anything the
   * child needed from its parent - `w-full`, a grid span - belongs here.
   */
  className?: string;
  /**
   * Skip the `data-cursor="magnetic"` claim.
   *
   * For a control that should pull without the spotlight also tightening on it,
   * where several magnets sit close enough together that the pool would flicker
   * between them.
   */
  quiet?: boolean;
}

export function Magnetic({ children, className, quiet = false }: MagneticProps) {
  const reduced = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const enabled = fine && !reduced;

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  /* Measured on entry, not on every move: a rect read per frame is a forced
     layout on the one element that is certainly animating. */
  const box = useRef<DOMRect | null>(null);

  const onEnter = useCallback((event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse') return;
    box.current = event.currentTarget.getBoundingClientRect();
  }, []);

  const onMove = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (event.pointerType !== 'mouse') return;
      const r = box.current;
      if (!r) return;

      const dx = (event.clientX - (r.left + r.width / 2)) * PULL;
      const dy = (event.clientY - (r.top + r.height / 2)) * PULL;
      x.set(Math.max(-MAX, Math.min(MAX, dx)));
      y.set(Math.max(-MAX, Math.min(MAX, dy)));
    },
    [x, y],
  );

  const onLeave = useCallback(() => {
    box.current = null;
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (!enabled) {
    return <span className={cn('inline-flex', className)}>{children}</span>;
  }

  return (
    <m.span
      className={cn('magnetic inline-flex', className)}
      data-cursor={quiet ? undefined : 'magnetic'}
      style={{ x, y }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </m.span>
  );
}

export default Magnetic;
