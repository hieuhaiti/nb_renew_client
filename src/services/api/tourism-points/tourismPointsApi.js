import { useApiQuery, useApiQueries } from '@/services/useApi';

export function useGetAllDataPoints({
  limit,
  page,
  search = '',
  subcategory_id,
  category_id,
  parent_category_id,
  category_ids,
  options = {},
} = {}) {
  const queryParams = new URLSearchParams();

  if (limit) queryParams.set('limit', limit);
  if (page) queryParams.set('page', page);
  if (Array.isArray(category_ids) && category_ids.length > 0) {
    queryParams.set('category_ids', JSON.stringify(category_ids));
  } else if (parent_category_id) {
    queryParams.set('parent_category_id', parent_category_id);
  } else if (category_id) {
    queryParams.set('category_id', category_id);
  }
  if (search) queryParams.set('search', search);
  if (subcategory_id) queryParams.set('subcategory_id', subcategory_id);

  return useApiQuery(
    [
      'spots',
      limit,
      page,
      search,
      subcategory_id,
      category_id,
      parent_category_id,
      JSON.stringify(category_ids || []),
    ],
    `spots?${queryParams.toString()}`,
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
}

export function useGetDataPointById({ point_id } = {}) {
  return useApiQuery(['spots', 'detail', point_id], `spots/${point_id}`, {
    staleTime: 5 * 60 * 1000,
    enabled: !!point_id,
  });
}

export function useGetNearbyPoints({ lat, lng, radius_km = 1, limit, options = {} } = {}) {
  const enabled =
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    (options.enabled ?? true);

  const queryParams = new URLSearchParams();
  if (lat != null) queryParams.set('lat', lat);
  if (lng != null) queryParams.set('lng', lng);
  if (radius_km != null) queryParams.set('radius_km', radius_km);
  if (limit != null) queryParams.set('limit', limit);
  const endpoint = `spots/nearby?${queryParams.toString()}`;

  return useApiQuery(['spots', 'nearby', lat, lng, radius_km, limit], endpoint, {
    staleTime: 5 * 60 * 1000,
    enabled,
    ...options,
  });
}

export function useGetFeaturedSpots(options = {}) {
  return useApiQuery(['spots', 'featured'], 'spots/featured', {
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useGetSpotsByBbox({ north, south, east, west, options = {} } = {}) {
  const enabled =
    [north, south, east, west].every((v) => typeof v === 'number') && (options.enabled ?? true);

  const qs = new URLSearchParams();
  if (north != null) qs.set('north', north);
  if (south != null) qs.set('south', south);
  if (east != null) qs.set('east', east);
  if (west != null) qs.set('west', west);

  return useApiQuery(['spots', 'bbox', north, south, east, west], `spots/bbox?${qs.toString()}`, {
    staleTime: 5 * 60 * 1000,
    enabled,
    ...options,
  });
}

export function useGetSpotsGeoJson(options = {}) {
  return useApiQuery(['spots', 'geojson'], 'spots/geojson', {
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useGetSpotMedia({ spot_id, options = {} } = {}) {
  return useApiQuery(['spots', 'media', spot_id], `spots/${spot_id}/media`, {
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(spot_id) && (options.enabled ?? true),
    ...options,
  });
}

export function useGetSpotAudioGuide({ spot_id, options = {} } = {}) {
  return useApiQuery(['spots', 'audio-guide', spot_id], `spots/${spot_id}/audio-guide`, {
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(spot_id) && (options.enabled ?? true),
    ...options,
  });
}

export function useGetSpotCountByCategory({ category_id, options = {} } = {}) {
  return useApiQuery(
    ['spots-count-by-category', category_id],
    `spots?category_id=${category_id}&limit=1&page=1`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(category_id) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useGetSubcategoryCountsQuery({ subcategoryIds = [], enabled = true } = {}) {
  return useApiQueries({
    queries: subcategoryIds.map((id) => ({
      queryKey: ['spots-count-by-subcategory', id],
      endPoint: `spots?category_id=${id}&limit=1&page=1`,
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(enabled),
    })),
  });
}
