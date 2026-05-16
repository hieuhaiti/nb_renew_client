import { Skeleton } from '@/components/ui/skeleton';
import RootLayout from '@/components/layout/RootLayout';

function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border-border bg-card shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      <Skeleton className="h-[190px] rounded-none rounded-t-[28px]" />
      <div className="p-[17px]">
        <Skeleton className="mb-[10px] h-[20px] w-4/5 rounded-[8px]" />
        <Skeleton className="mb-3 h-[16px] w-2/3 rounded-[8px]" />
        <Skeleton className="mb-1.5 h-[13px] w-full rounded-[6px]" />
        <Skeleton className="mb-4 h-[13px] w-3/4 rounded-[6px]" />
        <div className="mb-[14px] grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[54px] rounded-[13px]" />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-[28px] w-[100px] rounded-[8px]" />
          <Skeleton className="h-[38px] w-[80px] rounded-[14px]" />
        </div>
      </div>
    </div>
  );
}

function FilterSidebarSkeleton() {
  return (
    <div className="h-max rounded-[28px] border-border bg-card p-4.5 shadow-(--ambient-shadow)">
      <Skeleton className="mb-5 h-[22px] w-[120px] rounded-[8px]" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mb-[13px]">
          <Skeleton className="mb-[7px] h-[14px] w-[80px] rounded-[6px]" />
          <Skeleton className="h-[46px] w-full rounded-[15px]" />
        </div>
      ))}
      <Skeleton className="mb-[13px] h-[64px] w-full rounded-[15px]" />
      <Skeleton className="mb-3 h-[46px] w-full rounded-full" />
      <Skeleton className="h-[40px] w-full rounded-full" />
    </div>
  );
}

export default function TourPageSkeleton() {
  return (
    <RootLayout>
      <div
        className="min-h-screen overflow-x-hidden"
        style={{ background: 'linear-gradient(180deg,#eaf7ff 0,#fff 42%,#f5fbff 100%)' }}
      >
        {/* Hero */}
        <section className="px-5 pt-6.5 pb-5 md:px-[5vw]">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_.95fr]">
            <Skeleton className="min-h-[360px] rounded-[32px]" />

            <div className="grid grid-cols-2 gap-[14px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3 rounded-[24px] border-border bg-card p-5">
                  <Skeleton className="h-[44px] w-[44px] rounded-[16px]" />
                  <Skeleton className="h-[28px] w-[80px] rounded-[8px]" />
                  <Skeleton className="h-[14px] w-[100px] rounded-[6px]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Layout: filter sidebar + main */}
        <section className="px-5 pt-3 pb-10.5 md:px-[5vw]">
          <div className="grid grid-cols-1 gap-[22px] xl:grid-cols-[305px_1fr]">
            <FilterSidebarSkeleton />

            <main className="flex flex-col gap-[18px]">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-[14px] rounded-[24px] border-border bg-card px-4 py-[14px] shadow-(--ambient-shadow)">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-[26px] w-[220px] rounded-[8px]" />
                  <Skeleton className="h-[14px] w-[160px] rounded-[6px]" />
                </div>
                <Skeleton className="h-[40px] w-[160px] rounded-full" />
              </div>

              {/* Tour grid */}
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            </main>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}
