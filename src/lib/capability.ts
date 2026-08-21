/**
 * Device capability, resolved once.
 *
 * `MASTER_PROJECT_PLAN.md` §10.3 defines three tiers and a `CapabilityProvider`
 * to resolve them. That provider does not exist yet. This is the narrow slice
 * the hero needs — *may this device load WebGL at all* — written so it can be
 * lifted into the real provider without changing its rules.
 *
 * Deliberately free of any `three` import: it is read from the eager bundle to
 * decide whether the 3D chunk is ever fetched, so importing across the §5.1
 * boundary here would defeat the whole point.
 *
 * ## The bias
 *
 * §10.3 is explicit that the audience is largely mid-range Android on mobile
 * data, so **Tier B is the realistic default, not Tier A**. Every check below
 * therefore fails *closed*: anything unknown, unsupported or unmeasurable
 * resolves to "no 3D". A visitor who could have had the canvas and does not
 * loses nothing — the poster is a finished photograph. A visitor who could not
 * afford it and gets it anyway pays in battery and jank.
 */

export type DeviceTier = 'A' | 'B' | 'C';

/** Vendor-prefixed and Chromium-only fields, typed rather than cast at use. */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

interface CapabilityNavigator extends Navigator {
  connection?: NetworkInformation;
  deviceMemory?: number;
}

/** Connection types too slow to justify a 3D payload, from §10.3. */
const SLOW_CONNECTIONS = new Set(['slow-2g', '2g', '3g']);

/**
 * Is there a WebGL2 context to be had?
 *
 * Probed with a throwaway canvas, then explicitly released. Without the
 * `loseContext` call this leaks a GL context per probe, and browsers cap the
 * number of live contexts per page at around sixteen — on a page that later
 * wants a real one, that matters.
 */
function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve the tier. Call once, on the client, after mount.
 *
 * Returns `'C'` on the server so nothing renders 3D during SSR.
 */
export function resolveTier(): DeviceTier {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'C';

  const nav = navigator as CapabilityNavigator;

  // Reduced motion is a stated preference, not a guess — it outranks every
  // capability signal below it. §10.3 puts it first in the Tier C list.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'C';

  // The site's own footer toggle, which sets this before hydration.
  if (document.documentElement.dataset.motionPreference === 'reduced') return 'C';

  if (nav.connection?.saveData) return 'C';
  if (nav.connection?.effectiveType && SLOW_CONNECTIONS.has(nav.connection.effectiveType)) {
    return 'C';
  }
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return 'C';
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return 'C';
  if (!hasWebGL2()) return 'C';

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const strong =
    finePointer &&
    (nav.hardwareConcurrency ?? 0) >= 8 &&
    (nav.deviceMemory ?? 0) >= 8;

  return strong ? 'A' : 'B';
}

/** Tier C never loads WebGL. A and B do. */
export function tierAllows3D(tier: DeviceTier): boolean {
  return tier !== 'C';
}
