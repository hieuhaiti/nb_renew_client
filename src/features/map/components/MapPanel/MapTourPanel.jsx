import { useMemo } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Map as MapIcon,
  Route,
  Sparkles,
  Star,
  Ticket,
  Users,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import mapboxgl from 'mapbox-gl';
import { Button } from '@/components/ui/button';
import { useMapPanelStore } from '@/features/map/store/useMapPanelStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useTourPanelStore } from '@/features/tours/store/useTourPanelStore';
import placeholderImg from '@/assets/images/placeholder.png';
import { withBaseUrl } from '@/lib/utils';

const STOP_ACCENTS = [
  {
    rail: 'from-cyan-500 to-sky-500',
    border: 'border-cyan-200/80',
    badge: 'bg-cyan-500/10 text-cyan-700',
  },
  {
    rail: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-200/80',
    badge: 'bg-emerald-500/10 text-emerald-700',
  },
  {
    rail: 'from-amber-500 to-orange-500',
    border: 'border-amber-200/80',
    badge: 'bg-amber-500/10 text-amber-700',
  },
  {
    rail: 'from-violet-500 to-fuchsia-500',
    border: 'border-violet-200/80',
    badge: 'bg-violet-500/10 text-violet-700',
  },
];

function sortStops(stops) {
  const list = Array.isArray(stops) ? stops : [];
  return [...list].sort(
    (a, b) => (a.day_number ?? 1) - (b.day_number ?? 1) || (a.stop_order ?? 0) - (b.stop_order ?? 0)
  );
}

function buildDayGroups(stops) {
  if (!Array.isArray(stops) || stops.length === 0) return [];

  const map = new Map();
  stops.forEach((stop) => {
    const day = stop.day_number ?? 1;
    if (!map.has(day)) map.set(day, []);
    map.get(day).push(stop);
  });

  return Array.from(map.entries());
}

function resolveSpot(stop) {
  if (stop?.spot && typeof stop.spot === 'object') return stop.spot;
  if (stop?.point && typeof stop.point === 'object') return stop.point;
  return null;
}

function pickLocalizedText(item, viKey, enKey, isEnglish, fallback = '') {
  if (!item || typeof item !== 'object') return fallback;
  if (isEnglish) return item?.[enKey] || item?.[viKey] || fallback;
  return item?.[viKey] || item?.[enKey] || fallback;
}

function resolveStopLabel(stop, fallbackLabel, isEnglish) {
  if (isEnglish) {
    return (
      stop?.title_en ||
      stop?.title_vi ||
      stop?.spot_name_en ||
      stop?.spot_name_vi ||
      stop?.spot_name ||
      fallbackLabel
    );
  }

  return (
    stop?.title_vi ||
    stop?.title_en ||
    stop?.spot_name_vi ||
    stop?.spot_name_en ||
    stop?.spot_name ||
    fallbackLabel
  );
}

function resolveStopDescription(stop, spot, isEnglish) {
  if (isEnglish) {
    return (
      stop?.description_en ||
      stop?.description_vi ||
      pickLocalizedText(spot, 'description_vi', 'description_en', true, spot?.description || '')
    );
  }

  return (
    stop?.description_vi ||
    stop?.description_en ||
    pickLocalizedText(spot, 'description_vi', 'description_en', false, spot?.description || '')
  );
}

