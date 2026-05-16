import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Inbox,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import { useGetAllTours } from '@/services/api/tours/tourApi';
import { useDebounce } from 'use-debounce';
import { formatVND, withBaseUrl } from '@/lib/utils';
import { uiConfig } from '@/config/ui';
import placeholderImg from '@/assets/images/placeholder.png';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import TourPageSkeleton from '@/features/tours/components/TourPageSkeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PRIMARY_GRAD = 'linear-gradient(135deg,#12a9b7,#0e9f8f)';
const HERO_LEFT_BG = `linear-gradient(135deg,rgba(6,36,68,.84),rgba(9,158,143,.78)),url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80') center/cover no-repeat`;
const PAGE_SIZE = 12;
const PRICE_MIN_VALUE = 0;
const PRICE_MAX_VALUE = 5000000;
const PRICE_STEP = 50000;

const clampPrice = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return PRICE_MIN_VALUE;
  return Math.max(PRICE_MIN_VALUE, Math.min(PRICE_MAX_VALUE, parsed));
};

function getTourName(tour, lang = 'vi') {
  if (lang === 'en') return tour?.name_en || tour?.name || tour?.name_vi || '';
  return tour?.name_vi || tour?.name || tour?.name_en || '';
}
function getTourDescription(tour, lang = 'vi') {
  if (lang === 'en') return tour?.description_en || tour?.description_vi || tour?.description || '';
  return tour?.description_vi || tour?.description_en || tour?.description || '';
}
function getTourStartLocation(tour, lang = 'vi') {
  if (lang === 'en') return tour?.start_location_en || tour?.start_location_vi || tour?.start_location || '';
  return tour?.start_location_vi || tour?.start_location_en || tour?.start_location || '';
}
function getTourImage(tour) { return withBaseUrl(tour?.cover_image_url || '') || placeholderImg; }

function TourCard({ tour, onOpen, t, lang }) {
  const name = getTourName(tour, lang);
  const price = Number(tour?.price_from_vnd ?? 0);
  const rating = Number(tour?.rating_avg ?? 0);
  const description = getTourDescription(tour, lang);
  const startLocation = getTourStartLocation(tour, lang);

  return (
    <article
      onClick={onOpen}
      className="cursor-pointer overflow-hidden rounded-[28px] border-border bg-card shadow-(--ambient-shadow) transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(8,43,74,.12)]"
    >
      <div className="relative h-[190px] overflow-hidden">
        <img
          src={getTourImage(tour)}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.onerror = null; e.target.src = placeholderImg; }}
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-[11px] py-[7px] text-[12px] font-black text-secondary">
          {tour?.province_name || t('tourPage.defaultProvince')}
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(6,26,51,.78)] px-[11px] py-[8px] text-[12px] font-black text-white">
          <Clock size={11} /> {tour?.duration_days || 1} {t('tourPage.days')}
        </span>
      </div>
      <div className="p-[17px]">
        <h3 className="mb-2 text-[17px] leading-[1.45] font-black text-foreground line-clamp-2">{name}</h3>
        <p className="mb-3 line-clamp-2 text-[13px] leading-[1.6] text-muted-foreground">
          {description || t('tourPage.noDescription')}
        </p>
        <div className="mb-[14px] grid grid-cols-2 gap-2">
          <div className="rounded-[13px] bg-muted p-2.25 text-[12px] text-muted-foreground">
            <b className="mb-0.5 block text-[13px] text-foreground">
              {tour?.duration_days || 1} {t('tourPage.days')}
            </b>
            {t('tourPage.duration')}
          </div>
          <div className="rounded-[13px] bg-muted p-2.25 text-[12px] text-muted-foreground">
            <b className="mb-0.5 block text-[13px] text-foreground">
              {tour?.max_guests ?? '-'} {t('tourPage.people')}
            </b>
            {t('tourPage.maxGuests')}
          </div>
          <div className="rounded-[13px] bg-muted p-2.25 text-[12px] text-muted-foreground">
            <b className="mb-0.5 block text-[13px] text-foreground truncate">
              {startLocation?.split(',')[0] || '-'}
            </b>
            {t('tourPage.startLocation')}
          </div>
          <div className="rounded-[13px] bg-muted p-2.25 text-[12px] text-muted-foreground">
            {rating > 0 ? (
              <>
                <b className="mb-0.5 flex items-center gap-1 text-[13px] text-foreground">
                  <Star size={10} className="fill-[#ff9f1c] text-[#ff9f1c]" /> {rating.toFixed(1)}/5
                </b>
                {t('tourPage.rating')}
              </>
            ) : (
              <>
                <b className="mb-0.5 block text-[13px] text-foreground">-</b>
                {t('tourPage.rating')}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <strong className="text-[20px] font-black text-[#ef7b00]">
              {price > 0 ? formatVND(price) : t('tourPage.contact')}
            </strong>
            {price > 0 && <span className="ml-1 text-[11px] text-muted-foreground">/ {t('tourPage.people')}</span>}
          </div>
          <Button variant="ghost"
            type="button"
            className="rounded-[14px] px-[13px] py-2.5 text-[13px] font-black text-white hover:text-white hover:opacity-90"
            style={{ background: PRIMARY_GRAD }}
          >
            {t('tourPage.viewDetail')}
          </Button>
        </div>
      </div>
    </article>
  );
}

