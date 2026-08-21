# Thoorigai Prints

The website for Thoorigai Prints — a printing, packaging and binding studio in
Royapettah, Chennai, running digital and offset presses since 2017.

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · React Three Fiber · Lucide.

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build` · `npm run start` · `npm run lint` · `npm run typecheck`

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` before deploying —
canonical URLs, OpenGraph, the sitemap and JSON-LD all read from it.

---

## What is here

The complete site. Ten routes, a full layout and component system, the motion
vocabulary, loading states, the SEO layer, an enquiry endpoint, and a lazily
loaded WebGL scene in the hero.

| Route | Page |
| --- | --- |
| `/` | Hero, clients, services, catalogue, showcase, work, why us, process, reassurances, CTA |
| `/services` | Six disciplines, anchored (`/services#offset`), each with its own quote link |
| `/products` | Nine formats, anchored (`/products#boxes`), with a jump index |
| `/portfolio` | Filterable work explorer, 35-plate gallery with lightbox |
| `/about` | Studio story, stats, process (`/about#process`), why us |
| `/faq` | Twelve questions, the site's single `FAQPage` node |
| `/contact` | Quote form, studio details, directions |
| `/privacy` `/terms` `/cookies` | Policy pages |

Plus `not-found`, an error boundary, route-level `loading` states, `sitemap.xml`,
`robots.txt`, per-route OpenGraph cards, twenty-one legacy redirects and an
apex to `www` host rule.

Two audit documents sit at the repository root and are the best place to start:
[WEBSITE_COMPLETENESS_REPORT.md](WEBSITE_COMPLETENESS_REPORT.md) and
[MOTION_AUDIT.md](MOTION_AUDIT.md). Section 6 of the first is the launch
checklist.

## Structure

```
src/
├── app/           Routes, layout, metadata, sitemap/robots, OG image
├── components/
│   ├── layout/    Navbar, MobileMenu, Footer, Container, Section
│   ├── ui/        Button, Heading, Card, Badge, Skeleton, PageLoader
│   ├── motion/    FadeUp, FadeIn, Stagger, Reveal, Parallax, Float,
│   │               MouseParallax, SectionSeam, ScrollProgress
│   └── three/     Scene, Camera, Lights, FloatingObject, lazyScene
├── sections/      Page-level compositions, one folder per route
├── content/       Editorial copy — home, clients, FAQ
├── features/      Self-contained features (quote form)
├── hooks/         useMediaQuery, useScrollPosition, useLockBodyScroll, …
├── lib/           utils, site config, navigation, SEO, content, portfolio,
│                  images, capability tiers, theme tokens
├── types/         Shared types and ambient declarations
├── styles/        globals.css — the Tailwind v4 theme lives here
├── providers/     MotionProvider, ScrollProvider (Lenis), AppProviders
├── animations/    Framer Motion variants and transitions
└── three/         R3F config: renderer, camera presets, light rig, materials
```

## Design system

**Colour.** Primary `#262236` (ink), secondary `#344F7C` (indigo), background
`#F6F6F3` (paper), accent `#C18546` (gold). Each is a full 50–950 ramp.

**Type.** Fraunces for display, Inter for UI and body, self-hosted by `next/font`.
The scale is fluid — `clamp()` from a mobile minimum to a desktop maximum — so no
size needs a breakpoint override.

Tokens are defined **twice, on purpose**:

- `src/styles/globals.css` — the `@theme` block. This *is* the Tailwind v4 config;
  every token in it generates utilities (`bg-ink-800`, `text-display-xl`, `xs:`,
  `ease-editorial`).
- `src/lib/theme/` — `colors.ts`, `typography.ts`, `animations.ts`. The same values
  for the places CSS cannot reach: Framer Motion, R3F materials, `themeColor` meta.

Change a value in one and change it in the other.

**Breakpoints.** `xs` 360 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536
· `3xl` 1792. Mobile first throughout; the navigation switches to a drawer below `lg`.

## Motion

Compose the wrappers in `components/motion/` rather than writing one-off animate
props — it keeps the tempo consistent and makes a global change a one-file edit.

