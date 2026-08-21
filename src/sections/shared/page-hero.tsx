import type { ReactNode } from 'react';

import { Container } from '@/components/layout/container';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * The hero every inner page opens with.
 *
 * One component rather than six near-identical ones, so page files stay short
 * and the type scale is identical across the site. It animates on mount
 * (`immediate`) rather than on scroll, because it is already in view.
 */

export interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  /** Standfirst paragraph. */
  lede?: ReactNode;
  /** Small tags under the lede — disciplines, formats, capabilities. */
  tags?: string[];
  /** Buttons or links. */
  actions?: ReactNode;
  /** Right-hand slot, for a 3D canvas or an image. Hidden below `lg`. */
  aside?: ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  lede,
  tags,
  actions,
  aside,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        // Clears the fixed navbar, then leaves editorial breathing room.
        'relative overflow-hidden pt-32 pb-16 sm:pt-40 md:pb-24 lg:pt-48 lg:pb-32',
        'paper-grain',
        className,
      )}
    >
      <Container>
        <div className={cn('grid gap-12', aside && 'lg:grid-cols-12 lg:items-center lg:gap-16')}>
          <div className={cn(aside ? 'lg:col-span-7' : 'max-w-4xl')}>
            <FadeUp immediate>
              <span className="inline-flex items-center gap-2.5 font-sans text-eyebrow font-medium uppercase text-gold-600">
                <span aria-hidden className="h-px w-6 bg-gold-600/50" />
                {eyebrow}
              </span>
            </FadeUp>

            <FadeUp immediate delay={0.08} className="mt-6">
              <h1 className="font-display text-display-xl font-normal text-ink-800">{title}</h1>
            </FadeUp>

            {lede ? (
              <FadeUp immediate delay={0.16} className="mt-7">
                <p className="measure text-body-lg text-ink-500">{lede}</p>
              </FadeUp>
            ) : null}

            {tags?.length ? (
              <Stagger immediate delay={0.24} className="mt-9 flex flex-wrap gap-2" as="ul">
                {tags.map((tag) => (
                  <StaggerItem key={tag} as="li">
                    <Badge variant="outline">{tag}</Badge>
                  </StaggerItem>
                ))}
              </Stagger>
            ) : null}

            {actions ? (
              <FadeUp immediate delay={0.3} className="mt-10 flex flex-wrap items-center gap-3">
                {actions}
              </FadeUp>
            ) : null}
          </div>

          {aside ? (
            <div className="hidden lg:col-span-5 lg:block">
              <div className="relative aspect-square w-full">{aside}</div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export default PageHero;
