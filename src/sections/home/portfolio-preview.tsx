import Image from 'next/image';

import { Section } from '@/components/layout/section';
import { FadeIn, FadeUp, Parallax, Stagger, StaggerItem } from '@/components/motion';
import { IndexMark } from '@/components/ui/editorial';
import { featuredWork } from '@/content/home';
import { pad } from '@/lib/utils';
import { ArrowLink, Eyebrow, band, mediaFrame } from './shared';

/**
 * Selected work — MASTER_PROJECT_PLAN.md §6.2 section 9.
 *
 * Four genuinely delivered jobs. These are the only images of real client work
 * in the entire 168-file library (§8.2), and surfacing them is the single
 * largest credibility move available on the homepage: the live site claims
 * "From Start-Ups to Big Brands" with zero evidence behind it.
 *
 * ## What this used to be, and why it changed
 *
 * Four equal 4:5 tiles on a four-column grid. The problem was not the tiles, it
 * was what four equal tiles *say*: these are four interchangeable items from a
 * set. They are not. They are the only four pieces of evidence on the page, and
 * evidence has to be given room or it reads as stock.
 *
 * It is now a **sticky spread**. The argument holds still in the left column
 * while the evidence scrolls past it on the right — so the claim and the proof
 * are on screen together for the whole band, which is the one thing a grid of
 * four tiles under a heading can never do. The pieces are staggered, indented
 * and alternately aligned, and no two are the same width.
 *
 * ## The widths are not a design decision — they are the constraint
 *
 * §8.5: three of these four source files are under 700px, and one is 278px
 * wide. They must never be enlarged, because at any real size what the visitor
 * sees is JPEG artefacts rather than the work.
 *
 * So each piece is capped at **its own intrinsic pixel width** — `maxWidth`
 * below is read straight off the file, not chosen. That is what produces the
 * composition: a 278px belly-band shot sits small and deeply indented, an 800px
 * business-card shot runs the full column, and the rhythm between them is
 * honest about the library rather than papering over it. When the reshoot in
 * §12.1 lands and the files get bigger, the layout opens up on its own.
 *
 * The legal gate (§8.7) is unchanged and enforced in `content/home.ts`: every
 * one of these is named client work without written permission on file, so
 * `client` is null and the sector renders instead. There is still no lightbox.
 *
 * The section hides itself if the array empties, per §5.4.
 */

/** Alignment and indent per piece. Alternating, so the column never queues up. */
const placement = [
  'lg:mr-auto',
  'lg:ml-auto',
  'lg:ml-[12%] lg:mr-auto',
  'lg:ml-auto',
] as const;

export function PortfolioPreview() {
  if (featuredWork.length === 0) return null;

  return (
    <Section
      id="work"
      tone="raised"
      spacing="none"
      /*
        No `overflow-hidden` here, deliberately. The left column is `sticky`,
        and an ancestor with a clipped overflow becomes the scroll container a
        sticky element sticks inside — one that never scrolls, so the pin
        silently stops working. Nothing in this band bleeds, so there is
        nothing to clip anyway.
      */
      className={band}
      aria-labelledby="work-heading"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        {/* ------------------------------------------------------ The claim */}
        {/*
          Sticky from `lg` up only. On a phone this is simply the section
          intro, in the same place it has always been — `position: sticky` on a
          single-column layout would pin the heading over the work it is
          introducing, which is worse than not sticking at all.
        */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <FadeUp>
              <Eyebrow>Selected work</Eyebrow>

              <h2
                id="work-heading"
                className="mt-3 max-w-[16ch] font-display text-display-md font-normal text-ink-800"
              >
                From start-ups to big brands
              </h2>

              <p className="mt-5 max-w-[46ch] text-body-lg text-ink-500">
                A Government of India broadcaster, a healthcare brand, a retail label and an
                industrial supplier. Client names follow once each has cleared them for
                publication.
              </p>

              <div className="mt-8">
                <ArrowLink href="/portfolio">See all work</ArrowLink>
              </div>
            </FadeUp>

            {/* The count, as architecture. Sits under the sticky column and
                gives the band a foot on desktop, where the copy is short and
                the right-hand stack is four screens long. */}
            <IndexMark
              value={pad(featuredWork.length)}
              className="mt-14 hidden text-[10rem] lg:block"
            />
          </div>
        </div>

        {/* --------------------------------------------------- The evidence */}
        <Stagger
          as="ul"
          stream
          className="flex flex-col gap-16 lg:col-span-7 lg:col-start-6 lg:gap-32"
        >
          {featuredWork.map((item, index) => (
            <StaggerItem key={item.job} as="li">
              <Parallax offset={index % 2 === 1 ? -10 : 10}>
                <figure
                  className={`w-full ${placement[index % placement.length]}`}
                  /*
                    The resolution ceiling, applied as a style rather than a
                    class because it is data: it is the file's own width, and a
                    Tailwind class would be a number somebody could later
                    "tidy up" without knowing what it was protecting.
                  */
                  style={{ maxWidth: `${item.image.width}px` }}
                >
                  <FadeIn>
                    <div
                      className={`${mediaFrame} shadow-[0_24px_60px_-34px_rgba(38,34,54,0.55)]`}
                      /*
                        Each piece keeps its own proportions rather than being
                        cropped to a house ratio. Four identical crops would put
                        the tiles back however much the widths varied — and on
                        files this small, a crop throws away pixels there is no
                        supply of.
                      */
                      style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}
                    >
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(min-width: 1024px) 46vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </FadeIn>

                  <figcaption className="mt-5 border-t border-paper-400 pt-4">
                    <div className="flex items-baseline gap-3">
                      <IndexMark value={pad(index + 1)} variant="rule" />
                      <span className="font-sans text-eyebrow font-semibold uppercase text-ink-400">
                        {item.client ?? item.sector}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-heading-lg font-normal text-ink-800">
                      {item.job}
                    </h3>

                    <p className="mt-2 max-w-[46ch] text-body-sm text-ink-500">{item.detail}</p>
                  </figcaption>
                </figure>
              </Parallax>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

export default PortfolioPreview;
