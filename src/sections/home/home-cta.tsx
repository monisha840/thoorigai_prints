import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { FadeUp } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { FeatherWatermark } from '@/components/ui/feather';
import { closingCta } from '@/content/home';
import { primaryCta } from '@/lib/navigation';
import { siteConfig } from '@/lib/site';
import { Eyebrow, bandDark, editorialButton } from './shared';

/**
 * Closing conversion block — MASTER_PROJECT_PLAN.md §6.2 section 12.
 *
 * Every page ends with a way to act; that is non-negotiable in §6. This is the
 * page's most commercially important element, because the audit's single
 * sharpest finding is that the highest-intent page on the live site — Contact —
 * is a 106-character address block with no form, no email and no map.
 *
 * THE CTA LADDER (§6.1). WhatsApp and phone are 65% of the target conversion
 * mix; the form is 25%. Any layout that treats the phone number as a footer
 * detail is optimising the minority channel, which is the live site's exact
 * mistake — three different numbers published, none of them primary. So the
 * number is set large, it is tappable, and it is visible so it can be saved.
 *
 * THE ONE BRONZE FILL (§3.4). The page spends its accent here and nowhere else.
 * On this ground bronze measures 5.62:1 and the ink-950 label on it 6.15:1;
 * white on bronze would be 3.13:1 and is never used.
 *
 * Every contact value reads from `siteConfig` (§5.8). Three phone numbers are
 * live on the current site and two of them are silently dropping enquiries;
 * a single source is what makes that class of bug structurally impossible.
 */
export function HomeCta() {
  const { phone, whatsapp, email, address, hours } = siteConfig.contact;

  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  /**
   * WhatsApp is optional in `SiteConfig`, and the number it holds is not yet
   * confirmed (§0.3 — it is one of three live on the current site). If it is
   * ever removed from config, the button disappears rather than linking
   * somewhere wrong. The message is pre-composed so the buyer types nothing.
   */
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        "Hello Thoorigai Prints - I'd like a quote for a print job.",
      )}`
    : null;

  return (
    <section
      id="quote"
      className={`relative isolate overflow-hidden bg-ink-950 text-paper-200 ${bandDark}`}
      aria-labelledby="cta-heading"
    >
      {/*
        The page's most commercially important band, and until now its flattest
        — nine bands of alternating paper, honey and ink, and the one the whole
        scroll was building towards closed on a plain rectangle.

        Three layers, all CSS, none of them able to move the layout: a rule grid
        for surface, two radial washes for light, and the mark's own feather
        drifting behind the heading. The same treatment closes the four inner
        pages, in `sections/shared/cta-section.tsx` — one closing gesture, used
        everywhere, rather than a different flourish per page.

        `ink-950` is a stop darker than the shared band, so the washes are
        carried a touch stronger here to compensate.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:3.25rem_3.25rem] [mask-image:linear-gradient(to_bottom,#000_0%,transparent_74%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(52rem_30rem_at_4%_-10%,rgba(193,133,70,0.20),transparent_62%),radial-gradient(44rem_28rem_at_104%_110%,rgba(52,79,124,0.24),transparent_60%)]"
      />
      <FeatherWatermark
        tilt={-12}
        className="-left-16 top-6 -z-10 h-80 text-paper-100/[0.05] lg:h-[28rem]"
      />

      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* The ask */}
          <FadeUp className="lg:col-span-7">
            <Eyebrow tone="dark">{closingCta.eyebrow}</Eyebrow>

            <h2
              id="cta-heading"
              className="mt-3 max-w-[20ch] font-display text-display-md font-normal text-paper-200"
            >
              {closingCta.heading}
            </h2>

            <p className="mt-5 max-w-[60ch] text-body-lg text-paper-500">{closingCta.body}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* The page's single bronze fill. */}
              <Button
                href={primaryCta.href}
                variant="accent"
                size="lg"
                iconAfter={<ArrowRight />}
                className={`${editorialButton} hover:text-ink-950`}
                fullWidth
              >
                Get a quote
              </Button>

              {waHref ? (
                <Button
                  href={waHref}
                  variant="secondary"
                  size="lg"
                  icon={<MessageCircle />}
                  className={`${editorialButton} border-paper-100/40 text-paper-200 hover:border-paper-100/70 hover:bg-paper-100/8`}
                  fullWidth
                >
                  WhatsApp us
                </Button>
              ) : null}
            </div>

            <p className="mt-5 text-caption text-paper-500">
              We reply to every enquiry within one working day. {hours}.
            </p>
          </FadeUp>

          {/* The direct channels — one tap each, and the number stays readable. */}
          <FadeUp delay={0.12} className="lg:col-span-5 lg:col-start-9">
            <dl className="space-y-8">
              <div className="border-t border-paper-100/12 pt-6">
                <dt className="font-sans text-eyebrow font-semibold uppercase text-gold-500">
                  Call the studio
                </dt>
                <dd className="mt-3">
                  <a
                    href={telHref}
                    className="group inline-flex items-center gap-3 py-1 font-display text-heading-lg font-normal tabular-nums text-paper-200 motion-tint hover:text-paper-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
                  >
                    <Phone aria-hidden className="size-4 shrink-0 text-gold-500" strokeWidth={1.5} />
                    {phone}
                  </a>
                </dd>
              </div>

              <div className="border-t border-paper-100/12 pt-6">
                <dt className="font-sans text-eyebrow font-semibold uppercase text-gold-500">
                  Email
                </dt>
                <dd className="mt-3">
                  <a
                    href={`mailto:${email}`}
                    className="inline-block py-1.5 text-body-md text-paper-200 underline decoration-gold-500/40 decoration-1 underline-offset-4 motion-tint hover:decoration-gold-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
                  >
                    {email}
                  </a>
                </dd>
              </div>

              <div className="border-t border-paper-100/12 pt-6">
                <dt className="font-sans text-eyebrow font-semibold uppercase text-gold-500">
                  Visit
                </dt>
                <dd className="mt-3">
                  <address className="not-italic text-body-md leading-relaxed text-paper-500">
                    {address.street}
                    <br />
                    {address.city} {address.postalCode}, {address.state}
                  </address>
                  <p className="mt-3 text-caption text-paper-500">{hours}</p>
                </dd>
              </div>
            </dl>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}

export default HomeCta;
