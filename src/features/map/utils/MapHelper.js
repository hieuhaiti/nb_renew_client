function isObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function toFeature(input, fallbackId) {
  if (!isObject(input)) return null;

  if (input.type === 'Feature' && isObject(input.geometry)) {
    const properties = isObject(input.properties) ? input.properties : {};
    return {
      type: 'Feature',
      id: input.id ?? fallbackId,
      geometry: input.geometry,
      properties,
    };
  }

  const geometry = input.geometry_data || input.geometry;
  if (!isObject(geometry) || !geometry.type) return null;

  const mergedProperties = {
    ...(isObject(input.properties) ? input.properties : {}),
    id: input.id,
    name: input.name,
    category_id: input.category_id,
    subcategory_id: input.subcategory_id,
  };

  return {
    type: 'Feature',
    id: input.id ?? fallbackId,
    geometry,
    properties: mergedProperties,
  };
}

export function normalizePointsToFeatureCollection(payload) {
  const fallback = {
    type: 'FeatureCollection',
    features: [],
  };

  const directGeojson = payload?.data?.geojson || payload?.geojson;
  if (directGeojson?.type === 'FeatureCollection' && Array.isArray(directGeojson.features)) {
    return directGeojson;
  }

  const candidateArrays = [
    payload?.data?.points,
    payload?.points,
    payload?.data?.mapLayers,
    payload?.mapLayers,
    payload?.data?.features,
    payload?.features,
  ];

  const sourceArray = candidateArrays.find((items) => Array.isArray(items)) || [];
  const features = sourceArray.map((item, index) => toFeature(item, `${index}`)).filter(Boolean);

  if (features.length === 0) return fallback;

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
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });
}

function ensureLayer(map, layer) {
  if (map.getLayer(layer.id)) return;
  map.addLayer(layer);
}

function normalizeSvgIcon(iconSvg) {
  const svgString = String(iconSvg || '').trim();

  const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  let content = svgString
    .replace(/<svg[^>]*>/i, '')
    .replace(/<\/svg>/i, '')
    .trim();

  return { viewBox, content };
}

