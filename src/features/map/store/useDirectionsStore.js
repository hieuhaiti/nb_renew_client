import { create } from 'zustand';
import { toast } from 'react-toastify';
import { env } from '@/config/env';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { geocodeLocation, getLocationSuggestions } from '@/services/api/map/geocodingService';

const DIRECTIONS_BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox';

function normalizeCoordinate(input) {
  if (!input || typeof input !== 'object') return null;

  const lng = Number(input.lng);
  const lat = Number(input.lat);
  if (Number.isNaN(lng) || Number.isNaN(lat)) return null;

  return {
    ...input,
    lng,
    lat,
  };
}

export const useDirectionsStore = create((set, get) => ({
  directions: null,
  vehicle: 'driving',
  startLocation: null,
  endLocation: null,
  shouldFocusStart: false,

  setDirections: (directionsData) => set({ directions: directionsData }),
  setVehicle: (vehicle) => set({ vehicle }),
  setStartLocation: (location) => set({ startLocation: normalizeCoordinate(location) }),
  setEndLocation: (location) => set({ endLocation: normalizeCoordinate(location) }),
  triggerFocusStart: () => set({ shouldFocusStart: true }),
  clearFocusStart: () => set({ shouldFocusStart: false }),

  geocodeLocation: async (locationString, options = {}) => {
    return geocodeLocation(locationString, options);
  },

  getLocationSuggestions: async (query, options = {}) => {
    return getLocationSuggestions(query, options);
  },

  getDirections: async (start, end, lang = 'vi') => {
    const { setDirections, vehicle } = get();
    const { setLoadingByKey } = useLoadingStore.getState();
    const loadingKey = 'map-directions-route';

    setLoadingByKey(loadingKey, true);

    try {
      const startPoint = normalizeCoordinate(start);
      const endPoint = normalizeCoordinate(end);

      if (!startPoint || !endPoint) {
        throw new Error('Start and end locations must include valid coordinates.');
      }

      if (!env.mapboxToken) {
        throw new Error('Mapbox access token is not configured.');
      }

      const params = new URLSearchParams({
        geometries: 'geojson',
        alternatives: 'true',
        steps: 'true',
        overview: 'full',
        language: lang,
        access_token: env.mapboxToken,
      });

      const url =
        `${DIRECTIONS_BASE_URL}/${vehicle}/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}.json?` +
        params.toString();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Directions request failed with status ${response.status}.`);
      }

      const data = await response.json();
      const route = data?.routes?.[0];

      if (!route) {
        throw new Error('Cannot find route for selected locations.');
      }

      setDirections(route);
      set({
        startLocation: startPoint,
        endLocation: endPoint,
      });
    } catch (error) {
      toast.error(error?.message || 'Cannot calculate directions.');
      throw error;
    } finally {
      setLoadingByKey(loadingKey, false);
    }
  },

  getDirectionsByLocationStrings: async (startLocationString, endLocationString, lang = 'vi') => {
    const { geocodeLocation: geocode, getDirections: computeDirections } = get();
    const { setLoadingByKey } = useLoadingStore.getState();
    const loadingKey = 'map-directions-geocode';

    setLoadingByKey(loadingKey, true);

    try {
      const startPlace = String(startLocationString?.placeName || '').trim();
      const endPlace = String(endLocationString?.placeName || '').trim();

      if (!startPlace || !endPlace) {
        throw new Error('Start and end locations are required.');
      }

      const startCoords = await geocode(startPlace, { language: lang });
      const endCoords = await geocode(endPlace, { language: lang });
      await computeDirections(startCoords, endCoords, lang);
    } catch (error) {
      toast.error(error?.message || 'Cannot calculate directions from text inputs.');
      throw error;
    } finally {
      setLoadingByKey(loadingKey, false);
    }
  },

  clearAllStateDirections: () =>
    set({
      directions: null,
      startLocation: null,
      endLocation: null,
    }),

  clearDirections: () => set({ directions: null }),

  formatDuration: (durationInSeconds) => {
    const totalSeconds = Number(durationInSeconds) || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  },

  formatDistance: (distanceInMeters) => {
    const meters = Number(distanceInMeters) || 0;

    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }

    return `${Math.round(meters)} m`;
  },
}));
