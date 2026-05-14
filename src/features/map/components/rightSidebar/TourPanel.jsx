import { useMemo, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useDebounce } from 'use-debounce';
import { Clock3, Eye, Map, MapPin, Search, Star, Trash2 } from 'lucide-react';
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
import placeholderImg from '@/assets/images/placeholder.png';
import { useTourPanelStore } from '@/features/tours/store/useTourPanelStore';
import {
  formatTourDurationLabel,
  formatTourPriceLabel,
  normalizeTourListPayload,
} from '@/features/map/utils/tourPanelUtils';
import {
  buildHighlightRoutePointsFeatureCollection,
  createRouteFromPoints,
  normalizeTourRoutePoint,
} from '@/features/map/utils/highlightRouteUtils';
import {
  addOrUpdateHighlightedRouteLayers,
  clearHighlightedRouteLayers,
} from '@/features/map/utils/MapHelper';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { useMapPanelStore } from '@/features/map/store/useMapPanelStore';
import { cn, getLocaleFromLanguage, withBaseUrl } from '@/lib/utils';
import { useLanguageStore } from '@/stores/useLanguageStore';

function TourRowSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-3">
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
        throw new Error(
          t('mapPage.tourPanel.routeInsufficientStops', {
            defaultValue: 'Tour cần ít nhất 2 điểm dừng để hiển thị chỉ đường.',
          })
        );
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
        throw new Error(
          t('mapPage.tourPanel.routeInsufficientStops', {
            defaultValue: 'Tour cần ít nhất 2 điểm dừng để hiển thị chỉ đường.',
          })
        );
      }

      const routeResult = await createRouteFromPoints(
        routePoints,
        'driving',
        lang === 'en' ? 'en' : 'vi'
      );
      if (!routeResult?.geometry?.coordinates?.length) {
        throw new Error(
          t('mapPage.tourPanel.routeFailed', {
            defaultValue: 'Không thể hiển thị tuyến tour lúc này.',
          })
        );
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

      const resolvedMap = mapRef || mapRefObj?.current?.single || null;
      const drawRouteOnMap = (targetMap) => {
        if (!targetMap) return;

        const routeFeature = {
          type: 'Feature',
          geometry: routeResult.geometry,
          properties: {
            ...(routeResult.properties || {}),
            tour_name: tour.name,
            total_stops: routePoints.length,
          },
        };
        const routePointsFeatureCollection = buildHighlightRoutePointsFeatureCollection(
          routeResult.points?.length ? routeResult.points : routePoints
        );

        clearHighlightedRouteLayers(targetMap);
        addOrUpdateHighlightedRouteLayers(targetMap, {
          routeFeature,
          routePointsFeatureCollection,
        });

        const coordinates = routeResult.geometry.coordinates;
        if (Array.isArray(coordinates) && coordinates.length > 1) {
          const bounds = coordinates.reduce(
            (acc, coord) => acc.extend(coord),
            new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
          );

          targetMap.fitBounds(bounds, {
            padding: 88,
            duration: 850,
          });
        }
      };

      if (resolvedMap?.isStyleLoaded?.()) {
        try {
          drawRouteOnMap(resolvedMap);
        } catch (_drawError) {}
      } else if (resolvedMap) {
        resolvedMap.once('style.load', () => {
          try {
            drawRouteOnMap(resolvedMap);
          } catch (_drawError) {}
        });
      }

      toast.success(
        t('mapPage.tourPanel.routeReady', {
          defaultValue: 'Đã hiển thị tuyến tour trên bản đồ.',
        })
      );
    } catch (error) {
      toast.error(
        error?.message ||
          t('mapPage.tourPanel.routeFailed', {
            defaultValue: 'Không thể hiển thị tuyến tour lúc này.',
          })
      );
    } finally {
      setRouteLoadingTourId(null);
    }
  };
  return (
    <div className="space-y-3 rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
        <div>
          <p className="typo-section-title text-foreground">
            {t('mapPage.tourPanel.title', { defaultValue: 'Tour du lịch' })}
          </p>
          <p className="typo-meta text-muted-foreground">
            {isFetching
              ? t('mapPage.tourPanel.syncing', { defaultValue: 'Đang đồng bộ...' })
              : t('mapPage.tourPanel.count', {
                  defaultValue: '{{count}} tour',
                  count: tours.length,
                })}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="typo-meta h-7"
          onClick={resetTourPanelFilters}
        >
          {t('mapPage.tourPanel.reset', { defaultValue: 'Đặt lại' })}
        </Button>
      </div>

      {activeRouteTourId ? (
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border p-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="typo-meta h-8"
            onClick={() => setShowOnlyHighlightedRoute(!showOnlyHighlightedRoute)}
          >
            <Eye className="h-3.5 w-3.5" />
            {showOnlyHighlightedRoute
              ? t('mapPage.tourPanel.showOtherPoints', {
                  defaultValue: 'Hiện điểm khác',
                })
              : t('mapPage.tourPanel.hideOtherPoints', {
                  defaultValue: 'Ẩn điểm khác',
                })}
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
              toast.info(
                t('mapPage.tourPanel.routeCleared', {
                  defaultValue: 'Đã xóa tuyến tour khỏi bản đồ.',
                })
              );
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('mapPage.tourPanel.clearRoute', { defaultValue: 'Xóa tuyến' })}
          </Button>
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(event) => setTourPanelFilters({ search: event.target.value, page: 1 })}
            placeholder={t('mapPage.tourPanel.searchPlaceholder', {
              defaultValue: 'Tìm tour...',
            })}
            className="h-9 pr-2 pl-8 text-sm"
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
            <SelectItem value="all">{t('common.all', { defaultValue: 'All' })}</SelectItem>
            <SelectItem value="featured">
              {t('mapPage.tourPanel.featuredOnly', { defaultValue: 'Nổi bật' })}
            </SelectItem>
            <SelectItem value="regular">
              {t('mapPage.tourPanel.nonFeatured', { defaultValue: 'Không nổi bật' })}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <TourRowSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="typo-meta text-muted-foreground rounded-xl border border-dashed p-4 text-center">
          {t('mapPage.tourPanel.error', { defaultValue: 'Không thể tải danh sách tour.' })}
        </div>
      ) : tours.length === 0 ? (
        <div className="typo-meta text-muted-foreground rounded-xl border border-dashed p-4 text-center">
          {t('mapPage.tourPanel.empty', { defaultValue: 'Không có tour phù hợp với bộ lọc.' })}
        </div>
      ) : (
        <div className="space-y-2 pr-0.5">
          {tours.map((tour) => {
            const isSelected = selectedTour != null && String(selectedTour.id) === String(tour.id);
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
                  isRouteActive
                    ? 'border-primary/60 bg-primary/5'
                    : isSelected
                      ? 'border-border bg-muted/20'
                      : 'from-card to-muted/10 hover:bg-muted/40 bg-linear-to-b'
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
                    <h4
                      className="typo-body text-foreground truncate font-semibold"
                      title={tour.name}
                    >
                      {tour.name}
                    </h4>
                    {tour.is_featured && (
                      <Badge variant="secondary" className="shrink-0 gap-1">
                        <Star className="fill-gold text-gold h-3 w-3" />
                        {t('tourPage.featured', { defaultValue: 'Featured' })}
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
                            defaultValue: '{{from}} → {{to}}',
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
                    {tour.description ||
                      t('tourPage.noDescription', { defaultValue: 'No description' })}
                  </p>

                  <div className="typo-body text-foreground font-semibold">
                    {formatTourPriceLabel(tour, locale)}
                  </div>
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
                      ? t('mapPage.tourPanel.loadingRoute', { defaultValue: 'Đang mở...' })
                      : t('mapPage.tourPanel.openTourOnMap', {
                          defaultValue: 'Mở tour trên bản đồ',
                        })}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="typo-meta h-8"
                    onClick={() => navigate(`/tour/${tour.slug}`)}
                  >
                    {t('tourismPointPage.view_detail', { defaultValue: 'Xem chi tiết' })}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
