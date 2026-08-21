/**
 * FILE → PROOF → PRESS → FINISH → DELIVERY — choreography only.
 *
 * This file holds the numbers; `components/three/press-story-canvas.tsx` holds
 * the meshes. Plain arithmetic, no `three` import, so it can be reasoned about
 * and unit-tested without a renderer and without dragging `three` across the
 * §5.1 bundle boundary.
 *
 * ## The one idea
 *
 * A single hinged strip of five panels is the subject for the whole run, and it
 * never becomes a different object.
 *
 *     p0 ──h0── p1 ──h1── p2 ──h2── p3 ──lid
 *
 * Paper folding reads as paper, because folding is what paper does. Cross-fading
 * between five models would be easier to write and would read as five models —
 * which is exactly the "generic 3D demo" the brief rules out. The press, and the
 * three delivered pieces at the end, are the only things that are not the strip.
 *
 * ## The five acts
 *
 * | # | Act | t | The strip | Around it |
 * |---|---|---|---|---|
 * | 1 | FILE | 0.00–0.14 | flat, drifting in | nothing |
 * | 2 | PROOF | 0.14–0.36 | ink and blue fill the panels, first fold | nothing |
 * | 3 | PRESS | 0.36–0.60 | passes between two slabs | slabs close, gold line sweeps |
 * | 4 | FINISH | 0.60–0.81 | opens to a brochure, folds to a card | slabs withdraw |
 * | 5 | DELIVERY | 0.81–1.00 | settles as the brochure | card, box, catalogue arrive |
 *
 * FILE and PROOF are both complete by t=0.36 — 3.0s of an 8.4s run — so "this
 * company turns files into printed things" is legible inside the brief's five
 * second bar even though the whole sequence is deliberately unhurried.
 *
 * ## Colour budget
 *
 * The brief's ratio is 70 background / 20 dark / 8 secondary / 2 accent, and it
 * is spent here rather than left to chance: the ground and the stock are
 * `paper-200`, the press slabs and the printed faces are `ink-800`, exactly one
 * spread is `indigo-600`, and `gold-500` appears only as the progress line and
 * the rim light. Nothing else is ever gold.
 */

/** One frame of the strip, fully described. */
export interface StoryPose {
  /** The three inter-panel hinge angles, radians. */
  hinges: [number, number, number];
  /** The lid flap, hinged to the far edge of `p3`. */
  lid: number;
  /** Panel half-depth. Thin for a loose sheet, thicker for card stock. */
  thickness: number;
  /** Non-uniform scale on the rig — reshapes the flat sheet's proportion. */
  rigScale: [number, number, number];
  /** Presentation angle. Each form has one angle that flatters it. */
  rigRotation: [number, number, number];
  /** Keeps the subject centred as its bounding box changes shape. */
  rigPosition: [number, number, number];
  /**
   * How printed the strip is, 0–1. Drives the ink and blue faces' opacity, so
   * "content appears" in PROOF is a material change rather than a swap.
   */
  inked: number;
  /**
   * How far the press has closed, 0–1. 0 is fully withdrawn and invisible, 1 is
   * shut on the sheet.
   */
  press: number;
  /** The gold progress line's sweep across the press, 0–1. Below 0 it is dark. */
  progress: number;
  /** How present the three delivered pieces are, 0–1. */
  delivered: number;
}

export interface StoryKey {
  /** Normalised time, 0–1. */
  at: number;
  /** The act, for the accessible description. */
  label: string;
  pose: StoryPose;
}

const DEG = Math.PI / 180;

/**
 * The acts, each keyed twice — once where it arrives and once where it leaves.
 *
 * The hold is not padding. Without it the run is one continuous morph and the
 * eye never resolves any single state, which defeats the point of having five
 * of them. Every act gets long enough to be read before the next begins.
 */
