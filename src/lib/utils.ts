import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The type scale, as tailwind-merge needs to be told about it.
 *
 * These are the `--text-*` tokens from the `@theme` block in
 * `src/styles/globals.css`. They have to be repeated here because
 * tailwind-merge does not read the stylesheet: out of the box it decides
 * whether `text-foo` is a size or a colour by pattern, and none of these look
 * like a size to it. Every one therefore lands in the *colour* group, and a
 * colour class written after a size class silently deletes it —
 *
 *   cn('font-display text-display-lg', 'text-ink-800')  ->  'font-display text-ink-800'
 *
 * which is a heading rendered at body size with no error anywhere. Declaring
 * them as font sizes puts each in its own group, so size and colour coexist.
 *
 * Adding a `--text-*` token to the stylesheet means adding it here too.
 */
const fontSizes = [
  'display-2xl',
  'display-xl',
  'display-lg',
  'display-md',
  'display-sm',
  'heading-lg',
  'heading-md',
  'heading-sm',
  'body-lg',
  'body-md',
  'body-sm',
  'caption',
  'eyebrow',
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...fontSizes] }],
    },
  },
});

/**
 * Merge conditional class names and let later Tailwind utilities win over
 * earlier conflicting ones. The single class-name helper for the whole app.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Zero-pad an index for editorial numbering: 1 -> "01". */
export function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

/** "Perfect Binding" -> "perfect-binding" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Strip a trailing slash so "/services/" and "/services" compare equal. */
export function normalizePath(path: string): string {
  if (path === '/') return path;
  return path.replace(/\/+$/, '');
}

/**
 * Is `href` the active route? A nested route ("/services/offset") keeps its
 * parent ("/services") marked active; "/" only matches exactly.
 */
export function isActivePath(pathname: string, href: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(target + '/');
}

/** Digits-only tel: href from a display number. */
export function toTelHref(phone: string): string {
  return 'tel:' + phone.replace(/[^\d+]/g, '');
}

/**
 * wa.me deep link from a display number, with an optional prefilled message.
 *
 * WhatsApp wants a bare international number — no plus, no spaces — so a
 * ten-digit local number is assumed Indian and gets the country code.
 * A `tel:` href here would open the dialler instead, which is the wrong app
 * for the one channel most enquiries arrive on.
 */
export function toWhatsAppHref(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const international = digits.length === 10 ? '91' + digits : digits;
  const base = 'https://wa.me/' + international;
  return message ? base + '?text=' + encodeURIComponent(message) : base;
}

/**
 * Link into the quote form, carrying what the visitor was looking at.
 *
 *   quoteHref('offset')          -> '/contact?ref=offset#quote'
 *   quoteHref('boxes', 'product') -> '/contact?ref=boxes&kind=product#quote'
 *
 * `QuoteForm` reads these back to preselect the service and seed the brief, so
 * an enquiry arrives with context instead of starting from a blank field.
 */
export function quoteHref(ref?: string, kind?: 'service' | 'product' | 'work'): string {
  if (!ref) return '/contact#quote';
  const params = new URLSearchParams({ ref });
  if (kind) params.set('kind', kind);
  return '/contact?' + params.toString() + '#quote';
}

/** Google Maps search link for a postal address. */
export function mapsHref(parts: Array<string | undefined>): string {
  const query = parts.filter(Boolean).join(', ');
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Absolute URL against the configured site origin. */
export function absoluteUrl(path = '/'): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thoorigaiprints.com';
  return new URL(path, base).toString();
}
