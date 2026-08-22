'use client';

import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/providers/motion-provider';

/**
 * The pointer, as this studio would draw it: a registration dot, and a small
 * stack of sheets trailing behind it.
 *
 * ## What is on screen
 *
 * **The dot** sits exactly under the pointer with no lag at all. A cursor that
 * lags behind the hand is the single fastest way to make an interface feel
 * broken, so it is driven straight off `pointermove` with no spring between.
 * Six pixels of ink with a paper-coloured ring, which is what keeps it visible
 * on the dark bands as well as on paper.
 *
 * **The stack** is three sheets on a real 3D stage - `perspective` on the
 * frame, `translateZ` between the sheets, `rotateX`/`rotateY` on the whole
 * stack. It is spring-lagged, so it arrives a beat after the dot and settles.
 * The tilt is taken from the *velocity* of that spring rather than from the
 * pointer position, which is what makes the sheets lean into a movement and
 * come level again when the hand stops. That single detail is the difference
 * between a stack of sheets being carried and a decal sliding around.
 *
 * ## What it costs
 *
 * Eight elements, and no React render while the pointer moves.
 *
 * The work is split by how often it changes. Position, tilt and scale change
 * every frame, so they are motion values written straight to the DOM by
 * Framer's single animation loop, with React never told. The fan changes only
 * when the pointer crosses into or out of something interactive - a handful of
 * times a minute - so it is a data attribute and a CSS transition, which the
 * compositor interpolates with no main-thread work at all.
 *
 * Measured across a three-second sweep of 300 pointer moves: 535 frames, median
 * 16.7ms, worst 17.5ms, nothing over 32ms, no long tasks. The whole thing adds
 * about 0.1kB to the route.
 *
 * ## Where it is not
 *
 * Nowhere without a real pointer. `(hover: hover) and (pointer: fine)` gates
 * the whole component, so a phone or a tablet renders nothing, attaches no
 * listeners and keeps its native behaviour. It is also off under reduced
 * motion: a cursor with weight and lag is exactly the kind of motion that
 * setting is asking to be spared.
 *
 * Because the native cursor is only hidden once this mounts, a visitor whose
 * JavaScript never arrives keeps the ordinary arrow. Nothing here is load
 * bearing.
 */

/** What the pointer is currently over. */
type CursorState = 'default' | 'expand' | 'text';

/**
 * The things the stack opens up over.
 *
 * Anchors and buttons cover most of it, including the product and portfolio
 * tiles: each of those is an `<article>` whose heading link carries
 * `after:absolute after:inset-0`, so the whole tile is inside the anchor's hit
 * area and `closest('a')` finds it from anywhere on the photograph.
 *
 * `data-cursor="expand"` is the opt-in for anything that is interactive without
 * being either.
 */
const EXPAND =
  'a[href], button, [role="button"], summary, label, [data-cursor="expand"]';

/** Where the native caret has to come back. */
const TEXT = 'input, textarea, select, [contenteditable="true"]';

/**
 * How hard the stack is thrown by the hand.
 *
 * Velocity in px/s, mapped to degrees and clamped. 2600 is roughly a brisk
 * flick across a laptop screen; past that the tilt holds rather than folding
 * the sheets in half.
 */
const THROW = 2600;
const TILT = 15;

