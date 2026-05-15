import { create } from 'zustand';

export const useTourismPointSettingStore = create((set) => ({
  currentSettings: {
    page: 1,
    limit: 20,
    viewMode: 'grid',
    selectedCategory: 0,
    selectedSubcategory: 0,
    isFeatured: '',
  },
  setCurrentSettings: (newSettings) =>
    set((state) => ({
      currentSettings: { ...state.currentSettings, ...newSettings },
    })),
}));
