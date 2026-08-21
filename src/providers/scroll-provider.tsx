'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { smoothScroll } from '@/lib/theme/animations';
import { useReducedMotion } from './motion-provider';

/**
 * Smooth scrolling, via Lenis.
 *
 * Lenis does not fake scrolling — it intercepts wheel input and drives the real
 * `window.scrollY` towards a target each frame. That matters more than it
 * sounds: because the scroll position is genuine, `IntersectionObserver` still
 * fires, Framer's `useScroll` still reads correctly, the scrollbar still tracks,
 * anchor links still work, and find-in-page still lands where it should. A
 * transform-based fake would break every one of those.
 *
 * ── When it does not run ───────────────────────────────────────────────────
 *
 * **Reduced motion.** Someone who has asked for less motion has not asked for
 * their scroll wheel to be reinterpreted. The instance is destroyed outright,
 * not merely stopped.
 *
 * **Coarse pointers.** Touch scrolling is a solved problem that the platform
 * solves better than any library: it has the right rubber-banding, the right
 * momentum, and it runs off the main thread. `syncTouch` would take all of that
 * away in exchange for nothing. So Lenis is only ever constructed where there is
 * a wheel to smooth.
 *
 * Both conditions are watched, not sampled once — a visitor toggling the motion
 * switch in the footer gets native scrolling back on the next frame.
 */

const LenisContext = createContext<Lenis | null>(null);

/**
 * The live Lenis instance, or `null` when smooth scrolling is off — which is
 * the normal case on a phone, so always handle the null.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (reduced || !finePointer) return;

    const instance = new Lenis({
      lerp: smoothScroll.lerp,
      wheelMultiplier: smoothScroll.wheelMultiplier,
      smoothWheel: true,
      // The platform's own touch scrolling, untouched. See the note above.
      syncTouch: false,
      // Lenis and CSS `scroll-behavior: smooth` both animate the same scroll
      // position and fight when a hash link is clicked. `anchors` hands anchor
      // handling to Lenis; `globals.css` switches the CSS behaviour off
      // whenever `html.lenis` is present, so only one of them is ever driving.
      anchors: { offset: smoothScroll.anchorOffset },
      // Driven below, so the loop stops cleanly with the component instead of
      // outliving it.
      autoRaf: false,
    });

    setLenis(instance);

    let frame = requestAnimationFrame(function loop(time: number) {
      instance.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      // Removes the `lenis` classes from <html> and releases the wheel.
      instance.destroy();
      setLenis(null);
    };
  }, [reduced, finePointer]);

  // A route change swaps the whole document body. Lenis caches the scrollable
  // height, so without this the last page's height governs how far the new one
  // can scroll. Deliberately not a `scrollTo(0)`: Next already resets the
  // position on forward navigation and restores it on back, and forcing the top
  // here would break the second case.
  useEffect(() => {
    lenis?.resize();
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export default ScrollProvider;
