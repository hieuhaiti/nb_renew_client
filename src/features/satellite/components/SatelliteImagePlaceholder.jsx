import { useEffect } from 'react';
import { useSatelliteStore } from '../store/useSatelliteStore';
import { SatelliteSingleModePanel } from './SatelliteSingleModePanel';
import { SatelliteLayerManager } from './SatelliteLayerManager';
import { SatelliteStatsPanel } from './SatelliteStatsPanel';

export function SatelliteImagePlaceholder() {
  const setIsCompareMode = useSatelliteStore((s) => s.setIsCompareMode);

  useEffect(() => {
    setIsCompareMode(false);
  }, [setIsCompareMode]);

  return (
    <div className="space-y-2">
      <SatelliteSingleModePanel />
      <SatelliteLayerManager />
      <SatelliteStatsPanel />
    </div>
  );
}

export default SatelliteImagePlaceholder;
