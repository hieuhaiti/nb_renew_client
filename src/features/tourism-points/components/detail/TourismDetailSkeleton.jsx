import { Skeleton } from '@/components/ui/skeleton';

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-[24px] border-border bg-card px-5 py-5 shadow-(--ambient-shadow) ${className}`}>
      {children}
    </div>
  );
}

function TitleRow({ textWidth = 176 }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <Skeleton className="h-6 w-6 rounded-md" />
      <Skeleton className="h-6 rounded-md" style={{ width: textWidth }} />
    </div>
  );
}

/* ─── hero ────────────────────────────────────────────── */

function HeroSkeleton() {
  return (
    <section className="overflow-hidden rounded-[30px] border border-[#dcecf7] bg-card shadow-[0_14px_35px_rgba(7,29,54,0.12)]">
      {/* image area */}
      <div className="relative flex min-h-[280px] items-end bg-muted p-6 md:min-h-[420px] md:p-7">
        {/* action buttons top-right */}
        <div className="absolute right-4 top-4 flex gap-2.5 md:right-6 md:top-6">
          <Skeleton className="h-11 w-11 rounded-2xl" />
          <Skeleton className="h-11 w-11 rounded-2xl" />
          <Skeleton className="h-11 w-11 rounded-2xl" />
        </div>

        {/* hero content bottom-left */}
        <div className="relative z-10 w-full max-w-[880px] space-y-3">
          <Skeleton className="h-7 w-[120px] rounded-full" />
          <Skeleton className="h-9 rounded-lg md:h-11" style={{ width: '62%' }} />
          <Skeleton className="h-4 rounded" style={{ width: '50%' }} />
          <div className="flex flex-wrap gap-2 pt-1">
            {[160, 210, 145, 125].map((w, i) => (
              <Skeleton key={i} className="h-9 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* summary strip – 5 cells */}
      <div className="grid grid-cols-5 divide-x divide-border border-t border-border">
        {[48, 52, 44, 60, 40].map((w, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 px-2 py-4">
            <Skeleton className="h-[21px] rounded" style={{ width: w + 8 }} />
            <Skeleton className="h-3 rounded" style={{ width: w + 16 }} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── intro ───────────────────────────────────────────── */

function IntroSkeleton() {
  return (
    <Card>
      <TitleRow textWidth={200} />
      <div className="mb-4 space-y-2">
        <Skeleton className="h-[15px] w-full rounded" />
        <Skeleton className="h-[15px] rounded" style={{ width: '93%' }} />
        <Skeleton className="h-[15px] rounded" style={{ width: '78%' }} />
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-[18px] border-border bg-muted p-[14px]">
            <Skeleton className="mb-2 h-5 w-5 rounded" />
            <Skeleton className="mb-1.5 h-[14px] w-20 rounded" />
            <Skeleton className="h-3 rounded" style={{ width: 128 }} />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── gallery ─────────────────────────────────────────── */

function GallerySkeleton() {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-40 rounded-md" />
        </div>
        <Skeleton className="h-4 w-28 rounded" />
      </div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: '1.2fr 0.8fr 0.8fr' }}>
        <Skeleton className="row-span-2 rounded-[18px]" style={{ minHeight: 350 }} />
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="rounded-[18px]" style={{ minHeight: 170 }} />
        ))}
      </div>
    </Card>
  );
}

/* ─── services ────────────────────────────────────────── */

function ServicesSkeleton() {
  return (
    <Card>
      <TitleRow textWidth={192} />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="rounded-[16px] border-border bg-muted px-3 py-[13px]">
            <Skeleton className="mx-auto mb-2 h-5 w-5 rounded" />
            <Skeleton className="mx-auto h-3 w-14 rounded" />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── reviews ─────────────────────────────────────────── */

function ReviewsSkeleton() {
  return (
    <Card>
      <TitleRow textWidth={168} />
      <div className="mb-5 flex items-center gap-6">
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-12 w-16 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <div className="flex-1 space-y-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-6 shrink-0 rounded" />
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-3 w-5 shrink-0 rounded" />
            </div>
          ))}
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="mb-3 flex gap-3 rounded-[18px] border-border bg-muted p-[13px]">
          <Skeleton className="h-[42px] w-[42px] shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-[14px] w-28 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 rounded" style={{ width: '82%' }} />
          </div>
        </div>
      ))}
    </Card>
  );
}

/* ─── sidebar cards ───────────────────────────────────── */

function CtaSkeleton() {
  return (
    <div
      className="rounded-[24px] p-5 shadow-[0_14px_35px_rgba(7,29,54,0.12)]"
      style={{ background: 'linear-gradient(135deg,#1cb6d8,#0fb49f)' }}
    >
      <Skeleton className="mb-3 h-7 w-40 rounded-md bg-white/25" />
      <Skeleton className="mb-1.5 h-[13px] w-full rounded bg-white/20" />
      <Skeleton className="mb-4 h-[13px] rounded bg-white/20" style={{ width: '72%' }} />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-11 w-full rounded-[15px] bg-white/30" />
        <Skeleton className="h-11 w-full rounded-[15px] bg-white/20" />
      </div>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2.5">
        <Skeleton className="h-5 w-5 rounded-md" />
        <Skeleton className="h-5 w-36 rounded-md" />
      </div>
      <Skeleton className="mb-2 h-3 w-28 rounded" />
      <div className="mb-3 grid grid-cols-2 gap-2.5">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-[16px] border border-tertiary/30 bg-tertiary-soft p-[13px] text-center">
            <Skeleton className="mx-auto mb-1 h-[20px] w-12 rounded bg-muted" />
            <Skeleton className="mx-auto h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="mb-2 h-[46px] w-full rounded-[15px]" />
      ))}
    </Card>
  );
}

function NearbySkeleton() {
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2.5">
        <Skeleton className="h-5 w-5 rounded-md" />
        <Skeleton className="h-5 w-28 rounded-md" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="grid items-center gap-2.5" style={{ gridTemplateColumns: '72px 1fr' }}>
            <Skeleton className="h-[58px] w-[72px] rounded-[14px]" />
            <div className="space-y-1.5 py-1">
              <Skeleton className="h-[13px] rounded" style={{ width: '80%' }} />
              <Skeleton className="h-3 rounded" style={{ width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── export ──────────────────────────────────────────── */

export function TourismDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5fbff] pb-10">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
        {/* breadcrumb */}
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-4 w-44 rounded" />
        </div>

        <HeroSkeleton />

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <main className="space-y-5">
            <IntroSkeleton />
            <GallerySkeleton />
            <ServicesSkeleton />
            <ReviewsSkeleton />
          </main>

          <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <CtaSkeleton />
            <WeatherSkeleton />
            <NearbySkeleton />
          </aside>
        </div>
      </div>
    </div>
  );
}
