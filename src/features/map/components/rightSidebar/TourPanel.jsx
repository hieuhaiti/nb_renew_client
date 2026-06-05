import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Clock3, Eye, Map, MapPin, Search, Star, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchPointById,
  fetchTourStopsByTourId,
  useTourPanelListQuery,
} from '@/services/api/map/tourPanelService';
import { useGetTourCurrentCapacity } from '@/services/api/capacity/capacityService';
import placeholderImg from '@/assets/images/placeholder.png';
import { useTourPanelStore } from '@/features/tours/store/useTourPanelStore';
import {
  formatTourDurationLabel,
  formatTourPriceLabel,
  normalizeTourListPayload,
} from '@/features/map/utils/tourPanelUtils';
import {
  createRouteFromPoints,
  normalizeTourRoutePoint,
} from '@/features/map/utils/highlightRouteUtils';
import { clearHighlightedRouteLayers } from '@/features/map/utils/MapHelper';
import { defaultLatLong, defaultZoom, pitchDefault } from '@/features/map/constant/mapConstant';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useMapStyleStore } from '@/features/map/store/useMapStyleStore';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { useMapPanelStore } from '@/features/map/store/useMapPanelStore';
import { cn, getLocaleFromLanguage, withBaseUrl } from '@/lib/utils';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { ScrollArea } from '@/components/ui/scroll-area';

function TourRowSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border border-[var(--event-panel-border)] bg-[var(--event-panel-card-bg)] p-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-8 w-28" />
    </div>
  );
}

function sortStops(stops) {
  const list = Array.isArray(stops) ? stops : [];
  return list
    .map((stop, index) => ({ stop, index }))
    .sort((a, b) => {
      const dayA = Number(a.stop?.day_number ?? 1);
      const dayB = Number(b.stop?.day_number ?? 1);
      if (dayA !== dayB) return dayA - dayB;

      const orderA = Number(
        a?.stop?.stop_order ?? a?.stop?.order_index ?? a?.stop?.index ?? a?.index + 1
      );
      const orderB = Number(
        b?.stop?.stop_order ?? b?.stop?.order_index ?? b?.stop?.index ?? b?.index + 1
      );
      if (!Number.isNaN(orderA) && !Number.isNaN(orderB) && orderA !== orderB) {
        return orderA - orderB;
      }
      return a.index - b.index;
    })
    .map((item) => item.stop);
}

function normalizeStopInput(stop, index) {
  if (stop && typeof stop === 'object') return stop;

  const pointId = stop == null ? null : String(stop);
  return {
    id: pointId || `tour-stop-${index + 1}`,
    point_id: pointId,
    stop_order: index + 1,
  };
}

function extractPointIdFromStop(stop) {
  if (stop == null) return null;
  if (typeof stop === 'string' || typeof stop === 'number') return String(stop);

  return (
    stop?.point_id ||
    stop?.spot_id ||
    stop?.spotId ||
    stop?.tourism_point_id ||
    stop?.destination_id ||
    stop?.location_id ||
    stop?.poi_id ||
    stop?.id ||
    stop?.spot?.id ||
    null
  );
}

