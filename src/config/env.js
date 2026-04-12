export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'NB Renew Client',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  mapboxAccessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? '',
};
