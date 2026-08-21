import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Section } from '@/components/layout/section';
import { FadeUp, Parallax, Stagger, StaggerItem } from '@/components/motion';
import { Badge } from '@/components/ui/badge';
import { PrintPlate } from '@/components/ui/print-plate';
import { services } from '@/lib/content';
import { cn, pad, quoteHref } from '@/lib/utils';

/**
 * The service detail list.
 *
 * Alternating editorial rows, each anchored on its own id so the footer and
 * navigation can deep-link into them (`/services#offset`). Rows reverse on
 * desktop only — on mobile the image always leads, which keeps the reading
 * order the same as the visual order.
 *
 * ## Each row ends on an action
 *
 * Every row used to close on the same sentence — "Detailed specifications,
 * stock options and lead times for this service are being written up with the
 * studio" — printed six times down one page. Two things were wrong with it. It
 * told a visitor six times over that the page was unfinished, on the page they
 * came to in order to decide; and it occupied the position where the row's call
 * to action belongs, so a reader convinced by the offset row had nowhere to go
 * from it but back to the top of the page.
 *
 * The replacement is a per-service quote link. `quoteHref` carries `?ref=` and
 * `?kind=`, which `features/quote/quote-form.tsx` already reads to preselect
 * the service and seed the brief — so a visitor arriving from the binding row
 * finds the form already knowing what they are asking about. That machinery
 * existed and nothing on the services page was using it.
 */
export function ServiceList() {
  return (
    <Section tone="raised" spacing="lg" divided>
      <Stagger stream as="ul" className="flex flex-col gap-20 md:gap-28">
        {services.map((service, index) => {
          const reversed = index % 2 === 1;
          const Icon = service.icon;

          return (
            <StaggerItem
              key={service.id}
              as="li"
              id={service.id}
              className="group scroll-mt-32"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
                {/*
                  The plate drifts against the scroll, and the direction
                  alternates with the row — two plates travelling the same way
                  down a six-row column read as the page sliding, not as depth.
                  Twelve pixels, inert below `lg` and under reduced motion.
                */}
                <Parallax
                  offset={reversed ? -12 : 12}
                  className={cn(
                    'lg:col-span-6',
                    reversed ? 'lg:order-2 lg:col-start-7' : 'lg:order-1',
                  )}
                >
                  {service.image ? (
                    <PrintPlate
                      image={service.image}
                      ratio="wide"
                      // Half the row from `lg`, full width below.
                      sizes="(min-width: 1024px) 48vw, 92vw"
                      tone={service.image.ground === 'dark' ? 'ink' : 'paper'}
                      marks
                      overlay={
                        <span className="pointer-events-none absolute left-5 top-5 font-mono text-caption tabular-nums text-paper-100 mix-blend-difference">
                          {pad(index + 1)}
                        </span>
                      }
                    />
                  ) : null}
                </Parallax>

                <div
                  className={cn(
                    'lg:col-span-5',
                    reversed ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-8',
                  )}
                >
                  <div className="flex items-center gap-3">
                    {Icon ? (
                      <span className="grid size-9 place-items-center rounded-full border border-paper-400 text-gold-600">
                        <Icon className="size-4" strokeWidth={1.5} />
                      </span>
                    ) : null}
                    <span className="font-mono text-caption tabular-nums text-ink-400">
                      {pad(index + 1)}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-display-sm text-ink-800">
                    {service.title}
                  </h2>
                  <p className="measure mt-4 text-body-md text-ink-500">{service.summary}</p>

                  {service.specs?.length ? (
                    <ul className="mt-7 flex flex-wrap gap-2">
                      {service.specs.map((spec) => (
                        <li key={spec}>
                          <Badge variant="outline">{spec}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {/* `?ref=` is what makes this better than a generic quote
                      button: the form arrives knowing which service was being
                      read, and seeds the brief with it. */}
                  <Link
                    href={quoteHref(service.id, 'service')}
                    className="group/cta mt-8 inline-flex items-center gap-2 rounded-[2px] py-1.5 text-body-sm font-medium text-ink-800 motion-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
                  >
                    <span className="relative">
                      Quote for {service.title.toLowerCase()}
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 motion-nudge group-hover/cta:scale-x-100"
                      />
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 motion-nudge group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                      strokeWidth={1.5}
                    />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

/** Quick-jump strip under the hero, so a long page is navigable. */
export function ServiceIndex() {
  return (
    <Section tone="paper" spacing="sm" divided>
      <FadeUp>
        <nav aria-label="Services on this page">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {services.map((service, index) => (
              <li key={service.id}>
                <a
                  href={`#${service.id}`}
                  className="group inline-flex items-baseline gap-2.5 py-1.5 text-body-sm text-ink-500 motion-tint hover:text-ink-900"
                >
                  <span className="font-mono text-caption tabular-nums text-ink-300 motion-tint group-hover:text-gold-600">
                    {pad(index + 1)}
                  </span>
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </FadeUp>
    </Section>
  );
}

export default ServiceList;
