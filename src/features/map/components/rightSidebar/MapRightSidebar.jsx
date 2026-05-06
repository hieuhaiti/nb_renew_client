import { createElement, isValidElement } from 'react';
import { useTranslation } from 'react-i18next';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { currentHeaderSidebar, headerSidebar } from '@/features/map/constant/sidebarConstant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAuthStore from '@/stores/useAuthStore';

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
    <Card className="border-border flex h-full min-h-0 flex-col rounded-2xl shadow-sm">
      <CardHeader className="px-3 pb-0">
        <CardTitle className="text-sm font-bold">
          <TabsList
            variant="line"
            className="h-auto w-full flex-wrap items-center justify-start gap-1 rounded-none border-b bg-transparent p-0 pb-1"
          >
            {visibleSidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebarTab === item.value;

              return (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  activeTab={activeSidebarTab}
                  setActiveTab={onTabChange}
                  className={cn(
                    'h-8 gap-1 rounded-none border-b-2 bg-transparent px-2 text-xs whitespace-nowrap shadow-none',
                    isActive
                      ? 'border-primary text-foreground'
                      : 'text-muted-foreground border-transparent'
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span className="truncate">{t(item.label, { defaultValue: item.value })}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto px-3 pt-1">
        {renderSidebarContent()}
      </CardContent>
    </Card>
  );
}
