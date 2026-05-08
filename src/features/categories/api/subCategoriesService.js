import { useApiQuery } from '@/services/useApi';
import { fetcher } from '@/services/fetcher';
import { queryClient } from '@/providers/AppProviders';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import { normalizeCategoryTreePayload } from '@/features/categories/api/categoriesService';

function findCategoryInTree(nodes = [], categoryId) {
  if (!Array.isArray(nodes) || categoryId == null) return null;

  for (const node of nodes) {
    if (String(node?.id) === String(categoryId)) return node;
    const foundInChildren = findCategoryInTree(node?.children || [], categoryId);
    if (foundInChildren) return foundInChildren;
  }

  return null;
}

function extractSubcategoriesFromTree(payload, categoryId) {
  const normalized = normalizeCategoryTreePayload(payload);
  const tree = normalized?.data?.tree || [];
  const matchedCategory = findCategoryInTree(tree, categoryId);
  const children = Array.isArray(matchedCategory?.children) ? matchedCategory.children : [];

  return {
    ...normalized,
    data: {
      ...normalized.data,
      items: children,
      subcategories: children,
      parentCategory: matchedCategory || null,
    },
  };
}

export function subCategoriesService({ lang = 'vi', category_id } = {}) {
  return useApiQuery(['subcategories', lang, category_id], `spot-categories/tree`, {
    enabled: !!category_id,
    select: (payload) => extractSubcategoriesFromTree(payload, category_id),
    staleTime: 5 * 60 * 1000,
  });
}

export async function fetchSubCategoriesByCategoryId({ lang = 'vi', category_id }) {
  const payload = await fetcher(`spot-categories/tree`);
  return extractSubcategoriesFromTree(payload, category_id);
}

export function getAllSubCategoriesName() {
  const lang = useLanguageStore.getState().lang;
  const { categoriesStoreID } = useCategoriesStore.getState();
  return queryClient.getQueryData(['subcategories', lang, categoriesStoreID]);
}