export const storyKeys: StoryKey[] = [
  /* ---- 1. FILE — a flat sheet, drifting in ------------------------------ */
  {
    at: 0,
    label: 'A design file, as a flat sheet',
    pose: {
      hinges: [0, 0, 0],
      lid: -180 * DEG,
      thickness: 0.005,
      // Squeezed on X so four panels in a row read as one sheet of stock rather
      // than a long ribbon. This is also the widest the subject ever gets, so it
      // is what sets `SCENE_SCALE`.
      rigScale: [0.46, 1, 1],
      rigRotation: [-24 * DEG, -20 * DEG, 0],
      rigPosition: [0, 0, -0.35],
      inked: 0,
      press: 0,
      progress: -1,
      delivered: 0,
    },
  },
  { at: 0.14, label: 'A design file, as a flat sheet', pose: null as unknown as StoryPose },

  /* ---- 2. PROOF — content appears, then the first fold ------------------ */
  {
    at: 0.26,
    label: 'The proof: content and colour fill the page',
    pose: {
      hinges: [0, 0, 0],
      lid: -180 * DEG,
      thickness: 0.005,
      rigScale: [0.46, 1, 1],
      rigRotation: [-16 * DEG, -14 * DEG, 0],
      rigPosition: [0, 0, 0],
      inked: 1,
      press: 0,
      progress: -1,
      delivered: 0,
    },
  },
  {
    at: 0.36,
    label: 'The proof: content and colour fill the page',
    pose: {
      // A single valley fold — the sheet becomes a proof spread, not yet a
      // finished piece. Alternating signs would be the accordion, which belongs
      // to FINISH.
      hinges: [46 * DEG, -20 * DEG, 12 * DEG],
      lid: -180 * DEG,
      thickness: 0.006,
      rigScale: [0.62, 1, 1],
      rigRotation: [-14 * DEG, -26 * DEG, 0],
      rigPosition: [0, 0, 0],
      inked: 1,
      press: 0,
      progress: -1,
      delivered: 0,
    },
  },

  /* ---- 3. PRESS — the slabs close and the line sweeps ------------------- */
  {
    at: 0.46,
    label: 'Into the press',
    pose: {
      hinges: [10 * DEG, -6 * DEG, 4 * DEG],
      lid: -180 * DEG,
      thickness: 0.006,
      rigScale: [0.5, 1, 1],
      // Squares up to the camera as it enters. A sheet in a press is held flat
      // and straight, and that change of attitude is what sells the machine
      // having taken control of it.
      rigRotation: [-4 * DEG, -5 * DEG, 0],
      rigPosition: [0, 0, 0],
      inked: 1,
      press: 1,
      progress: 0,
      delivered: 0,
    },
  },
  {
    at: 0.6,
    label: 'Into the press',
    pose: {
      hinges: [10 * DEG, -6 * DEG, 4 * DEG],
      lid: -180 * DEG,
      thickness: 0.008,
      rigScale: [0.5, 1, 1],
      rigRotation: [-4 * DEG, -5 * DEG, 0],
      rigPosition: [0, 0, 0],
      inked: 1,
      press: 1,
      progress: 1,
      delivered: 0,
    },
  },

  /* ---- 4. FINISH — opens to a brochure, folds to a card ----------------- */
  {
    at: 0.71,
    label: 'Finished: folded into a brochure',
    pose: {
      // Alternating signs — a true accordion fold.
      hinges: [100 * DEG, -100 * DEG, 100 * DEG],
      lid: -180 * DEG,
      thickness: 0.008,
      rigScale: [1, 1, 1],
      rigRotation: [-12 * DEG, -38 * DEG, 0],
      rigPosition: [0, -0.04, 0],
      inked: 1,
      press: 0,
      progress: 1,
      delivered: 0,
    },
  },
  { at: 0.81, label: 'Finished: folded into a brochure', pose: null as unknown as StoryPose },

  /* ---- 5. DELIVERY — the finished pieces arrive ------------------------- */
  {
    at: 0.93,
    label: 'Delivered: brochure, card, box and catalogue',
    pose: {
      hinges: [96 * DEG, -96 * DEG, 96 * DEG],
      lid: -180 * DEG,
      thickness: 0.008,
      rigScale: [1, 1, 1],
      // Turned a little further and lifted, so it sits as the hero of a group
      // rather than as the only thing present.
      rigRotation: [-14 * DEG, -44 * DEG, 0],
      rigPosition: [-0.16, 0.06, 0],
      inked: 1,
      press: 0,
      progress: 1,
      delivered: 1,
    },
  },
  {
    at: 1,
    label: 'Delivered: brochure, card, box and catalogue',
    pose: null as unknown as StoryPose,
  },
];

/* Fill each hold key with the pose it holds, so the table above stays readable
   and the two halves of a hold cannot drift apart. */
for (let i = 0; i < storyKeys.length; i += 1) {
  if (!storyKeys[i].pose) storyKeys[i].pose = storyKeys[i - 1].pose;
}

/** The resting state — reduced motion renders this and nothing else. */
export const finalPose: StoryPose = storyKeys[storyKeys.length - 1].pose;

