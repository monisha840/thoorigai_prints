'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

import { ScenePlaceholder } from './scene-placeholder';

/**
 * How every 3D block on the site gets mounted.
 *
 * `three` + R3F + drei is roughly 240kb of JavaScript on top of the app bundle.
 * `dynamic(…, { ssr: false })` keeps all of it out of the initial payload and
 * out of the server render, so a visitor who never reaches the canvas never
 * downloads it.
 *
 * The important rule — and the easy one to get wrong — is that the *whole*
 * scene, canvas and contents together, must live inside the dynamically
 * imported module. Passing `<FloatingObject />` as a child from an eagerly
 * loaded file statically imports `three` right back into the main bundle, and
 * the code-splitting silently stops working.
 *
 *   // hero-canvas.tsx — 'use client', owns the Canvas AND its contents
 *   export default function HeroCanvas() {
 *     return (
 *       <Scene cameraPreset="hero">
 *         <FloatingObject />
 *       </Scene>
 *     );
 *   }
 *
 *   // hero-scene.tsx — eager, three-free
 *   const HeroCanvas = lazyScene(() => import('./hero-canvas'));
 */
export function lazyScene<P extends object = Record<string, never>>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options?: { placeholderClassName?: string },
) {
  return dynamic(loader, {
    ssr: false,
    loading: () => <ScenePlaceholder className={options?.placeholderClassName} />,
  });
}

export { ScenePlaceholder };
export default lazyScene;
