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
 * Whole-page placeholder for a route-level `loading.tsx`: hero block plus a
 * grid, matching the shape every page in the shell actually renders.
 */
export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div role="status" aria-label="Loading page" className="pb-24 pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <SkeletonHeading className="max-w-3xl" />
        <SkeletonText lines={2} className="mt-8 max-w-xl" />
        <div className="mt-16 h-px w-full bg-paper-400" />
        <SkeletonGrid count={cards} className="mt-16" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default Skeleton;
