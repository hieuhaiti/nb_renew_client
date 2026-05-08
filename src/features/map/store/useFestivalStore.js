import { create } from 'zustand';

export const defaultFestivalFilters = {
  page: 1,
  limit: 8,
  search: '',
  festival_type: 'all',
  upcoming: true,
  sortBy: 'start_date',
  sortOrder: 'ASC',
};

export const useFestivalStore = create((set) => ({
  filters: defaultFestivalFilters,
  selectedFestival: null,

  setFestivalFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSelectedFestival: (festival) =>
    set({
      selectedFestival: festival || null,
    }),

  resetFestivalFilters: () =>
    set({
      filters: defaultFestivalFilters,
      selectedFestival: null,
    }),
}));
