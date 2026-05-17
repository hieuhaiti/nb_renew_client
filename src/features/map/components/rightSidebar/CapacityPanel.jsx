import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, LocateFixed, RefreshCw, Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetCurrentCapacity,
  useCapacityWebSocket,
} from '@/services/api/capacity/capacityService';
import { useMapStore } from '@/features/map/store/useMapStore';
import { highlightPointOnMap } from '@/features/map/utils/MapHelper';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const STATUS_META = {
  overloaded: {
    badgeClass: 'border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive',
    // red-400 → red-700
    barStyle: { background: 'linear-gradient(90deg, #f87171, #b91c1c)' },
    labelVi: 'Quá tải',
    labelEn: 'Overloaded',
  },
  near_full: {
    badgeClass: 'border-orange-500/30 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-600',
    // tertiary-1 (amber) → quaternary (coral-red)
    barStyle: { background: 'linear-gradient(90deg, var(--tertiary-1), var(--quaternary))' },
    labelVi: 'Gần đầy',
    labelEn: 'Near full',
  },
  busy: {
    badgeClass: 'border-warning/40 bg-warning/10 text-warning hover:bg-warning/20 hover:text-warning',
    // gold → tertiary-2 (warm amber-orange)
    barStyle: { background: 'linear-gradient(90deg, var(--gold), var(--tertiary-2))' },
    labelVi: 'Đông',
    labelEn: 'Busy',
  },
  moderate: {
    badgeClass: 'border-sky-500/30 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 hover:text-sky-600',
    // primary-1 (sky) → primary-2 (deep blue)
    barStyle: { background: 'linear-gradient(90deg, var(--primary-1), var(--primary-2))' },
    labelVi: 'Vừa phải',
    labelEn: 'Moderate',
  },
  normal: {
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-600',
    // secondary-1 (teal) → secondary-2 (forest green)
    barStyle: { background: 'linear-gradient(90deg, var(--secondary-1), var(--secondary-2))' },
    labelVi: 'Bình thường',
    labelEn: 'Normal',
  },
  low: {
    badgeClass: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-500 hover:bg-emerald-400/20 hover:text-emerald-500',
    // lighter teal → secondary-1
    barStyle: { background: 'linear-gradient(90deg, #6ee7b7, var(--secondary-1))' },
    labelVi: 'Thưa thớt',
    labelEn: 'Low',
  },
};

const FALLBACK_META = STATUS_META.normal;

function getStatusMeta(status) {
  return STATUS_META[status] ?? FALLBACK_META;
}

function getStatusLabel(status, isVi) {
  const meta = getStatusMeta(status);
  return isVi ? meta.labelVi : meta.labelEn;
}

