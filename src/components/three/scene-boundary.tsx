'use client';

import { Component, type ReactNode } from 'react';

/**
 * Keeps a 3D failure invisible.
 *
 * A chunk that 404s behind a stale service worker, or a GL context lost when
 * the OS reclaims the GPU, must not take the section around it down. On any
 * error this renders nothing, calls `onError` so the caller can restore
 * whatever the scene was covering, and says nothing to the visitor.
 *
 * ## Why this file is `three`-free
 *
 * Every stage that mounts a scene needs this, and a stage is by definition on
 * the *eager* side of the §5.1 boundary — it is the thing that decides whether
 * the 3D chunk is fetched at all. So this imports React and nothing else, and
 * like `lazy-scene.tsx` it must be **deep-imported**:
 *
 *     import { SceneBoundary } from '@/components/three/scene-boundary';
 *
 * Reaching it through `@/components/three` would pull the barrel, and the
 * barrel pulls `three` straight back into the caller's chunk.
 *
 * It lives here rather than beside either stage because two copies of the same
 * failure handling is how the two copies drift, and the one that drifts is
 * always the one nobody is watching — which for error handling is the whole
 * point of it.
 */
export class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Restore whatever the scene was covering. Without this, a scene that dies
    // *after* the cross-fade leaves an empty frame — the one outcome
    // MASTER_PROJECT_PLAN.md §10.5 rule 8 forbids outright.
    this.props.onError();
    // Analytics is not wired yet; §10.4 rule 7 asks for `3d_load_failed` here.
    if (process.env.NODE_ENV === 'development') {
      console.warn('[three] scene failed, keeping the poster', error);
    }
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default SceneBoundary;
