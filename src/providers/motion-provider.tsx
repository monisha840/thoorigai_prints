'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { base } from '@/animations/transitions';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * Framer Motion, configured once for the whole tree.
 *
 * - `LazyMotion` + `domAnimation` loads the ~15kb animation feature set rather
 *   than the full ~34kb bundle. Because of it, components must use the `m.*`
 *   namespace (see `src/components/motion/`), never `motion.*`.
 * - `reducedMotion` is wired to both the OS setting and the site's own toggle,
 *   per MASTER_PROJECT_PLAN.md §9.4. When either asks for less motion, Framer
 *   drops every transform-based variant to a plain opacity change.
 *
 * §9.4 asks for the brake to be enforced in three places so it cannot be
 * forgotten. This is the first: `MotionConfig`. The second is the CSS brake in
 * `globals.css`, which also keys off `[data-motion-preference="reduced"]` so
 * the site toggle reaches CSS transitions and keyframes that Framer never sees.
 * The third is `<Parallax>`, which renders no transform at all when reduced.
 */

const STORAGE_KEY = 'tp:reduce-motion';
const DOM_ATTRIBUTE = 'motionPreference';

interface MotionPreferenceValue {
  /** The effective answer: the OS asked, or the visitor did. */
  reduced: boolean;
  /** Only the site toggle, ignoring the OS. `false` means "follow the OS". */
  forced: boolean;
  setForced: (value: boolean) => void;
  toggle: () => void;
}

const MotionPreferenceContext = createContext<MotionPreferenceValue>({
  reduced: false,
  forced: false,
  setForced: () => {},
  toggle: () => {},
});

/**
 * True when motion should be suppressed — for the things Framer cannot see:
 * the 3D frame loop, autoplaying media, JS-driven CSS keyframes.
 */
export function useReducedMotion(): boolean {
  return useContext(MotionPreferenceContext).reduced;
}

/** The toggle's own state. Use in the footer control; prefer `useReducedMotion` elsewhere. */
export function useMotionPreference(): MotionPreferenceValue {
  return useContext(MotionPreferenceContext);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const systemReduced = usePrefersReducedMotion();

  // Starts false so the server render and the first client render agree. The
  // inline script in `app/layout.tsx` has already set the DOM attribute by
  // this point, so CSS is correct before React hydrates and there is no flash.
  const [forced, setForcedState] = useState(false);

  useEffect(() => {
    try {
      setForcedState(window.localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      // Private mode, or storage disabled. Follow the OS and move on.
    }
  }, []);

  const setForced = useCallback((value: boolean) => {
    setForcedState(value);

    try {
      window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {
      // Preference is still live for this session; it just will not persist.
    }
  }, []);

  const reduced = systemReduced || forced;

  // Mirror the *effective* answer onto the document, so the CSS brake needs a
  // single attribute selector rather than one rule per source of truth — and so
  // it keeps up if the OS setting changes while the tab is open.
  useEffect(() => {
    if (reduced) {
      document.documentElement.dataset[DOM_ATTRIBUTE] = 'reduced';
    } else {
      delete document.documentElement.dataset[DOM_ATTRIBUTE];
    }
  }, [reduced]);

  const value = useMemo<MotionPreferenceValue>(
    () => ({ reduced, forced, setForced, toggle: () => setForced(!forced) }),
    [reduced, forced, setForced],
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion={forced ? 'always' : 'user'} transition={base}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </MotionPreferenceContext.Provider>
  );
}

/**
 * Runs before first paint so a visitor who has turned motion off never sees a
 * frame of it. Kept to one statement and inlined in `app/layout.tsx`; the
 * `try` matters because storage throws outright in some privacy modes.
 */
export const motionPreferenceScript = `try{if(localStorage.getItem('${STORAGE_KEY}')==='1')document.documentElement.dataset.${DOM_ATTRIBUTE}='reduced'}catch(e){}`;

export default MotionProvider;
