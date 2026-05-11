import { useTranslation } from 'react-i18next';
import { getMapColorById } from '@/features/map/constant/mapColor';

/**
 * @param {{ categoriesStoreID?: number|null, categoriesStoreName?: string|null, categoryColor?: string|object|null, compact?: boolean, className?: string }} props
 */
export default function MapNameOverlay({
  categoriesStoreID,
  categoriesStoreName,
  categoryColor,
  className,
}) {
  const { t } = useTranslation();

  if (!categoriesStoreName || !categoriesStoreID) {
    return null;
  }

  const normalizedColor =
    typeof categoryColor === 'string'
      ? categoryColor
      : categoryColor && typeof categoryColor === 'object'
        ? categoryColor.color || categoryColor.hex || categoryColor.value || null
        : null;

  const fallbackColor = getMapColorById(categoriesStoreID);

  const borderColor = normalizedColor || fallbackColor;

  return (
    <div className={className}>
      <div
        className="bg-background/95 border-border/60 rounded-lg border px-4 py-2.5 shadow-sm backdrop-blur-sm"
        style={{
          borderColor: borderColor || undefined,
          borderWidth: borderColor ? '2px' : undefined,
        }}
      >
        <p className="font-base typo-overline text-foreground flex flex-wrap items-center gap-1">
          <span>{t('common.map', { defaultValue: 'Map' })}</span>
          <span>{categoriesStoreName}</span>
          <span>{t('tourismPointPage.ninh_binh', { defaultValue: 'Ninh Binh' })}</span>
        </p>
      </div>
    </div>
  );
}
