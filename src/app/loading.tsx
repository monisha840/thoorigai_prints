import { PageSkeleton } from '@/components/ui/skeleton';

/**
 * Route-level loading UI. A server component with no JavaScript, so the
 * placeholder is in the first byte of the streamed response.
 */
export default function Loading() {
  return <PageSkeleton variant="showcase" cards={2} />;
}
