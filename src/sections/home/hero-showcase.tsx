'use client';

import Image from 'next/image';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { heroProducts } from '@/content/home';
import { useBreakpoint, useMediaQuery } from '@/hooks/use-media-query';
import { easing, pointer } from '@/lib/theme/animations';
import { useReducedMotion } from '@/providers/motion-provider';
import { cn } from '@/lib/utils';

/**
 * The hero's media slot: five products on a floating stage.
 *
 * ## What this replaced, and why
 *
 * Two vertical marquees of equally-sized tiles. The criticism of it was correct
 * on every count and worth writing down, because each fault has a specific
 * cause: it read as a gallery because sixteen tiles at one size have no subject;
 * it looked flat because every tile sat on the same plane; it had no flow
 * because a linear translate at constant speed is the one motion with no
 * beginning, middle or end; and it told no story because a loop cannot.
 *
 * The fix for all four is the same idea: **one product at a time is the
 * subject**, the others are depth behind it, and the subject changes.
 *
 * ## The stage
 *
 *     perspective: 1400px            the wrapper
 *       └ tilt          rotateX/rotateY toward the pointer, spring-damped, ≤6°
 *           ├ glow      the light the pieces sit in
 *           └ card ×5   each at a fixed home in Z, one advanced to the front
 *
 * Each card owns a home position in 3D — scattered across x, y and translateZ,
 * turned a few degrees on Y so nothing is square to the camera. When a card is
 * featured it comes forward to `translateZ(90px)`, squares up, brightens and
 * grows; when it is not, it returns home. So the composition never rearranges,
 * it just changes which piece is in the light. That is the production journey
 * the brief asks for, told with one moving part instead of five.
 *
 * ## Three transforms, three elements
 *
 * Slot, float and hover-lift are three independent transforms on the same card,
 * and CSS gives an element exactly one `transform`. So they are nested rather
 * than merged: the outer element carries the Framer slot, the middle carries the
 * CSS float keyframe, the inner carries the hover lift. Trying to compose them
 * on one node is how the float ends up cancelling the layout.
 *
 * ## Cost
 *
 * Five images and no WebGL. Every animated property is `transform` or `opacity`,
 * so the whole thing is compositor work — no layout, no paint. The featured
 * image is `priority`; the rest are lazy, so a visitor downloads the subject and
 * then the supporting cast at leisure.
 */

/**
 * Where each card lives when it is not the subject. Index-matched to
 * `heroProducts`.
 *
 * `x` and `y` are percentages **of the stage**, which is only true because the
 * element they are applied to is the size of the stage. That is the whole reason
 * the positioner and the sizer are two separate elements: `translateX(-35%)`
 * resolves against the *transformed element's own width*, so putting these on
 * the card itself made every offset a fraction of a card rather than a fraction
 * of the stage — the ring collapsed to a cluster and all four supporting cards
 * hid behind the subject. Sized to the stage, the percentages mean what they say.
 */
const HOME = [
  { x: '-32%', y: '-26%', z: -300, rotY: 16, rotX: 5, opacity: 0.62 },
  { x: '31%', y: '-22%', z: -220, rotY: -14, rotX: 4, opacity: 0.72 },
  { x: '-34%', y: '21%', z: -150, rotY: 12, rotX: -4, opacity: 0.82 },
  { x: '33%', y: '27%', z: -340, rotY: -18, rotX: -5, opacity: 0.58 },
  { x: '-1%', y: '-34%', z: -250, rotY: 7, rotX: 6, opacity: 0.68 },
] as const;

/** Where the subject stands. Slightly above centre, so the caption sits close. */
const FRONT = { x: '0%', y: '-3%', z: 100, rotY: -5, rotX: 2, opacity: 1 } as const;

/**
 * Card width as a share of the stage, and how much bigger the subject gets.
 *
 * Scale rather than an animated `width`: width is a layout property and would
 * reflow five cards every frame for 1.1 seconds; scale is a transform and rides
 * on the compositor with the rest of the move.
 */
const CARD_WIDTH = '43%';
const FEATURED_SCALE = 1.5;

/** How long each product holds the light. */
const DWELL_MS = 4200;

/** Peak stage tilt, degrees. Small — this should be felt, not watched. */
const TILT = { x: 4, y: 6 } as const;

export interface HeroShowcaseProps {
  className?: string;
}

