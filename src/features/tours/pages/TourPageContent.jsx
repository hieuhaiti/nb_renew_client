import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Inbox,
  LayoutGrid,
  List,
  Users,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import RootLayout from '@/components/layout/RootLayout';
import { useGetAllTours } from '@/services/api/tours/tourApi';
import { useDebounce } from 'use-debounce';
import { formatVND, withBaseUrl } from '@/lib/utils';
import { uiConfig } from '@/config/ui';
import { useLanguageStore } from '@/stores/useLanguageStore';
import placeholderImg from '@/assets/images/placeholder.png';

function getTourName(tour, lang) {
  return lang === 'en'
    ? tour?.name_en || tour?.name_vi || ''
    : tour?.name_vi || tour?.name_en || '';
}

function getTourImage(tour) {
  return withBaseUrl(tour?.cover_image_url || '') || placeholderImg;
}

function formatPrice(tour) {
  const price = Number(tour?.price_from_vnd ?? 0);
  if (!Number.isFinite(price) || price <= 0) return null;
  return formatVND(price);
}

function SkeletonCard({ isList }) {
  return (
    <div
      className={`border-border bg-card animate-pulse overflow-hidden rounded-xl border ${
        isList ? 'flex items-center gap-4 p-3' : ''
      }`}
    >
      <div className={`${isList ? 'h-28 w-28 rounded-lg' : 'h-44 w-full'} bg-muted`} />
      <div className={`p-4 ${isList ? 'flex-1 p-0' : ''}`}>
        <div className="bg-muted h-5 w-3/4 rounded" />
        <div className="bg-muted mt-3 h-4 w-full rounded" />
        <div className="bg-muted mt-2 h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

export default function TourPageContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);

  const [currentSettings, setCurrentSettings] = useState({
    viewMode: 'grid',
    page: 1,
    limit: 12,
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search.trim(), uiConfig.search.tourPageDebounceMs);

  const { data, isLoading, isError, refetch, isFetching } = useGetAllTours({
    page: currentSettings.page,
    limit: currentSettings.limit,
    search: debouncedSearch || undefined,
  });

  const tours = useMemo(() => data?.tours || [], [data]);
  const paginationFromApi = data?.pagination || null;
  const total = paginationFromApi?.total ?? tours.length;
  const pages =
    paginationFromApi?.totalPages ?? Math.max(1, Math.ceil(total / currentSettings.limit));

  const visibleTours = useMemo(() => {
    if (!tours.length) return [];
    if (paginationFromApi) return tours;
    const start = (currentSettings.page - 1) * currentSettings.limit;
    return tours.slice(start, start + currentSettings.limit);
  }, [tours, currentSettings.page, currentSettings.limit, paginationFromApi]);

  const featuredTour = currentSettings.viewMode === 'grid' ? visibleTours[0] || null : null;
  const gridTours = currentSettings.viewMode === 'grid' ? visibleTours.slice(1) : visibleTours;

  const handleOpenDetail = (slug) => {
    if (!slug) return;
    navigate(`/tour/${slug}`);
  };

  return (
    <RootLayout>
      <div className="bg-background min-h-screen">
        {/* Hero banner */}
        <div className="bg-primary text-primary-foreground relative w-full shrink-0 overflow-hidden py-8">
          <div className="bg-primary/10 pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/4 -translate-y-1/4 rounded-full blur-3xl" />
          <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 translate-y-1/3 rounded-full blur-2xl" />

          <div className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:items-end lg:px-8">
            <div className="space-y-2 lg:max-w-xl">
              <h1 className="text-primary-foreground text-3xl font-bold">
                {t('tourPage.title', 'Tour du lịch')}
              </h1>
              <p className="text-primary-foreground/80 text-sm leading-relaxed font-medium">
                {t('tourPage.description', 'Khám phá các tour du lịch Ninh Bình')}
              </p>
            </div>

            <div className="border-border bg-card/90 rounded-3xl border p-4 shadow-sm backdrop-blur md:p-5">
              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={16}
                    className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                  />
                  <Input
                    size="toolbar"
                    type="text"
                    placeholder={t('tourPage.searchPlaceholder', 'Tìm kiếm tour...')}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentSettings((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="border-border bg-background/90 focus-visible:ring-primary pr-9 pl-9 shadow-none"
                  />
                  {search ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-1/2 right-1.5 h-7 w-7 -translate-y-1/2"
                      onClick={() => setSearch('')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-sm font-medium">
                    <SlidersHorizontal size={13} />
                    {t('tourPage.view', 'Hiển thị')}
                  </span>
                  <Button
                    size="sm"
                    variant={currentSettings.viewMode === 'grid' ? 'default' : 'outline'}
                    className="gap-1.5 rounded-full"
                    onClick={() => setCurrentSettings((prev) => ({ ...prev, viewMode: 'grid' }))}
                    aria-label={t('tourPage.gridView', 'Dạng lưới')}
                  >
                    <LayoutGrid size={14} />
                    {t('tourPage.gridView', 'Lưới')}
                  </Button>
                  <Button
                    size="sm"
                    variant={currentSettings.viewMode === 'list' ? 'default' : 'outline'}
                    className="gap-1.5 rounded-full"
                    onClick={() => setCurrentSettings((prev) => ({ ...prev, viewMode: 'list' }))}
                    aria-label={t('tourPage.listView', 'Dạng danh sách')}
                  >
                    <List size={14} />
                    {t('tourPage.listView', 'Danh sách')}
                  </Button>
                </div>

                <Button
                  variant="default"
                  className="flex items-center gap-2 rounded-full px-6 shadow-sm"
                  onClick={() => refetch?.()}
                  disabled={isFetching}
                >
                  <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
                  {t('tourPage.refresh', 'Làm mới')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-background w-full flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-muted-foreground mb-6 flex items-center justify-between text-sm">
              <div>
                {t('tourPage.showing', 'Hiển thị')}{' '}
                <b className="text-foreground">
                  {visibleTours.length} / {total}
                </b>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-5 pb-10">
                {currentSettings.viewMode === 'grid' && (
                  <div className="bg-muted h-72 w-full animate-pulse rounded-2xl" />
                )}
                <div
                  className={
                    currentSettings.viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                      : 'flex flex-col gap-4'
                  }
                >
                  {Array.from({ length: currentSettings.limit }).map((_, i) => (
                    <SkeletonCard key={i} isList={currentSettings.viewMode === 'list'} />
                  ))}
                </div>
              </div>
            ) : isError ? (
              <div className="text-destructive py-20 text-center">
                {t('tourPage.errorLoading', 'Không thể tải danh sách tour')}
              </div>
            ) : !visibleTours.length ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
                <Inbox size={48} className="mb-4 opacity-40" />
                <h3 className="text-foreground text-lg font-semibold">
                  {t('tourPage.noTours', 'Không tìm thấy tour nào')}
                </h3>
              </div>
            ) : (
              <div className="flex flex-col gap-5 pb-10">
                {/* Featured hero card */}
                {featuredTour && (
                  <div
                    className="bg-card border-border group flex cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md md:flex-row"
                    onClick={() => handleOpenDetail(featuredTour.slug)}
                  >
                    <div className="bg-muted relative min-h-65 w-full overflow-hidden md:w-[58%]">
                      <img
                        src={getTourImage(featuredTour)}
                        alt={getTourName(featuredTour, lang) || t('tourPage.unknown', 'Tour')}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                      {featuredTour.is_featured && (
                        <Badge className="bg-primary text-primary-foreground absolute top-3 left-3">
                          <Star size={11} className="mr-1 fill-yellow-400 text-yellow-400" />
                          {t('tourPage.featured', 'Nổi bật')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <div className="mb-1 flex items-start justify-between gap-3">
                        <h2
                          className="text-foreground line-clamp-1 text-2xl font-bold"
                          title={getTourName(featuredTour, lang)}
                        >
                          {getTourName(featuredTour, lang) || t('tourPage.unknown', 'Tour')}
                        </h2>
                        {Number(featuredTour.rating_avg) > 0 && (
                          <div className="text-primary flex shrink-0 items-center gap-1 text-sm font-medium">
                            <Star size={13} className="fill-yellow-400 text-yellow-400" />
                            {Number(featuredTour.rating_avg).toFixed(1)}
                          </div>
                        )}
                      </div>

                      {featuredTour.business_name && (
                        <p className="text-muted-foreground mb-2 text-sm">
                          {featuredTour.business_name}
                        </p>
                      )}

                      <p className="text-muted-foreground mb-5 line-clamp-3 text-sm leading-relaxed">
                        {featuredTour.description_vi ||
                          t('tourPage.noDescription', 'Chưa có mô tả')}
                      </p>

                      <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-3 text-sm">
                        {featuredTour.start_location_vi && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} />
                            {featuredTour.start_location_vi}
                          </span>
                        )}
                        {featuredTour.duration_days && (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={14} />
                            {featuredTour.duration_days} {t('tourPage.days', 'ngày')}
                          </span>
                        )}
                        {featuredTour.max_guests && (
                          <span className="inline-flex items-center gap-1.5">
                            <Users size={14} />
                            {featuredTour.max_guests} {t('tourPage.people', 'người')}
                          </span>
                        )}
                      </div>

                      {formatPrice(featuredTour) && (
                        <div className="text-primary mt-3 text-lg font-bold">
                          {formatPrice(featuredTour)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Grid / list */}
                <div
                  className={
                    currentSettings.viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                      : 'flex flex-col gap-4'
                  }
                >
                  {gridTours.map((tour) => {
                    const isList = currentSettings.viewMode === 'list';
                    const name = getTourName(tour, lang);
                    const price = formatPrice(tour);

                    return (
                      <div
                        key={tour.id}
                        className={`bg-card border-border group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md ${
                          isList ? 'flex items-center gap-4 p-3' : ''
                        }`}
                        onClick={() => handleOpenDetail(tour.slug)}
                      >
                        <div
                          className={`bg-muted relative overflow-hidden ${
                            isList ? 'h-28 w-28 shrink-0 rounded-lg' : 'h-44 w-full'
                          }`}
                        >
                          <img
                            src={getTourImage(tour)}
                            alt={name || t('tourPage.unknown', 'Tour')}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = placeholderImg;
                            }}
                          />
                          {tour.is_featured && !isList && (
                            <Badge className="bg-primary text-primary-foreground absolute top-2 left-2 text-sm">
                              <Star size={10} className="mr-1 fill-yellow-400 text-yellow-400" />
                              {t('tourPage.featured', 'Nổi bật')}
                            </Badge>
                          )}
                        </div>

                        <div className={isList ? 'min-w-0 flex-1 py-1' : 'p-4'}>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-foreground line-clamp-1 font-semibold" title={name}>
                              {name || t('tourPage.unknown', 'Tour')}
                            </h3>
                            {Number(tour.rating_avg) > 0 && (
                              <span className="text-primary inline-flex shrink-0 items-center gap-1 text-sm font-medium">
                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                {Number(tour.rating_avg).toFixed(1)}
                              </span>
                            )}
                          </div>

                          {tour.business_name && (
                            <p
                              className="text-muted-foreground mt-0.5 truncate text-sm"
                              title={tour.business_name}
                            >
                              {tour.business_name}
                            </p>
                          )}

                          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                            {tour.description_vi || t('tourPage.noDescription', 'Chưa có mô tả')}
                          </p>

                          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-sm">
                            {tour.start_location_vi && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} />
                                <span className="line-clamp-1">{tour.start_location_vi}</span>
                              </span>
                            )}
                            {tour.duration_days && (
                              <span className="inline-flex items-center gap-1">
                                <Clock size={12} />
                                {tour.duration_days} {t('tourPage.days', 'ngày')}
                              </span>
                            )}
                          </div>

                          {price && (
                            <div className="text-primary mt-2 text-sm font-semibold">{price}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="border-border mt-8 flex items-center justify-between border-t pt-6 font-medium">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentSettings((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                  }
                  disabled={currentSettings.page <= 1}
                  className="rounded-full"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  {t('common.prev', 'Trước')}
                </Button>
                <div className="bg-card border-border rounded-full border px-4 py-1.5 text-sm">
                  {currentSettings.page} / {pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentSettings((prev) => ({
                      ...prev,
                      page: Math.min(pages, prev.page + 1),
                    }))
                  }
                  disabled={currentSettings.page >= pages}
                  className="rounded-full"
                >
                  {t('common.next', 'Sau')}
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
