import type { LucideIcon } from 'lucide-react';

import type { WorkImage } from '@/lib/images';
import type { ReactNode } from 'react';

/* ---------------------------------------------------------------------------
 * Navigation
 * ------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
  /** Shown under the label in the mobile drawer. */
  description?: string;
  /** Opens in a new tab, with rel="noreferrer" applied automatically. */
  external?: boolean;
  children?: NavItem[];
}

export interface FooterColumn {
  title: string;
  links: NavItem[];
}

/* ---------------------------------------------------------------------------
 * Site configuration
 * ------------------------------------------------------------------------- */

export interface PostalAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OpeningHours {
  /** schema.org day names, e.g. ['Monday', …, 'Saturday']. */
  days: string[];
  /** 24-hour, zero-padded: '09:30'. */
  opens: string;
  closes: string;
}

export interface ContactDetails {
  phone: string;
  whatsapp?: string;
  email: string;
  address: PostalAddress;
  /** Human-readable hours, for display. */
  hours: string;
  /** The same hours in a shape Google can parse. Keep the two in sync. */
  hoursSpec?: OpeningHours;
  /** What a visitor is promised after sending a brief. Shown beside every CTA. */
  responseTime?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  founded: number;
  contact: ContactDetails;
  social: SocialLink[];
  ogImage: string;
}

/* ---------------------------------------------------------------------------
 * Content primitives — the shapes the placeholder sections consume today and
 * the CMS will fill later.
 * ------------------------------------------------------------------------- */

export interface ServiceItem {
  id: string;
  title: string;
  summary: string;
  /** Short spec bullets: stock, run length, finish. */
  specs?: string[];
  icon?: LucideIcon;
  href?: string;
  /** Photograph for the detail row. Declared in `src/lib/images.ts`. */
  image?: WorkImage;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  /** Aspect ratio the catalogue tile is cropped to. */
  ratio?: 'portrait' | 'square' | 'landscape';
  href?: string;
  /** Photograph for the tile. Declared in `src/lib/images.ts`. */
  image?: WorkImage;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  discipline: string;
  year: string;
  summary: string;
  ratio?: 'portrait' | 'square' | 'landscape';
}

export interface ProcessStep {
  id: string;
  title: string;
  body: string;
}

export interface Stat {
  value: string;
  label: string;
}

/* ---------------------------------------------------------------------------
 * Component primitives
 * ------------------------------------------------------------------------- */

export type Tone = 'paper' | 'raised' | 'sunken' | 'ink' | 'indigo';
export type Size = 'sm' | 'md' | 'lg';
export type Align = 'left' | 'center';

export interface WithChildren {
  children?: ReactNode;
}

export interface SeoInput {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  /** Set on utility routes that should not be indexed. */
  noIndex?: boolean;
}
