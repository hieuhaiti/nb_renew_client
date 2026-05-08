import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { MapPin, AlertCircle, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataLayerStore } from '@/features/map/store/useDataLayerStore';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { hasHtmlMarkup, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { useDestinationPointDetailQuery } from '@/services/api/map/mapDataLayerService';
import {
  normalizeSpotsSearchResults,
  useFeaturedSpotsQuery,
} from '@/services/api/map/mapSearchService';
import { categoriesService } from '@/services/api/categories/categoriesService';

function normalizePointDetailPayload(payload) {
  const root = payload?.data || payload;
  const pointCandidate = root?.spot || root?.point || root?.data?.spot || root?.data?.point || root;

  if (pointCandidate?.type === 'Feature') {
    return pointCandidate.properties || {};
  }

  if (pointCandidate?.properties && !pointCandidate?.id) {
    return pointCandidate.properties;
  }

  return pointCandidate || null;
}

function normalizeTextValue(value, lang = 'vi') {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object') return '';

  return lang === 'en'
    ? value?.note_en || value?.note_vi || ''
    : value?.note_vi || value?.note_en || '';
}

function getLocalizedField(item, baseField, lang = 'vi') {
  if (!item || typeof item !== 'object') return '';

  const viValue = item?.[`${baseField}_vi`];
  const enValue = item?.[`${baseField}_en`];
  const baseValue = item?.[baseField];

  if (lang === 'en') {
    return (
      normalizeTextValue(enValue, lang) ||
      normalizeTextValue(viValue, lang) ||
      normalizeTextValue(baseValue, lang)
    );
  }

  return (
    normalizeTextValue(viValue, lang) ||
    normalizeTextValue(enValue, lang) ||
    normalizeTextValue(baseValue, lang)
  );
}

function resolveDestinationModel(selectedDestination, pointDetail, lang = 'vi') {
  const resolved = pointDetail || {};

  return {
    id: resolved.id ?? selectedDestination?.id ?? null,
    name:
      getLocalizedField(resolved, 'name', lang) ||
      getLocalizedField(selectedDestination, 'name', lang) ||
      normalizeTextValue(selectedDestination?.name, lang) ||
      '',
    description:
      getLocalizedField(resolved, 'description', lang) ||
      getLocalizedField(selectedDestination, 'description', lang) ||
      normalizeTextValue(selectedDestination?.description, lang) ||
      '',
    category_id: resolved.category_id ?? selectedDestination?.category_id ?? null,
    subcategory_id: resolved.subcategory_id ?? selectedDestination?.subcategory_id ?? null,
    main_image_url:
      resolved.main_image_url ||
      resolved.main_image ||
      resolved.image_url ||
      resolved.thumbnail_url ||
      null,
    average_rating: resolved.average_rating ?? null,
  };
}

function formatRatingValue(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;
  return numericValue.toFixed(1);
}

function DestinationSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-49 w-full" />
      <div className="space-y-2 p-3.5">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-3.5 grid gap-2.5">
          <Skeleton className="h-11.5 w-full rounded-[14px]" />
          <Skeleton className="h-11.5 w-full rounded-[14px]" />
          <Skeleton className="h-11.5 w-full rounded-[14px]" />
        </div>
      </div>
    </div>
  );
}

