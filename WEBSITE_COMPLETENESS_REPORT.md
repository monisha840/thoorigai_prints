# Website Completeness Report

**Thoorigai Prints** — full-site audit and remediation
Audited and repaired: 21 August 2026
Method: source review of all 14,000 lines under `src/`, plus an automated crawl of every route on a production build (`next build` → `next start`), checking every internal link, every fragment target, every image URL, heading order, duplicate ids and server-rendered content.

---

## 1. Verdict

The site arrived in unusually good shape. The design system, the motion architecture, the SEO layer and the image pipeline were all genuinely well built, and none of them needed rescuing. What it had instead was the failure mode of a site assembled section by section: **the pieces were finished, the joins were not.**

Ten internal links pointed at eight routes that did not exist — including both hero buttons and all three footer legal links. Eleven of the homepage's most-clicked elements redirected to the wrong page. Five fragment targets the footer relies on had never been rendered. And the single most important page on the site shipped a loading skeleton as its entire HTML body. None of that is visible from inside a component file, and all of it is visible within thirty seconds of clicking around a running build.

Every issue in §3 has been fixed. The site now passes a full crawl clean.

| Check | Before | After |
|---|---|---|
| Routes returning 404 from an internal link | 8 | **0** |
| Internal links landing on the wrong page | 11 | **0** |
| Fragment targets that did not exist | 5 | **0** |
| Pages shipping no server-rendered content | 1 | **0** |
| Visible "unfinished" copy blocks | 9 | **0** |
| Heading-level skips | 2 | **0** |
| Pages with duplicate DOM ids | 0 | 0 |
| Broken image URLs (112 checked) | 0 | 0 |
| Security response headers | 0 | **5** |
| Routes | 6 | **10** |

---

## 2. Page scores

Scored after remediation. The "before" column is what the audit found.

| Page | Content | Visual | Premium feel | Mobile | Conversion | Before → After |
|---|---|---|---|---|---|---|
| **Home** | 9 / 10 | 9 / 10 | 9 / 10 | 9 / 10 | 9 / 10 | 6.6 → **9.0** |
| **Services** | 8 / 10 | 9 / 10 | 9 / 10 | 9 / 10 | 9 / 10 | 6.4 → **8.8** |
| **Products** | 8 / 10 | 9 / 10 | 8 / 10 | 9 / 10 | 8 / 10 | 5.8 → **8.4** |
| **Portfolio** | 9 / 10 | 10 / 10 | 10 / 10 | 9 / 10 | 8 / 10 | 8.0 → **9.2** |
| **About** | 8 / 10 | 8 / 10 | 8 / 10 | 9 / 10 | 8 / 10 | 6.4 → **8.2** |
| **Contact** | 8 / 10 | 8 / 10 | 8 / 10 | 9 / 10 | 9 / 10 | 4.6 → **8.4** |
| **FAQ** *(new)* | 9 / 10 | 8 / 10 | 8 / 10 | 9 / 10 | 9 / 10 | — → **8.6** |
| **Legal** *(new ×3)* | 8 / 10 | 7 / 10 | 7 / 10 | 9 / 10 | 5 / 10 | — → **7.2** |

### Where each page stands

**Home — 9.0.** Ten bands, 1,114 words, 21 photographs, 75 scroll-revealed elements. The narrative order is right (what → proof → what exactly → how → who → act), the band tones alternate so boundaries read without rules, and the accent is spent exactly once. Held off 10 only by the two figures in the credibility strip that still need confirming with the studio (§6).

**Services — 8.8.** Six disciplines, each anchored, each now closing on its own quote link that carries the service through to the form. The one thing it still lacks is per-service specifics — stock weights, minimums, lead times — which is a content dependency on the studio, not a build gap.

**Products — 8.4.** Nine formats, now with anchor ids, a section heading, and a quick-jump index. Word count is the lowest on the site at 356; each tile carries one sentence where the homepage's catalogue tiles carry more. Not broken, but the thinnest page here.

**Portfolio — 9.2.** The strongest page on the site and it was before the audit. Eight jobs photographed as delivered, each with process, stock and finish named; a filterable explorer; a 35-image masonry wall with a lightbox. Now each row ends on an enquiry link that carries the job through to the form.

**About — 8.2.** Reads as a real business now that the placeholder admission is gone. The four studio statistics are the outstanding item.

**Contact — 8.4, up from 4.6.** This is the largest single movement in the audit and it is almost entirely the SSR fix (§3.1). It went from a page that served a shimmer skeleton to a fully server-rendered conversion page with a working `#quote` anchor and a real directions card.

