'use client';

import { lazyScene } from '@/components/three/lazy-scene';

/**
 * The 3D slot in the home hero.
 *
 * Thin on purpose: it exists so `hero.tsx` can stay a server component while
 * the canvas — and the ~240kb of `three` that comes with it — is fetched only
 * once this module mounts on the client.
 */
const HeroCanvas = lazyScene(() => import('./hero-canvas'));

export function HeroScene() {
  return <HeroCanvas />;
}

export default HeroScene;
