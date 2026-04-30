import { useApiQuery } from '@/services/useApi';
import { fetcher } from '@/services/fetcher';

export function useSubcategoryPointsQuery({ subcategoryId } = {}, options = {}) {
  return useApiQuery(
    ['map', 'points', 'subcategory', subcategoryId],
    `spots?category_id=${subcategoryId}&status=active&limit=500`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(subcategoryId) && (options.enabled ?? true),
      ...options,
    },
    false
  );
}

export function fetchSubcategoryPoints({ subcategoryId } = {}) {
  return fetcher(`spots?category_id=${subcategoryId}&status=active&limit=100`);
}

function buildPointDetailEndpoint({ pointSlug, pointId }) {
  const identifier = pointSlug || pointId;
  if (!identifier) return '';
  return `spots/${encodeURIComponent(String(identifier))}`;
}

export function useDestinationPointDetailQuery(
  { pointId, pointSlug, lang = 'vi', format = 'json', isActive = true, selectedAt = 0 } = {},
  options = {}
) {
  const endpoint = buildPointDetailEndpoint({ pointSlug, pointId });
  const detailKey = pointSlug || pointId || null;

  return useApiQuery(
    ['map', 'destination', 'point-detail', detailKey, lang, format, isActive, selectedAt],
    endpoint,
    {
      enabled: Boolean(detailKey) && (options.enabled ?? true),
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

  return fetcher(`spots?${queryParams.toString()}`);
}
