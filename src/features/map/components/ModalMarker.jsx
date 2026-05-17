import { useMemo } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
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
    navigate('/vr360', { state: { spotId: resolvedSpotId } });
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
      <DialogContent className="w-full max-w-md overflow-hidden rounded-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{spot?.name || t('mapPage.destination.unknownName')}</DialogTitle>
          <DialogDescription>{t('mapPage.destination.title')}</DialogDescription>
        </DialogHeader>

        {/* Hero image */}
        <div className="bg-muted relative h-48 w-full">
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
                <p className="typo-body text-muted-foreground line-clamp-3">{spot.description}</p>
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
      </DialogContent>
    </Dialog>
  );
}
