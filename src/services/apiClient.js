import axios from 'axios';
import { tokenManager } from '@/lib/tokenManager';

const BASE_URL = import.meta.env.VITE_BASE_URL_BE;

/**
 * Central axios instance for all API calls.
 * - Attaches Authorization header automatically via request interceptor.
 * - Handles 401 token refresh + retry via response interceptor.
 * - Errors are normalized and re-thrown; toast display is handled by useApi hooks.
 *
 * TODO: Switch to httpOnly cookie flow when backend supports it.
 *   - Remove Authorization header injection
 *   - Add `withCredentials: true` globally
 *   - Remove tokenManager usage in interceptors
 */
const apiClient = axios.create({
  baseURL: BASE_URL?.replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
  // TODO: enable when backend uses httpOnly refresh cookies
  // withCredentials: true,
});

// ─── AUTH ENDPOINT DETECTION ─────────────────────────────────────────────────
const AUTH_ENDPOINTS = [
  'auth/login',
  'auth/register',
  'auth/refresh',
  'auth/logout',
  'auth/forgot-password',
  'auth/reset-password',
];

function isAuthEndpoint(url = '') {
  return AUTH_ENDPOINTS.some((e) => url.includes(e));
}

// ─── REQUEST INTERCEPTOR: attach Bearer token ─────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    if (!isAuthEndpoint(url)) {
      const token = tokenManager.getAccessToken();
      if (token) {
        const tokenType = tokenManager.getTokenType() || 'Bearer';
        config.headers['Authorization'] = `${tokenType} ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR: 401 refresh + retry ───────────────────────────────
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';

    // Only refresh on 401 for non-auth endpoints, and only once per request
    if (status === 401 && !isAuthEndpoint(url) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue concurrent requests while refresh is in flight
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

        // TODO: replace with httpOnly cookie approach when backend ready
        const refreshRes = await axios.post(
          `${BASE_URL?.replace(/\/$/, '')}/auth/refresh/`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken, refreshToken: newRefresh, expiresIn, refreshExpiresIn } =
          refreshRes.data?.data || {};

        if (!accessToken) throw new Error('REFRESH_FAILED');

        tokenManager.setAccessToken(accessToken, expiresIn);
        if (newRefresh) tokenManager.setRefreshToken(newRefresh, refreshExpiresIn);
        if (expiresIn) tokenManager.setTokenExpiresIn(expiresIn);
        if (refreshExpiresIn) tokenManager.setRefreshExpiresIn(refreshExpiresIn);

        processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        // Let useApi hooks handle navigation and toast
        return Promise.reject({
          status: 401,
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          isAuthRequest: false,
        });
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize error shape for consumers
    const data = error.response?.data || {};
    const normalized = {
      status: error.response?.status ?? 0,
      message: data.message || error.message || `Lỗi ${error.response?.status ?? 'network'}`,
      data,
      errors: data.errors || null,
      isAuthRequest: isAuthEndpoint(url),
      url: originalRequest?.url,
    };

    return Promise.reject(normalized);
  }
);

export default apiClient;