function getViewOnMapVariant(status) {
  switch (status) {
    case 'overloaded':
      return 'destructive';
    case 'near_full':
      return 'gold';
    case 'busy':
      return 'tertiary';
    case 'moderate':
      return 'default';
    case 'normal':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
}

function resolveCapacityPct(item) {
  const direct = item.capacity_pct ?? item.occupancy_pct;
  if (direct != null) return Math.min(Math.round(Number(direct)), 100);
  const current = Number(item.visitor_count ?? item.current_visitors ?? 0);
  const max = Number(item.max_capacity ?? item.capacity ?? 0);
  if (max <= 0) return 0;
  return Math.min(Math.round((current / max) * 100), 100);
}

function resolveStatus(item, pct) {
  const raw = String(item.status ?? item.capacity_status ?? '').trim();
  if (STATUS_META[raw]) return raw;
  if (pct >= 100) return 'overloaded';
  if (pct >= 85) return 'near_full';
  if (pct >= 70) return 'busy';
  if (pct >= 40) return 'moderate';
  if (pct > 0) return 'normal';
  return 'low';
}

function normalizeItem(raw, defaultName) {
  const pct = resolveCapacityPct(raw);
  const status = resolveStatus(raw, pct);
  const coords = raw.geojson?.coordinates;
  return {
    id: raw.spot_id ?? raw.id,
    name: raw.name_vi ?? raw.name_en ?? raw.name ?? raw.spot_name ?? defaultName,
    current: Number(raw.visitor_count ?? raw.current_visitors ?? 0),
    max: raw.max_capacity != null ? Number(raw.max_capacity) : 0,
    pct,
    status,
    lng: coords ? coords[0] : (raw.lng ?? raw.longitude ?? null),
    lat: coords ? coords[1] : (raw.lat ?? raw.latitude ?? null),
    recordedAt: raw.recorded_at ?? raw.last_updated ?? raw.updated_at ?? null,
  };
}

function formatRelativeTime(isoStr) {
  if (!isoStr) return null;
  try {
    const diffMs = Date.now() - new Date(isoStr).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return 'Vừa cập nhật';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return new Date(isoStr).toLocaleDateString('vi-VN');
  } catch {
    return null;
  }
}

function CapacityRowSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export default function CapacityPanel() {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language?.startsWith('vi');
  const mapRef = useMapStore((state) => state.mapRef);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [capacityOverrides, setCapacityOverrides] = useState(() => new Map());

  const numberFormatter = useMemo(() => new Intl.NumberFormat(isVi ? 'vi-VN' : 'en-US'), [isVi]);

  const { data, isLoading, isError, isFetching, refetch } = useGetCurrentCapacity();
  const { data: wsData, status: wsStatus } = useCapacityWebSocket();

  useEffect(() => {
    if (!wsData?.spot_id) return;
    setCapacityOverrides((prev) => {
      const next = new Map(prev);
      next.set(String(wsData.spot_id), {
        visitor_count: wsData.visitor_count,
        capacity_pct: wsData.capacity_pct,
        status: wsData.status,
        recorded_at: wsData.recorded_at,
      });
      return next;
    });
  }, [wsData]);

  const items = useMemo(() => {
    const raw = data?.data?.capacity ?? data?.data?.spots ?? data?.data?.items ?? data?.data ?? [];
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => {
      const id = String(item.spot_id ?? item.id ?? '');
      const override = id ? capacityOverrides.get(id) : undefined;
      const merged = override ? { ...item, ...override } : item;
      return normalizeItem(
        merged,
        t('mapPage.capacityPanel.defaultName', { defaultValue: 'Địa điểm' })
      );
    });
  }, [data, capacityOverrides, t]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchSearch = !keyword || item.name.toLowerCase().includes(keyword);
      return matchStatus && matchSearch;
    });
  }, [items, statusFilter, search]);

  const statusCounts = useMemo(() => {
    const counts = {};
    items.forEach((item) => {
      counts[item.status] = (counts[item.status] ?? 0) + 1;
    });
    return counts;
  }, [items]);

  const presentStatuses = useMemo(
    () => Object.keys(statusCounts).filter((s) => statusCounts[s] > 0),
    [statusCounts]
  );

  const handleFlyTo = (item) => {
    if (!mapRef || typeof item.lat !== 'number' || typeof item.lng !== 'number') return;
    highlightPointOnMap(mapRef, {
      id: item.id ?? item.spot_id,
      coordinates: [item.lng, item.lat],
      properties: item,
    });
  };

  const latestRecordedAt = useMemo(() => {
    if (!items.length) return null;
    const times = items.map((i) => i.recordedAt).filter(Boolean);
    if (!times.length) return null;
    return times.reduce((a, b) => (a > b ? a : b));
  }, [items]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3">
      {/* Header */}
      <div className="shrink-0 flex items-start justify-between gap-2 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
        <div className="min-w-0">
          <p className="typo-section-title text-foreground">
            {t('mapPage.capacityPanel.title', { defaultValue: 'Sức chứa điểm đến' })}
          </p>
          <p className="typo-meta text-muted-foreground truncate">
            {wsStatus === 'open' ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
                {t('mapPage.capacityPanel.live', { defaultValue: 'Trực tiếp' })}
              </span>
            ) : wsStatus === 'connecting' ? (
              t('mapPage.capacityPanel.connecting', { defaultValue: 'Đang kết nối...' })
            ) : isFetching ? (
              t('mapPage.capacityPanel.syncing', { defaultValue: 'Đang cập nhật...' })
            ) : latestRecordedAt ? (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                {formatRelativeTime(latestRecordedAt)}
              </span>
            ) : (
              t('mapPage.capacityPanel.count', {
                defaultValue: '{{count}} điểm',
                count: items.length,
              })
            )}
          </p>
        </div>
        {wsStatus !== 'open' && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="typo-meta h-7 shrink-0"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            {t('mapPage.capacityPanel.refresh', { defaultValue: 'Làm mới' })}
          </Button>
        )}
      </div>

      {/* Search */}
      {!isLoading && items.length > 0 && (
        <div className="shrink-0 relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('mapPage.capacityPanel.searchPlaceholder', {
              defaultValue: 'Tìm điểm đến...',
            })}
            className="typo-search h-9 pl-8"
          />
        </div>
      )}

      {/* Status filter chips */}
      {!isLoading && items.length > 0 && (
        <div className="shrink-0 flex flex-wrap gap-1.5">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setStatusFilter('all')}
            className={cn(
              'typo-badge h-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 transition-colors',
              statusFilter === 'all'
                ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                : 'border-border text-muted-foreground hover:bg-muted/50'
            )}
          >
            {t('mapPage.capacityPanel.all', { defaultValue: 'Tất cả' })}
            <span className="opacity-70">{items.length}</span>
          </Button>

          {presentStatuses.map((status) => {
            const meta = getStatusMeta(status);
            const isActive = statusFilter === status;
            return (
              <Button
                variant="ghost"
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'typo-badge h-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 transition-colors',
                  isActive
                    ? meta.badgeClass
                    : 'border-border text-muted-foreground hover:bg-muted/50'
                )}
              >
                {getStatusLabel(status, isVi)}
                <span className="opacity-70">{statusCounts[status]}</span>
              </Button>
            );
          })}
        </div>
      )}

      <ScrollArea className="flex-1 min-h-0">
      {/* Content */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CapacityRowSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="typo-meta text-muted-foreground rounded-lg border border-dashed p-4 text-center">
          {t('mapPage.capacityPanel.error', { defaultValue: 'Không thể tải dữ liệu sức chứa.' })}
        </div>
      ) : filtered.length === 0 ? (
        <div className="typo-meta text-muted-foreground rounded-lg border border-dashed p-4 text-center">
          {t('mapPage.capacityPanel.empty', { defaultValue: 'Không có điểm phù hợp.' })}
        </div>
      ) : (
        <div className="space-y-2 pr-0.5">
          {/* Result count */}
          <p className="typo-meta text-muted-foreground px-0.5">
            {filtered.length !== items.length
              ? `${filtered.length} / ${items.length} điểm`
              : `${items.length} điểm đang theo dõi`}
          </p>

          {filtered.map((item) => {
            const meta = getStatusMeta(item.status);
            const hasCoords = typeof item.lat === 'number' && typeof item.lng === 'number';
            const capacityText =
              item.max > 0
                ? `${numberFormatter.format(item.current)} / ${numberFormatter.format(item.max)} người`
                : `${numberFormatter.format(item.current)} người`;

            return (
              <article
                key={item.id}
                className="hover:bg-muted/40 space-y-2 rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className="typo-body text-foreground line-clamp-2 font-semibold"
                    title={item.name}
                  >
                    {item.name}
                  </h4>
                  <Badge variant="outline" className={cn('typo-badge shrink-0', meta.badgeClass)}>
                    {getStatusLabel(item.status, isVi)}
                  </Badge>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-1">
                    <span className="typo-meta text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3 shrink-0" />
                      {capacityText}
                    </span>
                    <span
                      className={cn(
                        'typo-meta font-semibold tabular-nums',
                        meta.badgeClass.split(' ').find((c) => c.startsWith('text-'))
                      )}
                    >
                      {item.pct}%
                    </span>
                  </div>
                  <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, ...meta.barStyle }}
                    />
                  </div>
                </div>

                {hasCoords && (
                  <Button
                    type="button"
                    size="sm"
                    variant={getViewOnMapVariant(item.status)}
                    className="typo-meta h-7 w-full"
                    onClick={() => handleFlyTo(item)}
                  >
                    <LocateFixed className="h-3 w-3" />
                    {t('mapPage.capacityPanel.viewOnMap', { defaultValue: 'Xem trên bản đồ' })}
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      )}
      </ScrollArea>
    </div>
  );
}

