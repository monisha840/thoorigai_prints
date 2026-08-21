import type { ReactNode } from 'react';

import { FadeUp, SectionSeam, SectionTransition } from '@/components/motion';
import { Container, type ContainerWidth } from './container';
import { cn } from '@/lib/utils';

/**
 * Vertical rhythm and surface colour for a page section.
 *
 * `Container` owns the horizontal axis, `Section` owns the vertical one and the
 * background. Together they mean a page file contains layout intent only —
 * no repeated padding arithmetic.
 *
 *   <Section tone="ink" spacing="lg" id="services">…</Section>
 */

export type SectionTone = 'paper' | 'raised' | 'sunken' | 'ink' | 'indigo';
export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';

const toneStyles: Record<SectionTone, string> = {
  paper: 'bg-paper-200 text-ink-800',
  raised: 'bg-paper-100 text-ink-800',
  sunken: 'bg-paper-300 text-ink-800',
  ink: 'bg-ink-900 text-paper-200',
  indigo: 'bg-indigo-900 text-paper-200',
};

/** Mobile first: each step grows at md and again at lg. */
const spacingStyles: Record<SectionSpacing, string> = {
  none: '',
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24 lg:py-28',
  lg: 'py-20 md:py-32 lg:py-40',
  xl: 'py-24 md:py-40 lg:py-52',
};

export interface SectionProps {
  tone?: SectionTone;
  spacing?: SectionSpacing;
  width?: ContainerWidth;
  /** Hairline rule along the top edge, in the current tone. */
  divided?: boolean;
  /** Render children without a Container — for full-bleed media. */
  bleed?: boolean;
  /** Anchor target. Pair with a heading `id` for in-page nav. */
  id?: string;
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
  'aria-labelledby'?: string;
}

export function Section({
  tone = 'paper',
  spacing = 'md',
  width = 'default',
  divided = false,
  bleed = false,
  id,
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  const isDark = tone === 'ink' || tone === 'indigo';

  return (
    <section
      id={id}
      className={cn(
        'relative w-full',
        toneStyles[tone],
        spacingStyles[spacing],
        className,
      )}
      {...rest}
    >
      {/*
        Every section gets exactly one boundary treatment, and which one follows
        from how the boundary is drawn in the first place.

        A `divided` section is separated by a hairline, so the hairline is what
        moves: it draws itself across as the band arrives. A section without one
        is separated by a change of paper tone, which cannot be animated without
        redesigning it — so the band's content settles instead, scroll-linked, so
        the tone change reads as a handover rather than a cut.

        Never both: a rule that draws *and* content that rises is two answers to
        one question, and the second one is always the one that looks nervous.
      */}
      {divided ? <SectionSeam inverted={isDark} /> : null}

      {bleed ? (
        <MaybeSettled settled={!divided}>{children}</MaybeSettled>
      ) : (
        <MaybeSettled settled={!divided}>
          <Container width={width} className={containerClassName}>
            {children}
          </Container>
        </MaybeSettled>
      )}
    </section>
  );
}

/** Applies the settle only where it is the section's boundary treatment. */
function MaybeSettled({ settled, children }: { settled: boolean; children?: ReactNode }) {
  return settled ? <SectionTransition>{children}</SectionTransition> : <>{children}</>;
}

/**
 * Section header: eyebrow, heading and an optional action, laid out so the
 * action drops below the text on mobile and sits beside it from `md` up.
 */
export function SectionHeader({
  children,
  action,
  align = 'left',
  className,
}: {
  children?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      {/*
        The header reveals with the same entrance as everything else, and the
        action follows it by 100ms. Before this, sections built on
        `SectionHeader` had a static heading sitting above a grid that animated
        — the one thing on screen that did not move was the thing you read
        first. `SectionIntro` on the homepage does exactly this; the two are
        deliberately identical.
      */}
      <FadeUp className={cn('flex-1', align === 'center' && 'flex flex-col items-center')}>
        {children}
      </FadeUp>
      {action ? (
        <FadeUp delay={0.1} className="shrink-0">
          {action}
        </FadeUp>
      ) : null}
    </div>
  );
}

export default Section;
