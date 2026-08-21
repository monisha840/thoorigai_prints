/**
 * The SEO layer.
 *
 * Four modules behind one import, so a page writes `from '@/lib/seo'` and never
 * needs to know which file a helper lives in:
 *
 * - `keywords` — what each route is built to rank for, and the evidence for it
 * - `pages`    — the reviewed title and description for each of the six routes
 * - `metadata` — those records rendered into Next's `Metadata` shape
 * - `schema`   — the JSON-LD graph
 *
 * Read `docs/seo-launch.md` for the strategy these files implement and for the
 * pre-launch checklist that has to clear before the domain is pointed.
 */

export {
  absolute,
  createMetadata,
  metadataForRoute,
  noIndexMetadata,
} from './metadata';

export {
  findCannibalisation,
  keywordsFor,
  primaryKeywords,
  targetKeywords,
  unverified,
  type Keyword,
  type KeywordTier,
} from './keywords';

export {
  assertLengths,
  pageSeo,
  seoFor,
  seoRoutes,
  signage,
  type PageSeo,
} from './pages';

export {
  auditSchema,
  breadcrumbNode,
  faqNode,
  localBusinessNode,
  organisationNode,
  pageGraph,
  portfolioListNode,
  productListNode,
  quoteActionNode,
  serviceListNode,
  siteGraph,
  webPageNode,
  webSiteNode,
  BUSINESS_ID,
  ORGANISATION_ID,
  WEBSITE_ID,
} from './schema';
