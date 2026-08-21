'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { MouseParallaxLayer } from '@/components/motion';
import { lazyScene } from '@/components/three/lazy-scene';
import { SceneBoundary } from '@/components/three/scene-boundary';
import { resolveTier, tierAllows3D } from '@/lib/capability';
import { hero } from '@/content/home';
import { mediaFrame } from './shared';

/**
 * The hero's media slot: photograph first, fold sequence second.
 *
 * This is the loading contract from `MASTER_PROJECT_PLAN.md` §10.4, and the
 * order matters more than anything else in this file.
 *
 * 1. The photograph renders synchronously, always, with `priority`. **It is the
 *    LCP element**, and it is still the LCP element on every device — the
 *    canvas is never in the critical path.
 * 2. The frame reserves an explicit aspect ratio at all three breakpoints, so
 *    CLS is zero whether or not the canvas ever arrives.
 * 3. Tier C stops here permanently and never fetches the 3D chunk.
 * 4. Tiers A and B wait for the poster to finish loading, then for the browser
 *    to go idle, before importing anything.
 * 5. The two layers cross-fade once the canvas has its first frame up.
 * 6. Any failure fades the photograph back in and says nothing.
 *
 * Step 5 is a genuine cross-fade, not an overlay. The canvas has a transparent
 * clear colour, so keeping the photograph beneath it would put a folding sheet
 * of paper on top of a photograph of a bound book — two subjects competing in
 * one frame, both unreadable. The scene resolves onto the paper ground instead.
 *
 * The poster is *not* a placeholder to be discarded. A visitor on a cheap phone
 * or a slow connection sees a finished photograph of real work, which is a
 * perfectly good hero — §10.5 rule 8.
 */

/** Invisible while the chunk downloads: §10.4 rule 7 — the poster is the loading state. */
const FoldCanvas = lazyScene<{ onReady?: () => void }>(
  () => import('@/components/three/fold-sequence-canvas'),
  { placeholderClassName: 'opacity-0' },
);

export function HeroStage() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [mount3D, setMount3D] = useState(false);
  const [faded, setFaded] = useState(false);

  /**
   * Decide whether the canvas may load at all, then when.
   *
   * The gate is deliberately conservative about *when*. The hero is above the
   * fold, so intersection is true on arrival and would gate nothing on its own
   * — the real deferral is waiting for the poster to decode and then for an
   * idle callback. That is what keeps a 240kb `three` download from competing
   * with the image LCP is actually measuring, which is the mobile concern §10.2
   * raises when it calls for the hero to stay quiet.
   */
  useEffect(() => {
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
        // Tested as a function rather than with `'requestIdleCallback' in
        // window`: lib.dom declares the method as always present, so the `in`
        // guard narrows the else branch to `never` and `window.setTimeout`
        // stops type-checking.
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
  }, [posterLoaded]);

  return (
    <div
      ref={frameRef}
      /*
        The ratio and the gutter bleed are load-bearing. The frame declares an
        explicit aspect at every breakpoint so nothing shifts, and the negative
        margins let the image bleed through the gutter below `lg`. Changing
        either reintroduces CLS and breaks the mobile gutter.
      */
      className={`${mediaFrame} relative -mx-5 aspect-[4/5] sm:-mx-8 sm:aspect-[3/2] lg:mx-0 lg:aspect-[4/5]`}
    >
      {/*
        The frame stays where the layout put it and the photograph moves inside
        it — §9.3's rule for card media. The 1.06 scale is the overscan that
        keeps the frame's edges covered at full deflection; without it the drift
        exposes the background.

        It fades as the canvas arrives. §10.4 rule 6 calls for a cross-fade, and
        it has to be a real one: the canvas is transparent, so leaving the
        photograph underneath puts a folding sheet of paper on top of a
        photograph of a book and makes both unreadable. The scene resolves onto
        the paper ground the rest of the section already uses.
      */}
      <MouseParallaxLayer
        depth={0.5}
        className={`motion-crossfade absolute inset-0 scale-[1.06] ${
          faded ? 'opacity-0' : 'opacity-100'
        }`}
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
        The canvas sits outside the parallax layer deliberately. `FoldRig` does
        its own damped pointer tilt in 3D, and stacking a DOM translate on top
        of it doubles the deflection into something that reads as drift rather
        than as depth.
      */}
      {mount3D ? (
        <SceneBoundary onError={() => setFaded(false)}>
          <div
            aria-hidden={faded ? undefined : true}
            className={`absolute inset-0 motion-crossfade ${
              faded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* One frame after the canvas mounts, so the fade starts from a
                painted image rather than from an empty context. */}
            <FoldCanvas onReady={() => requestAnimationFrame(() => setFaded(true))} />
          </div>
        </SceneBoundary>
      ) : null}
    </div>
  );
}

export default HeroStage;
