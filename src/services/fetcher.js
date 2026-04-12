import apiClient from '@/services/apiClient';

/**
 * fetcher — GET wrapper dùng với TanStack Query queryFn.
 * Trả về response.data trực tiếp.
 *
 * @param {string} endPoint - API path (e.g. '/destinations')
 * @param {import('axios').AxiosRequestConfig} [config] - extra axios config
 * @returns {Promise<any>} response data
 *
 * @example
 * useQuery({ queryKey: ['destinations'], queryFn: () => fetcher('/destinations') })
 */
export async function fetcher(endPoint, config = {}) {
  const response = await apiClient.get(endPoint, config);
  return response.data;
}