/**
 * Seconds for the whole run.
 *
 * Slow enough to read as material rather than as UI, which is the brief's
 * "slow, confident, elegant". The five-second comprehension bar is met by the
 * *ordering* — FILE and PROOF are done by 3.0s — not by rushing the whole thing.
 */
export const SEQUENCE_DURATION = 8.4;

/**
 * Idle drift, once the run has finished.
 *
 * Deliberately tiny: §10.2 calls the hero the least interactive scene on the
 * site, and this is meant to be noticed only if you look for it.
 */
export const idleDrift = {
  /** World units of vertical travel. */
  amplitude: 0.05,
  /** Bob cycles per second. */
  speed: 0.22,
  /** Radians of lazy Y rotation either side of the resting angle. */
  sway: 0.08,
  swaySpeed: 0.16,
} as const;

/**
 * Pointer lean, in radians.
 *
 * The brief's ceiling is five degrees and this is it, expressed once so the rig
 * cannot quietly drift past it: 5° = 0.0873 rad.
 */
export const MAX_TILT = 5 * DEG;

/** Scroll may shift the whole group this far in Z, and do nothing else. */
export const SCROLL_DEPTH = 0.3;

/* ---------------------------------------------------------------------------
 * Sampling
 * ------------------------------------------------------------------------- */

/**
 * Cubic ease-in-out.
 *
 * Paper has mass. A linear fold starts and stops instantly and reads as a hinge
 * in a CAD viewer; easing both ends is most of what makes this look like a hand
 * folding stock. The brief asks for ease-in-out by name.
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The pose at normalised time `t`, written into `out`.
 *
 * Takes a target rather than returning a new object: this runs every frame, and
 * allocating a pose per frame is how a 60fps scene turns into a sawtooth of
 * garbage-collection pauses on a mid-range Android.
 */
export function samplePose(t: number, out: StoryPose): StoryPose {
  const clamped = t <= 0 ? 0 : t >= 1 ? 1 : t;

  let next = 1;
  while (next < storyKeys.length - 1 && storyKeys[next].at < clamped) next += 1;

  const a = storyKeys[next - 1];
  const b = storyKeys[next];
  const span = b.at - a.at;
  const raw = span <= 0 ? 0 : (clamped - a.at) / span;
  const k = easeInOutCubic(raw);

  for (let i = 0; i < 3; i += 1) {
    out.hinges[i] = lerp(a.pose.hinges[i], b.pose.hinges[i], k);
    out.rigScale[i] = lerp(a.pose.rigScale[i], b.pose.rigScale[i], k);
    out.rigRotation[i] = lerp(a.pose.rigRotation[i], b.pose.rigRotation[i], k);
    out.rigPosition[i] = lerp(a.pose.rigPosition[i], b.pose.rigPosition[i], k);
  }

  out.lid = lerp(a.pose.lid, b.pose.lid, k);
  out.thickness = lerp(a.pose.thickness, b.pose.thickness, k);
  out.inked = lerp(a.pose.inked, b.pose.inked, k);
  out.press = lerp(a.pose.press, b.pose.press, k);
  out.progress = lerp(a.pose.progress, b.pose.progress, k);
  out.delivered = lerp(a.pose.delivered, b.pose.delivered, k);

  return out;
}

/** A pose object to sample into. One per rig instance, reused every frame. */
export function createPose(): StoryPose {
  return {
    hinges: [0, 0, 0],
    lid: Math.PI,
    thickness: 0.005,
    rigScale: [0.46, 1, 1],
    rigRotation: [0, 0, 0],
    rigPosition: [0, 0, 0],
    inked: 0,
    press: 0,
    progress: -1,
    delivered: 0,
  };
}

/** The act at time `t`, for the canvas's accessible description. */
export function labelAt(t: number): string {
  const clamped = t <= 0 ? 0 : t >= 1 ? 1 : t;
  let current = storyKeys[0];
  for (const key of storyKeys) {
    if (key.at <= clamped) current = key;
  }
  return current.label;
}

/** Every act in order, for the mobile variant and the scene's description. */
export const ACTS = [
  { n: '01', name: 'File', body: 'Your artwork, exactly as you supply it.' },
  { n: '02', name: 'Proof', body: 'Colour and content, approved before anything runs.' },
  { n: '03', name: 'Press', body: 'Offset or digital, whichever the job earns.' },
  { n: '04', name: 'Finish', body: 'Folded, trimmed, foiled and bound in house.' },
  { n: '05', name: 'Delivery', body: 'Boxed and out, from one building.' },
] as const;

