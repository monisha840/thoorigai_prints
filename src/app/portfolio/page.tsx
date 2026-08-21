import {
  ImageGallery,
  PortfolioCta,
  PortfolioExplorer,
  PortfolioHero,
} from '@/sections/portfolio';
import { JsonLd } from '@/components/seo/json-ld';
import { metadataForRoute, pageGraph, portfolioListNode } from '@/lib/seo';

export const metadata = metadataForRoute('/portfolio');

/**
 * The page is four bands, alternating paper and ink:
 *
 *   hero (paper) → work (paper) → range (ink) → close (ink, photographic)
 *
 * Only the middle band is interactive, so the client bundle stays confined to
 * the filter rail, the showcase swap and the gallery lightbox.
 */
export default function PortfolioPage() {
  return (
    <>
      {/* The eight real jobs as CreativeWork nodes with their images.
          `portfolioListNode` publishes the sector, never `namedClient`, until
          `clientCleared` is true — JSON-LD is published content even though
          nobody reads it on screen. */}
      <JsonLd data={pageGraph('/portfolio', [portfolioListNode()])} />

      <PortfolioHero />
      <PortfolioExplorer />
      <ImageGallery />
      <PortfolioCta />
    </>
  );
}
