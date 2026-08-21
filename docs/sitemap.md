# Sitemap - thoorigaiprints.com (existing site)

Captured 21 August 2026 from `wp-sitemap.xml`, the WordPress REST API (`/wp-json/wp/v2/pages`), and the rendered navigation markup.

**Totals:** 25 pages (24 in the public sitemap, 1 hidden), 9 blog posts, 7 testimonial records, 1 category, 1 tag.

---

## 1. Navigation structure (as presented to the visitor)

This is what the header menu implies:

```
Home
Printing                            /printing/
├── Digital                         (group label, href="#", not clickable)
│   ├── Digital Multicolour         /digital-multicolour/
│   └── Digital Black and White     /digital-black-and-white/
└── Offset                          (group label, href="#", not clickable)
    ├── Offset Multicolour          /offset-multicolour/
    └── Offset Black and White      /offset-black-and-white/
Packaging                           /packaging/
├── Corrugation Box                 /corrugation-box/
├── Carton Box                      /carton-box/
└── Paper Bag                       /paper-bag/
Binding                             /binding/
├── Hard Case                       /hard-case-binding/
├── Perfect                         /perfect-binding/
├── Wiro                            /wiro-binding/
└── Center Pin                      /center-pin/
About Us                            /about-us/
Contact Us                          /contact-us/
[Get A Quote]                       /#quote   (button)
```

A second **Get A Quote** control in the header opens an Elementor popup (ID 4761) instead of navigating.

---

## 2. Actual page hierarchy in WordPress

**The site is completely flat.** Every one of the 25 pages has `parent: 0` in the CMS, and every URL sits directly at the domain root. The three-level structure the menu presents exists only in the menu widget.

```
/
├── /printing/
├── /digital-multicolour/
├── /digital-black-and-white/
├── /offset-multicolour/
├── /offset-black-and-white/
├── /packaging/
├── /corrugation-box/
├── /carton-box/
├── /paper-bag/
├── /binding/
├── /hard-case-binding/
├── /perfect-binding/
├── /wiro-binding/
├── /center-pin/
├── /about-us/
├── /contact-us/
├── /blog/
├── /terms-conditions/
├── /cookie-policy/
├── /sample-page/              (orphan)
├── /demo-design-system/       (orphan)
├── /maintenance/              (orphan)
├── /home-ai-2/                (orphan)
├── /home/                     (duplicate of the front page)
└── /login-customizer/         (hidden, excluded from sitemap)
```

**Why this matters for the redesign:** search engines read `/carton-box/` as a root-level page of equal standing to `/packaging/`, so the eleven child pages compete with their own parents rather than reinforcing them. Because each child duplicates the parent's content, the parent hub pages are the ones most likely to lose. Nesting the URLs (`/packaging/carton-box/`) and setting real parent relationships would consolidate that authority.

---

## 3. Complete URL inventory

### Live commercial pages (17)

| URL | Page | Menu location | Last modified |
|---|---|---|---|
| `/` | Home | Nav item 1 | 2025-05-16 |
| `/printing/` | Printing | Nav item 2 | 2025-05-11 |
| `/digital-multicolour/` | Digital Multicolour | Nav, under Printing > Digital | 2025-05-11 |
| `/digital-black-and-white/` | Digital Black and White | Nav, under Printing > Digital | 2025-05-11 |
| `/offset-multicolour/` | Offset Multicolour | Nav, under Printing > Offset | 2025-05-11 |
| `/offset-black-and-white/` | Offset Black and White | Nav, under Printing > Offset | 2025-05-11 |
| `/packaging/` | Packaging | Nav item 3 | 2025-05-16 |
| `/corrugation-box/` | Corrugation Box | Nav, under Packaging | 2025-05-11 |
| `/carton-box/` | Carton Box | Nav, under Packaging | 2025-05-11 |
| `/paper-bag/` | Paper Bag | Nav, under Packaging | 2025-05-11 |
| `/binding/` | Binding | Nav item 4 | 2025-05-17 |
| `/hard-case-binding/` | Hard Case Binding | Nav, under Binding | 2025-05-17 |
| `/perfect-binding/` | Perfect Binding | Nav, under Binding | 2025-05-17 |
| `/wiro-binding/` | Wiro Binding | Nav, under Binding | 2025-05-17 |
| `/center-pin/` | Center Pin | Nav, under Binding | 2025-05-11 |
| `/about-us/` | About Us | Nav item 5 | 2025-05-11 |
| `/contact-us/` | Contact Us | Nav item 6 | 2025-05-17 |

### Content pages (2)

| URL | Page | Menu location | Note |
|---|---|---|---|
| `/blog/` | Blog index | **not in nav** | Renders 6 of 9 posts |
| `/category/uncategorized/` | Category archive | not in nav | Every post is uncategorised |

### Legal pages (2)

| URL | Page | Menu location |
|---|---|---|
| `/terms-conditions/` | Terms & Conditions | Footer legal menu |
| `/cookie-policy/` | Cookie Policy | Footer legal menu |
| `/404` | "Privacy Page" target | Footer legal menu - **broken link, no privacy policy exists** |

