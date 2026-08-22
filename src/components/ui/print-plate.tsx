import Image from 'next/image';
import type { ReactNode } from 'react';

import { PlateParallax } from '@/components/ui/plate-parallax';
import type { WorkImage } from '@/lib/images';
import { cn } from '@/lib/utils';

/**
 * A photograph, mounted.
 *
 * This library was shot on studio sweeps, so an unframed image bleeds into a
 * paper-coloured page and the product stops reading as an object. Every plate
 * therefore gets three things a bare `<img>` does not have: a hairline edge, a
 * low wide shadow that deepens on hover, and a matte the image is inset on.
 * That is the whole trick — printed work looks expensive when it looks *placed*.
 *
 * Hover is CSS only (`group-hover`), so this stays a server component and costs
 * nothing on the client.
 */

export type PlateRatio =
  | 'portrait'
  | 'square'
  | 'landscape'
  | 'wide'
  | 'cinema'
  /** Keep the photograph's own proportions — for masonry columns. */
  | 'natural';

const ratioClass: Record<PlateRatio, string> = {
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/10]',
  cinema: 'aspect-[21/9]',
  natural: '',
};

export type PlateTone = 'paper' | 'ink';

/**
 * How the photograph is mounted.
 *
 * `plate` is the original: a hairline edge, a radius and a shadow — a print
 * mounted on a board, right for a tile in a set.
 *
 * `bleed` removes all three. It is for the showcase rows, where the photograph
 * runs past the container gutter and is the full width of its column: an edge
 * and a corner radius on an image that large stop reading as a mount and start
 * reading as a card, which is the whole thing those sections exist to avoid.
 * The matte, the seating gradient and the hover push-in all survive.
 */
export type PlateFrame = 'plate' | 'bleed';

export interface PrintPlateProps {
  image: WorkImage;
  ratio?: PlateRatio;
  /**
   * Responsive width hint for the browser. Always pass a real one — the
   * default assumes a full-width element and will over-fetch in a grid.
   */
  sizes?: string;
  /** Above the fold only. More than one or two defeats the purpose. */
  priority?: boolean;
  tone?: PlateTone;
  /** Mount style. `bleed` drops the edge, radius and shadow — see `PlateFrame`. */
  frame?: PlateFrame;
  /** Crop-mark corners, as on a press sheet. Off for small tiles. */
  marks?: boolean;
  /** Slot rendered over the image — captions, indices, badges. */
  overlay?: ReactNode;
  /** Disable the hover lift where the plate is not interactive. */
  still?: boolean;
  /**
   * Let the photograph lean toward the pointer inside its own frame.
   *
   * Opt-in, and deliberately so. It is the one thing on this component that
   * needs the client, and a catalogue page renders dozens of plates - paying
   * for a pointer field on every thumbnail to move it four pixels is not a
   * trade worth making. Reserve it for the large feature plates, where the
   * photograph is big enough for the depth to be felt.
   */
  parallax?: boolean;
  className?: string;
  imageClassName?: string;
}

export function PrintPlate({
  image,
  ratio = 'landscape',
  sizes = '100vw',
  priority = false,
  tone = 'paper',
  frame = 'plate',
  marks = false,
  overlay,
  still = false,
  parallax = false,
  className,
  imageClassName,
}: PrintPlateProps) {
  const isInk = tone === 'ink';
  const isBleed = frame === 'bleed';

  return (
    <div
      // `natural` reserves space from the file's real dimensions, so a masonry
      // column has its height before the image decodes and nothing reflows.
      style={
        ratio === 'natural'
          ? { aspectRatio: `${image.width} / ${image.height}` }
          : undefined
      }
      className={cn(
        'relative w-full overflow-hidden',
        isBleed ? 'rounded-none' : 'rounded-lg border',
        ratioClass[ratio],
        // The matte doubles as the colour behind a still-decoding image, so
        // there is no white flash on a paper-toned page.
        isInk ? 'bg-ink-800' : 'bg-paper-200',
        !isBleed && (isInk ? 'border-paper-100/12' : 'border-paper-400'),
        !still && !isBleed && [
          'shadow-sheet motion-lift',
          'group-hover:shadow-lifted',
        ],
        className,
      )}
    >
      {/* A server component rendering a client one, with the photograph passed
          through as a child: the image is still rendered on the server, and
          only the pointer field ships. */}
      <MaybeParallax on={parallax}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            'object-cover',
            // A slow, small push-in. Large enough to feel responsive, small
            // enough that the crop never visibly changes.
            !still && 'motion-zoom group-hover:scale-[1.04]',
            imageClassName,
          )}
        />
      </MaybeParallax>

      {/* Seats the product on the matte instead of letting it float. */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          isInk
            ? 'bg-gradient-to-t from-ink-950/45 via-transparent to-transparent'
            : 'bg-gradient-to-t from-ink-900/8 via-transparent to-transparent',
        )}
      />

      {/* An inner hairline. Reads as the edge of a mounted print — and so has
          no business on a bleed, where there is no mount for it to be the edge
          of. Leaving it on would also put a rounded ring inside a square
          corner, which is the one thing worse than either. */}
      {isBleed ? null : (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset',
            isInk ? 'ring-paper-100/8' : 'ring-ink-900/6',
          )}
        />
      )}

      {marks ? <PlateMarks tone={tone} /> : null}

      {overlay}
    </div>
  );
}

/** The pointer field, or nothing at all. Keeps the branch out of the markup. */
function MaybeParallax({ on, children }: { on: boolean; children: ReactNode }) {
  return on ? <PlateParallax>{children}</PlateParallax> : children;
}

/** Crop marks, borrowed from the placeholder so the house language survives. */
function PlateMarks({ tone }: { tone: PlateTone }) {
  const edge = tone === 'ink' ? 'border-paper-100/30' : 'border-paper-100/70';

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span className={cn('absolute left-4 top-4 size-3 border-l border-t', edge)} />
      <span className={cn('absolute right-4 top-4 size-3 border-r border-t', edge)} />
      <span className={cn('absolute bottom-4 left-4 size-3 border-b border-l', edge)} />
      <span className={cn('absolute bottom-4 right-4 size-3 border-b border-r', edge)} />
    </span>
  );
}

export default PrintPlate;
