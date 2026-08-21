import { cn } from '@/lib/utils';

/**
 * Holds the layout while a 3D chunk downloads, so nothing shifts when it
 * lands. Deliberately free of any `three` import — it has to be reachable from
 * the eager bundle.
 */
export function ScenePlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'h-full w-full rounded-lg bg-gradient-to-br from-paper-300 via-paper-200 to-paper-300',
        className,
      )}
    />
  );
}

export default ScenePlaceholder;
