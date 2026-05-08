import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
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

  const incidentCount = incidentGeoJSON?.features?.length ?? 0;

  return (
    <div className="space-y-3">
      {/* Master toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="typo-section-title text-foreground">
            {t('mapPage.traffic.title', { defaultValue: 'Giao thông' })}
          </p>
          <p className="typo-meta text-muted-foreground">
            {t('mapPage.traffic.subtitle', { defaultValue: 'Flow và sự cố theo thời gian thực' })}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isTrafficEnabled}
          onClick={() => setTrafficEnabled(!isTrafficEnabled)}
          className={cn(
            'focus-visible:ring-ring relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
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
          {/* Layer checkboxes */}
          <div className="bg-muted/40 border-border space-y-1 rounded-xl border p-3">
            <label className="hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 transition-colors">
              <Checkbox id="traffic-flow" checked={showFlow} onCheckedChange={setShowFlow} />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Activity className="h-4 w-4 shrink-0 text-emerald-500" />
                <span className="typo-body text-foreground font-medium">
                  {t('mapPage.traffic.flow', { defaultValue: 'Traffic Flow' })}
                </span>
              </div>
            </label>

            <div className="border-border border-t" />

            <label className="hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 transition-colors">
              <Checkbox
                id="traffic-incidents"
                checked={showIncidents}
                onCheckedChange={setShowIncidents}
              />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500" />
                <span className="typo-body text-foreground font-medium">
                  {t('mapPage.traffic.incidents', { defaultValue: 'Sự cố giao thông' })}
                </span>
                {incidentCount > 0 && (
                  <span className="typo-badge ml-auto rounded-full bg-orange-500/15 px-1.5 py-0.5 text-orange-600 tabular-nums">
                    {incidentCount}
                  </span>
                )}
              </div>
            </label>
          </div>

          {/* Status bar */}
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
                <span className="typo-meta text-muted-foreground">
                  {t('mapPage.traffic.loading', { defaultValue: 'Đang cập nhật...' })}
                </span>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="typo-meta text-muted-foreground">
                    {t('mapPage.traffic.incidentCount', {
                      defaultValue: '{{count}} sự cố',
                      count: incidentCount,
                    })}
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
                      className="inline-block h-2.5 w-5 shrink-0 rounded-full"
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
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
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
