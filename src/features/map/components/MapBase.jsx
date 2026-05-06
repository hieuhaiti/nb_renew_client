import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { useTranslation } from 'react-i18next';
import { useSubcategoryLayerQuery } from '@/services/api/map/mapDataLayerService';
import { useMapStore } from '../store/useMapStore';
import { defaultLatLong, defaultZoom, mapDelta, pitchDefault } from '../constant/mapConstant';
import { useMapStyleStore } from '../store/useMapStyleStore';
import ResetControl from './control/ToolResetControl';
import ToolLocateControl from './control/ToolLocateControl';
import ToolViewModeControl from './control/ToolViewModeControl';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useDataLayerStore } from '@/features/map/store/useDataLayerStore';
import {
  addOrUpdateSubcategoryLayer,
  mapFeatureToDestination,
  normalizePointsToFeatureCollection,
  removeSubcategoryLayer,
} from '@/features/map/utils/MapHelper';
import {
  buildHighlightRoutePointsFeatureCollection,
  createRouteFromPoints,
} from '@/features/map/utils/highlightRouteUtils';
import { env } from '@/config/env';
import { withBaseUrl } from '@/lib/utils';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { useSpotDetailModalStore } from '@/features/map/store/useModalStore';

mapboxgl.accessToken = env.mapboxToken;

const SUBCATEGORY_LAYER_SUFFIXES = [
  'fill',
  'line',
  'point',
  'cluster',
  'cluster-count',
];

const HIGHLIGHT_ROUTE_SOURCE_ID = 'highlight-route';
const HIGHLIGHT_ROUTE_POINTS_SOURCE_ID = 'highlight-route-points';
const HIGHLIGHT_ROUTE_LAYER_IDS = [
  'highlight-route-shadow',
  'highlight-route-outline',
  'highlight-route-main',
  'highlight-route-pattern',
  'highlight-route-arrows',
  'highlight-route-points-shadow',
  'highlight-route-points-bg',
  'highlight-route-points-inner',
  'highlight-route-points-label',
  'highlight-route-points-name',
];

/**
 * MapBaseArea — main map canvas area that stays visible behind overlays.
 */