function parseGeometryValue(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function buildStopRouteCandidate(stop, pointDetail) {
  const fallbackNameVi = stop?.title_vi || stop?.spot_name_vi || stop?.spot_name || '';
  const fallbackNameEn = stop?.title_en || stop?.spot_name_en || stop?.spot_name || '';
  const geometryFromStop =
    parseGeometryValue(stop?.geom_json) || parseGeometryValue(stop?.geom) || stop?.geometry || null;
  const resolvedPointId = extractPointIdFromStop(stop);

  return {
    ...(pointDetail || {}),
    ...(stop || {}),
    point_id:
      stop?.point_id ||
      stop?.spot_id ||
      stop?.spot?.id ||
      stop?.destination_id ||
      stop?.location_id ||
      resolvedPointId ||
      pointDetail?.id ||
      null,
    name_vi: pointDetail?.name_vi || fallbackNameVi,
    name_en: pointDetail?.name_en || fallbackNameEn,
    name: pointDetail?.name || fallbackNameVi || fallbackNameEn,
    address_vi: pointDetail?.address_vi || stop?.description_vi || '',
    address_en: pointDetail?.address_en || stop?.description_en || '',
    address: pointDetail?.address || stop?.description_vi || stop?.description_en || '',
    geometry_data:
      pointDetail?.geometry_data || pointDetail?.geometry || geometryFromStop || undefined,
  };
}

const TOUR_CAPACITY_STATUS_META = {
  overloaded: {
    labelKey: 'mapPage.capacityPanel.status.overloaded',
    toneClass: 'text-destructive',
    barStyle: { background: 'linear-gradient(90deg, #f87171, #b91c1c)' },
  },
  near_full: {
    labelKey: 'mapPage.capacityPanel.status.near_full',
    toneClass: 'text-orange-600',
    barStyle: { background: 'linear-gradient(90deg, var(--tertiary-1), var(--quaternary))' },
  },
  busy: {
    labelKey: 'mapPage.capacityPanel.status.busy',
    toneClass: 'text-warning',
    barStyle: { background: 'linear-gradient(90deg, var(--gold), var(--tertiary-2))' },
  },
  moderate: {
    labelKey: 'mapPage.capacityPanel.status.moderate',
    toneClass: 'text-sky-600',
    barStyle: { background: 'linear-gradient(90deg, var(--primary-1), var(--primary-2))' },
  },
  normal: {
    labelKey: 'mapPage.capacityPanel.status.normal',
    toneClass: 'text-emerald-600',
    barStyle: { background: 'linear-gradient(90deg, var(--secondary-1), var(--secondary-2))' },
  },
  low: {
    labelKey: 'mapPage.capacityPanel.status.low',
    toneClass: 'text-emerald-500',
    barStyle: { background: 'linear-gradient(90deg, #6ee7b7, var(--secondary-1))' },
  },
  unknown: {
    labelKey: 'mapPage.capacityPanel.status.unknown',
    toneClass: 'text-muted-foreground',
    barStyle: { background: 'linear-gradient(90deg, #94a3b8, #64748b)' },
  },
};

function getTourCapacityStatusMeta(status) {
  const key = String(status || 'unknown').toLowerCase();
  return TOUR_CAPACITY_STATUS_META[key] ?? TOUR_CAPACITY_STATUS_META.unknown;
}

function TourCapacitySummary({ tourId, t }) {
  const { data, isLoading, isError } = useGetTourCurrentCapacity(tourId, {
    enabled: Boolean(tourId),
    retry: 0,
  });

  const summary = data?.summary ?? null;
  const rawPct = summary?.route_capacity_pct;
  const hasPct = rawPct !== null && rawPct !== undefined && Number.isFinite(Number(rawPct));
  const pct = hasPct ? Math.max(0, Math.min(100, Math.round(Number(rawPct)))) : null;
  const statusMeta = getTourCapacityStatusMeta(summary?.status);
  const currentVisitors = Number(summary?.total_current_visitors ?? 0);
  const maxCapacity = Number(summary?.total_max_capacity ?? 0);
  const hasTotal = maxCapacity > 0;

  if (isLoading) {
    return <Skeleton className="h-12 w-full rounded-md" />;
  }

  if (isError || !summary) {
    return (
      <div className="rounded-md border border-dashed border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-2">
        <p className="typo-meta text-muted-foreground">{t('mapPage.tourPanel.capacityNoData')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 rounded-md border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-2">
      <div className="flex items-center justify-between gap-2">
        <p className="typo-meta text-muted-foreground">{t('mapPage.tourPanel.routeCapacity')}</p>
        <span className={cn('typo-meta font-semibold', statusMeta.toneClass)}>
          {t(statusMeta.labelKey)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="typo-meta text-muted-foreground inline-flex items-center gap-1">
          <Users className="h-3 w-3 shrink-0" />
          {hasTotal ? `${currentVisitors} / ${maxCapacity}` : `${currentVisitors}`}
        </span>
        <span className={cn('typo-meta font-semibold tabular-nums', statusMeta.toneClass)}>
          {pct != null ? `${pct}%` : '--'}
        </span>
      </div>

      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct ?? 0}%`, ...statusMeta.barStyle }}
        />
      </div>
    </div>
  );
}

export default function TourPanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);
  const locale = getLocaleFromLanguage(lang);

  const filters = useTourPanelStore((state) => state.filters);
  const selectedTour = useTourPanelStore((state) => state.selectedTour);
  const setTourPanelFilters = useTourPanelStore((state) => state.setTourPanelFilters);
  const setSelectedTour = useTourPanelStore((state) => state.setSelectedTour);
  const resetTourPanelFilters = useTourPanelStore((state) => state.resetTourPanelFilters);
  const openTourPanel = useMapPanelStore((s) => s.openTourPanel);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapRefObj = useMapStore((state) => state.mapRefObj);

  const highlightedRoute = useMapStore((state) => state.highlightedRoute);
  const setHighlightedRoute = useMapStore((state) => state.setHighlightedRoute);
  const clearHighlightedRoute = useMapStore((state) => state.clearHighlightedRoute);
  const showOnlyHighlightedRoute = useMapStore((state) => state.showOnlyHighlightedRoute);
  const setShowOnlyHighlightedRoute = useMapStore((state) => state.setShowOnlyHighlightedRoute);
  const clearDirections = useDirectionsStore((state) => state.clearDirections);

  const [debouncedSearch] = useDebounce(filters.search, 350);
  const [routeLoadingTourId, setRouteLoadingTourId] = useState(null);
  const featuredAsBoolean =
    filters.is_featured === 'all' ? undefined : filters.is_featured === 'featured';

  const {
    data: toursData,
    isLoading,
    isFetching,
    isError,
  } = useTourPanelListQuery({
    ...filters,
    search: debouncedSearch,
    is_featured: featuredAsBoolean,
  });

  const tours = useMemo(() => normalizeTourListPayload(toursData, { lang }), [toursData, lang]);
  const activeRouteTourId = highlightedRoute?.tourId ? String(highlightedRoute.tourId) : null;
  const handleOpenTourRoute = async (tour) => {
    if (!tour?.id) return;

    setSelectedTour({
      ...tour,
      cover_image_url: tour?.cover_image_url || null,
    });
    setRouteLoadingTourId(String(tour.id));

    try {
      const stops = await fetchTourStopsByTourId(tour.id);
      const sortedStops = sortStops(stops);

      if (sortedStops.length < 2) {
        throw new Error(t('mapPage.tourPanel.routeInsufficientStops'));
      }

      const routePoints = (
        await Promise.all(
          sortedStops.map(async (rawStop, index) => {
            const stop = normalizeStopInput(rawStop, index);
            const pointId = extractPointIdFromStop(stop);
            const embeddedPoint =
              stop?.spot && typeof stop.spot === 'object'
                ? stop.spot
                : stop?.point && typeof stop.point === 'object'
                  ? stop.point
                  : null;

            let pointDetail = embeddedPoint;
            if (!pointDetail && pointId) {
              try {
                pointDetail = await fetchPointById(pointId);
              } catch (_error) {
                pointDetail = null;
              }
            }

            const candidate = buildStopRouteCandidate(stop, pointDetail);
            return normalizeTourRoutePoint(candidate, index, lang);
          })
        )
      ).filter(Boolean);

      if (routePoints.length < 2) {
        throw new Error(t('mapPage.tourPanel.routeInsufficientStops'));
      }

      const routeResult = await createRouteFromPoints(
        routePoints,
        'driving',
        lang === 'en' ? 'en' : 'vi'
      );
      if (!routeResult?.geometry?.coordinates?.length) {
        throw new Error(t('mapPage.tourPanel.routeFailed'));
      }

      openTourPanel({ tourId: tour.id, tourName: tour.name, stops: sortedStops });
      clearDirections();
      setHighlightedRoute({
        type: 'tour',
        tourId: tour.id,
        tourSlug: tour.slug,
        tourName: tour.name,
        vehicle: 'driving',
        points: routePoints,
        geometry: routeResult.geometry,
        routeProperties: routeResult.properties,
        fullRoute: routeResult.fullRoute,
        meta: {
          tour_name: tour.name,
          total_stops: routePoints.length,
        },
      });
      setShowOnlyHighlightedRoute(true);

      toast.success(t('mapPage.tourPanel.routeReady'));
    } catch (error) {
      toast.error(error?.message || t('mapPage.tourPanel.routeFailed'));
    } finally {
      setRouteLoadingTourId(null);
    }
  };
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3">
      <div className="flex shrink-0 items-center justify-between gap-2 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
        <div>
          <p className="typo-section-title text-foreground">{t('mapPage.tourPanel.title')}</p>
          <p className="typo-meta text-muted-foreground">
            {isFetching
              ? t('mapPage.tourPanel.syncing')
              : t('mapPage.tourPanel.count', { count: tours.length })}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="typo-meta h-7"
          onClick={resetTourPanelFilters}
        >
          {t('mapPage.tourPanel.reset')}
        </Button>
      </div>

      {activeRouteTourId ? (
        <div className="grid shrink-0 grid-cols-2 gap-1.5 rounded-lg border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="typo-meta h-8 min-w-0 shrink overflow-hidden"
            onClick={() => setShowOnlyHighlightedRoute(!showOnlyHighlightedRoute)}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="truncate">
              {showOnlyHighlightedRoute
                ? t('mapPage.tourPanel.showOtherPoints')
                : t('mapPage.tourPanel.hideOtherPoints')}
            </span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="typo-meta h-8"
            onClick={() => {
              const resolvedMap = mapRef || mapRefObj?.current?.single || null;
              if (resolvedMap) {
                clearHighlightedRouteLayers(resolvedMap);
              }
              clearHighlightedRoute();
              useMapPanelStore.getState().clearPanel();

              const mapRefObjCurrent = mapRefObj?.current;
              const maps = [resolvedMap, mapRefObjCurrent?.single, mapRefObjCurrent?.split].filter(
                (instance, index, all) => instance && all.indexOf(instance) === index
              );
              const terrainState = useMapStyleStore.getState().terrainState;
              maps.forEach((mapInstance) => {
                mapInstance.flyTo({
                  center: defaultLatLong,
                  zoom: defaultZoom,
                  pitch: pitchDefault(terrainState),
                  bearing: 0,
                });
              });

              toast.info(t('mapPage.tourPanel.routeCleared'));
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('mapPage.tourPanel.clearRoute')}
          </Button>
        </div>
      ) : null}

      <div className="shrink-0 space-y-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(event) => setTourPanelFilters({ search: event.target.value, page: 1 })}
            placeholder={t('mapPage.tourPanel.searchPlaceholder')}
            className="h-9 border-[var(--event-panel-border)] bg-[var(--event-panel-control-bg)] pr-2 pl-8 text-sm"
          />
        </div>

        <Select
          value={filters.is_featured}
          onValueChange={(value) => setTourPanelFilters({ is_featured: value, page: 1 })}
        >
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="featured">{t('mapPage.tourPanel.featuredOnly')}</SelectItem>
            <SelectItem value="regular">{t('mapPage.tourPanel.nonFeatured')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <TourRowSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="typo-meta text-muted-foreground rounded-xl border border-dashed border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-4 text-center">
            {t('mapPage.tourPanel.error')}
          </div>
        ) : tours.length === 0 ? (
          <div className="typo-meta text-muted-foreground rounded-xl border border-dashed border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-4 text-center">
            {t('mapPage.tourPanel.empty')}
          </div>
        ) : (
          <div className="space-y-2 pr-0.5">
            {tours.map((tour) => {
              const isSelected =
                selectedTour != null && String(selectedTour.id) === String(tour.id);
              const isRouteActive =
                activeRouteTourId != null && String(activeRouteTourId) === String(tour.id);
              const isRouteLoading =
                routeLoadingTourId != null && String(routeLoadingTourId) === String(tour.id);
              const imageUrl = withBaseUrl(tour.main_image_url);

              return (
                <article
                  key={tour.id}
                  className={cn(
                    'space-y-2 rounded-xl border p-3 shadow-sm transition-colors',
                    isRouteActive || isSelected
                      ? 'border-[var(--event-panel-active-border)] bg-[var(--event-panel-active-bg)]'
                      : 'border-[var(--event-panel-border)] bg-[var(--event-panel-card-bg)] hover:bg-[var(--event-panel-card-hover-bg)]'
                  )}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={tour.name}
                      className="h-28 w-full rounded-lg object-cover"
                      onError={(event) => {
                        event.target.onerror = null;
                        event.target.src = placeholderImg;
                      }}
                    />
                  ) : null}

                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="typo-body text-foreground line-clamp-2 min-w-0 font-semibold">
                        {tour.name}
                      </h4>
                      {tour.is_featured && (
                        <Badge variant="secondary" className="shrink-0 gap-1">
                          <Star className="fill-gold text-gold h-3 w-3" />
                          {t('tourPage.featured')}
                        </Badge>
                      )}
                    </div>

                    <p className="typo-meta text-muted-foreground flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 shrink-0" />
                      {formatTourDurationLabel(tour, t)}
                    </p>

                    {(tour.start_location || tour.end_location) && (
                      <p className="typo-meta text-muted-foreground line-clamp-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {tour.start_location && tour.end_location
                          ? t('mapPage.tourPanel.routeSummary', {
                              from: tour.start_location,
                              to: tour.end_location,
                            })
                          : tour.start_location || tour.end_location}
                      </p>
                    )}

                    <p
                      className="typo-body text-muted-foreground line-clamp-3"
                      title={tour.description || ''}
                    >
                      {tour.description || t('tourPage.noDescription')}
                    </p>

                    <div className="typo-body text-foreground font-semibold">
                      {formatTourPriceLabel(tour, locale)}
                    </div>

                    <TourCapacitySummary tourId={tour.id} t={t} />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      className="typo-meta h-8"
                      disabled={isRouteLoading}
                      onClick={() => handleOpenTourRoute(tour)}
                    >
                      <Map className="h-3.5 w-3.5" />
                      {isRouteLoading
                        ? t('mapPage.tourPanel.loadingRoute')
                        : t('mapPage.tourPanel.openTourOnMap')}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="typo-meta h-8"
                      onClick={() => navigate(`/tour/${tour.slug}`)}
                    >
                      {t('tourismPointPage.view_detail')}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
