import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Clock, LocateFixed, RefreshCw, Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCurrentCapacity, useCapacityStream } from '@/services/api/capacity/capacityService';
import { withLanguageQueryKey } from '@/services/useApi';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { highlightPointOnMap } from '@/features/map/utils/MapHelper';
import { resolveCapacityPct, resolveCapacityStatus } from '@/features/map/utils/capacityUtils';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CAPACITY_STATUS_META,
  getCapacityStatusLabel,
  getCapacityStatusMeta,
} from '@/features/map/utils/capacityStatus';

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
export const CAPACITY_STATUSES = ['overloaded', 'near_full', 'busy', 'moderate', 'normal', 'low'];

const CAPACITY_STATUS_SET = new Set(CAPACITY_STATUSES);

// Backend exposes capacity under different field names depending on the endpoint:
// /capacity/current uses capacity_pct, /spots?capacity=true uses current_capacity_pct.
const PCT_FIELDS = ['capacity_pct', 'current_capacity_pct', 'occupancy_pct'];
const STATUS_FIELDS = ['status', 'capacity_status', 'current_capacity_status'];
const VISITOR_FIELDS = ['visitor_count', 'current_visitor_count', 'current_visitors'];
const MAX_FIELDS = ['max_capacity', 'capacity'];

function firstFiniteNumber(source, fields) {
  for (const field of fields) {
    const value = Number(source?.[field]);
    if (Number.isFinite(value)) return value;
  }
  return null;
}

function clampPct(value) {
  return Math.min(Math.max(Math.round(value), 0), 100);
}

/**
 * True when the record carries usable visitor/max counts.
 *
 * The counts are treated as the source of truth because /spots?capacity=true has been
 * observed to serve a precomputed percentage that contradicts its own counts.
 */
function hasReliableCounts(item) {
  const current = firstFiniteNumber(item, VISITOR_FIELDS);
  const max = firstFiniteNumber(item, MAX_FIELDS);
  return current != null && max != null && max > 0;
}

/**
 * Returns the occupancy percentage clamped to 0-100, or null when the record
 * carries no capacity signal at all.
 */
export function resolveCapacityPct(item) {
  if (!item || typeof item !== 'object') return null;

  if (hasReliableCounts(item)) {
    const current = firstFiniteNumber(item, VISITOR_FIELDS);
    const max = firstFiniteNumber(item, MAX_FIELDS);
    return clampPct((current / max) * 100);
  }

  const direct = firstFiniteNumber(item, PCT_FIELDS);
  return direct == null ? null : clampPct(direct);
}

export function resolveCapacityStatus(item, pct = resolveCapacityPct(item)) {
  // Only trust a server-supplied status when we could not derive one from the counts.
  if (!hasReliableCounts(item)) {
    for (const field of STATUS_FIELDS) {
      const status = String(item?.[field] ?? '').trim();
      if (CAPACITY_STATUS_SET.has(status)) return status;
    }
  }

  if (pct == null) return null;
  if (pct >= 100) return 'overloaded';
  if (pct >= 85) return 'near_full';
  if (pct >= 70) return 'busy';
  if (pct >= 40) return 'moderate';
  if (pct > 0) return 'low';
  return null;
}
function normalizeItem(raw, defaultName) {
  const pct = resolveCapacityPct(raw) ?? 0;
  const status = resolveCapacityStatus(raw, pct) ?? 'low';
  const coords = raw.geojson?.coordinates;
  return {
    id: raw.spot_id ?? raw.id,
    name: raw.name ?? raw.name_vi ?? raw.name_en ?? raw.spot_name ?? defaultName,
    current: Number(raw.visitor_count ?? raw.current_visitors ?? 0),
    max: raw.max_capacity != null ? Number(raw.max_capacity) : 0,
    pct,
    status,
    lng: coords ? coords[0] : (raw.lng ?? raw.longitude ?? null),
    lat: coords ? coords[1] : (raw.lat ?? raw.latitude ?? null),
    recordedAt: raw.recorded_at ?? raw.last_updated ?? raw.updated_at ?? null,
  };
}

