import { useApiQuery } from '@/services/useApi';
import { queryClient } from '@/providers/AppProviders';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';

export function subCategoriesService({ lang = 'vi', category_id } = {}) {
  return useApiQuery(
    ['subcategories', lang, category_id],
    `subcategories/category/${category_id}?lang=${lang}&sortBy=id&sortOrder=ASC&is_active=true`,
    {
      enabled: !!category_id,
    }
  );
}

export function getAllSubCategoriesName() {
  const lang = useLanguageStore.getState().lang;
  const { categoriesStoreID } = useCategoriesStore.getState();
  return queryClient.getQueryData(['subcategories', lang, categoriesStoreID]);
}