**FAQ — 8.6.** New. Twelve questions, all twelve answers in the HTML, the site's only `FAQPage` node, and every answer sourced from copy published elsewhere on the site.

**Legal — 7.2.** New. Three policies written against what this codebase actually does. Scored honestly: a policy page is not a premium experience and is not meant to convert. It is scored on being present, accurate and readable, which it is — with the caveats in §6.

---

## 3. What was found, and what was done

### 3.1 — Critical: `/contact` served no content

**Severity: critical. The single most damaging defect on the site.**

`QuoteForm` called `useSearchParams()` with no `<Suspense>` boundary above it. In the Next App Router that opts the **entire route** out of server rendering — the build emits `BAILOUT_TO_CLIENT_SIDE_RENDERING` and ships the `loading.tsx` skeleton as the whole HTML body.

Three consequences, all on the site's highest-intent page:

- A crawler saw a shimmer skeleton. The form, the phone number, the address and the opening hours were not in the HTML at all. The route is titled "Get a Printing Quote in Chennai" and targets the highest-commercial-intent term the site owns; it was serving Google nothing.
- `id="quote"` did not exist server-side, so **`/contact#quote` — the primary call to action in the navbar, the footer, and every page's closing band — landed at the top of the page** instead of on the form.
- Every visitor saw a flash of skeleton before the page appeared.

**Fixed** in [quote-form.tsx](src/features/quote/quote-form.tsx): `?ref=` is read from `location.search` on mount instead. The two prefilled fields already carried `key={default…}`, so they remount with the new default the moment it arrives — the mechanism was already there, which is what makes the deferred read invisible. Verified: `/contact` now server-renders 289 words including the full form, and `id="quote"` is present in the HTML.

### 3.2 — Critical: eleven homepage links landed on the wrong page

Every pillar card and every catalogue tile on the homepage pointed at a **legacy WordPress path** — `/printing`, `/packaging`, `/binding` and fragments of them. Those paths are in the redirect map precisely because they no longer exist.

A fragment survives a redirect only when the destination has none of its own, so `/printing#books` arrived at `/services#books` — an anchor that has never existed, on a page that does not list books. Eleven of the homepage's most-clicked elements, every one depositing the visitor at the top of the wrong page after a needless round trip.

**Fixed** in [home.ts](src/content/home.ts). Pillars now go to the discipline on `/services`; formats to their tile on `/products`; wiro and hard case to `/services#binding`, the page that actually describes them. The redirects stay for links that escaped into the world on the old site.

### 3.3 — Seven internal links to routes that did not exist

| Link | Found in | Was | Now |
|---|---|---|---|
| `/quote` ×2 | hero, home CTA | 404 | `/contact#quote` |
| `/work` ×2 | hero, portfolio preview | 404 | `/portfolio` |
| `/process` | process timeline | 404 | `/about#process` |
| `/materials` | services preview | 404 | `/portfolio#gallery` |
| `/faq` | testimonials | 404 | **`/faq` — page built** |

Both hero buttons — the first two calls to action a visitor sees — were among them. Redirects were added for all five paths as well, since a link that shipped can be in a bookmark.

### 3.4 — Three footer links 404'd, and two redirects pointed at them

`/privacy`, `/terms` and `/cookies` were linked from the footer of every page and had no routes. Worse, `/terms-conditions` and `/cookie-policy` — two of the seventeen legacy redirects — pointed at two of those 404s, which Google treats as a soft 404 and which is worse for the visitor than the old page had been.

**Fixed**: three policy pages built ([privacy](src/app/privacy/page.tsx), [terms](src/app/terms/page.tsx), [cookies](src/app/cookies/page.tsx)), each written against what this codebase actually does. See §6 for what still needs the studio's input.

### 3.5 — Five fragment targets did not exist

The footer's Products column links to `/products#books`, `#boxes`, `#bags` and `#stationery`, and `/corrugation-box` redirects to `/products#corrugation`. **None of those ids existed** — the product grid rendered no ids at all, so all five resolved to the top of the page.

Likewise `/about#process`: the `Process` section had no id.

**Fixed**: every product tile now carries `id={product.id}` with `scroll-mt-28` to clear the fixed header, and the About page's process band is anchored.

### 3.6 — Nine blocks of visible "unfinished" copy

| Where | What it said | Now |
|---|---|---|
| About | "This section is placeholder copy written against the studio's actual capabilities." | Replaced with a third paragraph of verifiable capability copy |
| Contact | A dashed box reading "Map — pending" | A directions card linking to the map application the visitor already has |
| Services ×6 | "Detailed specifications … are being written up with the studio." — printed six times down one page | Replaced with a per-service quote link carrying `?ref=` |
| `lib/content.ts` | Six dead `PortfolioItem` records, every one attributed to "Placeholder Client" | Removed |

