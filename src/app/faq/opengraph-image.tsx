import { OG_CONTENT_TYPE, OG_EYEBROW, OG_SIZE, renderCard } from '@/lib/seo/og';
import { seoFor } from '@/lib/seo/pages';

/** Social card for `/faq`. Alt text comes from the route's SEO record. */

export const alt = seoFor('/faq').ogImageAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard({
    eyebrow: OG_EYEBROW,
    lines: ['The questions', 'we get asked.'],
    footnote: 'Turnarounds, sizes, binding, artwork and visits - answered plainly.',
  });
}
