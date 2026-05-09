import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Inbox,
  LayoutGrid,
  List,
  Users,
  Wallet,
  ArrowRight,
  Ticket,
} from 'lucide-react';
import RootLayout from '@/components/layout/RootLayout';
import { useGetAllTours } from '@/services/api/tours/tourApi';
import { useDebounce } from 'use-debounce';
import { formatVND, withBaseUrl } from '@/lib/utils';
import { uiConfig } from '@/config/ui';
import placeholderImg from '@/assets/images/placeholder.png';

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };
const HERO_BG = `linear-gradient(315deg,rgba(3,95,172,.92),rgba(14,165,233,.86),rgba(16,185,129,.72)), url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80") center/cover`;

const DURATION_OPTIONS = [
  { value: '1', label: '1 ngày' },
  { value: '2', label: '2 ngày' },
  { value: '3', label: '3-4 ngày' },
];

const PRICE_OPTIONS = [
  { value: '', label: 'Tất cả mức giá' },
  { value: '500000', label: 'Dưới 500.000đ' },
  { value: '1500000', label: 'Dưới 1.500.000đ' },
  { value: '4000000', label: 'Dưới 4.000.000đ' },
];

const PAGE_SIZE_OPTIONS = [8, 12, 16, 24];

function getTourName(tour) {
  return tour?.name || tour?.name_vi || tour?.name_en || '';
}

function getTourImage(tour) {
  const url = withBaseUrl(tour?.cover_image_url || '');
  return url || placeholderImg;
}

function formatPrice(tour) {
  const price = Number(tour?.price_from_vnd ?? 0);
  if (!Number.isFinite(price) || price <= 0) return null;
  return formatVND(price);
}

