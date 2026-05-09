import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Inbox, ChevronLeft, ChevronRight, ArrowRight, Tag } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import { useGetNewsList } from '@/services/api/news/newsService';
import { withBaseUrl, getLocaleFromLanguage } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

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

function NewsCard({ item, navigate, locale }) {
  const slug = item?.slug || item?.id || '';
  const title = item?.title || '—';
  const summary = item?.summary || '';
  const imageSrc = withBaseUrl(item?.thumbnail_url || '') || placeholderImg;
  const author = item?.author_name || 'Ban biên tập';
  const date = formatDate(item?.published_at || item?.created_at, locale);
  const tags = Array.isArray(item?.tags) ? item.tags.slice(0, 3) : [];

  return (
    <article
      onClick={() => slug && navigate(`/news/${encodeURIComponent(String(slug))}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white shadow-[0_4px_16px_rgba(13,74,130,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(13,74,130,0.15)]"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
        />
        {item?.is_featured && (
          <span className="absolute top-3 left-3 rounded-full border border-[#fde68a] bg-[#fef3c7]/95 px-2.5 py-0.5 text-xs font-bold text-[#b45309] backdrop-blur-sm">
            Nổi bật
          </span>
        )}
        {date && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {date}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted-foreground">{author}</p>

        <h3
          className="mt-1.5 line-clamp-2 text-sm font-black leading-snug text-foreground transition-colors group-hover:text-[#0b66c3]"
          title={title}
        >
          {title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {summary || 'Chưa có tóm tắt.'}
        </p>

        {tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#cfe0f4] bg-[#f8fbff] px-2 py-0.5 text-[10px] font-medium text-[#52647a]"
              >
                {tagLabel(tag)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-end pt-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-[#0b66c3] group-hover:underline">
            Đọc tiếp <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
}

function NewsCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border border-[#cfe0f4] bg-white">
      <div className="bg-muted h-52 w-full" />
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
  const { i18n } = useTranslation();
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
    limit: 9,
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

  /* Extract unique tags from loaded items for chips */
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
                Tin tức & Khám phá Ninh Bình
              </span>
              <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight">
                Tin tức du lịch
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/90">
                Cập nhật tin tức, bài viết và câu chuyện về du lịch, văn hoá và con người Ninh Bình.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 flex flex-wrap gap-3">
              {[
                { value: total, label: 'Bài viết' },
                { value: featuredCount, label: 'Nổi bật' },
                { value: `${currentPage}/${totalPages}`, label: 'Trang' },
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
                  placeholder="Tìm kiếm bài viết, địa danh, chủ đề..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="h-11 w-full rounded-xl border border-[#a8bed4] bg-white pl-9 pr-3 text-sm text-foreground outline-none focus:border-[#0b66c3]"
                />
              </div>
              <select
                value={featuredFilter}
                onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
                className="h-11 shrink-0 rounded-xl border border-[#a8bed4] bg-white px-3 text-sm text-foreground outline-none focus:border-[#0b66c3]"
              >
                <option value="all">Tất cả bài viết</option>
                <option value="featured">Nổi bật</option>
                <option value="normal">Thường</option>
              </select>
              <button
                type="button"
                onClick={() => { setPage(1); refetch?.(); }}
                className="h-11 shrink-0 rounded-xl px-5 text-sm font-bold text-white"
                style={BTN_GRADIENT}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">

          {/* Tag chips + toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag size={13} className="shrink-0 text-muted-foreground" />
              <button
                type="button"
                onClick={() => { setTagFilter(''); setPage(1); }}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  !tagFilter
                    ? 'bg-[#0b66c3] text-white'
                    : 'border border-[#cfe0f4] bg-white text-muted-foreground hover:bg-[#eef7ff]'
                }`}
              >
                Tất cả
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setTagFilter(tagFilter === tag ? '' : tag); setPage(1); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    tagFilter === tag
                      ? 'bg-[#0b66c3] text-white'
                      : 'border border-[#cfe0f4] bg-[#f8fbff] text-[#52647a] hover:bg-[#eef7ff]'
                  }`}
                >
                  {tagLabel(tag)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{total}</strong> bài viết
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

          {/* News grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => <NewsCardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <div className="rounded-[18px] border border-[#cfe0f4] bg-white py-20 text-center text-muted-foreground">
              Không thể tải danh sách bài viết lúc này.
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#cfe0f4] bg-white py-20 text-muted-foreground">
              <Inbox size={40} className="mb-3 opacity-30" />
              <p className="text-base font-semibold text-foreground">Không tìm thấy bài viết</p>
              <p className="mt-1 text-sm">Thử thay đổi từ khóa hoặc bộ lọc.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <NewsCard key={item?.id} item={item} navigate={navigate} locale={locale} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold disabled:opacity-40 hover:bg-[#eef7ff]"
              >
                <ChevronLeft size={15} /> Trước
              </button>
              <span className="rounded-full border border-[#cfe0f4] bg-white px-4 py-1.5 text-sm font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="flex h-9 items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold disabled:opacity-40 hover:bg-[#eef7ff]"
              >
                Sau <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
