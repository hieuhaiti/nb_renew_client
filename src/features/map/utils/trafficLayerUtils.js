const INCIDENTS_SOURCE = 'traffic-incidents';
const INCIDENTS_SHADOW_LAYER = 'traffic-incidents-shadow';
const INCIDENTS_LAYER = 'traffic-incidents-layer';

const FLOW_SOURCE = 'traffic-flow';
const FLOW_LAYER = 'traffic-flow-layer';

// Keyed by TomTom iconCategory (ic field)
// Keyed by TomTom iconCategory (ic field)
const ICON_CAT_META = {
  0: {
    vi: 'Không xác định',
    en: 'Unknown',
    color: '#475569',
    bg: '#e2e8f0',
  },

  1: {
    vi: 'Tai nạn',
    en: 'Accident',
    color: '#b91c1c',
    bg: '#fee2e2',
  },

  2: {
    vi: 'Sương mù',
    en: 'Fog',
    color: '#475569',
    bg: '#cbd5e1',
  },

  3: {
    vi: 'Điều kiện nguy hiểm',
    en: 'Dangerous Conditions',
    color: '#c2410c',
    bg: '#ffedd5',
  },

  4: {
    vi: 'Mưa',
    en: 'Rain',
    color: '#1d4ed8',
    bg: '#dbeafe',
  },

  5: {
    vi: 'Đóng băng',
    en: 'Ice',
    color: '#0e7490',
    bg: '#cffafe',
  },

  6: {
    vi: 'Ùn tắc',
    en: 'Jam',
    color: '#b91c1c',
    bg: '#fecaca',
  },

  7: {
    vi: 'Đóng làn',
    en: 'Lane Closed',
    color: '#6d28d9',
    bg: '#ede9fe',
  },

  8: {
    vi: 'Đường đóng',
    en: 'Road Closed',
    color: '#581c87',
    bg: '#f3e8ff',
  },

  9: {
    vi: 'Thi công đường',
    en: 'Road Works',
    color: '#b45309',
    bg: '#fef3c7',
  },

  10: {
    vi: 'Gió mạnh',
    en: 'Wind',
    color: '#334155',
    bg: '#e2e8f0',
  },

  11: {
    vi: 'Ngập lụt',
    en: 'Flooding',
    color: '#0369a1',
    bg: '#e0f2fe',
  },

  14: {
    vi: 'Xe bị hỏng',
    en: 'Broken Down Vehicle',
    color: '#c2410c',
    bg: '#fed7aa',
  },
};

// Category 6 (Jam) sub-type refinement keyed by TomTom description text
const JAM_DESC_META = {
  'stationary traffic': {
    vi: 'Kẹt xe hoàn toàn',
    en: 'Stationary Traffic',
    color: '#b91c1c',
    bg: '#fecaca',
  },

  'queuing traffic': {
    vi: 'Xe xếp hàng',
    en: 'Queuing Traffic',
    color: '#c2410c',
    bg: '#fed7aa',
  },

  'slow traffic': {
    vi: 'Giao thông chậm',
    en: 'Slow Traffic',
    color: '#a16207',
    bg: '#fef3c7',
  },
};

const FALLBACK_META = {
  vi: 'Sự cố giao thông',
  en: 'Traffic Incident',
  color: '#c2410c',
  bg: '#ffedd5',
};

function incidentMeta(iconCategory, description) {
  const cat = Number(iconCategory);

  // Category 6 (Jam) — refine by description text for severity colour
  if (cat === 6 && description) {
    const key = String(description).toLowerCase().trim();
    if (JAM_DESC_META[key]) return JAM_DESC_META[key];
    if (key.includes('stationar') || key.includes('kẹt'))
      return JAM_DESC_META['stationary traffic'];
    if (key.includes('queue') || key.includes('queuing')) return JAM_DESC_META['queuing traffic'];
    if (key.includes('slow')) return JAM_DESC_META['slow traffic'];
  }

  return ICON_CAT_META[cat] ?? FALLBACK_META;
}

function fmtTime(isoStr) {
  if (!isoStr) return null;
  try {
    const d = new Date(isoStr);
    const vh = (d.getUTCHours() + 7) % 24;
    const vm = d.getUTCMinutes().toString().padStart(2, '0');
    return `${vh}:${vm}`;
  } catch {
    return null;
  }
}

function fmtRoad(raw) {
  if (!raw || raw === '[]' || raw === '') return '';
  if (typeof raw === 'string' && raw.startsWith('[')) {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.join(', ') : raw;
    } catch {
      /* ignore */
    }
  }
  return String(raw).trim();
}