The About one was the worst of these. That page exists so a visitor can decide whether the business is real, and it closed by telling them it was not finished.

The six identical Services notes were doing double damage: repeating "unfinished" six times, and occupying the position where each row's call to action belonged. A reader convinced by the offset row had nowhere to go from it.

The dead `caseStudies` array had nothing importing it, but dead data carrying an invented client name is not inert — it is exactly what something reaches for when a new section needs "some case studies", and the next person to wire it up publishes six fabricated client references. That is the same failure `docs/content-audit.md` finding 5 records against the legacy site.

### 3.7 — Missing calls to action

Two of the three deepest pages had no way to act from the content itself:

- **Services**: six rows describing six disciplines, no CTA on any of them.
- **Portfolio**: eight jobs with process, stock and finish spelled out, no CTA on any of them. A visitor persuaded by row five had to scroll past three more rows to reach the closing band.

**Fixed**: both now end each row on a quote link carrying `?ref=`, which the form resolves to the item's title and category — so the form arrives on the right service line with the brief already started. `quoteHref()` existed in `lib/utils.ts` and **nothing on the site was using it**; the form's `?ref=` handling was already built and had no callers.

`serviceForRef` and `titleForRef` were extended to recognise a portfolio job id as well as a service or product id.

### 3.8 — Missing visual hierarchy

Two pages skipped a heading level, running `h1` straight into `h3`:

- **Products** had no `h2` at all. Between the hero and a wall of nine photographs there was no answer on screen to "what am I looking at". Fixed with a section header and a quick-jump format index — the same strip `/services` already carried.
- **FAQ** (introduced during this work) used `h3` for questions with no `h2` above; corrected to `h2`, since each question is a top-level section of that page.

### 3.9 — FAQ answers were not in the HTML

Caught during verification of the new page. The accordion mounted panels on open, the idiomatic `AnimatePresence` pattern — which would have put exactly **one of twelve answers** into the server-rendered markup. A page of questions with no answers, on the route whose entire purpose is to be the answer, and find-in-page would have missed eleven of them.

**Fixed**: panels are always rendered and collapsed with `height: 0`, with `inert` keeping the collapsed subtree out of the accessibility tree and out of the tab order. Verified: the page went from 336 to 742 server-rendered words, with 11 `inert` panels.

### 3.10 — No security response headers

The site shipped none. Five added in [next.config.ts](next.config.ts): HSTS, `nosniff`, `Referrer-Policy`, `X-Frame-Options` and `Permissions-Policy`. Deliberately no CSP — an untested CSP is a way to break a site quietly, and Next's inline hydration scripts need a nonce or hash strategy. It is on the launch checklist below, not in the config.

### 3.11 — Repo hygiene

`_raw/` (6.8 MB of captured legacy WordPress markup) and `assets/_theme-demo-unused/` were not ignored. Both are research artefacts; neither is source, and the theme-demo assets are not licensed for this business. Both added to `.gitignore`.

---

## 4. What was checked and found correct

Stated because a report that only lists faults implies the rest was not examined.

- **112 image URLs across all ten pages** — every one resolves, every one has alt text, every one has explicit dimensions or a reserved aspect ratio. Zero CLS by construction.
- **Duplicate DOM ids** — none, on any page.
- **One `h1` per page** — all ten.
- **SEO layer** — reviewed titles and descriptions per route, length-guarded at build time, keyword cannibalisation checked at build time, a connected JSON-LD `@graph` per page, and a structured-data audit that fails the build if an uncleared client name reaches markup. This is better than most commercial sites ship.
- **The client-name permission gate** — four portfolio jobs are named-client work awaiting written permission. The sector ships instead of the name, on screen and in JSON-LD, and the build fails if that is ever violated. Correct, and left alone.
- **The empty-testimonials contract** — `clientTestimonials` is deliberately an empty array, and the band renders the founder's own words instead. Populate it with real permissioned quotes and the grid appears with no further work. Correct, and left alone.
- **Reduced motion** — enforced in three independent places (Framer's `MotionConfig`, a CSS brake keyed off both the OS setting and the site's own toggle, and `Parallax`/`Float` rendering no transform at all). Verified.
- **No-JavaScript** — every reveal carries `data-motion`, and a `<noscript>` rule in the layout undoes the hidden state Framer writes into the server markup. Without it a JS failure would leave the site blank. Verified present.
- **Accessibility fundamentals** — skip link, focus-visible treatment, focus trap and focus return on the mobile drawer, body-scroll lock, 44px minimum tap targets, `aria-current` on active navigation, contrast ratios documented per token.
- **Legacy redirect map** — seventeen WordPress URLs mapped to the closest page that answers the same question, each destination justified in a comment.

