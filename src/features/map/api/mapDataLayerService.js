import { useApiQuery } from '@/services/useApi';
import { fetcher } from '@/services/fetcher';

function buildSubcategoryPointsEndpoint({ subcategoryId, lang = 'vi', format = 'geojson' }) {
  const queryParams = new URLSearchParams();
  queryParams.set('format', format);
  queryParams.set('lang', lang);

  return `points/subcategory/${subcategoryId}?${queryParams.toString()}`;
}

export function useSubcategoryPointsQuery(
  { subcategoryId, lang = 'vi', format = 'geojson' } = {},
  options = {}
) {
  const endpoint = buildSubcategoryPointsEndpoint({ subcategoryId, lang, format });

  return useApiQuery(
    ['map', 'points', 'subcategory', subcategoryId, lang, format],
    endpoint,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(subcategoryId) && (options.enabled ?? true),
      ...options,
    },
    false
  );
}

export function fetchSubcategoryPoints({ subcategoryId, lang = 'vi', format = 'geojson' } = {}) {
  const endpoint = buildSubcategoryPointsEndpoint({ subcategoryId, lang, format });
  return fetcher(endpoint);
}

function buildPointDetailEndpoint({ pointId, lang = 'vi', format = 'json', isActive = true }) {
  const queryParams = new URLSearchParams();
  queryParams.set('lang', lang);
  queryParams.set('format', format);
  queryParams.set('is_active', isActive ? 'true' : 'false');

  return `points/${pointId}?${queryParams.toString()}`;
}

export function useDestinationPointDetailQuery(
  { pointId, lang = 'vi', format = 'json', isActive = true, selectedAt = 0 } = {},
  options = {}
) {
  const endpoint = buildPointDetailEndpoint({ pointId, lang, format, isActive });

  return useApiQuery(
    ['map', 'destination', 'point-detail', pointId, lang, format, isActive, selectedAt],
    endpoint,
    {
      enabled: Boolean(pointId) && (options.enabled ?? true),
      staleTime: 0,
      refetchOnMount: 'always',
      ...options,
    },
    false
  );
}

export function searchDataPointByName({ search, lang = 'vi', page = 1, limit = 5 } = {}) {
  const keyword = String(search || '').trim();

  if (!keyword) {
    return Promise.resolve({ data: { points: [] } });
  }

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('limit', String(limit));
  queryParams.set('search', keyword);
  queryParams.set('status', 'active');
  queryParams.set('sortBy', 'created_at');
  queryParams.set('sortOrder', 'DESC');

  if (lang) {
    queryParams.set('lang', lang);
  }

  return fetcher(`points?${queryParams.toString()}`);
}
