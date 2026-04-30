import { env } from '@/config/env';

const DEFAULT_MAPBOX_GEOCODING_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

function getGeocodingBaseUrl() {
  return (env.mapboxGeocodingBaseUrl || DEFAULT_MAPBOX_GEOCODING_BASE_URL).replace(/\/$/, '');
}

function getMapboxToken() {
  if (!env.mapboxToken) {
    throw new Error('Mapbox access token is not configured.');
  }

  return env.mapboxToken;
}

/**
 * Geocode free-text location to coordinates.
 */
export async function geocodeLocation(locationString, options = {}) {
  const query = String(locationString || '').trim();
  if (!query) {
    throw new Error('Location is required for geocoding.');
  }

  const {
    country = 'vn',
    limit = 1,
    types = ['place', 'address', 'poi'],
    language = 'vi',
  } = options;

  const params = new URLSearchParams({
    access_token: getMapboxToken(),
    country,
    limit: String(limit),
    types: types.join(','),
    language,
  });

  const url = `${getGeocodingBaseUrl()}/${encodeURIComponent(query)}.json?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}.`);
  }

  const data = await response.json();
  const feature = data?.features?.[0];

  if (!feature?.center || feature.center.length < 2) {
    throw new Error(`Cannot find location: ${query}`);
  }

  const [lng, lat] = feature.center;
  return {
    lat,
    lng,
    placeName: feature.place_name,
    address: feature.properties?.address || '',
    context: feature.context || [],
  };
}

/**
 * Get autocomplete suggestions for a location text.
 */
export async function getLocationSuggestions(query, options = {}) {
  const normalizedQuery = String(query || '').trim();
  if (normalizedQuery.length < 2) return [];

  const {
    country = 'vn',
    limit = 5,
    types = ['place', 'address', 'poi'],
    language = 'vi',
    proximity = null,
  } = options;

  const params = new URLSearchParams({
    access_token: getMapboxToken(),
    country,
    limit: String(limit),
    types: types.join(','),
    language,
    autocomplete: 'true',
  });

  if (Array.isArray(proximity) && proximity.length >= 2) {
    params.append('proximity', `${proximity[0]},${proximity[1]}`);
  }

  const url = `${getGeocodingBaseUrl()}/${encodeURIComponent(normalizedQuery)}.json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    return (data?.features || []).map((feature) => ({
      id: feature.id,
      placeName: feature.place_name,
      text: feature.text,
      coordinates: feature.center,
      address: feature.properties?.address || '',
      category: feature.properties?.category || '',
      context: feature.context || [],
    }));
  } catch (_error) {
    return [];
  }
}

/**
 * Reverse geocode coordinates to nearest place.
 */
export async function reverseGeocode(lat, lng, options = {}) {
  const { types = ['place', 'address', 'poi'], language = 'vi' } = options;

  const params = new URLSearchParams({
    access_token: getMapboxToken(),
    types: types.join(','),
    language,
  });

  const url = `${getGeocodingBaseUrl()}/${lng},${lat}.json?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Reverse geocoding request failed with status ${response.status}.`);
  }

  const data = await response.json();
  const feature = data?.features?.[0];

  if (!feature) {
    throw new Error('Cannot find location from coordinates.');
  }

  return {
    placeName: feature.place_name,
    text: feature.text,
    address: feature.properties?.address || '',
    context: feature.context || [],
  };
}
