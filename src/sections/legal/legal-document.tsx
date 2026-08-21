import type { ReactNode } from 'react';

import { Section } from '@/components/layout/section';
import { Stagger, StaggerItem } from '@/components/motion';

/**
 * The shell the three policy pages share.
 *
 * A policy is a reading document, so it gets none of the site's editorial
 * furniture: no photography, no cards, no accent fills. One column at a
 * comfortable measure, a numbered clause index down the side from `lg` up, and
 * the house entrance on each clause so the page still belongs to the site.
 *
 * The index is generated from the clauses rather than hand-maintained — a
 * policy that gains a clause and loses its own contents list is the single most
 * common way these pages rot.
 */

export interface LegalClause {
  id: string;
  heading: string;
  body: ReactNode;
}

export interface LegalDocumentProps {
  /** ISO date. Rendered in full and carried in the `datetime` attribute. */
  updated: string;
  clauses: readonly LegalClause[];
  /** Closing note — who to contact, and what this document does not cover. */
  footnote?: ReactNode;
}

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function LegalDocument({ updated, clauses, footnote }: LegalDocumentProps) {
  return (
    <Section tone="raised" spacing="lg" divided>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Clause index. Sticky from `lg`, where there is a column to spare. */}
        <nav aria-label="On this page" className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <h2 className="font-sans text-eyebrow font-semibold uppercase text-gold-700">
              On this page
            </h2>
            <ol className="mt-5 flex flex-col border-t border-paper-400">
              {clauses.map((clause, index) => (
                <li key={clause.id} className="border-b border-paper-400">
                  <a
                    href={`#${clause.id}`}
                    className="group flex items-baseline gap-3 py-2.5 text-body-sm text-ink-500 motion-tint hover:text-ink-900"
                  >
                    <span className="font-mono text-caption tabular-nums text-ink-300 motion-tint group-hover:text-gold-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">{clause.heading}</span>
                  </a>
                </li>
              ))}
            </ol>

            <p className="mt-6 text-caption text-ink-400">
              Last updated{' '}
              <time dateTime={updated} className="text-ink-500">
                {dateFormat.format(new Date(updated))}
              </time>
            </p>
          </div>
        </nav>

        {/* The document. `stream` because a policy is taller than a screen and
            group mode would finish revealing clause twelve while the reader was
            still on clause two. */}
        <Stagger as="div" stream className="lg:col-span-8 lg:col-start-5">
          {clauses.map((clause, index) => (
            <StaggerItem
              key={clause.id}
              id={clause.id}
              className="scroll-mt-28 border-t border-paper-400 pt-8 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-12"
            >
              <span
                aria-hidden
                className="block font-mono text-caption tabular-nums text-gold-700"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <h2 className="mt-3 font-display text-display-sm font-normal text-ink-800">
                {clause.heading}
              </h2>

              <div className="measure-wide mt-5 flex flex-col gap-4 text-body-md text-ink-500 [&_a]:text-ink-800 [&_a]:underline [&_a]:decoration-gold-500/50 [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:motion-tint hover:[&_a]:decoration-gold-500 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink-700 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
                {clause.body}
              </div>
            </StaggerItem>
          ))}

          {footnote ? (
            <StaggerItem className="mt-14 border-t border-paper-400 pt-8">
              <p className="measure-wide text-body-sm text-ink-400 [&_a]:text-ink-700 [&_a]:underline [&_a]:decoration-gold-500/50 [&_a]:underline-offset-4">
                {footnote}
              </p>
            </StaggerItem>
          ) : null}
        </Stagger>
      </div>
    </Section>
  );
}

export default LegalDocument;
