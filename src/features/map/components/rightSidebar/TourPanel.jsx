import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Clock3, Eye, Route, Search, Star, Trash2 } from 'lucide-react';
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
import { normalizeTourRoutePoint } from '@/features/map/utils/highlightRouteUtils';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
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
  return [...stops].sort((a, b) => {
    const orderA = Number(a?.stop_order ?? a?.order_index ?? a?.index ?? 0);
    const orderB = Number(b?.stop_order ?? b?.order_index ?? b?.index ?? 0);
    if (!Number.isNaN(orderA) && !Number.isNaN(orderB) && orderA !== orderB) {
      return orderA - orderB;
    }
    return String(a?.id || '').localeCompare(String(b?.id || ''));
  });
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

  return {
    ...(pointDetail || {}),
    ...(stop || {}),
    point_id:
      stop?.point_id ||
      stop?.spot_id ||
      stop?.destination_id ||
      stop?.location_id ||
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

    setSelectedTour(tour);
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
          sortedStops.map(async (stop, index) => {
            const pointId =
              stop?.point_id || stop?.spot_id || stop?.destination_id || stop?.location_id || null;

            let pointDetail = null;
            if (pointId) {
              try {
                pointDetail = await fetchPointById(pointId);
              } catch (_error) {
                pointDetail = null;
              }
            }

            const normalized = normalizeTourRoutePoint(
              buildStopRouteCandidate(stop, pointDetail),
              index,
              lang
            );

            return normalized;
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

      clearDirections();
      setHighlightedRoute({
        type: 'tour',
        tourId: tour.id,
        tourSlug: tour.slug,
        tourName: tour.name,
        vehicle: 'driving',
        points: routePoints,
        meta: {
          tour_name: tour.name,
          total_stops: routePoints.length,
        },
      });
      setShowOnlyHighlightedRoute(true);

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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-foreground text-sm font-semibold">
            {t('mapPage.tourPanel.title', { defaultValue: 'Tour du lịch' })}
          </p>
          <p className="text-muted-foreground text-sm">
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
          className="h-7 text-sm"
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
            className="h-8 text-sm"
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
            className="h-8 text-sm"
            onClick={() => {
              clearHighlightedRoute();
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
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          {t('mapPage.tourPanel.error', { defaultValue: 'Không thể tải danh sách tour.' })}
        </div>
      ) : tours.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          {t('mapPage.tourPanel.empty', { defaultValue: 'Không có tour phù hợp với bộ lọc.' })}
        </div>
      ) : (
        <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-0.5">
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
                  'space-y-2 rounded-lg border p-3 transition-colors',
                  isRouteActive
                    ? 'border-primary bg-primary/5'
                    : isSelected
                      ? 'border-border bg-muted/20'
                      : 'hover:bg-muted/50'
                )}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={tour.name}
                    className="h-28 w-full rounded-md object-cover"
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
                    className="h-8 text-sm"
                    disabled={isRouteLoading}
                    onClick={() => handleOpenTourRoute(tour)}
                  >
                    <Route className="h-3.5 w-3.5" />
                    {isRouteLoading
                      ? t('mapPage.tourPanel.loadingRoute', { defaultValue: 'Đang mở...' })
                      : t('mapPage.tourPanel.openRoute', { defaultValue: 'Mở chỉ đường' })}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 text-sm"
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
