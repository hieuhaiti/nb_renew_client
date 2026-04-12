# 🗺️ README — Client

> **Project:** Nền tảng Du lịch số thông minh
> **Surface:** Client Web
> **Package manager:** `pnpm`
> **Core direction:** WebGIS-first, multilingual-first, theme-first

## 1. Tổng quan

Client là bề mặt người dùng chính của hệ thống du lịch số, phục vụ chủ yếu cho **khách du lịch**, đồng thời mở rộng cho trải nghiệm công khai của doanh nghiệp và người dùng phổ thông.

Trọng tâm của client là:

- **WebGIS** làm hạt nhân tương tác.
- Kết nối **điểm đến**, **dịch vụ**, **nội dung số**, **VR/360**, **cảnh báo thông minh**, **AI Chatbot** và **lịch trình cá nhân**.
- Tối ưu trải nghiệm khám phá, tra cứu, xem bản đồ, xem chi tiết và điều hướng.

## 2. Mục tiêu sản phẩm

Client phải hỗ trợ tốt các nhóm nhu cầu sau:

- Tra cứu điểm du lịch, dịch vụ, tour, ẩm thực, lễ hội, OCOP.
- Hiển thị bản đồ tương tác, lớp dữ liệu, popup chi tiết, tìm kiếm theo bán kính.
- Theo dõi thời tiết, AQI, cảnh báo quá tải, gợi ý điểm thay thế.
- Xem ảnh/video 360°, hotspot và trải nghiệm tham quan ảo.
- Tạo, lưu, chia sẻ lịch trình.
- Tương tác với AI Chatbot bằng ngôn ngữ tự nhiên.
- Viết đánh giá, phản hồi, nội dung cộng đồng khi có module tương ứng.

## 3. Nhóm tính năng chính

### 3.1. Cổng thông tin

- Tin tức du lịch
- Tour nổi bật
- Ẩm thực, lễ hội
- OCOP
- Banner / nội dung truyền thông

### 3.2. WebGIS du lịch

- Bản đồ tương tác
- Bật/tắt lớp dữ liệu
- Popup chi tiết điểm đến
- Tìm kiếm theo tên / danh mục / bán kính
- Chỉ đường và điều hướng hỗ trợ bản đồ
- So sánh, xuất bản đồ khi cần

### 3.3. Điểm đến & dịch vụ

- Trang chi tiết điểm du lịch
- Thông tin giờ mở cửa, giá, mô tả, media
- Đánh giá, phản hồi
- So sánh địa điểm
- Trạng thái tải trọng theo thời gian thực hoặc gần thời gian thực

### 3.4. Cảnh báo thông minh

- Thời tiết
- AQI / UV
- Cảnh báo thời tiết cực đoan
- Cảnh báo quá tải điểm đến
- Điều hướng gợi ý sang điểm thay thế

### 3.5. VR/AR & 360

- Ảnh 360
- Video 360
- Hotspot tương tác
- Thuyết minh tự động

### 3.6. Lịch trình cá nhân

- Tạo lịch trình
- Thêm điểm đến từ bản đồ / trang chi tiết
- Sắp xếp hành trình
- Chia sẻ qua link / QR / PDF

### 3.7. AI Chatbot

- Hỏi đáp điểm đến, dịch vụ, tour, thời tiết
- Gợi ý lịch trình
- Điều khiển hành vi bản đồ ở mức UI/service được hỗ trợ
- Render câu trả lời qua Markdown an toàn

## 4. Tech stack chuẩn

## Core

- React 19.2
- Vite 6+
- React Router
- JavaScript (ESNext)
- JSX
- JSDoc

## State & data

- Zustand
- TanStack React Query
- Axios
- Axios interceptors
- js-cookie

## UI / Design system

- Tailwind CSS 4.1
- `@tailwindcss/vite`
- shadcn/ui
- Radix UI
- Lucide React
- semantic theme tokens
- dark mode strategy

## Map / GIS

- Mapbox GL JS
- `@mapbox/mapbox-gl-draw`
- `mapbox-gl-compare`
- `@watergis/mapbox-gl-export`
- Turf.js
- Google Earth Engine API
- OpenWeatherMap

## Forms / validation

- React Hook Form
- `@hookform/resolvers`
- Zod
- PropTypes

## Content / rich text

- React-Quill
- react-markdown
- DOMPurify

## Reports / data table

- TanStack Table
- Recharts
- `xlsx`
- `jsPDF`
- `jspdf-autotable`

## Upload / feedback / helpers

- react-dropzone
- `@diceui/file-upload`
- react-toastify
- react-error-boundary
- fuse.js
- date-fns
- date-fns-tz

## i18n

- i18next
- react-i18next
- i18next-browser-languagedetector

## 5. Nguyên tắc kỹ thuật bắt buộc

### 5.1. Package manager

Toàn bộ client dùng **`pnpm`**. Không trộn `npm` hoặc `yarn` trong workflow chính.

### 5.2. Multilingual-first

Client là bề mặt **đa ngôn ngữ mặc định**.

Quy tắc:

- Tính năng mới phải hỗ trợ i18n ngay từ đầu.
- Không hardcode user-facing text trong JSX.
- Chuỗi hiển thị phải đi qua translation keys.
- Locale phải ảnh hưởng tới **ngôn ngữ**, **định dạng tiền tệ**, **định dạng số**, **đơn vị**, **ngày giờ**.

### 5.3. Theme-first styling

Ưu tiên semantic tokens và class của hệ thống trước raw Tailwind màu:

- dùng `text-success` thay vì `text-green-500`
- dùng `text-destructive` thay vì `text-red-500`
- dùng `bg-surface` thay vì `bg-white`
- dùng `border-border` thay vì `border-gray-200`

