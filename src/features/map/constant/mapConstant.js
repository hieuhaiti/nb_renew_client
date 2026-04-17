import { env } from '@/config/env';

export const MAP_PAGE_DEFAULT_TOURISM_POINT_SETTINGS = {
  selectedSubcategory: 0,
  page: 1,
};

export const mapDelta = 2;

export const defaultLatLong = { lat: 20.229159, lng: 105.917443 };
export const defaultZoom = 9;
export const defaultStyle = env.mapboxStyle_Outdoor;
export const pitchDefault = (initialTerrain) => (initialTerrain ? 75 : 0);

export const stateBuildingRender = false;
export const stateTerrainRender = false;
