'use client';

import { AnimatePresence, m } from '@/components/motion';

import { dock } from '@/animations/variants';
import { MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Container } from './container';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { primaryCta, whatsappCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { cn, toTelHref, toWhatsAppHref } from '@/lib/utils';

/**
 * A persistent enquiry bar, pinned to the bottom below `lg`.
 *
 * Below 640px the header has room for a wordmark, a call button and a
 * hamburger and not much else, which left the site's actual goal — an enquiry —
 * several taps away for most of its traffic. This carries all three channels at
 * once, always within thumb reach.
 *
 * It stays out of the way until the hero has been read, and it does not render
 * on `/contact`, where the form itself is the action.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  // Roughly one screen of scroll: past the hero, into the argument.
  const { isScrolled } = useScrollPosition(420);

  // The contact page is the destination — a bar pointing at it is noise, and it
  // would sit on top of the form's own submit button.
  if (pathname === '/contact') return null;

  const whatsapp = siteConfig.contact.whatsapp ?? siteConfig.contact.phone;

  return (
    <>
      <AnimatePresence>
        {isScrolled ? (
          <m.div
            key="action-bar"
            variants={dock}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed inset-x-0 bottom-0 z-30 lg:hidden',
              'border-t border-paper-400 bg-paper-100/95 backdrop-blur-md shadow-press',
              // Clears the iOS home indicator.
              'pb-[env(safe-area-inset-bottom)]',
            )}
          >
            <Container className="flex items-center gap-2 py-3">
              <a
                href={toTelHref(siteConfig.contact.phone)}
                aria-label={`Call ${siteConfig.name} on ${siteConfig.contact.phone}`}
                className={cn(
                  'flex h-13 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full',
                  'border border-paper-400 text-ink-700',
                  'motion-tint hover:border-ink-800/40 hover:text-ink-950',
                )}
              >
                <Phone className="size-4 text-gold-600" strokeWidth={1.5} />
                <span className="text-[0.75rem] leading-none">Call</span>
              </a>

              <a
                href={toWhatsAppHref(whatsapp, whatsappCta.message)}
                rel="noreferrer noopener"
                aria-label={whatsappCta.label}
                className={cn(
                  'flex h-13 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full',
                  'border border-paper-400 text-ink-700',
                  'motion-tint hover:border-ink-800/40 hover:text-ink-950',
                )}
              >
                <MessageCircle className="size-4 text-gold-600" strokeWidth={1.5} />
                <span className="text-[0.75rem] leading-none">Chat</span>
              </a>

              <Link
                href={primaryCta.href}
                className={cn(
                  'flex h-13 flex-1 items-center justify-center rounded-full',
                  'bg-ink-800 text-body-md font-medium text-paper-100 shadow-sheet',
                  'motion-tint hover:bg-ink-900',
                )}
              >
                {primaryCta.label}
              </Link>
            </Container>
          </m.div>
        ) : null}
      </AnimatePresence>

      {/* Extends the footer's dark plate so the bar never covers the last line
          of it. Constant, so nothing shifts when the bar slides in. */}
      <div aria-hidden className="h-20 bg-ink-900 lg:hidden" />
    </>
  );
}

export default MobileActionBar;
