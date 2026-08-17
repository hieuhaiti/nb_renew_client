# Hướng dẫn tái tạo UI: Phản ánh người dân

> Tài liệu này tổng hợp toàn bộ key cần thiết để xây dựng module **Phản ánh người dân** tương tự dự án gốc (`@nb_renew_web_du_lich`).

---

## 1. Types & Enums

```ts
// types/api/citizenFeedback.ts

export type FeedbackStatus    = 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected'
export type FeedbackPriority  = 'low' | 'normal' | 'high' | 'critical'
export type ModerationStatus  = 'pending' | 'approved' | 'rejected'

export interface CitizenFeedback {
  id: string
  user_id?: string | null
  title: string
  content: string
  latitude?: number | null
  longitude?: number | null
  location_text?: string | null
  location_coordinates?: string | null
  priority: FeedbackPriority
  status: FeedbackStatus
  moderation_status: ModerationStatus
  is_location_verified: boolean
  location_verified_at?: string | null
  admin_response?: string | null
  resolution_note?: string | null
  forest_loss_area_estimate_m2?: number | null
  images?: string[]
  user_name?: string | null
  user_avatar?: string | null
  created_at: string
  updated_at: string
  responded_at?: string | null
  responder?: {
    id: string
    full_name?: string | null
    username?: string | null
    email?: string | null
  } | null
  user?: {
    id: string
    full_name: string | null
    username?: string | null
    email?: string | null
    avatar_url?: string | null
  } | null
  attachments?: FeedbackAttachment[]
}

export interface FeedbackAttachment {
  id: number
  file_name: string
  file_path: string
  file_url: string
  mime_type: string
  file_size: number | null
  uploaded_at: string
}

export interface CitizenFeedbackListData {
  items: CitizenFeedback[]
  pagination: Pagination
}

export interface UpdateFeedbackStatusBody {
  status: FeedbackStatus
  is_location_verified?: boolean
  admin_response?: string          // min 10, max 2000 ký tự
  resolution_note?: string         // min 10, max 2000 ký tự
}

export interface UpdateModerationBody {
  moderation_status: ModerationStatus
  admin_response?: string          // min 10, max 2000 ký tự
}

export interface FeedbackListParams {
  page?: number
  limit?: number
  search?: string
  status?: FeedbackStatus
  moderation_status?: ModerationStatus
  priority?: FeedbackPriority
  user_id?: string
  start_date?: string
  end_date?: string
  sortBy?: string                  // 'created_at' | 'updated_at' | 'priority' | 'status'
  sortOrder?: 'ASC' | 'DESC'
}
```

---

## 2. Constants — Label, Badge Class, Dot Class

```ts
// constant/feedbackConstant.ts

// ── Priority ─────────────────────────────────────────────────────
export const PRIORITY_LABEL: Record<string, string> = {
  low:      'Thấp',
  normal:   'Bình thường',
  high:     'Cao',
  critical: 'Khẩn cấp',
}
export const PRIORITY_CLASS: Record<string, string> = {
  low:      'bg-muted text-muted-foreground border-border',
  normal:   'bg-primary/10 text-primary border-primary/20',
  high:     'bg-warning/10 text-warning border-warning/20',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
}
export const PRIORITY_DOT: Record<string, string> = {
  low:      'bg-muted-foreground',
  normal:   'bg-primary',
  high:     'bg-warning',
  critical: 'bg-destructive',
}

// ── Processing Status ─────────────────────────────────────────────
export const STATUS_LABEL: Record<string, string> = {
  pending:     'Chờ xử lý',
  in_progress: 'Đang xử lý',
  resolved:    'Đã xử lý',
  rejected:    'Từ chối',
  closed:      'Đóng',
}
export const STATUS_CLASS: Record<string, string> = {
  pending:     'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  resolved:    'bg-success/10 text-success border-success/20',
  rejected:    'bg-destructive/10 text-destructive border-destructive/20',
  closed:      'bg-muted text-muted-foreground border-border',
}
export const STATUS_DOT: Record<string, string> = {
  pending:     'bg-warning',
  in_progress: 'bg-primary',
  resolved:    'bg-success',
  rejected:    'bg-destructive',
  closed:      'bg-muted-foreground',
}

// ── Moderation Status ─────────────────────────────────────────────
export const MOD_LABEL: Record<string, string> = {
  pending:  'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}
export const MOD_CLASS: Record<string, string> = {
  pending:  'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
}
export const MOD_DOT: Record<string, string> = {
  pending:  'bg-warning',
  approved: 'bg-success',
  rejected: 'bg-destructive',
}
```

---

## 3. API Service

