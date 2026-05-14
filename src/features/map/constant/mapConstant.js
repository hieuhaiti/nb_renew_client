import { env } from '@/config/env';

export const mapDelta = 1;

export const defaultLatLong = { lat: 20.229159, lng: 105.917443 };
export const defaultZoom = 12;
export const defaultStyle = env.mapboxStyle_Outdoor;
export const pitchDefault = (initialTerrain) => (initialTerrain ? 75 : 0);
export const locateFlyBearing = 0;
export const locateFlyDuration = 1200;

export const stateBuildingRender = false;
export const stateTerrainRender = true;
