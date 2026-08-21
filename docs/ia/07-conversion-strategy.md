# 07 · Conversion Strategy

The current site converts by accident. The highest-intent page has no form. The quote form is a popup with no field labels and no spam protection. Two of three published phone numbers are silently dropping calls. Nothing on the site states a turnaround, a price range, a minimum order, or a response time.

Fixing that is worth more than every visual decision in this architecture combined.

---

## 1. The funnel

```
                    ARRIVE
        Search · GBP · referral · WhatsApp forward
                       │
                       ▼
                   ORIENT          ── "Do they do my thing, and are they near me?"
        Hero · pillars · credibility strip
                       │
        ▲              ▼
        │          UNDERSTAND      ── "Which option is right for me?"
    return      Comparison · configurator · specs
     visit          │
        │           ▼
        │        VALIDATE          ── "Can I trust them with this job?"
        │    Work · about · process · FAQ · reviews
        │           │
        └───────────┤
                    ▼
                 CONVERT
        Call · WhatsApp · Sample · Quote · Spec download
                    │
                    ▼
                 RESPOND           ── the step the site cannot do, and the one that decides everything
        SLA · confirmation · follow-up
```

Three of these five stages have **no content on the current site at all**: Understand (no specs, no comparisons), Validate (no work, no real testimonials, no facility), and Respond (no stated SLA, no confirmation experience).

---

## 2. Conversion targets

| Action | Share of conversions (target) | Where it happens |
|---|---|---|
| WhatsApp | 40% | Sticky bar, contact page, catalogue detail |
| Call | 25% | Sticky bar, header, footer |
| Quote form | 25% | `/quote/`, conversion blocks |
| Sample request | 8% | Materials, packaging, binding |
| Spec download | 2% | Process, capability pages |

**WhatsApp and phone are the majority.** Any strategy that optimises the form while treating the phone number as a footer detail is optimising the minority channel. Which is the current site's exact mistake — three numbers, none of them primary.

---

## 3. The quote form

The single most valuable component on the site. It replaces a popup whose fields have neither labels nor placeholders.

### Structure — three steps, contact last

```
┌─ Step 1 · What do you need? ──────────────────┐
│                                                │
│  Service      ⟨Printing⟩ ⟨Packaging⟩ ⟨Binding⟩ │  large tap targets,
│                          ⟨Other⟩               │  pre-selected from context
│                                                │
│  Product      [ Business cards          ▾ ]    │  filtered by service
│  Quantity     [ 500                        ]   │  numeric keypad
│                                                │
│                              ⟨ Continue ⟩      │
└────────────────────────────────────────────────┘

┌─ Step 2 · Details (all optional but the date) ─┐
│  Size · Pages or ply · Finish                  │
│  Required by     [ date picker ]               │
│  Artwork         [ Upload — PDF, AI, up to 25MB ]│
│  Anything else   [ textarea ]                  │
│                              ⟨ Continue ⟩      │
└────────────────────────────────────────────────┘

┌─ Step 3 · How do we reach you? ────────────────┐
│  Name*  ·  Mobile*  ·  Email  ·  Company       │
│                                                │
│  ⟨ Send my request ⟩                           │
│  We reply within one working day.              │
│  Prefer to talk? WhatsApp us →                 │
└────────────────────────────────────────────────┘
```

The field set matches what the business already collects — Name, Mobile, Email, Service, Requirements — reordered so that **the buyer describes the job before being asked who they are**. Someone who has specified a product and a quantity has invested; asking for a phone number at that point feels like the natural next step rather than a toll gate.

### Rules