```tsx
<FadeUp delay={0.1}>…</FadeUp>
<Stagger><StaggerItem>…</StaggerItem></Stagger>
<Reveal>Headline</Reveal>
```

`LazyMotion` with the `domAnimation` feature set is mounted once in
`providers/motion-provider.tsx`. **That means `m.*`, never `motion.*`** — the full
namespace is not loaded. `MotionConfig reducedMotion="user"` degrades every
transform variant to a plain fade when the OS asks for less motion, and
`globals.css` carries a matching CSS brake keyed off the site's own footer toggle
as well.

Smooth scrolling is Lenis, in `providers/scroll-provider.tsx`. It drives the real
`window.scrollY`, so `IntersectionObserver`, `useScroll`, the scrollbar, anchors
and find-in-page all keep working. It is never constructed on a coarse pointer and
is destroyed outright under reduced motion.

Motion is tiered by device: scroll and pointer parallax are desktop-only, and the
ambient float runs at full amplitude on desktop, 55% on tablet and **not at all**
below `md`. See `float.scale` in `lib/theme/animations.ts`.

## 3D

Infrastructure only — no final models yet. `Scene` wraps the Canvas with the house
camera and light rig, stops its frame loop when it scrolls out of view, and caps the
pixel ratio at 2. `FloatingObject` supplies idle drift and a placeholder sheet of
stock; swap in real geometry inside it.

**Mount 3D through `lazyScene`, and keep the canvas *and its contents* inside the
dynamically imported module.** Passing `<FloatingObject />` as a child from an
eagerly loaded file statically imports `three` back into the main bundle and the
code-splitting silently stops working. See `sections/home/hero-canvas.tsx` for the
pattern. Home is 164 kB First Load JS with the split, against a 103 kB shared
baseline; it was 372 kB without.

## Adding content

- **A route** — add it to `mainNav` in `lib/navigation.ts`. The desktop nav, the
  mobile drawer and `sitemap.ts` all read from there.
- **A page's metadata** — add a record to `pageSeo` in `lib/seo/pages.ts`, then
  call `metadataForRoute('/route')` in the page. Title and description lengths are
  guarded at build time, and two pages sharing a description fails the build.
- **Copy** — `lib/content.ts` (services, products, process) and `content/home.ts`
  (hero, pillars, catalogue, testimonials, reassurances). `content/faq.ts` requires
  every entry to name the published copy it restates.
- **Studio details** — `lib/site.ts`. Every phone number, address and opening hour
  on the site reads from there; nothing is hard-coded in a component.

## Before launch

The full list, with reasoning, is section 6 of
[WEBSITE_COMPLETENESS_REPORT.md](WEBSITE_COMPLETENESS_REPORT.md). The five that
block a launch:

1. **Confirm the phone number.** Three are live on the current site
   (`99626 04017`, `7871451004`, `77082 98673`); `lib/site.ts` publishes the first
   on every page. Two of the three are dropping enquiries today.
2. **Wire enquiry delivery.** `/api/quote` is built and validates, but with no
   transport configured it returns `delivered: false` and the form falls back to
   WhatsApp and email. Set `ENQUIRY_WEBHOOK_URL`, or `RESEND_API_KEY` plus
   `ENQUIRY_TO_EMAIL` and `ENQUIRY_FROM_EMAIL`.
3. **Confirm the response-time promise and the four studio statistics.** Both are
   marked `TODO` in `lib/site.ts`, and both now appear across the site.
4. **Have the three policy pages reviewed.** They are accurate about what the code
   does. Retention periods, and every commercial figure deliberately left out of
   `/terms`, are the studio's to set.
5. **Set a Content-Security-Policy.** The other five security headers ship in
   `next.config.ts`; a CSP needs one deploy to test against.

Optional: replace the generated OG cards in `app/*/opengraph-image.tsx` if the
studio supplies artwork, and set real profile URLs in `siteConfig.social` — the
schema layer currently filters the bare domains out of `sameAs` rather than
asserting that this business is the Instagram homepage.
