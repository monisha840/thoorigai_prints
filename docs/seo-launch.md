# SEO launch setup

Production SEO for the six-route site. Written 21 August 2026, against the crawl in
[content-audit.md](content-audit.md) and the URL inventory in [sitemap.md](sitemap.md).

The site being replaced had **no meta description on any page**, **one H1 across 24 pages**
(the homepage, which had two), **empty alt text on all 155 media records**, and **no social
card at all**, so every link ever shared previewed blank. Everything below is calibrated
against that starting point: the wins here are not marginal tuning, they are the absence of
a floor.

---

## 1. Where things live

| File | What it owns |
|---|---|
| [`src/lib/seo/keywords.ts`](../src/lib/seo/keywords.ts) | Target terms, tiered, each with the audit line that evidences it |
| [`src/lib/seo/pages.ts`](../src/lib/seo/pages.ts) | Title, description, OG copy, breadcrumb, `lastmod`, priority per route |
| [`src/lib/seo/metadata.ts`](../src/lib/seo/metadata.ts) | Those records rendered into Next's `Metadata` |
| [`src/lib/seo/schema.ts`](../src/lib/seo/schema.ts) | The JSON-LD graph |
| [`src/lib/seo/og.tsx`](../src/lib/seo/og.tsx) | The shared social-card template |
| [`src/lib/seo/redirects.ts`](../src/lib/seo/redirects.ts) | The 20 legacy WordPress URLs and where each one goes |
| [`src/app/sitemap.ts`](../src/app/sitemap.ts) | The XML sitemap, plus the build-time guards |
| [`src/app/robots.ts`](../src/app/robots.ts) | robots.txt, including the staging lock |

A page component declares two lines and nothing else:

```tsx
export const metadata = metadataForRoute('/services');
// …
<JsonLd data={pageGraph('/services', [serviceListNode()])} />
```

---

## 2. Keyword map

One primary term per route, never shared. Two pages chasing one term is how a small site
ends up ranking for nothing, and it is the failure `findCannibalisation()` fails the build over.

| Route | Primary | Secondary |
|---|---|---|
| `/` | printing services in Chennai | printing press Chennai · printing company Royapettah · custom printing Chennai |
| `/services` | **digital printing** · **offset printing** | digital/offset printing services Chennai · multicolour · black and white · print on demand |
| `/products` | **business cards** · **brochures** | business card / brochure printing Chennai · rigid box manufacturer · paper bag · corrugation · carton · certificates · hard case binding |
| `/portfolio` | printing work samples Chennai | packaging portfolio Chennai |
| `/about` | printing press in Royapettah | printing company since 2017 |
| `/contact` | printing quote Chennai | printing press near me Chennai |

**Why the head term sits on the homepage and the process terms don't.** "Printing services in
Chennai" is the term the whole site should rank for, so it goes on the page with the most
internal links pointing at it. "Digital printing" and "offset printing" then belong to
`/services`, which is the page that actually explains the difference — putting them all on the
homepage would leave `/services` with nothing of its own to win.

### Sign boards — scaffolded, not published

Requested as a target. It does not appear anywhere in the business record: not in the 24
crawled pages, not in the 155-record media library, not in the content model, not in a single
image. Five of the six requested terms are genuinely supported; this one has nothing behind it.

It is written into `unverified` in [`keywords.ts`](../src/lib/seo/keywords.ts) with the block
recorded, and **excluded from every build output** — no title, no description, no `Service`
node, no sitemap row. Nothing false ships.

**To publish it**, once the studio confirms they produce signage:

1. Confirm the capability and the substrate range (acrylic, flex, LED, vinyl).
2. Add the service to `src/lib/content.ts` with real copy and real photography.
3. Move the three rows from `unverified` into `targetKeywords` with an `evidence` string.
4. Set `signage.published = true` in [`pages.ts`](../src/lib/seo/pages.ts).

Publishing `Service` markup for something the studio cannot deliver is a
structured-data policy violation and, more practically, generates enquiries that have to be
turned away.

---

## 3. Title tags and meta descriptions

Titles are budgeted under 60 characters, descriptions between 120 and 158. `assertLengths()`
fails the build if an edit drifts out of range or if two routes end up sharing a description.
The brand suffix `— Thoorigai Prints` (19 chars) is applied by the title template to every
route except the homepage, which carries its own.

