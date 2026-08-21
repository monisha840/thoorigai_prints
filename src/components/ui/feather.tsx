import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

/**
 * The feather from the Thoorigai mark, redrawn as vector ornament.
 *
 * Why not the logo file: `public/images/logos/feather-cmyk.webp` is a
 * rainbow-gradient raster — a 600px CMYK illustration that fights the
 * ink/gold/paper palette everywhere it lands and blurs when scaled up. This is
 * the same silhouette drawn in paths, tinted entirely by `currentColor`, so a
 * feather takes the colour of whatever band it sits in and stays sharp at any
 * size. Set the colour with a `text-*` class.
 *
 * There is no gradient and no `<defs>` on purpose: gradients need document-
 * unique ids, which would force this to be a client component and would
 * collide the moment two feathers shared a page. Depth comes from stacked
 * opacities instead, which costs nothing and renders on the server.
 */

export interface FeatherProps {
  className?: string;
  /**
   * `solid` fills the vane — the display treatment.
   * `line` is outline only, for small inline ornament beside a heading.
   */
  variant?: 'solid' | 'line';
  style?: CSSProperties;
}

/**
 * ## Why this was redrawn twice
 *
 * The original was a leaf. Not approximately — structurally: a closed pointed
 * ellipse, symmetric about a straight vertical midrib, with six evenly spaced
 * straight veins per side. Every feather-specific cue was absent or inverted —
 * no asymmetry, no shaft curvature, no exposed quill, an unbroken outline, and
 * barbs angling *toward the base*, which is the opposite of a real feather and
 * the opposite of what its own comment claimed. Upside down it was textbook
 * pinnate venation, which is exactly why it read as a leaf.
 *
 * The first redraw fixed the asymmetry and the shaft and was **still a leaf**,
 * because it kept the fundamental mistake: a filled outline with a few lines
 * drawn inside it. Rounded notches on such a shape read as oak lobes, and
 * interior lines read as veins.
 *
 * ## The thing that actually makes it a feather
 *
 * **The barbs are the edge.** There is no outline drawn around them. Ninety
 * fine strokes run from the shaft outward, and the silhouette is whatever their
 * tips happen to trace — so the edge is combed rather than smooth, which is
 * what separates a plume from a blade. The faint fill uses those same tips as
 * its polygon, so fill and strokes can never disagree.
 *
 * Everything else follows from the same idea:
 *
 * - **Asymmetric.** The trailing vane peaks at 15.0 units, the leading at 6.2 —
 *   about 2.4:1. A feather is a wing surface: a stiff narrow edge cuts the air
 *   and a soft wide one trails it.
 * - **A curved rachis**, from the calamus at (9,59) to the tip at (57,6). Shaft
 *   curvature is the single strongest cue, and the original had 3.5 units of
 *   drift over 58 of height — a straight line.
 * - **An exposed calamus.** Barbs start at t=0.13, so the shaft is bare below
 *   them. The original midrib stopped flush at the vane, as a leaf's does where
 *   it meets the petiole.
 * - **Three sharp splits** where barbs separate, cut as narrow linear Vs to 74 /
 *   66 / 58 percent of full width. Deep and angular, not shallow and round.
 * - **Barbs lean toward the tip** — 30° trailing, 34° leading — and carry a
 *   deterministic ±5% length jitter so the comb is irregular the way a real one
 *   is. Deterministic because a random one would differ between server and
 *   client and trip hydration.
 *
 * Generated, not hand-tuned: the barbs are the rachis curve's normals, scaled
 * by a sine width profile with the splits multiplied in.
 */

/**
 * The vane, traced through the barb tips. Used for the faint fill and as the
 * whole drawing in the `line` variant, where ninety hairlines at 28px would be
 * mud.
 */
const VANE =
  'M13.8 49.1L14.0 47.2L14.1 44.9L14.5 43.3L14.8 41.3L15.0 39.1L15.5 37.5L15.9 35.6L17.8 37.9L18.9 38.1L17.4 30.7L18.2 29.8L18.5 27.4L19.4 26.5L20.0 25.3L20.9 24.5L21.6 23.0L22.3 21.8L23.5 22.2L24.1 20.3L25.0 19.6L26.7 21.8L29.0 26.1L27.7 17.7L28.4 16.1L29.6 16.6L30.5 15.6L31.2 14.2L32.3 14.2L33.2 13.4L34.3 13.1L35.0 11.7L36.1 11.5L38.7 17.0L38.2 10.9L39.1 9.9L40.1 9.3L41.2 9.0L42.2 8.2L43.2 7.5L44.4 7.9L45.3 6.8L46.4 6.4L47.6 6.2L48.7 5.8L49.9 5.5L50.9 4.9L52.2 5.1L53.4 4.8L54.7 4.7L56.1 5.1L57.1 6.8L56.5 8.3L55.8 9.7L55.0 11.1L54.2 12.5L53.1 13.8L52.3 15.2L51.5 16.5L50.3 17.8L49.5 19.1L48.4 20.3L47.6 21.6L46.5 22.8L44.6 23.8L44.7 25.2L43.4 26.4L42.4 27.5L41.4 28.7L40.5 29.8L39.5 30.9L38.1 32.0L37.0 33.1L35.6 34.1L35.1 35.2L34.1 36.3L32.9 37.3L32.0 38.4L30.4 39.4L29.3 40.4L28.2 41.4L26.6 42.4L25.1 43.3L23.4 44.3L22.8 45.4L21.3 46.4L19.8 47.4L18.6 48.4L17.1 49.5L15.7 50.5Z';

