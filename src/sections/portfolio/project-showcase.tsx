import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Parallax, Stagger, StaggerItem } from '@/components/motion';
import { Badge } from '@/components/ui/badge';
import { PrintPlate } from '@/components/ui/print-plate';
import type { FilterId, Project } from '@/lib/portfolio';
import { cn, pad, quoteHref } from '@/lib/utils';

/**
 * The work itself.
 *
 * Full-width alternating rows rather than a card grid: eight jobs is few enough
 * that each can be given room, and a printed piece needs size before its finish
 * is legible at all. Foil and spot varnish simply disappear in a 300px tile.
 *
 * `stream` rather than the default group cascade — the list is several screens
 * tall, so each row waits for its own trigger instead of finishing its
 * animation two screens below the fold.
 *
 * Keying the container on the active filter remounts the list, so a filter
 * change replays the reveal. No exit animation and no layout animation: the
 * house allows one entrance pattern, and a clean re-cascade reads better here
 * than eight rows sliding past each other.
 */

export interface ProjectShowcaseProps {
  projects: Project[];
  /** Remount key — a filter change should replay the reveal. */
  activeFilter: FilterId;
}

export function ProjectShowcase({ projects, activeFilter }: ProjectShowcaseProps) {
  return (
    <Stagger
      key={activeFilter}
      as="ol"
      stream
      className="flex flex-col gap-24 md:gap-32 lg:gap-40"
    >
      {projects.map((project, index) => (
        <StaggerItem key={project.id} as="li" className="group">
          <ProjectRow project={project} index={index} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  // Alternating sides give the column of rows a rhythm. On mobile everything
  // stacks image-first, because the photograph is the reason to stop scrolling.
  const flipped = index % 2 === 1;

  return (
    <div
      className={cn(
        'grid items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16',
        flipped && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {/* --------------------------------------------------------- Plate */}
      {/*
        The plate drifts against the scroll, and the direction alternates with
        the row. Two plates travelling the same way down a long column read as
        the page sliding; alternating them makes each row a separate plane and
        gives the eight-row scroll the depth a flat column cannot have.

        Twelve pixels, well under §9.2's twenty-pixel ceiling, and `Parallax`
        clamps it anyway. It is inert below `lg` and under reduced motion, where
        it renders no transform at all rather than a transform of zero — so on a
        phone, where the rows stack image-first, nothing is promoted to a layer
        for a movement that never happens.
      */}
      <Parallax offset={flipped ? -12 : 12} className="lg:col-span-7">
        <PrintPlate
          image={project.image}
          ratio="wide"
          sizes="(min-width: 1024px) 56vw, 100vw"
          tone={project.image.ground === 'dark' ? 'ink' : 'paper'}
          marks
          overlay={
            <span className="pointer-events-none absolute left-5 top-5 font-mono text-caption tabular-nums text-paper-100 mix-blend-difference">
              {pad(index + 1)}
            </span>
          }
        />
      </Parallax>

      {/* -------------------------------------------------------- Column */}
      <div className="lg:col-span-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="sm" variant="outline">
            {project.sector}
          </Badge>
          <span className="font-mono text-caption tabular-nums text-ink-400">{project.year}</span>
        </div>

        <h3 className="mt-5 font-display text-display-sm text-ink-800">{project.title}</h3>

        <p className="measure mt-4 text-body-md text-ink-500">{project.summary}</p>

        {/* A spec block, set like a colophon. This is what a print buyer
            actually scans for. */}
        <dl className="mt-8 border-t border-paper-400">
          {project.specs.map((spec) => (
            <div
              key={spec.label}
              className="flex items-baseline justify-between gap-6 border-b border-paper-400 py-3.5"
            >
              <dt className="text-caption uppercase tracking-widest text-ink-300">{spec.label}</dt>
              <dd className="text-right text-body-sm text-ink-700">{spec.value}</dd>
            </div>
          ))}
        </dl>

        {/*
          Four of these jobs are for named clients that `docs/image-usage-guide.md`
          flags as needing written permission before publication. Until that is on
          file the sector is what ships, and this line says why the name is
          missing rather than leaving a prospect to assume it was invented.
        */}
        {!project.clientCleared ? (
          <p className="mt-5 text-caption text-ink-300">
            Client named on request &mdash; permission to publish pending.
          </p>
        ) : null}

        {/*
          Every row now ends on an action. Eight jobs, each with the process,
          the stock and the finish spelled out beside it, and until now no way
          to act on any of them — a visitor persuaded by row five had to scroll
          past three more rows to the closing band to do anything about it.

          `?ref=` carries the job's id, which `features/quote/quote-form.tsx`
          resolves to its title and category: the form arrives on the right
          service line with the brief already started.
        */}
        <Link
          href={quoteHref(project.id, 'work')}
          className="group/cta mt-8 inline-flex items-center gap-2 rounded-[2px] py-1.5 text-body-sm font-medium text-ink-800 motion-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
        >
          <span className="relative">
            Enquire about work like this
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 motion-nudge group-hover/cta:scale-x-100"
            />
          </span>
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 motion-nudge group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </div>
  );
}

export default ProjectShowcase;
