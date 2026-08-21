export { Hero } from './hero';
export { ServicesPreview } from './services-preview';
export { FeaturedProducts } from './featured-products';
export { ProductShowcase } from './product-showcase';
export { PortfolioPreview } from './portfolio-preview';
export { WhyUs } from './why-us';
export { Technology } from './technology';
export { ProcessTimeline } from './process-timeline';
export { Testimonials } from './testimonials';
export { HomeCta } from './home-cta';

/**
 * The hero's media slot: the photograph, and the fold sequence over it.
 *
 * `HeroStage` is what §10.2's "hero objects" scene became, and it is the
 * `StageCanvas` contract from §10.4 implemented for one slot — poster first and
 * always, tier gate, idle deferral, 400ms cross-fade, silent failure. The
 * photograph remains the LCP element; Tier C never loads WebGL at all.
 */
export { HeroStage } from './hero-stage';

/**
 * Superseded. `HeroScene` mounts the placeholder floating sheet — decorative
 * WebGL, which MASTER_PROJECT_PLAN.md §10.1 bans outright. Kept only because
 * `lazy-scene.tsx` still cites it as the worked example of the split-point
 * rule; nothing mounts it. Delete both files once that docblock is rewritten
 * against `fold-sequence-canvas.tsx`.
 */
export { HeroScene } from './hero-scene';

export { Eyebrow, SectionIntro, ArrowLink } from './shared';
