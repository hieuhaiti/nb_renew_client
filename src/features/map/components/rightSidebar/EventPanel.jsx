import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { CalendarDays, ExternalLink, LocateFixed, MapPin, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from '@/features/map/utils/festivalUtils';
import { useFestivalStore } from '@/features/map/store/useFestivalStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import { highlightPointOnMap } from '@/features/map/utils/MapHelper';
import { cn, getLocaleFromLanguage, withBaseUrl } from '@/lib/utils';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        defaultValue: fallbackLabel || t('mapPage.eventPanel.festivalTypes.other'),
      });
    },
    [t]
  );

  useFestivalTypesQuery();
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
      const normalizedDetail = detail
        ? normalizeFestivalModel(detail, { lang, fallbackId: festival.id })
        : null;
      const resolvedFestival = normalizedDetail ? { ...festival, ...normalizedDetail } : festival;

      setSelectedFestival(resolvedFestival);
      if (openFestivalTarget(resolvedFestival)) return;
    } catch (_error) {
      // Fall back to the list payload if the detail endpoint is unavailable.
    } finally {
      setOpeningFestivalId(null);
    }

    setSelectedFestival(festival);
    openFestivalTarget(festival);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3">
      <div className="flex shrink-0 items-center justify-between gap-2 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
        <div>
          <p className="typo-section-title text-foreground">{t('mapPage.eventPanel.title')}</p>
          <p className="typo-meta text-muted-foreground">
            {isFetching
              ? t('mapPage.eventPanel.syncing')
              : t('mapPage.eventPanel.count', { count: festivals.length })}
          </p>
        </div>
      </div>

      <div className="shrink-0 space-y-2">
        <div className="relative">
          <Search className="text-primary-soft-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(event) => setFestivalFilters({ search: event.target.value, page: 1 })}
            placeholder={t('mapPage.eventPanel.searchPlaceholder')}
            className="h-9 border-[var(--event-panel-border)] bg-[var(--event-panel-control-bg)] pr-2 pl-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <FestivalRowSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="typo-meta text-muted-foreground rounded-xl border border-dashed border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-4 text-center">
            {t('mapPage.eventPanel.error')}
          </div>
        ) : festivals.length === 0 ? (
          <div className="typo-meta text-muted-foreground rounded-xl border border-dashed border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] p-4 text-center">
            {t('mapPage.eventPanel.empty')}
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
                        ? t('mapPage.eventPanel.openingMap')
                        : t('mapPage.eventPanel.viewOnMap')}
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
                          {t('mapPage.eventPanel.website')}
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
