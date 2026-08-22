import { Section } from '@/components/layout/section';
import { FadeLeft, FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { Heading } from '@/components/ui/heading';
import { PrintPlate } from '@/components/ui/print-plate';
import { images } from '@/lib/images';
import { studioStats } from '@/lib/site';

/**
 * The studio narrative — a two-column spread with the copy leading and the
 * image alongside, plus the numbers underneath.
 *
 * ## On the copy
 *
 * Every claim in the three paragraphs below is one the site already makes
 * elsewhere and can stand behind: the 2017 founding date and the Royapettah
 * address from `siteConfig`, the six disciplines and nine binding formats from
 * `services` in `lib/content.ts`, the in-house finishing from the same place.
 *
 * This block used to close on a fourth paragraph admitting it was placeholder
 * copy — on the About page, which is the page a visitor opens precisely to
 * decide whether the business is real. What is genuinely still outstanding is
 * the studio's own history, the team, and the machine list; none of that can be
 * written without the owners, and none of it is missed by a reader who is not
 * told it is missing. It is tracked in `WEBSITE_COMPLETENESS_REPORT.md` instead.
 *
 * `studioStats` underneath is a separate matter: four figures that still need
 * confirming with the studio before launch. See the note in `lib/site.ts`.
 */
export function StudioStory() {
  return (
    <Section tone="raised" spacing="lg" divided>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <FadeUp>
            <Heading level={2} size="display-md" eyebrow="The studio">
              A printing house, not a print shop.
            </Heading>
          </FadeUp>

          <FadeUp delay={0.08} className="mt-8 flex flex-col gap-5 text-body-lg text-ink-500">
            <p>
              Thoorigai Prints has run out of Royapettah, Chennai since 2017. What began as a
              digital press has grown into a floor that handles offset, packaging and nine binding
              formats without sending a single stage out of the building.
            </p>
            <p>
              That matters more than it sounds. Most print problems are handover problems - a file
              that changed between prepress and plate, a finish that was specified for a different
              stock, a delivery date that slipped while a job sat in someone else&rsquo;s queue. Keeping
              every stage in one place removes the gaps where those failures live.
            </p>
            <p>
              What that looks like on the floor is two press processes, nine binding formats, and a
              finishing line - foiling, spot UV, lamination, die-cutting - that never has to queue
              behind another studio&rsquo;s work. A file that arrives on Monday can be preflighted,
              proofed, printed, bound, packed and counted without once leaving the building.
            </p>
          </FadeUp>
        </div>

        {/*
          Two plates stacked rather than one tall one: the library has no
          portrait-format floor photograph, and cropping a wide group shot to
          3:4 cuts the ends off it. A pair fills the column at their true
          proportions and says more — what the floor produces, and the check
          that keeps colour steady while it does.

          Deliberately *not* a press-hall photograph. The two in the library are
          a Heidelberg press-release render and a factory line of unverified
          origin; either one under this copy would claim a floor we cannot show.
          Output is the honest evidence, and it is verifiably theirs.
        */}
        <FadeLeft delay={0.12} className="lg:col-span-5 lg:col-start-8">
          <figure className="group flex flex-col gap-4">
            <PrintPlate
              image={images.studioRange}
              ratio="landscape"
              sizes="(min-width: 1024px) 40vw, 92vw"
              marks
            />
            <PrintPlate
              image={images.pressOperatorCheck}
              ratio="landscape"
              sizes="(min-width: 1024px) 40vw, 92vw"
            />
            <figcaption className="flex items-center gap-2.5 text-caption text-ink-400">
              <span aria-hidden className="h-px w-5 bg-paper-500" />
              The range, and a sheet checked against the proof
            </figcaption>
          </figure>
        </FadeLeft>
      </div>

      <Stagger
        as="ul"
        className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-paper-400 pt-12 md:grid-cols-4"
      >
        {studioStats.map((stat) => (
          <StaggerItem key={stat.label} as="li">
            <span className="block font-display text-display-sm text-ink-800">{stat.value}</span>
            <span className="mt-2 block text-body-sm text-ink-400">{stat.label}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export default StudioStory;
