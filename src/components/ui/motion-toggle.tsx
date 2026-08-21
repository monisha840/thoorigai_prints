'use client';

import { useMotionPreference } from '@/providers/motion-provider';
import { cn } from '@/lib/utils';

/**
 * The motion switch — MASTER_PROJECT_PLAN.md §9.4.
 *
 * "A user-facing motion toggle in the footer, persisted, forces Tier C
 * regardless of device."
 *
 * It exists because the OS setting is not always the right question. Someone
 * can be fine with motion in general and still not want it on a page they are
 * trying to read a specification off; someone on a borrowed machine has no OS
 * setting of their own at all.
 *
 * Rendered as a real `switch` so assistive tech announces state rather than a
 * label, and the control never claims to have turned motion *on* when the OS is
 * still asking for it off — in that case the switch reads as on and disabled,
 * because the OS wins and pretending otherwise would be a lie.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { forced, reduced, setForced } = useMotionPreference();

  // The OS is already asking for reduced motion, and nothing here can override
  // that — so the control shows the true state and steps out of the way.
  const lockedBySystem = reduced && !forced;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={reduced}
      aria-label="Reduce motion"
      disabled={lockedBySystem}
      title={
        lockedBySystem
          ? 'Your device is set to reduce motion, so this is already on.'
          : undefined
      }
      onClick={() => setForced(!forced)}
      className={cn(
        'group inline-flex items-center gap-3 py-1.5 text-caption text-paper-200/45',
        'motion-tint hover:text-paper-100',
        'rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500',
        'disabled:cursor-default disabled:hover:text-paper-200/45',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'relative h-4 w-7 shrink-0 rounded-full border motion-tint',
          reduced ? 'border-gold-500/60 bg-gold-500/25' : 'border-paper-100/25 bg-paper-100/8',
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full motion-nudge',
            reduced ? 'left-3.5 bg-gold-400' : 'left-0.5 bg-paper-200/60',
          )}
        />
      </span>
      Reduce motion
    </button>
  );
}

export default MotionToggle;
