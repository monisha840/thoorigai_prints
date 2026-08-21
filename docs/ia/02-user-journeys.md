# 02 · User Journeys

Five primary journeys, derived from the catalogue the business actually sells. The old site supports none of them: every path ends at a photograph with a two-word label, and the highest-intent page on the site — `/contact-us/` — is a 106-character address block with no form.

Each journey below is written as **what the buyer is trying to find out**, not as a click path. The click path follows from it.

---

## The audience, as the catalogue reveals it

Nobody wrote a persona for this business, but 43 catalogue items tell you who walks in the door.

| Segment | Evidence in the catalogue | What they buy | Decision speed |
|---|---|---|---|
| **Local SME / start-up** | Business cards, brochures, flyers, menus, labels, identity cards, stickers | Small runs, fast, price-led | Hours to days |
| **Institution** (school, college, university) | Question papers, answer sheets, certificates, convocation files, book scanning | Bulk, deadline-locked, confidential | Weeks, committee-approved |
| **Publisher / self-publishing author** | Books, print on demand, perfect binding, hard case, board books, book covers | Repeat, spec-heavy, quality-led | Weeks |
| **Brand / retail** | Rigid boxes, telescope lids, drawer style, magnetic boxes, gift boxes, paper bags | Premium unit cost, sampling required | Months, sample-gated |
| **Corporate / hospitality** | Leather menus, bill pouches, calendars, greeting cards, presentation samples | Seasonal, recurring | Days to weeks |

Two things are true of all five: they are in **Chennai or nearby**, and they are **on a phone**. The architecture assumes a mid-range Android on mobile data as the default device, not the exception.

---

## Journey A · The urgent local buyer

> "I need 500 business cards by Friday. Who can do it and what will it cost?"

**Segment:** SME / individual · **Entry:** Google "printing press near me Royapettah", Google Business Profile, WhatsApp forward
**Device:** Phone, overwhelmingly · **Session budget:** Under 90 seconds before they call the next result

| Step | Where | What they need to see | What kills the journey today |
|---|---|---|---|
| 1 | Search result | A title that says printing **and** Chennai | All 24 title tags read `Page Name – Thoorigaiprints`; no location intent, no meta description |
| 2 | Landing (Home or capability page) | "Yes, we do that. Here. Fast." | Two competing H1s, neither of which names the city or the service |
| 3 | Scan | Proof of turnaround, proof of location | Turnaround is never stated anywhere on the site |
| 4 | Act | Tap to call or WhatsApp, without reading | Three different phone numbers are live; two of them are silently losing these calls |

**Designed path**

```
Search → Home or /printing/digital-multicolour/
      → Sticky action bar visible on first paint
      → [Call] or [WhatsApp] — no form, no page change
```

**Architectural requirements**

- The sticky mobile action bar is present on **every** page, from first paint. Call and WhatsApp are one tap, never behind a menu.
- One canonical phone number, read from a single `siteConfig` value by every `tel:` link, the WhatsApp handoff, the footer, and the LocalBusiness schema.
- Turnaround language appears on every capability page in a fixed slot ("Typical turnaround: 3–5 working days for standard runs"). Approximate is fine; absent is not.
- WhatsApp deep links carry page context, so the buyer's first message already says what they were looking at. The buyer types nothing.

**Success:** a tap on Call or WhatsApp within 30 seconds. This journey does not convert on a form and should never be asked to.

---

## Journey B · The specification-driven buyer

> "Perfect binding or hard case? What holds up? What does it cost per unit at 500?"

**Segment:** Brand manager, marketing lead, procurement · **Entry:** Search on a technique term, or a referral
**Device:** Researched on phone, quoted on desktop · **Session budget:** 4–10 minutes across two or three visits

This is the journey the redesign is built for, and the one the current site fails most completely. `/binding/` carries 417 characters across 28 headings and 22 images, and explains **nothing** about when to choose which method.

