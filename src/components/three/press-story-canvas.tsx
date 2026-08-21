'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  Box3,
  BoxGeometry,
  CanvasTexture,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3,
  type Group,
  type Mesh,
} from 'three';

import { Scene } from './scene';
import {
  MAX_TILT,
  SCENE_SCALE,
  SCROLL_DEPTH,
  SEQUENCE_DURATION,
  createPose,
  deliveryPieces,
  finalPose,
  idleDrift,
  panelSize,
  press,
  samplePose,
  type StoryPose,
} from '@/three/press-story';
import { materials } from '@/three/config';
import { gold, indigo, threeColors } from '@/lib/theme';

/**
 * The homepage hero scene: FILE → PROOF → PRESS → FINISH → DELIVERY.
 *
 * Canvas and contents live in this one file. The rule in `lazy-scene.tsx` is the
 * easy one to get wrong — passing scene children in from an eagerly-loaded file
 * statically imports `three` back into the main bundle and the code-splitting
 * silently stops working. Everything `three` touches is on this side.
 *
 * ## The sheet stays paper
 *
 * Every face of the strip is paper stock, front and back, at every moment. The
 * first cut of this drove the *front faces* from paper to ink to mean "content
 * appears", and the result was a sheet that turned solid black halfway through
 * the story — which is not what a printed page looks like, and which on its own
 * destroyed the 70/20/8/2 colour ratio the brief asks for.
 *
 * Content is therefore geometry, not colour: seven thin quads lying a hair above
 * the paper — a headline, some rules, and one indigo block — that scale up as
 * `inked` rises. Ink is now a *mark on* the page rather than the page, which is
 * both what printing is and what keeps the composition mostly paper.
 *
 * ## No tuck flap
 *
 * The strip is four panels, not five. The fifth was a foil tuck flap that
 * capped a packaging box in the sequence this replaces — and in *this* story the
 * box is its own object in DELIVERY, so the flap had nothing left to cap. It
 * rendered as a large brown slab hanging off the brochure for the whole run.
 * Gold survives where it earns its place: the press stroke and one registration
 * bar.
 *
 * ## Where the 2% goes
 *
 * Gold appears exactly twice in the whole scene: the progress stroke that
 * crosses the press, and one bar in the registration strip. Nothing else is ever
 * gold. Indigo appears exactly once, as the single colour block on the spread.
 *
 * ## Why the pointer is read from `window`
 *
 * `Scene` sets `pointerEvents: 'none'` on its wrapper so the canvas can never
 * swallow a click meant for the copy beside it. R3F populates `state.pointer`
 * from listeners on that same canvas, so with pointer events off it stays at
 * `0, 0` forever — the previous hero read it, and its pointer parallax therefore
 * never moved at all. This subscribes to `window` and writes to a ref, so the
 * lean is real and costs no React render.
 *
 * ## Cost
 *
 * ~20 meshes, ~230 triangles, six shared materials, one 128px gradient texture
 * for the contact shadow, no shadow pass, no post-processing. Against the
 * 50,000-triangle budget in `three/config.ts`, about 0.5%.
 */
export interface PressStoryCanvasProps {
  /**
   * Fired once the canvas has mounted, so the stage can cross-fade the poster
   * out. Reported from here rather than guessed with a timer upstream — on a
   * slow connection the chunk is the long pole, and a timer started before the
   * import resolves fades in an empty context.
   */
  onReady?: () => void;
  /** Skip the run and render the delivered composition. Reduced motion. */
  still?: boolean;
  /** Lean toward the pointer. Desktop, fine pointer, not reduced. */
  parallax?: boolean;
}