| Route | Title | Len | Description | Len |
|---|---|---|---|---|
| `/` | Printing Services in Chennai \| Thoorigai Prints | 47 | Digital and offset printing, packaging and binding, produced under one roof in Royapettah, Chennai since 2017. Proofed before press. Request a quote. | 148 |
| `/services` | Digital & Offset Printing Services — Thoorigai Prints | 53 | Digital printing for short runs, offset for long ones, plus packaging, binding, prepress and scanning — six disciplines run in one Chennai building. | 147 |
| `/products` | Business Cards, Brochures & Boxes — Thoorigai Prints | 52 | Business cards, brochures, books, rigid and carton boxes, paper bags, certificates and labels — printed and finished to your specification in Chennai. | 149 |
| `/portfolio` | Printing & Packaging Portfolio — Thoorigai Prints | 49 | Selected printing, packaging and binding work from our Chennai floor, photographed as delivered — with the stock, process and finish noted on every piece. | 152 |
| `/about` | About Our Chennai Printing Press — Thoorigai Prints | 51 | Thoorigai Prints has printed, finished and bound from Royapettah, Chennai since 2017 — every stage under one roof, nothing sent to a third party. | 144 |
| `/contact` | Get a Printing Quote in Chennai — Thoorigai Prints | 50 | Request a printing, packaging or binding quote from our Royapettah studio. Send the format, quantity and date — by form, phone or WhatsApp. | 138 |

---

## 4. Open Graph

Every route ships its **own** card, generated at build time by `next/og` from one shared
template — same composition, different words, so a set of shared links reads as one studio.

This matters more here than it does on most sites. Most enquiries to this business arrive over
WhatsApp, and WhatsApp renders the OG card at a size where the headline *is* the message. The
legacy site had no card, so every link anyone had ever shared previewed blank.

OG titles are deliberately not the SEO titles. A search result is scanned in a list and wants
the keyword first; a social card is read in a feed and wants a sentence — so `/services`
carries "Six printing disciplines, one building" rather than its title tag.

All six verified rendering at 1200×630 PNG. `og:image:alt` is a real description of the card
on every route, never a repeat of the title.

---

## 5. Structured data

One connected `@graph` per page rather than scattered blocks, so the relationships resolve
instead of being guessed.

```
Root layout (every page inherits)
├── Organization          @id …/#organization   founder, logo, address, contact points
├── WebSite               @id …/#website        publisher → Organization
└── LocalBusiness         @id …/#business       hours, area served, knowsAbout, OfferCatalog

Per page
├── WebPage | CollectionPage | AboutPage | ContactPage
│      isPartOf → WebSite · about → Organization · breadcrumb → BreadcrumbList
├── BreadcrumbList        the trail the old site had nowhere
└── route-specific:
       /            FAQPage            3 real answers from the live FAQ
       /services    ItemList<Service>  6 disciplines, provider → LocalBusiness
       /products    ItemList<Product>  9 formats
       /portfolio   ItemList<CreativeWork> 8 real jobs, with images
       /contact     CommunicateAction  the quote form
```

### What is deliberately absent

**No `aggregateRating` or `review`.** All seven testimonials on the legacy site are theme demo
content about an AI course, attributed to invented people with stock portraits
([content-audit.md](content-audit.md), finding 5). Review markup without real reviews is the
fastest way to lose rich results permanently. `auditSchema()` fails the build if rating markup
ever appears.

**No `priceRange`, no `geo`.** Neither has been confirmed. An omitted property costs a little
completeness; a guessed one is wrong data served to Google with authority.

**No `SearchAction`.** There is no site search. Declaring an endpoint that 404s is a promise
Google tests.

**No `offers` on `Product`.** This studio quotes per job and publishes no prices. Without
`offers` these will not produce a rich result — correct, since the alternative is inventing a
price to satisfy a validator.

### The client-name guard

Four of the eight portfolio images are named client work needing **written permission before
the customer can be published** ([image-usage-guide.md](image-usage-guide.md)). JSON-LD is
published content even though nobody reads it on screen, so `portfolioListNode()` emits the
sector (`"Public broadcasting"`) and never `namedClient`, until `clientCleared` flips.
`auditSchema()` fails the build if an uncleared name reaches the markup. Verified on the
rendered page: zero occurrences.

---

## 6. Sitemap strategy

**Six URLs. That is the whole sitemap, and the restraint is the strategy.**

