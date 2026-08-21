'use client';

import { AnimatePresence, m } from '@/components/motion';
import { useEffect, useState } from 'react';

import { curtain, fadeUp } from '@/animations/variants';
import { duration, easing } from '@/lib/theme/animations';
import { cn } from '@/lib/utils';

/**
 * The first-visit curtain: a paper-coloured sheet that lifts once the document
 * has loaded, with the wordmark drawn in behind it.
 *
 * It only runs once per session (sessionStorage), so internal navigation never
 * re-shows it, and it hides itself on `load` rather than a fixed timer, so it
 * never holds a fast connection back. The page underneath renders immediately —
 * this is an overlay, not a gate, which keeps LCP measurable.
 */

const SESSION_KEY = 'tp:intro-shown';

export interface PageLoaderProps {
  /** Minimum time on screen, so the lift does not flash. Milliseconds. */
  minDuration?: number;
  /** Hard ceiling — the curtain always leaves by this point. Milliseconds. */
  maxDuration?: number;
  className?: string;
}

export function PageLoader({
  minDuration = 600,
  maxDuration = 2200,
  className,
}: PageLoaderProps) {
  // Start closed. An effect decides whether this session earns the intro,
  // which keeps the server and first client render identical.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const alreadyShown = window.sessionStorage.getItem(SESSION_KEY);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (alreadyShown || reduced) return;

    window.sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(true);

    const mountedAt = performance.now();
    let minTimer: ReturnType<typeof setTimeout>;

    const dismiss = () => {
      const elapsed = performance.now() - mountedAt;
      const wait = Math.max(0, minDuration - elapsed);
      minTimer = setTimeout(() => setVisible(false), wait);
    };

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
    }

    const maxTimer = setTimeout(() => setVisible(false), maxDuration);

    return () => {
      window.removeEventListener('load', dismiss);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [minDuration, maxDuration]);

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          key="page-loader"
          aria-hidden
          variants={curtain}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-paper-200',
            className,
          )}
        >
          <div className="flex flex-col items-center gap-6">
            <m.span
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-display text-display-sm text-ink-800"
            >
              Thoorigai
            </m.span>

            {/* A rule that fills like ink spreading into the fibre. */}
            <span className="relative block h-px w-32 overflow-hidden bg-paper-400">
              <m.span
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: 1,
                  // The one linear move on the site: §9.1 reserves `--ease-linear`
                  // for progress indicators, and this rule is one.
                  transition: { duration: duration.scene, ease: easing.linear },
                }}
                style={{ originX: 0 }}
                className="absolute inset-0 block bg-gold-500"
              />
            </span>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

export default PageLoader;
