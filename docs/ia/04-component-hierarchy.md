# 04 · Component Hierarchy

How components compose, where state lives, and how data flows. The library itself — variants, props, states — is in [05 · UI Components](05-ui-components.md).

---

## Layer model

Five layers. A component may only depend on layers below it. This rule is what keeps a 3D-heavy site from becoming untestable.

```
┌──────────────────────────────────────────────────────────────┐
│  L5  PAGES          Route-level. Compose sections. Own data   │
│                     fetching and metadata.                    │
├──────────────────────────────────────────────────────────────┤
│  L4  SECTIONS       Full-width page bands. Own their own      │
│                     scroll behaviour and reveal.              │
├──────────────────────────────────────────────────────────────┤
│  L3  COMPOSITES     Multi-part units. Card grids, forms,      │
│                     configurators, accordions.                │
├──────────────────────────────────────────────────────────────┤
│  L2  PRIMITIVES     Single-purpose. Button, Heading, Field,   │
│                     Chip, Icon, Image.                        │
├──────────────────────────────────────────────────────────────┤
│  L1  FOUNDATION     Tokens, layout primitives, motion         │
│                     wrappers, capability context.             │
└──────────────────────────────────────────────────────────────┘
```

**The 3D exception.** `Canvas3D` and everything under it form a sixth, parallel branch that hangs off L3 but is loaded through a boundary — a dynamic import behind a capability check. Nothing in L1–L2 may import from it. This is the rule that keeps WebGL out of the initial bundle and off the critical path.

---

## Application shell

```
<RootLayout>
├── <CapabilityProvider>          device tier A/B/C, reduced-motion, save-data
│   └── <SiteConfigProvider>      canonical phone, email, address, hours
│       └── <QuoteProvider>       global quote sheet state + carried context
│           │
│           ├── <SkipLink>
│           ├── <SiteHeader>
│           │   ├── <Logo>                       SVG, required — blocks build
│           │   ├── <PrimaryNav>
│           │   │   └── <NavItem> ×7
│           │   │       └── <MegaPanel>          pillars only
│           │   │           ├── <PanelColumn> ×2–3
│           │   │           │   └── <PanelLink> ×n
│           │   │           └── <PanelFeature>   one visual, one line
│           │   ├── <SearchTrigger>
│           │   ├── <QuoteButton>                → QuoteProvider.open()
│           │   └── <MobileMenuTrigger>
│           │       └── <MobileDrawer>
│           │           └── <NavAccordion>
│           │
│           ├── <main>
│           │   └── {page}                       ← L5
│           │
│           ├── <SiteFooter>
│           │   ├── <FooterBrand>                logo, tagline, NAP, hours
│           │   ├── <FooterColumn> ×3
│           │   ├── <SocialRow>
│           │   └── <FooterMeta>                 dynamic year
│           │
│           ├── <MobileActionBar>                persistent: call · whatsapp · quote
│           ├── <QuoteSheet>                     global overlay
│           ├── <SearchOverlay>
│           └── <CookieBanner>
```

### Why three providers

| Provider | Owns | Why global |
|---|---|---|
| `CapabilityProvider` | Device tier, `prefers-reduced-motion`, `Save-Data`, WebGL support | Every animated and 3D component reads it. Resolved once, on mount, never re-probed. |
| `SiteConfigProvider` | Canonical phone, WhatsApp, email, address, hours | The audit found **three different phone numbers live**. A single source makes that class of bug structurally impossible. |
| `QuoteProvider` | Sheet open state, carried context (`service`, `item`, `variant`) | The context-carry rule requires any CTA anywhere to open a pre-filled form. |

---

## Page composition

### Home (L5)

