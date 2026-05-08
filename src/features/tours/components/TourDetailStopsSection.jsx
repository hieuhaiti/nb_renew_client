import React, { useMemo } from 'react';
import { Clock3, MapPin } from 'lucide-react';
import { formatStopDuration } from '@/lib/utils';

export function TourDetailStopsSection({ stops, t }) {
  const byDay = useMemo(() => {
    if (!Array.isArray(stops) || stops.length === 0) return [];
    const map = new Map();
    [...stops]
      .sort((a, b) => a.day_number - b.day_number || a.stop_order - b.stop_order)
      .forEach((stop) => {
        const day = stop.day_number ?? 1;
        if (!map.has(day)) map.set(day, []);
        map.get(day).push(stop);
      });
    return Array.from(map.entries());
  }, [stops]);

  if (byDay.length === 0) return null;

  return (
    <section className="bg-card border-border mb-3 rounded-[10px] border-[0.5px] px-4 py-3.5">
      <h2 className="text-foreground mb-3 text-sm font-medium">
        {t('tourPage.itinerary', 'Lịch trình')}
      </h2>

      <div className="space-y-4">
        {byDay.map(([day, dayStops]) => (
          <div key={day}>
            {byDay.length > 1 && (
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-[6px] px-2 py-0.5 text-sm font-semibold">
                  {t('tourPage.day', 'Ngày')} {day}
                </span>
                <div className="bg-muted h-px flex-1" />
              </div>
            )}

            <div className="relative space-y-0">
              {dayStops.map((stop, idx) => {
                const isLast = idx === dayStops.length - 1;
                const duration = formatStopDuration(stop.planned_duration_min);

                return (
                  <div key={stop.id} className="flex gap-3">
                    {/* Timeline line + circle */}
                    <div className="flex flex-col items-center">
                      <div className="border-primary bg-muted text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] text-sm font-semibold">
                        {stop.stop_order}
                      </div>
                      {!isLast && <div className="bg-muted my-0.5 w-px flex-1" />}
                    </div>

                    {/* Content */}
                    <div className={`min-w-0 flex-1 pb-3 ${isLast ? '' : ''}`}>
                      <p
                        className="text-foreground text-sm font-medium"
                        title={stop.title_vi || ''}
                      >
                        {stop.title_vi || t('tourPage.unknown', '?i?m d?ng')}
                      </p>
                      {stop.description_vi && (
                        <p className="text-muted-foreground mt-0.5 text-sm">
                          {stop.description_vi}
                        </p>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {duration && (
                          <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                            <Clock3 className="h-3 w-3" />
                            {duration}
                          </span>
                        )}
                        {stop.geom?.coordinates && (
                          <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {stop.geom.coordinates[1].toFixed(4)},{' '}
                            {stop.geom.coordinates[0].toFixed(4)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
