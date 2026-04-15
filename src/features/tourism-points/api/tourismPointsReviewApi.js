import { useApiQuery, useApiMutation } from '@/services/useApi';

const BASE = 'tourism-reviews';

export function useGetTourismReviewByTourismPointId({
  page = 1,
  limit = 20,
  tourismPointId,
} = {}) {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  params.set('is_active', 'true');

  const queryKey = ['tourism-reviews', tourismPointId, page, limit];

  return useApiQuery(
    queryKey,
    `${BASE}/point/${tourismPointId}?${params.toString()}&is_active=true`,
    {
      enabled: !!tourismPointId,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useReviewStats(tourismPointId) {
  return useApiQuery(
    ['tourism-reviews', 'stats', tourismPointId],
    `${BASE}/stats/${tourismPointId}?is_active=true`,
    {
      enabled: !!tourismPointId,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useTourismReviewById(id) {
  return useApiQuery(['tourism-reviews', 'detail', id], `${BASE}/${id}`, {
    enabled: !!id,
  });
}

export function useCreateTourismReview(options = {}) {
  return useApiMutation(
    ['tourism-reviews', 'create'],
    `${BASE}`,
    'POST',
    options
  );
}

export function useDeleteTourismReview(id, options = {}) {
  return useApiMutation(
    ['tourism-reviews', 'delete', id],
    `${BASE}/${id}?is_active=true`,
    'DELETE',
    options
  );
}
