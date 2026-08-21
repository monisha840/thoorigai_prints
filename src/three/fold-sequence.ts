/**
 * The fold sequence — choreography only.
 *
 * A single sheet travels through four states without ever becoming a different
 * object: sheet → brochure → business card → packaging box. It is one strip of
 * five hinged panels the whole way; only the hinge angles change.
 *
 *     p0 ──h0── p1 ──h1── p2 ──h2── p3 ──lid
 *
 * That constraint is the point. A crossfade between four models would be
 * cheaper to write and would read as four models; a hinged strip reads as
 * paper, because paper is what it is doing. It also answers the question §10.1
 * requires a scene to answer — *"what does this press turn a flat sheet into?"*
 * — which a photograph of a finished box cannot.
 *
 * ## Why the poses are what they are
 *
 * | Stage | h0 | h1 | h2 | What the strip does |
 * |---|---|---|---|---|
 * | Sheet | 0 | 0 | 0 | Lies flat. The lid folds behind `p3` so no tab shows. |
 * | Brochure | +100° | −100° | +100° | Alternating signs — a true accordion fold. |
 * | Card | +179° | −179° | +179° | Folded almost flat: four panels stack into one slab. |
 * | Box | +90° | +90° | +90° | Same sign — the strip closes into a square tube; the lid caps it. |
 *
 * ## Two numbers that were measured, not guessed
 *
 * **The card folds to 179°, not 175°.** The residual angle fans the stack, and
 * that fan — not the paper — is what sets the object's depth: at 175° the four
 * panels splay to 0.18 deep against 0.67 wide, which reads as a block of wood.
 * At 179° it settles at 0.04, about 6% of its width, which reads as heavy card.
 * Exactly 180° would z-fight, so some residual is required; this is the least
 * that avoids it.
 *
 * **The lid's angles are negative.** `p3` sits at a cumulative 270° of Y
 * rotation by the time the tube closes, so its local X — the axis the tuck flap
 * turns about — points along world +Z. A positive angle swings the flap *out*
 * of the box; the sign has to be flipped for it to fold in and cap the opening.
 *
 * Both were caught by rebuilding this hierarchy in a Node harness and printing
 * the world-space bounding box per stage. Reasoning about nested rotations
 * without measuring them is how 3D scenes end up subtly wrong.
 *
 * ## No `three` import
 *
 * This module is plain numbers so it can be unit-tested, and so the eager
 * bundle could read timings from it without dragging `three` across the
 * boundary in §5.1. Nothing here allocates.
 */

/** One frame of the animation, fully described. */
export interface FoldPose {
  /** The three inter-panel hinge angles, radians. */
  hinges: [number, number, number];
  /** The lid flap, hinged to the far edge of `p3`. */
  lid: number;
  /** Panel half-depth. Grows for card stock, thins for a loose sheet. */
  thickness: number;
  /** Non-uniform scale on the whole rig — reshapes the flat sheet's proportion. */
  rigScale: [number, number, number];
  /** Presentation angle. Each form has one angle that flatters it. */
  rigRotation: [number, number, number];
  /** Keeps the subject centred as its bounding box changes shape. */
  rigPosition: [number, number, number];
}

export interface FoldKey {
  /** Normalised time, 0–1. */
  at: number;
  /** Human label, used by the accessible description and by dev overlays. */
  label: string;
  pose: FoldPose;
}

const DEG = Math.PI / 180;

/**
 * The four states, plus a hold on each.
 *
 * Every stage is keyed twice — once where it arrives and once where it leaves —
 * so the form sits still long enough to be read before it moves again. Without
 * the hold the sequence is a continuous morph and the eye never resolves any of
 * the four products, which defeats the entire purpose.
 */
