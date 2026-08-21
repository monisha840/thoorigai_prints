import Image from 'next/image';
import type { ReactNode } from 'react';

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
  /** Crop-mark corners, as on a press sheet. Off for small tiles. */
  marks?: boolean;
  /** Slot rendered over the image — captions, indices, badges. */
  overlay?: ReactNode;
  /** Disable the hover lift where the plate is not interactive. */
  still?: boolean;
  className?: string;
  imageClassName?: string;
}

export function PrintPlate({
  image,
  ratio = 'landscape',
  sizes = '100vw',
  priority = false,
  tone = 'paper',
  marks = false,
  overlay,
  still = false,
  className,
  imageClassName,
}: PrintPlateProps) {
  const isInk = tone === 'ink';

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
        'relative w-full overflow-hidden rounded-lg border',
        ratioClass[ratio],
        // The matte doubles as the colour behind a still-decoding image, so
        // there is no white flash on a paper-toned page.
        isInk ? 'border-paper-100/12 bg-ink-800' : 'border-paper-400 bg-paper-200',
        !still && [
          'shadow-sheet motion-lift',
          'group-hover:shadow-lifted',
        ],
        className,
      )}
    >
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

      {/* An inner hairline. Reads as the edge of a mounted print. */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset',
          isInk ? 'ring-paper-100/8' : 'ring-ink-900/6',
        )}
      />

      {marks ? <PlateMarks tone={tone} /> : null}

      {overlay}
    </div>
  );
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
