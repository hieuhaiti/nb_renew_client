import { create } from 'zustand';

export const defaultTourPanelFilters = {
  page: 1,
  limit: 8,
  search: '',
  status: 'all',
  is_featured: 'all',
  sortBy: 'created_at',
  sortOrder: 'DESC',
};

export const useTourPanelStore = create((set) => ({
  filters: defaultTourPanelFilters,
  selectedTour: null,

  setTourPanelFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSelectedTour: (tour) =>
    set({
      selectedTour: tour || null,
    }),

  resetTourPanelFilters: () =>
    set({
      filters: defaultTourPanelFilters,
      selectedTour: null,
    }),
}));
