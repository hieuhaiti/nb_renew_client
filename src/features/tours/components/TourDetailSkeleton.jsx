import { Skeleton } from '@/components/ui/skeleton';
import RootLayout from '@/components/layout/RootLayout';

function OverviewCardSkeleton() {
  return (
    <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
      <Skeleton className="mb-[14px] h-[22px] w-[160px] rounded-[8px]" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[18px] border-border bg-muted p-[14px]">
            <Skeleton className="mb-[10px] h-[38px] w-[38px] rounded-[14px]" />
            <Skeleton className="mb-1.5 h-[16px] w-3/4 rounded-[6px]" />
            <Skeleton className="h-[12px] w-full rounded-[6px]" />
            <Skeleton className="mt-1 h-[12px] w-2/3 rounded-[6px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleCardSkeleton() {
  return (
    <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
      <Skeleton className="mb-[14px] h-[22px] w-[180px] rounded-[8px]" />
      <div className="overflow-hidden rounded-[22px] border-border bg-muted">
        <Skeleton className="h-[50px] rounded-none rounded-t-[22px]" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="grid items-start gap-3 border-t border-border px-4 py-3.75"
            style={{ gridTemplateColumns: '86px 1fr auto' }}
          >
            <Skeleton className="h-[56px] rounded-[14px]" />
            <div className="flex flex-col gap-2 pt-1">
              <Skeleton className="h-[16px] w-4/5 rounded-[6px]" />
              <Skeleton className="h-[13px] w-full rounded-[6px]" />
              <Skeleton className="h-[13px] w-3/5 rounded-[6px]" />
            </div>
            <Skeleton className="h-[40px] w-[40px] rounded-[15px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesCardSkeleton() {
  return (
    <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
      <Skeleton className="mb-[14px] h-[22px] w-[260px] rounded-[8px]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-[10px] rounded-[17px] border-border bg-muted p-3">
            <Skeleton className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full" />
            <Skeleton className="h-[18px] flex-1 rounded-[6px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedToursCardSkeleton() {
  return (
    <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
      <Skeleton className="mb-[14px] h-[22px] w-[140px] rounded-[8px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[24px] border-border bg-muted">
            <Skeleton className="h-[130px] rounded-none rounded-t-[24px]" />
            <div className="p-[14px]">
              <Skeleton className="mb-2 h-[16px] w-4/5 rounded-[6px]" />
              <Skeleton className="mb-1 h-[16px] w-3/5 rounded-[6px]" />
              <Skeleton className="h-[13px] w-2/3 rounded-[6px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border-border bg-card shadow-(--ambient-shadow)">
      <div className="border-b border-border p-5" style={{ background: 'linear-gradient(135deg,#fff8e6,#fff)' }}>
        <Skeleton className="mb-2 h-[14px] w-[60px] rounded-[6px]" />
        <Skeleton className="mb-2 h-[40px] w-[160px] rounded-[10px]" />
        <Skeleton className="h-[14px] w-[50px] rounded-[6px]" />
      </div>
    </div>
  );
}

function RatingCardSkeleton() {
  return (
    <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
      <Skeleton className="mb-[14px] h-[20px] w-[100px] rounded-[8px]" />
      <div className="mb-3 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[16px] w-[16px] rounded-[4px]" />
        ))}
        <Skeleton className="ml-2 h-[18px] w-[48px] rounded-[6px]" />
      </div>
      <Skeleton className="mb-1 h-[13px] w-full rounded-[6px]" />
      <Skeleton className="h-[13px] w-4/5 rounded-[6px]" />
    </div>
  );
}

function GuideCardSkeleton() {
  return (
    <div className="rounded-[28px] border-border bg-card p-5 shadow-(--ambient-shadow)">
      <Skeleton className="mb-[14px] h-[20px] w-[140px] rounded-[8px]" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-[58px] w-[58px] shrink-0 rounded-[20px]" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-[17px] w-3/4 rounded-[6px]" />
          <Skeleton className="h-[13px] w-full rounded-[6px]" />
          <Skeleton className="h-[13px] w-2/3 rounded-[6px]" />
        </div>
      </div>
    </div>
  );
}

export default function TourDetailSkeleton() {
  return (
    <RootLayout>
      <div
        className="min-h-screen overflow-x-hidden pb-10"
        style={{ background: 'linear-gradient(180deg,#eaf7ff 0,#fff 42%,#f5fbff 100%)' }}
      >
        <div className="px-5 pt-5.5 pb-11 md:px-[5vw]">

          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-[16px] w-[60px] rounded-[6px]" />
            <Skeleton className="h-[10px] w-[10px] rounded-full" />
            <Skeleton className="h-[16px] w-[80px] rounded-[6px]" />
            <Skeleton className="h-[10px] w-[10px] rounded-full" />
            <Skeleton className="h-[16px] w-[180px] rounded-[6px]" />
          </div>

          {/* Hero */}
          <section className="grid grid-cols-1 items-stretch gap-[18px] xl:grid-cols-[1.15fr_.85fr]">
            <Skeleton className="min-h-[470px] rounded-[32px]" />

            <div className="grid grid-cols-2 gap-[14px]">
              <Skeleton className="col-span-2 min-h-[220px] rounded-[24px]" />
              <Skeleton className="min-h-[145px] rounded-[24px]" />
              <Skeleton className="min-h-[145px] rounded-[24px]" />
            </div>
          </section>

          {/* Content */}
          <section className="mt-[22px] grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[minmax(0,1fr)_360px]">

            {/* Main col */}
            <div className="flex flex-col gap-[18px]">
              <OverviewCardSkeleton />
              <ScheduleCardSkeleton />
              <ServicesCardSkeleton />
              <RelatedToursCardSkeleton />
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-[18px] xl:sticky xl:top-[86px]">
              <PriceCardSkeleton />
              <RatingCardSkeleton />
              <GuideCardSkeleton />
            </aside>
          </section>
        </div>
      </div>
    </RootLayout>
  );
}
