import { useEffect, useMemo } from 'react';
import { Layers, AlertCircle, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { categoriesService } from '@/services/api/categories/categoriesService';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import { useDataLayerStore } from '@/features/map/store/useDataLayerStore';
import { hexToRgba, withBaseUrl } from '@/lib/utils';

function subcategorySignature(items = []) {
  return items
    .map(
      (item) =>
        `${item?.id ?? ''}|${item?.name_vi ?? ''}|${item?.color_hex ?? ''}|${item?.icon_url ?? ''}`
    )
    .join('::');
}

export default function DataLayer({ categoryId, categoryIds = [], showAllCategories = false }) {
  const { t } = useTranslation();
  const lang = useLanguageStore((state) => state.lang);

  const subcategories = useDataLayerStore((state) => state.subcategories);
  const selectedSubcategoryIds = useDataLayerStore((state) => state.selectedSubcategoryIds);
  const setSubcategories = useDataLayerStore((state) => state.setSubcategories);
  const toggleSubcategory = useDataLayerStore((state) => state.toggleSubcategory);
  const selectAllSubcategories = useDataLayerStore((state) => state.selectAllSubcategories);
  const clearSelectedSubcategories = useDataLayerStore((state) => state.clearSelectedSubcategories);

  const { data: categoriesData, isLoading, isFetching, isError } = categoriesService({ lang });

  const categoryTree = useMemo(() => {
    if (Array.isArray(categoriesData?.data?.tree)) return categoriesData.data.tree;
    if (Array.isArray(categoriesData?.data?.items)) return categoriesData.data.items;
    return [];
  }, [categoriesData]);

  const normalizedCategoryIds = useMemo(
    () => (Array.isArray(categoryIds) ? categoryIds.filter((id) => id != null) : []),
    [categoryIds]
  );

  const scopedCategoryTree = useMemo(() => {
    if (!showAllCategories || normalizedCategoryIds.length === 0) return categoryTree;

    return categoryTree.filter((item) =>
      normalizedCategoryIds.some((id) => String(id) === String(item?.id))
    );
  }, [categoryTree, normalizedCategoryIds, showAllCategories]);

  const allApiSubcategories = useMemo(() => {
    if (!showAllCategories) return [];

    const merged = scopedCategoryTree.flatMap((category) =>
      Array.isArray(category?.children) ? category.children : []
    );

    return Array.from(new Map(merged.map((item) => [item.id, item])).values());
  }, [scopedCategoryTree, showAllCategories]);

  const apiSubcategories = useMemo(() => {
    if (!categoryId) return [];

    const matchedCategory = categoryTree.find((item) => String(item?.id) === String(categoryId));
    if (!matchedCategory || !Array.isArray(matchedCategory.children)) return [];

    return matchedCategory.children;
  }, [categoryId, categoryTree]);

  const apiSubcategoriesSig = useMemo(
    () => subcategorySignature(apiSubcategories),
    [apiSubcategories]
  );
  const allApiSubcategoriesSig = useMemo(
    () => subcategorySignature(allApiSubcategories),
    [allApiSubcategories]
  );

  const isLoadingAll = showAllCategories && (isLoading || isFetching);
  const isErrorAll = showAllCategories && isError;

  useEffect(() => {
    if (!showAllCategories) return;
    setSubcategories({ categoryId: 'all', subcategories: allApiSubcategories });
  }, [allApiSubcategories, allApiSubcategoriesSig, setSubcategories, showAllCategories]);

  useEffect(() => {
    if (showAllCategories) return;

    if (!categoryId) {
      setSubcategories({ categoryId: null, subcategories: [] });
      return;
    }
    if (!categoriesData) return;
    setSubcategories({ categoryId, subcategories: apiSubcategories });
  }, [
    apiSubcategories,
    apiSubcategoriesSig,
    categoriesData,
    categoryId,
    setSubcategories,
    showAllCategories,
  ]);

  if (!showAllCategories && !categoryId) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center text-sm">
        <Layers size={28} className="text-muted-foreground/50" />
        <span>
          {t('mapPage.layerData.selectCategory', {
            defaultValue: 'Vui lòng chọn danh mục để tải lớp dữ liệu.',
          })}
        </span>
      </div>
    );
  }

  if (isLoading || isFetching || isLoadingAll) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted/40 h-14 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError || isErrorAll) {
    return (
      <div className="text-destructive flex items-center gap-2 rounded-xl border border-dashed p-4 text-sm">
        <AlertCircle size={16} className="shrink-0" />
        <span>{t('mapPage.layerData.error', { defaultValue: 'Không thể tải lớp dữ liệu.' })}</span>
      </div>
    );
  }

  const allSelected =
    selectedSubcategoryIds.length === subcategories.length && subcategories.length > 0;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full min-h-0 flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-foreground text-sm font-semibold">
            {t('mapPage.layerData.title', { defaultValue: 'Lớp dữ liệu' })}
          </h2>
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-sm font-medium">
            {selectedSubcategoryIds.length}/{subcategories.length}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={allSelected ? 'default' : 'outline'}
            className="h-7 text-sm"
            onClick={selectAllSubcategories}
          >
            {t('mapPage.layerData.selectAll', { defaultValue: 'Chọn tất cả' })}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-sm"
            onClick={clearSelectedSubcategories}
            disabled={selectedSubcategoryIds.length === 0}
          >
            {t('mapPage.layerData.clearAll', { defaultValue: 'Bỏ chọn' })}
          </Button>
        </div>

        <Separator />

        {subcategories.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center text-sm">
            <MapPin size={24} className="text-muted-foreground/50" />
            <span>
              {t('mapPage.layerData.empty', { defaultValue: 'Không có lớp dữ liệu phù hợp.' })}
            </span>
          </div>
        ) : (
          <div className="min-h-0 space-y-1.5 overflow-y-auto pr-0.5">
            {subcategories.map((item) => {
              const checked = selectedSubcategoryIds.includes(item.id);
              const colorCode = item.color_hex || '#94a3b8';
              const iconUrl = withBaseUrl(item.icon_url);
              const itemName =
                lang === 'en' ? item.name_en || item.name_vi : item.name_vi || item.name_en;
              const checkboxId = `map-layer-subcategory-${item.id}`;

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <label
                      htmlFor={checkboxId}
                      className="group hover:bg-muted/50 relative flex cursor-pointer items-center gap-3 rounded-lg border p-2 transition-colors"
                    >
                      {/* Color accent bar */}

                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        onCheckedChange={() => toggleSubcategory(item.id)}
                        className="ml-2 shrink-0"
                      />

                      {/* Icon badge */}
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: hexToRgba(colorCode, 0.15) }}
                      >
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt=""
                            className="h-4 w-4 object-contain"
                            style={{ filter: checked ? 'none' : 'grayscale(60%) opacity(0.7)' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: colorCode }}
                          />
                        )}
                      </span>

                      {/* Name */}
                      <span className="truncate text-sm font-medium">{itemName}</span>

                      {/* Active indicator dot */}
                      {/* {checked && (
                        <span
                          aria-hidden="true"
                          className="ml-auto h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: colorCode }}
                        />
                      )} */}
                    </label>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-45 text-sm">
                    {itemName}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
