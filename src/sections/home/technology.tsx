import { Container } from '@/components/layout/container';
import { Stagger, StaggerItem } from '@/components/motion';
import { technology } from '@/content/home';
import { PressStage } from './press-stage';
import { ArrowLink, SectionIntro, bandDark } from './shared';

/**
 * Technology we possess.
 *
 * The live homepage carries this heading over one image and nothing else — no
 * copy, no specification, no link. `docs/redesign-report.md` line 47 records the
 * fix as *retain the section, fill it*, so the heading survives verbatim and
 * everything beneath it is new. `MASTER_PROJECT_PLAN.md` §6.2 rule 4 — "a
 * section with no copy does not ship" — is the bar this had to clear.
 *
 * ## Where it sits, and why it is dark
 *
 * Directly above `ProcessTimeline`, for two reasons.
 *
 * `WhyUs`'s first commitment is *"Leading technology"*. The band immediately
 * after it should show the machine that claim rests on, and the band after
 * *that* should say what runs through it. Claim → evidence → process.
 *
 * And the dark-band budget. `docs/design-system.md` §13.1 caps a page at two or
 * three dark bands, and names "the press-floor and machinery band" as a
 * do-use-dark case. Sitting this immediately above the timeline merges the two
 * into one continuous dark run — one dark chapter with a tonal step inside it,
 * rather than three separate light-to-dark cuts. The page still reads as two
 * dark regions: this run, and the closing CTA.
 *
 * The ground is `indigo-950` (#141C2C) rather than the timeline's `ink-900`.
 * It is the press blue at its darkest step, which is both the navy the live
 * site puts behind this machine and a cool near-black that a warm-grey cut-out
 * separates from cleanly. Contrast on it: `paper-200` 15.9:1, `paper-500`
 * 11.3:1, `gold-500` 5.7:1, `paper-700` 5.4:1 — all AA.
 *
 * ## Structure
 *
 *     claim         SectionIntro, dark tone
 *     evidence      PressStage — the photograph, lit and annotated
 *     legend        the four modules the numbered discs point into
 *     specification the spec rail
 *
 * `bandDark` rather than `band`: dark reads optically tighter and takes the
 * extra 16px top and bottom.
 */
export function Technology() {
  return (
    <section
      id="technology"
      className={`relative isolate overflow-hidden bg-indigo-950 ${bandDark}`}
      aria-labelledby="technology-heading"
    >
      <Container>
        <SectionIntro
          id="technology-heading"
          eyebrow={technology.eyebrow}
          heading={
            <>
              {/*
                The live site foils this one word in its accent colour. `text-foil`
                is the house version of the same idea — a bronze gradient clipped
                to the glyphs — and §3.4's one-bronze-fill-per-page budget is not
                touched by it, because a text fill is a mark, not a fill.
              */}
              <span className="text-foil">{technology.heading.foil}</span>{' '}
              {technology.heading.rest}
            </>
          }
          standfirst={technology.standfirst}
          tone="dark"
          action={
            <ArrowLink href="#process" tone="dark">
              How a job runs
            </ArrowLink>
          }
        />

        <PressStage className="mt-14 lg:mt-20" />

        {/*
          The legend. Visible at every breakpoint, and that is the point.

          The markers on the plate are numbered discs, not labels — a callout
          laid over a photograph of a white machine cannot carry its own name
          legibly at that size. So the numbers are the index and this is the key
          they point into, in the same right-to-left order the paper travels.

          It also means nothing here is hover-only. An earlier cut hid this list
          from `lg` up and left desktop with four sentences reachable only by
          pointing at them, which is a hover reveal covering the content itself
          rather than supporting detail — the thing §8.4 rules out.
        */}
        <Stagger as="ol" className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {technology.modules.map((module) => (
            <StaggerItem key={module.n} as="li" className="border-t border-paper-100/12 pt-5">
              <span aria-hidden className="block font-mono text-caption tabular-nums text-gold-500">
                {module.n}
              </span>
              <h3 className="mt-3 font-sans text-heading-sm font-semibold tracking-tight text-paper-200">
                {module.label}
              </h3>
              <p className="mt-2 max-w-[46ch] text-body-sm text-paper-500">{module.body}</p>
            </StaggerItem>
          ))}
        </Stagger>

        {/*
          The spec rail — `docs/design-system.md` line 658's spec-table pattern:
          mono figures, hairline row rules, no vertical rules. Two columns on a
          phone rather than four; four 15-character values across 320px would set
          every one of them over three lines.

          A `<dl>` with a wrapper element per pair is valid HTML5 and is what
          lets each row reveal as one unit.
        */}
        <Stagger
          as="dl"
          className="mt-14 grid grid-cols-2 border-t border-paper-100/12 lg:mt-20 lg:grid-cols-4"
        >
          {technology.specs.map((spec) => (
            <StaggerItem
              key={spec.label}
              /*
                `last:border-b-0` is wrong in a two-column grid: the last *row*
                is the final two cells, not the final one, so dropping the rule
                on item four alone left a rule under item three that stopped
                half way across the section. `nth-last-child(-n+2)` is the last
                row while there are two columns; from `lg` the rules are
                vertical and every horizontal one is off anyway.
              */
              className="border-b border-paper-100/12 py-5 [&:nth-last-child(-n+2)]:border-b-0 sm:py-6 lg:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="font-sans text-eyebrow font-semibold uppercase tracking-widest text-paper-700">
                {spec.label}
              </dt>
              <dd className="mt-2 font-mono text-heading-md tabular-nums text-paper-200">
                {spec.value}
              </dd>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export default Technology;
