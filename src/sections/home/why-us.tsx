import Image from 'next/image';

import { Section } from '@/components/layout/section';
import { FadeIn, FadeUp, Parallax, Stagger, StaggerItem } from '@/components/motion';
import { whyUs } from '@/content/home';
import { ArrowLink, Eyebrow, band, mediaFrame } from './shared';

/**
 * Why choose us — MASTER_PROJECT_PLAN.md §6.2 section 8, "Commitments".
 *
 * The four commitment headings and their sentences are retained from the live
 * homepage: the audit rated them "sound positioning with one usable sentence
 * each", so this is an editing job, not a rewriting one. Only the shouting
 * capitals and the doubled exclamation marks are gone.
 *
 * Laid out as the editorial split of §2.6 — six columns of media against six of
 * copy — with the commitments in a 2×2 separated by hairlines rather than
 * boxed into cards. Card type 4 in the design system has "no media, no border,
 * no background", because hierarchy here comes from size and space, not from
 * a container. No icons: they would make four real claims read as decoration.
 */
export function WhyUs() {
  return (
    <Section
      id="why-us"
      tone="paper"
      spacing="none"
      className={band}
      aria-labelledby="why-us-heading"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Media leads on mobile — heading, image, body, per §2.6 mobile rules. */}
        {/*
          The one piece of scroll-linked motion on the homepage. §9.2 caps
          parallax at 20px and bans it on mobile outright, and `<Parallax>`
          enforces both — below `lg`, and under reduced motion, it renders no
          transform at all. 16px against a full-height column of type is enough
          to separate the photograph from the page without anyone noticing why.
        */}
        <FadeIn className="order-1 lg:order-none lg:col-span-6">
          <Parallax offset={16}>
            <div className={`${mediaFrame} -mx-5 aspect-[3/2] sm:-mx-8 lg:mx-0 lg:aspect-[4/3]`}>
              <Image
                src={whyUs.image.src}
                alt={whyUs.image.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
          </Parallax>
        </FadeIn>

        <div className="lg:col-span-6">
          <FadeUp>
            <Eyebrow>{whyUs.eyebrow}</Eyebrow>
            <h2
              id="why-us-heading"
              className="mt-3 max-w-[28ch] font-display text-display-sm font-normal text-ink-800"
            >
              {whyUs.heading}
            </h2>
            <p className="mt-4 max-w-[68ch] text-body-lg text-ink-500">{whyUs.standfirst}</p>
          </FadeUp>

          <Stagger as="dl" className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {whyUs.commitments.map((item) => (
              <StaggerItem key={item.title} className="border-t border-paper-400 pt-5">
                <dt className="font-sans text-heading-sm font-semibold tracking-tight text-ink-800">
                  {item.title}
                </dt>
                <dd className="mt-2 text-body-sm text-ink-500">{item.body}</dd>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeUp delay={0.15} className="mt-10">
            <ArrowLink href="/about">Read the studio story</ArrowLink>
          </FadeUp>
        </div>
      </div>
    </Section>
  );
}

export default WhyUs;
