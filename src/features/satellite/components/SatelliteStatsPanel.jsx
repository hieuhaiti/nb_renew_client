import { BarChart2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fmtKm2 } from '../utils/satelliteUtils';
import { LAYER_CONFIG } from '../constants/satelliteConstants';
import { useSatelliteStore } from '../store/useSatelliteStore';

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="typo-meta text-muted-foreground truncate">{label}</span>
      <span className="typo-meta text-foreground shrink-0 font-medium">{value}</span>
    </div>
  );
}

export function SatelliteStatsPanel() {
  const { t } = useTranslation();
  const satelliteLayers = useSatelliteStore((s) => s.satelliteLayers);

  const layersWithStats = satelliteLayers.filter((l) => l.areaStats?.classes?.length);
  if (layersWithStats.length === 0) return null;

  return (
    <div className="bg-card border-border border-t">
      <div className="flex items-center gap-2 px-3 py-2">
        <BarChart2 size={14} className="text-primary" />
        <span className="typo-body text-foreground font-semibold">
          {t('satellite.stats.title')}
        </span>
      </div>
      <div className="space-y-4 px-3 pb-3">
        {layersWithStats.map((layer) => {
          const cfg = LAYER_CONFIG[layer.layerType];
          const stats = layer.areaStats;
          return (
            <div key={layer.id} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${cfg?.color || 'bg-muted-foreground'}`}
                />
                <span className="typo-meta text-foreground/80 font-semibold">
                  {cfg ? t(cfg.labelKey) : layer.layerType}
                </span>
              </div>
              <div className="space-y-1 pl-3">
                {stats.totalAreaKm2 != null && (
                  <StatRow
                    label={t('satellite.stats.total_area')}
                    value={fmtKm2(stats.totalAreaKm2)}
                  />
                )}
                {stats.classes?.map((cls, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-sm border border-white/10"
                      style={{ backgroundColor: cls.color }}
                    />
                    <span className="typo-meta text-foreground/70 flex-1 truncate">
                      {cls.labelKey ? t(cls.labelKey) : cls.label}
                    </span>
                    <span className="typo-meta text-foreground/60 shrink-0">
                      {fmtKm2(cls.areaKm2)}
                    </span>
                    {cls.pct != null && (
                      <span className="typo-meta text-muted-foreground/60 shrink-0">
                        {cls.pct}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SatelliteStatsPanel;
