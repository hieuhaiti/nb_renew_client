import React from 'react';
import RootLayout from '@/components/layout/RootLayout';

/** Skeleton block – đặt trong vùng `animate-pulse` của cha */
function Sk({ className = '', style = {} }) {
  return <div className={`rounded bg-muted ${className}`} style={style} />;
}

function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border-border bg-card shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      {/* ảnh tour – 190px */}
      <Sk className="h-[190px] rounded-none rounded-t-[28px]" />

      <div className="p-[17px]">
        {/* tên tour – 2 dòng */}
        <Sk className="mb-[10px] h-[20px] w-4/5 rounded-[8px]" />
        <Sk className="mb-3 h-[16px] w-2/3 rounded-[8px]" />

        {/* mô tả – 2 dòng */}
        <Sk className="mb-1.5 h-[13px] w-full rounded-[6px]" />
        <Sk className="mb-4 h-[13px] w-3/4 rounded-[6px]" />

        {/* meta grid 2×2 – mỗi ô 54px */}
        <div className="mb-[14px] grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Sk key={i} className="h-[54px] rounded-[13px]" />
          ))}
        </div>

        {/* price-row */}
        <div className="flex items-center justify-between gap-2">
          <Sk className="h-[28px] w-[100px] rounded-[8px]" />
          <Sk className="h-[38px] w-[80px] rounded-[14px]" />
        </div>
      </div>
    </div>
  );
}

function FilterSidebarSkeleton() {
  return (
    <div
      className="h-max rounded-[28px] border-border bg-card p-4.5 shadow-(--ambient-shadow)"
    >
      {/* header */}
      <Sk className="mb-5 h-[22px] w-[120px] rounded-[8px]" />

      {/* 5 fields – label 16px + gap 7px + input 46px + gap 13px = 82px */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="mb-[13px]">
          <Sk className="mb-[7px] h-[14px] w-[80px] rounded-[6px]" />
          <Sk className="h-[46px] w-full rounded-[15px]" />
        </div>
      ))}

      {/* chips – 32px height */}
      <div className="mb-[14px] flex flex-wrap gap-2">
        {[62, 80, 112, 74].map((w, i) => (
          <Sk key={i} className="h-[32px] rounded-full" style={{ width: w }} />
        ))}
      </div>

      {/* button */}
      <Sk className="h-[46px] w-full rounded-full" />
      <Sk className="mt-2 h-[40px] w-full rounded-full" />
    </div>
  );
}

export default function TourPageSkeleton() {
  return (
    <RootLayout>
      <div
        className="min-h-screen animate-pulse overflow-x-hidden"
        style={{ background: 'linear-gradient(180deg,#eaf7ff 0,#fff 42%,#f5fbff 100%)' }}
      >
        {/* ═══════════════════════════════════════
            HERO  padding: 26px 5vw 20px
        ═══════════════════════════════════════ */}
        <section className="px-5 pt-6.5 pb-5 md:px-[5vw]">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_.95fr]">

            {/* Hero left – 360px min-height, rounded-32 */}
            <Sk className="min-h-[360px] rounded-[32px]" />

            {/* Hero right – summary cards */}
            <div className="grid grid-cols-2 gap-[14px]">
              {/* 4 summary cards – icon 44px + text + subtitle ≈ 120px */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-[24px] border-border bg-card p-5"
                >
                  {/* icon 44px */}
                  <Sk className="h-[44px] w-[44px] rounded-[16px]" />
                  {/* value */}
                  <Sk className="h-[28px] w-[80px] rounded-[8px]" />
                  {/* label */}
                  <Sk className="h-[14px] w-[100px] rounded-[6px]" />
                </div>
              ))}

              {/* Wide smart card – col-span-2, 80px */}
              <div className="col-span-2 flex items-center gap-4 rounded-[24px] border-border bg-card p-5">
                <Sk className="h-[44px] w-[44px] shrink-0 rounded-[16px]" />
                <div className="flex flex-1 flex-col gap-2">
                  <Sk className="h-[18px] w-[140px] rounded-[8px]" />
                  <Sk className="h-[14px] w-full rounded-[6px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            LAYOUT  padding: 12px 5vw 42px
        ═══════════════════════════════════════ */}
        <section className="px-5 pt-3 pb-10.5 md:px-[5vw]">
          <div className="grid grid-cols-1 gap-[22px] xl:grid-cols-[305px_1fr]">

            {/* Filter sidebar */}
            <FilterSidebarSkeleton />

            {/* Main col */}
            <main className="flex flex-col gap-[18px]">

              {/* Toolbar – 78px */}
              <div className="flex items-center justify-between gap-4 rounded-[24px] border-border bg-card px-4 py-3.5">
                <div className="flex flex-col gap-2">
                  <Sk className="h-[26px] w-[220px] rounded-[8px]" />
                  <Sk className="h-[14px] w-[180px] rounded-[6px]" />
                </div>
                <Sk className="h-[40px] w-[160px] rounded-full" />
              </div>

              {/* Map strip – 3 cards × 72px */}
              <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-[24px] border-border bg-card p-4"
                  >
                    <Sk className="h-[42px] w-[42px] shrink-0 rounded-[15px]" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Sk className="h-[16px] w-[80px] rounded-[6px]" />
                      <Sk className="h-[12px] w-[110px] rounded-[6px]" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tour grid – 6 cards */}
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
