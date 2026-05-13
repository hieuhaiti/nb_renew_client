import i18n from '@/i18n';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useMapStyleStore } from '@/features/map/store/useMapStyleStore';
import { pitchDefault } from '../../constant/mapConstant';

const BUILDING_LAYER_ID = '3d-buildings';
const DEM_SOURCE_ID = 'mapbox-dem';

export default class ToolViewModeControl {
  onAdd(map) {
    this._map = map;

    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    this._btn2D = document.createElement('button');
    this._btn2D.type = 'button';
    this._btn2D.textContent = '2D';
    this._btn2D.title = i18n.t('mapPage.layout.tool2dDesc');
    this._btn2D.setAttribute('aria-label', i18n.t('mapPage.layout.tool2dDesc'));
    this._btn2D.style.fontSize = '0.75rem';
    this._btn2D.style.fontWeight = '700';

    this._btn3D = document.createElement('button');
    this._btn3D.type = 'button';
    this._btn3D.textContent = '3D';
    this._btn3D.title = i18n.t('mapPage.layout.tool3dDesc');
    this._btn3D.setAttribute('aria-label', i18n.t('mapPage.layout.tool3dDesc'));
    this._btn3D.style.fontSize = '0.75rem';
    this._btn3D.style.fontWeight = '700';

    this._on2DClick = () => this._setViewMode(false);
    this._on3DClick = () => this._setViewMode(true);
    this._onStyleLoad = () => {
      const { terrainState, buildingState } = useMapStyleStore.getState();
      const enable3D = terrainState === true && buildingState === true;
      this._resolveMaps().forEach((mapInstance, index) => {
        this._applyMap3DState(mapInstance, enable3D, {
          animate: index === 0 && enable3D === false,
        });
      });
      this._syncActiveMode();
    };

    this._btn2D.addEventListener('click', this._on2DClick);
    this._btn3D.addEventListener('click', this._on3DClick);

    this._container.appendChild(this._btn2D);
    this._container.appendChild(this._btn3D);

    this._resolveMaps().forEach((mapInstance) => {
      mapInstance.on('style.load', this._onStyleLoad);
    });

    // Apply initial mode from store defaults (stateTerrainRender) on first mount.
    this._applyInitialMode();
    this._syncActiveMode();

    return this._container;
  }

  _applyInitialMode() {
    const { terrainState, setTerrainState, setBuildingState } = useMapStyleStore.getState();
    const enable3D = terrainState === true;

    setTerrainState(enable3D);
    setBuildingState(enable3D);

    this._resolveMaps().forEach((mapInstance) => {
      this._applyMap3DState(mapInstance, enable3D, { animate: false });
    });
  }

  _resolveMaps() {
    const maps = [];
    if (this._map) {
      maps.push(this._map);
    }

    const splitMap = useMapStore.getState().mapRefObj?.current?.split;
    if (splitMap && splitMap !== this._map) {
      maps.push(splitMap);
    }

    return maps;
  }

  _setViewMode(enable3D) {
    const { setTerrainState, setBuildingState } = useMapStyleStore.getState();

    this._resolveMaps().forEach((mapInstance, index) => {
      this._applyMap3DState(mapInstance, enable3D, { animate: index === 0 });
    });

    setTerrainState(enable3D);
    setBuildingState(enable3D);
    this._syncActiveMode();
  }

  _applyMap3DState(mapInstance, enable3D, { animate } = { animate: false }) {
    if (!mapInstance) return;

    if (!mapInstance.isStyleLoaded()) {
      mapInstance.once('style.load', () => {
        this._applyMap3DState(mapInstance, enable3D, { animate: false });
      });
      return;
    }

    const nextPitch = pitchDefault(enable3D);
    try {
      if (animate) {
        mapInstance.easeTo({
          pitch: nextPitch,
          ...(enable3D ? {} : { bearing: 0 }),
          duration: enable3D ? 550 : 450,
          essential: true,
        });
      } else {
        mapInstance.setPitch(nextPitch);
        if (!enable3D) {
          mapInstance.setBearing(0);
        }
      }
    } catch (_cameraError) {
      // Ignore camera timing errors and continue applying style state below.
    }

    try {
      if (enable3D) {
        this._ensureTerrain(mapInstance);
        this._setBuildingLayerVisibility(mapInstance, true);
      } else {
        mapInstance.setTerrain(null);
        this._setBuildingLayerVisibility(mapInstance, false);
      }
    } catch (_styleError) {
      // Keep view-mode UX responsive even if terrain/building style operations fail.
    }
  }

  _ensureTerrain(mapInstance) {
    if (!mapInstance.getSource(DEM_SOURCE_ID)) {
      mapInstance.addSource(DEM_SOURCE_ID, {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
    }

    mapInstance.setTerrain({
      source: DEM_SOURCE_ID,
      exaggeration: 1.2,
    });
  }

  _setBuildingLayerVisibility(mapInstance, visible) {
    if (!mapInstance.getLayer(BUILDING_LAYER_ID) && visible) {
      this._add3DBuildingLayer(mapInstance);
    }

    if (mapInstance.getLayer(BUILDING_LAYER_ID)) {
      mapInstance.setLayoutProperty(BUILDING_LAYER_ID, 'visibility', visible ? 'visible' : 'none');
    }
  }

  _add3DBuildingLayer(mapInstance) {
    const style = mapInstance.getStyle();
    const hasCompositeSource = Boolean(style?.sources?.composite);

    if (!hasCompositeSource || mapInstance.getLayer(BUILDING_LAYER_ID)) {
      return;
    }

    const labelLayerId = style.layers?.find(
      (layer) => layer.type === 'symbol' && layer.layout && layer.layout['text-field']
    )?.id;

    mapInstance.addLayer(
      {
        id: BUILDING_LAYER_ID,
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', ['get', 'extrude'], 'true'],
        type: 'fill-extrusion',
        minzoom: 12,
        paint: {
          'fill-extrusion-color': '#cbd5e1',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            0,
            12.5,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            0,
            12.5,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.72,
        },
      },
      labelLayerId
    );
  }

  _syncActiveMode() {
    const { terrainState, buildingState } = useMapStyleStore.getState();
    const is3D = terrainState === true && buildingState === true;

    this._btn2D.style.background = is3D ? '#ffffff' : '#eff6ff';
    this._btn2D.style.color = is3D ? '#0f172a' : '#1d4ed8';
    this._btn2D.style.fontWeight = is3D ? '600' : '700';

    this._btn3D.style.background = is3D ? '#eff6ff' : '#ffffff';
    this._btn3D.style.color = is3D ? '#1d4ed8' : '#0f172a';
    this._btn3D.style.fontWeight = is3D ? '700' : '600';
  }

  onRemove() {
    this._resolveMaps().forEach((mapInstance) => {
      if (this._onStyleLoad) {
        mapInstance.off('style.load', this._onStyleLoad);
      }
    });

    if (this._btn2D && this._on2DClick) {
      this._btn2D.removeEventListener('click', this._on2DClick);
    }

    if (this._btn3D && this._on3DClick) {
      this._btn3D.removeEventListener('click', this._on3DClick);
    }

    if (this._container?.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }

    this._btn2D = undefined;
    this._btn3D = undefined;
    this._container = undefined;
    this._map = undefined;
  }
}
