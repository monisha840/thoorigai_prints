'use client';

import { AnimatePresence, m } from '@/components/motion';
import { ArrowUpRight, Mail, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type RefObject } from 'react';

import {
  drawerPanel,
  scrim,
  staggerContainer,
  staggerDelay,
  staggerItem,
} from '@/animations/variants';
import { Button } from '@/components/ui/button';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { mainNav, primaryCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { isActivePath, cn, pad, toTelHref } from '@/lib/utils';

/**
 * Full-height drawer navigation for tablet and below.
 *
 * Handles the things a drawer has to get right: the page behind it does not
 * scroll, Escape closes it, focus moves into the panel on open and back to the
 * trigger on close, and the rest of the page is hidden from screen readers
 * while it is open.
 */

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  /** Focus returns here when the drawer closes. */
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(open);

  // Close on route change — the drawer stays mounted across navigations.
  useEffect(() => {
    if (open) onClose();
    // Only pathname should trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      // Keep Tab inside the panel while it is open.
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  // Return focus to the hamburger so keyboard users are not dropped at the top.
  // Guarded by `wasOpen` so this never fires on first mount.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) {
      triggerRef?.current?.focus({ preventScroll: true });
    }
    wasOpen.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
          <m.div
            key="overlay"
            variants={scrim}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink-950/45 backdrop-blur-[2px]"
          />

          <m.div
            key="panel"
            ref={panelRef}
            variants={drawerPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col',
              'bg-paper-100 shadow-press',
            )}
          >
            <div className="flex items-center justify-between border-b border-paper-400 px-6 py-5">
              <span className="font-display text-heading-md text-ink-800">Menu</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className={cn(
                  'grid size-11 place-items-center rounded-full border border-paper-400',
                  'text-ink-600 motion-tint hover:border-ink-800/40 hover:text-ink-900',
                )}
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <m.nav
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex-1 overflow-y-auto px-6 py-8"
            >
              <ul className="flex flex-col">
                {mainNav.map((item, index) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <m.li
                      key={item.href}
                      variants={staggerItem}
                      // The same six-step cap the rest of the site uses. The
                      // container no longer carries `staggerChildren`, because
                      // Framer's own stagger has no ceiling.
                      custom={staggerDelay(index)}
                      className="border-b border-paper-300 last:border-b-0"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className="group flex items-baseline gap-4 py-4"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            'font-mono text-caption tabular-nums',
                            active ? 'text-gold-600' : 'text-ink-300',
                          )}
                        >
                          {pad(index + 1)}
                        </span>

                        <span className="flex-1">
                          <span
                            className={cn(
                              'block font-display text-display-sm motion-tint',
                              active ? 'text-gold-600' : 'text-ink-800 group-hover:text-ink-950',
                            )}
                          >
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="mt-1 block text-body-sm text-ink-400">
                              {item.description}
                            </span>
                          ) : null}
                        </span>

                        <ArrowUpRight
                          className="size-4 shrink-0 self-center text-ink-300 motion-nudge group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </m.li>
                  );
                })}
              </ul>
            </m.nav>

            <div className="border-t border-paper-400 px-6 py-6">
              <Button href={primaryCta.href} variant="primary" fullWidth size="lg">
                {primaryCta.label}
              </Button>

              <div className="mt-6 flex flex-col gap-1 text-body-sm text-ink-500">
                <a
                  href={toTelHref(siteConfig.contact.phone)}
                  className="inline-flex min-h-11 items-center gap-2.5 motion-tint hover:text-ink-900"
                >
                  <Phone className="size-4 text-gold-600" strokeWidth={1.5} />
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex min-h-11 items-center gap-2.5 motion-tint hover:text-ink-900"
                >
                  <Mail className="size-4 text-gold-600" strokeWidth={1.5} />
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export default MobileMenu;
