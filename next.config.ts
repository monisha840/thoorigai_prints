import type { NextConfig } from 'next';

import { toNextRedirects } from './src/lib/seo/redirects';

/**
 * The canonical host.
 *
 * Every canonical tag, OpenGraph URL, sitemap row and JSON-LD `@id` is built
 * from `NEXT_PUBLIC_SITE_URL`, and all of them say `www`. The apex has to agree
 * or the two hosts split the legacy site's authority between them — the apex is
 * where the old site's canonical pointed, so real links exist against it.
 */
const CANONICAL_HOST = 'www.thoorigaiprints.com';
const APEX_HOST = 'thoorigaiprints.com';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /** Modern formats first — printing sites are image heavy. */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /**
   * `three` ships untranspiled ESM examples that drei pulls from.
   * Transpiling keeps the Next build and Jest-style tooling happy.
   */
  transpilePackages: ['three'],

  experimental: {
    /** Tree-shake the barrel files that would otherwise pull in whole libraries. */
    optimizePackageImports: ['lucide-react', 'framer-motion', '@react-three/drei'],
  },

  eslint: {
    dirs: ['src'],
  },

  /**
   * Response headers.
   *
   * The four below are the ones a site like this should never ship without,
   * and none of them can break a page that does not already do something it
   * should not be doing.
   *
   * - `Strict-Transport-Security` — every canonical URL this site publishes is
   *   `https`, and this is what stops the first request of a session being made
   *   over `http` where it can be intercepted. Two years, subdomains included.
   *   Deliberately no `preload` directive: that is a submission to a browser
   *   list which is slow and awkward to reverse, and it is the studio's call.
   * - `X-Content-Type-Options: nosniff` — a `.webp` in `public/` is served as
   *   an image and never re-interpreted as script.
   * - `Referrer-Policy` — the full URL of a page goes to same-origin requests
   *   only; a cross-origin request gets the bare origin. That is what keeps a
   *   `?ref=` on a quote link from travelling to a third party.
   * - `X-Frame-Options: SAMEORIGIN` — nobody frames the quote form on their own
   *   domain and collects what is typed into it.
   * - `Permissions-Policy` — the site asks for no camera, no microphone and no
   *   geolocation, so it declares that it never will. The directions card links
   *   out to a map application rather than asking the browser where you are.
   *
   * There is deliberately **no `Content-Security-Policy`**. A CSP that has not
   * been tested against a real deploy is a way to break a site quietly, and
   * Next's inline hydration scripts need either a nonce or a hash set. It is on
   * the launch checklist in `WEBSITE_COMPLETENESS_REPORT.md`, not here.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },

  /**
   * Launch redirects, in two groups.
   *
   * First the host rule: anything arriving on the bare apex is moved to `www`
   * with its path intact, so one host is canonical and the other never serves
   * a 200. Doing it here rather than only at the DNS layer means the guarantee
   * travels with the application to whatever it is deployed on.
   *
   * Then the seventeen legacy WordPress URLs, mapped in
   * `src/lib/seo/redirects.ts` where each destination is justified.
   */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: APEX_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      ...toNextRedirects(),
    ];
  },
};

export default nextConfig;
