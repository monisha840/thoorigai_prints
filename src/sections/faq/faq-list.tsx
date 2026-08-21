'use client';

import Link from 'next/link';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import { Section } from '@/components/layout/section';
import { Stagger, StaggerItem, m } from '@/components/motion';
import { faqs } from '@/content/faq';
import { duration, easing } from '@/lib/theme/animations';
import { pad } from '@/lib/utils';

/**
 * The question list.
 *
 * ## Why these open and close rather than sitting open
 *
 * Twelve answers set as running body copy is a wall a visitor scrolls past to
 * find the one question they arrived with. Collapsed, the page is a scannable
 * index of twelve questions on one screen, which is the shape the reader
 * actually wants — and the first one starts open, so the page never reads as a
 * list of closed doors.
 *
 * ## Every answer is in the HTML, open or closed
 *
 * This is the part that is easy to get wrong, and it is worth more than the
 * animation. The panels are **always rendered** and collapsed with `height: 0`
 * — not mounted on open. Conditional rendering inside an `AnimatePresence` is
 * the idiomatic Framer pattern and it would put exactly one of the twelve
 * answers into the server-rendered markup: a page of questions with no answers,
 * on the route whose entire purpose is to be the answer. Find-in-page would
 * miss eleven of them too.
 *
 * `inert` is what makes that safe. A collapsed panel is zero pixels tall but
 * still in the document, so without it the "See the detail" link inside would
 * stay in the tab order — a keyboard user tabbing into something they cannot
 * see. `inert` removes the subtree from the accessibility tree and from focus
 * while leaving it in the HTML, which is precisely the split this needs.
 *
 * ## The motion
 *
 * Height is the one property §9.2 says not to animate, and a disclosure is the
 * exception that rule always carries: there is no other honest way to open one.
 * It is kept to `--d-base` and paired with an opacity fade, so the text arrives
 * as the panel finishes rather than stretching with it. `initial={false}` stops
 * all twelve animating themselves shut on first paint.
 *
 * The icon is a plus that rotates to a minus. It is a transform, not a swap:
 * two icons cross-fading at 12px reads as a flicker.
 *
 * Under reduced motion the CSS brake in `globals.css` collapses the duration to
 * nothing and the panel simply appears — which is the correct behaviour for a
 * disclosure, unlike a scroll reveal where it would mean content never arrives.
 */
export function FaqList() {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <Section id="questions" tone="raised" spacing="lg" divided className="scroll-mt-28">
      <Stagger as="ul" stream className="mx-auto max-w-[68rem] border-t border-paper-400">
        {faqs.map((faq, index) => {
          const isOpen = open === faq.id;
          const panelId = `faq-panel-${faq.id}`;
          const buttonId = `faq-button-${faq.id}`;

          return (
            <StaggerItem key={faq.id} as="li" id={faq.id} className="scroll-mt-28 border-b border-paper-400">
              {/*
                `h2`, not `h3`. Each question is a top-level section of this
                page — there is no `h2` above them to be a child of, and a
                document that jumps h1 → h3 gives a screen-reader user a level
                that is missing rather than a level that is nested.
              */}
              <h2>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  className="group flex w-full items-start gap-4 py-6 text-left sm:gap-6 sm:py-7"
                >
                  <span className="mt-1.5 shrink-0 font-mono text-caption tabular-nums text-gold-700">
                    {pad(index + 1)}
                  </span>

                  <span className="min-w-0 flex-1 font-display text-heading-lg font-normal text-ink-800 motion-tint group-hover:text-indigo-600">
                    {faq.question}
                  </span>

                  {/*
                    The control is a 44px target in its own right, so the row is
                    tappable at both ends on a phone — the heading and the sign.
                  */}
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-paper-400 bg-paper-200 text-ink-700 motion-lift group-hover:border-ink-800/25 group-hover:bg-paper-50"
                  >
                    <m.span
                      className="grid place-items-center"
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: duration.base, ease: easing.standard }}
                    >
                      {isOpen ? (
                        <Minus className="size-4" strokeWidth={1.5} />
                      ) : (
                        <Plus className="size-4" strokeWidth={1.5} />
                      )}
                    </m.span>
                  </span>
                </button>
              </h2>

              <m.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                // In the document whether open or shut — see the note above.
                inert={!isOpen}
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{
                  height: { duration: duration.base, ease: easing.standard },
                  // The copy fades a little behind the panel on the way in and
                  // a little ahead of it on the way out, so neither direction
                  // shows text mid-clip.
                  opacity: { duration: duration.fast, ease: easing.standard },
                }}
                className="overflow-hidden"
              >
                <div className="flex flex-col items-start gap-5 pb-8 pl-[2.75rem] pr-0 sm:pl-[3.75rem] sm:pr-16">
                  <p className="measure-wide text-body-lg text-ink-500">{faq.answer}</p>

                  {faq.href ? (
                    <Link
                      href={faq.href}
                      className="group/link inline-flex items-center gap-2 rounded-[2px] py-1.5 text-body-sm font-medium text-ink-800 motion-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
                    >
                      <span className="relative">
                        See the detail
                        <span
                          aria-hidden
                          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 motion-nudge group-hover/link:scale-x-100"
                        />
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 motion-nudge group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                        strokeWidth={1.5}
                      />
                    </Link>
                  ) : null}
                </div>
              </m.div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

export default FaqList;
