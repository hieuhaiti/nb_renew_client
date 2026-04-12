import apiClient from '@/services/apiClient';

/**
 * mutater — POST/PUT/PATCH/DELETE wrapper dùng với TanStack Query mutationFn.
 * Tự động detect FormData và bỏ Content-Type để browser set multipart boundary.
 * Trả về response.data trực tiếp.
 *
 * @param {string} endPoint - API path (e.g. '/auth/login')
 * @param {'POST'|'PUT'|'PATCH'|'DELETE'} [method='POST']
 * @param {object|FormData} [body] - request payload
 * @param {import('axios').AxiosRequestConfig} [config] - extra axios config
 * @returns {Promise<any>} response data
 *
 * @example
 * useMutation({ mutationFn: (body) => mutater('/auth/login', 'POST', body) })
 */
export async function mutater(endPoint, method = 'POST', body, config = {}) {
  const isFormData = body instanceof FormData;

  const response = await apiClient.request({
    method,
    url: endPoint,
    data: body,
    // Let browser set multipart Content-Type with boundary for FormData
    ...(isFormData && {
      headers: { 'Content-Type': undefined },
    }),
    ...config,
  });

  return response.data;
}
