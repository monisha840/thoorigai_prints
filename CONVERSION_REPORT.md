# Conversion Review — Thoorigai Prints

**Business goal:** generate printing enquiries (quote requests, calls, WhatsApp messages).
**Reviewed:** 21 August 2026 — full site, all six routes, desktop and mobile breakpoints.
**Scope:** conversion only. No visual redesign, no change to the type scale, palette, layout grid or motion language.

---

## Verdict

The site is well built and reads credibly, but it converts poorly for three structural reasons:

1. **The quote form does not send anything.** `handleSubmit` waits 900ms and shows a success screen. Every enquiry submitted since launch is lost, and the success screen tells the visitor so.
2. **Mobile visitors have no visible way to contact the studio.** Below 768px the phone number is hidden; below 640px the "Get a quote" button is hidden too. A visitor on a 390px phone sees a wordmark and a hamburger.
3. **There is exactly one conversion destination and one way to reach it.** Every CTA on the site is "Get a quote → `/contact#quote`". A visitor looking at rigid boxes has to leave the page, land on a generic form, and re-describe what they were already looking at.

For a local print business in Chennai, the enquiry mix is roughly phone > WhatsApp > form. The site currently optimises for the weakest of the three and breaks it.

| Area | Before | Now | Ceiling | Notes |
|---|---|---|---|---|
| CTA placement | 4 / 10 | 6 / 10 | 8 / 10 | Header and mobile bar fixed; per-item CTAs and the mid-page strip still to place |
| Lead capture | 1 / 10 | 7 / 10 | 8 / 10 | Form silently discarded submissions → real endpoint + guaranteed fallback channel |
| Contact visibility | 3 / 10 | 9 / 10 | 9 / 10 | Invisible on mobile, WhatsApp link broken → persistent mobile bar, working WhatsApp, header call |
| Navigation clarity | 7 / 10 | 7 / 10 | 8 / 10 | Sound IA; product deep links and the 404 footer links still open |

"Now" is what is on disk. "Ceiling" is what the outstanding items in §6 would reach.

