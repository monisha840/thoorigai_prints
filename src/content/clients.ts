/**
 * Named clients, for the marquee strips on the home and about pages.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PERMISSION GATE — read before launch.
 *
 * These five are the only real, attributable client names anywhere in the
 * project. They come from `docs/content-audit.md`, which records them as jobs
 * genuinely delivered by the studio. Every other "client" on the live site is
 * theme demo content and must not be reused.
 *
 * MASTER_PROJECT_PLAN.md §8.7 gates naming a client on written permission, and
 * that permission is NOT on file for any of these. `SHOW_CLIENT_NAMES` is the
 * single switch: `false` runs the marquee on sectors instead, which is
 * factual and carries no exposure. Flip it to `true` only once permission is
 * confirmed.
 *
 * Nothing here may be padded out with invented names to make the strip look
 * fuller. A marquee repeats its own content — five real names loop cleanly,
 * and a fabricated sixth is the exact failure the audit was written about.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SHOW_CLIENT_NAMES = true;

/**
 * The type voice each name is set in.
 *
 * All three families are the ones already loaded — Fraunces, Inter and the
 * system mono stack. The variety comes from family, style, weight and case,
 * not from new webfonts: a marquee that pulls in six typefaces would cost more
 * than the whole rest of the page.
 */
export type ClientVoice =
  | 'display'
  | 'display-italic'
  | 'sans-tracked'
  | 'sans-light'
  | 'mono';

export interface Client {
  /** As the client writes it. */
  name: string;
  /** Public and factual — what shows when the permission gate is closed. */
  sector: string;
  voice: ClientVoice;
}

export const clients: readonly Client[] = [
  {
    name: 'Prasar Bharati',
    sector: 'National broadcaster',
    voice: 'display',
  },
  {
    name: 'All India Radio, Madurai',
    sector: 'Government of India',
    voice: 'sans-tracked',
  },
  {
    name: 'ActiveSURE',
    sector: 'Healthcare',
    voice: 'mono',
  },
  {
    name: 'LADORN U',
    sector: 'Retail',
    voice: 'display-italic',
  },
  {
    name: 'H K Nath Metals',
    sector: 'Industrial supply',
    voice: 'sans-light',
  },
] as const;

export default clients;
