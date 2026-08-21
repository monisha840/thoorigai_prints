import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * The one button in the system. Renders an `<a>` when given `href`, a
 * `<button>` otherwise, so callers never have to think about which element.
 *
 *   <Button href="/contact" variant="primary">Get a quote</Button>
 *   <Button variant="ghost" size="sm" onClick={…}>Filter</Button>
 */

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'inverted';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base = [
  'group relative inline-flex items-center justify-center gap-2',
  'font-sans font-medium whitespace-nowrap',
  'rounded-full border border-transparent',
  'motion-button',
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-indigo-500',
  'disabled:pointer-events-none disabled:opacity-45',
  // §9.3: hover is a background shift and nothing else — no scale, no lift.
  // The press is the only movement a button makes, and it is 2%.
  'active:scale-[0.98]',
].join(' ');

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ink-800 text-paper-100 hover:bg-ink-900 shadow-sheet',
  secondary:
    'bg-transparent text-ink-800 border-ink-800/25 hover:border-ink-800/60 hover:bg-ink-800/[0.04]',
  accent: 'bg-gold-500 text-ink-950 hover:bg-gold-600 hover:text-paper-50 shadow-sheet',
  ghost: 'bg-transparent text-ink-600 hover:text-ink-900 hover:bg-ink-800/[0.05]',
  inverted: 'bg-paper-100 text-ink-900 hover:bg-paper-50 shadow-sheet',
  link: 'bg-transparent text-indigo-600 rounded-none px-0 underline underline-offset-[6px] decoration-1 decoration-indigo-600/35 hover:decoration-indigo-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-body-sm',
  md: 'h-11 px-6 text-body-sm',
  lg: 'h-13 px-8 text-body-md',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered before the label. */
  icon?: ReactNode;
  /** Rendered after the label — usually an arrow. */
  iconAfter?: ReactNode;
  /** Stretch to the container width. The default on mobile CTAs. */
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconAfter,
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    base,
    variantStyles[variant],
    variant === 'link' ? 'h-auto gap-1.5' : sizeStyles[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {icon ? <span className="shrink-0 [&_svg]:size-4">{icon}</span> : null}
      {children}
      {iconAfter ? (
        <span className="shrink-0 motion-nudge group-hover:translate-x-0.5 [&_svg]:size-4">
          {iconAfter}
        </span>
      ) : null}
    </>
  );

  if (typeof props.href === 'string') {
    const { href, ...anchorProps } = rest as ComponentPropsWithoutRef<'a'> & { href: string };
    const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          rel="noreferrer noopener"
          {...anchorProps}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as ComponentPropsWithoutRef<'button'>;
  return (
    <button type={buttonProps.type ?? 'button'} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

export default Button;
