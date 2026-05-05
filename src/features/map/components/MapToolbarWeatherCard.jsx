import { AlertTriangle, Droplets, Thermometer, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { defaultLatLong } from '@/features/map/constant/mapConstant';
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
 * MapToolbarWeatherCard — compact weather panel embedded in map toolbar.
 */
export default function MapToolbarWeatherCard({ className, compact = false }) {
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
  const alert = data?.alert;
  const alertSeverityMeta = getAlertSeverityMeta(alert?.severity);
  const weatherIconMeta = getWeatherIconMeta({
    conditionId: weather?.weather?.[0]?.id,
    iconCode: weather?.weather?.[0]?.icon,
  });
  const WeatherIcon = weatherIconMeta.icon;

  const cityName = weather?.name || t('mapPage.layout.weatherUnknownLocation');
  const conditionLabel = weather?.weather?.[0]?.description || t('mapPage.layout.weatherUnknown');

  const compactContent = (() => {
    if (!isConfigured) {
      return (
        <p className="text-muted-foreground truncate text-xs font-normal">
          {t('mapPage.layout.weatherNotConfigured')}
        </p>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      );
    }

    if (isError || !weather) {
      return (
        <p className="text-destructive truncate text-xs font-normal">
          {t('mapPage.layout.weatherUnavailable')}
        </p>
      );
    }

    return (
      <div className="space-y-2 text-xs">
        <div className="flex flex-nowrap items-center gap-2 overflow-hidden">
          <div className="flex shrink-0 items-center gap-1.5">
            <WeatherIcon className={cn('h-4.5 w-4.5 shrink-0', weatherIconMeta.toneClass)} />
            <p className="truncate font-semibold">{cityName}</p>
          </div>

          <p className="text-muted-foreground min-w-0 flex-1 truncate capitalize">
            {conditionLabel}
          </p>
        </div>

        <div className="flex flex-nowrap gap-2 overflow-hidden">
          <div className="bg-muted/40 flex min-w-0 flex-1 items-center gap-1 rounded-md px-2 py-1">
            <Thermometer className="text-warning h-3.5 w-3.5 shrink-0" />
            <span className="text-warning truncate font-semibold">
              {formatTemperature(weather?.main?.temp)}
            </span>
          </div>

          <div className="bg-muted/40 flex min-w-0 flex-1 items-center gap-1 rounded-md px-2 py-1">
            <Droplets className="text-primary h-3.5 w-3.5 shrink-0" />
            <span className="text-primary truncate font-semibold">
              {formatHumidity(weather?.main?.humidity)}
            </span>
          </div>

          <div className="bg-muted/40 flex min-w-0 flex-1 items-center gap-1 rounded-md px-2 py-1">
            <Wind className="text-secondary h-3.5 w-3.5 shrink-0" />
            <span className="text-secondary truncate font-semibold">
              {formatWindSpeedKph(weather?.wind?.speed)}
            </span>
          </div>

          <div
            className={cn(
              'flex min-w-0 flex-1 items-center gap-1 rounded-md px-2 py-1',
              aqiMeta.bgClass
            )}
          >
            <img
              src={aqiMeta.iconSrc}
              alt={t(aqiMeta.labelKey)}
              className="h-3.5 w-3.5 shrink-0 object-contain"
            />
            <span className={cn('truncate font-semibold', aqiMeta.toneClass)}>
              {aqiValue ?? '--'} · {t(aqiMeta.labelKey)}
            </span>
          </div>
        </div>

        {alert ? (
          <Badge
            variant="outline"
            className={cn(
              'max-w-full truncate border-transparent text-xs',
              getAlertToneClass(alert.severity),
              alertSeverityMeta.bg
            )}
            title={t(alert.labelKey)}
          >
            {t(alert.labelKey)}
          </Badge>
        ) : null}
      </div>
    );
  })();

  const fullContent = (() => {
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
            <p className="truncate text-base font-bold">{cityName}</p>

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

        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-4">
          <div className="bg-muted/40 rounded-md px-2 py-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-1">
                  <Thermometer className="text-warning h-4.5 w-4.5" />
                  <p className="text-warning mt-1 truncate font-bold">
                    {formatTemperature(weather?.main?.temp)}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="z-80">
                <span>{t('mapPage.layout.weatherTemperature')}</span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="bg-muted/40 rounded-md px-2 py-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-1">
                  <Droplets className="text-primary h-4.5 w-4.5" />
                  <p className="text-primary mt-1 truncate font-bold">
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
                  <Wind className="text-secondary h-4.5 w-4.5" />
                  <p className="text-secondary mt-1 truncate font-bold">
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
                  <p className={cn('mt-1 truncate font-bold', aqiMeta.toneClass)}>
                    {aqiValue ?? '--'} · {t(aqiMeta.labelKey)}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="z-80">
                <span>{t('mapPage.layout.weatherAqi')}</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {alert && (
          <div className="bg-muted/40 rounded-md px-2 py-1.5 text-xs">
            <div className="mb-1 flex items-center gap-1 font-normal">
              <AlertTriangle className={cn('h-4.5 w-4.5', alertSeverityMeta.color)} />
              <span>{t('mapPage.layout.weatherAlert')}</span>
            </div>

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
          </div>
        )}
      </div>
    );
  })();

  const content = compact ? compactContent : fullContent;

  return (
    <section aria-label={t('mapPage.layout.floatWeather')} className={cn('h-auto', className)}>
      <Card
        className={cn(
          'bg-popover/95 border-border shadow-md backdrop-blur',
          compact ? 'gap-0 py-2' : 'gap-2 py-3'
        )}
      >
        {compact ? null : (
          <CardHeader className="px-3 pb-0">
            <CardTitle className="truncate text-sm font-bold">
              {t('mapPage.layout.floatWeather')}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={cn(compact ? 'px-3 py-0' : 'px-3 pt-0')}>{content}</CardContent>
      </Card>
    </section>
  );
}