export default function PressStoryCanvas({
  onReady,
  still = false,
  parallax = false,
}: PressStoryCanvasProps) {
  useEffect(() => {
    onReady?.();
    // Mount-only: the stage cross-fades once and never again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Scene
      cameraPreset="hero"
      className="absolute inset-0"
      /* §10.7: the scene carries meaning, so it is described rather than hidden.
         The five acts are named in order, because the order is the message. */
      label="A design file becomes a proof, runs through the press, is finished and folded, and is delivered as a brochure, a business card, a box and a catalogue"
    >
      <StoryRig still={still} parallax={parallax} />
    </Scene>
  );
}

/** Where each printed mark sits on its panel, in panel-local units. */
const CONTENT = [
  // The indigo block — the single colour field on the whole sheet.
  { panel: 2, size: [0.6, 0.3], at: [0, 0.36], tone: 'blue' as const },
  { panel: 2, size: [0.48, 0.05], at: [-0.05, 0.1], tone: 'ink' as const },
  { panel: 2, size: [0.4, 0.026], at: [-0.09, 0.0], tone: 'ink' as const },
  { panel: 2, size: [0.44, 0.026], at: [-0.07, -0.07], tone: 'ink' as const },
  { panel: 1, size: [0.44, 0.05], at: [-0.05, 0.3], tone: 'ink' as const },
  { panel: 1, size: [0.36, 0.026], at: [-0.09, 0.2], tone: 'ink' as const },
  { panel: 1, size: [0.4, 0.026], at: [-0.07, 0.13], tone: 'ink' as const },
];

/** The four registration bars that ride the press nip. One of them is the gold. */
const REGISTRATION = ['ink', 'blue', 'gold', 'mid'] as const;

function StoryRig({ still, parallax }: { still: boolean; parallax: boolean }) {
  const rig = useRef<Group>(null);
  const world = useRef<Group>(null);
  const hinge1 = useRef<Group>(null);
  const hinge2 = useRef<Group>(null);
  const hinge3 = useRef<Group>(null);
  const panels = useRef<Array<Mesh | null>>([null, null, null, null]);
  const content = useRef<Array<Group | null>>([null, null]);
  const barFront = useRef<Group>(null);
  const barBack = useRef<Mesh>(null);
  const progressLine = useRef<Mesh>(null);
  const pieces = useRef<Array<Group | null>>([null, null, null]);
  const shadow = useRef<Mesh>(null);

  const elapsed = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  /* Scratch objects, allocated once. A pose, a box and a vector per frame is
     how a smooth scene turns into a sawtooth of GC pauses on a phone. */
  const scratch = useMemo(
    () => ({ pose: createPose(), box: new Box3(), centre: new Vector3() }),
    [],
  );

  /* ---------------------------------------------------------------------
   * Geometry and materials — built once, shared, disposed on unmount.
   * ------------------------------------------------------------------- */

  const kit = useMemo(() => {
    const { width: w, height: h } = panelSize;

    const geoPanel = new BoxGeometry(w, h, 1);
    const geoUnit = new BoxGeometry(1, 1, 1);
    const geoQuad = new PlaneGeometry(1, 1);
    const geoShadow = new PlaneGeometry(4.4, 4.4);

    const paper = new MeshStandardMaterial({ ...materials.paperStock });
    // Marks on the page. Basic, not standard: printed ink is not a lit surface,
    // and shading it makes a headline read as an embossed ridge.
    const ink = new MeshBasicMaterial({ color: threeColors.objectPrimary, toneMapped: false });
    const blue = new MeshBasicMaterial({ color: indigo[600], toneMapped: false });
    const accent = new MeshBasicMaterial({ color: gold[500], toneMapped: false });
    const mid = new MeshBasicMaterial({ color: indigo[300], toneMapped: false });
    const slab = new MeshStandardMaterial({
      color: threeColors.objectPrimary,
      roughness: 0.4,
      metalness: 0.15,
    });

    /* The contact shadow, drawn as a 128px radial gradient rather than a shadow
       pass. A shadow map is an extra render of the whole scene every frame for
       one soft ellipse; this is one texture, uploaded once. */
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(38,34,54,0.30)');
      g.addColorStop(0.55, 'rgba(38,34,54,0.11)');
      g.addColorStop(1, 'rgba(38,34,54,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowMap = new CanvasTexture(canvas);
    const shadowMat = new MeshBasicMaterial({
      map: shadowMap,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });

    return {
      geoPanel, geoUnit, geoQuad, geoShadow,
      paper, ink, blue, accent, mid, slab, shadowMap, shadowMat,
      tone: { ink, blue, gold: accent, mid },
    };
  }, []);

  // R3F frees what it created from JSX props; these were built in a `useMemo`,
  // so they are ours to release. Without this, a visitor who scrolls the hero
  // out and back leaks a buffer set per mount.
  useEffect(
    () => () => {
      for (const item of [
        kit.geoPanel, kit.geoUnit, kit.geoQuad, kit.geoShadow,
        kit.paper, kit.ink, kit.blue, kit.accent, kit.mid, kit.slab,
        kit.shadowMap, kit.shadowMat,
      ]) {
        item.dispose();
      }
    },
    [kit],
  );

  /* ---------------------------------------------------------------------
   * Pointer and scroll, both read from `window` into refs.
   * ------------------------------------------------------------------- */

  useEffect(() => {
    if (!parallax) {
      pointer.current.x = 0;
      pointer.current.y = 0;
      return;
    }
    const onMove = (event: PointerEvent) => {
      // Only a device that actually hovers should move the field.
      if (event.pointerType !== 'mouse') return;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [parallax]);

  useEffect(() => {
    /* Scroll shifts the composition in Z and does nothing else — the brief's
       "react slightly to scroll, do not hijack". It never drives the sequence,
       never calls `preventDefault`, and never touches scroll position. */
    const onScroll = () => {
      scroll.current = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---------------------------------------------------------------------
   * Posing
   * ------------------------------------------------------------------- */

  function applyPose(p: StoryPose, bob: number, sway: number) {
    const node = rig.current;
    if (!node) return;

    if (hinge1.current) hinge1.current.rotation.y = p.hinges[0];
    if (hinge2.current) hinge2.current.rotation.y = p.hinges[1];
    if (hinge3.current) hinge3.current.rotation.y = p.hinges[2];

    // Thickness rides on scale, not geometry: rebuilding five box geometries
    // every frame would allocate and re-upload five vertex buffers.
    for (const panel of panels.current) {
      if (panel) panel.scale.z = p.thickness;
    }

    // PROOF — the marks grow onto the page.
    for (const group of content.current) {
      if (!group) continue;
      group.visible = p.inked > 0.004;
      group.scale.set(p.inked, p.inked, 1);
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
    /*
      Centre the strip on its own bounding box, every frame.

      The centroid travels a long way between acts — a flat sheet is four panels
      wide, a folded card is one — so a fixed offset cannot hold the subject in
      frame. Dropping this in the rewrite is exactly what sent the folded form
      drifting off the right edge: it was measured and corrected in the scene
      this replaces, and the correction is still required.

      Two passes, not a servo: zero the position, update the matrices, measure,
      then set the position. A servo correcting by a fraction each frame would
      lag visibly through the fastest part of the fold.
    */
    node.position.set(0, 0, 0);
    node.updateMatrixWorld(true);
    scratch.box.setFromObject(node);
    scratch.box.getCenter(scratch.centre);

    node.position.set(
      -scratch.centre.x + p.rigPosition[0],
      -scratch.centre.y + p.rigPosition[1] + bob,
      p.rigPosition[2],
    );

    /* ---- the press: two bars closing on the sheet's midline ------------ */
    const y = press.parkY * (1 - p.press);
    if (barFront.current) barFront.current.position.y = y;
    if (barBack.current) barBack.current.position.y = -y;

    if (progressLine.current) {
      const lit = p.progress >= 0 && p.press > 0.35;
      progressLine.current.visible = lit;
      if (lit) progressLine.current.position.x = (p.progress - 0.5) * press.width * 0.92;
    }

    /* ---- the delivered pieces ----------------------------------------- */
    for (let i = 0; i < deliveryPieces.length; i += 1) {
      const piece = pieces.current[i];
      if (!piece) continue;
      const spec = deliveryPieces[i];
      // Each piece opens its own window inside `delivered`, so the three arrive
      // in sequence rather than all at once — "products assemble elegantly".
      const span = 1 - spec.delay;
      const local = Math.min(1, Math.max(0, (p.delivered - spec.delay) / (span <= 0 ? 1 : span)));
      piece.visible = local > 0.001;
      piece.scale.setScalar(local);
      piece.position.set(
        spec.position[0],
        spec.position[1] - (1 - local) * 0.2,
        spec.position[2] - (1 - local) * 0.5,
      );
    }

    if (shadow.current) {
      // The ground darkens as more comes to stand on it.
      (shadow.current.material as MeshBasicMaterial).opacity = 0.4 + 0.6 * p.delivered;
    }
  }

  useFrame((_, delta) => {
    if (!rig.current) return;

    if (parallax) {
      // Damped, and clamped to the brief's five degrees. Meant to be felt.
      tilt.current.x += (-pointer.current.y * MAX_TILT - tilt.current.x) * 0.045;
      tilt.current.y += (pointer.current.x * MAX_TILT - tilt.current.y) * 0.045;
    } else {
      tilt.current.x = 0;
      tilt.current.y = 0;
    }

    // The only thing scroll touches.
    if (world.current) world.current.position.z = -scroll.current * SCROLL_DEPTH;

    if (still) {
      applyPose(finalPose, 0, 0);
      return;
    }

    // Clamp delta so a backgrounded tab returning does not fast-forward the
    // whole story in one frame.
    elapsed.current += Math.min(delta, 1 / 30);
    const t = Math.min(elapsed.current / SEQUENCE_DURATION, 1);
    samplePose(t, scratch.pose);

    /* The idle drift, once the composition exists. Layered onto the final pose
       rather than replacing it, so there is no seam at the handover, and eased
       in over its first second — otherwise the drift starts at full amplitude
       the instant the story lands. */
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

  const { width: w, height: h } = panelSize;

  /**
   * One panel. The mesh is offset half a width from its group origin, which puts
   * that origin on the hinge edge — that offset is the whole trick.
   *
   * Every face is paper. What makes it a printed page is the content laid on
   * top, not the colour of the card.
   *
   * Depth is 1 so `scale.z` reads directly as thickness in world units.
   */
  const panel = (index: number) => (
    <mesh
      ref={(node) => {
        panels.current[index] = node;
      }}
      geometry={kit.geoPanel}
      material={kit.paper}
      position={[w / 2, 0, 0]}
    />
  );

  /**
   * The marks on one panel.
   *
   * A sibling of the panel rather than a child of it: the panel carries
   * `scale.z` as its stock thickness, and a child would be squashed by it. The
   * 0.012 offset clears the thickest the paper ever gets (0.008) so nothing
   * z-fights with the page it is printed on.
   */
  const marks = (panelIndex: number, slot: number) => (
    <group
      ref={(node) => {
        content.current[slot] = node;
      }}
      position={[w / 2, 0, 0.012]}
      visible={false}
    >
      {CONTENT.filter((c) => c.panel === panelIndex).map((c, i) => (
        <mesh
          key={i}
          geometry={kit.geoQuad}
          material={kit.tone[c.tone]}
          position={[c.at[0], c.at[1], 0]}
          scale={[c.size[0], c.size[1], 1]}
        />
      ))}
    </group>
  );

  return (
    <group ref={world}>
      {/* The ground. Laid flat under the composition, never lit, never in front. */}
      <mesh
        ref={shadow}
        geometry={kit.geoShadow}
        material={kit.shadowMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.45, 0]}
      />

      {/* The press. Two bars that arrive from off frame and meet at the sheet's
          midline, one in front and one behind, plus a stroke of light crossing
          them. That is the entire machine — the brief rules out a detailed
          printer, and a recognisable one at this scale reads as clip art. */}
      <group ref={barFront} position={[0, press.parkY, press.nipZ]}>
        <mesh
          geometry={kit.geoUnit}
          material={kit.slab}
          scale={[press.width, press.height, press.depth]}
        />
        {/* The registration strip — "colour bars move", and it moves because it
            is parented to the bar. One of the four is the scene's second and
            last gold. */}
        {REGISTRATION.map((tone, i) => (
          <mesh
            key={tone}
            geometry={kit.geoQuad}
            material={kit.tone[tone]}
            position={[press.width / 2 - 0.16 - i * 0.11, 0, press.depth / 2 + 0.005]}
            scale={[0.085, press.height * 0.62, 1]}
          />
        ))}
      </group>

      <mesh
        ref={barBack}
        geometry={kit.geoUnit}
        material={kit.slab}
        position={[0, -press.parkY, -press.nipZ]}
        scale={[press.width, press.height, press.depth]}
      />

      <mesh
        ref={progressLine}
        geometry={kit.geoUnit}
        material={kit.accent}
        position={[0, 0, press.lineZ]}
        scale={[press.lineHeight, h * 0.62, press.lineHeight]}
        visible={false}
      />

      {/* The strip — the subject, from first frame to last. */}
      <group ref={rig}>
        {panel(0)}

        <group ref={hinge1} position={[w, 0, 0]}>
          {panel(1)}
          {marks(1, 0)}

          <group ref={hinge2} position={[w, 0, 0]}>
            {panel(2)}
            {marks(2, 1)}

            <group ref={hinge3} position={[w, 0, 0]}>{panel(3)}</group>
          </group>
        </group>
      </group>

      {/* DELIVERY. Plain paper boxes at contrasting sizes: a card is a thin
          slab, a catalogue a thick one, a carton nearly a cube. The size
          difference is the point — a business card is *small*, and the
          composition has to show that as well as say it. */}
      {/*
        Wrapped in the strip's own scale. The pieces are sized and placed against
        a *panel*, not against world units, so without this they were laid out in
        a space 1.7× smaller than the brochure they are meant to sit beside — and
        landed underneath it instead of around it.
      */}
      <group scale={SCENE_SCALE}>
        {deliveryPieces.map((spec, index) => (
          <group
            key={spec.id}
            ref={(node) => {
              pieces.current[index] = node;
            }}
            position={spec.position}
            rotation={spec.rotation}
            visible={false}
          >
            <mesh geometry={kit.geoUnit} scale={spec.size} material={kit.paper} />
          </group>
        ))}
      </group>
    </group>
  );
}
