import { useApiQuery } from '@/services/useApi';

export function useGetAllTours({
  page,
  limit,
  search,
  params = {},
  options = {},
} = {}) {
  const qs = new URLSearchParams({ ...params });
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (search) qs.set('search', search);

  return useApiQuery(
    ['tours', page || 'all', limit || 'all', search || ''],
    `tours?${qs.toString()}`,
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
