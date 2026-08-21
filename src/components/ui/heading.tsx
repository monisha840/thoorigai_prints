import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Editorial headings.
 *
 * Level and size are separate props on purpose: a page has exactly one `<h1>`
 * for semantics and SEO, but its size is a design decision. `level` sets the
 * tag, `size` sets the type token.
 *
 *   <Heading level={1} size="display-xl">Ink on paper</Heading>
 *   <Heading level={2} size="display-md" eyebrow="Services" />
 */

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingSize =
  | 'display-2xl'
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm';

const sizeStyles: Record<HeadingSize, string> = {
  'display-2xl': 'text-display-2xl',
  'display-xl': 'text-display-xl',
  'display-lg': 'text-display-lg',
  'display-md': 'text-display-md',
  'display-sm': 'text-display-sm',
  'heading-lg': 'text-heading-lg',
  'heading-md': 'text-heading-md',
  'heading-sm': 'text-heading-sm',
};

/** Sensible size per level, so `size` only needs setting when overriding. */
const defaultSize: Record<HeadingLevel, HeadingSize> = {
  1: 'display-xl',
  2: 'display-md',
  3: 'display-sm',
  4: 'heading-lg',
  5: 'heading-md',
  6: 'heading-sm',
};

export interface HeadingProps {
  level?: HeadingLevel;
  size?: HeadingSize;
  /** Small-caps kicker rendered above the heading. */
  eyebrow?: string;
  /** Supporting paragraph rendered below, capped at a reading measure. */
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Light type on a dark section. */
  inverted?: boolean;
  className?: string;
  eyebrowClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
  id?: string;
}

export function Heading({
  level = 2,
  size,
  eyebrow,
  description,
  align = 'left',
  inverted = false,
  className,
  eyebrowClassName,
  descriptionClassName,
  children,
  id,
}: HeadingProps) {
  const Tag = `h${level}` as 'h1';
  const resolvedSize = size ?? defaultSize[level];

  return (
    <div className={cn('flex flex-col', align === 'center' && 'items-center text-center')}>
      {eyebrow ? (
        <span
          className={cn(
            'mb-4 inline-flex items-center gap-2.5 font-sans text-eyebrow font-medium uppercase',
            inverted ? 'text-gold-300' : 'text-gold-600',
            eyebrowClassName,
          )}
        >
          <span
            aria-hidden
            className={cn('h-px w-6', inverted ? 'bg-gold-300/60' : 'bg-gold-600/50')}
          />
          {eyebrow}
        </span>
      ) : null}

      {children ? (
        <Tag
          id={id}
          className={cn(
            'font-display font-normal',
            sizeStyles[resolvedSize],
            inverted ? 'text-paper-100' : 'text-ink-800',
            className,
          )}
        >
          {children}
        </Tag>
      ) : null}

      {description ? (
        <p
          className={cn(
            'measure mt-5 text-body-lg',
            inverted ? 'text-paper-200/72' : 'text-ink-500',
            align === 'center' && 'mx-auto',
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default Heading;
