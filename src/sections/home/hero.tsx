import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/container';
import {
  FadeIn,
  FadeUp,
  MouseParallax,
  MouseParallaxLayer,
  Reveal,
  Stagger,
  StaggerItem,
} from '@/components/motion';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/ui/count-up';
import { FeatherWatermark } from '@/components/ui/feather';
import { credibility, hero } from '@/content/home';
import { primaryCta } from '@/lib/navigation';
import { HeroShowcase } from './hero-showcase';
import { Eyebrow, editorialButton } from './shared';

/**
 * Home hero — MASTER_PROJECT_PLAN.md §6.2 sections 1 and 2.
 *
 * Editorial split: copy in the left half, one large photograph in the right.
 * The headline is server-rendered text, so it paints before any JavaScript
 * arrives; the photograph is `priority` and is the LCP element (§2.8 — LCP
 * under 2.0s on throttled 4G, and WebGL is never in the critical path).
 *
 * The media slot is `HeroShowcase`: five products on a stage with real depth,
 * one of them featured at a time, the feature advancing on a slow cycle so each
 * piece steps forward into the light and back out.
 *
 * It replaced, in order, a WebGL sequence, a single photograph, and two vertical
 * marquees. The marquee failed for a reason worth remembering: sixteen tiles at
 * one size on one plane have no subject, so it read as a gallery rather than as
 * a studio. Depth and hierarchy are what fixed it — one card dominant, the rest
 * behind it in Z — and it is CSS perspective rather than WebGL, so it costs
 * five images and no library.
 */
export function Hero() {
  return (
    /*
      Top padding is a flat 112px, not 176px growing to 176px.

      The navbar is fixed and 73px tall, so 176px of section padding left a
      103px void between the two — and pushed the CTAs to y=932 on a 1366×768
      screen, which is 164px below the fold. The buttons are the only thing in
      this section a visitor can act on; they do not belong below the fold on a
      laptop. 112px clears the navbar by 39px, which is air rather than a void,
      and it is the same at every width — the hero has no more room to spare on
      a large screen than on a small one, so there was never a reason for the
      padding to grow with the viewport.

      The last 16px of it is what puts the buttons above the fold at 1280×720,
      which missed by five pixels at 128px.
    */
    <section className="paper-grain relative overflow-hidden bg-paper-200 pt-28 pb-[4.5rem] lg:pb-[7.5rem]">
      {/* The mark's motif, at watermark strength behind the headline. */}
      <FeatherWatermark
        tilt={-16}
        className="-left-20 top-16 h-80 text-gold-600/[0.10] lg:h-[30rem]"
      />

      <Container className="relative">
        {/*
          The pointer field for the hero. Two planes: the copy leans very
          slightly against the cursor, the photograph drifts with it. The
          opposing directions are what produce the depth — both moving the same
          way would just read as the page sliding.

          Scoped to the grid rather than the viewport so the deflection is
          proportional to the composition, and inert on touch and under reduced
          motion, where it provides no context and the layers render flat.
        */}
        <MouseParallax className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy — six of twelve columns, the editorial split of §2.6 */}
          <MouseParallaxLayer depth={0.22} invert className="lg:col-span-6">
            <FadeUp immediate>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </FadeUp>

            {/*
              One H1. The live site has two competing ones, neither naming
              Chennai. Uncovered a line at a time through a clip-path window —
              the house signature, and the one place on the page where anything
              animates on load (§9.2, "nothing animates on page load except the
              hero"). Never character by character.
            */}
            {/*
              No `max-w` here. It carried `max-w-[20ch]` for most of this file's
              life, which never once applied: `ch` is the advance of "0" in
              Fraunces, and 20 of them at the display-xl clamp's ceiling is
              roughly 1050px against a grid column of about 624px. The column
              was always the binding constraint. Its only effect was to look
              like the thing controlling the line breaks, which sent the first
              investigation of the missing word in the wrong direction.
            */}
            <h1 className="mt-5 font-display text-display-xl font-normal text-ink-800">
              {hero.headline.map((line, i) => (
                <Reveal key={line} immediate delay={i * 0.1}>
                  {line}
                </Reveal>
              ))}
            </h1>

            <FadeUp immediate delay={0.34} className="mt-6">
              <p className="max-w-[68ch] text-body-lg text-ink-500">{hero.standfirst}</p>
            </FadeUp>

            {/*
              Primary is ink, not bronze. Ink on paper measures 14.21:1 and is
              the louder button on a light ground; the page's single bronze fill
              is spent on the closing CTA band, per §3.4.
            */}
            <FadeUp
              immediate
              delay={0.44}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                href={primaryCta.href}
                size="lg"
                iconAfter={<ArrowRight />}
                className={editorialButton}
                fullWidth
              >
                Get a quote
              </Button>
              <Button
                href="/portfolio"
                variant="secondary"
                size="lg"
                className={editorialButton}
                fullWidth
              >
                See our work
              </Button>
            </FadeUp>
          </MouseParallaxLayer>

          {/*
            Media bleeds through the 20px gutter on mobile and is contained from
            lg up — §2.6, "Mobile rules". Ratio is declared on both breakpoints
            so nothing shifts.

            The frame stays exactly where the layout put it and the photograph
            moves inside it — §9.3's rule for card media, and the same reason
            applies here: a frame that moves is a layout that moves. The 1.06
            scale is the overscan that keeps the frame's edges covered at full
            deflection; without it the drift exposes the background.
          */}
          <FadeIn immediate delay={0.2} className="lg:col-span-6">
            <HeroShowcase />
          </FadeIn>
        </MouseParallax>

        {/*
          Credibility strip — §6.2 section 2. Numbers only, no icons: icons make
          claims look like decoration. Every figure is verifiable from the audit.
        */}
        <Stagger
          as="ul"
          delay={0.55}
          immediate
          className="mt-[4.5rem] grid grid-cols-2 gap-x-8 gap-y-10 border-t border-paper-400 pt-10 lg:mt-[7.5rem] lg:grid-cols-4"
        >
          {credibility.map((fact, index) => (
            <StaggerItem key={fact.label} as="li">
              <CountUp
                figure={fact.figure}
                delay={index * 0.12}
                className="block font-display text-display-sm font-normal text-ink-800"
              />
              <span className="mt-2 block max-w-[24ch] text-body-sm text-ink-500">{fact.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export default Hero;
