const viteEnv = import.meta.env;

export const env = {
  isDev: viteEnv.DEV,
  apiBaseUrl: viteEnv.VITE_BASE_URL ?? '',
  apiBaseUrlBE: viteEnv.VITE_BASE_URL_BE ?? '',
  openWeatherUrlBase:
    viteEnv.VITE_OPENWEATHER_URL_BASE ?? 'https://api.openweathermap.org/data/2.5',
  weatherApiUrlBase: viteEnv.VITE_WEATHERAPI_URL_BASE ?? '',
  tomtomUrlBase: viteEnv.VITE_TOMTOM_URL_BASE ?? '',

  mapboxToken: viteEnv.VITE_MAPBOX_TOKEN ?? '',
  openWeatherApiKey: viteEnv.VITE_OPENWEATHER_API_KEY ?? '',
  weatherApiKey: viteEnv.VITE_WEATHERAPI_API_KEY ?? '',
  tomtomApiKey: viteEnv.VITE_TOMTOM_API_KEY ?? '',
};