| Step | Where | Question in their head | Section that answers it |
|---|---|---|---|
| 1 | `/binding/` | "What are my options?" | Comparison table + the 3D binding comparison scene |
| 2 | `/binding/hard-case/` | "What does it look like in PU leather against rexin, with gold foil?" | **Material configurator** — the highest-value 3D element on the site |
| 3 | `/materials/` | "What is spot UV actually going to look like?" | Finish close-ups under real-time lighting |
| 4 | Catalogue detail | "What sizes, what page counts, what MOQ?" | Spec block — fixed fields, every item, no exceptions |
| 5 | `/work/` | "Have they done this for someone like me?" | Case study with the spec stated |
| 6 | `/quote/` | "Price it." | Quote form pre-filled with the product they were looking at |

**Designed path**

```
Search → Pillar hub → Capability page → Configurator → Spec block
      → [Request a sample]   ← the real conversion for this segment
      → /quote/ pre-filled   → /quote/thank-you/
```

**Architectural requirements**

- Every capability page carries a **spec block with fixed fields**: sizes, stocks, page-count range, finishes, MOQ, turnaround. Fixed fields mean the buyer learns the pattern once and reads every subsequent page in five seconds.
- The configurator's state is **URL-encoded**, so a buyer can send "this one, in rexin, gold foil" to a colleague or back to themselves. It costs nothing and it is how B2B decisions actually get made.
- **Request a sample** ranks above Get a Quote on every material-heavy page. A print buyer who is holding the board has already chosen the supplier.
- Every 3D configuration maps to something the shop can actually produce. Rendering an unbuildable combination is worse than showing nothing.

**Success:** a sample request or a quote submission carrying a named product and a configuration.

---

## Journey C · The institutional bulk buyer

> "We need 4,000 answer booklets and 900 convocation files, printed under confidentiality, delivered on a fixed date."

**Segment:** College administrator, exam cell, procurement officer · **Entry:** Search, tender research, word of mouth
**Device:** Desktop-leaning, but the first look is on a phone · **Session budget:** Long, multi-visit, multi-person

The catalogue proves this business already serves this segment — question papers, answer sheets, certificates, convocation files, book scanning — and the site says nothing about it whatsoever.

| Step | Question | Where it must be answered |
|---|---|---|
| 1 | "Do they handle exam-grade confidentiality?" | A dedicated section on `/printing/digital-black-white/` naming secure handling and sealed delivery |
| 2 | "Can they hit a fixed date at volume?" | `/process/` — the scheduling and capacity story, plus the machine list |
| 3 | "Are they a real, findable business?" | `/about/` and `/contact/` — full NAP, GST number, hours, map, facility photography |
| 4 | "Can I send this to my head of department?" | Every page shareable with a real OG image; a quote page that is a **URL**, not a popup |
| 5 | "What are the commercial terms?" | Quote form with a volume tier and a required-by date |

**Designed path**

```
Search → /printing/digital-black-white/ → /process/ → /about/
      → share the URL internally
      → /quote/ (volume tier + required-by date + file upload)
```

**Architectural requirements**

- `/quote/` is a **real, indexable, linkable page**. The old site's Elementor popup cannot be linked from an email, an ad, or a tender document — which is exactly how this segment moves.
- The quote form accepts a **file upload** and a **required-by date**. Institutions arrive with artwork and a deadline.
- GST and registration details in the footer. This segment checks.
- Business hours published. They currently appear nowhere on the site.

**Success:** a quote submission with a date and a volume, or a call from a landline.

---

## Journey D · The publisher and self-publishing author

> "220 pages, 300 copies. Perfect bound or hard case? What does the spine look like?"

**Segment:** Author, small press, academic · **Entry:** Search on "book printing Chennai", "print on demand books"
**Device:** Mixed · **Session budget:** Long and returning; this buyer reads everything

| Step | Question | Section |
|---|---|---|
| 1 | "Do they print books at my quantity?" | `/printing/` — run-length guidance, digital-vs-offset crossover stated as a number |
| 2 | "Which binding survives 300 pages?" | `/binding/` comparison — page-count thresholds as the primary axis |
| 3 | "What does the spine actually look like?" | **Perfect-bound spine cross-section** — 3D cutaway |
| 4 | "Can I see a real one?" | `/work/` — a case study on a printed book |
| 5 | "What do I have to give you?" | `/process/` — artwork spec, bleed, file format, proofing |
| 6 | "Start." | `/quote/` with page count and quantity fields |

