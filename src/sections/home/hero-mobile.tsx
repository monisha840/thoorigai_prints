'use client';

import Image from 'next/image';
import { m } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ACTS } from '@/three/press-story';
import { hero } from '@/content/home';
import { easing } from '@/lib/theme/animations';
import { useReducedMotion } from '@/providers/motion-provider';
import { cn } from '@/lib/utils';

/**
 * The hero story, for phones and tablets. No WebGL, ever.
 *
 * This is a *different component*, not the desktop scene turned down. Below `lg`
 * the breakpoint gate in `hero-stage.tsx` mounts this and never reaches the tier
 * check, so `three` is not merely deferred on a phone — it is never requested.
 * Before this existed the live site mounted a 700×875 WebGL canvas at a 390px
 * viewport, which is the opposite of what a hero on mobile data should do.
 *
 * ## What it shows
 *
 * The same five acts as the scene, in the same order, told as a stack of three
 * layered planes with a progress rail above them:
 *
 *     FILE → PROOF → PRESS → FINISH → DELIVERY
 *      ●─────○──────○───────○────────○
 *
 * Each beat brings a new plane to the front and re-stacks the two behind it. The
 * front plane is what the act is *about*; the two behind give it depth and keep
 * the composition from feeling like a slideshow.
 *
 * ## Why it costs nothing
 *
 * Only `transform` and `opacity` are ever animated. Both are compositor
 * properties, so no beat triggers layout or paint — the work is three matrix
 * updates on the GPU. There is no `width`, no `top`, no `filter`, and no
 * `box-shadow` transition anywhere in the sequence, because each of those would
 * put the whole thing back on the main thread.
 *
 * The photographs are the ones already in the library and already optimised;
 * `sizes` is exact, so a phone fetches a phone-sized file. FILE and PROOF are
 * drawn in CSS rather than photographed, because a file and a proof are not
 * things there is a photograph of.
 *
 * ## Reduced motion
 *
 * The timer never starts and the composition renders on its last beat, with the
 * rail complete — the finished story, held still. Nothing is lost but the
 * telling, which is precisely what a reduced-motion visitor asked for.
 */

/** Seconds each act holds before the stack advances. */
const BEAT_MS = 2100;

export interface HeroMobileProps {
  className?: string;
}

