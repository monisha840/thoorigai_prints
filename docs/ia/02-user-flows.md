# 02 · User Flows

## Audience

Four buyer types, drawn from the business's own claim — "Our clients include Individuals, Small Scale business, MSMEs to Big Brands" — and from what the existing catalogue actually sells.

| Persona | Wants | Decides on | Typical entry |
|---|---|---|---|
| **The individual** | One job done well: a wedding invite, a convocation file, a thesis bound | Price, speed, "will you help me with the design?" | Long-tail search, WhatsApp, referral |
| **The small business owner** | Visiting cards, brochures, menus, stickers — recurring small runs | Turnaround, convenience, consistency | Local search: "visiting card printing chennai" |
| **The MSME buyer** | Cartons, corrugated boxes, labels at volume | MOQ, unit price, reliability, capacity | Category search, comparison across vendors |
| **The brand / agency** | Rigid boxes, foiling, hard case binding — premium finish work | Craft quality, material range, proof of past work | Referral, portfolio, Instagram |

The old site served none of them well: the individual's question is answered only in a homepage FAQ, the MSME buyer gets no MOQ or capacity information anywhere, and the brand buyer gets thumbnails instead of a portfolio.

---

## The conversion model

There is no e-commerce here. **Every path resolves to one of four contact actions**, and the IA's job is to keep all four permanently within reach without cluttering the page.

| Action | Weight | Where it lives |
|---|---|---|
| **Get a quote** | Primary | Persistent header CTA, `/quote/`, every page's closing band |
| **WhatsApp** | Primary on mobile | Floating action button, contact page, quote page |
| **Call** | Primary on mobile | Tap-to-call in the mobile action bar, contact page |
| **Email** | Secondary | Footer, contact page |

**One canonical phone number.** The audit found three live numbers — footer, header `tel:` link, and the WhatsApp widget all different. All four actions read from a single `siteConfig` value.

---

## Flow 1 · Discovery → Quote (the primary path)

The journey the site is optimised for. Most traffic will be search-led onto a Tier 2 page, not the homepage.

```
                  ┌─────────────────────────────────────────┐
                  │  ENTRY                                  │
                  │  Organic search · Ads · Referral · Social│
                  └────────────────┬────────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
    ┌───────────┐          ┌──────────────┐         ┌──────────────┐
    │   Home    │          │ Pillar hub   │         │ Capability   │
    │           │          │ /binding/    │         │ /hard-case/  │
    └─────┬─────┘          └──────┬───────┘         └──────┬───────┘
          │                       │                        │
          │  scroll: three        │  scroll: what it is,   │  scroll: specs,
          │  pillars, proof,      │  capability grid,      │  3D configurator,
          │  process, CTA         │  materials, CTA        │  use cases, CTA
          │                       │                        │
          └───────────┬───────────┴────────────┬───────────┘
                      ▼                        ▼
             ┌─────────────────┐      ┌──────────────────┐
             │ Catalogue item  │      │  Materials       │
             │ detail overlay  │◄────►│  /materials/     │
             └────────┬────────┘      └────────┬─────────┘
                      │                        │
                      └───────────┬────────────┘
                                  ▼
                    ┌───────────────────────────┐
                    │  QUOTE                    │
                    │  /quote/ or inline sheet  │
                    │  prefilled with context   │
                    └─────────────┬─────────────┘
                                  ▼
                    ┌───────────────────────────┐
                    │  /quote/thank-you/        │
                    │  + WhatsApp escalation    │
                    └───────────────────────────┘
```

**The context-carry rule.** Whenever a quote is opened from a product, capability or material, the service and item are pre-selected and shown as a removable chip at the top of the form. A buyer who has just spent ninety seconds configuring a black rexin cover with gold foil should never re-type "hard case binding" into a dropdown.

```
Opened from /binding/hard-case/#rexin-gold-foil
   → QuoteSheet opens with:
        service: "Binding"            (locked chip, removable)
        item:    "Hard Case — Rexin, Gold Foil"  (chip)
        message: pre-seeded, editable
   → Buyer supplies: name, phone, quantity
```

That reduces the form to three required fields at the moment of highest intent.

---

## Flow 2 · The individual with one job

The most under-served visitor on the old site. Their real question — *"will you even take my small job, and will you help me design it?"* — is answered in one homepage FAQ and nowhere else.

```
Search "thesis binding chennai"  ·  or WhatsApp forward from a friend
        │
        ▼
  /binding/hard-case/
        │
        ├─ Reads: "Minimum order: 1" ← the decisive fact, stated in the spec strip
        │
        ├─ Sees: 3D configurator — picks PU leather, navy, gold foil
        │
        ├─ Reads: "No print-ready file? We design it for you." ← objection handled inline
        │
        ▼
  WhatsApp (primary) ─── or ─── QuoteSheet
        │
        ▼
  Conversation with a photo of the requirement
```

**Design consequences:**
- Every capability page states **minimum order quantity in the spec strip**, above the fold on desktop and immediately below the hero on mobile. "Minimum order: 1" is a conversion trigger for this persona and a disqualifier if hidden.
- The design-help offer appears on every capability page, not buried in a homepage accordion.
- WhatsApp outranks the form on mobile. This buyer wants a conversation, not a field set.

---

## Flow 3 · The volume buyer