export default function Destination({ onOpenRoute, onOpenVr }) {
  const { t } = useTranslation();
  const lang = useLanguageStore((state) => state.lang);
  const selectedDestination = useMapStore((state) => state.highlightedPoint);
  const selectedAt = useMapStore((state) => state.highlightedPointAt);
  const setHighlightedPoint = useMapStore((state) => state.setHighlightedPoint);
  const selectedSubcategoryIds = useDataLayerStore((state) => state.selectedSubcategoryIds);
  const dataLayerSubcategories = useDataLayerStore((state) => state.subcategories);
  const setSelectedSubcategoryIds = useDataLayerStore((state) => state.setSelectedSubcategoryIds);
  const setCategoryID = useCategoriesStore((state) => state.setCategoryID);
  const setCurrentTourismPointSettings = useTourismPointSettingStore(
    (state) => state.setCurrentSettings
  );
  const mapRef = useMapStore((state) => state.mapRef);

  const destinationId = selectedDestination?.id;
  const destinationSlug = selectedDestination?.slug;

  const isSubcategoryActive = useMemo(() => {
    if (!selectedDestination) return false;
    if (selectedDestination.subcategory_id == null) return false;

    return selectedSubcategoryIds.some(
      (subcategoryId) => String(subcategoryId) === String(selectedDestination.subcategory_id)
    );
  }, [selectedDestination, selectedSubcategoryIds]);

  const shouldFetchDetail = Boolean(destinationSlug || destinationId) && isSubcategoryActive;

  const {
    data: destinationDetailData,
    isLoading,
    isFetching,
  } = useDestinationPointDetailQuery(
    {
      pointId: destinationId,
      pointSlug: destinationSlug,
      lang,
      format: 'json',
      selectedAt,
    },
    {
      enabled: shouldFetchDetail,
    }
  );

  const { data: categoriesData } = categoriesService({ lang });
  const { data: featuredSpotsData, isLoading: isFeaturedLoading } = useFeaturedSpotsQuery({
    page: 1,
    limit: 8,
    status: 'active',
    sortBy: 'created_at',
    sortOrder: 'DESC',
  });

  const pointDetail = useMemo(
    () => normalizePointDetailPayload(destinationDetailData),
    [destinationDetailData]
  );
  const featuredSuggestions = useMemo(() => {
    const normalized = normalizeSpotsSearchResults(featuredSpotsData);
    return normalized
      .filter((item) => String(item?.id) !== String(selectedDestination?.id))
      .map((item) => {
        const raw = item?.raw || {};
        return {
          ...item,
          displayName: getLocalizedField(raw, 'name', lang) || item.name,
          displayDescription: getLocalizedField(raw, 'description', lang) || item.description,
          displayAddress: getLocalizedField(raw, 'address', lang) || item.address,
          displayCategory:
            getLocalizedField(raw, 'category_name', lang) ||
            normalizeTextValue(raw?.category_name, lang) ||
            normalizeTextValue(raw?.category, lang) ||
            '',
          rating:
            raw?.rating_avg ??
            raw?.average_rating ??
            raw?.rating ??
            item?.rating_avg ??
            item?.average_rating ??
            null,
          ratingText: formatRatingValue(
            raw?.rating_avg ??
              raw?.average_rating ??
              raw?.rating ??
              item?.rating_avg ??
              item?.average_rating ??
              null
          ),
        };
      })
      .slice(0, 4);
  }, [featuredSpotsData, lang, selectedDestination?.id]);

  const destination = useMemo(
    () => resolveDestinationModel(selectedDestination, pointDetail, lang),
    [lang, pointDetail, selectedDestination]
  );

  const categoryName = useMemo(() => {
    if (!destination.category_id) return null;
    const list = categoriesData?.data?.categories || [];
    const matched = list.find((c) => String(c.id) === String(destination.category_id));
    if (!matched) return null;
    return lang === 'en'
      ? matched.name_en || matched.name_vi || matched.name || null
      : matched.name_vi || matched.name_en || matched.name || null;
  }, [categoriesData, destination.category_id, lang]);

  const detailDescription = destination?.description || '';
  const descriptionHasHtml = hasHtmlMarkup(detailDescription);

  const sanitizedDescriptionHtml = useMemo(() => {
    if (!descriptionHasHtml) return '';
    return DOMPurify.sanitize(detailDescription);
  }, [descriptionHasHtml, detailDescription]);

  const handleSelectFeaturedSuggestion = (item) => {
    if (!item) return;

    const normalizedCategoryId =
      item.category_id == null || item.category_id === ''
        ? null
        : Number.isNaN(Number(item.category_id))
          ? item.category_id
          : Number(item.category_id);
    const normalizedSubcategoryId =
      item.subcategory_id == null || item.subcategory_id === ''
        ? null
        : Number.isNaN(Number(item.subcategory_id))
          ? item.subcategory_id
          : Number(item.subcategory_id);

    setHighlightedPoint({
      id: item.id,
      slug: item.slug || null,
      name: item.displayName || item.name,
      description: item.displayDescription || item.description,
      category_id: normalizedCategoryId,
      subcategory_id: normalizedSubcategoryId,
      address: item.displayAddress || item.address || '',
      coordinates: item.coordinates,
      source: 'featured-suggestion',
      raw: item.raw,
    });

    if (normalizedCategoryId != null) {
      setCategoryID(normalizedCategoryId);
      setCurrentTourismPointSettings({
        selectedCategory: normalizedCategoryId,
        selectedSubcategory: normalizedSubcategoryId ?? 0,
        page: 1,
      });
    }

    if (normalizedSubcategoryId != null) {
      const matchedSubcategory = dataLayerSubcategories.find(
        (subcategory) => String(subcategory?.id) === String(normalizedSubcategoryId)
      );
      if (matchedSubcategory) {
        setSelectedSubcategoryIds([matchedSubcategory.id]);
      } else {
        setSelectedSubcategoryIds([]);
      }
    } else {
      setSelectedSubcategoryIds([]);
    }

    if (Array.isArray(item.coordinates) && item.coordinates.length >= 2 && mapRef) {
      mapRef.flyTo({
        center: item.coordinates,
        zoom: 14,
        speed: 0.85,
        essential: true,
      });
    }
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
                'Điểm bạn đang xem thuộc subcategory đã tắt. Hãy bật lại lớp dữ liệu hoặc chọn điểm khác trên bản đồ.',
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
    <div className="bg-card overflow-hidden rounded-[20px] border">
      {/* image */}
      {destination.main_image_url ? (
        <img
          src={withBaseUrl(destination.main_image_url)}
          alt={destination.name}
          className="block h-49 w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
      ) : (
        <div className="text-muted-foreground bg-muted/30 flex h-49 items-center justify-center gap-2 text-sm">
          <ImageOff className="h-4 w-4" />
          {t('mapPage.destination.noImage', { defaultValue: 'Không có ảnh đại diện' })}
        </div>
      )}

      {/* destination-body */}
      <div className="p-3.5">
        {/* badge-row */}
        <div className="mb-2.5 flex flex-wrap gap-2">
          {categoryName && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-full px-2.5 py-1 text-sm font-bold">
              {categoryName}
            </Badge>
          )}
          {destination.average_rating != null && (
            <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-sm font-bold">
              {parseFloat(destination.average_rating).toFixed(1)} ★
            </Badge>
          )}
        </div>

        {/* name */}
        <h3 className="mb-2 text-2xl leading-tight font-bold">{destination.name}</h3>

        {/* description */}
        {descriptionHasHtml ? (
          <div
            className="text-muted-foreground text-sm leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: sanitizedDescriptionHtml }}
          />
        ) : (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {detailDescription ||
              t('mapPage.destination.noDescription', {
                defaultValue: 'Chưa có mô tả cho điểm này.',
              })}
          </p>
        )}

        {/* action-stack */}
        <div className="mt-3.5 grid gap-2.5">
          <Button
            type="button"
            variant="outline"
            className="h-11.5 w-full rounded-[14px] font-bold"
            onClick={() => {}}
          >
            {t('mapPage.destination.viewDetail', { defaultValue: 'Xem chi tiết bài viết' })}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11.5 w-full rounded-[14px] font-bold"
            onClick={() => onOpenVr?.(destination)}
          >
            {t('mapPage.destination.openVr', { defaultValue: 'Mở tham quan VR360' })}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11.5 w-full rounded-[14px] font-bold"
            onClick={() => onOpenRoute?.(destination)}
          >
            {t('mapPage.destination.openRoute', { defaultValue: 'Chỉ đường thông minh' })}
          </Button>
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-foreground text-sm font-bold">
              {t('mapPage.destination.featuredSuggestions', {
                defaultValue: 'Gợi ý điểm nổi bật',
              })}
            </p>
            {isFeaturedLoading ? (
              <span className="text-muted-foreground text-sm">
                {t('common.loading', { defaultValue: 'Đang tải...' })}
              </span>
            ) : null}
          </div>

          {featuredSuggestions.length === 0 ? (
            <div className="text-muted-foreground rounded-lg border border-dashed p-2.5 text-sm">
              {t('mapPage.destination.noFeaturedSuggestions', {
                defaultValue: 'Chưa có dữ liệu gợi ý.',
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {featuredSuggestions.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant="outline"
                  className="h-auto min-h-16 justify-start rounded-xl px-3 py-2 text-left"
                  onClick={() => handleSelectFeaturedSuggestion(item)}
                >
                  <span className="min-w-0 space-y-1">
                    <span className="text-foreground block truncate text-sm font-semibold">
                      {item.displayName || item.name}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1.5 text-sm font-normal">
                      <span className="max-w-[70%] truncate">
                        {item.displayCategory ||
                          t('mapPage.destination.unknownCategory', {
                            defaultValue: 'Chưa phân loại',
                          })}
                      </span>
                      {item.ratingText ? (
                        <span className="shrink-0">• {item.ratingText} ★</span>
                      ) : null}
                    </span>
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
