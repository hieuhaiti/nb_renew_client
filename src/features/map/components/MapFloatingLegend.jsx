import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * MapFloatingLegend — compact legend panel floating on top of map.
 */
export default function MapFloatingLegend({ className }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('mapPage.layout.floatLegend')} className={cn('h-auto', className)}>
      <Card className="bg-popover/95 border-border py-3 shadow-xl backdrop-blur">
        <CardHeader className="px-3 py-0">
          <CardTitle className="truncate text-sm font-bold">
            {t('mapPage.layout.floatLegend')}
          </CardTitle>
        </CardHeader>
      </Card>
    </section>
  );
}
