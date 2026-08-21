'use client';

import type { ReactNode } from 'react';

import { MotionProvider } from './motion-provider';
import { ScrollProvider } from './scroll-provider';

/**
 * Every client-side provider the app needs, in one wrapper, mounted once in
 * `src/app/layout.tsx`. Adding a provider (analytics, cart, theme) means adding
 * it here — nothing else changes.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  // Order matters: `ScrollProvider` reads the motion preference to decide
  // whether to construct Lenis at all, so it has to sit inside `MotionProvider`.
  return (
    <MotionProvider>
      <ScrollProvider>{children}</ScrollProvider>
    </MotionProvider>
  );
}

export { MotionProvider, ScrollProvider };
export default AppProviders;
