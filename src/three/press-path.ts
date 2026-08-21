import { CatmullRomCurve3, Vector3 } from 'three';

/**
 * The route a sheet takes through the press.
 *
 * This file holds the numbers; `components/three/press-path-canvas.tsx` holds
 * the meshes — the same split as `fold-sequence.ts` and `fold-rig.tsx`.
 *
 * ## The coordinate trick
 *
 * Tracing a path onto a photograph normally means tuning world-space numbers by
 * eye against a camera you cannot solve for, and every tweak costs a round trip
 * through the renderer. So the scene does not use a perspective camera at all:
 * it uses an **orthographic** one framed to exactly the photograph's box, and
 * the control points below are written as **percentages of that box** — the
 * same units the markers in `content/home.ts` are written in.
 *
 * The consequence is worth stating plainly: a control point and a marker with
 * the same `x, y` land on the same pixel of the same machine part. The path can
 * be re-tuned by reading coordinates off the photograph, and it stays correct at
 * every viewport width because both spaces are proportional.
 *
 * ## The route itself
 *
 * Right to left, which is the direction paper actually travels and the order the
 * modules are numbered in. It runs along the machine's upper profile rather than
 * through its middle: in at the right paper deck, across the engine, up over the
 * taller finishing module and out at the trays. Along the top is both truer to
 * the machine and safer — a trace on an upward-facing surface survives a few
 * percent of misregistration, where one drawn across the cabinet doors reads as
 * a mistake. It did, the first time, and that is why the route was remeasured.
 *
 * It is drawn as a **hairline of light**, not a solid object. That is the other
 * half of the mitigation: a line has no silhouette to misalign, so it reads as a
 * stylised trace rather than as an overlay that has slipped.
 */

/**
 * Percentages of the image box: `[x, y]`, origin top-left, exactly as the markers.
 *
 * Re-measured off the rendered plate, not estimated. The first cut ran a
 * plausible-looking arc that dived from the engine down to y=46% at the far
 * left — which on the actual photograph is the finisher's *front face*, so the
 * trace crossed a white cabinet door at chest height and read as a scratch on
 * the print rather than as a route through the machine.
 *
 * These follow the machine's real top profile: the deck lid is flat at y≈30%,
 * the engine sits a little lower at y≈33%, and the finishing module at the far
 * left is the tallest of the three, so the line rises again before it exits.
 */
const ROUTE: readonly (readonly [number, number])[] = [
  [95, 30], // enters at the right paper deck (module 01)
  [76, 29],
  [58, 30],
  [45, 33], // across the print engine (module 02)
  [34, 35],
  [26, 31], // climbing onto the finishing module, which stands taller
  [17, 25],
  [9, 26], // out over the trays (module 04)
];

/**
 * The orthographic frame, in world units: 1.0 wide by 0.75 tall, centred on the
 * origin. Identical to the plate's 4:3 aspect, so one world unit of X is one
 * box-width and the mapping below is exact rather than approximate.
 */
export const FRAME = { width: 1, height: 0.75 } as const;

/** Percentage of the box → world units. Top-left origin becomes centre origin. */
export function fromPercent(x: number, y: number, z = 0): Vector3 {
  return new Vector3(
    (x / 100) * FRAME.width - FRAME.width / 2,
    FRAME.height / 2 - (y / 100) * FRAME.height,
    z,
  );
}

/**
 * The path, as a smooth curve.
 *
 * Not closed, and `centripetal` rather than the default `catmullrom`: with
 * control points this unevenly spaced, the uniform parameterisation overshoots
 * into visible loops at the tighter corners near the finisher.
 */
export function createPressPath(): CatmullRomCurve3 {
  return new CatmullRomCurve3(
    ROUTE.map(([x, y]) => fromPercent(x, y)),
    false,
    'centripetal',
  );
}

/**
 * Tube resolution and thickness.
 *
 * Six radial segments because nobody sees the cross-section of a hairline; the
 * tubular count is where the smoothness actually is. 120 × 6 × 2 = 1,440
 * triangles per tube, and there are two of them — against the 50,000 budget in
 * `config.ts`, about 6%.
 *
 * `radius` is in world units, so this is 0.16% of the box width: about 1.5px on
 * a 960px desktop plate, and proportionally the same on a phone. It was four
 * times this to begin with, which additively blended over a white machine came
 * out as a gold *band* laid across the press — the loudest thing in a section
 * whose whole argument is restraint. A trace of light has to be thin enough
 * that you notice the route and not the line.
 */
export const TUBE = {
  tubularSegments: 120,
  radialSegments: 6,
  radius: 0.0016,
} as const;

/**
 * The travelling pulse — a bright window sliding along the *same* curve.
 *
 * This began as a separate paper-white plane, a literal sheet. It was invisible:
 * the machine it travels across is white, and for two thirds of its journey the
 * sheet was white-on-white. Making it a segment of the trace instead fixes that
 * and three other things at once — it cannot drift out of alignment with the
 * path because it *is* the path, it needs no orientation maths, and it reuses a
 * geometry that already exists.
 */
export const PULSE = {
  /** Share of the tube's length that is lit at any moment. */
  length: 0.07,
} as const;

/**
 * The sequence, in seconds. A finite run, not a loop.
 *
 * `animations.ts` opens with "nothing loops", and an infinite conveyor of paper
 * on a page someone is trying to read a specification on is precisely what that
 * rule is about. So the trace draws itself, two pulses run it, and the scene
 * then holds on the finished line for as long as it is on screen.
 *
 * `Scene` parks the frame loop the moment the canvas leaves the viewport, so the
 * cost of holding is a static texture and no rAF at all.
 */
export const SEQUENCE = {
  /** The ribbon drawing itself along its own length. */
  draw: 1.1,
  /** One pulse, deck to tray. */
  pass: 1.4,
  /** How many pulses follow the trace before it settles. */
  passes: 2,
} as const;

/** Total run time, after which nothing moves again. */
export const SEQUENCE_DURATION = SEQUENCE.draw + SEQUENCE.pass * SEQUENCE.passes;

/**
 * How far along the pulse is at time `t` seconds, or `null` once the run is
 * over and the trace is left to sit.
 */
export function pulseProgress(elapsed: number): number | null {
  const t = elapsed - SEQUENCE.draw;
  if (t < 0 || t >= SEQUENCE.pass * SEQUENCE.passes) return null;
  return (t % SEQUENCE.pass) / SEQUENCE.pass;
}

/** How much of the ribbon is drawn at time `t` seconds, 0 → 1. */
export function drawProgress(elapsed: number): number {
  return Math.min(1, Math.max(0, elapsed / SEQUENCE.draw));
}