function TourCardSkeleton({ isList }) {
  return (
    <div
      className={`animate-pulse overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white ${isList ? 'flex h-40' : ''}`}
    >
      <div className={`bg-muted ${isList ? 'h-full w-52 shrink-0' : 'h-44 w-full'}`} />
      <div className="flex-1 space-y-2 p-4">
        <div className="bg-muted h-5 w-3/4 rounded" />
        <div className="bg-muted h-4 w-full rounded" />
        <div className="bg-muted h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

function TourListCard({ tour, t, onOpen }) {
  const name = getTourName(tour);
  const price = formatPrice(tour);
  const rating = Number(tour.rating_avg ?? 0);
  const from = tour.start_location_vi || '';
  const to = tour.end_location_vi || '';

  return (
    <article
      onClick={onOpen}
      className="group flex h-44 cursor-pointer overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white shadow-[0_4px_16px_rgba(13,74,130,0.07)] transition-shadow hover:shadow-[0_8px_28px_rgba(13,74,130,0.14)]"
    >
      {/* Image */}
      <div className="relative w-52 shrink-0 self-stretch overflow-hidden">
        <img
          src={getTourImage(tour)}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        {tour.duration_days && (
          <span className="absolute top-3 left-3 rounded-full bg-black/45 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            {tour.duration_days} {t('tourPage.days', 'ngày')}
          </span>
        )}
        {tour.is_featured && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#f59e0b]/90 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            {t('tourPage.featured', 'Nổi bật')}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col justify-between px-5 py-4">
        <div>
          <h3
            className="text-foreground line-clamp-1 text-[15px] leading-snug font-black transition-colors group-hover:text-[#0b66c3]"
            title={name}
          >
            {name || t('tourPage.unknown', 'Tour')}
          </h3>
          <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
            {tour.description_vi || t('tourPage.noDescription', 'Chưa có mô tả')}
          </p>
        </div>

        <div className="mt-3 space-y-2">
          {/* From → To itinerary */}
          {(from || to) && (
            <div className="flex min-h-6 flex-wrap items-center gap-1.5">
              {from && (
                <span className="rounded-full border border-[#cfe0f4] bg-[#eef7ff] px-2.5 py-0.5 text-xs font-semibold text-[#0b66c3]">
                  {from.split(',')[0]}
                </span>
              )}
              {from && to && <ArrowRight size={11} className="text-muted-foreground" />}
              {to && (
                <span className="rounded-full border border-[#cfe0f4] bg-[#eef7ff] px-2.5 py-0.5 text-xs font-semibold text-[#0b66c3]">
                  {to.split(',')[0]}
                </span>
              )}
            </div>
          )}

          {/* Meta row */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
            {tour.duration_days && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {tour.duration_days} {t('tourPage.days', 'ngày')}
              </span>
            )}
            {tour.max_guests && (
              <span className="flex items-center gap-1">
                <Users size={11} />
                {tour.max_guests} {t('tourPage.people', 'khách')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price column */}
      <div className="flex w-40 shrink-0 flex-col items-center justify-center gap-1.5 border-l border-[#eef3f8] px-4 py-4">
        {rating > 0 && (
          <div className="flex items-center gap-1 text-xs font-bold text-[#d99200]">
            <Star size={12} className="fill-[#d99200]" />
            {rating.toFixed(1)}
          </div>
        )}
        {price ? (
          <div className="text-center">
            <div className="text-muted-foreground text-[10px]">{t('tourPage.priceFrom', 'Từ')}</div>
            <div className="text-sm font-black text-[#0b66c3]">{price}</div>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs font-semibold text-[#10b981]">
            <Ticket size={11} />
            {t('tourPage.contact', 'Liên hệ')}
          </div>
        )}
        <button
          type="button"
          className="mt-1 h-8 w-full rounded-[8px] px-3 text-xs font-bold text-white"
          style={BTN_GRADIENT}
        >
          {t('tourPage.viewDetail', 'Xem chi tiết')}
        </button>
      </div>
    </article>
  );
}

function TourGridCard({ tour, t, onOpen }) {
  const name = getTourName(tour);
  const price = formatPrice(tour);
  const rating = Number(tour.rating_avg ?? 0);

  return (
    <article
      onClick={onOpen}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white shadow-[0_4px_16px_rgba(13,74,130,0.07)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(13,74,130,0.15)]"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={getTourImage(tour)}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        {tour.duration_days && (
          <span className="absolute top-3 left-3 rounded-full bg-black/45 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            {tour.duration_days} {t('tourPage.days', 'ngày')}
          </span>
        )}
        {tour.is_featured && (
          <span className="absolute top-3 right-3 rounded-full bg-[#f59e0b]/90 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            {t('tourPage.featured', 'Nổi bật')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-foreground line-clamp-2 text-sm leading-snug font-black transition-colors group-hover:text-[#0b66c3]">
          {name || t('tourPage.unknown', 'Tour')}
        </h3>
        {rating > 0 && (
          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#d99200]">
            <Star size={11} className="fill-[#d99200]" />
            {rating.toFixed(1)}
          </div>
        )}
        <p className="text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed">
          {tour.description_vi || t('tourPage.noDescription', 'Chưa có mô tả')}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-[#eef3f8] pt-3">
          {tour.start_location_vi && (
            <span className="text-muted-foreground flex min-w-0 items-center gap-1 text-xs">
              <MapPin size={10} className="shrink-0" />
              <span className="truncate">{tour.start_location_vi.split(',')[0]}</span>
            </span>
          )}
          <span className="ml-auto shrink-0 text-sm font-black text-[#0b66c3]">
            {price || t('tourPage.contact', 'Liên hệ')}
          </span>
        </div>
      </div>
    </article>
  );
}

function FilterSidebar({
  durationFilter,
  onDurationChange,
  priceMaxFilter,
  onPriceMaxChange,
  startLocationFilter,
  onStartLocationChange,
  onApply,
  t,
  featuredTour,
}) {
  const navigate = useNavigate();
  return (
    <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
      <div className="rounded-[18px] border border-[#cfe0f4] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-foreground text-sm font-bold">
            {t('tourPage.filterTitle', 'Bộ lọc nhanh')}
          </span>
          <span className="rounded-full bg-[#eef7ff] px-2 py-0.5 text-xs font-semibold text-[#0b66c3]">
            {t('tourPage.filterOpen', 'Đang mở')}
          </span>
        </div>

        {/* Duration chips */}
        <div className="mb-3">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
            {t('tourPage.duration', 'Thời lượng')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DURATION_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => onDurationChange(o.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  durationFilter === o.value
                    ? 'bg-[#0b66c3] text-white'
                    : 'text-muted-foreground border border-[#cfe0f4] bg-[#f8fbff] hover:bg-[#eef7ff]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="mb-3">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
            {t('tourPage.budget', 'Ngân sách')}
          </p>
          <div className="relative">
            <Wallet
              size={13}
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
            />
            <select
              value={priceMaxFilter}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              className="text-foreground h-9 w-full rounded-[8px] border border-[#cfe0f4] bg-[#f8fbff] pr-3 pl-8 text-xs focus:outline-none"
            >
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start location */}
        <div className="mb-4">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
            {t('tourPage.startLocation', 'Điểm xuất phát')}
          </p>
          <div className="relative">
            <MapPin
              size={13}
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder={t('tourPage.startLocationPlaceholder', 'Vd: Bến thuyền Tràng An')}
              value={startLocationFilter}
              onChange={(e) => onStartLocationChange(e.target.value)}
              className="text-foreground h-9 w-full rounded-[8px] border border-[#cfe0f4] bg-[#f8fbff] pr-3 pl-8 text-xs focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onApply}
          className="h-9 w-full rounded-[10px] text-sm font-bold text-white"
          style={BTN_GRADIENT}
        >
          {t('tourPage.applyFilters', 'Áp dụng bộ lọc')}
        </button>
      </div>

      {/* Featured summary card */}
      {featuredTour && (
        <button
          type="button"
          onClick={() => navigate(`/tour/${featuredTour.slug}`)}
          className="w-full rounded-[18px] p-4 text-left transition-opacity hover:opacity-90"
          style={{
            background:
              'linear-gradient(315deg,rgba(3,95,172,.92),rgba(14,165,233,.86),rgba(16,185,129,.72))',
          }}
        >
          <p className="text-xs font-medium text-white/80">
            {t('tourPage.featuredToday', 'Tuyến nổi bật hôm nay')}
          </p>
          <p className="mt-1 text-sm font-black text-white">{getTourName(featuredTour)}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/75">
            {t(
              'tourPage.featuredSubtitle',
              'Phù hợp gia đình, nhóm bạn, khách lần đầu đến Ninh Bình.'
            )}
          </p>
          <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-white">
            {t('tourPage.viewTour', 'Xem tuyến')} <ArrowRight size={11} />
          </div>
        </button>
      )}
    </aside>
  );
}

export default function TourPageContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('list');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search.trim(), uiConfig.search.tourPageDebounceMs ?? 350);

  const [durationFilter, setDurationFilter] = useState('');
  const [priceMaxFilter, setPriceMaxFilter] = useState('');
  const [startLocationFilter, setStartLocationFilter] = useState('');
  const [appliedDuration, setAppliedDuration] = useState('');

  const { data, isLoading, isError, refetch, isFetching } = useGetAllTours({
    page,
    limit,
    search: debouncedSearch || undefined,
    duration_days: appliedDuration || undefined,
  });

  const tours = useMemo(() => data?.tours || [], [data]);
  const paginationFromApi = data?.pagination || null;
  const total = paginationFromApi?.total ?? tours.length;
  const pages = paginationFromApi?.totalPages ?? Math.max(1, Math.ceil(total / limit));

  const visibleTours = useMemo(() => {
    let list = paginationFromApi ? tours : tours.slice((page - 1) * limit, page * limit);
    if (priceMaxFilter) {
      const maxPrice = Number(priceMaxFilter);
      list = list.filter((t) => Number(t.price_from_vnd ?? 0) <= maxPrice);
    }
    if (startLocationFilter.trim()) {
      const q = startLocationFilter.trim().toLowerCase();
      list = list.filter((t) => (t.start_location_vi || '').toLowerCase().includes(q));
    }
    return list;
  }, [tours, paginationFromApi, page, priceMaxFilter, startLocationFilter, limit]);

  const featuredTour = useMemo(() => tours.find((t) => t.is_featured), [tours]);

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedDuration(durationFilter);
  };

  const handleReset = () => {
    setSearch('');
    setDurationFilter('');
    setPriceMaxFilter('');
    setStartLocationFilter('');
    setAppliedDuration('');
    setPage(1);
    refetch?.();
  };

  return (
    <RootLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="px-6 py-9 text-white" style={{ background: HERO_BG }}>
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-7 lg:grid-cols-[1fr_1.35fr]">
            <div>
              <h1 className="text-4xl leading-tight font-black tracking-tight">
                {t('tourPage.title', 'Tuyến du lịch')}
              </h1>
              <p className="mt-2 font-medium text-white/90">
                {t(
                  'tourPage.description',
                  'Khám phá các hành trình nổi bật tại Ninh Bình theo thời gian, ngân sách và chủ đề trải nghiệm.'
                )}
              </p>
            </div>

            <div
              className="flex flex-col items-stretch gap-3 rounded-3xl p-4 sm:flex-row sm:items-center"
              style={{
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid rgba(255,255,255,0.75)',
                boxShadow: '0 12px 28px rgba(0,0,0,.14)',
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-[#52647a]"
                />
                <input
                  type="text"
                  placeholder={t(
                    'tourPage.searchPlaceholder',
                    'Tìm kiếm tuyến du lịch, điểm đến...'
                  )}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="text-foreground focus:border-primary h-11 w-full rounded-xl border border-[#a8bed4] bg-white pr-3 pl-9 text-sm outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="h-11 shrink-0 rounded-xl px-5 text-sm font-bold text-white"
                style={BTN_GRADIENT}
              >
                {t('tourPage.filter', 'Lọc tuyến')}
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              {t('tourPage.showing', 'Hiển thị')}{' '}
              <strong className="text-foreground">
                {visibleTours.length} / {total}
              </strong>{' '}
              {t('tourPage.toursLabel', 'tuyến phù hợp')}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-xs font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-[#0b66c3] text-white'
                    : 'text-muted-foreground border border-[#cfe0f4] bg-white hover:bg-[#eef7ff]'
                }`}
              >
                <LayoutGrid size={12} /> {t('tourPage.gridView', 'Lưới')}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-xs font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-[#0b66c3] text-white'
                    : 'text-muted-foreground border border-[#cfe0f4] bg-white hover:bg-[#eef7ff]'
                }`}
              >
                <List size={12} /> {t('tourPage.listView', 'Danh sách')}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-muted-foreground flex h-8 items-center gap-1.5 rounded-[8px] border border-[#cfe0f4] bg-white px-3 text-xs font-semibold hover:bg-[#eef7ff]"
              >
                <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />{' '}
                {t('tourPage.refresh', 'Refresh')}
              </button>
              <select
                value={String(limit)}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-foreground h-8 rounded-[8px] border border-[#cfe0f4] bg-white px-2.5 text-xs font-semibold outline-none hover:bg-[#eef7ff]"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}/trang
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Layout: list + sidebar */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
            {/* Tour list */}
            <div>
              {isLoading ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
                      : 'flex flex-col gap-4'
                  }
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TourCardSkeleton key={i} isList={viewMode === 'list'} />
                  ))}
                </div>
              ) : isError ? (
                <div className="text-muted-foreground rounded-[18px] border border-[#cfe0f4] bg-white py-16 text-center">
                  {t('tourPage.errorLoading', 'Không thể tải danh sách tour')}
                </div>
              ) : !visibleTours.length ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center rounded-[18px] border border-[#cfe0f4] bg-white py-20">
                  <Inbox size={40} className="mb-3 opacity-30" />
                  <p className="text-foreground text-base font-semibold">
                    {t('tourPage.noTours', 'Không tìm thấy tuyến nào')}
                  </p>
                </div>
              ) : viewMode === 'list' ? (
                <div className="flex flex-col gap-4">
                  {visibleTours.map((tour) => (
                    <TourListCard
                      key={tour.id}
                      tour={tour}
                      t={t}
                      onOpen={() => navigate(`/tour/${tour.slug}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {visibleTours.map((tour) => (
                    <TourGridCard
                      key={tour.id}
                      tour={tour}
                      t={t}
                      onOpen={() => navigate(`/tour/${tour.slug}`)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="text-foreground flex h-9 items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold hover:bg-[#eef7ff] disabled:opacity-40"
                  >
                    <ChevronLeft size={15} /> {t('common.prev', 'Trước')}
                  </button>
                  <span className="rounded-full border border-[#cfe0f4] bg-white px-4 py-1.5 text-sm font-semibold">
                    {page} / {pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page >= pages}
                    className="text-foreground flex h-9 items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold hover:bg-[#eef7ff] disabled:opacity-40"
                  >
                    {t('common.next', 'Sau')} <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Filter sidebar */}
            <FilterSidebar
              durationFilter={durationFilter}
              onDurationChange={setDurationFilter}
              priceMaxFilter={priceMaxFilter}
              onPriceMaxChange={setPriceMaxFilter}
              startLocationFilter={startLocationFilter}
              onStartLocationChange={setStartLocationFilter}
              onApply={handleApplyFilters}
              t={t}
              featuredTour={featuredTour}
            />
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
