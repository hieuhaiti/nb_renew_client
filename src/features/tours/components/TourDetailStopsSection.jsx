import React, { useMemo } from 'react';
import { Clock3, MapPin } from 'lucide-react';

function formatStopDuration(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}g ${m}p`;
  if (h > 0) return `${h} giờ`;
  return `${m} phút`;
}

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
    <section className="bg-card mb-3 rounded-[10px] border-[0.5px] border-nature-border px-4 py-3.5">
      <h2 className="text-foreground mb-3 text-sm font-medium">
        {t('tourPage.itinerary', 'Lịch trình')}
      </h2>

      <div className="space-y-4">
        {byDay.map(([day, dayStops]) => (
          <div key={day}>
            {byDay.length > 1 && (
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-[6px] bg-nature px-2 py-0.5 text-xs font-semibold text-nature-foreground">
                  {t('tourPage.day', 'Ngày')} {day}
                </span>
                <div className="h-px flex-1 bg-nature-soft" />
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
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-nature bg-nature-soft text-xs font-semibold text-nature">
                        {stop.stop_order}
                      </div>
                      {!isLast && <div className="my-0.5 w-px flex-1 bg-nature-soft" />}
                    </div>

                    {/* Content */}
                    <div className={`pb-3 min-w-0 flex-1 ${isLast ? '' : ''}`}>
                      <p
                        className="text-foreground text-xs font-medium"
                        title={stop.title_vi || ''}
                      >
                        {stop.title_vi || t('tourPage.unknown', '?i?m d?ng')}
                      </p>
                      {stop.description_vi && (
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {stop.description_vi}
                        </p>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {duration && (
                          <span className="text-nature-label inline-flex items-center gap-1 text-xs">
                            <Clock3 className="h-3 w-3" />
                            {duration}
                          </span>
                        )}
                        {stop.geom?.coordinates && (
                          <span className="text-nature-label inline-flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {stop.geom.coordinates[1].toFixed(4)}, {stop.geom.coordinates[0].toFixed(4)}
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
