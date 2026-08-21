/**
 * Thoorigai Prints — typography tokens.
 *
 * Editorial pairing: a high-contrast variable serif for display, a neutral
 * grotesque for everything the reader actually reads. Sizes are fluid via
 * `clamp()` so mobile never needs a separate scale.
 *
 * Mirrored as `--text-*` / `--font-*` in `src/styles/globals.css`.
 */

export const fontFamily = {
  /** Fraunces — display serif. Loaded in `src/app/layout.tsx`. */
  display: 'var(--font-display), "Iowan Old Style", Georgia, "Times New Roman", serif',
  /** Inter — UI and body. */
  sans: 'var(--font-sans), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  /** Spec sheets, dimensions, GSM values. */
  mono: 'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace',
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const letterSpacing = {
  tighter: '-0.04em',
  tight: '-0.02em',
  normal: '0em',
  wide: '0.02em',
  wider: '0.08em',
  /** Eyebrows and small-caps labels. */
  widest: '0.18em',
} as const;

export const lineHeight = {
  none: '1',
  tight: '1.08',
  snug: '1.18',
  normal: '1.5',
  relaxed: '1.65',
  loose: '1.8',
} as const;

/**
 * The type scale. `size` values are fluid; the min is the mobile size and the
 * max is the desktop size, so no breakpoint overrides are needed.
 */
export const fontSize = {
  'display-2xl': { size: 'clamp(3rem, 10vw, 7.5rem)', lineHeight: lineHeight.none, letterSpacing: letterSpacing.tighter },
  'display-xl': { size: 'clamp(2.75rem, 8vw, 5.75rem)', lineHeight: lineHeight.tight, letterSpacing: letterSpacing.tighter },
  'display-lg': { size: 'clamp(2.25rem, 5.5vw, 4.25rem)', lineHeight: lineHeight.tight, letterSpacing: letterSpacing.tight },
  'display-md': { size: 'clamp(1.875rem, 4vw, 3.25rem)', lineHeight: lineHeight.snug, letterSpacing: letterSpacing.tight },
  'display-sm': { size: 'clamp(1.625rem, 3vw, 2.375rem)', lineHeight: lineHeight.snug, letterSpacing: letterSpacing.tight },

  'heading-lg': { size: 'clamp(1.375rem, 2.2vw, 1.75rem)', lineHeight: lineHeight.snug, letterSpacing: letterSpacing.tight },
  'heading-md': { size: 'clamp(1.1875rem, 1.6vw, 1.375rem)', lineHeight: lineHeight.normal, letterSpacing: letterSpacing.normal },
  'heading-sm': { size: '1.0625rem', lineHeight: lineHeight.normal, letterSpacing: letterSpacing.normal },

  'body-lg': { size: 'clamp(1.0625rem, 1.2vw, 1.1875rem)', lineHeight: lineHeight.relaxed, letterSpacing: letterSpacing.normal },
  'body-md': { size: '1rem', lineHeight: lineHeight.relaxed, letterSpacing: letterSpacing.normal },
  'body-sm': { size: '0.9375rem', lineHeight: lineHeight.normal, letterSpacing: letterSpacing.normal },

  caption: { size: '0.8125rem', lineHeight: lineHeight.normal, letterSpacing: letterSpacing.wide },
  /** Small-caps eyebrow above section headings. */
  eyebrow: { size: '0.75rem', lineHeight: lineHeight.normal, letterSpacing: letterSpacing.widest },
} as const;

/** Reading-measure caps. Long-form copy should never exceed ~72ch. */
export const measure = {
  tight: '38ch',
  normal: '58ch',
  wide: '72ch',
} as const;

export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  measure,
} as const;

export type FontSizeToken = keyof typeof fontSize;

export default typography;
