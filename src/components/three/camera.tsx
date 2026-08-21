'use client';

import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

import { cameraPresets, type CameraPreset } from '@/three/config';

/**
 * The scene camera.
 *
 * Declared as a component rather than passed to `<Canvas camera={…}>` so a
 * scene can swap framings, and so the field of view can widen on narrow
 * viewports — without that, a phone crops the subject out of frame.
 */

export interface CameraProps {
  preset?: CameraPreset;
  /** Overrides the preset position. */
  position?: [number, number, number];
  fov?: number;
  /** Point the camera here on mount. */
  lookAt?: [number, number, number];
}

export function Camera({ preset = 'hero', position, fov, lookAt = [0, 0, 0] }: CameraProps) {
  const config = cameraPresets[preset];
  const width = useThree((state) => state.size.width);

  /**
   * Widen the field of view below the `md` breakpoint so the subject still fits.
   *
   * **This measures the canvas, not the viewport.** `state.size` is the
   * renderer's drawing buffer, so the 1.35 widen fires for any canvas narrower
   * than 768px — including a wide desktop window where the scene sits in a
   * column. The hero's media slot is about 660px on a 1440px screen, so a
   * desktop visitor gets the phone framing and the subject renders at roughly
   * two-thirds the size intended.
   *
   * That is correct for a full-bleed scene on a real phone and wrong for a
   * scene in a column, and there is no way to tell the two apart from here.
   * A scene in a column should compensate on its own side — see `SCENE_SCALE`
   * in `three/fold-sequence.ts` — rather than this preset being retuned, which
   * would misframe every full-bleed scene to fix one column.
   */
  const isNarrow = width < 768;
  const resolvedFov = (fov ?? config.fov) * (isNarrow ? 1.35 : 1);

  return (
    <PerspectiveCamera
      makeDefault
      position={position ?? config.position}
      fov={resolvedFov}
      near={config.near}
      far={config.far}
      onUpdate={(camera) => camera.lookAt(lookAt[0], lookAt[1], lookAt[2])}
    />
  );
}

export default Camera;
