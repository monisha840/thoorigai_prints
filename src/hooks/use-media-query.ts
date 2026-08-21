'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribe to a media query.
 *
 * Returns `false` on the server and on the first client render so markup
 * matches and React does not warn about hydration; the real value lands in the
 * effect immediately after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Breakpoints, matching the `--breakpoint-*` tokens in globals.css. */
export const breakpointQuery = {
  xs: '(min-width: 22.5rem)',
  sm: '(min-width: 40rem)',
  md: '(min-width: 48rem)',
  lg: '(min-width: 64rem)',
  xl: '(min-width: 80rem)',
  '2xl': '(min-width: 96rem)',
  '3xl': '(min-width: 112rem)',
} as const;

export type Breakpoint = keyof typeof breakpointQuery;

/** `useBreakpoint('lg')` — true at 1024px and above. */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(breakpointQuery[breakpoint]);
}

/** True below the `lg` breakpoint, where the drawer nav takes over. */
export function useIsMobileNav(): boolean {
  return !useBreakpoint('lg');
}

export default useMediaQuery;
