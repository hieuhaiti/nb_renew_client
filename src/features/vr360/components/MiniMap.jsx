import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { env } from '@/config/env';
import { defaultLatLong, defaultZoom } from '@/features/map/constant/mapConstant';
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
const SOURCE_SPOTS = 'tourism-spots';
const LAYER_SPOTS = 'tourism-spots-circles';
const LAYER_SPOTS_LABELS = 'tourism-spots-labels';
const SOURCE_TC = 'tamchuc-points';
const LAYER_TC_CIRCLE = 'tamchuc-points-circle';
const LAYER_TC_LABEL = 'tamchuc-points-label';

const TAM_CHUC_POINTS = [
  { id: 0, name: 'Toàn cảnh Chùa Tam Chúc', lon: 105.813644, lat: 20.570221 },
  { id: 1, name: 'Quang cảnh giữa hồ', lon: 105.802141, lat: 20.559819 },
  { id: 2, name: 'Đình Tam Chúc', lon: 105.810591, lat: 20.563899 },
  { id: 3, name: 'Phía sau Tam Quan Nội', lon: 105.792921, lat: 20.550073 },
  { id: 4, name: 'Trung tâm Tam Quan Nội', lon: 105.795188, lat: 20.552453 },
  { id: 5, name: 'Tổng quan Tam Quan Nội', lon: 105.798021, lat: 20.555202 },
  { id: 6, name: 'Tổng quan Chùa Ba Sao', lon: 105.780935, lat: 20.558702 },
  { id: 7, name: 'Cảnh quan phía Tây 2', lon: 105.799395, lat: 20.568123 },
  { id: 8, name: 'Cảnh quan phía Tây 1', lon: 105.806941, lat: 20.575695 },
  { id: 9, name: 'Cổng vào chùa Tam Chúc', lon: 105.819089, lat: 20.565783 },
  { id: 10, name: 'Trục đường tiến vào 2', lon: 105.821317, lat: 20.578552 },
  { id: 11, name: 'Trục đường tiến vào 1', lon: 105.829817, lat: 20.584428 },
];

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

function ensureSpotArtifacts(map, initialData) {
  if (!map.getSource(SOURCE_SPOTS)) {
    map.addSource(SOURCE_SPOTS, {
      type: 'geojson',
      data: initialData || emptyFeatureCollection(),
    });
  }

  if (!map.getLayer(LAYER_SPOTS)) {
    map.addLayer({
      id: LAYER_SPOTS,
      type: 'circle',
      source: SOURCE_SPOTS,
      paint: {
        'circle-radius': ['case', ['boolean', ['get', 'isCurrent'], false], 8, 5],
        'circle-color': ['case', ['boolean', ['get', 'isCurrent'], false], '#ef4444', '#7c3aed'],
        'circle-stroke-width': ['case', ['boolean', ['get', 'isCurrent'], false], 2.5, 1.5],
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8,
      },
    });
  }

  if (!map.getLayer(LAYER_SPOTS_LABELS)) {
    map.addLayer({
      id: LAYER_SPOTS_LABELS,
      type: 'symbol',
      source: SOURCE_SPOTS,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 11,
        'text-offset': [0, 1.2],
        'text-anchor': 'top',
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': '#4c1d95',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1,
      },
    });
  }
}

function buildSpotsGeoJson(spots, currentSpotIds = new Set()) {
  const features = (Array.isArray(spots) ? spots : [])
    .map((spot) => {
      const coordinates = getSceneCoords(spot);
      if (!coordinates) return null;
      const resolvedId = spot?.id ?? spot?.spot_id ?? spot?.point_id ?? null;
      const resolvedSlug = spot?.slug ?? spot?.spot_slug ?? null;
      const isCurrent =
        (resolvedId != null && currentSpotIds.has(String(resolvedId))) ||
        (resolvedSlug != null && currentSpotIds.has(String(resolvedSlug)));

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates },
        properties: {
          id: resolvedId,
          slug: resolvedSlug,
          name: spot?.name || spot?.slug || 'Điểm du lịch',
          isCurrent,
        },
      };
    })
    .filter(Boolean);
  return { type: 'FeatureCollection', features };
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

