'use client';

import Image from 'next/image';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { lazyScene } from '@/components/three/lazy-scene';
import { SceneBoundary } from '@/components/three/scene-boundary';
import { technology } from '@/content/home';
import { useBreakpoint, useMediaQuery } from '@/hooks/use-media-query';
import { resolveTier, tierAllows3D } from '@/lib/capability';
import { easing, pointer } from '@/lib/theme/animations';
import { useReducedMotion } from '@/providers/motion-provider';
import { cn } from '@/lib/utils';

/**
 * Invisible while the chunk downloads — §10.4 rule 7: the photograph is the
 * loading state, and it is already on screen.
 */
const PressPathCanvas = lazyScene<{ onReady?: () => void }>(
  () => import('@/components/three/press-path-canvas'),
  { placeholderClassName: 'opacity-0' },
);

/**
 * The press, on a floor.
 *
 * `digital-printer.webp` is a **transparent cut-out** — alpha 0 at all four
 * corners, subject bounds 52,110 → 963,669 of a 1000×750 canvas. That single
 * fact is what this whole component is built on. The live site publishes the
 * same machine welded to a flat navy plate, which is why it reads as a product
 * shot pasted onto a page; a cut-out can instead be *lit*, given a floor, and
 * given a shadow it casts from its own silhouette.
 *
 * ## The layers, back to front
 *
 *     floor wash     translateZ(-90px)   the ground below the contact line
 *     light pool     translateZ(-60px)   one warm pool, under the engine
 *     ground shadow  translateZ(-2px)    a soft ellipse on the wheel line
 *     the press      translateZ(0)       drop-shadow cast from the alpha
 *     foil sweep     translateZ(1px)     a highlight masked to the press
 *     paper path     translateZ(2px)     the WebGL trace, tier-gated
 *     markers        translateZ(70px)    the four modules, annotated
 *
 * Depth is real rather than painted: the wrapper carries `perspective` and the
 * inner carries `preserve-3d`, so tilting toward the pointer moves the grid,
 * the machine and the markers by genuinely different amounts. Painting the same
 * effect with three hand-tuned `translate` distances is the thing that always
 * ends up looking like a parallax library.
 *
 * ## Why the plate is 4:3 and stays 4:3
 *
 * The marker coordinates in `content/home.ts` are percentages of the image box,
 * and they are only exact while that box has the photograph's own aspect ratio.
 * The moment the frame is wider than 4:3, `object-contain` letterboxes and every
 * marker drifts off its module. So the plate declares `aspect-[4/3]` at every
 * breakpoint, and the *ambient* layers — which have no coordinates to honour —
 * are the ones allowed to run full width.
 *
 * ## What is off, and when
 *
 * Tilt needs a real hovering pointer and an absence of stated preference:
 * `pointer: fine` and not reduced, checked exactly as `MouseParallax` checks
 * them. When it is off the layers render with **no transform at all** rather
 * than a transform of zero, so nothing is promoted to a compositor layer for
 * nothing.
 *
 * Markers are desktop-only. Four hover targets over a 320px-wide photograph are
 * not a touch interface; below `lg` the same four facts render as a plain list
 * in `technology.tsx`, and no content is lost.
 */

/** Peak tilt in degrees. Past about 6° a photographed object starts to shear. */
const TILT = { x: 3, y: 5 } as const;

export interface PressStageProps {
  className?: string;
}

