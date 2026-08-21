import { ArrowUpRight, MessageCircle } from 'lucide-react';

import { Section } from '@/components/layout/section';
import { FadeUp } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { primaryCta, whatsappCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { quoteHref, toWhatsAppHref } from '@/lib/utils';

/**
 * A single-row conversion strip for the middle of a long page.
 *
 * `CtaSection` closes a page; this one interrupts it. The homepage ran four
 * full sections between the hero buttons and the closing block — six screens of
 * scroll with nowhere to convert — so this sits at the point where a visitor
 * has read what the studio does and is deciding whether to ask.
 *
 * Deliberately small: one line of type and the CTA ladder, on the same paper as
 * the section above it. It is a rest stop, not another destination.
 */

export interface QuoteStripProps {
  /** Overrides the default line of copy. */
  title?: string;
  /** Passed through to the quote link as `?ref=`, so the enquiry has context.
   *  Not named `ref` — React treats that as a real ref prop. */
  source?: string;
  kind?: 'service' | 'product' | 'work';
}

export function QuoteStrip({
  title = 'Know the format and the quantity? That is enough for a number.',
  source,
  kind,
}: QuoteStripProps) {
  const whatsapp = siteConfig.contact.whatsapp ?? siteConfig.contact.phone;

  return (
    <Section tone="sunken" spacing="sm" divided>
      <FadeUp className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="measure-tight font-display text-heading-lg text-ink-800">{title}</h2>
          {siteConfig.contact.responseTime ? (
            <p className="mt-2 text-body-sm text-ink-500">{siteConfig.contact.responseTime}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:shrink-0">
          <Button href={quoteHref(source, kind)} size="md" iconAfter={<ArrowUpRight />}>
            {primaryCta.label}
          </Button>
          <Button
            href={toWhatsAppHref(whatsapp, whatsappCta.message)}
            variant="secondary"
            size="md"
            icon={<MessageCircle />}
          >
            {whatsappCta.label}
          </Button>
        </div>
      </FadeUp>
    </Section>
  );
}

export default QuoteStrip;
