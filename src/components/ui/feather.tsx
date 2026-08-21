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

/** Barb positions along the rachis, kept inside the vane outline at every step. */
const BARBS: ReadonlyArray<readonly [number, number, number, number]> = [
  // Left side — angled toward the tip, as real barbs are.
  [22.6, 13, 14.2, 12.4],
  [22.0, 20, 11.4, 20.6],
  [21.5, 27, 9.6, 28.8],
  [21.0, 34, 9.4, 37.2],
  [20.7, 41, 10.8, 45.4],
  [20.4, 48, 13.6, 52.6],
  // Right side.
  [23.2, 13, 30.4, 14.6],
  [22.6, 20, 31.8, 22.6],
  [22.1, 27, 32.6, 30.4],
  [21.6, 34, 32.4, 38.4],
  [21.2, 41, 30.8, 46.0],
  [20.8, 48, 27.8, 52.4],
];

/** The vane silhouette: pointed at the tip, tapering to the quill. */
const VANE =
  'M24 3 C 11 15 3.5 33 8 48 C 11 57.5 15.5 61 20 64 C 24.5 61 29.5 56 32.5 46.5 C 36.5 33 34.5 15 24 3 Z';

/** The spine, carried a little past the vane so it reads as a quill. */
const RACHIS = 'M23.5 6 C 21.5 25 20.2 45 20 64';

export function Feather({ className, variant = 'solid', style }: FeatherProps) {
  const solid = variant === 'solid';

  return (
    <svg
      viewBox="0 0 40 64"
      fill="none"
      aria-hidden
      focusable="false"
      className={cn('shrink-0', className)}
      style={style}
    >
      <path
        d={VANE}
        // The fill is deliberately weak: it is a tint of the band, not a shape
        // sitting on top of it.
        fill={solid ? 'currentColor' : 'none'}
        fillOpacity={solid ? 0.16 : 0}
        stroke="currentColor"
        strokeOpacity={solid ? 0.55 : 0.7}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />

      {BARBS.map(([x1, y1, x2, y2]) => (
        <path
          key={`${x1}-${y1}`}
          d={`M${x1} ${y1} L${x2} ${y2}`}
          stroke="currentColor"
          strokeOpacity={solid ? 0.42 : 0.3}
          strokeWidth={1.1}
          strokeLinecap="round"
        />
      ))}

      <path
        d={RACHIS}
        stroke="currentColor"
        strokeOpacity={0.9}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A hairline rule with the feather set into the middle of it.
 *
 * The seam between two bands of the same tone, where a plain rule would read as
 * a divider rather than a breath.
 */
export function FeatherDivider({
  className,
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'dark';
}) {
  const rule = tone === 'dark' ? 'bg-paper-100/15' : 'bg-paper-400';
  const nib = tone === 'dark' ? 'text-gold-500' : 'text-gold-600';

  return (
    <div aria-hidden className={cn('flex items-center gap-5', className)}>
      <span className={cn('h-px flex-1', rule)} />
      <Feather variant="line" className={cn('h-7 w-auto -rotate-12', nib)} />
      <span className={cn('h-px flex-1', rule)} />
    </div>
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
