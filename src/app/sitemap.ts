import type { MetadataRoute } from 'next';

import { projects } from '@/lib/portfolio';
import { absolute, assertLengths, findCannibalisation, seoFor, seoRoutes } from '@/lib/seo';
import { auditSchema } from '@/lib/seo';

/**
 * The XML sitemap.
 *
 * ## Strategy
 *
 * Six URLs. That is the whole sitemap, and the restraint is the point — the
 * legacy `wp-sitemap.xml` listed 24 pages, of which six were orphans nobody
 * linked to, nine were Lorem Ipsum blog posts and seven were theme-demo
 * testimonials for an unrelated business (`docs/content-audit.md`). A sitemap
 * is a statement about which pages are worth indexing; padding it with pages
 * that cannot rank spends crawl budget arguing against yourself.
 *
 * Built from `seoRoutes`, so a route without a reviewed title and description
 * in `lib/seo/pages.ts` cannot appear here. Adding a page to the sitemap and
 * forgetting its metadata is the drift this arrangement makes impossible.
 *
 * ## On `priority` and `changeFrequency`
 *
 * Google has ignored both since 2015 and said so publicly. They are emitted
 * because Bing and several smaller crawlers still read them, and because they
 * cost nothing. No ranking outcome should be expected from either — the field
 * that does the work is `lastModified`, which is why it is a hand-maintained
 * date per route rather than `new Date()`. See `lib/seo/pages.ts`.
 *
 * ## Anchors are deliberately absent
 *
 * `/services#offset` is a fragment of `/services`, not a URL of its own, and
 * listing fragments as separate entries is a well-worn way to get a sitemap
 * distrusted. When the capability pages in `MASTER_PROJECT_PLAN.md` §6 become
 * real routes, they get real rows here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Fail the build rather than ship a sitemap that points at pages with
  // duplicate descriptions, cannibalised keywords or over-claiming markup.
  // A sitemap is the last place these problems stay invisible.
  const problems = [...assertLengths(), ...findCannibalisation(), ...auditSchema()];
  if (problems.length) {
    throw new Error('SEO check failed before sitemap generation:\n  - ' + problems.join('\n  - '));
  }

  return seoRoutes.map((route) => {
    const page = seoFor(route);

    return {
      url: absolute(route),
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      // Image entries help the one search surface this studio should care most
      // about after local: someone judging print quality by looking at it.
      // Only the portfolio has photography that is unambiguously this studio's
      // own work, so only the portfolio declares images.
      ...(route === '/portfolio'
        ? { images: projects.map((project) => absolute(project.image.src)) }
        : {}),
    };
  });
}
