import React, { useMemo } from 'react';
import { Map, Phone, RectangleGoggles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { useGetNearbyPoints } from '@/services/api/tourism-points/tourismPointsApi';
import { useGetAframeScenes } from '@/services/api/vr360/aframeSceneService';

const toNumberOrNull = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getNearbySource = (payload) => {
  const fromData = payload?.data || payload;
  const candidates = [
    fromData?.spots,
    fromData?.points,
    fromData?.items,
    fromData?.nearby_points,
    fromData?.nearby,
    payload?.spots,
    payload?.points,
    payload?.items,
  ];
  return candidates.find((item) => Array.isArray(item)) || [];
};

export function TourismDetailSidebar({
  ticketDisplay,
  childTicketDisplay,
  onOpenMap,
  onContact,
  rows,
  nearbyPoints = [],
  lat,
  lng,
  radiusKm = 8,
  currentPointId,
  t,
}) {
  const normalizedLat = useMemo(() => toNumberOrNull(lat), [lat]);
  const normalizedLng = useMemo(() => toNumberOrNull(lng), [lng]);

  const navigate = useNavigate();

  const { data: scenesData } = useGetAframeScenes({ spotId: currentPointId });
  const hasVrTour = useMemo(() => {
    const d = scenesData?.data ?? scenesData;
    const scenes = Array.isArray(d) ? d : d?.scenes || d?.items || [];
    return scenes.length > 0;
  }, [scenesData]);

  const handleVrTour = () => {
    navigate('/vr360', { state: { spotId: currentPointId } });
  };

  const { data: nearbyResp } = useGetNearbyPoints({
    lat: normalizedLat,
    lng: normalizedLng,
    radius_km: radiusKm,
    limit: 5,
  });

  const resolvedNearbyPoints = useMemo(() => {
    const apiSource = getNearbySource(nearbyResp);
    const source = apiSource.length > 0 ? apiSource : nearbyPoints;

    return source
      .filter(Boolean)
      .filter((item) =>
        currentPointId == null ? true : String(item?.id || '') !== String(currentPointId)
      )
      .slice(0, 4)
      .map((item, index) => {
        const distanceMeters = Number(item?.distance_m ?? item?.distance);
        let distanceLabel = item?.distance_text || item?.distance || null;
        if (Number.isFinite(distanceMeters)) {
          if (distanceMeters >= 1000) {
            distanceLabel = `${(distanceMeters / 1000).toFixed(1)} km`;
          } else {
            distanceLabel = `${Math.round(distanceMeters)} m`;
          }
        }

        return {
          id: item?.id || `nearby-${index}`,
          name:
            item?.name_vi ||
            item?.name_en ||
            item?.name ||
            t('tourism.nearby_point_name', `Point ${index + 1}`),
          distance: distanceLabel || t('tourism.nearby_distance_unknown', 'Unknown distance'),
          image:
            item?.primary_image ||
            item?.cover_image_url ||
            item?.main_image_url ||
            item?.image ||
            item?.category_icon ||
            '',
          slug: item?.slug || null,
        };
      });
  }, [nearbyResp, nearbyPoints, currentPointId, t]);

  return (
    <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
      {/* Ticket price */}
      <section className="rounded-[18px] px-5 py-5" style={{ background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' }}>
        <div className="text-2xl font-black text-white">{ticketDisplay}</div>
        {childTicketDisplay && (
          <div className="mt-0.5 text-sm text-white/75">
            {t('tourism.ticket_child', 'Trẻ em')}: {childTicketDisplay}
          </div>
        )}
        <p className="mt-1 text-sm text-white/70">
          {t('tourism.price_subtitle', 'Thông tin giá vé từ điểm tham quan')}
        </p>

        <div className="mt-4 space-y-2.5">
          <button
            type="button"
            onClick={onOpenMap}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[10px] bg-white text-sm font-semibold text-[#0b66c3] transition hover:bg-[#eef7ff]"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourism.view_on_map', 'Xem trên bản đồ')}
          </button>
          <button
            type="button"
            onClick={onContact}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/15 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourism.contact', 'Liên hệ điểm tham quan')}
          </button>
          {hasVrTour && (
            <button
              type="button"
              onClick={handleVrTour}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/15 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              <RectangleGoggles className="h-3.5 w-3.5" />
              {t('tourism.vr_tour', 'Tour VR 360°')}
            </button>
          )}
        </div>
      </section>

      {/* Info rows */}
      <section className="bg-card rounded-[18px] border border-[#cfe0f4] px-4 py-2">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-3 border-b border-[#eef3f8] py-3.5 last:border-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef7ff]">
              {row.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">{row.label}</div>
              <div className="mt-0.5 truncate text-sm font-semibold text-foreground" title={typeof row.value === 'string' ? row.value : undefined}>
                {row.href ? (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0b66c3] hover:underline"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </div>
            </div>
            <ChevronRight size={14} className="shrink-0 text-muted-foreground" />
          </div>
        ))}
      </section>

      {/* Nearby points */}
      <section className="bg-card rounded-[18px] border border-[#cfe0f4] px-4 py-4">
        <h3 className="mb-3 text-base font-bold text-foreground">
          {t('tourism.nearby_points', 'Điểm lân cận')}
        </h3>

        {resolvedNearbyPoints.length > 0 ? (
          <div className="flex flex-col gap-2">
            {resolvedNearbyPoints.map((point) => (
              <article
                key={point.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/tourism-point/point/${point.slug || point.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/tourism-point/point/${point.slug || point.id}`);
                  }
                }}
                className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-[12px] border border-[#cfe0f4] bg-[#f8fbff] transition-colors hover:bg-[#eef7ff]"
              >
                <img
                  src={withBaseUrl(point.image)}
                  alt={point.name}
                  className="h-14 w-14 shrink-0 rounded-l-[12px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
                <div className="flex-1 py-2 pr-3">
                  <div className="truncate text-sm font-semibold text-foreground" title={point.name}>
                    {point.name}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground" title={point.distance}>
                    {point.distance}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('tourism.no_nearby_points', 'Chưa có dữ liệu điểm lân cận.')}
          </p>
        )}
      </section>
    </aside>
  );
}
