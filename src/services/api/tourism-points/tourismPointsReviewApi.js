import { useApiQuery, useApiMutation } from '@/services/useApi';

const BASE = 'ratings';

export function useGetTourismReviewByTourismPointId({
  page = 1,
  limit = 20,
  tourismPointId,
} = {}) {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  params.set('spot_id', tourismPointId);

  const queryKey = ['ratings', 'spot', tourismPointId, page, limit];

  return useApiQuery(
    queryKey,
    `${BASE}?${params.toString()}`,
    {
      enabled: !!tourismPointId,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useTourismReviewById(id) {
  return useApiQuery(['ratings', 'detail', id], `${BASE}/${id}`, {
    enabled: !!id,
  });
}

export function useCreateTourismReview(options = {}) {
  return useApiMutation(
    ['ratings', 'create'],
    `${BASE}`,
    'POST',
    options
  );
}

export function useDeleteTourismReview(id, options = {}) {
  return useApiMutation(
    ['ratings', 'delete', id],
    `${BASE}/${id}`,
    'DELETE',
    options
  );
}
