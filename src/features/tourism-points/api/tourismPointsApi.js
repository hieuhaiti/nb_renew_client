import { useApiQuery, useApiMutation } from '@/services/useApi';
import i18next from 'i18next';

export function useGetAllDataPoints({
  format = 'geojson',
  is_active = true,
  limit,
  page,
  search = '',
  subcategory_id,
  category_id,
  options = {},
} = {}) {
  const lang = i18next.language || 'vi';
  const queryParams = new URLSearchParams({
    lang,
    format,
    is_active: is_active ? 'true' : 'false',
  });

  if (limit) queryParams.set('limit', limit);
  if (page) queryParams.set('page', page);
  if (subcategory_id) queryParams.set('subcategory_id', subcategory_id);
  if (category_id) queryParams.set('category_id', category_id);
  if (search) queryParams.set('search', search);

  return useApiQuery(
    ['points', lang, format, limit, page, search, subcategory_id, category_id],
    `points?${queryParams.toString()}`,
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    } // React Query v5 uses placeholderData instead of keepPreviousData, but we let useApi query handle it
  );
}

export function useGetDataPointById({ point_id, format = 'geojson', is_active = true } = {}) {
  const lang = i18next.language || 'vi';

  return useApiQuery(
    ['points', 'detail', lang, point_id],
    `points/${point_id}?lang=${lang}&format=${format}&is_active=${is_active ? 'true' : 'false'}`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: !!point_id,
    }
  );
}

export function useGetNearbyPoints({
  lat,
  lng,
  radius_km = 1,
  format = 'geojson',
  is_active = true,
} = {}) {
  const lang = i18next.language || 'vi';
  const enabled = typeof lat === 'number' && typeof lng === 'number';

  const endpoint = `points/nearby?lat=${encodeURIComponent(
    lat
  )}&lng=${encodeURIComponent(lng)}&radius_km=${encodeURIComponent(
    radius_km
  )}&lang=${lang}&format=${format}&is_active=${is_active ? 'true' : 'false'}`;

  return useApiQuery(['points', 'nearby', lang, lat, lng, radius_km], endpoint, {
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
