import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Container } from './container';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { FeatherWatermark } from '@/components/ui/feather';
import { MotionToggle } from '@/components/ui/motion-toggle';
import { Button } from '@/components/ui/button';
import { footerNav, legalNav, primaryCta, whatsappCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { cn, toTelHref, toWhatsAppHref } from '@/lib/utils';

/**
 * Site footer — a dark plate that closes the page.
 *
 * Still a server component. Every reveal below is one of the shared wrappers,
 * each of which is its own small client boundary, so the footer's markup, links
 * and contact details are all server-rendered and none of this content depends
 * on JavaScript arriving — the `[data-motion]` rules in `globals.css` and the
 * `<noscript>` block in `app/layout.tsx` undo the hidden state if it never does.
 *
 * ## Why the footer animates at all
 *
 * It used to be the one band on the site that did not. Every section above it
 * reveals, the seam between sections draws itself, the cards lift — and then
 * the page ended on a wall of static text. That reads as the site running out
 * of energy at exactly the point a visitor who has scrolled this far is most
 * likely to act.
 *
 * The treatment is deliberately quiet, and in a fixed order: the closing ask
 * arrives first, then the brand column, then the three link columns cascade,
 * then the legal bar. It is the reading order, so the eye is led down the plate
 * rather than shown four things at once.
 *
 * Contact rows and footer links carry their own hover states — a bronze rule
 * drawing under the label, an icon warming, an arrow stepping out — all CSS, so
 * they cost nothing and cannot desynchronise from the element they belong to.
 */
export function Footer() {
  const { contact } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-ink-900 text-paper-200">
      {/* The mark's motif at watermark strength, drifting. It is the same
          ornament the hero and the catalogue band carry, so the page closes on
          the note it opened with. Hidden below `sm` by the component itself. */}
      <FeatherWatermark
        tilt={14}
        className="-right-16 -top-10 h-72 text-paper-100/[0.04] lg:h-[26rem]"
      />

      <Container className="relative">
        {/* Closing call to action */}
        <FadeUp className="flex flex-col gap-8 border-b border-paper-100/12 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <p className="inline-flex items-center gap-3 font-sans text-eyebrow font-medium uppercase text-gold-400">
              <span aria-hidden className="h-px w-6 shrink-0 bg-gold-500" />
              Start a job
            </p>
            <p className="measure-tight mt-5 font-display text-display-md text-paper-100">
              Send us the brief. We will tell you what it takes.
            </p>
          </div>

          <Button href={primaryCta.href} variant="accent" size="lg" iconAfter={<ArrowUpRight />}>
            {primaryCta.label}
          </Button>
        </FadeUp>

        {/* Columns */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + contact */}
          <FadeUp delay={0.06} className="lg:col-span-4">
            {/* On ink-900 the published gold needs no help — 8.32:1 — so the
                footer carries the artwork in its true brand colour. */}
            <Link
              href="/"
              className="group inline-flex items-center"
              aria-label={`${siteConfig.name} - home`}
            >
              <Image
                src="/brand/logo-on-dark.png"
                alt=""
                width={350}
                height={100}
                className="h-9 w-auto motion-nudge group-hover:-translate-y-0.5 sm:h-10"
              />
            </Link>

            <p className="measure-tight mt-5 text-body-sm text-paper-200/64">
              {siteConfig.tagline} Digital and offset printing, packaging and binding, produced in
              Chennai since {siteConfig.founded}.
            </p>

            <address className="mt-8 flex flex-col gap-1 not-italic text-body-sm">
              {/*
                The icon warms and steps forward on hover, and the number itself
                lifts to paper-50. Two small things moving together read as one
                row responding; either alone reads as a stray transition.
              */}
              <a
                href={toTelHref(contact.phone)}
                className="group inline-flex min-h-11 items-center gap-3 text-paper-200/78 motion-tint hover:text-paper-50"
              >
                <Phone
                  className="size-4 shrink-0 text-gold-400 motion-nudge group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
                {contact.phone}
              </a>
              {contact.whatsapp ? (
                <a
                  href={toWhatsAppHref(contact.whatsapp, whatsappCta.message)}
                  rel="noreferrer noopener"
                  className="group inline-flex min-h-11 items-center gap-3 text-paper-200/78 motion-tint hover:text-paper-50"
                >
                  <MessageCircle
                    className="size-4 shrink-0 text-gold-400 motion-nudge group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                  {contact.whatsapp}
                  <span className="text-caption text-paper-200/45">WhatsApp</span>
                </a>
              ) : null}
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex min-h-11 items-center gap-3 text-paper-200/78 motion-tint hover:text-paper-50"
              >
                <Mail
                  className="size-4 shrink-0 text-gold-400 motion-nudge group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
                {contact.email}
              </a>
              <span className="flex items-start gap-3 pt-3 text-paper-200/64">
                <MapPin className="mt-1 size-4 shrink-0 text-gold-400" strokeWidth={1.5} />
                <span>
                  {contact.address.street}
                  <br />
                  {contact.address.city}, {contact.address.state} {contact.address.postalCode}
                </span>
              </span>
              {/* Hours belong beside the phone number, not in the legal strip —
                  a visitor deciding whether to call now has to be able to see them. */}
              <span className="flex items-start gap-3 pt-3 text-paper-200/64">
                <Clock className="mt-1 size-4 shrink-0 text-gold-400" strokeWidth={1.5} />
                <span>{contact.hours}</span>
              </span>
            </address>
          </FadeUp>

          {/* Link columns */}
          {/* `sm:col-span-2` matters: without it the three link columns are
              squeezed into one half of a two-column row at tablet width, which
              leaves each of them about 80px wide. */}
          <Stagger
            delay={0.12}
            className="grid gap-10 sm:col-span-2 sm:grid-cols-3 lg:col-span-7 lg:col-start-6"
          >
            {footerNav.map((column) => (
              <StaggerItem key={column.title}>
                <nav aria-label={column.title}>
                  <h2 className="font-sans text-eyebrow font-medium uppercase text-paper-200/45">
                    {column.title}
                  </h2>
                  <ul className="mt-5 flex flex-col">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            // The padding replaces the list's old `gap-3`: same
                            // rhythm, but the target itself is tall enough to hit.
                            'group inline-flex items-center gap-1.5 py-1.5 text-body-sm text-paper-200/78',
                            'motion-tint hover:text-paper-50',
                          )}
                        >
                          <span className="relative">
                            {link.label}
                            {/* The same bronze rule the nav and the arrow links
                                draw, so one hover language runs the whole site. */}
                            <span
                              aria-hidden
                              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-400 motion-nudge group-hover:scale-x-100"
                            />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Bottom bar */}
        <FadeUp
          delay={0.18}
          className="flex flex-col gap-4 border-t border-paper-100/12 py-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-caption text-paper-200/45">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* §9.4 — the motion switch sits with the legal links because it is
                the same kind of thing: a standing preference, not a page action. */}
            <li>
              <MotionToggle />
            </li>

            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-block py-1.5 text-caption text-paper-200/45 motion-tint hover:text-paper-100"
                >
                  <span className="relative">
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-paper-100/40 motion-nudge group-hover:scale-x-100"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </FadeUp>
      </Container>
    </footer>
  );
}

export default Footer;
