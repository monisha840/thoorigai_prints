'use client';

import Image from 'next/image';

import { MouseParallaxLayer, Parallax } from '@/components/motion';
import { hero } from '@/content/home';
import { cn } from '@/lib/utils';

/**
 * The hero's media slot: one photograph of real finished work.
 *
 * ## Why there is no scene here any more
 *
 * This slot used to run a WebGL sequence narrating FILE → PROOF → PRESS →
 * FINISH → DELIVERY. It was removed, and the reasoning is worth keeping because
 * it is easy to talk yourself back into it:
 *
 * 1. **Abstract geometry does not explain itself.** The scene had no words, and
 *    two bars closing on a folded strip reads as two bars closing on a folded
 *    strip. The mobile variant of the same story communicated it far better,
 *    and the only difference was that mobile had a label and a caption — the
 *    meaning was coming from the text, not from the 3D.
 * 2. **Almost nobody saw the story.** The canvas mounted after the poster
 *    decoded and the browser went idle, two to three seconds in. The first two
 *    acts were usually over before a visitor looked up, and what persisted was
 *    the final frame — which was the least legible one of the five.
 * 3. **The page already tells it, in words.** `ProcessTimeline` is three
 *    sections below and is literally "From your file to your delivery — five
 *    stages", numbered and captioned. The hero was narrating the same beats,
 *    wordlessly, worse.
 *
 * So the hero's job went back to the one a hero is good at: show the work.
 * A print buyer's first question is "can they make my thing beautifully", and a
 * photograph of a board-on-board hard case answers that in the time it takes to
 * focus on it. The process story stays where it already reads.
 *
 * `hard-case-board-binding.jpg` is the one asset in the library with real zoom
 * headroom (2447², §8.3), which is why it can carry a hero at all — nine of the
 * in-use product shots are under 700px and could not.
 *
 * ## What is left, and why each piece is here
 *
 * - **The matte.** The photograph is a studio shot on near-white, and
 *   `docs/image-usage-guide.md` is explicit that a light-ground image on a
 *   paper-coloured page dissolves into it. `bg-paper-300` is the matte that
 *   gives it an edge, so the binding reads as an object that has been *placed*.
 * - **The overscan.** The frame stays exactly where the layout put it and the
 *   photograph moves inside it — §9.3's rule for card media. `scale-[1.06]` is
 *   the overscan that keeps the frame's edges covered at full pointer
 *   deflection; without it the drift exposes the matte behind.
 * - **The scroll drift.** `Parallax` clamps to 20px, disables itself below `lg`
 *   and under reduced motion, and renders no transform at all when off — so
 *   nothing is promoted to a compositor layer for nothing.
 *
 * ## The frame width, which is load-bearing
 *
 * `w-auto`, not `w-full`, and that is a fix rather than a style. A block with an
 * explicit `width: 100%` does not expand from negative horizontal margins —
 * `margin-left: -20px` shifts it left and `margin-right: -20px` only grants
 * overflow room. With `w-full` this measured 350px wide inside a 390px viewport:
 * flush to the left edge with a 40px gap on the right. `cn` runs tailwind-merge,
 * so `w-auto` genuinely replaces the utility rather than depending on class
 * order, which does not decide CSS precedence.
 *
 * The photograph is `priority` and is the LCP element on every device. There is
 * no longer anything on this page that could compete with it.
 */
export function HeroStage() {
  return (
    <Parallax offset={14}>
      <div
        className={cn(
          'relative w-auto overflow-hidden rounded-none bg-paper-300',
          '-mx-5 aspect-[4/5] sm:-mx-8 sm:aspect-[3/2] lg:mx-0 lg:w-full lg:aspect-[4/5]',
          // Contained from `lg` up, so it can carry a shadow. Below that it runs
          // edge to edge, where a shadow would have nothing to fall on.
          'lg:shadow-[0_32px_80px_-32px_rgba(38,34,54,0.32)]',
        )}
      >
        <MouseParallaxLayer depth={0.5} className="absolute inset-0 scale-[1.06]">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
        </MouseParallaxLayer>
      </div>
    </Parallax>
  );
}

export default HeroStage;
