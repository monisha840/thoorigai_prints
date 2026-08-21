import Image from 'next/image';

import { Container } from '@/components/layout/container';
import { Stagger, StaggerItem } from '@/components/motion';
import { processSteps } from '@/content/home';
import { ArrowLink, SectionIntro, bandDark } from './shared';

/**
 * Process timeline — MASTER_PROJECT_PLAN.md §6.2 section 4, "Press sequence".
 *
 * The live site carries a "Technology We Possess" heading with nothing beneath
 * it, and a genuinely good process diagram flattened into a raster
 * (`Steps-New-2.webp`). This rebuilds the concept as live HTML: indexable,
 * translatable, sharp on retina, and legible at 390px.
 *
 * It is one of the two dark bands on the page (§3.5 — maximum two or three,
 * always full-bleed, always with a hard edge; the abrupt light-to-dark cut is
 * the editorial device, so there is no gradient fade and no radius at the
 * junction). Dark bands take +16px of vertical padding over their light
 * equivalents, which is what `bandDark` carries.
 *
 * PROVENANCE NOTE (§8.7): the press-floor plate is used as an unlabelled
 * texture under a heavy scrim and is never captioned. `Printing-press-BG-1.jpg`
 * is a press hall of unverified origin — it must not be presented as "our
 * facility" until the client confirms it, and the reshoot in §12.1 replaces it.
 *
 * No turnaround figure appears anywhere below. The only real source is the FAQ
 * answer "That depends on the product and quantity", and inventing a number
 * here would reproduce the exact failure the audit found.
 */
export function ProcessTimeline() {
  return (
    <section
      id="process"
      className={`relative isolate overflow-hidden bg-ink-900 ${bandDark}`}
      aria-labelledby="process-heading"
    >
      {/* Environmental plate — decorative, unlabelled, aria-hidden. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/img/facility/press-floor.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.22]"
        />
        {/*
          Scrim verified against the brightest pixel behind the text, not the
          average — a press-floor shot has specular highlights on chrome that
          will eat white type (§3.5).
        */}
        <div className="absolute inset-0 bg-ink-900/88" />
      </div>

      <Container>
        <SectionIntro
          id="process-heading"
          eyebrow="How a job runs"
          heading="From your file to your delivery"
          standfirst="Five stages, all of them in the same building. You approve a proof before anything reaches a plate."
          tone="dark"
          action={
            <ArrowLink href="/about#process" tone="dark">
              The full process
            </ArrowLink>
          }
        />

        {/*
          Numbered timeline: a hairline rail on desktop with the figure sitting
          on it, stacking to a plain numbered list on mobile. Stagger is capped
          at six children by the shared variants, so nothing crawls in.
        */}
        <Stagger
          as="ol"
          className="mt-14 grid gap-y-10 border-t border-paper-100/12 lg:mt-20 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-0"
        >
          {processSteps.map((step) => (
            <StaggerItem
              key={step.n}
              as="li"
              className="relative border-paper-100/12 pt-8 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              {/* The marker that sits on the rail. */}
              <span
                aria-hidden
                className="absolute -top-px left-0 h-px w-10 bg-gold-500 lg:left-0"
              />

              <span className="block font-mono text-caption tabular-nums text-gold-500">
                {step.n}
              </span>

              <h3 className="mt-4 font-sans text-heading-md font-semibold tracking-tight text-paper-200">
                {step.title}
              </h3>

              <p className="mt-3 max-w-[46ch] text-body-sm text-paper-500">{step.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export default ProcessTimeline;
