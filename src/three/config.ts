import { threeColors } from '@/lib/theme';

/**
 * React Three Fiber configuration — the non-component half of the 3D layer.
 *
 * Scene *components* live in `src/components/three/`. This file holds the
 * numbers they share: renderer settings, camera presets and the light rig, so
 * every scene on the site is lit and framed the same way.
 */

/** Canvas/renderer defaults, tuned for a mid-range phone rather than a desktop GPU. */
export const canvasDefaults = {
  /**
   * Cap the pixel ratio at 2. Rendering at a phone's native 3x costs roughly
   * 2.25x the fragments for no perceptible gain, and it is the single biggest
   * 3D drain on a Lighthouse mobile score.
   */
  dpr: [1, 2] as [number, number],
  /**
   * Per-scene ceilings, from MASTER_PROJECT_PLAN.md §10.5 rule 6. Not enforced
   * by anything — written down here, next to the DPR note, so a scene author
   * can find them before they matter rather than after a profiling session.
   *
   * For reference, the hero's fold sequence spends 60 triangles and five draw
   * calls against these, which is the headroom that lets it hold 60fps on a
   * mid-range Android while the LCP image is still settling.
   */
  budget: {
    triangles: 50_000,
    /** Distinct materials resident at once. */
    materialVariants: 3,
    /** Real-time lights. Everything beyond this should be baked. */
    lights: 1,
    textureSize: { desktop: 2048, mobile: 1024 },
  },
  gl: {
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance' as const,
    /** Needed only if a scene is ever screenshotted to canvas. */
    preserveDrawingBuffer: false,
    stencil: false,
    depth: true,
  },
  /**
   * Fallback only. `Scene` overrides this per-instance: `always` while the
   * canvas is on screen, `never` once it scrolls away, `demand` for visitors
   * who have asked for reduced motion.
   */
  frameloop: 'always' as const,
  shadows: false,
} as const;

/** Camera framings. `hero` is the wide editorial view; `product` is closer. */
export const cameraPresets = {
  hero: { position: [0, 0.4, 6] as [number, number, number], fov: 32, near: 0.1, far: 60 },
  product: { position: [0, 0.2, 4] as [number, number, number], fov: 38, near: 0.1, far: 40 },
  detail: { position: [1.6, 1.1, 2.8] as [number, number, number], fov: 42, near: 0.1, far: 30 },
} as const;

export type CameraPreset = keyof typeof cameraPresets;

/**
 * Three-point rig in brand colour: a neutral key, a cool press-blue fill and a
 * warm foil-gold rim. It is what makes an untextured shape read as printed
 * material rather than as a grey blob.
 */
export const lightRig = {
  ambient: { intensity: 0.55, color: threeColors.objectPaper },
  key: {
    position: [4, 6, 5] as [number, number, number],
    intensity: 2.4,
    color: threeColors.key,
  },
  fill: {
    position: [-5, 1.5, 3] as [number, number, number],
    intensity: 0.9,
    color: threeColors.fill,
  },
  rim: {
    position: [-2, 3, -5] as [number, number, number],
    intensity: 1.6,
    color: threeColors.rim,
  },
} as const;

/** Default material feel: uncoated stock — matte, slightly rough, no clearcoat. */
export const materials = {
  paperStock: { roughness: 0.86, metalness: 0.0, color: threeColors.objectPaper },
  inkStock: { roughness: 0.62, metalness: 0.04, color: threeColors.objectPrimary },
  foil: { roughness: 0.22, metalness: 0.85, color: threeColors.objectAccent },
} as const;

/** Idle drift applied by `FloatingObject`. Slow enough to read as weight. */
export const floatDefaults = {
  /** Vertical travel in world units. */
  amplitude: 0.14,
  /** Bob cycles per second. */
  speed: 0.42,
  /** Radians per second of Y rotation. */
  spin: 0.12,
  /** How far the object tilts toward the pointer, in radians. */
  tilt: 0.18,
} as const;

export default canvasDefaults;
