'use client';

import { m } from 'framer-motion';

import { duration, easing, viewport } from '@/lib/theme/animations';
import { cn } from '@/lib/utils';

/**
 * The seam between two sections.
 *
 * `Section`'s `divided` prop used to draw a static `border-t`. The rule is the
 * one piece of the page that literally belongs to two sections at once, so it
 * is the natural place to make a boundary feel like a handover rather than a
 * stop: it draws itself across as the lower section arrives, and the eye
 * follows it in.
 *
 * It is drawn early — `viewport.early`, so it starts the moment the boundary
 * appears rather than waiting for the fold — and slowly, over `--d-scene`. Both
 * are deliberate. The seam should already be running when the section's own
 * content begins to reveal, so the two overlap and there is no dead frame
 * between one section finishing and the next starting. That overlap is what
 * "connected" actually means in practice; everything else is decoration.
 *
 * It is ambient motion, at the bottom of the hierarchy: 1px tall, one shade off
 * the background, and it never competes with a heading for attention.
 *
 * Under reduced motion and with JavaScript off, the `[data-motion]` rules in
 * `globals.css` reset the transform, leaving exactly the hairline that was
 * there before.
 */
export function SectionSeam({ inverted = false }: { inverted?: boolean }) {
  return (
    <m.span
      aria-hidden
      data-motion="seam"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 block h-px origin-left',
        inverted ? 'bg-paper-100/12' : 'bg-paper-400',
      )}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewport.early}
      transition={{ duration: duration.scene, ease: easing.standard }}
    />
  );
}

export default SectionSeam;
