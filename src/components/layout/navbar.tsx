'use client';

import { Menu, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { Container } from './container';
import { ScrollProgress } from '@/components/motion';
import { MobileMenu } from './mobile-menu';
import { NavLink } from './nav-link';
import { Magnetic } from '@/components/cursor';
import { Button } from '@/components/ui/button';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { mainNav, primaryCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { cn, toTelHref } from '@/lib/utils';

/**
 * The site header.
 *
 * Fixed, and transparent until the page scrolls — then it takes on a paper
 * background and a hairline rule so it separates from the content beneath.
 * Below `lg` the links collapse into `MobileMenu`.
 *
 * The bar is 4.5rem tall, 5.5rem at `lg` until the page scrolls. It is fixed,
 * so each hero owns the top padding that clears it — see `hero.tsx` and
 * `page-hero.tsx`.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // §9.3: "Header on scroll — background + hairline fade past 80px."
  const { isScrolled } = useScrollPosition(80);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-30',
          'motion-lift',
          isScrolled
            ? 'border-b border-paper-400 bg-paper-200/88 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        {/*
          Reading progress, drawn into the hairline the header already has.
          Only once the header has taken its background: over a transparent bar
          on the hero it would be a bronze line floating across a photograph.
        */}
        {isScrolled ? <ScrollProgress /> : null}

        <Container>
          <div
            className={cn(
              // The header used to condense from 5.5rem to 4.5rem on scroll.
              // §9.2 forbids animating height, and an un-animated 16px snap at
              // the threshold is worse than no condense at all — so the height
              // is now constant and the scroll state is carried entirely by the
              // background and hairline, which is what §9.3 specifies.
              'flex h-18 items-center justify-between gap-6',
            )}
          >
            {/* Wordmark */}
            <Link
              href="/"
              className="group flex shrink-0 items-center py-3"
              aria-label={`${siteConfig.name} - home`}
            >
              {/* The lockup is the brand artwork recoloured to gold-600, the
                  token this wordmark already used for "Prints". Published gold
                  (#F3A233) measures 1.93:1 on paper-200 and cannot carry a
                  header; gold-600 is 3.95:1 with the shapes untouched.
                  The link owns the accessible name, so the image is decorative. */}
              <Image
                src="/brand/logo-on-light.png"
                alt=""
                width={350}
                height={100}
                priority
                className="h-7 w-auto sm:h-8 lg:h-9"
              />
            </Link>

            {/* Desktop navigation */}
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Actions.
                Tap-to-call is the shortest route from interest to enquiry, so
                it is present at every width — as a circular icon button on
                phones, where the number itself will not fit, and as the full
                number from `xl` up. */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <a
                href={toTelHref(siteConfig.contact.phone)}
                aria-label={`Call ${siteConfig.name} on ${siteConfig.contact.phone}`}
                className={cn(
                  'hidden size-11 place-items-center rounded-full xs:grid md:hidden',
                  'border border-paper-400 bg-paper-100/70 text-ink-700',
                  'motion-tint hover:border-ink-800/40 hover:text-ink-950',
                )}
              >
                <Phone className="size-5 text-gold-600" strokeWidth={1.5} />
              </a>

              <a
                href={toTelHref(siteConfig.contact.phone)}
                className={cn(
                  'hidden items-center gap-2 text-body-sm font-medium text-ink-500 md:inline-flex',
                  'motion-tint hover:text-ink-900',
                )}
              >
                <Phone className="size-4 text-gold-600" strokeWidth={1.5} />
                <span className="hidden xl:inline">{siteConfig.contact.phone}</span>
                <span className="xl:hidden">Call</span>
              </a>

              {/* The label shortens rather than disappearing — the button used
                  to vanish below 640px, which left small phones with no CTA. */}
              <Magnetic>
                <Button href={primaryCta.href} size="sm" variant="primary">
                  <span className="hidden sm:inline">{primaryCta.label}</span>
                  <span className="sm:hidden">Quote</span>
                </Button>
              </Magnetic>

              <button
                ref={triggerRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                className={cn(
                  'grid size-11 place-items-center rounded-full lg:hidden',
                  'border border-paper-400 bg-paper-100/70 text-ink-700',
                  'motion-tint hover:border-ink-800/40 hover:text-ink-950',
                )}
              >
                <Menu className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={triggerRef} />
    </>
  );
}

export default Navbar;
