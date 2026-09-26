import { useApiQuery, useApiMutation } from '@/services/useApi';

export function useGetVlogs({
  page = 1,
  limit = 12,
  search,
  platform,
  sortBy = 'created_at',
  sortOrder = 'DESC',
  params = {},
  options = {},
} = {}) {
  const qs = new URLSearchParams({ ...params });
  if (page) qs.set('page', String(page));
  if (limit) qs.set('limit', String(limit));
  if (search) qs.set('search', search);
  if (platform) qs.set('platform', platform);
  if (sortBy) qs.set('sortBy', sortBy);
  if (sortOrder) qs.set('sortOrder', sortOrder);

  const queryKey = [
    'vlogs',
    page,
    limit,
    search || '',
    platform || '',
    sortBy,
    sortOrder,
  ];

  return useApiQuery(queryKey, `vlogs?${qs.toString()}`, options);
}

export function useGetVlogById(id, options = {}) {
  return useApiQuery(['vlogs', 'detail', id], `vlogs/${encodeURIComponent(String(id || ''))}`, {
    enabled: Boolean(id) && (options.enabled ?? true),
    ...options,
  });
}

export function useCreateVlog(options = {}) {
  return useApiMutation(['vlogs', 'create'], 'vlogs', 'POST', options);
}
