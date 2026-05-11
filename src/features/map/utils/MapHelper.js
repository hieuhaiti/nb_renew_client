import mapboxgl from 'mapbox-gl';

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
const HIGHLIGHT_POINT_RADIUS_BASE = MARKER_RADIUS + MARKER_STROKE_WIDTH / 2;
const HIGHLIGHT_GLOW_SCALE = 1.12;
const HIGHLIGHT_PULSE_MIN_SCALE = 1.08;
const HIGHLIGHT_PULSE_MAX_SCALE = 1.46;
const HIGHLIGHT_PULSE_SPEED = 4.2;
const HIGHLIGHT_POINT_Y_OFFSET_PX = -4;
const HIGHLIGHT_MARKER_CLASS = 'map-highlight-point-marker';
const HIGHLIGHT_MARKER_RING_CLASS = 'map-highlight-point-ring';
const HIGHLIGHT_MARKER_STYLE_ID = 'map-highlight-point-style';

const MARKER_PROGRESS_CURRENT = 50;
const MARKER_PROGRESS_TOTAL = 100;
const MARKER_PROGRESS_BAR_WIDTH = 55;
const MARKER_PROGRESS_BAR_HEIGHT = 4;
const MARKER_PROGRESS_GAP = 1;
const MARKER_PROGRESS_CORNER_RADIUS = 2;
const MARKER_PROGRESS_TRACK_COLOR = '#22c55e';
const MARKER_PROGRESS_FILL_COLOR = '#ef4444';
const MARKER_PROGRESS_BUCKET_STEP = 10;
const MARKER_PROGRESS_MIN_PERCENT = 0;
const MARKER_PROGRESS_MAX_PERCENT = 100;
const CAPACITY_PROGRESS_BUCKET_PROPERTY = 'capacity_progress_bucket';
const CAPACITY_PROGRESS_PERCENT_PROPERTY = 'capacity_progress_pct';

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
const POINT_TEXT_OFFSET = [0, 1.9];
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
const HIGHLIGHT_POINT_SOURCE_ID = 'highlight-point';
const HIGHLIGHT_POINT_GLOW_LAYER_ID = 'highlight-point-glow';
const HIGHLIGHT_POINT_PULSE_LAYER_ID = 'highlight-point-pulse';

const routePinMarkersByMap = new WeakMap();
const highlightPulseRafByMap = new WeakMap();
const highlightPointMarkerByMap = new WeakMap();
const highlightInteractionCleanupByMap = new WeakMap();

function isObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function getScaledRadiusByZoomExpression(scale = 1) {
  return ['interpolate', ['linear'], ['zoom'], 8, 0.9 * scale, 12, 1 * scale, 16, 1.12 * scale];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getDefaultProgressRatio() {
  return MARKER_PROGRESS_CURRENT / MARKER_PROGRESS_TOTAL;
}

function getProgressPercentForFeature(raw) {
  const current = toFiniteNumber(raw?.current_visitor_count);
  const max = toFiniteNumber(raw?.max_capacity);

  if (current == null || max == null || max <= 0) {
    return getDefaultProgressRatio() * 100;
  }

  return clamp((current / max) * 100, MARKER_PROGRESS_MIN_PERCENT, MARKER_PROGRESS_MAX_PERCENT);
}

function getProgressBucketFromPercent(percent) {
  const bucket = Math.round(percent / MARKER_PROGRESS_BUCKET_STEP) * MARKER_PROGRESS_BUCKET_STEP;
  return clamp(bucket, MARKER_PROGRESS_MIN_PERCENT, MARKER_PROGRESS_MAX_PERCENT);
}

function withCapacityProgressProperties(properties) {
  const nextProperties = { ...properties };
  const progressPercent = getProgressPercentForFeature(nextProperties);
  nextProperties[CAPACITY_PROGRESS_PERCENT_PROPERTY] = progressPercent;
  nextProperties[CAPACITY_PROGRESS_BUCKET_PROPERTY] = getProgressBucketFromPercent(progressPercent);
  return nextProperties;
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

  const mergedProperties = {
    ...topLevelProps,
    ...(isObject(input.properties) ? input.properties : {}),
    id: input.id,
    slug: input.slug,
    name: toDisplayText(input.name) || toDisplayText(input.name_vi) || toDisplayText(input.name_en),
    name_vi: input.name_vi,
    name_en: input.name_en,
    description: input.description || input.description_vi || input.description_en,
    description_vi: input.description_vi,
    description_en: input.description_en,
    address: input.address || input.address_vi || input.address_en,
    address_vi: input.address_vi,
    address_en: input.address_en,
    category_id: input.category_id,
    subcategory_id: input.subcategory_id,
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

function createCategorySvg(iconSvg, color, progressPercent = getDefaultProgressRatio() * 100) {
  const markerColor = color || DEFAULT_MARKER_COLOR;
  const progressRatio = clamp(progressPercent / 100, 0, 1);
  const progressBarWidth = MARKER_PROGRESS_BAR_WIDTH;
  const progressBarHeight = MARKER_PROGRESS_BAR_HEIGHT;
  const progressGap = MARKER_PROGRESS_GAP;
  const canvasWidth = Math.max(MARKER_SIZE, progressBarWidth + 2);
  const markerCenterX = canvasWidth / 2;
  const markerCenterY = MARKER_SIZE / 2;
  const progressBarX = (canvasWidth - progressBarWidth) / 2;
  const progressBarY = MARKER_SIZE + progressGap;
  const progressFillWidth = progressBarWidth * progressRatio;
  const totalHeight = MARKER_SIZE + progressGap + progressBarHeight + 2;

  const { viewBox, content } = normalizeSvgIcon(iconSvg);

  const iconX = markerCenterX - MARKER_ICON_SIZE / 2;
  const iconY = (MARKER_SIZE - MARKER_ICON_SIZE) / 2;

  return `
    <svg
      width="${canvasWidth}"
      height="${totalHeight}"
      viewBox="0 0 ${canvasWidth} ${totalHeight}"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <circle
        cx="${markerCenterX}"
        cy="${markerCenterY}"
        r="${MARKER_RADIUS}"
        fill="white"
        stroke="${markerColor}"
        stroke-width="${MARKER_STROKE_WIDTH}"
      />

      <svg
        x="${iconX}"
        y="${iconY}"
        width="${MARKER_ICON_SIZE}"
        height="${MARKER_ICON_SIZE}"
        viewBox="${viewBox}"
        preserveAspectRatio="xMidYMid meet"
      >
        ${content}
      </svg>

      <rect
        x="${progressBarX}"
        y="${progressBarY}"
        width="${progressBarWidth}"
        height="${progressBarHeight}"
        rx="${MARKER_PROGRESS_CORNER_RADIUS}"
        fill="${MARKER_PROGRESS_TRACK_COLOR}"
      />
      <rect
        x="${progressBarX}"
        y="${progressBarY}"
        width="${progressFillWidth}"
        height="${progressBarHeight}"
        rx="${MARKER_PROGRESS_CORNER_RADIUS}"
        fill="${MARKER_PROGRESS_FILL_COLOR}"
      />
    </svg>
  `;
}

function createDefaultCategorySvg(color, progressPercent = getDefaultProgressRatio() * 100) {
  const markerColor = color || DEFAULT_MARKER_COLOR;
  const progressRatio = clamp(progressPercent / 100, 0, 1);
  const progressBarWidth = MARKER_PROGRESS_BAR_WIDTH;
  const progressBarHeight = MARKER_PROGRESS_BAR_HEIGHT;
  const progressGap = MARKER_PROGRESS_GAP;
  const canvasWidth = Math.max(MARKER_SIZE, progressBarWidth + 2);
  const markerCenterX = canvasWidth / 2;
  const markerCenterY = MARKER_SIZE / 2;
  const progressBarX = (canvasWidth - progressBarWidth) / 2;
  const progressBarY = MARKER_SIZE + progressGap;
  const progressFillWidth = progressBarWidth * progressRatio;
  const totalHeight = MARKER_SIZE + progressGap + progressBarHeight + 2;

  return `
    <svg
      width="${canvasWidth}"
      height="${totalHeight}"
      viewBox="0 0 ${canvasWidth} ${totalHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="${markerCenterX}"
        cy="${markerCenterY}"
        r="${MARKER_RADIUS}"
        fill="white"
        stroke="${markerColor}"
        stroke-width="${MARKER_STROKE_WIDTH}"
      />
      <circle
        cx="${markerCenterX}"
        cy="${markerCenterY}"
        r="${DEFAULT_MARKER_DOT_RADIUS}"
        fill="${markerColor}"
      />
      <rect
        x="${progressBarX}"
        y="${progressBarY}"
        width="${progressBarWidth}"
        height="${progressBarHeight}"
        rx="${MARKER_PROGRESS_CORNER_RADIUS}"
        fill="${MARKER_PROGRESS_TRACK_COLOR}"
      />
      <rect
        x="${progressBarX}"
        y="${progressBarY}"
        width="${progressFillWidth}"
        height="${progressBarHeight}"
        rx="${MARKER_PROGRESS_CORNER_RADIUS}"
        fill="${MARKER_PROGRESS_FILL_COLOR}"
      />
    </svg>
  `;
}

function getProgressIconImageId(baseImageId, bucket) {
  return `${baseImageId}-${bucket}`;
}

function getFeatureProgressBuckets(featureCollection) {
  const bucketSet = new Set();
  const defaultBucket = getProgressBucketFromPercent(getDefaultProgressRatio() * 100);

  featureCollection?.features?.forEach((feature) => {
    const properties = isObject(feature?.properties) ? feature.properties : {};
    const rawBucket = toFiniteNumber(properties[CAPACITY_PROGRESS_BUCKET_PROPERTY]);
    const bucket =
      rawBucket == null
        ? getProgressBucketFromPercent(getProgressPercentForFeature(properties))
        : getProgressBucketFromPercent(rawBucket);
    bucketSet.add(bucket);
  });

  if (bucketSet.size === 0) {
    bucketSet.add(defaultBucket);
  }

  return [...bucketSet].sort((a, b) => a - b);
}

function buildProgressIconExpression(baseImageId, buckets) {
  const expression = ['match', ['get', CAPACITY_PROGRESS_BUCKET_PROPERTY]];

  buckets.forEach((bucket) => {
    expression.push(bucket, getProgressIconImageId(baseImageId, bucket));
  });

  expression.push(
    getProgressIconImageId(
      baseImageId,
      getProgressBucketFromPercent(getDefaultProgressRatio() * 100)
    )
  );
  return expression;
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

function loadProgressMarkerImages(map, markerImageBaseId, buckets, markerSvgByBucket, callback) {
  const targetBuckets = buckets.filter(
    (bucket) => !map.hasImage(getProgressIconImageId(markerImageBaseId, bucket))
  );

  if (targetBuckets.length === 0) {
    callback(null);
    return;
  }

  let pending = targetBuckets.length;
  let firstError = null;

  targetBuckets.forEach((bucket) => {
    const markerSvg = markerSvgByBucket(bucket);
    loadSvgStringAsImage(markerSvg, (image, renderError) => {
      if (!firstError && (renderError || !image)) {
        firstError = renderError || new Error(`Cannot render marker image for bucket ${bucket}`);
      }

      if (!firstError && image) {
        const imageId = getProgressIconImageId(markerImageBaseId, bucket);
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

function loadMapIconProgressImages(map, iconUrl, color, markerImageBaseId, buckets, callback) {
  if (!iconUrl) {
    callback(new Error('Icon URL is empty'));
    return;
  }

  if (!isSvgIconUrl(iconUrl)) {
    callback(new Error(`Cannot render progress marker from non-SVG icon URL: ${iconUrl}`));
    return;
  }

  fetch(iconUrl, { mode: 'cors', credentials: 'omit' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Cannot fetch icon SVG: ${response.status}`);
      }

      return response.text();
    })
    .then((iconSvg) => {
      if (!/<svg[\s>]/i.test(iconSvg)) {
        throw new Error('Icon content is not SVG');
      }

      loadProgressMarkerImages(
        map,
        markerImageBaseId,
        buckets,
        (bucket) => createCategorySvg(iconSvg, color, bucket),
        callback
      );
    })
    .catch((error) => callback(error));
}

function loadDefaultProgressMarkerImages(map, color, markerImageBaseId, buckets, callback) {
  loadProgressMarkerImages(
    map,
    markerImageBaseId,
    buckets,
    (bucket) => createDefaultCategorySvg(color, bucket),
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
  const resolvedId = properties.spot_id ?? properties.point_id ?? properties.id ?? feature.id ?? null;
  const resolvedSlug = properties.slug || properties.spot_slug || null;

  return {
    id: resolvedId,
    slug: resolvedSlug,
    name:
      toDisplayText(properties.name_vi) ||
      toDisplayText(properties.name_en) ||
      toDisplayText(properties.name) ||
      'Unknown destination',
    description:
      toDisplayText(properties.description_vi) ||
      toDisplayText(properties.description_en) ||
      toDisplayText(properties.description) ||
      '',
    category_id: properties.category_id ?? null,
    subcategory_id: properties.subcategory_id ?? null,
    address:
      toDisplayText(properties.address_vi) ||
      toDisplayText(properties.address_en) ||
      toDisplayText(properties.address) ||
      '',
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
  const progressBuckets = getFeatureProgressBuckets(featureCollection);
  const hasAllProgressIcons = (markerImageBaseId) =>
    progressBuckets.every((bucket) =>
      map.hasImage(getProgressIconImageId(markerImageBaseId, bucket))
    );

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
    const iconImageExpression = buildProgressIconExpression(markerImageBaseId, progressBuckets);

    ensureLayer(map, {
      id: pointLayerId,
      type: 'symbol',
      source: sourceId,
      filter: pointFilter,
      layout: {
        'icon-image': iconImageExpression,
        // Icon bitmap is normalized from constants in the marker SVG generator.
        'icon-size': POINT_ICON_SIZE_BY_ZOOM,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-anchor': 'center',
        'text-field': ['coalesce', ['get', 'name'], ''],
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
      map.setPaintProperty(pointLayerId, 'icon-opacity', POINT_ICON_OPACITY);
      map.setPaintProperty(pointLayerId, 'text-opacity', POINT_TEXT_OPACITY);
      map.moveLayer(pointLayerId);
    }
  };

  const ensureFallbackPointLayer = () => {
    if (hasAllProgressIcons(fallbackMarkerImageBaseId)) {
      ensurePointLayer(fallbackMarkerImageBaseId);
      return;
    }

    loadDefaultProgressMarkerImages(
      map,
      color,
      fallbackMarkerImageBaseId,
      progressBuckets,
      (loadError) => {
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
      }
    );
  };

  if (iconUrl && iconImageId) {
    if (hasAllProgressIcons(iconImageId)) {
      ensurePointLayer(iconImageId);
    } else {
      loadMapIconProgressImages(map, iconUrl, color, iconImageId, progressBuckets, (loadError) => {
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

function createPin({ color, num = null, glyph = null }) {
  const wrap = document.createElement('div');
  wrap.className = 'pin-wrap';
  wrap.dataset.routeMarker = 'true';
  // Let map click events pass through to route point layers beneath the marker.
  wrap.style.pointerEvents = 'none';
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

function addRoutePinMarkers(map, routePointsFeatureCollection) {
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
      });

      return new mapboxgl.Marker({
        element,
        anchor: 'bottom',
      })
        .setLngLat([Number(coordinates[0]), Number(coordinates[1])])
        .addTo(map);
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
  }
) {
  if (!map || !routeFeature || !routePointsFeatureCollection) return;

  ensureGeojsonSource(map, routeSourceId, routeFeature);
  ensureGeojsonSource(map, routePointsSourceId, routePointsFeatureCollection);
  addRoutePinMarkers(map, routePointsFeatureCollection);

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

    // Prefer the direct pct from the WS payload; fall back to ratio computed from counts.
    const progressPercent =
      capacityUpdate.capacity_pct != null
        ? clamp(
            Math.round(Number(capacityUpdate.capacity_pct)),
            MARKER_PROGRESS_MIN_PERCENT,
            MARKER_PROGRESS_MAX_PERCENT
          )
        : getProgressPercentForFeature(patchedProps);

    patchedProps[CAPACITY_PROGRESS_PERCENT_PROPERTY] = progressPercent;
    patchedProps[CAPACITY_PROGRESS_BUCKET_PROPERTY] = getProgressBucketFromPercent(progressPercent);

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
      transform: translateY(${HIGHLIGHT_POINT_Y_OFFSET_PX}px);
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

    const pulseRafId = highlightPulseRafByMap.get(map);
    if (pulseRafId && typeof window !== 'undefined') {
      window.cancelAnimationFrame(pulseRafId);
    }
    highlightPulseRafByMap.delete(map);
    const pointMarker = highlightPointMarkerByMap.get(map);
    if (pointMarker) {
      pointMarker.remove();
      highlightPointMarkerByMap.delete(map);
    }

    if (map.getLayer(HIGHLIGHT_POINT_PULSE_LAYER_ID)) {
      map.removeLayer(HIGHLIGHT_POINT_PULSE_LAYER_ID);
    }
    if (map.getLayer(HIGHLIGHT_POINT_GLOW_LAYER_ID)) {
      map.removeLayer(HIGHLIGHT_POINT_GLOW_LAYER_ID);
    }

    if (map.getSource(HIGHLIGHT_POINT_SOURCE_ID)) {
      map.removeSource(HIGHLIGHT_POINT_SOURCE_ID);
    }
  } catch (error) {
    console.error('Error clearing highlight from map:', error);
  }
}

function startHighlightPulseAnimation(map) {
  if (!map || typeof window === 'undefined') return;

  const existingRafId = highlightPulseRafByMap.get(map);
  if (existingRafId) {
    window.cancelAnimationFrame(existingRafId);
    highlightPulseRafByMap.delete(map);
  }

  const startedAt = performance.now();

  const tick = (now) => {
    if (!map.getLayer(HIGHLIGHT_POINT_PULSE_LAYER_ID)) {
      highlightPulseRafByMap.delete(map);
      return;
    }

    const elapsedSeconds = (now - startedAt) / 1000;
    const phase = (Math.sin(elapsedSeconds * HIGHLIGHT_PULSE_SPEED) + 1) / 2;
    const pulseScale =
      HIGHLIGHT_PULSE_MIN_SCALE + (HIGHLIGHT_PULSE_MAX_SCALE - HIGHLIGHT_PULSE_MIN_SCALE) * phase;
    const pulseOpacity = 0.12 + (1 - phase) * 0.28;

    map.setPaintProperty(
      HIGHLIGHT_POINT_PULSE_LAYER_ID,
      'circle-radius',
      getScaledRadiusByZoomExpression(HIGHLIGHT_POINT_RADIUS_BASE * pulseScale)
    );
    map.setPaintProperty(HIGHLIGHT_POINT_PULSE_LAYER_ID, 'circle-opacity', pulseOpacity);

    const nextRafId = window.requestAnimationFrame(tick);
    highlightPulseRafByMap.set(map, nextRafId);
  };

  const rafId = window.requestAnimationFrame(tick);
  highlightPulseRafByMap.set(map, rafId);
}

export function highlightPointOnMap(map, point) {
  if (!map || !point) return;
  if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) {
    map.once('style.load', () => highlightPointOnMap(map, point));
    return;
  }

  const coordinates = getHighlightCoordinates(point);
  if (!coordinates) {
    console.warn('Invalid coordinates provided for highlight');
    return;
  }

  try {
    const sourceData = {
      type: 'Feature',
      properties: point?.properties || {},
      geometry: {
        type: 'Point',
        coordinates,
      },
    };

    const source = map.getSource(HIGHLIGHT_POINT_SOURCE_ID);
    if (source && typeof source.setData === 'function') {
      source.setData(sourceData);
    } else {
      clearHighlightFromMap(map);
      map.addSource(HIGHLIGHT_POINT_SOURCE_ID, {
        type: 'geojson',
        data: sourceData,
      });
    }

    if (!map.getLayer(HIGHLIGHT_POINT_GLOW_LAYER_ID)) {
      map.addLayer({
        id: HIGHLIGHT_POINT_GLOW_LAYER_ID,
        type: 'circle',
        source: HIGHLIGHT_POINT_SOURCE_ID,
        paint: {
          'circle-radius': getScaledRadiusByZoomExpression(
            HIGHLIGHT_POINT_RADIUS_BASE * HIGHLIGHT_GLOW_SCALE
          ),
          'circle-color': '#FF6B6B',
          'circle-opacity': 0.25,
          'circle-blur': 0.35,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#FF6B6B',
          'circle-stroke-opacity': 0.8,
          'circle-translate': [0, HIGHLIGHT_POINT_Y_OFFSET_PX],
          'circle-translate-anchor': 'viewport',
        },
      });
    }

    if (!map.getLayer(HIGHLIGHT_POINT_PULSE_LAYER_ID)) {
      map.addLayer({
        id: HIGHLIGHT_POINT_PULSE_LAYER_ID,
        type: 'circle',
        source: HIGHLIGHT_POINT_SOURCE_ID,
        paint: {
          'circle-radius': getScaledRadiusByZoomExpression(
            HIGHLIGHT_POINT_RADIUS_BASE * HIGHLIGHT_PULSE_MIN_SCALE
          ),
          'circle-color': '#FF6B6B',
          'circle-opacity': 0.26,
          'circle-translate': [0, HIGHLIGHT_POINT_Y_OFFSET_PX],
          'circle-translate-anchor': 'viewport',
        },
      });
    }

    if (map.getLayer(HIGHLIGHT_POINT_GLOW_LAYER_ID)) {
      map.setPaintProperty(HIGHLIGHT_POINT_GLOW_LAYER_ID, 'circle-translate', [
        0,
        HIGHLIGHT_POINT_Y_OFFSET_PX,
      ]);
      map.setPaintProperty(HIGHLIGHT_POINT_GLOW_LAYER_ID, 'circle-translate-anchor', 'viewport');
    }
    if (map.getLayer(HIGHLIGHT_POINT_PULSE_LAYER_ID)) {
      map.setPaintProperty(HIGHLIGHT_POINT_PULSE_LAYER_ID, 'circle-translate', [
        0,
        HIGHLIGHT_POINT_Y_OFFSET_PX,
      ]);
      map.setPaintProperty(HIGHLIGHT_POINT_PULSE_LAYER_ID, 'circle-translate-anchor', 'viewport');
    }

    // Keep highlight on top so it is not hidden by point symbol layers.
    if (map.getLayer(HIGHLIGHT_POINT_GLOW_LAYER_ID)) {
      map.moveLayer(HIGHLIGHT_POINT_GLOW_LAYER_ID);
    }
    if (map.getLayer(HIGHLIGHT_POINT_PULSE_LAYER_ID)) {
      map.moveLayer(HIGHLIGHT_POINT_PULSE_LAYER_ID);
    }
    startHighlightPulseAnimation(map);
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
  } catch (error) {
    console.error('Error highlighting point on map:', error);
  }
}
