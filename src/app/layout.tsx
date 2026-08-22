import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import '@/styles/globals.css';

import { SpotlightCursor } from '@/components/cursor';
import { Footer } from '@/components/layout/footer';
import { MobileActionBar } from '@/components/layout/mobile-action-bar';
import { Navbar } from '@/components/layout/navbar';
import { PageLoader } from '@/components/ui/page-loader';
import { PageTransition } from '@/components/motion';
import { JsonLd } from '@/components/seo/json-ld';
import { AppProviders } from '@/providers';
import { motionPreferenceScript } from '@/providers/motion-provider';
import { keywordsFor, seoFor, siteGraph } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { brand } from '@/lib/theme/colors';

/** The homepage record doubles as the site-wide default. Defined once, in `lib/seo/pages.ts`. */
const home = seoFor('/');

/**
 * Fonts are self-hosted by next/font at build time: no request to Google at
 * runtime, no layout shift from a late swap, and a preload link emitted
 * automatically. The CSS variables here are the ones `globals.css` maps onto
 * `--font-display` and `--font-sans`.
 */
const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  // Optical sizing is what makes the serif work at both 12px and 96px.
  style: ['normal'],
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Site-wide metadata. Every field here is a default that a route may override;
 * the six main routes do exactly that via `metadataForRoute`.
 *
 * `metadataBase` is what lets every other file hand Next a relative path and
 * still emit the absolute URLs that OpenGraph and canonicals require.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    // Applied to `/` only — Next uses the template for child segments.
    default: home.absoluteTitle!,
    template: `%s - ${siteConfig.name}`,
  },
  description: home.description,
  applicationName: siteConfig.name,
  // The homepage's own verified terms. Every other route replaces this with
  // the rows it owns, so no two pages advertise the same target list.
  keywords: keywordsFor('/'),
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: home.ogTitle ?? home.absoluteTitle!,
    description: home.ogDescription ?? home.description,
    // The card itself comes from `app/opengraph-image.tsx`, which every route
    // inherits unless it ships its own.
  },
  twitter: {
    card: 'summary_large_image',
    title: home.ogTitle ?? home.absoluteTitle!,
    description: home.ogDescription ?? home.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Without this Google shows a thumbnail. For a studio judged entirely on
      // what its work looks like, the large preview is the whole pitch.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Chennai landline and mobile formats are both auto-detected on iOS; leaving
  // this on is what makes the number tappable in the footer.
  formatDetection: { telephone: true, address: true, email: true },
  category: 'business',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never block a visitor from zooming.
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: brand.background },
    { media: '(prefers-color-scheme: dark)', color: brand.primary },
  ],
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-paper-200 font-sans antialiased">
        {/* Structured data every route inherits: Organization, WebSite and the
            LocalBusiness node carrying the address. Pages add their own
            WebPage and BreadcrumbList graph on top, linked by `@id`. */}
        <JsonLd data={siteGraph()} />

        {/* Runs before first paint, so a visitor who has switched motion off in
            the footer never sees a frame of it while React hydrates. */}
        <script dangerouslySetInnerHTML={{ __html: motionPreferenceScript }} />

        {/*
          Framer writes each reveal's `hidden` variant into the server-rendered
          markup, which is what makes the entrance seamless — and what would
          leave the page blank if the JavaScript never arrives. Every reveal
          carries `data-motion`, so undoing it is one rule. An `!important`
          declaration in a stylesheet outranks a non-important inline style,
          which is exactly the case here.
        */}
        <noscript>
          <style>
            {'[data-motion]{opacity:1!important;transform:none!important;clip-path:none!important}'}
          </style>
        </noscript>

        <a
          href="#main"
          className="skip-link rounded-full bg-ink-900 px-5 py-3 text-body-sm text-paper-100"
        >
          Skip to content
        </a>

        <AppProviders>
          <PageLoader />
          <Navbar />

          {/* The navbar is fixed, so each page owns its own top spacing —
              see the hero components. */}
          <main id="main" className="relative">
            {/* §9.2: route changes are a fade and nothing else. */}
            <PageTransition>{children}</PageTransition>
          </main>

          <Footer />

          {/* Below `lg`, the enquiry channels follow the visitor down the page. */}
          <MobileActionBar />

          {/* The ink dot and the pool of light that follows it. Renders
              nothing at all without `(hover: hover) and (pointer: fine)`, so a
              phone never pays for it, and nothing under reduced motion. Last in
              the tree because it is an overlay, and inside the providers
              because it reads the motion preference. */}
          <SpotlightCursor />
        </AppProviders>
      </body>
    </html>
  );
}
