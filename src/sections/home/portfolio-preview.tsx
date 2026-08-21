import Image from 'next/image';

import { Section } from '@/components/layout/section';
import { Stagger, StaggerItem } from '@/components/motion';
import { featuredWork } from '@/content/home';
import { ArrowLink, SectionIntro, band, mediaFrame } from './shared';

/**
 * Portfolio preview — MASTER_PROJECT_PLAN.md §6.2 section 9, "Work".
 *
 * Four genuinely delivered jobs. These are the only images of real client work
 * in the entire 168-file library (§8.2), and surfacing them is the single
 * largest credibility move available on the homepage: the live site claims
 * "From Start-Ups to Big Brands" with zero evidence behind it.
 *
 * Two gates apply, and both are enforced in `content/home.ts` rather than here.
 *
 * Legal (§8.7): every one of these is named client work — a Government of India
 * broadcaster, a healthcare brand, a retail label, an industrial supplier.
 * Written permission is not on file, so `client` is null and the card shows the
 * sector. The moment permission arrives, populate `client` and the name renders.
 *
 * Resolution (§8.5): three of the four source files are under 700px. They are
 * capped at grid-tile size — 2-up mobile, 4-up desktop — and deliberately have
 * no lightbox, because enlarging them would show the compression rather than
 * the work.
 *
 * The section hides itself if the array empties, per the empty-state-first
 * contract in §5.4.
 */
export function PortfolioPreview() {
  if (featuredWork.length === 0) return null;

  return (
    <Section
      id="work"
      tone="raised"
      spacing="none"
      className={band}
      aria-labelledby="work-heading"
    >
      <SectionIntro
        id="work-heading"
        eyebrow="Selected work"
        heading="From start-ups to big brands"
        standfirst="A Government of India broadcaster, a healthcare brand, a retail label and an industrial supplier. Client names follow once each has cleared them for publication."
        action={<ArrowLink href="/portfolio">See all work</ArrowLink>}
      />

      <Stagger
        as="ul"
        stream
        className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:mt-20 lg:grid-cols-4"
      >
        {featuredWork.map((item) => (
          <StaggerItem key={item.job} as="li">
            {/*
              Image-led and borderless: the image is the card (§5.4,
              `WorkCard`). No hover zoom on these — three of the four are at
              their resolution ceiling and a 1.03 scale would show it.
            */}
            <article className="flex h-full flex-col">
              <div className={`${mediaFrame} aspect-[4/5] bg-paper-300`}>
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col pt-5">
                <span className="font-sans text-eyebrow font-semibold uppercase text-gold-700">
                  {item.client ?? item.sector}
                </span>

                <h3 className="mt-2 font-sans text-heading-md font-semibold tracking-tight text-ink-800">
                  {item.job}
                </h3>

                <p className="mt-2 text-body-sm text-ink-500">{item.detail}</p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export default PortfolioPreview;
