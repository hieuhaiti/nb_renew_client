import { useApiQuery, useApiMutation } from '@/services/useApi';

export function useGetCurrentCapacity(options = {}) {
  return useApiQuery(['capacity', 'current'], 'capacity/current', {
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useGetCapacityGeoJson(options = {}) {
  return useApiQuery(['capacity', 'current', 'geojson'], 'capacity/current/geojson', {
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useGetCapacityHistory({ spot_id, options = {} } = {}) {
  return useApiQuery(
    ['capacity', 'history', spot_id],
    `capacity/spots/${spot_id}/history`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(spot_id) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useGetCapacityStats({ spot_id, options = {} } = {}) {
  return useApiQuery(
    ['capacity', 'stats', spot_id],
    `capacity/spots/${spot_id}/stats`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(spot_id) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useGetCapacityAlternatives({ spot_id, options = {} } = {}) {
  return useApiQuery(
    ['capacity', 'alternatives', spot_id],
    `capacity/spots/${spot_id}/alternatives`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(spot_id) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useLogCapacity(spot_id, options = {}) {
  return useApiMutation(
    ['capacity', 'log', spot_id],
    `capacity/spots/${spot_id}/log`,
    'POST',
    options
  );
}
