import khubaotonData from '@/data/khubaoton.json';

/**
 * Return the raw khubaoton GeoJSON (FeatureCollection, read-only).
 * @returns {object}
 */
export function getDefaultSatelliteGeoJson() {
  return khubaotonData;
}

/**
 * Normalize GeoJSON input for satellite API.
 * Preserves FeatureCollection as-is so the server can dissolve all features.
 * For single Feature/Geometry, wraps into a consistent shape.
 *
 * @param {object} input - GeoJSON FeatureCollection, Feature, or Geometry
 * @returns {object|null} GeoJSON object ready to send to server, or null
 */
export function getGeometryFromGeoJson(input) {
  if (!input) return null;

  // Giữ nguyên FeatureCollection — server sẽ dissolve toàn bộ features
  if (input.type === 'FeatureCollection') {
    if (!Array.isArray(input.features) || input.features.length === 0) return null;
    return input;
  }

  if (input.type === 'Feature') {
    return input.geometry ?? null;
  }

  // Already a Geometry
  if (input.coordinates) return input;

  return null;
}

/**
 * Get the default geometry for satellite API requests.
 * @returns {object|null} GeoJSON Geometry
 */
export function getDefaultSatelliteGeometry() {
  return getGeometryFromGeoJson(khubaotonData);
}

/**
 * Build the payload body for a single-period satellite request.
 * @param {{ startDate, endDate, collection?, cloudCover?, geometry? }} formValues
 * @returns {object}
 */
export function buildSatelliteSinglePeriodPayload(formValues) {
  const geometry = formValues.geometry ?? getDefaultSatelliteGeometry();
  return {
    geometry,
    startDate: toDateString(formValues.startDate),
    endDate: toDateString(formValues.endDate),
    collection: formValues.collection ?? 'S2',
    cloudCover: formValues.cloudCover ?? 20,
  };
}

/**
 * Build the payload body for a dual-period compare request.
 * @param {{ startDate1, endDate1, startDate2, endDate2, collection?, cloudCover?, geometry? }} formValues
 * @returns {object}
 */
export function buildSatelliteDualPeriodPayload(formValues) {
  const geometry = formValues.geometry ?? getDefaultSatelliteGeometry();
  return {
    geometry,
    startDate1: toDateString(formValues.startDate1),
    endDate1: toDateString(formValues.endDate1),
    startDate2: toDateString(formValues.startDate2),
    endDate2: toDateString(formValues.endDate2),
    collection: formValues.collection ?? 'S2',
    cloudCover: formValues.cloudCover ?? 20,
  };
}

/**
 * Get the bounding box of a GeoJSON as [[minLng, minLat], [maxLng, maxLat]].
 * @param {object} geoJson
 * @returns {[[number,number],[number,number]]|null}
 */
export function getGeoJsonBounds(geoJson) {
  if (!geoJson) return null;
  const coords = [];

  const collect = (geometry) => {
    if (!geometry) return;
    if (geometry.type === 'Point') coords.push(geometry.coordinates);
    else if (geometry.type === 'MultiPoint' || geometry.type === 'LineString')
      coords.push(...geometry.coordinates);
    else if (geometry.type === 'MultiLineString' || geometry.type === 'Polygon')
      geometry.coordinates.forEach((ring) => coords.push(...ring));
    else if (geometry.type === 'MultiPolygon')
      geometry.coordinates.forEach((poly) => poly.forEach((ring) => coords.push(...ring)));
    else if (geometry.type === 'GeometryCollection') geometry.geometries.forEach(collect);
  };

  if (geoJson.type === 'FeatureCollection') geoJson.features.forEach((f) => collect(f.geometry));
  else if (geoJson.type === 'Feature') collect(geoJson.geometry);
  else collect(geoJson);

  if (coords.length === 0) return null;
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

/**
 * Basic validation for a GeoJSON geometry.
 * @param {object} geoJson
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateGeoJsonGeometry(geoJson) {
  if (!geoJson) return { valid: false, error: 'geometry_required' };
  const geometry = getGeometryFromGeoJson(geoJson);
  if (!geometry) return { valid: false, error: 'no_polygon_found' };
  if (!geometry.coordinates || geometry.coordinates.length === 0)
    return { valid: false, error: 'empty_coordinates' };
  return { valid: true };
}

function toDateString(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return String(value);
}