### Orphan and staging pages (6) - reachable and indexable, not linked from anywhere

| URL | What it is | Recommendation |
|---|---|---|
| `/home-ai-2/` | A complete AI-course landing page from the theme demo, titled "Landing Copy". 6,233 characters of copy about AI training, with pricing sections and course highlights. Nothing to do with printing. | **Delete** |
| `/demo-design-system/` | The theme's internal design-system reference: colour swatches, type scale, button states. 11 forms on the page. | Set private or delete |
| `/sample-page/` | WordPress default sample page, still carrying the stock "I'm a bike messenger by day" placeholder text. | **Delete** |
| `/maintenance/` | Theme demo maintenance splash, displaying a third-party AI logo. | **Delete** |
| `/home/` | A second copy of the front page at its own URL. | Redirect to `/` |
| `/login-customizer/` | Plugin page, excluded from the sitemap. | Leave; keep noindex |

### Blog posts (9) - all Lorem Ipsum placeholder content

| URL | Title |
|---|---|
| `/post01/` | 10 ways how to lorem ipsum glavrida dolor amet |
| `/post02/` | Lorem ipsum dolor sit consectetur adipiscing elit |
| `/post03/` | How lorem ipsum amet glavrida dolor |
| `/post04/` | How to make lorem ipsum dolor sit glavrida |
| `/post05/` | Why amet lorem dolor glavrida agestas |
| `/post05-2/` | Tempor incididunt ut labore et dolore magna aliqua |
| `/post07/` | Dolor sit amet - consectetur adipiscing |
| `/post08/` | Consectetur adipiscing elit sed do eiusmod tempor |
| `/post09/` | Best ways to glavrida amet ipsum |

Note the numbering gap: there is no `post06`, and `post05` and `post05-2` are separate posts.

### Testimonial records (7) - all theme demo content

Published under the custom post type slug `testiminials` (misspelled, and the misspelling is in every permalink).

| URL | Attributed name |
|---|---|
| `/testiminials/testimonial011/` | Simon Thomas |
| `/testiminials/testimonial012/` | Maria Rodriguez |
| `/testiminials/testimonial013/` | Alex Thompson |
| `/testiminials/testimonial014/` | Alexandra Swift |
| `/testiminials/testimonial015/` | Gregory Bailey |
| `/testiminials/testimonial016/` | James Green |
| `/testiminials/testimonial017/` | Diana Kovalenko |

Numbering starts at 011, so records 001-010 were presumably deleted. None of the seven render on the public site.

---

## 4. Footer link structure

```
Brand column      Logo, tagline, phone, email
Links column      About Us · Printing · Packaging · Binding
Legal column      Terms & Conditions · Cookie Policy · Privacy Page (→ /404)
CTA column        "Contact us for your custom needs." + Get A Quote (popup 22422)
Bottom bar        © Copyright 2025 Thoorigaiprints.com · All Rights Reserved
```

The footer omits Home, Contact Us, and the Blog entirely.

---

## 5. Structural observations for the redesign

1. **Flatten-vs-nest.** The URL structure contradicts the navigation. Decide on one hierarchy and make the CMS, the URLs, and the breadcrumbs agree.
2. **Eleven child pages have no reason to exist in their current form.** Each renders its parent's grid verbatim. Either give each one genuine unique content or fold them into anchored sections of the parent hub.
3. **No breadcrumbs anywhere**, on a site that is nominally three levels deep.
4. **The blog is orphaned from the navigation** while still being crawlable and full of placeholder text.
5. **Six pages should not be public at all.** `/home-ai-2/` in particular is a full landing page for an unrelated business.
6. **No privacy policy exists**, yet the footer links to one. This is a compliance gap, not just a broken link.
7. **No search**, no sitemap page for humans, and no 404 page design.
8. **The `testiminials` slug typo is permanent** in the current permalinks. The redesign is the moment to fix it, with redirects.
9. **Nothing has been modified since 17 May 2025** - roughly fifteen months of no updates.

---

## 6. Proposed target structure (for discussion, not yet implemented)

```
/
├── /printing/
│   ├── /printing/digital-multicolour/
│   ├── /printing/digital-black-white/
│   ├── /printing/offset-multicolour/
│   └── /printing/offset-black-white/
├── /packaging/
│   ├── /packaging/corrugation-box/
│   ├── /packaging/carton-box/
│   ├── /packaging/paper-bag/
│   └── /packaging/rigid-boxes/          ← new; premium range currently has no page
├── /binding/
│   ├── /binding/hard-case/
│   ├── /binding/perfect/
│   ├── /binding/wiro/
│   └── /binding/center-pin/
├── /portfolio/                          ← new; no case studies exist today
├── /about/
├── /contact/
├── /get-a-quote/                        ← new; a real page, not only a popup
├── /blog/
└── /privacy-policy/                     ← new; currently a 404
```

Any URL change needs 301 redirects from the existing flat paths.
