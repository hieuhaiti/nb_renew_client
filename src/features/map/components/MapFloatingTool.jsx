import { Layers3, LocateFixed, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TOOL_CONFIG = [
  {
    key: 'locate',
    icon: LocateFixed,
    labelKey: 'mapPage.layout.toolLocate',
  },
  {
    key: 'layer',
    icon: Layers3,
    labelKey: 'mapPage.layout.toolLayer',
  },
  {
    key: 'zoomIn',
    icon: Plus,
    labelKey: 'mapPage.layout.toolZoomIn',
  },
  {
    key: 'zoomOut',
    icon: Minus,
    labelKey: 'mapPage.layout.toolZoomOut',
  },
];

/**
 * MapFloatingTool — vertical quick actions overlay.
 */
export default function MapFloatingTool({ className }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('mapPage.layout.floatTool')} className={cn('h-auto', className)}>
      <Card className="bg-popover/95 border-border items-center gap-2 p-2 shadow-xl backdrop-blur">
        {TOOL_CONFIG.map((tool) => {
          const Icon = tool.icon;

          return (
            <Button
              key={tool.key}
              aria-label={t(tool.labelKey)}
              variant="outline"
              size="icon-sm"
              className="h-8 w-8"
              type="button"
            >
              <Icon />
            </Button>
          );
        })}
      </Card>
    </section>
  );
}
