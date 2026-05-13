import mapboxgl from 'mapbox-gl';
import i18n from '@/i18n';
import { highlightPointOnMap } from '@/features/map/utils/MapHelper';
import { useMapStore } from '@/features/map/store/useMapStore';

export default class ToolLocateControl {
  onAdd(map) {
    this._map = map;
    this._markers = [];

    this._btn = document.createElement('button');
    this._btn.type = 'button';
    this._btn.className = 'mapboxgl-ctrl-geolocate';
    this._btn.title = i18n.t('mapPage.layout.toolLocate');
    this._btn.setAttribute('aria-label', i18n.t('mapPage.layout.toolLocate'));

    const icon = document.createElement('span');
    icon.className = 'mapboxgl-ctrl-icon';
    icon.setAttribute('aria-hidden', 'true');
    this._btn.appendChild(icon);

    this._onLocateClick = () => {
      if (!navigator.geolocation) {
        return;
      }

      this._btn.disabled = true;
      this._btn.classList.add('mapboxgl-ctrl-geolocate-waiting');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const center = [position.coords.longitude, position.coords.latitude];
          const mapRefObj = useMapStore.getState().mapRefObj?.current;
          const maps = [this._map, mapRefObj?.single, mapRefObj?.split].filter(
            (instance, index, all) => instance && all.indexOf(instance) === index
          );

          this._markers.forEach((marker) => marker.remove());
          this._markers = [];

          maps.forEach((mapInstance) => {
            const el = document.createElement('div');
            el.className = 'mapboxgl-user-location';
            const dot = document.createElement('div');
            dot.className = 'mapboxgl-user-location-dot';
            el.appendChild(dot);

            const marker = new mapboxgl.Marker({ element: el }).setLngLat(center).addTo(mapInstance);
            this._markers.push(marker);
            highlightPointOnMap(mapInstance, {
              coordinates: center,
            });
          });

          this._btn.disabled = false;
          this._btn.classList.remove('mapboxgl-ctrl-geolocate-waiting');
          this._btn.classList.add('mapboxgl-ctrl-geolocate-active');
        },
        () => {
          this._btn.disabled = false;
          this._btn.classList.remove('mapboxgl-ctrl-geolocate-waiting');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    };

    this._btn.addEventListener('click', this._onLocateClick);

    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    if (this._btn && this._onLocateClick) {
      this._btn.removeEventListener('click', this._onLocateClick);
    }

    this._markers.forEach((marker) => marker.remove());
    this._markers = [];

    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }

    this._map = undefined;
    this._btn = undefined;
    this._container = undefined;
  }
}
