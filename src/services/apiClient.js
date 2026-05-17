import axios from 'axios';
import { tokenManager } from '@/lib/tokenManager';
import { env } from '@/config/env';
import useAuthStore from '@/stores/useAuthStore';

const BASE_URL = env.apiBaseUrlBE;

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

// ─── SHARED REFRESH LOGIC ────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
}

function clearSession() {
  tokenManager.clearTokens();
  useAuthStore.getState().clearAuth();
}

async function doRefresh() {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

  const refreshRes = await axios.post(
    `${BASE_URL?.replace(/\/$/, '')}/auth/refresh/`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const {
    accessToken,
    refreshToken: newRefresh,
    expiresIn,
    refreshExpiresIn,
  } = refreshRes.data?.data || {};

  if (!accessToken) throw new Error('REFRESH_FAILED');

  tokenManager.setAccessToken(accessToken, expiresIn);
  if (newRefresh) tokenManager.setRefreshToken(newRefresh, refreshExpiresIn);
  if (expiresIn) tokenManager.setTokenExpiresIn(expiresIn);
  if (refreshExpiresIn) tokenManager.setRefreshExpiresIn(refreshExpiresIn);

  return accessToken;
}

// ─── REQUEST INTERCEPTOR: proactive refresh + attach Bearer token ─────────────
apiClient.interceptors.request.use(
  async (config) => {
    const url = config.url || '';
    if (isAuthEndpoint(url)) return config;

    const token = tokenManager.getAccessToken();
    if (!token) return config;

    // Proactive refresh: send a fresh token instead of waiting for a 401 round-trip
    if (tokenManager.isAccessTokenExpired(30)) {
      if (tokenManager.isRefreshTokenExpired()) {
        clearSession();
        return Promise.reject({
          status: 401,
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          isAuthRequest: false,
        });
      }

      if (isRefreshing) {
        const newToken = await new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });
        config.headers['Authorization'] = `Bearer ${newToken}`;
        return config;
      }

      isRefreshing = true;
      try {
        const newToken = await doRefresh();
        processQueue(null, newToken);
        config.headers['Authorization'] = `Bearer ${newToken}`;
        return config;
      } catch (err) {
        processQueue(err, null);
        clearSession();
        return Promise.reject({
          status: 401,
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          isAuthRequest: false,
        });
      } finally {
        isRefreshing = false;
      }
    }

    const tokenType = tokenManager.getTokenType() || 'Bearer';
    config.headers['Authorization'] = `${tokenType} ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR: reactive 401 refresh + retry ──────────────────────
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
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const accessToken = await doRefresh();
        processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearSession();
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
