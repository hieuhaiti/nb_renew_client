# Satellite Feature

Module phân tích ảnh vệ tinh tích hợp Google Earth Engine, cho phép xem NDVI, RGB, nhiệt độ bề mặt, phân loại lớp phủ và phát hiện thay đổi rừng trên bản đồ Mapbox.

## Cấu trúc file

```
src/features/satellite/
├── api/
│   └── satelliteEndpoints.js       # Endpoint constants
├── services/
│   └── satelliteService.js         # Direct API calls (uses mutater)
├── hooks/
│   └── useSatelliteMutations.js    # React Query mutations (imagery)
├── store/
│   └── useSatelliteStore.js        # Zustand store (state + map sync)
├── utils/
│   ├── satelliteGeometry.util.js   # Geometry helpers + khubaoton.json
│   ├── satelliteMapLayer.util.js   # Mapbox raster layer helpers
│   └── satelliteUtils.js           # Date + formatting utilities
├── constants/
│   └── satelliteConstants.js       # Layer config, collection options, fallback legends
├── schemas/
│   └── satellite.schema.js         # Zod validation schemas
├── components/
│   ├── SatelliteSingleModePanel.jsx
│   ├── SatelliteCompareModePanel.jsx
│   ├── SatelliteLayerManager.jsx
│   ├── SatelliteLayerControl.jsx
│   ├── SatelliteStatsPanel.jsx
│   ├── SatelliteMapOverlayControls.jsx
│   ├── SatelliteEmptyState.jsx
│   ├── SatelliteLoadingState.jsx
│   └── SatelliteErrorState.jsx
├── index.js                        # Public API
└── README.md
```

## API endpoints

| Endpoint                     | Mục đích                             |
| ---------------------------- | ------------------------------------ |
| `POST /satellite/rgb`        | Ảnh màu tổng hợp (True Color)        |
| `POST /satellite/ndvi`       | Chỉ số thực vật NDVI                 |
| `POST /satellite/heat-map`   | Nhiệt độ bề mặt đất (LST)            |
| `POST /satellite/classified` | Phân loại lớp phủ đất (7 lớp)        |
| `POST /satellite/compare`    | So sánh/phát hiện thay đổi giữa 2 kỳ |
| `POST /satellite/change`     | Change detection (endpoint bổ sung)  |

## Default geometry - khubaoton.json

File `src/data/khubaoton.json` là FeatureCollection các khu bảo tồn tỉnh Ninh Bình.
Tất cả API requests đều dùng geometry đầu tiên tìm được trong file này làm mặc định.

```js
import { getDefaultSatelliteGeometry } from '@/features/satellite/utils/satelliteGeometry.util';
const geometry = getDefaultSatelliteGeometry(); // Polygon/MultiPolygon
```

## Thêm raster layer lên bản đồ

```js
import {
  addSatelliteLayerToMap,
  removeSatelliteLayerFromMap,
} from '@/features/satellite/utils/satelliteMapLayer.util';

// Add
addSatelliteLayerToMap(map, { tileUrl, mapId }, 'my-layer-id', 0.85);

// Remove
removeSatelliteLayerFromMap(map, 'my-layer-id', 'satellite-src-...');
```

## Dùng hooks/service

```js
// Direct service call
import { getSatelliteNdvi } from '@/features/satellite';
const result = await getSatelliteNdvi({ geometry, startDate, endDate, collection, cloudCover });

// React Query mutation
import { useSatelliteNdviMutation } from '@/features/satellite';
const { mutate, isPending, data } = useSatelliteNdviMutation();
mutate(payload);
```

## Dùng store

```js
import { useSatelliteStore } from '@/features/satellite';
const { satelliteLayers, searchImages, reset } = useSatelliteStore();
```

## Env/API client

- `VITE_BASE_URL_BE` - backend base URL (qua `src/config/env.js`)
- `VITE_MAPBOX_TOKEN` - Mapbox token
- Dùng axios instance `src/services/apiClient.js`, không tạo mới

## Unresolved

1. `POST /satellite/change` có trong backend nhưng chưa có UI riêng - hiện dùng `POST /satellite/compare` cho change detection.
2. ROI hiện dùng mặc định là khu bảo tồn đầu tiên trong `khubaoton.json` - có thể thêm ROI picker sau.
3. `mapbox-gl-compare` cần package đã cài (`pnpm add mapbox-gl-compare`).
