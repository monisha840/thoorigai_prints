import type { Metadata } from 'next';

import { siteConfig } from '@/lib/site';
import type { SeoInput } from '@/types';

import { keywordsFor } from './keywords';
import { seoFor } from './pages';

/** Absolute URL against the configured origin. Canonicals must never be relative. */
export function absolute(path = '/'): string {
  return new URL(path, siteConfig.url).toString();
}

/**
 * Robots directives.
 *
 * `max-image-preview: large` is the one that matters here: without it Google
 * shows a thumbnail for an image-led printing site, and the whole proposition
 * of this business is what the work looks like. `max-snippet: -1` lets Google
 * take as much description as it wants rather than clipping at 160.
 */
const INDEXABLE: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

const HIDDEN: Metadata['robots'] = { index: false, follow: false, nocache: true };

/**
 * Build page metadata from a single call. Handles the title template, the
 * canonical URL, OpenGraph and Twitter cards, so no page has to repeat them.
 *
 *   export const metadata = createMetadata({
 *     title: 'Services',
 *     description: '…',
 *     path: '/services',
 *   });
 *
 * Prefer `metadataForRoute('/services')`, which pulls the reviewed copy out of
 * `./pages` instead of restating it at the call site. This lower-level form
 * stays for one-off routes that have no entry there — 404, error, legal pages.
 */
export function createMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image,
  noIndex = false,
}: SeoInput): Metadata {
  const url = absolute(path);
  // Omitted by default so the generated card from the nearest
  // `opengraph-image.tsx` applies. Pass `image` only to override it.
  const images = image
    ? [{ url: absolute(image), width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [absolute(image)] } : {}),
    },
    robots: noIndex ? HIDDEN : INDEXABLE,
  };
}

/**
 * The form the six main routes use.
 *
 * Everything — title, description, keywords, both card variants, the canonical
 * — resolves from the route's record in `./pages` and its rows in `./keywords`.
 * A page component passes a path and nothing else, which is the point: the copy
 * lives somewhere it can be reviewed as a set rather than page by page.
 */
export function metadataForRoute(route: string): Metadata {
  const page = seoFor(route);
  const url = absolute(route);
  const keywords = keywordsFor(route);

  const cardTitle = page.ogTitle ?? page.absoluteTitle ?? page.title ?? siteConfig.name;
  const cardDescription = page.ogDescription ?? page.description;

  return {
    title: page.absoluteTitle ?? page.title,
    description: page.description,

    // Not a ranking signal at Google and has not been since 2009. Kept because
    // Bing still reads it, and because it documents intent at the point of use.
    ...(keywords.length ? { keywords } : {}),

    alternates: { canonical: url },

    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: cardTitle,
      description: cardDescription,
      // Images come from the route's `opengraph-image.tsx`, which Next resolves
      // per segment and injects with the right absolute URL and dimensions.
    },

    twitter: {
      card: 'summary_large_image',
      title: cardTitle,
      description: cardDescription,
    },

    robots: INDEXABLE,
  };
}

/** For routes that must never be indexed: 404, error boundaries, previews. */
export function noIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
    robots: HIDDEN,
  };
}
