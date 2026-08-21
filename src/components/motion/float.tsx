'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';

import type { MotionTag } from './motion-block';
import { float } from '@/lib/theme/animations';
import { useBreakpoint } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/providers/motion-provider';

/**
 * Floating product motion — a printed piece resting on air.
 *
 *   {items.map((item, i) => (
 *     <Float key={item.id} index={i} depth={0.8}>…</Float>
 *   ))}
 *
 * Four things keep this on the right side of the line between "premium" and
 * "corporate homepage circa 2014":
 *
 * **It is slow.** Six seconds for one bob. Anything quicker stops reading as
 * weight and starts reading as a fidget.
 *
 * **It is small.** Ten pixels and six tenths of a degree at full depth. The
 * rotation is what sells it — a sheet that rises and falls without ever
 * changing angle reads as a lift, not as a float.
 *
 * **The two periods do not divide.** Rotation runs at 1.45× the travel period,
 * so the cycle never repeats exactly and the eye never finds the loop.
 *
 * **A row never moves in lockstep.** `index` offsets each sibling by 450ms.
 * Without it, eight tiles rising together read as one object, and the illusion
 * of eight independent sheets is gone.
 *
 * It runs only while on screen — `whileInView` with `once: false` parks the
 * animation when the section leaves, which on a page of eight tiles is the
 * difference between an idle rAF loop and a flat battery. Under reduced motion
 * the element renders with no animation at all.
 *
 * ## Three device classes, three behaviours
 *
 * Amplitude is scaled by viewport width, from `float.scale`:
 *
 *   desktop (`lg`+)   full — 10px and 0.6°
 *   tablet (`md`–`lg`) 55% — the tiles are larger relative to the screen, and
 *                      the same travel on a bigger card reads as drift
 *   mobile (< `md`)    none — the loop is removed entirely, not slowed
 *
 * The mobile case is not a taste decision. A phone renders the catalogue in one
 * column, so nine tiles can be on screen at once, each driving an infinite
 * transform while the only movement the visitor cares about is their own
 * scrolling. `Parallax` is already banned below `lg` for the same reason; this
 * closes the other half of it. Everything else about the tile survives — the
 * reveal, the section settle, the press state.
 *
 * Because `useBreakpoint` returns `false` until it has measured, the first
 * client render is the mobile case for everybody. That is the right way round:
 * the conservative branch renders no animation at all, so nothing starts and
 * then has to be taken away a frame later.
 */

export interface FloatProps {
  children?: ReactNode;
  className?: string;
  as?: MotionTag;
  /** Share of the full amplitude. 1 is the front plane. */
  depth?: number;
  /** Position among siblings, so a row desynchronises. */
  index?: number;
  /** Skip the entrance hold — for an element that is not revealing first. */
  immediate?: boolean;
}

export function Float({
  children,
  className,
  as = 'div',
  depth = 1,
  index = 0,
  immediate = false,
}: FloatProps) {
  const reduced = useReducedMotion();
  const isTablet = useBreakpoint('md');
  const isDesktop = useBreakpoint('lg');
  const Component = m[as] as typeof m.div;

  const amplitude = isDesktop
    ? float.scale.desktop
    : isTablet
      ? float.scale.tablet
      : float.scale.mobile;

  // No amplitude means no animation object at all — not an animation of zero.
  // A zero-travel keyframe loop still runs, still promotes the element to its
  // own compositor layer, and still costs the battery it was meant to save.
  if (reduced || amplitude === 0) {
    return <Component className={className}>{children}</Component>;
  }

  const travel = float.distance * depth * amplitude;
  const turn = float.rotation * depth * amplitude;
  // Deeper planes are heavier, so they take slightly longer to complete a bob.
  const duration = float.duration * (1 + depth * 0.15);
  const delay = (immediate ? 0 : float.entryDelay) + index * float.stagger;

  return (
    <Component
      className={className}
      data-motion="float"
      initial="rest"
      whileInView="drift"
      viewport={{ once: false, amount: 'some' }}
      variants={{
        rest: { y: 0, rotate: 0 },
        drift: {
          // A full cycle that starts and ends at zero, so the element is never
          // yanked to an offset the moment it enters the viewport.
          y: [0, -travel, 0],
          rotate: [0, -turn, 0, turn, 0],
          transition: {
            y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
            rotate: {
              duration: duration * float.rotationRatio,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            },
          },
        },
      }}
    >
      {children}
    </Component>
  );
}

export default Float;
