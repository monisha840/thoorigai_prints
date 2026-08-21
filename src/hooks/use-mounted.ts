'use client';

import { useEffect, useState } from 'react';

/**
 * False during SSR and the first client render, true afterwards. Gate anything
 * that must not run on the server (portals, `window` reads, the 3D canvas).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default useMounted;