Comparing three vendors in a browser tab each. Wins on facts, loses on vagueness — and the old site offered no MOQs, no capacity, no lead times anywhere.

```
Search "corrugated box manufacturer chennai"
        │
        ▼
  /packaging/corrugated-boxes/
        │
        ├─ SpecStrip:  MOQ · ply options · flute types · lead time · max size
        │
        ├─ 3D exploded cutaway: 3-ply vs 5-ply, flute profile ← explains in 3s
        │                        what a paragraph fumbles
        ├─ Capacity block: presses, daily output, delivery radius
        │
        ├─ /work/ ── case study: a comparable job at comparable volume
        │
        ▼
  QuoteSheet ── quantity field prominent, "bulk enquiry" toggle
        │
        ▼
  Thank-you + stated response time ("within 1 working day")
```

**Design consequences:**
- `SpecStrip` is a required component on every capability page. If the specs are not known, the page does not ship.
- The quote form's quantity field is a first-class input, not buried in a free-text message box.
- A stated response time on the thank-you page. Silence loses comparison shoppers.

---

## Flow 4 · The brand buyer

Judging craft. Will not fill a form until convinced. This is the visitor `/materials/` and `/work/` exist for.

```
Instagram · referral · agency shortlist
        │
        ▼
  /work/  ── portfolio index, filterable by pillar
        │
        ▼
  /work/{case-study}/  ── the problem, the spec, the finish, the outcome
        │
        ├──► /materials/  ── 3D finish viewer: spot UV, foil, emboss, lamination
        │                     real-time lighting, side-by-side comparison
        │
        ├──► /binding/hard-case/  ── configurator, 8 material variants
        │
        ▼
  Contact ── expects a person, not a form. Direct line + named contact.
```

**Design consequences:**
- `/work/` and `/materials/` must ship with genuine content or not at all. A portfolio with three stock photos is worse than no portfolio.
- The contact page offers a direct line and a named contact, not only a form.
- This flow tolerates — and rewards — the heaviest 3D on the site. It is also the flow most likely to arrive on desktop, which is where the full-fidelity tier runs.

---

## Flow 5 · Returning / direct

Someone who already knows the business. Optimise for speed to contact, not for persuasion.

```
Direct URL · saved WhatsApp thread · Google Business listing
        │
        ├──► Mobile action bar (always visible)  → Call · WhatsApp
        │
        ├──► /contact/  → map, hours, directions, canonical number
        │
        └──► /quote/    → shareable, linkable, returnable
```

**Design consequence:** the mobile action bar is persistent, not scroll-triggered. Two taps to a human from anywhere on the site.

---

## Entry-point matrix

Most visitors will not start at the homepage. Every Tier 2 page must therefore work as a standalone landing page — which the old duplicated child pages emphatically did not.

| Entry | Likely persona | Landing page must carry |
|---|---|---|
| `"visiting card printing chennai"` | Small business | Price signal, turnaround, sample grid, quote CTA |
| `"corrugated box manufacturer"` | MSME | MOQ, ply/flute specs, capacity, case study link |
| `"thesis binding near me"` | Individual | MOQ 1, design help, WhatsApp, location + hours |
| `"rigid box manufacturer chennai"` | Brand | Materials, finishes, portfolio, craft proof |
| Instagram profile link | Brand / individual | `/work/` — visual first, minimal chrome |
| Google Business listing | Returning / local | `/contact/` — map, hours, tap-to-call |
| Homepage, direct | Mixed | Three pillars within one scroll, clear routing |

**The standalone test:** every Tier 2 page must independently answer *what this is · what it costs to start · how long it takes · how to begin*. A page that only makes sense after reading its parent has failed.

---

## Failure and edge paths

| Situation | Handling |
|---|---|
| **404** | Designed page: search field, three pillar links, WhatsApp. Not the theme default. |
| **Old URL hit** | 301 per the [redirect map](01-sitemap.md#redirect-map); placeholder content returns 410. |
| **Form submission fails** | Inline error preserving all entered values, plus a WhatsApp fallback link carrying the message text. Never lose what the user typed. |
| **3D fails to load or WebGL unavailable** | Static poster render remains — the page never had a hole in it. No error shown; the user sees a photograph and the page still sells. |
| **Slow connection / Save-Data** | Tier C: no WebGL, static renders throughout, reduced image sets. |
| **`prefers-reduced-motion`** | All scroll-driven motion becomes an instant state change; 3D becomes a static poster with manual orbit only on tap. |
| **Search returns nothing** | Suggest the three pillars and offer WhatsApp — a print buyer's vocabulary rarely matches a catalogue's. |
| **JS disabled** | Every page renders and reads. Forms fall back to a native POST. 3D is absent by definition. |

---

## Instrumentation

Events the flows above depend on, so the model can be validated rather than assumed:

`quote_opened` (with `source_page`, `prefilled_item`) · `quote_submitted` · `whatsapp_clicked` · `call_clicked` · `configurator_interacted` (with `variants_tried`) · `material_viewed` · `spec_strip_expanded` · `case_study_viewed` · `3d_tier_assigned` (A/B/C) · `3d_load_failed`

The two that matter most: **`configurator_interacted` → `quote_opened`** proves whether the 3D investment converts, and **`3d_tier_assigned`** tells you what share of real traffic ever sees it. Instrument both before shipping the first scene, or the 3D budget becomes unfalsifiable.
