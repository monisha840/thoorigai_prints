import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * A small label: stock weight, run length, discipline, status. Reads as a
 * printed tag rather than a UI chip — hence the flat fills and hairline borders.
 */

export type BadgeVariant = 'neutral' | 'accent' | 'ink' | 'outline' | 'indigo';
export type BadgeSize = 'sm' | 'md';

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-paper-300 text-ink-600 border-paper-400',
  accent: 'bg-gold-100 text-gold-800 border-gold-200',
  ink: 'bg-ink-800 text-paper-100 border-ink-800',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  outline: 'bg-transparent text-ink-500 border-paper-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'h-6 px-2.5 text-[0.75rem] tracking-[0.1em]',
  md: 'h-7 px-3 text-caption tracking-[0.08em]',
};

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Small dot before the label — useful for availability or status. */
  dot?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-sans font-medium uppercase',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" /> : null}
      {children}
    </span>
  );
}

export default Badge;
