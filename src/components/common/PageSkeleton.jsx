import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function PageSkeleton() {
  return (
    <section className="bg-background min-h-screen p-4 md:p-6" aria-busy="true" aria-live="polite">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3 rounded-2xl border p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          <div className="space-y-3 rounded-2xl border p-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(PageSkeleton);
