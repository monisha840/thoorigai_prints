import { Section } from '@/components/layout/section';
import { ClientMarquee } from '@/components/ui/client-marquee';
import { cn } from '@/lib/utils';

/**
 * The client strip — a narrow band of names that runs under the header.
 *
 * Deliberately shallow. It sits immediately below the hero, where its whole job
 * is to answer "who else trusts these people" in the second before the visitor
 * decides whether to keep scrolling. Anything taller competes with the hero it
 * is supposed to support.
 *
 * On `honey-band` rather than the honey grid: the grid is the catalogue band's
 * signature and repeating it here would spend it. The band carries the same
 * warmth at a fraction of the weight, and is brightest in the middle so a
 * shallow strip reads as even rather than lit from one corner.
 *
 * See `src/content/clients.ts` for the permission gate on the names.
 */

export interface ClientStripProps {
  label?: string;
  /** Seconds per pass. The about page runs slower — it is a reading page. */
  duration?: number;
  reverse?: boolean;
  tone?: 'honey' | 'paper';
  className?: string;
}

export function ClientStrip({
  label = 'Trusted by',
  duration = 46,
  reverse = false,
  tone = 'honey',
  className,
}: ClientStripProps) {
  return (
    <Section
      tone="paper"
      spacing="none"
      className={cn(
        'overflow-hidden border-y border-paper-400 py-10 md:py-12',
        tone === 'honey' && 'honey-band bg-honey-50',
        className,
      )}
      aria-label="Selected clients"
    >
      <ClientMarquee label={label} duration={duration} reverse={reverse} />
    </Section>
  );
}

export default ClientStrip;
