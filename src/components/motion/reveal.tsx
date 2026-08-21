'use client';

import type { MotionBlockProps } from './motion-block';
import { MotionBlock } from './motion-block';
import { fadeIn, fadeUp, revealLine } from '@/animations/variants';
import { cn } from '@/lib/utils';

/**
 * Entrance wrappers — MASTER_PROJECT_PLAN.md §9.2, "one pattern, used
 * everywhere".
 *
 *   <FadeUp>…</FadeUp>              opacity + 16px rise, 480ms   ← the default
 *   <FadeUp delay={0.1}>…</FadeUp>  the same, held for 100ms
 *   <FadeIn>…</FadeIn>              opacity only, for photography
 *   <Reveal>…</Reveal>              clip-path window, hero headlines only
 *
 * There is deliberately no `FadeDown`, no slide-from-the-side and no scale-in.
 * One entrance is what makes a site feel composed rather than assembled; the
 * moment there are four, every section starts arguing with the next one.
 */

/** The house entrance. Reach for this first, and usually only this. */
export function FadeUp({ variants, ...props }: MotionBlockProps) {
  return <MotionBlock variants={variants ?? fadeUp} {...props} />;
}

/**
 * Opacity only. For full-bleed photography, where a 16px rise fights the frame
 * edge, and for anything already sitting in its final position.
 */
export function FadeIn({ variants, ...props }: MotionBlockProps) {
  return <MotionBlock variants={variants ?? fadeIn} {...props} />;
}

/**
 * Display type uncovered through a clip-path window, the way a sheet comes off
 * the stack. One line at a time — never a character at a time (§9.2).
 *
 * The wrapper supplies its own `overflow-hidden`, and carries
 * `data-motion="reveal"` so the reduced-motion rule in `globals.css` can drop
 * the clip: `clipPath` is not a Framer positional key, so `reducedMotion` alone
 * would leave the wipe running.
 *
 * ## `className="block"` on the inner element is load-bearing
 *
 * It is the fix for a bug that hid a word of the homepage H1 on every render
 * since this component was written.
 *
 * `MotionBlock` renders `as="span"`, and a bare `<span>` is a non-replaced
 * **inline** box. Two CSS rules follow from that, and both bite:
 *
 * 1. **`clip-path` on a fragmented inline box resolves against the first
 *    fragment's border box.** The moment the text inside wraps — which the hero
 *    headline does at every breakpoint, because its grid column is ~624px
 *    against ~800px of Fraunces — `inset(0% 0% 0% 0%)` is measured against line
 *    one, and every glyph on line two is clipped away permanently. Not for the
 *    duration of the animation: permanently. The outer wrapper is `block` and
 *    tall enough for both lines, so the space stays reserved and the result
 *    reads as an inexplicable gap in the headline.
 * 2. **`transform` does not apply to non-replaced inline elements at all**, so
 *    `revealLine`'s 16px rise has never once run. The `overflow-hidden` and the
 *    `pb`/`-mb` pair on the wrapper exist to mask exactly that rise, and until
 *    now have been guarding nothing.
 *
 * Making the animated element `block` fixes both: the clip resolves against the
 * whole block box including wrapped lines, and the rise starts working.
 *
 * It cannot break a call site. `Reveal` is display type only, always a direct
 * child of a block-level heading, and is never used inline within a sentence.
 */
export function Reveal({ className, variants, ...props }: MotionBlockProps) {
  return (
    <span className={cn('block overflow-hidden pb-[0.15em] -mb-[0.15em]', className)}>
      <MotionBlock
        variants={variants ?? revealLine}
        as="span"
        className="block"
        data-motion="reveal"
        {...props}
      />
    </span>
  );
}

/**
 * @deprecated Use `FadeUp`. §9.2 allows one scroll-reveal pattern; these are
 * kept as aliases so existing call sites keep compiling, and they now animate
 * identically to `FadeUp`. Remove the import when you next touch the file.
 */
export const FadeUpLarge = FadeUp;
/** @deprecated Use `FadeUp`. */
export const FadeDown = FadeUp;
/** @deprecated Use `FadeUp`, or `FadeIn` for media. */
export const FadeLeft = FadeUp;
/** @deprecated Use `FadeUp`, or `FadeIn` for media. */
export const FadeRight = FadeUp;
/** @deprecated Use `FadeUp`. Nothing on this site scales into place. */
export const ScaleIn = FadeUp;
