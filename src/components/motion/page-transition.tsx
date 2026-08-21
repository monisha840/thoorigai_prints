'use client';

import { m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

import { pageIn } from '@/animations/transitions';
import { pageFade } from '@/animations/variants';

/**
 * Route change motion — MASTER_PROJECT_PLAN.md §9.2.
 *
 * "Page transitions are fade only. No slides, no shared-element transitions
 * across routes."
 *
 * ── The first load does not fade ───────────────────────────────────────────
 *
 * §9.2 also says "nothing animates on page load except the hero", and a wrapper
 * that starts at `opacity: 0` would break that twice over: the whole document
 * would fade in on top of the hero's own entrance, and — because Framer writes
 * the initial variant into the server-rendered markup — the prerendered HTML
 * would ship the entire page at zero opacity. That is a blank page for anyone
 * whose JavaScript never arrives, and a needless delay to first contentful
 * paint for everyone else.
 *
 * So the flag lives *above* the keyed element. `PageTransition` itself is never
 * keyed, so the ref survives navigations, while the `m.div` inside it remounts
 * on each one. First render: `initial={false}`, meaning "you are already
 * visible". Every navigation after that: the fade.
 *
 * ── What is not implemented ────────────────────────────────────────────────
 *
 * §9.2 specifies 200ms out, 300ms in, 150ms overlap. The 300ms in is here; the
 * outgoing half is not, and cannot be done this way. The App Router replaces
 * `children` synchronously, so by the time this re-renders the previous page
 * has already left the tree. Holding it would mean capturing the outgoing
 * `LayoutRouterContext` and rendering a frozen copy — a hack that breaks on
 * Next internals and double-renders every page in the meantime. If the full
 * cross-fade is wanted, the supported route is Next's View Transitions
 * (`experimental.viewTransition`), which would replace this component rather
 * than extend it.
 *
 * Keyed on the pathname only: filtering a grid changes the search params, and
 * that is not a page change.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasNavigated = useRef(false);

  useEffect(() => {
    hasNavigated.current = true;
  }, []);

  return (
    <m.div
      key={pathname}
      data-motion="page"
      initial={hasNavigated.current ? 'hidden' : false}
      animate="visible"
      variants={pageFade}
      transition={pageIn}
    >
      {children}
    </m.div>
  );
}

export default PageTransition;
