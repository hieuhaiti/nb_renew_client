import mapboxgl from 'mapbox-gl';
import { circle as turfCircle } from '@turf/turf';

export {
  addTrafficFlowLayer,
  buildIncidentPopupHTML,
  INCIDENTS_LAYER as TRAFFIC_INCIDENTS_LAYER,
  removeTrafficFlowLayer,
  removeTrafficIncidentLayer,
  updateTrafficIncidentData,
} from '@/features/map/utils/trafficLayerUtils';

const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

const SOURCE_CLUSTER_MAX_ZOOM = 14;
const SOURCE_CLUSTER_RADIUS = 50;

const GEOMETRY_TYPES = {
  POINT: ['Point', 'MultiPoint'],
  POLYGON: ['Polygon', 'MultiPolygon'],
  LINE: ['LineString', 'MultiLineString'],
};

const SVG_DEFAULT_VIEWBOX = '0 0 24 24';
const DEFAULT_MARKER_COLOR = '#3b82f6';

const MARKER_SIZE = 48;
const MARKER_RADIUS = 20;
const MARKER_STROKE_WIDTH = 4;
const MARKER_ICON_SIZE = 24;
const DEFAULT_MARKER_DOT_RADIUS = 6;
const HIGHLIGHT_MARKER_CLASS = 'map-highlight-point-marker';
const HIGHLIGHT_MARKER_RING_CLASS = 'map-highlight-point-ring';
const HIGHLIGHT_MARKER_STYLE_ID = 'map-highlight-point-style';

const CAPACITY_STATUS_PROPERTY = 'capacity_status';
const CAPACITY_ARROW_WIDTH = 16;
const CAPACITY_ARROW_HEIGHT = 10;
const CAPACITY_ARROW_GAP = 3;
const CAPACITY_ARROW_TOP_PAD = CAPACITY_ARROW_HEIGHT + CAPACITY_ARROW_GAP;
const CAPACITY_TOTAL_HEIGHT = CAPACITY_ARROW_TOP_PAD + MARKER_SIZE;
const HIGHLIGHT_POINT_Y_OFFSET_PX = -26;

const CAPACITY_STATUS_ARROW_COLOR = {
  overloaded: '#ef4444',
  near_full: '#f97316',
  busy: '#f59e0b',
};

const ALL_CAPACITY_STATUSES = ['overloaded', 'near_full', 'busy', 'normal'];

const FILL_OPACITY = 0.18;
const LINE_WIDTH = 2;
const LINE_OPACITY = 0.9;
const CLUSTER_STROKE_COLOR = '#ffffff';
const CLUSTER_STROKE_WIDTH = 2;
const CLUSTER_OPACITY = 0.9;
const CLUSTER_RADIUS_STEPS = ['step', ['get', 'point_count'], 16, 10, 20, 50, 24, 100, 28];

const MAP_LABEL_FONT = ['Open Sans Semibold', 'Arial Unicode MS Bold'];
const CLUSTER_COUNT_TEXT_SIZE = 12;
const CLUSTER_COUNT_TEXT_COLOR = '#111827';
const CLUSTER_COUNT_TEXT_HALO_COLOR = '#ffffff';
const CLUSTER_COUNT_TEXT_HALO_WIDTH = 1.5;

const POINT_ICON_OPACITY = 0.95;
const POINT_ICON_SIZE_BY_ZOOM = ['interpolate', ['linear'], ['zoom'], 8, 0.9, 12, 1, 16, 1.12];
const POINT_TEXT_SIZE = 13;
const POINT_TEXT_OFFSET = [0, 0.5];
const POINT_TEXT_PADDING = 2;
const POINT_TEXT_COLOR = 'black';
const POINT_TEXT_HALO_COLOR = 'white';
const POINT_TEXT_HALO_WIDTH = 2;
const POINT_TEXT_OPACITY = 1;

export const HIGHLIGHT_ROUTE_SOURCE_ID = 'highlight-route';
export const HIGHLIGHT_ROUTE_POINTS_SOURCE_ID = 'highlight-route-points';
export const HIGHLIGHT_ROUTE_LAYER_IDS = [
  // Current route layer ids
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
  // Legacy/alternate route layer ids for robust cleanup
  'route-line-shadow',
  'route-line',
  'route-points',
  'route-labels',
  'route-arrow',
];
const routePinMarkersByMap = new WeakMap();
const highlightPointMarkerByMap = new WeakMap();
const highlightInteractionCleanupByMap = new WeakMap();

function isObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function withCapacityProgressProperties(properties) {
  return { ...properties };
}

function buildPointGeometryFromCoordinates(input) {
  const lng = Number(input?.longitude ?? input?.lng);
  const lat = Number(input?.latitude ?? input?.lat);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;

  return {
    type: 'Point',
    coordinates: [lng, lat],
  };
}

function toFeature(input, fallbackId) {
  if (!isObject(input)) return null;

  if (input.type === 'Feature' && isObject(input.geometry)) {
    const properties = withCapacityProgressProperties(
      isObject(input.properties) ? input.properties : {}
    );
    return {
      type: 'Feature',
      id: input.id ?? fallbackId,
      geometry: input.geometry,
      properties,
    };
  }

  const geometry =
    input.geometry_data ||
    input.geometry ||
    input.geojson ||
    buildPointGeometryFromCoordinates(input);
  if (!isObject(geometry) || !geometry.type) return null;

  const topLevelProps = { ...input };
  delete topLevelProps.geometry;
  delete topLevelProps.geometry_data;
  delete topLevelProps.geojson;
  delete topLevelProps.properties;
  const rawProperties = {
    ...topLevelProps,
    ...(isObject(input.properties) ? input.properties : {}),
  };

  const mergedProperties = {
    ...rawProperties,
    id: input.id ?? rawProperties.id,
    slug: input.slug ?? rawProperties.slug,
    name: toDisplayText(rawProperties.name),
    description: toDisplayText(rawProperties.description),
    address: toDisplayText(rawProperties.address),
    category_id: rawProperties.category_id,
    subcategory_id: rawProperties.subcategory_id,
  };
  const normalizedProperties = withCapacityProgressProperties(mergedProperties);

  return {
    type: 'Feature',
    id: input.id ?? fallbackId,
    geometry,
    properties: normalizedProperties,
  };
}

