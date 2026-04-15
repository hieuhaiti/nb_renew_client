import { useApiQuery } from '@/services/useApi';

export function categoriesService({ lang = 'vi' } = {}) {
  return useApiQuery(
    ['categories', lang],
    `categories?lang=${lang}&sortBy=id&sortOrder=ASC&is_active=true`
  );
}
