import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/layout/section';
import {
  Float,
  MouseParallax,
  MouseParallaxLayer,
  Stagger,
  StaggerItem,
} from '@/components/motion';
import { pointer } from '@/lib/theme/animations';
import { featuredProducts } from '@/content/home';
import { FeatherWatermark } from '@/components/ui/feather';
import { ArrowLink, SectionIntro, band, mediaFrame, mediaZoom } from './shared';

/**
 * Featured products — MASTER_PROJECT_PLAN.md §6.2 section 5, "Catalogue preview".
 * Eight tiles drawn from the 43 catalogue items.
 *
 * Two rules from the plan are load-bearing here.
 *
 * The copy gate (§5.8): a tile renders only with a description. The whole
 * charge against the live site is that "every product is a photograph with a
 * two-word label" — 4:5 media plus an H4 and nothing else. Every tile below
 * carries a sentence, or it does not appear.
 *
 * The mobile grid (§2.3): catalogue tiles stay **2-up on mobile**, never 1-up.
 * With 43 items a single-column grid produces an unscrollable page and hides
 * the breadth of the catalogue, which is one of the business's real strengths.
 */
export function FeaturedProducts() {
  /*
    The band ground is the honey grid, drawn in CSS rather than shipped as the
    reference bitmap: the cell size responds to the viewport, it stays crisp at
    any density, and it costs no request. `isolate` creates the stacking
    context so the feather watermark sits under the cards without needing a
    z-index on every tile.
  */
  return (
    <Section
      id="products"
      tone="paper"
      spacing="none"
      className={`honey-grid relative isolate overflow-hidden bg-honey-300 ${band}`}
      aria-labelledby="products-heading"
    >
      <FeatherWatermark
        tilt={-24}
        className="-left-12 top-10 h-64 text-ink-800/[0.07] lg:h-96"
      />

      <SectionIntro
        id="products-heading"
        eyebrow="The catalogue"
        heading="Forty-three products, made to order"
        standfirst="From a hundred business cards to a rigid box programme across six stores. Eight of the range below; the rest sit under the discipline that makes them."
        action={<ArrowLink href="/products">See the full catalogue</ArrowLink>}
      />

      <Stagger
        as="ul"
        stream
        className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:mt-20 lg:grid-cols-4"
      >
        {featuredProducts.map((item, index) => (
          <StaggerItem key={item.name} as="li" className="h-full">
            {/*
              The catalogue tiles are the one place on the site that floats.
              `index` desynchronises the row — eight sheets rising together read
              as one object, not eight. Depth is held at 0.6: these are printed
              pieces resting on air, not balloons.
            */}
            <Float index={index} depth={0.6} className="h-full">
              {/*
                Card type 1 — the workhorse. Sheet on the desk, not a floating
                panel. The pointer field is scoped to the card and set to the
                media range, so the photograph inside answers the cursor by a
                few pixels while the card itself stays put.
              */}
              <MouseParallax
                as="article"
                range={pointer.mediaRange}
                className="group relative flex h-full flex-col overflow-hidden rounded-[4px] border-2 border-navy bg-paper-50 shadow-sheet motion-lift hover:-translate-y-0.5 hover:border-indigo-700 hover:shadow-lifted"
              >
                <div className={`${mediaFrame} aspect-[4/5]`}>
                  <MouseParallaxLayer depth={0.6} className="absolute inset-0 scale-[1.06]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className={`object-cover ${mediaZoom}`}
                    />
                  </MouseParallaxLayer>
                </div>

                {/* Padding starts below the media — §11.1. 16px mobile, 24px desktop. */}
                <div className="flex flex-1 flex-col p-4 lg:p-6">
                  <span className="font-sans text-eyebrow font-semibold uppercase text-gold-700">
                    {item.pillar}
                  </span>

                  <h3 className="mt-2 font-sans text-heading-md font-semibold tracking-tight text-ink-800">
                    <Link
                      href={item.href}
                      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
                    >
                      {item.name}
                    </Link>
                  </h3>

                  {/* The gate: no description, no tile. */}
                  <p className="mt-2 text-body-sm text-ink-500">{item.description}</p>
                </div>
              </MouseParallax>
            </Float>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export default FeaturedProducts;
