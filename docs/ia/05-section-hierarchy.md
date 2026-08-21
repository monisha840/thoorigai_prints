# 05 · Section Hierarchy

Section-by-section blueprints for all ten templates. **Order is the mobile order** — desktop only ever widens or pairs these blocks, it never reorders them.

## Reading the tables

| Column | Meaning |
|---|---|
| **Section** | Name and heading level |
| **Job** | The single question this section answers. A section with two jobs gets split. |
| **Content** | What has to exist for it to render |
| **3D** | Whether a scene lives here, and what it must prove |
| **CTA** | The action offered, if any |

**Sitewide section rules**

1. One `<h1>` per page, in the first section. Sections are `<h2>`; nothing skips a level. (The old site: one page has two H1s, twenty-three have none, and the entire About story is inside five `<h5>` tags.)
2. Vertical rhythm `--s-8` (64px) mobile → `--s-10` (128px) desktop. Hero and 3D showcase sections get `--s-11`.
3. Every section is either full-bleed **or** inside the content measure. Never a half-measure inset — that is the visual signature of a page builder.
4. A section with no copy does not ship. The old homepage has a "Technology We Possess" heading with nothing beneath it; that is the failure mode being designed out.
5. Amber appears at most twice per viewport.
6. Every 3D section has a static poster that is what actually loads first.

---

## T1 · Home

The current homepage is a 60-heading contents page. The replacement is a **narrative** that routes: what we do → proof we can → what we make → how it works → who we are → act.

| # | Section | Job | Content | 3D | CTA |
|---|---|---|---|---|---|
| 1 | **Hero** `h1` | "Who is this and what do they do?" | One H1 naming service + Chennai. One supporting line. Two CTAs. | Static poster of the press; the scroll sequence's first frame | Get a quote · See our work |
| 2 | **Credibility strip** | "Are they real?" | 4 facts: years, jobs delivered, in-house capabilities, Chennai. Numbers only — no icons, no cards. | — | — |
| 3 | **Three pillars** `h2` | "Do they do my thing?" | Printing · Packaging · Binding. One image, one sentence, one link each. | — | Per-card link |
| 4 | **Press sequence** `h2` | "Can they actually make it?" | Scroll-linked: plate → press → finishing → bound product. Four captions, one per stage. Fills the empty "Technology We Possess" section. | **Signature scene.** Priority 2 of 6. Poster-first, desktop and Tier A/B mobile only. | Our process → |
| 5 | **Catalogue preview** `h2` | "What exactly can I order?" | 8 tiles from the 43, filter chips above | — | See all products |
| 6 | **Materials teaser** `h2` | "How premium does this get?" | 3 finishes: foil, spot UV, emboss. Real-time lighting is the point. | **Finish close-up.** Priority 6, low effort. | Explore materials |
| 7 | **Founder** `h2` | "Who am I dealing with?" | Mr. R. Ambeth, 15+ years, quality control → finishing and binding specialist. Portrait + 60 words. | — | About us |
| 8 | **Commitments** `h2` | "Why them over the next result?" | The four existing pillars — Leading Technology, Best Designs, On Time Delivery, Affordable Price — each with its one real sentence, rewritten | — | — |
| 9 | **Work** `h2` | "Show me delivered jobs." | 3 case studies. **Hidden entirely until real case studies exist.** | — | See all work |
| 10 | **Client logos** `h2` | Backs the "From Start-Ups to Big Brands" claim | Logo wall. **Hidden until logos and permission exist.** | — | — |
| 11 | **FAQ** `h2` | Removes the last objection | The four real FAQs, accordion. Fifth row links to `/faq/`. | — | All questions |
| 12 | **Conversion block** `h2` | "Start." | Quote form (3 fields) or a CTA pair, address, hours, map thumbnail | — | Get a quote · WhatsApp |

**Cut from the old homepage:** the six duplicate product grids (they are the catalogue now), the second H1, the "Get Started Now" heading with no content, and the theme-demo imagery.

