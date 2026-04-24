import { useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { CalendarDays, ExternalLink, LocateFixed, MapPin, Search, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useFestivalsQuery, useFestivalTypesQuery } from '@/features/map/api/festivalService';
import {
  formatFestivalDateRange,
  getFestivalCoordinates,
  normalizeFestivalListPayload,
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

  const [debouncedSearch] = useDebounce(filters.search, 350);

  const { data: festivalTypesData } = useFestivalTypesQuery();
  const { data: festivalsData, isLoading, isFetching, isError } = useFestivalsQuery({
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

  const handleOpenFestivalOnMap = (festival) => {
    const coordinates = getFestivalCoordinates(festival);

    if (coordinates && mapRef) {
      mapRef.flyTo({
        center: coordinates,
        zoom: 13.5,
        speed: 0.85,
        essential: true,
      });
      return;
    }

    if (festival?.spot_id) {
      navigate(`/tourism-point/point/${festival.spot_id}`);
    }
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
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}

                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-foreground line-clamp-2 text-sm font-semibold">{festival.name}</h4>
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
                    <p className="text-muted-foreground line-clamp-2 text-xs">{festival.description}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setSelectedFestival(festival);
                      handleOpenFestivalOnMap(festival);
                    }}
                    disabled={!festival.coordinates && !festival.spot_id}
                  >
                    <LocateFixed className="h-3.5 w-3.5" />
                    {t('mapPage.eventPanel.viewOnMap', { defaultValue: 'Xem trên bản đồ' })}
                  </Button>

                  {festival.website ? (
                    <Button type="button" size="sm" variant="outline" className="h-8 text-xs" asChild>
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
