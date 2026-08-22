'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isActivePath, cn } from '@/lib/utils';
import type { NavItem } from '@/types';

/**
 * A desktop nav item.
 *
 * The underline is a CSS transform, not a Framer animation: it costs no
 * JavaScript, and `LazyMotion`'s `domAnimation` feature set (chosen for bundle
 * size) does not ship layout projection anyway. `aria-current` carries the
 * state for assistive tech, so the rule itself stays decorative.
 */

export interface NavLinkProps {
  item: NavItem;
  /** Light type, for the transparent navbar over a dark hero. */
  inverted?: boolean;
  className?: string;
}

export function NavLink({ item, inverted = false, className }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      /* The pool tightens on a nav item the same way it does on a CTA. Read by
         `SpotlightCursor` - nothing is registered or subscribed. */
      data-cursor="magnetic"
      className={cn(
        'group relative inline-flex h-9 items-center px-1 text-body-sm font-medium',
        'motion-tint',
        inverted
          ? active
            ? 'text-paper-50'
            : 'text-paper-200/70 hover:text-paper-50'
          : active
            ? 'text-ink-900'
            : 'text-ink-500 hover:text-ink-900',
        className,
      )}
    >
      {item.label}

      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 -bottom-0.5 h-px origin-left',
          'motion-nudge',
          inverted ? 'bg-gold-300' : 'bg-gold-500',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        )}
      />
    </Link>
  );
}

export default NavLink;
