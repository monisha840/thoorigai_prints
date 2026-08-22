import { ArrowUpRight, Phone } from 'lucide-react';

import { Section } from '@/components/layout/section';
import { FadeUp } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { FeatherWatermark } from '@/components/ui/feather';
import { Heading } from '@/components/ui/heading';
import { primaryCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { toTelHref } from '@/lib/utils';

/**
 * The closing block. Every page ends on one, so a visitor always has somewhere
 * to go from the bottom of the scroll.
 *
 * ## The ground
 *
 * Four ink bands closing four pages, all previously flat. Flat is the correct
 * default for a band carrying body copy; it is the wrong one for the band that
 * exists purely to be acted on, because a page whose most important element is
 * also its plainest has buried the lede.
 *
 * The depth here is three layers and no images:
 *
 * 1. A drifting feather at 4% — the mark's own motif, the same ornament the
 *    hero, the catalogue band and the footer carry. It moves on an 11-second
 *    cycle, which is slow enough that you notice the band is alive without ever
 *    catching it in the act.
 * 2. Two radial washes, one bronze at the top-left and one press-blue at the
 *    bottom-right, sized in `rem` so they scale with the type rather than with
 *    the viewport. They are what stop `ink-900` reading as a black rectangle.
 * 3. A hairline grid at 3%, fading out downward, so the plate has a surface for
 *    the light to fall on.
 *
 * All three are CSS gradients and one SVG. No request, no bitmap, no bytes past
 * the stylesheet — and nothing that can shift the layout, because every layer is
 * absolutely positioned inside a section that already reserves its own height.
 *
 * ## The palette
 *
 * Unchanged. `ink-900` ground, `gold-500` accent, `indigo` in the wash. The
 * washes sit at 6% and 5% alpha, which is under the threshold where either
 * would start to read as a colour of its own rather than as light on ink.
 */

export interface CtaSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function CtaSection({
  eyebrow = 'Get started',
  title = 'Tell us what you need printed.',
  description = 'Send the format, the quantity and the date you need it by. You will get a real answer - including when we are not the right press for the job.',
}: CtaSectionProps) {
  return (
    <Section tone="ink" spacing="lg" divided className="relative isolate overflow-hidden">
      {/* Layer 3 — the surface. A fine rule grid, faded out before it reaches
          the buttons so it never sits behind a label. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.045] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:3.25rem_3.25rem] [mask-image:linear-gradient(to_bottom,#000_0%,transparent_78%)]"
      />

      {/* Layer 2 — the light. Bronze arriving top-left, press blue answering
          bottom-right, so the plate has a direction. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(46rem_26rem_at_6%_-8%,rgba(193,133,70,0.16),transparent_62%),radial-gradient(38rem_24rem_at_104%_112%,rgba(52,79,124,0.20),transparent_60%)]"
      />

      {/* Layer 1 — the mark, drifting. Hidden below `sm` by the component. */}
      <FeatherWatermark
        tilt={12}
        className="-right-14 -top-8 -z-10 h-72 text-paper-100/[0.045] lg:h-[24rem]"
      />

      <FadeUp className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <Heading
          level={2}
          size="display-lg"
          eyebrow={eyebrow}
          description={description}
          inverted
          className="measure-tight"
        >
          {title}
        </Heading>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <Button href={primaryCta.href} variant="accent" size="lg" iconAfter={<ArrowUpRight />}>
            {primaryCta.label}
          </Button>
          <Button
            href={toTelHref(siteConfig.contact.phone)}
            variant="ghost"
            size="lg"
            icon={<Phone />}
            className="text-paper-200/80 hover:bg-paper-100/8 hover:text-paper-50"
          >
            {siteConfig.contact.phone}
          </Button>
        </div>
      </FadeUp>
    </Section>
  );
}

export default CtaSection;