function parseGeo(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getStopCoordinates(stop, spot) {
  const geo = parseGeo(stop?.geom_json) || parseGeo(stop?.geom) || spot?.geojson || spot?.geom_json;
  const geoCoords = Array.isArray(geo?.coordinates) ? geo.coordinates : null;

  if (geoCoords?.length >= 2) {
    const lng = Number(geoCoords[0]);
    const lat = Number(geoCoords[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }

  const lat = Number(spot?.latitude);
  const lng = Number(spot?.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };

  return null;
}

function formatDuration(totalMinutes) {
  const minutes = Number(totalMinutes);
  if (!Number.isFinite(minutes) || minutes <= 0) return null;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours > 0 && remaining > 0) return `${hours}h ${remaining}m`;
  if (hours > 0) return `${hours}h`;
  return `${remaining}m`;
}

function formatTicketPrice(priceLike, currency = 'VND', locale = 'vi-VN') {
  const value = Number(priceLike);
  if (!Number.isFinite(value) || value <= 0) return null;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function TourStopCard({ stop, day, order, accent }) {
  const { t, i18n } = useTranslation();
  const isEnglish = String(i18n.resolvedLanguage || i18n.language || '').startsWith('en');

  const spot = resolveSpot(stop);
  const label = resolveStopLabel(
    stop,
    t('mapPage.tourPanel.stopFallbackLabel', {
      defaultValue: 'Stop {{index}}',
      index: order,
    }),
    isEnglish
  );
  const description = resolveStopDescription(stop, spot, isEnglish);
  const durationLabel = formatDuration(stop?.planned_duration_min);
  const coords = getStopCoordinates(stop, spot);
  const ticketLabel = formatTicketPrice(
    spot?.ticket_price_adult,
    spot?.ticket_currency || 'VND',
    isEnglish ? 'en-US' : 'vi-VN'
  );

  const rating = Number(spot?.rating_avg);
  const hasRating = Number.isFinite(rating) && rating > 0;
  const capacityPct = Number(spot?.current_capacity_pct);
  const hasCapacityPct = Number.isFinite(capacityPct);

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border ${accent.border} from-background via-background to-muted/35 bg-gradient-to-br p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${accent.rail}`} />

      <div className="space-y-2 pl-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="typo-meta text-muted-foreground">
              {t('mapPage.tourPanel.dayStopLabel', {
                defaultValue: 'Day {{day}} - Stop {{order}}',
                day,
                order,
              })}
            </p>
            <h4 className="typo-body text-foreground line-clamp-1 font-semibold" title={label}>
              {label}
            </h4>
          </div>

          <span
            className={`typo-badge inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${accent.badge}`}
          >
            <Route className="h-3 w-3" />#{order}
          </span>
        </div>

        {description ? (
          <p className="typo-meta text-muted-foreground line-clamp-2">{description}</p>
        ) : null}

        <div className="flex flex-wrap gap-1.5">
          {durationLabel ? (
            <span className="typo-meta border-border/70 bg-muted/70 text-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1">
              <Clock3 className="h-3.5 w-3.5" />
              {durationLabel}
            </span>
          ) : null}

          {ticketLabel ? (
            <span className="typo-meta border-border/70 bg-muted/70 text-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1">
              <Ticket className="h-3.5 w-3.5" />
              {ticketLabel}
            </span>
          ) : null}

          {hasRating ? (
            <span className="typo-meta border-border/70 bg-muted/70 text-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              {rating.toFixed(1)}
            </span>
          ) : null}

          {hasCapacityPct ? (
            <span className="typo-meta border-border/70 bg-muted/70 text-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1">
              <Users className="h-3.5 w-3.5" />
              {capacityPct.toFixed(0)}%
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function TourStopList({ stops, tourName }) {
  const { t } = useTranslation();

  const sortedStops = useMemo(() => sortStops(stops), [stops]);
  const dayGroups = useMemo(() => buildDayGroups(sortedStops), [sortedStops]);

  const totalDurationMin = useMemo(
    () =>
      sortedStops.reduce((sum, stop) => {
        const next = Number(stop?.planned_duration_min);
        return Number.isFinite(next) ? sum + next : sum;
      }, 0),
    [sortedStops]
  );

  const totalDays = useMemo(
    () => new Set(sortedStops.map((stop) => stop?.day_number ?? 1)).size,
    [sortedStops]
  );

  if (sortedStops.length === 0) {
    return (
      <div className="typo-meta text-muted-foreground border-border/70 rounded-xl border border-dashed px-3 py-6 text-center">
        {t('mapPage.tourPanel.noStopsAvailable', {
          defaultValue: 'No stops available for this tour.',
        })}
      </div>
    );
  }

  const totalDurationLabel = formatDuration(totalDurationMin) || '0m';

  return (
    <div className="space-y-3 pb-1">
      <div className="grid grid-cols-3 gap-2">
        <div className="border-border/70 rounded-lg border bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-2">
          <p className="typo-meta text-muted-foreground">
            {t('mapPage.tourPanel.statsDays', { defaultValue: 'Days' })}
          </p>
          <p className="typo-body text-foreground font-semibold">{totalDays}</p>
        </div>

        <div className="border-border/70 rounded-lg border bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-2">
          <p className="typo-meta text-muted-foreground">
            {t('mapPage.tourPanel.statsStops', { defaultValue: 'Stops' })}
          </p>
          <p className="typo-body text-foreground font-semibold">{sortedStops.length}</p>
        </div>

        <div className="border-border/70 rounded-lg border bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-2">
          <p className="typo-meta text-muted-foreground">
            {t('mapPage.tourPanel.statsDuration', { defaultValue: 'Duration' })}
          </p>
          <p className="typo-body text-foreground font-semibold">{totalDurationLabel}</p>
        </div>
      </div>

      {dayGroups.map(([day, dayStops], groupIndex) => (
        <section key={day} className="space-y-2">
          {groupIndex > 0 ? <hr className="border-border/70" /> : null}

          <div className="flex items-center justify-between gap-2">
            <span className="typo-badge border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {t('mapPage.tourPanel.dayLabel', {
                defaultValue: 'Day {{day}}',
                day,
              })}
            </span>
            <span className="typo-meta text-muted-foreground">
              {t('mapPage.tourPanel.stopCount', {
                defaultValue: '{{count}} stops',
                count: dayStops.length,
              })}
            </span>
          </div>

          <div className="space-y-2">
            {dayStops.map((stop, idx) => {
              const accent = STOP_ACCENTS[(Number(day) + idx) % STOP_ACCENTS.length];
              const order = stop?.stop_order ?? idx + 1;

              return (
                <TourStopCard
                  key={stop?.id ?? `${day}-${idx}`}
                  stop={stop}
                  day={day}
                  order={order}
                  accent={accent}
                />
              );
            })}
          </div>
        </section>
      ))}

      <div className="border-border/70 bg-muted/25 rounded-lg border px-3 py-2">
        <p className="typo-meta text-muted-foreground line-clamp-1">
          {tourName || t('mapPage.tourPanel.itineraryTitle', { defaultValue: 'Itinerary details' })}
        </p>
        <p className="typo-meta text-muted-foreground mt-1">
          {t('mapPage.tourPanel.filteredStopCount', {
            defaultValue: '{{filtered}}/{{total}} stops',
            filtered: sortedStops.length,
            total: sortedStops.length,
          })}
        </p>
      </div>
    </div>
  );
}

function TourPanelBody({ tourName, stops, selectedTour, onClose, onFocusRoute }) {
  const { t } = useTranslation();
  const sortedStops = useMemo(() => sortStops(stops), [stops]);

  const coverImage = useMemo(() => {
    if (!selectedTour?.cover_image_url) return null;
    return withBaseUrl(selectedTour.cover_image_url);
  }, [selectedTour]);

  return (
    <div className="flex h-full min-h-0 flex-col p-2">
      <div className="border-border/70 from-primary/15 via-primary/5 to-background mb-2 flex items-center justify-between gap-2 rounded-xl border bg-gradient-to-r px-3 py-2">
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5">
            <Sparkles className="text-primary h-3.5 w-3.5" />
            <p className="typo-overline text-primary/85">
              {t('mapPage.tourPanel.label', { defaultValue: 'Tour' })}
            </p>
          </div>

          <p
            className="text-foreground line-clamp-2 text-sm font-bold 2xl:text-base"
            title={tourName ?? undefined}
          >
            {tourName ||
              t('mapPage.tourPanel.itineraryTitle', { defaultValue: 'Itinerary details' })}
          </p>

          <p className="typo-meta text-muted-foreground">
            {t('mapPage.tourPanel.totalStopCount', {
              defaultValue: '{{count}} stops in this itinerary',
              count: sortedStops.length,
            })}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t('common.close', { defaultValue: 'Close' })}
            className="h-8 w-8 rounded-lg shadow-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-border/70 bg-muted/20 mb-3 flex min-h-40 items-center justify-center overflow-hidden rounded-xl border">
        <img
          src={coverImage || placeholderImg}
          alt={t('mapPage.tourPanel.coverAlt', {
            defaultValue: '{{tourName}} cover image',
            tourName: tourName || t('mapPage.tourPanel.title', { defaultValue: 'Tour' }),
          })}
          className="h-full w-full object-cover object-center"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = placeholderImg;
          }}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <TourStopList stops={sortedStops} tourName={tourName} />
      </div>
    </div>
  );
}

/**
 * Floating panel displayed over the map canvas when a tour route is active.
 * Reads tour data directly from useMapPanelStore.
 *
 * @param {{ isOpen: boolean, onOpen: () => void, onClose: () => void, embedded?: boolean, className?: string, panelWidthClass?: string }} props
 */
export default function MapTourPanel({
  isOpen,
  onOpen,
  onClose,
  embedded = false,
  className,
  panelWidthClass,
}) {
  const { t } = useTranslation();
  const tourName = useMapPanelStore((s) => s.tourName);
  const tourStops = useMapPanelStore((s) => s.tourStops);
  const selectedTour = useTourPanelStore((s) => s.selectedTour);
  const highlightedRoute = useMapStore((s) => s.highlightedRoute);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapRefObj = useMapStore((state) => state.mapRefObj);
  const resolvedPanelWidthClass = panelWidthClass || (embedded ? 'w-full' : 'w-80');

  const handleFocusRoute = () => {
    const coordinates = highlightedRoute?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return;

    const targetMap = mapRef || mapRefObj?.current?.single || null;
    if (!targetMap) return;

    const fitRouteBounds = () => {
      const bounds = coordinates.reduce(
        (acc, coord) => acc.extend(coord),
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );
      targetMap.fitBounds(bounds, { padding: 88, duration: 800 });
    };

    if (targetMap.isStyleLoaded?.()) {
      fitRouteBounds();
    } else {
      targetMap.once('style.load', fitRouteBounds);
    }
  };

  if (!isOpen) {
    if (embedded) {
      return (
        <div className={className}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t('common.open', { defaultValue: 'Open' })}
            className="border-border/80 bg-background/95 h-9 w-9 rounded-xl border shadow-sm backdrop-blur-sm"
            onClick={onOpen}
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="absolute top-4 bottom-4 left-4 z-20 flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t('common.open', { defaultValue: 'Open' })}
          className="border-border/80 bg-background/95 absolute -left-6 rounded-r-xl border border-l-0 shadow-sm backdrop-blur-sm"
          onClick={onOpen}
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  if (embedded) {
    return (
      <div className={className}>
        <div
          className={`relative flex h-fit max-h-full min-h-0 ${resolvedPanelWidthClass} border-border/80 bg-background/95 flex-col overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-300`}
        >
          <TourPanelBody
            tourName={tourName}
            stops={tourStops}
            selectedTour={selectedTour}
            onClose={onClose}
            onFocusRoute={handleFocusRoute}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 bottom-4 left-4 z-20 flex items-center">
      <div
        className={`relative flex h-fit max-h-full ${resolvedPanelWidthClass} border-border/80 bg-background/95 flex-col overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-300`}
      >
        <TourPanelBody
          tourName={tourName}
          stops={tourStops}
          selectedTour={selectedTour}
          onClose={onClose}
          onFocusRoute={handleFocusRoute}
        />
      </div>
    </div>
  );
}
