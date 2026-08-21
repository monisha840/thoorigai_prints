# 06 · CTA Strategy

The current site offers three calls to action — *Request Callback*, *SUBMIT*, and *See Our Works* — of which one is a verb with no object, one is a form button shouting in caps, and one points at work that does not exist. The quote CTA opens a popup that cannot be linked, indexed, or returned to. Three different phone numbers are live.

This document defines a **single CTA ladder**, applied identically on every template.

---

## 1. The ladder

Five actions, ranked by the commitment they ask for. A page offers the action that matches where the buyer is, and never more than one primary at a time.

| Rung | Action | Commitment | Serves | Channel |
|---|---|---|---|---|
| 5 | **Call** | Highest — synchronous, right now | Urgent local buyer, returning client | `tel:` |
| 4 | **WhatsApp** | High but casual — the default business channel in Chennai | Everyone; the fastest reorder path | Deep link with page context |
| 3 | **Get a quote** | Medium — a form, 60–90 seconds | Specification buyer, institution, publisher | `/quote/` |
| 2 | **Request a sample** | Low — an address and a reason | Material-led buyers: rigid boxes, hard case, finishes | `/quote/?intent=sample` |
| 1 | **Download the spec sheet** | Lowest — no contact required | Researching publisher, designer preparing artwork | PDF, ungated |

**Counter-intuitive but correct:** *Request a sample* converts higher than *Get a quote* on material-heavy pages while asking for less. A print buyer holding the board has effectively chosen the supplier. It is rung 2 by commitment and rung 1 by commercial value on those pages.

---

## 2. Hierarchy rules

| Rule | Detail |
|---|---|
| **One primary per viewport** | One filled amber button in view at a time. Two primaries is a page that has not decided what it wants. |
| **Amber is the primary CTA and almost nothing else** | The accent is the conversion signal. Spending it on decoration spends the signal. |
| **Secondary is a hairline button** | 1px `--rule` border, ink text, transparent fill |
| **Tertiary is a text link with an arrow** | `Explore materials →`. The arrow moves 4px on hover. |
| **The sticky CTA does not count** | It is chrome, not content. But when a section's own primary scrolls into view, the sticky bar's primary demotes to secondary so they never compete. |
| **Never two CTAs of equal weight side by side** | Pair a filled primary with a hairline secondary, or with a text link |
| **The conversion block closes every page** | Non-negotiable. Every page ends with a way to act. |

### Visual weight

```
PRIMARY      ┌──────────────────────┐   filled --amber, ink-dark label
             │    Get a quote       │   48px mobile / 44px desktop
             └──────────────────────┘   --r-md · 600 weight

SECONDARY    ┌──────────────────────┐   1px --rule border, --ink label
             │  Request a sample    │   transparent fill
             └──────────────────────┘

TERTIARY       Explore materials →      --ink-muted → --ink on hover
                                        arrow translates 4px
```

---

## 3. CTA by template

| Template | Primary | Secondary | Sticky bar | Notes |
|---|---|---|---|---|
| **Home** | Get a quote | See our work | Call · WhatsApp · Quote | Secondary hidden until case studies exist |
| **Printing hub** | Get a quote | Compare digital & offset | Call · WhatsApp · Quote | Quantity is the decision, so quote leads |
| **Packaging hub** | Request a sample | Get a quote | WhatsApp · Sample · Quote | Material-led buyers |
| **Binding hub** | Request a sample | Compare binding types | WhatsApp · Sample · Quote | Material-led buyers |
| **Capability page** | Get a quote *(this capability)* | Request a sample | Contextual bar (below) | Both carry the capability as a parameter |
| **Catalogue detail** | Get a quote *(this item)* | WhatsApp about this | — (inside sheet) | Never a bare "Enquire" |
| **Materials** | Request the sample kit | Get a quote | WhatsApp · Sample | The whole page argues for the sample |
| **Work index** | Start a job like this | Get a quote | Call · WhatsApp · Quote | |
| **Case study** | Start a job like this | See more work | Call · WhatsApp · Quote | Pre-fills with the services used |
| **Process** | Get a quote | Download artwork spec | Call · WhatsApp · Quote | Spec download is the low-commitment exit |
| **About** | Contact us | See our work | Call · WhatsApp · Contact | Quote is wrong here — nobody buys off an About page |
| **Contact** | Send enquiry | Call / WhatsApp | Hidden — the page *is* the CTA | |
| **Quote** | Continue / Submit | WhatsApp instead | Hidden | Nothing may compete with the form |
| **Thank you** | See our process | Follow on Instagram | Call · WhatsApp | Also offers the urgent WhatsApp shortcut |
| **FAQ** | Ask us directly | Get a quote | Call · WhatsApp · Quote | |
| **Journal article** | Get a quote | Read next | Call · WhatsApp · Quote | Plus one contextual capability link in the body |
| **404** | Search | Get a quote | Call · WhatsApp | |

---

## 4. The sticky action bar

The single most important conversion surface on the site, because the audience is on a phone.

### Default

```
┌───────────────────────────────────────────────┐
│   📞 Call     💬 WhatsApp     ⟨ Get a quote ⟩ │
└───────────────────────────────────────────────┘
```

