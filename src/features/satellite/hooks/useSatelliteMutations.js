import { useApiMutation } from '@/services/useApi';
import { SATELLITE_ENDPOINTS } from '../api/satelliteEndpoints';

export function useSatelliteRgbMutation(options = {}) {
  return useApiMutation(['satellite', 'rgb'], SATELLITE_ENDPOINTS.rgb, 'POST', {
    ...options,
    onSuccess: undefined,
  });
}

export function useSatelliteNdviMutation(options = {}) {
  return useApiMutation(['satellite', 'ndvi'], SATELLITE_ENDPOINTS.ndvi, 'POST', options);
}

export function useSatelliteHeatMapMutation(options = {}) {
  return useApiMutation(['satellite', 'heatmap'], SATELLITE_ENDPOINTS.heatmap, 'POST', options);
}

export function useSatelliteClassifiedMutation(options = {}) {
  return useApiMutation(
    ['satellite', 'classified'],
    SATELLITE_ENDPOINTS.classified,
    'POST',
    options
  );
}

export function useSatelliteCompareMutation(options = {}) {
  return useApiMutation(['satellite', 'compare'], SATELLITE_ENDPOINTS.compare, 'POST', options);
}

export function useSatelliteChangeMutation(options = {}) {
  return useApiMutation(['satellite', 'change'], SATELLITE_ENDPOINTS.change, 'POST', options);
}