```
<HomePage>
├── <HeroSection>                              H-1
│   ├── <StageCanvas>          ─── 3D boundary ─→ <HeroScene>
│   ├── <DisplayHeading>
│   ├── <LeadText>
│   └── <ButtonPair>
├── <PillarSection>                            H-2
│   └── <PillarGrid>
│       └── <PillarCard> ×3
│           ├── <TiltWrapper>                  A only
│           ├── <MediaFrame>
│           └── <CardBody>
├── <ProofSection>                             H-3  ships hidden
│   ├── <StatRow> › <StatItem> ×3
│   └── <LogoWall> › <ClientLogo> ×n
├── <ShowcaseSection>                          H-4
│   └── <ShowcaseSequence>
│       ├── <StickyStage>      ─── 3D boundary ─→ <BindingSequenceScene>
│       └── <StepCopy> ×4
├── <MaterialTeaserSection>                    H-5
│   └── <MaterialStrip> › <MaterialSwatch> ×5
├── <ProcessSection>                           H-6
│   └── <ProcessTimeline> › <ProcessStep> ×5
├── <WorkSection>                              H-7  ships hidden
│   └── <WorkCarousel> › <WorkCard> ×3
├── <FAQSection>                               H-8
│   └── <Accordion> › <AccordionItem> ×4
└── <CTASection>                               H-9
    └── <CTABand>
        ├── <QuoteForm variant="inline">
        └── <ContactMethods>
```

### Capability page (L5) — the densest template

```
<CapabilityPage>
├── <PageHero>
│   ├── <Breadcrumb>
│   ├── <H1> · <LeadText>
│   └── <MediaFrame|StageCanvas>
├── <SpecStrip>                    required — no specs, no ship
│   └── <SpecItem> ×5–6
├── <ConfiguratorSection>                      ← branches on content + tier
│   └── <Configurator3D> | <MediaGallery>
│       ├── <StageCanvas>  ─── 3D boundary ─→ <ProductScene>
│       ├── <VariantPicker>
│       │   └── <SwatchButton> ×n
│       ├── <ViewControls>       reset · fullscreen · AR
│       └── <ConfigSummary>
│           └── <QuoteButton context={config}>   ← carries the configuration
├── <ProseSection> › <ProseBlock>
├── <OptionSection> › <OptionGrid> › <OptionCard> ×n
├── <UseCaseSection> › <UseCaseList>
├── <ReassuranceCard>              "we design it for you"
├── <RelatedSection> › <RelatedGrid> › <ProductTile> ×4
├── <FAQSection> › <Accordion>
└── <CTASection> › <CTABand>
```

`<ConfiguratorSection>` is the one place where content and capability jointly decide the tree:

```
if (!product.model3d)        → <MediaGallery>
else if (tier === 'C')       → <MediaGallery posterFrom={model3d} >
else                         → <Configurator3D reduced={tier === 'B'} >
```

The fallback is not an error state — it is a complete, well-designed gallery. A visitor on Tier C never sees a hole where 3D would have been.

---

## The 3D boundary

The single most important structural rule on this project.

```
      L3 COMPOSITE                    ╎  BOUNDARY  ╎        3D BRANCH
                                      ╎            ╎
  <Configurator3D>                    ╎            ╎
      │                               ╎            ╎
      └── <StageCanvas>  ──────────────────────────────→ dynamic import
              │                       ╎            ╎     <Canvas3D>
              ├── renders <Poster>    ╎            ╎         ├── <SceneRoot>
              │   immediately         ╎            ╎         │   ├── <Lighting>
              │                       ╎            ╎         │   ├── <Environment>
              ├── reads CapabilityCtx ╎            ╎         │   ├── <Model>
              │   tier A/B → import   ╎            ╎         │   └── <Controls>
              │   tier C   → stop     ╎            ╎         └── <PerfMonitor>
              │                       ╎            ╎
              └── waits for           ╎            ╎
                  IntersectionObserver╎            ╎
```

`<StageCanvas>` is the only component permitted to cross the boundary. Its contract:

1. Render `<Poster>` — a static image — **synchronously, always.** This is what the LCP measures.
2. Reserve the exact aspect ratio. CLS stays at zero whether or not 3D ever arrives.
3. Read the capability tier. On C, stop here permanently.
4. On A/B, wait for intersection **and** for the page to be interactive.
5. Dynamically import `<Canvas3D>`, mount it behind the poster, cross-fade in over 400ms.
6. On any failure — import error, WebGL context loss, timeout — keep the poster and report `3d_load_failed`. Never surface an error to the user.

