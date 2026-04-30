function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getArrayCandidate(...candidates) {
  return candidates.find((items) => Array.isArray(items)) || [];
}

function normalizeTextValue(value, lang = 'vi') {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object') return '';

  const preferVi = lang !== 'en';
  const note = preferVi
    ? value?.note_vi || value?.note_en
    : value?.note_en || value?.note_vi;

  return typeof note === 'string' ? note : '';
}

function normalizeFestivalTypeOption(item, index = 0) {
  if (typeof item === 'string' || typeof item === 'number') {
    const value = String(item);
    return { value, label: value };
  }

  if (!item || typeof item !== 'object') return null;

  const value =
    item.value ||
    item.code ||
    item.slug ||
    item.festival_type ||
    item.type ||
    item.id ||
    `type-${index}`;
  const label = item.label || item.name_vi || item.name_en || item.name || String(value);

  return {
    value: String(value),
    label,
  };
}

export function normalizeFestivalTypesPayload(payload) {
  const root = payload?.data || payload;

  const sourceItems = getArrayCandidate(
    root?.types,
    root?.festival_types,
    root?.festivalTypes,
    root?.items,
    payload?.types,
    payload?.festival_types
  );

  const normalized =
    sourceItems.length > 0
      ? sourceItems.map((item, index) => normalizeFestivalTypeOption(item, index)).filter(Boolean)
      : getArrayCandidate(root?.events, payload?.events)
          .map((item, index) =>
            normalizeFestivalTypeOption(
              item?.festival_type || item?.event_type || item?.type,
              index
            )
          )
          .filter(Boolean);

  const deduped = [];
  const seen = new Set();

  normalized.forEach((item) => {
    if (seen.has(item.value)) return;
    seen.add(item.value);
    deduped.push(item);
  });

  return deduped;
}

function getLocalizedValue(item, lang = 'vi', baseField) {
  const preferVi = lang !== 'en';
  const viField = `${baseField}_vi`;
  const enField = `${baseField}_en`;

  const localizedValue = preferVi
    ? item?.[viField] || item?.[enField] || item?.[baseField]
    : item?.[enField] || item?.[viField] || item?.[baseField];

  return normalizeTextValue(localizedValue, lang);
}

export function normalizeFestivalModel(item, { lang = 'vi', fallbackId } = {}) {
  const lng = toNumber(item?.lng ?? item?.longitude);
  const lat = toNumber(item?.lat ?? item?.latitude);

  return {
    id: item?.id ?? fallbackId ?? null,
    name: getLocalizedValue(item, lang, 'name') || 'Untitled festival',
    description: getLocalizedValue(item, lang, 'description') || '',
    festival_type: item?.festival_type || item?.type || 'other',
    start_date: item?.start_date || item?.startDate || null,
    end_date: item?.end_date || item?.endDate || null,
    location_name:
      getLocalizedValue(item, lang, 'location_name') ||
      item?.location ||
      item?.tourism_point_name ||
      '',
    province_code: item?.province_code || null,
    cover_image_url:
      item?.cover_image_url || item?.coverImageUrl || item?.featured_image || null,
    website: item?.website || null,
    is_recurring: Boolean(item?.is_recurring),
    is_published: item?.is_published ?? true,
    spot_id: item?.spot_id || item?.tourism_point_id || null,
    coordinates: lng != null && lat != null ? [lng, lat] : null,
    raw: item,
  };
}

export function normalizeFestivalListPayload(payload, { lang = 'vi' } = {}) {
  const root = payload?.data || payload;
  const sourceItems = getArrayCandidate(
    root?.events,
    root?.festivals,
    root?.items,
    root?.results,
    payload?.events,
    payload?.festivals,
    payload?.items,
    payload?.results
  );

  return sourceItems
    .map((item, index) => normalizeFestivalModel(item, { lang, fallbackId: `festival-${index}` }))
    .filter((item) => item?.id != null);
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatFestivalDateRange(startDate, endDate, locale = 'vi-VN') {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (!start && !end) return '--';
  if (start && !end) return formatter.format(start);
  if (!start && end) return formatter.format(end);
  if (start && end && sameDay(start, end)) return formatter.format(start);

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export function getFestivalCoordinates(festival) {
  if (!Array.isArray(festival?.coordinates) || festival.coordinates.length < 2) return null;
  const lng = toNumber(festival.coordinates[0]);
  const lat = toNumber(festival.coordinates[1]);
  if (lng == null || lat == null) return null;
  return [lng, lat];
}
