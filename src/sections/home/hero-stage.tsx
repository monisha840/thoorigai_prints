'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { MouseParallaxLayer } from '@/components/motion';
import { lazyScene } from '@/components/three/lazy-scene';
import { SceneBoundary } from '@/components/three/scene-boundary';
import { resolveTier, tierAllows3D } from '@/lib/capability';
import { useBreakpoint, useMediaQuery } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/providers/motion-provider';
import { hero } from '@/content/home';
import { HeroMobile } from './hero-mobile';
import { cn } from '@/lib/utils';

/**
 * The hero's media slot: photograph first, story second.
 *
 * This is the loading contract from `MASTER_PROJECT_PLAN.md` §10.4, and the
 * order matters more than anything else in this file.
 *
 * 1. The photograph renders synchronously, always, with `priority`. **It is the
 *    LCP element** on every device — the canvas is never in the critical path.
 * 2. The frame reserves an explicit aspect ratio at all three breakpoints, so
 *    CLS is zero whether or not anything else ever arrives.
 * 3. **Below `lg` the answer is `HeroMobile` and the story stops there.** No
 *    tier probe, no dynamic import, no `three`.
 * 4. At `lg` and above, Tier C stops at the photograph permanently.
 * 5. Tiers A and B wait for the poster to decode, then for the browser to go
 *    idle, before importing anything.
 * 6. The two layers cross-fade once the canvas has its first frame up.
 * 7. Any failure fades the photograph back in and says nothing.
 *
 * Step 3 is new and is the point of this rewrite. The gate used to be the tier
 * check alone, and a modern phone passes every clause of it — so the live site
 * mounted the full desktop scene at a 390px viewport. A breakpoint is the right
 * question here because the answer is not "can this device cope" but "is this
 * the right *experience* for this screen", and on a phone it is not.
 *
 * ## The frame width, which is load-bearing
 *
 * The frame is `w-auto`, not `w-full`, and that is a fix rather than a style.
 * A block with an explicit `width: 100%` does not expand from negative
 * horizontal margins — `margin-left: -20px` shifts it left and
 * `margin-right: -20px` only grants overflow room. With `w-full` the "full
 * bleed" measured 350px wide inside a 390px viewport: flush to the left edge
 * with a 40px gap on the right. `cn` runs tailwind-merge, so `w-auto` genuinely
 * replaces the `w-full` in `mediaFrame` rather than depending on class order,
 * which does not decide CSS precedence.
 */

/** Invisible while the chunk downloads: §10.4 rule 7 — the poster is the loading state. */
const StoryCanvas = lazyScene<{ onReady?: () => void; still?: boolean; parallax?: boolean }>(
  () => import('@/components/three/press-story-canvas'),
  { placeholderClassName: 'opacity-0' },
);

export function HeroStage() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [mount3D, setMount3D] = useState(false);
  const [faded, setFaded] = useState(false);

  const isDesktop = useBreakpoint('lg');
  const finePointer = useMediaQuery('(pointer: fine)');
  const reduced = useReducedMotion();

  /**
   * Decide whether the canvas may load at all, then when.
   *
   * `useBreakpoint` returns `false` until it has measured, which is the right
   * way round: the first client render is the mobile branch for everybody, so
   * nothing starts and then has to be taken away a frame later.
   *
   * The deferral is deliberately conservative about *when*. The hero is above
   * the fold, so intersection is true on arrival and would gate nothing on its
   * own — the real deferral is waiting for the poster to decode and then for an
   * idle callback. That is what keeps a 240kb `three` download from competing
   * with the image LCP is actually measuring.
   */
  useEffect(() => {
    if (!isDesktop) return;
    if (!posterLoaded) return;
    if (!tierAllows3D(resolveTier())) return;

    const node = frameRef.current;
    if (!node) return;

    let idleHandle = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = () => setMount3D(true);
        // `requestIdleCallback` is still unavailable on Safari < 17, so the
        // timeout is a real fallback rather than belt-and-braces.
        idleHandle =
          typeof window.requestIdleCallback === 'function'
            ? window.requestIdleCallback(start, { timeout: 2000 })
            : window.setTimeout(start, 600);
      },
      { rootMargin: '200px 0px', threshold: 0 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (!idleHandle) return;
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
    };
  }, [isDesktop, posterLoaded]);

  /*
    Below `lg` the slot is the mobile story and nothing else — no frame, no
    poster, no observer. Rendering the photograph underneath it as well would
    download a second large image to sit invisibly behind a composition that
    already includes it.
  */
  if (!isDesktop) {
    return <HeroMobile className="-mx-1 sm:mx-0" />;
  }

  return (
    <div
      ref={frameRef}
      /*
        The ratio and the gutter bleed are load-bearing. The frame declares an
        explicit aspect at every breakpoint so nothing shifts, and `w-auto` is
        what lets the negative margins actually bleed rather than merely shift
        — see the note at the top of this file.
      */
      className={cn(
        'relative w-auto overflow-hidden rounded-none bg-paper-300 [&_img]:object-cover',
        '-mx-5 aspect-[4/5] sm:-mx-8 sm:aspect-[3/2] lg:mx-0 lg:w-full lg:aspect-[4/5]',
      )}
    >
      {/*
        The frame stays where the layout put it and the photograph moves inside
        it — §9.3's rule for card media. The 1.06 scale is the overscan that
        keeps the frame's edges covered at full deflection; without it the drift
        exposes the background.

        It fades as the canvas arrives. §10.4 rule 6 calls for a cross-fade, and
        it has to be a real one: the canvas has a transparent clear colour, so
        leaving the photograph underneath would put a folding sheet of paper on
        top of a photograph of a bound book and make both unreadable. The scene
        resolves onto the paper ground the section already uses.
      */}
      <MouseParallaxLayer
        depth={0.5}
        className={cn(
          'motion-crossfade absolute inset-0 scale-[1.06]',
          faded ? 'opacity-0' : 'opacity-100',
        )}
      >
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover"
          onLoad={() => setPosterLoaded(true)}
        />
      </MouseParallaxLayer>

      {/*
        The canvas sits outside the parallax layer deliberately. The rig does its
        own damped pointer lean in 3D, and stacking a DOM translate on top of it
        doubles the deflection into something that reads as drift rather than as
        depth.
      */}
      {mount3D ? (
        <SceneBoundary onError={() => setFaded(false)}>
          <div
            aria-hidden={faded ? undefined : true}
            className={cn('absolute inset-0 motion-crossfade', faded ? 'opacity-100' : 'opacity-0')}
          >
            {/* One frame after the canvas mounts, so the fade starts from a
                painted image rather than from an empty context. */}
            <StoryCanvas
              still={reduced}
              parallax={finePointer && !reduced}
              onReady={() => requestAnimationFrame(() => setFaded(true))}
            />
          </div>
        </SceneBoundary>
      ) : null}
    </div>
  );
}

export default HeroStage;
