import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function HomeSkeleton() {
  return (
    <div className="overflow-x-hidden" aria-busy="true">
      {/* Hero */}
      <section
        className="grid items-center gap-7 px-5 pt-7 pb-5 min-h-[calc(100vh-76px)] md:px-[5vw] lg:grid-cols-[1.05fr_.95fr]"
      >
        <div className="space-y-5">
          <Skeleton className="h-9 w-52 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-3/4 rounded-xl" />
          </div>
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-17 rounded-[28px]" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20.5 rounded-[18px]" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-18 rounded-[20px]" />
            ))}
          </div>
        </div>
        <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_.72fr]">
          <Skeleton className="min-h-115 rounded-[34px] lg:min-h-140" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-52 rounded-[28px]" />
            <Skeleton className="h-44 rounded-[28px]" />
            <Skeleton className="h-36 rounded-[28px]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-10 md:px-[5vw]">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-47 rounded-[26px]" />
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="px-5 py-10 md:px-[5vw]">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-80" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="col-span-2 h-72.5 rounded-[26px]" />
            <Skeleton className="h-52 rounded-[26px]" />
            <Skeleton className="h-52 rounded-[26px]" />
          </div>
          <Skeleton className="min-h-105 rounded-[30px]" />
        </div>
        <Skeleton className="mt-5 h-40 rounded-[32px]" />
      </section>

      {/* Role */}
      <section className="px-5 py-10 md:px-[5vw]">
        <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
          <Skeleton className="h-70 rounded-[32px]" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-[26px]" />
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="px-5 py-10 md:px-[5vw]">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-33.75 rounded-[24px]" />
            ))}
          </div>
          <Skeleton className="min-h-90 rounded-[28px]" />
        </div>
      </section>
    </div>
  );
}

function HeroListSkeleton() {
  return (
    <div aria-busy="true">
      <div className="px-6 py-10">
        <Skeleton className="h-56 w-full rounded-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="mb-5 flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-64 rounded-[18px]" />
          <Skeleton className="h-64 rounded-[18px]" />
          <Skeleton className="h-64 rounded-[18px]" />
          <Skeleton className="h-64 rounded-[18px]" />
          <Skeleton className="h-64 rounded-[18px]" />
          <Skeleton className="h-64 rounded-[18px]" />
          <Skeleton className="h-64 rounded-[18px]" />
          <Skeleton className="h-64 rounded-[18px]" />
          <Skeleton className="h-64 rounded-[18px]" />
        </div>
      </div>
    </div>
  );
}

function TourSkeleton() {
  return (
    <div aria-busy="true">
      <div className="px-6 py-9">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full rounded-3xl" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-1.5">
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-44 w-full rounded-[18px]" />
            <Skeleton className="h-44 w-full rounded-[18px]" />
            <Skeleton className="h-44 w-full rounded-[18px]" />
            <Skeleton className="h-44 w-full rounded-[18px]" />
          </div>
          <Skeleton className="h-72 w-full rounded-[18px]" />
        </div>
      </div>
    </div>
  );
}

function TourismPointSkeleton() {
  return (
    <div aria-busy="true">
      <div className="px-6 py-9">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full rounded-3xl" />
        </div>
      </div>
      <Skeleton className="sticky top-0 h-14 w-full rounded-none" />
      <div className="mx-auto max-w-290 px-6 pb-11 pt-6">
        <Skeleton className="h-56 w-full rounded-[20px]" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-52 rounded-[18px]" />
          <Skeleton className="h-52 rounded-[18px]" />
          <Skeleton className="h-52 rounded-[18px]" />
          <Skeleton className="h-52 rounded-[18px]" />
          <Skeleton className="h-52 rounded-[18px]" />
          <Skeleton className="h-52 rounded-[18px]" />
          <Skeleton className="h-52 rounded-[18px]" />
          <Skeleton className="h-52 rounded-[18px]" />
        </div>
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="bg-background h-full p-3" aria-busy="true">
      <div className="flex h-full flex-col gap-3">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid flex-1 gap-3 xl:grid-cols-[300px_1fr_340px] 2xl:grid-cols-[320px_1fr_380px]">
          <Skeleton className="rounded-2xl" />
          <Skeleton className="rounded-3xl" />
          <Skeleton className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function VlogSkeleton() {
  return (
    <div className="bg-background min-h-screen py-4 lg:py-6" aria-busy="true">
      <div className="mx-auto w-full lg:w-[88%]">
        <div className="grid gap-4 lg:grid-cols-5">
          <Skeleton className="min-h-90 rounded-3xl lg:col-span-3" />
          <Skeleton className="h-80 rounded-3xl lg:col-span-2" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Vr360Skeleton() {
  return (
    <div className="px-4 py-4 xl:px-6" aria-busy="true">
      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
        <Skeleton className="min-h-120 w-full rounded-xl" />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen px-4 py-5 lg:py-6" aria-busy="true">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="mb-4 h-9 w-32 rounded-[10px]" />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <Skeleton className="h-80 w-full rounded-[18px] sm:h-96" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-32 w-full rounded-[12px]" />
            <Skeleton className="h-24 w-full rounded-[12px]" />
            <Skeleton className="h-12 w-full rounded-[12px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericSkeleton() {
  return (
    <div className="bg-background min-h-screen p-4 md:p-6" aria-busy="true">
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
    </div>
  );
}

function PageSkeleton() {
  const path = window.location.pathname;

  if (path === '/' || path === '/home') return <HomeSkeleton />;
  if (path === '/map') return <MapSkeleton />;
  if (path === '/vr360') return <Vr360Skeleton />;
  if (path === '/vlog') return <VlogSkeleton />;
  if (path === '/tour') return <TourSkeleton />;
  if (path === '/tourism-point') return <TourismPointSkeleton />;
  if (path.startsWith('/tourism-point/')) return <DetailSkeleton />;
  if (path === '/news' || path === '/festival' || path === '/ocop') return <HeroListSkeleton />;
  if (path.startsWith('/news/') || path.startsWith('/festival/') || path.startsWith('/ocop/')) return <DetailSkeleton />;
  return <GenericSkeleton />;
}

export default memo(PageSkeleton);
