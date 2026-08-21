'use client';

import { FloatingObject } from '@/components/three/floating-object';
import { Scene } from '@/components/three/scene';

/**
 * The home hero's 3D content.
 *
 * Canvas and contents live in this one module so `lazyScene` can split all of
 * `three` out of the initial bundle — see the note in `lazy-scene.tsx`.
 *
 * The subject is the default placeholder sheet from `FloatingObject`. Swap in
 * real geometry here when the studio's models are ready; nothing outside this
 * file needs to change.
 */
export default function HeroCanvas() {
  return (
    <Scene cameraPreset="hero" className="absolute inset-0">
      <FloatingObject rotation={[0.1, -0.35, 0.04]} scale={1.15} />
    </Scene>
  );
}
