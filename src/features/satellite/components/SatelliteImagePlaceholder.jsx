import { useEffect } from 'react';
import { useSatelliteStore } from '../store/useSatelliteStore';
import { SatelliteSingleModePanel } from './SatelliteSingleModePanel';
import { SatelliteLayerManager } from './SatelliteLayerManager';
import { SatelliteStatsPanel } from './SatelliteStatsPanel';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SatelliteImagePlaceholder() {
  const setIsCompareMode = useSatelliteStore((s) => s.setIsCompareMode);

  useEffect(() => {
    setIsCompareMode(false);
  }, [setIsCompareMode]);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        <SatelliteSingleModePanel />
        <SatelliteLayerManager />
        <SatelliteStatsPanel />
      </div>
    </ScrollArea>
  );
}

export default SatelliteImagePlaceholder;
