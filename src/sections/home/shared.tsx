import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { FadeUp } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * Homepage-local design primitives.
 *
 * These exist so the eight bands share one rhythm and one section skeleton
 * without touching `globals.css` or any shared component. Everything here maps
 * to a rule in MASTER_PROJECT_PLAN.md — the section reference is on each export.
 */

/* -------------------------------------------------------------------------
 * Vertical rhythm — §2.2, "Section rhythm"
 *
 * The plan's default band is 72 / 88 / 120px. `Section`'s own `spacing="md"`
 * step is 64 / 96 / 112, so these bands pass `spacing="none"` and set the
 * padding exactly. Dark bands take +16px top and bottom: dark reads optically
 * tighter and the extra air corrects it.
 * ---------------------------------------------------------------------- */

export const band = 'py-[4.5rem] md:py-[5.5rem] lg:py-[7.5rem]';
export const bandDark = 'py-[5.5rem] md:py-[6.5rem] lg:py-[8.5rem]';
export const bandLarge = 'py-[6rem] md:py-[7.5rem] lg:py-[10rem]';

/* -------------------------------------------------------------------------
 * Button overrides — §2.4 and §9.3
 *
 * The shared `Button` is a pill with a lift and a shadow. The design system is
 * an editorial one: `radius-xs` 2px, and button hover is a background shift
 * with no lift. `cn` runs tailwind-merge, so these win over the base classes
 * without editing the shared component or any other page.
 * ---------------------------------------------------------------------- */

export const editorialButton = 'rounded-[2px] shadow-none hover:translate-y-0 hover:shadow-none';

/* -------------------------------------------------------------------------
 * Eyebrow — §4.4, "The eyebrow"
 *
 * 24px × 1px bronze rule, then the overline in bronze-700. `gold-700` #85562F
 * measures 5.67:1 on paper and is AA at all sizes; `gold-600` — which the old
 * hero used at 12px — is 3.89:1 and fails.
 * ---------------------------------------------------------------------- */

export function Eyebrow({
  children,
  rule = true,
  tone = 'light',
  className,
}: {
  children: ReactNode;
  rule?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-sans text-eyebrow font-semibold uppercase',
        // On dark the eyebrow steps up to gold-500 (5.62:1); gold-700 would sink.
        tone === 'dark' ? 'text-gold-500' : 'text-gold-700',
        className,
      )}
    >
      {rule ? <span aria-hidden className="h-px w-6 shrink-0 bg-gold-500" /> : null}
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * Section intro — §2.6, "Section anatomy"
 *
 *   rule + eyebrow → 12px → heading (max 28ch) → 16px → standfirst (max 68ch)
 * ---------------------------------------------------------------------- */

export function SectionIntro({
  eyebrow,
  heading,
  standfirst,
  id,
  tone = 'light',
  align = 'left',
  action,
  className,
}: {
  eyebrow: string;
  heading: ReactNode;
  standfirst?: ReactNode;
  id?: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}) {
  const isDark = tone === 'dark';

  return (
    <div
      className={cn(
        'flex flex-col gap-8 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <FadeUp className={cn('flex-1', align === 'center' && 'flex flex-col items-center')}>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>

        <h2
          id={id}
          className={cn(
            'mt-3 max-w-[28ch] font-display text-display-sm font-normal',
            isDark ? 'text-paper-200' : 'text-ink-800',
          )}
        >
          {heading}
        </h2>

        {standfirst ? (
          <p
            className={cn(
              'mt-4 max-w-[68ch] text-body-lg',
              isDark ? 'text-paper-500' : 'text-ink-500',
            )}
          >
            {standfirst}
          </p>
        ) : null}
      </FadeUp>

      {action ? (
        <FadeUp delay={0.1} className="shrink-0">
          {action}
        </FadeUp>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Arrow link — §5.3, the tertiary CTA
 *
 * Label + a 16px arrow at an 8px gap. On hover the arrow translates 4px and a
 * 1px bronze underline draws left-to-right over 220ms. The reduced-motion
 * brake in `globals.css` collapses both to nothing, leaving the link intact.
 * ---------------------------------------------------------------------- */

export function ArrowLink({
  href,
  children,
  tone = 'light',
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 py-1.5 text-body-sm font-medium',
        'rounded-[2px] motion-tint',
        'focus-visible:outline-2 focus-visible:outline-offset-4',
        tone === 'dark'
          ? 'text-paper-200 focus-visible:outline-gold-500'
          : 'text-ink-800 focus-visible:outline-indigo-500',
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 motion-nudge group-hover:scale-x-100"
        />
      </span>
      <ArrowRight
        aria-hidden
        className="size-4 shrink-0 motion-nudge group-hover:translate-x-1"
        strokeWidth={1.5}
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------
 * Media frame — §2.7, "Imagery"
 *
 * Reserves the aspect ratio so CLS stays at zero, and clips at radius 0 so
 * nothing crops the object. The image scales inside a frame that does not
 * move — §9.3.
 * ---------------------------------------------------------------------- */

export const mediaFrame =
  'relative w-full overflow-hidden rounded-none bg-paper-300 [&_img]:object-cover';

export const mediaZoom =
  'motion-zoom group-hover:scale-[1.03]';
