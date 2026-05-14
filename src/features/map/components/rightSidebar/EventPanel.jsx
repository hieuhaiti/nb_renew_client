import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { CalendarDays, ExternalLink, LocateFixed, MapPin, Search, Sparkles } from 'lucide-react';
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
  fetchFestivalDetailById,
  useFestivalsQuery,
  useFestivalTypesQuery,
} from '@/services/api/map/festivalService';
import placeholderImg from '@/assets/images/placeholder.png';
import {
  formatFestivalDateRange,
  getFestivalCoordinates,
  normalizeFestivalListPayload,
  normalizeFestivalModel,
  normalizeFestivalTypesPayload,
} from '@/features/map/utils/festivalUtils';
import { useFestivalStore } from '@/features/map/store/useFestivalStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import { highlightPointOnMap } from '@/features/map/utils/MapHelper';
import { cn, getLocaleFromLanguage, withBaseUrl } from '@/lib/utils';
import { useLanguageStore } from '@/stores/useLanguageStore.js';

function FestivalRowSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border border-[var(--event-panel-border)] bg-[var(--event-panel-card-bg)] p-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-8 w-28" />
    </div>
  );
}

export default function EventPanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);
  const mapRef = useMapStore((state) => state.mapRef);

  const filters = useFestivalStore((state) => state.filters);
  const selectedFestival = useFestivalStore((state) => state.selectedFestival);
  const setFestivalFilters = useFestivalStore((state) => state.setFestivalFilters);
  const setSelectedFestival = useFestivalStore((state) => state.setSelectedFestival);
  const [openingFestivalId, setOpeningFestivalId] = useState(null);

  const [debouncedSearch] = useDebounce(filters.search, 350);

  const getFestivalTypeLabel = useCallback(
    (value, fallbackLabel = '') => {
      const normalizedKey = String(value || 'other')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_');

      return t(`mapPage.eventPanel.festivalTypes.${normalizedKey}`, {
        defaultValue:
          fallbackLabel || t('mapPage.eventPanel.festivalTypes.other', { defaultValue: 'Other' }),
      });
    },
    [t]
  );

  const { data: festivalTypesData } = useFestivalTypesQuery();
  const {
    data: festivalsData,
    isLoading,
    isFetching,
    isError,
  } = useFestivalsQuery({
    ...filters,
    search: debouncedSearch,
  });

  const festivals = useMemo(
    () => normalizeFestivalListPayload(festivalsData, { lang }),
    [festivalsData, lang]
  );

  const locale = getLocaleFromLanguage(lang);

  const openFestivalTarget = (festival) => {
    const coordinates = getFestivalCoordinates(festival);

    if (coordinates && mapRef) {
      highlightPointOnMap(mapRef, {
        id: festival?.id,
        coordinates,
        properties: festival || {},
      });
      return true;
    }

    // Only use slug for navigation when no coordinates
    if (festival?.spot_slug) {
      navigate(`/tourism-point/point/${festival.spot_slug}`);
      return true;
    }

    return false;
  };

  const handleOpenFestivalOnMap = async (festival) => {
    if (!festival?.id) return;

    setOpeningFestivalId(festival.id);

    try {
      const detail = await fetchFestivalDetailById(festival.id);
      //       {
      //     "message": "Chi tiết lễ hội",
      //     "status": 200,
      //     "data": {
      //         "id": "1e2c982a-f19d-4f16-a18f-1671fa5732ab",
      //         "province_code": "37",
      //         "spot_id": "bf23dd39-7f14-4c70-893d-584bb616f4a0",
      //         "name_vi": "Lễ Phật Đản Bái Đính - Lễ Hội Tôn Giáo Lớn Nhất",
      //         "name_en": "Bai Dinh Buddha Birthday Festival",
      //         "festival_type": "religious",
      //         "description_vi": "Lễ Phật Đản kéo dài 10 ngày tại Chùa Bái Đính với hàng chục ngàn người tham dự. Có các buổi lễ cầu nguyện, thắp nến dâng Phật, các bài giảng pháp từ các cao tăng nổi tiếng, múa mâm (múa cầu bình an), và những pháp hành thiêng liêng trong hang động. Có các gian hàng bán hương, hoa, lưu niệm tôn giáo và ẩm thực chay.",
      //         "start_date": "2026-05-15T05:00:00.000Z",
      //         "end_date": "2026-05-25T05:00:00.000Z",
      //         "is_recurring": true,
      //         "recurrence_rule": "FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=15",
      //         "geom": null,
      //         "cover_image_url": "/uploads/festivals/bai-dinh-buddha.jpg",
      //         "website": null,
      //         "is_published": true,
      //         "location_name": "Chùa Bái Đính Cổ, Nho Quan, Ninh Bình",
      //         "created_at": "2026-05-05T09:15:36.450Z",
      //         "updated_at": "2026-05-05T09:15:36.450Z",
      //         "name": "Lễ Phật Đản Bái Đính - Lễ Hội Tôn Giáo Lớn Nhất",
      //         "province_name": "Ninh Bình",
      //         "spot_name": "Chùa Bái Đính cổ",
      //         "lng": null,
      //         "lat": null
      //     }
      // }
      const normalizedDetail = detail
        ? normalizeFestivalModel(detail, { lang, fallbackId: festival.id })
        : null;
      const resolvedFestival = normalizedDetail ? { ...festival, ...normalizedDetail } : festival;

      setSelectedFestival(resolvedFestival);
      if (openFestivalTarget(resolvedFestival)) return;
    } catch (_error) {
      // Fallback to list payload when detail endpoint is temporarily unavailable.
    } finally {
      setOpeningFestivalId(null);
    }

    setSelectedFestival(festival);
    openFestivalTarget(festival);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
        <div>
          <p className="typo-section-title text-foreground">
            {t('mapPage.eventPanel.title', { defaultValue: 'Lễ hội' })}
          </p>
          <p className="typo-meta text-muted-foreground">
            {isFetching
              ? t('mapPage.eventPanel.syncing', { defaultValue: 'Đang đồng bộ...' })
              : t('mapPage.eventPanel.count', {
                  defaultValue: '{{count}} lễ hội',
                  count: festivals.length,
                })}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search className="text-primary-soft-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(event) => setFestivalFilters({ search: event.target.value, page: 1 })}
            placeholder={t('mapPage.eventPanel.searchPlaceholder', {
              defaultValue: 'Tìm tên lễ hội...',
            })}
            className="h-9 border-[var(--event-panel-border)] bg-[var(--event-panel-control-bg)] pr-2 pl-8 text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <FestivalRowSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="typo-meta text-muted-foreground rounded-xl border border-dashed border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-4 text-center">
          {t('mapPage.eventPanel.error', {
            defaultValue: 'Không thể tải danh sách sự kiện từ hệ thống.',
          })}
        </div>
      ) : festivals.length === 0 ? (
        <div className="typo-meta text-muted-foreground rounded-xl border border-dashed border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-4 text-center">
          {t('mapPage.eventPanel.empty', {
            defaultValue: 'Không có sự kiện phù hợp với bộ lọc hiện tại.',
          })}
        </div>
      ) : (
        <div className="space-y-2 pr-0.5">
          {festivals.map((festival) => {
            const isActive =
              selectedFestival != null && String(selectedFestival.id) === String(festival.id);
            const cover = withBaseUrl(festival.cover_image_url);
            const isOpening =
              openingFestivalId != null && String(openingFestivalId) === String(festival.id);

            return (
              <article
                key={festival.id}
                className={cn(
                  'space-y-2 rounded-xl border p-3 shadow-sm transition-colors',
                  isActive
                    ? 'border-[var(--event-panel-active-border)] bg-[var(--event-panel-active-bg)]'
                    : 'border-[var(--event-panel-border)] bg-[var(--event-panel-card-bg)] hover:bg-[var(--event-panel-card-hover-bg)]'
                )}
              >
                {cover ? (
                  <img
                    src={cover}
                    alt={festival.name}
                    className="h-28 w-full rounded-lg object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImg;
                    }}
                  />
                ) : null}

                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="typo-body text-foreground line-clamp-2 font-semibold">
                      {festival.name}
                    </h4>
                    {festival.festival_type && (
                      <Badge
                        variant="outline"
                        className="shrink-0 border-[var(--event-panel-chip-border)] bg-[var(--event-panel-chip-bg)] text-[var(--event-panel-chip-fg)]"
                      >
                        {getFestivalTypeLabel(festival.festival_type, festival.festival_type)}
                      </Badge>
                    )}
                  </div>

                  <p className="typo-meta text-muted-foreground flex items-center gap-1.5">
                    <CalendarDays className="text-tertiary h-3.5 w-3.5 shrink-0" />
                    {formatFestivalDateRange(festival.start_date, festival.end_date, locale)}
                  </p>

                  {festival.location_name && (
                    <p className="typo-meta text-muted-foreground line-clamp-1 flex items-center gap-1.5">
                      <MapPin className="text-secondary h-3.5 w-3.5 shrink-0" />
                      {festival.location_name}
                    </p>
                  )}

                  {festival.description ? (
                    <p className="typo-body text-muted-foreground line-clamp-2">
                      {festival.description}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    className="typo-meta h-8"
                    onClick={() => handleOpenFestivalOnMap(festival)}
                    disabled={!festival?.id || openingFestivalId != null}
                  >
                    <LocateFixed className="h-3.5 w-3.5 shrink-0" />
                    {isOpening
                      ? t('mapPage.eventPanel.openingMap', { defaultValue: 'Đang mở...' })
                      : t('mapPage.eventPanel.viewOnMap', { defaultValue: 'Xem trên bản đồ' })}
                  </Button>

                  {festival.website ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="typo-meta h-8"
                      asChild
                    >
                      <a href={festival.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t('mapPage.eventPanel.website', { defaultValue: 'Website' })}
                      </a>
                    </Button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
