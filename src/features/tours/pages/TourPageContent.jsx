import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Star,
  MapPin,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Inbox,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RootLayout from '@/components/layout/RootLayout';
import { useGetAllTours } from '@/features/tours/api/tourApi';
import { useDebounce } from 'use-debounce';
import { formatVND, withBaseUrl } from '@/lib/utils';
import { uiConfig } from '@/config/ui';
import placeholderImg from '@/assets/images/placeholder.png';

function stripHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTourImage(tour) {
  const imagePath = tour?.main_image_url || tour?.main_image || '';
  return withBaseUrl(imagePath) || placeholderImg;
}

function getTourDurationLabel(tour, t) {
  if (tour?.duration_days) {
    return `${tour.duration_days} ${t('tourPage.days', 'days')}`;
  }
  if (tour?.duration_hours) {
    return `${tour.duration_hours} ${t('tourPage.hours', 'hours')}`;
  }
  return null;
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

export default function TourPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const tours = useMemo(() => data?.data?.tours || data?.tours || [], [data]);
  const paginationFromApi = data?.data?.pagination || null;
  const total = paginationFromApi?.total ?? tours.length;
  const pages = paginationFromApi?.pages ?? Math.max(1, Math.ceil(total / currentSettings.limit));

  const visibleTours = useMemo(() => {
    if (!tours.length) return [];
    if (paginationFromApi) return tours;

    const start = (currentSettings.page - 1) * currentSettings.limit;
    return tours.slice(start, start + currentSettings.limit);
  }, [tours, currentSettings.page, currentSettings.limit, paginationFromApi]);

  const featuredTour = currentSettings.viewMode === 'grid' ? visibleTours[0] || null : null;
  const gridTours = currentSettings.viewMode === 'grid' ? visibleTours.slice(1) : visibleTours;

  const handleOpenDetail = (tourId) => {
    if (!tourId) return;
    navigate(`/tour/${tourId}`);
  };

  return (
    <RootLayout>
      <div className="bg-background min-h-screen">
        <div className="bg-primary relative w-full shrink-0 overflow-hidden py-8">
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h1 className="text-primary-foreground mb-2 text-3xl font-bold">
                {t('tourPage.title', 'Tour routes')}
              </h1>
              <p className="text-primary-foreground/90 mb-4 text-sm font-medium">
                {t('tourPage.description', 'Explore available tour routes from live system data')}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 rounded-full border px-3 py-1.5 text-xs font-medium">
                  {t('tourPage.total', 'Total routes')}: {total}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-primary-foreground/50 bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-6 shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:text-[var(--primary-foreground)]"
              onClick={() => refetch?.()}
              disabled={isFetching}
            >
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
              {t('tourPage.refresh', 'Refresh')}
            </Button>
          </div>
          <div className="bg-primary-foreground/5 pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/4 -translate-y-1/4 rounded-full blur-3xl" />
        </div>

        <div className="border-border bg-background sticky top-16 z-20 w-full shrink-0 border-b pt-4 pb-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
              <div className="relative w-full md:w-105">
                <Search
                  size={18}
                  className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
                />
                <Input
                  type="text"
                  placeholder={t('tourPage.searchPlaceholder', 'Search tour routes...')}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentSettings((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="bg-background border-border placeholder:text-muted-foreground h-10 w-full rounded-full pl-10 text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="border-border bg-background flex h-9 items-center overflow-hidden rounded-md border p-0.5 shadow-sm">
                  <Button
                    variant={currentSettings.viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-full w-8 rounded-sm rounded-r-none"
                    onClick={() => setCurrentSettings((prev) => ({ ...prev, viewMode: 'grid' }))}
                    aria-label={t('tourPage.gridView', 'Grid view')}
                  >
                    <LayoutGrid size={15} />
                  </Button>
                  <div className="bg-border h-4 w-px" />
                  <Button
                    variant={currentSettings.viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-full w-8 rounded-sm rounded-l-none"
                    onClick={() => setCurrentSettings((prev) => ({ ...prev, viewMode: 'list' }))}
                    aria-label={t('tourPage.listView', 'List view')}
                  >
                    <List size={15} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background w-full flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-muted-foreground mb-6 flex items-center justify-between text-sm">
              <div>
                {t('tourPage.showing', 'Showing')}{' '}
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
                {t('tourPage.errorLoading', 'Failed to load tours')}
              </div>
            ) : !visibleTours.length ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
                <Inbox size={48} className="mb-4 opacity-40" />
                <h3 className="text-foreground text-lg font-semibold">
                  {t('tourPage.noTours', 'No tours found')}
                </h3>
              </div>
            ) : (
              <div className="flex flex-col gap-5 pb-10">
                {featuredTour && (
                  <div
                    className="bg-card border-border group flex cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md md:flex-row"
                    onClick={() => handleOpenDetail(featuredTour.id)}
                  >
                    <div className="bg-muted relative min-h-65 w-full overflow-hidden md:w-[58%]">
                      <img
                        src={getTourImage(featuredTour)}
                        alt={featuredTour.name || t('tourPage.unknown', 'Unknown')}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = placeholderImg;
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h2 className="text-foreground line-clamp-1 text-2xl font-bold">
                          {featuredTour.name || t('tourPage.unknown', 'Unknown')}
                        </h2>
                        <div className="text-primary flex shrink-0 items-center text-xs font-medium">
                          <Star size={13} className="text-primary mr-1" />
                          {featuredTour?.average_rating
                            ? Number(featuredTour.average_rating).toFixed(1)
                            : '-'}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-5 line-clamp-3 text-sm leading-relaxed">
                        {stripHtml(featuredTour.description) ||
                          t('tourPage.noDescription', 'No description')}
                      </p>

                      <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-3 text-sm">
                        {featuredTour?.address && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} />
                            {featuredTour.address}
                          </span>
                        )}

                        {getTourDurationLabel(featuredTour, t) && (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={14} />
                            {getTourDurationLabel(featuredTour, t)}
                          </span>
                        )}

                        {featuredTour?.price ? (
                          <span className="text-foreground inline-flex items-center gap-1.5 font-semibold">
                            <DollarSign size={14} />
                            {formatVND(featuredTour.price)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={
                    currentSettings.viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
                      : 'flex flex-col gap-4'
                  }
                >
                  {gridTours.map((tour) => {
                    const isList = currentSettings.viewMode === 'list';
                    const descriptionText =
                      stripHtml(tour.description) || t('tourPage.noDescription', 'No description');

                    return (
                      <div
                        key={tour.id}
                        className={`bg-card border-border group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md ${
                          isList ? 'flex items-center gap-4 p-3' : ''
                        }`}
                        onClick={() => handleOpenDetail(tour.id)}
                      >
                        <div
                          className={`bg-muted relative overflow-hidden ${
                            isList ? 'h-28 w-28 shrink-0 rounded-lg' : 'h-44 w-full'
                          }`}
                        >
                          <img
                            src={getTourImage(tour)}
                            alt={tour.name || t('tourPage.unknown', 'Unknown')}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = placeholderImg;
                            }}
                          />
                        </div>

                        <div className={isList ? 'flex-1 py-1' : 'p-4'}>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-foreground line-clamp-1 font-semibold">
                              {tour.name || t('tourPage.unknown', 'Unknown')}
                            </h3>
                            <span className="text-primary inline-flex shrink-0 items-center gap-1 text-xs font-medium">
                              <Star size={12} className="text-primary" />
                              {tour?.average_rating ? Number(tour.average_rating).toFixed(1) : '-'}
                            </span>
                          </div>

                          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                            {descriptionText}
                          </p>

                          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-xs">
                            {getTourDurationLabel(tour, t) && (
                              <span className="inline-flex items-center gap-1">
                                <Clock size={12} />
                                {getTourDurationLabel(tour, t)}
                              </span>
                            )}

                            {tour?.address && (
                              <span className="line-clamp-1 inline-flex items-center gap-1">
                                <MapPin size={12} />
                                {tour.address}
                              </span>
                            )}

                            {tour?.price ? (
                              <span className="text-foreground inline-flex items-center gap-1 font-semibold">
                                <DollarSign size={12} />
                                {formatVND(tour.price)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pages > 1 && (
              <div className="border-border mt-8 flex items-center justify-between border-t pt-6 font-medium">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentSettings((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={currentSettings.page <= 1}
                  className="rounded-full"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  {t('common.prev', 'Prev')}
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
                  {t('common.next', 'Next')}
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
