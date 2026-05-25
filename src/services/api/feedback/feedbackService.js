import { useApiQuery, useApiMutation } from '@/services/useApi';

/**
 * Public list of approved citizen feedbacks.
 * @param {{ page?: number, limit?: number, search?: string, priority?: string }} [params]
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
export function useGetPublicFeedbacks(
  { page, limit, search, priority } = {},
  options = {}
) {
  const qs = new URLSearchParams();
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (search) qs.set('search', search);
  if (priority) qs.set('priority', priority);

  return useApiQuery(
    ['feedbacks', 'public', page || 1, limit || 10, search || '', priority || ''],
    `feedbacks?${qs.toString()}`,
    options,
    false,
    false
  );
}

/**
 * Get a single feedback by ID.
 * @param {string|null} id
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
export function useGetFeedbackById(id, options = {}) {
  return useApiQuery(
    ['feedback', 'detail', id],
    `feedbacks/${id}`,
    { enabled: Boolean(id) && (options.enabled ?? true), ...options },
    false,
    false
  );
}

/**
 * Feedbacks submitted by the currently authenticated user.
 * @param {{ page?: number, limit?: number }} [params]
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
export function useGetMyFeedbacks({ page, limit } = {}, options = {}) {
  const qs = new URLSearchParams();
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);

  return useApiQuery(
    ['feedbacks', 'me', page || 1, limit || 10],
    `feedbacks/me?${qs.toString()}`,
    options,
    false,
    false
  );
}

/**
 * Submit a new citizen feedback (requires auth).
 * @param {import('@tanstack/react-query').UseMutationOptions} [options]
 */
export function useCreateFeedback(options = {}) {
  return useApiMutation(['feedbacks', 'create'], 'feedbacks', 'POST', options);
}
