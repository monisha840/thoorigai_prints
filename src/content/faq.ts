/**
 * Frequently asked questions.
 *
 * ## Every answer here is already published somewhere else on this site
 *
 * That constraint is the whole point of the file. An FAQ is the easiest page on
 * a site to fill with invented reassurance — turnarounds nobody promised,
 * minimums nobody set, guarantees nobody agreed to — and it is also the page
 * most likely to be read as a commitment, because a question implies somebody
 * asked it. So each entry below carries a `source` naming the copy it restates,
 * and nothing enters this array that cannot name one.
 *
 * Three of them (`individuals`, `sizes`, `changes`) are the studio's own words
 * from the live site's FAQ, and are the same three the homepage shows as
 * reassurances — see `reassurances` in `./home`. The rest are restatements of
 * the service summaries in `lib/content.ts`, the process steps that page
 * renders, and the contact record in `lib/site.ts`.
 *
 * ## This is the site's only FAQPage
 *
 * `faqNode()` in `lib/seo/schema.ts` builds its markup from this array and is
 * mounted on `/faq` alone. The homepage used to carry a second FAQPage node for
 * the three reassurances it shows; two FAQPage nodes covering the same three
 * questions on two URLs is duplicate rich-result markup, and Google's response
 * to it is to trust neither. The homepage still shows the reassurances — it
 * just no longer claims them as an FAQ.
 */

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  /** Where this answer already appears. Never leave blank — see the note above. */
  source: string;
  /** Deep link to the page that covers it in full. */
  href?: string;
}

export const faqs: readonly FaqEntry[] = [
  {
    id: 'what-we-print',
    question: 'What kinds of printing do you do?',
    answer:
      'Six disciplines, all run in the same building: digital printing, offset printing, packaging, binding and finishing, prepress and artwork, and book scanning and reprint. Because none of it is subcontracted, a job never waits in a third party’s queue between stages.',
    source: 'services[] in lib/content.ts; /services page hero',
    href: '/services',
  },
  {
    id: 'individuals',
    question: 'I am an individual. Will you take my job?',
    answer:
      'Yes. Our clients include individuals, small-scale businesses and MSMEs as well as big brands.',
    source: 'reassurances[0] — the studio’s own words, verbatim from the live site',
    href: '/contact#quote',
  },
  {
    id: 'digital-or-offset',
    question: 'Should my job run digital or offset?',
    answer:
      'Quantity decides it. Digital suits one to about 3,000 sheets, variable data and same-week turnarounds. Offset earns its setup from roughly 1,000 sheets up, where unit cost matters and colour has to hold across the whole run. Send the quantity, the stock and the date and we will pick — and say so if neither is right for the job.',
    source: 'services digital/offset specs; /services closing CTA copy',
    href: '/services#offset',
  },
  {
    id: 'turnaround',
    question: 'How quickly can you turn a job around?',
    answer:
      'Forty-eight hours is the typical turnaround on a digital job. Offset, packaging and anything with finishing on it depend on the stock and the construction, so we quote the date with the price rather than after it. Most briefs are answered the same working day.',
    source: 'services digital specs (48hr typical); siteConfig.contact.responseTime',
    href: '/contact#quote',
  },
  {
    id: 'sizes',
    question: 'Can you print an unusual size or an unusual design?',
    answer:
      'We can do all types of sizes for any design. Ask us and we will tell you what is possible.',
    source: 'reassurances[1] — the studio’s own words, verbatim from the live site',
    href: '/products',
  },
  {
    id: 'binding',
    question: 'Which binding formats do you run?',
    answer:
      'Nine, all in house: hard case, perfect binding, wiro, centre pin and the variants of each — plus lamination, foiling and spot UV on the same floor. Nothing is sent out for finishing.',
    source: 'services binding summary and specs (9 binding formats)',
    href: '/services#binding',
  },
  {
    id: 'packaging',
    question: 'Do you make packaging as well as print it?',
    answer:
      'Yes. Corrugation, cartons, rigid boxes and paper bags — die-cut, laminated and assembled to a structure that survives transit, to your dimensions rather than to a stock size.',
    source: 'services packaging summary; /products catalogue entries',
    href: '/services#packaging',
  },
  {
    id: 'artwork',
    question: 'Will you check my artwork before it goes to press?',
    answer:
      'Always. Files are preflighted, imposed and proofed before anything reaches a plate — we catch the bleed, the overprint and the missing font while changes are still cheap. Colour is signed off against the proof at the start of the run.',
    source: 'services prepress summary; processSteps prepress and press',
    href: '/services#prepress',
  },
  {
    id: 'changes',
    question: 'What happens if I need changes partway through?',
    answer:
      'There is no limit to creativity, so changes arise. We make them to suit the client and the product.',
    source: 'reassurances[2] — the studio’s own words, verbatim from the live site',
    href: '/about#process',
  },
  {
    id: 'reprints',
    question: 'Can you reprint something you did not originally print?',
    answer:
      'Usually. We run book scanning and print on demand for archives, reprints and out-of-stock titles that still need to be available — so a title with no surviving digital file is not automatically a dead end.',
    source: 'services scanning summary',
    href: '/services#scanning',
  },
  {
    id: 'visit',
    question: 'Can I come and see the studio?',
    answer:
      'Yes, and it is the most useful thing we can do if you are in Chennai. We are on Nayar Vardha Pillai Street in Royapettah, open Monday to Saturday, 9:30am to 7:00pm. Call ahead and we will make sure something is running on press when you arrive.',
    source: 'siteConfig.contact address and hours; /about closing CTA copy',
    href: '/contact',
  },
  {
    id: 'quote',
    question: 'How do I get a quote?',
    answer:
      'Send the format, the quantity and the date you need it by — through the form, on WhatsApp, or by phone. You will get a real answer, including when we are not the right press for the job.',
    source: '/contact page hero; CTA ladder in lib/navigation.ts',
    href: '/contact#quote',
  },
] as const;

export default faqs;
