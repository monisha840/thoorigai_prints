'use client';

import { useEffect } from 'react';

import { useLenis } from '@/providers/scroll-provider';

/**
 * Freeze the page behind an open drawer or modal.
 *
 * Compensates for the disappearing scrollbar so the layout does not jump on
 * desktop, and restores whatever `overflow`/`paddingRight` the body already had
 * rather than assuming the defaults.
 *
 * Lenis has to be stopped as well as the body. `overflow: hidden` stops the
 * browser scrolling, but Lenis drives the scroll position itself every frame
 * and would keep trying — so a wheel gesture over an open drawer would move the
 * page underneath it the moment the drawer closed.
 */
export function useLockBodyScroll(locked: boolean): void {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    lenis?.stop();

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      lenis?.start();
    };
  }, [locked, lenis]);
}

export default useLockBodyScroll;
