import React from 'react';

/* ─── primitives ─────────────────────────────────────── */

/** A single pulsing placeholder block */
const Sk = ({ className = '', style }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} style={style} />
);

/** White card shell matching all content cards exactly */
function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-[24px] border-border bg-card px-5 py-5 shadow-(--ambient-shadow) ${className}`}
    >
      {children}
    </div>
  );
}

/** Section h2 row: icon square + text bar */
function TitleRow({ textWidth = 176 }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <Sk className="h-6 w-6 rounded-md" />
      <Sk className="h-6 rounded-md" style={{ width: textWidth }} />
    </div>
  );
}

/* ─── hero ────────────────────────────────────────────── */

function HeroSkeleton() {
  return (
    <section className="overflow-hidden rounded-[30px] border border-[#dcecf7] bg-white shadow-[0_14px_35px_rgba(7,29,54,0.12)]">
      {/* image area — same min-h as TourismDetailHero */}
      <div className="relative flex min-h-[280px] animate-pulse items-end bg-muted p-6 md:min-h-[420px] md:p-7">
        {/* floating action buttons (top-right) — h-11 w-11 rounded-2xl */}
        <div className="absolute right-4 top-4 flex gap-2.5 md:right-6 md:top-6">
          <Sk className="h-11 w-11 rounded-2xl bg-muted-foreground/40" />
          <Sk className="h-11 w-11 rounded-2xl bg-muted-foreground/40" />
          <Sk className="h-11 w-11 rounded-2xl bg-muted-foreground/40" />
        </div>

        {/* hero content (bottom-left) */}
        <div className="relative z-10 w-full max-w-[880px] space-y-3">
          {/* category tag pill */}
          <Sk className="h-7 w-[120px] rounded-full bg-muted-foreground/30" />
          {/* h1 title — text-[28px] md:text-[46px] */}
          <Sk className="h-9 rounded-lg bg-muted-foreground/25 md:h-11" style={{ width: '62%' }} />
          {/* description — line-clamp-2 */}
          <Sk className="h-4 rounded bg-muted-foreground/25" style={{ width: '50%' }} />
          {/* meta pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[160, 210, 145, 125].map((w, i) => (
              <Sk
                key={i}
                className="h-9 rounded-full bg-muted-foreground/30"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* summary strip — grid-cols-5, each cell: px-2 py-4 */}
      <div className="grid grid-cols-5 divide-x divide-border border-t border-border">
        {/* value widths: 48 52 44 60 40 */}
        {[48, 52, 44, 60, 40].map((w, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 px-2 py-4">
            {/* b — text-[21px] → h ~28px */}
            <Sk className="h-[21px] rounded" style={{ width: w + 8 }} />
            {/* span — text-[12px] → h ~14px */}
            <Sk className="h-3 rounded" style={{ width: w + 16 }} />
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
      {/* description paragraph — text-[15px] leading-[1.8] */}
      <div className="mb-4 space-y-2">
        <Sk className="h-[15px] w-full rounded" />
        <Sk className="h-[15px] rounded" style={{ width: '93%' }} />
        <Sk className="h-[15px] rounded" style={{ width: '78%' }} />
      </div>
      {/* info-boxes grid — sm:grid-cols-2, rounded-[18px] p-[14px] */}
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-[18px] border-border bg-muted p-[14px]"
          >
            <Sk className="mb-2 h-5 w-5 rounded" />
            {/* label b — text-[14px] → h ~18px */}
            <Sk className="mb-1.5 h-[14px] w-20 rounded" />
            {/* value span — text-[12px] → h ~14px */}
            <Sk className="h-3 rounded" style={{ width: 128 }} />
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
      {/* header row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sk className="h-6 w-6 rounded-md" />
          <Sk className="h-6 w-40 rounded-md" />
        </div>
        {/* "Xem tất cả (N)" link */}
        <Sk className="h-4 w-28 rounded" />
      </div>

      {/* 3-col grid — gridTemplateColumns: '1.2fr 0.8fr 0.8fr' */}
      <div className="grid gap-2.5" style={{ gridTemplateColumns: '1.2fr 0.8fr 0.8fr' }}>
        {/* big photo: row-span-2 min-h-[350px] */}
        <Sk
          className="row-span-2 rounded-[18px]"
          style={{ minHeight: 350 }}
        />
        {/* 4 small photos: min-h-[170px] */}
        {[0, 1, 2, 3].map((i) => (
          <Sk key={i} className="rounded-[18px]" style={{ minHeight: 170 }} />
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
      {/* grid-cols-2 sm:grid-cols-4, rounded-[16px] px-3 py-[13px] */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="rounded-[16px] border-border bg-muted px-3 py-[13px]"
          >
            {/* icon — h-5 w-5 */}
            <Sk className="mx-auto mb-2 h-5 w-5 rounded" />
            {/* label — text-[12px] */}
            <Sk className="mx-auto h-3 w-14 rounded" />
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
      {/* rating summary bar */}
      <div className="mb-5 flex items-center gap-6">
        <div className="flex flex-col items-center gap-1.5">
          {/* big average number */}
          <Sk className="h-12 w-16 rounded" />
          {/* stars row */}
          <Sk className="h-4 w-24 rounded" />
          {/* count */}
          <Sk className="h-3 w-20 rounded" />
        </div>
        <div className="flex-1 space-y-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Sk className="h-3 w-6 shrink-0 rounded" />
              <Sk className="h-2 flex-1 rounded-full" />
              <Sk className="h-3 w-5 shrink-0 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* review item cards — rounded-[18px] border bg-[#f8fcff] p-[13px] */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="mb-3 flex gap-3 rounded-[18px] border-border bg-muted p-[13px]"
        >
          {/* avatar — h-[42px] w-[42px] rounded-full */}
          <Sk className="h-[42px] w-[42px] shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            {/* reviewer name */}
            <Sk className="h-[14px] w-28 rounded" />
            {/* stars row */}
            <Sk className="h-3 w-20 rounded" />
            {/* comment lines */}
            <Sk className="h-3 w-full rounded" />
            <Sk className="h-3 rounded" style={{ width: '82%' }} />
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
      className="animate-pulse rounded-[24px] p-5 shadow-[0_14px_35px_rgba(7,29,54,0.12)]"
      style={{ background: 'linear-gradient(135deg,#a5cdd8,#9dc8bc)' }}
    >
      {/* h3 — text-[22px] */}
      <Sk className="mb-3 h-7 w-40 rounded-md bg-[#88b8c8]" />
      {/* description lines */}
      <Sk className="mb-1.5 h-[13px] w-full rounded bg-[#88b8c8]" />
      <Sk className="mb-4 h-[13px] rounded bg-[#88b8c8]" style={{ width: '72%' }} />
      {/* buttons — h-11 */}
      <div className="flex flex-col gap-3">
        <Sk className="h-11 w-full rounded-[15px] bg-[#8fbec9]" />
        <Sk className="h-11 w-full rounded-[15px] bg-[#80aab8]" />
      </div>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <Card>
      {/* title row */}
      <div className="mb-3 flex items-center gap-2.5">
        <Sk className="h-5 w-5 rounded-md" />
        <Sk className="h-5 w-36 rounded-md" />
      </div>
      {/* weather description text */}
      <Sk className="mb-2 h-3 w-28 rounded" />
      {/* 2 weather boxes — rounded-[16px] border-[#fee6ad] bg-[#fff8e6] p-[13px] */}
      <div className="mb-3 grid grid-cols-2 gap-2.5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-[16px] border border-tertiary/30 bg-tertiary-soft p-[13px] text-center"
          >
            {/* b — text-[20px] */}
            <Sk className="mx-auto mb-1 h-[20px] w-12 rounded bg-muted" />
            {/* span — text-[12px] */}
            <Sk className="mx-auto h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
      {/* quick-row items — rounded-[15px] border bg-[#f6fbff] px-3 py-3 h-[46px] */}
      {[0, 1, 2].map((i) => (
        <Sk key={i} className="mb-2 h-[46px] w-full rounded-[15px]" />
      ))}
    </Card>
  );
}

function NearbySkeleton() {
  return (
    <Card>
      {/* title row */}
      <div className="mb-3 flex items-center gap-2.5">
        <Sk className="h-5 w-5 rounded-md" />
        <Sk className="h-5 w-28 rounded-md" />
      </div>
      {/* nearby items — grid 72px + 1fr, img h-[58px] w-[72px] rounded-[14px] */}
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid items-center gap-2.5"
            style={{ gridTemplateColumns: '72px 1fr' }}
          >
            <Sk className="h-[58px] w-[72px] rounded-[14px]" />
            <div className="space-y-1.5 py-1">
              <Sk className="h-[13px] rounded" style={{ width: '80%' }} />
              <Sk className="h-3 rounded" style={{ width: '60%' }} />
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
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
        {/* breadcrumb — text-[13px] font-extrabold h ~20px */}
        <div className="mb-4 flex items-center gap-2">
          <Sk className="h-4 w-20 rounded" />
          <Sk className="h-3 w-3 rounded" />
          <Sk className="h-4 w-24 rounded" />
          <Sk className="h-3 w-3 rounded" />
          <Sk className="h-4 w-44 rounded" />
        </div>

        {/* hero */}
        <HeroSkeleton />

        {/* two-column layout — mt-5, lg:grid-cols-[1fr_360px], gap-5 */}
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
