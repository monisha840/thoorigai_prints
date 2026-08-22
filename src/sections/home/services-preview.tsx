import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Section } from '@/components/layout/section';
import {
  FadeIn,
  FadeUp,
  MouseParallax,
  MouseParallaxLayer,
  Parallax,
  Stagger,
  StaggerItem,
} from '@/components/motion';
import {
  IndexMark,
  SpecRail,
  bleedEnd,
  bleedStart,
  layerPanel,
} from '@/components/ui/editorial';
import { pointer } from '@/lib/theme/animations';
import { pad } from '@/lib/utils';
import { pillars } from '@/content/home';
import { Eyebrow, SectionIntro, band, mediaFrame, mediaZoom } from './shared';

/**
 * The three disciplines — MASTER_PROJECT_PLAN.md §6.2 section 3.
 *
 * ## What this used to be, and why it changed
 *
 * Three equal cards on a three-column grid: hairline border, 3:2 photograph,
 * heading, one sentence, four chips, a link. It was a correct card grid and it
 * was the wrong answer. Three cards side by side say *pick one of these three
 * comparable products*; what this business actually sells is that all three
 * happen in one building, and a grid of equals cannot say that. Worse, at 30vw
 * each the photographs were too small for the only thing they were there to
 * show — the material.
 *
 * It is now three editorial spreads, stacked. Each one runs its photograph past
 * the container gutter on alternating sides, so the images are roughly three
 * times the area they had and the rhythm of the section comes from the
 * alternation rather than from repetition. Whitespace does the separating that
 * borders used to.
 *
 * ## Depth, in three planes
 *
 *   back    an offset paper panel, 24px out of register with the photograph
 *   middle  the photograph, drifting against the scroll
 *   front   the numeral and the copy column, still
 *
 * That is the whole depth budget. No shadow on a box, because there is no box.
 *
 * The chips are gone too. `SpecRail` sets the same four capability labels as
 * hairline rows — a specification, which is what they are, rather than four
 * shapes, which is what made the block read as a card in the first place.
 */
export function ServicesPreview() {
  return (
    <Section
      id="services"
      tone="raised"
      spacing="none"
      className={`relative isolate overflow-hidden ${band}`}
      aria-labelledby="services-heading"
    >
      <SectionIntro
        id="services-heading"
        eyebrow="What we run"
        heading="Three disciplines, one building"
        standfirst="Print, package and bind are the three things this business does, and it does all of them itself - so a job never waits on a third party between stages, and nothing gets lost in the hand-off."
      />

      {/*
        `stream`, not the group cascade. Three spreads is roughly three screens
        on a phone, and in group mode the third would finish revealing two
        screens below the fold.
      */}
      <Stagger as="ul" stream className="mt-20 flex flex-col gap-24 lg:mt-28 lg:gap-40">
        {pillars.map((pillar, index) => (
          <StaggerItem key={pillar.name} as="li">
            <PillarSpread pillar={pillar} index={index} />
          </StaggerItem>
        ))}
      </Stagger>

      {/*
        The one line on the homepage that names the fourth thing worth knowing:
        finishes and materials are where the margin is (§10.2). It is a text
        link, not a fourth spread — the decision here is three-way, and a fourth
        block would blunt it.
      */}
      <div className="mt-20 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-paper-400 pt-8 lg:mt-28">
        <Eyebrow rule={false}>Also</Eyebrow>
        <p className="text-body-md text-ink-500">
          Foiling, spot UV, embossing and lamination are done in house -{' '}
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

/**
 * One discipline, at spread size.
 *
 * The ratio changes with the row as well as the side. Three spreads at 16:10
 * would be three cards again, only bigger — the varying crop is what keeps the
 * eye moving down the section instead of settling into a pattern.
 */
const spreadRatio = ['lg:aspect-[16/10]', 'lg:aspect-[4/3]', 'lg:aspect-[3/2]'] as const;

function PillarSpread({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[number];
  index: number;
}) {
  const flipped = index % 2 === 1;

  return (
    /*
      `group` for the hover states, `relative` so the stretched link has
      something to cover: the whole spread is the click target, and the
      accessible name is still the pillar name on the heading.
    */
    <div className="group relative grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      {/* ------------------------------------------------------------- Media */}
      <FadeIn
        className={
          flipped
            ? 'lg:order-2 lg:col-span-7 lg:col-start-6'
            : 'lg:order-1 lg:col-span-7'
        }
      >
        <Parallax offset={flipped ? -12 : 12}>
          <div className={`relative ${flipped ? bleedEnd : bleedStart}`}>
            {/*
              The second plane. Out of register with the photograph by 24px on
              the outer side, the way a proof sits under the sheet it was pulled
              from. Desktop only — on a phone the media is already full-bleed
              and there is no margin for it to occupy.
            */}
            <span
              aria-hidden
              className={`${layerPanel} hidden lg:block ${
                flipped
                  ? '-bottom-6 -left-6 top-6 w-1/2'
                  : '-bottom-6 -right-6 top-6 w-1/2'
              }`}
            />

            <MouseParallax range={pointer.mediaRange}>
              <div className={`${mediaFrame} aspect-[3/2] ${spreadRatio[index % 3]}`}>
                <MouseParallaxLayer depth={0.6} className="absolute inset-0 scale-[1.06]">
                  <Image
                    src={pillar.image.src}
                    alt={pillar.image.alt}
                    fill
                    sizes="(min-width: 1280px) 62vw, (min-width: 1024px) 60vw, 100vw"
                    className={`object-cover ${mediaZoom}`}
                  />
                </MouseParallaxLayer>
              </div>
            </MouseParallax>
          </div>
        </Parallax>
      </FadeIn>

      {/* -------------------------------------------------------------- Copy */}
      <div
        className={
          flipped
            ? 'relative lg:order-1 lg:col-span-4 lg:col-start-1'
            : 'relative lg:order-2 lg:col-span-4 lg:col-start-9'
        }
      >
        {/*
          The spine. Big enough to be architecture rather than a label, pale
          enough that it never competes with the heading it sits behind.
        */}
        <IndexMark
          value={pad(index + 1)}
          className="absolute -top-10 left-0 text-[7rem] lg:-left-6 lg:-top-16 lg:text-[11rem]"
        />

        <FadeUp className="relative">
          <h3 className="font-display text-display-sm font-normal text-ink-800">
            {/* Stretched link: the whole spread is clickable, the name is the label. */}
            <Link
              href={pillar.href}
              className="rounded-[2px] after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
            >
              {pillar.name}
            </Link>
          </h3>

          <p className="measure mt-5 text-body-lg text-ink-500">{pillar.lead}</p>

          <SpecRail items={pillar.covers} columns={1} className="mt-9" />

          {/*
            Not a link. The stretched heading above already covers this whole
            spread, so a second anchor here would sit underneath that overlay
            and be unclickable — a control that looks interactive and is not.
            This is the affordance for the link that is already there, and it
            answers a hover anywhere on the row.
          */}
          <span
            aria-hidden
            className="mt-8 inline-flex items-center gap-2 text-body-sm font-medium text-ink-800"
          >
            <span className="relative">
              Explore {pillar.name.toLowerCase()}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 motion-nudge group-hover:scale-x-100" />
            </span>
            <ArrowRight className="size-4 motion-nudge group-hover:translate-x-1" strokeWidth={1.5} />
          </span>
        </FadeUp>
      </div>
    </div>
  );
}

export default ServicesPreview;
