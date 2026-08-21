import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Editorial showcase primitives — the vocabulary that replaced the card grids.
 *
 * The site used to answer every "list of things" question the same way: a
 * bordered sheet with a 3:2 photograph, a heading, a sentence and a row of
 * chips, repeated three, four, eight or nine times on an even grid. It read as
 * a catalogue, which is exactly what a print studio's site must not read as —
 * the thing being sold is judgement about material and finish, and judgement
 * does not survive being tiled.
 *
 * What replaced it is a small set of parts that compose into *sections*, not
 * into cards:
 *
 *   `IndexMark`    an oversized numeral, set in the display face, that sits
 *                  behind or beside a piece and gives a run of items an
 *                  editorial spine without a container.
 *   `SpecRail`     capability labels as hairline rows rather than pills. A chip
 *                  is a button that does nothing; a rule is a specification.
 *   `ShowcaseLink` the tertiary CTA, tone-aware, for use outside the homepage.
 *   `bleedStart` / `bleedEnd`
 *                  the gutter-eating margins that let a photograph run past the
 *                  container on one side, which is what makes an image read as
 *                  large rather than merely big.
 *   `layerPanel`   the offset ground behind a photograph. Depth comes from two
 *                  planes, not from a shadow on a box.
 *
 * Everything here is a server component and every state change is CSS, using
 * the four motion utilities from `globals.css`. No new token is introduced.
 */

export type EditorialTone = 'light' | 'dark';

/* -------------------------------------------------------------------------
 * Bleeds
 *
 * `Container` sets the gutter at 20 / 32 / 48px. These cancel it on one side so
 * media runs to the viewport edge, and then keep going at `xl`, where the
 * container is capped and there is page margin to spend. Nothing can scroll
 * sideways: `body` clips the x axis in `globals.css`.
 *
 * Both bleed to *both* edges below `lg`, because that is where the rows stack
 * and a full-width photograph is the point.
 * ---------------------------------------------------------------------- */

/** Media that runs off the left edge on desktop. */
export const bleedStart = '-mx-5 sm:-mx-8 lg:mr-0 lg:-ml-12 xl:-ml-20';

/** Media that runs off the right edge on desktop. */
export const bleedEnd = '-mx-5 sm:-mx-8 lg:ml-0 lg:-mr-12 xl:-mr-20';

/**
 * The second plane. An offset rectangle behind a photograph, in the sunken
 * paper tone — it gives the image an edge to sit against without drawing a
 * border around it. Position it with the call site's own inset utilities.
 */
export const layerPanel = 'pointer-events-none absolute -z-10 rounded-[2px] bg-paper-300';

/* -------------------------------------------------------------------------
 * Index mark
 * ---------------------------------------------------------------------- */

export interface IndexMarkProps {
  /** Already padded — `pad(index + 1)`. */
  value: string;
  tone?: EditorialTone;
  /**
   * `ghost` is the watermark: very low contrast, sits behind the composition.
   * `rule` is the small numeral on a hairline, beside the copy.
   */
  variant?: 'ghost' | 'rule';
  className?: string;
}

/**
 * The numeral that carries a run of items.
 *
 * Decorative in both variants — the reading order already has the heading, and
 * a screen reader announcing "zero three" before every title is noise. Size is
 * left to the call site, so a section can decide how loud its spine is.
 */
