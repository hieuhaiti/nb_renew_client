import { useCallback, useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { env } from '@/config/env';
import { defaultLatLong, defaultZoom } from '@/features/map/constant/mapConstant';
import { highlightPointOnMap } from '@/features/map/utils/MapHelper';
import { useFovStore } from '../store/useFovStore';
import { normalizeBearing } from '../utils/fovHelpers';
import FOVControls from './FOVControls';

mapboxgl.accessToken = env.mapboxToken;

const MAP_STYLE =
  env.minimapMapboxStyle_Satellite || env.minimapMapboxStyle_Street || env.mapboxStyle_Street;

const SOURCE_FOV = 'fov';
const LAYER_FOV_FILL = 'fov-fill';
const LAYER_FOV_OUTLINE = 'fov-outline';
const SOURCE_POINTS = 'allTourismPoints';
const LAYER_POINTS = 'allTourismPoints-marker';
const LAYER_LABELS = 'allTourismPoints-label';

function parseGeometryValue(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function toCoords(value) {
  if (!Array.isArray(value) || value.length < 2) return null;
  const lng = Number(value[0]);
  const lat = Number(value[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return [lng, lat];
}

function getSceneCoords(scene) {
  if (!scene || typeof scene !== 'object') return null;

  const fromGeojson =
    parseGeometryValue(scene?.geojson)?.coordinates ||
    parseGeometryValue(scene?.geometry_data)?.coordinates ||
    parseGeometryValue(scene?.geometry)?.coordinates ||
    scene?.coordinates ||
    scene?.location?.coordinates ||
    null;

  const direct = toCoords(fromGeojson);
  if (direct) return direct;

  const lng = Number(scene?.longitude ?? scene?.lng ?? scene?.lon);
  const lat = Number(scene?.latitude ?? scene?.lat);
  if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng, lat];

  return null;
}

function emptyFeatureCollection() {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

function ensureFovArtifacts(map, initialData) {
  if (!map.getSource(SOURCE_FOV)) {
    map.addSource(SOURCE_FOV, {
      type: 'geojson',
      data: initialData || emptyFeatureCollection(),
    });
  }

  if (!map.getLayer(LAYER_FOV_FILL)) {
    map.addLayer({
      id: LAYER_FOV_FILL,
      type: 'fill',
      source: SOURCE_FOV,
      paint: {
        'fill-color': '#f59e0b',
        'fill-opacity': 0.18,
      },
    });
  }

  if (!map.getLayer(LAYER_FOV_OUTLINE)) {
    map.addLayer({
      id: LAYER_FOV_OUTLINE,
      type: 'line',
      source: SOURCE_FOV,
      paint: {
        'line-color': '#f59e0b',
        'line-width': 2,
        'line-opacity': 0.95,
      },
    });
  }
}

function ensurePointArtifacts(map, initialData) {
  if (!map.getSource(SOURCE_POINTS)) {
    map.addSource(SOURCE_POINTS, {
      type: 'geojson',
      data: initialData || emptyFeatureCollection(),
    });
  }

  if (!map.getLayer(LAYER_POINTS)) {
    map.addLayer({
      id: LAYER_POINTS,
      type: 'circle',
      source: SOURCE_POINTS,
      paint: {
        'circle-radius': ['case', ['boolean', ['get', 'isCurrent'], false], 7, 5],
        'circle-color': ['case', ['boolean', ['get', 'isCurrent'], false], '#ef4444', '#2563eb'],
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#ffffff',
      },
    });
  }

  if (!map.getLayer(LAYER_LABELS)) {
    map.addLayer({
      id: LAYER_LABELS,
      type: 'symbol',
      source: SOURCE_POINTS,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 12,
        'text-offset': [0, 1.2],
        'text-anchor': 'top',
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': '#0f172a',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1,
      },
    });
  }
}

function buildScenesGeoJson(scenes, currentSceneIndex) {
  const features = (Array.isArray(scenes) ? scenes : [])
    .map((scene, index) => {
      const coordinates = getSceneCoords(scene);
      if (!coordinates) return null;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates,
        },
        properties: {
          index,
          id: scene?.id,
          name: scene?.name || scene?.slug || `Point ${index + 1}`,
          isCurrent: index === currentSceneIndex,
        },
      };
    })
    .filter(Boolean);

  return {
    type: 'FeatureCollection',
    features,
  };
}

export default function MiniMap({
  scenes = [],
  currentSceneIndex = 0,
  onSelectScene,
  className = '',
  mapStyle = MAP_STYLE,
  showFovControls = true,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  const onSelectSceneRef = useRef(onSelectScene);
  const scenesRef = useRef(scenes);
  const currentCenterRef = useRef(null);
  const fovAngleRef = useRef(80);
  const fovRadiusRef = useRef(250);
  const fovPolygonRef = useRef(null);
  const scenesGeoJsonRef = useRef(null);

  const headingRafRef = useRef(null);
  const pendingHeadingRef = useRef(null);

  const fovPolygon = useFovStore((state) => state.fovPolygon);
  const fovAngle = useFovStore((state) => state.fovAngle);
  const fovRadius = useFovStore((state) => state.fovRadius);
  const heading = useFovStore((state) => state.heading);
  const setHeading = useFovStore((state) => state.setHeading);
  const setScenes = useFovStore((state) => state.setScenes);
  const setCurrentSceneIndex = useFovStore((state) => state.setCurrentSceneIndex);
  const updateFovPolygon = useFovStore((state) => state.updateFovPolygon);

  const scenesGeoJson = useMemo(
    () => buildScenesGeoJson(scenes, currentSceneIndex),
    [scenes, currentSceneIndex]
  );

  const currentCenter = useMemo(() => {
    const scene = Array.isArray(scenes) ? scenes[currentSceneIndex] : null;
    return getSceneCoords(scene);
  }, [scenes, currentSceneIndex]);

  const updateFovSourceData = useCallback((nextData) => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(SOURCE_FOV);
    if (source) source.setData(nextData || emptyFeatureCollection());
  }, []);

  const updatePointsSourceData = useCallback((nextData) => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(SOURCE_POINTS);
    if (source) source.setData(nextData || emptyFeatureCollection());
  }, []);

  useEffect(() => {
    onSelectSceneRef.current = onSelectScene;
  }, [onSelectScene]);

  useEffect(() => {
    scenesRef.current = scenes;
    currentCenterRef.current = currentCenter;
    fovAngleRef.current = fovAngle;
    fovRadiusRef.current = fovRadius;
    fovPolygonRef.current = fovPolygon;
    scenesGeoJsonRef.current = scenesGeoJson;

    setScenes(scenes);
    setCurrentSceneIndex(currentSceneIndex);
  }, [
    scenes,
    currentSceneIndex,
    currentCenter,
    fovAngle,
    fovRadius,
    fovPolygon,
    scenesGeoJson,
    setScenes,
    setCurrentSceneIndex,
  ]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialCenter = currentCenterRef.current || [defaultLatLong.lng, defaultLatLong.lat];

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: initialCenter,
      zoom: currentCenterRef.current ? 12 : defaultZoom,
      interactive: true,
      attributionControl: false,
    });

    mapRef.current = map;
    popupRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 8,
    });

    const initializeArtifacts = () => {
      ensureFovArtifacts(map, fovPolygonRef.current);
      ensurePointArtifacts(map, scenesGeoJsonRef.current);
      updateFovSourceData(fovPolygonRef.current);
      updatePointsSourceData(scenesGeoJsonRef.current);
    };

    const handlePointClick = (event) => {
      const feature = event?.features?.[0];
      if (!feature) return;

      const nextIndex = Number(feature.properties?.index);
      if (!Number.isFinite(nextIndex)) return;

      setCurrentSceneIndex(nextIndex);
      const selectedScene = scenesRef.current?.[nextIndex] ?? null;
      onSelectSceneRef.current?.(selectedScene, nextIndex);
    };

    const handlePointMouseEnter = (event) => {
      map.getCanvas().style.cursor = 'pointer';
      const feature = event?.features?.[0];
      if (!feature) return;

      const coordinates = [...feature.geometry.coordinates];
      const name = feature.properties?.name || 'Point';
      popupRef.current?.setLngLat(coordinates).setText(name).addTo(map);
    };

    const handlePointMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      popupRef.current?.remove();
    };

    map.on('load', initializeArtifacts);
    map.on('style.load', initializeArtifacts);
    map.on('click', LAYER_POINTS, handlePointClick);
    map.on('mouseenter', LAYER_POINTS, handlePointMouseEnter);
    map.on('mouseleave', LAYER_POINTS, handlePointMouseLeave);

    return () => {
      map.off('load', initializeArtifacts);
      map.off('style.load', initializeArtifacts);
      map.off('click', LAYER_POINTS, handlePointClick);
      map.off('mouseenter', LAYER_POINTS, handlePointMouseEnter);
      map.off('mouseleave', LAYER_POINTS, handlePointMouseLeave);

      if (headingRafRef.current) {
        window.cancelAnimationFrame(headingRafRef.current);
        headingRafRef.current = null;
      }

      popupRef.current?.remove();
      popupRef.current = null;

      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    updateFovSourceData(fovPolygon);
  }, [fovPolygon, updateFovSourceData]);

  useEffect(() => {
    updatePointsSourceData(scenesGeoJson);
  }, [scenesGeoJson, updatePointsSourceData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !currentCenter) return;

    highlightPointOnMap(map, {
      coordinates: currentCenter,
      properties: { name: 'Current Scene' },
    });
  }, [currentCenter]);

  useEffect(() => {
    if (!currentCenter) return;
    updateFovPolygon(currentCenter, heading, fovAngle, fovRadius);
  }, [currentCenter, heading, fovAngle, fovRadius, updateFovPolygon]);

  useEffect(() => {
    const flushHeading = () => {
      headingRafRef.current = null;
      const nextBearing = pendingHeadingRef.current;
      pendingHeadingRef.current = null;
      if (!Number.isFinite(nextBearing)) return;

      const center = currentCenterRef.current;
      if (!center) return;

      setHeading(nextBearing);
      updateFovPolygon(center, nextBearing, fovAngleRef.current, fovRadiusRef.current);
    };

    const handleSmoothFovUpdate = (event) => {
      const detail = event?.detail || {};
      const nextBearing = Number(detail?.bearing ?? detail?.heading);
      if (!Number.isFinite(nextBearing)) return;

      pendingHeadingRef.current = normalizeBearing(nextBearing);

      if (headingRafRef.current) return;
      headingRafRef.current = window.requestAnimationFrame(flushHeading);
    };

    window.addEventListener('smooth-fov-update', handleSmoothFovUpdate);

    return () => {
      window.removeEventListener('smooth-fov-update', handleSmoothFovUpdate);
      if (headingRafRef.current) {
        window.cancelAnimationFrame(headingRafRef.current);
        headingRafRef.current = null;
      }
      pendingHeadingRef.current = null;
    };
  }, [setHeading, updateFovPolygon]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={containerRef} className="h-full w-full" />

      {showFovControls && (
        <FOVControls
          center={currentCenter}
          className="absolute right-2 bottom-2 z-10 w-[min(300px,calc(100%-1rem))]"
        />
      )}
    </div>
  );
}
