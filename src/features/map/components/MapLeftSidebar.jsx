import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import { useSidebarStore } from '@/features/map/store/useSidebarStore';
import DataLayer from '@/features/map/components/sidebar/DataLayer';
import {
  componentMapSideBar,
  currentHeaderSidebar,
  headerSidebar,
} from '../constant/sidebarConstant';

/**
 * MapLeftSidebar — primary full-height sidebar for map filters and lists.
 * Layout: collapsible vertical icon-tab strip on the left + content panel on the right.
 * Default state: expanded (labels visible).
 */
export default function MapLeftSidebar() {
  const { t } = useTranslation();
  const categoriesStoreName = useCategoriesStore((state) => state.categoriesStoreName);
  const categoriesStoreID = useCategoriesStore((state) => state.categoriesStoreID);
  const isExpanded = useSidebarStore((state) => state.isLeftExpanded);
  const toggleLeftExpanded = useSidebarStore((state) => state.toggleLeftExpanded);
  const [activeSidebar, setActiveSidebar] = useState(currentHeaderSidebar);

  const activeSidebarContent = useMemo(() => {
    if (activeSidebar === 'layerData') {
      return <DataLayer categoryId={categoriesStoreID} />;
    }

    return componentMapSideBar[activeSidebar] ?? componentMapSideBar[currentHeaderSidebar];
  }, [activeSidebar, categoriesStoreID]);
  const collapsedSidebarTitle = categoriesStoreName
    ? categoriesStoreName
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
    : 'M';

  return (
    <aside className="absolute inset-y-0 left-0 z-40 hidden p-2 lg:block lg:w-[31%] xl:w-[26%] 2xl:w-[24%]">
      <div className="bg-card/90 border-border flex h-full flex-row rounded-xl border shadow-lg backdrop-blur-md">
        {/* Vertical icon-tab strip */}
        <div
          className={cn(
            'border-border flex shrink-0 flex-col items-center overflow-hidden border-r py-3 transition-[width] duration-200 ease-in-out',
            isExpanded ? 'w-40' : 'w-14'
          )}
        >
          {/* Title area */}
          <div
            className={cn(
              'mb-1 flex h-8 w-full items-center px-2',
              isExpanded ? '' : 'justify-center'
            )}
          >
            {isExpanded ? (
              <span className="text-primary truncate text-xs font-bold tracking-widest select-none">
                {categoriesStoreName}
              </span>
            ) : (
              <span className="text-primary text-xs font-bold tracking-widest select-none">
                {collapsedSidebarTitle}
              </span>
            )}
          </div>

          <Separator className="mx-auto mb-2 w-8" />

          {/* Tab buttons */}
          <TooltipProvider delayDuration={300}>
            <div className="flex w-full flex-1 flex-col gap-1 overflow-y-auto px-2">
              {headerSidebar.map((item) => {
                const Icon = item.icon;
                const isActive = item.value === activeSidebar;
                const label = t(item.label, { defaultValue: item.value });

                const btn = (
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'rounded-lg',
                      isExpanded ? 'h-9 w-full justify-start gap-2 px-3' : 'h-9 w-9',
                      isActive && 'shadow-sm'
                    )}
                    onClick={() => setActiveSidebar(item.value)}
                  >
                    <Icon size={16} />
                    {isExpanded && <span className="truncate text-xs">{label}</span>}
                  </Button>
                );

                return isExpanded ? (
                  <div key={item.value}>{btn}</div>
                ) : (
                  <Tooltip key={item.value}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent side="right">{label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>

          {/* Expand / collapse button — pinned to bottom of strip */}
          <div className="mt-auto w-full px-2 pt-2">
            <Tooltip>
              <TooltipProvider>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 rounded-lg', isExpanded ? 'w-full' : 'w-9')}
                    onClick={toggleLeftExpanded}
                    aria-label={
                      isExpanded
                        ? t('mapPage.layout.collapseSidebar')
                        : t('mapPage.layout.expandSidebar')
                    }
                  >
                    {isExpanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isExpanded
                    ? t('mapPage.layout.collapseSidebar')
                    : t('mapPage.layout.expandSidebar')}
                </TooltipContent>
              </TooltipProvider>
            </Tooltip>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {typeof activeSidebarContent === 'string' ? (
              <div className="text-muted-foreground flex min-h-40 items-center justify-center rounded-lg border border-dashed text-center text-sm font-medium">
                {activeSidebarContent}
              </div>
            ) : (
              activeSidebarContent
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
