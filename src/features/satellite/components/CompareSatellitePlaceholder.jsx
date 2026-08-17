import { useEffect } from 'react';
import { useSatelliteStore } from '../store/useSatelliteStore';
import { SatelliteCompareModePanel } from './SatelliteCompareModePanel';
import { SatelliteLayerManager } from './SatelliteLayerManager';
import { SatelliteStatsPanel } from './SatelliteStatsPanel';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CompareSatellitePlaceholder() {
  const setIsCompareMode = useSatelliteStore((s) => s.setIsCompareMode);

  useEffect(() => {
    setIsCompareMode(true);
  }, [setIsCompareMode]);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        <SatelliteCompareModePanel />
        <SatelliteLayerManager />
        <SatelliteStatsPanel />
      </div>
    </ScrollArea>
  );
}

export default CompareSatellitePlaceholder;
