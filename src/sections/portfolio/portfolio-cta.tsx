import { ArrowUpRight, Phone } from 'lucide-react';
import Image from 'next/image';

import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { PrintPlate } from '@/components/ui/print-plate';
import { images } from '@/lib/images';
import { primaryCta } from '@/lib/navigation';
import { floorFrames } from '@/lib/portfolio';
import { siteConfig } from '@/lib/site';
import { pad, toTelHref } from '@/lib/utils';

/**
 * The closing band.
 *
 * A portfolio-specific CTA rather than the shared one, because the shared
 * version is type on a flat ink field and this page has spent its whole length
 * arguing visually. Closing on a photograph keeps that argument going to the
 * last pixel.
 *
 * The backdrop is the most brand-neutral image in the library, held at low
 * opacity under a heavy scrim — `docs/image-usage-guide.md` calls for 55–65%
 * before any text goes over it, and its gradients band badly at full strength.
 */
export function PortfolioCta() {
  return (
    <Section tone="ink" spacing="lg" divided bleed className="overflow-hidden">
      {/* ------------------------------------------------------ Backdrop */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src={images.paperRollPlinths.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <span className="absolute inset-0 bg-gradient-to-br from-ink-950/85 via-ink-950/75 to-indigo-950/80" />
      </div>

      <Container className="relative">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <FadeUp>
              <span className="inline-flex items-center gap-2.5 font-sans text-eyebrow font-medium uppercase text-gold-300">
                <span aria-hidden className="h-px w-6 bg-gold-300/50" />
                Reference a job
              </span>
            </FadeUp>

            <FadeUp delay={0.08} className="mt-6">
              <h2 className="measure-tight font-display text-display-lg text-paper-100">
                Seen something close to what you need?
              </h2>
            </FadeUp>

            <FadeUp delay={0.16} className="mt-6">
              <p className="measure text-body-lg text-paper-100/70">
                Point us at the piece and tell us what should change &mdash; the stock, the size,
                the finish, the run. Matching an existing job is the fastest route to an accurate
                quote.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.24} className="lg:shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        </div>

        {/* ------------------------------------------- Route a job takes */}
        <Stagger
          as="ol"
          className="mt-20 grid gap-6 border-t border-paper-100/12 pt-12 sm:grid-cols-3"
        >
          {floorFrames.map((frame, index) => (
            <StaggerItem key={frame.id} as="li" className="group">
              <PrintPlate
                image={frame.image}
                ratio="landscape"
                sizes="(min-width: 640px) 30vw, 92vw"
                tone="ink"
              />
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-caption tabular-nums text-gold-300/70">
                  {pad(index + 1)}
                </span>
                <div className="min-w-0">
                  <h3 className="text-body-sm font-medium text-paper-100">{frame.caption}</h3>
                  <p className="mt-0.5 text-caption text-paper-100/50">{frame.detail}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default PortfolioCta;
