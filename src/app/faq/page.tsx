import { ArrowUpRight, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FaqList } from '@/sections/faq';
import { CtaSection } from '@/sections/shared/cta-section';
import { PageHero } from '@/sections/shared/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { faqNode, metadataForRoute, pageGraph } from '@/lib/seo';
import { primaryCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { toTelHref } from '@/lib/utils';

/**
 * Frequently asked questions.
 *
 * The homepage's "In their words" band has always ended on a link to this page;
 * until now that link 404'd, which meant the one section on the site written to
 * answer objections sent the visitor to a dead end at exactly the moment they
 * were closest to enquiring.
 *
 * Every answer is a restatement of copy published elsewhere on the site — see
 * the note at the top of `content/faq.ts`, where each entry names its source.
 * Nothing here is a promise the studio has not already made in writing.
 */
export const metadata = metadataForRoute('/faq');

export default function FaqPage() {
  return (
    <>
      {/* The site's only FAQPage node. It used to sit on `/` for the three
          reassurances that band shows; those three now also appear here, and
          the same questions marked up at two URLs is duplicate rich-result
          markup. See `faqNode()` in `lib/seo/schema.ts`. */}
      <JsonLd data={pageGraph('/faq', [faqNode()])} />

      <PageHero
        eyebrow="FAQ"
        title="Before you send the brief."
        lede="The questions we are asked most, answered in the same words we would use on the phone. If yours is not here, ask - we would rather answer it than have you guess."
        tags={['Turnaround', 'Quantities', 'Binding', 'Artwork', 'Visits']}
        actions={
          <>
            <Button href={primaryCta.href} size="lg" iconAfter={<ArrowUpRight />}>
              {primaryCta.label}
            </Button>
            <Button
              href={toTelHref(siteConfig.contact.phone)}
              variant="secondary"
              size="lg"
              icon={<Phone />}
            >
              Call the studio
            </Button>
          </>
        }
      />

      <FaqList />

      <CtaSection
        eyebrow="Still deciding"
        title="Ask the question that is not on the list."
        description="Nobody at this studio is paid to talk you into the wrong process. Describe the job and you will get a straight answer about what it needs - and what it will cost."
      />
    </>
  );
}
