import { FadeIn, FadeUp, Parallax, Stagger, StaggerItem } from '@/components/motion';
import { PrintPlate } from '@/components/ui/print-plate';
import { IndexMark, ShowcaseLink, bleedEnd, bleedStart, layerPanel } from '@/components/ui/editorial';
import type { FilterId, Project } from '@/lib/portfolio';
import { cn, pad, quoteHref } from '@/lib/utils';

/**
 * The work itself, as immersive showcases.
 *
 * Eight jobs is few enough that each can be given a whole composition, and a
 * printed piece needs size before its finish is legible at all — foil and spot
 * varnish simply disappear at tile size.
 *
 * ## What changed
 *
 * The alternating seven/five split was already the right skeleton. What sat on
 * it was still card furniture: a bordered, rounded, shadowed plate that stopped
 * short of the gutter, a category chip, and a small mono figure floated over
 * the top-left corner of the photograph.
 *
 * Now:
 *
 * **The plate bleeds.** `frame="bleed"` drops the border, radius and shadow,
 * and the photograph runs off the outer edge of the page. At `xl`, where the
 * container is capped and there is page margin to spend, it keeps going.
 *
 * **The index is architecture.** An oversized numeral behind the copy column
 * instead of a 12px figure on the image, with the year set beside a hairline —
 * so the eye lands on the job, not on its serial number.
 *
 * **The sector is a line of type, not a chip.** The colophon underneath was
 * always the thing a print buyer scans; the chip above it was competing with it
 * for the same job.
 *
 * ## What did not change
 *
 * `stream` rather than the group cascade — the list is several screens tall, so
 * each row waits for its own trigger. Keying the container on the active filter
 * remounts the list, so a filter change replays the reveal, with no exit
 * animation and no layout animation: the house allows one entrance pattern, and
 * a clean re-cascade reads better than eight rows sliding past each other.
 *
 * The permission line under an uncleared client, and the per-job quote link
 * carrying `?ref=`, are both untouched.
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
      className="flex flex-col gap-28 md:gap-40 lg:gap-52"
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
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      {/* --------------------------------------------------------- The plate */}
      {/*
        The plate drifts against the scroll, and the direction alternates with
        the row. Two plates travelling the same way down a long column read as
        the page sliding; alternating them makes each row a separate plane and
        gives the eight-row scroll the depth a flat column cannot have.

        Twelve pixels, well under §9.2's twenty-pixel ceiling, and `Parallax`
        clamps it anyway. It is inert below `lg` and under reduced motion, where
        it renders no transform at all rather than a transform of zero.
      */}
      <FadeIn
        className={cn(
          flipped ? 'lg:order-2 lg:col-span-7 lg:col-start-6' : 'lg:order-1 lg:col-span-7',
        )}
      >
        <Parallax offset={flipped ? -12 : 12}>
          <div className={cn('relative', flipped ? bleedEnd : bleedStart)}>
            <span
              aria-hidden
              className={cn(
                layerPanel,
                'hidden lg:block',
                flipped ? '-bottom-7 -left-7 top-7 w-1/2' : '-bottom-7 -right-7 top-7 w-1/2',
              )}
            />

            <PrintPlate
              image={project.image}
              ratio="wide"
              frame="bleed"
              sizes="(min-width: 1280px) 62vw, (min-width: 1024px) 60vw, 100vw"
              tone={project.image.ground === 'dark' ? 'ink' : 'paper'}
              marks
              parallax
            />
          </div>
        </Parallax>
      </FadeIn>

      {/* -------------------------------------------------------- The column */}
      <div
        className={cn(
          'relative',
          flipped
            ? 'lg:order-1 lg:col-span-4 lg:col-start-1'
            : 'lg:order-2 lg:col-span-4 lg:col-start-9',
        )}
      >
        <IndexMark
          value={pad(index + 1)}
          className="absolute -top-10 left-0 text-[7rem] lg:-left-6 lg:-top-16 lg:text-[11rem]"
        />

        <FadeUp className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-sans text-eyebrow font-semibold uppercase text-gold-700">
              {project.sector}
            </span>
            <span aria-hidden className="h-px w-6 bg-gold-500" />
            <span className="font-mono text-caption tabular-nums text-ink-400">{project.year}</span>
          </div>

          <h3 className="mt-5 font-display text-display-sm text-ink-800">{project.title}</h3>

          <p className="measure mt-4 text-body-lg text-ink-500">{project.summary}</p>

          {/* A spec block, set like a colophon. This is what a print buyer
              actually scans for. */}
          <dl className="mt-9 border-t border-paper-400">
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
              Client named on request - permission to publish pending.
            </p>
          ) : null}

          {/*
            `?ref=` carries the job's id, which `features/quote/quote-form.tsx`
            resolves to its title and category: the form arrives on the right
            service line with the brief already started.
          */}
          <ShowcaseLink href={quoteHref(project.id, 'work')} arrow="up" className="mt-8">
            Enquire about work like this
          </ShowcaseLink>
        </FadeUp>
      </div>
    </div>
  );
}

export default ProjectShowcase;
