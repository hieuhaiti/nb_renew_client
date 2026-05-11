import { useMemo } from 'react';
import { ArrowRight, Clock, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useMapPanelStore } from '@/features/map/store/useMapPanelStore';

function buildDayGroups(stops) {
  if (!Array.isArray(stops) || stops.length === 0) return [];
  const map = new Map();
  [...stops]
    .sort((a, b) => (a.day_number ?? 1) - (b.day_number ?? 1) || (a.stop_order ?? 0) - (b.stop_order ?? 0))
    .forEach((stop) => {
      const day = stop.day_number ?? 1;
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(stop);
    });
  return Array.from(map.entries()); // [[dayNum, stopsArr], ...]
}

function TourStopList({ stops }) {
  const { t } = useTranslation();

  const dayGroups = useMemo(() => buildDayGroups(stops), [stops]);

  if (dayGroups.length === 0) {
    return (
      <p className="typo-meta text-muted-foreground py-6 text-center">
        {t('mapPage.tourPanel.noStops', { defaultValue: 'Không có điểm dừng.' })}
      </p>
    );
  }

  const isMultiDay = dayGroups.length > 1;

  return (
    <div className="space-y-0">
      {dayGroups.map(([day, dayStops], groupIndex) => (
        <div key={day}>
          {groupIndex > 0 && (
            <hr className="border-border my-3" />
          )}

          {isMultiDay && (
            <div className="mb-2 flex items-center gap-2">
              <span className="typo-badge bg-primary text-primary-foreground rounded-md px-2 py-0.5">
                {t('tourPage.day', { defaultValue: 'Ngày' })} {day}
              </span>
              <div className="bg-border h-px flex-1" />
            </div>
          )}

          <ol className="space-y-0">
            {dayStops.map((stop, idx) => {
              const label = stop.title_vi || stop.spot_name || `Điểm ${idx + 1}`;
              const isLast = idx === dayStops.length - 1;

              return (
                <li key={stop.id ?? `${day}-${idx}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="gradient-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <span className="typo-badge text-primary-foreground font-black">
                        {stop.stop_order ?? idx + 1}
                      </span>
                    </div>
                    {!isLast && <div className="bg-border/70 my-0.5 w-px flex-1" />}
                  </div>

                  <div className="min-w-0 flex-1 pb-3">
                    <p
                      className="typo-body text-foreground line-clamp-1 font-semibold"
                      title={label}
                    >
                      {label}
                    </p>

                    {stop.description_vi ? (
                      <p className="typo-meta text-muted-foreground line-clamp-2 mt-0.5">
                        {stop.description_vi}
                      </p>
                    ) : null}

                    {stop.planned_duration_min != null && (
                      <span className="typo-meta text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {stop.planned_duration_min} phút
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
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
  const resolvedPanelWidthClass = panelWidthClass || (embedded ? 'w-full' : 'w-80');

  if (!isOpen) {
    if (embedded) {
      return (
        <div className={className}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t('common.open', { defaultValue: 'Open' })}
            className="bg-background/95 border-border/80 h-9 w-9 rounded-xl border shadow-sm backdrop-blur-sm"
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
          className="bg-background/95 border-border/80 absolute -left-6 rounded-r-xl border border-l-0 shadow-sm backdrop-blur-sm"
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
          className={`bg-background/95 border-border/80 relative flex h-full min-h-0 ${resolvedPanelWidthClass} flex-col rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-300`}
        >
          <header className="border-border/60 flex shrink-0 items-center gap-2 border-b px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="typo-overline text-muted-foreground">
                {t('mapPage.tourPanel.label', { defaultValue: 'Tour' })}
              </p>
              <p className="typo-section-title text-foreground truncate" title={tourName ?? undefined}>
                {tourName || t('mapPage.tourPanel.title', { defaultValue: 'Tour du lịch' })}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t('common.close', { defaultValue: 'Close' })}
              className="h-7 w-7 shrink-0 rounded-full shadow-sm"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
            <TourStopList stops={tourStops} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 bottom-4 left-4 z-20 flex items-center">
      <div
        className={`bg-background/95 border-border/80 relative flex h-full ${resolvedPanelWidthClass} flex-col rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-300`}
      >
        <header className="border-border/60 flex shrink-0 items-center gap-2 border-b px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="typo-overline text-muted-foreground">
              {t('mapPage.tourPanel.label', { defaultValue: 'Tour' })}
            </p>
            <p
              className="typo-section-title text-foreground truncate"
              title={tourName ?? undefined}
            >
              {tourName || t('mapPage.tourPanel.title', { defaultValue: 'Tour du lịch' })}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t('common.close', { defaultValue: 'Close' })}
            className="h-7 w-7 shrink-0 rounded-full shadow-sm"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
          <TourStopList stops={tourStops} />
        </div>
      </div>
    </div>
  );
}
