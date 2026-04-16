import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * MapSubSidebar — secondary overlay panel that can slide in/out.
 */
export default function MapSubSidebar({ isOpen, onToggle, className }) {
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        'absolute top-0 h-full transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}
    >
      <Card className="bg-popover/95 border-border h-full rounded-none border-y-0 border-l-0 py-0 shadow-2xl backdrop-blur">
        <Button
          aria-label={
            isOpen ? t('mapPage.layout.closeSubSidebar') : t('mapPage.layout.openSubSidebar')
          }
          variant="secondary"
          size="icon-sm"
          className="border-border absolute top-1/2 -right-4 z-10 -translate-y-1/2 rounded-full border shadow-md"
          onClick={onToggle}
        >
          {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>

        <CardHeader className="border-border border-b py-4">
          <CardTitle className="truncate text-base font-bold">
            {t('mapPage.layout.subSidebar')}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full p-4">
          <p className="text-muted-foreground line-clamp-3 text-sm font-normal">
            {t('mapPage.layout.subSidebarHint')}
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