export function PressStage({ className }: PressStageProps) {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const tilting = finePointer && !reduced;

  /**
   * This section owns its pointer field rather than borrowing `MouseParallax`.
   * That component only translates, and what sells depth on a photographed
   * object is rotation — widening it for one caller would put a rotation API on
   * every parallax layer on the site to serve one section.
   */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, pointer.spring);
  const py = useSpring(rawY, pointer.spring);

  const rotateY = useTransform(px, (v) => v * TILT.y);
  const rotateX = useTransform(py, (v) => v * -TILT.x);

  /**
   * Whether the paper-path scene may load at all, and then when.
   *
   * Two gates, and both are needed. `tierAllows3D` is the device question, and
   * it already answers reduced motion through either channel — the OS setting
   * or the site's own footer toggle. `lg` is a *framing* question: the path's
   * control points are read against the desktop plate, and on a 320px-wide
   * bleed the trace is thinner than the machine's own panel gaps.
   *
   * The deferral is the same as `HeroStage`'s. Intersection first, so the chunk
   * is never fetched for a visitor who stops at the hero, then an idle callback,
   * so 240kb of `three` never competes with the images still decoding above it.
   */
  const isDesktop = useBreakpoint('lg');
  const plateRef = useRef<HTMLDivElement>(null);
  const [mountScene, setMountScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (!isDesktop) return;
    if (!tierAllows3D(resolveTier())) return;

    const node = plateRef.current;
    if (!node) return;

    let idleHandle = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = () => setMountScene(true);
        // `requestIdleCallback` is still missing on Safari < 17, so the timeout
        // is a real fallback rather than belt-and-braces.
        idleHandle =
          typeof window.requestIdleCallback === 'function'
            ? window.requestIdleCallback(start, { timeout: 2000 })
            : window.setTimeout(start, 600);
      },
      { rootMargin: '200px 0px', threshold: 0 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (!idleHandle) return;
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
    };
  }, [isDesktop]);

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      // Pens and fingers report through pointer events too; only a device that
      // actually hovers should move the field.
      if (event.pointerType !== 'mouse') return;
      const box = event.currentTarget.getBoundingClientRect();
      if (!box.width || !box.height) return;
      rawX.set((event.clientX - box.left) / box.width - 0.5);
      rawY.set((event.clientY - box.top) / box.height - 0.5);
    },
    [rawX, rawY],
  );

  // Without this the stage holds its last angle after the cursor leaves and the
  // whole composition stays crooked.
  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <div
      className={cn('relative', className)}
      style={tilting ? { perspective: '1400px' } : undefined}
      onPointerMove={tilting ? handleMove : undefined}
      onPointerLeave={tilting ? handleLeave : undefined}
    >
      <m.div
        className="relative"
        style={tilting ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
      >
        {/* ------------------------------------------------------------------
            Ambient — full width, no coordinates to honour. Purely the room the
            machine is standing in, and decorative throughout.
           ------------------------------------------------------------------ */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/*
            The floor.

            This was a real grid — repeating rules laid flat with
            `rotateX(74deg)` — and it was wrong, for a reason worth keeping
            written down. A rotation about X only reads as a receding plane
            inside a perspective context, and this stage only establishes one
            when it is tilting: not on touch, not under reduced motion. Everywhere
            else the rotation degenerated into a flat vertical squash, which drew
            a hard horizontal line across the machine at waist height. A floor
            that becomes a horizon through the subject is worse than no floor.

            So the ground is drawn the way it survives every context: a single
            radial, centred below the machine and fading out in every direction.
            Radial and not linear, and full-bleed and not a box, because both of
            those were tried — a `bottom-0 h-[52%]` panel with a vertical
            gradient begins at full strength on its own top edge, and that edge
            is a second horizon line drawn across the machine at exactly the
            height the first one was. A gradient with nowhere to start has no
            edge to give away.

            It still sits on its own Z plane, so the tilt parallaxes the ground
            against the machine standing on it.
          */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(78% 40% at 50% 94%, rgba(122,155,205,0.17), transparent 72%)',
              transform: 'translateZ(-90px)',
            }}
          />

          {/*
            One warm pool, sitting where the press is, and one cool one behind
            its top edge. The band is a near-black; a light is what stops it
            reading as a flat rectangle. Two is the ceiling — any more, lit from
            directions the photograph was not lit from, and the composite shows.
          */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(58% 44% at 50% 60%, rgba(193,133,70,0.30), transparent 70%), radial-gradient(44% 34% at 50% 20%, rgba(78,116,174,0.30), transparent 72%)',
              transform: 'translateZ(-60px)',
            }}
          />
        </div>

        {/* ------------------------------------------------------------------
            The plate — the photograph's own box, and the coordinate space the
            markers live in. Bleeds the gutter below `lg` exactly as `HeroStage`
            does; contained and centred from `lg` up, where the marker panels
            need room to open inside the container.
           ------------------------------------------------------------------ */}
        <div
          ref={plateRef}
          /*
            The cut-out is 4:3 but the machine is not: it occupies y 14.7% to
            89.2% of the frame and nothing else does. Honouring the ratio is
            non-negotiable — the markers are percentages of this box — so the
            transparent margin is absorbed by pulling the box, rather than by
            cropping it. Coordinates are unchanged; only where the box sits is.
          */
          className="relative -mx-5 aspect-[4/3] sm:-mx-8 lg:mx-auto lg:-mt-10 lg:-mb-6 lg:max-w-[60rem]"
        >
          {/*
            Ground contact. A radial ellipse rather than a blurred box: `blur` is
            a filter, and it would force a second offscreen pass on a layer that
            is already being transformed every frame. Positioned on the wheel
            line — y 669 of 750 is 89% down the box.
          */}
          <div
            aria-hidden
            className="absolute inset-x-[4%] top-[80%] h-[16%]"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 46% 50% at 50% 50%, rgba(6,9,16,0.62), transparent 72%)',
              transform: 'translateZ(-2px)',
            }}
          />

          {/*
            The press. Deliberately not `priority`: this section is well below
            the fold and the hero photograph must stay the LCP element.

            `drop-shadow` rather than `box-shadow`, because it reads the alpha
            channel — the shadow is cast by the machine's real silhouette, under
            the paper decks, between the modules, around the console arm. A
            box-shadow draws a rectangle around a cut-out, which is exactly what
            makes a composited product shot look composited.
          */}
          <Image
            src={technology.image.src}
            alt={technology.image.alt}
            fill
            sizes="(min-width: 1024px) 60rem, 100vw"
            className="object-contain [filter:drop-shadow(0_24px_28px_rgba(4,7,13,0.55))]"
          />

          {/*
            The foil sweep — one pass of light across the machine as the section
            arrives, and never again.

            The mask is the photograph itself, so the highlight rides the
            machine's body and never touches the ground behind it. An unmasked
            sweep over a dark band is a lens flare, and a lens flare is the
            fastest way to make an editorial layout look like a template.

            Driven by Framer rather than a CSS keyframe because the global
            reduced-motion brake in `globals.css` collapses animations to
            0.01ms, which for a sweep means a white flash — worse than not
            running it at all. `MotionConfig reducedMotion` cancels this
            properly instead.
          */}
          <div
            aria-hidden
            className="absolute inset-0 overflow-hidden"
            style={{
              maskImage: `url(${technology.image.src})`,
              WebkitMaskImage: `url(${technology.image.src})`,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              transform: 'translateZ(1px)',
            }}
          >
            <m.div
              className="absolute inset-y-0 w-[36%] bg-[linear-gradient(105deg,transparent_0%,rgba(255,255,255,0.30)_44%,rgba(255,255,255,0.50)_52%,transparent_100%)]"
              initial={{ x: '-140%' }}
              whileInView={{ x: '420%' }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.5, ease: easing.standard, delay: 0.4 }}
            />
          </div>

          {/*
            The paper path. An overlay, not a replacement — unlike the hero,
            nothing here cross-fades *out*, because the photograph is the
            subject and the trace is drawn on top of it. So the only transition
            is the canvas arriving, and on any failure `SceneBoundary` unmounts
            it and the photograph is simply what is left, exactly as it was.
          */}
          {mountScene ? (
            <SceneBoundary onError={() => setSceneReady(false)}>
              <div
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-0 motion-crossfade',
                  sceneReady ? 'opacity-100' : 'opacity-0',
                )}
                style={{ transform: 'translateZ(2px)' }}
              >
                {/* One frame after mount, so the fade starts from a painted
                    image rather than from an empty context. */}
                <PressPathCanvas
                  onReady={() => requestAnimationFrame(() => setSceneReady(true))}
                />
              </div>
            </SceneBoundary>
          ) : null}

          {/* The annotations, on their own plane above everything else. */}
          <div className="absolute inset-0 hidden lg:block" style={{ transform: 'translateZ(70px)' }}>
            {technology.modules.map((module) => (
              <Marker key={module.n} module={module} />
            ))}
          </div>
        </div>
      </m.div>
    </div>
  );
}

