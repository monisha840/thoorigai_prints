import { ContactDetails } from '@/sections/contact/contact-details';
import { PageHero } from '@/sections/shared/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph, quoteActionNode } from '@/lib/seo';

/** Owns "printing quote Chennai" — the highest-intent term on the site. */
export const metadata = metadataForRoute('/contact');

export default function ContactPage() {
  return (
    <>
      {/* ContactPage + BreadcrumbList, plus the quote form declared as an
          action on the business. On the legacy site the quote form existed
          only inside an Elementor popup, so no crawler ever saw it. */}
      <JsonLd data={pageGraph('/contact', [quoteActionNode()])} />

      <PageHero
        eyebrow="Contact"
        title="Tell us what you need printed."
        lede="Send the format, the quantity and the date you need it by. You will get a real answer — including when we are not the right press for the job."
        tags={['Quotes', 'Studio visits', 'Reprints', 'Sample requests']}
      />

      <ContactDetails />
    </>
  );
}
