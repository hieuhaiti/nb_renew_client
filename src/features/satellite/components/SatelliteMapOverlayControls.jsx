import { useEffect, useRef } from 'react';
import { useSatelliteStore } from '../store/useSatelliteStore';
import { useMapStore } from '@/features/map/store/useMapStore';
import {
  addSatelliteLayerToMap,
  removeSatelliteLayerFromMap,
  updateSatelliteLayerOpacity,
  toggleSatelliteLayerVisibility,
} from '../utils/satelliteMapLayer.util';

/**
 * Headless component — syncs satellite store layers to the Mapbox map.
 * Renders nothing; must be mounted inside the map scope.
 */
export function SatelliteMapOverlayControls() {
  const satelliteLayers = useSatelliteStore((s) => s.satelliteLayers);
  const isCompareMode = useSatelliteStore((s) => s.isCompareMode);
  const mapRefObj = useMapStore((s) => s.mapRefObj);

  const prevLayerIds = useRef(new Set());

  useEffect(() => {
    if (!mapRefObj?.current) return;

    const currentIds = new Set(satelliteLayers.map((l) => l.id));
    const mapRef = mapRefObj.current;

    // Remove layers no longer in store
    for (const id of prevLayerIds.current) {
      if (!currentIds.has(id)) {
        const targetMap = id.includes('right') ? mapRef.split : mapRef.single;
        if (targetMap) {
          try {
            const sourceId = `satellite-src-${id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
            removeSatelliteLayerFromMap(targetMap, id, sourceId);
          } catch {
            // ignore
          }
        }
      }
    }

    // Add or update layers
    satelliteLayers.forEach((layer) => {
      if (!layer.layerData?.tileUrl) return;

      const targetMap =
        isCompareMode && layer.splitSide === 'right' ? mapRef.split : mapRef.single;
      if (!targetMap) return;

      try {
        if (!targetMap.getLayer(layer.id)) {
          addSatelliteLayerToMap(
            targetMap,
            layer.layerData,
            layer.id,
            layer.layerOpacity ?? 1,
            layer.sourceId
          );
        } else {
          updateSatelliteLayerOpacity(targetMap, layer.id, layer.layerOpacity ?? 1);
          toggleSatelliteLayerVisibility(targetMap, layer.id, layer.visible !== false);
        }
      } catch (e) {
        console.error(`[SatelliteMapOverlayControls] Error syncing layer ${layer.id}:`, e);
      }
    });

    prevLayerIds.current = currentIds;
  }, [satelliteLayers, isCompareMode, mapRefObj]);

  return null;
}

export default SatelliteMapOverlayControls;
