const viteEnv = import.meta.env;

export const env = {
  isDev: viteEnv.DEV,
  apiBaseUrl: viteEnv.VITE_BASE_URL ?? '',
  apiBaseUrlBE: viteEnv.VITE_BASE_URL_BE ?? '',
};
