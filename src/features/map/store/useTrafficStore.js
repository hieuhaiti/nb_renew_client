import { create } from 'zustand';
import {
  fetchTrafficIncidents,
  transformIncidentsToGeoJSON,
} from '@/services/api/traffic/trafficService';

const EMPTY_FC = { type: 'FeatureCollection', features: [] };

export const useTrafficStore = create((set) => ({
  isTrafficEnabled: false,
  showFlow: true,
  showIncidents: true,
  isLoading: false,
  error: null,
  incidentGeoJSON: EMPTY_FC,

  setTrafficEnabled: (val) => set({ isTrafficEnabled: val }),
  setShowFlow: (val) => set({ showFlow: val }),
  setShowIncidents: (val) => set({ showIncidents: val }),

  loadIncidents: async (boundaryGeoJSON, zoom = 10) => {
    set({ isLoading: true, error: null });
    try {
      const raw = await fetchTrafficIncidents(boundaryGeoJSON, zoom);
      const geojson = transformIncidentsToGeoJSON(raw);
      set({ incidentGeoJSON: geojson, isLoading: false });
    } catch (err) {
      set({ error: err.message ?? 'Lỗi tải dữ liệu giao thông', isLoading: false });
    }
  },

  clearIncidents: () => set({ incidentGeoJSON: EMPTY_FC, error: null }),
}));
