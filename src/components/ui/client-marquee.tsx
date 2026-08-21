import { Feather } from './feather';
import { SHOW_CLIENT_NAMES, clients, type ClientVoice } from '@/content/clients';
import { cn } from '@/lib/utils';

/**
 * A continuous strip of client names, each set in a different type voice.
 *
 * Mechanics: the track renders the list exactly twice and the keyframe travels
 * -50%, so the seam lands on an identical frame and the loop is invisible — no
 * measuring, no JavaScript, no resize handler. Duration is a CSS variable, so
 * the same component runs fast under the header and slow on the about page.
 *
 * Accessibility: the whole moving track is `aria-hidden` and the names are
 * given once to assistive tech as a plain list underneath. Without that, a
 * screen reader reads five clients twice and a keyboard user tabs into a
 * moving target. The strip pauses on hover, and the reduced-motion rule in
 * `globals.css` stops it dead and hands back a scrollable row.
 *
 * A server component: it has no state and no effects.
 */

const voiceStyles: Record<ClientVoice, string> = {
  display: 'font-display text-heading-lg font-normal',
  'display-italic': 'font-display text-heading-lg font-normal italic',
  'sans-tracked': 'font-sans text-body-md font-semibold uppercase tracking-widest',
  'sans-light': 'font-sans text-heading-md font-light',
  mono: 'font-mono text-body-md uppercase tracking-wide',
};

export interface ClientMarqueeProps {
  /** Seconds for one full pass. Lower is faster. */
  duration?: number;
  tone?: 'light' | 'dark';
  /** Runs right-to-left instead. Pair two strips to make them counter-scroll. */
  reverse?: boolean;
  /** Small label set before the strip. */
  label?: string;
  className?: string;
}

export function ClientMarquee({
  duration = 46,
  tone = 'light',
  reverse = false,
  label,
  className,
}: ClientMarqueeProps) {
  const dark = tone === 'dark';

  // With the gate closed the strip runs on sectors, which need no permission.
  const items = clients.map((client) => ({
    key: client.name,
    text: SHOW_CLIENT_NAMES ? client.name : client.sector,
    voice: client.voice,
  }));

  const row = (
    <ul className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item.key} className="flex shrink-0 items-center">
          <span
            className={cn(
              'whitespace-nowrap px-6 sm:px-9',
              voiceStyles[item.voice],
              dark ? 'text-paper-200/80' : 'text-ink-700',
            )}
          >
            {item.text}
          </span>

          {/* The mark, used as the separator between names. */}
          <Feather
            variant="line"
            className={cn('h-7 w-auto -rotate-[18deg] sm:h-8', dark ? 'text-gold-500/80' : 'text-gold-600/80')}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn('relative w-full', className)}>
      {label ? (
        <p
          className={cn(
            'mb-5 text-center font-sans text-eyebrow font-semibold uppercase tracking-widest',
            dark ? 'text-paper-200/50' : 'text-ink-400',
          )}
        >
          {label}
        </p>
      ) : null}

      <div aria-hidden className="marquee-mask overflow-hidden">
        <div
          className={cn('marquee-track', reverse && 'marquee-reverse')}
          style={{ ['--marquee-duration' as string]: `${duration}s` }}
        >
          {row}
          {/* The second copy is what makes -50% seamless. */}
          {row}
        </div>
      </div>

      {/* The same names, once, for anyone not watching them move. */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.key}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default ClientMarquee;
