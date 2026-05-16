import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  MapPin,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import { useGetOcopProducts } from '@/services/api/ocop/ocopService';
import { formatVND, withBaseUrl } from '@/lib/utils';
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
const HERO_BG = `linear-gradient(135deg,rgba(5,150,105,.92),rgba(3,95,172,.88),rgba(14,165,233,.78)), url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80") center/cover`;

const CATEGORY_COLORS = {
  thuoc_và_cskh: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  thu_cong_my_nghe: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  thuc_pham: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  do_uong: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  my_pham: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  nong_san: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  duoc_lieu: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  vai_va_may_mac: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  trang_tri: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  qua_tang: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

const DEFAULT_CAT_COLOR = {
  bg: 'bg-muted',
  text: 'text-primary',
  border: 'border-border',
};

function getCategoryColor(key) {
  return CATEGORY_COLORS[key] || DEFAULT_CAT_COLOR;
}

function getProductName(p) {
  return p?.name_vi || p?.name_en || p?.name || '—';
}

function getProductStars(p) {
  return Math.min(5, Math.max(0, Number(p?.star_rating ?? 0)));
}

function OcopCard({ item, navigate, t }) {
  const name = getProductName(item);
  const stars = getProductStars(item);
  const imageSrc = withBaseUrl(item?.cover_image_url || '') || placeholderImg;
  const price = Number(item?.price_vnd);
  const priceLabel = Number.isFinite(price) && price > 0 ? formatVND(price) : null;
  const catConf = getCategoryColor(item?.category);
  const catLabel = item?.category
    ? t(`ocopPage.categories.${item.category}`, { defaultValue: item.category.replace(/_/g, ' ') })
    : '—';

  return (
    <article
      onClick={() => item?.id && navigate(`/ocop/${item.id}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[18px] border-border bg-card shadow-[0_4px_16px_rgba(13,74,130,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(13,74,130,0.15)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        {stars > 0 && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full border border-[#fde68a] bg-[#fef3c7]/95 px-2.5 py-0.5 text-xs font-bold text-[#b45309] backdrop-blur-sm">
            <Star size={10} className="fill-[#d99200] text-[#d99200]" />
            {stars} {t('ocopPage.card.stars')}
          </span>
        )}
        <span
          className={`absolute top-3 right-3 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${catConf.bg} ${catConf.text} ${catConf.border}`}
        >
          {catLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className="text-foreground line-clamp-2 text-sm leading-snug font-black transition-colors group-hover:text-primary"
          title={name}
        >
          {name}
        </h3>

        {item?.producer_name && (
          <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{item.producer_name}</p>
        )}

        {(item?.location_name || item?.province_name) && (
          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <MapPin size={10} className="shrink-0" />
            <span className="line-clamp-1">{item?.location_name || item?.province_name}</span>
          </div>
        )}

        <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
          {item?.description || t('ocopPage.card.no_description')}
        </p>

        {item?.certification_no && (
          <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
            <ShieldCheck size={11} className="shrink-0 text-secondary" />
            <span className="truncate">{item.certification_no}</span>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            {priceLabel ? (
              <>
                <div className="text-sm font-black text-primary 2xl:text-base">{priceLabel}</div>
                {item?.unit && (
                  <div className="text-muted-foreground text-[10px]">/ {item.unit}</div>
                )}
              </>
            ) : (
              <div className="text-sm font-semibold text-secondary">
                {t('ocopPage.card.view_detail')}
              </div>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
            {t('ocopPage.card.view_detail')} <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
}

function OcopCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border-border bg-card">
      <div className="bg-muted h-48 w-full" />
      <div className="space-y-2 p-4">
        <div className="bg-muted h-4 w-3/4 rounded" />
        <div className="bg-muted h-3 w-1/2 rounded" />
        <div className="bg-muted h-3 w-full rounded" />
        <div className="bg-muted h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export default function OcopPageContent() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [starFilter, setStarFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search.trim(), 400);

  const { data, isLoading, isError, isFetching, refetch } = useGetOcopProducts({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    star_rating: starFilter !== 'all' ? starFilter : undefined,
  });

  const products = useMemo(() => data?.data?.items || data?.items || [], [data]);
  const pagination = useMemo(() => data?.data?.pagination || data?.pagination || null, [data]);
  const total = pagination?.total ?? products.length;
  const totalPages = pagination?.totalPages ?? 1;

  const availableCategories = useMemo(
    () => [...new Set(products.map((p) => p?.category).filter(Boolean))],
    [products]
  );

  const averageStars = useMemo(() => {
    const vals = products.map(getProductStars).filter(Boolean);
    if (!vals.length) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }, [products]);

  const handleReset = () => {
    setSearch('');
    setCategoryFilter('all');
    setStarFilter('all');
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
                {t('ocopPage.hero.badge')}
              </span>
              <h1 className="mt-2 text-2xl leading-tight font-black tracking-tight md:text-3xl xl:text-4xl">
                {t('ocopPage.hero.title')}
              </h1>
              <p className="mt-2 text-sm leading-relaxed font-medium text-white/90">
                {t('ocopPage.hero.description')}
              </p>
            </div>

            <div className="mb-6 flex flex-row items-stretch gap-4 max-[1023px]:flex-col">
              {/* Stats */}
              <div className="flex flex-wrap items-stretch gap-3 self-stretch">
                {[
                  { value: total, label: t('ocopPage.stats.total') },
                  {
                    value: availableCategories.length || '—',
                    label: t('ocopPage.filters.all_categories'),
                  },
                  {
                    value: averageStars ? `${averageStars} ★` : '—',
                    label: t('ocopPage.stats.certified'),
                  },
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
                    placeholder={t('ocopPage.filters.search_placeholder')}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="text-foreground h-11 w-full rounded-xl border-input bg-card pr-3 pl-9 text-sm outline-none focus:border-primary"
                  />
                </div>
                <Select
                  value={starFilter}
                  onValueChange={(value) => {
                    setStarFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="text-foreground h-11 shrink-0 rounded-xl border-input bg-card px-3 text-sm focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('ocopPage.filters.all_stars')}</SelectItem>
                    <SelectItem value="5">{t('ocopPage.stars.5')}</SelectItem>
                    <SelectItem value="4">{t('ocopPage.stars.4')}</SelectItem>
                    <SelectItem value="3">{t('ocopPage.stars.3')}</SelectItem>
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
                  {t('ocopPage.filters.search_btn')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
          {/* Category chips + toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setCategoryFilter('all');
                  setPage(1);
                }}
                className={`h-auto rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  categoryFilter === 'all'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    : 'text-muted-foreground border-border bg-card hover:bg-muted'
                }`}
              >
                {t('common.all')}
              </Button>
              {availableCategories.map((key) => {
                const conf = getCategoryColor(key);
                const label = t(`ocopPage.categories.${key}`, {
                  defaultValue: key.replace(/_/g, ' '),
                });
                return (
                  <Button
                    variant="ghost"
                    key={key}
                    type="button"
                    onClick={() => {
                      setCategoryFilter(key);
                      setPage(1);
                    }}
                    className={`h-auto rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      categoryFilter === key
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                        : `border ${conf.border} ${conf.bg} ${conf.text} hover:opacity-80`
                    }`}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">{total}</strong>{' '}
                {t('ocopPage.stats.total').toLowerCase()}
              </p>
              <Button
                variant="ghost"
                type="button"
                onClick={handleReset}
                className="text-muted-foreground flex h-8 items-center gap-1.5 rounded-[8px] border-border bg-card px-3 text-xs font-semibold hover:bg-muted"
              >
                <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
                {t('ocopPage.toolbar.refresh')}
              </Button>
            </div>
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <OcopCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-muted-foreground rounded-[18px] border-border bg-card py-20 text-center">
              {t('ocopPage.states.error')}
            </div>
          ) : products.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-[18px] border-border bg-card py-20">
              <Inbox size={40} className="mb-3 opacity-30" />
              <p className="text-foreground text-sm font-semibold 2xl:text-base">
                {t('ocopPage.states.empty_title')}
              </p>
              <p className="mt-1 text-sm">{t('ocopPage.states.empty_desc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((item) => (
                <OcopCard key={item?.id} item={item} navigate={navigate} t={t} />
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
                <ChevronLeft size={15} /> {t('ocopPage.pagination.prev')}
              </Button>
              <span className="rounded-full border-border bg-card px-4 py-1.5 text-sm font-semibold">
                {t('ocopPage.pagination.page', { current: page, total: totalPages })}
              </span>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border-border bg-card px-4 text-sm font-semibold hover:bg-muted disabled:opacity-40"
              >
                {t('ocopPage.pagination.next')} <ChevronRight size={15} />
              </Button>
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className="mt-10 overflow-hidden rounded-[22px] px-7 py-7 text-white"
            style={{ background: HERO_BG }}
          >
            <p className="mb-1 text-xs font-semibold text-white/75">
              {t('home.vouchers_section.label')}
            </p>
            <h3 className="text-lg leading-tight font-black md:text-xl xl:text-2xl">
              {t('home.vouchers_section.title')}
            </h3>
            <p className="mt-1.5 text-sm text-white/85">{t('home.vouchers_section.desc')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { key: 'mapPage.toolbar.searchButton', path: '/map', label: t('common.map') },
                { key: 'tourPage.hero.title', path: '/tour', label: t('common.tourist_route') },
                {
                  key: 'tourismPointPage.title',
                  path: '/tourism-point',
                  label: t('common.tourism_points'),
                },
              ].map((item) => (
                <Button
                  variant="ghost"
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="h-9 rounded-[10px] border border-white/35 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 hover:text-white"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
