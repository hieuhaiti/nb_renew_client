import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, BellRing, CloudOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeatherOverview } from '@/features/weather/hooks/useWeatherOverview';
import { getAlertSeverityMeta } from '@/features/weather/helpers/weatherLevelHelpers';
import { defaultLatLong } from '@/features/map/constant/mapConstant';

export default function WeatherAlertBell() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { data, isLoading, isError } = useWeatherOverview({
    lat: defaultLatLong.lat,
    lng: defaultLatLong.lng,
    lang: i18n.language,
  });

  const alert = data?.alert ?? null;
  const severityMeta = alert ? getAlertSeverityMeta(alert.severity) : null;

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const dotColor =
    alert?.severity === 'high'
      ? 'bg-destructive'
      : alert?.severity === 'medium'
        ? 'bg-warning'
        : 'bg-primary';

  return (
    <div ref={wrapperRef} className="relative" data-header-interactive>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t('mapPage.layout.weatherAlert')}
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        {alert ? (
          <BellRing
            size={18}
            className={`${severityMeta?.color ?? 'text-foreground'} animate-[ring_1.2s_ease-in-out_2]`}
          />
        ) : (
          <Bell size={18} className="text-foreground" />
        )}

        {/* Badge dot */}
        {alert && (
          <span
            className={`absolute top-1 right-1 h-2 w-2 rounded-full ${dotColor} ring-background ring-2`}
          />
        )}
      </Button>

      {/* Popover */}
      {open && (
        <div className="bg-popover border-border absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border shadow-xl">
          <div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
            <Bell size={14} className="text-muted-foreground shrink-0" />
            <span className="text-foreground text-sm font-semibold">
              {t('mapPage.layout.weatherAlert')}
            </span>
          </div>

          <div className="px-4 py-3">
            {isLoading && (
              <p className="text-muted-foreground text-sm">{t('common.loading') || 'Đang tải…'}</p>
            )}

            {isError && !isLoading && (
              <div className="flex items-center gap-2">
                <CloudOff size={15} className="text-muted-foreground shrink-0" />
                <p className="text-muted-foreground text-sm">
                  {t('mapPage.layout.weatherUnavailable')}
                </p>
              </div>
            )}

            {!isLoading && !isError && alert && (
              <div
                className={`flex items-start gap-2 rounded-lg px-3 py-2.5 ${severityMeta?.bg ?? 'bg-muted/40'}`}
              >
                {severityMeta?.icon && (
                  <severityMeta.icon
                    size={15}
                    className={`${severityMeta.color} mt-0.5 shrink-0`}
                  />
                )}
                <p className={`text-sm font-medium ${severityMeta?.color ?? ''}`}>
                  {t(alert.labelKey)}
                </p>
              </div>
            )}

            {!isLoading && !isError && !alert && (
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-secondary shrink-0" />
                <p className="text-secondary text-sm font-medium">
                  {t('mapPage.layout.weatherNoAlert')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