/**
 * One annotated module.
 *
 * ## Why the disc, and not a label
 *
 * The first cut of this drew the module's name in white beside a gold ring. On
 * a *dark* band that reads perfectly — and three of the four markers sit on the
 * machine, which is white. Two labels disappeared completely and a third was
 * half legible. A callout laid over a photograph cannot assume its own
 * background, so it has to carry one.
 *
 * So the resting state is a 28px disc: near-black at 88%, a gold hairline ring,
 * and the module's number in mono. It reads on the white cabinets, on the black
 * finishing trays and on the floor behind them, and four small discs annotate
 * the machine without covering it. The names live in the legend under the
 * stage, where they are always visible, at every breakpoint, to everyone.
 *
 * ## Why the anchor is zero-size
 *
 * The disc is centred on the module with `translate(-50%, -50%)`, which only
 * lands correctly if the thing being translated *is* the disc. Translating a
 * whole callout row that way centres the row — dot, rule and label together —
 * on the coordinate, which puts the dot roughly half a label to one side of the
 * part it is naming. So the marker is an empty positioned point, and the disc
 * and the panel are both placed against it independently.
 *
 * ## Which side the panel opens
 *
 * Away from the nearer edge: markers right of centre open leftward. Without it,
 * the paper-deck marker at x=84% opens a 15rem panel straight through the right
 * edge of the plate.
 */
