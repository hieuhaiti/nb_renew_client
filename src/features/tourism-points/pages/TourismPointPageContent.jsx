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
  Navigation,
  Radius,
  SlidersHorizontal,
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
  useGetNearbyPoints,
  useGetSpotCountByCategory,
  useGetSubcategoryCountsQuery,
} from '@/services/api/tourism-points/tourismPointsApi';
import { categoriesService } from '@/services/api/categories/categoriesService';
import { subCategoriesService } from '@/services/api/categories/subCategoriesService';
import { useDebounce } from 'use-debounce';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import {
  TourismPointSkeletonCard,
  TourismPointStandardCard,
} from '@/features/tourism-points/components/list/TourismPointCards';

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];
const RADIUS_OPTIONS = [0, 3, 5, 10, 20, 50];

const HERO_BG = `linear-gradient(90deg,rgba(4,55,76,.88),rgba(12,169,158,.62)), url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80") center/cover no-repeat`;

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
  const [nearMe, setNearMe] = useState(false);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    has_vr_360: currentSettings.hasVr360 || undefined,
  });

  const { data: nearbyData, isLoading: isNearbyLoading } = useGetNearbyPoints({
    lat: userLat,
    lng: userLng,
    radius_km: radiusKm || 5,
    limit: currentSettings.limit,
    options: { enabled: nearMe && typeof userLat === 'number' && typeof userLng === 'number' },
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

  const activeData = nearMe ? nearbyData : data;
  const activeIsLoading = nearMe ? isNearbyLoading : isLoading;
  const activeIsError = nearMe ? false : isError;

  const points = useMemo(() => {
    if (!activeData) return [];
    if (activeData.data && Array.isArray(activeData.data.spots)) return activeData.data.spots;
    if (Array.isArray(activeData.data)) return activeData.data;
    if (Array.isArray(activeData.spots)) return activeData.spots;
    return [];
  }, [activeData]);

  const paginationFromApi = nearMe ? null : data?.data?.pagination || null;
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
    setCurrentSettings({ selectedCategory: nextCategory, selectedSubcategory: 0, page: 1 });
  };

  const handleRadiusChange = (value) => {
    const next = Number(value);
    setRadiusKm(Number.isFinite(next) ? next : 0);
  };

  const handleToggleNearMe = () => {
    if (nearMe) {
      setNearMe(false);
      return;
    }
    if (!navigator.geolocation) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setNearMe(true);
        setIsGettingLocation(false);
      },
      () => {
        setIsGettingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  const catName = (cat) =>
    cat ? (lang === 'en' ? cat.name_en || cat.name_vi : cat.name_vi || cat.name_en) : '';

  const quickBtnCls = (active) =>
    `flex items-center gap-1.5 rounded-full border px-[14px] py-[9px] text-[13px] font-extrabold transition-colors cursor-pointer ${
      active
        ? 'bg-secondary border-transparent text-white hover:bg-secondary/90 hover:text-white'
        : 'bg-card border-border text-foreground hover:border-secondary hover:text-secondary'
    }`;

  const filterRowCls = (active) =>
    `flex w-full items-center justify-between rounded-[14px] px-3 py-[11px] text-[13px] font-extrabold transition-colors text-left ${
      active ? 'bg-secondary/10 text-secondary hover:bg-secondary/20 hover:text-secondary' : 'bg-muted text-foreground hover:bg-muted/80'
    }`;

  const selectedCat = categories.find((c) => Number(c.id) === selectedCategoryId);

  return (
    <RootLayout>
      <div
        className="min-h-screen"
        style={{ background: 'linear-gradient(180deg,#eef9ff 0%,#fff 42%,#f7fbff 100%)' }}
      >
        {/* ── Hero ── */}
        <section className="px-4 pt-5 pb-0 sm:px-6">
          <div
            className="grid w-full grid-cols-1 items-end gap-4 overflow-hidden rounded-[24px] p-5 text-white shadow-[0_14px_35px_rgba(7,29,54,.18)] sm:min-h-60 sm:rounded-[30px] sm:p-7 lg:min-h-63.75 lg:grid-cols-[1.1fr_0.9fr]"
            style={{ background: HERO_BG }}
          >
            <div>
              <div className="mb-3 flex items-center gap-2 text-[12px] font-extrabold opacity-90 sm:mb-4.5 sm:text-[13px]">
                <Home size={12} />
                <span>{t('common.home')}</span>
                <ChevronRight size={11} className="opacity-70" />
                <span>{t('tourismPointPage.title')}</span>
              </div>
              <h1 className="mb-2 text-[22px] leading-[1.15] font-black tracking-tight sm:mb-2.5 sm:text-[34px] lg:text-[42px]">
                {t('tourismPointPage.hero_title')}
              </h1>
              <p className="max-w-[760px] text-[13px] leading-[1.7] text-[#e9fffb] sm:text-[15px]">
                {t('tourismPointPage.hero_desc')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { val: activeIsLoading ? '…' : total > 0 ? `${total}+` : '0', key: 'stat_spots' },
                { val: categories.length || '…', key: 'stat_categories' },
                {
                  val: subcategories.length > 0 ? subcategories.length : '24+',
                  key: 'stat_subcategories',
                },
              ].map(({ val, key }) => (
                <div
                  key={key}
                  className="rounded-[16px] bg-white/92 p-3 backdrop-blur-md sm:rounded-[20px] sm:p-4"
                >
                  <b className="text-secondary block text-[20px] font-black sm:text-[24px]">
                    {val}
                  </b>
                  <span className="text-muted-foreground text-[11px] font-extrabold sm:text-[12px]">
                    {t(`tourismPointPage.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sticky toolbar ── */}
        <section
          className="sticky top-0 z-40 border-b px-4 py-3 sm:px-6 sm:py-3.5"
          style={{
            background: 'linear-gradient(180deg,rgba(233,247,255,.96),rgba(223,242,255,.96))',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div className="w-full">
            <div className="border border-border bg-card rounded-[24px] p-3 shadow-(--ambient-shadow) sm:p-3.5">
              {/* Always-visible row */}
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative min-w-0 flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    size="toolbar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsInputFocused(false), 120)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder={t('tourismPointPage.search_placeholder')}
                    className="pr-9 pl-9"
                  />
                  {query && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-1/2 right-1.5 h-7 w-7 -translate-y-1/2"
                      onClick={() => setQuery('')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {shouldShowOverlay && (
                    <div className="border border-border bg-card absolute top-full right-0 left-0 z-50 mt-2 max-h-72 overflow-auto rounded-xl shadow-lg">
                      {activeIsLoading ? (
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
                              <MapPin className="text-secondary h-4 w-4 shrink-0" />
                              <div className="min-w-0 flex-1 text-left">
                                <p className="text-foreground truncate text-sm font-semibold">
                                  {getPointName(item)}
                                </p>
                                <p className="text-muted-foreground truncate text-sm">
                                  {getPointAddress(item) || t('mapPage.destination.noAddress')}
                                </p>
                              </div>
                              <ArrowUpRight className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selects — hidden on mobile, inline on md+ */}
                <div className="hidden md:flex md:items-center md:gap-2">
                  <div className="w-32.5">
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
                            {catName(cat)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32.5">
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
                        <SelectItem value="true">
                          {t('tourismPointPage.is_featured_yes')}
                        </SelectItem>
                        <SelectItem value="false">
                          {t('tourismPointPage.is_featured_no')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-27.5">
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
                </div>

                {/* Mobile filter toggle */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className={`md:hidden h-9 shrink-0 rounded-[13px] border px-3 text-sm font-bold transition-colors ${
                    mobileFilterOpen
                      ? 'border-secondary text-secondary bg-secondary/5 hover:text-secondary hover:bg-secondary/10'
                      : 'border-border text-muted-foreground hover:border-secondary hover:text-secondary'
                  }`}
                >
                  <SlidersHorizontal size={14} />
                </Button>

                {/* View switch */}
                <div className="bg-muted flex shrink-0 items-center gap-1 rounded-[13px] p-1">
                  {[
                    { mode: 'grid', Icon: LayoutGrid },
                    { mode: 'list', Icon: List },
                  ].map(({ mode, Icon }) => (
                    <Button
                      variant="ghost"
                      key={mode}
                      onClick={() => setCurrentSettings({ viewMode: mode })}
                      className={`flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors ${
                        currentSettings.viewMode === mode
                          ? 'bg-secondary text-white shadow-sm hover:bg-secondary/90 hover:text-white'
                          : 'text-muted-foreground hover:bg-card'
                      }`}
                    >
                      <Icon size={15} />
                    </Button>
                  ))}
                </div>

                {/* Map */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:border-secondary hover:text-secondary h-8 shrink-0 rounded-[13px] border px-3"
                  onClick={() => navigate('/map')}
                >
                  <MapIcon size={14} />
                  <span className="hidden sm:inline">{t('common.map')}</span>
                </Button>
              </div>

              {/* Mobile filter panel — revealed by toggle */}
              {mobileFilterOpen && (
                <div className="mt-2.5 flex flex-col gap-2 border-t border-border pt-2.5 md:hidden">
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
                          {catName(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="false">{t('tourismPointPage.is_featured_no')}</SelectItem>
                    </SelectContent>
                  </Select>
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
              )}
            </div>
          </div>
        </section>

        {/* ── Main layout ── */}
        <main className="w-full px-4 pt-5 pb-12 sm:px-6">
          <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[280px_1fr]">
            {/* ── Sidebar ── */}
            <div>
              {/* Mobile toggle — hidden on lg+ */}
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`mb-3 flex w-full items-center justify-between rounded-[18px] border px-4 py-3 text-sm font-extrabold transition-colors lg:hidden ${
                  sidebarOpen
                    ? 'border-secondary bg-secondary/5 text-secondary'
                    : 'border-border bg-card text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-secondary" />
                  {t('tourismPointPage.quick_filters')}
                  {selectedCat && (
                    <span className="text-muted-foreground font-normal">
                      — {catName(selectedCat)}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
                {/* Quick filter card */}
                <div className="border-border bg-card rounded-[24px] p-4.5 shadow-(--ambient-shadow)">
                  <h3 className="text-foreground mb-3.5 flex items-center gap-2 text-[17px] font-black">
                    <SlidersHorizontal size={16} className="text-secondary" />
                    {t('tourismPointPage.quick_filters')}
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <Button
                      variant="ghost"
                      className={filterRowCls(!selectedCategoryId)}
                      onClick={() =>
                        setCurrentSettings({
                          selectedCategory: 0,
                          selectedSubcategory: 0,
                          page: 1,
                        })
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span className="bg-secondary inline-block h-2 w-2 rounded-full" />
                        {t('tourismPointPage.all')}
                      </span>
                      {!isLoading && !selectedCategoryId && total > 0 && (
                        <b className="text-secondary">{total}</b>
                      )}
                    </Button>

                    {categories.map((cat) => {
                      const isActive =
                        Number(currentSettings.selectedCategory) === Number(cat.id);
                      return (
                        <React.Fragment key={cat.id}>
                          <Button
                            variant="ghost"
                            className={filterRowCls(isActive)}
                            onClick={() => handleCategoryChange(String(cat.id))}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className="inline-block h-2 w-2 shrink-0 rounded-full"
                                style={{
                                  background: cat.color_hex || 'var(--muted-foreground)',
                                }}
                              />
                              {catName(cat)}
                            </span>
                            {isActive && selectedCategoryTotal > 0 && (
                              <b className="text-secondary">{selectedCategoryTotal}</b>
                            )}
                          </Button>

                          {isActive && subcategories.length > 0 && (
                            <div className="flex flex-col gap-1 pl-3">
                              {subcategories.map((sub) => {
                                const isSubActive =
                                  Number(selectedSubcategoryId) === Number(sub.id);
                                const count =
                                  subcategoryCountById.get(String(sub.id)) ?? 0;
                                return (
                                  <Button
                                    variant="ghost"
                                    key={sub.id}
                                    className={`flex w-full items-center justify-between rounded-[12px] px-3 py-2 text-[12px] font-bold transition-colors ${
                                      isSubActive
                                        ? 'bg-secondary/10 text-secondary'
                                        : 'text-foreground hover:bg-muted'
                                    }`}
                                    onClick={() =>
                                      setCurrentSettings({
                                        selectedSubcategory: sub.id,
                                        page: 1,
                                      })
                                    }
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                                      {catName(sub)}
                                    </span>
                                    {count > 0 && <b className="opacity-60">{count}</b>}
                                  </Button>
                                );
                              })}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>

            {/* ── Content ── */}
            <section>
              {/* Content head */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-foreground text-[20px] font-black sm:text-[25px]">
                  {selectedCat ? catName(selectedCat) : t('tourismPointPage.featured_list')}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground hidden text-sm sm:inline">
                    <strong className="text-foreground">{points.length}</strong>
                    {' / '}
                    {total} {t('tourismPointPage.results')}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-foreground hover:border-secondary hover:text-secondary border-border bg-card flex h-[38px] items-center gap-1.5 rounded-[14px] px-3 text-[13px] font-extrabold transition-colors"
                      >
                        {currentSettings.limit} {t('tourismPointPage.per_page')}
                        <ChevronDown size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-20">
                      {PAGE_SIZE_OPTIONS.map((n) => (
                        <DropdownMenuItem
                          key={n}
                          className={`justify-center ${currentSettings.limit === n ? 'text-secondary font-extrabold' : ''}`}
                          onClick={() => setCurrentSettings({ limit: n, page: 1 })}
                        >
                          {n}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Quick-access buttons */}
              <div className="mb-4 flex flex-wrap gap-2.5">
                <Button
                  variant="ghost"
                  className={quickBtnCls(!nearMe && !currentSettings.hasVr360)}
                  onClick={() => {
                    setNearMe(false);
                    setCurrentSettings({ hasVr360: false, page: 1 });
                  }}
                >
                  {t('tourismPointPage.all')}
                </Button>
                <Button
                  variant="ghost"
                  className={quickBtnCls(nearMe)}
                  onClick={handleToggleNearMe}
                  disabled={isGettingLocation}
                >
                  <Navigation size={13} className={nearMe ? '' : 'opacity-70'} />
                  {isGettingLocation
                    ? t('tourismPointPage.near_me_getting')
                    : t('tourismPointPage.near_me')}
                </Button>
              </div>

              {/* Cards */}
              {activeIsLoading ? (
                <div
                  className={
                    currentSettings.viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                      : 'flex flex-col gap-3'
                  }
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TourismPointSkeletonCard key={i} />
                  ))}
                </div>
              ) : activeIsError ? (
                <div className="py-20 text-center text-red-500">
                  {t('tourismPointPage.errorLoading')}
                </div>
              ) : points.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
                  <Inbox size={48} className="mb-4 opacity-30" />
                  <h3 className="text-foreground mb-1 text-[18px] font-black">
                    {t('tourismPointPage.no_results')}
                  </h3>
                  <p className="text-[13px]">{t('tourismPointPage.tryDifferentKeyword')}</p>
                </div>
              ) : (
                <div
                  className={
                    currentSettings.viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                      : 'flex flex-col gap-3'
                  }
                >
                  {points.map((p) => (
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
              )}

              {/* Pagination (hidden in near-me mode) */}
              {!nearMe && pages > 1 && (
                <div className="mt-[22px] flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    disabled={currentSettings.page <= 1}
                    onClick={() =>
                      setCurrentSettings({ page: Math.max(1, currentSettings.page - 1) })
                    }
                    className="text-secondary hover:bg-secondary border-border bg-card flex h-[38px] cursor-pointer items-center justify-center gap-1 rounded-full px-3 text-[13px] font-black transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-22.5 sm:px-4"
                  >
                    <ChevronLeft size={14} />
                    <span className="hidden sm:inline">{t('common.prev')}</span>
                  </Button>

                  {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                    const p =
                      currentSettings.page <= 3
                        ? i + 1
                        : currentSettings.page >= pages - 2
                          ? pages - 4 + i
                          : currentSettings.page - 2 + i;
                    if (p < 1 || p > pages) return null;
                    return (
                      <Button
                        variant="ghost"
                        key={p}
                        onClick={() => setCurrentSettings({ page: p })}
                        className={`flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border text-[13px] font-black transition-colors ${
                          p === currentSettings.page
                            ? 'bg-secondary border-transparent text-white hover:bg-secondary/90 hover:text-white'
                            : 'text-foreground hover:border-secondary hover:text-secondary bg-card'
                        }`}
                      >
                        {p}
                      </Button>
                    );
                  })}

                  <Button
                    variant="ghost"
                    disabled={currentSettings.page >= pages}
                    onClick={() =>
                      setCurrentSettings({ page: Math.min(pages, currentSettings.page + 1) })
                    }
                    className="text-secondary hover:bg-secondary border-border bg-card flex h-[38px] cursor-pointer items-center justify-center gap-1 rounded-full px-3 text-[13px] font-black transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-22.5 sm:px-4"
                  >
                    <span className="hidden sm:inline">{t('common.next')}</span>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </RootLayout>
  );
}
