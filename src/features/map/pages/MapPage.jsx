import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { categoriesService } from '@/features/categories/api/categoriesService';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import MapCategoryDebugCard from '@/features/map/components/MapCategoryDebugCard';
import MapLayout from '@/features/map/layout/MapLayout';
import {
  getCategoriesFromResponse,
  getDefaultCategorySlug,
  getMatchedCategoryBySlug,
  resolveCategorySlug,
  toTourismPointSettings,
} from '@/features/map/utils/MapHelper';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import { useLanguageStore } from '@/stores/useLanguageStore';

export default function MapPage({ slug: fallbackSlug }) {
  const { categorySlug } = useParams();
  const location = useLocation();

  const slug = useMemo(
    () => resolveCategorySlug(fallbackSlug, categorySlug),
    [fallbackSlug, categorySlug]
  );

  const lang = useLanguageStore((state) => state.lang);
  const setCategory = useCategoriesStore((state) => state.setCategory);
  const setCurrentTourismPointSettings = useTourismPointSettingStore(
    (state) => state.setCurrentSettings
  );

  const { data: categoriesData, isFetched } = categoriesService({ lang });

  const categories = useMemo(() => getCategoriesFromResponse(categoriesData), [categoriesData]);
  const defaultCategorySlug = useMemo(() => getDefaultCategorySlug(categories), [categories]);
  const matchedCategory = useMemo(
    () => getMatchedCategoryBySlug(categories, slug),
    [categories, slug]
  );

  useEffect(() => {
    if (!isFetched || !matchedCategory) return;

    setCategory(matchedCategory);
    setCurrentTourismPointSettings(toTourismPointSettings(matchedCategory));
  }, [isFetched, matchedCategory, setCategory, setCurrentTourismPointSettings]);

  useEffect(() => {
    console.debug('[MapPage]', {
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
    <MapLayout>
      <div className="bg-background text-foreground flex min-h-[40vh] items-center justify-center px-4 py-8">
        <MapCategoryDebugCard
          pathname={location.pathname}
          categorySlug={categorySlug}
          resolvedSlug={slug}
          isFetched={isFetched}
          defaultCategorySlug={defaultCategorySlug}
          matchedCategory={matchedCategory}
        />
      </div>
    </MapLayout>
  );
}
