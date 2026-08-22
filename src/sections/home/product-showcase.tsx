import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import { Section } from '@/components/layout/section';
import { FadeUp, Float, Stagger, StaggerItem } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { FeatherWatermark } from '@/components/ui/feather';
import { quoteHref } from '@/lib/utils';
import { Eyebrow, bandDark, editorialButton } from './shared';

/**
 * Product showcase — one piece, shown big.
 *
 * The rest of the homepage works in grids of four and eight. This band does the
 * opposite: a single printed piece at display size on a dark ground, which is
 * the only way a label, a foil or a lamination actually reads on a screen. It
 * sits between the catalogue and the portfolio, where the visitor has just seen
 * breadth and needs one piece of depth.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ASSET FLAG — `showcase.image`
 *
 * `honey-label-jar.png` is the jar from the live homepage, placed here as
 * requested. It is **not** the studio's own work: `docs/image-inventory.md:210`
 * records it as demo content shipped with the purchased WordPress theme, and
 * the label carries a third party's real trading name, postal address and
 * website (Roar Honey NZ Limited, Auckland).
 *
 * Everything else in this file is asset-agnostic — the frame, the grid panel,
 * the glow and the copy are driven by the `showcase` object below, so pointing
 * it at a real job from `/img/catalogue` or `/img/work` is a one-object change
 * and nothing about the layout moves.
 * ─────────────────────────────────────────────────────────────────────────
 */

const showcase = {
  eyebrow: 'Label & packaging',
  heading: 'Printed, laminated, and finished to the shelf.',
  body: 'A wraparound label is the hardest thing a press is asked to do - flat colour that has to hold across a curve, small type that has to stay legible at 6pt, and a varnish that has to survive a cold shelf. This is the work the studio is built around.',
  image: {
    src: '/img/showcase/honey-label-jar.png',
    alt: 'A honey jar with a full wraparound printed label - front panel, ingredients panel and nutrition panel',
    width: 1200,
    height: 1000,
  },
  /** Real capabilities, all of them already claimed elsewhere on the site. */
  specs: [
    'Wraparound labels',
    'Food-grade stocks',
    'Matt & gloss lamination',
    'Spot UV & foil',
    'Die-cut to shape',
    'Short and long runs',
  ],
} as const;

export function ProductShowcase() {
  return (
    <Section
      id="showcase"
      tone="indigo"
      spacing="none"
      className={`relative overflow-hidden ${bandDark}`}
      aria-labelledby="showcase-heading"
    >
      {/*
        The ground. A pool of lighter press-blue behind the jar rather than a
        flat fill — it is what separates the object from the band and gives the
        glass something to sit in.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_28%_38%,var(--color-indigo-700),transparent_70%)]"
      />

      <FeatherWatermark
        tilt={22}
        className="-right-16 top-8 h-72 text-gold-400/12 lg:-right-10 lg:h-[26rem]"
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ---------------------------------------------------------------
            The piece. Media first in the DOM on mobile: the photograph is the
            argument here, and the copy explains it afterwards.
           --------------------------------------------------------------- */}
        <FadeUp className="lg:col-span-6">
          <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
            {/*
              The honey grid, cropped to a panel behind the jar. It ties this
              band to the catalogue section and gives the transparent PNG a
              surface to stand on instead of floating in blue.
            */}
            <div
              aria-hidden
              className="honey-grid honey-fade-b absolute inset-x-4 bottom-8 top-10 rounded-[4px] bg-honey-300 opacity-90 sm:inset-x-10"
            />

            {/* Warm spill from the jar onto the panel. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(22rem_18rem_at_50%_58%,rgba(243,208,73,0.55),transparent_68%)] blur-2xl"
            />

            <Float depth={0.5} className="relative">
              <Image
                src={showcase.image.src}
                alt={showcase.image.alt}
                width={showcase.image.width}
                height={showcase.image.height}
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="relative h-auto w-full object-contain drop-shadow-[0_28px_45px_rgba(16,14,23,0.45)]"
              />
            </Float>
          </div>
        </FadeUp>

        {/* ---------------------------------------------------------------
            The copy.
           --------------------------------------------------------------- */}
        <div className="lg:col-span-5 lg:col-start-8">
          <FadeUp delay={0.1}>
            <Eyebrow tone="dark">{showcase.eyebrow}</Eyebrow>

            <h2
              id="showcase-heading"
              className="mt-3 max-w-[20ch] font-display text-display-sm font-normal text-paper-100"
            >
              {showcase.heading}
            </h2>

            <p className="mt-5 max-w-[54ch] text-body-lg text-paper-200/72">{showcase.body}</p>
          </FadeUp>

          <Stagger as="ul" className="mt-9 flex flex-wrap gap-2">
            {showcase.specs.map((spec) => (
              <StaggerItem key={spec} as="li">
                <span className="inline-flex items-center rounded-[2px] border border-paper-100/18 bg-paper-100/[0.06] px-3 py-1.5 text-body-sm text-paper-200/85">
                  {spec}
                </span>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeUp delay={0.2} className="mt-10">
            <Button
              href={quoteHref('labels', 'product')}
              size="lg"
              variant="accent"
              iconAfter={<ArrowUpRight />}
              className={editorialButton}
            >
              Quote a label run
            </Button>
          </FadeUp>
        </div>
      </div>
    </Section>
  );
}

export default ProductShowcase;
