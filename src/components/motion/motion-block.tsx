'use client';

import { m } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';

import { viewport as viewportPresets, type ViewportPreset } from '@/lib/theme/animations';

/**
 * The shared body of every entrance wrapper.
 *
 * Sections never touch Framer directly. They use the wrappers built on this,
 * which keeps the `m.*` namespace requirement of `LazyMotion` in one place and
 * means a section file reads as layout rather than as animation config.
 */

/** Tags a motion wrapper can render as. Add to this list, not to a cast. */
export type MotionTag =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'footer'
  | 'aside'
  | 'nav'
  | 'ul'
  | 'ol'
  | 'li'
  | 'dl'
  | 'dt'
  | 'dd'
  | 'span'
  | 'p'
  | 'figure'
  | 'figcaption'
  | 'blockquote'
  | 'h2'
  | 'h3';

export interface MotionBlockProps {
  children?: ReactNode;
  className?: string;
  /**
   * Seconds to hold before this element starts. Passed to Framer as `custom`,
   * not as a `transition` prop — see the note at the top of
   * `src/animations/variants.ts` for why the `transition` prop cannot work.
   */
  delay?: number;
  /** Replay the animation each time it re-enters. §9.2 says reveals run once. */
  repeat?: boolean;
  /** Which trigger point to use. See `viewport` in `lib/theme/animations.ts`. */
  viewport?: ViewportPreset;
  as?: MotionTag;
  /**
   * Animate on mount instead of on scroll. §9.2: "Nothing animates on page load
   * except the hero" — so this belongs on hero content and nowhere else.
   */
  immediate?: boolean;
  /** Escape hatch: supply your own variants. */
  variants?: Variants;
  /** Anchor target, for sections that are deep-linked. */
  id?: string;
}

export function MotionBlock({
  children,
  className,
  delay = 0,
  repeat = false,
  viewport = 'enter',
  as = 'div',
  immediate = false,
  variants,
  id,
  ...rest
}: MotionBlockProps & { variants: Variants; 'data-motion'?: string }) {
  const Component = m[as] as typeof m.div;
  const preset = viewportPresets[viewport];

  const scrollProps = immediate
    ? { animate: 'visible' as const }
    : {
        whileInView: 'visible' as const,
        viewport: { ...preset, once: !repeat },
      };

  return (
    <Component
      id={id}
      className={className}
      // Marks this as a reveal, so the `<noscript>` rule in `app/layout.tsx`
      // can undo the hidden state Framer writes into the server-rendered
      // markup. Without it, no JavaScript means a blank page.
      data-motion="block"
      initial="hidden"
      variants={variants}
      // The delay lives here. A `transition={{ delay }}` prop would be
      // discarded by any variant that defines its own transition.
      custom={delay}
      {...scrollProps}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default MotionBlock;
