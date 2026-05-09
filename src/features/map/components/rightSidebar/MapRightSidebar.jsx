import { createElement, isValidElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { currentHeaderSidebar, headerSidebar } from '@/features/map/constant/sidebarConstant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAuthStore from '@/stores/useAuthStore.js';

export default function MapRightSidebar({
  activeSidebar,
  tab,
  onTabChange,
  destinations,
  selectedPlace,
  onSelectPlace,
  monitoringItems,
  tourSuggestions,
  satelliteCompare,
  onOpenRoute,
  onOpenVr,
  onOpenSuggestTab,
  categoriesStoreID,
  layerItems,
  layerState,
  onLayerToggle,
  basemapOptions,
  activeBasemap,
  onBasemapChange,
  hasDirectionDetails = false,
}) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const visibleSidebarItems = headerSidebar.filter(
    (item) => item.value !== 'direction' && (!item.authen || isAuthenticated)
  );
  const tabGridColumns = useMemo(() => {
    const count = visibleSidebarItems.length;
    if (count <= 1) return 1;
    if (count <= 4) return 2;
    return 3;
  }, [visibleSidebarItems.length]);
  const sidebarTabValues = visibleSidebarItems.map((item) => item.value);
  const defaultSidebarTab = sidebarTabValues.includes(currentHeaderSidebar)
    ? currentHeaderSidebar
    : sidebarTabValues[0];

  const activeSidebarTab = sidebarTabValues.includes(tab)
    ? tab
    : sidebarTabValues.includes(activeSidebar)
      ? activeSidebar
      : defaultSidebarTab;
  const activeSidebarConfig =
    visibleSidebarItems.find((item) => item.value === activeSidebarTab) ?? visibleSidebarItems[0];
  const sidebarRenderProps = {
    activeSidebar,
    tab: activeSidebarTab,
    destinations,
    selectedPlace,
    onSelectPlace,
    monitoringItems,
    tourSuggestions,
    satelliteCompare,
    onOpenRoute,
    onOpenVr,
    onOpenSuggestTab,
    categoriesStoreID,
    layerItems,
    layerState,
    onLayerToggle,
    basemapOptions,
    activeBasemap,
    onBasemapChange,
  };

  const renderSidebarContent = () => {
    const sidebarContent = activeSidebarConfig?.component;

    if (sidebarContent == null) return null;
    if (isValidElement(sidebarContent)) return sidebarContent;

    if (typeof sidebarContent === 'function') {
      return createElement(sidebarContent, sidebarRenderProps);
    }

    if (typeof sidebarContent === 'string' || typeof sidebarContent === 'number') {
      return (
        <p className="text-muted-foreground text-sm leading-5 font-normal">
          {t(sidebarContent, { defaultValue: String(sidebarContent) })}
        </p>
      );
    }

    return null;
  };

  if (!activeSidebarConfig) {
    return null;
  }

  return (
    <Card className="border-border flex h-full min-h-0 flex-col gap-2 rounded-2xl shadow-sm">
      <CardHeader className="px-3 pb-0">
        <CardTitle className="text-sm font-bold">
          <TooltipProvider delayDuration={200}>
            <TabsList
              className="bg-muted grid h-auto w-full items-stretch gap-1 rounded-xl p-1"
              style={{ gridTemplateColumns: `repeat(${tabGridColumns}, minmax(0, 1fr))` }}
            >
              {visibleSidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSidebarTab === item.value;
                const tabLabel = t(item.label, { defaultValue: item.value });

                return (
                  <Tooltip key={item.value}>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value={item.value}
                        activeTab={activeSidebarTab}
                        setActiveTab={onTabChange}
                        className={cn(
                          'h-8 w-full justify-center gap-1 rounded-lg border px-1.5 text-sm shadow-none transition-colors sm:px-2',
                          isActive
                            ? 'border-primary/60 bg-primary text-primary-foreground shadow-sm'
                            : 'border-border bg-card text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Icon className="size-3.5 shrink-0" />
                        <span className="hidden truncate sm:inline">{tabLabel}</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6} className="text-xs">
                      {tabLabel}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TabsList>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto px-3 pt-1">
        {renderSidebarContent()}
      </CardContent>
    </Card>
  );
}
