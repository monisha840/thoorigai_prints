'use client';

import { useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

export interface ScrollPosition {
  y: number;
  /** Past the `threshold` — the navbar uses this to condense. */
  isScrolled: boolean;
  direction: ScrollDirection;
  /** 0–1 progress through the document. */
  progress: number;
}

/**
 * Scroll state, read on rAF so the listener never blocks the main thread.
 * The listener is passive, and state only updates when a value actually
 * changes, which keeps the navbar from re-rendering on every pixel.
 */
export function useScrollPosition(threshold = 24): ScrollPosition {
  const [state, setState] = useState<ScrollPosition>({
    y: 0,
    isScrolled: false,
    direction: 'up',
    progress: 0,
  });

  const lastY = useRef(0);
  const ticking = useRef(false);
  // Held in a ref, not read off state: `read` is created once and would
  // otherwise close over the direction from the first render forever.
  const directionRef = useRef<ScrollDirection>('up');

  useEffect(() => {
    const read = () => {
      const y = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
      // Ignore sub-pixel jitter and iOS rubber-banding past the ends.
      const delta = y - lastY.current;
      const direction: ScrollDirection =
        Math.abs(delta) < 4 ? directionRef.current : delta > 0 ? 'down' : 'up';
      directionRef.current = direction;

      lastY.current = y > 0 ? y : 0;
      ticking.current = false;

      setState((prev) => {
        const next = { y, isScrolled: y > threshold, direction, progress };
        if (
          prev.isScrolled === next.isScrolled &&
          prev.direction === next.direction &&
          Math.abs(prev.y - next.y) < 1
        ) {
          return prev;
        }
        return next;
      });
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return state;
}

export default useScrollPosition;
