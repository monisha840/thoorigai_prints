'use client';

import { RotateCw } from 'lucide-react';
import { useEffect } from 'react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site';
import { toTelHref } from '@/lib/utils';

/**
 * Route error boundary. Must be a client component — Next.js passes it a
 * `reset` callback that re-renders the segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with the studio's error reporter when one is chosen.
    console.error(error);
  }, [error]);

  return (
    <section className="paper-grain flex min-h-[70vh] items-center py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono text-caption uppercase tracking-widest text-gold-600">
            Something misfired
          </span>

          <h1 className="mt-6 font-display text-display-lg text-ink-800">
            That page failed to load.
          </h1>

          <p className="measure mt-6 text-body-lg text-ink-500">
            The error has been logged. Try again — and if it keeps happening, call the studio and we
            will sort it out directly.
          </p>

          {error.digest ? (
            <p className="mt-4 font-mono text-caption text-ink-300">Reference: {error.digest}</p>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button onClick={reset} size="lg" icon={<RotateCw />}>
              Try again
            </Button>
            <Button href={toTelHref(siteConfig.contact.phone)} variant="secondary" size="lg">
              {siteConfig.contact.phone}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
