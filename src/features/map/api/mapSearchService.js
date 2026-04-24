import { useApiQuery } from '@/services/useApi';

function buildPointsSearchEndpoint({
  search,
  page = 1,
  limit = 8,
  category_id,
  status = 'active',
  sortBy = 'created_at',
  sortOrder = 'DESC',
} = {}) {
  const query = new URLSearchParams();

  if (page) query.set('page', String(page));
  if (limit) query.set('limit', String(limit));
  if (search) query.set('search', String(search));
  if (category_id != null) query.set('category_id', String(category_id));
  if (status) query.set('status', String(status));
  if (sortBy) query.set('sortBy', String(sortBy));
  if (sortOrder) query.set('sortOrder', String(sortOrder));

  // Backend currently exposes map entities under `points` (not `spots`) in /v1/api.
  return `points?${query.toString()}`;
}

export function useSearchSpotsQuery(params = {}, options = {}) {
  const trimmedSearch = params?.search?.trim?.() || '';

  return useApiQuery(
    [
      'map',
      'search',
      'points',
      trimmedSearch,
      params?.page || 1,
      params?.limit || 8,
      params?.category_id || null,
      params?.status || 'active',
      params?.sortBy || 'created_at',
      params?.sortOrder || 'DESC',
    ],
    buildPointsSearchEndpoint({ ...params, search: trimmedSearch }),
    {
      staleTime: 2 * 60 * 1000,
      enabled: trimmedSearch.length >= 2 && (options.enabled ?? true),
      ...options,
    },
    false
  );
}

export function normalizeSpotsSearchResults(payload) {
  const fromData = payload?.data || payload;

  const candidates = [
    fromData?.spots,
    fromData?.points,
    fromData?.features,
    payload?.spots,
    payload?.points,
    payload?.features,
  ];

  const sourceItems = candidates.find((items) => Array.isArray(items)) || [];

  return sourceItems
    .map((item, index) => {
      const properties = item?.properties || {};
      const geometry = item?.geometry_data || item?.geometry;
      const coordinates =
        geometry?.type === 'Point' && Array.isArray(geometry?.coordinates)
          ? geometry.coordinates
          : Array.isArray(item?.coordinates)
            ? item.coordinates
            : null;

      return {
        id: item?.id ?? properties?.id ?? `search-${index}`,
        slug: item?.slug ?? properties?.slug ?? null,
        name:
          item?.name_vi ||
          item?.name_en ||
          item?.name ||
          properties?.name_vi ||
          properties?.name ||
          'Unknown destination',
        description:
          item?.description_vi ||
          item?.description_en ||
          item?.description ||
          properties?.description_vi ||
          properties?.description ||
          '',
        category_id: item?.category_id ?? properties?.category_id ?? null,
        subcategory_id: item?.subcategory_id ?? properties?.subcategory_id ?? null,
        address:
          item?.address_vi ||
          item?.address_en ||
          item?.address ||
          properties?.address_vi ||
          properties?.address ||
          '',
        coordinates:
          Array.isArray(coordinates) && coordinates.length >= 2
            ? [Number(coordinates[0]), Number(coordinates[1])]
            : null,
        raw: item,
      };
    })
    .filter((item) => item?.id != null);
}
