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
 * The hero's media slot: two vertical marquees of real work, navy travelling up
 * and bronze travelling down. A server component that ships no JavaScript — the
 * motion is a CSS keyframe, and the only animated property is `transform`.
 *
 * It replaced `HeroStage`, which carried §10.2's "hero objects" scene and the
 * §10.4 loading contract that went with it. Both are gone: the scene could not
 * explain itself without words, and once the slot was a photograph there was no
 * canvas left to gate, defer or cross-fade.
 */
export { HeroMarquee } from './hero-marquee';

/**
 * Superseded. `HeroScene` mounts the placeholder floating sheet — decorative
 * WebGL, which MASTER_PROJECT_PLAN.md §10.1 bans outright. Kept only because
 * `lazy-scene.tsx` still cites it as the worked example of the split-point
 * rule; nothing mounts it. Delete both files once that docblock is rewritten
 * against `fold-sequence-canvas.tsx`.
 */
export { HeroScene } from './hero-scene';

export { Eyebrow, SectionIntro, ArrowLink } from './shared';