---

## T2 · Pillar hub

Three instances. A hub's job is **routing**, not selling — the sale happens one level down.

| # | Section | Job | Content | 3D | CTA |
|---|---|---|---|---|---|
| 1 | **Hero** `h1` | Name the pillar and the decision it involves | H1 + one lead paragraph + breadcrumb | Static featured image | Get a quote |
| 2 | **Section chips** | Orientation on a long page | Sticky scroll-spy | — | — |
| 3 | **Overview** `h2` | "What does this pillar cover?" | 150–200 words. This is the copy the current hubs do not have. | — | — |
| 4 | **Choose your method** `h2` | **The decision.** The most important section on the page. | Comparison table: method × the axis that actually decides it | **Binding only at launch:** four books in one scene, page-count thresholds appearing on scroll. Priority 3. | Per-row link |
| 5 | **Capability cards** `h2` | Route to the right technique | One card per capability: image, name, one sentence, spec highlight | — | Per-card |
| 6 | **Catalogue grid** `h2` | "Do you make the specific thing I need?" | Filterable, all items in this pillar | — | Detail overlay |
| 7 | **Materials** `h2` | "What can it be made from / finished with?" | Strip of the materials relevant to this pillar | Inherits the material viewer | Explore materials |
| 8 | **Process** `h2` | "How does ordering work?" | Four steps, condensed | — | Full process |
| 9 | **Work** `h2` | Proof | Case studies tagged with this pillar. Hidden until they exist. | — | See all work |
| 10 | **FAQ** `h2` | Pillar-specific objections | 3–4 questions, filtered from `/faq/` | — | — |
| 11 | **Conversion block** `h2` | Convert | Pillar-specific CTA | — | Quote · Sample |

**Per-pillar decision axis** — section 4 changes shape by pillar:

| Pillar | Comparison axis | Table columns |
|---|---|---|
| Printing | **Quantity** | Method · best run length · unit cost trend · turnaround · colour fidelity |
| Packaging | **What it protects and how it sells** | Type · strength · print surface · MOQ · typical use |
| Binding | **Page count** | Method · page range · lay-flat · spine printable · durability · cost |

---

## T3 · Capability page

Thirteen instances, and the biggest content lift on the site — these pages currently average 130 characters each.

| # | Section | Job | Content | 3D | CTA |
|---|---|---|---|---|---|
| 1 | **Hero** `h1` | Name the technique, in the buyer's words | H1 + lead + breadcrumb + eyebrow (pillar name) | Poster of this page's scene | Get a quote |
| 2 | **Key specs** | "Can they do my job at all?" — answered in 5 seconds | 4 pinned facts: size range · quantity range · turnaround · MOQ | — | — |
| 3 | **What it is** `h2` | Explain the technique | 120–180 words, plain language, no jargon without a gloss | — | — |
| 4 | **Interactive viewer** `h2` | **The reason 3D exists on this site.** Materials, structure, or cutaway. | Configurator / structural viewer / cutaway, per [04](04-page-hierarchy.md) | **Primary scene.** URL-encoded state. Static gallery fallback. | Request a sample |
| 5 | **Choose your options** `h2` | Make the variants orderable | Every variant as a spec row, not a photo grid | Selecting a row drives the viewer | — |
| 6 | **Full specification** `h2` | The procurement answer | Fixed fields: sizes · stocks and GSM · finishes · page/ply range · MOQ · lead time · artwork requirements | — | Download spec sheet |
| 7 | **Best for** `h2` | "Is this right for me?" | 3–4 use cases, named by segment, each linking to a catalogue item | — | — |
| 8 | **Compared to** `h2` | Handle the alternative honestly | Two-row comparison against the nearest sibling, including when to choose the other one | — | Sibling link |
| 9 | **Products** `h2` | "Which of my jobs uses this?" | Catalogue items using this technique | — | Detail overlay |
| 10 | **Work** `h2` | Proof | Up to two tagged case studies. Hidden until they exist. | — | — |
| 11 | **FAQ** `h2` | Last objections | 3 questions tagged to this capability | — | — |
| 12 | **Siblings** `h2` | Recover a wrong guess | "Also in {pillar}" — the other capabilities | — | — |
| 13 | **Conversion block** `h2` | Convert with context | Quote CTA carrying this capability as a parameter | — | Quote · WhatsApp |