export function normalizePointsToFeatureCollection(payload) {
  const directGeojson = payload?.data?.geojson || payload?.geojson;
  if (directGeojson?.type === 'FeatureCollection' && Array.isArray(directGeojson.features)) {
    return {
      ...directGeojson,
      features: directGeojson.features
        .map((feature, index) => toFeature(feature, `${feature?.id ?? index}`))
        .filter(Boolean),
    };
  }

  const candidateArrays = [
    payload?.data?.spots,
    payload?.spots,
    payload?.data?.points,
    payload?.points,
    payload?.data?.mapLayers,
    payload?.mapLayers,
    payload?.data?.features,
    payload?.features,
  ];

  const sourceArray = candidateArrays.find((items) => Array.isArray(items)) || [];
  const features = sourceArray.map((item, index) => toFeature(item, `${index}`)).filter(Boolean);

  if (features.length === 0) return EMPTY_FEATURE_COLLECTION;

  return {
    type: 'FeatureCollection',
    features,
  };
}

function ensureSource(map, sourceId, data) {
  const source = map.getSource(sourceId);
  if (source) {
    source.setData(data);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data,
    cluster: true,
    clusterMaxZoom: SOURCE_CLUSTER_MAX_ZOOM,
    clusterRadius: SOURCE_CLUSTER_RADIUS,
  });
}

function ensureLayer(map, layer) {
  if (map.getLayer(layer.id)) return;
  map.addLayer(layer);
}

function ensureGeojsonSource(map, sourceId, data) {
  const source = map.getSource(sourceId);
  if (source && typeof source.setData === 'function') {
    source.setData(data);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data,
  });
}

function normalizeSvgIcon(iconSvg) {
  const svgString = String(iconSvg || '').trim();

  const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : SVG_DEFAULT_VIEWBOX;

  let content = svgString
    .replace(/<svg[^>]*>/i, '')
    .replace(/<\/svg>/i, '')
    .trim();

  return { viewBox, content };
}

function createCategorySvg(iconSvg, color, capacityStatus = null) {
  const markerColor = color || DEFAULT_MARKER_COLOR;
  const arrowColor = CAPACITY_STATUS_ARROW_COLOR[capacityStatus] ?? null;
  const { viewBox, content } = normalizeSvgIcon(iconSvg);
  const canvasWidth = MARKER_SIZE;
  const markerCenterX = canvasWidth / 2;
  const markerCenterY = CAPACITY_ARROW_TOP_PAD + MARKER_SIZE / 2;
  const iconX = markerCenterX - MARKER_ICON_SIZE / 2;
  const iconY = CAPACITY_ARROW_TOP_PAD + (MARKER_SIZE - MARKER_ICON_SIZE) / 2;
  const arrowPoints = `${markerCenterX - CAPACITY_ARROW_WIDTH / 2},0 ${markerCenterX + CAPACITY_ARROW_WIDTH / 2},0 ${markerCenterX},${CAPACITY_ARROW_HEIGHT}`;

  return `
    <svg width="${canvasWidth}" height="${CAPACITY_TOTAL_HEIGHT}" viewBox="0 0 ${canvasWidth} ${CAPACITY_TOTAL_HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      ${arrowColor ? `<polygon points="${arrowPoints}" fill="${arrowColor}" />` : ''}
      <circle cx="${markerCenterX}" cy="${markerCenterY}" r="${MARKER_RADIUS}" fill="white" stroke="${markerColor}" stroke-width="${MARKER_STROKE_WIDTH}" />
      <svg x="${iconX}" y="${iconY}" width="${MARKER_ICON_SIZE}" height="${MARKER_ICON_SIZE}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">
        ${content}
      </svg>
    </svg>
  `;
}

function createDefaultCategorySvg(color, capacityStatus = null) {
  const markerColor = color || DEFAULT_MARKER_COLOR;
  const arrowColor = CAPACITY_STATUS_ARROW_COLOR[capacityStatus] ?? null;
  const canvasWidth = MARKER_SIZE;
  const markerCenterX = canvasWidth / 2;
  const markerCenterY = CAPACITY_ARROW_TOP_PAD + MARKER_SIZE / 2;
  const arrowPoints = `${markerCenterX - CAPACITY_ARROW_WIDTH / 2},0 ${markerCenterX + CAPACITY_ARROW_WIDTH / 2},0 ${markerCenterX},${CAPACITY_ARROW_HEIGHT}`;

  return `
    <svg width="${canvasWidth}" height="${CAPACITY_TOTAL_HEIGHT}" viewBox="0 0 ${canvasWidth} ${CAPACITY_TOTAL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      ${arrowColor ? `<polygon points="${arrowPoints}" fill="${arrowColor}" />` : ''}
      <circle cx="${markerCenterX}" cy="${markerCenterY}" r="${MARKER_RADIUS}" fill="white" stroke="${markerColor}" stroke-width="${MARKER_STROKE_WIDTH}" />
      <circle cx="${markerCenterX}" cy="${markerCenterY}" r="${DEFAULT_MARKER_DOT_RADIUS}" fill="${markerColor}" />
    </svg>
  `;
}

function getStatusIconImageId(baseImageId, status) {
  return `${baseImageId}-${status}`;
}

function buildStatusIconExpression(baseImageId) {
  const expression = ['match', ['get', CAPACITY_STATUS_PROPERTY]];
  Object.keys(CAPACITY_STATUS_ARROW_COLOR).forEach((status) => {
    expression.push(status, getStatusIconImageId(baseImageId, status));
  });
  expression.push(getStatusIconImageId(baseImageId, 'normal'));
  return expression;
}

function hasAllStatusIcons(map, markerImageBaseId) {
  return ALL_CAPACITY_STATUSES.every((status) =>
    map.hasImage(getStatusIconImageId(markerImageBaseId, status))
  );
}

function isSvgIconUrl(iconUrl) {
  const rawUrl = String(iconUrl || '').trim();
  if (!rawUrl) return false;

  const normalizedPath = rawUrl.split('#')[0].split('?')[0].toLowerCase();
  return rawUrl.startsWith('data:image/svg+xml') || normalizedPath.endsWith('.svg');
}

