import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import MapLayout from '@/features/map/layout/MapLayout';
import MapDirectionPanel from '@/features/map/components/MapPanel/MapDirectionPanel';
import MapTourPanel from '@/features/map/components/MapPanel/MapTourPanel';
import { categoriesService } from '@/services/api/categories/categoriesService';
import { env } from '@/config/env';
import {
  mapBasemapOptions,
  mapDestinations,
  mapLayerToggles,
  mapSatelliteCompareBlocks,
  mapTourSuggestions,
} from '@/features/map/constant/mapPageMockData';
import DataLayer from '@/features/map/components/leftSidebar/DataLayer';
import { currentHeaderSidebar } from '@/features/map/constant/sidebarConstant';
import MapToolbarCard from '@/features/map/components/toolbar/MapToolbarCard';
import MapWeatherCard from '@/features/map/components/MapWeatherCard';
import MapRightSidebar from '@/features/map/components/rightSidebar/MapRightSidebar';
import { useMapStore } from '@/features/map/store/useMapStore';
import { useMapStyleStore } from '@/features/map/store/useMapStyleStore';
import { useDataLayerStore } from '@/features/map/store/useDataLayerStore';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';
import { useTourismPointSettingStore } from '@/features/tourism-points/store/useTourismPointStore';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { useMapPanelStore } from '@/features/map/store/useMapPanelStore';
import {
  normalizeSpotsSearchResults,
  useSearchSpotsQuery,
} from '@/services/api/map/mapSearchService';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import MapBaseArea from '../components/MapBase';
import ModalMarker from '@/features/map/components/ModalMarker';
import ModalCarousel from '@/features/map/components/ModalCarousel';
import { useSpotDetailModalStore } from '@/features/map/store/useModalStore';
import { clearHighlightedRouteLayers } from '@/features/map/utils/MapHelper';

