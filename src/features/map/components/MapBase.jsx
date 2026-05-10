import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { useTranslation } from 'react-i18next';
import { useSubcategoryLayerQuery } from '@/services/api/map/mapDataLayerService';
import { useMapStore } from '../store/useMapStore';
import { defaultLatLong, defaultZoom, mapDelta, pitchDefault } from '../constant/mapConstant';
import { useMapStyleStore } from '../store/useMapStyleStore';
import ResetControl from './control/ToolResetControl';
import ToolBaseMap from './control/ToolBaseMap';
import ToolLocateControl from './control/ToolLocateControl';
import ToolViewModeControl from './control/ToolViewModeControl';
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

mapboxgl.accessToken = env.mapboxToken;

const SUBCATEGORY_LAYER_SUFFIXES = ['fill', 'line', 'point', 'cluster', 'cluster-count'];

export default function MapBaseArea() {
  const DIRECTION_ROUTE_SOURCE_ID = 'direction-route-source';
  const DIRECTION_ROUTE_LAYER_ID = 'direction-route-layer';

  const { t } = useTranslation();
  const mapContainer = useRef(null);
  const singleMapContainerRef = useRef(null);
  const splitMapContainerRef = useRef(null);
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
  const directions = useDirectionsStore((state) => state.directions);
  const startLocation = useDirectionsStore((state) => state.startLocation);
  const endLocation = useDirectionsStore((state) => state.endLocation);

  const isTrafficEnabled = useTrafficStore((state) => state.isTrafficEnabled);
  const showFlow = useTrafficStore((state) => state.showFlow);
  const showIncidents = useTrafficStore((state) => state.showIncidents);
  const incidentGeoJSON = useTrafficStore((state) => state.incidentGeoJSON);

  const routeMarkersRef = useRef({ start: null, end: null });
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
  const featureCollectionBySourceId = useRef(new Map());

  const { data: wsCapacityData } = useCapacityWebSocket();

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
    }

    prevRenderedSourceIdsRef.current.forEach((sourceId) => {
      if (!currentSourceIds.has(sourceId)) {
        removeSubcategoryLayer(map, sourceId);
        featureCollectionBySourceId.current.delete(sourceId);
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
          clearHighlightedRouteLayers(map);
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
    if (!wsCapacityData?.spot_id) return;
    const map = mapRef.current.single;
    if (!map || !mapsReady.single) return;

    const spotId = String(wsCapacityData.spot_id);

    featureCollectionBySourceId.current.forEach((fc, sourceId) => {
      const hasSpot = fc.features.some(
        (f) => String(f.properties?.spot_id ?? f.properties?.id ?? f.id ?? '') === spotId
      );
      if (!hasSpot) return;

      const source = map.getSource(sourceId);
      if (!source || typeof source.setData !== 'function') return;

      const updated = applyCapacityUpdateToCollection(fc, wsCapacityData);
      featureCollectionBySourceId.current.set(sourceId, updated);
      source.setData(updated);
    });
  }, [wsCapacityData, mapsReady.single]);

  useEffect(() => {
    return () => {
      const map = mapRef.current.single;
      if (!map) return;

      prevRenderedSourceIdsRef.current.forEach((sourceId) => {
        removeSubcategoryLayer(map, sourceId);
      });
      prevRenderedSourceIdsRef.current.clear();
      featureCollectionBySourceId.current.clear();
      clearHighlightedRouteLayers(map);
      removeTrafficFlowLayer(map);
      removeTrafficIncidentLayer(map);

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
      popup.setLngLat(coords).setHTML(buildIncidentPopupHTML(feature.properties, currentLang)).addTo(map);
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
        <div ref={splitMapContainerRef} className="absolute inset-0 size-full" />
        <div ref={singleMapContainerRef} className="absolute inset-0 size-full" />
      </div>
    </div>
  );
}