```ts
// service/citizenFeedbackService.ts

const BASE = '/feedbacks'

export default {
  getPublic:        (params?: FeedbackListParams) => apiClient.get(BASE, params),
  create:           (data: Partial<CitizenFeedback>) => apiClient.post(BASE, data),
  getAll:           (params?: FeedbackListParams) => apiClient.get(`${BASE}/admin/all`, params),
  getById:          (id: string) => apiClient.get(`${BASE}/${id}`),
  update:           (id: string, data: Partial<CitizenFeedback>) => apiClient.put(`${BASE}/${id}`, data),
  updateStatus:     (id: string, data: UpdateFeedbackStatusBody) => apiClient.patch(`${BASE}/${id}/status`, data),
  updateModeration: (id: string, data: UpdateModerationBody) => apiClient.patch(`${BASE}/${id}/moderation`, data),
  delete:           (id: string) => apiClient.del(`${BASE}/${id}`),
}
```

---

## 4. Page chính — FeedbackPage

### 4.1 State cần thiết

```ts
const [currentPage, setCurrentPage]           = useState(1)
const [limit, setLimit]                       = useState(10)       // 10 | 20 | 50
const [searchValue, setSearchValue]           = useState('')
const [filterStatus, setFilterStatus]         = useState<FeedbackStatus | 'all'>('all')
const [filterPriority, setFilterPriority]     = useState<FeedbackPriority | 'all'>('all')
const [filterModeration, setFilterModeration] = useState<ModerationStatus | 'all'>('all')

// Dialog states
const [selectedFeedback, setSelectedFeedback] = useState<CitizenFeedback | null>(null)
const [detailDialogOpen, setDetailDialogOpen] = useState(false)
const [formDialogOpen, setFormDialogOpen]     = useState(false)
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
const [itemToDelete, setItemToDelete]         = useState<CitizenFeedback | null>(null)
```

### 4.2 Query params gửi lên API

```ts
const queryParams = {
  page: currentPage,
  limit,
  sortBy: 'created_at',
  sortOrder: 'DESC',
  ...(searchValue              && { search: searchValue }),
  ...(filterStatus !== 'all'   && { status: filterStatus }),
  ...(filterPriority !== 'all' && { priority: filterPriority }),
  ...(filterModeration !== 'all' && { moderation_status: filterModeration }),
}
```

### 4.3 Mutations

```ts
// Cập nhật trạng thái xử lý
statusMutation = (args: { id: string; data: UpdateFeedbackStatusBody }) =>
  citizenFeedbackService.updateStatus(args.id, args.data)

// Cập nhật kiểm duyệt
moderationMutation = (args: { id: string; data: UpdateModerationBody }) =>
  citizenFeedbackService.updateModeration(args.id, args.data)

// Xóa
deleteMutation = (id: string) => citizenFeedbackService.delete(id)
```

### 4.4 Logic đặc biệt — auto-approve khi cập nhật status

```ts
// Khi admin cập nhật trạng thái xử lý VÀ moderation hiện tại là 'pending'
// → tự động approve luôn moderation
onUpdateStatus: (data) => {
  const { moderation_status, ...statusData } = data
  statusMutation.mutate({ id: selectedFeedback.id, data: statusData })

  if (selectedFeedback.moderation_status === 'pending') {
    moderationMutation.mutate({
      id: selectedFeedback.id,
      data: { moderation_status, admin_response: data.admin_response },
    })
  }
}

// Tab Moderation chỉ hiện khi feedback.moderation_status === 'pending'
const canUpdateModeration = feedback?.moderation_status === 'pending'
```

### 4.5 Cột bảng (Table columns)

| Column | Field | Mô tả |
|--------|-------|-------|
| ID | `item.id` | UUID |
| Tiêu đề | `item.title` + `item.location_text` | line-clamp-2, kèm MapPin icon |
| Ưu tiên | `item.priority` | `StatusDotBadge` với PRIORITY_* |
| Trạng thái | `item.status` | `StatusDotBadge` với STATUS_* |
| Kiểm duyệt | `item.moderation_status` | `StatusDotBadge` với MOD_* |
| Người gửi | `item.user_avatar` + `item.user_name` | Avatar tròn + tên, fallback "Ẩn danh" |
| Ngày tạo | `item.created_at` | `formatDate()` |
| Hành động | — | `ClipboardEdit` (cập nhật) + `Trash2` (xóa) |

---

## 5. Dialog xem chi tiết — FeedbackDetailDialog

### Props
```ts
interface FeedbackDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedbackId: string | null        // fetch by ID khi mở
}
```

### Các trường hiển thị (dạng grid 3 cột: label | value)

