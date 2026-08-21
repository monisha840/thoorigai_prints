'use client';

import { OrthographicCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, TubeGeometry } from 'three';

import { Scene } from './scene';
import {
  FRAME,
  PULSE,
  SEQUENCE_DURATION,
  TUBE,
  createPressPath,
  drawProgress,
  pulseProgress,
} from '@/three/press-path';
import { threeColors } from '@/lib/theme';
import { useReducedMotion } from '@/providers/motion-provider';

/**
 * The paper path, traced in light over the photograph of the press.
 *
 * ## What it is for
 *
 * §10.1's bar is that a scene answers a question a buyer actually has. This one
 * answers *"what happens to my sheet in there?"* — the machine is four white
 * boxes in a row until something shows that paper enters at the right, crosses
 * the engine and leaves finished at the left. A photograph cannot show a route.
 *
 * ## The camera, which is the whole trick
 *
 * `bare`, with an **orthographic** camera framed to exactly the photograph's
 * 1.0 × 0.75 box. Everything then lives in the same percentage space as the
 * markers in `content/home.ts`, so the path is tunable by reading coordinates
 * off the image rather than by guessing at world units against a perspective
 * frustum nobody can solve for. See `three/press-path.ts`.
 *
 * `manual` is load-bearing, not decoration: R3F's resize handler overwrites an
 * orthographic frustum with raw pixel dimensions unless the camera claims to be
 * user-owned (`updateCamera` in `@react-three/fiber` returns early on
 * `camera.manual`). Without it the frame silently becomes 1440 × 1050 *units*
 * on first resize and the entire path collapses to a dot at the origin.
 *
 * ## Two tubes, one curve
 *
 * The trace and the pulse are the same geometry twice, differing only in draw
 * range and material: the trace reveals from 0 to its full length, the pulse is
 * a short window sliding along it. `setDrawRange` is a property of a geometry
 * rather than of a mesh, so two ranges genuinely need two geometries — a clone
 * is 1,440 triangles and no new curve evaluation.
 *
 * That symmetry is the point. A pulse cut from the same buffer as the line it
 * runs along cannot drift out of register with it, needs no orientation maths,
 * and cannot be invisible against a white cabinet the way the paper-white plane
 * it replaced was.
 *
 * ## Cost
 *
 * Two tubes at 120 × 6 × 2 = 2,880 triangles, two `meshBasicMaterial`s, no
 * textures and — because `bare` skips the rig — no lights at all. Against the
 * budget in `three/config.ts`: about 6% of the triangles and none of the lights.
 *
 * ## Not labelled
 *
 * Deliberately no `label`, so `Scene` keeps it `aria-hidden`. §10.7 asks for a
 * description when a scene *carries* meaning, and this one restates meaning that
 * is already in the DOM twice — the photograph's alt text names the decks, the
 * engine and the finishing modules in order, and the legend under the stage
 * names them again with a sentence each. A third `role="img"` over the same
 * machine would make a screen reader read the press three times.
 */
export interface PressPathCanvasProps {
  /**
   * Fired once the canvas has mounted, so the stage can fade it in. Reported
   * from here rather than guessed with a timer upstream: on a slow connection
   * the chunk is the long pole, and a timer started before the import resolves
   * fades in an empty context.
   */
  onReady?: () => void;
}

export default function PressPathCanvas({ onReady }: PressPathCanvasProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    onReady?.();
    // Mount-only: the stage fades once and never again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Scene bare className="absolute inset-0">
      <OrthographicCamera
        makeDefault
        manual
        left={-FRAME.width / 2}
        right={FRAME.width / 2}
        top={FRAME.height / 2}
        bottom={-FRAME.height / 2}
        near={-10}
        far={10}
        position={[0, 0, 5]}
      />
      <PressPathRig still={reduced} />
    </Scene>
  );
}

/** Rounds an index count down to a whole triangle. */
function toTriangles(count: number): number {
  return Math.max(0, Math.floor(count / 3) * 3);
}

/**
 * The trace, and the pulse that runs it.
 *
 * Time accumulates from `delta`, never from `clock.getElapsedTime()` — the same
 * discipline as `FoldRig`, and for the same reason. `Scene` sets
 * `frameloop="never"` once the canvas leaves the viewport, but Three's clock
 * keeps running regardless, so an elapsed-time reading would race ahead while
 * nobody was watching and a visitor scrolling back would find the run over.
 *
 * Nothing here sets React state. Every frame writes to two draw ranges, so the
 * scene allocates nothing and causes no re-renders.
 */
function PressPathRig({ still = false }: { still?: boolean }) {
  const curve = useMemo(() => createPressPath(), []);

  const trace = useMemo(
    () => new TubeGeometry(curve, TUBE.tubularSegments, TUBE.radius, TUBE.radialSegments, false),
    [curve],
  );
  const pulse = useMemo(() => trace.clone(), [trace]);

  // Geometries built in `useMemo` are not owned by R3F's reconciler, so they are
  // not freed when the canvas unmounts. On a page someone scrolls past twice
  // that is two leaked buffers per visit.
  useEffect(
    () => () => {
      trace.dispose();
      pulse.dispose();
    },
    [trace, pulse],
  );

  const elapsed = useRef(still ? SEQUENCE_DURATION : 0);
  const indexCount = trace.index?.count ?? 0;

  useFrame((_, delta) => {
    // `delta` spikes to whole seconds when a tab is restored from the
    // background; clamping keeps the run from jumping straight to its end.
    elapsed.current = Math.min(elapsed.current + Math.min(delta, 0.05), SEQUENCE_DURATION);
    const t = elapsed.current;

    /*
      The trace draws itself along its own length. `TubeGeometry` emits indices
      by looping tubular segments then radial ones, so index order *is* distance
      along the tube and a draw range is a clean progressive reveal — no shader,
      no dash offset, no second curve.
    */
    trace.setDrawRange(0, toTriangles(drawProgress(t) * indexCount));

    const progress = pulseProgress(t);
    if (progress === null) {
      pulse.setDrawRange(0, 0);
      return;
    }

    // The lit window, clamped at the far end so it runs off the tube rather than
    // wrapping round to the start.
    const span = indexCount * PULSE.length;
    const start = toTriangles(progress * (indexCount + span) - span);
    pulse.setDrawRange(start, toTriangles(Math.min(span, indexCount - start)));
  });

  return (
    <>
      {/*
        The route. Additive rather than opaque so it reads as a highlight lying
        on the machine rather than a gold wire in front of it, and
        `depthWrite={false}` so the pulse over it is never z-fought.
      */}
      <mesh geometry={trace}>
        <meshBasicMaterial
          color={threeColors.objectAccent}
          blending={AdditiveBlending}
          transparent
          opacity={0.42}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* The pulse — the same line, brighter, over one seventh of its length. */}
      <mesh geometry={pulse}>
        <meshBasicMaterial
          color={threeColors.rim}
          blending={AdditiveBlending}
          transparent
          opacity={0.95}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