export const foldKeys: FoldKey[] = [
  {
    at: 0,
    label: 'A flat sheet',
    pose: {
      hinges: [0, 0, 0],
      lid: -180 * DEG,
      thickness: 0.006,
      // Squeezed on X so four panels in a row read as one sheet of stock
      // rather than as a long ribbon. This is also the widest the subject ever
      // gets, so it is what sets `SCENE_SCALE` — at 0.46 the flat sheet lands
      // near A-series proportion and still leaves margin in a portrait frame.
      rigScale: [0.46, 1, 1],
      rigRotation: [-22 * DEG, -18 * DEG, 0],
      rigPosition: [0, 0, 0],
    },
  },
  { at: 0.14, label: 'A flat sheet', pose: null as unknown as FoldPose },

  {
    at: 0.32,
    label: 'Folded into a brochure',
    pose: {
      hinges: [100 * DEG, -100 * DEG, 100 * DEG],
      lid: -180 * DEG,
      thickness: 0.007,
      rigScale: [1, 1, 1],
      rigRotation: [-12 * DEG, -38 * DEG, 0],
      rigPosition: [0, -0.05, 0],
    },
  },
  { at: 0.44, label: 'Folded into a brochure', pose: null as unknown as FoldPose },

  {
    at: 0.6,
    label: 'Folded down to a business card',
    pose: {
      hinges: [179 * DEG, -179 * DEG, 179 * DEG],
      lid: -180 * DEG,
      // Together with the 179° fold above this lands at about 6%
      // thickness-to-width — the 600gsm duplexed card `content.ts` describes.
      thickness: 0.012,
      // Folding alone gives a panel-shaped object — 0.87 × 1.22, which is
      // A-series portrait, not a card. The squash takes it to about 1.65:1
      // landscape and shrinks it, because a business card is a *small* thing
      // and the sequence has to show that as well as say it.
      rigScale: [0.78, 0.34, 0.78],
      rigRotation: [-30 * DEG, -26 * DEG, 6 * DEG],
      rigPosition: [0, 0.02, 0.35],
    },
  },
  { at: 0.72, label: 'Folded down to a business card', pose: null as unknown as FoldPose },

  {
    at: 0.9,
    label: 'Folded up into a packaging box',
    pose: {
      hinges: [90 * DEG, 90 * DEG, 90 * DEG],
      lid: -92 * DEG,
      thickness: 0.011,
      rigScale: [1, 1, 1],
      rigRotation: [-16 * DEG, -34 * DEG, 0],
      rigPosition: [0, -0.02, 0],
    },
  },
  { at: 1, label: 'Folded up into a packaging box', pose: null as unknown as FoldPose },
];

/* Fill the hold keys with their preceding pose, so the table above stays
   readable and the two halves of a hold cannot drift apart. */
for (let i = 0; i < foldKeys.length; i += 1) {
  if (!foldKeys[i].pose) foldKeys[i].pose = foldKeys[i - 1].pose;
}

/** The resting state, used for reduced motion and as the sequence's end. */
export const finalPose: FoldPose = foldKeys[foldKeys.length - 1].pose;

/** Seconds for the whole sequence. Slow enough to read as material, not as UI. */
export const SEQUENCE_DURATION = 9.2;

/** How long the fold holds before the idle float takes over. */
export const SETTLE_DURATION = 0.8;

/**
 * Idle drift, applied once the sequence has finished.
 *
 * Deliberately small. §10.2 calls the hero "the least interactive scene on the
 * site" — this is meant to be noticed only if you look for it.
 */
export const idleDrift = {
  /** World units of vertical travel. */
  amplitude: 0.055,
  /** Bob cycles per second. */
  speed: 0.24,
  /** Radians of lazy Y rotation either side of the resting angle. */
  sway: 0.09,
  swaySpeed: 0.17,
  /** Radians the rig leans toward the pointer. Desktop only. */
  tilt: 0.05,
} as const;

/* ---------------------------------------------------------------------------
 * Sampling
 * ------------------------------------------------------------------------- */