The legacy `wp-sitemap.xml` listed 24 pages: six orphans nobody linked to (including a
complete AI-course landing page), nine Lorem Ipsum blog posts, and seven theme-demo
testimonials for an unrelated business. A sitemap is a statement about which pages are worth
indexing. Padding it with pages that cannot rank spends crawl budget arguing against yourself,
and on a site this size crawl budget is not the constraint — *trust* is.

**Generated from `seoRoutes`**, so a route without a reviewed title and description cannot
appear in it. Adding a page and forgetting its metadata is made structurally impossible.

**`lastmod` is hand-maintained per route, not `new Date()`.** This is the one sitemap field
Google actually uses, and only while it stays honest. The default most Next sitemaps ship with
stamps every route with the build date, which tells Google the entire site changes on every
deploy — it responds by ignoring `lastmod` from that domain permanently. Bump a route's date
when its *copy* changes, not when the CSS does.

**`priority` and `changefreq` are emitted but expected to do nothing.** Google has ignored
both since 2015 and has said so publicly. Bing and some smaller crawlers still read them, and
they cost nothing, so they stay — but no ranking outcome should be attributed to them.

**No fragment URLs.** `/services#offset` is a fragment of `/services`, not a URL. Listing
fragments as separate entries is a well-worn way to get a sitemap distrusted. When the
capability pages in `MASTER_PROJECT_PLAN.md` §6 become real routes, they get real rows.

**Images on `/portfolio` only.** Eight `<image:image>` entries, because that is the only page
whose photography is unambiguously this studio's own work. Image search is the surface that
matters most to a business judged on what its work looks like.

### robots.txt

Production allows everything except `/api/`. Notably `/_next/` is **not** blocked — Google
renders a page before ranking it, and blocking the CSS and JS makes it render broken.

**Staging is locked automatically.** Any deployment whose host is not `www.thoorigaiprints.com`,
or where `VERCEL_ENV !== 'production'`, serves `Disallow: /`. Getting a staging copy indexed
alongside the real site is one of the most expensive launch mistakes there is, and this does not
depend on anyone remembering a flag.

**AI crawlers are allowed** (GPTBot, ClaudeBot, PerplexityBot, CCBot). For a studio whose
problem is that nobody knows it exists, being quotable in an answer is distribution. That is a
commercial call, not a technical one — recorded here so it can be reversed knowingly.

---

## 7. Redirects

Seventeen live legacy URLs plus three more, mapped in
[`redirects.ts`](../src/lib/seo/redirects.ts) and wired into `next.config.ts` as 308s.

Whatever ranking, backlinks and directory listings this business has accumulated point at the
old URLs. Launching without these means every one of them 404s on day one.

| Legacy | New |
|---|---|
| `/printing/` | `/services` |
| `/digital-multicolour/`, `/digital-black-and-white/` | `/services#digital` |
| `/offset-multicolour/`, `/offset-black-and-white/` | `/services#offset` |
| `/packaging/` | `/services#packaging` |
| `/binding/`, `/hard-case-binding/`, `/perfect-binding/`, `/wiro-binding/`, `/center-pin/` | `/services#binding` |
| `/corrugation-box/` | `/products#corrugation` |
| `/carton-box/` | `/products#boxes` |
| `/paper-bag/` | `/products#bags` |
| `/about-us/` | `/about` |
| `/contact-us/` | `/contact` |
| `/home/` | `/` |
| `/terms-conditions/` | `/terms` |
| `/cookie-policy/` | `/cookies` |

**Not redirected, deliberately:** the six orphans, the nine Lorem Ipsum posts, the seven demo
testimonials. Nothing links to them and none has an equivalent. Google's guidance for a removed
page with no replacement is to let it 404 — redirecting an AI-course landing page to a printing
homepage is noise that takes longer to clear from the index than a clean 404.

**Apex → www** is also handled in `next.config.ts` via a host rule, so the canonical host holds
regardless of DNS configuration.

---

## 8. Pre-launch checklist

### Blocking

- [ ] **`npm run build` does not currently complete on this machine.** It compiles and
      generates all 19 pages, then fails at "Collecting build traces" with `ENOENT` on
      `.next/…/*.nft.json`, and `next start` then fails on a missing `prerender-manifest.json`.
      Cause is OneDrive sync holding and removing files inside `.next` — the project sits in
      `OneDrive - Sirah Digital`. **Fix before deploying:** exclude `.next` and `node_modules`
      from OneDrive sync, or move the repo outside the synced folder. Not caused by anything in
      this SEO work, but it stops a release.
