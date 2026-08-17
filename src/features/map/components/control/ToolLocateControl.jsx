import mapboxgl from 'mapbox-gl';
import i18n from '@/i18n';
import { useMapStore } from '@/features/map/store/useMapStore';
import { defaultZoom, locateFlyBearing, locateFlyDuration } from '@/features/map/constant/mapConstant';

export default class ToolLocateControl {
  _getMaps() {
    const mapRefObj = useMapStore.getState().mapRefObj?.current;
    return [this._map, mapRefObj?.single, mapRefObj?.split].filter(
      (instance, index, all) => instance && all.indexOf(instance) === index
    );
  }

  _clearLocateVisuals() {
    this._markers.forEach((marker) => marker.remove());
    this._markers = [];
  }

  onAdd(map) {
    this._map = map;
    this._markers = [];
    this._isActive = false;

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

      if (this._isActive) {
        this._isActive = false;
        this._clearLocateVisuals();
        this._btn.classList.remove('mapboxgl-ctrl-geolocate-active');
        this._btn.classList.remove('mapboxgl-ctrl-geolocate-waiting');
        this._btn.disabled = false;
        return;
      }

      this._btn.disabled = true;
      this._btn.classList.add('mapboxgl-ctrl-geolocate-waiting');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!this._btn) return;
          const center = [position.coords.longitude, position.coords.latitude];
          const maps = this._getMaps();

          this._markers.forEach((marker) => marker.remove());
          this._markers = [];

          maps.forEach((mapInstance) => {
            const el = document.createElement('div');
            el.className = 'mapboxgl-user-location';
            const dot = document.createElement('div');
            dot.className = 'mapboxgl-user-location-dot';
            el.appendChild(dot);

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat(center)
              .addTo(mapInstance);
            this._markers.push(marker);

            const currentZoom = Number(mapInstance.getZoom?.());
            const currentPitch = Number(mapInstance.getPitch?.());
            const zoom = Number.isFinite(currentZoom) ? Math.max(currentZoom, defaultZoom) : defaultZoom;
            const pitch = Number.isFinite(currentPitch) ? currentPitch : 0;

            try {
              mapInstance.flyTo({
                center,
                zoom,
                pitch,
                bearing: locateFlyBearing,
                essential: true,
                duration: locateFlyDuration,
              });
            } catch (_error) {
              mapInstance.jumpTo({
                center,
                zoom,
                pitch,
                bearing: locateFlyBearing,
              });
            }
          });

          this._isActive = true;
          this._btn.disabled = false;
          this._btn.classList.remove('mapboxgl-ctrl-geolocate-waiting');
          this._btn.classList.add('mapboxgl-ctrl-geolocate-active');
        },
        () => {
          if (!this._btn) return;
          this._isActive = false;
          this._btn.disabled = false;
          this._btn.classList.remove('mapboxgl-ctrl-geolocate-waiting');
          this._btn.classList.remove('mapboxgl-ctrl-geolocate-active');
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

  triggerLocate(lng, lat) {
    if (!this._btn) return;

    const center = [lng, lat];
    const maps = this._getMaps();

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

      const currentZoom = Number(mapInstance.getZoom?.());
      const currentPitch = Number(mapInstance.getPitch?.());
      const zoom = Number.isFinite(currentZoom) ? Math.max(currentZoom, defaultZoom) : defaultZoom;
      const pitch = Number.isFinite(currentPitch) ? currentPitch : 0;

      try {
        mapInstance.flyTo({
          center,
          zoom,
          pitch,
          bearing: locateFlyBearing,
          essential: true,
          duration: locateFlyDuration,
        });
      } catch (_error) {
        mapInstance.jumpTo({ center, zoom, pitch, bearing: locateFlyBearing });
      }
    });

    this._isActive = true;
    this._btn.disabled = false;
    this._btn.classList.remove('mapboxgl-ctrl-geolocate-waiting');
    this._btn.classList.add('mapboxgl-ctrl-geolocate-active');
  }

  deactivate() {
    if (!this._btn) return;
    this._isActive = false;
    this._clearLocateVisuals();
    this._btn.classList.remove('mapboxgl-ctrl-geolocate-active');
    this._btn.classList.remove('mapboxgl-ctrl-geolocate-waiting');
    this._btn.disabled = false;
  }

  onRemove() {
    if (this._btn && this._onLocateClick) {
      this._btn.removeEventListener('click', this._onLocateClick);
    }

    this._isActive = false;
    this._clearLocateVisuals();

    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }

    this._map = undefined;
    this._btn = undefined;
    this._container = undefined;
    this._isActive = undefined;
  }
}
