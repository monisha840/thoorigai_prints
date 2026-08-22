import { products, services } from '@/lib/content';
import { projects } from '@/lib/portfolio';
import { faqs } from '@/content/faq';
import { siteConfig } from '@/lib/site';

import { absolute } from './metadata';
import { seoFor, seoRoutes } from './pages';

/**
 * Structured data.
 *
 * One connected `@graph` per page rather than a scatter of standalone blocks,
 * so Google resolves the relationships instead of guessing them: this WebPage
 * `isPartOf` this WebSite, which is `publisher`-ed by this Organization, which
 * `@id`-matches the LocalBusiness carrying the address.
 *
 * ## Two rules this file enforces
 *
 * **Nothing here may claim more than the page shows.** Structured data that
 * describes content a visitor cannot see is a manual-action risk, and it is the
 * same "no invented content" rule the rest of the project runs on
 * (`MASTER_PROJECT_PLAN.md` §12.3) applied to markup a human never reads.
 *
 * **Two omissions are deliberate**, both flagged in `docs/seo-launch.md`:
 *
 * - No `aggregateRating` or `review`. The seven testimonials on the legacy site
 *   are theme demo content about an AI course, attributed to invented people
 *   (`docs/content-audit.md`, finding 5). Review markup without real reviews is
 *   the single fastest way to lose rich results permanently.
 * - No `priceRange` and no `geo`. Neither figure has been confirmed by the
 *   studio. An omitted property costs a little completeness; a guessed one is
 *   wrong data served to Google with authority.
 */

/* ---------------------------------------------------------------------------
 * Stable node identifiers
 *
 * Fragment `@id`s let nodes in different graphs on different pages refer to the
 * same entity. Change one of these after launch and every page's graph silently
 * splits into unlinked halves.
 * ------------------------------------------------------------------------- */

export const ORGANISATION_ID = absolute('/') + '#organization';
export const WEBSITE_ID = absolute('/') + '#website';
export const BUSINESS_ID = absolute('/') + '#business';

const pageId = (route: string) => absolute(route) + '#webpage';
const breadcrumbId = (route: string) => absolute(route) + '#breadcrumb';

/* ---------------------------------------------------------------------------
 * Shared helpers
 * ------------------------------------------------------------------------- */

/**
 * Keep only social links that actually point at a profile.
 *
 * `siteConfig.social` currently holds bare domains — `https://instagram.com/`
 * with no handle — because the audit found no social presence linked anywhere
 * on the site (finding 9). Emitting those as `sameAs` would assert that this
 * business *is* the Instagram homepage, which is worse than emitting nothing.
 * The moment real profile URLs land in `site.ts` they flow through untouched.
 */
function verifiedProfiles(): string[] {
  return siteConfig.social
    .map((s) => s.href)
    .filter((href) => {
      try {
        const { pathname } = new URL(href);
        return pathname.replace(/\/+$/, '').length > 0;
      } catch {
        return false;
      }
    });
}

function postalAddress() {
  const { address } = siteConfig.contact;
  return {
    '@type': 'PostalAddress',
    streetAddress: address.street,
    addressLocality: address.city,
    addressRegion: address.state,
    postalCode: address.postalCode,
    addressCountry: 'IN',
  };
}

function contactPoints() {
  const { contact } = siteConfig;
  return [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: contact.phone,
      email: contact.email,
      areaServed: 'IN',
      availableLanguage: ['en', 'ta'],
    },
    ...(contact.whatsapp
      ? [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            telephone: contact.whatsapp,
            // `contactOption` takes a ContactPointOption — TollFree or
            // HearingImpairedSupported. A WhatsApp line is neither, so the
            // channel is expressed by the wa.me URL in `sameAs` instead.
            areaServed: 'IN',
            availableLanguage: ['en', 'ta'],
          },
        ]
      : []),
  ];
}

/* ---------------------------------------------------------------------------
 * Site-wide nodes — rendered once, in the root layout
 * ------------------------------------------------------------------------- */

export function organisationNode() {
  return {
    '@type': 'Organization',
    '@id': ORGANISATION_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: absolute('/'),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    foundingDate: String(siteConfig.founded),
    // Verbatim from the live About page — the one attributable person on the
    // site (`src/content/home.ts`, `founderQuote`).
    founder: { '@type': 'Person', name: 'Mr. R. Ambeth' },
    logo: {
      '@type': 'ImageObject',
      '@id': absolute('/') + '#logo',
      url: absolute('/brand/Logo-Original.png'),
      caption: siteConfig.name,
    },
    image: { '@id': absolute('/') + '#logo' },
    address: postalAddress(),
    contactPoint: contactPoints(),
    ...(verifiedProfiles().length ? { sameAs: verifiedProfiles() } : {}),
  };
}

export function webSiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absolute('/'),
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': ORGANISATION_ID },
    inLanguage: 'en-IN',
    // No `potentialAction` / SearchAction: the site has no search endpoint.
    // Declaring one that 404s is a broken promise Google will test.
  };
}

