import { Skeleton } from '@/components/ui/skeleton';
import RootLayout from '@/components/layout/RootLayout';

/* ─── Hero skeleton ──────────────────────────────────────────────────────── */
function HeroSkeleton() {
  return (
    <section className="px-4 pt-5 pb-0 sm:px-6">
      <div
        className="grid min-h-[240px] w-full grid-cols-1 items-end gap-5 overflow-hidden rounded-[30px] p-6 sm:p-7 lg:min-h-[255px] lg:grid-cols-[1.1fr_0.9fr]"
        style={{ background: 'linear-gradient(90deg,rgba(4,55,76,.5),rgba(12,169,158,.35))' }}
      >
        {/* Left – breadcrumb + title + desc */}
        <div className="flex flex-col gap-[18px]">
          <div className="flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-white/30" />
            <div className="h-3 w-2.5 rounded bg-white/20" />
            <div className="h-3 w-28 rounded bg-white/30" />
          </div>
          <div className="h-9 w-[72%] rounded-2xl bg-white/30 sm:h-10 lg:h-12" />
          <div className="flex flex-col gap-2">
            <div className="h-[15px] w-[86%] rounded bg-white/20" />
            <div className="h-[15px] w-[62%] rounded bg-white/20" />
          </div>
        </div>

        {/* Right – 3 stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[20px] bg-white/[.92] p-4 backdrop-blur-md">
              <div className="mb-2 h-7 w-10 rounded-lg bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Toolbar skeleton ───────────────────────────────────────────────────── */
function ToolbarSkeleton() {
  return (
    <section
      className="sticky top-0 z-40 border-b px-4 py-3.5 sm:px-6"
      style={{
        background: 'linear-gradient(180deg,rgba(233,247,255,.96),rgba(223,242,255,.96))',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div className="flex flex-wrap items-center gap-2 rounded-[24px] border-border bg-card p-3.5 md:flex-nowrap">
        <Skeleton className="h-10 min-w-0 flex-[1.5] rounded-xl" />
        <Skeleton className="h-10 min-w-[96px] flex-[0.8] rounded-xl" />
        <Skeleton className="h-10 min-w-[96px] flex-[0.8] rounded-xl" />
        <Skeleton className="h-10 min-w-[96px] flex-[0.8] rounded-xl" />
        <div className="flex h-10 w-[74px] shrink-0 items-center gap-1 rounded-[13px] bg-muted p-1">
          <Skeleton className="h-8 w-8 rounded-[10px]" />
          <Skeleton className="h-8 w-8 rounded-[10px]" />
        </div>
        <Skeleton className="h-8 w-[72px] shrink-0 rounded-[13px]" />
      </div>
    </section>
  );
}

/* ─── Sidebar skeleton ───────────────────────────────────────────────────── */
function SidebarSkeleton() {
  return (
    <aside className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
      <div className="rounded-[24px] border-border bg-card p-4.5 shadow-(--ambient-shadow)">
        <div className="mb-3.5 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-[17px] w-28" />
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between rounded-[14px] bg-muted px-3 py-2.75">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-6" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-[14px] bg-muted px-3 py-2.75">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
                <Skeleton className={`h-3 ${i === 1 ? 'w-32' : i === 3 ? 'w-20' : 'w-28'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ─── Featured card skeleton ─────────────────────────────────────────────── */
function FeaturedCardSkeleton() {
  return (
    <div className="mb-5 overflow-hidden rounded-3xl border-border bg-card md:grid md:grid-cols-[1.1fr_1fr]">
      <Skeleton className="h-52 rounded-none md:h-[310px]" />
      <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-5 w-8 rounded-[7px]" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-[82%] rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[68%]" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-[42px] w-32 rounded-full" />
            <Skeleton className="h-[42px] w-[42px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Standard card skeleton ─────────────────────────────────────────────── */
function StandardCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[22px] border-border bg-card">
      <Skeleton className="h-[175px] rounded-none" />
      <div className="flex flex-col gap-3 p-[17px]">
        <Skeleton className="h-[18px] w-[78%] rounded-md" />
        <Skeleton className="h-[13px] w-14" />
        <div className="flex min-h-[47px] flex-col gap-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[72%]" />
        </div>
        <div className="flex items-center justify-between border-t pt-3.5">
          <Skeleton className="h-[13px] w-24" />
          <Skeleton className="h-[13px] w-14" />
        </div>
      </div>
    </div>
  );
}

/* ─── Content head skeleton ──────────────────────────────────────────────── */
function ContentHeadSkeleton() {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3.5">
      <Skeleton className="h-[25px] w-52 rounded-xl" />
      <div className="flex items-center gap-2">
        <Skeleton className="hidden h-4 w-32 sm:block" />
        <Skeleton className="h-[38px] w-[110px] rounded-[14px]" />
        <Skeleton className="h-[38px] w-[114px] rounded-[14px]" />
      </div>
    </div>
  );
}

/* ─── Quick-access buttons skeleton ─────────────────────────────────────── */
function QuickBtnsSkeleton() {
  return (
    <div className="mb-4 flex flex-wrap gap-2.5">
      <Skeleton className="h-9 w-[60px] rounded-full" />
      <Skeleton className="h-9 w-[100px] rounded-full" />
      <Skeleton className="h-9 w-[114px] rounded-full" />
    </div>
  );
}

/* ─── Pagination skeleton ────────────────────────────────────────────────── */
function PaginationSkeleton() {
  return (
    <div className="mt-[22px] flex flex-wrap items-center justify-center gap-2">
      <Skeleton className="h-[38px] w-[90px] rounded-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-[38px] w-[38px] rounded-[12px]" />
      ))}
      <Skeleton className="h-[38px] w-[90px] rounded-full" />
    </div>
  );
}

/* ─── Root export ────────────────────────────────────────────────────────── */
export default function TourismPointPageSkeleton() {
  return (
    <RootLayout>
      <div
        className="min-h-screen"
        style={{ background: 'linear-gradient(180deg,#eef9ff 0%,#fff 42%,#f7fbff 100%)' }}
      >
        <HeroSkeleton />
        <ToolbarSkeleton />

        <main className="w-full px-4 pt-5 pb-12 sm:px-6">
          <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[280px_1fr]">
            <SidebarSkeleton />

            <section>
              <ContentHeadSkeleton />
              <QuickBtnsSkeleton />
              <FeaturedCardSkeleton />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <StandardCardSkeleton key={i} />
                ))}
              </div>

              <PaginationSkeleton />
            </section>
          </div>
        </main>
      </div>
    </RootLayout>
  );
}

export { StandardCardSkeleton, FeaturedCardSkeleton };
