import React, { useMemo } from 'react';
import {
  Map,
  Phone,
  RectangleGoggles,
  CalendarPlus,
  MapPin,
  Wind,
  Droplets,
  Leaf,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { useGetNearbyPoints } from '@/services/api/tourism-points/tourismPointsApi';
import { useGetAframeScenes } from '@/services/api/vr360/aframeSceneService';
import { useWeatherOverview } from '@/features/weather/hooks/useWeatherOverview';
import { Button } from '@/components/ui/button';
import {
  formatHumidity,
  formatTemperature,
  formatWindSpeedKph,
} from '@/features/weather/helpers/weatherLevelHelpers';

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
  onOpenMap,
  onContact,
  lat,
  lng,
  lang = 'vi',
  radiusKm = 8,
  currentPointId,
  currentVisitorCount,
  capacityPct,
  maxCapacity,
  t,
}) {
  const normalizedLat = useMemo(() => toNumberOrNull(lat), [lat]);
  const normalizedLng = useMemo(() => toNumberOrNull(lng), [lng]);
  const navigate = useNavigate();

  const pointCoords = useMemo(() => {
    if (!Number.isFinite(normalizedLat) || !Number.isFinite(normalizedLng)) return null;
    return [normalizedLng, normalizedLat];
  }, [normalizedLat, normalizedLng]);

  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    isConfigured: isWeatherConfigured,
  } = useWeatherOverview({
    lat: normalizedLat,
    lng: normalizedLng,
    lang,
  });

  const weather = weatherData?.weather;
  const weatherLabel = weather?.weather?.[0]?.description;
  const weatherTitle = weatherLabel || t('tourism.weather', 'Thoi tiet');

  const weatherTempDisplay = useMemo(() => {
    if (!isWeatherConfigured && !weather) return '-';
    if (isWeatherLoading && !weather) return '...';
    if (!weather) return '-';
    return formatTemperature(weather?.main?.temp, `${String.fromCharCode(176)}C`);
  }, [isWeatherConfigured, isWeatherLoading, weather]);

  const weatherWindDisplay = useMemo(() => {
    if (isWeatherLoading && !weather) return '...';
    if (!weather) return '-';
    return formatWindSpeedKph(weather?.wind?.speed);
  }, [isWeatherLoading, weather]);

  const weatherHumidityDisplay = useMemo(() => {
    if (isWeatherLoading && !weather) return '...';
    if (!weather) return '-';
    return formatHumidity(weather?.main?.humidity);
  }, [isWeatherLoading, weather]);

  const weatherRainDisplay = useMemo(() => {
    if (isWeatherLoading && !weather) return '...';
    if (!weather) return '-';

    const rain1h = Number(weather?.rain?.['1h']);
    if (Number.isFinite(rain1h)) return `${rain1h} mm/h`;

    const rain3h = Number(weather?.rain?.['3h']);
    if (Number.isFinite(rain3h)) return `${rain3h} mm/3h`;

    return '-';
  }, [isWeatherLoading, weather]);

  const capacityNumber = capacityPct != null ? Math.round(Number(capacityPct)) : null;
  const capacityDisplay = capacityNumber != null ? `${capacityNumber}%` : '-';

  const visitorDisplay =
    currentVisitorCount != null && Number.isFinite(Number(currentVisitorCount))
      ? Number(currentVisitorCount).toLocaleString('vi')
      : '-';

  const maxCapacityDisplay =
    maxCapacity != null && Number.isFinite(Number(maxCapacity))
      ? Number(maxCapacity).toLocaleString('vi')
      : '-';

  const hasMaxCapacity = maxCapacity != null && Number.isFinite(Number(maxCapacity));
  const hasVisitorCount =
    currentVisitorCount != null && Number.isFinite(Number(currentVisitorCount));

  const { data: scenesData } = useGetAframeScenes({ spotId: currentPointId });
  const hasVrTour = useMemo(() => {
    const d = scenesData?.data ?? scenesData;
    const scenes = Array.isArray(d) ? d : d?.scenes || d?.items || [];
    return scenes.length > 0;
  }, [scenesData]);

  const { data: nearbyResp } = useGetNearbyPoints({
    lat: normalizedLat,
    lng: normalizedLng,
    radius_km: radiusKm,
    limit: 5,
  });

  const resolvedNearbyPoints = useMemo(() => {
    const apiSource = getNearbySource(nearbyResp);
    const source = apiSource.length > 0 ? apiSource : [];

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
          distanceLabel =
            distanceMeters >= 1000
              ? `${(distanceMeters / 1000).toFixed(1)} km`
              : `${Math.round(distanceMeters)} m`;
        }

        return {
          id: item?.id || `nearby-${index}`,
          name:
            item?.name_vi ||
            item?.name_en ||
            item?.name ||
            t('tourism.nearby_point_name', `Point ${index + 1}`),
          distance: distanceLabel || t('tourism.nearby_distance_unknown', 'Chua ro'),
          image:
            item?.primary_image ||
            item?.cover_image_url ||
            item?.main_image_url ||
            item?.image ||
            '',
          slug: item?.slug || null,
          category: item?.category_name || '',
        };
      });
  }, [nearbyResp, currentPointId, t]);

  return (
    <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
      <div
        className="rounded-[24px] p-5 text-white"
        style={{ background: 'linear-gradient(135deg,#1cb6d8,#0fb49f)' }}
      >
        <h3 className="mb-2 text-[22px] font-bold">{t('tourism.cta_title', 'Kham pha ngay')}</h3>
        <p className="mb-4 text-sm leading-[1.65] text-[#eafffb]">
          {t('tourism.cta_desc', 'Mo chi duong, xem anh 360.')}
        </p>
        <div className="flex flex-col gap-3">
          <CtaBtn
            onClick={() => onOpenMap?.(pointCoords)}
            icon={<Map className="h-4 w-4" />}
            label={t('tourism.view_on_map', 'Chi duong')}
          />
          {hasVrTour && (
            <CtaBtn
              onClick={() => navigate('/vr360', { state: { spotId: currentPointId } })}
              icon={<RectangleGoggles className="h-4 w-4" />}
              label={t('tourism.vr_tour', 'VR 360')}
            />
          )}
          <CtaBtn
            onClick={onContact}
            icon={<Phone className="h-4 w-4" />}
            label={t('tourism.contact', 'Lien he')}
            dark
          />
        </div>
      </div>

      <div className="rounded-[24px] border-border bg-card px-5 py-5 shadow-(--ambient-shadow)">
        <h3 className="mb-3 flex items-center gap-2.5 text-[18px] font-bold text-foreground">
          <Leaf className="h-5 w-5 text-secondary" />
          {t('tourism.conditions', 'Thời tiết & tải khách')}
        </h3>
        <div className="mb-2 text-xs font-semibold text-muted-foreground">{weatherTitle}</div>
        <div className="grid grid-cols-2 gap-2.5">
          <WeatherBox value={weatherTempDisplay} label={t('tourism.weather', 'Thời tiết')} />
          <WeatherBox value={capacityDisplay} label={t('tourism.current_capacity', 'Tải khách')} />
        </div>
        <div className="mt-3 space-y-2">
          <QuickRow
            icon={<Wind className="h-3.5 w-3.5 text-secondary" />}
            label={t('tourism.wind', 'Gió')}
            value={weatherWindDisplay}
          />
          <QuickRow
            icon={<Droplets className="h-3.5 w-3.5 text-secondary" />}
            label={t('tourism.humidity', 'Độ ẩm')}
            value={weatherHumidityDisplay}
          />
          <QuickRow
            icon={<Droplets className="h-3.5 w-3.5 text-secondary" />}
            label={t('tourism.rain', 'Mưa')}
            value={weatherRainDisplay}
          />
          {hasVisitorCount && (
            <QuickRow
              icon={<Leaf className="h-3.5 w-3.5 text-secondary" />}
              label={t('tourism.current_visitors', 'Khách hiện tại')}
              value={visitorDisplay}
            />
          )}
          {hasMaxCapacity && (
            <QuickRow
              icon={<Leaf className="h-3.5 w-3.5 text-secondary" />}
              label={t('tourism.max_capacity', 'Sức chứa')}
              value={maxCapacityDisplay}
            />
          )}
        </div>
      </div>

      {resolvedNearbyPoints.length > 0 && (
        <div className="rounded-[24px] border-border bg-card px-5 py-5 shadow-(--ambient-shadow)">
          <h3 className="mb-3 flex items-center gap-2.5 text-[18px] font-bold text-foreground">
            <MapPin className="h-5 w-5 text-secondary" />
            {t('tourism.nearby_points', 'Diem gan do')}
          </h3>
          <div className="space-y-3">
            {resolvedNearbyPoints.map((point) => (
              <article
                key={point.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/tourism-point/point/${point.slug || point.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/tourism-point/point/${point.slug || point.id}`);
                  }
                }}
                className="grid cursor-pointer items-center gap-2.5 rounded-[14px] transition-colors hover:bg-muted"
                style={{ gridTemplateColumns: '72px 1fr' }}
              >
                <img
                  src={withBaseUrl(point.image)}
                  alt={point.name}
                  className="h-[58px] w-[72px] rounded-[14px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
                <div className="min-w-0 py-1">
                  <b className="block truncate text-[13px] text-foreground" title={point.name}>
                    {point.name}
                  </b>
                  <span className="text-[12px] font-bold text-muted-foreground">
                    {point.distance}
                    {point.category ? ` · ${point.category}` : ''}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

function CtaBtn({ onClick, icon, label, dark = false }) {
  return (
    <Button variant="ghost"
      onClick={onClick}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-[15px] px-3 text-[13px] font-bold transition-opacity hover:opacity-90 ${
        dark ? 'bg-foreground text-background' : 'bg-card text-secondary'
      }`}
    >
      {icon}
      {label}
    </Button>
  );
}

function WeatherBox({ value, label }) {
  return (
    <div className="rounded-[16px] border border-tertiary/30 bg-tertiary-soft p-[13px] text-center">
      <b className="block text-[20px] font-bold text-tertiary-soft-foreground">{value}</b>
      <span className="text-[12px] font-bold text-tertiary-soft-foreground/80">{label}</span>
    </div>
  );
}

function QuickRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[15px] border-border bg-muted px-3 py-3 text-[13px] font-extrabold text-muted-foreground">
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <b>{value}</b>
    </div>
  );
}


