import { Droplets, Thermometer, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoadingInline from '@/components/common/LoadingInline';
import { defaultLatLong } from '@/features/map/constant/mapConstant';
import { useWeatherOverview } from '@/features/weather/hooks/useWeatherOverview';
import {
  formatHumidity,
  formatTemperature,
  formatWindSpeedKph,
  getAqiLevelMeta,
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
  const tempUnit = `${String.fromCharCode(176)}C`;

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
    <section aria-label={t('mapPage.layout.floatWeather')} className={cn('z-30 h-auto', className)}>
      <div
        className={cn(
          'border-border bg-card/95 border shadow-md backdrop-blur-sm',
          compact ? 'rounded-lg' : 'rounded-xl'
        )}
      >
        <div className={cn('min-w-[16.5rem] px-2.5 py-2', compact ? 'text-sm' : 'text-base')}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate">
                <span className="text-foreground text-base font-bold">{cityName}</span>
                <span className="text-muted-foreground ml-1 truncate text-sm">
                  {conditionLabel}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-[var(--weather-temp)]/15 px-2.5 py-1 font-semibold text-[var(--weather-temp)]">
                <Thermometer className="h-3 w-3 shrink-0" />
                <span className="text-xs">{formatTemperature(weather?.main?.temp, tempUnit)}</span>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-[var(--weather-humidity)]/15 px-2.5 py-1 font-semibold text-[var(--weather-humidity)]">
                <Droplets className="h-3 w-3 shrink-0" />
                <span className="text-xs">{formatHumidity(weather?.main?.humidity)}</span>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-[var(--weather-wind)]/15 px-2.5 py-1 font-semibold text-[var(--weather-wind)]">
                <Wind className="h-3 w-3 shrink-0" />
                <span className="text-xs">{formatWindSpeedKph(weather?.wind?.speed)}</span>
              </div>

              <div
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold',
                  aqiMeta.bgClass,
                  aqiMeta.toneClass
                )}
              >
                <img
                  src={aqiMeta.iconSrc}
                  className="h-3 w-3 shrink-0 rounded-full object-cover"
                  alt="AQI"
                />
                <span className="text-xs">{t(aqiMeta.labelKey)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
