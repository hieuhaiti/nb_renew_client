import { useApiQuery, useApiMutation } from '@/services/useApi';

export function useGetAllDataPoints({
  limit,
  page,
  search = '',
  // TODO: subcategory_id is not a documented param for GET /spots in the Postman spec.
  subcategory_id,
  category_id,
  options = {},
} = {}) {
  const queryParams = new URLSearchParams();

  if (limit) queryParams.set('limit', limit);
  if (page) queryParams.set('page', page);
  if (category_id) queryParams.set('category_id', category_id);
  if (search) queryParams.set('search', search);
  if (subcategory_id) queryParams.set('subcategory_id', subcategory_id);

  return useApiQuery(
    ['spots', limit, page, search, subcategory_id, category_id],
    `spots?${queryParams.toString()}`,
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
}

export function useGetDataPointById({ point_id } = {}) {
  return useApiQuery(
    ['spots', 'detail', point_id],
    `spots/${point_id}`,
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
} = {}) {
  const enabled = typeof lat === 'number' && typeof lng === 'number';

  const endpoint = `spots/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius_km=${encodeURIComponent(radius_km)}`;

  return useApiQuery(['spots', 'nearby', lat, lng, radius_km], endpoint, {
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
