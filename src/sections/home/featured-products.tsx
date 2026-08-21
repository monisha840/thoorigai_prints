import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/layout/section';
import { Float, MouseParallax, MouseParallaxLayer, Stagger, StaggerItem } from '@/components/motion';
import { pointer } from '@/lib/theme/animations';
import { featuredProducts } from '@/content/home';
import { FeatherWatermark } from '@/components/ui/feather';
import { IndexMark } from '@/components/ui/editorial';
import { pad } from '@/lib/utils';
import { ArrowLink, SectionIntro, band, mediaFrame, mediaZoom } from './shared';

/**
 * The catalogue — MASTER_PROJECT_PLAN.md §6.2 section 5.
 *
 * ## What this used to be, and why it changed
 *
 * Eight identical tiles on an even four-column grid: 2px navy border, 4:5 crop,
 * white ground, label, sentence. Eight of anything at one size is a contact
 * sheet, and a contact sheet is a document you scan rather than one you read —
 * the eye finds no entry point, so it takes the first tile, checks that the
 * seventh looks the same, and leaves. That is a catalogue website, and it is
 * precisely the impression this business should not give.
 *
 * The eight items are now a **composition**. One twelve-column field, and every
 * piece has its own span, its own crop and its own vertical offset:
 *
 *   01  seven columns, 4:3, bleeding off the left edge      ← the lead
 *   02  five columns, 3:4, dropped 96px
 *   03  04  05  three across at four columns, three different crops and
 *              three different drops, so the row never reads as a row
 *   06  five columns, 4:3
 *   07  seven columns, 16:10, bleeding off the right edge
 *   08  six columns, centred at column four, with white space either side
 *
 * Nothing is the same size as anything else, and the vertical offsets mean no
 * two captions ever line up. The grid is still there — it has to be, or the
 * page could not hold eight photographs — but it has stopped being visible,
 * which is the whole difference between a layout and a template.
 *
 * ## The honey ground became a plane, not a band
 *
 * The yellow press grid used to fill this section edge to edge, which forced
 * every caption onto a white card so the type could survive the rule lines.
 * Cards were the price of the ground. It is now a large panel *behind* the
 * composition: the same device, at the same weight, doing the job it is good at
 * — depth — while the copy sits on clean paper and needs no container at all.
 *
 * ## Two rules from the plan survive intact
 *
 * **The copy gate (§5.8).** A piece renders only with a description. Every one
 * below carries a sentence, or it does not appear.
 *
 * **The mobile grid (§2.3).** Catalogue pieces stay **2-up on mobile**, never
 * 1-up — with 43 items in the range, a single column hides the breadth that is
 * one of this business's real strengths. The lead and the closing piece take
 * both columns, which gives even the phone layout an opening and a full stop.
 */

/**
 * The composition, one entry per piece.
 *
 * It is a table rather than a formula because a formula would produce a
 * pattern, and a pattern is what this section exists to break. `sizes` is
 * derived from `span` by hand — it has to be, or the browser fetches a
 * four-column image for a seven-column slot.
 */
const composition = [
  {
    span: 'col-span-2 lg:col-span-7',
    ratio: 'aspect-[4/3]',
    drop: '',
    edge: 'start',
    sizes: '(min-width: 1024px) 56vw, 92vw',
  },
  {
    span: 'col-span-1 lg:col-span-5',
    ratio: 'aspect-[3/4]',
    drop: 'lg:mt-24',
    edge: null,
    sizes: '(min-width: 1024px) 40vw, 45vw',
  },
  {
    span: 'col-span-1 lg:col-span-4',
    ratio: 'aspect-square',
    drop: 'lg:mt-16',
    edge: null,
    sizes: '(min-width: 1024px) 31vw, 45vw',
  },
  {
    span: 'col-span-1 lg:col-span-4',
    ratio: 'aspect-[4/5]',
    drop: 'lg:mt-40',
    edge: null,
    sizes: '(min-width: 1024px) 31vw, 45vw',
  },
  {
    span: 'col-span-1 lg:col-span-4',
    ratio: 'aspect-[3/4]',
    drop: 'lg:mt-20',
    edge: null,
    sizes: '(min-width: 1024px) 31vw, 45vw',
  },
  {
    span: 'col-span-1 lg:col-span-5',
    ratio: 'aspect-[4/3]',
    drop: 'lg:mt-8',
    edge: null,
    sizes: '(min-width: 1024px) 40vw, 45vw',
  },
  {
    span: 'col-span-1 lg:col-span-7',
    ratio: 'aspect-[16/10]',
    drop: 'lg:mt-28',
    edge: 'end',
    sizes: '(min-width: 1024px) 56vw, 45vw',
  },
  {
    span: 'col-span-2 lg:col-span-6 lg:col-start-4',
    ratio: 'aspect-[3/2]',
    drop: 'lg:mt-16',
    edge: null,
    sizes: '(min-width: 1024px) 48vw, 92vw',
  },
] as const;