function FilterSidebar({
  t,
  search,
  onSearch,
  featuredFilter,
  onFeatured,
  durationFilter,
  onDuration,
  priceRange,
  onPriceRangeChange,
  onApply,
  onReset,
  isFetching,
}) {
  return (
    <aside
      className="h-max rounded-[28px] border-border bg-card p-4.5 shadow-(--ambient-shadow) xl:sticky xl:top-[86px]"
    >
      <h3 className="mb-[14px] flex items-center gap-[9px] text-[16px] font-black text-foreground">
        <SlidersHorizontal size={16} className="text-secondary" />
        {t('tourPage.filterTitle')}
      </h3>

      <div className="mb-[13px]">
        <label className="mb-[7px] block text-[12px] font-black uppercase tracking-wide text-muted-foreground">
          {t('tourPage.filters.keyword')}
        </label>
        <Input
          placeholder={t('tourPage.searchPlaceholder')}
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full rounded-[15px] border-border bg-muted px-3 py-3 text-[14px] font-bold text-foreground outline-none"
        />
      </div>

      <div className="mb-[13px]">
        <label className="mb-[7px] block text-[12px] font-black uppercase tracking-wide text-muted-foreground">
          {t('tourPage.filters.featured')}
        </label>
        <Select value={featuredFilter} onValueChange={onFeatured}>
          <SelectTrigger className="w-full rounded-[15px] border-border bg-muted px-3 py-3 text-[14px] font-bold text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="featured">{t('tourPage.featured')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-[13px]">
        <label className="mb-[7px] block text-[12px] font-black uppercase tracking-wide text-muted-foreground">
          {t('tourPage.duration')}
        </label>
        <Select
          value={durationFilter || 'all'}
          onValueChange={(value) => onDuration(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-full rounded-[15px] border-border bg-muted px-3 py-3 text-[14px] font-bold text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="1">1 {t('tourPage.days')}</SelectItem>
            <SelectItem value="2">2 {t('tourPage.days')}</SelectItem>
            <SelectItem value="3">3 {t('tourPage.days')}</SelectItem>
            <SelectItem value="4">4 {t('tourPage.days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-[8px]">
        <label className="mb-[7px] block text-[12px] font-black uppercase tracking-wide text-muted-foreground">
          {t('tourPage.filters.priceRange')}
        </label>
        <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-muted-foreground">
          <span>{formatVND(priceRange[0])}</span>
          <span>{formatVND(priceRange[1])}</span>
        </div>
        <Slider
          min={PRICE_MIN_VALUE}
          max={PRICE_MAX_VALUE}
          step={PRICE_STEP}
          value={priceRange}
          onValueChange={(values) => {
            if (!Array.isArray(values) || values.length < 2) return;
            const nextMin = clampPrice(Math.min(values[0], values[1]));
            const nextMax = clampPrice(Math.max(values[0], values[1]));
            onPriceRangeChange([nextMin, nextMax]);
          }}
          className="mb-3"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            min="0"
            max={String(PRICE_MAX_VALUE)}
            step={String(PRICE_STEP)}
            value={priceRange[0]}
            onChange={e => {
              const nextMin = clampPrice(e.target.value);
              const nextMax = Math.max(nextMin, priceRange[1]);
              onPriceRangeChange([nextMin, nextMax]);
            }}
            placeholder={t('tourPage.filters.priceMin')}
            className="w-full rounded-[15px] border-border bg-muted px-3 py-3 text-[14px] font-bold text-foreground outline-none"
          />
          <Input
            type="number"
            min="0"
            max={String(PRICE_MAX_VALUE)}
            step={String(PRICE_STEP)}
            value={priceRange[1]}
            onChange={e => {
              const nextMax = clampPrice(e.target.value);
              const nextMin = Math.min(nextMax, priceRange[0]);
              onPriceRangeChange([nextMin, nextMax]);
            }}
            placeholder={t('tourPage.filters.priceMax')}
            className="w-full rounded-[15px] border-border bg-muted px-3 py-3 text-[14px] font-bold text-foreground outline-none"
          />
        </div>
      </div>

      <Button variant="ghost"
        type="button"
        onClick={onApply}
        className="mb-2 flex w-full items-center justify-center gap-2 rounded-full py-[12px] text-[14px] font-black text-white hover:text-white hover:opacity-90"
        style={{ background: PRIMARY_GRAD }}
      >
        <Search size={14} /> {t('tourPage.applyFilters')}
      </Button>
      <Button variant="ghost"
        type="button"
        onClick={onReset}
        className="flex w-full items-center justify-center gap-2 rounded-full border-border bg-muted py-2.5 text-[13px] font-black text-muted-foreground"
      >
        <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} /> {t('tourPage.refresh')}
      </Button>
    </aside>
  );
}

export default function TourPageContent() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'vi';
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search.trim(), uiConfig?.search?.tourPageDebounceMs ?? 350);
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('');
  const [priceRange, setPriceRange] = useState([PRICE_MIN_VALUE, PRICE_MAX_VALUE]);
  const [appliedFilters, setAppliedFilters] = useState({
    featured: 'all',
    duration_days: '',
    price_min: PRICE_MIN_VALUE,
    price_max: PRICE_MAX_VALUE,
  });
  const [sortBy, setSortBy] = useState('recommended');

  const featuredAsBoolean = useMemo(() => {
    if (appliedFilters.featured === 'featured') return true;
    return undefined;
  }, [appliedFilters.featured]);

  const sortParams = useMemo(() => {
    if (sortBy === 'price_asc') return { sortBy: 'price_from_vnd', sortOrder: 'ASC' };
    if (sortBy === 'price_desc') return { sortBy: 'price_from_vnd', sortOrder: 'DESC' };
    if (sortBy === 'rating_desc') return { sortBy: 'rating_avg', sortOrder: 'DESC' };
    if (sortBy === 'duration_asc') return { sortBy: 'duration_days', sortOrder: 'ASC' };
    if (sortBy === 'duration_desc') return { sortBy: 'duration_days', sortOrder: 'DESC' };
    return { sortBy: 'created_at', sortOrder: 'DESC' };
  }, [sortBy]);

  const { data, isLoading, isError, refetch, isFetching } = useGetAllTours({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    is_featured: featuredAsBoolean,
    duration_days: appliedFilters.duration_days || undefined,
    price_min: appliedFilters.price_min,
    price_max: appliedFilters.price_max,
    sortBy: sortParams.sortBy,
    sortOrder: sortParams.sortOrder,
  });

  const tours = useMemo(() => data?.tours || [], [data]);
  const pagination = data?.pagination || null;
  const total = pagination?.total ?? tours.length;
  const pages = pagination?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));

  const visibleTours = useMemo(() => {
    const list = [...tours];
    if (sortBy === 'recommended') {
      list.sort((a, b) => {
        const featuredDiff = Number(Boolean(b?.is_featured)) - Number(Boolean(a?.is_featured));
        if (featuredDiff !== 0) return featuredDiff;
        return Number(b?.rating_avg ?? 0) - Number(a?.rating_avg ?? 0);
      });
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => Number(a.price_from_vnd ?? 0) - Number(b.price_from_vnd ?? 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => Number(b.price_from_vnd ?? 0) - Number(a.price_from_vnd ?? 0));
    } else if (sortBy === 'rating_desc') {
      list.sort((a, b) => Number(b.rating_avg ?? 0) - Number(a.rating_avg ?? 0));
    } else if (sortBy === 'duration_asc') {
      list.sort((a, b) => Number(a.duration_days ?? 0) - Number(b.duration_days ?? 0));
    } else if (sortBy === 'duration_desc') {
      list.sort((a, b) => Number(b.duration_days ?? 0) - Number(a.duration_days ?? 0));
    }
    return list;
  }, [tours, sortBy]);

  const avgRating = useMemo(() => {
    if (!tours.length) return '4.7';
    const sum = tours.reduce((acc, t) => acc + Number(t.rating_avg ?? 0), 0);
    return (sum / tours.length).toFixed(1);
  }, [tours]);
  const durationRangeLabel = useMemo(() => {
    const durations = tours
      .map((tour) => Number(tour?.duration_days ?? 0))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (!durations.length) return `1-4 ${t('tourPage.days')}`;
    return `${Math.min(...durations)}-${Math.max(...durations)} ${t('tourPage.days')}`;
  }, [tours, t]);
  const guestRangeLabel = useMemo(() => {
    const guestValues = tours
      .map((tour) => Number(tour?.max_guests ?? 0))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (!guestValues.length) return `2-20 ${t('tourPage.people')}`;
    return `${Math.min(...guestValues)}-${Math.max(...guestValues)} ${t('tourPage.people')}`;
  }, [tours, t]);

  const handleApply = () => {
    setPage(1);
    setAppliedFilters({
      featured: featuredFilter,
      duration_days: durationFilter,
      price_min: priceRange[0],
      price_max: priceRange[1],
    });
  };
  const handleReset = () => {
    setSearch('');
    setFeaturedFilter('all');
    setDurationFilter('');
    setPriceRange([PRICE_MIN_VALUE, PRICE_MAX_VALUE]);
    setAppliedFilters({
      featured: 'all',
      duration_days: '',
      price_min: PRICE_MIN_VALUE,
      price_max: PRICE_MAX_VALUE,
    });
    setSortBy('recommended');
    setPage(1);
    refetch?.();
  };

  if (isLoading && page === 1) return <TourPageSkeleton />;

  return (
    <RootLayout>
      <div
        className="min-h-screen overflow-x-hidden"
        style={{ background: 'linear-gradient(180deg,#eaf7ff 0,#fff 42%,#f5fbff 100%)' }}
      >
        {/* Hero */}
        <section className="px-5 pt-6.5 pb-5 md:px-[5vw]">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_.95fr]">
            {/* Hero left */}
            <div
              className="relative flex min-h-65 flex-col justify-end overflow-hidden rounded-[32px] p-5 text-white shadow-(--ambient-shadow) md:min-h-90 md:p-8.5"
              style={{ background: HERO_LEFT_BG }}
            >
              <span className="mb-[18px] inline-flex w-max items-center gap-2 rounded-full border border-white/30 bg-white/20 px-[13px] py-[9px] text-[13px] font-black">
                {t('tourPage.hero.badge')}
              </span>
              <h1
                className="mb-[14px] font-black leading-[1.12] tracking-[-1.2px]"
                style={{ fontSize: 'clamp(28px,3.5vw,50px)' }}
              >
                {t('tourPage.hero.title')}
              </h1>
              <p className="max-w-[700px] leading-[1.72]" style={{ color: '#eafaff' }}>
                {t('tourPage.hero.description')}
              </p>
            </div>

            {/* Hero right – summary cards */}
            <div className="grid grid-cols-2 gap-[14px]">
              {[
                {
                  icon: <span className="text-xl font-black">✓</span>,
                  value: total > 0 ? `${total}+` : '36+',
                  label: t('tourPage.stats.total'),
                  grad: PRIMARY_GRAD,
                },
                {
                  icon: <Clock size={20} />,
                  value: durationRangeLabel,
                  label: t('tourPage.stats.durationRange'),
                  grad: PRIMARY_GRAD,
                },
                {
                  icon: <Users size={20} />,
                  value: guestRangeLabel,
                  label: t('tourPage.stats.groupFriendly'),
                  grad: PRIMARY_GRAD,
                },
                {
                  icon: <Star size={20} />,
                  value: `${avgRating}/5`,
                  label: t('tourPage.stats.avgRating'),
                  grad: PRIMARY_GRAD,
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="rounded-[24px] border-border bg-card p-5 shadow-(--ambient-shadow)"
                >
                  <div
                    className="mb-[14px] flex h-11 w-11 items-center justify-center rounded-[16px] text-white"
                    style={{ background: item.grad }}
                  >
                    {item.icon}
                  </div>
                  <strong className="block text-[22px] font-black text-foreground md:text-[28px]">{item.value}</strong>
                  <span className="text-[13px] font-bold text-muted-foreground">{item.label}</span>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* Layout: filter sidebar + main */}
        <section className="px-5 pt-3 pb-10.5 md:px-[5vw]">
          <div className="grid grid-cols-1 gap-[22px] xl:grid-cols-[305px_1fr]">
            <FilterSidebar
              t={t}
              search={search}
              onSearch={v => { setSearch(v); setPage(1); }}
              featuredFilter={featuredFilter}
              onFeatured={setFeaturedFilter}
              durationFilter={durationFilter}
              onDuration={setDurationFilter}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onApply={handleApply}
              onReset={handleReset}
              isFetching={isFetching}
            />

            <main className="flex flex-col gap-[18px]">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-[14px] rounded-[24px] border-border bg-card px-4 py-[14px] shadow-(--ambient-shadow)">
                <div>
                  <h2 className="text-[23px] font-black text-foreground">{t('tourPage.title')}</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {t('tourPage.toolbar.count', { total: visibleTours.length })}
                  </p>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[13px] font-black text-muted-foreground">{t('tourPage.filters.sort')}</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-full border-border bg-card px-[14px] py-2.5 text-[14px] font-black text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">{t('tourPage.sort_options.recommended')}</SelectItem>
                      <SelectItem value="price_asc">{t('tourPage.sort_options.price_asc')}</SelectItem>
                      <SelectItem value="price_desc">{t('tourPage.sort_options.price_desc')}</SelectItem>
                      <SelectItem value="rating_desc">{t('tourPage.sort_options.rating_best')}</SelectItem>
                      <SelectItem value="duration_asc">{t('tourPage.sort_options.duration_asc')}</SelectItem>
                      <SelectItem value="duration_desc">{t('tourPage.sort_options.duration_desc')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tour grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse overflow-hidden rounded-[28px] border-border bg-card">
                      <div className="h-[190px] bg-muted" />
                      <div className="space-y-2 p-4">
                        <div className="h-5 w-3/4 rounded bg-muted" />
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-2/3 rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="rounded-[24px] border-border bg-card py-16 text-center text-[13px] text-muted-foreground">
                  {t('tourPage.states.error')}
                </div>
              ) : visibleTours.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[24px] border-border bg-card py-20">
                  <Inbox size={40} className="mb-3 text-muted-foreground opacity-30" />
                  <p className="text-[15px] font-black text-foreground">{t('tourPage.states.empty_title')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
                  {visibleTours.map(tour => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      t={t}
                      lang={lang}
                      onOpen={() => navigate(`/tour/${tour.slug}`)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-between">
                  <Button variant="ghost"
                    type="button"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex h-9 items-center gap-1.5 rounded-[10px] border-border bg-card px-4 text-[14px] font-black text-foreground hover:bg-muted disabled:opacity-40"
                  >
                    <ChevronLeft size={15} /> {t('tourPage.previous')}
                  </Button>
                  <span className="rounded-full border-border bg-card px-4 py-1.5 text-[14px] font-black text-foreground">
                    {page} / {pages}
                  </span>
                  <Button variant="ghost"
                    type="button"
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page >= pages}
                    className="flex h-9 items-center gap-1.5 rounded-[10px] border-border bg-card px-4 text-[14px] font-black text-foreground hover:bg-muted disabled:opacity-40"
                  >
                    {t('tourPage.next')} <ChevronRight size={15} />
                  </Button>
                </div>
              )}
            </main>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}


