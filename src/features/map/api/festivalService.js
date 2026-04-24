import { useApiQuery } from '@/services/useApi';

function buildFestivalsEndpoint({
  page = 1,
  limit = 8,
  search,
  festival_type,
  upcoming = true,
  sortBy = 'start_date',
  sortOrder = 'ASC',
} = {}) {
  const query = new URLSearchParams();

  if (page) query.set('page', String(page));
  if (limit) query.set('limit', String(limit));
  if (search) query.set('search', String(search));
  if (festival_type) query.set('festival_type', String(festival_type));
  if (typeof upcoming === 'boolean') query.set('upcoming', upcoming ? 'true' : 'false');
  if (sortBy) query.set('sortBy', String(sortBy));
  if (sortOrder) query.set('sortOrder', String(sortOrder));

  return `events?${query.toString()}`;
}

function buildFestivalCalendarEndpoint({ from, to, province_code, festival_type } = {}) {
  const query = new URLSearchParams();

  if (from) query.set('from', String(from));
  if (to) query.set('to', String(to));
  if (province_code) query.set('province_code', String(province_code));
  if (festival_type) query.set('festival_type', String(festival_type));

  // Current backend deployment exposes events list endpoint; calendar API is not published yet.
  return `events?${query.toString()}`;
}

export function useFestivalsQuery(params = {}, options = {}) {
  const normalizedSearch = params?.search?.trim?.() || '';
  const festivalType =
    params?.festival_type && params.festival_type !== 'all' ? params.festival_type : undefined;
  const endpoint = buildFestivalsEndpoint({
    ...params,
    search: normalizedSearch,
    festival_type: festivalType,
  });

  return useApiQuery(
    [
      'festivals',
      'list',
      params?.page || 1,
      params?.limit || 8,
      normalizedSearch,
      festivalType || 'all',
      params?.upcoming ?? true,
      params?.sortBy || 'start_date',
      params?.sortOrder || 'ASC',
    ],
    endpoint,
    {
      staleTime: 60 * 1000,
      ...options,
    },
    false
  );
}

export function useFestivalTypesQuery(options = {}) {
  return useApiQuery(
    ['festivals', 'types'],
    'events?page=1&limit=100&sortBy=start_date&sortOrder=ASC',
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    },
    false
  );
}

export function useFestivalCalendarQuery(params = {}, options = {}) {
  const endpoint = buildFestivalCalendarEndpoint(params);

  return useApiQuery(
    [
      'festivals',
      'calendar',
      params?.from || '',
      params?.to || '',
      params?.province_code || '',
      params?.festival_type || 'all',
    ],
    endpoint,
    {
      enabled: Boolean(params?.from && params?.to) && (options.enabled ?? true),
      staleTime: 60 * 1000,
      ...options,
    },
    false
  );
}

export function useFestivalDetailQuery(id, options = {}) {
  return useApiQuery(
    ['festivals', 'detail', id || null],
    `events/${id}`,
    {
      enabled: Boolean(id) && (options.enabled ?? true),
      staleTime: 60 * 1000,
      ...options,
    },
    false
  );
}
