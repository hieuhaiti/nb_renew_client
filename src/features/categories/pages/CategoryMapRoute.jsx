import React, { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { categoriesService } from '@/features/categories/api/categoriesService';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import { useLanguageStore } from '@/stores/useLanguageStore';

/**
 * App-level map category route.
 * Resolves slug -> category store and redirects to tourism point page.
 */
export default function CategoryMapRoute({ slug: fallbackSlug }) {
  const { categorySlug } = useParams();
  const slug = fallbackSlug || categorySlug || null;
  const location = useLocation();

  const lang = useLanguageStore((state) => state.lang);
  const setCategory = useCategoriesStore((state) => state.setCategory);
  const setCurrentTourismPointSettings = useTourismPointSettingStore(
    (state) => state.setCurrentSettings
  );

  const { data: categoriesData, isFetched } = categoriesService({ lang });

  const categories = useMemo(() => categoriesData?.data?.categories || [], [categoriesData]);
  const defaultCategorySlug = useMemo(
    () => categories.find((category) => Boolean(category?.slug))?.slug || null,
    [categories]
  );
  const matchedCategory = useMemo(
    () => categories.find((category) => category.slug === slug),
    [categories, slug]
  );

  useEffect(() => {
    if (!isFetched || !matchedCategory) return;

    setCategory(matchedCategory);
    setCurrentTourismPointSettings({
      selectedCategory: Number(matchedCategory.id) || matchedCategory.id,
      selectedSubcategory: 0,
      page: 1,
    });
  }, [isFetched, matchedCategory, setCategory, setCurrentTourismPointSettings]);

  useEffect(() => {
    console.debug('[CategoryMapRoute]', {
      pathname: location.pathname,
      categorySlug,
      resolvedSlug: slug,
      isFetched,
      defaultCategorySlug,
      matchedCategoryId: matchedCategory?.id,
      matchedCategoryName: matchedCategory?.name,
    });
  }, [
    categorySlug,
    defaultCategorySlug,
    isFetched,
    location.pathname,
    matchedCategory?.id,
    matchedCategory?.name,
    slug,
  ]);

  return (
    <div className="bg-background text-foreground flex min-h-[40vh] items-center justify-center px-4 py-8">
      <div className="bg-card border-border w-full max-w-xl rounded-xl border p-5 shadow-sm">
        <div className="text-lg font-semibold">Category Route Debug</div>
        <div className="text-muted-foreground mt-3 space-y-2 text-sm">
          <div>pathname: {location.pathname}</div>
          <div>param categorySlug: {categorySlug || '(empty)'}</div>
          <div>resolved slug: {slug || '(empty)'}</div>
          <div>isFetched: {String(isFetched)}</div>
          <div>default category slug: {defaultCategorySlug || '(none)'}</div>
          <div>matched category id: {matchedCategory?.id ?? '(none)'}</div>
          <div>matched category name: {matchedCategory?.name || '(none)'}</div>
        </div>
      </div>
    </div>
  );
}