/**
 * The node that does the local-SEO work.
 *
 * A printing house with a street address and a service radius is exactly the
 * case `LocalBusiness` exists for, and local pack placement is upstream of
 * every enquiry this site can generate.
 */
export function localBusinessNode() {
  const { contact } = siteConfig;

  return {
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: siteConfig.name,
    description: siteConfig.description,
    url: absolute('/'),
    telephone: contact.phone,
    email: contact.email,
    foundingDate: String(siteConfig.founded),
    parentOrganization: { '@id': ORGANISATION_ID },
    image: { '@id': absolute('/') + '#logo' },
    address: postalAddress(),

    // `contact.hours` is a human string that Google cannot parse; the machine
    // form comes from `hoursSpec`. Change one and change the other.
    ...(contact.hoursSpec
      ? {
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: contact.hoursSpec.days,
              opens: contact.hoursSpec.opens,
              closes: contact.hoursSpec.closes,
            },
          ],
        }
      : {}),

    contactPoint: contactPoints(),
    areaServed: [
      { '@type': 'City', name: 'Chennai' },
      { '@type': 'State', name: 'Tamil Nadu' },
      { '@type': 'Country', name: 'India' },
    ],

    // Topical reinforcement, every entry evidenced in `docs/content-audit.md`.
    knowsAbout: [
      'Digital printing',
      'Offset printing',
      'Business card printing',
      'Brochure printing',
      'Rigid box packaging',
      'Corrugated packaging',
      'Paper bag manufacturing',
      'Hard case binding',
      'Perfect binding',
      'Wiro binding',
    ],

    hasOfferCatalog: offerCatalogNode(),

    ...(verifiedProfiles().length || contact.whatsapp
      ? {
          sameAs: [
            ...verifiedProfiles(),
            ...(contact.whatsapp
              ? ['https://wa.me/' + contact.whatsapp.replace(/\D/g, '')]
              : []),
          ],
        }
      : {}),
  };
}

/**
 * The services, as an offer catalogue hung off the business node.
 *
 * Derived from `lib/content` — the same array `/services` renders — so the
 * markup cannot describe a discipline the page does not show.
 */
function offerCatalogNode() {
  return {
    '@type': 'OfferCatalog',
    name: 'Printing, packaging and binding services',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.summary,
        serviceType: service.title,
        url: absolute(service.href ?? '/services'),
        provider: { '@id': BUSINESS_ID },
        areaServed: { '@type': 'City', name: 'Chennai' },
      },
    })),
  };
}

/** The graph every page inherits, emitted once in the root layout. */
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organisationNode(), webSiteNode(), localBusinessNode()],
  };
}

/* ---------------------------------------------------------------------------
 * Per-page nodes
 * ------------------------------------------------------------------------- */

/**
 * Breadcrumbs.
 *
 * The audit found none anywhere on a site that presents three navigation levels
 * (`docs/sitemap.md`, observation 3). This is the markup half of that fix; the
 * visible trail is the other half, and Google wants both to agree.
 */
export function breadcrumbNode(route: string) {
  const trail = route === '/' ? [seoFor('/')] : [seoFor('/'), seoFor(route)];

  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(route),
    itemListElement: trail.map((page, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: page.breadcrumb,
      item: absolute(page.route),
    })),
  };
}

export function webPageNode(route: string) {
  const page = seoFor(route);

  return {
    '@type': page.schemaType,
    '@id': pageId(route),
    url: absolute(route),
    name: page.absoluteTitle ?? page.title,
    description: page.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANISATION_ID },
    breadcrumb: { '@id': breadcrumbId(route) },
    inLanguage: 'en-IN',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absolute(route === '/' ? '/opengraph-image' : `${route}/opengraph-image`),
      caption: page.ogImageAlt,
      width: 1200,
      height: 630,
    },
  };
}

/**
 * Assemble a page's graph: the page node, its breadcrumbs, and whatever
 * route-specific nodes the caller adds.
 */
export function pageGraph(route: string, extra: object[] = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [webPageNode(route), breadcrumbNode(route), ...extra],
  };
}

/* ---------------------------------------------------------------------------
 * Route-specific nodes
 * ------------------------------------------------------------------------- */

/** `/services` — the six disciplines as an ItemList of Service nodes. */
export function serviceListNode() {
  return {
    '@type': 'ItemList',
    '@id': absolute('/services') + '#services',
    name: 'Printing, packaging and binding services',
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': absolute(service.href ?? '/services'),
        name: service.title,
        description: service.summary,
        serviceType: service.title,
        provider: { '@id': BUSINESS_ID },
        areaServed: { '@type': 'City', name: 'Chennai' },
        ...(service.specs?.length
          ? {
              additionalProperty: service.specs.map((spec) => ({
                '@type': 'PropertyValue',
                name: 'Specification',
                value: spec,
              })),
            }
          : {}),
      },
    })),
  };
}

