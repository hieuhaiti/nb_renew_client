import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { fetcher } from '@/services/fetcher';
import { mutater } from '@/services/mutater';
import { tokenManager } from '@/lib/tokenManager';
import useAuthStore from '@/stores/useAuthStore';
import { useLoadingStore } from '@/stores/useLoadingStore.js';
import { toast } from 'react-toastify';
import { renderValidationErrors } from '@/services/errorUtils';

// ─── TOAST HELPERS ────────────────────────────────────────────────────────────

const toastError = (content, duration = 5000) =>
  toast.error(content, { autoClose: duration, closeOnClick: true, pauseOnHover: true });

const toastSuccess = (content) => toast.success(content, { autoClose: 3000, closeOnClick: true });

// ─── useApiQuery ──────────────────────────────────────────────────────────────

/**
 * useApiQuery — wraps TanStack useQuery with:
 * - global loading overlay (opt-out with `loading: false`)
 * - success toast (opt-in with `notification: true`)
 * - 401 session-expired handling → redirect /login
 * - validation error rendering via renderValidationErrors
 *
 * @param {string|string[]} key - query key
 * @param {string} endPoint - API path
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 * @param {boolean} [loading=true] - sync to global loading overlay
 * @param {boolean} [notification=false] - show success toast
 */
export function useApiQuery(key, endPoint, options = {}, loading = true, notification = false) {
  const navigate = useNavigate();
  const setLoadingByKey = useLoadingStore((state) => state.setLoadingByKey);
  const loadingKeyRef = useRef(
    `query:${Array.isArray(key) ? key.join('.') : key}:${endPoint}:${Math.random()
      .toString(36)
      .slice(2)}`
  );

  const query = useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => fetcher(endPoint),
    ...options,
  });

  // Sync global loading overlay
  useEffect(() => {
    const loadingKey = loadingKeyRef.current;
    if (!loading) {
      setLoadingByKey(loadingKey, false);
      return undefined;
    }

    setLoadingByKey(loadingKey, query.isLoading || query.isFetching);
    return () => setLoadingByKey(loadingKey, false);
  }, [query.isLoading, query.isFetching, setLoadingByKey, loading]);

  // Success toast (opt-in)
  useEffect(() => {
    if (notification && query.isSuccess && query.data?.message) {
      toastSuccess(query.data.message);
    }
  }, [notification, query.isSuccess, query.data]);

  // Error handling
  useEffect(() => {
    if (!query.error) return;
    if (query.error.meta?.suppressGlobalError) return;

    const { status, isAuthRequest, errors, message } = query.error;

    if (status === 401 && !isAuthRequest) {
      tokenManager.clearTokens();
      useAuthStore.getState().clearAuth();
      toastError(message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 3000);
      navigate('/login');
      return;
    }

    // 400 with validation errors array
    if (status === 400 && Array.isArray(errors) && errors.length) {
      toastError(renderValidationErrors(errors), 8000);
      return;
    }

    // Other non-401 errors — toast already shown by apiClient interceptor
    // but we can add feature-level handling here if needed
  }, [query.error, navigate]);

  return query;
}

/**
 * useApiQueries — wraps TanStack useQueries with:
 * - queryFn defaulted to fetcher(endpoint) per query item
 * - global loading overlay (opt-out with `loading: false`)
 * - shared auth/validation error handling with useApiQuery
 *
 * @param {{queries: Array<{
 *   queryKey: string|string[],
 *   endPoint?: string,
 *   queryFn?: () => Promise<unknown>,
 *   [key: string]: unknown
 * }>}} config
 * @param {boolean} [loading=true] - sync to global loading overlay
 */
