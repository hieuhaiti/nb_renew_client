import { env } from '@/config/env';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toText(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object') return '';
  return value?.note_vi || value?.note_en || '';
}

function getLocalizedField(item, baseField, lang = 'vi') {
  if (!item || typeof item !== 'object') return '';
  const vi = item?.[`${baseField}_vi`];
  const en = item?.[`${baseField}_en`];
  const base = item?.[baseField];

  if (lang === 'en') {
    return toText(en) || toText(vi) || toText(base);
  }

  return toText(vi) || toText(en) || toText(base);
}

export function getPointCoordinates(input) {
  if (!input || typeof input !== 'object') return null;

  const geometry =
    input?.geometry_data ||
    input?.geometry ||
    input?.geojson?.geometry ||
    input?.data?.geometry ||
    input?.raw?.geometry ||
    null;

  if (geometry?.type === 'Point' && Array.isArray(geometry?.coordinates)) {
    const lng = toNumber(geometry.coordinates[0]);
    const lat = toNumber(geometry.coordinates[1]);
    if (lng != null && lat != null) return [lng, lat];
  }

  const lng = toNumber(input?.longitude ?? input?.lng ?? input?.lon);
  const lat = toNumber(input?.latitude ?? input?.lat);
  if (lng != null && lat != null) return [lng, lat];

  return null;
}

export function normalizeTourRoutePoint(rawPoint, index = 0, lang = 'vi') {
  const coordinates = getPointCoordinates(rawPoint);
  if (!coordinates) return null;

  const pointName = getLocalizedField(rawPoint, 'name', lang) || `Stop ${index + 1}`;
  const address = getLocalizedField(rawPoint, 'address', lang) || '';
  const stopOrder =
    toNumber(rawPoint?.stop_order) ??
    toNumber(rawPoint?.order_index) ??
    toNumber(rawPoint?.index) ??
    index + 1;
  const dayNumber = toNumber(rawPoint?.day_number) ?? 1;

  const spotId =
    rawPoint?.spot_id ||
    rawPoint?.spot?.id ||
    rawPoint?.point_id ||
    rawPoint?.id ||
    null;

  return {
    id: rawPoint?.id ?? rawPoint?.point_id ?? rawPoint?.spot_id ?? `tour-point-${index + 1}`,
    stopOrder,
    dayNumber,
    point_id: rawPoint?.point_id ?? rawPoint?.id ?? rawPoint?.spot_id ?? null,
    spot_id: spotId,
    slug: rawPoint?.slug || rawPoint?.spot_slug || rawPoint?.spot?.slug || null,
    data: {
      ...rawPoint,
      name: pointName,
      address,
      geometry: {
        type: 'Point',
        coordinates,
      },
    },
  };
}

export const createRouteFromPoints = async (points, vehicle = 'driving', language = 'vi') => {
  if (!Array.isArray(points) || points.length < 2) {
    return null;
  }

  const accessToken = env.mapboxToken;
  if (!accessToken) {
    throw new Error('Mapbox access token khong duoc tim thay');
  }

  const normalizedPoints = points
    .map((point, index) => normalizeTourRoutePoint(point?.data || point, index, language))
    .filter(Boolean)
    .sort((a, b) => a.dayNumber - b.dayNumber || a.stopOrder - b.stopOrder);

  if (normalizedPoints.length < 2) {
    throw new Error('Khong du diem hop le de tao route');
  }

  const coordinatesString = normalizedPoints
    .map((point) => {
      const coords = point.data.geometry.coordinates;
      return `${coords[0]},${coords[1]}`;
    })
    .join(';');

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/${vehicle}/${coordinatesString}.json?` +
    new URLSearchParams({
      geometries: 'geojson',
      steps: 'true',
      overview: 'full',
      language,
      access_token: accessToken,
    }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const route = data?.routes?.[0];
  if (!route) {
    throw new Error('Khong tim thay duong di');
  }

  return {
    geometry: route.geometry,
    properties: {
      name: `Route: ${normalizedPoints.map((p) => p.data.name).join(' -> ')}`,
      start_point: normalizedPoints[0]?.data?.name || '',
      end_point: normalizedPoints[normalizedPoints.length - 1]?.data?.name || '',
      total_points: normalizedPoints.length,
      waypoints: normalizedPoints.map((p) => ({
        name: p?.data?.name || '',
        address: p?.data?.address || '',
      })),
      distance: route.distance,
      duration: route.duration,
      vehicle,
    },
    fullRoute: route,
    points: normalizedPoints,
  };
};

export function buildHighlightRoutePointsFeatureCollection(points) {
  const normalizedPoints = (Array.isArray(points) ? points : [])
    .map((point, index) => normalizeTourRoutePoint(point?.data || point, index))
    .filter(Boolean)
    .sort((a, b) => a.dayNumber - b.dayNumber || a.stopOrder - b.stopOrder);

  const totalPoints = normalizedPoints.length;

  return {
    type: 'FeatureCollection',
    features: normalizedPoints.map((point, index) => {
      const isStart = index === 0;
      const isEnd = index === totalPoints - 1;
      const stepNumber = index + 1;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point.data.geometry.coordinates,
        },
        properties: {
          id: point.id,
          point_id: point.point_id ?? point.id,
          spot_id: point.spot_id ?? point.point_id ?? point.id,
          slug: point.slug || point.data?.slug || point.data?.spot_slug || point.data?.spot?.slug || null,
          stop_order: point.stopOrder,
          step_number: stepNumber,
          name: point.data.name,
          address: point.data.address || '',
          is_start: isStart,
          is_end: isEnd,
          total_points: totalPoints,
        },
      };
    }),
  };
}
