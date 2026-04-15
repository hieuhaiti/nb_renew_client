export function stripHtmlTags(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getDurationLabel(tour, t) {
  if (tour?.duration_days) {
    return `${tour.duration_days} ${t('tourPage.days', 'days')}`;
  }
  if (tour?.duration_hours) {
    return `${tour.duration_hours} ${t('tourPage.hours', 'hours')}`;
  }
  return t('tourPage.unknown', 'Unknown');
}

export function getDistanceLabel(tour) {
  const distanceValue =
    tour?.distance_text ?? tour?.distance_km ?? tour?.distance ?? tour?.distanceKm;

  if (typeof distanceValue === 'number') {
    return `${distanceValue.toFixed(1)} km`;
  }

  if (typeof distanceValue === 'string' && distanceValue.trim()) {
    return distanceValue;
  }

  return '';
}

export function getHeroTags(tour, t) {
  const extracted = [
    tour?.category_name,
    tour?.type,
    tour?.theme,
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
    ...(Array.isArray(tour?.categories)
      ? tour.categories
          .map((item) => (typeof item === 'string' ? item : item?.name))
          .filter(Boolean)
      : []),
  ]
    .filter(Boolean)
    .map((item) => String(item).trim());

  const unique = [...new Set(extracted)];
  if (unique.length > 0) return unique.slice(0, 2);

  return [t('tourPage.defaultTag1', 'Tour nổi bật'), t('tourPage.defaultTag2', 'Khám phá')];
}

export function getIntroTags(tour, heroTags) {
  const values = [
    ...heroTags,
    tour?.tour_type,
    tour?.suitable_for,
    tour?.highlight,
    tour?.duration_label,
  ]
    .filter(Boolean)
    .map((item) => String(item).trim());

  return [...new Set(values)].slice(0, 6);
}

export function getGalleryPreviewImages(images) {
  if (!Array.isArray(images) || images.length === 0) return [];

  const picked = images.slice(0, 5);
  if (picked.length === 5) return picked;

  const filled = [...picked];
  while (filled.length < 5) {
    filled.push(images[filled.length % images.length]);
  }

  return filled;
}
