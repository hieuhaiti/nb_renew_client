import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  buildSatelliteSourceId,
  removeSatelliteLayerFromMap,
} from '../utils/satelliteMapLayer.util';
import { SatelliteService } from '../services/satelliteService';
import { useMapStore } from '@/features/map/store/useMapStore';
import { toDateString } from '../utils/satelliteUtils';
import { getDefaultSatelliteGeometry } from '../utils/satelliteGeometry.util';

const normalizeResponse = (response) => response?.data ?? response;

const sanitizeKeyPart = (value) => {
  if (!value) return 'unknown';
  return String(value).replace(/[^a-zA-Z0-9_-]/g, '_');
};

const buildImageKey = (meta) => {
  const start = toDateString(meta.startDate);
  const end = toDateString(meta.endDate);
  const layer = meta.layerType || meta.layer || 'unknown';
  const collection = meta.collection || 'S2';
  const splitSide = meta.splitSide || 'single';
  const cloudCover = meta.cloudCover ?? '';
  return [layer, collection, start, end, splitSide, cloudCover].join('|');
};

const buildLayerIdFromKey = (key) => `satellite-${sanitizeKeyPart(key)}`.slice(0, 120);

const upsertByKey = (items, nextItem) => {
  if (!nextItem) return items;
  const idx = items.findIndex((item) => item.key === nextItem.key);
  if (idx === -1) return [...items, nextItem];
  const copy = items.slice();
  copy[idx] = { ...items[idx], ...nextItem };
  return copy;
};

const buildImageFromResponse = (response, meta) => {
  const data = normalizeResponse(response);
  if (!data || data.error || !data.tileUrl) return null;

  const key = buildImageKey(meta);
  const layerId = buildLayerIdFromKey(key);
  const sourceId = buildSatelliteSourceId(data.mapId || layerId, layerId);
  const start = toDateString(meta.startDate);
  const end = toDateString(meta.endDate);

  return {
    id: layerId,
    key,
    layerType: meta.layerType || meta.layer || 'unknown',
    splitSide: meta.splitSide || null,
    layerOpacity: meta.layerOpacity ?? 1,
    visible: meta.visible !== false,
    collection: meta.collection || 'S2',
    cloudCover: meta.cloudCover ?? 0,
    date: start && end ? `${start} - ${end}` : '',
    preview: data.tileUrl,
    mapId: data.mapId,
    downloadUrl: data.downloadUrl || null,
    totalImages: data.totalImages,
    areaStats: data.areaStats ?? null,
    legend: Array.isArray(data.legend) ? data.legend : [],
    visualizationParams: data.visualizationParams,
    metadata: data.metadata,
    token: data.token,
    layerData: {
      tileUrl: data.tileUrl,
      mapId: data.mapId,
      token: data.token,
      downloadUrl: data.downloadUrl || null,
    },
    sourceId,
  };
};

