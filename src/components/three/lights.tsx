'use client';

import { lightRig } from '@/three/config';

/**
 * The house three-point rig: neutral key, cool press-blue fill, warm foil rim.
 *
 * It is what makes an untextured shape read as printed material rather than a
 * grey blob, and keeping it in one component means every scene on the site is
 * lit identically.
 *
 * Shadows are off by default — a soft contact shadow costs a whole extra render
 * pass, and at this scale a plain `<ContactShadows>` under the object is
 * cheaper if one is ever needed.
 */

export interface LightsProps {
  /** Scales all three sources at once, for a dark section. */
  intensity?: number;
  /** Add the warm rim. Off for scenes where gold would compete with content. */
  rim?: boolean;
}

export function Lights({ intensity = 1, rim = true }: LightsProps) {
  return (
    <>
      <ambientLight
        intensity={lightRig.ambient.intensity * intensity}
        color={lightRig.ambient.color}
      />

      <directionalLight
        position={lightRig.key.position}
        intensity={lightRig.key.intensity * intensity}
        color={lightRig.key.color}
      />

      <directionalLight
        position={lightRig.fill.position}
        intensity={lightRig.fill.intensity * intensity}
        color={lightRig.fill.color}
      />

      {rim ? (
        <pointLight
          position={lightRig.rim.position}
          intensity={lightRig.rim.intensity * intensity}
          color={lightRig.rim.color}
          distance={18}
          decay={2}
        />
      ) : null}
    </>
  );
}

export default Lights;
