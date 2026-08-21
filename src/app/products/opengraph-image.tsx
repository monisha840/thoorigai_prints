import { OG_CONTENT_TYPE, OG_EYEBROW, OG_SIZE, renderCard } from '@/lib/seo/og';
import { seoFor } from '@/lib/seo/pages';

/** Social card for `/products`. Alt text comes from the route's SEO record. */

export const alt = seoFor('/products').ogImageAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard({
    eyebrow: OG_EYEBROW,
    lines: ['What comes off', 'the press.'],
    footnote: 'Business cards, brochures, books, rigid boxes, paper bags, certificates.',
  });
}
