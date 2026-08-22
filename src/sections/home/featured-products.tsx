import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/layout/section';
import { MouseParallax, MouseParallaxLayer, Stagger, StaggerItem } from '@/components/motion';
import { pointer } from '@/lib/theme/animations';
import { featuredProducts } from '@/content/home';
import { FeatherWatermark } from '@/components/ui/feather';
import { IndexMark } from '@/components/ui/editorial';
import { pad } from '@/lib/utils';
import { ArrowLink, SectionIntro, band, mediaFrame, mediaZoom } from './shared';

/**
 * The catalogue - MASTER_PROJECT_PLAN.md §6.2 section 5.
 *
 * ## An even grid, and why it went back to being one
 *
 * This was a deliberately irregular composition: eight pieces on a twelve-column
 * field, each with its own span, its own crop, its own vertical offset, two of
 * them bleeding off the page edges, and every tile bobbing on `Float` at its own
 * phase. The reasoning was that eight tiles at one size is a contact sheet.
 *
 * It did not survive contact with the photographs. Three faults, and they
 * compounded:
 *
 * **The crops butchered the products.** Eight ratios from 3:4 to 16:10 applied
 * with `object-cover` to product shots framed tight in their own files. The
 * certificate was cropped to 4:5 portrait, which took half its width and cut
 * the word CERTIFICATE down to "TE"; the business cards, square in a square
 * frame, showed mostly the grey backdrop. A catalogue that cannot show its
 * products is not a catalogue.
 *
 * **The tiles could never line up, by construction.** `Float` gives each piece
 * a continuous 10px rise and 0.6° turn, desynchronised by index specifically so
 * no two move together. Under that, plus per-item `lg:mt-*` drops of 8 to 40,
 * "aligned" was not a state the section could ever be in.
 *
 * **The honey plane surfaced between the pieces.** With tiles at eight
 * different heights the panel behind them was exposed in the gaps, so a device
 * meant to read as depth read as a stray yellow rectangle.
 *
 * So: one ratio, one size, no drops, no bleeds, no float. Two columns on a
 * phone, four from `lg`, and eight items divide evenly into both. Every
 * photograph sits in the same 4:3 frame, so every image edge, every index mark
 * and every product name lands on the same line across a row. The variety this
 * section needs comes from the photographs, which have plenty, rather than from
 * the frames around them.
 *
 * ## Two rules from the plan survive intact
 *
 * **The copy gate (§5.8).** A piece renders only with a description. Every one
 * below carries a sentence, or it does not appear.
 *
 * **The mobile grid (§2.3).** Catalogue pieces stay **2-up on mobile**, never
 * 1-up - with 43 items in the range, a single column hides the breadth that is
 * one of this business's real strengths.
 */

/**
 * One frame for all eight.
 *
 * 4:3 is the shape that costs the set least. The eight photographs run from 1:1
 * (business cards, paper bags) to 1.83:1 (brochures), and against that spread
 * 4:3 crops at worst 27% off the width of the widest and 25% off the height of
 * the squarest - where 3:2 would take a third of the height off both square
 * ones, and 5:4 a third of the width off the brochures.
 *
 * All of them carry a margin of backdrop around the product, which is what the
 * crop eats first. Each one was checked against the tile it produces.
 */
const TILE_RATIO = 'aspect-[4/3]';

/**
 * Two columns, then four.
 *
 * Written once here rather than per item. `sizes` follows from it: a quarter of
 * the container at `lg` and above, just under half below it, which is what the
 * grid actually gives each tile once the gutters are taken out.
 */
const TILE_SIZES = '(min-width: 1024px) 23vw, 45vw';

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
        The honey plane is gone from this section, and there is no position left
        for it here.

        Behind the grid - where it was - a panel can only be seen through the
        gutters, so on an even grid it reads as yellow stripes between the
        photographs rather than as a ground. Moved up behind the intro it clears
        the tiles but lands under "See the full catalogue", which is the one
        thing in this section a visitor is meant to click.

        The section does not need it. Eight product photographs carry more
        colour than any panel, and the yellow ground still does its job in the
        sections that have room for a plane rather than a grid.
      */}

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
        `items-start` keeps each piece its natural height instead of stretching
        it to the tallest in its row: descriptions run to one line or two, and a
        stretched tile would put a band of empty paper under the short ones. The
        tops are what have to align, and they do - every tile opens with the
        same 4:3 frame.
      */}
      <Stagger
        as="ul"
        stream
        className="mt-16 grid grid-cols-2 items-start gap-x-5 gap-y-12 sm:gap-x-8 lg:mt-24 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16"
      >
        {featuredProducts.map((item, index) => (
          <StaggerItem key={item.name} as="li">
            <article className="group relative">
              {/*
                The pointer field is scoped to the piece and set to the media
                range, so the photograph answers the cursor by a few pixels
                while the frame itself stays exactly where the grid put it
                (§9.3). That is the one bit of movement this section keeps: it
                moves the picture inside the tile, never the tile.
              */}
              <MouseParallax range={pointer.mediaRange}>
                <div
                  className={`${mediaFrame} ${TILE_RATIO} shadow-[0_14px_36px_-26px_rgba(38,34,54,0.45)]`}
                >
                  {/*
                    Overscan, so the drift never exposes the frame's edge. 1.04
                    rather than 1.06: the layer travels `pointer.mediaRange` ×
                    0.6, which is 4.8px, and on a tile this size 4% is already
                    three times that. The two points it gives back are two
                    points less crop on photographs that have none to spare -
                    the certificates lose the C off CERTIFICATE at 1.06.
                  */}
                  <MouseParallaxLayer depth={0.6} className="absolute inset-0 scale-[1.04]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes={TILE_SIZES}
                      className={`object-cover ${mediaZoom}`}
                    />
                  </MouseParallaxLayer>
                </div>
              </MouseParallax>

              {/* Caption on paper, under the piece. No container, no border
                  but the hairline that separates it from the photograph. */}
              <div className="mt-4 border-t border-paper-400 pt-3.5">
                <div className="flex items-baseline gap-3">
                  <IndexMark value={pad(index + 1)} variant="rule" />
                  <span className="font-sans text-eyebrow font-semibold uppercase text-ink-400">
                    {item.pillar}
                  </span>
                </div>

                <h3 className="mt-2.5 font-display text-heading-md font-normal text-ink-800">
                  <Link
                    href={item.href}
                    className="rounded-[2px] after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
                  >
                    {item.name}
                  </Link>
                </h3>

                {/* The gate: no description, no piece. */}
                <p className="mt-1.5 text-body-sm text-ink-500">{item.description}</p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export default FeaturedProducts;
