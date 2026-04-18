import { create } from 'zustand';

export const useDataLayerStore = create((set) => ({
  categoryId: null,
  subcategories: [],
  selectedSubcategoryIds: [],

  setSubcategories: ({ categoryId, subcategories }) =>
    set((state) => {
      const normalizedSubcategories = Array.isArray(subcategories) ? subcategories : [];
      const availableIds = normalizedSubcategories.map((item) => item.id);
      const sameCategory = state.categoryId === categoryId;

      const selectedSubcategoryIds = sameCategory
        ? state.selectedSubcategoryIds.filter((id) => availableIds.includes(id))
        : availableIds;

      return {
        categoryId,
        subcategories: normalizedSubcategories,
        selectedSubcategoryIds,
      };
    }),

  toggleSubcategory: (subcategoryId) =>
    set((state) => {
      const exists = state.selectedSubcategoryIds.includes(subcategoryId);

      return {
        selectedSubcategoryIds: exists
          ? state.selectedSubcategoryIds.filter((id) => id !== subcategoryId)
          : [...state.selectedSubcategoryIds, subcategoryId],
      };
    }),

  selectAllSubcategories: () =>
    set((state) => ({
      selectedSubcategoryIds: state.subcategories.map((item) => item.id),
    })),

  clearSelectedSubcategories: () =>
    set({
      selectedSubcategoryIds: [],
    }),

  resetDataLayer: () =>
    set({
      categoryId: null,
      subcategories: [],
      selectedSubcategoryIds: [],
    }),
}));
