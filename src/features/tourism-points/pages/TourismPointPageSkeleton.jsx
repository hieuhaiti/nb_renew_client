import React from 'react';
import RootLayout from '@/components/layout/RootLayout';

/* ─── shared ─────────────────────────────────────────────────────────────── */
function Bone({ className = '' }) {
  return <div className={`rounded-lg bg-muted ${className}`} />;
}

/* ─── Hero skeleton ──────────────────────────────────────────────────────── */
function HeroSkeleton() {
  return (
    <section className="px-4 pt-5 pb-0 sm:px-6">
      {/* matches: min-h-[240px] lg:min-h-[255px] rounded-[30px] p-6 sm:p-7 */}
      <div
        className="grid min-h-[240px] w-full animate-pulse grid-cols-1 items-end gap-5 overflow-hidden rounded-[30px] p-6 sm:p-7 lg:min-h-[255px] lg:grid-cols-[1.1fr_0.9fr]"
        style={{ background: 'linear-gradient(90deg,rgba(4,55,76,.5),rgba(12,169,158,.35))' }}
      >
        {/* Left – breadcrumb + title + desc */}
        <div className="flex flex-col gap-[18px]">
          {/* breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-white/30" />
            <div className="h-3 w-2.5 rounded bg-white/20" />
            <div className="h-3 w-28 rounded bg-white/30" />
          </div>
          {/* h1: text-[28px] sm:text-[34px] lg:text-[42px] leading-[1.15] */}
          <div className="h-9 w-[72%] rounded-2xl bg-white/30 sm:h-10 lg:h-12" />
          {/* desc: text-[15px] leading-[1.7] */}
          <div className="flex flex-col gap-2">
            <div className="h-[15px] w-[86%] rounded bg-white/20" />
            <div className="h-[15px] w-[62%] rounded bg-white/20" />
          </div>
        </div>

        {/* Right – 3 stat cards: rounded-[20px] bg-white/[.92] p-4 */}
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[20px] bg-white/[.92] p-4 backdrop-blur-md">
              {/* number: text-[24px] font-black */}
              <div className="mb-2 h-7 w-10 rounded-lg bg-muted" />
              {/* label: text-[12px] */}
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
      {/* matches: rounded-[24px] border-border bg-card p-[14px] */}
      <div className="flex animate-pulse flex-wrap items-center gap-2 rounded-[24px] border-border bg-card p-3.5 md:flex-nowrap">
        {/* Search: flex-[1.5] – Input size="toolbar" ≈ h-10 */}
        <div className="h-10 min-w-0 flex-[1.5] rounded-xl bg-muted" />
        {/* Category select: flex-[0.8] */}
        <div className="h-10 min-w-[96px] flex-[0.8] rounded-xl bg-muted" />
        {/* is_featured select: flex-[0.8] */}
        <div className="h-10 min-w-[96px] flex-[0.8] rounded-xl bg-muted" />
        {/* Radius select: flex-[0.8] */}
        <div className="h-10 min-w-[96px] flex-[0.8] rounded-xl bg-muted" />
        {/* View switch: 2×h-8 w-8 inside rounded-[13px] wrapper */}
        <div className="flex h-10 w-[74px] shrink-0 items-center gap-1 rounded-[13px] bg-muted p-1">
          <div className="h-8 w-8 rounded-[10px] bg-muted-foreground/20" />
          <div className="h-8 w-8 rounded-[10px] bg-muted-foreground/20" />
        </div>
        {/* Map button: h-8 */}
        <div className="h-8 w-[72px] shrink-0 rounded-[13px] bg-muted" />
      </div>
    </section>
  );
}

