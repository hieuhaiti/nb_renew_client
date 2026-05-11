// Public API for the satellite feature

// Components
export { SatelliteLayerManager } from './components/SatelliteLayerManager';
export { SatelliteLayerControl } from './components/SatelliteLayerControl';
export { SatelliteStatsPanel } from './components/SatelliteStatsPanel';
export { SatelliteMapOverlayControls } from './components/SatelliteMapOverlayControls';
export { SatelliteEmptyState } from './components/SatelliteEmptyState';
export { SatelliteLoadingState } from './components/SatelliteLoadingState';
export { SatelliteErrorState } from './components/SatelliteErrorState';
export { SatelliteImagePlaceholder } from './components/SatelliteImagePlaceholder';
export { CompareSatellitePlaceholder } from './components/CompareSatellitePlaceholder';

// Store
export { useSatelliteStore } from './store/useSatelliteStore';

// Hooks
export {
  useSatelliteRgbMutation,
  useSatelliteNdviMutation,
  useSatelliteHeatMapMutation,
  useSatelliteClassifiedMutation,
  useSatelliteCompareMutation,
  useSatelliteChangeMutation,
} from './hooks/useSatelliteMutations';

// Services
export {
  getSatelliteRgb,
  getSatelliteNdvi,
  getSatelliteHeatMap,
  getSatelliteClassified,
  getSatelliteCompare,
  getSatelliteChange,
  SatelliteService,
} from './services/satelliteService';

// Utils
export * from './utils/satelliteGeometry.util';
export * from './utils/satelliteMapLayer.util';
export * from './utils/satelliteUtils';

// Constants
export {
  SATELLITE_ENDPOINTS,
} from './api/satelliteEndpoints';
export {
  LAYER_CONFIG,
  SINGLE_LAYER_ENTRIES,
  COMPARE_LAYER_ENTRIES,
  COLLECTION_OPTIONS,
  FALLBACK_LEGENDS,
} from './constants/satelliteConstants';
