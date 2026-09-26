export const CAPACITY_STATUS_META = {
  overloaded: {
    activeBadgeClass:
      'border-border/60 bg-destructive text-destructive-foreground hover:bg-destructive/80',
    badgeClass:
      'border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20',
    toneClass: 'text-destructive',
    barStyle: { background: 'linear-gradient(90deg, hsl(var(--destructive) / 0.8), hsl(var(--destructive)))' },
    labelKey: 'mapPage.capacityPanel.status.overloaded',
  },
  near_full: {
    activeBadgeClass:
      'border-border/60 bg-warning text-warning-foreground hover:bg-warning/80',
    badgeClass:
      'border-warning/30 bg-warning/15 text-warning hover:bg-warning/25',
    toneClass: 'text-warning',
    barStyle: { background: 'linear-gradient(90deg, var(--tertiary-1), var(--quaternary))' },
    labelKey: 'mapPage.capacityPanel.status.near_full',
  },
  busy: {
    activeBadgeClass: 'border-border/60 bg-warning text-warning-foreground hover:bg-warning/80',
    badgeClass:
      'border-warning/40 bg-warning/10 text-warning hover:bg-warning/20',
    toneClass: 'text-warning',
    barStyle: { background: 'linear-gradient(90deg, var(--gold), var(--tertiary-2))' },
    labelKey: 'mapPage.capacityPanel.status.busy',
  },
  moderate: {
    activeBadgeClass: 'border-border/60 bg-info text-info-foreground hover:bg-info/80',
    badgeClass:
      'border-info/30 bg-info/10 text-info hover:bg-info/20',
    toneClass: 'text-info',
    barStyle: { background: 'linear-gradient(90deg, var(--primary-1), var(--primary-2))' },
    labelKey: 'mapPage.capacityPanel.status.moderate',
  },
  normal: {
    activeBadgeClass:
      'border-border/60 bg-success text-success-foreground hover:bg-success/80',
    badgeClass:
      'border-success/30 bg-success/10 text-success hover:bg-success/20',
    toneClass: 'text-success',
    barStyle: { background: 'linear-gradient(90deg, var(--secondary-1), var(--secondary-2))' },
    labelKey: 'mapPage.capacityPanel.status.normal',
  },
  low: {
    activeBadgeClass:
      'border-border/60 bg-success text-success-foreground hover:bg-success/80',
    badgeClass:
      'border-success/30 bg-success/15 text-success hover:bg-success/25',
    toneClass: 'text-success',
    barStyle: { background: 'linear-gradient(90deg, hsl(var(--success) / 0.7), hsl(var(--success)))' },
    labelKey: 'mapPage.capacityPanel.status.low',
  },
  unknown: {
    activeBadgeClass: 'border-border/60 bg-muted text-muted-foreground hover:bg-muted/80',
    badgeClass: 'border-border/40 bg-muted/60 text-muted-foreground hover:bg-muted',
    toneClass: 'text-muted-foreground',
    barStyle: { background: 'linear-gradient(90deg, hsl(var(--muted-foreground) / 0.5), hsl(var(--muted-foreground) / 0.8))' },
    labelKey: 'mapPage.capacityPanel.status.unknown',
  },
};

const FALLBACK_STATUS = 'normal';

export function normalizeCapacityStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

export function getCapacityStatusMeta(status, fallbackStatus = FALLBACK_STATUS) {
  const key = normalizeCapacityStatus(status);
  const fallbackKey = normalizeCapacityStatus(fallbackStatus);
  return CAPACITY_STATUS_META[key] ?? CAPACITY_STATUS_META[fallbackKey] ?? CAPACITY_STATUS_META.low;
}

export function getCapacityStatusLabel(status, t) {
  const meta = getCapacityStatusMeta(status);
  return t(meta.labelKey);
}

export function resolveCapacityStatus(status, pct) {
  const key = normalizeCapacityStatus(status);
  if (CAPACITY_STATUS_META[key] && key !== 'unknown') return key;

  const value = Number(pct);
  if (!Number.isFinite(value)) return 'unknown';
  if (value >= 100) return 'overloaded';
  if (value >= 85) return 'near_full';
  if (value >= 70) return 'busy';
  if (value >= 40) return 'moderate';
  if (value > 0) return 'normal';
  return 'low';
}