export default function MapBaseArea() {
  const DIRECTION_ROUTE_SOURCE_ID = 'direction-route-source';
  const DIRECTION_ROUTE_LAYER_ID = 'direction-route-layer';

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
  const lang = useLanguageStore((state) => state.lang);
  const selectedSubcategoryIds = useDataLayerStore((state) => state.selectedSubcategoryIds);
  const subcategories = useDataLayerStore((state) => state.subcategories);
  const setHighlightedPoint = useMapStore((state) => state.setHighlightedPoint);
  const openSpotModal = useSpotDetailModalStore((state) => state.openSpotModal);
  const highlightedRoute = useMapStore((state) => state.highlightedRoute);
  const highlightedRouteAt = useMapStore((state) => state.highlightedRouteAt);
  const showOnlyHighlightedRoute = useMapStore((state) => state.showOnlyHighlightedRoute);
  const directions = useDirectionsStore((state) => state.directions);
  const startLocation = useDirectionsStore((state) => state.startLocation);
  const endLocation = useDirectionsStore((state) => state.endLocation);

  const routeMarkersRef = useRef({
    start: null,
    end: null,
  });
  const hadDirectionsRef = useRef(false);

  const selectedSubcategoryIdsSafe = useMemo(
    () => (Array.isArray(selectedSubcategoryIds) ? selectedSubcategoryIds.filter(Boolean) : []),
    [selectedSubcategoryIds]
  );

  const colorBySubcategoryId = useMemo(() => {
    const map = new Map();
    subcategories.forEach((item) => {
      if (item?.id == null) return;
      map.set(String(item.id), item.color_hex || item.color_code || '#3b82f6');
    });
    return map;
  }, [subcategories]);

  const iconBySubcategoryId = useMemo(() => {
    const map = new Map();
    subcategories.forEach((item) => {
      if (item?.id == null || !item.icon_url) return;
      map.set(String(item.id), {
        iconUrl: withBaseUrl(item.icon_url),
        iconImageId: `subcategory-icon-${item.id}`,
      });
    });
    return map;
  }, [subcategories]);

  const subcategoryLayerQueries = useSubcategoryLayerQuery({
    subcategoryIds: selectedSubcategoryIdsSafe,
    lang,
  });

  const prevRenderedSourceIdsRef = useRef(new Set());

  const setSubcategoryLayersVisibility = (map, isVisible) => {
    if (!map) return;

    const visibility = isVisible ? 'visible' : 'none';
    prevRenderedSourceIdsRef.current.forEach((sourceId) => {
      SUBCATEGORY_LAYER_SUFFIXES.forEach((suffix) => {
        const layerId = `${sourceId}-${suffix}`;
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', visibility);
        }
      });
    });
  };

  const clearHighlightRouteLayers = (map) => {
    if (!map) return;

    [...HIGHLIGHT_ROUTE_LAYER_IDS].reverse().forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });

    if (map.getSource(HIGHLIGHT_ROUTE_POINTS_SOURCE_ID)) {
      map.removeSource(HIGHLIGHT_ROUTE_POINTS_SOURCE_ID);
    }

    if (map.getSource(HIGHLIGHT_ROUTE_SOURCE_ID)) {
      map.removeSource(HIGHLIGHT_ROUTE_SOURCE_ID);
    }
  };

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
    const splitMap = mapRef.current.split;

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
      map.addControl(new ToolLocateControl(), 'bottom-right');
      map.addControl(new ResetControl(), 'bottom-right');
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

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    const currentSourceIds = new Set();
    const query = subcategoryLayerQueries[0];
    const data = query?.data;

    if (!data) return;

    const allFeatures = normalizePointsToFeatureCollection(data);

    selectedSubcategoryIdsSafe.forEach((subcategoryId) => {
      const sourceId = `subcategory-${subcategoryId}`;
      const featureCollection = {
        type: 'FeatureCollection',
        features: allFeatures.features.filter(
          (f) => String(f.properties?.category_id) === String(subcategoryId)
        ),
      };
      const color = colorBySubcategoryId.get(String(subcategoryId));

      const icon = iconBySubcategoryId.get(String(subcategoryId));
      addOrUpdateSubcategoryLayer(map, {
        sourceId,
        featureCollection,
        color,
        iconUrl: icon?.iconUrl,
        iconImageId: icon?.iconImageId,
      });

      const shouldShowLayer = !(showOnlyHighlightedRoute && highlightedRoute);
      SUBCATEGORY_LAYER_SUFFIXES.forEach((suffix) => {
        const layerId = `${sourceId}-${suffix}`;
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', shouldShowLayer ? 'visible' : 'none');
        }
      });
      currentSourceIds.add(sourceId);
    });

    prevRenderedSourceIdsRef.current.forEach((sourceId) => {
      if (!currentSourceIds.has(sourceId)) {
        removeSubcategoryLayer(map, sourceId);
      }
    });

    prevRenderedSourceIdsRef.current = currentSourceIds;
  }, [
    colorBySubcategoryId,
    highlightedRoute,
    iconBySubcategoryId,
    mapsReady.single,
    selectedSubcategoryIdsSafe,
    showOnlyHighlightedRoute,
    subcategoryLayerQueries[0]?.dataUpdatedAt,
  ]);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    let didCancel = false;

    const drawHighlightedRoute = async () => {
      const points = Array.isArray(highlightedRoute?.points) ? highlightedRoute.points : [];

      if (points.length < 2) {
        clearHighlightRouteLayers(map);
        return;
      }

      try {
        const routeResult = await createRouteFromPoints(
          points,
          highlightedRoute?.vehicle || 'driving',
          lang === 'en' ? 'en' : 'vi'
        );

        if (didCancel) return;
        if (!routeResult?.geometry?.coordinates?.length) {
          clearHighlightRouteLayers(map);
          return;
        }

        const routeFeature = {
          type: 'Feature',
          geometry: routeResult.geometry,
          properties: {
            ...(routeResult.properties || {}),
            ...(highlightedRoute?.meta || {}),
          },
        };

        const routePoints = buildHighlightRoutePointsFeatureCollection(
          routeResult.points?.length ? routeResult.points : points
        );

        clearHighlightRouteLayers(map);

        map.addSource(HIGHLIGHT_ROUTE_SOURCE_ID, {
          type: 'geojson',
          data: routeFeature,
        });

        map.addSource(HIGHLIGHT_ROUTE_POINTS_SOURCE_ID, {
          type: 'geojson',
          data: routePoints,
        });

        map.addLayer({
          id: 'highlight-route-shadow',
          type: 'line',
          source: HIGHLIGHT_ROUTE_SOURCE_ID,
          paint: {
            'line-color': '#111111',
            'line-opacity': 0.22,
            'line-width': 14,
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
        });

        map.addLayer({
          id: 'highlight-route-outline',
          type: 'line',
          source: HIGHLIGHT_ROUTE_SOURCE_ID,
          paint: {
            'line-color': '#ffffff',
            'line-opacity': 0.95,
            'line-width': 10,
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
        });

        map.addLayer({
          id: 'highlight-route-main',
          type: 'line',
          source: HIGHLIGHT_ROUTE_SOURCE_ID,
          paint: {
            'line-color': '#DC2626',
            'line-opacity': 0.98,
            'line-width': 7,
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
        });

        map.addLayer({
          id: 'highlight-route-pattern',
          type: 'line',
          source: HIGHLIGHT_ROUTE_SOURCE_ID,
          paint: {
            'line-color': '#FACC15',
            'line-opacity': 0.8,
            'line-width': 2.5,
            'line-dasharray': [0.6, 2],
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
        });

        map.addLayer({
          id: 'highlight-route-arrows',
          type: 'symbol',
          source: HIGHLIGHT_ROUTE_SOURCE_ID,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 64,
            'text-field': '▶',
            'text-size': 11,
            'text-keep-upright': false,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          },
          paint: {
            'text-color': '#B91C1C',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-opacity': 0.8,
          },
        });

        map.addLayer({
          id: 'highlight-route-points-shadow',
          type: 'circle',
          source: HIGHLIGHT_ROUTE_POINTS_SOURCE_ID,
          paint: {
            'circle-radius': 14,
            'circle-color': '#111111',
            'circle-opacity': 0.18,
          },
        });

        map.addLayer({
          id: 'highlight-route-points-bg',
          type: 'circle',
          source: HIGHLIGHT_ROUTE_POINTS_SOURCE_ID,
          paint: {
            'circle-radius': 12,
            'circle-color': [
              'case',
              ['boolean', ['get', 'is_start'], false],
              '#DC2626',
              ['boolean', ['get', 'is_end'], false],
              '#DC2626',
              '#F59E0B',
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2.5,
          },
        });

        map.addLayer({
          id: 'highlight-route-points-inner',
          type: 'circle',
          source: HIGHLIGHT_ROUTE_POINTS_SOURCE_ID,
          paint: {
            'circle-radius': 5,
            'circle-color': '#ffffff',
            'circle-opacity': 0.95,
          },
        });

        map.addLayer({
          id: 'highlight-route-points-label',
          type: 'symbol',
          source: HIGHLIGHT_ROUTE_POINTS_SOURCE_ID,
          layout: {
            'text-field': ['to-string', ['get', 'step_number']],
            'text-size': 10,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          },
          paint: {
            'text-color': '#111827',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.2,
          },
        });

        map.addLayer({
          id: 'highlight-route-points-name',
          type: 'symbol',
          source: HIGHLIGHT_ROUTE_POINTS_SOURCE_ID,
          layout: {
            'text-field': ['coalesce', ['get', 'name'], ''],
            'text-size': 12,
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 1.8],
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#111827',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.8,
          },
        });

        const coordinates = routeResult.geometry.coordinates;
        const bounds = coordinates.reduce(
          (acc, coord) => acc.extend(coord),
          new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );

        map.fitBounds(bounds, {
          padding: 88,
          duration: 850,
        });
      } catch (error) {
        if (!didCancel) {
          console.error('Error rendering highlighted route:', error);
          clearHighlightRouteLayers(map);
        }
      }
    };

    if (map.isStyleLoaded()) {
      drawHighlightedRoute();
    }

    map.on('style.load', drawHighlightedRoute);

    return () => {
      didCancel = true;
      map.off('style.load', drawHighlightedRoute);
    };
  }, [highlightedRouteAt, highlightedRoute, lang, mapsReady.single]);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    const getInteractiveLayerIds = () => {
      const sourceIds = Array.from(prevRenderedSourceIdsRef.current);

      return sourceIds
        .map((sourceId) => `${sourceId}-point`)
        .filter((layerId) => Boolean(map.getLayer(layerId)));
    };

    const handleMapClick = (event) => {
      const layerIds = getInteractiveLayerIds();
      if (layerIds.length === 0) return;

      const features = map.queryRenderedFeatures(event.point, { layers: layerIds });
      if (!features.length) return;

      const clickedFeature = features[0];
      const destination = mapFeatureToDestination(clickedFeature);
      if (!destination) return;

      const clickedLayerId = clickedFeature?.layer?.id || '';
      const clickedLayerMatch = clickedLayerId.match(/^subcategory-(.+)-(point)$/);
      const subcategoryFromLayer = clickedLayerMatch?.[1] ?? null;

      let normalizedSubcategoryId = destination.subcategory_id;
      if (normalizedSubcategoryId == null && subcategoryFromLayer != null) {
        const parsed = Number(subcategoryFromLayer);
        normalizedSubcategoryId = Number.isNaN(parsed) ? subcategoryFromLayer : parsed;
      }

      setHighlightedPoint({
        ...destination,
        subcategory_id: normalizedSubcategoryId,
      });

      if (destination.id) {
        openSpotModal(destination.id, destination.slug ?? null);
      }
    };

    const handleMouseMove = (event) => {
      const layerIds = getInteractiveLayerIds();
      const canvas = map?.getCanvas?.();
      if (!canvas?.style) return;

      if (layerIds.length === 0) {
        canvas.style.cursor = '';
        return;
      }

      const features = map.queryRenderedFeatures(event.point, { layers: layerIds });
      canvas.style.cursor = features.length > 0 ? 'pointer' : '';
    };

    const clearCursor = () => {
      const canvas = map?.getCanvas?.();
      if (!canvas?.style) return;
      canvas.style.cursor = '';
    };

    map.on('click', handleMapClick);
    map.on('mousemove', handleMouseMove);
    map.on('mouseout', clearCursor);

    return () => {
      map.off('click', handleMapClick);
      map.off('mousemove', handleMouseMove);
      map.off('mouseout', clearCursor);
      clearCursor();
    };
  }, [mapsReady.single, setHighlightedPoint, openSpotModal]);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    const shouldShowSubcategoryLayers = !(showOnlyHighlightedRoute && highlightedRoute);
    setSubcategoryLayersVisibility(map, shouldShowSubcategoryLayers);
  }, [highlightedRoute, mapsReady.single, showOnlyHighlightedRoute]);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map) return;

    const handleStyleLoad = () => {
      const currentSourceIds = new Set();
      const query = subcategoryLayerQueries[0];
      const data = query?.data;

      if (!data) return;

      const allFeatures = normalizePointsToFeatureCollection(data);

      selectedSubcategoryIdsSafe.forEach((subcategoryId) => {
        const sourceId = `subcategory-${subcategoryId}`;
        const featureCollection = {
          type: 'FeatureCollection',
          features: allFeatures.features.filter(
            (f) => String(f.properties?.category_id) === String(subcategoryId)
          ),
        };
        const color = colorBySubcategoryId.get(String(subcategoryId)) || '#3b82f6';
        const icon = iconBySubcategoryId.get(String(subcategoryId));

        addOrUpdateSubcategoryLayer(map, {
          sourceId,
          featureCollection,
          color,
          iconUrl: icon?.iconUrl,
          iconImageId: icon?.iconImageId,
        });

        const shouldShowLayer = !(showOnlyHighlightedRoute && highlightedRoute);
        SUBCATEGORY_LAYER_SUFFIXES.forEach((suffix) => {
          const layerId = `${sourceId}-${suffix}`;
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', shouldShowLayer ? 'visible' : 'none');
          }
        });
        currentSourceIds.add(sourceId);
      });

      prevRenderedSourceIdsRef.current = currentSourceIds;
    };

    map.on('style.load', handleStyleLoad);
    return () => {
      map.off('style.load', handleStyleLoad);
    };
  }, [
    colorBySubcategoryId,
    highlightedRoute,
    iconBySubcategoryId,
    mapsReady.single,
    selectedSubcategoryIdsSafe,
    showOnlyHighlightedRoute,
    subcategoryLayerQueries[0]?.dataUpdatedAt,
  ]);

  useEffect(() => {
    return () => {
      const map = mapRef.current.single;
      if (!map) return;

      prevRenderedSourceIdsRef.current.forEach((sourceId) => {
        removeSubcategoryLayer(map, sourceId);
      });
      prevRenderedSourceIdsRef.current.clear();
      clearHighlightRouteLayers(map);

      if (routeMarkersRef.current.start) {
        routeMarkersRef.current.start.remove();
      }
      if (routeMarkersRef.current.end) {
        routeMarkersRef.current.end.remove();
      }
      routeMarkersRef.current = { start: null, end: null };
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    const removeRouteLayer = () => {
      if (map.getLayer(DIRECTION_ROUTE_LAYER_ID)) {
        map.removeLayer(DIRECTION_ROUTE_LAYER_ID);
      }
      if (map.getSource(DIRECTION_ROUTE_SOURCE_ID)) {
        map.removeSource(DIRECTION_ROUTE_SOURCE_ID);
      }
    };

    const clearRouteVisuals = () => {
      removeRouteLayer();

      if (routeMarkersRef.current.start) {
        routeMarkersRef.current.start.remove();
        routeMarkersRef.current.start = null;
      }

      if (routeMarkersRef.current.end) {
        routeMarkersRef.current.end.remove();
        routeMarkersRef.current.end = null;
      }
    };

    const renderRoute = () => {
      const geometryCoordinates = directions?.geometry?.coordinates;

      if (!Array.isArray(geometryCoordinates) || geometryCoordinates.length < 2) {
        return;
      }

      removeRouteLayer();

      map.addSource(DIRECTION_ROUTE_SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: geometryCoordinates,
          },
        },
      });

      map.addLayer({
        id: DIRECTION_ROUTE_LAYER_ID,
        type: 'line',
        source: DIRECTION_ROUTE_SOURCE_ID,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 6,
          'line-opacity': 0.92,
        },
      });

      if (routeMarkersRef.current.start) {
        routeMarkersRef.current.start.remove();
      }

      if (routeMarkersRef.current.end) {
        routeMarkersRef.current.end.remove();
      }

      if (typeof startLocation?.lng === 'number' && typeof startLocation?.lat === 'number') {
        routeMarkersRef.current.start = new mapboxgl.Marker({ color: '#16a34a' })
          .setLngLat([startLocation.lng, startLocation.lat])
          .addTo(map);
      }

      if (typeof endLocation?.lng === 'number' && typeof endLocation?.lat === 'number') {
        routeMarkersRef.current.end = new mapboxgl.Marker({ color: '#dc2626' })
          .setLngLat([endLocation.lng, endLocation.lat])
          .addTo(map);
      }

      const bounds = geometryCoordinates.reduce(
        (acc, coord) => acc.extend(coord),
        new mapboxgl.LngLatBounds(geometryCoordinates[0], geometryCoordinates[0])
      );

      map.fitBounds(bounds, {
        padding: 72,
        duration: 800,
      });
    };

    if (!directions) {
      const shouldResetView = hadDirectionsRef.current;
      clearRouteVisuals();
      hadDirectionsRef.current = false;

      if (shouldResetView) {
        map.flyTo({
          center: [defaultLatLong.lng, defaultLatLong.lat],
          zoom: defaultZoom,
          pitch: map.getPitch(),
          bearing: map.getBearing(),
          essential: true,
        });
      }

      return;
    }

    const drawWhenReady = () => {
      renderRoute();
      hadDirectionsRef.current = true;
    };

    if (map.isStyleLoaded()) {
      drawWhenReady();
    } else {
      map.once('style.load', drawWhenReady);
      return () => {
        map.off('style.load', drawWhenReady);
      };
    }
  }, [
    directions,
    endLocation,
    mapsReady.single,
    startLocation,
    DIRECTION_ROUTE_LAYER_ID,
    DIRECTION_ROUTE_SOURCE_ID,
  ]);

  return (
    <div className="relative size-full">
      <div ref={mapContainer} className="relative size-full">
        <div ref={splitMapContainerRef} className="absolute inset-0 size-full" />
        <div ref={singleMapContainerRef} className="absolute inset-0 size-full" />
      </div>
    </div>
  );
}
