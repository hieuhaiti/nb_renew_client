const viteEnv = import.meta.env;

export const env = {
  isDev: viteEnv.DEV,

  apiBaseUrl: viteEnv.VITE_BASE_URL ?? '',
  apiBaseUrlBE: viteEnv.VITE_BASE_URL_BE ?? '',
  openWeatherUrlBase: viteEnv.VITE_OPENWEATHER_URL_BASE ?? '',
  weatherApiUrlBase: viteEnv.VITE_WEATHERAPI_URL_BASE ?? '',
  tomtomUrlBase: viteEnv.VITE_TOMTOM_URL_BASE ?? '',

  mapboxToken: viteEnv.VITE_MAPBOX_TOKEN ?? '',
  openWeatherApiKey: viteEnv.VITE_OPENWEATHER_API_KEY ?? '',
  weatherApiKey: viteEnv.VITE_WEATHERAPI_API_KEY ?? '',
  tomtomApiKey: viteEnv.VITE_TOMTOM_API_KEY ?? '',

  minimapMapboxStyle_Satellite: viteEnv.VITE_MAPBOX_STYLE_Satellite_MiniMap ?? '',
  minimapMapboxStyle_Street: viteEnv.VITE_MAPBOX_STYLE_Street_MiniMap ?? '',
  mapboxStyle_Outdoor: viteEnv.VITE_MAPBOX_STYLE_Outdoor ?? '',
  mapboxStyle_Street: viteEnv.VITE_MAPBOX_STYLE_Street ?? '',
  mapboxStyle_Satellite: viteEnv.VITE_MAPBOX_STYLE_Satellite ?? '',
  mapboxStyle_Satellite_Street: viteEnv.VITE_MAPBOX_STYLE_Satellite_Street ?? '',
};
