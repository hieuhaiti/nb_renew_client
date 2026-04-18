import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useSidebarStore } from '@/features/map/store/useSidebarStore';

/**
 * MapSubSidebar — secondary overlay panel that can slide in/out.
 */
export default function MapSubSidebar() {
  const { t } = useTranslation();
  const isOpen = useSidebarStore((state) => state.isSubSidebarOpen);
  const onToggle = useSidebarStore((state) => state.toggleSubSidebar);
  const sidebarPlacementClass =
    'inset-y-0 hidden lg:left-[31%] lg:block lg:w-[28%] xl:left-[26%] xl:w-[24%] 2xl:left-[24%] 2xl:w-[22%]';

  return (
    <>
      <div
        className={cn(
          'pointer-events-none absolute top-0 h-full p-2 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'z-50',
          sidebarPlacementClass
        )}
      >
        <div className="relative h-full">
          <Button
            aria-label={
              isOpen ? t('mapPage.layout.closeSubSidebar') : t('mapPage.layout.openSubSidebar')
            }
            variant="secondary"
            size="icon-sm"
            className="border-border pointer-events-auto absolute top-1/2 -right-4 -translate-y-1/2 rounded-full border shadow-md"
            onClick={onToggle}
          >
            {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </div>
      </div>

      <aside
        className={cn(
          'absolute top-0 h-full p-2 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'z-30',
          sidebarPlacementClass
        )}
      >
        <div className="bg-card/90 border-border flex h-full flex-col rounded-xl border shadow-lg backdrop-blur-md">
          <div className="flex shrink-0 items-center gap-2 px-4 py-3">
            <h1 className="text-foreground truncate text-base leading-tight font-semibold">
              {t('mapPage.layout.subSidebar')}
            </h1>
          </div>

          <Separator />
        </div>
      </aside>
    </>
  );
}