**Architectural requirements**

- The **digital-vs-offset crossover is stated as a number**, not as a paragraph of hedging. "Under roughly 500 copies, digital. Above it, offset." That single sentence is the most useful thing the site can tell this buyer, and it currently appears nowhere.
- Page-count thresholds are the organising axis of the binding comparison, not the material.
- The artwork spec is a downloadable PDF, offered ungated with an optional "email it to me" — a gate on a spec sheet costs more leads than it captures.

**Success:** an artwork-spec download followed by a quote, usually in a later session. This journey is measured across visits, not within one.

---

## Journey E · The returning client

> "Same as last time, but 200 more."

**Segment:** Anyone already on the books · **Entry:** Direct, WhatsApp, phone
**Device:** Phone · **Session budget:** Seconds

The site's job here is to get out of the way.

**Designed path**

```
Direct → Home → sticky action bar → WhatsApp
```

**Architectural requirements**

- WhatsApp is a **first-class channel**, not a floating plugin badge. It is the fastest reorder path this business has, and the widget currently points at a number that appears nowhere else on the site.
- The homepage never traps a returning visitor in an onboarding narrative. Contact is one tap from the first viewport.

---

## Cross-journey flow map

```
                       ┌────────────────────────────────┐
   Search ─────────────►         ENTRY SURFACES         │
   Google Business ────►  Home · Pillar · Capability    │
   Referral / WhatsApp ►  Case study · Journal · 404    │
                       └───────────────┬────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
                 ORIENT            UNDERSTAND          VALIDATE
            What do they do?    Which option is     Can I trust them?
            Pillar hubs         right for me?       /work/ · /about/
            Catalogue grid      Capability pages    /process/ · FAQ
                                Configurator        Reviews · logos
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       ▼
                            ┌──────────────────────┐
                            │   CONVERSION LADDER  │
                            │                      │
                            │  Call / WhatsApp     │  ← hot · journeys A, E
                            │  Request a sample    │  ← warm · journey B
                            │  Request a quote     │  ← qualified · B, C, D
                            │  Download spec sheet │  ← cold · journey D
                            └──────────┬───────────┘
                                       ▼
                              /quote/thank-you/
                       (next step + response SLA stated)
```

---

## Friction removed, journey by journey

| Friction on the current site | Journey blocked | Fix |
|---|---|---|
| Three live phone numbers | A, E | One canonical number, one source of truth |
| No form on the contact page | All | Form on `/contact/` and a standalone `/quote/` page |
| Quote exists only as a popup | B, C, D | Real URL — indexable, linkable, shareable |
| No turnaround stated anywhere | A, C | Fixed turnaround slot on every capability page |
| No specs, sizes, stocks, or MOQ | B, C, D | Mandatory spec block, identical fields sitewide |
| No evidence of delivered work | B, C, D | `/work/` case studies |
| No business hours, no map, no GST | A, C | Published on `/contact/`, in the footer, and in schema |
| Every child page duplicates its parent | B, D | Each capability page owns one technique and one decision |
| Blog orphaned and full of Lorem Ipsum | — | Deleted; `/journal/` ships only when real articles exist |
| No social proof of any kind | All | Trust components built, rendered only when real content exists |

---

## Entry-point coverage

Search does not send everyone to the homepage. Roughly three quarters of sessions on a site like this land on an interior page, so **every** template is an entry point and must self-orient.

| Landing template | Must answer within one viewport | Must offer |
|---|---|---|
| Home | Who, what, where | Quote + Call |
| Pillar hub | What sits under this pillar | Capability links + Quote |
| Capability page | What this technique is, who it suits, what it costs to start | Sample + Quote |
| Catalogue detail | Specs and the parent capability | Quote (pre-filled) |
| Case study | The job, the spec, the outcome | "Start a job like this" |
| Journal article | The answer to the question they searched | Related capability + Quote |
| 404 | Where they are, and the three pillars | Search + pillar links |
