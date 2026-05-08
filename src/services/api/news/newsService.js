import { useApiQuery, useApiMutation } from '@/services/useApi';

export function useGetNewsList({
  page,
  limit,
  search,
  is_published,
  is_featured,
  tag,
  params = {},
  options = {},
} = {}) {
  const qs = new URLSearchParams({ ...params });
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (search) qs.set('search', search);
  if (typeof is_published === 'boolean') qs.set('is_published', String(is_published));
  if (typeof is_featured === 'boolean') qs.set('is_featured', String(is_featured));
  if (tag) qs.set('tag', tag);

  const queryKey = [
    'news',
    page || 1,
    limit || 10,
    search || '',
    typeof is_published === 'boolean' ? String(is_published) : '',
    typeof is_featured === 'boolean' ? String(is_featured) : '',
    tag || '',
  ];

  return useApiQuery(queryKey, `news?${qs.toString()}`, options);
}

export function useGetNewsBySlug(slug, options = {}) {
  return useApiQuery(['news', 'detail', slug], `news/${encodeURIComponent(String(slug || ''))}`, {
    enabled: Boolean(slug) && (options.enabled ?? true),
    ...options,
  });
}

export function useGetNewsComments(newsId, options = {}) {
  return useApiQuery(
    ['news', 'comments', newsId],
    `news/${encodeURIComponent(String(newsId || ''))}/comments`,
    {
      enabled: Boolean(newsId) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useCreateNews(options = {}) {
  return useApiMutation(['news', 'create'], 'news', 'POST', options);
}

export function useUpdateNews(id, options = {}) {
  return useApiMutation(['news', 'update', id], `news/${id}`, 'PUT', options);
}

export function useDeleteNews(id, options = {}) {
  return useApiMutation(['news', 'delete', id], `news/${id}`, 'DELETE', options);
}

export function useCreateNewsComment(newsId, options = {}) {
  return useApiMutation(
    ['news', 'comments', 'create', newsId],
    `news/${newsId}/comments`,
    'POST',
    options
  );
}

export function useUpdateNewsComment(newsId, commentId, options = {}) {
  return useApiMutation(
    ['news', 'comments', 'update', newsId, commentId],
    `news/${newsId}/comments/${commentId}`,
    'PUT',
    options
  );
}

export function useDeleteNewsComment(newsId, commentId, options = {}) {
  return useApiMutation(
    ['news', 'comments', 'delete', newsId, commentId],
    `news/${newsId}/comments/${commentId}`,
    'DELETE',
    options
  );
}

export function useApproveNewsComment(newsId, commentId, options = {}) {
  return useApiMutation(
    ['news', 'comments', 'approve', newsId, commentId],
    `news/${newsId}/comments/${commentId}/approval`,
    'PATCH',
    options
  );
}
