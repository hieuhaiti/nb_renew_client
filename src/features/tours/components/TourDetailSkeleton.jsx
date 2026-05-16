import React from 'react';
import RootLayout from '@/components/layout/RootLayout';

/** Skeleton block – đặt trong vùng `animate-pulse` của cha */
function Sk({ className = '', style = {} }) {
  return <div className={`rounded bg-muted ${className}`} style={style} />;
}

function OverviewCardSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#dbeaf5] bg-white p-5 shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      {/* header */}
      <Sk className="mb-[14px] h-[22px] w-[160px] rounded-[8px]" />
      {/* 4-col grid – mỗi ô: icon 38px + label 14px + sub 12px = ~110px */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[18px] border-border bg-muted p-[14px]">
            <Sk className="mb-[10px] h-[38px] w-[38px] rounded-[14px]" />
            <Sk className="mb-1.5 h-[16px] w-3/4 rounded-[6px]" />
            <Sk className="h-[12px] w-full rounded-[6px]" />
            <Sk className="mt-1 h-[12px] w-2/3 rounded-[6px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleCardSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#dbeaf5] bg-white p-5 shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      {/* header */}
      <Sk className="mb-[14px] h-[22px] w-[180px] rounded-[8px]" />
      {/* tabs */}
      <div className="mb-4 flex gap-[10px]">
        {[70, 100, 72, 56].map((w, i) => (
          <Sk key={i} className="h-[38px] rounded-full" style={{ width: w }} />
        ))}
      </div>
      {/* day group */}
      <div className="overflow-hidden rounded-[22px] border-border">
        {/* day head – 50px */}
        <Sk className="h-[50px] rounded-none rounded-t-[22px]" />
        {/* 3 stops – mỗi stop: 86px time col + title + desc + icon = ~90px */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="grid items-start gap-3 border-t border-border px-4 py-3.75"
            style={{ gridTemplateColumns: '86px 1fr auto' }}
          >
            {/* time box 86×56 */}
            <Sk className="h-[56px] rounded-[14px]" />
            {/* title + desc */}
            <div className="flex flex-col gap-2 pt-1">
              <Sk className="h-[16px] w-4/5 rounded-[6px]" />
              <Sk className="h-[13px] w-full rounded-[6px]" />
              <Sk className="h-[13px] w-3/5 rounded-[6px]" />
            </div>
            {/* icon 40×40 */}
            <Sk className="h-[40px] w-[40px] rounded-[15px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MapBoxSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#dbeaf5] bg-white p-5 shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      <Sk className="mb-[14px] h-[22px] w-[220px] rounded-[8px]" />
      {/* map area 360px + bottom panel ~60px + padding = 420px total inner */}
      <div className="relative h-[360px] overflow-hidden rounded-[24px]">
        <Sk className="h-full w-full rounded-[24px]" />
        {/* stats panel – absolute bottom */}
        <div
          className="absolute right-3 bottom-3 left-3 grid grid-cols-3 gap-2 rounded-[20px] bg-white/95 p-[13px]"
          style={{ boxShadow: '0 18px 45px rgba(8,43,74,.12)' }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[14px] bg-muted p-2.5">
              <Sk className="mb-1 h-[16px] w-3/4 rounded-[6px]" />
              <Sk className="h-[12px] w-full rounded-[6px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesCardSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#dbeaf5] bg-white p-5 shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      <Sk className="mb-[14px] h-[22px] w-[260px] rounded-[8px]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-[10px] rounded-[17px] border-border bg-muted p-3"
          >
            <Sk className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full" />
            <Sk className="h-[18px] flex-1 rounded-[6px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedToursCardSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#dbeaf5] bg-white p-5 shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      <Sk className="mb-[14px] h-[22px] w-[140px] rounded-[8px]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[24px] border-border bg-card">
            <Sk className="h-[130px] rounded-none rounded-t-[24px]" />
            <div className="p-[14px]">
              <Sk className="mb-2 h-[16px] w-4/5 rounded-[6px]" />
              <Sk className="mb-1 h-[16px] w-3/5 rounded-[6px]" />
              <Sk className="h-[13px] w-2/3 rounded-[6px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border-border bg-card shadow-(--ambient-shadow)">
      {/* price top – bg gradient, padding 20px */}
      <div className="border-b border-border p-5" style={{ background: 'linear-gradient(135deg,#fff8e6,#fff)' }}>
        <Sk className="mb-2 h-[14px] w-[60px] rounded-[6px]" />
        {/* price – 34px font */}
        <Sk className="mb-2 h-[40px] w-[160px] rounded-[10px]" />
        <Sk className="h-[14px] w-[50px] rounded-[6px]" />
      </div>
      {/* body – 3 fields + 2 buttons */}
      <div className="p-[18px]">
        {[
          { labelW: 100, inputH: 46 },
          { labelW: 80, inputH: 46 },
          { labelW: 100, inputH: 80 },
        ].map((f, i) => (
          <div key={i} className="mb-3">
            <Sk className="mb-[7px] h-[14px] rounded-[6px]" style={{ width: f.labelW }} />
            <Sk className="w-full rounded-[15px]" style={{ height: f.inputH }} />
          </div>
        ))}
        <Sk className="mb-2 h-[46px] w-full rounded-full" />
        <Sk className="h-[46px] w-full rounded-full" />
      </div>
    </div>
  );
}

function SmallCardSkeleton({ rows = 4 }) {
  return (
    <div className="rounded-[28px] border border-[#dbeaf5] bg-white p-5 shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      <Sk className="mb-[14px] h-[20px] w-[140px] rounded-[8px]" />
      <div className="flex flex-col gap-[10px]">
        {Array.from({ length: rows }).map((_, i) => (
          <Sk key={i} className="h-[44px] w-full rounded-[16px]" />
        ))}
      </div>
    </div>
  );
}

function GuideCardSkeleton() {
  return (
    <div className="rounded-[28px] border border-[#dbeaf5] bg-white p-5 shadow-[0_12px_32px_rgba(8,43,74,.06)]">
      <Sk className="mb-[14px] h-[20px] w-[140px] rounded-[8px]" />
      <div className="flex items-center gap-3">
        {/* avatar 58×58 */}
        <Sk className="h-[58px] w-[58px] shrink-0 rounded-[20px]" />
        <div className="flex flex-1 flex-col gap-2">
          <Sk className="h-[17px] w-3/4 rounded-[6px]" />
          <Sk className="h-[13px] w-full rounded-[6px]" />
          <Sk className="h-[13px] w-2/3 rounded-[6px]" />
        </div>
      </div>
    </div>
  );
}

export default function TourDetailSkeleton() {
  return (
    <RootLayout>
      <div
        className="min-h-screen animate-pulse overflow-x-hidden pb-10"
        style={{ background: 'linear-gradient(180deg,#eaf7ff 0,#fff 42%,#f5fbff 100%)' }}
      >
        <div className="px-5 pt-5.5 pb-11 md:px-[5vw]">

          {/* ═══════════════════════════════════════
              BREADCRUMB – 20px height
          ═══════════════════════════════════════ */}
          <div className="mb-4 flex items-center gap-2">
            <Sk className="h-[16px] w-[60px] rounded-[6px]" />
            <Sk className="h-[10px] w-[10px] rounded-full" />
            <Sk className="h-[16px] w-[80px] rounded-[6px]" />
            <Sk className="h-[10px] w-[10px] rounded-full" />
            <Sk className="h-[16px] w-[180px] rounded-[6px]" />
          </div>

          {/* ═══════════════════════════════════════
              HERO  grid 1.15fr / .85fr, gap 18px
          ═══════════════════════════════════════ */}
          <section className="grid grid-cols-1 items-stretch gap-[18px] xl:grid-cols-[1.15fr_.85fr]">
            {/* Hero main – min-h-470, rounded-32 */}
            <Sk className="min-h-[470px] rounded-[32px]" />

            {/* Gallery – grid 2 cols, gap 14px */}
            <div className="grid grid-cols-2 gap-[14px]">
              {/* big – col-span-2, min-h-220, rounded-24 */}
              <Sk className="col-span-2 min-h-[220px] rounded-[24px]" />
              {/* small ×2 – min-h-145, rounded-24 */}
              <Sk className="min-h-[145px] rounded-[24px]" />
              <Sk className="min-h-[145px] rounded-[24px]" />
            </div>
          </section>

          {/* ═══════════════════════════════════════
              CONTENT  grid minmax(0,1fr) / 360px, gap 22px, mt 22px
          ═══════════════════════════════════════ */}
          <section className="mt-[22px] grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[minmax(0,1fr)_360px]">

            {/* ─── Main col ─── */}
            <div className="flex flex-col gap-[18px]">
              <OverviewCardSkeleton />
              <ScheduleCardSkeleton />
              <MapBoxSkeleton />
              <ServicesCardSkeleton />
              <RelatedToursCardSkeleton />
            </div>

            {/* ─── Sidebar (360px) ─── */}
            <aside className="flex flex-col gap-[18px] xl:sticky xl:top-[86px]">
              <BookingCardSkeleton />
              {/* Smart status – 4 rows */}
              <SmallCardSkeleton rows={4} />
              {/* Rating */}
              <div className="rounded-[28px] border border-[#dbeaf5] bg-white p-5 shadow-[0_12px_32px_rgba(8,43,74,.06)]">
                <Sk className="mb-[14px] h-[20px] w-[100px] rounded-[8px]" />
                {/* stars row */}
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Sk key={i} className="h-[16px] w-[16px] rounded-[4px]" />
                  ))}
                  <Sk className="ml-2 h-[18px] w-[48px] rounded-[6px]" />
                </div>
                <Sk className="mb-1 h-[13px] w-full rounded-[6px]" />
                <Sk className="h-[13px] w-4/5 rounded-[6px]" />
              </div>
              <GuideCardSkeleton />
            </aside>
          </section>
        </div>
      </div>
    </RootLayout>
  );
}
