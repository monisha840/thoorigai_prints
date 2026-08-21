'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Box3, Vector3, type Group, type Mesh } from 'three';

import {
  SCENE_SCALE,
  SEQUENCE_DURATION,
  createPose,
  finalPose,
  idleDrift,
  panelSize,
  samplePose,
  type FoldPose,
} from '@/three/fold-sequence';
import { materials } from '@/three/config';
import { threeColors } from '@/lib/theme';

/**
 * The hinged strip: sheet → brochure → business card → packaging box.
 *
 * ## Structure
 *
 * Five panels in one nested chain, each group's origin sitting on the edge it
 * hinges about. Nesting is what makes this cheap — folding `p1` carries `p2`,
 * `p3` and the lid with it for free, because that is what a transform hierarchy
 * already does. No per-vertex maths, no morph targets, no skinning.
 *
 *     rig ── p0 ── h1 ── p1 ── h2 ── p2 ── h3 ── p3 ── lid
 *
 * The three panel hinges turn about **Y** — the fold edges are vertical. The
 * lid turns about **X**, because it caps the top of the tube rather than
 * continuing the wall. Tuck flaps fold the other way.
 *
 * ## Cost
 *
 * Five `boxGeometry` panels: 60 triangles, five draw calls, four shared
 * materials, no textures, no shadows, no post-processing. Against the 50k
 * triangle budget in `three/config.ts` this spends about 0.1%. That headroom is
 * why it holds 60fps on a mid-range Android, and it is deliberate — §10.2 calls
 * the hero the least interactive scene on the site, and the LCP element is the
 * photograph sitting behind it.
 *
 * ## Frame loop
 *
 * Time accumulates from `delta`, never from `clock.getElapsedTime()`. `Scene`
 * sets `frameloop="never"` once the canvas leaves the viewport, but Three's
 * clock keeps running regardless — an elapsed-time reading would race ahead
 * while nobody was watching, and a visitor scrolling back would find the fold
 * already finished.
 *
 * Nothing here sets React state. Every frame writes straight to refs, so a
 * 60fps scene causes zero re-renders.
 */

export interface FoldRigProps {
  /**
   * Skip the animation and render the finished box.
   *
   * Set for visitors who asked for reduced motion through either channel — the
   * OS media query or the site's own footer toggle. They still get the object,
   * just not the journey.
   */
  still?: boolean;
  /** Lean toward the pointer. Desktop only; §10.3 gives Tier B no parallax. */
  parallax?: boolean;
}