export function useApiQueries(config = {}, loading = true) {
  const navigate = useNavigate();
  const setLoadingByKey = useLoadingStore((state) => state.setLoadingByKey);
  const rawQueries = Array.isArray(config?.queries) ? config.queries : [];
  const loadingKeyRef = useRef(`queries:${Math.random().toString(36).slice(2)}`);

  const queries = useQueries({
    queries: rawQueries.map((queryConfig) => {
      const { queryKey, endPoint, queryFn, ...rest } = queryConfig || {};

      return {
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn: queryFn || (() => fetcher(endPoint)),
        ...rest,
      };
    }),
  });

  const isAnyLoading = queries.some((query) => query.isLoading || query.isFetching);

  useEffect(() => {
    const loadingKey = loadingKeyRef.current;
    if (!loading) {
      setLoadingByKey(loadingKey, false);
      return undefined;
    }

    setLoadingByKey(loadingKey, isAnyLoading);
    return () => setLoadingByKey(loadingKey, false);
  }, [isAnyLoading, loading, setLoadingByKey]);

  const errorSignature = queries.map((query) => query.errorUpdatedAt || 0).join('|');

  useEffect(() => {
    const firstError = queries.find(
      (query) => query.error && !query.error?.meta?.suppressGlobalError
    )?.error;
    if (!firstError) return;

    const { status, isAuthRequest, errors, message } = firstError;

    if (status === 401 && !isAuthRequest) {
      tokenManager.clearTokens();
      toastError(message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 3000);
      navigate('/login');
      return;
    }

    if (status === 400 && Array.isArray(errors) && errors.length) {
      toastError(renderValidationErrors(errors), 8000);
    }
  }, [errorSignature, navigate, queries]);

  return queries;
}

// ─── useApiMutation ───────────────────────────────────────────────────────────

/**
 * useApiMutation — wraps TanStack useMutation with:
 * - global loading overlay (synced to isPending)
 * - success toast when response has message
 * - 401 session-expired handling → redirect /login
 * - validation error rendering
 *
 * @param {string|string[]} key - query key to invalidate on success (optional)
 * @param {string} endPoint - API path
 * @param {'POST'|'PUT'|'PATCH'|'DELETE'} [method='POST']
 * @param {import('@tanstack/react-query').UseMutationOptions} [options]
 */
export function useApiMutation(key, endPoint, method = 'POST', options = {}) {
  const navigate = useNavigate();
  const setLoadingByKey = useLoadingStore((state) => state.setLoadingByKey);
  const queryClient = useQueryClient();
  const loadingKeyRef = useRef(
    `mutation:${Array.isArray(key) ? key.join('.') : key || 'unknown'}:${endPoint}:${Math.random()
      .toString(36)
      .slice(2)}`
  );

  const { onSuccess: optionsOnSuccess, onError: optionsOnError, ...restOptions } = options;

  const mutation = useMutation({
    mutationFn: (body) => mutater(endPoint, method, body),

    onSuccess: (data, variables, context) => {
      // Invalidate related cache if key provided
      if (key) {
        const queryKey = Array.isArray(key) ? key : [key];
        queryClient.invalidateQueries({ queryKey });
      }

      if (data?.message) {
        toastSuccess(data.message);
      }

      optionsOnSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      const { status, isAuthRequest, errors, message } = error || {};

      if (status === 401 && !isAuthRequest) {
        // TODO: if backend uses httpOnly cookies, no tokenManager.clearTokens() needed
        tokenManager.clearTokens();
        toastError(message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 3000);
        navigate('/login');
      } else if (status === 400 && Array.isArray(errors) && errors.length) {
        toastError(renderValidationErrors(errors), 8000);
      } else if (message && status !== 401) {
        toastError(message);
      }

      optionsOnError?.(error, variables, context);
    },

    ...restOptions,
  });

  // Sync global loading overlay
  useEffect(() => {
    const loadingKey = loadingKeyRef.current;
    setLoadingByKey(loadingKey, mutation.isPending);
    return () => setLoadingByKey(loadingKey, false);
  }, [mutation.isPending, setLoadingByKey]);

  return mutation;
}

// ─── useQueryCache ────────────────────────────────────────────────────────────

/**
 * useQueryCache — helpers to read/write TanStack Query cache imperatively.
 * Useful for optimistic updates or reading cached data outside of queries.
 */
export function useQueryCache() {
  const queryClient = useQueryClient();

  return {
    getCachedData: (key) => queryClient.getQueryData(Array.isArray(key) ? key : [key]),

    setCachedData: (key, data) => queryClient.setQueryData(Array.isArray(key) ? key : [key], data),

    removeQuery: (key) => queryClient.removeQueries({ queryKey: Array.isArray(key) ? key : [key] }),

    invalidate: (key) =>
      queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] }),
  };
}
