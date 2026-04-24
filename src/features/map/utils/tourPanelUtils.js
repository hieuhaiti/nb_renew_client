function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getArrayCandidate(...candidates) {
  return candidates.find((items) => Array.isArray(items)) || [];
}

function getLocalizedValue(item, lang = 'vi', baseField) {
  const preferVi = lang !== 'en';
  const viField = `${baseField}_vi`;
  const enField = `${baseField}_en`;

  if (preferVi) {
    return item?.[viField] || item?.[enField] || item?.[baseField] || '';
  }

  return item?.[enField] || item?.[viField] || item?.[baseField] || '';
}

export function normalizeTourModel(item, { lang = 'vi', fallbackId } = {}) {
  return {
    id: item?.id ?? fallbackId ?? null,
    name: getLocalizedValue(item, lang, 'name') || 'Untitled tour',
    description: getLocalizedValue(item, lang, 'description') || '',
    duration_days: toNumber(item?.duration_days),
    duration_hours: toNumber(item?.duration_hours),
    tour_type: item?.tour_type || null,
    max_participants: toNumber(item?.max_participants),
    price: toNumber(item?.price),
    currency: item?.currency || 'VND',
    average_rating: toNumber(item?.average_rating),
    total_reviews: toNumber(item?.total_reviews),
    total_bookings: toNumber(item?.total_bookings),
    main_image_url: item?.main_image_url || null,
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
  if (tour?.price == null) return '--';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: tour?.currency || 'VND',
    maximumFractionDigits: 0,
  }).format(tour.price);
}
