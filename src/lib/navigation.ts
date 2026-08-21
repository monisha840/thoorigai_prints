import type { FooterColumn, NavItem } from '@/types';

/**
 * The single navigation source of truth. The desktop navbar, the mobile
 * drawer, the footer and `app/sitemap.ts` all read from here, so a route
 * is added in exactly one place.
 */
export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    description: 'Digital, offset, packaging and binding — what we run and how.',
  },
  {
    label: 'Products',
    href: '/products',
    description: 'Books, boxes, bags, cards and stationery, by format.',
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    description: 'Selected work, photographed as delivered.',
  },
  { label: 'About', href: '/about', description: 'The studio, the presses, the people.' },
  { label: 'Contact', href: '/contact', description: 'Briefs, quotes, visits.' },
];

/**
 * The call-to-action ladder, defined once.
 *
 * Three rungs, in descending commitment: send a brief, message us, call us.
 * Components pick a rung and render it with the matching button variant —
 * filled for primary, outline for secondary, text for tertiary — so the
 * hierarchy is the same on every page and the labels change in one file.
 */
export const primaryCta = {
  label: 'Get a quote',
  href: '/contact#quote',
} as const;

/** Second rung: the lowest-friction channel, and the one most enquiries use. */
export const whatsappCta = {
  label: 'WhatsApp us',
  /** Seeds the message so the studio gets context, not just a 'hi'. */
  message: 'Hi Thoorigai Prints — I would like a quote for a print job.',
} as const;

/** Third rung: for the visitor who was always going to phone. */
export const callCta = {
  label: 'Call the studio',
} as const;

export const footerNav: FooterColumn[] = [
  {
    title: 'Studio',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Digital printing', href: '/services#digital' },
      { label: 'Offset printing', href: '/services#offset' },
      { label: 'Packaging', href: '/services#packaging' },
      { label: 'Binding', href: '/services#binding' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Books & journals', href: '/products#books' },
      { label: 'Boxes & cartons', href: '/products#boxes' },
      { label: 'Bags & retail', href: '/products#bags' },
      { label: 'Stationery', href: '/products#stationery' },
    ],
  },
];

/**
 * Footer bottom bar.
 *
 * All three routes are live — `app/privacy`, `app/terms` and `app/cookies`.
 * They were link-only for the length of the build, which meant the three most
 * visible links on the most cautious page of the site each returned a 404, and
 * two legacy WordPress redirects pointed at those 404s.
 */
export const legalNav: NavItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
];

export default mainNav;