function Marker({ module }: { module: (typeof technology.modules)[number] }) {
  const flip = module.x > 50;
  const panelId = `press-module-${module.n}`;

  return (
    <div
      className="group/marker absolute"
      style={{ left: `${module.x}%`, top: `${module.y}%` }}
    >
      {/*
        The disc. `type="button"` with no handler is the honest markup: there is
        nowhere for it to navigate, and the only reason it is a control at all is
        that a keyboard has to be able to reach the sentence it describes.
      */}
      <button
        type="button"
        aria-describedby={panelId}
        className={cn(
          'absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full',
          'border border-gold-500/70 bg-indigo-950/88 backdrop-blur-[2px]',
          'font-mono text-[0.625rem] tabular-nums text-gold-400',
          'motion-lift hover:border-gold-400 hover:bg-indigo-950',
          'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-500',
        )}
      >
        {module.n}
        <span className="sr-only"> — {module.label}</span>
      </button>

      {/*
        The panel. Carries its own ground for the same reason the disc does, and
        it is `pointer-events-none` so it can never sit between the cursor and
        the machine — it opens *because* of the disc, so it has no need to be
        hoverable itself.

        `invisible` alongside `opacity-0` keeps it out of hit-testing and out of
        the accessibility tree while closed; opacity alone leaves a 15rem
        transparent rectangle over the press.
      */}
      <div
        id={panelId}
        className={cn(
          'pointer-events-none invisible absolute top-1/2 w-60 -translate-y-1/2 opacity-0',
          'rounded-[2px] border border-paper-100/15 bg-indigo-950/92 p-3 backdrop-blur-sm',
          'transition-[opacity,visibility,translate] duration-(--d-base) ease-(--ease-standard)',
          'group-hover/marker:visible group-hover/marker:opacity-100',
          'group-focus-within/marker:visible group-focus-within/marker:opacity-100',
          flip ? 'right-5' : 'left-5',
        )}
      >
        <p className="font-sans text-caption font-semibold tracking-tight text-paper-200">
          {module.label}
        </p>
        <p className="mt-1 text-caption text-paper-500">{module.body}</p>
      </div>
    </div>
  );
}

export default PressStage;