/* ─── Sidebar skeleton ───────────────────────────────────────────────────── */
function SidebarSkeleton() {
  return (
    <aside className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
      {/* Filter card: rounded-[24px] border-border bg-card p-4.5 */}
      <div className="rounded-[24px] border-border bg-card p-4.5 shadow-(--ambient-shadow)">
        {/* Header: SlidersHorizontal(16) + text-[17px] mb-3.5 */}
        <div className="mb-3.5 flex animate-pulse items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted" />
          <Bone className="h-[17px] w-28" />
        </div>

        {/* "Tất cả" row: rounded-[14px] py-[11px] px-3 */}
        <div className="flex animate-pulse flex-col gap-2.5">
          <div className="flex items-center justify-between rounded-[14px] bg-muted px-3 py-2.75">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/25" />
              <Bone className="h-3 w-10" />
            </div>
            <Bone className="h-3 w-6" />
          </div>

          {/* Category rows: 5 rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex items-center justify-between rounded-[14px] bg-muted px-3 py-2.75"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/25" />
                <Bone className={`h-3 ${i === 1 ? 'w-32' : i === 3 ? 'w-20' : 'w-28'}`} />
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
    /*
     * matches: rounded-3xl border border-[#a8bed4] bg-white mb-5
     * md:grid-cols-[1.1fr_1fr]
     */
    <div className="mb-5 animate-pulse overflow-hidden rounded-3xl border-border bg-card md:grid md:grid-cols-[1.1fr_1fr]">
      {/* Image side: min-h-52 / md:min-h-[310px] */}
      <div className="h-52 bg-muted md:h-[310px]" />

      {/* Body: p-6 md:p-8 */}
      <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
        {/* Meta badges row */}
        <div className="flex items-center gap-2.5">
          <Bone className="h-5 w-8 rounded-[7px]" />
          <Bone className="h-4 w-24" />
        </div>
        {/* h2: text-3xl (30px) line-clamp-2 */}
        <Bone className="h-9 w-[82%] rounded-xl" />
        {/* description: line-clamp-3 leading-relaxed */}
        <div className="flex flex-col gap-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-[92%]" />
          <Bone className="h-4 w-[68%]" />
        </div>
        {/* Meta row: address + hours, my-5 */}
        <div className="flex gap-4">
          <Bone className="h-4 w-28" />
          <Bone className="h-4 w-20" />
        </div>
        {/* Actions row */}
        <div className="flex items-center justify-between">
          {/* Price: text-2xl */}
          <Bone className="h-7 w-20 rounded-lg" />
          <div className="flex gap-2">
            {/* View detail btn: h-10.5 rounded-full px-4.5 */}
            <Bone className="h-[42px] w-32 rounded-full" />
            {/* Bookmark btn: h-10.5 w-10.5 rounded-full */}
            <Bone className="h-[42px] w-[42px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Standard card skeleton (grid) ─────────────────────────────────────── */
function StandardCardSkeleton() {
  return (
    /*
     * matches: rounded-[22px] border border-[#a8bed4] bg-white
     */
    <div className="animate-pulse overflow-hidden rounded-[22px] border-border bg-card">
      {/* Thumbnail: h-43.75 = 175px */}
      <div className="h-[175px] bg-muted" />
      {/* Body: p-4.25 = 17px */}
      <div className="flex flex-col gap-3 p-[17px]">
        {/* Title: text-lg (18px) line-clamp-1 */}
        <Bone className="h-[18px] w-[78%] rounded-md" />
        {/* Rating: star + number */}
        <Bone className="h-[13px] w-14" />
        {/* Description: line-clamp-2 min-h-11.75 = 47px text-sm */}
        <div className="flex min-h-[47px] flex-col gap-1.5">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-[72%]" />
        </div>
        {/* Footer: address + price */}
        <div className="flex items-center justify-between border-t pt-3.5">
          <Bone className="h-[13px] w-24" />
          <Bone className="h-[13px] w-14" />
        </div>
      </div>
    </div>
  );
}

/* ─── Standard card skeleton (list) ─────────────────────────────────────── */
function ListCardSkeleton() {
  return (
    /*
     * matches: rounded-xl border border-[#a8bed4] bg-white p-3
     */
    <div className="animate-pulse flex items-center gap-4 overflow-hidden rounded-xl border-border bg-card p-3">
      {/* Thumbnail: h-32 w-32 rounded-lg */}
      <div className="h-32 w-32 shrink-0 rounded-lg bg-muted" />
      <div className="flex flex-1 flex-col gap-2 py-2">
        {/* Title: text-sm line-clamp-1 */}
        <Bone className="h-4 w-[65%]" />
        {/* Description: 2 lines */}
        <Bone className="h-3.5 w-full" />
        <Bone className="h-3.5 w-[80%]" />
        {/* Footer */}
        <div className="mt-1 flex items-center justify-between border-t pt-2">
          <Bone className="h-3 w-20" />
          <Bone className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

/* ─── Content head skeleton ──────────────────────────────────────────────── */
function ContentHeadSkeleton() {
  return (
    <div className="mb-4 flex animate-pulse flex-wrap items-center justify-between gap-3.5">
      {/* h2: text-[25px] font-black */}
      <Bone className="h-[25px] w-52 rounded-xl" />
      <div className="flex items-center gap-2">
        {/* "n / total results" text */}
        <Bone className="hidden h-4 w-32 sm:block" />
        {/* Per-page dropdown btn: h-[38px] rounded-[14px] */}
        <Bone className="h-[38px] w-[110px] rounded-[14px]" />
        {/* View mode switcher: h-[38px] rounded-[14px] */}
        <Bone className="h-[38px] w-[114px] rounded-[14px]" />
      </div>
    </div>
  );
}

/* ─── Quick-access buttons skeleton ─────────────────────────────────────── */
function QuickBtnsSkeleton() {
  /* px-[14px] py-[9px] text-[13px] → h ≈ 36px, width varies */
  return (
    <div className="mb-4 flex animate-pulse flex-wrap gap-2.5">
      <Bone className="h-9 w-[60px] rounded-full" />
      <Bone className="h-9 w-[100px] rounded-full" />
      <Bone className="h-9 w-[114px] rounded-full" />
    </div>
  );
}

/* ─── Pagination skeleton ────────────────────────────────────────────────── */
function PaginationSkeleton() {
  return (
    <div className="mt-[22px] flex animate-pulse flex-wrap items-center justify-center gap-2">
      {/* Prev btn: h-[38px] min-w-[90px] rounded-full */}
      <Bone className="h-[38px] w-[90px] rounded-full" />
      {/* Page number btns: h-[38px] w-[38px] rounded-[12px] */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Bone key={i} className="h-[38px] w-[38px] rounded-[12px]" />
      ))}
      {/* Next btn */}
      <Bone className="h-[38px] w-[90px] rounded-full" />
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

              {/* 3-col card grid */}
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

/* ─── Named export for list/grid toggle ─────────────────────────────────── */
export { StandardCardSkeleton, ListCardSkeleton, FeaturedCardSkeleton };
