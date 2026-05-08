import { useApiQuery, useApiMutation } from '@/services/useApi';

const BASE = 'ratings';

// TODO: The correct filter field for tour reviews is unconfirmed in the Postman spec.
// Using business_id as the closest match — verify with backend team.
export function useGetTourReviewByTourId({
  page = 1,
  limit = 20,
  id,
} = {}) {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  if (id) params.set('business_id', id);

  const queryKey = ['ratings', 'business', id, page, limit];

  return useApiQuery(queryKey, `${BASE}?${params.toString()}`, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// TODO: GET /ratings/:id is not confirmed in the Postman spec for individual review lookup.
export function useTourReviewById(id) {
  return useApiQuery(['ratings', 'detail', id], `${BASE}/${id}`, {
    enabled: !!id,
  });
}

export function useCreateTourReview(options = {}) {
  return useApiMutation(['ratings', 'create'], `${BASE}`, 'POST', options);
}

export function useDeleteTourReview(id, options = {}) {
  return useApiMutation(['ratings', 'delete', id], `${BASE}/${id}`, 'DELETE', options);
}
