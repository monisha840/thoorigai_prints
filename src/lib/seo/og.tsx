import { ImageResponse } from 'next/og';

import { brand, gold } from '@/lib/theme/colors';
import { siteConfig } from '@/lib/site';

/**
 * The social card template.
 *
 * Every route renders the same composition with different words, so a set of
 * shared links reads as one studio rather than six unrelated pages. The layout
 * is a press sheet: a rule and a locator at the top, the statement set large in
 * the middle, an imprint line along the bottom.
 *
 * ## Why this matters more than usual here
 *
 * Most enquiries to this studio arrive over WhatsApp, and WhatsApp renders the
 * OpenGraph card at a size where the headline is the entire message. The audit
 * found the legacy site had no card at all, so every link anyone had ever
 * shared — on WhatsApp, in email, on a supplier listing — previewed blank.
 *
 * ## Constraints of the renderer
 *
 * `next/og` runs Satori, which supports a deliberate subset of CSS. Every
 * element with more than one child needs an explicit `display: flex`, there is
 * no `gap` shorthand collapse to rely on, and no web font loads unless it is
 * fetched and passed in. The system stack it falls back to is why the type here
 * is set in weight and size rather than in Fraunces.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * The accent, picked for this card's ground rather than taken from `brand`.
 *
 * **The ground picks the gold, not the other way round.** Measured against
 * `paper-200`: the published brand gold `#F3A233` is 1.93:1, `brand.accent`
 * (gold-500) is 2.89:1, gold-600 is 3.95:1. On ink-900 that inverts and the
 * published gold is the correct one at 8.32:1.
 *
 * This card is paper-ground, so it takes gold-600. It matters more here than
 * almost anywhere else on the site: a 1200×630 card renders around 400px wide
 * in a WhatsApp thread, which turns this 22px eyebrow into about 7px. At 2.89:1
 * that is unreadable at the size it is actually seen.
 *
 * If a dark variant of this card is ever built, this constant flips with the
 * ground — it does not stay put.
 */
const CARD_ACCENT = gold[600];

export interface CardInput {
  /** Small uppercase locator above the rule. */
  eyebrow: string;
  /** The statement, one array entry per rendered line. Two lines reads best. */
  lines: string[];
  /** Optional supporting sentence under the statement. */
  footnote?: string;
}

export function renderCard({ eyebrow, lines, footnote }: CardInput): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: brand.background,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 3, backgroundColor: CARD_ACCENT }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: CARD_ACCENT,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {lines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: lines.length > 2 ? 74 : 92,
                lineHeight: 1.05,
                color: brand.primary,
                letterSpacing: -3,
              }}
            >
              {line}
            </div>
          ))}

          {footnote ? (
            <div
              style={{
                marginTop: 28,
                fontSize: 28,
                lineHeight: 1.35,
                color: brand.secondary,
                maxWidth: 900,
              }}
            >
              {footnote}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${brand.primary}22`,
            paddingTop: 32,
          }}
        >
          <div style={{ fontSize: 34, color: brand.primary }}>{siteConfig.name}</div>
          <div style={{ fontSize: 24, color: brand.secondary }}>thoorigaiprints.com</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/** The locator every card carries. Kept here so it changes in one place. */
export const OG_EYEBROW = `Chennai · Since ${siteConfig.founded}`;
