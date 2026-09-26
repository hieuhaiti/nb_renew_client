import { useSyncExternalStore } from 'react';

/**
 * Custom hook to check if a media query matches using React 18/19 useSyncExternalStore
 * @param {string} query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} - True if the media query matches, false otherwise
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {};
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onStoreChange);
      return () => mediaQuery.removeEventListener('change', onStoreChange);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
    () => false
  );
}
