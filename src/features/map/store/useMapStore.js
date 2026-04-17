import { create } from 'zustand';

export const useMapStore = create((set) => ({
  mapRef: null,
  mapRefObj: null,
  isSplitMode: false,

  setMapRef: (mapRef) => set({ mapRef }),
  setMapRefObj: (mapRefObj) => set({ mapRefObj }),
  setIsSplitMode: (isSplitMode) => set({ isSplitMode }),
}));
