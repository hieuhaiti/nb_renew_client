import { create } from 'zustand';

/**
 * Manages the single floating panel displayed over the map canvas.
 * Only one panel can be active at a time — direction and tour are mutually exclusive.
 *
 * activePanel: 'direction' | 'tour' | null
 */
export const useMapPanelStore = create((set) => ({
  activePanel: null,
  isPanelOpen: false,
  tourId: null,
  tourName: null,
  tourStops: null,

  openDirectionPanel: () =>
    set({
      activePanel: 'direction',
      isPanelOpen: true,
      tourId: null,
      tourName: null,
      tourStops: null,
    }),

  openTourPanel: ({ tourId, tourName, stops }) =>
    set({
      activePanel: 'tour',
      isPanelOpen: true,
      tourId: tourId ?? null,
      tourName: tourName ?? null,
      tourStops: Array.isArray(stops) ? stops : null,
    }),

  setPanelOpen: (open) => set({ isPanelOpen: Boolean(open) }),

  clearPanel: () =>
    set({
      activePanel: null,
      isPanelOpen: false,
      tourId: null,
      tourName: null,
      tourStops: null,
    }),
}));