function loadSvgStringAsImage(svgString, callback) {
  if (!svgString || typeof document === 'undefined') {
    callback(null, new Error('SVG marker cannot be rendered in current environment'));
    return;
  }

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);

  const image = new Image();
  image.decoding = 'async';

  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    callback(image, null);
  };

  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    callback(null, new Error('Cannot render SVG marker image'));
  };

  image.src = objectUrl;
}

function loadStatusMarkerImages(map, markerImageBaseId, markerSvgByStatus, callback) {
  const targetStatuses = ALL_CAPACITY_STATUSES.filter(
    (status) => !map.hasImage(getStatusIconImageId(markerImageBaseId, status))
  );

  if (targetStatuses.length === 0) {
    callback(null);
    return;
  }

  let pending = targetStatuses.length;
  let firstError = null;

  targetStatuses.forEach((status) => {
    const markerSvg = markerSvgByStatus(status);
    loadSvgStringAsImage(markerSvg, (image, renderError) => {
      if (!firstError && (renderError || !image)) {
        firstError = renderError || new Error(`Cannot render marker image for status ${status}`);
      }

      if (!firstError && image) {
        const imageId = getStatusIconImageId(markerImageBaseId, status);
        if (!map.hasImage(imageId)) {
          map.addImage(imageId, image);
        }
      }

      pending -= 1;
      if (pending === 0) {
        callback(firstError);
      }
    });
  });
}

const svgFetchCache = new Map();

function fetchSvgContent(iconUrl) {
  if (svgFetchCache.has(iconUrl)) {
    return svgFetchCache.get(iconUrl);
  }

  const promise = fetch(iconUrl, { mode: 'cors', credentials: 'omit' })
    .then((response) => {
      if (!response.ok) throw new Error(`Cannot fetch icon SVG: ${response.status}`);
      return response.text();
    })
    .then((iconSvg) => {
      if (!/<svg[\s>]/i.test(iconSvg)) throw new Error('Icon content is not SVG');
      return iconSvg;
    })
    .catch((error) => {
      svgFetchCache.delete(iconUrl);
      throw error;
    });

  svgFetchCache.set(iconUrl, promise);
  return promise;
}

function loadMapIconStatusImages(map, iconUrl, color, markerImageBaseId, callback) {
  if (!iconUrl) {
    callback(new Error('Icon URL is empty'));
    return;
  }

  if (!isSvgIconUrl(iconUrl)) {
    callback(new Error(`Cannot render status marker from non-SVG icon URL: ${iconUrl}`));
    return;
  }

  fetchSvgContent(iconUrl)
    .then((iconSvg) => {
      loadStatusMarkerImages(
        map,
        markerImageBaseId,
        (status) => createCategorySvg(iconSvg, color, status),
        callback
      );
    })
    .catch((error) => callback(error));
}

function loadDefaultStatusMarkerImages(map, color, markerImageBaseId, callback) {
  loadStatusMarkerImages(
    map,
    markerImageBaseId,
    (status) => createDefaultCategorySvg(color, status),
    callback
  );
}

function toNumber(value) {
  return toFiniteNumber(value);
}

function toDisplayText(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object') return '';
  return value?.note_vi || value?.note_en || '';
}

function getPointCoordinates(geometry) {
  if (!isObject(geometry)) return null;

  if (geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
    return geometry.coordinates;
  }

  if (geometry.type === 'MultiPoint' && Array.isArray(geometry.coordinates?.[0])) {
    return geometry.coordinates[0];
  }

  return null;
}

export function mapFeatureToDestination(feature) {
  if (!isObject(feature)) return null;

  const properties = isObject(feature.properties) ? feature.properties : {};
  const geometry = feature.geometry || properties.geometry_data;
  const coordinates = getPointCoordinates(geometry);
  const lng = toNumber(coordinates?.[0]);
  const lat = toNumber(coordinates?.[1]);

  const normalizedCoordinates = lng != null && lat != null ? [lng, lat] : null;
  const resolvedId =
    properties.spot_id ?? properties.point_id ?? properties.id ?? feature.id ?? null;
  const resolvedSlug = properties.slug || properties.spot_slug || null;

  return {
    id: resolvedId,
    slug: resolvedSlug,
    name: toDisplayText(properties.name) || 'Unknown destination',
    description: toDisplayText(properties.description) || '',
    category_id: properties.category_id ?? null,
    subcategory_id: properties.subcategory_id ?? null,
    address: toDisplayText(properties.address) || '',
    opening_hours: properties.opening_hours ?? null,
    main_image_url:
      properties.primary_image ||
      properties.main_image_url ||
      properties.cover_image_url ||
      properties.main_image ||
      null,
    average_rating: properties.rating_avg ?? properties.average_rating ?? null,
    rating_count: properties.rating_count ?? properties.total_reviews ?? null,
    coordinates: normalizedCoordinates,
    source: 'map-feature',
    raw: feature,
  };
}