function createCategorySvg(iconSvg, color) {
  const markerSize = 30;
  const iconSize = 16;
  const markerColor = color || '#3b82f6';

  const { viewBox, content } = normalizeSvgIcon(iconSvg);

  const iconX = (markerSize - iconSize) / 2;
  const iconY = (markerSize - iconSize) / 2;

  return `
    <svg
      width="${markerSize}"
      height="${markerSize}"
      viewBox="0 0 ${markerSize} ${markerSize}"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <circle
        cx="${markerSize / 2}"
        cy="${markerSize / 2}"
        r="14"
        fill="white"
        stroke="${markerColor}"
        stroke-width="2"
      />

      <svg
        x="${iconX}"
        y="${iconY}"
        width="${iconSize}"
        height="${iconSize}"
        viewBox="${viewBox}"
        preserveAspectRatio="xMidYMid meet"
      >
        ${content}
      </svg>
    </svg>
  `;
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

function loadMapIconImage(map, iconUrl, color, callback) {
  if (!iconUrl) {
    callback(null, new Error('Icon URL is empty'));
    return;
  }

  const loadBitmapFallback = (originError) => {
    if (isSvgIconUrl(iconUrl)) {
      callback(
        null,
        originError || new Error(`Cannot render SVG marker image from URL: ${iconUrl}`)
      );
      return;
    }

    map.loadImage(iconUrl, (bitmapError, image) => {
      if (bitmapError || !image) {
        callback(
          null,
          bitmapError || originError || new Error(`Cannot load map icon from URL: ${iconUrl}`)
        );
        return;
      }

      callback(image, null);
    });
  };

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

      const markerSvg = createCategorySvg(iconSvg, color);
      loadSvgStringAsImage(markerSvg, (image, renderError) => {
        if (renderError || !image) {
          loadBitmapFallback(renderError);
          return;
        }

        callback(image, null);
      });
    })
    .catch((svgError) => loadBitmapFallback(svgError));
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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
    name: properties.name_vi || properties.name_en || properties.name || 'Unknown destination',
    description:
      properties.description_vi || properties.description_en || properties.description || '',
    category_id: properties.category_id ?? null,
    subcategory_id: properties.subcategory_id ?? null,
    address: properties.address_vi || properties.address_en || properties.address || '',
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
  const circleLayerId = `${sourceId}-circle`;
  const iconLayerId = `${sourceId}-icon`;
  const clusterLayerId = `${sourceId}-cluster`;
  const clusterCountLayerId = `${sourceId}-cluster-count`;

  ensureLayer(map, {
    id: fillLayerId,
    type: 'fill',
    source: sourceId,
    filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
    paint: {
      'fill-color': color,
      'fill-opacity': 0.18,
    },
  });

  ensureLayer(map, {
    id: lineLayerId,
    type: 'line',
    source: sourceId,
    filter: ['in', ['geometry-type'], ['literal', ['LineString', 'MultiLineString']]],
    paint: {
      'line-color': color,
      'line-width': 2,
      'line-opacity': 0.9,
    },
  });

  ensureLayer(map, {
    id: circleLayerId,
    type: 'circle',
    source: sourceId,
    filter: [
      'all',
      ['in', ['geometry-type'], ['literal', ['Point', 'MultiPoint']]],
      ['!', ['has', 'point_count']],
    ],
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 14, 12, 16, 16, 18],
      'circle-stroke-width': 3,
      'circle-color': color,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.95,
    },
  });

  ensureLayer(map, {
    id: clusterLayerId,
    type: 'circle',
    source: sourceId,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': color,
      'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 24, 100, 28],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
      'circle-opacity': 0.9,
    },
  });

  ensureLayer(map, {
    id: clusterCountLayerId,
    type: 'symbol',
    source: sourceId,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-size': 12,
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    },
    paint: {
      'text-color': '#111827',
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5,
    },
  });

  // Keep style updated when color changes.
  if (map.getLayer(fillLayerId)) {
    map.setPaintProperty(fillLayerId, 'fill-color', color);
  }
  if (map.getLayer(lineLayerId)) {
    map.setPaintProperty(lineLayerId, 'line-color', color);
  }
  if (map.getLayer(circleLayerId)) {
    map.setPaintProperty(circleLayerId, 'circle-color', color);
    map.setPaintProperty(circleLayerId, 'circle-stroke-color', '#ffffff');
    map.setPaintProperty(circleLayerId, 'circle-stroke-width', 1.5);
  }
  if (map.getLayer(clusterLayerId)) {
    map.setPaintProperty(clusterLayerId, 'circle-color', color);
  }

  // Icon symbol layer on top of circle
  if (iconUrl && iconImageId) {
    const addIconLayer = () => {
      ensureLayer(map, {
        id: iconLayerId,
        type: 'symbol',
        source: sourceId,
        filter: [
          'all',
          ['in', ['geometry-type'], ['literal', ['Point', 'MultiPoint']]],
          ['!', ['has', 'point_count']],
        ],
        layout: {
          'icon-image': iconImageId,
          // Icon bitmap is normalized to 30x30 with a centered 16x16 glyph.
          'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.9, 12, 1, 16, 1.12],
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-anchor': 'center',
        },
        paint: {
          'icon-opacity': 0.95,
        },
      });

      // Ensure icon is always above the point circle.
      if (map.getLayer(iconLayerId)) {
        map.moveLayer(iconLayerId);
      }

      // Hide base point circle when composed SVG marker is visible.
      if (map.getLayer(circleLayerId)) {
        map.setPaintProperty(circleLayerId, 'circle-opacity', 0);
        map.setPaintProperty(circleLayerId, 'circle-stroke-opacity', 0);
      }
    };

    if (map.hasImage(iconImageId)) {
      addIconLayer();
    } else {
      loadMapIconImage(map, iconUrl, color, (loadedImage, loadError) => {
        // Layer may be toggled off before async icon loading finishes.
        if (!map.getSource(sourceId)) {
          return;
        }

        if (loadError || !loadedImage) {
          console.warn('[MapHelper] Failed to load subcategory icon image', {
            sourceId,
            iconUrl,
            iconImageId,
            error: loadError,
          });
          return;
        }

        if (!map.hasImage(iconImageId)) {
          map.addImage(iconImageId, loadedImage);
        }
        addIconLayer();
      });
    }
  } else {
    if (map.getLayer(iconLayerId)) {
      map.removeLayer(iconLayerId);
    }

    // Restore base point circle when icon marker is not available.
    if (map.getLayer(circleLayerId)) {
      map.setPaintProperty(circleLayerId, 'circle-opacity', 0.95);
      map.setPaintProperty(circleLayerId, 'circle-stroke-opacity', 1);
    }
  }
}

export function removeSubcategoryLayer(map, sourceId) {
  if (!map || !sourceId) return;

  const layerIds = [
    `${sourceId}-fill`,
    `${sourceId}-line`,
    `${sourceId}-circle`,
    `${sourceId}-icon`,
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
