import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Maping_color, getMapColorById, getNameKeyById } from '@/features/map/constant/mapColor';

/**
 * @param {{ categories?: Array<{id: number|string, label: string, color?: string}>, compact?: boolean, className?: string }} props
 */
export default function MapCategoryOverlay({ categories = [], compact, className }) {
  const { t } = useTranslation();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={className || ''}>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const displayColor = cat.color || getMapColorById(cat.id);
          const labelKey = cat.labelKey || getNameKeyById(cat.id);
          const label =
            cat.label ||
            (labelKey ? t(labelKey, { defaultValue: cat.name || '' }) : cat.name || '');
          return (
            <Badge
              key={cat.id}
              variant="outline"
              className={`bg-background max-h-content flex items-center gap-1 rounded-2xl whitespace-nowrap shadow-sm ${
                compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2'
              }`}
              style={{
                borderColor: displayColor || undefined,
                color: displayColor || undefined,
              }}
            >
              {displayColor && (
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: displayColor }} />
              )}
              {label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
