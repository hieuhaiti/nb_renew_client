const EARTH_RADIUS_METERS = 6371008.8;

export function normalizeBearing(bearing = 0) {
  const safeBearing = Number.isFinite(Number(bearing)) ? Number(bearing) : 0;
  return ((safeBearing % 360) + 360) % 360;
}

function toRadians(degree) {
  return (degree * Math.PI) / 180;
}

function toDegrees(radian) {
  return (radian * 180) / Math.PI;
}

export function destinationPoint([lng, lat], bearing, distanceMeters) {
  const safeLng = Number(lng);
  const safeLat = Number(lat);
  const safeDistance = Number(distanceMeters);

  if (!Number.isFinite(safeLng) || !Number.isFinite(safeLat)) return null;
  if (!Number.isFinite(safeDistance) || safeDistance <= 0) return [safeLng, safeLat];

  const bearingRad = toRadians(normalizeBearing(bearing));
  const angularDistance = safeDistance / EARTH_RADIUS_METERS;
  const latRad = toRadians(safeLat);
  const lngRad = toRadians(safeLng);

  const lat2 = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad)
  );

  const lng2 =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(lat2)
    );

  return [toDegrees(lng2), toDegrees(lat2)];
}

export function buildSectorPolygon(center, bearing = 0, fovAngle = 80, radius = 250, steps = 48) {
  if (!Array.isArray(center) || center.length < 2) {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }

  const safeCenter = [Number(center[0]), Number(center[1])];
  if (!Number.isFinite(safeCenter[0]) || !Number.isFinite(safeCenter[1])) {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }

  const safeFov = Math.max(1, Math.min(180, Number(fovAngle) || 80));
  const safeRadius = Math.max(1, Number(radius) || 250);
  const safeSteps = Math.max(12, Number(steps) || 48);
  const safeBearing = normalizeBearing(bearing);

  const start = safeBearing - safeFov / 2;
  const stepSize = safeFov / safeSteps;

  const arcCoordinates = [];
  for (let i = 0; i <= safeSteps; i += 1) {
    const pointBearing = start + i * stepSize;
    const point = destinationPoint(safeCenter, pointBearing, safeRadius);
    if (point) arcCoordinates.push(point);
  }

  const ring = [safeCenter, ...arcCoordinates, safeCenter];

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          bearing: safeBearing,
          fovAngle: safeFov,
          radius: safeRadius,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
      },
    ],
  };
}

// Keep this named export to match requested API wording.
export function updateFovPolygon(center, bearing, fovAngle, radius) {
  return buildSectorPolygon(center, bearing, fovAngle, radius);
}
