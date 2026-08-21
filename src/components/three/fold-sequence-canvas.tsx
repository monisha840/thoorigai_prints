'use client';

import { useEffect } from 'react';

import { FoldRig } from './fold-rig';
import { Scene } from './scene';
import { useBreakpoint } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/providers/motion-provider';

/**
 * The home hero's 3D content, and the module `lazyScene` splits out.
 *
 * Canvas and contents live in this one file on purpose. The rule in
 * `lazy-scene.tsx` is the easy one to get wrong: passing scene children in from
 * an eagerly-loaded file statically imports `three` back into the main bundle
 * and the code-splitting silently stops working. Everything `three` touches has
 * to be on this side of the boundary.
 *
 * ## What the two flags decide
 *
 * `still` comes from `useReducedMotion`, which is the provider's combined
 * signal — the OS media query *or* the site's own footer toggle. The media
 * query alone is not enough: a visitor who flips "Reduce motion" in the footer
 * would otherwise get the CSS brake and Framer's `MotionConfig` while this
 * canvas carried on folding.
 *
 * `parallax` is desktop-only, matching §10.3, which gives Tier B no pointer
 * parallax at all. It is also pointless below `lg` — there is no pointer.
 */
export interface FoldSequenceCanvasProps {
  /**
   * Fired once the canvas has mounted, so the stage can cross-fade the poster
   * out. Reported from here rather than guessed with a timer upstream — on a
   * slow connection the chunk itself is the long pole, and a timer started
   * before the import would fade in an empty frame.
   */
  onReady?: () => void;
}

export default function FoldSequenceCanvas({ onReady }: FoldSequenceCanvasProps) {
  const reduced = useReducedMotion();
  const isDesktop = useBreakpoint('lg');

  useEffect(() => {
    onReady?.();
    // Mount-only: the stage cross-fades once and never again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Scene
      cameraPreset="hero"
      className="absolute inset-0"
      // §10.7: the canvas carries meaning, so it gets a description rather
      // than `aria-hidden`. This is what a screen reader announces in place of
      // the animation, and it names all four products deliberately.
      label="A sheet of paper folding into a brochure, then a business card, then a packaging box"
    >
      <FoldRig still={reduced} parallax={isDesktop && !reduced} />
    </Scene>
  );
}