function formatRelativeTime(isoStr, t, locale) {
  if (!isoStr) return null;
  try {
    const diffMs = Date.now() - new Date(isoStr).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return t('common.just_updated');
    if (minutes < 60) return t('common.minutes_ago', { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('common.hours_ago', { count: hours });
    return new Date(isoStr).toLocaleDateString(locale);
  } catch {
    return null;
  }
}

function patchCapacityCache(old, sseData) {
  if (!old || !sseData?.spot_id) return old;
  const spotId = String(sseData.spot_id);
  const patch = {
    visitor_count: sseData.visitor_count,
    capacity_pct: sseData.capacity_pct,
    status: sseData.status,
    recorded_at: sseData.recorded_at,
  };

  function patchArr(arr) {
    if (!Array.isArray(arr)) return arr;
    return arr.map((item) => {
      const id = String(item.spot_id ?? item.id ?? '');
      return id === spotId ? { ...item, ...patch } : item;
    });
  }

  const d = old?.data;
  if (!d) return old;
  if (Array.isArray(d.capacity)) return { ...old, data: { ...d, capacity: patchArr(d.capacity) } };
  if (Array.isArray(d.spots)) return { ...old, data: { ...d, spots: patchArr(d.spots) } };
  if (Array.isArray(d.items)) return { ...old, data: { ...d, items: patchArr(d.items) } };
  if (Array.isArray(d)) return { ...old, data: patchArr(d) };
  return old;
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
  const locale = isVi ? 'vi-VN' : 'en-US';
  const lang = useLanguageStore((state) => state.lang);
  const mapRef = useMapStore((state) => state.mapRef);

  const [statusFilter, setStatusFilter] = useState('overloaded');
  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const { data, isLoading, isError, isFetching, refetch } = useGetCurrentCapacity();
  const { data: sseData, status: sseStatus } = useCapacityStream();

  useEffect(() => {
    if (!sseData?.spot_id) return;
    queryClient.setQueryData(withLanguageQueryKey(['capacity', 'current'], lang), (old) =>
      patchCapacityCache(old, sseData)
    );
  }, [lang, sseData, queryClient]);

  const items = useMemo(() => {
    const raw = data?.data?.capacity ?? data?.data?.spots ?? data?.data?.items ?? data?.data ?? [];
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => normalizeItem(item, t('mapPage.capacityPanel.defaultName')));
  }, [data, t]);

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

  const filterStatuses = useMemo(
    () => Object.keys(CAPACITY_STATUS_META).filter((s) => s !== 'unknown'),
    []
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
    const times = items.map((item) => item.recordedAt).filter(Boolean);
    if (!times.length) return null;
    return times.reduce((a, b) => (a > b ? a : b));
  }, [items]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-[var(--event-panel-border)] bg-[var(--event-panel-surface)] p-3">
      <div className="flex shrink-0 items-start justify-between gap-2 rounded-xl border border-[var(--event-panel-border)] bg-[var(--event-panel-header-bg)] px-3 py-2">
        <div className="min-w-0">
          <p className="typo-section-title text-foreground">{t('mapPage.capacityPanel.title')}</p>
          <p className="typo-meta text-muted-foreground truncate">
            {sseStatus === 'open' ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
                {t('mapPage.capacityPanel.live')}
              </span>
            ) : sseStatus === 'connecting' ? (
              t('mapPage.capacityPanel.connecting')
            ) : isFetching ? (
              t('mapPage.capacityPanel.syncing')
            ) : latestRecordedAt ? (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                {formatRelativeTime(latestRecordedAt, t, locale)}
              </span>
            ) : (
              t('mapPage.capacityPanel.count', { count: items.length })
            )}
          </p>
        </div>

        {sseStatus !== 'open' && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="typo-meta h-7 shrink-0"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            {t('mapPage.capacityPanel.refresh')}
          </Button>
        )}
      </div>

      {!isLoading && items.length > 0 && (
        <div className="relative shrink-0">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('mapPage.capacityPanel.searchPlaceholder')}
            className="typo-search h-9 pl-8"
          />
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {filterStatuses.map((status) => {
            const meta = getCapacityStatusMeta(status);
            const isActive = statusFilter === status;
            return (
              <Button
                variant="ghost"
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'typo-badge inline-flex h-auto items-center gap-1 rounded-full border px-2.5 py-0.5 transition-colors',
                  isActive ? meta.activeBadgeClass : meta.badgeClass,
                  isActive && getCapacityActiveBorderClass(status)
                )}
              >
                {getCapacityStatusLabel(status, t)}
                <span className="opacity-90">{statusCounts[status] ?? 0}</span>
              </Button>
            );
          })}
        </div>
      )}

      <ScrollArea className="min-h-0 flex-1">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <CapacityRowSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="typo-meta text-muted-foreground rounded-lg border border-dashed p-4 text-center">
            {t('mapPage.capacityPanel.error')}
          </div>
        ) : filtered.length === 0 ? (
          <div className="typo-meta text-muted-foreground rounded-lg border border-dashed p-4 text-center">
            {t('mapPage.capacityPanel.empty')}
          </div>
        ) : (
          <div className="space-y-2 pr-0.5">
            <p className="typo-meta text-muted-foreground px-0.5">
              {filtered.length !== items.length
                ? t('mapPage.capacityPanel.filteredCount', {
                    filtered: filtered.length,
                    total: items.length,
                  })
                : t('mapPage.capacityPanel.trackedCount', { count: items.length })}
            </p>

            {filtered.map((item) => {
              const meta = getCapacityStatusMeta(item.status);
              const hasCoords = typeof item.lat === 'number' && typeof item.lng === 'number';
              const capacityText =
                item.max > 0
                  ? t('mapPage.capacityPanel.capacityWithMax', {
                      current: numberFormatter.format(item.current),
                      max: numberFormatter.format(item.max),
                    })
                  : t('mapPage.capacityPanel.capacityCurrent', {
                      current: numberFormatter.format(item.current),
                    });

              return (
                <article
                  key={item.id}
                  className={cn(
                    'w-full min-w-0 space-y-2 overflow-hidden rounded-xl border p-3 shadow-sm transition-colors',
                    getCapacityCardClass(item.status)
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className="typo-body text-foreground line-clamp-2 font-semibold"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <Badge variant="outline" className={cn('typo-badge shrink-0', meta.badgeClass)}>
                      {getCapacityStatusLabel(item.status, t)}
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
                          meta.badgeClass.split(' ').find((token) => token.startsWith('text-'))
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
                      {t('mapPage.capacityPanel.viewOnMap')}
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
