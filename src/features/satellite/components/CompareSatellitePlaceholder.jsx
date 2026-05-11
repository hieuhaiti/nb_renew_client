import { useEffect } from 'react';
import { useSatelliteStore } from '../store/useSatelliteStore';
import { SatelliteCompareModePanel } from './SatelliteCompareModePanel';
import { SatelliteLayerManager } from './SatelliteLayerManager';
import { SatelliteStatsPanel } from './SatelliteStatsPanel';

export function CompareSatellitePlaceholder() {
  const setIsCompareMode = useSatelliteStore((s) => s.setIsCompareMode);

  useEffect(() => {
    setIsCompareMode(true);
  }, [setIsCompareMode]);

  return (
    <div className="space-y-2">
      <SatelliteCompareModePanel />
      <SatelliteLayerManager />
      <SatelliteStatsPanel />
    </div>
  );
}

export default CompareSatellitePlaceholder;
