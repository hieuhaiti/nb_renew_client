/**
 * Convert a value to YYYY-MM-DD string
 * @param {Date|string} value
 * @returns {string}
 */
export function toDateString(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().split('T')[0];
  if (typeof value === 'string') return value;
  return new Date(value).toISOString().split('T')[0];
}

/**
 * Check whether a value is a valid Date object
 * @param {unknown} value
 * @returns {boolean}
 */
export function isValidDateObject(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Parse YYYY-MM-DD strictly
 * @param {string} value
 * @returns {Date|null}
 */
export function parseDateInputValue(value) {
  if (!value || typeof value !== 'string') return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }
  return parsed;
}

/**
 * Format a Date object as YYYY-MM-DD for HTML date input
 * @param {Date} date
 * @returns {string}
 */
export function formatDateForInput(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

/**
 * Format a date as DD/MM/YY
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateShort(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

/**
 * Format a date range string "YYYY-MM-DD - YYYY-MM-DD" → "DD/MM/YY → DD/MM/YY"
 * @param {string} dateRange
 * @returns {string}
 */
export function formatDateRange(dateRange) {
  if (!dateRange) return '';
  const parts = dateRange.split(' - ');
  if (parts.length === 2) {
    return `${formatDateShort(parts[0])} → ${formatDateShort(parts[1])}`;
  }
  return dateRange;
}

/**
 * Format area in km² with 2 decimal places
 * @param {number} km2
 * @returns {string}
 */
export function fmtKm2(km2) {
  if (km2 == null || isNaN(km2)) return '';
  if (km2 >= 1000) return `${(km2 / 1000).toFixed(1)}k km²`;
  return `${Number(km2).toFixed(2)} km²`;
}

/**
 * Build a 1-year-before date
 * @param {Date} date
 * @returns {Date}
 */
export function oneYearBefore(date) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() - 1);
  return d;
}
