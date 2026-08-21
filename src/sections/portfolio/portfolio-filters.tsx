'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { m } from '@/components/motion';
import { base } from '@/animations/transitions';
import { categoryFilters, type FilterId } from '@/lib/portfolio';
import { cn, pad } from '@/lib/utils';

/**
 * The category rail.
 *
 * One pill slides between chips rather than two cross-fading, so switching
 * filters reads as a single object moving. It is measured and animated by hand
 * instead of with `layoutId`: layout animations need Framer's `domMax` feature
 * bundle, and `src/providers/motion-provider.tsx` deliberately loads the
 * smaller `domAnimation` set. Animating `x` and `width` is in `domAnimation`,
 * costs nothing extra, and gives the same result.
 *
 * On narrow screens the rail scrolls horizontally with the scrollbar hidden;
 * the edge fade is what signals there is more to the right.
 */

export interface PortfolioFiltersProps {
  active: FilterId;
  onChange: (id: FilterId) => void;
  className?: string;
}

interface PillRect {
  x: number;
  width: number;
}

export function PortfolioFilters({ active, onChange, className }: PortfolioFiltersProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<FilterId, HTMLButtonElement>());
  const [pill, setPill] = useState<PillRect | null>(null);

  const measure = useCallback(() => {
    const chip = chipRefs.current.get(active);
    if (!chip) return;
    // `offsetLeft` is relative to the rail (its offset parent), so the pill
    // travels with the content when the rail is scrolled sideways.
    setPill({ x: chip.offsetLeft, width: chip.offsetWidth });
  }, [active]);

  useLayoutEffect(() => {
    measure();

    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === 'undefined') return;

    // Chip widths change with the font and the viewport; re-measure rather
    // than leaving the pill stranded beside its label.
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [measure]);

  const current = categoryFilters.find((filter) => filter.id === active) ?? categoryFilters[0];

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div className="relative">
        <div
          ref={railRef}
          role="group"
          aria-label="Filter work by category"
          className={cn(
            'relative flex gap-2 overflow-x-auto pb-1',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {/* The travelling pill, behind the labels. */}
          <m.span
            aria-hidden
            className="absolute left-0 top-0 h-[calc(100%-0.25rem)] rounded-full bg-ink-800"
            initial={false}
            animate={
              pill
                ? { x: pill.x, width: pill.width, opacity: 1 }
                : // Nothing measured yet — stay invisible rather than flash at 0,0.
                  { opacity: 0 }
            }
            // §9.3 puts the tab indicator at `base`, and §9.1 reserves springs
            // for sheets and drag release — a pill that overshoots its own label
            // is the performance the house rule exists to prevent.
            transition={base}
          />

          {categoryFilters.map((filter) => {
            const isActive = filter.id === active;

            return (
              <button
                key={filter.id}
                type="button"
                ref={(node) => {
                  if (node) chipRefs.current.set(filter.id, node);
                  else chipRefs.current.delete(filter.id);
                }}
                onClick={() => onChange(filter.id)}
                aria-pressed={isActive}
                className={cn(
                  'relative shrink-0 rounded-full border px-5 py-2.5',
                  'text-body-sm font-medium whitespace-nowrap',
                  'motion-tint',
                  // The border stays in the box model at every state — dropping
                  // it on the active chip would shift its width by 2px and the
                  // pill would arrive at the wrong size.
                  isActive
                    ? 'border-transparent text-paper-100'
                    : 'border-paper-400 bg-paper-100/60 text-ink-500 hover:text-ink-900',
                )}
              >
                <span className="relative flex items-center gap-2">
                  {filter.label}
                  <span
                    className={cn(
                      'font-mono text-caption tabular-nums motion-tint',
                      isActive ? 'text-paper-100/55' : 'text-ink-300',
                    )}
                  >
                    {pad(filter.count)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Signals overflow on small screens; irrelevant once the rail fits. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-paper-200 to-transparent sm:hidden"
        />
      </div>

      {/* Announced politely, so a screen reader hears what the filter did. */}
      <p aria-live="polite" className="text-body-sm text-ink-400">
        {current.note}
      </p>
    </div>
  );
}

export default PortfolioFilters;
