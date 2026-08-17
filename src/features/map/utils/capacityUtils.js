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
 * observed to serve a precomputed percentage that contradicts its own counts — e.g. a
 * spot with 650 visitors and a 300 max reported as 65% / "moderate" instead of
 * "overloaded", while /capacity/current reported the same counts as 216.67%. Deriving
 * from the counts keeps the sidebar, the tour panel and the map markers in agreement.
 */
function hasReliableCounts(item) {
  const current = firstFiniteNumber(item, VISITOR_FIELDS);
  const max = firstFiniteNumber(item, MAX_FIELDS);
  return current != null && max != null && max > 0;
}

/**
 * Returns the occupancy percentage clamped to 0-100, or null when the record
 * carries no capacity signal at all (so callers can hide the indicator rather
 * than render a misleading 0%).
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
      const raw = String(item?.[field] ?? '').trim();
      if (CAPACITY_STATUS_SET.has(raw)) return raw;
    }
  }

  if (pct == null) return null;
  if (pct >= 100) return 'overloaded';
  if (pct >= 85) return 'near_full';
  if (pct >= 70) return 'busy';
  if (pct >= 40) return 'moderate';
  if (pct > 0) return 'normal';
  return 'low';
}