**Consequences of this contract:** the 3D bundle is never in the initial payload · the page is fully functional and fully sells with JavaScript disabled · a WebGL crash degrades to a photograph, not a blank box · the performance budget is enforced structurally rather than by discipline.

### Inside the 3D branch

```
<Canvas3D>                        r3f canvas, dpr capped [1, 2]
├── <PerfMonitor>                 auto-downgrades on sustained frame drop
├── <Suspense fallback={null}>    poster remains visible underneath
│   └── <SceneRoot>
│       ├── <Lighting>            baked env map; ≤1 real-time light
│       ├── <Environment>         compressed HDR, shared across scenes
│       ├── <Model>               glTF, Draco + Meshopt, KTX2 textures
│       │   └── <MaterialSwitch>  variant-driven
│       ├── <Controls>            damped orbit, clamped polar angle
│       └── <ScrollRig>           scroll-driven scenes only
└── <Preloader>                   idle-time prefetch of the next likely model
```

**Shared across every scene**, loaded once and reused: the environment map, the tone-mapping config, the draco/ktx2 decoders, and the `<Lighting>` rig. Per-scene payload is then only geometry plus textures, which is what keeps each model under the 1.5 MB budget.

---

## Data flow

### Content model

```
Pillar          slug · title · lead · body · hero · capabilities[] · faqs[]
  └── Capability  slug · pillar → · title · lead · body · specs[] · options[]
        │                · model3d? · gallery[] · useCases[] · faqs[] · seo
        └── Product     slug · capability → · name · description · specs[]
                         · images[] · model3d? · materials[]

Material        slug · name · category · swatch · specs[] · usedIn[]
CaseStudy       slug · client · pillars[] · brief · specs · images[] · outcome
Article         slug · title · excerpt · body · cover · publishedAt
SiteConfig      phone · whatsapp · email · address · hours · social[]
```

`SiteConfig` is a **singleton** and is the only place a phone number may be authored.

### Copy gating

The audit's central finding was that products carry a two-word label and nothing else. The type system enforces the fix:

```
ProductTile          renders always
ProductDetail        renders only if description AND specs.length > 0
Configurator3D       renders only if model3d AND description
CapabilityPage       build fails if specs.length === 0
```

A tile with no description is still a tile — it just does not pretend to be a page. **The build refuses a capability page with no specs**, because the [flows](02-user-flows.md) show MOQ and lead time are what the volume buyer and the individual both decide on.

### Context carry

```
<QuoteButton context={{ service:'Binding', item:'Hard Case', variant:'Rexin / Gold Foil' }} />
        │
        └─→ QuoteProvider.open(context)
                └─→ <QuoteSheet>
                        ├── <ContextChips>    removable, pre-filled
                        └── <QuoteForm>       3 required fields remain
```

---

## Rendering boundaries

| Layer | Rendering | Note |
|---|---|---|
| L5 Pages | Server | Data fetch, metadata, structured data |
| L4 Sections | Server by default | Client only when they own scroll state |
| L3 Composites | Mixed | Forms, accordions, configurators are client |
| L2 Primitives | Server-safe | No component may require client-side JS to render text |
| L1 Foundation | Both | Providers are client; layout primitives are server |
| 3D branch | Client, dynamic | Never server-rendered, never in the initial chunk |

**The text rule:** no primitive may need JavaScript to display its content. Every heading, paragraph, spec and price renders server-side. JavaScript adds interaction, never information.

---

## Naming and file conventions

```
src/
├── app/                     routes, L5
├── components/
│   ├── foundation/          L1 — providers, layout, motion wrappers
│   ├── primitives/          L2
│   ├── composites/          L3
│   ├── sections/            L4
│   └── three/               3D branch — importable only via StageCanvas
├── content/                 CMS schemas + queries
├── lib/                     capability detection, analytics, config
└── styles/                  tokens
```

An ESLint boundary rule forbids importing `components/three/**` from anywhere except `StageCanvas`. That single rule is what keeps the performance budget from eroding as the project grows.