---

## 5. Content and structure, page by page

| Page | Words | Images | CTAs | Revealed elements | Bands |
|---|---|---|---|---|---|
| Home | 1,114 | 21 | 19 | 75 | 10 |
| Portfolio | 824 | 35 | 15 | 51 | 4 |
| FAQ | 742 | 2 | 22 | 30 | 3 |
| About | 608 | 5 | 17 | 40 | 6 |
| Services | 387 | 8 | 17 | 27 | 4 |
| Products | 356 | 11 | 17 | 29 | 3 |
| Contact | 289 | 2 | 20 | 16 | 2 |

Contact's word count is low by design — it is a form, and every word between a visitor and the form costs a completion. Products at 356 is the one genuinely thin page.

---

## 6. Before the domain is pointed

Everything below needs a decision from the studio. None of it is a code defect, and none of it can be resolved from inside the repository.

### Must resolve

1. **The phone number.** `lib/site.ts` carries a `TODO`: three different numbers are live on the current site. One of them is published across every page of this build. Confirm the canonical one — two of the three are silently dropping enquiries today.
2. **The response-time promise.** "Most briefs are answered the same working day" now appears beside every call to action, and on the FAQ. It is marked placeholder in `lib/site.ts`. Confirm it or change it; it is a commitment.
3. **The four studio statistics.** `studioStats` — 2017, 1,200+ jobs a year, 48-hour digital turnaround, 9 binding formats — are marked "confirm with the studio". The 48-hour figure is also quoted in the FAQ.
4. **Enquiry delivery.** Set `ENQUIRY_WEBHOOK_URL`, or `RESEND_API_KEY` plus `ENQUIRY_TO_EMAIL` and `ENQUIRY_FROM_EMAIL`. With neither set, the route validates and logs but returns `delivered: false`, and the form correctly falls back to WhatsApp and email rather than claiming a success. **A lead should not depend on that fallback.**
5. **Legal review.** The three policy pages are written against what the code does and are accurate on that. They are not legal advice. Specifically outstanding: retention periods in the privacy policy, and every commercial number deliberately left out of the terms — deposit percentage, quantity tolerance, payment window, liability cap, the period for raising a defect. Those are the studio's to set; inventing one would put a figure on the website that the invoices contradict.

### Should resolve

6. **Client permissions.** Four portfolio jobs are ready to name their client the moment written permission is on file — a one-field edit per job (`clientCleared: true`). Named work is worth considerably more than a sector label.
7. **Social profiles.** `siteConfig.social` holds bare domains (`https://instagram.com/`). The schema layer already filters these out of `sameAs` rather than asserting the business *is* the Instagram homepage — but a printing studio with no linked Instagram is leaving its best shop window closed.
8. **Real testimonials.** The band is built and waiting. Three permissioned quotes would fill it.
9. **Per-service detail.** Stock weights, minimum quantities and lead times per discipline. This is the difference between the Services page at 8.8 and at 10.
10. **A Content-Security-Policy.** Needs one deploy to test against.

### Optional

11. **Products page depth.** 356 words across nine formats. A second sentence per format, or one worked example, would lift the thinnest page on the site.
12. **Dead components.** `sections/home/capabilities.tsx`, `hero-canvas.tsx`, `hero-scene.tsx`, `sections/shared/quote-strip.tsx` and `placeholder-media.tsx` are unreferenced. `hero-canvas` and `hero-scene` are marked superseded in their own barrel file. Harmless — they are tree-shaken out of the build — but they are the next reader's confusion.

---

## 7. Deployment readiness

| | |
|---|---|
| `next build` | Passes — 24 routes, 0 errors |
| `tsc --noEmit` | Passes |
| ESLint | Passes, 0 warnings |
| Shared JS, first load | 103 kB |
| Heaviest route | `/portfolio`, 177 kB |
| Static routes | 23 of 24 |
| Dynamic routes | 1 — `/api/quote`, correctly `force-dynamic` |
| Required env vars | None. `NEXT_PUBLIC_SITE_URL` has a correct production default |
| Optional env vars | `ENQUIRY_WEBHOOK_URL`, `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL` |
| Staging protection | `robots.ts` serves `Disallow: /` on any origin other than the production host — preview deployments cannot be indexed |
| Apex → www | Handled in `next.config.ts`, so the guarantee travels with the app |

The build is deployable to Vercel as it stands. See §6 item 4 before treating the quote form as live.

---

*Companion document: [MOTION_AUDIT.md](MOTION_AUDIT.md).*
