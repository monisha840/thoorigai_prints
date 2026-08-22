'use client';

import { m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useReducedMotion } from '@/providers/motion-provider';

/**
 * The pointer: a dot of ink, and a pool of light that follows it.
 *
 * ## The two parts
 *
 * **The dot** is 9px of `#262236` and sits exactly under the hand. No spring,
 * no easing, no lag - because with the native cursor hidden this *is* the
 * cursor, and a cursor that arrives late makes an interface feel broken no
 * matter how elegantly it does it.
 *
 * **The spotlight** is 160px of press blue at eight per cent, and it is the
 * only part that lags. Its centre is fully transparent and the tint peaks
 * around the middle of the radius, so the light falls *around* the pointer
 * rather than over it: type stays at full contrast under the dot, which is the
 * difference between a spotlight and a tinted lens.
 *
 * It is a radial gradient, not a blurred circle. `filter: blur()` on a
 * 160px element that moves every frame is a real cost on a mid-range laptop;
 * a gradient is painted once into a compositor layer and then only ever
 * translated. Same softness, none of the per-frame work.
 *
 * ## How elements talk to it
 *
 * Through the DOM, with `data-cursor`. Nothing registers, nothing subscribes,
 * there is no context and no store: the cursor reads `closest()` when the
 * pointer crosses an element boundary and decides what it is over.
 *
 *   data-cursor="magnetic"  a CTA. The pool tightens and brightens, the dot
 *                           draws in - the light narrowing onto a target.
 *   data-cursor="product"   printed work. The pool widens and warms, and the
 *                           one place the foil accent appears at all.
 *   (a, button, …)          ordinary interactive. A small lift in the pool.
 *
 * The consequence worth having: a component becomes cursor-aware by adding an
 * attribute, and nothing has to be wired to anything.
 *
 * ## What it costs
 *
 * Six elements, and no React render while the pointer moves. Position is two
 * motion values written straight to the DOM by Framer's single loop. Every
 * other change - the pool's size, its opacity, the accent, the dot - is a CSS
 * transition off a data attribute, which changes a handful of times a minute
 * and is interpolated by the compositor rather than by the main thread.
 *
 * ## Where it is not
 *
 * Nowhere without `(hover: hover) and (pointer: fine)`, so a phone renders
 * nothing and attaches no listeners. Nothing under reduced motion. And nothing
 * over a text field, where the attribute comes off `<html>` and the native
 * I-beam comes back - an I-beam is information about what a field does, and no
 * dot replaces it. The native cursor is only hidden once this mounts, so a
 * visitor whose JavaScript never arrives keeps the ordinary arrow.
 */

/** What the pointer is over. Drives everything the CSS does. */
type CursorState = 'default' | 'hover' | 'magnetic' | 'product' | 'text';

/** A CTA. Set by `Magnetic`, which is the only thing that should claim it. */
const MAGNETIC = '[data-cursor="magnetic"]';

/** Printed work - a product tile, a portfolio plate. */
const PRODUCT = '[data-cursor="product"]';

/** Ordinary interactive. Anchors and buttons cover the rest of the site. */
const HOVER = 'a[href], button, [role="button"], summary, label, [data-cursor="hover"]';

/** Where the native caret has to come back. */
const TEXT = 'input, textarea, select, [contenteditable="true"]';

export function SpotlightCursor() {
  const reduced = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const enabled = fine && !reduced;

  const [state, setState] = useState<CursorState>('default');
  const [awake, setAwake] = useState(false);

  /* The pointer. The dot reads these raw; the pool reads them through springs. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /*
    The lag.

    Soft enough that the light visibly arrives after the hand, damped hard
    enough that it never overshoots and swings back - inertia, not a pendulum.
    `restDelta` is what stops the spring from writing sub-pixel updates forever
    after the pointer has stopped.
  */
  const glowX = useSpring(x, { stiffness: 150, damping: 24, mass: 0.9, restDelta: 0.01 });
  const glowY = useSpring(y, { stiffness: 150, damping: 24, mass: 0.9, restDelta: 0.01 });

  const stateRef = useRef<CursorState>('default');
  const lastTarget = useRef<EventTarget | null>(null);
  /*
    A ref, and `awake` is deliberately not a dependency of the effect below.

    Reading the state instead would put `awake` in the dependency array, and the
    first pointer move flips it - which tears the listeners down and runs the
    cleanup, and the cleanup takes `data-cursor` off `<html>`. The symptom is
    the native arrow reappearing the moment the pointer moves and staying until
    it happens to cross something interactive.
  */
  const awakeRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!awakeRef.current) {
        awakeRef.current = true;
        setAwake(true);
      }
    };

    const onOver = (event: PointerEvent) => {
      // `pointerover` fires on every boundary the pointer crosses, and most of
      // those are the same element reporting twice. `closest` on a deep tree is
      // the only part of this that is not free, so it runs once per element.
      if (event.target === lastTarget.current) return;
      lastTarget.current = event.target;

      const el = event.target as Element | null;
      if (!el || typeof el.closest !== 'function') return;

      // Most specific first: a magnetic CTA inside a product tile is a CTA.
      const next: CursorState = el.closest(TEXT)
        ? 'text'
        : el.closest(MAGNETIC)
          ? 'magnetic'
          : el.closest(PRODUCT)
            ? 'product'
            : el.closest(HOVER)
              ? 'hover'
              : 'default';

      if (stateRef.current === next) return;
      stateRef.current = next;
      setState(next);
    };

    // Leaving the window is not the same as stopping: without this the pool is
    // left sitting against whichever edge the pointer went out of.
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      awakeRef.current = false;
      setAwake(false);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      delete root.dataset.cursor;
    };
  }, [enabled, x, y]);

  /*
    Hiding the native cursor is a document-level side effect, kept apart from
    the listeners and keyed to the one piece of state that decides it.
  */
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    if (state === 'text') delete root.dataset.cursor;
    else root.dataset.cursor = 'on';
  }, [enabled, state]);

  if (!enabled) return null;

  const visible = awake && state !== 'text';

  return (
    <div aria-hidden className="sc-root" data-visible={visible ? '' : undefined}>
      {/* The pool. Behind the dot, and the only thing that lags. */}
      <m.div className="sc-follow" style={{ x: glowX, y: glowY }}>
        <div className="sc-glows" data-state={state}>
          <span className="sc-glow sc-glow--ink" />
          {/* Foil, and the only place it appears. Off at zero opacity until the
              pointer is over printed work. */}
          <span className="sc-glow sc-glow--foil" />
        </div>
      </m.div>

      {/* The dot. Exactly under the hand, on every frame. */}
      <m.div className="sc-dot" data-state={state} style={{ x, y }} />
    </div>
  );
}

export default SpotlightCursor;
