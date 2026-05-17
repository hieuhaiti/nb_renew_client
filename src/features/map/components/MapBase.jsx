import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxCompare from 'mapbox-gl-compare';
import { useTranslation } from 'react-i18next';
import { useSubcategoryLayerQuery } from '@/services/api/map/mapDataLayerService';
import { useMapStore } from '../store/useMapStore';
import { defaultLatLong, defaultZoom, mapDelta, pitchDefault } from '../constant/mapConstant';
import { useMapStyleStore } from '../store/useMapStyleStore';
import { getMapColorById } from '../constant/mapColor';
import ResetControl from './control/ToolResetControl';
import ToolBaseMap from './control/ToolBaseMap';
import ToolLocateControl from './control/ToolLocateControl';
import ToolViewModeControl from './control/ToolViewModeControl.jsx';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import { useDataLayerStore } from '@/features/map/store/useDataLayerStore';
import {
  addOrUpdateSubcategoryLayer,
  addOrUpdateHighlightedRouteLayers,
  applyCapacityUpdateToCollection,
  addTrafficFlowLayer,
  buildIncidentPopupHTML,
  clearHighlightedRouteLayers,
  TRAFFIC_INCIDENTS_LAYER,
  mapFeatureToDestination,
  normalizePointsToFeatureCollection,
  removeTrafficFlowLayer,
  removeTrafficIncidentLayer,
  removeSubcategoryLayer,
  updateTrafficIncidentData,
} from '@/features/map/utils/MapHelper';
import {
  buildHighlightRoutePointsFeatureCollection,
  createRouteFromPoints,
} from '@/features/map/utils/highlightRouteUtils';
import { env } from '@/config/env';
import { withBaseUrl } from '@/lib/utils';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { useSpotDetailModalStore } from '@/features/map/store/useModalStore';
import { useTrafficStore } from '@/features/map/store/useTrafficStore';
import { useCapacityWebSocket } from '@/services/api/capacity/capacityService';
import { SatelliteMapOverlayControls } from '@/features/satellite';

mapboxgl.accessToken = env.mapboxToken;
const MapboxCompareCtor = MapboxCompare?.default ?? MapboxCompare;
if (typeof mapboxgl.Compare !== 'function' && typeof MapboxCompareCtor === 'function') {
  mapboxgl.Compare = MapboxCompareCtor;
}

const SUBCATEGORY_LAYER_SUFFIXES = ['fill', 'line', 'point', 'cluster', 'cluster-count'];
const COMPARE_TEARDOWN_DELAY_MS = 300;