export const useSatelliteStore = create(
  devtools(
    (set, get) => ({
      // ── Single mode ──────────────────────────────────────────────────────────
      startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endDate: new Date(),
      selectedLayer: 'ndvi',
      cloudCover: 20,
      analysisData: null,

      setStartDate: (date) => set({ startDate: date }),
      setEndDate: (date) => set({ endDate: date }),
      setSelectedLayer: (layer) => set({ selectedLayer: layer }),
      setCloudCover: (value) => set({ cloudCover: Math.max(0, Math.min(100, value)) }),
      setAnalysisData: (data) => set({ analysisData: data }),

      // ── Compare mode ─────────────────────────────────────────────────────────
      isCompareMode: false,
      collection: 'S2',
      autoDetectChange: false,
      startDate1: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      endDate1: new Date(),
      startDate2: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
      endDate2: new Date(new Date().getFullYear() - 1, new Date().getMonth() + 1, 0),

      setIsCompareMode: (isCompareMode) => {
        const { satelliteLayers, images } = get();
        const mapRef = useMapStore.getState().mapRefObj;

        if (isCompareMode) {
          const singleLayers = satelliteLayers.filter((l) => !l.splitSide || l.splitSide === null);
          if (mapRef?.current) {
            singleLayers.forEach((layer) => {
              try {
                if (mapRef.current.single) {
                  removeSatelliteLayerFromMap(mapRef.current.single, layer.id, layer.sourceId);
                }
              } catch (e) {
                console.error(`[setIsCompareMode→compare] Error removing layer ${layer.id}:`, e);
              }
            });
          }
          set({
            isCompareMode: true,
            analysisData: null,
            images: { ...images, single: [] },
            isLoading: false,
            error: null,
          });
        } else {
          const compareLayers = satelliteLayers.filter(
            (l) => l.splitSide === 'left' || l.splitSide === 'right'
          );
          if (mapRef?.current) {
            compareLayers.forEach((layer) => {
              try {
                const targetMap =
                  layer.splitSide === 'right' ? mapRef.current.split : mapRef.current.single;
                if (targetMap) {
                  removeSatelliteLayerFromMap(targetMap, layer.id, layer.sourceId);
                }
              } catch (e) {
                console.error(`[setIsCompareMode→single] Error removing layer ${layer.id}:`, e);
              }
            });
          }
          set({
            isCompareMode: false,
            period1Data: { rgb: null, ndvi: null, swir: null, classified: null },
            period2Data: { rgb: null, ndvi: null, swir: null, classified: null },
            comparisonData: null,
            images: { ...images, comparison: [] },
            isLoadingComparison: false,
            errorComparison: null,
          });
        }
        get().handleSatelliteDataChange();
      },

      setCollection: (collection) => set({ collection }),
      setAutoDetectChange: (value) => set({ autoDetectChange: value }),
      setStartDate1: (date) => set({ startDate1: date }),
      setEndDate1: (date) => set({ endDate1: date }),
      setStartDate2: (date) => set({ startDate2: date }),
      setEndDate2: (date) => set({ endDate2: date }),

      // ── Layer selection (Compare mode) ───────────────────────────────────────
      activeLayerTypes: new Set(['rgb']),

      toggleLayerType: (layerType) =>
        set((state) => {
          const newLayers = new Set(state.activeLayerTypes);
          if (newLayers.has(layerType)) newLayers.delete(layerType);
          else newLayers.add(layerType);
          return { activeLayerTypes: newLayers };
        }),

      setActiveLayerTypes: (layers) => set({ activeLayerTypes: new Set(layers) }),

      // ── Loaded data ──────────────────────────────────────────────────────────
      period1Data: { rgb: null, ndvi: null, swir: null, classified: null },
      period2Data: { rgb: null, ndvi: null, swir: null, classified: null },
      comparisonData: null,

      setPeriod1Data: (layerType, data) => {
        set((state) => {
          const image = buildImageFromResponse(data, {
            layerType,
            splitSide: 'left',
            startDate: state.startDate1,
            endDate: state.endDate1,
            collection: state.collection,
            cloudCover: state.cloudCover,
          });
          return {
            period1Data: { ...state.period1Data, [layerType]: data },
            images: image
              ? { ...state.images, comparison: upsertByKey(state.images.comparison, image) }
              : state.images,
          };
        });
        get().handleSatelliteDataChange();
      },

      setPeriod2Data: (layerType, data) => {
        set((state) => {
          const image = buildImageFromResponse(data, {
            layerType,
            splitSide: 'right',
            startDate: state.startDate2,
            endDate: state.endDate2,
            collection: state.collection,
            cloudCover: state.cloudCover,
          });
          return {
            period2Data: { ...state.period2Data, [layerType]: data },
            images: image
              ? { ...state.images, comparison: upsertByKey(state.images.comparison, image) }
              : state.images,
          };
        });
        get().handleSatelliteDataChange();
      },

      setComparisonData: (data) => set({ comparisonData: data }),

      clearPeriodData: () => {
        set((state) => ({
          period1Data: { rgb: null, ndvi: null, swir: null },
          period2Data: { rgb: null, ndvi: null, swir: null },
          images: { ...state.images, comparison: [] },
        }));
        get().handleSatelliteDataChange();
      },

      // ── Images & layers ──────────────────────────────────────────────────────
      images: { single: [], comparison: [] },
      satelliteLayers: [],
      cachedResponses: {},
      customGeometry: null,

      setCustomGeometry: (geometry) => set({ customGeometry: geometry }),

      getCurrentGeometry: () => {
        const { customGeometry } = get();
        return customGeometry ?? getDefaultSatelliteGeometry();
      },

      addSingleImage: (image) => {
        set((state) => ({
          images: { ...state.images, single: upsertByKey(state.images.single, image) },
        }));
        get().handleSatelliteDataChange();
      },

      addComparisonImages: (comparisonImages) => {
        set((state) => {
          let nextComparison = state.images.comparison;
          comparisonImages.forEach((image) => {
            nextComparison = upsertByKey(nextComparison, image);
          });
          return { images: { ...state.images, comparison: nextComparison } };
        });
        get().handleSatelliteDataChange();
      },

      removeSingleImage: (imageId) => {
        set((state) => ({
          images: {
            ...state.images,
            single: state.images.single.filter((img) => img.id !== imageId),
          },
        }));
        get().handleSatelliteDataChange();
      },

      addChangeLayer: (response, meta = {}) => {
        const { isCompareMode, startDate1, endDate1, startDate2, endDate2, collection, cloudCover } =
          get();
        const data = response?.data ?? response;
        if (!data || !data.tileUrl) return;

        const baseMeta = {
          layerType: 'change',
          collection: meta.collection || collection,
          cloudCover: meta.cloudCover ?? cloudCover,
          layerOpacity: meta.layerOpacity ?? 0.85,
          visible: true,
        };

        if (isCompareMode) {
          const dateLabel = `${toDateString(meta.startDate1 || startDate1)} - ${toDateString(meta.endDate2 || endDate2)}`;
          const buildEntry = (side) => {
            const key = buildImageKey({
              ...baseMeta,
              splitSide: side,
              startDate: meta.startDate1 || startDate1,
              endDate: meta.endDate2 || endDate2,
            });
            const layerId = buildLayerIdFromKey(key);
            const sourceId = buildSatelliteSourceId(data.mapId || layerId, layerId);
            return {
              id: layerId, key, layerType: 'change', splitSide: side,
              layerOpacity: baseMeta.layerOpacity, visible: true,
              collection: baseMeta.collection, cloudCover: baseMeta.cloudCover,
              date: dateLabel, preview: data.tileUrl, mapId: data.mapId,
              downloadUrl: data.downloadUrl || null, totalImages: data.totalImages,
              areaStats: data.areaStats ?? null,
              legend: Array.isArray(data.legend) ? data.legend : [],
              visualizationParams: data.visualizationParams, metadata: data.metadata,
              token: data.token,
              layerData: { tileUrl: data.tileUrl, mapId: data.mapId, token: data.token, downloadUrl: data.downloadUrl || null },
              sourceId,
            };
          };
          const changeLeft = buildEntry('left');
          const changeRight = buildEntry('right');
          set((state) => {
            let nextComparison = state.images.comparison;
            nextComparison = upsertByKey(nextComparison, changeLeft);
            nextComparison = upsertByKey(nextComparison, changeRight);
            return { images: { ...state.images, comparison: nextComparison } };
          });
        } else {
          const key = buildImageKey({ ...baseMeta, splitSide: null, startDate: meta.startDate2 || '', endDate: meta.endDate2 || '' });
          const layerId = buildLayerIdFromKey(key);
          const sourceId = buildSatelliteSourceId(data.mapId || layerId, layerId);
          const changeImage = {
            id: layerId, key, layerType: 'change', splitSide: null,
            layerOpacity: baseMeta.layerOpacity, visible: true,
            collection: baseMeta.collection, cloudCover: baseMeta.cloudCover,
            date: `${toDateString(meta.startDate2 || '')} - ${toDateString(meta.endDate2 || '')}`,
            preview: data.tileUrl, mapId: data.mapId,
            downloadUrl: data.downloadUrl || null, totalImages: data.totalImages,
            areaStats: data.areaStats ?? null,
            legend: Array.isArray(data.legend) ? data.legend : [],
            visualizationParams: data.visualizationParams, metadata: data.metadata,
            token: data.token,
            layerData: { tileUrl: data.tileUrl, mapId: data.mapId, token: data.token, downloadUrl: data.downloadUrl || null },
            sourceId,
          };
          set((state) => ({
            images: { ...state.images, single: upsertByKey(state.images.single, changeImage) },
          }));
        }
        get().handleSatelliteDataChange();
      },

      updateLayerOpacity: (layerId, opacity) => {
        set((state) => {
          const idx = state.satelliteLayers.findIndex((l) => l.id === layerId);
          if (idx === -1) return {};
          const updated = [...state.satelliteLayers];
          updated[idx] = { ...updated[idx], layerOpacity: Math.max(0, Math.min(1, opacity)) };
          return { satelliteLayers: updated };
        });
      },

      updateLayerVisibility: (layerId, visible) => {
        set((state) => {
          const idx = state.satelliteLayers.findIndex((l) => l.id === layerId);
          if (idx === -1) return {};
          const updated = [...state.satelliteLayers];
          updated[idx] = { ...updated[idx], visible };
          return { satelliteLayers: updated };
        });
      },

      syncSingleImagesFromResults: (results, meta) => {
        if (!results) return;
        set((state) => {
          let nextSingle = state.images.single;
          Object.entries(results).forEach(([layerType, result]) => {
            const image = buildImageFromResponse(result, { ...meta, layerType, splitSide: null });
            if (image) nextSingle = upsertByKey(nextSingle, image);
          });
          return { images: { ...state.images, single: nextSingle } };
        });
        get().handleSatelliteDataChange();
      },

      handleSatelliteDataChange: () => {
        const { images, isCompareMode } = get();
        if (isCompareMode) {
          set({ satelliteLayers: images.comparison.filter(Boolean) });
          return;
        }
        if (images.single?.length > 0) {
          set({
            satelliteLayers: images.single.map((img) => ({
              ...img,
              splitSide: img.splitSide ?? null,
              layerOpacity: img.layerOpacity ?? 1,
            })),
          });
          return;
        }
        set({ satelliteLayers: [] });
      },

      // ── UI states ────────────────────────────────────────────────────────────
      isLoading: false,
      isLoadingComparison: false,
      error: null,
      errorComparison: null,
      legendCollapsed: false,
      activeLegendTab: 'rgb',

      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsLoadingComparison: (loading) => set({ isLoadingComparison: loading }),
      setError: (error) => set({ error }),
      setErrorComparison: (error) => set({ errorComparison: error }),
      clearError: () => set({ error: null }),
      clearErrorComparison: () => set({ errorComparison: null }),
      setLegendCollapsed: (collapsed) => set({ legendCollapsed: collapsed }),
      setActiveLegendTab: (tab) => {
        set({ activeLegendTab: tab });
        get().handleSatelliteDataChange();
      },

      // ── API helpers ──────────────────────────────────────────────────────────
      searchImages: async (options = {}) => {
        const { startDate, endDate, collection, cloudCover, selectedLayer, customGeometry } = get();
        const layerType = options.layerType || options.type || selectedLayer;
        const geometry = options.geometry || customGeometry || getDefaultSatelliteGeometry();
        const requestParams = {
          geometry,
          startDate: toDateString(options.startDate || startDate),
          endDate: toDateString(options.endDate || endDate),
          collection: options.collection || collection,
          cloudCover: options.cloudCover ?? cloudCover,
          layerType,
        };

        set({ isCompareMode: false, isLoading: true, error: null });
        try {
          const response = await SatelliteService.getSatelliteImage(requestParams);
          const image = buildImageFromResponse(response, { ...requestParams, splitSide: null });
          set((state) => ({
            analysisData: { ...(state.analysisData || {}), [layerType]: normalizeResponse(response) },
            images: image
              ? { ...state.images, single: upsertByKey(state.images.single, image) }
              : state.images,
          }));
          get().handleSatelliteDataChange();
          return response;
        } catch (error) {
          set({ error: error?.message || 'Không thể tải ảnh vệ tinh. Vui lòng thử lại.' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      searchComparisonImages: async (options = {}) => {
        const { startDate1, endDate1, startDate2, endDate2, collection, cloudCover, customGeometry } =
          get();
        const geometry = options.geometry || customGeometry || getDefaultSatelliteGeometry();
        const requestParams = {
          geometry,
          startDate1: toDateString(options.startDate1 || startDate1),
          endDate1: toDateString(options.endDate1 || endDate1),
          startDate2: toDateString(options.startDate2 || startDate2),
          endDate2: toDateString(options.endDate2 || endDate2),
          collection: options.collection || collection,
          cloudCover: options.cloudCover ?? cloudCover,
        };

        set({ isCompareMode: true, isLoading: true, isLoadingComparison: true, error: null });
        try {
          const response = await SatelliteService.compareImages(requestParams);
          get().addChangeLayer(response, requestParams);
          set({ comparisonData: response?.data ?? response });
          return response;
        } catch (error) {
          set({ error: error?.message || 'Không thể tải ảnh so sánh. Vui lòng thử lại.' });
          throw error;
        } finally {
          set({ isLoading: false, isLoadingComparison: false });
        }
      },

      // ── Reset & clear ────────────────────────────────────────────────────────
      resetToSingleMode: () => {
        const { satelliteLayers } = get();
        const mapRef = useMapStore.getState().mapRefObj;
        if (mapRef?.current) {
          satelliteLayers.forEach((layer) => {
            try {
              const targetMap =
                layer.splitSide === 'right' ? mapRef.current.split : mapRef.current.single;
              if (targetMap) removeSatelliteLayerFromMap(targetMap, layer.id, layer.sourceId);
            } catch (e) {
              console.error(`[resetToSingleMode] Error removing layer ${layer.id}:`, e);
            }
          });
        }
        set({
          isCompareMode: false, analysisData: null,
          period1Data: { rgb: null, ndvi: null, swir: null, classified: null },
          period2Data: { rgb: null, ndvi: null, swir: null, classified: null },
          comparisonData: null, images: { single: [], comparison: [] }, satelliteLayers: [],
          isLoading: false, isLoadingComparison: false, error: null, errorComparison: null,
        });
      },

      resetCompareSettings: () => {
        const { satelliteLayers } = get();
        const mapRef = useMapStore.getState().mapRefObj;
        if (mapRef?.current) {
          satelliteLayers.forEach((layer) => {
            try {
              const targetMap =
                layer.splitSide === 'right' ? mapRef.current.split : mapRef.current.single;
              if (targetMap) removeSatelliteLayerFromMap(targetMap, layer.id, layer.sourceId);
            } catch (e) {
              console.error(`[resetCompareSettings] Error removing layer ${layer.id}:`, e);
            }
          });
        }
        set({
          collection: 'S2', autoDetectChange: false,
          startDate1: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          endDate1: new Date(),
          startDate2: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          endDate2: new Date(new Date().getFullYear() - 1, new Date().getMonth() + 1, 0),
          cloudCover: 20, activeLayerTypes: new Set(['rgb']),
          period1Data: { rgb: null, ndvi: null, swir: null, classified: null },
          period2Data: { rgb: null, ndvi: null, swir: null, classified: null },
          comparisonData: null, images: { single: [], comparison: [] }, satelliteLayers: [],
          cachedResponses: {}, isLoading: false, isLoadingComparison: false,
          error: null, errorComparison: null, legendCollapsed: false, activeLegendTab: 'rgb',
        });
      },

      clearData: (mapRefOverride) => {
        const { satelliteLayers } = get();
        const mapRef = mapRefOverride ?? useMapStore.getState().mapRefObj;
        if (mapRef?.current) {
          satelliteLayers.forEach((layer) => {
            try {
              const targetMap =
                layer.splitSide === 'right' || layer.splitSide === 'change'
                  ? mapRef.current.split
                  : mapRef.current.single;
              if (targetMap) removeSatelliteLayerFromMap(targetMap, layer.id, layer.sourceId);
            } catch (e) {
              console.error(`[clearData] Error removing layer ${layer.id}:`, e);
            }
          });
        }
        set({
          analysisData: null,
          period1Data: { rgb: null, ndvi: null, swir: null, classified: null },
          period2Data: { rgb: null, ndvi: null, swir: null, classified: null },
          comparisonData: null, images: { single: [], comparison: [] }, satelliteLayers: [],
          error: null, errorComparison: null,
        });
      },

      reset: () => {
        const { satelliteLayers } = get();
        const mapRef = useMapStore.getState().mapRefObj;
        if (mapRef?.current) {
          satelliteLayers.forEach((layer) => {
            try {
              const targetMap =
                layer.splitSide === 'right' ? mapRef.current.split : mapRef.current.single;
              if (targetMap) removeSatelliteLayerFromMap(targetMap, layer.id, layer.sourceId);
            } catch (e) {
              console.error(`[reset] Error removing layer ${layer.id}:`, e);
            }
          });
        }
        set({
          autoDetectChange: false,
          startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          endDate: new Date(), selectedLayer: 'ndvi', cloudCover: 20, analysisData: null,
          isCompareMode: false, collection: 'S2',
          startDate1: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          endDate1: new Date(),
          startDate2: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          endDate2: new Date(new Date().getFullYear() - 1, new Date().getMonth() + 1, 0),
          activeLayerTypes: new Set(['rgb']),
          period1Data: { rgb: null, ndvi: null, swir: null, classified: null },
          period2Data: { rgb: null, ndvi: null, swir: null, classified: null },
          comparisonData: null, images: { single: [], comparison: [] }, satelliteLayers: [],
          cachedResponses: {}, isLoading: false, isLoadingComparison: false,
          error: null, errorComparison: null, legendCollapsed: false, activeLegendTab: 'rgb',
          customGeometry: null,
        });
      },
    }),
    { name: 'SatelliteStore' }
  )
);
