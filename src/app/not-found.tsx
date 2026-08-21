import { ArrowLeft } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { mainNav } from '@/lib/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="paper-grain flex min-h-[70vh] items-center py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono text-caption uppercase tracking-widest text-gold-600">
            Error 404
          </span>

          <h1 className="mt-6 font-display text-display-lg text-ink-800">
            This page never went to press.
          </h1>

          <p className="measure mt-6 text-body-lg text-ink-500">
            The address does not match anything on the site. It may have moved during the redesign,
            or the link may have been mistyped.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/" size="lg" icon={<ArrowLeft />}>
              Back to home
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Contact the studio
            </Button>
          </div>

          <nav aria-label="Site sections" className="mt-14 border-t border-paper-400 pt-8">
            <p className="text-caption uppercase tracking-widest text-ink-400">Or try</p>
            <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1.5 text-body-sm text-ink-600 underline decoration-paper-500 underline-offset-4 motion-tint hover:text-ink-900 hover:decoration-gold-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
