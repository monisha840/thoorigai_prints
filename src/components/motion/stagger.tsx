'use client';

import { m } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Children,
  cloneElement,
  createContext,
  createElement,
  isValidElement,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from 'react';

import type { MotionBlockProps, MotionTag } from './motion-block';
import { staggerContainer, staggerDelay, staggerItem } from '@/animations/variants';
import { viewport as viewportPresets, type ViewportPreset } from '@/lib/theme/animations';

/**
 * Staggered reveals — MASTER_PROJECT_PLAN.md §9.2.
 *
 *   <Stagger as="ul">                     six-step cascade, one trigger
 *     <StaggerItem as="li">…</StaggerItem>
 *   </Stagger>
 *
 *   <Stagger as="ul" stream>              each tile reveals as it arrives
 *
 * ── Two modes, and why ─────────────────────────────────────────────────────
 *
 * **Group** (the default) reveals every child from a single trigger, cascading
 * at 60ms and capping at six steps so a long grid never crawls in. It is right
 * for anything that fits roughly within one screen: a stat strip, a three-up
 * card row, a tag list.
 *
 * **Stream** gives every child its own trigger, so a tile animates as it
 * reaches the fold and not before. It is right for anything taller than a
 * screen — a nine-card catalogue in a single mobile column, a six-row service
 * list. In group mode those bottom tiles would finish animating while they were
 * still two screens below the fold, and the visitor would scroll down to
 * content that had already quietly arrived.
 *
 * In stream mode the container is a plain element rather than a variant parent,
 * because a Framer variant parent propagates its animation state to its
 * children and would override their own triggers.
 */

interface StaggerContextValue {
  stream: boolean;
}

const StaggerContext = createContext<StaggerContextValue>({ stream: false });

export interface StaggerProps extends Omit<MotionBlockProps, 'variants'> {
  /** Give each child its own scroll trigger. Use for anything over one screen tall. */
  stream?: boolean;
  variants?: Variants;
}

export function Stagger({
  children,
  className,
  delay = 0,
  repeat = false,
  viewport = 'enter',
  as = 'div',
  immediate = false,
  stream = false,
  variants = staggerContainer,
  id,
}: StaggerProps) {
  /**
   * Children are cloned only to hand each one its index-derived delay. A child
   * that is not a direct `<StaggerItem>` is left untouched and simply starts at
   * the group's own delay — it still animates, it just does not cascade.
   */
  const items = useMemo(
    () =>
      Children.map(children, (child, index) => {
        if (!isValidElement(child) || child.type !== StaggerItem) return child;

        const item = child as ReactElement<StaggerItemProps>;
        return cloneElement(item, {
          // In stream mode each child waits for its own trigger, so an
          // index-derived delay would only add lag to an already-timed arrival.
          delay: item.props.delay ?? (stream ? delay : staggerDelay(index, delay)),
        });
      }),
    [children, delay, stream],
  );

  const context = useMemo<StaggerContextValue>(() => ({ stream }), [stream]);

  if (stream) {
    return (
      <StaggerContext.Provider value={context}>
        {createElement(as, { id, className }, items)}
      </StaggerContext.Provider>
    );
  }

  const Component = m[as] as typeof m.div;
  const preset = viewportPresets[viewport];

  const scrollProps = immediate
    ? { animate: 'visible' as const }
    : {
        whileInView: 'visible' as const,
        viewport: { ...preset, once: !repeat },
      };

  return (
    <StaggerContext.Provider value={context}>
      <Component
        id={id}
        className={className}
        initial="hidden"
        variants={variants}
        {...scrollProps}
      >
        {items}
      </Component>
    </StaggerContext.Provider>
  );
}

export interface StaggerItemProps {
  children?: ReactNode;
  className?: string;
  as?: MotionTag;
  variants?: Variants;
  id?: string;
  /** Set by `<Stagger>`. Override only to pull one item out of the cascade. */
  delay?: number;
  /** Which trigger point to use in stream mode. Ignored in group mode. */
  viewport?: ViewportPreset;
}

/** A child of `<Stagger>`. Inherits the group's timing, or its own trigger. */
export function StaggerItem({
  children,
  className,
  as = 'div',
  variants = staggerItem,
  id,
  delay = 0,
  viewport = 'enter',
}: StaggerItemProps) {
  const { stream } = useContext(StaggerContext);
  const Component = m[as] as typeof m.div;

  // Group mode: no trigger of its own. The parent flips it from hidden to
  // visible, and `custom` decides where in the cascade it lands.
  if (!stream) {
    return (
      <Component
        id={id}
        className={className}
        data-motion="block"
        variants={variants}
        custom={delay}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      id={id}
      className={className}
      data-motion="block"
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewportPresets[viewport]}
    >
      {children}
    </Component>
  );
}

export default Stagger;
