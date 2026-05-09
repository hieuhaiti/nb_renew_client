import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Search,
  Repeat2,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import RootLayout from '@/components/layout/RootLayout';
import { useFestivalsQuery, useFestivalTypesQuery } from '@/services/api/map/festivalService';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };
const HERO_BG = `linear-gradient(135deg,rgba(3,95,172,.90),rgba(14,165,233,.85),rgba(126,34,206,.72)), url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80") center/cover`;

const TYPE_CONFIG = {
  religious:   { label: 'Tôn giáo',      bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200' },
  traditional: { label: 'Truyền thống',  bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200'  },
  cultural:    { label: 'Văn hóa',       bg: 'bg-[#eef7ff]',  text: 'text-[#0b66c3]',  border: 'border-[#cfe0f4]'  },
  folk:        { label: 'Dân gian',      bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200'  },
  modern:      { label: 'Hiện đại',      bg: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-200'   },
  seasonal:    { label: 'Theo mùa',      bg: 'bg-lime-50',    text: 'text-lime-700',   border: 'border-lime-200'   },
};

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || { label: type || '—', bg: 'bg-[#f8fbff]', text: 'text-[#52647a]', border: 'border-[#cfe0f4]' };
}

function getFestivalName(f) {
  return f?.name_vi || f?.name_en || f?.name || 'Lễ hội';
}

function getFestivalDescription(f) {
  return f?.description_vi || f?.description_en || f?.description || '';
}

function formatDateRange(start, end) {
  if (!start) return '';
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const fmt = (d, opts) => d.toLocaleDateString('vi-VN', opts);

  if (!e || s.toDateString() === e.toDateString()) {
    return fmt(s, { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} – ${fmt(e, { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  }
  return `${fmt(s, { day: '2-digit', month: '2-digit' })} – ${fmt(e, { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const days = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  if (days < 0) return null;
  if (days === 0) return 'Hôm nay';
  if (days <= 60) return `Còn ${days} ngày`;
  return null;
}

function FestivalCard({ festival, navigate }) {
  const name = getFestivalName(festival);
  const description = getFestivalDescription(festival);
  const imageSrc = withBaseUrl(festival?.cover_image_url || '') || placeholderImg;
  const typeConf = getTypeConfig(festival?.festival_type);
  const dateRange = formatDateRange(festival?.start_date, festival?.end_date);
  const daysUntil = getDaysUntil(festival?.start_date);
  const location = festival?.location_name || festival?.spot_name || '';

  return (
    <article
      onClick={() => festival?.id && navigate(`/festival/${festival.id}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white shadow-[0_4px_16px_rgba(13,74,130,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(13,74,130,0.15)]"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
        />

        {/* Overlay gradient from bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Type badge */}
        <span className={`absolute top-3 left-3 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${typeConf.bg} ${typeConf.text} ${typeConf.border}`}>
          {typeConf.label}
        </span>

        {/* Recurring badge */}
        {festival?.is_recurring && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Repeat2 size={11} />
            Hàng năm
          </span>
        )}

        {/* Countdown badge */}
        {daysUntil && (
          <span className="absolute bottom-3 right-3 rounded-full bg-[#f59e0b]/90 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            {daysUntil}
          </span>
        )}

        {/* Date on image bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <CalendarDays size={13} className="text-white/80" />
          <span className="text-xs font-semibold text-white drop-shadow">{dateRange}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2 text-sm font-black leading-snug text-foreground transition-colors group-hover:text-[#0b66c3]"
          title={name}
        >
          {name}
        </h3>

        {location && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={11} className="shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {description || 'Chưa có mô tả.'}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between">
            {festival?.spot_name && (
              <span className="line-clamp-1 max-w-[60%] text-xs text-muted-foreground">
                {festival.spot_name}
              </span>
            )}
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-[#0b66c3] group-hover:underline">
              Xem chi tiết <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function FestivalCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white">
      <div className="bg-muted h-52 w-full" />
      <div className="space-y-2 p-4">
        <div className="bg-muted h-4 w-3/4 rounded" />
        <div className="bg-muted h-3 w-1/2 rounded" />
        <div className="bg-muted h-3 w-full rounded" />
        <div className="bg-muted h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export default function FestivalPageContent() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [upcomingFilter, setUpcomingFilter] = useState('upcoming');
  const [page, setPage] = useState(1);
  const [debouncedKeyword] = useDebounce(keyword.trim(), 400);

  const upcoming =
    upcomingFilter === 'upcoming' ? true : upcomingFilter === 'past' ? false : undefined;

  const { data, isLoading, isError, isFetching, refetch } = useFestivalsQuery({
    page,
    limit: 12,
    search: debouncedKeyword || undefined,
    festival_type: typeFilter !== 'all' ? typeFilter : undefined,
    upcoming: typeof upcoming === 'boolean' ? upcoming : undefined,
    sortBy: 'start_date',
    sortOrder: 'ASC',
  });

  const { data: typesData } = useFestivalTypesQuery();

  const festivals = useMemo(() => data?.data?.items || data?.items || [], [data]);

  const pagination = useMemo(
    () => data?.data?.pagination || data?.pagination || null,
    [data]
  );
  const total = pagination?.total ?? festivals.length;
  const totalPages = pagination?.totalPages ?? 1;

  const allTypeKeys = useMemo(() => {
    const fromApi =
      typesData?.data?.items ||
      typesData?.data?.types ||
      typesData?.items ||
      typesData?.types ||
      [];
    if (Array.isArray(fromApi) && fromApi.length) {
      return fromApi
        .map((item) => String(item?.code || item?.type || item?.slug || item?.value || item?.key || item?.id || '').trim())
        .filter(Boolean);
    }
    return [...new Set(festivals.map((f) => f?.festival_type).filter(Boolean))];
  }, [typesData, festivals]);

  const upcomingCount = useMemo(
    () => festivals.filter((f) => f?.start_date && new Date(f.start_date) >= new Date()).length,
    [festivals]
  );

  const handleReset = () => {
    setKeyword('');
    setTypeFilter('all');
    setUpcomingFilter('upcoming');
    setPage(1);
  };

  return (
    <RootLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="px-6 py-10 text-white" style={{ background: HERO_BG }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 max-w-2xl">
              <span className="mb-3 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                Lễ hội truyền thống & văn hóa Ninh Bình
              </span>
              <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight">
                Khám phá lễ hội đặc sắc
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/90">
                Tra cứu và lên kế hoạch tham dự các lễ hội truyền thống, tôn giáo và văn hoá theo thời gian thực.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 flex flex-wrap gap-3">
              {[
                { value: total, label: 'Lễ hội' },
                { value: upcomingCount, label: 'Sắp diễn ra' },
                { value: allTypeKeys.length || '—', label: 'Loại hình' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/25 bg-white/15 px-5 py-2.5 text-center backdrop-blur-sm"
                >
                  <div className="text-2xl font-black leading-none">{s.value}</div>
                  <div className="mt-0.5 text-xs text-white/80">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search bar */}
            <div
              className="flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center"
              style={{
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid rgba(255,255,255,0.75)',
                boxShadow: '0 12px 28px rgba(0,0,0,.14)',
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#52647a]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm lễ hội, địa điểm..."
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                  className="h-11 w-full rounded-xl border border-[#a8bed4] bg-white pl-9 pr-3 text-sm text-foreground outline-none focus:border-[#0b66c3]"
                />
              </div>
              <select
                value={upcomingFilter}
                onChange={(e) => { setUpcomingFilter(e.target.value); setPage(1); }}
                className="h-11 shrink-0 rounded-xl border border-[#a8bed4] bg-white px-3 text-sm text-foreground outline-none focus:border-[#0b66c3]"
              >
                <option value="upcoming">Sắp diễn ra</option>
                <option value="past">Đã qua</option>
                <option value="all">Tất cả</option>
              </select>
              <button
                type="button"
                onClick={() => { setPage(1); refetch?.(); }}
                className="h-11 shrink-0 rounded-xl px-5 text-sm font-bold text-white"
                style={BTN_GRADIENT}
              >
                Tìm lễ hội
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">

          {/* Type chips + toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* All chip */}
              <button
                type="button"
                onClick={() => { setTypeFilter('all'); setPage(1); }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  typeFilter === 'all'
                    ? 'bg-[#0b66c3] text-white'
                    : 'border border-[#cfe0f4] bg-white text-muted-foreground hover:bg-[#eef7ff]'
                }`}
              >
                Tất cả
              </button>
              {allTypeKeys.map((key) => {
                const conf = getTypeConfig(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setTypeFilter(key); setPage(1); }}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      typeFilter === key
                        ? 'bg-[#0b66c3] text-white'
                        : `border ${conf.border} ${conf.bg} ${conf.text} hover:opacity-80`
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{total}</strong> lễ hội
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="flex h-8 items-center gap-1.5 rounded-[8px] border border-[#cfe0f4] bg-white px-3 text-xs font-semibold text-muted-foreground hover:bg-[#eef7ff]"
              >
                <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
                Làm mới
              </button>
            </div>
          </div>

          {/* Festival grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <FestivalCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-[18px] border border-[#cfe0f4] bg-white py-20 text-center text-muted-foreground">
              Không thể tải dữ liệu lễ hội lúc này.
            </div>
          ) : festivals.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#cfe0f4] bg-white py-20 text-muted-foreground">
              <Inbox size={40} className="mb-3 opacity-30" />
              <p className="text-base font-semibold text-foreground">Chưa có lễ hội phù hợp</p>
              <p className="mt-1 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {festivals.map((festival) => (
                <FestivalCard key={festival?.id} festival={festival} navigate={navigate} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold disabled:opacity-40 hover:bg-[#eef7ff]"
              >
                <ChevronLeft size={15} /> Trước
              </button>
              <span className="rounded-full border border-[#cfe0f4] bg-white px-4 py-1.5 text-sm font-semibold">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold disabled:opacity-40 hover:bg-[#eef7ff]"
              >
                Sau <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className="mt-10 overflow-hidden rounded-[22px] px-7 py-7 text-white"
            style={{ background: HERO_BG }}
          >
            <p className="mb-1 text-xs font-semibold text-white/75">Lên kế hoạch tham quan</p>
            <h3 className="text-2xl font-black leading-tight">
              Kết hợp lễ hội với hành trình du lịch Ninh Bình
            </h3>
            <p className="mt-1.5 text-sm text-white/85">
              Xem bản đồ địa điểm, tour tham quan và điểm du lịch để có chuyến đi trọn vẹn hơn.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: 'Mở bản đồ', path: '/map' },
                { label: 'Xem tour', path: '/tour' },
                { label: 'Điểm tham quan', path: '/tourism-point' },
              ].map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="h-9 rounded-[10px] border border-white/35 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
