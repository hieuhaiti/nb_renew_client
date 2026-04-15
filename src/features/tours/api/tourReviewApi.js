import { useApiQuery, useApiMutation } from '@/services/useApi';

const BASE = 'tour-reviews';

export function useGetTourReviewByTourId({
  page = 1,
  limit = 20,
  is_approved = true,
  id,
} = {}) {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  if (is_approved !== undefined) params.set('is_approved', String(is_approved));
  params.set('is_active', 'true');

  const queryKey = ['tour-reviews', 'tour', id, page, limit];

  return useApiQuery(queryKey, `${BASE}/tour/${id}?${params.toString()}`, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTourReviewStats(id) {
  return useApiQuery(
    ['tour-reviews', 'stats', id],
    `${BASE}/stats/${id}?is_active=true`,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useTourReviewById(id) {
  return useApiQuery(['tour-reviews', 'detail', id], `${BASE}/${id}?is_active=true`, {
    enabled: !!id,
  });
}

export function useCreateTourReview(options = {}) {
  return useApiMutation(['tour-reviews', 'create'], `${BASE}`, 'POST', options);
}

export function useDeleteTourReview(id, options = {}) {
  return useApiMutation(['tour-reviews', 'delete', id], `${BASE}/${id}`, 'DELETE', options);
}
