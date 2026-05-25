import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Camera,
  Star,
  Clock,
  Ticket,
  DollarSign,
  Navigation,
  RectangleGoggles,
  Phone,
  Globe,
  Users,
  ShoppingBag,
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
import { useNavigate } from 'react-router-dom';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { useSpotDetailModalStore, useModalCarouselStore } from '@/features/map/store/useModalStore';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import {
  useGetDataPointById,
  useGetDataPointBySlug,
  useGetSpotMedia,
  useGetSpotNearbyOcop,
} from '@/services/api/tourism-points/tourismPointsApi';
import { useGetAframeScenes } from '@/services/api/vr360/aframeSceneService';

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
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
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

function OcopProductCard({ ocop, spotLat, spotLng }) {
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
    <div className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-muted/50 transition-colors">
      <img
        src={imageUrl}
        alt={ocop.name}
        className="h-14 w-14 shrink-0 rounded-md object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImg;
        }}
      />
      <div className="min-w-0 flex-1">
        <p className="typo-meta font-medium line-clamp-2 leading-snug">{ocop.name}</p>
        <OcopStars count={ocop.star_rating} />
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {price && (
            <span className="typo-meta font-medium text-amber-600">{price}</span>
          )}
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
    </div>
  );
}

function OcopNearbyPanel({ spot, isModalOpen }) {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <ShoppingBag size={13} className="text-amber-500 shrink-0" />
          <p className="typo-meta font-semibold text-foreground">
            {t('mapPage.ocopPanel.title')}
          </p>
        </div>
        {/* Radius filter chips */}
        <div className="flex items-center gap-1">
          {[5, 10, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                radiusKm === r
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-transparent hover:border-border'
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
          <div className="p-2 space-y-2">
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
          <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ModalMarker() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isOpen, spotId, spotSlug, closeSpotModal } = useSpotDetailModalStore();
  const { openCarouselModal } = useModalCarouselStore();
  const { setEndLocation, triggerFocusStart } = useDirectionsStore();

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
  const hasVrTour = useMemo(() => {
    if (spot?.has_vr_360 === true) return true;
    const d = scenesData?.data ?? scenesData;
    const scenes = Array.isArray(d) ? d : d?.scenes || d?.items || [];
    return scenes.length > 0;
  }, [scenesData, spot?.has_vr_360]);

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

  const openingHours = spot ? getOpeningHours(spot.opening_hours) : null;
  const ticketPriceAdult = spot ? formatPrice(spot.ticket_price_adult, spot.ticket_currency) : null;
  const ticketPriceChild = spot ? formatPrice(spot.ticket_price_child, spot.ticket_currency) : null;
  const ratingAvg = spot ? parseFloat(spot.rating_avg) : 0;
  const hasMedia = Array.isArray(mediaItems) && mediaItems.length > 0;
  const capacityPct = spot?.current_capacity_pct != null ? Number(spot.current_capacity_pct) : null;
  const alertThreshold = spot?.alert_threshold_pct ?? 80;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeSpotModal()}>
      {/*
       * DialogContent is used as a transparent flex wrapper so the two cards
       * (main modal + OCOP panel) sit side-by-side while remaining centered
       * as a unit in the viewport.
       */}
      <DialogContent
        showCloseButton={false}
        className="flex flex-row items-stretch gap-3 bg-transparent border-0 shadow-none p-0 rounded-none w-full max-w-[calc(100%-2rem)] sm:w-auto sm:max-w-none"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{spot?.name || t('mapPage.destination.unknownName')}</DialogTitle>
          <DialogDescription>{t('mapPage.destination.title')}</DialogDescription>
        </DialogHeader>

        {/* ── Main modal card (original layout preserved) ── */}
        <div className="relative flex flex-col w-full max-w-md overflow-hidden rounded-2xl border bg-background shadow-lg">
          {/* Close button */}
          <DialogClose className="absolute top-4 right-4 z-10 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* Scrollable inner content */}
          <div className="overflow-y-auto max-h-[85vh] sm:max-h-150 flex flex-col">
            {/* Hero image */}
            <div className="bg-muted relative h-48 w-full shrink-0">
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
              {spot?.category_color && (
                <div
                  className="absolute right-0 bottom-0 left-0 h-1"
                  style={{ backgroundColor: spot.category_color }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : spot ? (
                <>
                  {/* Title + category */}
                  <div className="flex flex-col gap-1.5">
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

                  {/* Rating */}
                  {ratingAvg > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="fill-gold text-gold" />
                      <span className="typo-body font-semibold">{spot.rating_avg}</span>
                      {spot.rating_count > 0 && (
                        <span className="typo-meta text-muted-foreground">
                          ({spot.rating_count} {t('mapPage.spotModal.reviews')})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Address */}
                  {spot.address && (
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                      <p className="typo-meta text-muted-foreground line-clamp-2">{spot.address}</p>
                    </div>
                  )}

                  {/* Opening hours + ticket */}
                  <div className={`grid gap-2 ${openingHours ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {openingHours && (
                      <div className="bg-muted/50 flex items-start gap-2 rounded-lg p-2">
                        <Clock size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="typo-meta font-medium">
                            {t('mapPage.spotModal.openingHours')}
                          </p>
                          <p className="typo-meta text-muted-foreground">{openingHours}</p>
                        </div>
                      </div>
                    )}
                    <div className="bg-muted/50 flex items-start gap-2 rounded-lg p-2">
                      {ticketPriceAdult ? (
                        <Ticket size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                      ) : (
                        <DollarSign size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="typo-meta font-medium">{t('mapPage.spotModal.ticketPrice')}</p>
                        {ticketPriceAdult ? (
                          <>
                            <p className="typo-meta text-muted-foreground">{ticketPriceAdult}</p>
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
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-muted-foreground shrink-0" />
                      <div className="flex flex-1 flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <p className="typo-meta text-muted-foreground">
                            {t('mapPage.spotModal.capacity')}
                          </p>
                          <p
                            className="typo-meta font-medium"
                            style={{
                              color:
                                capacityPct >= alertThreshold
                                  ? '#ef4444'
                                  : capacityPct >= alertThreshold * 0.75
                                    ? '#f59e0b'
                                    : '#22c55e',
                            }}
                          >
                            {Math.round(capacityPct)}%
                          </p>
                        </div>
                        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(capacityPct, 100)}%`,
                              backgroundColor:
                                capacityPct >= alertThreshold
                                  ? '#ef4444'
                                  : capacityPct >= alertThreshold * 0.75
                                    ? '#f59e0b'
                                    : '#22c55e',
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
                    {t('mapPage.spotModal.review')}
                  </Button>
                </div>
                {hasVrTour && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleVrTour}
                    className="bg-green-500 text-secondary-foreground w-full gap-1.5"
                  >
                    <RectangleGoggles size={14} />
                    {t('mapPage.spotModal.vrTour')}
                  </Button>
                )}
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
            </div>
          </div>
        </div>

        {/* ── OCOP panel card (desktop only, sits to the right) ── */}
        <div className="hidden sm:flex flex-col w-64 overflow-hidden rounded-2xl border bg-background shadow-lg sm:max-h-150">
          <OcopNearbyPanel spot={spot} isModalOpen={isOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
