import { Section } from '@/components/layout/section';
import { FadeIn, FadeUp, Parallax, Stagger, StaggerItem } from '@/components/motion';
import { PrintPlate } from '@/components/ui/print-plate';
import { IndexMark, ShowcaseLink, SpecRail, bleedEnd, bleedStart, layerPanel } from '@/components/ui/editorial';
import { services } from '@/lib/content';
import { cn, pad, quoteHref } from '@/lib/utils';

/**
 * The six disciplines, one showcase each.
 *
 * ## What changed
 *
 * The bones were already right — alternating editorial rows, deep-linkable, one
 * action per row — but each row was still built like a card that had been
 * unfolded: a plate with a border, a radius and a shadow at half the row width,
 * a title, a sentence, and a line of pills. Three things were doing the card's
 * job even though the card was gone.
 *
 * All three are now removed:
 *
 * **The plate frames.** `frame="bleed"` drops the border, the radius and the
 * shadow, and the photograph runs past the container gutter on the outer side —
 * so a press sheet is shown at the size a press sheet needs to be read at,
 * rather than mounted like a postcard.
 *
 * **The pills.** `SpecRail` sets the same specifications as hairline rows. A
 * chip is a shape that looks like a control and is not one; a rule with a
 * figure against it is what a spec sheet actually looks like, and this page is
 * read by people who read spec sheets.
 *
 * **The little numbered circle.** The index is now architecture — an oversized
 * numeral behind the copy column, at the scale the row is, with the icon and
 * the small mono figure folded into a single hairline mark.
 *
 * ## What did not change
 *
 * The alternation, the parallax direction and the per-service quote link are
 * exactly as they were. `quoteHref` carries `?ref=` and `?kind=`, which
 * `features/quote/quote-form.tsx` reads to preselect the service and seed the
 * brief — so a visitor arriving from the binding row finds the form already
 * knowing what they are asking about.
 */
export function ServiceList() {
  return (
    <Section tone="raised" spacing="lg" divided className="relative isolate overflow-hidden">
      <Stagger stream as="ul" className="flex flex-col gap-28 md:gap-36 lg:gap-48">
        {services.map((service, index) => {
          const flipped = index % 2 === 1;
          const Icon = service.icon;

          return (
            <StaggerItem
              key={service.id}
              as="li"
              id={service.id}
              className="group scroll-mt-32"
            >
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                {/* ----------------------------------------------- The plate */}
                {/*
                  The plate drifts against the scroll, and the direction
                  alternates with the row — two plates travelling the same way
                  down a six-row column read as the page sliding, not as depth.
                  Twelve pixels, inert below `lg` and under reduced motion.
                */}
                <FadeIn
                  className={cn(
                    flipped ? 'lg:order-2 lg:col-span-7 lg:col-start-6' : 'lg:order-1 lg:col-span-7',
                  )}
                >
                  <Parallax offset={flipped ? -12 : 12}>
                    <div className={cn('relative', flipped ? bleedEnd : bleedStart)}>
                      {/* The second plane. Depth from two grounds out of
                          register, rather than from a shadow under a box. */}
                      <span
                        aria-hidden
                        className={cn(
                          layerPanel,
                          'hidden lg:block',
                          flipped
                            ? '-bottom-6 -left-6 top-6 w-1/2'
                            : '-bottom-6 -right-6 top-6 w-1/2',
                        )}
                      />

                      {service.image ? (
                        <PrintPlate
                          image={service.image}
                          ratio="wide"
                          frame="bleed"
                          sizes="(min-width: 1280px) 62vw, (min-width: 1024px) 60vw, 100vw"
                          tone={service.image.ground === 'dark' ? 'ink' : 'paper'}
                          marks
                        />
                      ) : null}
                    </div>
                  </Parallax>
                </FadeIn>

                {/* ------------------------------------------------ The copy */}
                <div
                  className={cn(
                    'relative',
                    flipped
                      ? 'lg:order-1 lg:col-span-4 lg:col-start-1'
                      : 'lg:order-2 lg:col-span-4 lg:col-start-9',
                  )}
                >
                  <IndexMark
                    value={pad(index + 1)}
                    className="absolute -top-10 left-0 text-[7rem] lg:-left-6 lg:-top-16 lg:text-[11rem]"
                  />

                  <FadeUp className="relative">
                    {/* The icon and a bronze rule, and no second numeral: the
                        oversized one behind this column is already the index,
                        and printing "03" twice within 80px reads as a bug. */}
                    <div className="flex items-center gap-3">
                      {Icon ? (
                        <Icon className="size-5 shrink-0 text-gold-600" strokeWidth={1.5} aria-hidden />
                      ) : null}
                      <span aria-hidden className="h-px w-10 bg-gold-500" />
                    </div>

                    <h2 className="mt-5 font-display text-display-sm text-ink-800">
                      {service.title}
                    </h2>

                    <p className="measure mt-4 text-body-lg text-ink-500">{service.summary}</p>

                    {service.specs?.length ? (
                      <SpecRail items={service.specs} columns={1} className="mt-8" />
                    ) : null}

                    <ShowcaseLink
                      href={quoteHref(service.id, 'service')}
                      arrow="up"
                      className="mt-8"
                    >
                      Quote for {service.title.toLowerCase()}
                    </ShowcaseLink>
                  </FadeUp>
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
