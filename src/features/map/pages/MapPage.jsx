import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { categoriesService } from '@/features/categories/api/categoriesService';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import MapBaseArea from '@/features/map/components/MapBaseArea';
import MapFloatingLegend from '@/features/map/components/MapFloatingLegend';
import MapFloatingTool from '@/features/map/components/MapFloatingTool';
import MapFloatingWeatherCard from '@/features/map/components/MapFloatingWeatherCard';
import MapLeftSidebar from '@/features/map/components/MapLeftSidebar';
import MapSubSidebar from '@/features/map/components/MapSubSidebar';
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
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(true);

  // Change to 'right' if you want to keep legend pinned to the right side.
  const legendAnchor = 'left';

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

  const leftLegendClassName = isSubSidebarOpen
    ? 'absolute bottom-4 z-50 hidden transition-[left] duration-300 ease-in-out lg:block lg:left-[calc(59%+1rem)] lg:w-[18%] xl:left-[calc(50%+1rem)] xl:w-[15%] 2xl:left-[calc(46%+1rem)] 2xl:w-[13%]'
    : 'absolute bottom-4 z-50 hidden transition-[left] duration-300 ease-in-out lg:block lg:left-[calc(31%+1rem)] lg:w-[18%] xl:left-[calc(26%+1rem)] xl:w-[15%] 2xl:left-[calc(24%+1rem)] 2xl:w-[13%]';

  const rightLegendClassName =
    'absolute right-4 bottom-4 z-50 hidden lg:block lg:w-[18%] xl:w-[15%] 2xl:w-[13%]';

  return (
    <MapLayout>
      <section className="bg-background relative h-full min-h-[calc(100vh-4rem)] w-full overflow-hidden">
        <MapLeftSidebar className="absolute inset-y-0 left-0 z-40 hidden lg:block lg:w-[31%] xl:w-[26%] 2xl:w-[24%]" />

        <MapSubSidebar
          isOpen={isSubSidebarOpen}
          onToggle={() => setIsSubSidebarOpen((prev) => !prev)}
          className="inset-y-0 z-50 hidden lg:left-[31%] lg:block lg:w-[28%] xl:left-[26%] xl:w-[24%] 2xl:left-[24%] 2xl:w-[22%]"
        />

        <MapFloatingWeatherCard className="absolute top-4 right-4 z-60 hidden lg:block lg:w-[18%] xl:w-[15%] 2xl:w-[13%]" />

        <MapFloatingTool className="absolute right-4 bottom-4 z-50 hidden min-w-12 lg:block lg:w-[5%] xl:w-[4.5%] 2xl:w-[4%]" />

        <MapFloatingLegend
          className={legendAnchor === 'left' ? leftLegendClassName : rightLegendClassName}
        />

        <MapBaseArea className="h-full w-full lg:ml-[31%] lg:w-[69%] xl:ml-[26%] xl:w-[74%] 2xl:ml-[24%] 2xl:w-[76%]"></MapBaseArea>
      </section>
    </MapLayout>
  );
}
