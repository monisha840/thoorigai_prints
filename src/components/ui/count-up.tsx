'use client';

import { useEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * Counts a figure up from zero when it scrolls into view.
 *
 * Takes the figure as it is written — `2017`, `15+`, `43`, `1,200+` — and
 * animates only the numeric part, so the `+` stays put and thousands keep their
 * separator. Anything it cannot parse is rendered verbatim rather than dropped.
 *
 * Three things it has to get right, none of which are decoration:
 *
 * - **No layout shift.** `tabular-nums` fixes the digit advance, and the
 *   finished figure is rendered underneath at `invisible` to reserve its exact
 *   width. Counting 0 → 1,200 through a proportional font would otherwise
 *   reflow the row on nearly every frame.
 * - **Nothing read mid-count.** The animating text is `aria-hidden`; the real
 *   figure sits beside it in an `sr-only` span, so assistive tech gets `2017`
 *   once instead of two hundred intermediate numbers.
 * - **Reduced motion is a stop, not a slowdown.** With the OS flag set the
 *   final value paints immediately and no frame loop starts at all.
 *
 * Driven on rAF rather than through Framer: this animates text content, not a
 * transform, and a spring would overshoot into numbers above the real figure —
 * which, for a credibility strip, would be a lie for about 200ms.
 */

interface Parsed {
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
  grouped: boolean;
}

function parseFigure(figure: string): Parsed | null {
  const match = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s.exec(figure);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const value = Number(digits.replace(/,/g, ''));
  if (!Number.isFinite(value)) return null;

  return {
    prefix,
    value,
    suffix,
    decimals: digits.includes('.') ? digits.split('.')[1].length : 0,
    grouped: digits.includes(','),
  };
}

function format(value: number, { prefix, suffix, decimals, grouped }: Parsed): string {
  const body = value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
  return `${prefix}${body}${suffix}`;
}

/** Fast out of the gate, long settle. Never overshoots the target. */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export interface CountUpProps {
  /** The figure exactly as it should finish: '2017', '15+', '43'. */
  figure: string;
  /** Milliseconds. */
  duration?: number;
  /** Seconds of hold before this one starts — stagger a row with its index. */
  delay?: number;
  className?: string;
}

export function CountUp({ figure, duration = 1800, delay = 0, className }: CountUpProps) {
  const parsed = parseFigure(figure);
  const reduced = usePrefersReducedMotion();

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => (parsed ? format(0, parsed) : figure));
  const hasRun = useRef(false);

  useEffect(() => {
    if (!parsed) return;

    // Reduced motion, or a browser without IntersectionObserver: show the truth.
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setDisplay(format(parsed.value, parsed));
      return;
    }

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let timer = 0;

    const run = () => {
      const start = performance.now();

      const step = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(t);
        // Rounded per frame so the text never shows a fractional figure for an
        // integer target.
        const current = parsed.decimals
          ? parsed.value * eased
          : Math.round(parsed.value * eased);

        setDisplay(format(current, parsed));

        if (t < 1) frame = requestAnimationFrame(step);
        else setDisplay(format(parsed.value, parsed));
      };

      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Once only. A figure that re-counts every time it re-enters the
          // viewport reads as a glitch, not an effect.
          if (!entry.isIntersecting || hasRun.current) continue;
          hasRun.current = true;
          observer.disconnect();
          timer = window.setTimeout(run, delay * 1000);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
    // `parsed` is derived from `figure` and rebuilt each render; depending on
    // the primitive is what keeps this from re-running every commit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figure, duration, delay, reduced]);

  // Unparseable — a figure like 'Since 2017 →' or a word. Render it as given.
  if (!parsed) return <span className={className}>{figure}</span>;

  return (
    <span ref={ref} className={cn('relative inline-block tabular-nums', className)}>
      {/* Reserves the finished width so the row cannot reflow while counting. */}
      <span aria-hidden className="invisible">
        {figure}
      </span>

      <span aria-hidden className="absolute inset-0">
        {display}
      </span>

      <span className="sr-only">{figure}</span>
    </span>
  );
}

export default CountUp;
