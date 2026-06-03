import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  ArrowUpRight,
  Camera,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Navigation,
  Phone,
  RectangleGoggles,
  Route,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Users,
  XIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { cn, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import qrImage from '@/assets/image.png';
import { useSpotDetailModalStore, useModalCarouselStore } from '@/features/map/store/useModalStore';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import {
  useGetDataPointById,
  useGetDataPointBySlug,
  useGetSpotMedia,
  useGetSpotNearbyOcop,
} from '@/services/api/tourism-points/tourismPointsApi';
import { useGetAframeScenes } from '@/services/api/vr360/aframeSceneService';
import {
  fetchPointById,
  fetchTourStopsByTourId,
  useTourPanelListQuery,
} from '@/services/api/map/tourPanelService';
import {
  formatTourDurationLabel,
  formatTourPriceLabel,
  normalizeTourListPayload,
} from '@/features/map/utils/tourPanelUtils';
import {
  createRouteFromPoints,
  normalizeTourRoutePoint,
} from '@/features/map/utils/highlightRouteUtils';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useMapPanelStore } from '@/features/map/store/useMapPanelStore';
import { useTourPanelStore } from '@/features/tours/store/useTourPanelStore';
import { getCapacityStatusMeta, resolveCapacityStatus } from '@/features/map/utils/capacityStatus';

const QR_BOOKING_URL = 'https://dulichninhbinh.com.vn/';

function formatPrice(price, currency = 'VND') {
  const num = Number(price);
  if (Number.isNaN(num) || num === 0) return null;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(num);
}

function getOpeningHours(opening_hours) {
  if (!opening_hours) return null;
  if (typeof opening_hours === 'string') {
    try {
      const parsed = JSON.parse(opening_hours);
      return parsed?.default || parsed?.daily || null;
    } catch {
      return opening_hours;
    }
  }
  if (typeof opening_hours === 'object')
    return opening_hours?.default || opening_hours?.daily || null;
  return null;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
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

function OcopStars({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={10}
          className={i < count ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}
        />
      ))}
    </div>
  );
}

function OcopProductCard({ ocop, spotLat, spotLng, onClick }) {
  const { t } = useTranslation();
  const imageUrl = ocop.cover_image_url ? withBaseUrl(ocop.cover_image_url) : placeholderImg;
  const price = ocop.price_vnd
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
        Number(ocop.price_vnd)
      )
    : null;

  const dist =
    spotLat != null && spotLng != null && ocop.lat != null && ocop.lng != null
      ? haversineKm(spotLat, spotLng, Number(ocop.lat), Number(ocop.lng))
      : null;

  return (
    <button
      type="button"
      onClick={() => onClick?.(ocop)}
      className="focus-visible:ring-ring group flex w-full cursor-pointer items-start gap-2.5 rounded-lg p-2 text-left transition-all hover:bg-amber-50/80 hover:shadow-sm hover:ring-1 hover:ring-amber-200 focus-visible:ring-2 focus-visible:outline-none"
    >
      <img
        src={imageUrl}
        alt={ocop.name}
        className="h-14 w-14 shrink-0 rounded-md object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImg;
        }}
      />
      <div className="min-w-0 flex-1">
        <p className="typo-meta line-clamp-2 leading-snug font-medium">{ocop.name}</p>
        <OcopStars count={ocop.star_rating} />
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {price && <span className="typo-meta font-medium text-amber-600">{price}</span>}
          {dist != null && (
            <span className="typo-meta text-muted-foreground">
              {t('mapPage.ocopPanel.distFrom')} {formatDist(dist)}
            </span>
          )}
        </div>
        {ocop.producer_name && (
          <p className="typo-meta text-muted-foreground line-clamp-1">{ocop.producer_name}</p>
        )}
      </div>
    </button>
  );
}

