import { useApiQuery, useApiQueries } from '@/services/useApi';
import { fetcher } from '@/services/fetcher';

export function useSubcategoryPointsQuery({ subcategoryId } = {}, options = {}) {
  const categoryIds = JSON.stringify([subcategoryId]);

  return useApiQuery(
    ['map', 'points', 'subcategory', subcategoryId],
    `spots?category_ids=${categoryIds}&status=active&limit=500`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(subcategoryId) && (options.enabled ?? true),
      ...options,
    },
    false
  );
}

export function fetchSubcategoryPoints({ subcategoryId } = {}) {
  const categoryIds = JSON.stringify([subcategoryId]);
  return fetcher(`spots?category_ids=${categoryIds}&status=active&limit=100`);
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

export function useSubcategoryLayerQuery({ subcategoryIds = [], lang = 'vi' } = {}) {
  const ids = Array.isArray(subcategoryIds) ? subcategoryIds.filter(Boolean) : [];

  return useApiQueries(
    {
      queries:
        ids.length > 0
          ? [
              {
                queryKey: ['map', 'points', 'subcategory', lang, ids],
                endPoint: `spots?category_ids=${JSON.stringify(ids)}&status=active&limit=100&capacity=true`,
                staleTime: 5 * 60 * 1000,
                enabled: Boolean(ids.length),
              },
            ]
          : [],
    },
    false
  );
}
