import { useApiQuery } from '@/services/useApi';

export function useGlobalSearch({ query, page, limit, options = {} } = {}) {
  const qs = new URLSearchParams();
  if (query) qs.set('query', query);
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);

  return useApiQuery(
    ['search', query, page, limit],
    `search?${qs.toString()}`,
    {
      staleTime: 2 * 60 * 1000,
      enabled: Boolean(query) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useSearchByType({ type, query, page, limit, options = {} } = {}) {
  const qs = new URLSearchParams();
  if (query) qs.set('query', query);
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);

  return useApiQuery(
    ['search', 'type', type, query, page, limit],
    `search/${encodeURIComponent(String(type || ''))}?${qs.toString()}`,
    {
      staleTime: 2 * 60 * 1000,
      enabled: Boolean(type) && Boolean(query) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useGetSearchTypes(options = {}) {
  return useApiQuery(['search', 'types'], 'search/types', {
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}
