import { useApiQuery } from '@/services/useApi';

export function useGetPublicBusinesses({
  page,
  limit,
  search,
  status,
  business_type,
  province_code,
  sortBy,
  sortOrder,
  params = {},
  options = {},
} = {}) {
  const qs = new URLSearchParams({ ...params });
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (search) qs.set('search', search);
  if (status) qs.set('status', status);
  if (business_type) qs.set('business_type', business_type);
  if (province_code) qs.set('province_code', province_code);
  if (sortBy) qs.set('sortBy', sortBy);
  if (sortOrder) qs.set('sortOrder', sortOrder);

  return useApiQuery(
    ['businesses', 'public', page, limit, search, status, business_type, province_code],
    `businesses/public?${qs.toString()}`,
    { staleTime: 5 * 60 * 1000, ...options }
  );
}

export function useGetBusinessById(businessId, options = {}) {
  return useApiQuery(
    ['businesses', 'detail', businessId],
    `businesses/${businessId}`,
    {
      enabled: Boolean(businessId) && (options.enabled ?? true),
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
}

export function useGetNearbyVouchers({
  lat,
  lng,
  radius_m,
  options = {},
} = {}) {
  const enabled =
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    (options.enabled ?? true);

  const qs = new URLSearchParams();
  if (lat != null) qs.set('lat', lat);
  if (lng != null) qs.set('lng', lng);
  if (radius_m != null) qs.set('radius_m', radius_m);

  return useApiQuery(
    ['businesses', 'vouchers', 'nearby', lat, lng, radius_m],
    `businesses/vouchers/nearby?${qs.toString()}`,
    {
      staleTime: 3 * 60 * 1000,
      enabled,
      ...options,
    }
  );
}

export function useGetBusinessVouchers({
  business_id,
  page,
  limit,
  is_active,
  options = {},
} = {}) {
  const qs = new URLSearchParams();
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (typeof is_active === 'boolean') qs.set('is_active', String(is_active));

  return useApiQuery(
    ['businesses', 'vouchers', business_id, page, limit, is_active],
    `businesses/${business_id}/vouchers?${qs.toString()}`,
    {
      enabled: Boolean(business_id) && (options.enabled ?? true),
      staleTime: 3 * 60 * 1000,
      ...options,
    }
  );
}

export function useGetBusinessServices({
  business_id,
  page,
  limit,
  spot_id,
  category,
  is_active,
  options = {},
} = {}) {
  const qs = new URLSearchParams();
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  if (spot_id) qs.set('spot_id', spot_id);
  if (category) qs.set('category', category);
  if (typeof is_active === 'boolean') qs.set('is_active', String(is_active));

  return useApiQuery(
    ['businesses', 'services', business_id, page, limit, spot_id, category, is_active],
    `businesses/${business_id}/services?${qs.toString()}`,
    {
      enabled: Boolean(business_id) && (options.enabled ?? true),
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
}
