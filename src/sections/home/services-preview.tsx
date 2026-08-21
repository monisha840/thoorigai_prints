import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Section } from '@/components/layout/section';
import {
  MouseParallax,
  MouseParallaxLayer,
  Stagger,
  StaggerItem,
} from '@/components/motion';
import { pointer } from '@/lib/theme/animations';
import { pillars } from '@/content/home';
import { Eyebrow, SectionIntro, band, mediaFrame, mediaZoom } from './shared';

/**
 * Services preview — MASTER_PROJECT_PLAN.md §6.2 section 3, "Three pillars".
 *
 * A hub routes; it does not sell. Three cards, one image, one sentence and the
 * real capability labels each — the taxonomy the audit found is "clean,
 * mutually exclusive, and matches how print buyers actually shop", so it is
 * kept exactly as-is.
 *
 * Cards are hairline-bordered sheets on the paper, not floating panels: a 1px
 * rule and a background shift do the work a shadow usually does (§2.7). The
 * whole card is the link, with the accessible name coming from the pillar name.
 */
export function ServicesPreview() {
  return (
    <Section
      id="services"
      tone="raised"
      spacing="none"
      className={band}
      aria-labelledby="services-heading"
    >
      <SectionIntro
        id="services-heading"
        eyebrow="What we run"
        heading="Three disciplines, one building"
        standfirst="Print, package and bind are the three things this business does, and it does all of them itself — so a job never waits on a third party between stages, and nothing gets lost in the hand-off."
      />

      <Stagger
        as="ul"
        stream
        className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-3"
      >
        {pillars.map((pillar) => (
          <StaggerItem key={pillar.name} as="li">
            {/*
              Hover here is three things arriving together: the card lifts 2px,
              its shadow deepens a step, and the photograph inside answers the
              cursor. §9.3 is explicit that the frame must not move while its
              image does — so the drift and the zoom both live on the layer
              inside the frame, and the card's own lift is a separate transform
              on a separate element.
            */}
            <MouseParallax
              as="article"
              range={pointer.mediaRange}
              className="group relative flex h-full flex-col overflow-hidden rounded-[4px] border border-paper-400 bg-paper-50 shadow-sheet motion-lift hover:-translate-y-0.5 hover:border-ink-800/20 hover:shadow-lifted"
            >
              <div className={`${mediaFrame} aspect-[3/2]`}>
                <MouseParallaxLayer depth={0.6} className="absolute inset-0 scale-[1.06]">
                  <Image
                    src={pillar.image.src}
                    alt={pillar.image.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw"
                    className={`object-cover ${mediaZoom}`}
                  />
                </MouseParallaxLayer>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <h3 className="font-sans text-heading-lg font-semibold tracking-tight text-ink-800">
                  {/* Stretched link: the whole card is clickable, the name is the label. */}
                  <Link href={pillar.href} className="after:absolute after:inset-0 after:content-['']">
                    {pillar.name}
                  </Link>
                </h3>

                <p className="mt-3 text-body-sm text-ink-500">{pillar.lead}</p>

                {/* Real capability labels, lifted from the live navigation and H2s. */}
                <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2 border-t border-paper-400 pt-5">
                  {pillar.covers.map((item) => (
                    <li
                      key={item}
                      className="rounded-[2px] border border-paper-400 px-2.5 py-1 font-mono text-caption text-ink-500"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex items-center gap-2 text-body-sm font-medium text-ink-800">
                  <span className="relative">
                    Explore {pillar.name.toLowerCase()}
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 motion-nudge group-hover:scale-x-100"
                    />
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 motion-nudge group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </span>
              </div>
            </MouseParallax>
          </StaggerItem>
        ))}
      </Stagger>

      {/*
        The one line on the homepage that names the fourth thing worth knowing:
        finishes and materials are where the margin is (§10.2, finish viewer at
        priority 1). It is a text link, not a fourth card — the decision here is
        three-way, and a fourth tile would blunt it.
      */}
      <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-paper-400 pt-8">
        <Eyebrow rule={false}>Also</Eyebrow>
        <p className="text-body-md text-ink-500">
          Foiling, spot UV, embossing and lamination are done in house —{' '}
          <Link
            href="/portfolio#gallery"
            className="rounded-[2px] text-ink-800 underline decoration-gold-500/50 decoration-1 underline-offset-4 motion-tint hover:decoration-gold-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
          >
            see the materials and finishes
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

export default ServicesPreview;
