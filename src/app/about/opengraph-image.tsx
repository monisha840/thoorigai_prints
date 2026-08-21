import { OG_CONTENT_TYPE, OG_EYEBROW, OG_SIZE, renderCard } from '@/lib/seo/og';
import { seoFor } from '@/lib/seo/pages';

/** Social card for `/about`. Alt text comes from the route's SEO record. */

export const alt = seoFor('/about').ogImageAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard({
    eyebrow: OG_EYEBROW,
    lines: ['Chennai,', 'since 2017.'],
    footnote: 'A press floor in Royapettah that prints, finishes and binds in house.',
  });
}