Section 8 is the one buyers remember. Telling someone that centre pin is the wrong choice above 64 pages is what makes the rest of the page believable.

---

## T4 · Catalogue detail

A bottom sheet on mobile, a side panel on desktop, and a real static route when opened directly.

| # | Section | Content |
|---|---|---|
| 1 | **Media** | Item photography. Under 700px assets are capped at tile size and never enlarged. |
| 2 | **Name + parent** | Item name, `h2`; link to the capability that makes it |
| 3 | **Description** | 40–60 words. **Gate: no description, no detail view.** |
| 4 | **Spec block** | Sizes · stock · finish options · MOQ · turnaround |
| 5 | **CTA row** | Get a quote (pre-filled) · WhatsApp about this |
| 6 | **Related** | Three items from the same capability |

---

## T5 · Showcase — `/materials/`

The dedicated home for 3D, so the technique does not get scattered thinly across the site.

| # | Section | Job | 3D | CTA |
|---|---|---|---|---|
| 1 | **Hero** `h1` | "Print is a material. Here it is." | Hero surface under moving light | — |
| 2 | **Papers and boards** `h2` | Stock selection | Swatch viewer: GSM, texture, opacity | — |
| 3 | **Cover materials** `h2` | Hard case decision | PU leather · rexin · special sheets, side by side | Request a sample |
| 4 | **Finishes** `h2` | **The upsell.** Invisible in flat photography. | Spot UV · foiling · emboss · lamination, under real-time lighting | Request a sample |
| 5 | **Board and flute** `h2` | Corrugated spec, explained visually | Cutaway: ply count, flute profiles | — |
| 6 | **Sample kit** `h2` | Convert the whole page | — | Request the sample kit |

Every viewer state names a real, orderable material and links to the capability that uses it.

---

## T6 · Editorial

### `/work/` index

Hero (`h1` + lead) → filter chips (pillar · segment) → case study grid → conversion block.
**Empty state is a designed state:** if no case studies exist, the page does not launch and the nav item does not render.

### Case study

| # | Section | Content |
|---|---|---|
| 1 | Hero | Client, job, one-line outcome, hero image |
| 2 | Specs at a glance | Quantity · size · stock · finish · binding · turnaround |
| 3 | The brief | 100–150 words |
| 4 | What we did | 200–300 words, with production detail |
| 5 | Gallery | 4–6 images |
| 6 | Services used | Tags linking to every capability involved |
| 7 | Client quote | Real, attributed, with permission. Omitted if absent. |
| 8 | Conversion | "Start a job like this" → quote pre-filled with these services |

### `/journal/` index and article

Standard index and long-form article: hero, meta, measure-capped body at 68ch, one contextual capability link in the body, related articles, conversion block.
**Ships only when at least three genuine articles exist.** All nine current posts are Lorem Ipsum and are deleted, not migrated.

---

## T7 · Narrative

### `/about/`

The story is good and the markup is broken — five consecutive `<h5>` tags carrying the whole page, no H1, zero images.

| # | Section | Content | Gate |
|---|---|---|---|
| 1 | Hero `h1` | "Chennai's trusted name in print" + lead | — |
| 2 | Founder | Mr. R. Ambeth: quality control → finishing and binding specialist → founder. 200 words as **prose**. | **Portrait photograph** |
| 3 | Timeline | Founding → capability milestones → today | **Founding year: copy claims both 2010 and 2017. Resolve before writing.** |
| 4 | Facility | Press floor, finishing line, machine list | **Facility photography** |
| 5 | Commitments | The four pillars, expanded | — |
| 6 | Numbers | Years · jobs · capabilities · clients | Verified figures |
| 7 | Conversion | Contact-led, not quote-led | — |

