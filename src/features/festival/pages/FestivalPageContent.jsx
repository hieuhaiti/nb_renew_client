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
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import { useFestivalsQuery, useFestivalTypesQuery } from '@/services/api/map/festivalService';
import { withBaseUrl, getLocaleFromLanguage } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };
const HERO_BG = `linear-gradient(135deg,rgba(3,95,172,.90),rgba(14,165,233,.85),rgba(126,34,206,.72)), url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80") center/cover`;

const TYPE_STYLES = {
  religious: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  traditional: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  cultural: { bg: 'bg-muted', text: 'text-primary', border: 'border-border' },
  folk: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  modern: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  seasonal: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  historical: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  music: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  food: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  craft: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },
  sport: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
};

const DEFAULT_TYPE_STYLE = {
  bg: 'bg-muted',
  text: 'text-muted-foreground',
  border: 'border-border',
};

function getTypeStyle(type) {
  return TYPE_STYLES[type] || DEFAULT_TYPE_STYLE;
}

function getFestivalName(f) {
  return f?.name_vi || f?.name_en || f?.name || '—';
}

function getFestivalDescription(f) {
  return f?.description_vi || f?.description_en || f?.description || '';
}

function formatDateRange(start, end, locale) {
  if (!start) return '';
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const fmt = (d, opts) => d.toLocaleDateString(locale, opts);

  if (!e || s.toDateString() === e.toDateString()) {
    return fmt(s, { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} – ${fmt(e, { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  }
  return `${fmt(s, { day: '2-digit', month: '2-digit' })} – ${fmt(e, { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
}

function FestivalCard({ festival, navigate, locale, t }) {
  const name = getFestivalName(festival);
  const description = getFestivalDescription(festival);
  const imageSrc = withBaseUrl(festival?.cover_image_url || '') || placeholderImg;
  const typeStyle = getTypeStyle(festival?.festival_type);
  const typeLabel = festival?.festival_type
    ? t(`festivalPage.types.${festival.festival_type}`, { defaultValue: festival.festival_type })
    : '—';
  const dateRange = formatDateRange(festival?.start_date, festival?.end_date, locale);
  const location = festival?.location_name || festival?.spot_name || '';

  const daysUntil = useMemo(() => {
    if (!festival?.start_date) return null;
    const days = Math.ceil((new Date(festival.start_date) - new Date()) / 86400000);
    if (days < 0) return null;
    if (days === 0) return t('festivalPage.card.today');
    if (days <= 60) return t('festivalPage.card.days_until', { days });
    return null;
  }, [festival?.start_date, t]);

  return (
    <article
      onClick={() => festival?.id && navigate(`/festival/${festival.id}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[18px] border-border bg-card shadow-[0_4px_16px_rgba(13,74,130,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(13,74,130,0.15)]"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <span
          className={`absolute top-3 left-3 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
        >
          {typeLabel}
        </span>

        {festival?.is_recurring && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Repeat2 size={11} />
            {t('festivalPage.card.recurring')}
          </span>
        )}

        {daysUntil && (
          <span className="absolute right-3 bottom-3 rounded-full bg-tertiary/90 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            {daysUntil}
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <CalendarDays size={13} className="text-white/80" />
          <span className="text-xs font-semibold text-white drop-shadow">{dateRange}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className="text-foreground line-clamp-2 text-sm leading-snug font-black transition-colors group-hover:text-primary"
          title={name}
        >
          {name}
        </h3>

        {location && (
          <div className="text-muted-foreground mt-1.5 flex items-center gap-1 text-xs">
            <MapPin size={11} className="shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
          {description || t('festivalPage.card.no_description')}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between">
            {festival?.spot_name && (
              <span className="text-muted-foreground line-clamp-1 max-w-[60%] text-xs">
                {festival.spot_name}
              </span>
            )}
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
              {t('festivalPage.card.view_detail')} <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function FestivalCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border-border bg-card">
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
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromLanguage(i18n.language);

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

  const pagination = useMemo(() => data?.data?.pagination || data?.pagination || null, [data]);
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
        .map((item) =>
          String(
            item?.code || item?.type || item?.slug || item?.value || item?.key || item?.id || ''
          ).trim()
        )
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
                {t('festivalPage.hero.badge')}
              </span>
              <h1 className="mt-2 text-2xl leading-tight font-black tracking-tight md:text-3xl xl:text-4xl">
                {t('festivalPage.hero.title')}
              </h1>
              <p className="mt-2 text-sm leading-relaxed font-medium text-white/90">
                {t('festivalPage.hero.description')}
              </p>
            </div>

            <div className="mb-6 flex flex-row items-stretch gap-4 max-[1023px]:flex-col">
              {/* Stats */}
              <div className="flex flex-wrap items-stretch gap-3 self-stretch">
                {[
                  { value: total, label: t('festivalPage.stats.total') },
                  { value: upcomingCount, label: t('festivalPage.stats.upcoming') },
                  { value: allTypeKeys.length || '—', label: t('festivalPage.stats.page') },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex min-h-19 flex-col justify-center rounded-2xl border border-white/25 bg-white/15 px-5 py-2.5 text-center backdrop-blur-sm"
                  >
                    <div className="text-lg leading-none font-black md:text-xl xl:text-2xl">
                      {s.value}
                    </div>
                    <div className="mt-0.5 text-xs text-white/80">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Search bar */}
              <div className="flex flex-1 flex-col gap-3 rounded-3xl border border-white/75 bg-card/95 p-4 shadow-[0_12px_28px_rgba(0,0,0,.14)] sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={16}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="text"
                    placeholder={t('festivalPage.filters.search_placeholder')}
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setPage(1);
                    }}
                    className="text-foreground h-11 w-full rounded-xl border-input bg-card pr-3 pl-9 text-sm outline-none focus:border-primary"
                  />
                </div>
                <Select
                  value={upcomingFilter}
                  onValueChange={(value) => {
                    setUpcomingFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="text-foreground h-11 shrink-0 rounded-xl border-input bg-card px-3 text-sm focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">{t('festivalPage.filters.upcoming')}</SelectItem>
                    <SelectItem value="past">{t('festivalPage.filters.past')}</SelectItem>
                    <SelectItem value="all">{t('festivalPage.filters.all_time')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setPage(1);
                    refetch?.();
                  }}
                  className="h-11 shrink-0 rounded-xl px-5 text-sm font-bold text-white hover:text-white"
                  style={BTN_GRADIENT}
                >
                  {t('festivalPage.filters.search_btn')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
          {/* Type chips + toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setTypeFilter('all');
                  setPage(1);
                }}
                className={`h-auto rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  typeFilter === 'all'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    : 'text-muted-foreground border-border bg-card hover:bg-muted'
                }`}
              >
                {t('common.all')}
              </Button>
              {allTypeKeys.map((key) => {
                const style = getTypeStyle(key);
                return (
                  <Button
                    variant="ghost"
                    key={key}
                    type="button"
                    onClick={() => {
                      setTypeFilter(key);
                      setPage(1);
                    }}
                    className={`h-auto rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      typeFilter === key
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                        : `border ${style.border} ${style.bg} ${style.text} hover:opacity-80`
                    }`}
                  >
                    {t(`festivalPage.types.${key}`, { defaultValue: key })}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">{total}</strong>{' '}
                {t('festivalPage.stats.total').toLowerCase()}
              </p>
              <Button
                variant="ghost"
                type="button"
                onClick={handleReset}
                className="text-muted-foreground flex h-8 items-center gap-1.5 rounded-[8px] border-border bg-card px-3 text-xs font-semibold hover:bg-muted"
              >
                <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
                {t('festivalPage.toolbar.refresh')}
              </Button>
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
            <div className="text-muted-foreground rounded-[18px] border-border bg-card py-20 text-center">
              {t('festivalPage.states.error')}
            </div>
          ) : festivals.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-[18px] border-border bg-card py-20">
              <Inbox size={40} className="mb-3 opacity-30" />
              <p className="text-foreground text-sm font-semibold 2xl:text-base">
                {t('festivalPage.states.empty_title')}
              </p>
              <p className="mt-1 text-sm">{t('festivalPage.states.empty_desc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {festivals.map((festival) => (
                <FestivalCard
                  key={festival?.id}
                  festival={festival}
                  navigate={navigate}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border-border bg-card px-4 text-sm font-semibold hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft size={15} /> {t('festivalPage.pagination.prev')}
              </Button>
              <span className="rounded-full border-border bg-card px-4 py-1.5 text-sm font-semibold">
                {t('festivalPage.pagination.page', { current: page, total: totalPages })}
              </span>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border-border bg-card px-4 text-sm font-semibold hover:bg-muted disabled:opacity-40"
              >
                {t('festivalPage.pagination.next')} <ChevronRight size={15} />
              </Button>
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className="mt-10 overflow-hidden rounded-[22px] px-7 py-7 text-white"
            style={{ background: HERO_BG }}
          >
            <p className="mb-1 text-xs font-semibold text-white/75">
              {t('festivalPage.cta_section.badge')}
            </p>
            <h3 className="text-lg leading-tight font-black md:text-xl xl:text-2xl">
              {t('festivalPage.cta_section.title')}
            </h3>
            <p className="mt-1.5 text-sm text-white/85">
              {t('festivalPage.cta_section.description')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { key: 'festivalPage.cta_section.cta_map', path: '/map' },
                { key: 'festivalPage.cta_section.cta_points', path: '/tourism-point' },
              ].map((item) => (
                <Button
                  variant="ghost"
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="h-9 rounded-[10px] border border-white/35 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 hover:text-white"
                >
                  {t(item.key)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
