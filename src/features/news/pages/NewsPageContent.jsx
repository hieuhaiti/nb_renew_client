import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Inbox, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import { useGetNewsList } from '@/services/api/news/newsService';
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

/* Missing data fields (not available in current API):
 *  - item.views      — view count shown in some designs
 *  - item.reading_time — estimated reading time
 */

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };
const HERO_BG = `linear-gradient(135deg,rgba(3,95,172,.90),rgba(37,99,235,.85),rgba(14,165,233,.75)), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80") center/cover`;

function formatDate(value, locale) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(locale || 'vi-VN', { dateStyle: 'medium' }).format(d);
}

function tagLabel(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function NewsCard({ item, navigate, locale, t }) {
  const slug = item?.slug || item?.id || '';
  const title = item?.title || '—';
  const summary = item?.summary || '';
  const imageSrc = withBaseUrl(item?.thumbnail_url || '') || placeholderImg;
  const author = item?.author_name || t('newsPage.list.unknown_author');
  const date = formatDate(item?.published_at || item?.created_at, locale);
  const tags = Array.isArray(item?.tags) ? item.tags.slice(0, 3) : [];

  return (
    <article
      onClick={() => slug && navigate(`/news/${encodeURIComponent(String(slug))}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[18px] border-border bg-card shadow-[0_4px_16px_rgba(13,74,130,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(13,74,130,0.15)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        {item?.is_featured && (
          <span className="absolute top-3 left-3 rounded-full border border-[#fde68a] bg-[#fef3c7]/95 px-2.5 py-0.5 text-xs font-bold text-[#b45309] backdrop-blur-sm">
            {t('newsPage.list.featured')}
          </span>
        )}
        {date && (
          <span className="absolute right-3 bottom-3 rounded-full bg-black/45 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {date}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-muted-foreground text-xs">{author}</p>

        <h3
          className="text-foreground mt-1.5 line-clamp-2 text-sm leading-snug font-black transition-colors group-hover:text-primary"
          title={title}
        >
          {title}
        </h3>

        <p className="text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed">
          {summary || t('newsPage.list.no_summary')}
        </p>

        {tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tagLabel(tag)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-end pt-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
            {t('newsPage.actions.read_more')} <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
}

function NewsCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border-border bg-card">
      <div className="bg-muted h-48 w-full" />
      <div className="space-y-2 p-4">
        <div className="bg-muted h-3 w-1/3 rounded" />
        <div className="bg-muted h-4 w-full rounded" />
        <div className="bg-muted h-3 w-5/6 rounded" />
        <div className="bg-muted h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export default function NewsPageContent() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromLanguage(i18n.language);

  const [search, setSearch] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search.trim(), 400);

  const isFeaturedParam =
    featuredFilter === 'featured' ? true : featuredFilter === 'normal' ? false : undefined;

  const { data, isLoading, isError, isFetching, refetch } = useGetNewsList({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    is_published: true,
    is_featured: isFeaturedParam,
    tag: tagFilter || undefined,
  });

  const items = useMemo(() => {
    const raw = data?.data?.items || data?.data?.news || data?.items || data?.news || [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const pagination = data?.data?.pagination || data?.pagination || {};
  const total = Number(pagination?.total || items.length || 0);
  const totalPages = Math.max(1, Number(pagination?.totalPages || pagination?.pages || 1));
  const currentPage = Math.max(1, Number(pagination?.page || page));

  const availableTags = useMemo(() => {
    const all = items.flatMap((item) => (Array.isArray(item?.tags) ? item.tags : []));
    return [...new Set(all)].slice(0, 12);
  }, [items]);

  const featuredCount = useMemo(
    () => items.filter((item) => Boolean(item?.is_featured)).length,
    [items]
  );

  const handleReset = () => {
    setSearch('');
    setFeaturedFilter('all');
    setTagFilter('');
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
                {t('newsPage.hero.badge')}
              </span>
              <h1 className="mt-2 text-2xl leading-tight font-black tracking-tight md:text-3xl xl:text-4xl">
                {t('newsPage.hero.title')}
              </h1>
              <p className="mt-2 text-sm leading-relaxed font-medium text-white/90">
                {t('newsPage.hero.description')}
              </p>
            </div>

            <div className="mb-6 flex flex-row items-stretch gap-4 max-[1023px]:flex-col">
              {/* Stats */}
              <div className="flex flex-wrap items-stretch gap-3 self-stretch">
                {[
                  { value: total, label: t('newsPage.stats.total') },
                  { value: featuredCount, label: t('newsPage.stats.featured') },
                  { value: `${currentPage}/${totalPages}`, label: t('newsPage.stats.page') },
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
                    placeholder={t('newsPage.filters.placeholder')}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="text-foreground h-11 w-full rounded-xl border-input bg-card pr-3 pl-9 text-sm outline-none focus:border-primary"
                  />
                </div>
                <Select
                  value={featuredFilter}
                  onValueChange={(value) => {
                    setFeaturedFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="text-foreground h-11 shrink-0 rounded-xl border-input bg-card px-3 text-sm focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('newsPage.filters.options.all')}</SelectItem>
                    <SelectItem value="featured">
                      {t('newsPage.filters.options.featured')}
                    </SelectItem>
                    <SelectItem value="normal">{t('newsPage.filters.options.normal')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setPage(1);
                    refetch?.();
                  }}
                  className="h-11 shrink-0 rounded-xl px-5 text-sm font-bold text-white"
                  style={BTN_GRADIENT}
                >
                  {t('newsPage.filters.keyword')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
          {/* Tag chips + toolbar */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setTagFilter('');
                  setPage(1);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  !tagFilter
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground border-border bg-card hover:bg-muted'
                }`}
              >
                {t('common.all')}
              </Button>
              {availableTags.map((tag) => (
                <Button
                  variant="ghost"
                  key={tag}
                  type="button"
                  onClick={() => {
                    setTagFilter(tagFilter === tag ? '' : tag);
                    setPage(1);
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    tagFilter === tag
                      ? 'bg-primary text-primary-foreground'
                      : 'border-border bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tagLabel(tag)}
                </Button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">{total}</strong>{' '}
                {t('newsPage.list.title').toLowerCase()}
              </p>
              <Button
                variant="ghost"
                type="button"
                onClick={handleReset}
                className="text-muted-foreground flex h-8 items-center gap-1.5 rounded-[8px] border-border bg-card px-3 text-xs font-semibold hover:bg-muted"
              >
                <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
                {t('newsPage.actions.refresh')}
              </Button>
            </div>
          </div>

          {/* News grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-muted-foreground rounded-[18px] border-border bg-card py-20 text-center">
              {t('newsPage.states.error')}
            </div>
          ) : items.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-[18px] border-border bg-card py-20">
              <Inbox size={40} className="mb-3 opacity-30" />
              <p className="text-foreground text-sm font-semibold 2xl:text-base">
                {t('newsPage.states.empty')}
              </p>
              <p className="mt-1 text-sm">{t('newsPage.actions.reset')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <NewsCard key={item?.id} item={item} navigate={navigate} locale={locale} t={t} />
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
                disabled={currentPage <= 1}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border-border bg-card px-4 text-sm font-semibold hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft size={15} /> {t('common.prev')}
              </Button>
              <span className="rounded-full border-border bg-card px-4 py-1.5 text-sm font-semibold">
                {t('newsPage.pagination.page', { page: currentPage, totalPages })}
              </span>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border-border bg-card px-4 text-sm font-semibold hover:bg-muted disabled:opacity-40"
              >
                {t('common.next')} <ChevronRight size={15} />
              </Button>
            </div>
          )}

          {/* Bottom CTA */}
          <div
            className="mt-10 overflow-hidden rounded-[22px] px-7 py-7 text-white"
            style={{ background: HERO_BG }}
          >
            <p className="mb-1 text-xs font-semibold text-white/75">{t('newsPage.cta.label')}</p>
            <h3 className="text-lg leading-tight font-black md:text-xl xl:text-2xl">
              {t('newsPage.cta.title')}
            </h3>
            <p className="mt-1.5 text-sm text-white/85">{t('newsPage.cta.desc')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { path: '/map', label: t('common.map') },
                { path: '/tour', label: t('common.tourist_route') },
                { path: '/tourism-point', label: t('common.tourism_points') },
                { path: '/festival', label: t('common.festival') },
              ].map((item) => (
                <Button
                  variant="ghost"
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="h-9 rounded-[10px] border border-white/35 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
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
