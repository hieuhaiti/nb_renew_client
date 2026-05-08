import i18n from '@/i18n';
import { env } from '@/config/env';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useMapStyleStore } from '@/features/map/store/useMapStyleStore';
import outdoorPreview from '@/assets/map_preview/outdoor_preview.png';
import streetPreview from '@/assets/map_preview/street_preview.png';
import satellitePreview from '@/assets/map_preview/satellite_preview.png';
import hybridPreview from '@/assets/map_preview/hybrid_preview.png';

const mapStyles = [
  {
    id: 'outdoor',
    name: 'mapStyle.outdoor',
    style: env.mapboxStyle_Outdoor,
    description: 'mapStyle.outdoorDesc',
  },
  {
    id: 'street',
    name: 'mapStyle.street',
    style: env.mapboxStyle_Street,
    description: 'mapStyle.streetDesc',
  },
  {
    id: 'satellite',
    name: 'mapStyle.satellite',
    style: env.mapboxStyle_Satellite,
    description: 'mapStyle.satelliteDesc',
  },
  {
    id: 'hybrid',
    name: 'mapStyle.satelliteStreet',
    style: env.mapboxStyle_Satellite_Street,
    description: 'mapStyle.satelliteStreetDesc',
  },
].filter((item) => item.style);

const previewByStyleId = {
  outdoor: outdoorPreview,
  street: streetPreview,
  satellite: satellitePreview,
  hybrid: hybridPreview,
};

export default class ToolBaseMap {
  onAdd(map) {
    this._map = map;
    this._expanded = false;
    this._optionButtons = [];

    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    Object.assign(this._container.style, {
      position: 'relative',
      overflow: 'visible',
    });

    this._toggleBtn = document.createElement('button');
    this._toggleBtn.type = 'button';
    this._toggleBtn.className = 'mapboxgl-ctrl-icon';
    this._toggleBtn.title = i18n.t('mapStyle.toggle');
    this._toggleBtn.setAttribute('aria-label', i18n.t('mapStyle.toggle'));
    this._toggleBtn.setAttribute('aria-expanded', 'false');
    this._toggleBtn.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers-icon lucide-layers"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>
		`;
    Object.assign(this._toggleBtn.style, {
      width: '29px',
      height: '29px',
      background: '#ffffff',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 180ms ease',
    });

    this._panel = document.createElement('div');
    Object.assign(this._panel.style, {
      position: 'absolute',
      right: 'calc(100% + 8px)',
      bottom: '0',
      width: '236px',
      padding: '8px',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      background: 'rgba(255, 255, 255, 0.96)',
      boxShadow: '0 12px 28px rgba(15, 23, 42, 0.2)',
      transformOrigin: 'right center',
      transition: 'opacity 180ms ease, transform 180ms ease, max-height 180ms ease',
      opacity: '0',
      transform: 'translateX(8px) scale(0.96)',
      maxHeight: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
      display: 'block',
      zIndex: '4',
    });

    this._grid = document.createElement('div');
    Object.assign(this._grid.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '6px',
    });

    const activeStyle = useMapStyleStore.getState().mapStyle;
    mapStyles.forEach((item) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.title = i18n.t(item.description);
      option.dataset.style = item.style;
      option.dataset.active = String(activeStyle === item.style);
      option.setAttribute('aria-label', `${i18n.t(item.name)}. ${i18n.t(item.description)}`);

      Object.assign(option.style, {
        width: '100%',
        minHeight: '76px',
        borderRadius: '6px',
        border: '1px solid rgba(30, 41, 59, 0.14)',
        background: '#ffffff',
        color: '#0f172a',
        cursor: 'pointer',
        padding: '4px',
        display: 'grid',
        gap: '4px',
        textAlign: 'left',
      });

      const preview = document.createElement('div');
      const previewImage = previewByStyleId[item.id];
      Object.assign(preview.style, {
        height: '44px',
        width: '100%',
        borderRadius: '4px',
        backgroundColor: '#e4e4e7',
        backgroundImage: previewImage ? `url(${previewImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: '1px solid rgba(15, 23, 42, 0.14)',
      });

      const label = document.createElement('span');
      label.textContent = i18n.t(item.name);
      Object.assign(label.style, {
        fontSize: '11px',
        fontWeight: '600',
        lineHeight: '1.2',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '0 2px',
      });

      option.appendChild(preview);
      option.appendChild(label);

      const onClick = () => {
        this._applyStyle(item.style);
        this._setActiveStyle(item.style);
        this._setExpanded(false);
      };

      option.addEventListener('click', onClick);
      this._optionButtons.push({ node: option, onClick });
      this._grid.appendChild(option);
    });

    this._setActiveStyle(activeStyle);

    this._onToggle = () => this._setExpanded(!this._expanded);
    this._onDocumentClick = (event) => {
      if (!this._container?.contains(event.target)) {
        this._setExpanded(false);
      }
    };
    this._toggleBtn.addEventListener('click', this._onToggle);
    document.addEventListener('click', this._onDocumentClick);

    this._container.appendChild(this._toggleBtn);
    this._panel.appendChild(this._grid);
    this._container.appendChild(this._panel);

    return this._container;
  }

  _applyStyle(styleUrl) {
    if (!styleUrl || !this._map) return;

    const { setMapStyle } = useMapStyleStore.getState();
    const mapRefObj = useMapStore.getState().mapRefObj;
    const splitMap = mapRefObj?.current?.split;

    try {
      this._map.setStyle(styleUrl, { diff: true });
      if (splitMap && splitMap !== this._map) {
        splitMap.setStyle(styleUrl, { diff: true });
      }
      setMapStyle(styleUrl);
    } catch (_err) {
      // Ignore style switching errors to avoid breaking map interaction.
    }
  }

  _setActiveStyle(styleUrl) {
    this._optionButtons.forEach(({ node }) => {
      const isActive = node.dataset.style === styleUrl;
      node.dataset.active = String(isActive);
      node.style.background = isActive ? '#f8fafc' : '#ffffff';
      node.style.borderColor = isActive ? 'rgba(59, 130, 246, 0.45)' : 'rgba(30, 41, 59, 0.14)';
    });
  }

  _setExpanded(expanded) {
    this._expanded = expanded;
    this._toggleBtn.setAttribute('aria-expanded', String(expanded));
    this._toggleBtn.style.transform = expanded ? 'scale(0.96)' : 'scale(1)';
    this._panel.style.opacity = expanded ? '1' : '0';
    this._panel.style.transform = expanded
      ? 'translateX(0) scale(1)'
      : 'translateX(8px) scale(0.96)';
    this._panel.style.maxHeight = expanded ? '220px' : '0';
    this._panel.style.pointerEvents = expanded ? 'auto' : 'none';
  }

  onRemove() {
    if (this._toggleBtn && this._onToggle) {
      this._toggleBtn.removeEventListener('click', this._onToggle);
    }

    if (this._onDocumentClick) {
      document.removeEventListener('click', this._onDocumentClick);
    }

    this._optionButtons.forEach(({ node, onClick }) => {
      node.removeEventListener('click', onClick);
    });
    this._optionButtons = [];

    if (this._container?.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }

    this._panel = undefined;
    this._grid = undefined;
    this._toggleBtn = undefined;
    this._container = undefined;
    this._map = undefined;
  }
}
