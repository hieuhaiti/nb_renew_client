import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Inbox, LayoutGrid, List, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RootLayout from '@/components/layout/RootLayout';
import {
  useGetAllDataPoints,
  useGetSpotCountByCategory,
  useGetSubcategoryCountsQuery,
} from '@/services/api/tourism-points/tourismPointsApi';
import { categoriesService } from '@/services/api/categories/categoriesService';
import { subCategoriesService } from '@/services/api/categories/subCategoriesService';
import { useDebounce } from 'use-debounce';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import {
  TourismPointFeaturedCard,
  TourismPointSkeletonCard,
  TourismPointStandardCard,
} from '@/features/tourism-points/components/list/TourismPointCards';

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

const HERO_BG = `linear-gradient(90deg, rgba(3,79,141,.96), rgba(7,119,190,.9)), url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80") center/cover`;
const BTN_GRADIENT = { background: 'linear-gradient(135deg, #075fac, #034f8d)' };

export default function TourismPointPage() {
  const { t } = useTranslation();
  const { currentSettings, setCurrentSettings } = useTourismPointSettingStore();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 1000);
  const [favorites, setFavorites] = useState(new Set());
  const selectedCategoryId = Number(currentSettings.selectedCategory) || 0;
  const selectedSubcategoryId = Number(currentSettings.selectedSubcategory) || 0;

  const { data, isLoading, isError } = useGetAllDataPoints({
    limit: currentSettings.limit,
    page: currentSettings.page,
    search: debouncedQuery,
    category_id: selectedSubcategoryId || selectedCategoryId || undefined,
  });

  const { data: categoriesData } = categoriesService({ lang });
  const categories = (categoriesData?.data?.items || []).filter((c) => c.parent_id === null);

  const { data: subCategoriesData } = subCategoriesService({
    lang,
    category_id: selectedCategoryId || undefined,
  });
  const subcategories = subCategoriesData?.data?.items || [];

  const getPaginationTotal = (payload) =>
    payload?.data?.pagination?.total ?? payload?.pagination?.total ?? 0;

  const { data: selectedCategoryCountData } = useGetSpotCountByCategory({
    category_id: selectedCategoryId,
  });

  const subcategoryCountQueries = useGetSubcategoryCountsQuery({
    subcategoryIds: subcategories.map((sub) => sub.id),
    enabled: !!selectedCategoryId,
  });

  const subcategoryCountById = useMemo(() => {
    const map = new Map();
    subcategories.forEach((sub, idx) => {
      map.set(String(sub.id), getPaginationTotal(subcategoryCountQueries[idx]?.data));
    });
    return map;
  }, [subcategories, subcategoryCountQueries]);

  const selectedCategoryTotal = useMemo(() => {
    if (!selectedCategoryId) return 0;
    if (subcategories.length > 0) {
      const sum = subcategories.reduce(
        (acc, sub) => acc + (subcategoryCountById.get(String(sub.id)) ?? 0),
        0
      );
      if (sum > 0) return sum;
    }
    return getPaginationTotal(selectedCategoryCountData);
  }, [selectedCategoryId, subcategories, subcategoryCountById, selectedCategoryCountData]);

  const points = useMemo(() => {
    if (!data) return [];
    if (data.data && Array.isArray(data.data.spots)) return data.data.spots;
    if (Array.isArray(data.spots)) return data.spots;
    return [];
  }, [data]);

  const paginationFromApi = data?.data?.pagination || null;
  const total = paginationFromApi?.total ?? points.length;
  const pages =
    paginationFromApi?.totalPages ?? Math.max(1, Math.ceil(total / (currentSettings.limit || 12)));

  const categoryNameById = useMemo(
    () =>
      new Map(
        categories.map((c) => [
          String(c.id),
          lang === 'en' ? c.name_en || c.name_vi : c.name_vi || c.name_en,
        ])
      ),
    [categories, lang]
  );

  const getCategoryName = (point) =>
    point?.category_name ||
    categoryNameById.get(String(point?.category_id)) ||
    t('tourismPointPage.unknown_category', 'Unknown category');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites');
      const favs = raw ? JSON.parse(raw) : [];
      setFavorites(new Set((Array.isArray(favs) ? favs : []).map(String)));
    } catch {
      setFavorites(new Set());
    }
  }, []);

  const toggleFavorite = (pointId, e) => {
    e.stopPropagation();
    try {
      const idStr = String(pointId);
      const next = new Set(favorites);
      if (next.has(idStr)) next.delete(idStr);
      else next.add(idStr);
      setFavorites(next);
      localStorage.setItem('favorites', JSON.stringify(Array.from(next)));
    } catch (err) {
      console.error('toggleFavorite', err);
    }
  };

  const handleOpenDetail = (point) => {
    if (!point) return;
    const pointSlug = point.slug || point.spot_slug;
    const pointIdentifier = pointSlug || point.id;
    if (!pointIdentifier) return;
    navigate(`/tourism-point/point/${encodeURIComponent(String(pointIdentifier))}`);
  };

  const tabCls = (active) =>
    `h-9.5 px-4.5 rounded-full border text-sm font-bold transition-colors cursor-pointer ${
      active
        ? 'text-white border-transparent'
        : 'bg-white border-[#d9b4a4] text-foreground hover:bg-primary-soft'
    }`;

  return (
    <RootLayout>
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#eef7fc 0%,#f8fbfd 100%)' }}>

        {/* ── Hero ── */}
        <section className="px-6 py-9 text-white" style={{ background: HERO_BG }}>
          <div className="mx-auto grid max-w-290 items-center gap-7.5 grid-cols-1 lg:grid-cols-[1fr_1.35fr]">
            <div>
              <h1 className="text-4xl font-black leading-tight tracking-tight">
                {t('tourismPointPage.title', 'Điểm du lịch')}
              </h1>
              <p className="mt-2 font-medium text-white/90">
                {t('tourismPointPage.subtitle', 'Khám phá các điểm tham quan nổi bật tại Ninh Bình')}
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-3xl p-4"
              style={{
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid rgba(255,255,255,0.75)',
                boxShadow: '0 12px 28px rgba(0,0,0,.14)',
              }}
            >
              <div className="relative flex-1 min-w-0">
                <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#52647a]" />
                <input
                  type="text"
                  className="h-11 w-full rounded-xl border border-[#a8bed4] bg-white pl-9 pr-9 text-sm text-foreground outline-none focus:border-primary"
                  placeholder={t('tourismPointPage.search_placeholder', 'Tìm kiếm điểm tham quan...')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-[#52647a] hover:text-foreground"
                    onClick={() => setQuery('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <span className="hidden shrink-0 whitespace-nowrap text-sm text-[#52647a] sm:inline">
                {t('tourismPointPage.show', 'Hiển thị')}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-[#a8bed4] bg-white px-4 text-sm text-foreground">
                    {currentSettings.limit}
                    <ChevronDown size={13} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="min-w-20">
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <DropdownMenuItem
                      key={n}
                      className={`justify-center ${currentSettings.limit === n ? 'text-primary font-semibold' : ''}`}
                      onClick={() => setCurrentSettings({ limit: n, page: 1 })}
                    >
                      {n}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <span className="hidden shrink-0 whitespace-nowrap text-sm text-[#52647a] sm:inline">
                / {t('tourismPointPage.per_page', 'trang')}
              </span>

              <button
                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white"
                style={BTN_GRADIENT}
                onClick={() => setCurrentSettings({ page: 1 })}
              >
                <Search size={14} />
                {t('tourismPointPage.search_btn', 'Tìm kiếm')}
              </button>
            </div>
          </div>
        </section>

        {/* ── Filter bar ── */}
        <section
          className="sticky top-0 z-40 border-b border-[#c7d9eb] px-6 py-3.5"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
        >
          <div className="mx-auto max-w-290 flex flex-wrap items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2.5">
              <button
                className={tabCls(!selectedCategoryId)}
                style={!selectedCategoryId ? BTN_GRADIENT : undefined}
                onClick={() => setCurrentSettings({ selectedCategory: 0, selectedSubcategory: 0, page: 1 })}
              >
                {t('tourismPointPage.all', 'Tất cả')}
              </button>
              {categories.map((cat) => {
                const isActive = Number(currentSettings.selectedCategory) === Number(cat.id);
                return (
                  <button
                    key={cat.id}
                    className={tabCls(isActive)}
                    style={isActive ? BTN_GRADIENT : undefined}
                    onClick={() =>
                      setCurrentSettings({ selectedCategory: cat.id, selectedSubcategory: 0, page: 1 })
                    }
                  >
                    {lang === 'en' ? cat.name_en || cat.name_vi : cat.name_vi || cat.name_en}
                  </button>
                );
              })}
            </div>

            {/* View toggle */}
            <div className="flex shrink-0 gap-1.5 rounded-[14px] border border-[#9db8d2] bg-white p-1">
              <button
                className={`flex h-8.5 w-8.5 items-center justify-center rounded-[10px] transition-colors ${
                  currentSettings.viewMode === 'grid' ? 'bg-primary text-white' : 'bg-transparent text-[#52647a]'
                }`}
                onClick={() => setCurrentSettings({ viewMode: 'grid' })}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                className={`flex h-8.5 w-8.5 items-center justify-center rounded-[10px] transition-colors ${
                  currentSettings.viewMode === 'list' ? 'bg-primary text-white' : 'bg-transparent text-[#52647a]'
                }`}
                onClick={() => setCurrentSettings({ viewMode: 'list' })}
              >
                <List size={15} />
              </button>
            </div>
          </div>

          {/* Subcategory chips */}
          {selectedCategoryId > 0 && (
            <div className="mx-auto mt-2 max-w-290 flex flex-wrap items-center gap-2 border-t border-[#c7d9eb] pt-2">
              {(() => {
                const active = !selectedSubcategoryId;
                return (
                  <button
                    className={tabCls(active)}
                    style={active ? BTN_GRADIENT : undefined}
                    onClick={() => setCurrentSettings({ selectedSubcategory: 0, page: 1 })}
                  >
                    {t('tourismPointPage.all_subcategories', 'Tất cả loại hình')} ({selectedCategoryTotal})
                  </button>
                );
              })()}
              {subcategories.map((sub) => {
                const isActive = Number(selectedSubcategoryId) === Number(sub.id);
                return (
                  <button
                    key={sub.id}
                    className={tabCls(isActive)}
                    style={isActive ? BTN_GRADIENT : undefined}
                    onClick={() => setCurrentSettings({ selectedSubcategory: sub.id, page: 1 })}
                  >
                    {lang === 'en' ? sub.name_en || sub.name_vi : sub.name_vi || sub.name_en} (
                    {subcategoryCountById.get(String(sub.id)) ?? 0})
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Content ── */}
        <main className="mx-auto max-w-290 px-6 pt-6 pb-11">
          {/* Result / sort line */}
          <div className="mb-4.5 flex items-center justify-between text-sm font-semibold text-[#607086]">
            <div>
              {t('tourismPointPage.showing', 'Hiển thị')}{' '}
              <strong className="text-foreground">
                {points.length} / {total}
              </strong>{' '}
              {t('tourismPointPage.results', 'kết quả')}
            </div>
            <div className="flex cursor-pointer items-center gap-1">
              {t('tourismPointPage.sort_by', 'Sắp xếp')}:{' '}
              <strong className="flex items-center text-foreground">
                {t('tourismPointPage.featured', 'Nổi bật')}
                <ChevronDown size={13} className="ml-0.5" />
              </strong>
            </div>
          </div>

          {/* Cards */}
          {isLoading ? (
            <div className="flex flex-col gap-5">
              {currentSettings.viewMode === 'grid' && <TourismPointSkeletonCard isFeatured />}
              <div
                className={
                  currentSettings.viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4'
                    : 'flex flex-col gap-3'
                }
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <TourismPointSkeletonCard key={i} />
                ))}
              </div>
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-destructive">
              {t('tourismPointPage.errorLoading', 'Không thể tải dữ liệu.')}
            </div>
          ) : points.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Inbox size={48} className="mb-4 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground">
                {t('tourismPointPage.no_results', 'Không tìm thấy kết quả')}
              </h3>
              <p>{t('tourismPointPage.tryDifferentKeyword', 'Thử tìm kiếm với từ khóa khác.')}</p>
            </div>
          ) : (
            <>
              {currentSettings.viewMode === 'grid' && points.length > 0 && (
                <TourismPointFeaturedCard
                  point={points[0]}
                  onClick={() => handleOpenDetail(points[0])}
                  t={t}
                  categoryName={getCategoryName(points[0])}
                  isLiked={favorites.has(String(points[0].id))}
                  onToggleLike={(e) => toggleFavorite(points[0].id, e)}
                />
              )}
              <div
                className={
                  currentSettings.viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4'
                    : 'flex flex-col gap-3'
                }
              >
                {(currentSettings.viewMode === 'grid' ? points.slice(1) : points).map((p) => (
                  <TourismPointStandardCard
                    key={p.id}
                    point={p}
                    onClick={() => handleOpenDetail(p)}
                    viewMode={currentSettings.viewMode}
                    t={t}
                    categoryName={getCategoryName(p)}
                    isLiked={favorites.has(String(p.id))}
                    onToggleLike={(e) => toggleFavorite(p.id, e)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-9 flex items-center justify-between border-t border-[#9db8d2] pt-5.5">
              <button
                disabled={currentSettings.page <= 1}
                onClick={() => setCurrentSettings({ page: Math.max(1, currentSettings.page - 1) })}
                className="flex h-9.5 min-w-20 cursor-pointer items-center justify-center gap-1 rounded-full border border-[#9db8d2] bg-white px-3.75 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                {t('common.prev', 'Trước')}
              </button>
              <div className="flex h-9.5 min-w-20 items-center justify-center rounded-full border border-[#9db8d2] bg-white px-3.75 text-sm font-bold text-primary">
                {currentSettings.page} / {pages}
              </div>
              <button
                disabled={currentSettings.page >= pages}
                onClick={() => setCurrentSettings({ page: Math.min(pages, currentSettings.page + 1) })}
                className="flex h-9.5 min-w-20 cursor-pointer items-center justify-center gap-1 rounded-full border border-[#9db8d2] bg-white px-3.75 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('common.next', 'Sau')}
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </main>
      </div>
    </RootLayout>
  );
}