/**
 * Uniform scale on the whole rig.
 *
 * `Camera` widens its field of view by 1.35× below 768px and it measures the
 * *canvas*, not the window — the hero's media column is about 660px on a 1440px
 * desktop, so a desktop visitor gets the phone framing. Correcting it here
 * rather than in `Camera` is deliberate: that widening is right for a full-bleed
 * scene on a real phone, and changing the shared preset to suit this one column
 * would misframe every scene that comes after it.
 *
 * The flat sheet used to be the widest the subject ever got, and at 1.7 it sat
 * comfortably. DELIVERY changed that: the brochure is no longer alone, and the
 * card, box and catalogue arriving beside it make the composition about twice as
 * wide as the sheet ever was. Measured against the media column — a ~3.8-unit
 * frame — the four-object group spans about 3.2 at 1.3, which leaves margin for
 * the tilt, the pointer lean and the idle sway. At 1.7 the pieces ran off the
 * bottom and right edges.
 */
export const SCENE_SCALE = 1.3;

/** Panel proportions, in world units. One panel is one printed page. */
export const panelSize = {
  width: 0.86,
  height: 1.22,
  /** The lid is a tuck flap, not a full panel. */
  lidHeight: 0.86,
} as const;

/**
 * The abstract press — a nip, not a machine.
 *
 * The brief rules out a detailed printer, and it is right to: a recognisable
 * machine at this scale reads as clip art. But the first cut of this went too
 * far the other way and became two large slabs closing in world Y, which failed
 * for a duller reason — the slabs were sized in world units while the sheet is
 * scaled by `SCENE_SCALE`, so a "press" 2.35 wide closed on a sheet 2.9 wide and
 * 2.1 tall. It crushed straight through the paper and read as three dark blocks.
 *
 * What is here now is the pinch itself: two thin bars that arrive from off
 * frame and meet at the sheet's midline, one just in front of it and one just
 * behind. They never intersect the paper because they close along Y and are
 * separated in Z, and two bars meeting on a sheet with a light running across
 * them is legible as a press in a way that a box is not.
 *
 * Every dimension is expressed against the *scaled* sheet — at PRESS the strip
 * is four panels of 0.86 at `rigScale.x` 0.5, times `SCENE_SCALE`, so about 2.9
 * wide. The bars are wider than that on purpose; a press narrower than its own
 * paper is the tell that nobody checked.
 */
export const press = {
  /** Bar length. Wider than the 2.9-unit sheet it closes on. */
  width: 3.6,
  /** Bar cross-section. Thin enough to read as a nip rather than as a slab. */
  height: 0.1,
  depth: 0.16,
  /** How far in Z the two bars sit either side of the sheet. */
  nipZ: 0.19,
  /** Where the bars wait, in Y, when there is no press. Outside the frustum. */
  parkY: 3.4,
  /** The progress line's cross-section, and how far in front of the bar it sits. */
  lineHeight: 0.05,
  lineZ: 0.3,
} as const;

/**
 * The three pieces that join the brochure in DELIVERY.
 *
 * Sizes are relative to a panel, and each is a plain box: a business card is a
 * thin slab, a catalogue is a thick one, a carton is closer to a cube. Together
 * with the brochure they are the four things the studio actually ships, and the
 * size contrast between them is the point — a card is *small*, and the
 * composition has to show that as well as say it.
 */
export const deliveryPieces = [
  {
    id: 'card',
    size: [0.62, 0.36, 0.05] as [number, number, number],
    position: [0.88, -0.34, 0.32] as [number, number, number],
    rotation: [-64 * DEG, 0, -14 * DEG] as [number, number, number],
    /** Arrival order, so they do not all land at once. */
    delay: 0,
  },
  {
    id: 'box',
    size: [0.66, 0.5, 0.62] as [number, number, number],
    position: [0.82, 0.36, -0.34] as [number, number, number],
    rotation: [-8 * DEG, -34 * DEG, 0] as [number, number, number],
    delay: 0.16,
  },
  {
    id: 'catalogue',
    size: [0.72, 1.0, 0.12] as [number, number, number],
    position: [-0.12, -0.52, 0.46] as [number, number, number],
    rotation: [-72 * DEG, 0, 8 * DEG] as [number, number, number],
    delay: 0.32,
  },
] as const;
