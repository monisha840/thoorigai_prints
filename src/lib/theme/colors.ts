/**
 * Thoorigai Prints — colour tokens.
 *
 * Single source of truth for brand colour in TypeScript land (Framer Motion,
 * React Three Fiber materials, canvas/meta tags). The same values are mirrored
 * as CSS custom properties in `src/styles/globals.css` under `@theme`, which is
 * what generates the Tailwind utilities (`bg-ink-800`, `text-gold-500`, …).
 *
 * If you change a value here, change it there too.
 */

/** The four brand constants, exactly as supplied by the studio. */
export const brand = {
  /** Primary — deep aubergine ink. Headlines, dark sections, body text. */
  primary: '#262236',
  /** Secondary — press blue. Links, supporting surfaces, focus rings. */
  secondary: '#344F7C',
  /** Background — uncoated paper stock. The default canvas of the site. */
  background: '#F6F6F3',
  /** Accent — foil gold. Reserved for emphasis; never for large fills. */
  accent: '#C18546',
} as const;

/** Deep aubergine ink — the primary. */
export const ink = {
  50: '#F4F3F7',
  100: '#E7E5EE',
  200: '#C9C5D6',
  300: '#A9A3BC',
  400: '#7E7794',
  500: '#5A5372',
  600: '#443E58',
  700: '#332E45',
  800: '#262236',
  900: '#1B1826',
  950: '#100E17',
} as const;

/** Press blue — the secondary. */
export const indigo = {
  50: '#F1F5FB',
  100: '#E0E9F5',
  200: '#C0D0E8',
  300: '#93AED4',
  400: '#6187B8',
  500: '#44669A',
  600: '#344F7C',
  700: '#2C4165',
  800: '#263553',
  900: '#1F2B43',
  950: '#141C2C',
} as const;

/** Uncoated paper stock — the background family. */
export const paper = {
  50: '#FFFFFF',
  100: '#FBFBF9',
  200: '#F6F6F3',
  300: '#EDEDE7',
  400: '#E0E0D8',
  500: '#CFCFC4',
  600: '#B4B4A7',
  700: '#8E8E82',
  800: '#6B6B61',
  900: '#4A4A43',
} as const;

/** Foil gold — the accent. */
export const gold = {
  50: '#FBF6EF',
  100: '#F5EAD8',
  200: '#EAD2AF',
  300: '#DDB47F',
  400: '#D09C5D',
  500: '#C18546',
  600: '#A66E39',
  700: '#85562F',
  800: '#6B452A',
  900: '#593B26',
} as const;

/** Semantic aliases — prefer these in component code over raw ramp steps. */
export const semantic = {
  surface: paper[200],
  surfaceRaised: paper[100],
  surfaceSunken: paper[300],
  surfaceInverted: ink[900],

  textPrimary: ink[800],
  textSecondary: ink[500],
  textMuted: ink[400],
  textInverted: paper[100],
  textOnAccent: ink[950],

  border: paper[400],
  borderStrong: paper[500],
  borderInverted: 'rgba(246, 246, 243, 0.14)',

  accent: gold[500],
  accentHover: gold[600],
  link: indigo[600],
  focus: indigo[500],
} as const;

/** Palette handed to React Three Fiber materials and lights. */
export const three = {
  background: paper[200],
  key: '#FFFFFF',
  fill: indigo[300],
  rim: gold[400],
  objectPrimary: ink[800],
  objectAccent: gold[500],
  objectPaper: paper[100],
} as const;

export const colors = { brand, ink, indigo, paper, gold, semantic, three } as const;

export type ColorScale = typeof ink;
export type ColorScaleStep = keyof ColorScale;

export default colors;
