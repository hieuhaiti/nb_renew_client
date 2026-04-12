import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} [name]
 * @property {string} [username]
 * @property {string} email
 * @property {string} [role]
 * @property {string} [avatar]
 */

/**
 * Auth store — global authentication state.
 * Token management is handled by axios interceptors (httpOnly cookie preferred).
 * This store only tracks client-side user identity.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      /** @type {AuthUser|null} */
      user: null,
      isAuthenticated: false,

      /**
       * Set user and mark as authenticated.
       * @param {AuthUser} user
       */
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      /**
       * Clear user state (after logout API call completes).
       */
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
