import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/sections/products/product-grid';
import { CtaSection } from '@/sections/shared/cta-section';
import { PageHero } from '@/sections/shared/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph, productListNode } from '@/lib/seo';
import { primaryCta } from '@/lib/navigation';

/** Owns "business cards" and "brochures" — see `lib/seo/keywords.ts`. */
export const metadata = metadataForRoute('/products');

export default function ProductsPage() {
  return (
    <>
      {/* The catalogue as an ItemList of Product nodes. No `offers`: this
          studio quotes per job, and a Product without a price is the honest
          shape rather than a rich result bought with an invented figure. */}
      <JsonLd data={pageGraph('/products', [productListNode()])} />

      <PageHero
        eyebrow="Products"
        title="What comes off the press."
        lede="Formats we produce regularly, each to your dimensions, stock and finish. If it is not listed, ask - the list is what we run most, not what we can run."
        tags={['Publishing', 'Packaging', 'Retail', 'Identity', 'Institutional']}
        actions={
          <>
            <Button href={primaryCta.href} size="lg" iconAfter={<ArrowUpRight />}>
              {primaryCta.label}
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              How we make them
            </Button>
          </>
        }
      />

      <ProductGrid />
      <CtaSection
        eyebrow="Specifications"
        title="Every format is made to your dimensions."
        description="Stock weight, finish, print process and quantity all move together. Tell us the constraint that matters most and we will build the rest of the specification around it."
      />
    </>
  );
}
