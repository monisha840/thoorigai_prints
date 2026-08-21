import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ServiceIndex, ServiceList } from '@/sections/services/service-list';
import { CtaSection } from '@/sections/shared/cta-section';
import { PageHero } from '@/sections/shared/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph, serviceListNode } from '@/lib/seo';
import { primaryCta } from '@/lib/navigation';

/** Owns "digital printing" and "offset printing" — see `lib/seo/keywords.ts`. */
export const metadata = metadataForRoute('/services');

export default function ServicesPage() {
  return (
    <>
      {/* The six disciplines as Service nodes, each provided by the
          LocalBusiness in the root graph. Built from the same `services`
          array `ServiceList` renders below. */}
      <JsonLd data={pageGraph('/services', [serviceListNode()])} />

      <PageHero
        eyebrow="Services"
        title="Six disciplines, one building."
        lede="Print, finishing and binding happen in the same place, so a job never waits on a third party and never gets lost between them."
        tags={['Digital', 'Offset', 'Packaging', 'Binding', 'Prepress', 'Scanning']}
        actions={
          <>
            <Button href={primaryCta.href} size="lg" iconAfter={<ArrowUpRight />}>
              {primaryCta.label}
            </Button>
            <Button href="/products" variant="secondary" size="lg">
              Browse products
            </Button>
          </>
        }
      />

      <ServiceIndex />
      <ServiceList />
      <CtaSection
        eyebrow="Not sure which process"
        title="Send the job. We will tell you how to run it."
        description="Quantity, stock and finish decide whether a job belongs on the digital press or the offset line. Describe what you need and we will pick — and say so if neither is right."
      />
    </>
  );
}