export function buildIncidentPopupHTML(props, lang = 'vi') {
  const meta = incidentMeta(props?.iconCategory, props?.description);
  const label = meta[lang] ?? meta.vi;
  const isEn = lang === 'en';

  const delaySec = Number(props?.delay ?? 0);
  const delayMin = Math.round(delaySec / 60);
  const delayText =
    delayMin >= 1 ? `+${delayMin} ${isEn ? 'min' : 'phút'}` : delaySec > 0 ? `+${delaySec}s` : '';

  const lengthM = Number(props?.length ?? 0);
  const lengthText =
    lengthM >= 1000 ? `${(lengthM / 1000).toFixed(1)} km` : lengthM > 0 ? `${lengthM} m` : '';

  const road = fmtRoad(props?.roadNumbers);
  const from = String(props?.from ?? '').trim();
  const to = String(props?.to ?? '').trim();
  const endT = fmtTime(props?.endTime);
  const routeText = from === to ? from : [from, to].filter(Boolean).join(' → ');
  const hasBody = routeText || road || lengthText || endT;
  const untilLbl = isEn ? 'Until' : 'Đến';

  return `<div class="traffic-popup-inner">
  <div class="traffic-popup-header" style="border-left:3px solid ${meta.color}">
    <div class="traffic-popup-title-row">
      <span class="traffic-popup-dot" style="background:${meta.color};box-shadow:0 0 0 3px ${meta.color}33"></span>
      <span class="traffic-popup-title">${label}</span>
    </div>
    ${delayText ? `<span class="traffic-popup-delay-badge" style="background:${meta.bg};color:${meta.color}">${delayText}</span>` : ''}
  </div>
  ${
    hasBody
      ? `<div class="traffic-popup-body">
    ${road ? `<span class="traffic-popup-road-badge" style="border-color:${meta.color}33;color:${meta.color}">${road}</span>` : ''}
    ${routeText ? `<div class="traffic-popup-route">${routeText}</div>` : ''}
    ${
      lengthText || endT
        ? `<div class="traffic-popup-meta-row">
      ${lengthText ? `<span class="traffic-popup-chip">${lengthText}</span>` : ''}
      ${endT ? `<span class="traffic-popup-chip">${untilLbl} ${endT}</span>` : ''}
    </div>`
        : ''
    }
  </div>`
      : ''
  }
</div>`.trim();
}

export { INCIDENTS_LAYER };

// Mapbox expression: colour by iconCategory (numeric), refine Jam (6) by description
const CIRCLE_COLOR_EXPR = [
  'match',
  ['get', 'iconCategory'],
  1,
  '#dc2626', // Accident
  2,
  '#64748b', // Fog
  3,
  '#f97316', // Dangerous Conditions
  4,
  '#3b82f6', // Rain
  5,
  '#06b6d4', // Ice
  6,
  [
    'match',
    ['get', 'description'],
    'stationary traffic',
    '#ef4444',
    'queuing traffic',
    '#f97316',
    'slow traffic',
    '#eab308',
    '#ef4444',
  ],
  7,
  '#7c3aed', // Lane Closed
  8,
  '#7c3aed', // Road Closed
  9,
  '#3b82f6', // Road Works
  10,
  '#64748b', // Wind
  11,
  '#0ea5e9', // Flooding
  14,
  '#f97316', // Broken Down Vehicle
  '#f97316',
];

const CIRCLE_RADIUS_EXPR = [
  'interpolate',
  ['linear'],
  ['to-number', ['get', 'delay'], 0],
  0,
  7,
  120,
  9,
  300,
  12,
  600,
  15,
];

export function addTrafficIncidentLayer(map, incidentGeoJSON) {
  if (!map) return;
  removeTrafficIncidentLayer(map);

  map.addSource(INCIDENTS_SOURCE, { type: 'geojson', data: incidentGeoJSON });

  map.addLayer({
    id: INCIDENTS_SHADOW_LAYER,
    type: 'circle',
    source: INCIDENTS_SOURCE,
    paint: {
      'circle-radius': ['+', CIRCLE_RADIUS_EXPR, 3],
      'circle-color': '#000',
      'circle-opacity': 0.12,
      'circle-blur': 1.5,
      'circle-translate': [0, 2],
    },
  });

  map.addLayer({
    id: INCIDENTS_LAYER,
    type: 'circle',
    source: INCIDENTS_SOURCE,
    paint: {
      'circle-radius': CIRCLE_RADIUS_EXPR,
      'circle-color': CIRCLE_COLOR_EXPR,
      'circle-opacity': 0.9,
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#fff',
    },
  });
}

export function removeTrafficIncidentLayer(map) {
  if (!map) return;
  if (map.getLayer(INCIDENTS_LAYER)) map.removeLayer(INCIDENTS_LAYER);
  if (map.getLayer(INCIDENTS_SHADOW_LAYER)) map.removeLayer(INCIDENTS_SHADOW_LAYER);
  if (map.getSource(INCIDENTS_SOURCE)) map.removeSource(INCIDENTS_SOURCE);
}

export function updateTrafficIncidentData(map, incidentGeoJSON) {
  if (!map) return;
  const source = map.getSource(INCIDENTS_SOURCE);
  if (source) {
    source.setData(incidentGeoJSON);
  } else {
    addTrafficIncidentLayer(map, incidentGeoJSON);
  }
}

export function addTrafficFlowLayer(map) {
  if (!map) return;
  removeTrafficFlowLayer(map);

  map.addSource(FLOW_SOURCE, {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-traffic-v1',
  });

  map.addLayer({
    id: FLOW_LAYER,
    type: 'line',
    source: FLOW_SOURCE,
    'source-layer': 'traffic',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 15, 3.5],
      'line-color': [
        'match',
        ['get', 'congestion'],
        'low',
        '#10b981',
        'moderate',
        '#eab308',
        'heavy',
        '#f97316',
        'severe',
        '#ef4444',
        '#94a3b8',
      ],
      'line-opacity': 0.85,
    },
  });
}

export function removeTrafficFlowLayer(map) {
  if (!map) return;
  if (map.getLayer(FLOW_LAYER)) map.removeLayer(FLOW_LAYER);
  if (map.getSource(FLOW_SOURCE)) map.removeSource(FLOW_SOURCE);
}

export const TRAFFIC_LAYER_IDS = {
  incidentsShadow: INCIDENTS_SHADOW_LAYER,
  incidents: INCIDENTS_LAYER,
  flow: FLOW_LAYER,
};

// Exported for use in TrafficPanel legend (excludes category 0 Unknown)
export const INCIDENT_LEGEND = Object.entries(ICON_CAT_META)
  .filter(([cat]) => Number(cat) !== 0)
  .map(([, meta]) => meta);
