import { useEffect, useMemo } from 'react';
import { Layers, AlertCircle, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { subCategoriesService } from '@/features/categories/api/subCategoriesService';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useDataLayerStore } from '@/features/map/store/useDataLayerStore';
import { withBaseUrl } from '@/lib/utils';

/** Hex color to rgba string for translucent backgrounds */
function hexToRgba(hex, alpha = 0.12) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(148,163,184,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function DataLayer({ categoryId }) {
  const { t } = useTranslation();
  const lang = useLanguageStore((state) => state.lang);

  const subcategories = useDataLayerStore((state) => state.subcategories);
  const selectedSubcategoryIds = useDataLayerStore((state) => state.selectedSubcategoryIds);
  const setSubcategories = useDataLayerStore((state) => state.setSubcategories);
  const toggleSubcategory = useDataLayerStore((state) => state.toggleSubcategory);
  const selectAllSubcategories = useDataLayerStore((state) => state.selectAllSubcategories);
  const clearSelectedSubcategories = useDataLayerStore((state) => state.clearSelectedSubcategories);

  const { data, isLoading, isFetching, isError } = subCategoriesService({
    lang,
    category_id: categoryId || undefined,
  });

  const apiSubcategories = useMemo(() => {
    if (Array.isArray(data?.data?.subcategories)) return data.data.subcategories;
    if (Array.isArray(data?.subcategories)) return data.subcategories;
    return [];
  }, [data]);

  useEffect(() => {
    if (!categoryId) {
      setSubcategories({ categoryId: null, subcategories: [] });
      return;
    }
    if (!data) return;
    setSubcategories({ categoryId, subcategories: apiSubcategories });
  }, [categoryId, data, apiSubcategories, setSubcategories]);

  if (!categoryId) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center text-sm">
        <Layers size={28} className="text-muted-foreground/50" />
        <span>{t('mapPage.layerData.selectCategory', { defaultValue: 'Vui lòng chọn danh mục để tải lớp dữ liệu.' })}</span>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted/40 h-14 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive flex items-center gap-2 rounded-xl border border-dashed p-4 text-sm">
        <AlertCircle size={16} className="shrink-0" />
        <span>{t('mapPage.layerData.error', { defaultValue: 'Không thể tải lớp dữ liệu.' })}</span>
      </div>
    );
  }

  const allSelected = selectedSubcategoryIds.length === subcategories.length && subcategories.length > 0;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full min-h-0 flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-foreground text-sm font-semibold">
            {t('mapPage.layerData.title', { defaultValue: 'Lớp dữ liệu' })}
          </h2>
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
            {selectedSubcategoryIds.length}/{subcategories.length}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={allSelected ? 'default' : 'outline'}
            className="h-7 text-xs"
            onClick={selectAllSubcategories}
          >
            {t('mapPage.layerData.selectAll', { defaultValue: 'Chọn tất cả' })}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
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
            <span>{t('mapPage.layerData.empty', { defaultValue: 'Không có lớp dữ liệu phù hợp.' })}</span>
          </div>
        ) : (
          <div className="min-h-0 space-y-1.5 overflow-y-auto pr-0.5">
            {subcategories.map((item) => {
              const checked = selectedSubcategoryIds.includes(item.id);
              const colorCode = item.color_code || '#94a3b8';
              const iconUrl = withBaseUrl(item.icon_url);
              const checkboxId = `map-layer-subcategory-${item.id}`;

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <label
                      htmlFor={checkboxId}
                      className="group hover:bg-muted/50 relative flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
                      style={checked ? { borderColor: colorCode, backgroundColor: hexToRgba(colorCode, 0.08) } : {}}
                    >
                      {/* Color accent bar */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-all"
                        style={{ backgroundColor: checked ? colorCode : 'transparent' }}
                      />

                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        onCheckedChange={() => toggleSubcategory(item.id)}
                        className="ml-2 shrink-0"
                      />

                      {/* Icon badge */}
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: hexToRgba(colorCode, 0.15) }}
                      >
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt=""
                            className="h-5 w-5 object-contain"
                            style={{ filter: checked ? 'none' : 'grayscale(60%) opacity(0.7)' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: colorCode }}
                          />
                        )}
                      </span>

                      {/* Name */}
                      <span className="truncate text-sm font-medium">{item.name}</span>

                      {/* Active indicator dot */}
                      {checked && (
                        <span
                          aria-hidden="true"
                          className="ml-auto h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: colorCode }}
                        />
                      )}
                    </label>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-45 text-xs">
                    {item.name}
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