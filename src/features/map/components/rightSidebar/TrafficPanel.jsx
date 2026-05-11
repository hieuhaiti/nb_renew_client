import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, RefreshCw, Wifi, WifiOff, Construction, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useTrafficStore } from '@/features/map/store/useTrafficStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import { INCIDENT_LEGEND } from '@/features/map/utils/trafficLayerUtils';
import boundaryGeoJSON from '@/data/NB_RG_line.json';

const REFRESH_MS = 5 * 60 * 1000;

const FLOW_LEGEND = [
  { color: '#10b981', vi: 'Thông thoáng', en: 'Free flow' },
  { color: '#eab308', vi: 'Vừa phải', en: 'Moderate' },
  { color: '#f97316', vi: 'Đông đúc', en: 'Heavy' },
  { color: '#ef4444', vi: 'Kẹt xe', en: 'Severe' },
];

export default function TrafficPanel() {
  const { t } = useTranslation();
  const intervalRef = useRef(null);
  const mapRef = useMapStore((state) => state.mapRef);
  const lang = useLanguageStore((s) => s.lang);

  const isTrafficEnabled = useTrafficStore((s) => s.isTrafficEnabled);
  const showFlow = useTrafficStore((s) => s.showFlow);
  const showIncidents = useTrafficStore((s) => s.showIncidents);
  const isLoading = useTrafficStore((s) => s.isLoading);
  const error = useTrafficStore((s) => s.error);
  const incidentGeoJSON = useTrafficStore((s) => s.incidentGeoJSON);
  const setTrafficEnabled = useTrafficStore((s) => s.setTrafficEnabled);
  const setShowFlow = useTrafficStore((s) => s.setShowFlow);
  const setShowIncidents = useTrafficStore((s) => s.setShowIncidents);
  const loadIncidents = useTrafficStore((s) => s.loadIncidents);
  const clearIncidents = useTrafficStore((s) => s.clearIncidents);

  const doLoad = () => {
    const zoom = mapRef?.getZoom() ?? 10;
    loadIncidents(boundaryGeoJSON, zoom);
  };

  useEffect(() => {
    if (!isTrafficEnabled) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      clearIncidents();
      return;
    }
    doLoad();
    intervalRef.current = setInterval(doLoad, REFRESH_MS);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isTrafficEnabled]);

  const stats = useMemo(() => {
    const features = incidentGeoJSON?.features ?? [];
    const total = features.length;
    const accidents = features.filter((f) => Number(f.properties?.iconCategory) === 1).length;
    const jams = features.filter((f) => Number(f.properties?.iconCategory) === 6).length;
    const works = features.filter((f) => Number(f.properties?.iconCategory) === 9).length;

    const delays = features.map((f) => Number(f.properties?.delay ?? 0)).filter((d) => d > 0);
    const avgDelayMin =
      delays.length > 0 ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length / 60) : null;

    return { total, accidents, jams, works, avgDelayMin };
  }, [incidentGeoJSON]);

  const isLive = isTrafficEnabled && !isLoading && !error;

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'mt-0.5 h-2 w-2 shrink-0 rounded-full',
                isLive ? 'animate-pulse bg-emerald-500' : 'bg-muted-foreground/40'
              )}
            />
            <p className="typo-section-title text-foreground">
              {t('mapPage.traffic.title', { defaultValue: 'Giao thông' })}
            </p>
          </div>
          <p className="typo-meta text-muted-foreground ml-4">
            {isTrafficEnabled
              ? isLoading
                ? t('mapPage.traffic.loading', { defaultValue: 'Đang cập nhật...' })
                : error
                  ? t('mapPage.traffic.error', { defaultValue: 'Không thể tải dữ liệu' })
                  : t('mapPage.traffic.subtitle', {
                      defaultValue: 'Flow và sự cố theo thời gian thực',
                    })
              : t('mapPage.traffic.disabled', { defaultValue: 'Đã tắt' })}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isTrafficEnabled}
          onClick={() => setTrafficEnabled(!isTrafficEnabled)}
          className={cn(
            'focus-visible:ring-ring relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            isTrafficEnabled ? 'bg-primary' : 'bg-input'
          )}
        >
          <span
            className={cn(
              'bg-background pointer-events-none inline-block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform duration-200',
              isTrafficEnabled ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>

      {isTrafficEnabled && (
        <>
          {/* Quick stats grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              {
                icon: <AlertTriangle className="h-3 w-3" />,
                value: stats.total,
                label: lang === 'en' ? 'Total' : 'Tổng',
                color: '#f97316',
                bg: '#f9731612',
              },
              {
                icon: <Car className="h-3 w-3" />,
                value: stats.accidents,
                label: lang === 'en' ? 'Accident' : 'Tai nạn',
                color: '#dc2626',
                bg: '#dc262612',
              },
              {
                icon: <Activity className="h-3 w-3" />,
                value: stats.jams,
                label: lang === 'en' ? 'Jam' : 'Ùn tắc',
                color: '#ef4444',
                bg: '#ef444412',
              },
              {
                icon: <Construction className="h-3 w-3" />,
                value: stats.works,
                label: lang === 'en' ? 'Works' : 'Thi công',
                color: '#3b82f6',
                bg: '#3b82f612',
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-0.5 rounded-xl px-1.5 py-2"
                style={{ backgroundColor: s.bg }}
              >
                <span style={{ color: s.color }}>{s.icon}</span>
                <span
                  className="text-sm leading-none font-black tabular-nums"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>
                <span
                  className="text-center text-[9px] leading-none font-medium"
                  style={{ color: s.color, opacity: 0.75 }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Avg delay badge */}
          {stats.avgDelayMin !== null && (
            <div className="bg-muted/50 border-border flex items-center justify-between rounded-xl border px-3 py-2">
              <span className="typo-meta text-muted-foreground">
                {lang === 'en' ? 'Avg. delay' : 'Delay trung bình'}
              </span>
              <span className="typo-meta font-semibold text-orange-500">
                +{stats.avgDelayMin} {lang === 'en' ? 'min' : 'phút'}
              </span>
            </div>
          )}

          {/* Layer toggles */}
          <div className="bg-muted/40 border-border space-y-0.5 rounded-xl border p-2">
            <label className="hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors">
              <Checkbox id="traffic-flow" checked={showFlow} onCheckedChange={setShowFlow} />
              <Activity className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span className="typo-body text-foreground flex-1 font-medium">
                {t('mapPage.traffic.flow', { defaultValue: 'Traffic Flow' })}
              </span>
            </label>
            <label className="hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors">
              <Checkbox
                id="traffic-incidents"
                checked={showIncidents}
                onCheckedChange={setShowIncidents}
              />
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-orange-500" />
              <span className="typo-body text-foreground flex-1 font-medium">
                {t('mapPage.traffic.incidents', { defaultValue: 'Sự cố giao thông' })}
              </span>
            </label>
          </div>

          {/* Status + refresh */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {error ? (
                <>
                  <WifiOff className="text-destructive h-3.5 w-3.5 shrink-0" />
                  <span className="typo-meta text-destructive">
                    {t('mapPage.traffic.error', { defaultValue: 'Không thể tải dữ liệu' })}
                  </span>
                </>
              ) : isLoading ? (
                <span className="typo-meta text-muted-foreground animate-pulse">
                  {t('mapPage.traffic.loading', { defaultValue: 'Đang cập nhật...' })}
                </span>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="typo-meta text-muted-foreground">
                    {t('mapPage.traffic.live', { defaultValue: 'Dữ liệu thời gian thực' })}
                  </span>
                </>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="typo-meta h-7 shrink-0"
              disabled={isLoading}
              onClick={doLoad}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
              {t('mapPage.traffic.refresh', { defaultValue: 'Làm mới' })}
            </Button>
          </div>

          {/* Flow legend */}
          {showFlow && (
            <div className="space-y-1.5">
              <p className="typo-meta text-muted-foreground font-medium">
                {t('mapPage.traffic.flowLegend', { defaultValue: 'Mức độ lưu thông' })}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {FLOW_LEGEND.map((item) => (
                  <div key={item.en} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="typo-meta text-muted-foreground">{item[lang] ?? item.vi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incident legend */}
          {showIncidents && (
            <div className="space-y-1.5">
              <p className="typo-meta text-muted-foreground font-medium">
                {t('mapPage.traffic.incidentLegend', { defaultValue: 'Loại sự cố' })}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {INCIDENT_LEGEND.map((item) => (
                  <div key={item.en} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="typo-meta text-muted-foreground">{item[lang] ?? item.vi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
