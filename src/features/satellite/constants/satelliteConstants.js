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
    { label: '0–0.1', color: '#FF0000' },
    { label: '0.1–0.2', color: '#FFA500' },
    { label: '0.2–0.3', color: '#FFFF00' },
    { label: '0.3–0.45', color: '#ADFF2F' },
    { label: '0.45–0.6', color: '#00FF00' },
    { label: '> 0.6', color: '#006400' },
  ],
  heatmap: [
    { label: 'Rất mát (nước, rừng dày)', color: '#313695' },
    { label: 'Mát (20–25°C)', color: '#74add1' },
    { label: 'Trung bình (25–30°C)', color: '#e0f3f8' },
    { label: 'Ấm (thực vật thưa)', color: '#fee090' },
    { label: 'Nóng (đất trống, đô thị)', color: '#f46d43' },
    { label: 'Rất nóng (mái tôn, đường)', color: '#a50026' },
  ],
  classified: [
    { label: 'Nước', color: '#4472C4' },
    { label: 'Đất trống / Đất bazan đỏ', color: '#ED7D31' },
    { label: 'Cây bụi / Thảm cỏ thưa', color: '#FFC000' },
    { label: 'Nông nghiệp / Đất canh tác', color: '#70AD47' },
    { label: 'Rừng khộp / Rừng thưa', color: '#00B050' },
    { label: 'Rừng thường xanh', color: '#006400' },
    { label: 'Đô thị / Công trình', color: '#FF0000' },
  ],
  change: [
    { label: 'Không đổi', color: '#808080' },
    { label: 'ALERT: Giảm thảm thực vật', color: '#FF0000' },
    { label: 'ALERT: Tăng thảm thực vật', color: '#00FF00' },
    { label: 'ALERT: Mở đường / Xây dựng', color: '#00FFFF' },
    { label: 'ALERT: Giảm thực vật + Mở đường', color: '#FF00FF' },
  ],
};
