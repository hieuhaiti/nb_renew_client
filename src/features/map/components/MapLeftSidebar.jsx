import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * MapLeftSidebar — primary full-height sidebar for map filters and lists.
 */
export default function MapLeftSidebar({ className }) {
  const { t } = useTranslation();

  return (
    <aside className={cn('h-full', className)}>
      <Card className="bg-card/95 border-border h-full rounded-none border-y-0 border-l-0 py-0 shadow-xl backdrop-blur">
        <CardHeader className="border-border border-b py-4">
          <CardTitle className="truncate text-base font-bold">
            {t('mapPage.layout.leftSidebar')}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full p-4">
          <p className="text-muted-foreground line-clamp-3 text-sm font-normal">
            {t('mapPage.layout.leftSidebarHint')}
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