function getOcopCoordinates(ocop) {
  const lat = ocop?.lat ?? ocop?.latitude;
  const lng = ocop?.lng ?? ocop?.longitude;

  if (lat != null && lng != null) {
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) return [parsedLng, parsedLat];
  }

  const geometry =
    parseGeometryValue(ocop?.geometry) ||
    parseGeometryValue(ocop?.geom) ||
    parseGeometryValue(ocop?.geom_json) ||
    parseGeometryValue(ocop?.geometry_data);
  const coordinates = geometry?.type === 'Point' ? geometry.coordinates : geometry?.coordinates;

  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const parsedLng = Number(coordinates[0]);
    const parsedLat = Number(coordinates[1]);
    if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) return [parsedLng, parsedLat];
  }

  return null;
}

function OcopNearbyPanel({ spot, isModalOpen, onSelectOcop }) {
  const { t, i18n } = useTranslation();
  const [radiusKm, setRadiusKm] = useState(10);

  const spotSlug = spot?.slug;
  const spotId = spot?.id;

  const { data: ocopData, isLoading: isOcopLoading } = useGetSpotNearbyOcop({
    slug: spotSlug,
    id: spotSlug ? null : spotId,
    radius_km: radiusKm,
    lang: i18n.language?.startsWith('en') ? 'en' : 'vi',
    options: { enabled: isModalOpen && (Boolean(spotSlug) || Boolean(spotId)) },
  });

  const ocopProducts = ocopData?.data?.spot?.ocop_products ?? [];
  const spotLat = spot?.lat ?? spot?.latitude;
  const spotLng = spot?.lng ?? spot?.longitude;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <ShoppingBag size={13} className="shrink-0 text-amber-500" />
          <p className="typo-meta text-foreground font-semibold">{t('mapPage.ocopPanel.title')}</p>
        </div>
        {/* Radius filter chips */}
        <div className="flex items-center gap-1">
          {[5, 10, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                radiusKm === r
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary border-transparent'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto">
        {isOcopLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2">
                <Skeleton className="h-14 w-14 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : ocopProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <ShoppingBag size={28} className="text-muted-foreground/40" />
            <p className="typo-meta text-muted-foreground">{t('mapPage.ocopPanel.noProducts')}</p>
          </div>
        ) : (
          <div className="p-1">
            {ocopProducts.map((ocop) => (
              <OcopProductCard
                key={ocop.id}
                ocop={ocop}
                spotLat={spotLat != null ? Number(spotLat) : null}
                spotLng={spotLng != null ? Number(spotLng) : null}
                onClick={onSelectOcop}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ModalMarker() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEnglish = i18n.language?.startsWith('en');
  const locale = isEnglish ? 'en-US' : 'vi-VN';
  const routeLang = isEnglish ? 'en' : 'vi';

  const { isOpen, spotId, spotSlug, closeSpotModal } = useSpotDetailModalStore();
  const { openCarouselModal } = useModalCarouselStore();
  const openTourPanel = useMapPanelStore((state) => state.openTourPanel);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapRefObj = useMapStore((state) => state.mapRefObj);
  const setHighlightedRoute = useMapStore((state) => state.setHighlightedRoute);
  const setShowOnlyHighlightedRoute = useMapStore((state) => state.setShowOnlyHighlightedRoute);
  const setSelectedTour = useTourPanelStore((state) => state.setSelectedTour);
  const requestOpenTourSidebar = useTourPanelStore((state) => state.requestOpenTourSidebar);
  const [routeLoadingTourId, setRouteLoadingTourId] = useState(null);

  const { setEndLocation, triggerFocusStart, clearDirections } = useDirectionsStore();

  const hasSpotSlug = Boolean(spotSlug);
  const { data: spotDataBySlug, isLoading: isLoadingBySlug } = useGetDataPointBySlug({
    slug: spotSlug,
  });
  const { data: spotDataById, isLoading: isLoadingById } = useGetDataPointById({
    point_id: hasSpotSlug ? null : spotId,
  });
  const spotData = hasSpotSlug ? spotDataBySlug : spotDataById;
  const isLoading = hasSpotSlug ? isLoadingBySlug : isLoadingById;
  const spot = spotData?.data?.spot ?? spotData?.data ?? null;

  const { data: mediaData } = useGetSpotMedia({
    spot_id: spotId,
    options: { enabled: isOpen && !!spotId },
  });
  const mediaItems = mediaData?.data?.media ?? mediaData?.data ?? [];

  const { data: scenesData } = useGetAframeScenes({ spotId: isOpen ? spotId : null });
  const { data: toursData, isLoading: isToursLoading } = useTourPanelListQuery(
    {
      limit: 5,
    },
    { enabled: isOpen }
  );

  const suggestedTours = useMemo(() => {
    return normalizeTourListPayload(toursData, {
      lang: isEnglish ? 'en' : 'vi',
    }).slice(0, 5);
  }, [isEnglish, toursData]);

  const hasVrTour = useMemo(() => {
    if (spot?.has_vr_360 === true) return true;
    const d = scenesData?.data ?? scenesData;
    const scenes = Array.isArray(d) ? d : d?.scenes || d?.items || [];
    return scenes.length > 0;
  }, [scenesData, spot?.has_vr_360]);

  const handleOpenTourSuggestion = async (tour) => {
    if (!tour?.id) return;

    setRouteLoadingTourId(String(tour.id));
    setSelectedTour({
      ...tour,
      cover_image_url: tour?.cover_image_url || tour?.main_image_url || null,
    });

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
            return normalizeTourRoutePoint(candidate, index, routeLang);
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

      const routeResult = await createRouteFromPoints(routePoints, 'driving', routeLang);
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
      requestOpenTourSidebar();
      closeSpotModal();
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

  const handleViewImages = () => {
    const images =
      Array.isArray(mediaItems) && mediaItems.length > 0
        ? mediaItems.map((m) => withBaseUrl(m.url || m.file_path || m.path || '')).filter(Boolean)
        : spot?.primary_image
          ? [withBaseUrl(spot.primary_image)]
          : [];

    if (!images.length) return;
    openCarouselModal(images);
  };

  const handleGetDirections = () => {
    if (!spot) return;
    setEndLocation({
      lat: Number(spot.latitude),
      lng: Number(spot.longitude),
      placeName: spot.name,
    });
    triggerFocusStart();
    closeSpotModal();
  };

  const handleReview = () => {
    navigate(`/tourism-point/point/${spotSlug ?? spotId}`);
    closeSpotModal();
  };

  const handleVrTour = () => {
    const resolvedSpotId = spotId ?? spot?.id ?? spot?.spot_id ?? spot?.point_id;
    if (!resolvedSpotId) return;
    navigate(`/vr360/${resolvedSpotId}`);
    closeSpotModal();
  };

  const handleSelectOcop = (ocop) => {
    const coordinates = getOcopCoordinates(ocop);
    if (!coordinates) {
      toast.error(
        t('mapPage.ocopPanel.missingCoordinates', {
          defaultValue: 'Không tìm thấy tọa độ sản phẩm OCOP này.',
        })
      );
      return;
    }

    const mapRefObjCurrent = mapRefObj?.current;
    const maps = [mapRef, mapRefObjCurrent?.single, mapRefObjCurrent?.split].filter(
      (map, index, list) => map && list.indexOf(map) === index
    );

    maps.forEach((map) => {
      map.flyTo({
        center: coordinates,
        zoom: Math.max(map.getZoom?.() ?? 0, 15),
        pitch: 45,
        bearing: 0,
        essential: true,
        duration: 1600,
      });
    });

    closeSpotModal();
  };

  const openingHours = spot ? getOpeningHours(spot.opening_hours) : null;
  const ticketPriceAdult = spot ? formatPrice(spot.ticket_price_adult, spot.ticket_currency) : null;
  const ticketPriceChild = spot ? formatPrice(spot.ticket_price_child, spot.ticket_currency) : null;
  const ratingAvg = spot ? parseFloat(spot.rating_avg) : 0;
  const hasMedia = Array.isArray(mediaItems) && mediaItems.length > 0;
  const capacityRawPct =
    spot?.current_capacity_pct != null ? Number(spot.current_capacity_pct) : null;
  const capacityPct = Number.isFinite(capacityRawPct) ? capacityRawPct : null;
  const capacityStatus = resolveCapacityStatus(
    spot?.status ?? spot?.capacity_status ?? spot?.current_capacity_status,
    capacityPct
  );
  const capacityStatusMeta = getCapacityStatusMeta(capacityStatus);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) return;
        closeSpotModal();
      }}
    >
      {/*
       * DialogContent is used as a transparent flex wrapper so the two cards
       * (main modal + OCOP panel) sit side-by-side while remaining centered
       * as a unit in the viewport.
       */}
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] max-h-[90vh] w-full max-w-[calc(100%-1rem)] flex-row items-stretch gap-2 rounded-none border-0 bg-transparent p-0 shadow-none sm:max-w-[calc(100%-2rem)] sm:gap-3 md:w-auto md:max-w-none"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{spot?.name || t('mapPage.destination.unknownName')}</DialogTitle>
          <DialogDescription>{t('mapPage.destination.title')}</DialogDescription>
        </DialogHeader>

        {/* Main modal card (original layout preserved) */}
        {/* left-side panel placeholder (removed TourSuggestModal) */}
        <div className="bg-background hidden w-72 flex-col self-stretch overflow-hidden rounded-2xl border shadow-lg xl:flex">
          <div className="from-primary/10 via-primary/5 to-background border-b bg-linear-to-br p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary shrink-0" />
              <p className="typo-meta text-foreground font-semibold">
                {t('mapPage.spotModal.suggestedTours.title', {
                  defaultValue: 'Suggested routes',
                })}
              </p>
            </div>
            <p className="typo-meta text-muted-foreground line-clamp-2">
              {t('mapPage.spotModal.suggestedTours.subtitle', {
                defaultValue: 'Related to {{destination}}',
                destination: spot?.name || t('mapPage.destination.unknownName'),
              })}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {isToursLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="space-y-1 rounded-xl border p-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : suggestedTours.length === 0 ? (
              <div className="border-border/60 bg-muted/30 rounded-xl border border-dashed p-3 text-center">
                <Route size={18} className="text-muted-foreground/60 mx-auto mb-1.5" />
                <p className="typo-meta text-muted-foreground">
                  {t('mapPage.spotModal.suggestedTours.empty', {
                    defaultValue: 'No related tour routes found.',
                  })}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestedTours.map((tour) => {
                  const isRouteLoading =
                    routeLoadingTourId != null && String(routeLoadingTourId) === String(tour.id);
                  return (
                    <button
                      key={tour.id}
                      type="button"
                      onClick={() => handleOpenTourSuggestion(tour)}
                      disabled={isRouteLoading}
                      className="focus-visible:ring-ring group from-background via-background to-muted/20 hover:border-primary/50 hover:bg-primary/5 hover:ring-primary/20 w-full cursor-pointer rounded-xl border bg-linear-to-br p-2 text-left transition-all hover:shadow-md hover:ring-1 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
                    >
                      <div className="mb-2 overflow-hidden rounded-lg">
                        <img
                          src={
                            tour.main_image_url ? withBaseUrl(tour.main_image_url) : placeholderImg
                          }
                          alt={tour.name}
                          className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = placeholderImg;
                          }}
                        />
                      </div>
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <p className="typo-meta text-foreground line-clamp-2 min-w-0 flex-1 font-semibold">
                          {tour.name}
                        </p>
                        {tour.is_featured && (
                          <Badge variant="secondary" className="shrink-0 px-1.5 py-0.5 text-[10px]">
                            {t('mapPage.spotModal.suggestedTours.featured', {
                              defaultValue: 'Featured',
                            })}
                          </Badge>
                        )}
                      </div>
                      <div className="mb-2 flex flex-wrap gap-1">
                        <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px]">
                          {formatTourDurationLabel(tour, t)}
                        </span>
                        <span className="bg-primary/10 text-primary rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                          {formatTourPriceLabel(tour, locale)}
                        </span>
                      </div>
                      <p className="typo-meta text-muted-foreground line-clamp-2">
                        {tour.description ||
                          t('mapPage.spotModal.suggestedTours.fallbackDescription', {
                            defaultValue: 'Open this route on the map to view itinerary details.',
                          })}
                      </p>
                      <span className="text-primary mt-2 inline-flex items-center gap-1 text-[11px] font-medium transition-transform duration-200 group-hover:translate-x-0.5">
                        {isRouteLoading
                          ? t('mapPage.tourPanel.loadingRoute', { defaultValue: 'Opening...' })
                          : t('mapPage.spotModal.suggestedTours.openOnMap', {
                              defaultValue: 'Open route on map',
                            })}
                        <ArrowUpRight size={12} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="bg-background relative flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border shadow-lg sm:w-[38rem] sm:flex-none lg:w-[42rem] xl:w-2xl">
          {/* Close button */}
          <DialogClose className="absolute top-4 right-4 z-10 rounded-xs border border-white/80 bg-white opacity-90 shadow-sm transition-opacity [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* Scrollable inner content */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Hero image */}
            <div className="bg-muted relative h-56 w-full shrink-0">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-none" />
              ) : (
                <img
                  src={spot?.primary_image ? withBaseUrl(spot.primary_image) : placeholderImg}
                  alt={spot?.name ?? ''}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
              )}
              <div
                className="absolute right-0 bottom-0 left-0 h-1"
                style={{ backgroundColor: spot?.category_color || '#f97316' }}
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between bg-sky-50/60 p-4">
              <div className="flex flex-col gap-3">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : spot ? (
                  <>
                    {/* Main info + QR (two-column layout) */}
                    <div className="bg-background/60 grid gap-3 rounded-xl border border-sky-100 p-3 sm:grid-cols-5">
                      <div className="flex min-w-0 flex-col gap-2.5 sm:col-span-3">
                        {/* Title + category */}
                        <div className="flex min-w-0 flex-col gap-1.5">
                          <h2 className="typo-card-title line-clamp-2">{spot.name}</h2>
                          {spot.category_name && (
                            <Badge
                              variant="secondary"
                              className="w-fit text-sm"
                              style={
                                spot.category_color
                                  ? {
                                      backgroundColor: `${spot.category_color}20`,
                                      color: spot.category_color,
                                      borderColor: `${spot.category_color}40`,
                                    }
                                  : {}
                              }
                            >
                              {spot.category_name}
                            </Badge>
                          )}
                        </div>

                        {ratingAvg > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Star size={14} className="fill-gold text-gold shrink-0" />
                            <span className="typo-body font-semibold">{spot.rating_avg}</span>
                            {spot.rating_count > 0 && (
                              <span className="typo-meta text-muted-foreground">
                                ({spot.rating_count} {t('mapPage.spotModal.reviews')})
                              </span>
                            )}
                          </div>
                        )}

                        {spot.address && (
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                            <p className="typo-meta text-muted-foreground line-clamp-2">
                              {spot.address}
                            </p>
                          </div>
                        )}

                        {openingHours && (
                          <div className="flex items-start gap-2">
                            <Clock size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="typo-meta font-medium">
                                {t('mapPage.spotModal.openingHours')}
                              </p>
                              <p className="typo-meta text-muted-foreground">{openingHours}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          {ticketPriceAdult ? (
                            <Ticket size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                          ) : (
                            <DollarSign
                              size={13}
                              className="text-muted-foreground mt-0.5 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="typo-meta font-medium">
                              {t('mapPage.spotModal.ticketPrice')}
                            </p>
                            {ticketPriceAdult ? (
                              <>
                                <p className="typo-meta text-muted-foreground">
                                  {ticketPriceAdult}
                                </p>
                                {ticketPriceChild && (
                                  <p className="typo-meta text-muted-foreground">
                                    {t('mapPage.spotModal.ticketChild')}: {ticketPriceChild}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="typo-meta text-muted-foreground">
                                {t('common.free', { defaultValue: 'Free' })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-stretch justify-center sm:col-span-2">
                        <TooltipProvider delayDuration={120}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() =>
                                  window.open(QR_BOOKING_URL, '_blank', 'noopener,noreferrer')
                                }
                                className="bg-background focus-visible:ring-ring flex h-full min-h-47 w-full cursor-pointer items-center justify-center rounded-lg border p-2 shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                                aria-label={t('mapPage.spotModal.scanToBook', {
                                  defaultValue: 'Scan to book tickets',
                                })}
                              >
                                <img
                                  src={qrImage}
                                  alt="QR"
                                  className="h-full w-full object-contain"
                                />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" sideOffset={8}>
                              {t('mapPage.spotModal.scanToBook', {
                                defaultValue: 'Scan to book tickets',
                              })}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Contact info */}
                    {(spot.phone || spot.website) && (
                      <div className="flex flex-col gap-2">
                        {spot.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-muted-foreground shrink-0" />
                            <a
                              href={`tel:${spot.phone}`}
                              className="typo-meta text-muted-foreground hover:text-foreground"
                            >
                              {spot.phone}
                            </a>
                          </div>
                        )}
                        {spot.website && (
                          <div className="flex items-center gap-2">
                            <Globe size={13} className="text-muted-foreground shrink-0" />
                            <a
                              href={spot.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="typo-meta text-muted-foreground hover:text-foreground line-clamp-1"
                            >
                              {spot.website}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Capacity indicator */}
                    {capacityPct != null && (
                      <div className="flex items-start gap-2">
                        <Users size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <p className="typo-meta text-muted-foreground">
                              {t('mapPage.spotModal.capacity')}
                            </p>
                            <p
                              className={cn(
                                'typo-meta font-medium tabular-nums',
                                capacityStatusMeta.toneClass
                              )}
                            >
                              {Math.round(capacityPct)}%
                            </p>
                          </div>
                          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(capacityPct, 100)}%`,
                                ...capacityStatusMeta.barStyle,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {spot.description && (
                      <p className="typo-body text-muted-foreground line-clamp-3">
                        {spot.description}
                      </p>
                    )}
                  </>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={isLoading || (!hasMedia && !spot?.primary_image)}
                    onClick={handleViewImages}
                    className="gap-1.5"
                  >
                    <Camera size={14} />
                    {t('mapPage.spotModal.viewImages')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleReview}
                    disabled={isLoading}
                    className="gap-1.5"
                  >
                    <Star size={14} className="fill-current" />
                    {t('mapPage.spotModal.viewDetail')}
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => window.open('https://3d.humgsoftware.pro.vn/', '_blank')}
                    className="text-secondary-foreground w-full gap-1.5 bg-green-500"
                  >
                    <RectangleGoggles size={14} />
                    {t('mapPage.spotModal.view3D')}
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    disabled={isLoading || !spot}
                    onClick={handleGetDirections}
                    className="w-full gap-1.5"
                  >
                    <Navigation size={14} />
                    {t('mapPage.spotModal.directions')}
                  </Button>
                </div>

                {hasVrTour && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleVrTour}
                    className="text-secondary-foreground w-full gap-1.5 bg-amber-500"
                  >
                    <RectangleGoggles size={14} />
                    {t('mapPage.spotModal.vrTour')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* OCOP panel card (desktop only, sits to the right) */}
        <div className="bg-background hidden w-64 flex-col self-stretch overflow-hidden rounded-2xl border shadow-lg lg:flex xl:w-72">
          <OcopNearbyPanel spot={spot} isModalOpen={isOpen} onSelectOcop={handleSelectOcop} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
