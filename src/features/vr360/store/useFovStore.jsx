import { create } from 'zustand';
import { normalizeBearing, updateFovPolygon as buildFovPolygon } from '../utils/fovHelpers';

const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

export const useFovStore = create((set, get) => ({
  fovPolygon: EMPTY_FEATURE_COLLECTION,
  fovAngle: 80,
  fovRadius: 250,
  heading: 0,
  currentSceneIndex: 0,
  scenes: [],

  setFovAngle: (fovAngle) => {
    const safeAngle = Math.max(30, Math.min(120, Number(fovAngle) || 80));
    set({ fovAngle: safeAngle });
  },

  setHeading: (heading) => {
    set({ heading: normalizeBearing(heading) });
  },

  setCurrentSceneIndex: (currentSceneIndex) => {
    const scenes = get().scenes;
    const maxIndex = Math.max(0, scenes.length - 1);
    const safeIndex = Math.max(0, Math.min(maxIndex, Number(currentSceneIndex) || 0));
    set({ currentSceneIndex: safeIndex });
  },

  setScenes: (scenes) => {
    const safeScenes = Array.isArray(scenes) ? scenes : [];
    set((state) => {
      const nextMaxIndex = Math.max(0, safeScenes.length - 1);
      const nextSceneIndex = Math.max(0, Math.min(nextMaxIndex, state.currentSceneIndex));
      return {
        scenes: safeScenes,
        currentSceneIndex: nextSceneIndex,
      };
    });
  },

  updateFovPolygon: (center, bearing, fovAngle, radius) => {
    const state = get();
    const nextBearing = normalizeBearing(
      Number.isFinite(Number(bearing)) ? Number(bearing) : state.heading
    );
    const nextFovAngle = Math.max(30, Math.min(120, Number(fovAngle) || state.fovAngle));
    const nextRadius = Math.max(20, Number(radius) || state.fovRadius);

    const polygon = buildFovPolygon(center, nextBearing, nextFovAngle, nextRadius);

    set({
      fovPolygon: polygon,
      heading: nextBearing,
      fovAngle: nextFovAngle,
      fovRadius: nextRadius,
    });

    return polygon;
  },
}));
