import axios from 'axios';
import { env } from '@/config/env';

/**
 * fetchOpenWeatherOverview — fetches current weather + AQI from OpenWeather APIs.
 */
export async function fetchOpenWeatherOverview({ lat, lng, lang }) {
  const [weatherResponse, aqiResponse] = await Promise.all([
    axios.get(`${env.openWeatherUrlBase}/weather`, {
      params: {
        lat,
        lon: lng,
        lang,
        units: 'metric',
        appid: env.openWeatherApiKey,
      },
    }),
    axios.get(`${env.openWeatherUrlBase}/air_pollution`, {
      params: {
        lat,
        lon: lng,
        appid: env.openWeatherApiKey,
      },
    }),
  ]);

  return {
    weather: weatherResponse?.data ?? null,
    aqiValue: aqiResponse?.data?.list?.[0]?.main?.aqi ?? null,
  };
}
