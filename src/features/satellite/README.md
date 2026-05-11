# Satellite Feature

Module phÃ¢n tÃ­ch áº£nh vá»‡ tinh tÃ­ch há»£p Google Earth Engine, cho phÃ©p xem NDVI, RGB, nhiá»‡t Ä‘á»™ bá» máº·t, phÃ¢n loáº¡i lá»›p phá»§ vÃ  phÃ¡t hiá»‡n thay Ä‘á»•i rá»«ng trÃªn báº£n Ä‘á»“ Mapbox.

## Cáº¥u trÃºc file

```
src/features/satellite/
â”œâ”€â”€ api/
â”‚   â””â”€â”€ satelliteEndpoints.js       # Endpoint constants
â”œâ”€â”€ services/
â”‚   â””â”€â”€ satelliteService.js         # Direct API calls (uses mutater)
â”œâ”€â”€ hooks/
â”‚   â”œâ”€â”€ useSatelliteMutations.js    # React Query mutations (imagery)
â”œâ”€â”€ store/
â”‚   â””â”€â”€ useSatelliteStore.js        # Zustand store (state + map sync)
â”œâ”€â”€ utils/
â”‚   â”œâ”€â”€ satelliteGeometry.util.js   # Geometry helpers + khubaoton.json
â”‚   â”œâ”€â”€ satelliteMapLayer.util.js   # Mapbox raster layer helpers
â”‚   â””â”€â”€ satelliteUtils.js           # Date + formatting utilities
â”œâ”€â”€ constants/
â”‚   â””â”€â”€ satelliteConstants.js       # Layer config, collection options, fallback legends
â”œâ”€â”€ schemas/
â”‚   â””â”€â”€ satellite.schema.js         # Zod validation schemas
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ SatelliteSingleModePanel.jsx
â”‚   â”œâ”€â”€ SatelliteCompareModePanel.jsx
â”‚   â”œâ”€â”€ SatelliteLayerManager.jsx
â”‚   â”œâ”€â”€ SatelliteLayerControl.jsx
â”‚   â”œâ”€â”€ SatelliteStatsPanel.jsx
â”‚   â”œâ”€â”€ SatelliteMapOverlayControls.jsx
â”‚   â”œâ”€â”€ SatelliteEmptyState.jsx
â”‚   â”œâ”€â”€ SatelliteLoadingState.jsx
â”‚   â””â”€â”€ SatelliteErrorState.jsx
â”œâ”€â”€ index.js                        # Public API
â””â”€â”€ README.md
```

## API endpoints

| Endpoint | Má»¥c Ä‘Ã­ch |
|---|---|
| `POST /satellite/rgb` | áº¢nh mÃ u tá»•ng há»£p (True Color) |
| `POST /satellite/ndvi` | Chá»‰ sá»‘ thá»±c váº­t NDVI |
| `POST /satellite/heat-map` | Nhiá»‡t Ä‘á»™ bá» máº·t Ä‘áº¥t (LST) |
| `POST /satellite/classified` | PhÃ¢n loáº¡i lá»›p phá»§ Ä‘áº¥t (7 lá»›p) |
| `POST /satellite/compare` | So sÃ¡nh/phÃ¡t hiá»‡n thay Ä‘á»•i giá»¯a 2 ká»³ |
| `POST /satellite/change` | Change detection (endpoint bá»• sung) |

## Default geometry â€” khubaoton.json

File `src/data/khubaoton.json` lÃ  FeatureCollection cÃ¡c khu báº£o tá»“n tá»‰nh Ninh BÃ¬nh.
Táº¥t cáº£ API requests Ä‘á»u dÃ¹ng geometry Ä‘áº§u tiÃªn tÃ¬m Ä‘Æ°á»£c trong file nÃ y lÃ m máº·c Ä‘á»‹nh.

```js
import { getDefaultSatelliteGeometry } from '@/features/satellite/utils/satelliteGeometry.util';
const geometry = getDefaultSatelliteGeometry(); // Polygon/MultiPolygon
```

## ThÃªm raster layer lÃªn báº£n Ä‘á»“

```js
import { addSatelliteLayerToMap, removeSatelliteLayerFromMap } from '@/features/satellite/utils/satelliteMapLayer.util';

// Add
addSatelliteLayerToMap(map, { tileUrl, mapId }, 'my-layer-id', 0.85);

// Remove
removeSatelliteLayerFromMap(map, 'my-layer-id', 'satellite-src-...');
```

## DÃ¹ng hooks/service

```js
// Direct service call
import { getSatelliteNdvi } from '@/features/satellite';
const result = await getSatelliteNdvi({ geometry, startDate, endDate, collection, cloudCover });

// React Query mutation
import { useSatelliteNdviMutation } from '@/features/satellite';
const { mutate, isPending, data } = useSatelliteNdviMutation();
mutate(payload);
```

## DÃ¹ng store

```js
import { useSatelliteStore } from '@/features/satellite';
const { satelliteLayers, searchImages, reset } = useSatelliteStore();
```

## Env/API client

- `VITE_BASE_URL_BE` â€” backend base URL (qua `src/config/env.js`)
- `VITE_MAPBOX_TOKEN` â€” Mapbox token
- DÃ¹ng axios instance `src/services/apiClient.js`, khÃ´ng táº¡o má»›i

## Unresolved

1. `POST /satellite/change` co trong backend nhung chua co UI rieng - hien dung `POST /satellite/compare` cho change detection.
2. ROI hien dung mac dinh la khu bao ton dau tien trong `khubaoton.json` - co the them ROI picker sau.
3. `mapbox-gl-compare` can package da cai (`pnpm add mapbox-gl-compare`).

