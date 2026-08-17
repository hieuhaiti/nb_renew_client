export const CAPACITY_STATUS_META = {
  overloaded: {
    activeBadgeClass:
      'border-border/60 bg-destructive text-white hover:bg-destructive/80 hover:text-white',
    badgeClass:
      'border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive',
    toneClass: 'text-destructive',
    barStyle: { background: 'linear-gradient(90deg, #f87171, #b91c1c)' },
    labelKey: 'mapPage.capacityPanel.status.overloaded',
  },
  near_full: {
    activeBadgeClass:
      'border-border/60 bg-orange-500 text-white hover:bg-orange-500/80 hover:text-white',
    badgeClass:
      'border-orange-500/30 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-600',
    toneClass: 'text-orange-600',
    barStyle: { background: 'linear-gradient(90deg, var(--tertiary-1), var(--quaternary))' },
    labelKey: 'mapPage.capacityPanel.status.near_full',
  },
  busy: {
    activeBadgeClass: 'border-border/60 bg-warning text-white hover:bg-warning/80 hover:text-white',
    badgeClass:
      'border-warning/40 bg-warning/10 text-warning hover:bg-warning/20 hover:text-warning',
    toneClass: 'text-warning',
    barStyle: { background: 'linear-gradient(90deg, var(--gold), var(--tertiary-2))' },
    labelKey: 'mapPage.capacityPanel.status.busy',
  },
  moderate: {
    activeBadgeClass: 'border-border/60 bg-sky-500 text-white hover:bg-sky-500/80 hover:text-white',
    badgeClass:
      'border-sky-500/30 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 hover:text-sky-600',
    toneClass: 'text-sky-600',
    barStyle: { background: 'linear-gradient(90deg, var(--primary-1), var(--primary-2))' },
    labelKey: 'mapPage.capacityPanel.status.moderate',
  },
  normal: {
    activeBadgeClass:
      'border-border/60 bg-emerald-500 text-white hover:bg-emerald-500/80 hover:text-white',
    badgeClass:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-600',
    toneClass: 'text-emerald-600',
    barStyle: { background: 'linear-gradient(90deg, var(--secondary-1), var(--secondary-2))' },
    labelKey: 'mapPage.capacityPanel.status.normal',
  },
  low: {
    activeBadgeClass:
      'border-border/60 bg-emerald-500 text-white hover:bg-emerald-500/80 hover:text-white',
    badgeClass:
      'border-emerald-400/30 bg-emerald-400/10 text-emerald-500 hover:bg-emerald-400/20 hover:text-emerald-500',
    toneClass: 'text-emerald-500',
    barStyle: { background: 'linear-gradient(90deg, #6ee7b7, var(--secondary-1))' },
    labelKey: 'mapPage.capacityPanel.status.low',
  },
  unknown: {
    activeBadgeClass: 'border-border/60 bg-muted text-muted-foreground hover:bg-muted/80',
    badgeClass: 'border-border/40 bg-muted/60 text-muted-foreground hover:bg-muted',
    toneClass: 'text-muted-foreground',
    barStyle: { background: 'linear-gradient(90deg, #94a3b8, #64748b)' },
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
