import { mutater } from '@/services/mutater';
import { SATELLITE_ENDPOINTS } from '../api/satelliteEndpoints';

export async function getSatelliteRgb(payload) {
  return mutater(SATELLITE_ENDPOINTS.rgb, 'POST', payload);
}

export async function getSatelliteNdvi(payload) {
  return mutater(SATELLITE_ENDPOINTS.ndvi, 'POST', payload);
}

export async function getSatelliteHeatMap(payload) {
  return mutater(SATELLITE_ENDPOINTS.heatmap, 'POST', payload);
}

export async function getSatelliteClassified(payload) {
  return mutater(SATELLITE_ENDPOINTS.classified, 'POST', payload);
}

export async function getSatelliteCompare(payload) {
  return mutater(SATELLITE_ENDPOINTS.compare, 'POST', payload);
}

export async function getSatelliteChange(payload) {
  return mutater(SATELLITE_ENDPOINTS.change, 'POST', payload);
}

const LAYER_SERVICE_MAP = {
  rgb: getSatelliteRgb,
  ndvi: getSatelliteNdvi,
  heatmap: getSatelliteHeatMap,
  'heat-map': getSatelliteHeatMap,
  classified: getSatelliteClassified,
  change: getSatelliteCompare,
};

export const SatelliteService = {
  async getSatelliteImage(params) {
    const key = (params?.layerType || params?.type || 'rgb').toLowerCase();
    const fn = LAYER_SERVICE_MAP[key] || getSatelliteRgb;
    return fn({
      geometry: params.geometry,
      startDate: params.startDate,
      endDate: params.endDate,
      collection: params.collection,
      cloudCover: params.cloudCover,
    });
  },

  async compareImages(params) {
    return getSatelliteCompare({
      geometry: params.geometry,
      startDate1: params.startDate1,
      endDate1: params.endDate1,
      startDate2: params.startDate2,
      endDate2: params.endDate2,
      collection: params.collection,
      cloudCover: params.cloudCover,
    });
  },
};
