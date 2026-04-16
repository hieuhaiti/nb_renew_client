import { AlertTriangle, Droplets, Thermometer, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MAP_PAGE_DEFAULT_COORDINATES } from '@/features/map/constant';
import { useWeatherOverview } from '@/features/weather/hooks/useWeatherOverview';
import {
  formatHumidity,
  formatTemperature,
  formatWindSpeedKph,
  getAlertSeverityMeta,
  getAlertToneClass,
  getAqiLevelMeta,
  getWeatherIconMeta,
} from '@/features/weather/helpers/weatherLevelHelpers';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/stores/useLanguageStore';

/**
 * MapFloatingWeatherCard — compact weather panel shown above floating map tools.
 */
export default function MapFloatingWeatherCard({ className }) {
  const { t } = useTranslation();
  const lang = useLanguageStore((state) => state.lang);

  const { data, isLoading, isError, isConfigured } = useWeatherOverview({
    lat: MAP_PAGE_DEFAULT_COORDINATES.lat,
    lng: MAP_PAGE_DEFAULT_COORDINATES.lng,
    lang,
  });

  const weather = data?.weather;
  const aqiValue = data?.aqiValue;
  const aqiMeta = getAqiLevelMeta(aqiValue);
  const alert = data?.alert;
  const alertSeverityMeta = getAlertSeverityMeta(alert?.severity);
  const weatherIconMeta = getWeatherIconMeta({
    conditionId: weather?.weather?.[0]?.id,
    iconCode: weather?.weather?.[0]?.icon,
  });
  const WeatherIcon = weatherIconMeta.icon;

  const cityName = weather?.name || t('mapPage.layout.weatherUnknownLocation');
  const conditionLabel = weather?.weather?.[0]?.description || t('mapPage.layout.weatherUnknown');

  const content = (() => {
    if (!isConfigured) {
      return (
        <p className="text-muted-foreground line-clamp-3 text-xs font-normal">
          {t('mapPage.layout.weatherNotConfigured')}
        </p>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-7 w-full" />
        </div>
      );
    }

    if (isError || !weather) {
      return (
        <p className="text-destructive line-clamp-3 text-xs font-normal">
          {t('mapPage.layout.weatherUnavailable')}
        </p>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <WeatherIcon className={cn('h-5 w-5 shrink-0', weatherIconMeta.toneClass)} />
          <div className="min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="truncate text-base font-bold">{cityName}</p>
              </TooltipTrigger>
              <TooltipContent className="z-80">{cityName}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-muted-foreground truncate text-xs font-normal capitalize">
                  {conditionLabel}
                </p>
              </TooltipTrigger>
              <TooltipContent className="z-80">{conditionLabel}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          <div className="bg-muted/40 rounded-md px-2 py-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-1">
                  <Thermometer className="h-4.5 w-4.5 text-orange-500" />
                  <p className="mt-1 truncate font-bold text-orange-600">
                    {formatTemperature(weather?.main?.feels_like)}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="z-80">
                <span>{t('mapPage.layout.weatherFeelsLike')}</span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="bg-muted/40 rounded-md px-2 py-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-1">
                  <Droplets className="h-4.5 w-4.5 text-blue-500" />
                  <p className="mt-1 truncate font-bold text-blue-600">
                    {formatHumidity(weather?.main?.humidity)}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="z-80">
                <span>{t('mapPage.layout.weatherHumidity')}</span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="bg-muted/40 rounded-md px-2 py-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-1">
                  <Wind className="h-4.5 w-4.5 text-cyan-500" />
                  <p className="mt-1 truncate font-bold text-cyan-600">
                    {formatWindSpeedKph(weather?.wind?.speed)}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="z-80">
                <span>{t('mapPage.layout.weatherWind')}</span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className={cn('rounded-md px-2 py-1.5', aqiMeta.bgClass)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-1">
                  <img
                    src={aqiMeta.iconSrc}
                    alt={t(aqiMeta.labelKey)}
                    className="h-4.5 w-4.5 shrink-0 object-contain"
                  />
                  <p className="mt-1 truncate font-bold">{t(aqiMeta.labelKey)}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="z-80">
                <span>{t('mapPage.layout.weatherAqi')}</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="bg-muted/40 rounded-md px-2 py-1.5 text-xs">
          <div className="mb-1 flex items-center gap-1 font-normal">
            <AlertTriangle className="h-4.5 w-4.5" />
            <span>{t('mapPage.layout.weatherAlert')}</span>
          </div>

          {alert ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={cn(
                    'max-w-full truncate border-transparent',
                    getAlertToneClass(alert.severity),
                    alertSeverityMeta.bg
                  )}
                >
                  {t(alert.labelKey)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="z-80">{t(alert.labelKey)}</TooltipContent>
            </Tooltip>
          ) : (
            <Badge variant="outline" className="text-primary max-w-full truncate">
              {t('mapPage.layout.weatherNoAlert')}
            </Badge>
          )}
        </div>
      </div>
    );
  })();

  return (
    <section aria-label={t('mapPage.layout.floatWeather')} className={cn('h-auto', className)}>
      <Card className="bg-popover/95 border-border gap-2 py-3 shadow-xl backdrop-blur">
        <CardHeader className="px-3 pb-0">
          <CardTitle className="truncate text-sm font-bold">
            {t('mapPage.layout.floatWeather')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-0">{content}</CardContent>
      </Card>
    </section>
  );
}
