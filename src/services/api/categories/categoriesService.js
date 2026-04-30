import { useApiQuery } from '@/services/useApi';

function flattenTreeNodes(nodes = []) {
  if (!Array.isArray(nodes)) return [];

  return nodes.flatMap((node) => {
    const children = Array.isArray(node?.children) ? node.children : [];
    return [node, ...flattenTreeNodes(children)];
  });
}

export function normalizeCategoryTreePayload(payload) {
  const treeItems = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.data?.items)
      ? payload.data.items
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

  const normalizedParents = treeItems.filter((item) => item?.parent_id == null);
  const flattenedCategories = flattenTreeNodes(normalizedParents);

  return {
    ...payload,
    data: {
      ...(payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
        ? payload.data
        : {}),
      tree: normalizedParents,
      items: normalizedParents,
      categories: flattenedCategories,
    },
  };
}

export function categoriesService({ lang = 'vi' } = {}) {
  return useApiQuery(
    ['categories', lang],
    `spot-categories/tree`,
    {
      select: normalizeCategoryTreePayload,
      staleTime: 5 * 60 * 1000,
    }
  );
}
