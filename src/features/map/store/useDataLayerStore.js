import { create } from 'zustand';

function arraysEqual(a = [], b = []) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function subcategorySignature(items = []) {
  return items
    .map(
      (item) =>
        `${item?.id ?? ''}|${item?.name ?? ''}|${item?.color_code ?? ''}|${item?.icon_url ?? ''}`
    )
    .join('::');
}

export const useDataLayerStore = create((set) => ({
  categoryId: null,
  subcategories: [],
  selectedSubcategoryIds: [],
  isSelectionManual: false,

  setSubcategories: ({ categoryId, subcategories }) =>
    set((state) => {
      const normalizedSubcategories = Array.isArray(subcategories) ? subcategories : [];
      const availableIds = normalizedSubcategories.map((item) => item.id);
      const sameCategory = state.categoryId === categoryId;
      const nextIsSelectionManual = sameCategory ? state.isSelectionManual : false;

      const shouldAutoSelectForCategory =
        !sameCategory || (!nextIsSelectionManual && state.selectedSubcategoryIds.length === 0);

      const selectedSubcategoryIds = shouldAutoSelectForCategory
        ? availableIds
        : state.selectedSubcategoryIds.filter((id) => availableIds.includes(id));

      const sameSubcategories =
        subcategorySignature(state.subcategories) === subcategorySignature(normalizedSubcategories);
      const sameSelected = arraysEqual(state.selectedSubcategoryIds, selectedSubcategoryIds);
      const sameManualMode = state.isSelectionManual === nextIsSelectionManual;

      if (sameCategory && sameSubcategories && sameSelected && sameManualMode) {
        return state;
      }

      return {
        categoryId,
        subcategories: normalizedSubcategories,
        selectedSubcategoryIds,
        isSelectionManual: nextIsSelectionManual,
      };
    }),

  setSelectedSubcategoryIds: (subcategoryIds = []) =>
    set((state) => {
      const normalizedIds = Array.isArray(subcategoryIds)
        ? Array.from(new Set(subcategoryIds.filter((id) => id != null)))
        : [];

      const sameSelected = arraysEqual(state.selectedSubcategoryIds, normalizedIds);
      if (sameSelected && state.isSelectionManual) {
        return state;
      }

      return {
        selectedSubcategoryIds: normalizedIds,
        isSelectionManual: true,
      };
    }),

  toggleSubcategory: (subcategoryId) =>
    set((state) => {
      const exists = state.selectedSubcategoryIds.includes(subcategoryId);

      return {
        selectedSubcategoryIds: exists
          ? state.selectedSubcategoryIds.filter((id) => id !== subcategoryId)
          : [...state.selectedSubcategoryIds, subcategoryId],
        isSelectionManual: true,
      };
    }),

  selectAllSubcategories: () =>
    set((state) => ({
      selectedSubcategoryIds: state.subcategories.map((item) => item.id),
      isSelectionManual: true,
    })),

  clearSelectedSubcategories: () =>
    set({
      selectedSubcategoryIds: [],
      isSelectionManual: true,
    }),

  resetDataLayer: () =>
    set({
      categoryId: null,
      subcategories: [],
      selectedSubcategoryIds: [],
      isSelectionManual: false,
    }),
}));