- [ ] **Resolve the three phone numbers to one.** `site.ts` still carries the TODO. The number
      in `LocalBusiness` markup must match Google Business Profile and every directory listing
      exactly — inconsistent NAP is the most common cause of a business not ranking locally.
- [ ] **Point `/terms` and `/cookies` at real pages**, or drop those two redirects. They
      currently 308 to routes that do not exist.
- [ ] **Write a privacy policy.** The legacy footer links to one that 404s. This is a
      compliance gap, not just a broken link.
- [ ] **Confirm sign boards** — publish or delete. See §2.
- [ ] **Set `NEXT_PUBLIC_SITE_URL=https://www.thoorigaiprints.com`** in the production
      environment. Without it the fallback is correct but nothing is verified.

### Should do

- [ ] Real social profile URLs in `site.ts`, or remove the entries. They are currently bare
      domains and are being filtered out of `sameAs` — the business has no linked social
      presence at all (audit finding 9).
- [ ] Studio latitude/longitude, then add `geo` to `localBusinessNode()`.
- [ ] `priceRange` (e.g. `"₹₹"`), if the studio will commit to one.
- [ ] GSTIN for the footer and `taxID` in the Organization node.
- [ ] Confirm the placeholder claims in `studioStats` (`1,200+ jobs`, `48hr turnaround`) or
      remove them — `src/content/home.ts` already flags that they must not ship.
- [ ] Replace the placeholder `portfolio` array in `src/lib/content.ts`. It still contains
      "Placeholder Client" rows; `/portfolio` now renders the real data from `lib/portfolio.ts`,
      but `/products` and any other consumer of the old array should be checked.
- [ ] Add a visible breadcrumb component. The `BreadcrumbList` markup is in place; Google wants
      the visible trail to agree with it.

### At launch

- [ ] Verify the apex → www redirect resolves in one hop from a cold client.
- [ ] Spot-check five legacy URLs return 308 to the right destination.
- [ ] Submit `https://www.thoorigaiprints.com/sitemap.xml` in Google Search Console.
- [ ] Register **both** the apex and www properties in Search Console, plus a Domain property.
- [ ] Run every route through the [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Run the homepage and `/contact` through the
      [Schema Markup Validator](https://validator.schema.org/).
- [ ] Share one link into WhatsApp and one into LinkedIn; confirm the card renders.
- [ ] Confirm `https://www.thoorigaiprints.com/robots.txt` does **not** say `Disallow: /`.
- [ ] Claim / update Google Business Profile with the same NAP as the `LocalBusiness` node.

### First fortnight

- [ ] Watch Search Console Coverage for 404s from legacy URLs the audit missed.
- [ ] Check that the six new URLs are indexed and the old ones have dropped out.
- [ ] Confirm Google is using the written descriptions rather than rewriting them. If it
      rewrites one consistently, the page's copy is not answering the query the title promises.

---

## 9. What the build enforces

`app/sitemap.ts` runs three guards and throws before generating, so these fail a deploy rather
than reaching production:

| Guard | Catches |
|---|---|
| `assertLengths()` | Title over 60, description outside 120–158, two routes sharing a description |
| `findCannibalisation()` | Two routes claiming the same primary keyword |
| `auditSchema()` | Rating markup without reviews · an uncleared client name in JSON-LD · a placeholder social URL in `sameAs` |

---

## 10. Verified on the running site

| Check | Result |
|---|---|
| `sitemap.xml` | 6 URLs, correct `lastmod`, 8 image entries on `/portfolio` |
| `robots.txt` | Allow `/`, disallow `/api/`, correct host and sitemap |
| Titles | All 6 render, template applied, all within budget |
| Descriptions | All 6 unique, all within budget |
| Canonicals | Absolute, `www`, correct per route |
| Open Graph | Full tag set per route, 6 distinct cards at 1200×630 PNG |
| Twitter | `summary_large_image` with per-route copy |
| `robots` / `googlebot` meta | `index, follow, max-image-preview:large, max-snippet:-1` |
| JSON-LD | 2 graphs per page, `@id` references resolve |
| Placeholder socials | Filtered — 0 occurrences in `sameAs` |
| Uncleared client names | 0 occurrences in rendered markup |
