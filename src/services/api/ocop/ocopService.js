import { useApiQuery } from '@/services/useApi';

export function useGetOcopProducts({
  page,
  limit,
  search,
  category,
  province_code,
  star_rating,
  params = {},
  options = {},
} = {}) {
  const qs = new URLSearchParams({ ...params });
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (search) qs.set('search', search);
  if (category) qs.set('category', category);
  if (province_code) qs.set('province_code', province_code);
  if (star_rating) qs.set('star_rating', star_rating);

  const queryKey = [
    'ocop',
    page || 'all',
    limit || 'all',
    search || '',
    category || '',
    province_code || '',
    star_rating || '',
  ];

  return useApiQuery(queryKey, `ocop?${qs.toString()}`, options);
}

export function useGetOcopCategories(options = {}) {
  return useApiQuery(['ocop', 'categories'], 'ocop/categories', options);
}

export function useGetOcopById(ocopId, options = {}) {
  return useApiQuery(['ocop', 'detail', ocopId], `ocop/${ocopId}`, {
    enabled: Boolean(ocopId) && (options.enabled ?? true),
    ...options,
  });
}