| Label | Field | Ghi chú |
|-------|-------|---------|
| ID | `feedback.id` | — |
| Tiêu đề | `feedback.title` | font-medium |
| Nội dung | `feedback.content` | whitespace-pre-wrap |
| Mức độ ưu tiên | `feedback.priority` | Badge + PRIORITY_CLASS |
| Trạng thái xử lý | `feedback.status` | Badge + STATUS_CLASS |
| Kiểm duyệt | `feedback.moderation_status` | Badge + MOD_CLASS |
| Xác minh vị trí | `feedback.is_location_verified` | "Đã xác minh thực địa" / "Chưa xác minh" |
| Người gửi | `feedback.user_avatar` + `feedback.user_name` | Avatar + tên |
| Vị trí | `feedback.location_text` + lat/lng | MapPin icon |
| Diện tích mất rừng | `feedback.forest_loss_area_estimate_m2` | Chỉ hiện khi có giá trị |
| Phản hồi admin | `feedback.admin_response` | bg-muted rounded |
| Ghi chú xử lý | `feedback.resolution_note` | bg-muted rounded |
| Phản hồi lúc | `feedback.responded_at` | formatDateTime |
| Ảnh đính kèm | `feedback.images[]` | grid-cols-3, click mở lightbox |
| Ngày tạo | `feedback.created_at` | formatDateTime |
| Cập nhật lúc | `feedback.updated_at` | formatDateTime |

---

## 6. Dialog cập nhật — FeedbackFormDialog

### Props
```ts
interface FeedbackFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedback: CitizenFeedback | null
  onUpdateStatus: (data: StatusFormValues) => void
  onUpdateModeration: (data: ModerationFormValues) => void
  isLoading?: boolean
}
```

### Zod schemas

```ts
// Tab Status
const statusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'rejected', 'closed']),
  admin_response: z.string().min(10).max(2000).optional().or(z.literal('')),
  resolution_note: z.string().min(10).max(2000).optional().or(z.literal('')),
  is_location_verified: z.boolean().optional(),
  moderation_status: z.literal('approved'),  // luôn approve khi submit tab này
})

// Tab Moderation
const moderationSchema = z.object({
  moderation_status: z.enum(['pending', 'approved', 'rejected']),
  admin_response: z.string().min(10).max(2000).optional().or(z.literal('')),
})
```

### Cấu trúc form (2 tabs)

**Tab "Trạng thái xử lý":**
1. `Select` — Trạng thái xử lý (STATUS_LABELS)
2. `Checkbox` — "Đã xác minh vị trí phản ánh tại hiện trường"
3. `Textarea` — Phản hồi cho người dân (`admin_response`, rows=3)
4. `Textarea` — Ghi chú xử lý nội bộ (`resolution_note`, rows=3)
5. Thông báo info nếu `canUpdateModeration`: "Cập nhật trạng thái sẽ tự động thông qua kiểm duyệt"

**Tab "Kiểm duyệt"** (chỉ hiện khi `moderation_status === 'pending'`):
1. `Select` — Trạng thái kiểm duyệt (MOD_LABELS)
2. `Textarea` — Phản hồi (`admin_response`, rows=3)

### defaultValues khi reset form

```ts
statusForm.reset({
  status: feedback.status,
  admin_response: feedback.admin_response || '',
  resolution_note: feedback.resolution_note || '',
  is_location_verified: feedback.is_location_verified || false,
  moderation_status: 'approved',
})
modForm.reset({
  moderation_status: feedback.moderation_status,
  admin_response: feedback.admin_response || '',
})
```

---

## 7. Database Schema

```sql
CREATE TABLE citizen_feedbacks (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                      UUID REFERENCES users(id),
  title                        VARCHAR(255) NOT NULL,
  content                      TEXT NOT NULL,
  latitude                     NUMERIC,
  longitude                    NUMERIC,
  location_text                TEXT,
  geom                         GEOMETRY(POINT, 4326),    -- PostGIS
  priority                     VARCHAR(20) DEFAULT 'normal'
                                 CHECK (priority IN ('low','normal','high','urgent')),
  status                       VARCHAR(20) DEFAULT 'pending'
                                 CHECK (status IN ('pending','in_progress','resolved','closed','rejected')),
  moderation_status            VARCHAR(20) DEFAULT 'pending'
                                 CHECK (moderation_status IN ('pending','approved','rejected')),
  images                       JSONB DEFAULT '[]',
  admin_response               TEXT,
  resolution_note              TEXT,
  responded_at                 TIMESTAMP,
  is_location_verified         BOOLEAN DEFAULT false,
  forest_loss_area_estimate_m2 NUMERIC,
  created_at                   TIMESTAMP DEFAULT NOW(),
  updated_at                   TIMESTAMP DEFAULT NOW()
);
```