export function FoldRig({ still = false, parallax = false }: FoldRigProps) {
  const rig = useRef<Group>(null);
  const hinge1 = useRef<Group>(null);
  const hinge2 = useRef<Group>(null);
  const hinge3 = useRef<Group>(null);
  const lidHinge = useRef<Group>(null);
  const panels = useRef<Array<Mesh | null>>([null, null, null, null, null]);

  /* Scratch objects, allocated once. A pose, a box and a vector per frame is
     how a smooth scene turns into a sawtooth of GC pauses on a phone. */
  const scratch = useMemo(
    () => ({ pose: createPose(), box: new Box3(), centre: new Vector3() }),
    [],
  );
  const elapsed = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });

  /**
   * Four materials for five panels.
   *
   * All four brand colours, each doing a job: paper stock outside, ink on the
   * printed inner faces, press blue on the one spread that reads as a printed
   * page, foil gold on the tuck flap. Shared instances rather than one per
   * panel — five identical materials would be five shader compilations.
   */
  const mats = useMemo(
    () => ({
      paper: materials.paperStock,
      ink: materials.inkStock,
      foil: materials.foil,
      blue: { roughness: 0.7, metalness: 0.02, color: threeColors.fill },
    }),
    [],
  );

  /**
   * Write a pose onto the hierarchy, then centre the result in frame.
   *
   * The strip's centroid travels a long way between stages — a flat sheet is
   * four panels wide, a folded card is one — so a fixed offset cannot hold the
   * subject in frame. Rather than hand-tuning a magic number per stage, the rig
   * is measured after posing and shifted by its own centre. Exact at every
   * frame, and it stays correct if the choreography is ever re-timed.
   *
   * Two passes, not a servo: zero the position, update the matrices, measure,
   * then set the position. A servo that corrected by a fraction each frame
   * would lag visibly during the fastest part of the fold.
   */
  function applyPose(p: FoldPose, bob: number, sway: number) {
    const node = rig.current;
    if (!node) return;

    if (hinge1.current) hinge1.current.rotation.y = p.hinges[0];
    if (hinge2.current) hinge2.current.rotation.y = p.hinges[1];
    if (hinge3.current) hinge3.current.rotation.y = p.hinges[2];
    if (lidHinge.current) lidHinge.current.rotation.x = p.lid;

    // Thickness rides on scale, not geometry: rebuilding five BoxGeometries
    // every frame would allocate and re-upload five vertex buffers.
    for (const panel of panels.current) {
      if (panel) panel.scale.z = p.thickness;
    }

    node.scale.set(
      p.rigScale[0] * SCENE_SCALE,
      p.rigScale[1] * SCENE_SCALE,
      p.rigScale[2] * SCENE_SCALE,
    );
    node.rotation.set(
      p.rigRotation[0] + tilt.current.x,
      p.rigRotation[1] + sway + tilt.current.y,
      p.rigRotation[2],
    );

    node.position.set(0, 0, 0);
    node.updateMatrixWorld(true);
    scratch.box.setFromObject(node);
    scratch.box.getCenter(scratch.centre);

    node.position.set(
      -scratch.centre.x + p.rigPosition[0],
      -scratch.centre.y + p.rigPosition[1] + bob,
      p.rigPosition[2],
    );
  }

  useFrame((state, delta) => {
    if (!rig.current) return;

    if (parallax) {
      // Damped and deliberately tiny — meant to be felt, not seen.
      tilt.current.x += (-state.pointer.y * idleDrift.tilt - tilt.current.x) * 0.04;
      tilt.current.y += (state.pointer.x * idleDrift.tilt - tilt.current.y) * 0.04;
    }

    if (still) {
      applyPose(finalPose, 0, 0);
      return;
    }

    // Clamp delta so a backgrounded tab returning does not fast-forward the
    // whole fold in a single frame.
    elapsed.current += Math.min(delta, 1 / 30);
    const t = Math.min(elapsed.current / SEQUENCE_DURATION, 1);

    samplePose(t, scratch.pose);

    /* The gentle float, once the box exists. Layered onto the final pose rather
       than replacing it, so there is no seam at the handover, and eased in over
       its first second — otherwise the drift starts at full amplitude the
       instant the fold lands. */
    let bob = 0;
    let sway = 0;
    if (t >= 1) {
      const settled = elapsed.current - SEQUENCE_DURATION;
      const ramp = Math.min(settled, 1);
      bob = Math.sin(settled * idleDrift.speed * Math.PI * 2) * idleDrift.amplitude * ramp;
      sway = Math.sin(settled * idleDrift.swaySpeed * Math.PI * 2) * idleDrift.sway * ramp;
    }

    applyPose(scratch.pose, bob, sway);
  });

  const { width: w, height: h, lidHeight } = panelSize;

  /**
   * One panel. The mesh is offset half a width from its group origin, which
   * puts that origin on the hinge edge — that offset is the whole trick.
   *
   * `boxGeometry` face order is [+X, −X, +Y, −Y, +Z, −Z], so index 4 is the
   * front face and 5 is the back. Giving those two different materials is what
   * makes the box read as printed on the inside when it folds closed.
   *
   * Depth is 1 so `scale.z` reads directly as thickness in world units.
   */
  const panel = (
    index: number,
    front: { color: string; roughness: number; metalness: number },
    back: { color: string; roughness: number; metalness: number },
    height = h,
  ) => (
    <mesh
      ref={(node) => {
        panels.current[index] = node;
      }}
      position={[w / 2, 0, 0]}
    >
      <boxGeometry args={[w, height, 1]} />
      <meshStandardMaterial attach="material-0" {...mats.paper} />
      <meshStandardMaterial attach="material-1" {...mats.paper} />
      <meshStandardMaterial attach="material-2" {...mats.paper} />
      <meshStandardMaterial attach="material-3" {...mats.paper} />
      <meshStandardMaterial attach="material-4" {...front} />
      <meshStandardMaterial attach="material-5" {...back} />
    </mesh>
  );

  return (
    <group ref={rig}>
      {/* p0 — the panel the whole strip hangs from. */}
      {panel(0, mats.paper, mats.ink)}

      <group ref={hinge1} position={[w, 0, 0]}>
        {panel(1, mats.paper, mats.ink)}

        <group ref={hinge2} position={[w, 0, 0]}>
          {/* The printed spread. Press blue is the one place the fill colour
              appears as a surface rather than as light. */}
          {panel(2, mats.paper, mats.blue)}

          <group ref={hinge3} position={[w, 0, 0]}>
            {panel(3, mats.paper, mats.ink)}

            {/*
              The tuck flap: hinged at p3's top edge, turning about X, because
              it closes the tube rather than continuing the wall. Foil on its
              face — the one gold surface in the scene.

              Nudged forward in Z so that when it lies folded flat against p3
              through the first three stages it does not z-fight with it. Kept
              small: at the card stage this offset is part of the stack's total
              thickness, and a larger value turns the card into a block.
            */}
            <group ref={lidHinge} position={[w / 2, h / 2, 0.006]}>
              <mesh
                ref={(node) => {
                  panels.current[4] = node;
                }}
                position={[0, lidHeight / 2, 0]}
              >
                <boxGeometry args={[w, lidHeight, 1]} />
                <meshStandardMaterial attach="material-0" {...mats.paper} />
                <meshStandardMaterial attach="material-1" {...mats.paper} />
                <meshStandardMaterial attach="material-2" {...mats.paper} />
                <meshStandardMaterial attach="material-3" {...mats.paper} />
                <meshStandardMaterial attach="material-4" {...mats.foil} />
                <meshStandardMaterial attach="material-5" {...mats.ink} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default FoldRig;