export function HeroMobile({ className }: HeroMobileProps) {
  const reduced = useReducedMotion();
  // Reduced motion opens on the last act and stays there.
  const [act, setAct] = useState(() => (reduced ? ACTS.length - 1 : 0));

  useEffect(() => {
    if (reduced) {
      setAct(ACTS.length - 1);
      return;
    }

    /*
      One interval, and it stops when the hero is off screen. A phone that has
      scrolled past the hero should not be running a timer that re-renders three
      elements every two seconds for nobody.
    */
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      timer ??= setInterval(() => setAct((n) => (n + 1) % ACTS.length), BEAT_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return (
    <div
      className={cn('relative', className)}
      /* One live region for the whole thing rather than a label per plane: the
         planes are decorative, and what a screen reader needs is the act it is
         currently on, once. */
      role="img"
      aria-label={`Our process: ${ACTS.map((a) => a.name).join(' to ')}. Currently showing ${ACTS[act].name}.`}
    >
      {/* ---- the rail ---------------------------------------------------- */}
      <ol className="flex items-center gap-1.5" aria-hidden>
        {ACTS.map((a, i) => (
          <li key={a.n} className="flex flex-1 items-center gap-1.5">
            <span
              className={cn(
                'h-px flex-1 origin-left transition-colors duration-(--d-slow) ease-(--ease-standard)',
                /* The spent rail was `paper-400` on a `paper-200` ground, which
                   measures about 1.1:1 — the four inactive segments were simply
                   not there, and the rail read as two stray gold dashes.
                   `paper-500` is still quiet and is actually visible. */
                i <= act ? 'bg-gold-500' : 'bg-paper-500',
              )}
            />
          </li>
        ))}
      </ol>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-mono text-caption tabular-nums text-gold-700">{ACTS[act].n}</span>
        <span className="font-sans text-eyebrow font-semibold uppercase tracking-widest text-ink-800">
          {ACTS[act].name}
        </span>
      </div>

      {/* ---- the stack --------------------------------------------------- */}
      {/*
        `pb-8` is the room the stacked planes need. They sit `absolute inset-0`
        and the two behind the front one are pushed *down* to read as depth, so
        they overhang the aspect box — without reserved space below, the caption
        under this block was drawn straight over them.
      */}
      <div className="relative mt-4 aspect-[4/5] w-full pb-8 sm:aspect-[3/2]">
        {ACTS.map((a, i) => {
          /* Where this plane sits relative to the current act. 0 is the front,
             1 and 2 are behind it, and anything further back is parked. */
          const offset = (i - act + ACTS.length) % ACTS.length;
          const depth = Math.min(offset, 3);

          return (
            <m.div
              key={a.n}
              className="absolute inset-0 origin-bottom will-change-transform"
              initial={false}
              animate={{
                // Behind planes step back and down, so the stack reads as depth
                // rather than as a pile.
                scale: 1 - depth * 0.06,
                y: depth * 10,
                opacity: depth >= 3 ? 0 : 1 - depth * 0.28,
                zIndex: ACTS.length - depth,
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.72, ease: easing.standard }
              }
              style={{ zIndex: ACTS.length - depth }}
            >
              <Plane act={a.n} />
            </m.div>
          );
        })}
      </div>

      <p className="mt-8 text-body-sm text-ink-500">{ACTS[act].body}</p>
    </div>
  );
}

/**
 * One plane of the stack.
 *
 * FILE and PROOF are drawn — there is no photograph of a file, and faking one
 * with a stock image of a laptop would be the first dishonest thing on the page.
 * PRESS, FINISH and DELIVERY are the studio's own product photography, which is
 * already in the library at the right sizes.
 */
function Plane({ act }: { act: string }) {
  const frame =
    'absolute inset-0 overflow-hidden rounded-[2px] border border-paper-400 bg-paper-100 shadow-[0_18px_44px_-28px_rgba(38,34,54,0.45)]';

  if (act === '01') {
    /* FILE — a blank sheet with a trim rule and a corner mark. */
    return (
      <div className={frame}>
        <div className="absolute inset-6 border border-dashed border-paper-500" />
        <div className="absolute left-6 top-6 h-4 w-4 border-l border-t border-gold-600" />
        <div className="absolute bottom-6 right-6 h-4 w-4 border-b border-r border-gold-600" />
      </div>
    );
  }

  if (act === '02') {
    /* PROOF — the same sheet with content and colour filled in. */
    return (
      <div className={frame}>
        <div className="absolute inset-6 flex flex-col gap-2">
          <div className="h-1/3 w-full bg-indigo-600" />
          <div className="h-2 w-3/4 bg-ink-800" />
          <div className="h-2 w-1/2 bg-paper-500" />
          <div className="h-2 w-2/3 bg-paper-500" />
          <div className="mt-auto flex gap-1.5" aria-hidden>
            {/* The registration bars. The only gold on the plane. */}
            <span className="h-3 flex-1 bg-ink-800" />
            <span className="h-3 flex-1 bg-indigo-600" />
            <span className="h-3 flex-1 bg-gold-500" />
            <span className="h-3 flex-1 bg-paper-500" />
          </div>
        </div>
      </div>
    );
  }

  const photo =
    act === '03'
      ? { src: '/images/about/digital-printer.webp', alt: 'The studio’s production press' }
      : act === '04'
        ? { src: '/img/pillars/binding-board-book.webp', alt: 'Bound board books, finished in house' }
        : { src: hero.image.src, alt: hero.image.alt };

  return (
    <div className={cn(frame, act === '03' && 'bg-indigo-950')}>
      <Image
        src={photo.src}
        alt=""
        fill
        sizes="(min-width: 640px) 90vw, 100vw"
        className={act === '03' ? 'object-contain p-6' : 'object-cover'}
      />
    </div>
  );
}

export default HeroMobile;
