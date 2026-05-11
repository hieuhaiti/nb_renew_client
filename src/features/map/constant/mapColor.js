export const Maping_color = [
  { id: 'all', nameKey: 'common.map_all_point', color: '#0b66c3' },
  { id: 1, nameKey: 'common.natural', color: '#10b981' },
  { id: 2, nameKey: 'common.culture', color: '#f59e0b' },
  { id: 3, nameKey: 'common.infrastructure', color: '#8b5cf6' },
];

export const getMapItemById = (id) => {
  if (id == null) return null;
  return Maping_color.find((c) => String(c.id) === String(id)) || null;
};

export const getMapColorById = (id) => {
  return getMapItemById(id)?.color || null;
};

export const getNameKeyById = (id) => {
  return getMapItemById(id)?.nameKey || null;
};
