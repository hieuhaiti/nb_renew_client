import React, { useMemo } from 'react';
import { Clock3, MapPin, Images } from 'lucide-react';
import { formatStopDuration, withBaseUrl } from '@/lib/utils';
import { useGetSpotMedia } from '@/services/api/tourism-points/tourismPointsApi';
import { useModalCarouselStore } from '@/features/map/store/useModalStore';

function StopMediaStrip({ spot_id }) {
  const { data: mediaResp } = useGetSpotMedia({ spot_id, options: { enabled: Boolean(spot_id) } });
  const { openCarouselModal } = useModalCarouselStore();

  const images = useMemo(() => {
    const raw =
      mediaResp?.data?.media ||
      mediaResp?.data?.items ||
      mediaResp?.media ||
      (Array.isArray(mediaResp?.data) ? mediaResp.data : null) ||
      [];
    return raw
      .filter((m) => {
        const type = (m?.file_type || m?.media_type || m?.type || '').toLowerCase();
        return !type.startsWith('video');
      })
      .map((m) => m?.url || m?.file_url || m?.image_url || '')
      .filter(Boolean);
  }, [mediaResp]);

  if (!spot_id || images.length === 0) return null;

  const preview = images.slice(0, 3);
  const extra = images.length - preview.length;

  return (
    <div className="mt-2 flex items-center gap-1.5">
      {preview.map((url, i) => (
        <button
          key={i}
          type="button"
          className="relative h-12 w-16 shrink-0 overflow-hidden rounded-[8px] border border-[#cfe0f4] focus:outline-none"
          onClick={() => openCarouselModal(images)}
          aria-label="Xem ảnh địa điểm"
        >
          <img
            src={withBaseUrl(url)}
            alt=""
            className="h-full w-full object-cover transition-opacity hover:opacity-85"
          />
          {i === preview.length - 1 && extra > 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-[8px] bg-black/45 text-xs font-bold text-white">
              +{extra}
            </div>
          )}
        </button>
      ))}
      <button
        type="button"
        className="text-muted-foreground hover:text-primary ml-0.5 flex items-center gap-1 text-xs transition-colors"
        onClick={() => openCarouselModal(images)}
      >
        <Images className="h-3.5 w-3.5" />
        {images.length}
      </button>
    </div>
  );
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
                    <div className="flex flex-col items-center">
                      <div className="border-primary bg-muted text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] text-sm font-semibold">
                        {stop.stop_order}
                      </div>
                      {!isLast && <div className="bg-muted my-0.5 w-px flex-1" />}
                    </div>

                    <div className={`min-w-0 flex-1 pb-3`}>
                      <p
                        className="text-foreground text-sm font-medium"
                        title={stop.title_vi || ''}
                      >
                        {stop.title_vi || t('tourPage.unknown', 'Điểm dừng')}
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
                      <StopMediaStrip spot_id={stop.spot_id} />
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
