import { defaultLatLong, defaultZoom, pitchDefault } from '../../constant/mapConstant';
import { useMapStyleStore } from '@/features/map/store/useMapStyleStore';

export default class ResetControl {
  onAdd(map) {
    this._map = map;

    // Create button
    this._btn = document.createElement('button');
    this._btn.className = 'mapboxgl-ctrl-icon';
    this._btn.title = 'Reset về vị trí mặc định';
    Object.assign(this._btn.style, {
      width: '29px',
      height: '29px',
      background: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

    this._btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 2v6h-6"/>
                <path d="M3 12a9 9 0 0 1 9-9c2.5 0 4.8 1 6.5 2.7L21 8"/>
                <path d="M3 22v-6h6"/>
                <path d="M21 12a9 9 0 0 1-9 9c-2.5 0-4.8-1-6.5-2.7L3 16"/>
            </svg>
        `;

    this._btn.onclick = () => {
      map.flyTo({
        center: defaultLatLong,
        zoom: defaultZoom,
        pitch: pitchDefault(useMapStyleStore.getState().terrainState),
        bearing: 0,
      });
    };

    // Create container control
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
    this._container.appendChild(this._btn);
    return this._container;
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
    this._btn = undefined;
    this._container = undefined;
  }
}