export function IndexMark({
  value,
  tone = 'light',
  variant = 'ghost',
  className,
}: IndexMarkProps) {
  const dark = tone === 'dark';

  if (variant === 'rule') {
    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex items-center gap-3 font-mono text-caption tabular-nums',
          dark ? 'text-gold-500' : 'text-gold-700',
          className,
        )}
      >
        <span className={cn('h-px w-6 shrink-0', dark ? 'bg-gold-500' : 'bg-gold-600')} />
        {value}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none block select-none font-display tabular-nums',
        dark ? 'text-paper-100/10' : 'text-ink-800/[0.07]',
        className,
        /*
          After `className`, not before it, and this is not a style choice.
          tailwind-merge lists `leading` as conflicting with `font-size`,
          because Tailwind's own `text-lg` sets both — so a call site passing
          `text-[11rem]` silently deletes any `leading-*` declared earlier in
          the same `cn()`. Written first, the numerals rendered at the default
          1.65 line-height, which is roughly 100px of empty space under each
          one and puts every `-top-*` offset in this file out by that much.

          A call site cannot override the leading now. That is correct: a tight
          measure is what makes this a mark rather than a very large number.
        */
        'leading-[0.78]',
      )}
    >
      {value}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * Spec rail
 * ---------------------------------------------------------------------- */

export interface SpecRailProps {
  items: readonly string[];
  tone?: EditorialTone;
  /** Two columns from `sm` up. One, for a narrow copy column. */
  columns?: 1 | 2;
  className?: string;
}

/**
 * Capabilities as a colophon.
 *
 * The pill version of this list is a large part of what made three service
 * blocks read as three cards: a chip is a shape, and six shapes stacked in a
 * box is a card whatever else is around it. A hairline row per item reads as a
 * specification sheet instead, which is the register a print buyer is actually
 * scanning in.
 */
export function SpecRail({ items, tone = 'light', columns = 2, className }: SpecRailProps) {
  const dark = tone === 'dark';

  return (
    <ul className={cn('grid gap-x-10', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            'flex gap-3 border-t py-2.5',
            dark ? 'border-paper-100/12' : 'border-paper-400',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'mt-[0.62em] size-1 shrink-0 rounded-full',
              dark ? 'bg-gold-500' : 'bg-gold-600',
            )}
          />
          <span className={cn('text-body-sm', dark ? 'text-paper-200/78' : 'text-ink-500')}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------
 * Showcase link
 * ---------------------------------------------------------------------- */

export interface ShowcaseLinkProps {
  href: string;
  children: ReactNode;
  tone?: EditorialTone;
  /** `up` for an action that leaves the section, `right` for one that continues it. */
  arrow?: 'right' | 'up';
  /**
   * Cover the nearest positioned ancestor, making the whole block clickable.
   * The ancestor needs `relative`; the link text stays the accessible name.
   */
  stretched?: boolean;
  className?: string;
}

/**
 * The tertiary CTA — §5.3. Label, a 16px arrow at an 8px gap, and a bronze rule
 * that draws left to right on hover. `sections/home/shared.tsx` has the
 * homepage-local twin of this; this one is tone-aware and can stretch, which is
 * what the showcase rows need.
 *
 * The hover states are declared against both `group/cta` and the bare `group`,
 * so the link answers its own hover *and* a hover anywhere on the row it
 * stretches over. Without the second, a stretched link would sit under the
 * pointer for the width of a whole band and never respond to it.
 */
export function ShowcaseLink({
  href,
  children,
  tone = 'light',
  arrow = 'right',
  stretched = false,
  className,
}: ShowcaseLinkProps) {
  const dark = tone === 'dark';
  const Arrow = arrow === 'up' ? ArrowUpRight : ArrowRight;

  return (
    <Link
      href={href}
      className={cn(
        'group/cta inline-flex items-center gap-2 rounded-[2px] py-1.5 text-body-sm font-medium',
        'motion-tint focus-visible:outline-2 focus-visible:outline-offset-4',
        dark
          ? 'text-paper-100 focus-visible:outline-gold-500'
          : 'text-ink-800 focus-visible:outline-indigo-500',
        stretched && "after:absolute after:inset-0 after:content-['']",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 motion-nudge group-hover/cta:scale-x-100 group-hover:scale-x-100"
        />
      </span>
      <Arrow
        aria-hidden
        className={cn(
          'size-4 shrink-0 motion-nudge',
          arrow === 'up'
            ? 'group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
            : 'group-hover/cta:translate-x-1 group-hover:translate-x-1',
        )}
        strokeWidth={1.5}
      />
    </Link>
  );
}
