import { ImageIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Stand-in for photography that has not been shot or cleared yet.
 *
 * Deliberately obvious rather than a grey box: it names the slot and its
 * intended ratio, so an empty tile reads as "artwork pending" instead of
 * "broken image". Swap the whole component for `next/image` when assets land —
 * the ratio classes are already the ones the real images should use.
 */

export type MediaRatio = 'portrait' | 'square' | 'landscape' | 'wide';

const ratioClass: Record<MediaRatio, string> = {
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
};

export interface PlaceholderMediaProps {
  ratio?: MediaRatio;
  /** Shown in the centre — usually the item name. */
  label?: string;
  /** Small index in the corner, for editorial numbering. */
  index?: string;
  tone?: 'paper' | 'ink';
  className?: string;
}

export function PlaceholderMedia({
  ratio = 'landscape',
  label,
  index,
  tone = 'paper',
  className,
}: PlaceholderMediaProps) {
  const isInk = tone === 'ink';

  return (
    <div
      aria-hidden
      className={cn(
        'relative w-full overflow-hidden',
        ratioClass[ratio],
        isInk ? 'bg-ink-800' : 'bg-paper-300',
        className,
      )}
    >
      {/* Crop marks, as on a press sheet. */}
      <span
        className={cn(
          'absolute left-4 top-4 size-3 border-l border-t',
          isInk ? 'border-paper-100/25' : 'border-ink-800/20',
        )}
      />
      <span
        className={cn(
          'absolute right-4 top-4 size-3 border-r border-t',
          isInk ? 'border-paper-100/25' : 'border-ink-800/20',
        )}
      />
      <span
        className={cn(
          'absolute bottom-4 left-4 size-3 border-b border-l',
          isInk ? 'border-paper-100/25' : 'border-ink-800/20',
        )}
      />
      <span
        className={cn(
          'absolute bottom-4 right-4 size-3 border-b border-r',
          isInk ? 'border-paper-100/25' : 'border-ink-800/20',
        )}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <ImageIcon
          className={cn('size-6', isInk ? 'text-paper-100/30' : 'text-ink-800/25')}
          strokeWidth={1.25}
        />
        {label ? (
          <span
            className={cn(
              'font-sans text-eyebrow font-medium uppercase',
              isInk ? 'text-paper-100/45' : 'text-ink-800/40',
            )}
          >
            {label}
          </span>
        ) : null}
      </div>

      {index ? (
        <span
          className={cn(
            'absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-caption tabular-nums',
            isInk ? 'text-paper-100/35' : 'text-ink-800/30',
          )}
        >
          {index}
        </span>
      ) : null}
    </div>
  );
}

export default PlaceholderMedia;