export function addOrUpdateSubcategoryLayer(
  map,
  { sourceId, featureCollection, color, iconUrl, iconImageId }
) {
  if (!map || !sourceId || !featureCollection) return;

  ensureSource(map, sourceId, featureCollection);

  const fillLayerId = `${sourceId}-fill`;
  const lineLayerId = `${sourceId}-line`;
  const pointLayerId = `${sourceId}-point`;
  const clusterLayerId = `${sourceId}-cluster`;
  const clusterCountLayerId = `${sourceId}-cluster-count`;
  const fallbackMarkerImageBaseId = `${sourceId}-marker`;
  const pointFilter = [
    'all',
    ['in', ['geometry-type'], ['literal', GEOMETRY_TYPES.POINT]],
    ['!', ['has', 'point_count']],
  ];

  // Clean up legacy split point layers so only one symbol layer remains.
  [`${sourceId}-circle`, `${sourceId}-icon`, `${sourceId}-label`].forEach((legacyLayerId) => {
    if (map.getLayer(legacyLayerId)) {
      map.removeLayer(legacyLayerId);
    }
  });

  ensureLayer(map, {
    id: fillLayerId,
    type: 'fill',
    source: sourceId,
    filter: ['in', ['geometry-type'], ['literal', GEOMETRY_TYPES.POLYGON]],
    paint: {
      'fill-color': color,
      'fill-opacity': FILL_OPACITY,
    },
  });

  ensureLayer(map, {
    id: lineLayerId,
    type: 'line',
    source: sourceId,
    filter: ['in', ['geometry-type'], ['literal', GEOMETRY_TYPES.LINE]],
    paint: {
      'line-color': color,
      'line-width': LINE_WIDTH,
      'line-opacity': LINE_OPACITY,
    },
  });

  ensureLayer(map, {
    id: clusterLayerId,
    type: 'circle',
    source: sourceId,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': color,
      'circle-radius': CLUSTER_RADIUS_STEPS,
      'circle-stroke-color': CLUSTER_STROKE_COLOR,
      'circle-stroke-width': CLUSTER_STROKE_WIDTH,
      'circle-opacity': CLUSTER_OPACITY,
    },
  });

  ensureLayer(map, {
    id: clusterCountLayerId,
    type: 'symbol',
    source: sourceId,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-size': CLUSTER_COUNT_TEXT_SIZE,
      'text-font': MAP_LABEL_FONT,
    },
    paint: {
      'text-color': CLUSTER_COUNT_TEXT_COLOR,
      'text-halo-color': CLUSTER_COUNT_TEXT_HALO_COLOR,
      'text-halo-width': CLUSTER_COUNT_TEXT_HALO_WIDTH,
    },
  });

  // Keep style updated when color changes.
  if (map.getLayer(fillLayerId)) {
    map.setPaintProperty(fillLayerId, 'fill-color', color);
  }
  if (map.getLayer(lineLayerId)) {
    map.setPaintProperty(lineLayerId, 'line-color', color);
  }
  if (map.getLayer(clusterLayerId)) {
    map.setPaintProperty(clusterLayerId, 'circle-color', color);
  }

  const ensurePointLayer = (markerImageBaseId) => {
    const iconImageExpression = buildStatusIconExpression(markerImageBaseId);
    const textFieldExpression = ['coalesce', ['get', 'name'], ''];

    ensureLayer(map, {
      id: pointLayerId,
      type: 'symbol',
      source: sourceId,
      filter: pointFilter,
      layout: {
        'icon-image': iconImageExpression,
        'icon-size': POINT_ICON_SIZE_BY_ZOOM,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-anchor': 'bottom',
        'text-field': textFieldExpression,
        'text-font': MAP_LABEL_FONT,
        'text-size': POINT_TEXT_SIZE,
        'text-offset': POINT_TEXT_OFFSET,
        'text-anchor': 'top',
        'text-padding': POINT_TEXT_PADDING,
      },
      paint: {
        'icon-opacity': POINT_ICON_OPACITY,
        'text-color': POINT_TEXT_COLOR,
        'text-halo-color': POINT_TEXT_HALO_COLOR,
        'text-halo-width': POINT_TEXT_HALO_WIDTH,
        'text-opacity': POINT_TEXT_OPACITY,
      },
    });

    if (map.getLayer(pointLayerId)) {
      map.setLayoutProperty(pointLayerId, 'icon-image', iconImageExpression);
      map.setLayoutProperty(pointLayerId, 'text-field', textFieldExpression);
      map.setPaintProperty(pointLayerId, 'icon-opacity', POINT_ICON_OPACITY);
      map.setPaintProperty(pointLayerId, 'text-opacity', POINT_TEXT_OPACITY);
      map.moveLayer(pointLayerId);
    }
  };

  const ensureFallbackPointLayer = () => {
    if (hasAllStatusIcons(map, fallbackMarkerImageBaseId)) {
      ensurePointLayer(fallbackMarkerImageBaseId);
      return;
    }

    loadDefaultStatusMarkerImages(map, color, fallbackMarkerImageBaseId, (loadError) => {
      if (!map.getSource(sourceId)) return;

      if (loadError) {
        console.warn('[MapHelper] Failed to render fallback marker image', {
          sourceId,
          markerImageBaseId: fallbackMarkerImageBaseId,
          error: loadError,
        });
        return;
      }

      ensurePointLayer(fallbackMarkerImageBaseId);
    });
  };

  if (iconUrl && iconImageId) {
    if (hasAllStatusIcons(map, iconImageId)) {
      ensurePointLayer(iconImageId);
    } else {
      loadMapIconStatusImages(map, iconUrl, color, iconImageId, (loadError) => {
        if (!map.getSource(sourceId)) return;

        if (loadError) {
          console.warn('[MapHelper] Failed to load subcategory icon image', {
            sourceId,
            iconUrl,
            iconImageId,
            error: loadError,
          });
          ensureFallbackPointLayer();
          return;
        }

        ensurePointLayer(iconImageId);
      });
    }
    return;
  }

  ensureFallbackPointLayer();
}

export function clearHighlightedRouteLayers(map) {
  if (!map) return;
  clearRoutePinMarkers(map);

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
}

function createPin({ color, num = null, glyph = null, onClick = null }) {
  const wrap = document.createElement('div');
  wrap.className = 'pin-wrap';
  wrap.dataset.routeMarker = 'true';
  if (onClick) {
    wrap.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
  } else {
    // Let map click events pass through to route point layers beneath the marker.
    wrap.style.pointerEvents = 'none';
  }
  const pin = document.createElement('div');
  pin.className = 'pin';
  pin.style.setProperty('--pin-color', color);

  const inner = document.createElement('div');
  inner.className = 'inner';

  if (num !== null && num !== undefined) {
    const n = document.createElement('div');
    n.className = 'num';
    n.textContent = String(num);
    inner.appendChild(n);
  } else if (glyph != null) {
    const g = document.createElement('div');
    g.className = 'glyph';
    g.textContent = String(glyph);
    inner.appendChild(g);
  }

  pin.appendChild(inner);
  wrap.appendChild(pin);
  return wrap;
}

function getRoutePointColor(properties) {
  const isStart = Boolean(properties?.is_start);
  const isEnd = Boolean(properties?.is_end);
  return isStart || isEnd ? '#DC2626' : '#FACC15';
}

