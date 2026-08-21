import { OG_CONTENT_TYPE, OG_EYEBROW, OG_SIZE, renderCard } from '@/lib/seo/og';
import { seoFor } from '@/lib/seo/pages';

/**
 * The site's default social card.
 *
 * Because this is a file convention at the root of `app/`, every route without
 * its own `opengraph-image` inherits it — including Twitter, which falls back
 * to the OpenGraph image when no `twitter-image` exists. The five main routes
 * do ship their own; this one covers the homepage and everything else.
 */

export const alt = seoFor('/').ogImageAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderCard({
    eyebrow: OG_EYEBROW,
    lines: ['Printing, packaging', 'and binding.'],
  });
}