/**
 * `/products` — the catalogue as an ItemList.
 *
 * `Product` nodes carry no `offers`, because no price is published anywhere and
 * this studio quotes per job. `Product` without `offers` will not produce a
 * rich result, and that is the correct outcome: the alternative is inventing a
 * price to satisfy a validator.
 */
export function productListNode() {
  return {
    '@type': 'ItemList',
    '@id': absolute('/products') + '#products',
    name: 'Printed products and packaging formats',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': absolute(`/products#${product.id}`),
        name: product.title,
        description: product.summary,
        category: product.category,
        brand: { '@id': ORGANISATION_ID },
        manufacturer: { '@id': ORGANISATION_ID },
      },
    })),
  };
}

/**
 * `/portfolio` — the eight real jobs.
 *
 * Guarded on `clientCleared`. Four of these images are named client work that
 * needs written permission before the customer can be published
 * (`docs/image-usage-guide.md`), and `namedClient` must not leak into markup
 * just because markup is not rendered on screen — JSON-LD is published content.
 * Until permission is on file the sector ships, exactly as it does on the page.
 */
export function portfolioListNode() {
  return {
    '@type': 'ItemList',
    '@id': absolute('/portfolio') + '#work',
    name: 'Selected printing, packaging and binding work',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        '@id': absolute(`/portfolio#${project.id}`),
        name: project.title,
        description: project.summary,
        genre: project.category,
        dateCreated: project.year,
        creator: { '@id': ORGANISATION_ID },
        // Sector, never `namedClient`, until `clientCleared` is true.
        ...(project.clientCleared && project.namedClient
          ? { sourceOrganization: { '@type': 'Organization', name: project.namedClient } }
          : { audience: { '@type': 'Audience', audienceType: project.sector } }),
        image: {
          '@type': 'ImageObject',
          url: absolute(project.image.src),
          caption: project.image.alt,
          width: project.image.width,
          height: project.image.height,
        },
      },
    })),
  };
}

/**
 * `/faq` — the site's single FAQPage.
 *
 * Sourced from `content/faq.ts`, where every answer names the published copy it
 * restates. Google retired FAQ rich results for most sites in 2023, so this
 * earns no stars in the SERP; it stays because it is the cleanest way to hand a
 * correct answer to the assistants and answer engines that do read it.
 *
 * It is mounted on `/faq` and nowhere else. It used to sit on the homepage for
 * the three reassurances that band shows — but those three now also appear on
 * `/faq`, and the same three questions marked up as an FAQPage at two URLs is
 * duplicate rich-result markup, which is worse than having none. The homepage
 * still renders the reassurances; it simply no longer claims them as an FAQ.
 */
export function faqNode() {
  return {
    '@type': 'FAQPage',
    '@id': absolute('/faq') + '#faq',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** `/contact` — the quote form as a declared action on the business. */
export function quoteActionNode() {
  return {
    '@type': 'ContactPage',
    '@id': absolute('/contact') + '#quote-action',
    mainEntity: { '@id': BUSINESS_ID },
    potentialAction: {
      '@type': 'CommunicateAction',
      name: 'Request a printing quote',
      target: absolute('/contact#quote'),
      about: { '@id': BUSINESS_ID },
    },
  };
}

/* ---------------------------------------------------------------------------
 * Build-time guard
 * ------------------------------------------------------------------------- */

/**
 * Catch the mistakes that survive a type check: a node claiming a rating, a
 * client name published without clearance, a placeholder profile in `sameAs`.
 *
 * Called from `app/sitemap.ts`, which throws on a non-empty result, so this
 * runs on every `next build`. These are the failures that cost a manual action
 * or a customer relationship, and neither is a thing to discover in production.
 */
export function auditSchema(): string[] {
  const problems: string[] = [];

  const serialised = JSON.stringify([
    siteGraph(),
    ...seoRoutes.map((route) => pageGraph(route)),
    serviceListNode(),
    productListNode(),
    portfolioListNode(),
    faqNode(),
  ]);

  if (/aggregateRating|"review"/.test(serialised)) {
    problems.push(
      'Review or rating markup is present, but the site has no verified reviews ' +
        '(docs/content-audit.md, finding 5). Remove it.',
    );
  }

  for (const project of projects) {
    if (!project.clientCleared && project.namedClient && serialised.includes(project.namedClient)) {
      problems.push(
        `"${project.namedClient}" appears in structured data but clientCleared is false. ` +
          'Written permission is required before a customer name is published.',
      );
    }
  }

  for (const social of siteConfig.social) {
    if (serialised.includes(`"${social.href}"`)) {
      problems.push(
        `${social.label} URL "${social.href}" reached sameAs. Placeholder profile ` +
          'links assert the wrong entity - set a real profile URL in site.ts or drop it.',
      );
    }
  }

  return problems;
}
