import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { getWeatherAlertFromMetrics } from '@/features/weather/helpers/weatherLevelHelpers';
import { fetchOpenWeatherOverview } from '@/features/weather/services/openWeatherService';

/**
 * useWeatherOverview — fetches weather + AQI and derives alert state.
 */
export function useWeatherOverview({ lat, lng, lang }) {
  const isConfigured = Boolean(env.openWeatherUrlBase && env.openWeatherApiKey);
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

  const query = useQuery({
    queryKey: ['weather', 'overview', lat, lng, lang],
    queryFn: async () => {
      const payload = await fetchOpenWeatherOverview({ lat, lng, lang });

      const alert = getWeatherAlertFromMetrics({
        aqiValue: payload?.aqiValue,
        tempC: payload?.weather?.main?.temp,
        windMps: payload?.weather?.wind?.speed,
        weatherMain: payload?.weather?.weather?.[0]?.main,
      });

      return {
        ...payload,
        alert,
      };
    },
    enabled: isConfigured && hasCoordinates,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    isConfigured,
  };
}