function buildTamChucGeoJson(activeId = -1) {
  return {
    type: 'FeatureCollection',
    features: TAM_CHUC_POINTS.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
      properties: { id: p.id, name: p.name, active: p.id === activeId },
    })),
  };
}

function ensureTcArtifacts(map, initialData) {
  if (!map.getSource(SOURCE_TC)) {
    map.addSource(SOURCE_TC, { type: 'geojson', data: initialData || buildTamChucGeoJson() });
  }

  if (!map.getLayer(LAYER_TC_CIRCLE)) {
    map.addLayer({
      id: LAYER_TC_CIRCLE,
      type: 'circle',
      source: SOURCE_TC,
      layout: { visibility: 'visible' },
      paint: {
        'circle-radius': ['case', ['boolean', ['get', 'active'], false], 7, 5],
        'circle-color': ['case', ['boolean', ['get', 'active'], false], '#00ffd5', '#ff3b30'],
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#ffffff',
      },
    });
  }

  if (!map.getLayer(LAYER_TC_LABEL)) {
    map.addLayer({
      id: LAYER_TC_LABEL,
      type: 'symbol',
      source: SOURCE_TC,
      minzoom: 12,
      layout: {
        visibility: 'visible',
        'text-field': ['get', 'name'],
        'text-size': 12,
        'text-offset': [0, 1.2],
        'text-anchor': 'top',
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1.2,
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
  spots = [],
  currentSpot = null,
  currentSceneIndex = 0,
  onSelectScene,
  onSelectSpot,
  className = '',
  mapStyle = MAP_STYLE,
  showFovControls = true,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  const onSelectSceneRef = useRef(onSelectScene);
  const onSelectSpotRef = useRef(onSelectSpot);
  const scenesRef = useRef(scenes);
  const spotsRef = useRef(spots);
  const currentCenterRef = useRef(null);
  const fovAngleRef = useRef(80);
  const fovRadiusRef = useRef(250);
  const fovPolygonRef = useRef(null);
  const scenesGeoJsonRef = useRef(null);
  const spotsGeoJsonRef = useRef(null);

  const viewModeRef = useRef('closeup');
  const tcActiveIdRef = useRef(-1);
  const headingRafRef = useRef(null);
  const pendingHeadingRef = useRef(null);

  const [viewMode, setViewMode] = useState('closeup');

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

  const currentSpotCenter = useMemo(() => {
    return getSceneCoords(currentSpot);
  }, [currentSpot]);

  const currentSpotIds = useMemo(() => {
    const ids = new Set();
    const id = currentSpot?.id ?? currentSpot?.spot_id ?? currentSpot?.point_id;
    const slug = currentSpot?.slug ?? currentSpot?.spot_slug;
    if (id != null) ids.add(String(id));
    if (slug != null) ids.add(String(slug));
    return ids;
  }, [currentSpot]);

  const spotsGeoJson = useMemo(
    () => buildSpotsGeoJson(spots, currentSpotIds),
    [spots, currentSpotIds]
  );

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

  const updateSpotsSourceData = useCallback((nextData) => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(SOURCE_SPOTS);
    if (source) source.setData(nextData || emptyFeatureCollection());
  }, []);

  const switchToOverview = useCallback(() => {
    viewModeRef.current = 'overview';
    setViewMode('overview');
    const map = mapRef.current;
    if (!map) return;
    if (map.getLayer(LAYER_TC_CIRCLE)) map.setLayoutProperty(LAYER_TC_CIRCLE, 'visibility', 'none');
    if (map.getLayer(LAYER_TC_LABEL)) map.setLayoutProperty(LAYER_TC_LABEL, 'visibility', 'none');
    const apiCoords = [
      ...(Array.isArray(scenesRef.current) ? scenesRef.current : []),
      ...(Array.isArray(spotsRef.current) ? spotsRef.current : []),
    ]
      .map(getSceneCoords)
      .filter(Boolean);
    const tcCoords = TAM_CHUC_POINTS.map((p) => [p.lon, p.lat]);
    const allCoords = [...apiCoords, ...tcCoords];
    if (allCoords.length === 0) return;
    const bounds = allCoords.reduce(
      (b, c) => b.extend(c),
      new mapboxgl.LngLatBounds(allCoords[0], allCoords[0])
    );
    map.fitBounds(bounds, { padding: 40, duration: 1000, maxZoom: 14 });
  }, []);

  const switchToCloseup = useCallback(() => {
    viewModeRef.current = 'closeup';
    setViewMode('closeup');
    const map = mapRef.current;
    if (!map) return;
    if (map.getLayer(LAYER_TC_CIRCLE)) map.setLayoutProperty(LAYER_TC_CIRCLE, 'visibility', 'visible');
    if (map.getLayer(LAYER_TC_LABEL)) map.setLayoutProperty(LAYER_TC_LABEL, 'visibility', 'visible');
    const activePoint = TAM_CHUC_POINTS[tcActiveIdRef.current] ?? TAM_CHUC_POINTS[0];
    if (activePoint) map.easeTo({ center: [activePoint.lon, activePoint.lat], zoom: 13, duration: 400 });
  }, []);

  useEffect(() => {
    onSelectSceneRef.current = onSelectScene;
  }, [onSelectScene]);

  useEffect(() => {
    onSelectSpotRef.current = onSelectSpot;
  }, [onSelectSpot]);

  useEffect(() => {
    scenesRef.current = scenes;
    spotsRef.current = spots;
    currentCenterRef.current = currentSpotCenter || currentCenter;
    fovAngleRef.current = fovAngle;
    fovRadiusRef.current = fovRadius;
    fovPolygonRef.current = fovPolygon;
    scenesGeoJsonRef.current = scenesGeoJson;
    spotsGeoJsonRef.current = spotsGeoJson;

    setScenes(scenes);
    setCurrentSceneIndex(currentSceneIndex);
  }, [
    scenes,
    spots,
    currentSceneIndex,
    currentCenter,
    currentSpotCenter,
    fovAngle,
    fovRadius,
    fovPolygon,
    scenesGeoJson,
    spotsGeoJson,
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
      zoom: currentCenterRef.current ? 13 : defaultZoom,
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
      ensureSpotArtifacts(map, spotsGeoJsonRef.current);
      ensureFovArtifacts(map, fovPolygonRef.current);
      ensurePointArtifacts(map, scenesGeoJsonRef.current);
      ensureTcArtifacts(map, buildTamChucGeoJson(tcActiveIdRef.current));
      updateSpotsSourceData(spotsGeoJsonRef.current);
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

    const handleSpotClick = (event) => {
      const feature = event?.features?.[0];
      if (!feature) return;
      const spotId = feature.properties?.id;
      const spot =
        spotsRef.current?.find(
          (s) => String(s?.id ?? s?.spot_id ?? s?.point_id) === String(spotId)
        ) ?? null;
      onSelectSpotRef.current?.(spot);
    };

    const handleTcPointClick = (event) => {
      const feature = event?.features?.[0];
      if (!feature) return;
      const pointId = Number(feature.properties?.id);
      if (!Number.isFinite(pointId)) return;
      tcActiveIdRef.current = pointId;
      const source = map.getSource(SOURCE_TC);
      if (source) source.setData(buildTamChucGeoJson(pointId));
      const selectedScene = scenesRef.current?.[pointId] ?? null;
      setCurrentSceneIndex(pointId);
      onSelectSceneRef.current?.(selectedScene, pointId);
    };

    const handlePointMouseEnter = (event) => {
      map.getCanvas().style.cursor = 'pointer';
      const feature = event?.features?.[0];
      if (!feature) return;
      const coordinates = [...feature.geometry.coordinates];
      const name = feature.properties?.name || 'Point';
      popupRef.current?.setLngLat(coordinates).setText(name).addTo(map);
    };

    const handleSpotMouseEnter = (event) => {
      map.getCanvas().style.cursor = 'pointer';
      const feature = event?.features?.[0];
      if (!feature) return;
      const coordinates = [...feature.geometry.coordinates];
      const name = feature.properties?.name || 'Điểm du lịch';
      popupRef.current?.setLngLat(coordinates).setText(name).addTo(map);
    };

    const handleTcMouseEnter = (event) => {
      map.getCanvas().style.cursor = 'pointer';
      const feature = event?.features?.[0];
      if (!feature) return;
      const coordinates = [...feature.geometry.coordinates];
      const name = feature.properties?.name || 'Điểm tham quan';
      popupRef.current?.setLngLat(coordinates).setText(name).addTo(map);
    };

    const handlePointMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      popupRef.current?.remove();
    };

    map.on('load', initializeArtifacts);
    map.on('style.load', initializeArtifacts);
    map.on('click', LAYER_POINTS, handlePointClick);
    map.on('click', LAYER_SPOTS, handleSpotClick);
    map.on('click', LAYER_TC_CIRCLE, handleTcPointClick);
    map.on('mouseenter', LAYER_POINTS, handlePointMouseEnter);
    map.on('mouseenter', LAYER_SPOTS, handleSpotMouseEnter);
    map.on('mouseenter', LAYER_TC_CIRCLE, handleTcMouseEnter);
    map.on('mouseleave', LAYER_POINTS, handlePointMouseLeave);
    map.on('mouseleave', LAYER_SPOTS, handlePointMouseLeave);
    map.on('mouseleave', LAYER_TC_CIRCLE, handlePointMouseLeave);

    return () => {
      map.off('load', initializeArtifacts);
      map.off('style.load', initializeArtifacts);
      map.off('click', LAYER_POINTS, handlePointClick);
      map.off('click', LAYER_SPOTS, handleSpotClick);
      map.off('click', LAYER_TC_CIRCLE, handleTcPointClick);
      map.off('mouseenter', LAYER_POINTS, handlePointMouseEnter);
      map.off('mouseenter', LAYER_SPOTS, handleSpotMouseEnter);
      map.off('mouseenter', LAYER_TC_CIRCLE, handleTcMouseEnter);
      map.off('mouseleave', LAYER_POINTS, handlePointMouseLeave);
      map.off('mouseleave', LAYER_SPOTS, handlePointMouseLeave);
      map.off('mouseleave', LAYER_TC_CIRCLE, handlePointMouseLeave);

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
    updateSpotsSourceData(spotsGeoJson);
  }, [spotsGeoJson, updateSpotsSourceData]);

  // Đồng bộ TC layer khi scene đổi — giống highlightPoint() trong index.html
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tcActiveIdRef.current = currentSceneIndex;
    const source = map.getSource(SOURCE_TC);
    if (source) source.setData(buildTamChucGeoJson(currentSceneIndex));
    if (viewModeRef.current !== 'closeup') return;
    const p = TAM_CHUC_POINTS[currentSceneIndex];
    if (p && map.loaded()) map.easeTo({ center: [p.lon, p.lat], duration: 400 });
  }, [currentSceneIndex]);

  useEffect(() => {
    const map = mapRef.current;
    const targetCenter = currentSpotCenter || currentCenter;
    if (!map || !targetCenter || viewModeRef.current !== 'closeup') return;

    const runEaseTo = () => {
      map.easeTo({ center: targetCenter, zoom: Math.max(map.getZoom(), 13), duration: 400 });
    };

    if (map.loaded()) {
      runEaseTo();
      return;
    }

    const handleMapReady = () => {
      if (!mapRef.current) return;
      runEaseTo();
    };

    map.once('load', handleMapReady);
    map.once('style.load', handleMapReady);

    return () => {
      map.off('load', handleMapReady);
      map.off('style.load', handleMapReady);
    };
  }, [currentCenter, currentSpotCenter]);

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

      <div className="absolute top-2 left-2 z-10 flex gap-1">
        <button
          onClick={switchToOverview}
          className={`px-2 py-1 text-[11px] font-bold rounded shadow-sm transition-colors ${
            viewMode === 'overview'
              ? 'bg-amber-500 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          Toàn cảnh
        </button>
        <button
          onClick={switchToCloseup}
          className={`px-2 py-1 text-[11px] font-bold rounded shadow-sm transition-colors ${
            viewMode === 'closeup'
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          Cận cảnh
        </button>
      </div>

      {showFovControls && (
        <FOVControls
          center={currentCenter}
          className="absolute right-2 bottom-2 z-10 w-[min(300px,calc(100%-1rem))]"
        />
      )}
    </div>
  );
}