export function HeroShowcase({ className }: HeroShowcaseProps) {
  const reduced = useReducedMotion();
  const isDesktop = useBreakpoint('lg');
  const [featured, setFeatured] = useState(0);
  const [held, setHeld] = useState(false);

  /*
    The cycle. Paused while a pointer is on the stage — the visitor is looking at
    something specific and moving it out from under them is the rudest thing an
    auto-advancing component can do. Also paused when the tab is hidden, so a
    backgrounded page is not re-rendering five cards every four seconds.
  */
  useEffect(() => {
    if (reduced || held) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      timer ??= setInterval(() => setFeatured((n) => (n + 1) % heroProducts.length), DWELL_MS);
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
  }, [reduced, held]);

  const product = heroProducts[featured];

  return (
    <div className={cn('relative', className)}>
      {isDesktop ? (
        <Stage
          featured={featured}
          reduced={reduced}
          onHoldChange={setHeld}
          onPick={setFeatured}
        />
      ) : (
        <MobileDeck featured={featured} reduced={reduced} onPick={setFeatured} />
      )}

      {/*
        The caption. This is where the hierarchy is actually *stated* — the
        composition makes one card dominant, and this names it. An earlier hero
        on this page failed precisely because it had no words; a showcase whose
        subject is unnamed is a gallery again.
      */}
      <div className="mt-6 flex items-baseline gap-4 lg:mt-8">
        <span aria-hidden className="font-mono text-caption tabular-nums text-gold-700">
          {String(featured + 1).padStart(2, '0')}/{String(heroProducts.length).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          {/* `key` on the name is what makes it re-enter rather than cross-fade
              in place, so the swap reads as the next piece arriving. */}
          <m.p
            key={product.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easing.standard }}
            className="font-sans text-heading-sm font-semibold tracking-tight text-ink-800"
          >
            {product.name}
          </m.p>
          <p className="mt-1 max-w-[52ch] text-body-sm text-ink-500">{product.blurb}</p>
        </div>
      </div>

      {/*
        The full list, for anything that is not looking at the composition. The
        cards themselves are decorative — a screen reader should get five product
        names once, not a rotating one.
      */}
      <ul className="sr-only">
        {heroProducts.map((item) => (
          <li key={item.id}>
            {item.name}. {item.blurb}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Desktop — the 3D stage
 * ---------------------------------------------------------------------- */

function Stage({
  featured,
  reduced,
  onHoldChange,
  onPick,
}: {
  featured: number;
  reduced: boolean;
  onHoldChange: (held: boolean) => void;
  onPick: (index: number) => void;
}) {
  const finePointer = useMediaQuery('(pointer: fine)');
  const tilting = finePointer && !reduced;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, pointer.spring);
  const py = useSpring(rawY, pointer.spring);
  const rotateY = useTransform(px, (v) => v * TILT.y);
  const rotateX = useTransform(py, (v) => v * -TILT.x);

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return;
      const box = event.currentTarget.getBoundingClientRect();
      if (!box.width || !box.height) return;
      rawX.set((event.clientX - box.left) / box.width - 0.5);
      rawY.set((event.clientY - box.top) / box.height - 0.5);
    },
    [rawX, rawY],
  );

  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    onHoldChange(false);
  }, [rawX, rawY, onHoldChange]);

  return (
    <div
      className="relative aspect-square w-full"
      style={tilting ? { perspective: '1400px' } : undefined}
      onPointerMove={tilting ? handleMove : undefined}
      onPointerEnter={() => onHoldChange(true)}
      onPointerLeave={handleLeave}
    >
      {/* The light the pieces stand in. Never animated — it is the ground, and a
          ground that moves is a ground nobody believes. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(58% 46% at 50% 46%, rgba(193,133,70,0.13), transparent 70%), radial-gradient(46% 38% at 52% 76%, rgba(38,34,54,0.10), transparent 72%)',
        }}
      />

      <m.div
        className="absolute inset-0"
        style={tilting ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
      >
        {heroProducts.map((item, index) => {
          const isFeatured = index === featured;
          const slot = isFeatured ? FRONT : HOME[index];
          const move = reduced
            ? { duration: 0 }
            : { duration: 1.1, ease: easing.standard };

          return (
            /* The positioner. Exactly the size of the stage, so its percentage
               translations are stage-relative. It carries everything except
               size. */
            <m.div
              key={item.id}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d', zIndex: isFeatured ? 20 : 10 - index }}
              initial={false}
              animate={{
                x: slot.x,
                y: slot.y,
                z: slot.z,
                rotateX: slot.rotX,
                rotateY: slot.rotY,
                opacity: slot.opacity,
              }}
              transition={move}
            >
              {/* The sizer. One fixed width for every card; only the subject
                  scales, so nothing reflows. */}
              <m.div
                className="pointer-events-auto relative"
                style={{ width: CARD_WIDTH, transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{ scale: isFeatured ? FEATURED_SCALE : 1 }}
                transition={move}
              >
                <Card
                  item={item}
                  index={index}
                  featured={isFeatured}
                  reduced={reduced}
                  onPick={() => onPick(index)}
                />
              </m.div>
            </m.div>
          );
        })}
      </m.div>
    </div>
  );
}

/**
 * One product card.
 *
 * Two nested elements under the Framer slot: the float, and the hover lift.
 * Each owns its own `transform`, because an element has only one.
 *
 * It is a `<button>` because it does something — picking a card makes it the
 * subject — and because that is the only way a keyboard reaches the same
 * affordance a pointer gets. The label is `sr-only` prose rather than the name
 * alone, so the action is announced as what it is.
 */
