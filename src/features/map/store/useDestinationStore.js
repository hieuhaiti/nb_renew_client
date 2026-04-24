import { create } from 'zustand';

export const useDestinationStore = create((set) => ({
  selectedDestination: null,
  selectedAt: 0,

  setSelectedDestination: (destination) =>
    set({
      selectedDestination: destination || null,
      selectedAt: Date.now(),
    }),

  clearSelectedDestination: () =>
    set({
      selectedDestination: null,
      selectedAt: Date.now(),
    }),
}));
