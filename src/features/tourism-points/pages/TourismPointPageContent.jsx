import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Inbox,
  LayoutGrid,
  Layers,
  List,
  Map as MapIcon,
  MapPin,
  Radius,
  Star,
  X,
} from 'lucide-react';
import LoadingInline from '@/components/common/LoadingInline';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
const RADIUS_OPTIONS = [0, 3, 5, 10, 20, 50];

const HERO_BG = `linear-gradient(90deg,rgba(4,55,76,.88),rgba(12,169,158,.62)), url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80") center/cover no-repeat`;
const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };

export default function TourismPointPage() {
  const { t } = useTranslation();
  const { currentSettings, setCurrentSettings } = useTourismPointSettingStore();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);
  const [query, setQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [radiusKm, setRadiusKm] = useState(0);
  const [debouncedQuery] = useDebounce(query, 1000);
  const [favorites, setFavorites] = useState(new Set());
  const selectedCategoryId = Number(currentSettings.selectedCategory) || 0;
  const selectedSubcategoryId = Number(currentSettings.selectedSubcategory) || 0;
  const parentCategoryIdForAllSubtypes =
    selectedCategoryId > 0 && !selectedSubcategoryId ? selectedCategoryId : undefined;

  const { data, isLoading, isError } = useGetAllDataPoints({
    limit: currentSettings.limit,
    page: currentSettings.page,
    search: debouncedQuery,
    category_id: selectedSubcategoryId || undefined,
    parent_category_id: parentCategoryIdForAllSubtypes,
    is_featured: currentSettings.isFeatured || undefined,
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

  const getPointName = (point) =>
    lang === 'en'
      ? point?.name_en || point?.name_vi || point?.name || ''
      : point?.name_vi || point?.name_en || point?.name || '';

  const getPointAddress = (point) =>
    lang === 'en'
      ? point?.address_en || point?.address_vi || point?.address || ''
      : point?.address_vi || point?.address_en || point?.address || '';

  const searchResults = useMemo(() => points.slice(0, 7), [points]);
  const shouldShowOverlay = isInputFocused && query.trim().length > 0;
  const handleSearch = () => setCurrentSettings({ page: 1 });

  const handleSelectResult = (item) => {
    if (!item) return;
    setQuery(getPointName(item));
    setIsInputFocused(false);
    handleOpenDetail(item);
  };

  const handleCategoryChange = (value) => {
    if (value === 'all') {
      setCurrentSettings({ selectedCategory: 0, selectedSubcategory: 0, page: 1 });
      return;
    }

    const nextCategory = Number(value) || 0;
    setCurrentSettings({
      selectedCategory: nextCategory,
      selectedSubcategory: 0,
      page: 1,
    });
  };

  const handleRadiusChange = (value) => {
    const next = Number(value);
    setRadiusKm(Number.isFinite(next) ? next : 0);
  };

  const tabCls = (active) =>
    `h-9.5 px-4.5 rounded-full border text-sm font-bold transition-colors cursor-pointer ${
      active
        ? 'text-white border-transparent'
        : 'bg-white border-[#cfe0f4] text-foreground hover:bg-primary-soft'
    }`;

  return (
    <RootLayout>
      <div className="min-h-screen">
        {/* ── Hero ── */}
        <section className="px-4 pt-5 pb-0 sm:px-6">
          <div
            className="mx-auto grid min-h-[240px] max-w-290 grid-cols-1 items-end gap-5 overflow-hidden rounded-[28px] p-6 text-white shadow-[0_14px_35px_rgba(7,29,54,.18)] sm:p-7 lg:min-h-[255px] lg:grid-cols-[1.1fr_0.9fr]"
            style={{ background: HERO_BG }}
          >
            {/* Left – title block */}
            <div>
              <div className="mb-4 flex items-center gap-2 text-[13px] font-bold opacity-90">
                <Home size={13} />
                <span>{t('common.home')}</span>
                <ChevronRight size={12} className="opacity-70" />
                <span>{t('tourismPointPage.title')}</span>
              </div>
              <h1 className="mb-2.5 text-[26px] leading-tight font-black tracking-tight sm:text-[32px] lg:text-[40px]">
                {t('tourismPointPage.hero_title')}
              </h1>
              <p className="max-w-[680px] text-sm leading-relaxed text-white/88 sm:text-[15px]">
                {t('tourismPointPage.hero_desc')}
              </p>
            </div>

            {/* Right – stat cards */}
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-3">
              <div className="rounded-[18px] bg-white/92 p-3.5 backdrop-blur-sm sm:p-4">
                <b className="block text-xl font-black text-[#079b91] sm:text-2xl">
                  {isLoading ? '…' : total > 0 ? `${total}+` : '0'}
                </b>
                <span className="text-[11px] font-bold text-[#64748b] sm:text-xs">
                  {t('tourismPointPage.stat_spots')}
                </span>
              </div>
              <div className="rounded-[18px] bg-white/92 p-3.5 backdrop-blur-sm sm:p-4">
                <b className="block text-xl font-black text-[#079b91] sm:text-2xl">
                  {categories.length || '…'}
                </b>
                <span className="text-[11px] font-bold text-[#64748b] sm:text-xs">
                  {t('tourismPointPage.stat_categories')}
                </span>
              </div>
              <div className="rounded-[18px] bg-white/92 p-3.5 backdrop-blur-sm sm:p-4">
                <b className="block text-xl font-black text-[#079b91] sm:text-2xl">
                  {subcategories.length > 0 ? subcategories.length : '24+'}
                </b>
                <span className="text-[11px] font-bold text-[#64748b] sm:text-xs">
                  {t('tourismPointPage.stat_subcategories')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter bar ── */}
        <section
          className="sticky top-0 z-40 border-b border-[#c7d9eb] px-6 py-3.5"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
        >
          <div className="mx-auto flex max-w-290 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            {/* Category tabs */}
            {/* <div className="flex flex-wrap gap-2.5">
              <button
                className={tabCls(!selectedCategoryId)}
                style={!selectedCategoryId ? BTN_GRADIENT : undefined}
                onClick={() =>
                  setCurrentSettings({ selectedCategory: 0, selectedSubcategory: 0, page: 1 })
                }
              >
                {t('tourismPointPage.all')}
              </button>
              {categories.map((cat) => {
                const isActive = Number(currentSettings.selectedCategory) === Number(cat.id);
                return (
                  <button
                    key={cat.id}
                    className={tabCls(isActive)}
                    style={isActive ? BTN_GRADIENT : undefined}
                    onClick={() =>
                      setCurrentSettings({
                        selectedCategory: cat.id,
                        selectedSubcategory: 0,
                        page: 1,
                      })
                    }
                  >
                    {lang === 'en' ? cat.name_en || cat.name_vi : cat.name_vi || cat.name_en}
                  </button>
                );
              })}
            </div> */}

            {/* number of pages */}
            <div className="bg-background flex w-full flex-wrap items-center justify-end gap-2 rounded-2xl p-2 shadow-[0_2px_12px_rgba(23,58,93,0.08)] md:flex-nowrap xl:w-full xl:max-w-280">
              <div className="relative w-full min-w-0 flex-[1.8] sm:col-span-2 xl:col-span-1 xl:min-w-80">
                <Search className="text-quaternary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  size="toolbar"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsInputFocused(false);
                    }, 120);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder={t('tourismPointPage.search_placeholder', {
                    defaultValue: 'Search attractions...',
                  })}
                  className="pr-9 pl-9"
                />

                {query ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-1.5 h-7 w-7 -translate-y-1/2"
                    onClick={() => setQuery('')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                ) : null}

                {shouldShowOverlay ? (
                  <div className="bg-card border-border absolute top-full right-0 left-0 z-50 mt-2 max-h-72 overflow-auto rounded-xl border shadow-lg">
                    {isLoading ? (
                      <div className="flex items-center justify-center px-3 py-6">
                        <LoadingInline size="small" />
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-muted-foreground flex flex-col items-center gap-2 px-3 py-6 text-sm">
                        <MapPin className="h-5 w-5 opacity-70" />
                        <p>{t('mapPage.toolbar.searchNoResult')}</p>
                      </div>
                    ) : (
                      <div className="p-1.5">
                        {searchResults.map((item) => (
                          <Button
                            key={item.id}
                            type="button"
                            variant="ghost"
                            className="h-auto w-full justify-start gap-3 rounded-lg px-2.5 py-2"
                            onClick={() => handleSelectResult(item)}
                          >
                            <MapPin className="text-primary h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1 text-left">
                              <p
                                className="text-foreground truncate text-sm font-medium"
                                title={getPointName(item)}
                              >
                                {getPointName(item)}
                              </p>
                              <p
                                className="text-muted-foreground truncate text-sm"
                                title={getPointAddress(item)}
                              >
                                {getPointAddress(item) || t('mapPage.destination.noAddress')}
                              </p>
                            </div>
                            <ArrowUpRight className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="relative w-full min-w-0 flex-[1.1] xl:min-w-55">
                <Select
                  value={selectedCategoryId ? String(selectedCategoryId) : 'all'}
                  onValueChange={handleCategoryChange}
                  startIcon={<Layers className="text-quaternary" />}
                >
                  <SelectTrigger size="toolbar" className="w-full">
                    <SelectValue placeholder={t('tourismPointPage.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.map_all')}</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {lang === 'en' ? cat.name_en || cat.name_vi : cat.name_vi || cat.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative w-full min-w-0 flex-[1.1] xl:min-w-46">
                <Select
                  value={currentSettings.isFeatured || 'all'}
                  onValueChange={(v) =>
                    setCurrentSettings({ isFeatured: v === 'all' ? '' : v, page: 1 })
                  }
                  startIcon={<Star className="text-amber-400" />}
                >
                  <SelectTrigger size="toolbar" className="w-full">
                    <SelectValue placeholder={t('tourismPointPage.is_featured_label')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('tourismPointPage.is_featured_all')}</SelectItem>
                    <SelectItem value="true">{t('tourismPointPage.is_featured_yes')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative w-full min-w-0 flex-[1.1] xl:min-w-55">
                <Select
                  value={String(radiusKm)}
                  onValueChange={handleRadiusChange}
                  startIcon={<Radius className="text-tertiary" />}
                >
                  <SelectTrigger size="toolbar" className="w-full">
                    <SelectValue placeholder={t('tourismPointPage.radius')} />
                  </SelectTrigger>
                  <SelectContent>
                    {RADIUS_OPTIONS.map((km) => (
                      <SelectItem key={km} value={String(km)}>
                        {km === 0 ? t('tourismPointPage.radiusAll') : `${km} km`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-primary-soft flex items-center gap-1 rounded-lg p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={`flex h-8.5 w-8.5 items-center justify-center rounded-md transition-colors ${
                    currentSettings.viewMode === 'grid'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-transparent text-[#52647a] hover:bg-white'
                  }`}
                  onClick={() => setCurrentSettings({ viewMode: 'grid' })}
                >
                  <LayoutGrid size={15} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={`flex h-8.5 w-8.5 items-center justify-center rounded-md transition-colors ${
                    currentSettings.viewMode === 'list'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-transparent text-[#52647a] hover:bg-white'
                  }`}
                  onClick={() => setCurrentSettings({ viewMode: 'list' })}
                >
                  <List size={15} />
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="hover:text-primary h-8.5 rounded-md border-[#b9cfe4] px-2.5 text-[#52647a]"
                onClick={() => navigate('/map')}
              >
                <MapIcon size={14} />
                {t('common.map')}
              </Button>
            </div>
          </div>

          {/* Subcategory chips */}
          {selectedCategoryId > 0 && (
            <div className="mx-auto mt-2 flex max-w-290 flex-wrap items-center gap-2 border-t border-[#c7d9eb] pt-2">
              {(() => {
                const active = !selectedSubcategoryId;
                return (
                  <button
                    className={tabCls(active)}
                    style={active ? BTN_GRADIENT : undefined}
                    onClick={() => setCurrentSettings({ selectedSubcategory: 0, page: 1 })}
                  >
                    {t('tourismPointPage.all_subcategories', {
                      defaultValue: 'All subcategories',
                    })}{' '}
                    ({selectedCategoryTotal})
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
              {t('tourismPointPage.showing')}{' '}
              <strong className="text-foreground">
                {points.length} / {total}
              </strong>{' '}
              {t('tourismPointPage.results')}
            </div>
            <div className="flex cursor-pointer items-center gap-1">
              <span className="hidden shrink-0 text-sm whitespace-nowrap text-[#52647a] md:inline">
                {t('tourismPointPage.showing')}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-foreground hover:border-primary/45 flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#b9cfe4] bg-white px-3.5 text-sm font-medium transition-colors">
                    {currentSettings.limit}
                    <ChevronDown size={13} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-20">
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
              <span className="hidden shrink-0 text-sm whitespace-nowrap text-[#52647a] md:inline">
                / {t('tourismPointPage.per_page', { defaultValue: 'per page' })}
              </span>
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
            <div className="text-destructive py-20 text-center">
              {t('tourismPointPage.errorLoading')}
            </div>
          ) : points.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
              <Inbox size={48} className="mb-4 opacity-30" />
              <h3 className="text-foreground text-lg font-semibold">
                {t('tourismPointPage.no_results')}
              </h3>
              <p>{t('tourismPointPage.tryDifferentKeyword')}</p>
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
                className="text-primary hover:bg-primary flex h-9.5 min-w-20 cursor-pointer items-center justify-center gap-1 rounded-full border border-[#9db8d2] bg-white px-3.75 text-sm font-bold transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                {t('common.prev')}
              </button>
              <div className="text-primary flex h-9.5 min-w-20 items-center justify-center rounded-full border border-[#9db8d2] bg-white px-3.75 text-sm font-bold">
                {currentSettings.page} / {pages}
              </div>
              <button
                disabled={currentSettings.page >= pages}
                onClick={() =>
                  setCurrentSettings({ page: Math.min(pages, currentSettings.page + 1) })
                }
                className="text-primary hover:bg-primary flex h-9.5 min-w-20 cursor-pointer items-center justify-center gap-1 rounded-full border border-[#9db8d2] bg-white px-3.75 text-sm font-bold transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('common.next')}
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </main>
      </div>
    </RootLayout>
  );
}