function Card({
  item,
  index,
  featured,
  reduced,
  onPick,
}: {
  item: (typeof heroProducts)[number];
  index: number;
  featured: boolean;
  reduced: boolean;
  onPick: () => void;
}) {
  return (
    <div
      className={reduced ? undefined : 'animate-float-slow'}
      /* Offsets so five cards never bob in lockstep — in lockstep they read as
         one object, and the illusion of five separate pieces is gone. */
      style={reduced ? undefined : { animationDelay: `${index * 1.35}s` }}
    >
      <button
        type="button"
        onClick={onPick}
        aria-pressed={featured}
        className={cn(
          'group/card block w-full rounded-[3px] text-left',
          'motion-lift hover:-translate-y-1',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500',
        )}
      >
        <span className="sr-only">Show {item.name}</span>

        <span
          aria-hidden
          className={cn(
            'relative block overflow-hidden rounded-[3px] bg-paper-100',
            'ring-1 ring-ink-800/8 motion-lift',
            featured
              ? 'shadow-[0_2px_4px_rgba(38,34,54,0.06),0_18px_36px_-18px_rgba(38,34,54,0.28),0_48px_90px_-40px_rgba(38,34,54,0.34)]'
              : 'shadow-[0_1px_2px_rgba(38,34,54,0.05),0_14px_30px_-18px_rgba(38,34,54,0.22)]',
            'group-hover/card:shadow-[0_4px_8px_rgba(38,34,54,0.07),0_26px_50px_-20px_rgba(38,34,54,0.32),0_60px_110px_-45px_rgba(38,34,54,0.36)]',
          )}
          style={{ aspectRatio: item.aspect }}
        >
          <Image
            src={item.image.src}
            alt=""
            fill
            /* The subject is the LCP candidate; the rest arrive when they can. */
            priority={index === 0}
            sizes="(min-width: 1024px) 30vw, 78vw"
            className="object-cover"
          />

          {/* A raking sheen across the stock. The one thing that says these are
              printed surfaces rather than pictures of them. */}
          <span
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'linear-gradient(114deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.30) 52%, rgba(255,255,255,0) 62%)',
            }}
          />
        </span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Mobile — a different composition, not the stage scaled down
 * ---------------------------------------------------------------------- */

/**
 * Three cards deep, offset and scaled, with the subject in front.
 *
 * The desktop stage scatters five cards across x, y and Z because it has 780px
 * of height and a pointer to light them with. A phone has neither: five
 * scattered cards at 390px is five thumbnails, and there is no cursor to tilt
 * toward. So the depth runs straight back instead of outward — the subject, and
 * two pieces stacked behind it — and the interaction is a tap on the deck rather
 * than a hover.
 */
function MobileDeck({
  featured,
  reduced,
  onPick,
}: {
  featured: number;
  reduced: boolean;
  onPick: (index: number) => void;
}) {
  const count = heroProducts.length;

  return (
    /*
      Square, not 4:5. Each product keeps its own ratio, and the widest of them
      — business cards at 1:1 — is the one that sets how tall the deck needs to
      be. A 4:5 box was two hundred pixels taller than the tallest card in it, so
      a brochure at 1000:546 sat marooned in the middle of its own stage.
    */
    <div className="relative aspect-square w-full">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(60% 44% at 50% 48%, rgba(193,133,70,0.12), transparent 72%)',
        }}
      />

      <button
        type="button"
        onClick={() => onPick((featured + 1) % count)}
        className="absolute inset-0 z-30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
      >
        <span className="sr-only">Show the next product</span>
      </button>

      {heroProducts.map((item, index) => {
        // 0 is the subject; 1 and 2 sit behind it; the rest wait off-stage.
        const depth = (index - featured + count) % count;
        const parked = depth > 2;

        return (
          <m.div
            key={item.id}
            className="absolute left-1/2 top-1/2 w-[84%]"
            initial={false}
            animate={{
              x: '-50%',
              y: `calc(-50% + ${depth * 5}%)`,
              scale: 1 - depth * 0.08,
              opacity: parked ? 0 : 1 - depth * 0.3,
              zIndex: count - depth,
            }}
            style={{ zIndex: count - depth }}
            transition={reduced ? { duration: 0 } : { duration: 0.7, ease: easing.standard }}
          >
            <span
              aria-hidden
              className="relative block overflow-hidden rounded-[3px] bg-paper-100 ring-1 ring-ink-800/8 shadow-[0_2px_4px_rgba(38,34,54,0.06),0_20px_40px_-20px_rgba(38,34,54,0.3)]"
              style={{ aspectRatio: item.aspect }}
            >
              <Image
                src={item.image.src}
                alt=""
                fill
                priority={index === 0}
                sizes="84vw"
                className="object-cover"
              />
            </span>
          </m.div>
        );
      })}
    </div>
  );
}

export default HeroShowcase;