| Rule | Reason |
|---|---|
| Real `<label>` on every field, always visible | Current forms rely entirely on placeholders, which fail accessibility and vanish on typing |
| Required: name and mobile only | Every additional required field costs completions |
| `type="tel"` with `inputmode="numeric"`, `type="email"`, `autocomplete` on all | Wrong keyboard on mobile is a measurable drop-off |
| One step per screen on mobile, progress visible | Prevents the scroll-wall of a 6-field form on a 360px screen |
| Inline validation **on blur**, not on keystroke | Validating mid-typing reads as nagging |
| Errors name the fix | "Enter a 10-digit mobile number", not "Invalid" |
| Honeypot + timing check + rate limit | The current forms have no spam protection of any kind |
| State persists across steps and across a back-tap | A lost form is a lost lead |
| Never a disabled submit | Validate on submit and explain |
| Context pre-filled and **visible** | "Binding → Hard case → Rexin, gold foil", editable |
| Contact Form 7 removed | Loaded on every page today, used nowhere |

### Where the lead goes

Email to `sales@`, plus a WhatsApp notification to the canonical number, plus a persisted record. A lead that exists only as an email in one inbox is a lead that gets lost — and this business already loses calls to two dead phone numbers.

---

## 4. The sample kit

The strongest conversion asset available to a printing business, and one the current site does not offer at all.

| Property | Decision |
|---|---|
| What | Physical pack: paper stocks, cover materials (PU leather, rexin, special sheets), finish samples (spot UV, foil, emboss, lamination), a flute cross-section, a bound miniature |
| Ask | Name, mobile, delivery address, and one qualifying line — "what are you working on?" |
| Cost framing | Free within Chennai; a nominal courier charge outstation, stated up front |
| Placement | Primary CTA on `/materials/`, `/packaging/`, `/binding/`; secondary on every material-heavy capability page |
| Follow-up | A call once it is delivered. The sample is a reason to speak, which is the actual point. |

A buyer who requests a sample has told you their segment, their job, and their address. It is the highest-quality lead type on the site, and it asks for less commitment than a quote.

---

## 5. Trust ladder

The conversion problem here is not layout, it is **evidence**. The site currently claims "From Start-Ups to Big Brands" with nothing behind it, and carries seven fabricated testimonials in the CMS.

| Level | Signal | Status | Where |
|---|---|---|---|
| 1 | Real address, map, hours, canonical phone | **Fixable now** — data exists, publication does not | Contact, footer, schema |
| 2 | GST / registration number | Needs collecting | Footer |
| 3 | Founder story with a photograph | Story exists, photo does not | About, home |
| 4 | Facility and press photography | Two usable shots exist; needs a shoot | About, process |
| 5 | Machine and capability list | Needs collecting | Process |
| 6 | Specs, MOQs, turnaround published | Needs writing | Every capability page |
| 7 | Case studies with named clients | **Nothing exists** | Work |
| 8 | Genuine testimonials | **All seven on file are fabricated and must be deleted** | Home, capability pages |
| 9 | Client logo wall | Needs permission | Home, about |
| 10 | Google reviews | Needs a review programme | Home, contact |

**Levels 1–6 are within the redesign's control and cost nothing but effort.** Levels 7–10 are content-collection projects that run in parallel; the components for them are built and ship **empty-state-first** — rendering nothing rather than rendering invented people.

> Publishing fabricated testimonials attributed to named individuals carries real exposure under Indian consumer protection rules on misleading advertising. Deleting the seven existing records is urgent and independent of the redesign.

---

## 6. Objection map

Every objection a print buyer has, and the section that answers it. If an objection has no section, the buyer leaves and calls a competitor.

| Objection | Answered by | Template |
|---|---|---|
| "Do they do my specific product?" | Catalogue grid + search | T2, T3 |
| "Can they handle my quantity?" | Key specs — quantity range, MOQ | T3 |
| "Will it be ready in time?" | Turnaround slot + `/process/` timeline table | T3, T7 |
| "Which option should I choose?" | Comparison table + "Compared to" section | T2, T3 |
| "What will it look and feel like?" | Configurator, material viewer, sample kit | T3, T5 |
| "Have they done this before?" | Case studies | T6 |
| "Are they a real business?" | Address, map, hours, GST, facility photography | T7, T8 |
| "Will they understand my design needs?" | The existing FAQ — "I am an Individual. Will You do my design?" — promoted, not buried | T1, T9 |
| "Can I change the design later?" | Existing FAQ on revisions, expanded | T9 |
| "What do I have to supply?" | Artwork requirements + downloadable spec | T7 |
| "What will it cost?" | Honest framing on `/quote/`: no public pricing, but a stated response time | T8 |
| "Is my exam material safe with them?" | Confidentiality section | `/printing/digital-black-white/` |