### `/process/`

| # | Section | Content | 3D |
|---|---|---|---|
| 1 | Hero `h1` | "From your file to your delivery" | — |
| 2 | Six steps | Enquiry → quote → artwork → proof → print → finish → deliver | Reuse of the homepage press sequence |
| 3 | Artwork requirements | Bleed, resolution, colour mode, file formats | — |
| 4 | Proofing | Digital vs press proof, and what each catches | — |
| 5 | Turnaround | Typical timelines by job type — a table, not prose | — |
| 6 | Machinery | The real machine list. Fills the site's longest-standing empty heading. | Equipment photography |
| 7 | Delivery | Chennai coverage, outstation, packing | — |
| 8 | Conversion | Get a quote | — |

---

## T8 · Conversion

### `/quote/`

Three steps, one screen at a time on mobile. Progress is always visible.

| Step | Fields | Why |
|---|---|---|
| 1 · What | Service (Printing / Packaging / Binding / Other) → product → quantity | Pre-filled when arriving from a capability or catalogue page. The buyer's first interaction is a tap, not typing. |
| 2 · Details | Size · pages/ply · finish · required-by date · artwork upload · notes | Everything optional except the date. Institutions arrive with a deadline. |
| 3 · You | Name · mobile · email · company (optional) | Contact last — the buyer has already invested |

Right rail (desktop) / collapsed summary (mobile): what happens next, the response SLA, the phone number, and WhatsApp as the alternative. Every field has a **real `<label>`** — the current forms rely entirely on placeholders, and the quote popup has neither labels nor placeholders.

### `/contact/`

The current page is 106 characters of address split across six `<h4>` tags, with no form, no email, and no map.

Hero `h1` → **enquiry form** (name · mobile · email · message) → direct channels (call, WhatsApp, email, each one tap) → address block with landmark and a real map → business hours → "prefer a full quote?" → `/quote/`.

### `/quote/thank-you/`

Confirmation · what happens next, with the SLA in hours · reference number · the WhatsApp shortcut if it is urgent · three links back into the site. Conversion tracking fires here.

---

## T9 · Document

`/faq/` — hero, category filter, accordion groups (Ordering · Artwork · Printing · Binding · Packaging · Delivery · Payment), a "still stuck?" conversion block. Twelve questions minimum, built out from the four that exist. `FAQPage` schema.

Legal — hero, last-updated date, sticky table of contents, body at 68ch measure, contact block. `/privacy-policy/` is new and is a compliance gap until it exists.

---

## T10 · Utility

`/404/` — "This page has moved or never existed" · search field · three pillar cards · "Or tell us what you need" → `/quote/`. A 404 receiving traffic from the 20+ retired URLs deserves to be a real page.

`/search/` — query field, grouped results (Services · Products · Materials · Answers), empty state showing the pillars and top items, no-match state routing to `/quote/` with the query carried over.

---

## Section frequency

How often each block type appears, which is also the component build priority:

| Block | Instances | Priority |
|---|---|---|
| Conversion block | Every page | 1 |
| Hero (4 variants) | Every page | 1 |
| Spec block | 13 capability + 43 catalogue | 1 |
| Catalogue grid + card | 3 hubs + 13 capabilities | 1 |
| Section chips | ~20 | 2 |
| Comparison table | 3 hubs + 13 capabilities | 2 |
| FAQ accordion | ~18 | 2 |
| Case study strip | ~18 | 3 (blocked on content) |
| 3D viewer shell | ~10 | 3 |
| Material strip | ~8 | 3 |
| Logo wall | 2 | 4 (blocked on content) |
