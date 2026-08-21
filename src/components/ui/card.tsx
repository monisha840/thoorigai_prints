import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * A sheet of paper. The generic surface for services, products and case
 * studies. Given `href`, the whole card becomes one link — a single tab stop
 * and one accessible name, rather than a nest of separate targets.
 */

export type CardVariant = 'sheet' | 'outline' | 'ink' | 'plain';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const variantStyles: Record<CardVariant, string> = {
  sheet: 'bg-paper-100 border border-paper-400/70 shadow-sheet',
  outline: 'bg-transparent border border-paper-500/70',
  ink: 'bg-ink-900 border border-paper-100/10 text-paper-200',
  plain: 'bg-transparent border-0',
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-7 sm:p-9 lg:p-10',
};

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Turns the whole card into a link. */
  href?: string;
  /** Lift and warm the border on hover. Implied when `href` is set. */
  interactive?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Card({
  variant = 'sheet',
  padding = 'md',
  href,
  interactive,
  className,
  children,
}: CardProps) {
  const isInteractive = interactive ?? Boolean(href);

  const classes = cn(
    'group relative flex flex-col overflow-hidden rounded-lg',
    'motion-lift',
    variantStyles[variant],
    paddingStyles[padding],
    // §9.3, card hover: a 2px rise, the border firming up, and one step of
    // elevation. The 4px rise this used to have read as a card jumping at the
    // cursor rather than answering it.
    isInteractive && 'hover:-translate-y-0.5 hover:shadow-lifted',
    isInteractive && variant !== 'ink' && 'hover:border-ink-800/16',
    isInteractive && variant === 'ink' && 'hover:border-paper-100/25',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(classes, 'focus-visible:outline-offset-4')}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}

/** Media slot. Give it a ratio class; children fill it. */
export function CardMedia({
  className,
  children,
  ratio = 'landscape',
}: {
  className?: string;
  children?: ReactNode;
  ratio?: 'portrait' | 'square' | 'landscape' | 'wide';
}) {
  const ratioClass = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
  }[ratio];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-paper-300',
        ratioClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn('flex flex-1 flex-col', className)}>{children}</div>;
}

export function CardTitle({
  className,
  children,
  as: Tag = 'h3',
}: {
  className?: string;
  children?: ReactNode;
  as?: 'h2' | 'h3' | 'h4';
}) {
  return (
    <Tag className={cn('font-display text-heading-lg font-normal text-inherit', className)}>
      {children}
    </Tag>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return <p className={cn('mt-3 text-body-sm text-ink-500', className)}>{children}</p>;
}

/** Bottom-aligned row for meta, specs or a read-more affordance. */
export function CardFooter({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn('mt-auto flex items-center gap-3 pt-6', className)}>{children}</div>
  );
}

export default Card;
