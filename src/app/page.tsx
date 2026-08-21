import { ClientStrip } from '@/sections/shared/client-strip';
import { FeaturedProducts } from '@/sections/home/featured-products';
import { ProductShowcase } from '@/sections/home/product-showcase';
import { Hero } from '@/sections/home/hero';
import { HomeCta } from '@/sections/home/home-cta';
import { PortfolioPreview } from '@/sections/home/portfolio-preview';
import { ProcessTimeline } from '@/sections/home/process-timeline';
import { ServicesPreview } from '@/sections/home/services-preview';
import { Testimonials } from '@/sections/home/testimonials';
import { WhyUs } from '@/sections/home/why-us';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph } from '@/lib/seo';

/**
 * Title, description, keywords and both card variants come from the `/` record
 * in `lib/seo/pages.ts`. Location intent sits in the title per
 * MASTER_PROJECT_PLAN.md §1.4 — no page on the live site has either a
 * keyworded title or a meta description.
 */
export const metadata = metadataForRoute('/');

/**
 * Homepage.
 *
 * Section order is the narrative of MASTER_PROJECT_PLAN.md §6.2 — what → proof
 * → what exactly → how → who → act — rather than the catalogue the live page
 * currently is (60 headings, 52 images, 2,730 characters, two competing H1s).
 *
 * Band tones alternate paper → raised so section boundaries read without rules
 * (§2.6), with two dark bands and no more: the process timeline on `ink-900`
 * and the closing conversion block on `ink-950` (§3.5).
 */
export default function HomePage() {
  return (
    <>
      {/* WebPage + BreadcrumbList.
          The FAQPage node this used to carry now lives on `/faq`, which is
          where the same three answers are published in full alongside nine
          more. Marking up one set of questions at two URLs is duplicate
          rich-result markup — see `faqNode()` in `lib/seo/schema.ts`. */}
      <JsonLd data={pageGraph('/')} />

      <Hero />

      {/* Directly under the header, where "who else uses them" is the question
          a first-time visitor is actually asking. */}
      <ClientStrip label="Trusted by" duration={46} />

      <ServicesPreview />
      <FeaturedProducts />

      {/* Breadth, then one piece in depth. The catalogue above shows eight
          formats at tile size; nothing there shows what a finish looks like. */}
      <ProductShowcase />

      <PortfolioPreview />
      <WhyUs />
      <ProcessTimeline />
      <Testimonials />
      <HomeCta />
    </>
  );
}