export default function MapBaseArea() {
  const DIRECTION_ROUTE_SOURCE_ID = 'direction-route-source';
  const DIRECTION_ROUTE_LAYER_ID = 'direction-route-layer';

  const { t } = useTranslation();
  const mapContainer = useRef(null);
  const singleMapContainerRef = useRef(null);
  const splitMapContainerRef = useRef(null);
  const compareRef = useRef(null);
  const compareInitTimerRef = useRef(null);
  const compareTeardownTimerRef = useRef(null);
  const { setMapRef } = useMapStore();

  const mapRef = useRef({
    single: null,
    split: null,
    compare: null,
  });

  const mapStyle = useMapStyleStore((s) => s.mapStyle);
  const [mapsReady, setMapsReady] = useState({ single: false, split: false });

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
  const isSplitMode = useMapStore((state) => state.isSplitMode);
  const directions = useDirectionsStore((state) => state.directions);
  const startLocation = useDirectionsStore((state) => state.startLocation);
  const endLocation = useDirectionsStore((state) => state.endLocation);
  const hoveredStepPoint = useDirectionsStore((state) => state.hoveredStepPoint);

  const isTrafficEnabled = useTrafficStore((state) => state.isTrafficEnabled);
  const showFlow = useTrafficStore((state) => state.showFlow);
  const showIncidents = useTrafficStore((state) => state.showIncidents);
  const incidentGeoJSON = useTrafficStore((state) => state.incidentGeoJSON);

  const routeMarkersRef = useRef({ start: null, end: null });
  const hadDirectionsRef = useRef(false);
  const stepHoverMarkerRef = useRef(null);

  const selectedSubcategoryIdsSafe = useMemo(
    () => (Array.isArray(selectedSubcategoryIds) ? selectedSubcategoryIds.filter(Boolean) : []),
    [selectedSubcategoryIds]
  );

  const colorBySubcategoryId = useMemo(() => {
    const map = new Map();

    subcategories.forEach((item) => {
      if (item?.id == null) return;
      const parentId = item?.parent_id;
      const color = getMapColorById(parentId) || '#3b82f6';
      map.set(String(item.id), color);
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
  const featureCollectionBySourceId = useRef(new Map());

  const { data: wsCapacityData } = useCapacityWebSocket();
  const getMaps = () => [mapRef.current.single, mapRef.current.split].filter(Boolean);
  const getStyleReadyMaps = () => getMaps().filter((map) => map.isStyleLoaded());

  const setSubcategoryLayersVisibility = (map, isVisible) => {
    if (!map || !map.isStyleLoaded()) return;

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

  useEffect(() => {
    if (mapRef.current.single || !singleMapContainerRef.current) return;

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

    mapRef.current.split.getContainer().style.display = 'none';

    const map = mapRef.current.single;

    const handleSingleLoad = () => {
      setMapRef(map);
      useMapStore.getState().setMapRefObj(mapRef);

      const center = map.getCenter();
      const mapBounds = [
        [center.lng - mapDelta, center.lat - mapDelta],
        [center.lng + mapDelta, center.lat + mapDelta],
      ];
      map.setMaxBounds(mapBounds);

      map.addControl(new ToolViewModeControl(), 'right');
      map.addControl(new ToolBaseMap(), 'right');
      map.addControl(new ResetControl(), 'right');
      const locateControl = new ToolLocateControl();
      map.addControl(locateControl, 'right');
      useMapStore.getState().setLocateControl(locateControl);
      map.addControl(new mapboxgl.FullscreenControl(), 'right');
      map.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }),
        'right'
      );

      setMapsReady((prev) => ({ ...prev, single: true }));
    };

    const handleSplitLoad = () => {
      setMapsReady((prev) => ({ ...prev, split: true }));
    };

    map.on('load', handleSingleLoad);
    mapRef.current.split.on('load', handleSplitLoad);

    const handleMove = () => {
      // mapbox-gl-compare already syncs both maps; avoid double jumpTo on every move.
      if (mapRef.current.compare) return;

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
      setMapState({ lat: center.lat, lng: center.lng, zoom: map.getZoom() });
      handleMove();
    };

    map.on('move', handleMove);
    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('move', handleMove);
      map.off('moveend', handleMoveEnd);

      if (compareInitTimerRef.current) {
        window.clearTimeout(compareInitTimerRef.current);
        compareInitTimerRef.current = null;
      }
      if (compareTeardownTimerRef.current) {
        window.clearTimeout(compareTeardownTimerRef.current);
        compareTeardownTimerRef.current = null;
      }

      if (mapRef.current.single) {
        mapRef.current.single.remove();
        mapRef.current.single = null;
      }
      if (compareRef.current) {
        compareRef.current.remove();
        compareRef.current = null;
      }
      if (mapRef.current.split) {
        mapRef.current.split.remove();
        mapRef.current.split = null;
      }
      mapRef.current.compare = null;
      setMapRef(null);
      setMapsReady({ single: false, split: false });
    };
  }, []);

  useEffect(() => {
    if (!mapsReady.single || !mapsReady.split) return;

    const { single, split } = mapRef.current;
    if (!single || !split) return;

    // debug log removed

    if (isSplitMode) {
      if (compareTeardownTimerRef.current) {
        window.clearTimeout(compareTeardownTimerRef.current);
        compareTeardownTimerRef.current = null;
      }

      // Show split map
      split.getContainer().style.display = 'block';

      // Wait a bit for DOM to update, then resize
      if (compareInitTimerRef.current) {
        window.clearTimeout(compareInitTimerRef.current);
      }

      compareInitTimerRef.current = window.setTimeout(() => {
        const singleContainer = single.getContainer();
        const splitContainer = split.getContainer();
        const compareNodeBeforeInit = mapContainer.current?.querySelector('.mapboxgl-compare');
        // debug log removed

        split.resize();

        // Sync camera with single map
        const camera = {
          center: single.getCenter(),
          zoom: single.getZoom(),
          pitch: single.getPitch(),
          bearing: single.getBearing(),
        };
        split.jumpTo(camera);

        // Create Compare slider if not exists
        if (!mapRef.current.compare && mapContainer.current) {
          try {
            const CompareClass =
              typeof mapboxgl?.Compare === 'function' ? mapboxgl.Compare : MapboxCompareCtor;

            if (typeof CompareClass !== 'function') {
              throw new Error('mapbox-gl-compare constructor is not available');
            }

            mapRef.current.compare = new CompareClass(single, split, mapContainer.current, {
              orientation: 'vertical',
            });
            compareRef.current = mapRef.current.compare;
            // debug log removed
          } catch (error) {
            console.error('[MapBase] Failed to initialize map compare:', error);
          }
        }
      }, 100);
    } else {
      if (compareInitTimerRef.current) {
        window.clearTimeout(compareInitTimerRef.current);
        compareInitTimerRef.current = null;
      }
      if (compareTeardownTimerRef.current) {
        window.clearTimeout(compareTeardownTimerRef.current);
      }

      // Delay teardown to absorb transient true->false->true split mode flips.
      compareTeardownTimerRef.current = window.setTimeout(() => {
        const stillSplitOff = !useMapStore.getState().isSplitMode;
        if (!stillSplitOff) return;

        split.getContainer().style.display = 'none';

        if (mapRef.current.compare) {
          try {
            mapRef.current.compare.remove();
          } catch (error) {
            console.error('[MapBase] Failed to remove map compare:', error);
          }
          mapRef.current.compare = null;
          compareRef.current = null;
        }
      }, COMPARE_TEARDOWN_DELAY_MS);
    }

    return () => {
      if (compareInitTimerRef.current) {
        window.clearTimeout(compareInitTimerRef.current);
        compareInitTimerRef.current = null;
      }
      if (compareTeardownTimerRef.current) {
        window.clearTimeout(compareTeardownTimerRef.current);
        compareTeardownTimerRef.current = null;
      }
    };
  }, [isSplitMode, mapsReady.single, mapsReady.split]);

  useEffect(() => {
    if (!isSplitMode || !mapContainer.current) return;

    const debugTimer = window.setTimeout(() => {
      const compareDom = mapContainer.current?.querySelector('.mapboxgl-compare');
      const swiperDom =
        mapContainer.current?.querySelector('.compare-swiper-vertical') ||
        mapContainer.current?.querySelector('.compare-swiper-horizontal');
      const splitDisplay = mapRef.current.split?.getContainer()?.style?.display;
      const swiperRect = swiperDom?.getBoundingClientRect?.();
      const sampleX = swiperRect ? Math.round(swiperRect.left + swiperRect.width / 2) : null;
      const sampleY = swiperRect ? Math.round(swiperRect.top + swiperRect.height / 2) : null;
      const topElementAtSwiper =
        sampleX != null && sampleY != null ? document.elementFromPoint(sampleX, sampleY) : null;
      const swiperStyle = swiperDom ? window.getComputedStyle(swiperDom) : null;

      // debug log removed
    }, 260);

    return () => window.clearTimeout(debugTimer);
  }, [isSplitMode, mapsReady.single, mapsReady.split]);

  useEffect(() => {
    if (!mapsReady.single) return;
    const maps = getMaps();

    const currentSourceIds = new Set();
    const query = subcategoryLayerQueries[0];
    const data = query?.data;

    if (data) {
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
        maps.forEach((map) => {
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
        });
        featureCollectionBySourceId.current.set(sourceId, featureCollection);
        currentSourceIds.add(sourceId);
      });
    }

    prevRenderedSourceIdsRef.current.forEach((sourceId) => {
      if (!currentSourceIds.has(sourceId)) {
        maps.forEach((map) => removeSubcategoryLayer(map, sourceId));
        featureCollectionBySourceId.current.delete(sourceId);
      }
    });

    prevRenderedSourceIdsRef.current = currentSourceIds;
  }, [
    colorBySubcategoryId,
    highlightedRoute,
    iconBySubcategoryId,
    mapsReady.single,
    mapsReady.split,
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
        console.warn('[MapBase drawHighlightedRoute] points.length < 2 → clearing layers');
        clearHighlightedRouteLayers(map);
        return;
      }

      try {
        const hasPrecomputedGeometry = Boolean(highlightedRoute?.geometry?.coordinates?.length);

        const routeResult = hasPrecomputedGeometry
          ? {
              geometry: highlightedRoute.geometry,
              properties: highlightedRoute.routeProperties || {},
              fullRoute: highlightedRoute.fullRoute || null,
              points,
            }
          : await createRouteFromPoints(
              points,
              highlightedRoute?.vehicle || 'driving',
              lang === 'en' ? 'en' : 'vi'
            );

        if (didCancel) return;

        if (!routeResult?.geometry?.coordinates?.length) {
          console.warn('[MapBase drawHighlightedRoute] no geometry → clearing layers');
          clearHighlightedRouteLayers(map);
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

        clearHighlightedRouteLayers(map);
        addOrUpdateHighlightedRouteLayers(map, {
          routeFeature,
          routePointsFeatureCollection: routePoints,
          onPointClick: (feature) => {
            const destination = mapFeatureToDestination(feature);
            if (!destination) return;
            setHighlightedPoint(destination);
            if (destination.id) {
              openSpotModal(destination.id, destination.slug ?? null);
            }
          },
        });

        const coordinates = routeResult.geometry.coordinates;
        const bounds = coordinates.reduce(
          (acc, coord) => acc.extend(coord),
          new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );

        // debug log removed
        map.fitBounds(bounds, {
          padding: 88,
          duration: 850,
        });
        // debug log removed
      } catch (error) {
        if (!didCancel) {
          console.error('[MapBase drawHighlightedRoute] error:', error);
          clearHighlightedRouteLayers(map);
        }
      }
    };

    const isStyleReady = map.isStyleLoaded();
    // debug log removed

    // Khi mapsReady.single = true, 'load' event đã fire → 'style.load' đã fire trước đó.
    // isStyleLoaded() có thể false vì tiles vẫn đang load, nhưng addSource/addLayer vẫn hoạt động.
    // Luôn gọi ngay thay vì đợi style.load (vì style.load đã qua, sẽ không fire lại).
    drawHighlightedRoute();

    // Đăng ký lại cho khi style bị thay đổi sau này (ví dụ: setStyle).
    map.on('style.load', drawHighlightedRoute);

    return () => {
      didCancel = true;
      map.off('style.load', drawHighlightedRoute);
    };
  }, [highlightedRouteAt, highlightedRoute, lang, mapsReady.single]);

  useEffect(() => {
    if (!mapsReady.single) return;
    const maps = getMaps();
    if (maps.length === 0) return;

    const routeInteractiveLayerIds = [
      'highlight-route-points-bg',
      'highlight-route-points-shadow',
      'highlight-route-points-inner',
      'highlight-route-points-label',
      'highlight-route-points-name',
    ];

    const getInteractiveLayerIds = (map) => {
      if (!map.isStyleLoaded()) return [];
      const sourceIds = Array.from(prevRenderedSourceIdsRef.current);

      const subcategoryPointLayerIds = sourceIds
        .map((sourceId) => `${sourceId}-point`)
        .filter((layerId) => Boolean(map.getLayer(layerId)));

      const routePointLayerIds = routeInteractiveLayerIds.filter((layerId) =>
        Boolean(map.getLayer(layerId))
      );

      return [...subcategoryPointLayerIds, ...routePointLayerIds];
    };

    const clearCursor = (map) => {
      const canvas = map?.getCanvas?.();
      if (!canvas?.style) return;
      canvas.style.cursor = '';
    };

    const handlers = maps.map((map) => {
      const handleMapClick = (event) => {
        const layerIds = getInteractiveLayerIds(map);
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
        const layerIds = getInteractiveLayerIds(map);
        const canvas = map?.getCanvas?.();
        if (!canvas?.style) return;

        if (layerIds.length === 0) {
          canvas.style.cursor = '';
          return;
        }

        const features = map.queryRenderedFeatures(event.point, { layers: layerIds });
        canvas.style.cursor = features.length > 0 ? 'pointer' : '';
      };

      const clearMapCursor = () => clearCursor(map);

      map.on('click', handleMapClick);
      map.on('mousemove', handleMouseMove);
      map.on('mouseout', clearMapCursor);

      return { map, handleMapClick, handleMouseMove, clearMapCursor };
    });

    return () => {
      handlers.forEach(({ map, handleMapClick, handleMouseMove, clearMapCursor }) => {
        map.off('click', handleMapClick);
        map.off('mousemove', handleMouseMove);
        map.off('mouseout', clearMapCursor);
        clearCursor(map);
      });
    };
  }, [mapsReady.single, mapsReady.split, setHighlightedPoint, openSpotModal]);

  useEffect(() => {
    if (!mapsReady.single) return;
    const maps = getStyleReadyMaps();
    if (maps.length === 0) return;

    const shouldShowSubcategoryLayers = !(showOnlyHighlightedRoute && highlightedRoute);
    maps.forEach((map) => setSubcategoryLayersVisibility(map, shouldShowSubcategoryLayers));
  }, [highlightedRoute, mapsReady.single, mapsReady.split, showOnlyHighlightedRoute]);

  useEffect(() => {
    const maps = getMaps();
    if (maps.length === 0) return;

    const createStyleLoadHandler = (map) => () => {
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
        featureCollectionBySourceId.current.set(sourceId, featureCollection);

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

    const subscriptions = maps.map((map) => {
      const handleStyleLoad = createStyleLoadHandler(map);
      map.on('style.load', handleStyleLoad);
      return { map, handleStyleLoad };
    });

    return () => {
      subscriptions.forEach(({ map, handleStyleLoad }) => {
        map.off('style.load', handleStyleLoad);
      });
    };
  }, [
    colorBySubcategoryId,
    highlightedRoute,
    iconBySubcategoryId,
    mapsReady.single,
    mapsReady.split,
    selectedSubcategoryIdsSafe,
    showOnlyHighlightedRoute,
    subcategoryLayerQueries[0]?.dataUpdatedAt,
  ]);

  useEffect(() => {
    if (!wsCapacityData?.spot_id) return;
    if (!mapsReady.single) return;
    const maps = getStyleReadyMaps();
    if (maps.length === 0) return;

    const spotId = String(wsCapacityData.spot_id);

    featureCollectionBySourceId.current.forEach((fc, sourceId) => {
      const hasSpot = fc.features.some(
        (f) => String(f.properties?.spot_id ?? f.properties?.id ?? f.id ?? '') === spotId
      );
      if (!hasSpot) return;

      const updated = applyCapacityUpdateToCollection(fc, wsCapacityData);
      featureCollectionBySourceId.current.set(sourceId, updated);

      maps.forEach((map) => {
        const source = map.getSource(sourceId);
        if (!source || typeof source.setData !== 'function') return;
        source.setData(updated);
      });
    });
  }, [wsCapacityData, mapsReady.single, mapsReady.split]);

  useEffect(() => {
    return () => {
      const maps = getMaps();
      if (maps.length === 0) return;

      prevRenderedSourceIdsRef.current.forEach((sourceId) => {
        maps.forEach((map) => removeSubcategoryLayer(map, sourceId));
      });
      prevRenderedSourceIdsRef.current.clear();
      featureCollectionBySourceId.current.clear();
      maps.forEach((map) => {
        clearHighlightedRouteLayers(map);
        removeTrafficFlowLayer(map);
        removeTrafficIncidentLayer(map);
      });

      if (routeMarkersRef.current.start) routeMarkersRef.current.start.remove();
      if (routeMarkersRef.current.end) routeMarkersRef.current.end.remove();
      routeMarkersRef.current = { start: null, end: null };
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    const removeRouteLayer = () => {
      if (map.getLayer(DIRECTION_ROUTE_LAYER_ID)) map.removeLayer(DIRECTION_ROUTE_LAYER_ID);
      if (map.getSource(DIRECTION_ROUTE_SOURCE_ID)) map.removeSource(DIRECTION_ROUTE_SOURCE_ID);
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
      if (!Array.isArray(geometryCoordinates) || geometryCoordinates.length < 2) return;

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

      if (routeMarkersRef.current.start) routeMarkersRef.current.start.remove();
      if (routeMarkersRef.current.end) routeMarkersRef.current.end.remove();

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

  useEffect(() => {
    const map = mapRef.current.single;

    if (stepHoverMarkerRef.current) {
      stepHoverMarkerRef.current.remove();
      stepHoverMarkerRef.current = null;
    }

    if (!map || !mapsReady.single || !hoveredStepPoint) return;

    const el = document.createElement('div');
    Object.assign(el.style, {
      width: '14px',
      height: '14px',
      background: '#2563eb',
      border: '2px solid white',
      borderRadius: '50%',
      boxShadow: '0 0 0 2px #2563eb',
      pointerEvents: 'none',
    });

    stepHoverMarkerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat([hoveredStepPoint.lng, hoveredStepPoint.lat])
      .addTo(map);

    return () => {
      if (stepHoverMarkerRef.current) {
        stepHoverMarkerRef.current.remove();
        stepHoverMarkerRef.current = null;
      }
    };
  }, [hoveredStepPoint, mapsReady.single]);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    const handleStyleLoad = () => {
      const s = useTrafficStore.getState();
      if (!s.isTrafficEnabled) return;
      if (s.showFlow) addTrafficFlowLayer(map);
      else removeTrafficFlowLayer(map);
      if (s.showIncidents) updateTrafficIncidentData(map, s.incidentGeoJSON);
      else removeTrafficIncidentLayer(map);
    };

    map.on('style.load', handleStyleLoad);
    return () => map.off('style.load', handleStyleLoad);
  }, [mapsReady.single]);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    if (isTrafficEnabled && showFlow) addTrafficFlowLayer(map);
    else removeTrafficFlowLayer(map);
  }, [isTrafficEnabled, showFlow, mapsReady.single]);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    if (isTrafficEnabled && showIncidents) updateTrafficIncidentData(map, incidentGeoJSON);
    else removeTrafficIncidentLayer(map);
  }, [isTrafficEnabled, showIncidents, incidentGeoJSON, mapsReady.single]);

  useEffect(() => {
    const map = mapRef.current.single;
    if (!map || !mapsReady.single || !isTrafficEnabled || !showIncidents) return;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      maxWidth: '280px',
      className: 'traffic-incident-popup',
    });

    const onEnter = (e) => {
      if (!e.features?.length) return;
      const feature = e.features[0];
      const coords = feature.geometry.coordinates.slice();
      map.getCanvas().style.cursor = 'pointer';
      const currentLang = useLanguageStore.getState().lang;
      popup
        .setLngLat(coords)
        .setHTML(buildIncidentPopupHTML(feature.properties, currentLang))
        .addTo(map);
    };

    const onLeave = () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    };

    map.on('mouseenter', TRAFFIC_INCIDENTS_LAYER, onEnter);
    map.on('mouseleave', TRAFFIC_INCIDENTS_LAYER, onLeave);

    return () => {
      map.off('mouseenter', TRAFFIC_INCIDENTS_LAYER, onEnter);
      map.off('mouseleave', TRAFFIC_INCIDENTS_LAYER, onLeave);
      popup.remove();
      if (map.getCanvas()) map.getCanvas().style.cursor = '';
    };
  }, [isTrafficEnabled, showIncidents, mapsReady.single]);

  return (
    <div className="relative size-full">
      <div ref={mapContainer} className="relative size-full">
        <div
          ref={splitMapContainerRef}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <div
          ref={singleMapContainerRef}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
      </div>
      <SatelliteMapOverlayControls />
    </div>
  );
}
