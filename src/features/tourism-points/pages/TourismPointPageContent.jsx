import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Inbox,
  LayoutGrid,
  List,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RootLayout from '@/components/layout/RootLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetAllDataPoints } from '@/services/api/tourism-points/tourismPointsApi';
import { categoriesService } from '@/services/api/categories/categoriesService';
import { subCategoriesService } from '@/services/api/categories/subCategoriesService';
import { useDebounce } from 'use-debounce';
import { useApiQueries, useApiQuery } from '@/services/useApi';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import {
  TourismPointFeaturedCard,
  TourismPointSkeletonCard,
  TourismPointStandardCard,
} from '@/features/tourism-points/components/list/TourismPointCards';

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

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

  const { data: selectedCategoryCountData } = useApiQuery(
    ['spots-count-by-category', selectedCategoryId],
    `spots?category_id=${selectedCategoryId}&limit=1&page=1`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: !!selectedCategoryId,
    }
  );

  const subcategoryCountQueries = useApiQueries({
    queries: subcategories.map((sub) => ({
      queryKey: ['spots-count-by-subcategory', sub.id],
      endPoint: `spots?category_id=${sub.id}&limit=1&page=1`,
      staleTime: 5 * 60 * 1000,
      enabled: !!selectedCategoryId,
    })),
  });

  const subcategoryCountById = useMemo(() => {
    const map = new Map();
    subcategories.forEach((sub, idx) => {
      map.set(String(sub.id), getPaginationTotal(subcategoryCountQueries[idx]?.data));
    });
    return map;
  }, [subcategories, subcategoryCountQueries]);

  const selectedCategoryTotal = selectedCategoryId
    ? getPaginationTotal(selectedCategoryCountData)
    : 0;

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

  const catChipClass = (active) =>
    cn(
      'shrink-0 rounded-full text-xs font-medium transition-colors',
      active
        ? 'bg-background text-foreground hover:bg-background/90'
        : 'bg-transparent text-white/60 hover:bg-white/10 hover:text-white'
    );

  return (
    <RootLayout>
      <div className="min-h-screen">
        {/* ── Banner ── */}
        <div className="bg-primary text-primary-foreground relative overflow-hidden pt-8 pb-6">
          {/* Decorators */}
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 bottom-0 h-56 w-56 translate-y-1/3 rounded-full bg-white/5 blur-2xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-1 text-3xl font-bold">
              {t('tourismPointPage.title', 'Điểm du lịch Ninh Bình')}
            </h1>
            <p className="text-primary-foreground/75 mb-5 text-sm">
              {t('tourismPointPage.subtitle', 'Khám phá các điểm tham quan nổi bật tại Ninh Bình')}
            </p>

            {/* Search row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search input */}
              <div className="relative min-w-0 flex-1">
                <Search
                  size={16}
                  className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                />
                <Input
                  type="text"
                  placeholder={t(
                    'tourismPointPage.search_placeholder',
                    'Tìm kiếm điểm tham quan...'
                  )}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="text-foreground placeholder:text-muted-foreground border-0 bg-white pr-9 pl-9 shadow-sm focus-visible:ring-2 focus-visible:ring-white/50"
                />
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1.5 h-7 w-7 -translate-y-1/2"
                    onClick={() => setQuery('')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {/* Per-page selector */}
              <div className="text-primary-foreground/80 flex shrink-0 items-center gap-2 text-sm">
                {t('tourismPointPage.show', 'Hiển thị')}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary-foreground hover:text-primary-foreground w-18 justify-between gap-1 rounded-lg border-white/25 bg-white/10 hover:bg-white/20"
                    >
                      {currentSettings.limit}
                      <ChevronDown size={13} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-20">
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <DropdownMenuItem
                        key={n}
                        className={cn(
                          'justify-center',
                          currentSettings.limit === n && 'text-primary font-semibold'
                        )}
                        onClick={() => setCurrentSettings({ limit: n, page: 1 })}
                      >
                        {n}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <span>/ {t('tourismPointPage.per_page', 'trang')}</span>
              </div>

              {/* Search button */}
              <Button
                className="text-primary shrink-0 bg-white hover:bg-white/90"
                onClick={() => setCurrentSettings({ page: 1 })}
              >
                <Search size={14} />
                {t('tourismPointPage.search_btn', 'Tìm kiếm')}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Dark filter bar ── */}
        <div className="bg-background/80 text-foreground sticky top-0 z-40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              {/* Category chips */}
              <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
                <Button
                  size="sm"
                  className={catChipClass(!selectedCategoryId)}
                  onClick={() =>
                    setCurrentSettings({ selectedCategory: 0, selectedSubcategory: 0, page: 1 })
                  }
                >
                  {t('tourismPointPage.all', 'Tất cả')}
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    size="sm"
                    className={catChipClass(
                      Number(currentSettings.selectedCategory) === Number(cat.id)
                    )}
                    onClick={() =>
                      setCurrentSettings({
                        selectedCategory: cat.id,
                        selectedSubcategory: 0,
                        page: 1,
                      })
                    }
                  >
                    {lang === 'en' ? cat.name_en || cat.name_vi : cat.name_vi || cat.name_en}
                  </Button>
                ))}
              </div>

              {/* View mode toggle */}
              <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-white/10 p-0.5">
                <Button
                  size="icon-sm"
                  className={cn(
                    'rounded-md',
                    currentSettings.viewMode === 'grid'
                      ? 'bg-white/20 text-white'
                      : 'bg-transparent text-white/40 hover:bg-white/10 hover:text-white'
                  )}
                  onClick={() => setCurrentSettings({ viewMode: 'grid' })}
                >
                  <LayoutGrid size={15} />
                </Button>
                <Button
                  size="icon-sm"
                  className={cn(
                    'rounded-md',
                    currentSettings.viewMode === 'list'
                      ? 'bg-white/20 text-white'
                      : 'bg-transparent text-white/40 hover:bg-white/10 hover:text-white'
                  )}
                  onClick={() => setCurrentSettings({ viewMode: 'list' })}
                >
                  <List size={15} />
                </Button>
              </div>
            </div>

            {/* Subcategory chips (conditional) */}
            {selectedCategoryId > 0 && (
              <div className="no-scrollbar mt-2 flex items-center gap-2 overflow-x-auto border-t border-white/10 pt-2">
                <Button
                  size="sm"
                  className={catChipClass(!selectedSubcategoryId)}
                  onClick={() => setCurrentSettings({ selectedSubcategory: 0, page: 1 })}
                >
                  {t('tourismPointPage.all_subcategories', 'Tất cả loại hình')} (
                  {selectedCategoryTotal})
                </Button>
                {subcategories.map((sub) => (
                  <Button
                    key={sub.id}
                    size="sm"
                    className={catChipClass(Number(selectedSubcategoryId) === Number(sub.id))}
                    onClick={() => setCurrentSettings({ selectedSubcategory: sub.id, page: 1 })}
                  >
                    {lang === 'en' ? sub.name_en || sub.name_vi : sub.name_vi || sub.name_en} (
                    {subcategoryCountById.get(String(sub.id)) ?? 0})
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="bg-background w-full flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-muted-foreground mb-6 flex items-center justify-between text-sm">
              <div>
                {t('tourismPointPage.showing', 'Hiển thị')}{' '}
                <b className="text-foreground">
                  {points.length} {t('tourismPointPage.of', '/')} {total}
                </b>{' '}
                {t('tourismPointPage.results', 'kết quả')}
              </div>
              <div className="flex cursor-pointer items-center gap-1.5">
                {t('tourismPointPage.sort_by', 'Sắp xếp')}:{' '}
                <b className="text-foreground flex items-center font-semibold">
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
                    className={cn(
                      'grid gap-6',
                      currentSettings.viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                        : 'flex flex-col'
                    )}
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <TourismPointSkeletonCard key={i} />
                    ))}
                  </div>
                </>
              ) : isError ? (
                <div className="text-destructive py-20 text-center">Lỗi tải dữ liệu.</div>
              ) : points.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
                  <Inbox size={48} className="mb-4 opacity-30" />
                  <h3 className="text-foreground text-lg font-semibold">
                    {t('tourismPointPage.no_results', 'Không tìm thấy kết quả')}
                  </h3>
                  <p>Thử tìm kiếm với từ khóa khác.</p>
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
                    className={cn(
                      'grid gap-5',
                      currentSettings.viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                        : 'flex flex-col'
                    )}
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
                <div className="border-border mt-8 flex items-center justify-between border-t pt-6 font-medium">
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
                  <div className="border-border text-primary rounded-full border px-4 py-1.5 text-sm shadow-sm">
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
