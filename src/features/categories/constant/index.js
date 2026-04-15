export function categoriesMap(id) {
  const categories = [
    { id: 1, url: 'map-natural-resources' },
    { id: 2, url: 'map-cultural-resources' },
    { id: 3, url: 'map-infrastructure' },
  ];

  return categories.find((category) => category.id === id)?.url || null;
}
