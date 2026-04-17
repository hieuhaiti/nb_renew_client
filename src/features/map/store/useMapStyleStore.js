import { create } from 'zustand';
import {
  defaultStyle,
  stateBuildingRender,
  stateTerrainRender,
} from '@/features/map/constant/mapConstant';

export const useMapStyleStore = create((set, get) => ({
  mapStyle: defaultStyle,
  terrainState: stateTerrainRender,
  buildingState: stateBuildingRender,
  terrainLoading: false,
  previousStyle: null,

  setMapStyle: (style) => {
    set({ mapStyle: style });
  },
  setTerrainState: (style) => {
    const nextTerrainState = style === true;
    set({ terrainState: nextTerrainState });
  },
  setBuildingState: (style) => {
    const nextBuildingState = style === true;
    set({ buildingState: nextBuildingState });
  },
  setTerrainLoading: (loading) => set({ terrainLoading: loading === true }),
}));
