import { useApiQuery } from '@/services/useApi';
import { fetcher } from '@/services/fetcher';

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

// Returns: { tours: Tour[], pagination: { page, limit, total, totalPages } }
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
      params?.province_code || null,
      params?.business_id || null,
      params?.is_featured ?? null,
      params?.duration_days || null,
      params?.price_min ?? null,
      params?.price_max ?? null,
      params?.sortBy || 'created_at',
      params?.sortOrder || 'DESC',
    ],
    buildToursEndpoint({ ...params, search: normalizedSearch }),
    {
      staleTime: 60 * 1000,
      select: (res) =>
        res?.data ?? { tours: [], pagination: { page: 1, limit: 8, total: 0, totalPages: 0 } },
      ...options,
    },
    false
  );
}

// Returns: Tour object
export function useTourPanelDetailQuery(slug, options = {}) {
  return useApiQuery(
    ['map', 'tour-panel', 'detail', slug ?? null],
    `tours/slug/${slug}`,
    {
      enabled: Boolean(slug) && (options.enabled ?? true),
      staleTime: 60 * 1000,
      select: (res) => res?.data?.tour ?? null,
      ...options,
    },
    false
  );
}

function pickFirstArrayCandidate(...candidates) {
  return candidates.find((candidate) => Array.isArray(candidate)) || [];
}

export async function fetchTourStopsByTourId(tourId) {
  if (!tourId) return [];

  const endpoints = [`tours/${tourId}/stops`];

  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await fetcher(endpoint);
      const root = response?.data || response;
      const stops = pickFirstArrayCandidate(
        root?.stops,
        root?.tour_stops,
        root?.items,
        root?.data?.stops,
        root?.data?.tour_stops,
        response?.stops,
        response?.tour_stops,
        response?.items,
        response?.data?.stops,
        response?.data?.tour_stops
      );

      if (stops.length > 0) return stops;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return [];
}

export async function fetchPointById(pointId) {
  if (!pointId) return null;

  const endpoints = [`points/${pointId}`, `spots/${pointId}`];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetcher(endpoint);
      const root = response?.data || response;
      const candidate =
        root?.point || root?.spot || root?.item || root?.data?.point || root?.data?.spot || root;
      if (candidate) return candidate;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}