/** Ninety barbs as one path. One element, not ninety — this renders up to six times per page. */
const BARBS =
  'M14.4 50.6L13.8 49.1M15.1 49.7L14.0 47.2M15.7 48.8L14.1 44.9M16.4 48.0L14.5 43.3M17.1 47.2L14.8 41.3M17.7 46.3L15.0 39.1M18.4 45.5L15.5 37.5M19.1 44.6L15.9 35.6M19.8 43.8L17.8 37.9M20.6 43.0L18.9 38.1M21.3 42.1L17.4 30.7M22.0 41.3L18.2 29.8M22.8 40.5L18.5 27.4M23.5 39.6L19.4 26.5M24.3 38.8L20.0 25.3M25.1 38.0L20.9 24.5M25.8 37.1L21.6 23.0M26.6 36.3L22.3 21.8M27.4 35.5L23.5 22.2M28.2 34.6L24.1 20.3M29.0 33.8L25.0 19.6M29.8 33.0L26.7 21.8M30.7 32.1L29.0 26.1M31.5 31.3L27.7 17.7M32.3 30.4L28.4 16.1M33.2 29.6L29.6 16.6M34.0 28.7L30.5 15.6M34.9 27.9L31.2 14.2M35.8 27.0L32.3 14.2M36.6 26.1L33.2 13.4M37.5 25.2L34.3 13.1M38.4 24.4L35.0 11.7M39.3 23.5L36.1 11.5M40.2 22.6L38.7 17.0M41.1 21.7L38.2 10.9M42.0 20.8L39.1 9.9M42.9 19.9L40.1 9.3M43.9 18.9L41.2 9.0M44.8 18.0L42.2 8.2M45.7 17.1L43.2 7.5M46.7 16.1L44.4 7.9M47.6 15.2L45.3 6.8M48.6 14.2L46.4 6.4M49.5 13.3L47.6 6.2M50.5 12.3L48.7 5.8M51.5 11.3L49.9 5.5M52.4 10.3L50.9 4.9M53.4 9.3L52.2 5.1M54.4 8.3L53.4 4.8M55.4 7.2L54.7 4.7M56.4 6.2L56.1 5.1M15.2 50.5L15.7 50.5M16.0 49.4L17.1 49.5M16.9 48.3L18.6 48.4M17.8 47.2L19.8 47.4M18.7 46.1L21.3 46.4M19.6 45.0L22.8 45.4M20.5 44.0L23.4 44.3M21.4 42.9L25.1 43.3M22.4 41.8L26.6 42.4M23.3 40.7L28.2 41.4M24.3 39.7L29.3 40.4M25.3 38.6L30.4 39.4M26.3 37.5L32.0 38.4M27.3 36.4L32.9 37.3M28.4 35.3L34.1 36.3M29.4 34.2L35.1 35.2M30.5 33.2L35.6 34.1M31.6 32.1L37.0 33.1M32.6 31.0L38.1 32.0M33.7 29.8L39.5 30.9M34.9 28.7L40.5 29.8M36.0 27.6L41.4 28.7M37.1 26.5L42.4 27.5M38.3 25.3L43.4 26.4M39.4 24.2L44.7 25.2M40.6 23.0L44.6 23.8M41.8 21.9L46.5 22.8M42.9 20.7L47.6 21.6M44.1 19.5L48.4 20.3M45.4 18.3L49.5 19.1M46.6 17.1L50.3 17.8M47.8 15.8L51.5 16.5M49.0 14.6L52.3 15.2M50.3 13.3L53.1 13.8M51.6 12.0L54.2 12.5M52.8 10.7L55.0 11.1M54.1 9.4L55.8 9.7M55.4 8.1L56.5 8.3M56.7 6.7L57.1 6.8';

/** The shaft, carried well past the barbs at the base so it reads as a quill. */
const RACHIS = 'M9 59 C 20 41, 37 27, 57 6';

export function Feather({ className, variant = 'solid', style }: FeatherProps) {
  const solid = variant === 'solid';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      focusable="false"
      className={cn('shrink-0', className)}
      style={style}
    >
      {/* The fill is deliberately weak: a tint of the band, not a shape sitting
          on top of it. Its outline is the barb tips, so it can never disagree
          with the strokes drawn over it. */}
      <path d={VANE} fill="currentColor" fillOpacity={solid ? 0.14 : 0} />

      {solid ? (
        <path
          d={BARBS}
          stroke="currentColor"
          strokeOpacity={0.72}
          strokeWidth={0.85}
          strokeLinecap="round"
        />
      ) : (
        /* At inline sizes the comb collapses into a smudge, so the line variant
           shows the silhouette instead. Same shape, legible at 28px. */
        <path
          d={VANE}
          stroke="currentColor"
          strokeOpacity={0.75}
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
      )}

      <path
        d={RACHIS}
        stroke="currentColor"
        strokeOpacity={0.92}
        strokeWidth={solid ? 1.5 : 1.6}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * An oversized, very faint feather for the corner of a band.
 *
 * Pointer-events-none and `aria-hidden`, so it never intercepts a tap or
 * reaches a screen reader. Hidden below `sm`: at phone width there is no room
 * for a watermark that is not also clutter.
 */
export function FeatherWatermark({
  className,
  tilt = -18,
  drift = true,
}: {
  className?: string;
  /** Degrees. Also the resting angle the drift animates around. */
  tilt?: number;
  drift?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute hidden select-none sm:block',
        drift && 'feather-drift',
        className,
      )}
      style={
        {
          '--feather-tilt': `${tilt}deg`,
          transform: `rotate(${tilt}deg)`,
        } as CSSProperties
      }
    >
      <Feather className="h-full w-auto" />
    </span>
  );
}

export default Feather;
