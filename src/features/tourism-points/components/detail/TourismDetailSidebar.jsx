import React, { useMemo } from 'react';
import { Map, Phone, RectangleGoggles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { useGetNearbyPoints } from '@/services/api/tourism-points/tourismPointsApi';
import { useGetAframeScenes } from '@/services/api/vr360/aframeSceneService';

const accentBorders = [
  'border-l-primary',
  'border-l-secondary',
  'border-l-tertiary',
  'border-l-quaternary',
  'border-l-quinary',
];

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
    <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
      {/* Ticket price */}
      <section className="bg-primary rounded-[10px] px-5 py-4">
        <div className="text-primary-foreground text-xl font-semibold">{ticketDisplay}</div>
        {childTicketDisplay && (
          <div className="text-primary-foreground/70 mt-0.5 text-sm">
            {t('tourism.ticket_child', 'Trẻ em')}: {childTicketDisplay}
          </div>
        )}
        <p className="text-primary-foreground/70 mt-1 text-sm">
          {t('tourism.price_subtitle', 'Thông tin giá vé từ điểm tham quan')}
        </p>

        <div className="mt-4 space-y-2">
          <Button
            onClick={onOpenMap}
            className="text-primary hover:text-primary bg-card hover:bg-muted h-8.5 w-full rounded-[7px] text-sm font-medium"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourism.view_on_map', 'Xem trên bản đồ')}
          </Button>
          <Button
            onClick={onContact}
            variant="ghost"
            className="border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-8.5 w-full rounded-[7px] border text-sm"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourism.contact', 'Liên hệ điểm tham quan')}
          </Button>
          {hasVrTour && (
            <Button
              onClick={handleVrTour}
              variant="ghost"
              className="border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-8.5 w-full rounded-[7px] border text-sm"
            >
              <RectangleGoggles className="h-3.5 w-3.5" />
              {t('tourism.vr_tour', 'Tour VR 360°')}
            </Button>
          )}
        </div>
      </section>

      {/* Info rows */}
      <section className="bg-card border-border rounded-[10px] border px-4 py-3.5">
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className={`bg-card border-border flex items-start gap-2.5 rounded-[8px] border border-l-[3px] px-3 py-2.5 ${accentBorders[index % accentBorders.length]}`}
            >
              <div className="bg-muted/60 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px]">
                <span className={`h-2 w-2 rounded-full ${row.dotClass}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {row.label}
                </div>
                <div className="mt-0.5 truncate text-sm font-medium" title={row.value}>
                  {row.href ? (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="text-foreground">{row.value}</span>
                  )}
                </div>
              </div>
              <div className="shrink-0">{row.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby points */}
      <section className="bg-card border-border rounded-[10px] border px-4 py-3.5">
        <h3 className="text-foreground mb-3 text-sm font-semibold">
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
                className="bg-muted/30 border-border hover:bg-muted/60 flex cursor-pointer items-center overflow-hidden rounded-[9px] border transition-colors"
              >
                <img
                  src={withBaseUrl(point.image)}
                  alt={point.name}
                  className="h-14 w-14 shrink-0 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
                <div className="flex-1 px-3 py-2.5">
                  <div className="text-foreground truncate text-sm font-medium" title={point.name}>
                    {point.name}
                  </div>
                  <div
                    className="text-muted-foreground mt-0.5 truncate text-xs"
                    title={point.distance}
                  >
                    {point.distance}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            {t('tourism.no_nearby_points', 'Chưa có dữ liệu điểm lân cận.')}
          </p>
        )}
      </section>
    </aside>
  );
}
