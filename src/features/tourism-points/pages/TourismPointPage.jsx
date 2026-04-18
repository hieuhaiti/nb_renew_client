import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Inbox,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RootLayout from '@/components/layout/RootLayout';
import { useGetAllDataPoints } from '@/features/tourism-points/api/tourismPointsApi';
import { categoriesService } from '@/features/categories/api/categoriesService';
import { subCategoriesService } from '@/features/categories/api/subCategoriesService';
import { useDebounce } from 'use-debounce';
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetcher } from '@/services/fetcher';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import {
  TourismPointFeaturedCard,
  TourismPointSkeletonCard,
  TourismPointStandardCard,
} from '@/features/tourism-points/components/list/TourismPointCards';

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

  const { data, refetch, isLoading, isFetching, isError } = useGetAllDataPoints({
    format: 'json',
    limit: currentSettings.limit,
    page: currentSettings.page,
    search: debouncedQuery,
    // subcategory_id: selectedSubcategoryId || undefined,
  });

  const { data: categoriesData } = categoriesService({ lang });
  const categories = categoriesData?.data?.categories || [];

  const { data: subCategoriesData } = subCategoriesService({
    lang,
    category_id: selectedCategoryId || undefined,
  });
  const subcategories =
    subCategoriesData?.subcategories || subCategoriesData?.data?.subcategories || [];

  const getPaginationTotal = (payload) =>
    payload?.data?.pagination?.total ?? payload?.pagination?.total ?? 0;
  const getFeatureCount = (payload) =>
    payload?.data?.features?.length ?? payload?.features?.length ?? 0;

  const { data: selectedCategoryCountData } = useQuery({
    queryKey: ['points-total-by-category', lang, selectedCategoryId],
    queryFn: () =>
      fetcher(
        `points?lang=${lang}&format=json&is_active=true&limit=1&page=1&category_id=${selectedCategoryId}`
      ),
    staleTime: 5 * 60 * 1000,
    enabled: !!selectedCategoryId,
  });

  const subcategoryCountQueries = useQueries({
    queries: subcategories.map((sub) => ({
      queryKey: ['points-total-by-subcategory', lang, selectedCategoryId, sub.id],
      queryFn: () =>
        fetcher(`points/subcategory/${sub.id}?lang=${lang}&format=geojson&is_active=true`),
      staleTime: 5 * 60 * 1000,
      enabled: !!selectedCategoryId,
    })),
  });

  const subcategoryCountById = useMemo(() => {
    const map = new Map();
    subcategories.forEach((sub, idx) => {
      map.set(String(sub.id), getFeatureCount(subcategoryCountQueries[idx]?.data));
    });
    return map;
  }, [subcategories, subcategoryCountQueries]);

  const selectedCategoryTotal = selectedCategoryId
    ? getPaginationTotal(selectedCategoryCountData)
    : 0;

  const points = useMemo(() => {
    if (!data) return [];
    if (data.data && Array.isArray(data.data.points)) return data.data.points;
    if (Array.isArray(data.points)) return data.points;
    return [];
  }, [data]);

  const paginationFromApi = data?.data?.pagination || null;
  const total = paginationFromApi?.total ?? points.length;
  const pages =
    paginationFromApi?.total_pages ?? Math.max(1, Math.ceil(total / (currentSettings.limit || 12)));

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [String(c.id), c.name])),
    [categories]
  );

  const selectedCategoryName = useMemo(() => {
    if (!currentSettings.selectedCategory) return t('tourismPointPage.all', 'All');
    return (
      categoryNameById.get(String(currentSettings.selectedCategory)) ||
      t('tourismPointPage.all', 'All')
    );
  }, [currentSettings.selectedCategory, categoryNameById, t]);

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
    navigate(`/tourism-point/point/${point.id}`);
  };

  const currentCountText = points.length;

  return (
    <RootLayout>
      <div className="bg-background min-h-screen">
        {/* --- Header Banner --- */}
        <div className="bg-primary text-primary-foreground relative w-full shrink-0 overflow-hidden py-8">
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">
                {t('tourismPointPage.title', 'Điểm du lịch')}
              </h1>
              <p className="mb-4 text-sm font-medium">
                {t(
                  'tourismPointPage.subtitle',
                  'Khám phá các điểm tham quan nổi bật tại Ninh Bình'
                )}
              </p>
            </div>
            <Button
              variant="outline"
              className="text-primary-foreground hover:border-primary-foreground hover:text-primary-foreground bg-primary flex items-center gap-2 rounded-full px-6 whitespace-nowrap shadow-sm transition-all"
              onClick={() => refetch?.()}
              disabled={isFetching}
            >
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
              {t('tourismPointPage.refresh', 'Làm mới')}
            </Button>
          </div>
          {/* Background Decorators */}
          <div className="text-primary pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/4 -translate-y-1/4 rounded-full blur-3xl"></div>
          <div className="text-primary pointer-events-none absolute right-1/4 bottom-0 h-64 w-64 translate-y-1/4 rounded-full blur-2xl"></div>
        </div>

        {/* --- Filter & Search Row --- */}
        <div className="border-border bg-background sticky top-[64px] z-20 w-full flex-shrink-0 border-b pt-4 pb-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
              <div className="relative w-full md:w-[400px]">
                <Search
                  size={18}
                  className="text-primary absolute top-1/2 left-3.5 -translate-y-1/2"
                />
                <Input
                  type="text"
                  placeholder={t(
                    'tourismPointPage.search_placeholder',
                    'Tìm kiếm điểm tham quan...'
                  )}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="text-primary placeholder:text-primary focus-visible:ring-ring h-10 w-full rounded-full pl-10 text-sm shadow-sm focus-visible:ring-1"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Button
                  className="text-primary-foreground bg-primary h-9 rounded-full px-4 font-medium shadow-sm"
                  size="sm"
                >
                  <div className="bg-primary-foreground mr-2 h-1.5 w-1.5 rounded-full"></div>
                  {selectedCategoryName}
                </Button>
                <Button
                  variant="outline"
                  className="text-primary h-9 rounded-full px-4 font-medium text-[var(--foreground)] shadow-sm"
                  size="sm"
                >
                  {t('tourismPointPage.filter', 'Bộ lọc')}
                </Button>
                <div className="text-primary hidden h-9 items-center overflow-hidden rounded-md border p-0.5 shadow-sm md:flex">
                  <Button
                    variant={currentSettings.viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-full w-8 rounded-sm rounded-r-none"
                    onClick={() => setCurrentSettings({ viewMode: 'grid' })}
                  >
                    <LayoutGrid size={15} />
                  </Button>
                  <div className="bg-border text-primary h-4 w-[1px]"></div>
                  <Button
                    variant={currentSettings.viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-full w-8 rounded-sm rounded-l-none"
                    onClick={() => setCurrentSettings({ viewMode: 'list' })}
                  >
                    <List size={15} />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-primary h-9 w-9 rounded-full text-[var(--foreground)] shadow-sm md:hidden"
                >
                  <SlidersHorizontal size={15} />
                </Button>
              </div>
            </div>

            <div className="no-scrollbar flex w-full items-center gap-6 overflow-x-auto border-b-0 border-transparent">
              <button
                onClick={() =>
                  setCurrentSettings({ selectedCategory: 0, selectedSubcategory: 0, page: 1 })
                }
                className={`border-b-2 px-1 pb-3 text-sm whitespace-nowrap ${
                  !currentSettings.selectedCategory
                    ? 'text-primary text-primary dark:text-primary font-semibold'
                    : 'text-primary hover:text-primary-foreground dark:text-primary border-transparent font-medium transition-colors'
                }`}
              >
                {t('tourismPointPage.all', 'All')}
              </button>
              {categories.map((cat) => {
                const isActive = Number(currentSettings.selectedCategory) === Number(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setCurrentSettings({
                        selectedCategory: cat.id,
                        selectedSubcategory: 0,
                        page: 1,
                      })
                    }
                    className={`border-b-2 px-1 pb-3 text-sm whitespace-nowrap ${
                      isActive
                        ? 'text-primary text-primary dark:text-primary font-semibold'
                        : 'text-primary hover:text-primary-foreground dark:text-primary border-transparent font-medium transition-colors'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {selectedCategoryId > 0 && (
              <div className="no-scrollbar mt-2 flex w-full items-center gap-4 overflow-x-auto border-t border-[var(--border-primary)] pt-2">
                <button
                  onClick={() => setCurrentSettings({ selectedSubcategory: 0, page: 1 })}
                  className={`border-b-2 px-1 pb-2 text-sm whitespace-nowrap ${
                    !selectedSubcategoryId
                      ? 'text-primary text-primary dark:text-primary font-semibold'
                      : 'text-primary hover:text-primary-foreground dark:text-primary border-transparent font-medium transition-colors'
                  }`}
                >
                  {t('tourismPointPage.all_subcategories', 'Tất cả loại hình')} (
                  {selectedCategoryTotal})
                </button>

                {subcategories.map((sub) => {
                  const isSubActive = Number(selectedSubcategoryId) === Number(sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setCurrentSettings({ selectedSubcategory: sub.id, page: 1 })}
                      className={`border-b-2 px-1 pb-2 text-sm whitespace-nowrap ${
                        isSubActive
                          ? 'text-primary text-primary dark:text-primary font-semibold'
                          : 'text-primary hover:text-primary-foreground dark:text-primary border-transparent font-medium transition-colors'
                      }`}
                    >
                      {sub.name} ({subcategoryCountById.get(String(sub.id)) ?? 0})
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="bg-background w-full flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
              <div>
                {t('tourismPointPage.showing', 'Hiển thị')}{' '}
                <b className="text-[var(--foreground)]">
                  {currentCountText} {t('tourismPointPage.of', '/')} {total}
                </b>{' '}
                {t('tourismPointPage.results', 'kết quả')}
              </div>
              <div className="flex cursor-pointer items-center gap-1.5">
                {t('tourismPointPage.sort_by', 'Sắp xếp')}:{' '}
                <b className="flex items-center font-semibold text-[var(--foreground)]">
                  {t('tourismPointPage.featured', 'Nổi bật')}{' '}
                  <ChevronRight size={14} className="ml-0.5 rotate-90" />
                </b>
              </div>
            </div>

            <div className="flex w-full flex-col gap-6 pb-10">
              {isLoading ? (
                <>
                  {currentSettings.viewMode === 'grid' && (
                    <TourismPointSkeletonCard isFeatured={true} />
                  )}
                  <div
                    className={`grid gap-6 ${currentSettings.viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-col'}`}
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <TourismPointSkeletonCard key={i} />
                    ))}
                  </div>
                </>
              ) : isError ? (
                <div className="py-20 text-center text-[var(--destructive)]">Lỗi tải dữ liệu.</div>
              ) : points.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-[var(--muted-foreground)]">
                  <Inbox size={48} className="mb-4 opacity-30" />
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {t('tourismPointPage.no_results', 'Không tìm thấy kết quả')}
                  </h3>
                  <p>Thử tìm kiếm với từ khóa khác.</p>
                </div>
              ) : (
                <>
                  {/* Featured Double/Full Span Card */}
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

                  {/* Standard Grid/List Cards */}
                  <div
                    className={`grid gap-5 ${currentSettings.viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-col'}`}
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

              {/* Pagination block */}
              {pages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-[var(--border-primary)] pt-6 font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentSettings({ page: Math.max(1, currentSettings.page - 1) })
                    }
                    disabled={currentSettings.page <= 1}
                    className="rounded-full shadow-sm"
                  >
                    <ChevronLeft size={16} className="mr-1" /> {t('common.prev', 'Trước')}
                  </Button>
                  <div className="text-primary rounded-full border px-4 py-1.5 text-sm shadow-sm">
                    {currentSettings.page} / {pages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentSettings({ page: Math.min(pages, currentSettings.page + 1) })
                    }
                    disabled={currentSettings.page >= pages}
                    className="rounded-full shadow-sm"
                  >
                    {t('common.next', 'Sau')} <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
