import { create } from 'zustand';

export const useMapStore = create((set) => ({
  mapRef: null,
  mapRefObj: null,
  isSplitMode: false,

  highlightedPoint: null,
  highlightedPointAt: 0,
  highlightedRoute: null,
  highlightedRouteAt: 0,
  showOnlyHighlightedRoute: false,

  setMapRef: (mapRef) => set({ mapRef }),
  setMapRefObj: (mapRefObj) => set({ mapRefObj }),
  setIsSplitMode: (isSplitMode) =>
    set((state) => {
      // debug logs removed
      return { isSplitMode };
    }),

  setHighlightedPoint: (point) =>
    set({
      highlightedPoint: point || null,
      highlightedPointAt: Date.now(),
    }),
  clearHighlightedPoint: () =>
    set({
      highlightedPoint: null,
      highlightedPointAt: Date.now(),
    }),

  setHighlightedRoute: (route) =>
    set({
      highlightedRoute: route || null,
      highlightedRouteAt: Date.now(),
      showOnlyHighlightedRoute: Boolean(route),
    }),
  clearHighlightedRoute: () =>
    set({
      highlightedRoute: null,
      highlightedRouteAt: Date.now(),
      showOnlyHighlightedRoute: false,
    }),
  setShowOnlyHighlightedRoute: (showOnlyHighlightedRoute) => set({ showOnlyHighlightedRoute }),
}));
