import type { MetadataRoute } from 'next';

import { absolute } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

/**
 * The production host. Anything else — a preview deployment, a staging domain,
 * a branch URL — is not allowed to be indexed.
 */
const PRODUCTION_HOST = 'www.thoorigaiprints.com';

function isProduction(): boolean {
  // `VERCEL_ENV` is authoritative where it exists; the host check covers every
  // other deployment target and the case where the env var is simply absent.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') return false;
  try {
    return new URL(siteConfig.url).host === PRODUCTION_HOST;
  } catch {
    return false;
  }
}

/**
 * robots.txt.
 *
 * ## The staging guard
 *
 * A preview build serves `Disallow: /` for everyone. Getting a staging copy
 * indexed alongside the real site is one of the most common and most expensive
 * launch mistakes — Google picks whichever it prefers as canonical, and
 * un-indexing the wrong one takes weeks. Rather than relying on someone
 * remembering to set a flag, the rule is derived from the deployment.
 *
 * ## What production allows
 *
 * Everything except `/api/`. The route handlers under it return JSON for the
 * quote form and have no reason to be crawled. Notably `/_next/` is *not*
 * blocked: Google renders the page before it ranks it, and blocking the CSS
 * and JS bundles makes it render a site that looks broken.
 *
 * AI and answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot) are
 * deliberately left allowed. For a studio whose problem is that nobody knows it
 * exists, being quotable in an answer is distribution, not leakage. That is a
 * commercial call rather than a technical one — `docs/seo-launch.md` records it
 * so it can be reversed knowingly instead of by accident.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absolute('/sitemap.xml'),
    host: PRODUCTION_HOST,
  };
}
