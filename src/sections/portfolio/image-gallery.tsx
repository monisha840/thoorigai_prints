'use client';

import { Maximize2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Section, SectionHeader } from '@/components/layout/section';
import { Stagger, StaggerItem } from '@/components/motion';
import { Heading } from '@/components/ui/heading';
import { Lightbox, type LightboxSlide } from '@/components/ui/lightbox';
import { PrintPlate } from '@/components/ui/print-plate';
import { gallery } from '@/lib/portfolio';
import { pad } from '@/lib/utils';

/**
 * Formats and finishes — the range, not the client list.
 *
 * Deliberately on an ink band. Almost everything here was shot on a white
 * studio sweep, and a white plate on a dark ground reads as a print hung on a
 * wall; the same plate on paper reads as a stain. The dark band is doing real
 * work, not decoration.
 *
 * Masonry via CSS columns rather than a JS layout pass: each plate reserves its
 * height from the file's true dimensions, so the wall assembles with no reflow
 * and no measuring on the client.
 */
export function ImageGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const slides = useMemo<LightboxSlide[]>(
    () => gallery.map((entry) => ({
      image: entry.image,
      caption: entry.caption,
      detail: entry.detail,
    })),
    [],
  );

  return (
    <Section id="gallery" tone="ink" spacing="lg" divided width="wide">
      <SectionHeader>
        <Heading
          level={2}
          size="display-lg"
          eyebrow="Formats & finishes"
          description="Every construction, binding and finish we run in house. These are format samples rather than client jobs - the named work is above."
          inverted
        >
          The range
        </Heading>
      </SectionHeader>

      {/*
        `stream`, not group mode. This wall is four screens tall on a phone and
        two on a desktop — in group mode the plates near the bottom would finish
        revealing while they were still well below the fold, and the visitor
        would scroll down to content that had quietly already arrived. Streaming
        gives each plate its own trigger, so the wall assembles as it is read.

        The reveal wrapper is the column child rather than the button, because
        `break-inside-avoid` has to sit on whatever the CSS column actually
        breaks around. Putting the transform inside it would let a column slice
        a plate away from its caption.
      */}
      <Stagger
        as="div"
        stream
        className="mt-14 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
      >
        {gallery.map((entry, index) => (
          <StaggerItem
            key={entry.id}
            // `break-inside-avoid` is what keeps a plate from being sliced
            // across two columns; `mb-4` is the vertical gutter, since
            // `gap` only applies between columns.
            className="mb-4 break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group block w-full text-left"
              aria-label={`View ${entry.caption} full size`}
            >
              <PrintPlate
                image={entry.image}
                ratio="natural"
                sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                tone="ink"
                overlay={
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-end justify-end p-4 opacity-0 motion-tint group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-ink-950/70 text-paper-100 backdrop-blur-sm">
                      <Maximize2 className="size-4" strokeWidth={1.5} />
                    </span>
                  </span>
                }
              />

              <span className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-caption tabular-nums text-paper-100/35">
                  {pad(index + 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body-sm font-medium text-paper-100 motion-tint group-hover:text-gold-300">
                    {entry.caption}
                  </span>
                  <span className="mt-0.5 block text-caption text-paper-100/45">{entry.detail}</span>
                </span>
              </span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <Lightbox
        slides={slides}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </Section>
  );
}

export default ImageGallery;