function clearRoutePinMarkers(map) {
  const markers = routePinMarkersByMap.get(map);
  if (Array.isArray(markers) && markers.length > 0) {
    markers.forEach((marker) => marker.remove());
  }
  routePinMarkersByMap.delete(map);

  const container = map?.getContainer?.();
  if (!container) return;
  const markerNodes = container.querySelectorAll('.pin-wrap[data-route-marker=\"true\"]');
  markerNodes.forEach((node) => {
    const markerElement = node.closest('.mapboxgl-marker');
    if (markerElement) markerElement.remove();
  });
}

function addRoutePinMarkers(map, routePointsFeatureCollection, onPointClick = null) {
  if (!map) return;
  clearRoutePinMarkers(map);

  const features = Array.isArray(routePointsFeatureCollection?.features)
    ? routePointsFeatureCollection.features
    : [];
  if (features.length === 0) return;

  const markers = features
    .map((feature) => {
      const coordinates = feature?.geometry?.coordinates;
      if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

      const properties = isObject(feature?.properties) ? feature.properties : {};
      const element = createPin({
        color: getRoutePointColor(properties),
        num: properties.step_number ?? null,
        glyph: properties.glyph ?? null,
        onClick: onPointClick ? () => onPointClick(feature) : null,
      });

      const marker = new mapboxgl.Marker({
        element,
        anchor: 'bottom',
      })
        .setLngLat([Number(coordinates[0]), Number(coordinates[1])])
        .addTo(map);

      // The Mapbox wrapper div (.mapboxgl-marker) defaults to pointer-events:auto
      // and would swallow clicks before they reach the canvas.  Setting it to
      // none lets events fall through to the canvas so the route-point layers
      // remain clickable (same intent as the pin-wrap style in createPin).
      element.style.pointerEvents = onPointClick ? 'auto' : 'none';

      return marker;
    })
    .filter(Boolean);

  routePinMarkersByMap.set(map, markers);
}

