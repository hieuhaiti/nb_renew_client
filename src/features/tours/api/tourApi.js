import { useApiQuery } from '@/services/useApi';
import i18next from 'i18next';

export function useGetAllTours({
  page,
  limit,
  search,
  params = {},
  options = {},
} = {}) {
  const lang = i18next.language || 'vi';
  const qs = new URLSearchParams({ lang, ...params, is_active: 'true' });
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (search) qs.set('search', search);

  const queryKey = ['tours', lang, page || 'all', limit || 'all', search || ''];

  return useApiQuery(queryKey, `tours?${qs.toString()}`, options);
}

export function useGetTourStops(tourId) {
  const lang = i18next.language || 'vi';
  return useApiQuery(
    ['tourStops', tourId, lang],
    `tour-stops/tour/${tourId}?lang=${lang}&is_active=true`,
    { enabled: !!tourId }
  );
}

export function useGetTourById(tourId) {
  const lang = i18next.language || 'vi';
  return useApiQuery(
    ['tour', tourId, lang],
    `tours/${tourId}?lang=${lang}&is_active=true`,
    { enabled: !!tourId }
  );
}
