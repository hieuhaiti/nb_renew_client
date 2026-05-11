const sanitizeId = (v) => (v ? String(v).replace(/[^a-zA-Z0-9_-]/g, '_') : 'unknown');

export function buildSatelliteSourceId(mapId, layerId) {
  return `satellite-src-${sanitizeId(layerId)}-${sanitizeId(mapId || 'map')}`.slice(0, 120);
}

function getRasterBeforeId(map) {
  const layers = map.getStyle()?.layers ?? [];
  return layers.find((l) => l.id.startsWith('cat-'))?.id;
}

/**
 * Add a raster tile layer from a satellite API response.
 * @param {mapboxgl.Map} map
 * @param {{ tileUrl: string, mapId?: string }} layerData
 * @param {string} layerId
 * @param {number} [opacity]
 * @param {string} [sourceIdOverride]
 * @returns {string|null} sourceId used
 */
export function addSatelliteRasterLayer(map, { id, tileUrl, opacity = 1, beforeId }) {
  if (!map || !tileUrl || !id) return null;
  const sourceId = `satellite-src-${sanitizeId(id)}`;

  if (map.getLayer(id)) map.removeLayer(id);
  if (map.getSource(sourceId)) map.removeSource(sourceId);

  map.addSource(sourceId, {
    type: 'raster',
    tiles: [tileUrl],
    tileSize: 256,
    attribution: 'Google Earth Engine',
  });

  map.addLayer(
    {
      id,
      type: 'raster',
      source: sourceId,
      paint: { 'raster-opacity': Math.max(0, Math.min(1, opacity)) },
    },
    beforeId
  );

  return sourceId;
}

/**
 * Add satellite layer using full layerData object (from satellite store).
 */
export function addSatelliteLayerToMap(map, layerData, layerId, opacity = 1, sourceIdOverride) {
  if (!map || !layerData?.tileUrl || !layerId) return null;

  const sourceId = sourceIdOverride || buildSatelliteSourceId(layerData.mapId, layerId);

  if (map.getLayer(layerId)) map.removeLayer(layerId);
  if (map.getSource(sourceId)) map.removeSource(sourceId);

  map.addSource(sourceId, {
    type: 'raster',
    tiles: [layerData.tileUrl],
    tileSize: 256,
    attribution: 'Google Earth Engine',
  });

  map.addLayer(
    {
      id: layerId,
      type: 'raster',
      source: sourceId,
      paint: { 'raster-opacity': Math.max(0, Math.min(1, opacity)) },
    },
    getRasterBeforeId(map)
  );

  return sourceId;
}

/**
 * Remove a satellite layer and its source from the map.
 */
export function removeSatelliteLayer(map, id) {
  if (!map || !id) return;
  if (map.getLayer(id)) map.removeLayer(id);
  const sourceId = `satellite-src-${sanitizeId(id)}`;
  if (map.getSource(sourceId)) map.removeSource(sourceId);
}

export function removeSatelliteLayerFromMap(map, layerId, sourceId) {
  if (!map) return;
  if (layerId && map.getLayer(layerId)) map.removeLayer(layerId);
  if (sourceId && map.getSource(sourceId)) map.removeSource(sourceId);
}

/**
 * Update raster opacity for an existing layer.
 */
export function updateSatelliteLayerOpacity(map, id, opacity) {
  if (!map || !id || !map.getLayer(id)) return;
  map.setPaintProperty(id, 'raster-opacity', Math.max(0, Math.min(1, opacity)));
}

/**
 * Toggle layer visibility.
 */
export function toggleSatelliteLayerVisibility(map, id, visible) {
  if (!map || !id || !map.getLayer(id)) return;
  map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
}

/**
 * Add a GeoJSON boundary layer to the map.
 */
export function addGeoJsonBoundaryLayer(map, geoJson, { sourceId = 'satellite-boundary', lineLayerId = 'satellite-boundary-line', fillLayerId = 'satellite-boundary-fill', lineColor = '#22c55e', lineWidth = 2, fillOpacity = 0.05 } = {}) {
  if (!map || !geoJson) return;

  if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
  if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
  if (map.getSource(sourceId)) map.removeSource(sourceId);

  map.addSource(sourceId, { type: 'geojson', data: geoJson });

  map.addLayer({
    id: fillLayerId,
    type: 'fill',
    source: sourceId,
    paint: { 'fill-color': lineColor, 'fill-opacity': fillOpacity },
  });

  map.addLayer({
    id: lineLayerId,
    type: 'line',
    source: sourceId,
    paint: { 'line-color': lineColor, 'line-width': lineWidth },
  });
}

/**
 * Fit the map viewport to a GeoJSON's bounding box.
 */
export function fitMapToGeoJson(map, geoJson, padding = 40) {
  if (!map || !geoJson) return;
  try {
    const coords = [];
    const collect = (geometry) => {
      if (!geometry) return;
      if (geometry.type === 'Point') {
        coords.push(geometry.coordinates);
      } else if (geometry.type === 'MultiPoint' || geometry.type === 'LineString') {
        coords.push(...geometry.coordinates);
      } else if (geometry.type === 'MultiLineString' || geometry.type === 'Polygon') {
        geometry.coordinates.forEach((ring) => coords.push(...ring));
      } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach((poly) => poly.forEach((ring) => coords.push(...ring)));
      } else if (geometry.type === 'GeometryCollection') {
        geometry.geometries.forEach(collect);
      }
    };

    if (geoJson.type === 'FeatureCollection') {
      geoJson.features.forEach((f) => collect(f.geometry));
    } else if (geoJson.type === 'Feature') {
      collect(geoJson.geometry);
    } else {
      collect(geoJson);
    }

    if (coords.length === 0) return;
    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding }
    );
  } catch {
    // silently ignore invalid geometries
  }
}

/**
 * Remove all satellite layers (prefix "satellite-") from a map.
 */
export function cleanupSatelliteLayers(map) {
  if (!map) return;
  try {
    const style = map.getStyle();
    if (!style) return;
    const toRemove = (style.layers || [])
      .filter((l) => l.id.startsWith('satellite-'))
      .map((l) => l.id);
    toRemove.forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    const sources = Object.keys(style.sources || {}).filter((s) => s.startsWith('satellite-'));
    sources.forEach((s) => {
      if (map.getSource(s)) map.removeSource(s);
    });
  } catch {
    // ignore
  }
}
