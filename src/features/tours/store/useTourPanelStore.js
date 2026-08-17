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
  sidebarOpenSeq: 0,

  setTourPanelFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSelectedTour: (tour) =>
    set({
      selectedTour: tour || null,
    }),

  requestOpenTourSidebar: () =>
    set((state) => ({
      sidebarOpenSeq: state.sidebarOpenSeq + 1,
    })),

  resetTourPanelFilters: () =>
    set({
      filters: defaultTourPanelFilters,
      selectedTour: null,
      sidebarOpenSeq: 0,
    }),
}));
