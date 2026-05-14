/**
 * TomTom Traffic Service
 * Handles API requests for Traffic Flow and Incident data
 */

import { env } from '@/config/env';

const TOMTOM_BASE_URL = env.tomtomUrlBase;
const TOMTOM_API_KEY = env.tomtomApiKey;

/**
 * Calculate bounds from GeoJSON FeatureCollection
 * @param {Object} geojson - GeoJSON FeatureCollection
 * @returns {Object} Bounds {minLat, maxLat, minLon, maxLon}
 */
export const calculateBoundsFromGeoJSON = (geojson) => {
  if (!geojson?.features || geojson.features.length === 0) {
    throw new Error('Invalid GeoJSON: no features found');
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  const updateBounds = (lon, lat) => {
    if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) {
      return; // Skip invalid coordinates
    }
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  };

  geojson.features.forEach((feature) => {
    const geometry = feature.geometry;

    if (!geometry || !geometry.coordinates) return;

    const processCoordinates = (coords) => {
      // Check if this is a coordinate pair [lon, lat]
      if (
        Array.isArray(coords) &&
        coords.length >= 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number'
      ) {
        updateBounds(coords[0], coords[1]);
      } else if (Array.isArray(coords)) {
        // Nested array - recurse
        coords.forEach(processCoordinates);
      }
    };

    processCoordinates(geometry.coordinates);
  });

  // Validate bounds
  if (!isFinite(minLat) || !isFinite(maxLat) || !isFinite(minLon) || !isFinite(maxLon)) {
    throw new Error('Could not calculate valid bounds from GeoJSON');
  }

  // calculated bounds

  return { minLat, maxLat, minLon, maxLon };
};

/**
 * Fetch traffic incidents from TomTom Incident API
 * @param {Object|Object} boundsOrGeoJSON - Map bounds {minLat, maxLat, minLon, maxLon} Por GeoJSON FeatureCollection
 * @param {number} zoom - Current map zoom level
 * @returns {Promise<Object>} Traffic incident data
 */
export const fetchTrafficIncidents = async (boundsOrGeoJSON, zoom = 10) => {
  try {
    // Check if input is GeoJSON or bounds object
    let bounds;
    if (boundsOrGeoJSON?.type === 'FeatureCollection') {
      bounds = calculateBoundsFromGeoJSON(boundsOrGeoJSON);
    } else {
      bounds = boundsOrGeoJSON;
    }

    // Clamp lat/lng to valid ranges (important for 3D maps!)
    // Latitude: -85 to +85 (Web Mercator limits)
    // Longitude: -180 to +180
    const clampLat = (lat) => Math.max(-85, Math.min(85, lat));
    const clampLng = (lng) => Math.max(-180, Math.min(180, lng));

    let { minLat, maxLat, minLon, maxLon } = bounds;

    // Clamp all coordinates
    minLat = clampLat(minLat);
    maxLat = clampLat(maxLat);
    minLon = clampLng(minLon);
    maxLon = clampLng(maxLon);

    // Ensure min < max (swap if needed)
    if (minLat > maxLat) [minLat, maxLat] = [maxLat, minLat];
    if (minLon > maxLon) [minLon, maxLon] = [maxLon, minLon];

    const zoomLevel = Math.round(zoom);

    // TomTom API v4 bbox format: minLat,minLon,maxLat,maxLon (LAT first for v4!)
    // This is different from v5 which uses lon,lat
    const bboxStr = `${minLat.toFixed(6)},${minLon.toFixed(6)},${maxLat.toFixed(
      6
    )},${maxLon.toFixed(6)}`;

    const url = `${TOMTOM_BASE_URL}/4/incidentDetails/s3/${bboxStr}/${zoomLevel}/-1/json?key=${TOMTOM_API_KEY}&projection=EPSG4326&language=vi-VN&geometries=original`;

    const response = await fetch(url);

    if (!response.ok) {
      // Try to get error details
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
      } catch (e) {
        // Not JSON
      }

      throw new Error(`TomTom Incident API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching traffic incidents:', error);
    throw error;
  }
};

/**
 * Transform TomTom Incident data to GeoJSON
 * @param {Object} incidentData - Raw TomTom incident response
 * @returns {Object} GeoJSON FeatureCollection
 */
export const transformIncidentsToGeoJSON = (incidentData) => {
  // TomTom API v4 structure: tm.poi array
  if (!incidentData?.tm?.poi || !Array.isArray(incidentData.tm.poi)) {
    console.warn('⚠️ No incidents found in response');
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }

  const features = incidentData.tm.poi.map((incident) => {
    // Extract coordinates from different possible formats
    let coordinates = [0, 0];

    if (incident.p?.y && incident.p?.x) {
      // Format: p: { y: lat, x: lon }
      coordinates = [incident.p.x, incident.p.y];
    } else if (incident.geometry?.coordinates) {
      coordinates = incident.geometry.coordinates;
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates,
      },
      properties: {
        id: incident.id || '',
        iconCategory: incident.ic || 0,
        magnitudeOfDelay: incident.d || 0,
        description: incident.d || incident.cs || 'Sự cố giao thông',
        from: incident.f || '',
        to: incident.t || '',
        length: incident.l || 0,
        delay: incident.dl || 0,
        roadNumbers: incident.r || [],
        startTime: incident.sd || '',
        endTime: incident.ed || '',
      },
    };
  });

  // transformed incidents

  return {
    type: 'FeatureCollection',
    features,
  };
};
