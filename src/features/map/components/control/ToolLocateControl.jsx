import mapboxgl from 'mapbox-gl';
import i18n from '@/i18n';

export default class ToolLocateControl {
  onAdd(map) {
    this._map = map;
    this._marker = null;

    this._btn = document.createElement('button');
    this._btn.type = 'button';
    this._btn.className = 'mapboxgl-ctrl-icon';
    this._btn.title = i18n.t('mapPage.layout.toolLocate');
    this._btn.setAttribute('aria-label', i18n.t('mapPage.layout.toolLocate'));
    Object.assign(this._btn.style, {
      width: '1.8125rem',
      height: '1.8125rem',
      background: '#ffffff',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

    this._btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 2v3"></path>
        <path d="M12 19v3"></path>
        <path d="M2 12h3"></path>
        <path d="M19 12h3"></path>
      </svg>
    `;

    this._onLocateClick = () => {
      if (!navigator.geolocation) {
        return;
      }

      this._btn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const center = [position.coords.longitude, position.coords.latitude];

          if (this._marker) {
            this._marker.remove();
          }

          this._marker = new mapboxgl.Marker({ color: '#18b76a' }).setLngLat(center).addTo(map);

          map.flyTo({
            center,
            zoom: 12.8,
            essential: true,
          });

          this._btn.disabled = false;
        },
        () => {
          this._btn.disabled = false;
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

    if (this._marker) {
      this._marker.remove();
      this._marker = null;
    }

    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }

    this._map = undefined;
    this._btn = undefined;
    this._container = undefined;
  }
}