export function addOrUpdateHighlightedRouteLayers(
  map,
  {
    routeFeature,
    routePointsFeatureCollection,
    routeSourceId = HIGHLIGHT_ROUTE_SOURCE_ID,
    routePointsSourceId = HIGHLIGHT_ROUTE_POINTS_SOURCE_ID,
    onPointClick = null,
  }
) {
  if (!map || !routeFeature || !routePointsFeatureCollection) return;

  ensureGeojsonSource(map, routeSourceId, routeFeature);
  ensureGeojsonSource(map, routePointsSourceId, routePointsFeatureCollection);
  addRoutePinMarkers(map, routePointsFeatureCollection, onPointClick);

  ensureLayer(map, {
    id: 'highlight-route-shadow',
    type: 'line',
    source: routeSourceId,
    paint: { 'line-color': 'rgba(0,0,0,0.35)', 'line-width': 12, 'line-blur': 2 },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  });

  ensureLayer(map, {
    id: 'highlight-route-outline',
    type: 'line',
    source: routeSourceId,
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

  ensureLayer(map, {
    id: 'highlight-route-main',
    type: 'line',
    source: routeSourceId,
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

  ensureLayer(map, {
    id: 'highlight-route-arrows',
    type: 'symbol',
    source: routeSourceId,
    layout: {
      'symbol-placement': 'line',
      'symbol-spacing': 64,
      'text-field': '>',
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

  ensureLayer(map, {
    id: 'highlight-route-points-shadow',
    type: 'circle',
    source: routePointsSourceId,
    paint: {
      'circle-radius': 14,
      'circle-color': '#111111',
      'circle-opacity': 0.18,
    },
  });

  ensureLayer(map, {
    id: 'highlight-route-points-bg',
    type: 'circle',
    source: routePointsSourceId,
    paint: {
      'circle-radius': 12,
      'circle-color': [
        'case',
        ['boolean', ['get', 'is_start'], false],
        '#DC2626',
        ['boolean', ['get', 'is_end'], false],
        '#DC2626',
        '#FACC15',
      ],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2.5,
    },
  });

  ensureLayer(map, {
    id: 'highlight-route-points-inner',
    type: 'circle',
    source: routePointsSourceId,
    paint: {
      'circle-radius': 0,
      'circle-color': '#ffffff',
      'circle-opacity': 0,
    },
  });

  ensureLayer(map, {
    id: 'highlight-route-points-label',
    type: 'symbol',
    source: routePointsSourceId,
    layout: {
      'text-field': ['to-string', ['get', 'step_number']],
      'text-size': 10,
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    },
    paint: {
      'text-color': '#111827',
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.2,
      'text-opacity': 0,
    },
  });

  ensureLayer(map, {
    id: 'highlight-route-points-name',
    type: 'symbol',
    source: routePointsSourceId,
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
}

/**
 * applyCapacityUpdateToCollection — returns a new FeatureCollection with the
 * feature matching `capacityUpdate.spot_id` updated in-place.
 * Recomputes CAPACITY_PROGRESS_PERCENT_PROPERTY and CAPACITY_PROGRESS_BUCKET_PROPERTY
 * so Mapbox icon expressions pick up the new progress bar immediately after setData().
 *
 * @param {object} featureCollection  Current GeoJSON FeatureCollection held by the source
 * @param {object} capacityUpdate     Payload from capacity_update / capacity_alert WS event:
 *   { spot_id, visitor_count, capacity_pct, status, recorded_at }
 * @returns {object} New FeatureCollection (same reference when spot not found)
 */
export function applyCapacityUpdateToCollection(featureCollection, capacityUpdate) {
  if (!featureCollection?.features || !capacityUpdate?.spot_id) return featureCollection;

  const spotId = String(capacityUpdate.spot_id);
  let matched = false;

  const features = featureCollection.features.map((feature) => {
    const props = feature.properties ?? {};
    const id = String(props.spot_id ?? props.id ?? '');
    if (id !== spotId) return feature;

    matched = true;

    const visitorCount =
      capacityUpdate.visitor_count != null ? capacityUpdate.visitor_count : props.visitor_count;

    const patchedProps = {
      ...props,
      visitor_count: visitorCount,
      current_visitor_count: visitorCount,
      capacity_pct: capacityUpdate.capacity_pct ?? props.capacity_pct,
      capacity_status: capacityUpdate.status ?? props.capacity_status,
      recorded_at: capacityUpdate.recorded_at ?? props.recorded_at,
    };

    return { ...feature, properties: patchedProps };
  });

  if (!matched) return featureCollection;
  return { ...featureCollection, features };
}

export function removeSubcategoryLayer(map, sourceId) {
  if (!map || !sourceId) return;

  const layerIds = [
    `${sourceId}-fill`,
    `${sourceId}-line`,
    `${sourceId}-point`,
    `${sourceId}-circle`,
    `${sourceId}-icon`,
    `${sourceId}-label`,
    `${sourceId}-cluster`,
    `${sourceId}-cluster-count`,
  ];
  layerIds.forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

function ensureHighlightMarkerStyles() {
  if (typeof document === 'undefined') return;
  const cssText = `
    .${HIGHLIGHT_MARKER_CLASS} {
      width: ${MARKER_SIZE}px;
      height: ${MARKER_SIZE}px;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 20;
    }
    .${HIGHLIGHT_MARKER_RING_CLASS} {
      width: ${MARKER_SIZE}px;
      height: ${MARKER_SIZE}px;
      border-radius: 9999px;
      border: 3px solid #ff6b6b;
      box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.45);
      animation: map-highlight-point-pulse 1.2s ease-out infinite;
      will-change: transform, opacity, box-shadow;
    }
    @keyframes map-highlight-point-pulse {
      0% {
        transform: scale(0.95);
        opacity: 0.95;
        box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.45);
      }
      70% {
        transform: scale(1.4);
        opacity: 0.25;
        box-shadow: 0 0 0 14px rgba(255, 107, 107, 0);
      }
      100% {
        transform: scale(1.55);
        opacity: 0;
        box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
      }
    }
  `;
  const existingStyle = document.getElementById(HIGHLIGHT_MARKER_STYLE_ID);
  if (existingStyle) {
    existingStyle.textContent = cssText;
    return;
  }

  const style = document.createElement('style');
  style.id = HIGHLIGHT_MARKER_STYLE_ID;
  style.textContent = cssText;
  document.head.appendChild(style);
}

function upsertHighlightPointMarker(map, coordinates) {
  if (!map || !Array.isArray(coordinates)) return;
  if (typeof document === 'undefined') return;

  ensureHighlightMarkerStyles();

  let marker = highlightPointMarkerByMap.get(map);
  if (!marker) {
    const el = document.createElement('div');
    el.className = HIGHLIGHT_MARKER_CLASS;
    const ring = document.createElement('div');
    ring.className = HIGHLIGHT_MARKER_RING_CLASS;
    el.appendChild(ring);

    marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center',
      offset: [0, HIGHLIGHT_POINT_Y_OFFSET_PX],
    }).setLngLat(coordinates);

    marker.addTo(map);
    highlightPointMarkerByMap.set(map, marker);
    return;
  }

  marker.setOffset([0, HIGHLIGHT_POINT_Y_OFFSET_PX]);
  marker.setLngLat(coordinates);
}

function bindAutoClearHighlightOnUserInteraction(map) {
  if (!map) return;

  const prevCleanup = highlightInteractionCleanupByMap.get(map);
  if (typeof prevCleanup === 'function') {
    prevCleanup();
  }

  const interactionEvents = ['dragstart', 'wheel', 'touchmove'];
  let cleared = false;

  const clearByInteraction = () => {
    if (cleared) return;
    cleared = true;
    clearHighlightFromMap(map);
  };

  interactionEvents.forEach((eventName) => {
    map.on(eventName, clearByInteraction);
  });

  const cleanup = () => {
    interactionEvents.forEach((eventName) => {
      map.off(eventName, clearByInteraction);
    });
  };

  highlightInteractionCleanupByMap.set(map, cleanup);
}

function getHighlightCoordinates(point) {
  if (Array.isArray(point?.coordinates) && point.coordinates.length >= 2) {
    const lng = Number(point.coordinates[0]);
    const lat = Number(point.coordinates[1]);
    if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng, lat];
  }

  if (Array.isArray(point?.geometry?.coordinates) && point.geometry.coordinates.length >= 2) {
    const lng = Number(point.geometry.coordinates[0]);
    const lat = Number(point.geometry.coordinates[1]);
    if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng, lat];
  }

  return null;
}

export function clearHighlightFromMap(map) {
  if (!map) return;

  try {
    const cleanupInteractions = highlightInteractionCleanupByMap.get(map);
    if (typeof cleanupInteractions === 'function') {
      cleanupInteractions();
    }
    highlightInteractionCleanupByMap.delete(map);

    const pointMarker = highlightPointMarkerByMap.get(map);
    if (pointMarker) {
      pointMarker.remove();
      highlightPointMarkerByMap.delete(map);
    }
  } catch (error) {
    console.error('Error clearing highlight from map:', error);
  }
}

export function highlightPointOnMap(map, point) {
  if (!map || !point) return;

  const coordinates = getHighlightCoordinates(point);
  if (!coordinates) {
    console.warn('Invalid coordinates provided for highlight');
    return;
  }

  upsertHighlightPointMarker(map, coordinates);
  bindAutoClearHighlightOnUserInteraction(map);

  map.flyTo({
    center: coordinates,
    zoom: Math.max(map.getZoom(), 15),
    pitch: 45,
    bearing: 0,
    essential: true,
    duration: 2000,
  });
}

const RADIUS_BUFFER_SOURCE = 'radius-buffer-source';
const RADIUS_BUFFER_FILL = 'radius-buffer-fill';
const RADIUS_BUFFER_STROKE = 'radius-buffer-stroke';

export function showRadiusBuffer(map, lng, lat, radiusKm) {
  if (!map) return;

  const bufferFeature = turfCircle([lng, lat], radiusKm, { units: 'kilometers', steps: 64 });

  if (map.getSource(RADIUS_BUFFER_SOURCE)) {
    map.getSource(RADIUS_BUFFER_SOURCE).setData(bufferFeature);
  } else {
    map.addSource(RADIUS_BUFFER_SOURCE, { type: 'geojson', data: bufferFeature });

    map.addLayer({
      id: RADIUS_BUFFER_FILL,
      type: 'fill',
      source: RADIUS_BUFFER_SOURCE,
      paint: {
        'fill-color': '#ef4444',
        'fill-opacity': 0.1,
      },
    });

    map.addLayer({
      id: RADIUS_BUFFER_STROKE,
      type: 'line',
      source: RADIUS_BUFFER_SOURCE,
      paint: {
        'line-color': '#ef4444',
        'line-width': 2,
        'line-opacity': 0.9,
        'line-dasharray': [4, 3],
      },
    });
  }
}

export function clearRadiusBuffer(map) {
  if (!map) return;
  if (map.getLayer(RADIUS_BUFFER_STROKE)) map.removeLayer(RADIUS_BUFFER_STROKE);
  if (map.getLayer(RADIUS_BUFFER_FILL)) map.removeLayer(RADIUS_BUFFER_FILL);
  if (map.getSource(RADIUS_BUFFER_SOURCE)) map.removeSource(RADIUS_BUFFER_SOURCE);
}

// --- OCOP Products Layer ---

const OCOP_SOURCE_ID = 'ocop-products';
export const OCOP_LAYER_ID = 'ocop-products-point';
const OCOP_POINT_LAYER_ID = OCOP_LAYER_ID;
const OCOP_CLUSTER_LAYER_ID = 'ocop-products-cluster';
const OCOP_CLUSTER_COUNT_LAYER_ID = 'ocop-products-cluster-count';
const OCOP_MARKER_IMAGE_ID = 'ocop-marker';
const OCOP_COLOR = '#16a34a';

// Hexagonal badge pin with leaf — matches OCOP program visual identity
function createOcopMarkerSvg() {
  return `<svg width="52" height="66" viewBox="0 0 52 66" xmlns="http://www.w3.org/2000/svg">
  <!-- drop shadow -->
  <ellipse cx="26" cy="64" rx="8" ry="2" fill="rgba(0,0,0,0.18)"/>
  <!-- pin tail -->
  <path d="M20 46 L26 62 L32 46Z" fill="#14532d"/>
  <!-- outer gold hexagon ring -->
  <polygon points="26,4 45.1,15 45.1,37 26,48 6.9,37 6.9,15" fill="#fbbf24"/>
  <!-- inner green hexagon -->
  <polygon points="26,8 41.4,17 41.4,35 26,44 10.6,35 10.6,17" fill="#16a34a"/>
  <!-- white inner hexagon -->
  <polygon points="26,12 37.8,18.5 37.8,31.5 26,38 14.2,31.5 14.2,18.5" fill="white"/>
  <!-- leaf stem -->
  <line x1="26" y1="37" x2="26" y2="18" stroke="#15803d" stroke-width="2" stroke-linecap="round"/>
  <!-- left leaf -->
  <path d="M26 28 C20 27 17 21 19 14 C21.5 15.5 25 21 26 28Z" fill="#16a34a"/>
  <!-- right leaf -->
  <path d="M26 24 C32 23 35 17 33 10 C30.5 11.5 27 17 26 24Z" fill="#22c55e"/>
  <!-- gold star accent bottom -->
  <text x="26" y="37" font-family="Arial, sans-serif" font-size="6" fill="#fbbf24" text-anchor="middle">★</text>
</svg>`;
}

export function addOrUpdateOcopLayer(map, featureCollection) {
  if (!map || !featureCollection) return;

  const source = map.getSource(OCOP_SOURCE_ID);
  if (source) {
    source.setData(featureCollection);
  } else {
    map.addSource(OCOP_SOURCE_ID, {
      type: 'geojson',
      data: featureCollection,
      cluster: true,
      clusterMaxZoom: SOURCE_CLUSTER_MAX_ZOOM,
      clusterRadius: SOURCE_CLUSTER_RADIUS,
    });
  }

  ensureLayer(map, {
    id: OCOP_CLUSTER_LAYER_ID,
    type: 'circle',
    source: OCOP_SOURCE_ID,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': OCOP_COLOR,
      'circle-radius': CLUSTER_RADIUS_STEPS,
      'circle-stroke-color': '#fbbf24',
      'circle-stroke-width': 2.5,
      'circle-opacity': CLUSTER_OPACITY,
    },
  });

  ensureLayer(map, {
    id: OCOP_CLUSTER_COUNT_LAYER_ID,
    type: 'symbol',
    source: OCOP_SOURCE_ID,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-size': CLUSTER_COUNT_TEXT_SIZE,
      'text-font': MAP_LABEL_FONT,
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#14532d',
      'text-halo-width': 1,
    },
  });

  const addPointLayer = () => {
    ensureLayer(map, {
      id: OCOP_POINT_LAYER_ID,
      type: 'symbol',
      source: OCOP_SOURCE_ID,
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': OCOP_MARKER_IMAGE_ID,
        'icon-size': POINT_ICON_SIZE_BY_ZOOM,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-anchor': 'bottom',
        'text-field': ['coalesce', ['get', 'name'], ['get', 'name_vi'], ['get', 'name_en'], ''],
        'text-font': MAP_LABEL_FONT,
        'text-size': POINT_TEXT_SIZE,
        'text-offset': POINT_TEXT_OFFSET,
        'text-anchor': 'top',
        'text-padding': POINT_TEXT_PADDING,
      },
      paint: {
        'icon-opacity': POINT_ICON_OPACITY,
        'text-color': POINT_TEXT_COLOR,
        'text-halo-color': POINT_TEXT_HALO_COLOR,
        'text-halo-width': POINT_TEXT_HALO_WIDTH,
        'text-opacity': POINT_TEXT_OPACITY,
      },
    });
    if (map.getLayer(OCOP_POINT_LAYER_ID)) {
      map.moveLayer(OCOP_POINT_LAYER_ID);
    }
  };

  if (map.hasImage(OCOP_MARKER_IMAGE_ID)) {
    addPointLayer();
    return;
  }

  loadSvgStringAsImage(createOcopMarkerSvg(), (image, error) => {
    if (!map.getSource(OCOP_SOURCE_ID)) return;
    if (error || !image) {
      console.warn('[MapHelper] Failed to load OCOP marker image', error);
      return;
    }
    if (!map.hasImage(OCOP_MARKER_IMAGE_ID)) {
      map.addImage(OCOP_MARKER_IMAGE_ID, image);
    }
    addPointLayer();
  });
}

export function removeOcopLayer(map) {
  if (!map) return;
  [OCOP_POINT_LAYER_ID, OCOP_CLUSTER_COUNT_LAYER_ID, OCOP_CLUSTER_LAYER_ID].forEach((layerId) => {
    if (map.getLayer(layerId)) map.removeLayer(layerId);
  });
  if (map.getSource(OCOP_SOURCE_ID)) map.removeSource(OCOP_SOURCE_ID);
}

// --- Chatbot AI Map Action Utilities ---

const aiMarkersRegistry = new WeakMap();
const aiPopupsRegistry = new WeakMap();
const aiRouteRegistry = new WeakMap();
let aiRouteIdCounter = 0;

const OCOP_ALL_LAYER_IDS = [
  OCOP_POINT_LAYER_ID,
  OCOP_CLUSTER_LAYER_ID,
  OCOP_CLUSTER_COUNT_LAYER_ID,
];

function getAiMarkerList(map) {
  if (!aiMarkersRegistry.has(map)) aiMarkersRegistry.set(map, []);
  return aiMarkersRegistry.get(map);
}

function getAiPopupList(map) {
  if (!aiPopupsRegistry.has(map)) aiPopupsRegistry.set(map, []);
  return aiPopupsRegistry.get(map);
}

function getAiRouteList(map) {
  if (!aiRouteRegistry.has(map)) aiRouteRegistry.set(map, []);
  return aiRouteRegistry.get(map);
}

export function clearAiMapOverlays(map) {
  if (!map) return;
  getAiMarkerList(map).forEach((m) => m.remove());
  aiMarkersRegistry.set(map, []);
  getAiPopupList(map).forEach((p) => p.remove());
  aiPopupsRegistry.set(map, []);
  getAiRouteList(map).forEach(({ sourceId, layerId }) => {
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
  });
  aiRouteRegistry.set(map, []);
}

export function executeChatbotMapAction(map, action) {
  if (!map || !action?.action) return;

  switch (action.action) {
    case 'fly_to': {
      const [lng, lat] = action.center ?? [];
      if (lng == null || lat == null) break;
      map.flyTo({
        center: [Number(lng), Number(lat)],
        zoom: action.zoom != null ? Number(action.zoom) : Math.max(map.getZoom(), 13),
        essential: true,
        duration: 2000,
        pitch: 30,
      });
      break;
    }
    case 'pan': {
      const [lng, lat] = action.center ?? [];
      if (lng == null || lat == null) break;
      map.panTo([Number(lng), Number(lat)], { duration: 800 });
      break;
    }
    case 'zoom': {
      if (action.zoom == null) break;
      map.zoomTo(Number(action.zoom), { duration: 800 });
      break;
    }
    case 'fit_bounds': {
      const bounds = action.bounds;
      if (!Array.isArray(bounds) || bounds.length < 2) break;
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      if ([minLng, minLat, maxLng, maxLat].some((v) => v == null)) break;
      map.fitBounds(
        [
          [Number(minLng), Number(minLat)],
          [Number(maxLng), Number(maxLat)],
        ],
        { padding: action.padding ?? 60, duration: 1200 }
      );
      break;
    }
    case 'draw_route': {
      const coordinates = action.coordinates;
      if (!Array.isArray(coordinates) || coordinates.length < 2) break;
      const id = ++aiRouteIdCounter;
      const sourceId = `chatbot-ai-route-${id}`;
      const layerId = `${sourceId}-line`;
      const color = action.color ?? '#2563eb';
      const normalizedCoords = coordinates.map(([lng, lat]) => [Number(lng), Number(lat)]);
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: normalizedCoords },
        },
      });
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': color, 'line-width': 5, 'line-opacity': 0.9 },
      });
      getAiRouteList(map).push({ sourceId, layerId });
      const routeBounds = normalizedCoords.reduce(
        (acc, coord) => acc.extend(coord),
        new mapboxgl.LngLatBounds(normalizedCoords[0], normalizedCoords[0])
      );
      map.fitBounds(routeBounds, { padding: 72, duration: 1200 });
      break;
    }
    case 'add_marker': {
      const [lng, lat] = action.center ?? [];
      if (lng == null || lat == null) break;
      const color = action.color ?? '#ef4444';
      const marker = new mapboxgl.Marker({ color, scale: 0.85 }).setLngLat([
        Number(lng),
        Number(lat),
      ]);
      if (action.label) {
        marker.setPopup(
          new mapboxgl.Popup({ offset: 28, closeButton: true }).setHTML(
            `<div style="font-size:13px;font-weight:600;padding:2px 0">${action.label}</div>`
          )
        );
      }
      marker.addTo(map);
      if (action.label) marker.togglePopup();
      getAiMarkerList(map).push(marker);
      break;
    }
    case 'clear_markers': {
      clearAiMapOverlays(map);
      // scope === 'all' also hides highlight markers — leave highlight state to caller
      break;
    }
    case 'show_popup': {
      const [lng, lat] = action.center ?? [];
      if (lng == null || lat == null) break;
      const popup = new mapboxgl.Popup({
        closeButton: true,
        offset: 14,
        maxWidth: '300px',
      }).setLngLat([Number(lng), Number(lat)]);
      if (action.html) popup.setHTML(action.html);
      else if (action.text) popup.setText(action.text);
      popup.addTo(map);
      getAiPopupList(map).push(popup);
      break;
    }
    case 'filter_layer': {
      const { layers = [], visible = true } = action;
      layers.forEach((layerName) => {
        const lower = String(layerName).toLowerCase();
        if (lower === 'ocop') {
          OCOP_ALL_LAYER_IDS.forEach((id) => {
            if (map.getLayer(id)) {
              map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
            }
          });
        }
      });
      break;
    }
    default:
      break;
  }
}
