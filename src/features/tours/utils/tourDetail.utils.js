export function stripHtmlTags(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getDurationLabel(tour, t) {
  if (tour?.duration_days) {
    return `${tour.duration_days} ${t('tourPage.days', 'ngày')}`;
  }
  return t('tourPage.unknown', 'Unknown');
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
