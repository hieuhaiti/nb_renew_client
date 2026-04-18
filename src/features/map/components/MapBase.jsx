import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { useTranslation } from 'react-i18next';
import { useMapStore } from '../store/useMapStore';
import { defaultLatLong, defaultZoom, mapDelta, pitchDefault } from '../constant/mapConstant';
import { useMapStyleStore } from '../store/useMapStyleStore';
import ResetControl from './control/ToolResetControl';
import ToolBaseMap from './control/ToolBaseMap';
import ToolViewModeControl from './control/ToolViewModeControl';
import { env } from '@/config/env';

mapboxgl.accessToken = env.mapboxToken;

/**
 * MapBaseArea — main map canvas area that stays visible behind overlays.
 */
export default function MapBaseArea() {
  // Map state
  const { t } = useTranslation();
  const mapContainer = useRef(null);
  const singleMapContainerRef = useRef(null);
  const splitMapContainerRef = useRef(null);
  const { setMapRef, isSplitMode } = useMapStore();

  const mapRef = useRef({
    single: null, // map đơn
    split: null, // map phải
    compare: null, // instance compare
  });

  // Map style
  const mapStyle = useMapStyleStore((s) => s.mapStyle);
  const [mapsReady, setMapsReady] = useState({
    single: false,
    split: false,
  });

  const [mapState, setMapState] = useState({
    lat: defaultLatLong.lat,
    lng: defaultLatLong.lng,
    zoom: defaultZoom,
  });

  useEffect(() => {
    if (mapRef.current.single || !singleMapContainerRef.current) return;

    // Lấy terrainState hiện tại để khởi tạo pitch đúng
    const initialTerrain = useMapStyleStore.getState().terrainState;

    mapRef.current.single = new mapboxgl.Map({
      container: singleMapContainerRef.current,
      style: mapStyle,
      center: [defaultLatLong.lng, defaultLatLong.lat],
      zoom: defaultZoom,
      pitch: pitchDefault(initialTerrain),
      bearing: 0,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    mapRef.current.split = new mapboxgl.Map({
      container: splitMapContainerRef.current,
      style: mapStyle,
      center: [defaultLatLong.lng, defaultLatLong.lat],
      zoom: defaultZoom,
      pitch: pitchDefault(initialTerrain),
      bearing: 0,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    // Ẩn split map ban đầu
    mapRef.current.split.getContainer().style.display = 'none';

    // Use single map as main reference
    const map = mapRef.current.single;

    const handleSingleLoad = () => {
      setMapRef(map);
      // Store full mapRef so satellite store can access single/split maps without prop drilling
      useMapStore.getState().setMapRefObj(mapRef);

      const center = map.getCenter();
      const mapBounds = [
        [center.lng - mapDelta, center.lat - mapDelta],
        [center.lng + mapDelta, center.lat + mapDelta],
      ];
      map.setMaxBounds(mapBounds);

      // Add Map Controls (only to single map)
      map.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }),
        'bottom-right'
      );
      map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
      map.addControl(new ResetControl(), 'bottom-right');
      map.addControl(new ToolBaseMap(), 'bottom-right');
      map.addControl(new ToolViewModeControl(), 'bottom-right');

      setMapsReady((prev) => ({ ...prev, single: true }));
    };

    const handleSplitLoad = () => {
      setMapsReady((prev) => ({ ...prev, split: true }));
    };

    map.on('load', handleSingleLoad);
    mapRef.current.split.on('load', handleSplitLoad);

    const handleMove = () => {
      // Sync split map when in compare mode
      if (
        useMapStore.getState().isSplitMode &&
        mapRef.current.split &&
        mapRef.current.split.isStyleLoaded()
      ) {
        mapRef.current.split.jumpTo({
          center: map.getCenter(),
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing(),
        });
      }
    };

    const handleMoveEnd = () => {
      const center = map.getCenter();
      setMapState({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      });
      handleMove();
    };

    map.on('move', handleMove);
    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('move', handleMove);
      map.off('moveend', handleMoveEnd);

      if (mapRef.current.single) {
        mapRef.current.single.remove();
        mapRef.current.single = null;
      }
      if (mapRef.current.split) {
        mapRef.current.split.remove();
        mapRef.current.split = null;
      }
      mapRef.current.compare = null;
      setMapsReady({ single: false, split: false });
    };
  }, []);

  return (
    <div className="relative size-full">
      <div ref={mapContainer} className="relative size-full">
        <div ref={splitMapContainerRef} className="absolute inset-0 size-full" />
        <div ref={singleMapContainerRef} className="absolute inset-0 size-full" />
      </div>
    </div>
  );
}
