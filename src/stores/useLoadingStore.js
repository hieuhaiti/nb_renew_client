import { create } from 'zustand';

function hasAnyLoading(loadingKeys) {
  return Object.keys(loadingKeys).length > 0;
}

export const useLoadingStore = create((set) => ({
  loading: false,
  loadingKeys: {},

  // Backward-compatible API for existing callers.
  setLoading: (loading) =>
    set(() => {
      if (!loading) {
        return { loading: false, loadingKeys: {} };
      }

      return { loading: true, loadingKeys: { global: true } };
    }),

  // Preferred API: track loading by stable key to avoid race conditions.
  setLoadingByKey: (key, loading) =>
    set((state) => {
      if (!key) return state;

      const loadingKeys = { ...state.loadingKeys };
      if (loading) {
        loadingKeys[key] = true;
      } else {
        delete loadingKeys[key];
      }

      return {
        loadingKeys,
        loading: hasAnyLoading(loadingKeys),
      };
    }),

  clearLoading: () => set({ loading: false, loadingKeys: {} }),
}));
