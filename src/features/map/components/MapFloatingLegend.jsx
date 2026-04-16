import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * MapFloatingLegend — compact legend panel floating on top of map.
 */
export default function MapFloatingLegend({ className }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('mapPage.layout.floatLegend')} className={cn('h-auto', className)}>
      <Card className="bg-popover/95 border-border gap-3 py-3 shadow-xl backdrop-blur">
        <CardHeader className="px-3 pb-0">
          <CardTitle className="truncate text-sm font-bold">
            {t('mapPage.layout.floatLegend')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pt-0">
          <p className="text-xs font-normal">{t('mapPage.layout.legendPrimary')}</p>
          <p className="text-muted-foreground text-xs font-normal">
            {t('mapPage.layout.legendSecondary')}
          </p>
          <p className="text-muted-foreground text-xs font-normal">
            {t('mapPage.layout.legendCurrent')}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
