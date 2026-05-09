import { Droplets, MapPin, Thermometer, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoadingInline from '@/components/common/LoadingInline';
import { defaultLatLong } from '@/features/map/constant/mapConstant';
import { useWeatherOverview } from '@/features/weather/hooks/useWeatherOverview';
import {
  formatHumidity,
  formatTemperature,
  formatWindSpeedKph,
  getAqiLevelMeta,
  getWeatherIconMeta,
} from '@/features/weather/helpers/weatherLevelHelpers';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/stores/useLanguageStore';

/**
 * MapWeatherCard — compact weather panel on top-right of map.
 */
export default function MapWeatherCard({ className, compact = false }) {
  const { t } = useTranslation();
  const lang = useLanguageStore((state) => state.lang);

  const { data, isLoading, isError, isConfigured } = useWeatherOverview({
    lat: defaultLatLong.lat,
    lng: defaultLatLong.lng,
    lang,
  });

  const weather = data?.weather;
  const aqiValue = data?.aqiValue;
  const aqiMeta = getAqiLevelMeta(aqiValue);
  const weatherIconMeta = getWeatherIconMeta({
    conditionId: weather?.weather?.[0]?.id,
    iconCode: weather?.weather?.[0]?.icon,
  });
  const WeatherIcon = weatherIconMeta.icon;

  const cityName = weather?.name || t('mapPage.layout.weatherUnknownLocation');
  const conditionLabel = weather?.weather?.[0]?.description || t('mapPage.layout.weatherUnknown');

  if (!isConfigured) return null;

  if (isLoading) {
    return (
      <section aria-label={t('mapPage.layout.floatWeather')} className={cn('h-auto', className)}>
        <div className="border-border bg-card/90 rounded-lg border px-3 py-2 shadow-md backdrop-blur-sm">
          <LoadingInline color="muted-foreground" />
        </div>
      </section>
    );
  }

  if (isError || !weather) return null;

  return (
    <section aria-label={t('mapPage.layout.floatWeather')} className={cn('h-auto', className)}>
      <div
        className={cn(
          'border-border bg-card/90 border shadow-md backdrop-blur-sm',
          compact ? 'rounded-lg' : 'rounded-xl'
        )}
      >
        <div className={cn('min-w-[11.25rem] px-3 py-2', compact ? 'text-xs' : 'text-sm')}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="text-primary h-3.5 w-3.5 shrink-0" />
              <span className="text-foreground truncate font-medium">{cityName}</span>
            </div>

            <div className="flex items-center gap-2">
              <img
                src={aqiMeta.iconSrc}
                className="h-3.5 w-3.5 shrink-0 rounded-full object-cover"
                alt="AQI"
              />
              <span className={cn('truncate font-medium', aqiMeta.toneClass)}>
                AQI: {t(aqiMeta.labelKey)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <WeatherIcon className={cn('h-3.5 w-3.5 shrink-0', weatherIconMeta.toneClass)} />
              <span className="text-foreground truncate capitalize">{conditionLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <Thermometer className="h-3.5 w-3.5 shrink-0 text-[var(--weather-temp)]" />
              <span className="text-foreground truncate">
                {formatTemperature(weather?.main?.temp)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="h-3.5 w-3.5 shrink-0 text-[var(--weather-humidity)]" />
              <span className="text-foreground truncate">
                {formatHumidity(weather?.main?.humidity)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="h-3.5 w-3.5 shrink-0 text-[var(--weather-wind)]" />
              <span className="text-foreground truncate">
                {formatWindSpeedKph(weather?.wind?.speed)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
