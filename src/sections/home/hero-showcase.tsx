'use client';

import Image from 'next/image';
import {
  animate,
  m,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

import { heroProducts } from '@/content/home';
import { useMediaQuery } from '@/hooks/use-media-query';
import { easing, pointer } from '@/lib/theme/animations';
import { useReducedMotion } from '@/providers/motion-provider';
import { cn } from '@/lib/utils';

/**
 * The hero's media slot: the catalogue on a carousel, turning.
 *
 * ## The shape
 *
 * Five prints mounted on the face of a cylinder, evenly spaced around it, with
 * the cylinder turning slowly on its vertical axis. The piece crossing the
 * front is the subject — nearest the camera, so perspective alone makes it the
 * largest thing on the stage — and the rest fall away around the curve, turning
 * edge-on at the sides and showing their blank reverse as they pass behind.
 *
 * That is one rigid body, not five animations. Every card's position, size and
 * facing is a consequence of a single number — the ring's angle — which is why
 * they can never drift out of formation, and why the whole thing costs one
 * `rotateY` per frame on the compositor.
 *
 *     container-type: inline-size          the stage; all geometry is `cqw`
 *       - perspective: 175cqw              the camera
 *           - tilt        rotateX/rotateY toward the pointer, spring-damped
 *               - ring    rotateY(theta), driven by the frame loop
 *                   - arm x5   rotateY(i * 72deg) translateZ(radius)
 *                         - card   front face + blank reverse, back face hidden
 *
 * ## Why the geometry is in `cqw`
 *
 * `translateZ` cannot take a percentage, so a ring built in pixels is a ring
 * that only looks right at one stage size — and this stage is a grid column,
 * which is 349px at the `lg` breakpoint and 509px at the container's cap. With
 * the stage declared a query container, every distance in the rig (card width,
 * radius, and the camera's own distance) is a share of the stage's width, so
 * the composition is identical at every size and there is no measuring, no
 * `ResizeObserver`, and no first-frame flash while JavaScript works out how big
 * the box is.
 *
 * The camera distance has to scale with the rest of it or the depth changes
 * with the viewport: a fixed `perspective: 1400px` over a 349px ring is nearly
 * orthographic, and over a 900px ring it is a fisheye.
 *
 * ## Why it turns continuously
 *
 * A step-and-hold carousel spends most of its life motionless and the rest of
 * it lurching. Constant angular velocity has no start and no stop to notice, so
 * there is nothing to catch the eye except the thing you want caught — a piece
 * swelling into the front position and shrinking away again. The rhythm comes
 * from the geometry rather than from a timer: at one revolution per 34 seconds
 * each product owns the front of the stage for about seven of them.
 *
 * Nothing snaps, so nothing has to un-snap when a visitor interferes. Hovering
 * eases the ring to a standstill instead of stopping it dead; dragging turns it
 * directly; clicking a card runs it to the front. All three write to the same
 * angle.
 *
 * ## Cost
 *
 * Five images, no WebGL, no measurement. Per frame: one `rotateY` on the ring,
 * and a `scale`/`opacity` pair per card derived from the same angle — all
 * transform and opacity, so all compositor, no layout and no paint.
 */

/**
 * How a card is framed.
 *
 * A photograph pinned edge-to-edge in a rounded rectangle is a picture of a
 * thing. The same photograph centred on a paper mount, inside a hairline, is a
 * *print* — presented the way a studio presents work. That is the entire
 * difference between a flat tile and something that looks considered, and it
 * costs one border and a margin.
 *
 * The subject's edge is `gold-500` at 45%, everything else `ink-800` at 12%.
 * That is the only place the accent appears in the hero, and it does the same
 * job as the caption — it says which one you are meant to be looking at.
 */
const MOUNT = {
  mat: 'relative block rounded-[5px] bg-paper-50 p-3 [backface-visibility:hidden]',
  edge: 'ring-1 ring-ink-800/12',
  edgeFeatured: 'ring-1 ring-gold-500/45',
  window: 'relative block',
} as const;

/**
 * One frame, for all five.
 *
 * Every card was the shape of its own photograph, which ran from 1:1 to 1.83:1
 * — five different rectangles on one ring, and no two the same height as they
 * came round.
 *
 * The obvious fix, a single ratio with `object-cover`, does not survive contact
 * with these particular files: all five are framed tight, and the crop needed
 * to force them into any common shape lands inside the product every time. At
 * 4:3 the brochures lose 13.5% off each side and the left brochure starts 7%
 * in; the business cards lose 12.5% off the top and the upper card starts 5%
 * down. A print studio cannot show half a brochure.
 *
 * So the *card* is uniform and the *print* is not: `object-contain`, centred on
 * the mount, each photograph at its own proportion with paper around it. Which
 * is what matting is, and why the mount exists in the first place. 4:3 is the
 * frame that wastes least across a set running from square to 1.83 — the widest
 * of them fills 73% of its height, the squarest 75% of its width.
 */
const CARD_RATIO = '4 / 3';

/**
 * Loading, per card.
 *
 * All five are eager, and that is a fix rather than a default. Lazy is right for
 * a card below the fold; these are all above it, and each one *becomes the
 * largest element on the page* every time the ring brings it round. With the
 * supporting four lazy, every revolution painted a new large image late and
 * reset Largest Contentful Paint with it — measured at 4,520ms on a 768px
 * viewport, against 1,132ms on desktop where the subject happened to be the
 * eager one.
 *
 * Only the first gets `priority`: that adds a preload hint, and five preload
 * hints compete with each other and with the fonts. The rest simply do not wait.
 */
function loadingProps(index: number) {
  return index === 0 ? ({ priority: true } as const) : ({ loading: 'eager' } as const);
}

const COUNT = heroProducts.length;

/** Angular spacing between neighbours on the ring. 72 degrees for five. */
const STEP = 360 / COUNT;

/**
 * One full revolution.
 *
 * 22 seconds, or 4.4 per product: about three seconds with a piece square to
 * the camera and a second and a half of travel to the next. Slower than this
 * and someone who scrolls past in ten seconds sees two products; much faster
 * and the caption starts changing before it can be read.
 */
const REVOLUTION_MS = 22_000;

/**
 * The cam.
 *
 * A ring at constant angular velocity has a problem the reference for this
 * component does not: for most of every step, *two* cards straddle the front
 * and neither is the subject. Stepping and holding instead would fix it and
 * bring back the lurch.
 *
 * So the ring turns through detents. Its speed is modulated by the cosine of
 * its own angle against the card spacing, which puts a minimum exactly where a
 * card is square to the camera and a maximum exactly between two of them: the
 * ring eases as a piece comes round, all but parks while it is there, then
 * swings on. At 0.62 the speed ranges from 0.38x to 1.62x, which spends about
 * seventy per cent of each step with one card unambiguously in front — five
 * seconds of stillness and two of travel — and never once reaches zero.
 *
 * It is a velocity *field*, a function of position rather than of time, which
 * is what lets a drag or a click move the ring anywhere without any of this
 * needing to know: wherever the ring is let go, it is already on the cam.
 */
const DETENT = 0.62;

/**
 * Base speed, compensated for the cam.
 *
 * Time to cross a full turn is the integral of dθ/v, and for this velocity
 * field that works out to the naive figure divided by √(1 − DETENT²) — 27%
 * longer here. Dividing it back out is what keeps `REVOLUTION_MS` an honest
 * number rather than an input to guess with.
 */
const DEG_PER_MS = 360 / REVOLUTION_MS / Math.sqrt(1 - DETENT ** 2);

/**
 * Time constant for the ring reaching, or leaving, a standstill.
 *
 * The pause is exponential rather than instant: a carousel that stops dead
 * under the cursor reads as broken, and one that restarts dead reads as jumpy.
 * 260ms settles in about two thirds of a second — long enough to feel like
 * inertia, short enough to obey.
 */
const SPIN_EASE_MS = 260;

/** Peak pointer tilt of the whole rig, degrees. Small — felt, not watched. */
const TILT = { x: 5, y: 4 } as const;

/** Drag sensitivity: degrees of ring per pixel of pointer travel. */
const DRAG_DEG_PER_PX = 0.26;

/** Past this much travel the pointer was turning the ring, and the release is not a click. */
const DRAG_SLOP = 6;

/**
 * Extra scale on the piece crossing the front, over and above what perspective
 * already gives it.
 *
 * Perspective alone already makes the front card about 1.6x the ones at the
 * back at this camera distance. This is the last eighth — enough that the
 * subject stays unambiguous through the fast part of the swing, where two
 * cards are both near the front and the widest photograph can otherwise look
 * like the biggest one. Small enough that it never reads as a separate
 * animation layered on top of the turn.
 */
const SPOTLIGHT = 0.12;

export interface HeroShowcaseProps {
  className?: string;
}

export function HeroShowcase({ className }: HeroShowcaseProps) {
  const reduced = useReducedMotion();

  /**
   * The ring's angle, in degrees, and the only piece of state the composition
   * has. Everything else — which card is the subject, how big each one is, how
   * bright, which way it faces — is a pure function of this number.
   *
   * It lives here rather than in `Ring` because the caption reads it too.
   */
  const rotation = useMotionValue(0);

  const [featured, setFeatured] = useState(0);
  const featuredRef = useRef(0);

  /*
    The subject is whichever card is nearest the front, which changes once every
    72 degrees — about once every seven seconds. Deriving it here rather than
    tracking it separately is what keeps the caption and the composition from
    ever disagreeing: there is nothing to keep in sync.

    This fires on every frame the ring moves and sets state on roughly one in
    four hundred of them; the ref is what makes the other 399 free.
  */
  useMotionValueEvent(rotation, 'change', (deg) => {
    const next = (((Math.round(-deg / STEP) % COUNT) + COUNT) % COUNT);
    if (next === featuredRef.current) return;
    featuredRef.current = next;
    setFeatured(next);
  });

  const product = heroProducts[featured];

  return (
    <div className={cn('relative', className)}>
      <Ring rotation={rotation} featured={featured} reduced={reduced} />

      {/*
        The caption. This is where the hierarchy is actually *stated* — the
        composition makes one card dominant, and this names it. An earlier hero
        on this page failed precisely because it had no words; a showcase whose
        subject is unnamed is a gallery again.
      */}
      <div className="mt-6 flex items-baseline gap-4 lg:mt-8">
        <span aria-hidden className="font-mono text-caption tabular-nums text-gold-700">
          {String(featured + 1).padStart(2, '0')}/{String(COUNT).padStart(2, '0')}
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
 * The ring
 * ---------------------------------------------------------------------- */

function Ring({
  rotation,
  featured,
  reduced,
}: {
  rotation: MotionValue<number>;
  featured: number;
  reduced: boolean;
}) {
  const finePointer = useMediaQuery('(pointer: fine)');
  const tilting = finePointer && !reduced;

  /*
    Pointer tilt, on its own element above the ring so it can never change which
    card is at the front — the caption is derived from the ring's angle alone,
    and a pointer that could nudge the subject would make the two disagree.
  */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, pointer.spring);
  const py = useSpring(rawY, pointer.spring);
  const tiltY = useTransform(px, (v) => v * TILT.y);
  const tiltX = useTransform(py, (v) => v * -TILT.x);

  /*
    Current and wanted spin rate, as a 0…1 multiplier of `DEG_PER_MS`. Refs
    rather than state: these change on hover and on every frame of a drag, and
    none of it is anything React needs to know about.
  */
  const speed = useRef(1);
  const wanted = useRef(1);

  /* The two ways the frame loop hands the angle over to someone else. */
  const dragging = useRef(false);
  const snapping = useRef(false);

  const drag = useRef({ lastX: 0, travel: 0 });
  const suppressClick = useRef(false);
  /** The running snap, so a hand on the ring can take it back mid-flight. */
  const snap = useRef<ReturnType<typeof animate> | null>(null);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    // A backgrounded tab stops firing frames entirely; the first one after it
    // comes back carries the whole gap, which would teleport the ring.
    const dt = Math.min(delta, 64);
    const target = dragging.current || snapping.current ? 0 : wanted.current;

    // Frame-rate independent exponential approach: the same settle in the same
    // wall-clock time at 60Hz and at 144Hz.
    speed.current += (target - speed.current) * (1 - Math.exp(-dt / SPIN_EASE_MS));
    if (speed.current < 0.0005) return;

    const theta = rotation.get();
    // The cam. Cosine is even, so it does not care which way the angle runs;
    // it is 1 wherever a card is square to the camera and -1 between two.
    const cam = 1 - DETENT * Math.cos((2 * Math.PI * theta) / STEP);

    // Wrapped, so the angle stays inside one turn however long the page is
    // left open. -370 and -10 degrees are the same picture, so it is invisible
    // — and 360 is a whole number of card spacings, so the cam does not jump.
    let next = theta - DEG_PER_MS * dt * speed.current * cam;
    if (next <= -360) next += 360;
    rotation.set(next);
  });

  /** Run the ring until `index` is at the front, the short way round. */
  const snapTo = useCallback(
    (index: number) => {
      const from = rotation.get();
      const delta = ((((-index * STEP - from) % 360) + 540) % 360) - 180;
      if (Math.abs(delta) < 0.5) return;

      snap.current?.stop();
      snapping.current = true;
      snap.current = animate(rotation, from + delta, {
        duration: reduced ? 0 : 0.85,
        ease: easing.standard,
        onComplete: () => {
          snapping.current = false;
          snap.current = null;
        },
      });
    },
    [reduced, rotation],
  );

  const handlePick = useCallback(
    (index: number) => {
      // The release that ends a drag also fires a click on whatever card was
      // under it. Turning the ring is not choosing a card.
      if (suppressClick.current) {
        suppressClick.current = false;
        return;
      }
      snapTo(index);
    },
    [snapTo],
  );

  const handleEnter = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    // Touch reports an enter on tap and never a matching leave, which would
    // stop the ring for good on a phone.
    if (event.pointerType !== 'mouse') return;
    wanted.current = 0;
  }, []);

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return;

      if (dragging.current) {
        const dx = event.clientX - drag.current.lastX;
        drag.current.lastX = event.clientX;
        drag.current.travel += Math.abs(dx);
        rotation.set(rotation.get() + dx * DRAG_DEG_PER_PX);
        return;
      }

      if (!tilting) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (!box.width || !box.height) return;
      rawX.set((event.clientX - box.left) / box.width - 0.5);
      rawY.set((event.clientY - box.top) / box.height - 0.5);
    },
    [rawX, rawY, rotation, tilting],
  );

  const handleDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;

    // A hand on the ring outranks a snap that is still running: leaving it to
    // finish means two writers on one angle, and the drag loses every frame.
    snap.current?.stop();
    snap.current = null;
    snapping.current = false;

    dragging.current = true;
    suppressClick.current = false;
    drag.current = { lastX: event.clientX, travel: 0 };
  }, []);

  /*
    No `setPointerCapture` here, deliberately. Capture retargets the `pointerup`
    to the capturing element, which moves the synthesised `click` up to this div
    — and the card buttons would stop being clickable at all. The cost is that a
    drag ends when the pointer leaves the stage, which is the right behaviour
    anyway.
  */
  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    suppressClick.current = drag.current.travel > DRAG_SLOP;
  }, []);

  const handleLeave = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return;
      endDrag();
      rawX.set(0);
      rawY.set(0);
      wanted.current = 1;
    },
    [endDrag, rawX, rawY],
  );

  return (
    /*
      The stage, and the query container every distance in the rig is measured
      against. The declared ratio gives it a definite height; `container-type:
      inline-size` contains only the inline axis, so that height still comes
      from the ratio.

      The stage is 5:4 rather than square because the cards are 4:3 and no
      longer as tall as they are wide. A square stage left 94px of empty air
      above and below the front card; 5:4 leaves 43, which is margin rather
      than a gap, and takes 102px off the height of the hero.

      Three numbers set the whole composition, and each is a share of the stage:

      - **card 58** against **radius 41** is what makes it read as a carousel
        rather than as five separate panels. The chord between neighbours on the
        ring is 2·R·sin(36°) = 1.18·R = 48; a card wider than that overlaps the
        one beside it, so the ring closes up instead of leaving a hole in the
        middle of every transition.
      - **camera 180** sets the depth. The front card lands at 1.30× the size of
        one at the same distance as the axis, before the spotlight adds its
        tenth — enough separation that the subject is obvious, not so much that
        the flanks distort into a fisheye.

      The vertical check is the front card against the stage: 58 × 1.30 × 1.12
      is 84% of the stage's width, and at 4:3 that is 63% of its width in
      height — 321px against a 407px stage at the container's cap, so 43px of
      air top and bottom. The float uses 10 of them.

      Below `lg` the card grows and the ring tightens: a phone has a third of
      the width, and the desktop numbers there put the flanking cards off the
      side of the screen rather than at its edges.
    */
    <div
      className={cn(
        'relative aspect-[5/4] w-full select-none',
        '[--ring-card:60cqw] [--ring-radius:42cqw] [--ring-camera:200cqw]',
        'lg:[--ring-card:58cqw] lg:[--ring-radius:41cqw] lg:[--ring-camera:180cqw]',
        tilting && 'cursor-grab active:cursor-grabbing',
      )}
      style={{ containerType: 'inline-size', touchAction: 'pan-y' }}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerDown={handleDown}
      onPointerUp={endDrag}
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

      {/* The camera. Its distance scales with the stage, so the depth of the
          ring is the same picture at 349px and at 509px. */}
      <div
        className="absolute inset-0"
        style={{ perspective: 'var(--ring-camera)', perspectiveOrigin: '50% 48%' }}
      >
        {/* The tilt — the whole rig leaning toward the pointer. */}
        <m.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={tilting ? { rotateX: tiltX, rotateY: tiltY } : undefined}
        >
          {/* The ring itself. One transform, five cards. */}
          <m.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            /* `will-change` holds a compositor layer open, which is exactly
               right for something that turns on every frame and pure waste for
               something that never moves. */
            style={{ rotateY: rotation, willChange: reduced ? undefined : 'transform' }}
          >
            {heroProducts.map((item, index) => (
              <RingCard
                key={item.id}
                item={item}
                index={index}
                rotation={rotation}
                featured={index === featured}
                reduced={reduced}
                onPick={handlePick}
              />
            ))}
          </m.div>
        </m.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * One product on the ring
 * ---------------------------------------------------------------------- */

/**
 * A card, its arm, and its two faces.
 *
 * The arm is stage-sized and carries `rotateY(i * 72deg) translateZ(radius)`,
 * which is what puts the card on the surface of the cylinder — turn to face
 * outward, then step out along the direction you are now facing. It never
 * changes; the ring above it is the only thing that moves.
 *
 * Everything the card does *as it comes round* is a pure function of its angle
 * from the front: it swells, it brightens, and past ninety degrees it shows its
 * back. All of it reads the ring's angle through `useTransform`, so it updates
 * on the same frame as the turn without a single React render.
 */
function RingCard({
  item,
  index,
  rotation,
  featured,
  reduced,
  onPick,
}: {
  item: (typeof heroProducts)[number];
  index: number;
  rotation: MotionValue<number>;
  featured: boolean;
  reduced: boolean;
  onPick: (index: number) => void;
}) {
  /** How far this card is from the front: signed degrees, -180…180. */
  const offset = useTransform(
    rotation,
    (deg) => ((((deg + index * STEP) % 360) + 540) % 360) - 180,
  );

  /** 1 square-on to the camera, 0 edge-on, negative once it is facing away. */
  const facing = useTransform(offset, (deg) => Math.cos((deg * Math.PI) / 180));

  /* Raised to a power, so the swell is a spotlight rather than a slope: a card
     36 degrees off the front has already given up two thirds of it. */
  const scale = useTransform(facing, (f) => 1 + SPOTLIGHT * Math.max(0, f) ** 2.2);

  /*
    Two slopes, meeting at the edge-on position.

    In front of the axis a card is a print and reads at nearly full strength.
    Behind it, it is the blank back of one, and an opacity that reads as depth
    on a photograph reads as a white slab on a plain sheet — worse still on the
    far side, where a card is nearly square-on to the camera again and so at its
    widest. So the back hemisphere keeps falling, to 0.06 at the far side of the
    ring. Never quite to zero: those pieces are what fill the gap between two
    cards mid-swing, and without them the ring opens a hole every time it turns.
  */
  const opacity = useTransform(
    facing,
    (f) => 0.34 + 0.66 * Math.max(0, f) ** 0.9 - 0.28 * Math.max(0, -f),
  );

  return (
    <div
      className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
      /* The arm. Stage-sized, so it turns about the centre of the stage rather
         than about its own card. */
      style={{ transform: `rotateY(${index * STEP}deg) translateZ(var(--ring-radius))` }}
    >
      <m.div
        className="[transform-style:preserve-3d]"
        style={{ width: 'var(--ring-card)', scale, opacity }}
      >
        {/* The float. Offset per card so five never bob in lockstep — in
            lockstep they read as one object, and the illusion of five separate
            pieces is gone. Its own element, because an element gets one
            `transform` and the spotlight above already spent it. */}
        <div
          className={cn('[transform-style:preserve-3d]', !reduced && 'animate-float-slow')}
          style={reduced ? undefined : { animationDelay: `${index * 1.35}s` }}
        >
          <button
            type="button"
            onClick={() => onPick(index)}
            /*
              Keyboard focus brings a card round; a mouse press must not.
              Chrome focuses a button on `mousedown`, so without the
              `:focus-visible` test every attempt to drag the ring fired a snap
              on the way down and then fought the drag for the rest of it.
            */
            onFocus={(event) => {
              if (event.currentTarget.matches(':focus-visible')) onPick(index);
            }}
            aria-pressed={featured}
            className={cn(
              'group/card relative block w-full rounded-[3px] text-left',
              '[transform-style:preserve-3d]',
              'motion-lift hover:-translate-y-1',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500',
            )}
          >
            <span className="sr-only">Show {item.name}</span>

            {/* The front — the print itself, mounted. See `MOUNT`. */}
            <span
              aria-hidden
              className={cn(
                MOUNT.mat,
                'motion-lift',
                featured ? MOUNT.edgeFeatured : MOUNT.edge,
                featured
                  ? 'shadow-[0_2px_4px_rgba(38,34,54,0.06),0_18px_36px_-18px_rgba(38,34,54,0.28),0_48px_90px_-40px_rgba(38,34,54,0.34)]'
                  : 'shadow-[0_1px_2px_rgba(38,34,54,0.05),0_14px_30px_-18px_rgba(38,34,54,0.22)]',
                'group-hover/card:shadow-[0_4px_8px_rgba(38,34,54,0.07),0_26px_50px_-20px_rgba(38,34,54,0.32),0_60px_110px_-45px_rgba(38,34,54,0.36)]',
              )}
            >
              <span className={MOUNT.window} style={{ aspectRatio: CARD_RATIO }}>
                <Image
                  src={item.image.src}
                  alt=""
                  fill
                  draggable={false}
                  {...loadingProps(index)}
                  sizes="(min-width: 1024px) 30vw, 80vw"
                  className="object-contain"
                />

                {/* A raking sheen across the stock. The one thing that says
                    these are printed surfaces rather than pictures of them. */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      'linear-gradient(114deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.30) 52%, rgba(255,255,255,0) 62%)',
                  }}
                />
              </span>
            </span>

            {/*
              The reverse.

              Without it, a card past ninety degrees shows its own photograph
              mirrored — a certificate with its type running backwards, which
              reads as a bug rather than as a card. Hiding the back face instead
              empties half the ring. So each card is given the thing it would
              actually have: the blank side of the stock, in the same mount.
            */}
            <span
              aria-hidden
              className={cn(
                'absolute inset-0 flex items-center justify-center rounded-[5px]',
                'paper-grain bg-paper-100 ring-1 ring-ink-800/10',
                '[backface-visibility:hidden] [transform:rotateY(180deg)]',
                'shadow-[0_10px_24px_-16px_rgba(38,34,54,0.18)]',
              )}
            >
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.42em] text-ink-400/70">
                Thoorigai
              </span>
            </span>
          </button>
        </div>
      </m.div>
    </div>
  );
}

export default HeroShowcase;
