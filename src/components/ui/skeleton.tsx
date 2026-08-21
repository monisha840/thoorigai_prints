import { cn } from '@/lib/utils';

/**
 * Loading placeholders.
 *
 * These are plain CSS (no Framer), so a `loading.tsx` boundary can stay a
 * server component and the placeholder ships with the first byte. The sheen
 * comes from the `shimmer` utility in globals.css and is cancelled by the
 * reduced-motion rule there.
 */

export interface SkeletonProps {
  className?: string;
  /** Softens to a circle — avatars, dots, icon slots. */
  circle?: boolean;
}

export function Skeleton({ className, circle = false }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden bg-paper-300',
        circle ? 'rounded-full' : 'rounded-sm',
        "after:absolute after:inset-0 after:content-[''] after:shimmer",
        className,
      )}
    />
  );
}

/** A paragraph of grey lines. The last one is short, like real text. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-3.5', index === lines - 1 ? 'w-2/5' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function SkeletonHeading({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-10 w-3/4 sm:h-14" />
      <Skeleton className="h-10 w-1/2 sm:h-14" />
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-paper-400/70 bg-paper-100',
        className,
      )}
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-6">
        <Skeleton className="h-5 w-2/3" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

export function SkeletonGrid({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

/**
 * Alternating showcase rows — the shape `/`, `/about`, `/services`, `/products`
 * and `/portfolio` actually render since the card grids were replaced.
 *
 * A placeholder is a promise about what is arriving. When those pages were card
 * grids, `SkeletonGrid` kept that promise; now it breaks it, and the visitor
 * watches a three-column grid dissolve into an editorial spread — which reads
 * as the page being rebuilt in front of them, the exact impression these
 * sections were rewritten to remove.
 */
export function SkeletonShowcase({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-20 lg:gap-28', className)}>
      {Array.from({ length: rows }).map((_, index) => {
        const flipped = index % 2 === 1;

        return (
          <div key={index} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div
              className={cn(
                'lg:col-span-7',
                flipped ? 'lg:order-2 lg:col-start-6' : 'lg:order-1',
              )}
            >
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
            </div>

            <div
              className={cn(
                'flex flex-col gap-4 lg:col-span-4',
                flipped ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-9',
              )}
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-3/4" />
              <SkeletonText lines={3} className="mt-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Whole-page placeholder for a route-level `loading.tsx`: hero block, then the
 * body in whichever shape the route actually renders.
 *
 * `variant` defaults to `grid` because the pages that still genuinely list
 * things in a grid — contact, FAQ, the legal set — are the ones that never
 * pass it. The showcase routes opt in.
 */
export function PageSkeleton({
  cards = 6,
  variant = 'grid',
}: {
  /** Rows in showcase mode, tiles in grid mode. Zero renders body-less. */
  cards?: number;
  variant?: 'grid' | 'showcase';
}) {
  return (
    <div role="status" aria-label="Loading page" className="pb-24 pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <SkeletonHeading className="max-w-3xl" />
        <SkeletonText lines={2} className="mt-8 max-w-xl" />
        <div className="mt-16 h-px w-full bg-paper-400" />

        {cards > 0 ? (
          variant === 'showcase' ? (
            <SkeletonShowcase rows={cards} className="mt-16" />
          ) : (
            <SkeletonGrid count={cards} className="mt-16" />
          )
        ) : null}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default Skeleton;
