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

const MARKER_SIZE = 40;
const MARKER_RADIUS = 19;
const MARKER_STROKE_WIDTH = 2;
const MARKER_ICON_SIZE = 20;
const DEFAULT_MARKER_DOT_RADIUS = 5;

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

function isObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
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
      features: directGeojson.features.map((feature, index) =>
        toFeature(feature, `${feature?.id ?? index}`)
      ).filter(Boolean),
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

  return {
    id: properties.id ?? feature.id ?? null,
    slug: properties.slug || null,
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
    progressBuckets.every((bucket) => map.hasImage(getProgressIconImageId(markerImageBaseId, bucket)));

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
