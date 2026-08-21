'use client';

import { m, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

import type { MotionTag } from './motion-block';
import { useMediaQuery } from '@/hooks/use-media-query';
import { pointer } from '@/lib/theme/animations';
import { useReducedMotion } from '@/providers/motion-provider';

/**
 * Mouse parallax — a field, and layers that read it.
 *
 *   <MouseParallax as="section">
 *     <MouseParallaxLayer depth={0.3}>… back plane</MouseParallaxLayer>
 *     <MouseParallaxLayer depth={1}>… front plane</MouseParallaxLayer>
 *   </MouseParallax>
 *
 * The container measures where the pointer is inside it, normalised to
 * -0.5…0.5 on each axis, and publishes that as two motion values. Layers
 * multiply by their own `depth`. Nothing re-renders: pointer position lives in
 * motion values from end to end, so a mouse crossing the hero costs no React
 * work at all.
 *
 * Two details do most of the work:
 *
 * **The spring.** Raw pointer position stops dead when the mouse stops and
 * jumps when it moves fast. Passing it through a spring gives the layers mass,
 * and mass is the entire difference between this reading as depth and reading
 * as a gimmick.
 *
 * **Depth is a ratio, not a distance.** A layer at `depth={1}` travels the full
 * `pointer.range`; everything else is a fraction of it. Set the front-most
 * element to 1 and work backwards, and the parallax stays coherent even when
 * someone later changes the range in one place.
 *
 * Off on touch and under reduced motion — in which case no context is provided
 * at all, and the layers render as plain elements with no transform to composite.
 */

interface PointerField {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Peak travel (px) of a depth-1 layer in this field. */
  range: number;
}

const PointerFieldContext = createContext<PointerField | null>(null);

export interface MouseParallaxProps {
  children?: ReactNode;
  className?: string;
  as?: MotionTag;
  /**
   * How far the pointer has to travel for a layer to reach full deflection.
   * `'self'` measures against this element's own box — right for a card.
   * `'viewport'` measures against the window — right for a full-bleed hero,
   * where the pointer should still have an effect outside the element.
   */
  scope?: 'self' | 'viewport';
  /**
   * Peak travel (px) of a depth-1 layer. Set it once here rather than on every
   * layer — a field with two different ranges in it is two fields.
   * `pointer.range` suits a hero; `pointer.mediaRange` suits a card.
   */
  range?: number;
  id?: string;
}

export function MouseParallax({
  children,
  className,
  as = 'div',
  scope = 'self',
  range = pointer.range,
  id,
}: MouseParallaxProps) {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const enabled = finePointer && !reduced;

  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, pointer.spring);
  const y = useSpring(rawY, pointer.spring);

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      // Pens and fingers both report through pointer events; only a real
      // hovering device should move the field.
      if (event.pointerType !== 'mouse') return;

      const box =
        scope === 'viewport'
          ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
          : ref.current?.getBoundingClientRect();
      if (!box || !box.width || !box.height) return;

      rawX.set((event.clientX - box.left) / box.width - 0.5);
      rawY.set((event.clientY - box.top) / box.height - 0.5);
    },
    [rawX, rawY, scope],
  );

  // Returning to centre on leave matters as much as the tracking does: without
  // it the layers hold their last offset and the composition stays crooked.
  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  useEffect(() => {
    if (enabled) return;
    rawX.set(0);
    rawY.set(0);
  }, [enabled, rawX, rawY]);

  const field = useMemo<PointerField>(() => ({ x, y, range }), [x, y, range]);
  const Component = m[as] as typeof m.div;

  if (!enabled) {
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  return (
    <PointerFieldContext.Provider value={field}>
      <Component
        id={id}
        ref={ref}
        className={className}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {children}
      </Component>
    </PointerFieldContext.Provider>
  );
}

export interface MouseParallaxLayerProps {
  children?: ReactNode;
  className?: string;
  as?: MotionTag;
  /** Share of the field's range this layer travels. 1 is the front plane. */
  depth?: number;
  /** Override the field's range for this layer alone. Rarely the right answer. */
  range?: number;
  /** Invert the direction — for a layer that should lean away from the cursor. */
  invert?: boolean;
}

export function MouseParallaxLayer({
  children,
  className,
  as = 'div',
  depth = 1,
  range,
  invert = false,
}: MouseParallaxLayerProps) {
  const field = useContext(PointerFieldContext);

  // Hooks cannot be conditional, so a layer used outside a field still builds
  // its transforms — off a pair of values that never change.
  const idleX = useMotionValue(0);
  const idleY = useMotionValue(0);
  const sourceX = field?.x ?? idleX;
  const sourceY = field?.y ?? idleY;

  const shift = depth * (range ?? field?.range ?? pointer.range) * (invert ? -1 : 1);
  const x = useTransform(sourceX, (value) => value * shift);
  const y = useTransform(sourceY, (value) => value * shift);

  const Component = m[as] as typeof m.div;

  if (!field) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component className={className} data-motion="parallax" style={{ x, y }}>
      {children}
    </Component>
  );
}

export default MouseParallax;