Không thêm màu ad hoc nếu hệ thống đã có token tương đương.

### 5.4. shadcn-first UI integrity

Nếu shadcn/ui đã có component phù hợp thì **phải ưu tiên dùng trước**.

Ví dụ:

- `Button` thay vì raw `<button>`
- `Input` thay vì raw `<input>`
- `Dialog` thay vì tự dựng modal thủ công
- `Textarea` cho plain multiline

Chỉ fallback về HTML thuần khi:

- shadcn/ui không có component tương ứng, hoặc
- có lý do kỹ thuật rõ ràng.

### 5.5. Shared wrappers bắt buộc

- Rich text phải đi qua shared wrapper như `RichTextEditor`.
- Rich content render qua component an toàn như `RichTextContent` hoặc Markdown viewer chuyên dụng.
- Upload UI phải chuẩn hóa qua shared upload component.

## 6. Cấu trúc thư mục đề xuất

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── ui/
│   └── layout/
├── config/
├── constants/
├── hooks/
├── lib/
├── locales/
│   ├── en/
│   └── vi/
├── schemas/
├── services/
├── store/
├── styles/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── map/
│   ├── destinations/
│   ├── itinerary/
│   ├── vr-ar/
│   ├── alerts/
│   ├── chatbot/
│   ├── business/
│   ├── conservation/
│   ├── cms/
│   ├── reports/
│   └── search/
├── pages/
├── providers/
├── App.jsx
├── i18n.js
└── main.jsx
```

Quy tắc tổ chức:

- `pages/` chỉ import từ **public API** của feature.
- Mỗi feature có `index.js` để export bề mặt dùng ra ngoài.
- Shared code không import sâu vào internals của feature khác.
- Dùng alias `@/` thay vì relative import dài.

## 7. Quy ước code

- `.js` cho file không render JSX
- `.jsx` cho file render JSX
- JSDoc cho exported function/component quan trọng
- Zod cho runtime validation
- PropTypes cho shared component quan trọng
- TanStack React Query cho server state
- Zustand cho global UI/app state
- Services dùng chung đặt trong `src/services`
- Logic đặc thù feature đặt trong thư mục feature tương ứng
- Không hardcode routes / query keys / storage keys
- Env chỉ được đọc qua `config/env.js`

## 8. i18n, locale và date/time

### i18n

Client dùng `i18next-browser-languagedetector` để detect và persist locale.

### Formatting

Không format thủ công trong JSX.

Phải dùng shared helpers cho:

- `formatCurrency`
- `formatNumber`
- `formatDistance`
- `formatDateTime`

### Timezone

Mọi timestamp liên quan upload, audit, lịch trình, hiệu lực voucher... phải đi qua helper xây trên:

- `date-fns`
- `date-fns-tz`

Không dựa ngầm vào timezone máy client.

## 9. Bảo mật client

Các nguyên tắc tối thiểu:

- Không tin client-side storage là secure source of truth.
- Không lưu long-lived sensitive token trong `localStorage` nếu không có phê duyệt rõ ràng.
- Ưu tiên backend-managed `httpOnly` refresh-cookie flow.
- Không expose secret hoặc signing logic trong bundle client.
- Tất cả auth/upload/privileged mutations phải đi qua service/interceptor tập trung.
- File upload phải validate type, extension, size phía client cho UX, nhưng server vẫn là nơi quyết định cuối.
- Không trust MIME hoặc `accept` đơn lẻ.
- Phải sanitize rich text trước khi render.
- Không dùng `dangerouslySetInnerHTML` trực tiếp trong feature pages.
- Markdown chatbot phải render bằng `react-markdown`, không render HTML thô.

## 10. Quy định upload và rich text

### Upload

Chuẩn UI:

- `@diceui/file-upload` cho UI nhất quán
- `react-dropzone` cho drag-and-drop behavior

### Textarea vs rich text

- Plain multiline text: dùng `Textarea`
- Rich content: dùng `React-Quill` qua wrapper
- Markdown/API content: dùng `react-markdown`

## 11. Component baseline

### Client common components

- badge
- button
- card
- carousel
- checkbox
- dialog
- dropdown-menu
- input
- label
- pagination
- scroll-area
- select
- skeleton
- slider
- textarea
- tooltip
- file-upload

### Cài nhanh shadcn

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add badge button card carousel checkbox dialog dropdown-menu input label pagination scroll-area select skeleton slider textarea tooltip
pnpm dlx shadcn@latest add https://diceui.com/r/file-upload
```

## 12. Khởi động dự án

```bash
pnpm install
cp .env.example .env
pnpm dev
```

### Yêu cầu môi trường

- Node.js >= 20
- pnpm >= 9

## 13. Biến môi trường thường dùng

```env
VITE_API_BASE_URL=
VITE_MAPBOX_TOKEN=
VITE_OPENWEATHER_API_KEY=
VITE_GOOGLE_CLIENT_ID=
VITE_AI_API_BASE_URL=
```

Lưu ý:

- Không đọc env trực tiếp trong component.
- Chỉ đọc qua `src/config/env.js`.

## 14. README này dùng để làm gì

README này là chuẩn định hướng cho toàn bộ **client surface** của dự án.

Khi thêm feature mới, hãy tự kiểm tra:

- Có đúng multilingual-first chưa?
- Có dùng semantic theme token chưa?
- Có ưu tiên shadcn/ui chưa?
- Có đi qua shared service/helper/wrapper chưa?
- Có phá vỡ feature boundary không?
- Có render nội dung động theo cách an toàn không?
