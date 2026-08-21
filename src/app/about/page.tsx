import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StudioStory } from '@/sections/about/studio-story';
import { Process } from '@/sections/home/process';
import { WhyUs } from '@/sections/home/why-us';
import { ClientStrip } from '@/sections/shared/client-strip';
import { CtaSection } from '@/sections/shared/cta-section';
import { PageHero } from '@/sections/shared/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph } from '@/lib/seo';
import { primaryCta } from '@/lib/navigation';

/** Owns "printing press in Royapettah" — the locality term the head page cannot carry. */
export const metadata = metadataForRoute('/about');

export default function AboutPage() {
  return (
    <>
      {/* AboutPage + BreadcrumbList. The Organization and LocalBusiness nodes
          this page is about already come from the root layout's graph, and
          are referenced here by `@id` rather than repeated. */}
      <JsonLd data={pageGraph('/about')} />

      <PageHero
        eyebrow="About"
        title="Chennai, since 2017."
        lede="A press floor in Royapettah that prints, finishes and binds without sending a single stage somewhere else."
        tags={['Founded 2017', 'Royapettah, Chennai', 'Digital & offset', 'In-house finishing']}
        actions={
          <>
            <Button href={primaryCta.href} size="lg" iconAfter={<ArrowUpRight />}>
              {primaryCta.label}
            </Button>
            <Button href="/portfolio" variant="secondary" size="lg">
              See the work
            </Button>
          </>
        }
      />

      {/* Slower than the homepage strip and running the other way: this is a
          reading page, and a fast marquee beside body copy is a distraction. */}
      <ClientStrip label="Work delivered for" duration={64} reverse />

      <StudioStory />
      <Process />
      <WhyUs />
      <CtaSection
        eyebrow="Visit"
        title="Come and see a job on press."
        description="If you are in Chennai, the most useful thing we can do is show you the floor and the stock. Call ahead and we will make sure something is running."
      />
    </>
  );
}