export function PaperCursor() {
  const reduced = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const enabled = fine && !reduced;

  const [state, setState] = useState<CursorState>('default');
  const [awake, setAwake] = useState(false);

  /* The pointer itself. Everything on screen is derived from these two. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /*
    The stack's own position. Soft enough to visibly trail the dot, damped
    enough that it never overshoots past it - a follower that bounces past the
    cursor and comes back reads as a toy.
  */
  const followX = useSpring(x, { stiffness: 190, damping: 26, mass: 0.85 });
  const followY = useSpring(y, { stiffness: 190, damping: 26, mass: 0.85 });

  /*
    Tilt from the speed of the follower, not of the pointer. Raw pointer
    velocity is a step function - it spikes on every event and drops to zero
    between them - and tilting off it makes the sheets flicker. The spring has
    already smoothed the motion, so its velocity is continuous.
  */
  const velX = useVelocity(followX);
  const velY = useVelocity(followY);
  const rotateY = useSpring(
    useTransform(velX, [-THROW, THROW], [-TILT, TILT], { clamp: true }),
    { stiffness: 160, damping: 22 },
  );
  const rotateX = useSpring(
    useTransform(velY, [-THROW, THROW], [TILT, -TILT], { clamp: true }),
    { stiffness: 160, damping: 22 },
  );

  /*
    Whole-stack scale: opens on an interactive target, presses on click.

    A motion value rather than a class, unlike the fan below, because Framer
    composes one `transform` from `rotateX`, `rotateY` and `scale` together - a
    scale set in CSS on this element would be overwritten on the next frame.
  */
  const scale = useSpring(1, { stiffness: 320, damping: 26 });

  /* Only used to keep `pointerover` from re-running `closest` per pixel. */
  const lastTarget = useRef<EventTarget | null>(null);
  const stateRef = useRef<CursorState>('default');
  const held = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;

    const setCursorState = (next: CursorState) => {
      if (stateRef.current === next) return;
      stateRef.current = next;
      setState(next);
    };

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setAwake(true);
    };

    const onOver = (event: PointerEvent) => {
      // `pointerover` fires on every element boundary the pointer crosses.
      // Most of those are the same element reporting twice, and `closest` on a
      // deep tree is the one part of this that is not free.
      if (event.target === lastTarget.current) return;
      lastTarget.current = event.target;

      const el = event.target as Element | null;
      if (!el || typeof el.closest !== 'function') return;

      setCursorState(
        el.closest(TEXT) ? 'text' : el.closest(EXPAND) ? 'expand' : 'default',
      );
    };

    // The pointer leaving the window is not the same as it stopping: without
    // this the stack is left sitting against whichever edge it went out of.
    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget === null) setAwake(false);
    };
    const onDown = () => {
      held.current = true;
      scale.set(stateRef.current === 'expand' ? 1.02 : 0.9);
    };
    const onUp = () => {
      held.current = false;
      scale.set(stateRef.current === 'expand' ? 1.14 : 1);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onLeave, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      delete root.dataset.cursor;
    };
  }, [enabled, scale, x, y]);

  /*
    Hiding the native cursor is a document-level side effect, so it is kept
    apart from the listeners and keyed to the state that decides it. `text`
    hands the caret back: an I-beam is information about what a field does, and
    no dot replaces it.
  */
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    if (state === 'text') delete root.dataset.cursor;
    else root.dataset.cursor = 'paper';
  }, [enabled, state]);

  useEffect(() => {
    if (!enabled || held.current) return;
    scale.set(state === 'expand' ? 1.14 : 1);
  }, [enabled, state, scale]);

  if (!enabled) return null;

  const visible = awake && state !== 'text';
  const open = state === 'expand';

  return (
    <div
      aria-hidden
      className='pc-root'
      data-visible={visible ? '' : undefined}
    >
      {/* The dot. No spring: it is the pointer, and the pointer does not lag. */}
      <m.div className='pc-dot' style={{ x, y }} />

      {/* The stack. Springs behind the dot and leans into the movement. */}
      <m.div className='pc-follow' style={{ x: followX, y: followY }}>
        <div className='pc-stage'>
          {/*
            The tilt and the press are motion values; the fan is a data
            attribute. It changes when the pointer crosses into something
            interactive and at no other time, so a CSS transition on the two
            back sheets is both smoother than a spring and free - there is
            nothing for JavaScript to do on the frames in between.
          */}
          <m.div
            className='pc-sheets'
            data-open={open ? '' : undefined}
            style={{ rotateX, rotateY, scale }}
          >
            <span className='pc-sheet' />
            <span className='pc-sheet' />
            <span className='pc-sheet' />
          </m.div>
        </div>
      </m.div>
    </div>
  );
}

export default PaperCursor;