---

## 7. Response and follow-up

The conversion does not complete on the site. Half of the value of this architecture is destroyed by a slow reply.

| Stage | Commitment | Surfaced where |
|---|---|---|
| Instant | Automated acknowledgement with a reference number | Thank-you page + email |
| Within 1 working day | A human reply with a quote or a clarifying question | Stated under every form and CTA |
| Same day | WhatsApp replies during business hours | Stated on `/contact/` |
| Out of hours | The form still works; the SLA is restated relative to opening | Contact + thank-you |

**Publish the SLA, then meet it.** A stated one-working-day reply is a differentiator in this market precisely because nobody publishes one.

---

## 8. Measurement

Nothing can be optimised that is not instrumented. The current site has no conversion tracking at all.

### Events

| Event | Fires on | Properties |
|---|---|---|
| `cta_click` | Any CTA | label, rung, template, page, position |
| `call_tap` | `tel:` link | source surface |
| `whatsapp_tap` | WhatsApp link | source surface, context payload |
| `quote_start` | Step 1 rendered | entry page, pre-filled context |
| `quote_step` | Each step completed | step number, time on step |
| `quote_submit` | Successful submission | service, product, quantity band, has-date, has-upload |
| `quote_abandon` | Exit with a partial form | last step, last field touched |
| `sample_request` | Sample submission | materials selected |
| `spec_download` | PDF download | which spec |
| `configurator_interact` | First material or option change | capability, option |
| `configurator_share` | Configuration URL copied | configuration |
| `search_query` | Search submitted | query, result count |
| `search_no_result` | Zero results | **query — read this weekly; it is a free list of what the catalogue is missing** |
| `catalogue_filter` | Filter applied | pillar, filter |
| `scene_load` | 3D scene initialised | capability, device tier, time to interactive |
| `scene_fallback` | Static poster retained | reason (tier, reduced motion, error) |

### Health metrics

| Metric | Why it matters |
|---|---|
| Quote form completion rate, by step | Locates the exact field that loses people |
| Contact taps per session on mobile | The real conversion rate for journeys A and E |
| Sessions reaching a capability page | Whether the nav routes correctly |
| Configurator interaction → quote rate | Whether 3D earns its budget. **If it does not, cut the scene.** |
| Search no-result rate | Catalogue and synonym gaps |
| LCP on real 4G sessions | Premium that loads slowly is not premium |
| Scene fallback rate | What share of the audience never sees the 3D at all |

That fourth row is the honest test of this entire architecture. 3D is justified in the audit because print is tactile and photographs cannot convey it — but the justification has to survive contact with the data.

---

## 9. Launch-week fixes that convert on their own

Independent of design, build, or 3D. These are worth doing on the current site this week.

1. **Resolve the three phone numbers to one.** Two are dropping enquiries today.
2. **Put a form on the contact page.** The highest-intent page on the site is currently a dead end.
3. **Delete the seven fabricated testimonials.** Legal exposure.
4. **Delete the nine Lorem Ipsum posts and the four orphan pages**, including `/home-ai-2/` — a complete AI-course landing page, publicly indexable, belonging to another business entirely.
5. **Publish a privacy policy** and fix the footer link that currently points at `/404`.
6. **Publish business hours and the address in the footer.**
7. **Write 24 title tags and meta descriptions.** Every one is missing; every title is `Page Name – Thoorigaiprints`.
8. **Add alt text to the images in use.** All 155 media records have empty alt attributes.
9. **Claim and complete the Google Business Profile**, with the canonical number, hours, and photographs.
10. **Start an Instagram account.** For a business selling visual craft, its absence is the largest marketing gap on the site.