**Lưu ý PostGIS:** khi INSERT có tọa độ:
```sql
ST_SetSRID(ST_MakePoint($longitude, $latitude), 4326)
```

---

## 8. Backend — API Endpoints

| Method | Path | Auth | Permission | Mô tả |
|--------|------|------|------------|-------|
| GET | `/feedbacks` | Không | — | Public list (chỉ `moderation_status='approved'`) |
| GET | `/feedbacks/me` | Có | — | Feedbacks của user hiện tại |
| GET | `/feedbacks/admin/all` | Có | `feedbacks:read` | Admin xem tất cả |
| GET | `/feedbacks/:id` | Optional | — | Chi tiết (RBAC theo role) |
| POST | `/feedbacks` | Có | — | Tạo mới |
| PUT | `/feedbacks/:id` | Có | — | Cập nhật (chỉ owner, còn `pending`) |
| PATCH | `/feedbacks/:id/status` | Có | `feedbacks:update` | Admin cập nhật trạng thái |
| PATCH | `/feedbacks/:id/moderation` | Có | `feedbacks:update` | Admin kiểm duyệt |
| DELETE | `/feedbacks/:id` | Có | `feedbacks:delete` | Xóa |

---

## 9. Backend — Validation Rules

### createFeedbackSchema
| Field | Rule |
|-------|------|
| `title` | string, 10–500 ký tự, required |
| `content` | string, min 20 ký tự, required |
| `latitude` | number, optional |
| `longitude` | number, optional |
| `location_text` | string, optional |
| `priority` | enum: low/normal/high/urgent, default 'normal' |
| `images` | array of strings (URL), optional |
| `forest_loss_area_estimate_m2` | number, optional |

### updateStatusSchema
| Field | Rule |
|-------|------|
| `status` | enum: pending/in_progress/resolved/closed/rejected, required |
| `admin_response` | string, 10–2000 ký tự, optional |
| `resolution_note` | string, 10–2000 ký tự, optional |
| `is_location_verified` | boolean, optional |

### updateModerationStatusSchema
| Field | Rule |
|-------|------|
| `moderation_status` | enum: pending/approved/rejected, required |
| `admin_response` | string, 10–2000 ký tự, optional |

---

## 10. Backend — Business Logic (Service layer)

```
create():
  1. INSERT với status='pending', moderation_status='pending'
  2. _notifyAdminRoles() → notify tất cả user có permission 'feedbacks:read'

update():
  Chỉ cho phép nếu status === 'pending', chỉ owner mới được sửa

updateStatus():
  1. UPDATE status + admin_response + resolution_note + is_location_verified
  2. Nếu status = 'resolved' | 'closed' → set responded_at = NOW()
  3. _notifySubmitter() → notify người gửi

updateModerationStatus():
  UPDATE moderation_status + admin_response

Geospatial (Governance):
  Query feedbacks trong bán kính X mét từ 1 điểm:
  ST_DWithin(geom, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radiusMeters)
  Chỉ lấy moderation_status='approved'
```

---

## 11. Component phụ

### StatusDotBadge
```tsx
// Dùng để render badge màu + chấm tròn
<StatusDotBadge
  label={PRIORITY_LABEL[item.priority]}
  badgeClass={PRIORITY_CLASS[item.priority]}
  dotClass={PRIORITY_DOT[item.priority]}
/>
```

### Filter dropdowns (Select)

```tsx
// Các option cố định cho từng filter
const STATUS_OPTIONS   = ['all','pending','in_progress','resolved','rejected','closed']
const PRIORITY_OPTIONS = ['all','low','normal','high','critical']
const MOD_OPTIONS      = ['all','pending','approved','rejected']
const LIMIT_OPTIONS    = [10, 20, 50]
```

---

## 12. Checklist tái tạo

- [ ] Tạo types `CitizenFeedback`, `FeedbackStatus`, `FeedbackPriority`, `ModerationStatus`
- [ ] Tạo constants PRIORITY/STATUS/MOD (LABEL, CLASS, DOT)
- [ ] Tạo service `citizenFeedbackService` với 8 methods
- [ ] Tạo `FeedbackPage` với filter + bảng + pagination
- [ ] Tạo `FeedbackDetailDialog` (fetch by ID, hiển thị 14 trường)
- [ ] Tạo `FeedbackFormDialog` (2 tab: status + moderation, Zod validation)
- [ ] Xử lý logic auto-approve moderation khi cập nhật status
- [ ] Tab Moderation chỉ hiện khi `moderation_status === 'pending'`
- [ ] Backend: migration bảng `citizen_feedbacks` (có PostGIS)
- [ ] Backend: 8 endpoints với validation & permission guards
- [ ] Backend: notify admin khi tạo mới, notify user khi đổi status
