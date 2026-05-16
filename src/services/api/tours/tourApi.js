import { useApiQuery } from '@/services/useApi';

export function useGetAllTours({
  page,
  limit,
  search,
  status,
  province_code,
  is_featured,
  duration_days,
  price_min,
  price_max,
  sortBy,
  sortOrder,
  params = {},
  options = {},
} = {}) {
  const qs = new URLSearchParams({ ...params });
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (search) qs.set('search', search);
  if (status) qs.set('status', status);
  if (province_code) qs.set('province_code', province_code);
  if (typeof is_featured === 'boolean') qs.set('is_featured', is_featured ? 'true' : 'false');
  if (duration_days) qs.set('duration_days', duration_days);
  if (price_min != null && price_min !== '') qs.set('price_min', price_min);
  if (price_max != null && price_max !== '') qs.set('price_max', price_max);
  if (sortBy) qs.set('sortBy', sortBy);
  if (sortOrder) qs.set('sortOrder', sortOrder);

  const queryString = qs.toString();

  return useApiQuery(
    [
      'tours',
      page || 'all',
      limit || 'all',
      search || '',
      status || '',
      province_code || '',
      typeof is_featured === 'boolean' ? String(is_featured) : '',
      duration_days || '',
      price_min ?? '',
      price_max ?? '',
      sortBy || '',
      sortOrder || '',
      queryString,
    ],
    `tours?${queryString}`,
    {
      select: (res) => res?.data ?? { tours: [], pagination: null },
      ...options,
    }
  );
}

export function useGetTourBySlug(slug) {
  return useApiQuery(
    ['tour', slug ?? null],
    `tours/slug/${slug}`,
    {
      enabled: Boolean(slug),
      staleTime: 60 * 1000,
      select: (res) => res?.data?.tour ?? null,
    }
  );
}

export function useGetTourStops(tourId) {
  return useApiQuery(
    ['tourStops', tourId],
    `tours/${tourId}/stops`,
    { enabled: !!tourId }
  );
}
