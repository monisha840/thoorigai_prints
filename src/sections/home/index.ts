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
 * The hero's media slot: five products on a floating stage, one featured at a
 * time. Pseudo-3D — CSS `perspective`, `translateZ` and layered shadows, with
 * Framer Motion driving the slots, the pointer tilt and the caption swap. No
 * WebGL, and every animated property is `transform` or `opacity`.
 */
export { HeroShowcase } from './hero-showcase';

/**
 * Superseded. `HeroScene` mounts the placeholder floating sheet — decorative
 * WebGL, which MASTER_PROJECT_PLAN.md §10.1 bans outright. Kept only because
 * `lazy-scene.tsx` still cites it as the worked example of the split-point
 * rule; nothing mounts it. Delete both files once that docblock is rewritten
 * against `fold-sequence-canvas.tsx`.
 */
export { HeroScene } from './hero-scene';

export { Eyebrow, SectionIntro, ArrowLink } from './shared';