/**
 * Cubic ease-in-out.
 *
 * Paper has mass. A linear fold starts and stops instantly and reads as a
 * hinge in a CAD viewer; easing both ends is most of what makes this look like
 * a hand folding stock.
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The pose at normalised time `t`, written into `out`.
 *
 * Takes a target object rather than returning a new one: this runs on every
 * frame, and allocating a pose per frame is how a 60fps scene turns into a
 * sawtooth of garbage-collection pauses on a mid-range Android.
 */
export function samplePose(t: number, out: FoldPose): FoldPose {
  const clamped = t <= 0 ? 0 : t >= 1 ? 1 : t;

  let next = 1;
  while (next < foldKeys.length - 1 && foldKeys[next].at < clamped) next += 1;

  const a = foldKeys[next - 1];
  const b = foldKeys[next];
  const span = b.at - a.at;
  const raw = span <= 0 ? 0 : (clamped - a.at) / span;
  const k = easeInOutCubic(raw);

  for (let i = 0; i < 3; i += 1) {
    out.hinges[i] = lerp(a.pose.hinges[i], b.pose.hinges[i], k);
  }
  out.lid = lerp(a.pose.lid, b.pose.lid, k);
  out.thickness = lerp(a.pose.thickness, b.pose.thickness, k);

  for (let i = 0; i < 3; i += 1) {
    out.rigScale[i] = lerp(a.pose.rigScale[i], b.pose.rigScale[i], k);
    out.rigRotation[i] = lerp(a.pose.rigRotation[i], b.pose.rigRotation[i], k);
    out.rigPosition[i] = lerp(a.pose.rigPosition[i], b.pose.rigPosition[i], k);
  }

  return out;
}

/** A pose object to sample into. One per rig instance, reused every frame. */
export function createPose(): FoldPose {
  return {
    hinges: [0, 0, 0],
    lid: Math.PI,
    thickness: 0.006,
    rigScale: [0.62, 1, 1],
    rigRotation: [0, 0, 0],
    rigPosition: [0, 0, 0],
  };
}

/** The stage label at time `t`, for the canvas's accessible description. */
export function labelAt(t: number): string {
  const clamped = t <= 0 ? 0 : t >= 1 ? 1 : t;
  let current = foldKeys[0];
  for (const key of foldKeys) {
    if (key.at <= clamped) current = key;
  }
  return current.label;
}

/**
 * Uniform scale applied to the whole rig.
 *
 * Needed because `Camera` widens its field of view by 1.35× below 768px, and it
 * measures the *canvas*, not the window. The hero's media column is about 660px
 * wide on a 1440px desktop, so the camera treats a desktop visitor as a phone
 * and frames at 43° instead of 32° — which put the subject at roughly a quarter
 * of the frame height.
 *
 * Correcting it here rather than in `Camera` is deliberate: that widening is
 * right for a full-bleed scene on a real phone, and this is the first scene to
 * sit in a narrow column. Changing the shared preset to suit this one case
 * would misframe every scene that comes after it.
 *
 * The sheet is the widest the subject ever gets, so it sets the ceiling. In the
 * `lg` frame — 4:5 portrait, ~660px wide, so a 43° vertical field about 3.8
 * world units across — the sheet spans 1.58 × SCENE_SCALE. At 2.1 that reaches
 * the frame edge and the rotation pushes the far corner past it; 1.8 leaves
 * about a quarter of the width as margin, which is enough for the tilt, the
 * pointer lean and the idle sway together.
 *
 * Measured at 1.8: sheet 75% of frame width, box 41% wide and 47% tall, card
 * 37% wide. The card reads small because it *is* small — that contrast is the
 * point of the sequence.
 */
export const SCENE_SCALE = 1.8;

/** Panel proportions, in world units. One panel is one printed page. */
export const panelSize = {
  width: 0.86,
  height: 1.22,
  /** The lid is a tuck flap, not a full panel. */
  lidHeight: 0.86,
} as const;
