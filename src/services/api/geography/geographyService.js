import { useApiQuery } from '@/services/useApi';

export function useGetProvinces(options = {}) {
  return useApiQuery(['geography', 'provinces'], 'geography/provinces', {
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useGetWards(options = {}) {
  return useApiQuery(['geography', 'wards'], 'geography/wards', {
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useGetProvinceById({ province_id, options = {} } = {}) {
  return useApiQuery(
    ['geography', 'provinces', 'detail', province_id],
    `geography/provinces/${province_id}`,
    {
      staleTime: 10 * 60 * 1000,
      enabled: Boolean(province_id) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useGetWardsByProvince({ province_code, options = {} } = {}) {
  return useApiQuery(
    ['geography', 'provinces', province_code, 'wards'],
    `geography/provinces/${province_code}/wards`,
    {
      staleTime: 10 * 60 * 1000,
      enabled: Boolean(province_code) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useSearchProvinces({ search, options = {} } = {}) {
  const qs = new URLSearchParams();
  if (search) qs.set('search', search);

  return useApiQuery(
    ['geography', 'provinces', 'search', search],
    `geography/provinces/search?${qs.toString()}`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(search) && (options.enabled ?? true),
      ...options,
    }
  );
}

export function useSearchWards({ search, options = {} } = {}) {
  const qs = new URLSearchParams();
  if (search) qs.set('search', search);

  return useApiQuery(
    ['geography', 'wards', 'search', search],
    `geography/wards/search?${qs.toString()}`,
    {
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(search) && (options.enabled ?? true),
      ...options,
    }
  );
}
