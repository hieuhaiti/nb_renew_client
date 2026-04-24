import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import {
  MapPin,
  Navigation,
  LocateFixed,
  ImageOff,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  Clock,
  Ticket,
  Mountain,
  Star,
  Users,
  Eye,
  CheckCircle2,
  Tag,
  Layers,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useDestinationStore } from '@/features/map/store/useDestinationStore';
import { useDataLayerStore } from '@/features/map/store/useDataLayerStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { cn, hasHtmlMarkup, withBaseUrl } from '@/lib/utils';
import { useDestinationPointDetailQuery } from '@/features/map/api/mapDataLayerService';
import { categoriesService } from '@/features/categories/api/categoriesService';
import { subCategoriesService } from '@/features/categories/api/subCategoriesService';

function formatCoordinate(value) {
  return typeof value === 'number' ? value.toFixed(6) : '--';
}

function normalizePointDetailPayload(payload) {
  const root = payload?.data || payload;
  const pointCandidate = root?.point || root?.data?.point || root;

  if (pointCandidate?.type === 'Feature') {
    return pointCandidate.properties || {};
  }

  if (pointCandidate?.properties && !pointCandidate?.id) {
    return pointCandidate.properties;
  }

  return pointCandidate || null;
}

function resolveDestinationModel(selectedDestination, pointDetail) {
  const resolved = pointDetail || {};

  return {
    id: resolved.id ?? selectedDestination?.id ?? null,
    name:
      resolved.name ||
      resolved.name_vi ||
      resolved.name_en ||
      selectedDestination?.name ||
      'Unknown destination',
    description:
      resolved.description ||
      resolved.description_vi ||
      resolved.description_en ||
      selectedDestination?.description ||
      '',
    category_id: resolved.category_id ?? selectedDestination?.category_id ?? null,
    subcategory_id: resolved.subcategory_id ?? selectedDestination?.subcategory_id ?? null,
    address:
      resolved.address ||
      resolved.address_vi ||
      resolved.address_en ||
      selectedDestination?.address ||
      null,
    coordinates:
      Array.isArray(selectedDestination?.coordinates) && selectedDestination.coordinates.length >= 2
        ? selectedDestination.coordinates
        : null,
    main_image_url:
      resolved.main_image_url ||
      resolved.main_image ||
      resolved.image_url ||
      resolved.thumbnail_url ||
      null,
    gallery_images: Array.isArray(resolved.gallery_images) ? resolved.gallery_images : [],
    total_reviews: resolved.total_reviews ?? null,
    average_rating: resolved.average_rating ?? null,
    total_visits: resolved.total_visits ?? null,
    website: resolved.website ?? null,
    phone: resolved.phone ?? null,
    email: resolved.email ?? null,
    opening_hours: resolved.opening_hours ?? null,
    entrance_fee: resolved.entrance_fee ?? null,
    currency: resolved.currency ?? 'VND',
    facilities: Array.isArray(resolved.facilities) ? resolved.facilities : [],
    elevation: resolved.elevation ?? null,
    is_featured: resolved.is_featured ?? false,
  };
}

function StarRating({ rating }) {
  const numRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'size-4',
            i + 1 <= numRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
          )}
        />
      ))}
      <span className="text-muted-foreground ml-1 text-xs">({numRating.toFixed(1)})</span>
    </div>
  );
}

function InfoRow({ icon, children, href }) {
  const content = (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="text-foreground text-sm leading-snug">{children}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-opacity hover:opacity-75"
      >
        {content}
      </a>
    );
  }

  return content;
}

function DestinationSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export default function Destination({ onOpenRoute }) {
  const { t } = useTranslation();
  const lang = useLanguageStore((state) => state.lang);
  const mapRef = useMapStore((state) => state.mapRef);
  const selectedDestination = useDestinationStore((state) => state.selectedDestination);
  const selectedAt = useDestinationStore((state) => state.selectedAt);
  const clearSelectedDestination = useDestinationStore((state) => state.clearSelectedDestination);
  const selectedSubcategoryIds = useDataLayerStore((state) => state.selectedSubcategoryIds);

  const destinationId = selectedDestination?.id;

  const isSubcategoryActive = useMemo(() => {
    if (!selectedDestination) return false;
    if (selectedDestination.subcategory_id == null) return false;

    return selectedSubcategoryIds.some(
      (subcategoryId) => String(subcategoryId) === String(selectedDestination.subcategory_id)
    );
  }, [selectedDestination, selectedSubcategoryIds]);

  const shouldFetchDetail = Boolean(destinationId) && isSubcategoryActive;

  const {
    data: destinationDetailData,
    isLoading,
    isFetching,
  } = useDestinationPointDetailQuery(
    {
      pointId: destinationId,
      lang,
      format: 'json',
      selectedAt,
    },
    {
      enabled: shouldFetchDetail,
    }
  );

  const { data: categoriesData } = categoriesService({ lang });
  const { data: subcategoriesData } = subCategoriesService({
    lang,
    category_id: selectedDestination?.category_id,
  });

  const pointDetail = useMemo(
    () => normalizePointDetailPayload(destinationDetailData),
    [destinationDetailData]
  );

  const destination = useMemo(
    () => resolveDestinationModel(selectedDestination, pointDetail),
    [pointDetail, selectedDestination]
  );

  const categoryName = useMemo(() => {
    if (!destination.category_id) return null;
    const list = categoriesData?.data?.categories || [];
    return list.find((c) => String(c.id) === String(destination.category_id))?.name || null;
  }, [categoriesData, destination.category_id]);

  const subcategoryName = useMemo(() => {
    if (!destination.subcategory_id) return null;
    const list = subcategoriesData?.data?.subcategories || subcategoriesData?.subcategories || [];
    return list.find((s) => String(s.id) === String(destination.subcategory_id))?.name || null;
  }, [subcategoriesData, destination.subcategory_id]);

  const coordinates = Array.isArray(destination?.coordinates) ? destination.coordinates : null;
  const detailDescription = destination?.description || '';
  const descriptionHasHtml = hasHtmlMarkup(detailDescription);

  const sanitizedDescriptionHtml = useMemo(() => {
    if (!descriptionHasHtml) return '';
    return DOMPurify.sanitize(detailDescription);
  }, [descriptionHasHtml, detailDescription]);

  const allImages = useMemo(() => {
    const images = [];
    if (destination.main_image_url) images.push(destination.main_image_url);
    destination.gallery_images.forEach((img) => {
      if (img && img !== destination.main_image_url) images.push(img);
    });
    return images;
  }, [destination.main_image_url, destination.gallery_images]);

  const isFree = destination.entrance_fee != null && parseFloat(destination.entrance_fee) === 0;
  const openingHoursText = destination.opening_hours?.default || null;

  const handleFlyTo = () => {
    if (!mapRef || !coordinates || coordinates.length < 2) return;
    mapRef.flyTo({ center: coordinates, zoom: 14, speed: 0.8, essential: true });
  };

  if (!selectedDestination) {
    return (
      <div className="text-muted-foreground flex min-h-32 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-4 text-center text-sm">
        <MapPin className="text-muted-foreground/60 h-6 w-6" />
        <p>
          {t('mapPage.destination.empty', {
            defaultValue: 'Chọn một điểm trên bản đồ để xem thông tin chi tiết.',
          })}
        </p>
      </div>
    );
  }

  if (!isSubcategoryActive) {
    return (
      <div className="space-y-3">
        <div className="text-warning border-warning/50 bg-warning-soft/30 flex items-start gap-2 rounded-lg border border-dashed p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            {t('mapPage.destination.inactiveSubcategory', {
              defaultValue:
                'Điểm bạn đang xem thuộc subcategory đã tắt. Hãy bật lại lớp dữ liệu hoặc click điểm khác trên bản đồ.',
            })}
          </p>
        </div>
        <DestinationSkeleton />
      </div>
    );
  }

  if (isLoading || isFetching) {
    return <DestinationSkeleton />;
  }

  return (
    <div className="space-y-3">
      {/* Header: label + name + category badges */}
      <div className="space-y-1.5">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t('mapPage.destination.title', { defaultValue: 'Điểm đến' })}
        </p>
        <h3 className="text-foreground text-base leading-tight font-semibold">
          {destination.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {categoryName && (
            <Badge variant="secondary" className="gap-1 py-0.5 text-xs">
              <Tag className="size-3" />
              {categoryName}
            </Badge>
          )}
          {subcategoryName && (
            <Badge variant="outline" className="gap-1 py-0.5 text-xs">
              <Layers className="size-3" />
              {subcategoryName}
            </Badge>
          )}
          {destination.is_featured && (
            <Badge className="gap-1 bg-amber-500 py-0.5 text-xs hover:bg-amber-500">
              <Star className="size-3 fill-current" />
              {t('mapPage.destination.featured', { defaultValue: 'Nổi bật' })}
            </Badge>
          )}
        </div>
      </div>

      {/* Gallery carousel */}
      {allImages.length > 0 ? (
        <div className="bg-card relative overflow-hidden rounded-lg border">
          <Carousel opts={{ loop: allImages.length > 1 }}>
            <CarouselContent>
              {allImages.map((img, i) => (
                <CarouselItem key={i}>
                  <img
                    src={withBaseUrl(img)}
                    alt={`${destination.name} ${i + 1}`}
                    className="h-44 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {allImages.length > 1 && (
              <>
                <CarouselPrevious className="left-2 size-7 border-0 bg-black/40 text-white hover:bg-black/60 hover:text-white" />
                <CarouselNext className="right-2 size-7 border-0 bg-black/40 text-white hover:bg-black/60 hover:text-white" />
                <div className="absolute right-2 bottom-2 rounded-full bg-black/50 px-1.5 py-0.5 text-xs text-white">
                  {allImages.length} {t('mapPage.destination.photos', { defaultValue: 'ảnh' })}
                </div>
              </>
            )}
          </Carousel>
        </div>
      ) : (
        <div className="text-muted-foreground bg-muted/30 flex h-32 items-center justify-center gap-2 rounded-lg border text-sm">
          <ImageOff className="h-4 w-4" />
          {t('mapPage.destination.noImage', { defaultValue: 'Không có ảnh đại diện' })}
        </div>
      )}

      {/* Info rows */}
      <div className="bg-card space-y-2.5 rounded-lg border p-3">
        {destination.address && (
          <InfoRow icon={<MapPin className="text-muted-foreground size-4" />}>
            {destination.address}
          </InfoRow>
        )}
        {destination.phone && (
          <InfoRow
            icon={<Phone className="size-4 text-blue-500" />}
            href={`tel:${destination.phone}`}
          >
            {destination.phone}
          </InfoRow>
        )}
        {destination.email && (
          <InfoRow
            icon={<Mail className="text-muted-foreground size-4" />}
            href={`mailto:${destination.email}`}
          >
            {destination.email}
          </InfoRow>
        )}
        {destination.website && (
          <InfoRow
            icon={<Globe className="text-muted-foreground size-4" />}
            href={destination.website}
          >
            <span className="text-primary">
              {t('mapPage.destination.viewWebsite', { defaultValue: 'Xem website' })}
            </span>
          </InfoRow>
        )}
        {openingHoursText && (
          <InfoRow icon={<Clock className="text-muted-foreground size-4" />}>
            {openingHoursText}
          </InfoRow>
        )}
        {destination.entrance_fee != null && (
          <InfoRow icon={<Ticket className="text-muted-foreground size-4" />}>
            {isFree ? (
              <span className="font-medium text-green-600">
                {t('mapPage.destination.free', { defaultValue: 'Miễn phí' })}
              </span>
            ) : (
              `${Number(destination.entrance_fee).toLocaleString()} ${destination.currency}`
            )}
          </InfoRow>
        )}
        {destination.elevation != null && (
          <InfoRow icon={<Mountain className="text-muted-foreground size-4" />}>
            {destination.elevation}m
          </InfoRow>
        )}
      </div>

      {/* Description */}
      {destination.description ? (
        descriptionHasHtml ? (
          <div
            className="bg-muted/50 text-foreground rounded-lg p-3 text-sm leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: sanitizedDescriptionHtml }}
          />
        ) : (
          <p className="bg-muted/50 text-foreground rounded-lg p-3 text-sm leading-relaxed">
            {destination.description}
          </p>
        )
      ) : (
        <p className="bg-muted/50 text-muted-foreground rounded-lg p-3 text-sm leading-relaxed">
          {t('mapPage.destination.noDescription', {
            defaultValue: 'Chưa có mô tả cho điểm này.',
          })}
        </p>
      )}

      {/* Facilities */}
      {destination.facilities.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t('mapPage.destination.facilities', { defaultValue: 'Tiện ích' })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {destination.facilities.map((facility, i) => (
              <Badge key={i} variant="secondary" className="gap-1 text-xs">
                <CheckCircle2 className="size-3 text-green-500" />
                {facility}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-card space-y-2 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t('mapPage.destination.rating', { defaultValue: 'Điểm đánh giá' })}
          </p>
          <StarRating rating={destination.average_rating} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 flex items-center gap-2 rounded-md p-2">
            <Users className="text-muted-foreground size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">
                {t('mapPage.destination.reviews', { defaultValue: 'Đánh giá' })}
              </p>
              <p className="text-foreground text-sm font-semibold">
                {destination.total_reviews ?? '--'}
              </p>
            </div>
          </div>
          <div className="bg-muted/50 flex items-center gap-2 rounded-md p-2">
            <Eye className="text-muted-foreground size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">
                {t('mapPage.destination.visits', { defaultValue: 'Lượt ghé thăm' })}
              </p>
              <p className="text-foreground text-sm font-semibold">
                {destination.total_visits ?? '--'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="button" className="flex-1" onClick={handleFlyTo}>
          <LocateFixed className="h-4 w-4" />
          {t('mapPage.destination.flyTo', { defaultValue: 'Đến điểm' })}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => onOpenRoute?.(destination)}
        >
          <Navigation className="h-4 w-4" />
          {t('mapPage.destination.openRoute', { defaultValue: 'Chỉ đường' })}
        </Button>
        <Button type="button" variant="outline" onClick={clearSelectedDestination}>
          <X className="h-4 w-4" />
          {t('mapPage.destination.clear', { defaultValue: 'Đóng' })}
        </Button>
      </div>
    </div>
  );
}