### Contextual, on capability and catalogue pages

```
┌───────────────────────────────────────────────┐
│  Hard case binding                            │
│  From 8 materials · MOQ 50                    │
│   💬 WhatsApp        ⟨ Quote this ⟩           │
└───────────────────────────────────────────────┘
```

The context bar states **what** is being quoted. "Quote this" with the product named above it converts better than a generic quote button, because it removes the buyer's fear of landing in a blank form.

| Behaviour | Rule |
|---|---|
| Appears | Immediately, on first paint. Never on a delay, never on scroll depth. |
| Hides | While the menu sheet, search overlay, or a modal is open; while a form field is focused (the keyboard owns that space) |
| Demotes | When a section's own primary CTA is in view, the bar's primary becomes secondary |
| Desktop | The bar does not render. The header CTA and in-page conversion blocks cover it. |
| Height | 64px + `env(safe-area-inset-bottom)` |
| Contrast | `--paper-raised` at 90% with backdrop blur, 1px top hairline. Never a solid slab. |

---

## 5. Microcopy

Every label is a verb plus an object. The buyer must never have to guess what happens next.

| Context | Label | Never |
|---|---|---|
| Primary conversion | **Get a quote** | "Submit", "Enquire", "Click here", "Get A Quote" in title case |
| On a capability page | **Quote hard case binding** | "Get a quote" alone, when context exists |
| Sample | **Request a sample** | "Free sample!" |
| Materials page | **Request the sample kit** | "Order samples" |
| Phone | **Call +91 XXXXX XXXXX** | "Call us" — showing the number lets people save it |
| WhatsApp | **WhatsApp us** | "Chat now" |
| Form step | **Continue** → **Send my request** | "Submit" |
| Spec download | **Download the artwork spec (PDF, 240 KB)** | "Download" |
| Case study | **Start a job like this** | "Contact us" |
| Comparison | **Compare binding types** | "Learn more" |
| Catalogue | **See specs** | "View details" |

**Supporting line under a primary CTA** — one line, always concrete:
*"We reply within one working day. No obligation."*

That sentence does more for conversion than any button styling. The current site makes no promise about response time anywhere.

---

## 6. Placement

| Position | Rule |
|---|---|
| **Hero** | Primary + secondary. Above the fold on mobile without scrolling, at 360px width. |
| **After the decision section** | The comparison table or configurator is where intent peaks — a CTA goes immediately below it, not four sections later |
| **After the spec block** | The buyer who read the specs is qualified; catch them there |
| **Mid-page** | At most one, and only on pages over 1,200 words |
| **Page foot** | The conversion block, on every page |
| **Sticky** | Always, on mobile |

**Maximum four CTA instances per page**, excluding the sticky bar and the nav. Beyond that, each one is worth less than the one before it.

---

## 7. Context passing

Every CTA carries what the buyer was looking at. This is the mechanism that makes the quote form feel like a continuation instead of a fresh start.

| From | To | Carries |
|---|---|---|
| Capability page | `/quote/` | `?service=binding&capability=hard-case` |
| Configurator | `/quote/` | `?service=binding&capability=hard-case&material=rexin&finish=gold-foil` |
| Catalogue item | `/quote/` | `?service=printing&item=business-cards` |
| Materials | `/quote/` | `?intent=sample&materials=foil,spot-uv` |
| Case study | `/quote/` | `?services=offset-multicolour,perfect-binding` |
| Search no-match | `/quote/` | `?notes={query}` |
| Any page | WhatsApp | Pre-composed first message naming the page and configuration |

The quote form renders these as **editable, pre-filled values with a visible summary**, never as hidden fields. The buyer sees "Binding → Hard case → Rexin, gold foil" at the top of the form and can change it. Hidden context feels like tracking; visible context feels like service.

---

## 8. Prohibited

| Pattern | Why |
|---|---|
| Entry popups and exit-intent overlays | The old site's quote CTA is an Elementor popup; that is the pattern being removed, not restyled |
| Countdown timers, fake scarcity | Wrong for B2B print, and corrosive to a premium position |
| "Free quote!!" and exclamation marks | The tagline already carries two doubled exclamation marks; the redesign drops them |
| Chat widgets that auto-open | WhatsApp is opt-in, always |
| CTAs that scroll to a form on the same page without focusing the first field | Half a navigation |
| Any CTA whose destination is `#` | Two nav items currently do exactly this |
| Disabled submit buttons | Validate on submit and explain, never pre-block |
| Asking for an email before offering anything | The spec sheet is ungated |

---

## 9. Conversion-block variants

The block that closes every page. Four variants, chosen by page intent.

| Variant | Used on | Composition |
|---|---|---|
| **Full** | Home, hubs | Heading, one line, quote form (3 fields), address, hours, map thumbnail |
| **Split** | Capability, materials, case study | Left: heading + primary CTA. Right: direct channels with the number visible |
| **Inline** | Catalogue detail, FAQ | Single row: one line of copy + primary CTA |
| **Quiet** | About, legal, journal | Text link with an arrow. A legal page does not need a filled amber button. |
