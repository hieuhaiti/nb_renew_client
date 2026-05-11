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

function getLocalizedValue(item, lang = 'vi', baseField) {
  const preferVi = lang !== 'en';
  const viField = `${baseField}_vi`;
  const enField = `${baseField}_en`;

  const localizedValue = preferVi
    ? item?.[viField] || item?.[enField] || item?.[baseField]
    : item?.[enField] || item?.[viField] || item?.[baseField];

  return normalizeTextValue(localizedValue, lang);
}

export function normalizeTourModel(item, { lang = 'vi', fallbackId } = {}) {
  const rawIncludes = item?.includes;
  const rawExcludes = item?.excludes;

  return {
    id: item?.id ?? fallbackId ?? null,
    slug: item?.slug || null,
    name: getLocalizedValue(item, lang, 'name') || 'Untitled tour',
    description: getLocalizedValue(item, lang, 'description') || '',
    start_location: getLocalizedValue(item, lang, 'start_location') || '',
    end_location: getLocalizedValue(item, lang, 'end_location') || '',
    duration_days: toNumber(item?.duration_days),
    duration_hours: toNumber(item?.duration_hours),
    tour_type: item?.tour_type || null,
    max_participants: toNumber(item?.max_participants),
    price: toNumber(item?.price_from_vnd ?? item?.price),
    currency: item?.currency || 'VND',
    // TODO: rating_avg / rating_count not confirmed in Postman for tours — verify field names.
    average_rating: toNumber(item?.rating_avg ?? item?.average_rating),
    total_reviews: toNumber(item?.rating_count ?? item?.total_reviews),
    total_bookings: toNumber(item?.total_bookings),
    includes: Array.isArray(rawIncludes)
      ? rawIncludes.map((entry) => normalizeTextValue(entry, lang))
      : [],
    excludes: Array.isArray(rawExcludes)
      ? rawExcludes.map((entry) => normalizeTextValue(entry, lang))
      : [],
    cover_image_url: item?.cover_image_url || item?.main_image_url || null,
    main_image_url: item?.cover_image_url || item?.main_image_url || null,
    is_featured: Boolean(item?.is_featured),
    is_active: item?.is_active ?? true,
    raw: item,
  };
}

export function normalizeTourListPayload(payload, { lang = 'vi' } = {}) {
  const root = payload?.data || payload;
  const sourceItems = getArrayCandidate(
    root?.tours,
    root?.items,
    root?.results,
    payload?.tours,
    payload?.items,
    payload?.results
  );

  return sourceItems
    .map((item, index) => normalizeTourModel(item, { lang, fallbackId: `tour-${index}` }))
    .filter((item) => item?.id != null);
}

export function formatTourDurationLabel(tour, t) {
  if (tour?.duration_days) {
    return `${tour.duration_days} ${t('tourPage.days', { defaultValue: 'days' })}`;
  }

  if (tour?.duration_hours) {
    return `${tour.duration_hours} ${t('tourPage.hours', { defaultValue: 'hours' })}`;
  }

  return t('tourPage.unknown', { defaultValue: 'Unknown' });
}

export function formatTourPriceLabel(tour, locale = 'vi-VN') {
  if (tour?.price == null && tour?.price_from_vnd == null) return '--';
  // price is already normalized to price_from_vnd in normalizeTourModel

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: tour?.currency || 'VND',
    maximumFractionDigits: 0,
  }).format(tour.price);
}