export default function MapPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const prefillHandledRef = useRef(false);
  const [activeSidebar, setActiveSidebar] = useState(currentHeaderSidebar);
  const [activeTab, setActiveTab] = useState(currentHeaderSidebar);
  const [selectedPlaceId, setSelectedPlaceId] = useState(mapDestinations[0]?.id ?? 0);
  const [keyword, setKeyword] = useState('');
  const [activeChip, setActiveChip] = useState('all');
  const [activeBasemap, setActiveBasemap] = useState('outdoor');
  const [pendingFlyCoordinates, setPendingFlyCoordinates] = useState(null);
  const [pendingSearchSelection, setPendingSearchSelection] = useState(null);
  const activePanel = useMapPanelStore((s) => s.activePanel);
  const isPanelOpen = useMapPanelStore((s) => s.isPanelOpen);
  const openDirectionPanel = useMapPanelStore((s) => s.openDirectionPanel);
  const setPanelOpen = useMapPanelStore((s) => s.setPanelOpen);
  const [layerState, setLayerState] = useState({
    destinations: true,
    services: true,
    weather: true,
    load: true,
    satellite: false,
  });

  const categoriesStoreID = useCategoriesStore((state) => state.categoriesStoreID);
  const setCategory = useCategoriesStore((state) => state.setCategory);
  const setCategoryID = useCategoriesStore((state) => state.setCategoryID);
  const lang = useLanguageStore((state) => state.lang);
  const setCurrentTourismPointSettings = useTourismPointSettingStore(
    (state) => state.setCurrentSettings
  );
  const openSpotModal = useSpotDetailModalStore((state) => state.openSpotModal);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapRefObj = useMapStore((state) => state.mapRefObj);
  const setHighlightedPoint = useMapStore((state) => state.setHighlightedPoint);
  const setHighlightedRoute = useMapStore((state) => state.setHighlightedRoute);
  const setShowOnlyHighlightedRoute = useMapStore((state) => state.setShowOnlyHighlightedRoute);
  const clearHighlightedRoute = useMapStore((state) => state.clearHighlightedRoute);
  const setMapStyle = useMapStyleStore((state) => state.setMapStyle);
  const directions = useDirectionsStore((state) => state.directions);
  const setEndLocation = useDirectionsStore((state) => state.setEndLocation);
  const clearDirections = useDirectionsStore((state) => state.clearDirections);
  const dataLayerCategoryId = useDataLayerStore((state) => state.categoryId);
  const dataLayerSubcategories = useDataLayerStore((state) => state.subcategories);
  const setSelectedSubcategoryIds = useDataLayerStore((state) => state.setSelectedSubcategoryIds);
  const { data: categoriesData } = categoriesService({ lang });
  const [debouncedKeyword] = useDebounce(keyword.trim(), 400);

  const {
    data: searchSpotsData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchSpotsQuery(
    {
      search: debouncedKeyword,
      page: 1,
      limit: 8,
      category_id: activeChip !== 'all' ? activeChip : undefined,
      status: 'active',
      sortBy: 'created_at',
      sortOrder: 'DESC',
    },
    {
      enabled: debouncedKeyword.length >= 2,
    }
  );

  const searchResults = useMemo(
    () => normalizeSpotsSearchResults(searchSpotsData),
    [searchSpotsData]
  );

  const categoryDropdown = useMemo(() => {
    const sourceItems = Array.isArray(categoriesData?.data?.tree)
      ? categoriesData.data.tree
      : Array.isArray(categoriesData?.data?.items)
        ? categoriesData.data.items
        : [];

    return sourceItems
      .filter((cat) => cat?.parent_id == null)
      .map((cat) => ({
        id: cat.id,
        code: cat.code,
        label: lang === 'en' ? cat.name_en || cat.name_vi : cat.name_vi || cat.name_en,
        raw: cat,
      }));
  }, [categoriesData, lang]);

  const categoryFilterChips = useMemo(
    () => [
      { value: 'all', label: t('common.all', { defaultValue: 'All' }) },
      ...categoryDropdown.map((cat) => ({ value: String(cat.id), label: cat.label })),
    ],
    [categoryDropdown, t]
  );

  const allCategoryIds = useMemo(
    () => categoryDropdown.map((item) => item.id).filter((id) => id != null),
    [categoryDropdown]
  );

  const selectedChipCategory = useMemo(() => {
    if (activeChip === 'all') return null;
    return categoryDropdown.find((cat) => String(cat.id) === String(activeChip)) || null;
  }, [activeChip, categoryDropdown]);

  const mapStyleById = {
    outdoor: env.mapboxStyle_Outdoor,
    street: env.mapboxStyle_Street,
    satellite: env.mapboxStyle_Satellite,
    satelliteStreet: env.mapboxStyle_Satellite_Street,
  };

  const selectedPlace =
    mapDestinations.find((item) => item.id === selectedPlaceId) ?? mapDestinations[0] ?? null;

  const monitoringItems = [
    {
      name: t('mapPage.layout.monitoringAreaTrangAn', { defaultValue: 'Trang An' }),
      load: mapDestinations[0]?.loadPercent ?? 62,
      badgeClass: 'bg-destructive/15 text-destructive',
    },
    {
      name: t('mapPage.layout.monitoringAreaHangMua', { defaultValue: 'Hang Mua' }),
      load: mapDestinations[1]?.loadPercent ?? 68,
      badgeClass: 'bg-warning-soft text-warning',
    },
    {
      name: t('mapPage.layout.monitoringAreaTamCoc', { defaultValue: 'Tam Coc' }),
      load: mapDestinations[2]?.loadPercent ?? 44,
      badgeClass: 'bg-secondary/15 text-secondary',
    },
  ];

  const filteredDestinations = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    const selectedChipTokens = selectedChipCategory
      ? [selectedChipCategory.slug, selectedChipCategory.label, selectedChipCategory.id]
          .filter((value) => value != null)
          .map((value) => String(value).toLowerCase())
      : [];

    return mapDestinations.filter((item) => {
      const destinationTokens = [item.category, item.label, item.slug]
        .filter((value) => value != null)
        .map((value) => String(value).toLowerCase());

      const matchesChip =
        activeChip === 'all'
          ? true
          : selectedChipTokens.some((token) => destinationTokens.includes(token));

      const haystack = `${item.name} ${item.description}`.toLowerCase();
      const matchesKeyword = !normalizedKeyword || haystack.includes(normalizedKeyword);
      return matchesChip && matchesKeyword;
    });
  }, [activeChip, keyword, selectedChipCategory]);

  const hasDirectionDetails = Boolean(directions?.legs?.[0]?.steps?.length || directions);

  useEffect(() => {
    const {
      activePanel: panel,
      clearPanel: clear,
      openDirectionPanel: open,
    } = useMapPanelStore.getState();
    if (!directions) {
      if (panel === 'direction') clear();
      return;
    }
    open();
  }, [directions]);

  useEffect(() => {
    if (hasDirectionDetails || activeTab !== 'direction') return;
    setActiveSidebar('event');
    setActiveTab('event');
  }, [activeTab, hasDirectionDetails]);

  const flyToPlace = (place) => {
    if (!place || !mapRef) return;
    mapRef.flyTo({
      center: place.coords,
      zoom: 12.5,
      speed: 0.8,
      essential: true,
    });
  };

  const handleSelectPlace = (placeId) => {
    const next = mapDestinations.find((item) => item.id === placeId);
    if (!next) return;
    setSelectedPlaceId(placeId);
    setHighlightedPoint({
      id: next.id,
      name: next.name,
      description: next.description,
      category_id: next.category || null,
      subcategory_id: null,
      coordinates: Array.isArray(next.coords) ? next.coords : null,
      source: 'mock',
      raw: next,
    });
    flyToPlace(next);
  };

  const handleSelectSearchResult = (result) => {
    if (!result) return;

    const normalizedCategoryId =
      result.category_id == null || result.category_id === ''
        ? null
        : Number.isNaN(Number(result.category_id))
          ? result.category_id
          : Number(result.category_id);
    const normalizedSubcategoryId =
      result.subcategory_id == null || result.subcategory_id === ''
        ? null
        : Number.isNaN(Number(result.subcategory_id))
          ? result.subcategory_id
          : Number(result.subcategory_id);

    setHighlightedPoint({
      id: result.id,
      slug: result.slug,
      name: result.name,
      description: result.description,
      category_id: normalizedCategoryId,
      subcategory_id: normalizedSubcategoryId,
      address: result.address,
      coordinates: result.coordinates,
      source: 'spots-search',
      raw: result.raw,
    });

    if (normalizedCategoryId != null) {
      const chipValue = String(normalizedCategoryId);
      setActiveChip(chipValue);
      setCategoryID(normalizedCategoryId);
      setCurrentTourismPointSettings({
        selectedCategory: normalizedCategoryId,
        selectedSubcategory: normalizedSubcategoryId ?? 0,
        page: 1,
      });
      setPendingSearchSelection({
        categoryId: normalizedCategoryId,
        subcategoryId: normalizedSubcategoryId,
      });
    } else {
      setPendingSearchSelection(null);
    }

    if (Array.isArray(result.coordinates) && result.coordinates.length >= 2 && mapRef) {
      mapRef.flyTo({
        center: result.coordinates,
        zoom: 14,
        speed: 0.85,
        essential: true,
      });
    } else if (Array.isArray(result.coordinates) && result.coordinates.length >= 2) {
      setPendingFlyCoordinates(result.coordinates);
    }

    if (result.id) {
      openSpotModal(result.id, result.slug ?? null);
    }
  };

  useEffect(() => {
    if (!pendingSearchSelection) return;

    const isCategoryMatched =
      String(dataLayerCategoryId ?? '') === String(pendingSearchSelection.categoryId ?? '');
    if (!isCategoryMatched) return;

    if (pendingSearchSelection.subcategoryId == null) {
      setPendingSearchSelection(null);
      return;
    }

    const matchedSubcategory = dataLayerSubcategories.find(
      (item) => String(item?.id) === String(pendingSearchSelection.subcategoryId)
    );
    if (!matchedSubcategory) return;

    setSelectedSubcategoryIds([matchedSubcategory.id]);
    setPendingSearchSelection(null);
  }, [
    dataLayerCategoryId,
    dataLayerSubcategories,
    pendingSearchSelection,
    setSelectedSubcategoryIds,
  ]);

  useEffect(() => {
    if (!mapRef || !Array.isArray(pendingFlyCoordinates) || pendingFlyCoordinates.length < 2)
      return;

    mapRef.flyTo({
      center: pendingFlyCoordinates,
      zoom: 14,
      speed: 0.85,
      essential: true,
    });
    setPendingFlyCoordinates(null);
  }, [mapRef, pendingFlyCoordinates]);

  useEffect(() => {
    if (prefillHandledRef.current) return;

    const prefillKeyword = location.state?.prefillKeyword?.trim?.() || '';
    const prefillResult = location.state?.selectedSearchResult;
    console.log(prefillResult);

    const prefillRoute = location.state?.highlightedRoute;
    if (!prefillKeyword && !prefillResult && !prefillRoute) return;

    prefillHandledRef.current = true;
    if (prefillKeyword) setKeyword(prefillKeyword);
    if (prefillRoute) {
      setHighlightedRoute(prefillRoute);
      setShowOnlyHighlightedRoute(Boolean(prefillRoute));
    }
    if (prefillResult) handleSelectSearchResult(prefillResult);
  }, [location.state]);

  const handleSearch = () => {
    if (searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0]);
      return;
    }

    if (filteredDestinations.length === 0) {
      toast.warn(
        t('mapPage.toolbar.searchNoResult', {
          defaultValue: 'No matching destination found for current filters.',
        })
      );
      return;
    }

    const first = filteredDestinations[0];
    setSelectedPlaceId(first.id);
    flyToPlace(first);
  };

  const handleChipChange = async (value) => {
    setActiveChip(value);

    if (value === 'all') {
      setCategoryID(null);
      setCurrentTourismPointSettings({
        selectedCategory: 0,
        selectedSubcategory: 0,
        page: 1,
      });
      return;
    }

    const matchedCategory = categoryDropdown.find((cat) => String(cat.id) === String(value));
    if (matchedCategory?.raw) {
      setCategory(matchedCategory.raw);
    }
    const normalizedCategoryId = Number.isNaN(Number(value)) ? value : Number(value);

    setCategoryID(normalizedCategoryId);
    setCurrentTourismPointSettings({
      selectedCategory: Number(normalizedCategoryId) || normalizedCategoryId,
      selectedSubcategory: 0,
      page: 1,
    });
  };

  function handleBasemapChange(basemapId) {
    const styleUrl = mapStyleById[basemapId];
    if (!styleUrl) {
      toast.warn(
        t('mapPage.toolbar.styleUnavailable', {
          defaultValue: 'Selected map style is not configured.',
        })
      );
      return;
    }

    setActiveBasemap(basemapId);
    setMapStyle(styleUrl);

    try {
      mapRef?.setStyle(styleUrl, { diff: true });
      const splitMap = mapRefObj?.current?.split;
      if (splitMap && splitMap !== mapRef) {
        splitMap.setStyle(styleUrl, { diff: true });
      }
    } catch (_error) {
      // Keep UI responsive when style is switching.
    }
  }
  const handleOpenRoute = (target) => {
    const coordinates = Array.isArray(target?.coordinates)
      ? target.coordinates
      : Array.isArray(target?.coords)
        ? target.coords
        : null;

    const lng = Number(coordinates?.[0]);
    const lat = Number(coordinates?.[1]);

    // Clear any active tour route from the map canvas before switching to direction panel.
    const resolvedMap = mapRef || mapRefObj?.current?.single || null;
    if (resolvedMap) {
      try {
        clearHighlightedRouteLayers(resolvedMap);
      } catch (_err) {}
    }
    clearHighlightedRoute();

    clearDirections();
    openDirectionPanel();

    if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
      setEndLocation({
        placeName: target?.name || target?.label || '',
        lat,
        lng,
      });
    }
  };

  const handleOpenVr = (target) => {
    const spotId = target?.id || target?.spot_id || null;
    navigate('/vr360', spotId ? { state: { spotId } } : undefined);
  };

  function handleLayerToggle(key, checked) {
    setLayerState((prev) => ({
      ...prev,
      [key]: checked,
    }));

    if (key === 'satellite' && checked) {
      setActiveSidebar('satellite');
      setActiveTab('tour');
    }
  }

  return (
    <MapLayout>
      <ModalMarker />
      <ModalCarousel />
      <section className="bg-background h-full overflow-hidden p-3">
        <div className="mx-auto grid h-full min-h-0 w-full max-w-437.5 grid-rows-[auto_1fr] gap-3">
          <MapToolbarCard
            keyword={keyword}
            onKeywordChange={setKeyword}
            searchResults={searchResults}
            isSearchLoading={isSearchLoading || isSearchFetching}
            onSelectSearchResult={handleSelectSearchResult}
            filterChips={categoryFilterChips}
            activeChip={activeChip}
            onChipChange={handleChipChange}
            onSearch={handleSearch}
          />

          <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[300px_minmax(0,1fr)_340px] 2xl:grid-cols-[320px_minmax(0,1fr)_380px]">
            <div className="flex h-full min-h-0 flex-col gap-3">
              <Card className="border-border min-h-0 flex-1 overflow-hidden rounded-2xl shadow-sm">
                <CardContent className="h-full min-h-0">
                  <DataLayer
                    categoryId={categoriesStoreID}
                    categoryIds={allCategoryIds}
                    showAllCategories={activeChip === 'all'}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="border-border relative h-full min-h-0 overflow-hidden rounded-3xl p-0 shadow-sm">
              {activePanel === 'direction' && (
                <MapDirectionPanel
                  isOpen={isPanelOpen}
                  onOpen={() => setPanelOpen(true)}
                  onClose={() => setPanelOpen(false)}
                />
              )}
              {activePanel === 'tour' && (
                <MapTourPanel
                  isOpen={isPanelOpen}
                  onOpen={() => setPanelOpen(true)}
                  onClose={() => setPanelOpen(false)}
                />
              )}
              <MapBaseArea />
              <div className="w-22vw pointer-events-none absolute top-3 right-3 z-40">
                <MapWeatherCard compact className="pointer-events-auto h-auto" />
              </div>
            </div>

            <div className="h-full min-h-0">
              <MapRightSidebar
                activeSidebar={activeSidebar}
                tab={activeTab}
                onTabChange={setActiveTab}
                destinations={mapDestinations}
                selectedPlace={selectedPlace}
                onSelectPlace={handleSelectPlace}
                monitoringItems={monitoringItems}
                tourSuggestions={mapTourSuggestions}
                satelliteCompare={mapSatelliteCompareBlocks}
                onOpenRoute={handleOpenRoute}
                onOpenVr={handleOpenVr}
                onOpenSuggestTab={() => setActiveTab('tour')}
                categoriesStoreID={categoriesStoreID}
                layerItems={mapLayerToggles}
                layerState={layerState}
                onLayerToggle={handleLayerToggle}
                basemapOptions={mapBasemapOptions}
                activeBasemap={activeBasemap}
                onBasemapChange={handleBasemapChange}
                hasDirectionDetails={hasDirectionDetails}
              />
            </div>
          </div>
        </div>
      </section>
    </MapLayout>
  );
}
