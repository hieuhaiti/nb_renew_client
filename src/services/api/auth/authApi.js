import { useApiMutation, useApiQuery } from '@/services/useApi';

/**
 * Auth API hooks using TanStack Query via useApiMutation/useApiQuery.
 * Note: useApiMutation signature → (queryKey, endpoint, method, options)
 */
export function useLoginMutation(options = {}) {
  return useApiMutation(null, 'auth/login', 'POST', options);
}

export function useRegisterMutation(options = {}) {
  return useApiMutation(null, 'auth/register', 'POST', options);
}

export function useLogoutMutation(options = {}) {
  return useApiMutation(null, 'auth/logout', 'POST', options);
}

export function useGetProfileQuery(options = {}) {
  return useApiQuery(
    ['auth', 'profile'],
    'auth/me',
    {
      ...options,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useUpdateProfileMutation(options = {}) {
  return useApiMutation(['auth', 'profile'], 'auth/me', 'PUT', options);
}

export function useChangePasswordMutation(options = {}) {
  return useApiMutation(null, 'auth/change-password', 'POST', options);
}
