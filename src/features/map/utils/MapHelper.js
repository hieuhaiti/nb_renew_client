import { MAP_PAGE_DEFAULT_TOURISM_POINT_SETTINGS } from '@/features/map/constant';

export function resolveCategorySlug(fallbackSlug, categorySlug) {
  return fallbackSlug || categorySlug || null;
}

export function getCategoriesFromResponse(categoriesData) {
  return categoriesData?.data?.categories || [];
}

export function getDefaultCategorySlug(categories) {
  return categories.find((category) => Boolean(category?.slug))?.slug || null;
}

export function getMatchedCategoryBySlug(categories, slug) {
  return categories.find((category) => category?.slug === slug) || null;
}

export function toTourismPointSettings(category) {
  return {
    ...MAP_PAGE_DEFAULT_TOURISM_POINT_SETTINGS,
    selectedCategory: Number(category.id) || category.id,
  };
}
