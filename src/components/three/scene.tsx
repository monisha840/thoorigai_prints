'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

import { Camera } from './camera';
import { Lights } from './lights';
import { useReducedMotion } from '@/providers/motion-provider';
import { canvasDefaults, type CameraPreset } from '@/three/config';
import { cn } from '@/lib/utils';

/**
 * The R3F canvas wrapper every 3D block on the site mounts.
 *
 * Three things keep it off the critical path:
 *
 * 1. The frame loop stops when the canvas scrolls out of view. A canvas that
 *    keeps rendering off-screen is the classic way a 3D hero eats a phone's
 *    battery and a Lighthouse score.
 * 2. Reduced-motion visitors get `frameloop="demand"` — one frame, then still.
 * 3. Pixel ratio is capped at 2 (see `three/config.ts`).
 *
 * Do not import this directly into a page — use `LazyScene`, which keeps three
 * out of the initial bundle.
 */

export interface SceneProps {
  children?: ReactNode;
  className?: string;
  cameraPreset?: CameraPreset;
  /** Supply your own camera/lights instead of the defaults. */
  bare?: boolean;
  lightIntensity?: number;
  /** Rendered while the scene's own suspense boundary is pending. */
  fallback?: ReactNode;
  /** Decorative by default; give it a label if the scene carries meaning. */
  label?: string;
}

export function Scene({
  children,
  className,
  cameraPreset = 'hero',
  bare = false,
  lightIntensity = 1,
  fallback = null,
  label,
}: SceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  /**
   * The provider's combined signal, not the bare media query.
   *
   * Reduced motion arrives on this site through two channels: the OS setting,
   * and the site's own toggle in the footer, which writes
   * `data-motion-preference="reduced"` and drives both `globals.css` and
   * Framer's `MotionConfig`. `usePrefersReducedMotion` sees only the first, so
   * reading it here meant a visitor who used the footer toggle got every other
   * animation stopped while the canvas kept rendering at `always`.
   */
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // Start a little before it enters so the first frame is not visibly late.
      { rootMargin: '200px 0px', threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const frameloop = reducedMotion ? 'demand' : inView ? 'always' : 'never';

  return (
    <div
      ref={wrapperRef}
      className={cn('relative h-full w-full', className)}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <Canvas
        dpr={canvasDefaults.dpr}
        gl={canvasDefaults.gl}
        shadows={canvasDefaults.shadows}
        frameloop={frameloop}
        // The canvas is decorative; keep it out of the tab order.
        tabIndex={-1}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={fallback}>
          {bare ? null : (
            <>
              <Camera preset={cameraPreset} />
              <Lights intensity={lightIntensity} />
            </>
          )}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene;
