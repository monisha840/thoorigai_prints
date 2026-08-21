'use client';

import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';

import { AnimatePresence, m } from '@/components/motion';
import { scrim, sheet } from '@/animations/variants';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import type { WorkImage } from '@/lib/images';
import { cn, pad } from '@/lib/utils';

/**
 * Full-screen image viewer.
 *
 * Small enough to own rather than pull a dependency for, and the accessibility
 * details are the reason most gallery lightboxes feel cheap:
 *
 * - Escape closes, arrow keys step through, and the handler lives on `document`
 *   so it works no matter what has focus inside the dialog.
 * - The scrollbar is replaced by equivalent padding when the body locks, so the
 *   page behind does not jump sideways as the overlay opens.
 * - Focus moves to the close button on open and returns to whatever opened the
 *   dialog on close.
 */

export interface LightboxSlide {
  image: WorkImage;
  caption: string;
  detail?: string;
}

export interface LightboxProps {
  slides: LightboxSlide[];
  /** Index of the open slide, or `null` when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ slides, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (index === null || slides.length === 0) return;
      // Wrap, so the arrows never dead-end.
      onNavigate((index + delta + slides.length) % slides.length);
    },
    [index, slides.length, onNavigate],
  );

  /* Keyboard. Bound while open only. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, step]);

  // The house hook already compensates for the disappearing scrollbar, so the
  // page behind does not jump sideways as the overlay opens.
  useLockBodyScroll(open);

  /* Move focus in on open, and put it back where it came from on close. */
  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    return () => {
      restoreRef.current?.focus?.();
    };
  }, [open]);

  const slide = index === null ? null : slides[index];

  return (
    <AnimatePresence>
      {slide ? (
        <m.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${slide.caption} — image ${index! + 1} of ${slides.length}`}
          variants={scrim}
          initial="hidden"
          animate="visible"
          exit="hidden"
          // Above the mobile menu panel (z-50), below the skip link (z-100).
          className="fixed inset-0 z-[60] flex flex-col bg-ink-950/94 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* ------------------------------------------------------- Bar */}
          <div className="flex shrink-0 items-center justify-between gap-4 px-5 py-5 sm:px-8">
            <span className="font-mono text-caption tabular-nums text-paper-100/60">
              {pad(index! + 1)} / {pad(slides.length)}
            </span>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close image viewer"
              className="flex size-11 items-center justify-center rounded-full border border-paper-100/20 text-paper-100/80 motion-tint hover:border-paper-100/50 hover:text-paper-50"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* ----------------------------------------------------- Image */}
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-8">
            <m.figure
              key={slide.image.src}
              variants={sheet}
              initial="hidden"
              animate="visible"
              // Clicks inside must not reach the backdrop's close handler.
              onClick={(event) => event.stopPropagation()}
              className="relative flex max-h-full min-h-0 w-full max-w-5xl flex-col"
            >
              <div
                className="relative w-full min-h-0 overflow-hidden rounded-lg bg-ink-900"
                style={{ aspectRatio: `${slide.image.width} / ${slide.image.height}` }}
              >
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  className="object-contain"
                />
              </div>

              <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-display text-heading-lg text-paper-100">{slide.caption}</span>
                {slide.detail ? (
                  <span className="text-body-sm text-paper-100/55">{slide.detail}</span>
                ) : null}
              </figcaption>
            </m.figure>
          </div>

          {/* ------------------------------------------------------- Nav */}
          <div className="flex shrink-0 items-center justify-center gap-3 px-5 py-6">
            <NavButton label="Previous image" onClick={() => step(-1)}>
              <ArrowLeft className="size-5" strokeWidth={1.5} />
            </NavButton>
            <NavButton label="Next image" onClick={() => step(1)}>
              <ArrowRight className="size-5" strokeWidth={1.5} />
            </NavButton>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        'flex size-12 items-center justify-center rounded-full border border-paper-100/20',
        'text-paper-100/80 motion-tint',
        'hover:border-paper-100/50 hover:bg-paper-100/8 hover:text-paper-50',
      )}
    >
      {children}
    </button>
  );
}

export default Lightbox;
