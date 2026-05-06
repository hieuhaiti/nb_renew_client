import { useApiQuery, useApiMutation } from '@/services/useApi';

export function useGetCulinaryList({ page, limit, search, options = {} } = {}) {
  const qs = new URLSearchParams();
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (search) qs.set('search', search);

  return useApiQuery(
    ['culinary', page, limit, search],
    `culinary?${qs.toString()}`,
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
}

export function useGetCulinaryById({ id, options = {} } = {}) {
  return useApiQuery(
    ['culinary', 'detail', id],
    `culinary/${id}`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(id) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useCreateCulinary(options = {}) {
  return useApiMutation(['culinary', 'create'], 'culinary', 'POST', options);
}

export function useUpdateCulinary(id, options = {}) {
  return useApiMutation(['culinary', 'update', id], `culinary/${id}`, 'PUT', options);
}

export function useDeleteCulinary(id, options = {}) {
  return useApiMutation(['culinary', 'delete', id], `culinary/${id}`, 'DELETE', options);
}
