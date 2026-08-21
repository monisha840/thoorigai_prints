import { Section } from '@/components/layout/section';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { clientTestimonials, founderQuote, reassurances } from '@/content/home';
import { ArrowLink, SectionIntro, band } from './shared';

/**
 * Testimonials — MASTER_PROJECT_PLAN.md §6.2 sections 9–11, built to the
 * empty-state-first contract in §5.4.
 *
 * WHAT IS DELIBERATELY NOT HERE, AND WHY.
 *
 * The live site has seven testimonial records. All seven are theme demo
 * content: they describe an AI training course, they are attributed to invented
 * Western names — Simon Thomas, Maria Rodriguez, Alex Thompson and four more —
 * and they use stock portrait photography. Not one renders on the public site
 * today. Deleting them is Wave 0, task 1 of the plan, ahead of every design
 * decision, because publishing invented testimonials attributed to named people
 * carries real exposure under India's consumer-protection rules on misleading
 * advertising.
 *
 * So this section ships **empty-state-first**. `clientTestimonials` in
 * `content/home.ts` is an empty array and the quote grid renders nothing.
 * Populate it with real, attributable, permissioned quotes and the grid appears
 * above the founder quote with no further work.
 *
 * What carries the band in the meantime is genuine: the founder's own words,
 * verbatim from the About page, and three objections answered in the live FAQ
 * in the business's own voice. Every word below is content that exists.
 */
export function Testimonials() {
  const hasClientQuotes = clientTestimonials.length > 0;

  return (
    <Section
      id="testimonials"
      tone="raised"
      spacing="none"
      className={band}
      aria-labelledby="testimonials-heading"
    >
      <SectionIntro
        id="testimonials-heading"
        eyebrow="In their words"
        heading={hasClientQuotes ? 'What clients say' : 'Why the work is made this way'}
        standfirst={
          hasClientQuotes
            ? undefined
            : 'Client quotes are being collected and will appear here once each one is on file and cleared. Until then, the founder speaks for the work.'
        }
      />

      {/* Renders only when real, permissioned quotes exist. */}
      {hasClientQuotes ? (
        <Stagger as="ul" className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20">
          {clientTestimonials.map((t) => (
            <StaggerItem key={t.name} as="li">
              <figure className="h-full border-l-2 border-gold-500 bg-gold-50 p-8">
                <blockquote className="font-display text-heading-lg font-normal leading-[1.5] text-ink-800">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 text-body-sm font-semibold text-ink-800">
                  {t.name}
                  <span className="mt-1 block text-caption font-normal text-ink-500">{t.role}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      ) : null}

      {/*
        Founder quote. Design system card type 5: bronze-50 ground, a 2px bronze
        left rule, no other border, radius 0, quote set in the display face.
        This is the one attributable quote the business has.
      */}
      <FadeUp className="mt-14 lg:mt-20">
        <figure className="border-l-2 border-gold-500 bg-gold-50 px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
          <blockquote className="max-w-[34ch] font-display text-display-sm font-normal leading-[1.35] text-ink-800 sm:max-w-[28ch]">
            <span aria-hidden>“</span>
            {founderQuote.quote}
            <span aria-hidden>”</span>
          </blockquote>

          <figcaption className="mt-8 flex flex-col gap-1 border-t border-gold-200 pt-6">
            <span className="text-body-md font-semibold text-ink-800">{founderQuote.name}</span>
            <span className="text-body-sm text-ink-500">{founderQuote.role}</span>
          </figcaption>
        </figure>
      </FadeUp>

      {/*
        Three real objections, answered in the business's own words. The first
        of them — "I am an Individual. Will You do my design?" — is the single
        most useful thing on the live site: it handles a genuine hesitation that
        no competitor in the category addresses.
      */}
      <Stagger as="dl" className="mt-14 grid gap-x-8 gap-y-8 border-t border-paper-400 pt-10 md:grid-cols-3">
        {reassurances.map((item) => (
          <StaggerItem key={item.title}>
            <dt className="font-sans text-heading-sm font-semibold tracking-tight text-ink-800">
              {item.title}
            </dt>
            <dd className="mt-2 max-w-[46ch] text-body-sm text-ink-500">{item.body}</dd>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeUp delay={0.1} className="mt-10">
        <ArrowLink href="/faq">All frequently asked questions</ArrowLink>
      </FadeUp>
    </Section>
  );
}

export default Testimonials;
