import { Section } from '@/components/layout/section';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { Feather } from '@/components/ui/feather';
import { IndexMark } from '@/components/ui/editorial';
import { clientTestimonials, founderQuote, reassurances } from '@/content/home';
import { pad } from '@/lib/utils';
import { ArrowLink, SectionIntro, band } from './shared';

/**
 * In their words — MASTER_PROJECT_PLAN.md §6.2 sections 9–11, built to the
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
 * `content/home.ts` is an empty array and the quote list renders nothing.
 * Populate it with real, attributable, permissioned quotes and it appears above
 * the founder quote with no further work.
 *
 * What carries the band in the meantime is genuine: the founder's own words,
 * verbatim from the About page, and three objections answered in the live FAQ
 * in the business's own voice. Every word below is content that exists.
 *
 * ## What changed in the layout
 *
 * The founder quote was a gold-tinted panel with a 2px left rule — the design
 * system's "card type 5". One attributable sentence, and it was in a box. A
 * pull-quote is the one thing on a page that has earned the right to just *be*
 * type: it is now set at display size directly on the paper, with the mark's
 * feather behind it, and the attribution on a hairline underneath.
 *
 * The three reassurances were a three-column grid of equal blocks. They are now
 * a numbered editorial sequence — the same three answers, read as a short list
 * of objections handled rather than as three more tiles.
 */
export function Testimonials() {
  const hasClientQuotes = clientTestimonials.length > 0;

  return (
    <Section
      id="testimonials"
      tone="raised"
      spacing="none"
      className={`relative isolate overflow-hidden ${band}`}
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

      {/*
        Renders only when real, permissioned quotes exist. Set as an editorial
        list — a hairline, the quote, the attribution — rather than as tinted
        panels, so a real client quote arrives into the same register the
        founder's does instead of into a card.
      */}
      {hasClientQuotes ? (
        <Stagger as="ul" stream className="mt-16 flex flex-col gap-12 lg:mt-20 lg:gap-16">
          {clientTestimonials.map((t, index) => (
            <StaggerItem key={t.name} as="li">
              <figure className="grid gap-6 border-t border-paper-400 pt-8 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-3">
                  <IndexMark value={pad(index + 1)} variant="rule" />
                  <p className="mt-4 text-body-sm font-semibold text-ink-800">{t.name}</p>
                  <p className="mt-1 text-caption text-ink-500">{t.role}</p>
                </div>

                <blockquote className="font-display text-heading-lg font-normal leading-[1.5] text-ink-800 lg:col-span-8 lg:col-start-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      ) : null}

      {/*
        The founder quote. The one attributable quote the business has, so it is
        given the whole width and no container at all — the feather behind it is
        the only ornament, and it is the mark's own.
      */}
      <FadeUp className="relative mt-20 lg:mt-28">
        {/* `Feather` sets its own `aria-hidden`; this is ornament, not content. */}
        <Feather
          className="pointer-events-none absolute -left-8 -top-14 -z-10 hidden h-64 text-gold-500/[0.10] sm:block lg:-left-16 lg:-top-24 lg:h-96"
        />

        <figure>
          <blockquote className="max-w-[22ch] font-display text-display-md font-normal leading-[1.2] text-ink-800">
            <span aria-hidden>&ldquo;</span>
            {founderQuote.quote}
            <span aria-hidden>&rdquo;</span>
          </blockquote>

          <figcaption className="mt-10 flex flex-col gap-1 border-t border-paper-400 pt-6">
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
      <Stagger as="dl" className="mt-20 flex flex-col lg:mt-28">
        {reassurances.map((item, index) => (
          <StaggerItem
            key={item.title}
            className="grid gap-3 border-t border-paper-400 py-7 last:border-b lg:grid-cols-12 lg:gap-10"
          >
            <dt className="flex items-baseline gap-4 lg:col-span-5">
              <IndexMark value={pad(index + 1)} variant="rule" />
              <span className="font-display text-heading-lg font-normal text-ink-800">
                {item.title}
              </span>
            </dt>
            <dd className="max-w-[52ch] text-body-md text-ink-500 lg:col-span-6 lg:col-start-7">
              {item.body}
            </dd>
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
