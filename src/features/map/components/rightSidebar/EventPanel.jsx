import { useMemo, useState } from 'react';
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
import { cn, getLocaleFromLanguage, withBaseUrl } from '@/lib/utils';
import { useLanguageStore } from '@/stores/useLanguageStore';

function FestivalRowSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-3">
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
  const resetFestivalFilters = useFestivalStore((state) => state.resetFestivalFilters);
  const [openingFestivalId, setOpeningFestivalId] = useState(null);

  const [debouncedSearch] = useDebounce(filters.search, 350);

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

  const typeOptions = useMemo(() => {
    const apiTypes = normalizeFestivalTypesPayload(festivalTypesData);
    return [{ value: 'all', label: t('common.all', { defaultValue: 'All' }) }, ...apiTypes];
  }, [festivalTypesData, t]);

  const festivals = useMemo(
    () => normalizeFestivalListPayload(festivalsData, { lang }),
    [festivalsData, lang]
  );

  const locale = getLocaleFromLanguage(lang);

  const openFestivalTarget = (festival) => {
    const coordinates = getFestivalCoordinates(festival);

    if (coordinates && mapRef) {
      mapRef.flyTo({
        center: coordinates,
        zoom: 13.5,
        speed: 0.85,
        essential: true,
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
      console.log(resolvedFestival);

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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-foreground text-sm font-semibold">
            {t('mapPage.eventPanel.title', { defaultValue: 'Lễ hội & Sự kiện' })}
          </p>
          <p className="text-muted-foreground text-xs">
            {isFetching
              ? t('mapPage.eventPanel.syncing', { defaultValue: 'Đang đồng bộ...' })
              : t('mapPage.eventPanel.count', {
                  defaultValue: '{{count}} sự kiện',
                  count: festivals.length,
                })}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 text-xs"
          onClick={resetFestivalFilters}
        >
          {t('mapPage.eventPanel.reset', { defaultValue: 'Đặt lại' })}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(event) => setFestivalFilters({ search: event.target.value, page: 1 })}
            placeholder={t('mapPage.eventPanel.searchPlaceholder', {
              defaultValue: 'Tìm tên lễ hội...',
            })}
            className="h-9 pr-2 pl-8 text-sm"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Select
            value={filters.festival_type}
            onValueChange={(value) => setFestivalFilters({ festival_type: value, page: 1 })}
          >
            <SelectTrigger className="h-9 w-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="sm"
            variant={filters.upcoming ? 'default' : 'outline'}
            className="h-9"
            onClick={() => setFestivalFilters({ upcoming: !filters.upcoming, page: 1 })}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t('mapPage.eventPanel.upcoming', { defaultValue: 'Sắp diễn ra' })}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <FestivalRowSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          {t('mapPage.eventPanel.error', {
            defaultValue: 'Không thể tải danh sách sự kiện từ hệ thống.',
          })}
        </div>
      ) : festivals.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          {t('mapPage.eventPanel.empty', {
            defaultValue: 'Không có sự kiện phù hợp với bộ lọc hiện tại.',
          })}
        </div>
      ) : (
        <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-0.5">
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
                  'space-y-2 rounded-lg border p-3 transition-colors',
                  isActive ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                )}
              >
                {cover ? (
                  <img
                    src={cover}
                    alt={festival.name}
                    className="h-28 w-full rounded-md object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImg;
                    }}
                  />
                ) : null}

                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-foreground line-clamp-2 text-sm font-semibold">
                      {festival.name}
                    </h4>
                    {festival.festival_type && (
                      <Badge variant="outline" className="shrink-0">
                        {festival.festival_type}
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    {formatFestivalDateRange(festival.start_date, festival.end_date, locale)}
                  </p>

                  {festival.location_name && (
                    <p className="text-muted-foreground line-clamp-1 flex items-center gap-1.5 text-xs">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {festival.location_name}
                    </p>
                  )}

                  {festival.description ? (
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {festival.description}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleOpenFestivalOnMap(festival)}
                    disabled={!festival?.id || openingFestivalId != null}
                  >
                    <LocateFixed className="h-3.5 w-3.5" />
                    {isOpening
                      ? t('mapPage.eventPanel.openingMap', { defaultValue: 'Đang mở...' })
                      : t('mapPage.eventPanel.viewOnMap', { defaultValue: 'Xem trên bản đồ' })}
                  </Button>

                  {festival.website ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
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
