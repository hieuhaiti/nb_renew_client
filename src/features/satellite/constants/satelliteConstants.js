import {
  getSatelliteRgb,
  getSatelliteNdvi,
  getSatelliteHeatMap,
  getSatelliteClassified,
  getSatelliteCompare,
} from '../services/satelliteService';

export const COLLECTION_OPTIONS = [
  { value: 'S2', label: 'Sentinel-2' },
  { value: 'L8', label: 'Landsat 8' },
  { value: 'L9', label: 'Landsat 9' },
];

export const CLOUD_COVER_MIN = 0;
export const CLOUD_COVER_MAX = 100;
export const CLOUD_COVER_DEFAULT = 20;

export const LAYER_CONFIG = {
  rgb: {
    key: 'rgb',
    labelKey: 'satellite.layers.rgb',
    color: 'bg-blue-500',
    service: getSatelliteRgb,
    descKey: 'satellite.layers.rgb_desc',
    supportCompare: true,
  },
  ndvi: {
    key: 'ndvi',
    labelKey: 'satellite.layers.ndvi',
    color: 'bg-green-500',
    service: getSatelliteNdvi,
    descKey: 'satellite.layers.ndvi_desc',
    supportCompare: true,
  },
  heatmap: {
    key: 'heatmap',
    labelKey: 'satellite.layers.heatmap',
    color: 'bg-purple-500',
    service: getSatelliteHeatMap,
    descKey: 'satellite.layers.heatmap_desc',
    supportCompare: true,
  },
  classified: {
    key: 'classified',
    labelKey: 'satellite.layers.classified',
    color: 'bg-orange-500',
    service: getSatelliteClassified,
    descKey: 'satellite.layers.classified_desc',
    supportCompare: false,
  },
  change: {
    key: 'change',
    labelKey: 'satellite.layers.change',
    color: 'bg-red-500',
    service: getSatelliteCompare,
    descKey: 'satellite.layers.change_desc',
    supportCompare: false,
  },
};

export const SINGLE_LAYER_ENTRIES = Object.entries(LAYER_CONFIG).filter(([id]) => id !== 'change');

export const COMPARE_LAYER_ENTRIES = Object.entries(LAYER_CONFIG).filter(
  ([, cfg]) => cfg.supportCompare
);

/** Static fallback legends when server provides no legend data */
export const FALLBACK_LEGENDS = {
  ndvi: [
    { label: '< 0', color: '#8B0000' },
    { label: '0-0.1', color: '#FF0000' },
    { label: '0.1-0.2', color: '#FFA500' },
    { label: '0.2-0.3', color: '#FFFF00' },
    { label: '0.3-0.45', color: '#ADFF2F' },
    { label: '0.45-0.6', color: '#00FF00' },
    { label: '> 0.6', color: '#006400' },
  ],
  heatmap: [
    { labelKey: 'satellite.legend.heatmap.very_cool', color: '#313695' },
    { labelKey: 'satellite.legend.heatmap.cool', color: '#74add1' },
    { labelKey: 'satellite.legend.heatmap.moderate', color: '#e0f3f8' },
    { labelKey: 'satellite.legend.heatmap.warm', color: '#fee090' },
    { labelKey: 'satellite.legend.heatmap.hot', color: '#f46d43' },
    { labelKey: 'satellite.legend.heatmap.very_hot', color: '#a50026' },
  ],
  classified: [
    { labelKey: 'satellite.legend.classified.water', color: '#4472C4' },
    { labelKey: 'satellite.legend.classified.bare_land', color: '#ED7D31' },
    { labelKey: 'satellite.legend.classified.shrub_grass', color: '#FFC000' },
    { labelKey: 'satellite.legend.classified.agriculture', color: '#70AD47' },
    { labelKey: 'satellite.legend.classified.open_forest', color: '#00B050' },
    { labelKey: 'satellite.legend.classified.evergreen_forest', color: '#006400' },
    { labelKey: 'satellite.legend.classified.urban', color: '#FF0000' },
  ],
  change: [
    { labelKey: 'satellite.legend.change.no_change', color: '#808080' },
    { labelKey: 'satellite.legend.change.vegetation_loss', color: '#FF0000' },
    { labelKey: 'satellite.legend.change.vegetation_gain', color: '#00FF00' },
    { labelKey: 'satellite.legend.change.road_construction', color: '#00FFFF' },
    { labelKey: 'satellite.legend.change.vegetation_loss_road', color: '#FF00FF' },
  ],
};
