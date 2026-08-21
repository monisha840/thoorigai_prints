import { OG_CONTENT_TYPE, OG_EYEBROW, OG_SIZE, renderCard } from '@/lib/seo/og';
import { seoFor } from '@/lib/seo/pages';

/** Social card for `/portfolio`. Alt text comes from the route's SEO record. */

export const alt = seoFor('/portfolio').ogImageAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard({
    eyebrow: OG_EYEBROW,
    lines: ['Work, as it left', 'the building.'],
    footnote: 'Photographed as delivered. No renders, no mock-ups.',
  });
}
