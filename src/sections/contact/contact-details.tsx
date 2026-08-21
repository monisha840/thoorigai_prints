import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';

import { Section } from '@/components/layout/section';
import { FadeUp } from '@/components/motion';
import { Heading } from '@/components/ui/heading';
import { QuoteForm } from '@/features/quote/quote-form';
import { whatsappCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { mapsHref, toTelHref, toWhatsAppHref } from '@/lib/utils';

/**
 * The contact page body: form on the left, studio details on the right.
 *
 * The form is the primary action and gets the wider column; the details column
 * exists because plenty of visitors would rather just phone.
 */
export function ContactDetails() {
  const { contact } = siteConfig;

  return (
    <Section id="quote" tone="raised" spacing="lg" divided className="scroll-mt-24">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
        <FadeUp className="lg:col-span-7">
          <Heading
            level={2}
            size="display-sm"
            eyebrow="Request a quote"
            description="The more you can tell us up front, the closer the first number will be."
          >
            Send us the brief
          </Heading>

          <QuoteForm className="mt-10" />
        </FadeUp>

        <FadeUp delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <h2 className="font-sans text-eyebrow font-medium uppercase text-gold-600">
            The studio
          </h2>

          <ul className="mt-8 flex flex-col">
            <li className="flex gap-4 border-b border-paper-400 py-5 first:pt-0">
              <Phone className="mt-1 size-4 shrink-0 text-gold-600" strokeWidth={1.5} />
              <div>
                <span className="block text-caption uppercase tracking-widest text-ink-400">
                  Phone
                </span>
                <a
                  href={toTelHref(contact.phone)}
                  className="mt-1 block py-1 text-body-md text-ink-800 motion-tint hover:text-gold-700"
                >
                  {contact.phone}
                </a>
              </div>
            </li>

            {contact.whatsapp ? (
              <li className="flex gap-4 border-b border-paper-400 py-5">
                <MessageCircle className="mt-1 size-4 shrink-0 text-gold-600" strokeWidth={1.5} />
                <div>
                  <span className="block text-caption uppercase tracking-widest text-ink-400">
                    WhatsApp
                  </span>
                  <a
                    href={toWhatsAppHref(contact.whatsapp, whatsappCta.message)}
                    rel="noreferrer noopener"
                    className="mt-1 block py-1 text-body-md text-ink-800 motion-tint hover:text-gold-700"
                  >
                    {contact.whatsapp}
                  </a>
                </div>
              </li>
            ) : null}

            <li className="flex gap-4 border-b border-paper-400 py-5">
              <Mail className="mt-1 size-4 shrink-0 text-gold-600" strokeWidth={1.5} />
              <div>
                <span className="block text-caption uppercase tracking-widest text-ink-400">
                  Email
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-1 block break-all py-1 text-body-md text-ink-800 motion-tint hover:text-gold-700"
                >
                  {contact.email}
                </a>
              </div>
            </li>

            <li className="flex gap-4 border-b border-paper-400 py-5">
              <MapPin className="mt-1 size-4 shrink-0 text-gold-600" strokeWidth={1.5} />
              <div>
                <span className="block text-caption uppercase tracking-widest text-ink-400">
                  Address
                </span>
                <address className="mt-1 not-italic text-body-md text-ink-800">
                  {contact.address.street}
                  <br />
                  {contact.address.city}, {contact.address.state}
                  <br />
                  {contact.address.postalCode}
                </address>
              </div>
            </li>

            <li className="flex gap-4 py-5">
              <Clock className="mt-1 size-4 shrink-0 text-gold-600" strokeWidth={1.5} />
              <div>
                <span className="block text-caption uppercase tracking-widest text-ink-400">
                  Hours
                </span>
                <span className="mt-1 block text-body-md text-ink-800">{contact.hours}</span>
              </div>
            </li>
          </ul>

          {/*
            Directions, not an embedded map.

            The slot here used to be a dashed box reading "Map — pending", which
            is the one thing on a contact page that should never be unfinished —
            it sits directly under the address, on the page where a visitor is
            deciding whether this studio is real.

            It is a link out rather than an iframe on purpose. A Google Maps
            embed sets third-party cookies, which would contradict the cookie
            policy this site publishes, and it loads a quarter of a megabyte of
            someone else's JavaScript to show a pin over an address that is
            already legible three lines above. Tapping through opens the map
            application the visitor already has, already signed in, with turn-by
            turn directions from wherever they actually are — which is the thing
            they wanted, and something no embed can do.

            The card is drawn in the house language: the honey wash, a hairline,
            and the same crop marks the print plates carry.
          */}
          <a
            href={mapsHref([
              siteConfig.name,
              contact.address.street,
              contact.address.city,
              contact.address.state,
              contact.address.postalCode,
            ])}
            target="_blank"
            rel="noreferrer noopener"
            className="group honey-wash relative mt-8 block overflow-hidden rounded-[4px] border border-paper-400 p-6 shadow-sheet motion-lift hover:-translate-y-0.5 hover:border-ink-800/20 hover:shadow-lifted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 sm:p-8"
          >
            {/* Crop marks, as on a press sheet — the motif the plates use. */}
            <span aria-hidden className="absolute left-3 top-3 size-3 border-l border-t border-ink-800/15" />
            <span aria-hidden className="absolute right-3 top-3 size-3 border-r border-t border-ink-800/15" />
            <span aria-hidden className="absolute bottom-3 left-3 size-3 border-b border-l border-ink-800/15" />
            <span aria-hidden className="absolute bottom-3 right-3 size-3 border-b border-r border-ink-800/15" />

            <span className="flex items-start gap-4">
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full border border-gold-500/40 bg-paper-50/70 text-gold-700 motion-lift group-hover:border-gold-500 group-hover:bg-paper-50"
              >
                <Navigation className="size-5" strokeWidth={1.5} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-sans text-eyebrow font-semibold uppercase text-gold-700">
                  Find the studio
                </span>
                <span className="mt-2 block font-display text-heading-lg font-normal text-ink-800">
                  Royapettah, central Chennai
                </span>
                <span className="mt-2 block text-body-sm text-ink-500">
                  Ten minutes from Government Estate metro, off Peters Road. Street parking on
                  Nayar Vardha Pillai Street.
                </span>

                <span className="mt-5 inline-flex items-center gap-2 text-body-sm font-medium text-ink-800">
                  <span className="relative">
                    Open directions
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 motion-nudge group-hover:scale-x-100"
                    />
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 motion-nudge group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </span>
              </span>
            </span>
          </a>

          <p className="mt-4 text-caption text-ink-400">
            Call ahead and we will make sure something is running on press when you arrive.
          </p>
        </FadeUp>
      </div>
    </Section>
  );
}

export default ContactDetails;
