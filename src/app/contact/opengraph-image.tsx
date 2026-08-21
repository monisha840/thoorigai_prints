import { OG_CONTENT_TYPE, OG_EYEBROW, OG_SIZE, renderCard } from '@/lib/seo/og';
import { seoFor } from '@/lib/seo/pages';

/** Social card for `/contact`. Alt text comes from the route's SEO record. */

export const alt = seoFor('/contact').ogImageAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard({
    eyebrow: OG_EYEBROW,
    lines: ['Tell us what you', 'need printed.'],
    footnote: 'Send the format, the quantity and the date you need it by.',
  });
}