export function FeaturedProducts() {
  return (
    <Section
      id="products"
      tone="paper"
      spacing="none"
      className={`relative isolate overflow-hidden ${band}`}
      aria-labelledby="products-heading"
    >
      {/*
        The honey plane. Drawn in CSS rather than shipped as the reference
        bitmap: the cell size responds to the viewport, it stays crisp at any
        density, and it costs no request. It is masked at the foot so the panel
        dissolves into the paper instead of ending on a hard line, and the
        photographs above overlap it — which is what makes the section have a
        front and a back rather than a single surface.
      */}
      <span
        aria-hidden
        className="honey-grid honey-fade-b absolute -right-10 top-[26rem] -z-10 hidden h-[34rem] w-[72%] rounded-[2px] bg-honey-300 sm:block lg:top-[30rem] lg:h-[46rem] lg:w-[64%]"
      />

      <FeatherWatermark
        tilt={-24}
        className="-left-12 top-24 -z-10 h-64 text-ink-800/[0.06] lg:h-96"
      />

      <SectionIntro
        id="products-heading"
        eyebrow="The catalogue"
        heading="Forty-three products, made to order"
        standfirst="From a hundred business cards to a rigid box programme across six stores. Eight of the range below; the rest sit under the discipline that makes them."
        action={<ArrowLink href="/products">See the full catalogue</ArrowLink>}
      />

      {/*
        `items-start` is load-bearing: it is what lets each piece keep its own
        vertical offset instead of being stretched to its row. Without it the
        `lg:mt-*` drops would still apply but every piece in a row would end at
        the same baseline, and the composition would collapse back into a grid.
      */}
      <Stagger
        as="ul"
        stream
        className="mt-16 grid grid-cols-2 items-start gap-x-5 gap-y-14 sm:gap-x-8 lg:mt-24 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-4"
      >
        {featuredProducts.map((item, index) => {
          const place = composition[index % composition.length];

          return (
            <StaggerItem key={item.name} as="li" className={place.span}>
              {/*
                The one place on the site that floats. `index` desynchronises
                the composition — eight sheets rising together read as one
                object, not eight. Depth is held at 0.5: these are printed
                pieces resting on air, not balloons. Off below `md` entirely.
              */}
              <Float index={index} depth={0.5}>
                <article className="group relative">
                  {/*
                    The pointer field is scoped to the piece and set to the
                    media range, so the photograph answers the cursor by a few
                    pixels while the piece itself stays put (§9.3).
                  */}
                  <MouseParallax range={pointer.mediaRange}>
                    <div
                      className={`${mediaFrame} ${place.ratio} shadow-[0_18px_44px_-28px_rgba(38,34,54,0.5)] ${
                        place.edge === 'start'
                          ? '-ml-5 sm:-ml-8 lg:-ml-12 xl:-ml-20'
                          : place.edge === 'end'
                            ? '-mr-5 sm:-mr-8 lg:-mr-12 xl:-mr-20'
                            : ''
                      }`}
                    >
                      <MouseParallaxLayer depth={0.6} className="absolute inset-0 scale-[1.06]">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          sizes={place.sizes}
                          className={`object-cover ${mediaZoom}`}
                        />
                      </MouseParallaxLayer>
                    </div>
                  </MouseParallax>

                  {/* Caption on paper, under the piece. No container, no border
                      but the hairline that separates it from the photograph. */}
                  <div className="mt-5 border-t border-paper-400 pt-4">
                    <div className="flex items-baseline gap-3">
                      <IndexMark value={pad(index + 1)} variant="rule" />
                      <span className="font-sans text-eyebrow font-semibold uppercase text-ink-400">
                        {item.pillar}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-heading-lg font-normal text-ink-800">
                      <Link
                        href={item.href}
                        className="rounded-[2px] after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
                      >
                        {item.name}
                      </Link>
                    </h3>

                    {/* The gate: no description, no piece. */}
                    <p className="mt-2 max-w-[42ch] text-body-sm text-ink-500">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Float>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

export default FeaturedProducts;
