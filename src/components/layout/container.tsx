import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Horizontal gutter and max width. Every piece of content on the site passes
 * through one of these, so page margins are defined in exactly one file.
 *
 * Gutters step up with the viewport (20px → 32px → 48px) rather than staying
 * fixed, which is what keeps the mobile layout from feeling cramped and the
 * desktop layout from feeling edge-to-edge.
 */

export type ContainerWidth = 'narrow' | 'default' | 'wide' | 'full';

const widthStyles: Record<ContainerWidth, string> = {
  /** Long-form reading column. */
  narrow: 'max-w-3xl',
  /** The site standard. */
  default: 'max-w-[88rem]',
  /** Galleries and full-bleed-ish grids. */
  wide: 'max-w-[104rem]',
  /** No cap — the gutters still apply. */
  full: 'max-w-none',
};

export interface ContainerProps {
  width?: ContainerWidth;
  /** Drop the horizontal padding (for a child that bleeds to the edge). */
  bleed?: boolean;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  id?: string;
}

export function Container({
  width = 'default',
  bleed = false,
  as = 'div',
  className,
  children,
  id,
}: ContainerProps) {
  // A union `ElementType` intersects the props of every intrinsic tag, which
  // collapses `children` to `never`. Narrowing to one tag types it correctly
  // and changes nothing at runtime.
  const Tag = as as 'div';

  return (
    <Tag
      id={id}
      className={cn(
        'mx-auto w-full',
        widthStyles[width],
        !bleed && 'px-5 sm:px-8 lg:px-12',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default Container;
