import { useApiQuery } from '@/services/useApi';

function buildToursEndpoint({
  page = 1,
  limit = 8,
  search,
  status,
  province_code,
  business_id,
  is_featured,
  duration_days,
  price_min,
  price_max,
  sortBy = 'created_at',
  sortOrder = 'DESC',
} = {}) {
  const query = new URLSearchParams();

  if (page) query.set('page', String(page));
  if (limit) query.set('limit', String(limit));
  if (search) query.set('search', String(search));
  if (status && status !== 'all') query.set('status', String(status));
  if (province_code) query.set('province_code', String(province_code));
  if (business_id) query.set('business_id', String(business_id));
  if (typeof is_featured === 'boolean') query.set('is_featured', is_featured ? 'true' : 'false');
  if (duration_days) query.set('duration_days', String(duration_days));
  if (price_min != null) query.set('price_min', String(price_min));
  if (price_max != null) query.set('price_max', String(price_max));
  if (sortBy) query.set('sortBy', String(sortBy));
  if (sortOrder) query.set('sortOrder', String(sortOrder));

  return `tours?${query.toString()}`;
}

export function useTourPanelListQuery(params = {}, options = {}) {
  const normalizedSearch = params?.search?.trim?.() || '';

  return useApiQuery(
    [
      'map',
      'tour-panel',
      'list',
      params?.page || 1,
      params?.limit || 8,
      normalizedSearch,
      params?.status || 'all',
      params?.is_featured ?? 'all',
      params?.duration_days || null,
      params?.price_min ?? null,
      params?.price_max ?? null,
      params?.sortBy || 'created_at',
      params?.sortOrder || 'DESC',
    ],
    buildToursEndpoint({ ...params, search: normalizedSearch }),
    {
      staleTime: 60 * 1000,
      ...options,
    },
    false
  );
}

export function useTourPanelDetailQuery(id, options = {}) {
  return useApiQuery(
    ['map', 'tour-panel', 'detail', id || null],
    `tours/${id}`,
    {
      enabled: Boolean(id) && (options.enabled ?? true),
      staleTime: 60 * 1000,
      ...options,
    },
    false
  );
}

export function useTourPanelStopsQuery(tourId, options = {}) {
  return useApiQuery(
    ['map', 'tour-panel', 'stops', tourId || null],
    `tour-stops/tour/${tourId}`,
    {
      enabled: Boolean(tourId) && (options.enabled ?? true),
      staleTime: 60 * 1000,
      ...options,
    },
    false
  );
}
