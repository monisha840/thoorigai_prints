import { ArrowDown } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { FadeUp, Parallax, Stagger, StaggerItem } from '@/components/motion';
import { PrintPlate } from '@/components/ui/print-plate';
import { images } from '@/lib/images';
import { projects } from '@/lib/portfolio';
import { siteConfig } from '@/lib/site';
import { pad } from '@/lib/utils';

/**
 * The portfolio opener.
 *
 * An editorial split rather than a full-bleed banner, because nothing in this
 * library is big enough to carry a 2560px hero honestly — the largest usable
 * file is 2447px square and the rest sit under 1000px. Three mounted plates at
 * their real size look considered; one small file stretched across the viewport
 * looks broken. The constraint sets the layout.
 */

/**
 * All three are zero-padded so the row reads as a set rather than as three
 * unrelated numbers — `08 / 09 / 09`, the way a colophon sets a figure.
 *
 * The binding count is the same nine formats claimed by the binding service in
 * `src/lib/content.ts`. If that changes, change it here too.
 */
const credentials = [
  { value: pad(projects.length), label: 'Selected jobs' },
  { value: pad(9), label: 'Binding formats in house' },
  {
    value: pad(new Date().getFullYear() - siteConfig.founded),
    label: 'Years on the floor',
  },
];

export function PortfolioHero() {
  return (
    <section className="paper-grain relative overflow-hidden pt-32 pb-16 sm:pt-40 md:pb-24 lg:pt-48 lg:pb-28">
      {/* A single warm bloom behind the type. Keeps the paper from reading flat. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-24 size-[38rem] rounded-full bg-gold-200/25 blur-3xl"
      />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* ------------------------------------------------ Type column */}
          <div className="lg:col-span-6 xl:col-span-5">
            <FadeUp immediate>
              <span className="inline-flex items-center gap-2.5 font-sans text-eyebrow font-medium uppercase text-gold-600">
                <span aria-hidden className="h-px w-6 bg-gold-600/50" />
                Portfolio &middot; 2023&ndash;2025
              </span>
            </FadeUp>

            <FadeUp immediate delay={0.08} className="mt-6">
              <h1 className="font-display text-display-xl font-normal text-ink-800">
                Work, as it left the <span className="text-foil">building</span>.
              </h1>
            </FadeUp>

            <FadeUp immediate delay={0.16} className="mt-7">
              <p className="measure text-body-lg text-ink-500">
                Photographed as delivered - no renders and no mock-ups. Each entry names the
                process, the stock and the finish, so you can judge whether it is the right
                reference for your job.
              </p>
            </FadeUp>

            <Stagger
              immediate
              delay={0.26}
              as="ul"
              className="mt-12 grid grid-cols-3 gap-6 border-t border-paper-400 pt-8"
            >
              {credentials.map((item) => (
                <StaggerItem key={item.label} as="li">
                  <span className="block font-display text-display-sm tabular-nums text-ink-800">
                    {item.value}
                  </span>
                  <span className="mt-1.5 block text-caption text-ink-400">{item.label}</span>
                </StaggerItem>
              ))}
            </Stagger>

            <FadeUp immediate delay={0.36} className="mt-10">
              <a
                href="#work"
                className="group inline-flex items-center gap-3 text-body-sm font-medium text-ink-600 motion-tint hover:text-ink-900"
              >
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-full border border-paper-500 motion-tint group-hover:border-ink-800 group-hover:bg-ink-800 group-hover:text-paper-100"
                >
                  <ArrowDown className="size-4" strokeWidth={1.5} />
                </span>
                Browse the work
              </a>
            </FadeUp>
          </div>

          {/* --------------------------------------------- Image cluster */}
          <div className="lg:col-span-6 lg:col-start-7 xl:col-span-7">
            {/*
              Two columns drifting against each other. `Parallax` clamps the
              travel to the house ceiling and switches itself off below `lg`
              and under reduced motion, so the offsets here are a preference,
              not a promise.
            */}
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Left: one tall plate, the anchor of the cluster. */}
              <Parallax offset={-14} className="w-[57%] shrink">
                <div className="group">
                  <PrintPlate
                    image={images.rigidBoxConstructions}
                    ratio="portrait"
                    sizes="(min-width: 1024px) 32vw, 56vw"
                    priority
                    marks
                  />
                </div>
              </Parallax>

              {/* Right: two stacked, dropped down so the columns never align. */}
              <Parallax offset={14} className="w-[43%] shrink">
                <div className="flex flex-col gap-3 pt-10 sm:gap-4 sm:pt-16">
                  <div className="group">
                    <PrintPlate
                      image={images.boardBookSpread}
                      ratio="square"
                      sizes="(min-width: 1024px) 23vw, 40vw"
                      priority
                    />
                  </div>
                  <div className="group">
                    <PrintPlate
                      image={images.studioRange}
                      ratio="landscape"
                      sizes="(min-width: 1024px) 23vw, 40vw"
                    />
                  </div>
                </div>
              </Parallax>
            </div>

            <p className="mt-6 flex items-center gap-2.5 text-caption text-ink-400">
              <span aria-hidden className="h-px w-5 bg-paper-500" />
              Rigid box range, board book, studio shelf
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default PortfolioHero;