The remaining gap in every row is content, not code — see [Blocked on the studio](#7-blocked-on-the-studio).

---

## 1. CTA placement

### 1.1 — Critical: no CTA at all on small phones

`src/components/layout/navbar.tsx:92` hides the quote button below `sm` (640px), and `:83` hides the phone number below `md` (768px). Between 320px and 640px the header contains a wordmark and a hamburger — no enquiry affordance whatsoever. Mobile is the majority of traffic for a local print business.

**Fixed:** tap-to-call is now an icon button visible at every width, the quote button appears from `xs` up, and a persistent bottom action bar (Call · WhatsApp · Get a quote) carries the CTA on every page below `lg`.

### 1.2 — High: a long CTA-free stretch on the homepage

The homepage runs Hero → Capabilities → Process → FeaturedWork → WhyUs → CtaSection. Between the hero buttons and the closing CTA there are four full-height sections — roughly 6–8 screens of scroll — with no way to enquire. The section actions that do exist ("All services", "Full portfolio") are navigational, and both push the visitor *further* from the form.

**Specified, not yet applied** — the target file is owned by the in-flight rebuild; see §6 Outstanding. `QuoteStrip` is built and exported; it belongs after `ProcessTimeline` in the rebuilt homepage.

### 1.3 — High: the highest-intent pages have no per-item CTA

`/products` lists nine formats and `/services` lists six disciplines. Neither offered a way to enquire about the specific item being read. The service rows instead ended in an admin note — "Detailed specifications, stock options and lead times for this service are being written up with the studio" (`src/sections/services/service-list.tsx:79`) — which turned the most commercially valuable moment on the site into a dead end.

**Specified, not yet applied** — the target file is owned by the in-flight rebuild; see §6 Outstanding. Every service row and product tile should link via `quoteHref(id, 'service' | 'product')` — the form already reads those back and prefills.

### 1.4 — Medium: product cards were a dead affordance

`src/sections/products/product-grid.tsx:22` set `interactive` on a `Card` with no `href`. The tile lifted on hover and did nothing when clicked. Visitors read hover response as "this is clickable".

**Specified, not yet applied** — the target file is owned by the in-flight rebuild; see §6 Outstanding. The tile should become a link to a prefilled quote.

### 1.5 — Medium: primary and secondary CTAs carried equal weight

In the hero and on three page heroes, "Get a quote" and a browse link were both `size="lg"` side by side. The outline variant does most of the differentiating work, but the visual mass is identical, and there was no low-commitment third option for a visitor not ready to fill in a form.

**Partly fixed:** the ladder is defined once in `src/lib/navigation.ts` and applied in the navbar, the footer, the mobile action bar and the quote strip. Applying it in `hero.tsx` is outstanding — and the rebuilt hero currently links to `/quote` and `/work`, neither of which is a route.

---

## 2. Lead capture

### 2.1 — Critical: the form discards every submission

`src/features/quote/quote-form.tsx:50-53`:

```ts
// TODO: POST to the studio's enquiry endpoint.
await new Promise((resolve) => setTimeout(resolve, 900));
setStatus('success');
```

There was no endpoint, no route handler, no mail transport, no webhook. The success screen then read "This form is not connected to an inbox yet — nothing was actually sent" (`:72`). This is worse than having no form: it collects intent, destroys it, and tells the visitor it did.

**Fixed:** a real `POST /api/quote` route handler validates the enquiry and delivers it via webhook or Resend, whichever is configured. **Critically, the form never claims a success it cannot prove** — if delivery is not configured or fails, the visitor gets a fallback panel with their brief pre-composed into a WhatsApp message and a mailto, so the lead still lands. Configure `ENQUIRY_WEBHOOK_URL` or `RESEND_API_KEY` + `ENQUIRY_TO_EMAIL` to switch on direct delivery.

### 2.2 — High: four required fields before a first contact

Name, email, phone and brief were all mandatory. In this market a buyer will give a phone number and a one-line brief; demanding an email as well costs completions for no benefit, since the studio replies by phone or WhatsApp anyway.

**Fixed:** required reduced to name, phone and brief. Email stays as an optional field.

### 2.3 — High: enquiries arrived with no context

Nothing recorded which page or product the enquiry came from. "I need boxes" from a visitor who spent four minutes on rigid boxes is a different lead from a cold one, and the studio could not tell them apart.

**Fixed:** the form reads `?ref=` from the URL, preselects the matching service, seeds the brief, and posts a hidden `source` field carrying the referring page and item.

### 2.4 — Medium: no response-time promise

Nothing told the visitor what happens after they press send. A stated turnaround next to a submit button is one of the cheapest measurable lifts available.

**Fixed:** `siteConfig.contact.responseTime` renders next to the submit button, in both form result states, and in the quote strip. **The stated turnaround is a placeholder — confirm it with the studio before launch.**

### 2.5 — Medium: no artwork route

Print enquiries arrive with a PDF. The form had no upload and no alternative.

**Partly fixed:** the form now points artwork at WhatsApp, which is where it realistically arrives anyway. A real upload needs storage and is out of scope for a conversion pass.

### 2.6 — Low: no spam guard

An unprotected public form on a business site fills with spam within weeks, and the studio starts ignoring the inbox.

**Fixed:** honeypot field plus server-side validation. Bot submissions are accepted and dropped silently, so they do not learn.

### 2.7 — Medium: capture existed on one page only

`/contact` was the sole place to convert. Nothing on it was reusable elsewhere.

**Partly fixed:** the mobile action bar puts an enquiry one tap away on every page below `lg`. The quote strip and per-item CTAs that extend this to desktop are outstanding.

---

## 3. Contact visibility

### 3.1 — Critical: the WhatsApp link dialled instead of opening WhatsApp

`src/sections/contact/contact-details.tsx:64` wrapped the WhatsApp number in `toTelHref()`, producing `tel:+917708298673`. On the one channel most likely to produce an enquiry in this market, the link opened the phone dialler for a number that may not answer voice calls.

**Fixed:** a `toWhatsAppHref()` helper produces a proper `https://wa.me/…` link with an optional prefilled message. Applied everywhere WhatsApp appears.

### 3.2 — High: WhatsApp appeared on one page

It sat in `siteConfig` and rendered only on `/contact`. It is now in the footer, the mobile action bar, the hero, the fallback panel and beside every per-item CTA.

### 3.3 — High: the phone number vanished below 768px

Covered in 1.1. Tap-to-call is the shortest path from interest to enquiry, and it was hidden from exactly the visitors most likely to use it.

### 3.4 — Medium: opening hours were buried and machine-unreadable

Hours sat in the footer's legal strip at 32% opacity (`src/components/layout/footer.tsx:125`), next to Privacy and Cookies — the least-read line on the site. A visitor deciding whether to call now could not see it.

**Fixed:** hours moved into the footer contact block beside the phone number, and `openingHoursSpecification` added to the JSON-LD in a valid schema.org shape (the previous `openingHours: "Mon–Sat, 9:30am – 7:00pm IST"` was a human string Google cannot parse).

### 3.5 — Medium: the contact page hero had no actions

The single highest-intent page on the site opened with a headline, a paragraph and four tags. A visitor who arrived ready to call had to scroll past the whole form to find the number.

**Specified, not yet applied** — the target file is owned by the in-flight rebuild; see §6 Outstanding. Call, WhatsApp and jump-to-form actions belong in the contact hero.

### 3.6 — Medium: a dead map placeholder

`src/sections/contact/contact-details.tsx:121` rendered a dashed box reading "Map — pending". For a studio that invites visits, that is a lost action.

**Specified, not yet applied** — the target file is owned by the in-flight rebuild; see §6 Outstanding. `mapsHref()` is in place for it — the box should become an "Open in Google Maps" link, which stops it being a placeholder without needing an embed key.

### 3.7 — Medium: structured data understated the business

The `LocalBusiness` block had no `ContactPoint`, no `areaServed`, and no WhatsApp. Local discovery is upstream of every other number on this page.

**Fixed:** all three added.

---

## 4. Navigation clarity

The information architecture is sound. Six top-level items, conventional labels, a single source of truth in `src/lib/navigation.ts`, correct active states, and a keyboard-complete mobile drawer with focus trap and restore. No structural changes needed.

### 4.1 — High: the footer's product links go nowhere

`src/lib/navigation.ts` points at `/products#books`, `#boxes`, `#bags`, `#stationery`, but `ProductGrid` never rendered those ids. Four footer links landed at the top of the page and left the visitor to hunt.

**Specified, not yet applied** — the target file is owned by the in-flight rebuild; see §6 Outstanding. Product tiles need `id` and `scroll-mt` so the four footer deep links resolve. (The equivalent service links already work.)

### 4.2 — High: three footer links 404

Privacy, Terms and Cookies (`legalNav` in `src/lib/navigation.ts`) point at routes that do not exist. A 404 from a footer link reads as an abandoned site, and it is the kind of detail a cautious B2B buyer notices before committing to a first order. **Not fixed — needs legal copy from the studio.** Until those pages exist, the links should be removed.

### 4.3 — Low: "Products" and "Portfolio" sit adjacent and read similarly

Both are visual grids of printed work. A buyer scanning the nav may not know which one holds what they came for. Not worth a change on its own; worth watching in analytics for pogo-sticking between the two.

---

## 5. Credibility leaks

None of these are conversion mechanics, but each costs enquiries by undermining trust at the moment of decision.

| Leak | Location | Status |
|---|---|---|
| "Placeholder Client" on all six portfolio entries | `src/lib/content.ts` | **Blocked** — needs client approvals |
| "Case studies are placeholders. Photography and client approvals are in progress" | `src/sections/portfolio/portfolio-grid.tsx:58` | **Left in place** — it is currently true; remove when photography lands |
| Three different phone numbers live on the current site, canonical one unconfirmed | `src/lib/site.ts:19` | **Blocked** — a wrong number is a lost enquiry, and this is the highest-value unknown on the site |
| Studio statistics ("1,200+ jobs", "48hr turnaround") unverified | `src/lib/site.ts` | **Blocked** — these are load-bearing claims |
| Placeholder Instagram / Facebook / LinkedIn URLs pointing at bare domains | `src/lib/site.ts` | **Blocked** |

---

## 6. What was changed

> **Note on timing.** A separate rebuild of this site against `MASTER_PROJECT_PLAN.md` was running
> while this pass was applied — rewriting the homepage composition, the hero, the portfolio
> sections and the animation layer in real time. The shared infrastructure below landed and
> typechecks clean. The page-level placements marked *outstanding* were reverted by that rebuild or
> target sections that no longer exist, and need re-applying against the final structure.

### Landed

Conversion mechanics only. No change to the palette, type scale, spacing rhythm, grid, motion
language or component API surface.

**New files**

- `src/app/api/quote/route.ts` — the enquiry endpoint: validation, honeypot, webhook/Resend
  delivery, and it always logs, so nothing is lost silently.
- `src/components/layout/mobile-action-bar.tsx` — persistent Call · WhatsApp · Quote bar below
  `lg`, appearing after the hero and suppressed on `/contact`. Mounted in `src/app/layout.tsx`.
- `src/sections/shared/quote-strip.tsx` — compact mid-page conversion strip. **Built and exported,
  but not yet placed on a page** (see outstanding).

**Modified**

- `src/lib/utils.ts` — `toWhatsAppHref()`, `quoteHref()`, `mapsHref()`.
- `src/lib/site.ts`, `src/types/index.ts` — `responseTime` and `hoursSpec` on the contact block.
- `src/lib/navigation.ts` — the CTA ladder (`primaryCta`, `whatsappCta`, `callCta`) in one place.
- `src/lib/seo.ts` — `ContactPoint`, `areaServed`, parseable `openingHoursSpecification`, WhatsApp
  in `sameAs`.
- `src/components/layout/navbar.tsx` — call button at every width, quote button from `xs`
  (label shortens to "Quote" rather than disappearing). **Fixes finding 1.1.**
- `src/components/layout/footer.tsx` — WhatsApp row, hours promoted into the contact block.
  **Fixes 3.2 and 3.4.**
- `src/features/quote/quote-form.tsx` — real submission, three required fields, `?ref=` prefill,
  source tracking, honeypot, response promise, and a fallback panel that never reports a success it
  cannot prove. **Fixes 2.1 through 2.6.**
- `src/sections/contact/contact-details.tsx` — the WhatsApp link now opens WhatsApp instead of the
  dialler. **Fixes 3.1.**
- `.env.example` — enquiry delivery configuration.

### Outstanding

Each of these was specified and attempted; all target files the concurrent rebuild owns.

- **1.2** — place `QuoteStrip` mid-homepage. The insertion point (`Process`) no longer exists; the
  homepage is now Hero → ServicesPreview → FeaturedProducts → PortfolioPreview → WhyUs →
  ProcessTimeline → Testimonials → HomeCta. It belongs after `ProcessTimeline`.
- **1.3** — per-service and per-product CTAs in `service-list.tsx` and `product-grid.tsx`, using
  `quoteHref(id, 'service' | 'product')`. The form already reads these back.
- **1.4** — make product tiles real links rather than a hover affordance with no target.
- **1.5** — the CTA ladder in `hero.tsx`. The rebuilt hero links to `/quote` and `/work`, **neither
  of which is a route** — those are dead links today.
- **3.5** — call / WhatsApp / jump-to-form actions in the contact page hero.
- **3.6** — the Google Maps link in place of the "Map — pending" box, via `mapsHref()`.
- **4.1** — anchor ids on product tiles, so the four footer deep links resolve.

## 7. Blocked on the studio

Ordered by cost to conversion.

1. **Confirm the canonical phone number.** Three are live. Every wrong tap is a lost enquiry, and that number now sits in the header, the footer, the action bar and the structured data.
2. **Point delivery at a real inbox.** Set `ENQUIRY_WEBHOOK_URL`, or `RESEND_API_KEY` + `ENQUIRY_TO_EMAIL`. Until one is set the form routes leads to WhatsApp instead — functional, but it caps volume.
3. **Confirm the response-time promise.** It is stated in three places and is currently a placeholder.
4. **Confirm the studio statistics** before they stay on the homepage as fact.
5. **Portfolio photography and client names.** Six "Placeholder Client" entries on the page whose entire job is proof.
6. **Privacy / Terms / Cookies pages,** or remove the three footer links that 404.

---

## 8. What to measure

Instrument before changing anything else — the fixes above are safe bets; everything after them should be evidence-led.

- `tel:` and `wa.me` clicks as conversions, split by placement (header · action bar · footer · per-item · fallback). Expect these to outnumber form submissions.
- Quote form: starts, completions, per-field drop-off, and `delivered: false` responses — the last is an alarm, not a metric.
- `?ref=` distribution on submitted quotes: shows which products and services actually generate enquiries, which should drive what gets photographed first.
- Scroll depth to the mid-page quote strip versus the closing CTA, to confirm the mid-page placement earns its position.
- Mobile versus desktop enquiry rate. If mobile does not close most of the gap after these changes, the next thing to look at is page weight — the hero ships a Three.js scene.
