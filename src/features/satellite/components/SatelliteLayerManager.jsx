import { useState } from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSatelliteStore } from '../store/useSatelliteStore';
import { LAYER_CONFIG } from '../constants/satelliteConstants';
import { SatelliteLayerControl } from './SatelliteLayerControl';
import { Button } from '@/components/ui/button';

export function SatelliteLayerManager() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const [layerOpacity, setLayerOpacity] = useState({});
  const [layerVisibility, setLayerVisibility] = useState({});
  const satelliteLayers = useSatelliteStore((s) => s.satelliteLayers);
  const updateLayerOpacity = useSatelliteStore((s) => s.updateLayerOpacity);
  const updateLayerVisibility = useSatelliteStore((s) => s.updateLayerVisibility);

  if (!satelliteLayers || satelliteLayers.length === 0) return null;

  return (
    <div className="bg-card overflow-hidden">
      <Button variant="ghost"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-primary" />
          <span className="typo-body font-semibold text-foreground">
            {t('satellite.map.layer_manager')}
          </span>
          <span className="typo-badge bg-accent/20 text-accent px-2 py-0.5 rounded-full">
            {satelliteLayers.length}
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-foreground/60" />
        ) : (
          <ChevronDown size={16} className="text-foreground/60" />
        )}
      </Button>

      {open && (
        <div className="border-t border-border px-3 py-3 space-y-2 max-h-80 overflow-y-auto">
          {satelliteLayers.map((layer, idx) => (
            <SatelliteLayerControl
              key={layer.id}
              layer={layer}
              index={idx}
              config={LAYER_CONFIG[layer.layerType]}
              opacity={layerOpacity[layer.id] ?? layer.layerOpacity ?? 1}
              onOpacityChange={(newOpacity) => {
                setLayerOpacity((prev) => ({ ...prev, [layer.id]: newOpacity }));
                updateLayerOpacity(layer.id, newOpacity);
              }}
              visible={layerVisibility[layer.id] ?? layer.visible ?? true}
              onVisibilityChange={(vis) => {
                setLayerVisibility((prev) => ({ ...prev, [layer.id]: vis }));
                updateLayerVisibility(layer.id, vis);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SatelliteLayerManager;


