import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bike,
  Car,
  MapPin,
  PersonStanding,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoadingInline from '@/components/common/LoadingInline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchDataPointByName } from '@/services/api/map/mapDataLayerService';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { useLanguageStore } from '@/stores/useLanguageStore';

function normalizeSuggestionFromPoint(item, index = 0) {
  const properties = item?.properties || {};
  const geometry = item?.geometry_data || item?.geometry;
  const coordinates =
    geometry?.type === 'Point' && Array.isArray(geometry?.coordinates)
      ? geometry.coordinates
      : Array.isArray(item?.coordinates)
        ? item.coordinates
        : null;

  const lng = Number(coordinates?.[0]);
  const lat = Number(coordinates?.[1]);

  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    return null;
  }

  return {
    id: item?.id ?? properties?.id ?? `point-suggestion-${index}`,
    placeName:
      item?.name_vi ||
      item?.name_en ||
      item?.name ||
      properties?.name_vi ||
      properties?.name_en ||
      properties?.name ||
      'Unknown destination',
    address:
      item?.address_vi ||
      item?.address_en ||
      item?.address ||
      properties?.address_vi ||
      properties?.address_en ||
      properties?.address ||
      '',
    lat,
    lng,
  };
}

export default function MapToolbarCard({
  keyword,
  onKeywordChange,
  searchResults = [],
  isSearchLoading = false,
  onSelectSearchResult,
  filterChips,
  activeChip,
  onChipChange,
  onSearch,
  weatherSlot,
}) {
  const { t } = useTranslation();
  const lang = useLanguageStore((state) => state.lang);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [startLocationInput, setStartLocationInput] = useState({
    placeName: '',
    lat: null,
    lng: null,
  });
  const [endLocationInput, setEndLocationInput] = useState({
    placeName: '',
    lat: null,
    lng: null,
  });
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [isSearchingEnd, setIsSearchingEnd] = useState(false);

  const {
    vehicle,
    startLocation,
    endLocation,
    getDirections,
    getDirectionsByLocationStrings,
    getLocationSuggestions,
    clearAllStateDirections,
    clearDirections,
    setVehicle,
    setStartLocation,
    setEndLocation,
  } = useDirectionsStore();

  useEffect(() => {
    if (!startLocation) return;

    setStartLocationInput({
      placeName: startLocation.placeName || '',
      lat: startLocation.lat,
      lng: startLocation.lng,
    });
  }, [startLocation]);

  useEffect(() => {
    if (!endLocation) return;

    setEndLocationInput({
      placeName: endLocation.placeName || '',
      lat: endLocation.lat,
      lng: endLocation.lng,
    });
  }, [endLocation]);

  const travelModes = useMemo(
    () => [
      {
        id: 'driving',
        icon: Car,
        label: t('mapPage.direction.driving', { defaultValue: 'Driving' }),
      },
      {
        id: 'walking',
        icon: PersonStanding,
        label: t('mapPage.direction.walking', { defaultValue: 'Walking' }),
      },
      {
        id: 'cycling',
        icon: Bike,
        label: t('mapPage.direction.cycling', { defaultValue: 'Cycling' }),
      },
    ],
    [t]
  );

  const handleSelectResult = (item) => {
    if (!item) return;
    onSelectSearchResult?.(item);
    setIsInputFocused(false);
  };

  const handleStartLocationChange = async (value) => {
    setStartLocationInput({ placeName: value, lat: null, lng: null });
    setShowStartSuggestions(true);

    if (!value || value.trim().length < 2) {
      setStartSuggestions([]);
      return;
    }

    setIsSearchingStart(true);

    try {
      const suggestions = await getLocationSuggestions(value, {
        language: lang,
        limit: 5,
      });

      const normalized = suggestions
        .map((item) => {
          const lng = Number(item?.coordinates?.[0]);
          const lat = Number(item?.coordinates?.[1]);

          if (Number.isNaN(lng) || Number.isNaN(lat)) return null;

          return {
            id: item.id,
            placeName: item.placeName,
            address: item.address,
            lat,
            lng,
          };
        })
        .filter(Boolean);

      setStartSuggestions(normalized);
    } catch (_error) {
      setStartSuggestions([]);
    } finally {
      setIsSearchingStart(false);
    }
  };

  const handleDestinationSearch = async (value) => {
    setEndLocationInput({ placeName: value, lat: null, lng: null });
    setShowEndSuggestions(true);

    if (!value || value.trim().length < 2) {
      setEndSuggestions([]);
      return;
    }

    setIsSearchingEnd(true);

    try {
      const payload = await searchDataPointByName({
        search: value,
        lang,
        page: 1,
        limit: 5,
      });

      const root = payload?.data || payload;
      const list =
        root?.points || root?.spots || root?.features || root?.data?.points || root?.data || [];

      const normalized = (Array.isArray(list) ? list : [])
        .map((item, index) => normalizeSuggestionFromPoint(item, index))
        .filter(Boolean);

      setEndSuggestions(normalized);
    } catch (_error) {
      setEndSuggestions([]);
    } finally {
      setIsSearchingEnd(false);
    }
  };

  const handleStartSuggestionClick = (suggestion) => {
    const location = {
      placeName: suggestion.placeName,
      lat: suggestion.lat,
      lng: suggestion.lng,
    };

    setStartLocationInput(location);
    setStartSuggestions([]);
    setShowStartSuggestions(false);
    setStartLocation(location);
  };

  const handleEndSuggestionClick = (suggestion) => {
    const location = {
      placeName: suggestion.placeName,
      lat: suggestion.lat,
      lng: suggestion.lng,
    };

    setEndLocationInput(location);
    setEndSuggestions([]);
    setShowEndSuggestions(false);
    setEndLocation(location);
  };

  const handleClearRoute = () => {
    setStartLocationInput({ placeName: '', lat: null, lng: null });
    setEndLocationInput({ placeName: '', lat: null, lng: null });
    setStartSuggestions([]);
    setEndSuggestions([]);
    setShowStartSuggestions(false);
    setShowEndSuggestions(false);
    clearAllStateDirections();
  };

  const handleCalculateRoute = async () => {
    if (!startLocationInput.placeName?.trim() || !endLocationInput.placeName?.trim()) {
      return;
    }

    clearDirections();

    const hasStartCoordinates =
      typeof startLocationInput.lat === 'number' && typeof startLocationInput.lng === 'number';
    const hasEndCoordinates =
      typeof endLocationInput.lat === 'number' && typeof endLocationInput.lng === 'number';

    if (hasStartCoordinates && hasEndCoordinates) {
      await getDirections(startLocationInput, endLocationInput, lang);
      return;
    }

    await getDirectionsByLocationStrings(startLocationInput, endLocationInput, lang);
  };

  const shouldShowOverlay = isInputFocused && keyword.trim().length > 0;

  return (
    <Card className="border-border rounded-3xl shadow-sm">
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-start">
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row xl:max-w-[40%] xl:basis-[40%]">
            <div className="relative min-w-0 flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                size="toolbar"
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsInputFocused(false);
                  }, 120);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onSearch();
                  }
                }}
                placeholder={t('mapPage.toolbar.searchPlaceholder', {
                  defaultValue: 'Search destination, service, food, event...',
                })}
                className="pr-9 pl-9"
              />

              {keyword ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-1/2 right-1.5 h-7 w-7 -translate-y-1/2"
                  onClick={() => onKeywordChange('')}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              ) : null}

              {shouldShowOverlay ? (
                <div className="bg-card border-border absolute top-full right-0 left-0 z-50 mt-2 max-h-72 overflow-auto rounded-xl border shadow-lg">
                  {isSearchLoading ? (
                    <div className="flex items-center justify-center px-3 py-6">
                      <LoadingInline size="small" />
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-muted-foreground flex flex-col items-center gap-2 px-3 py-6 text-sm">
                      <MapPin className="h-5 w-5 opacity-70" />
                      <p>
                        {t('mapPage.toolbar.searchNoResult', {
                          defaultValue: 'No matching destination found for current filters.',
                        })}
                      </p>
                    </div>
                  ) : (
                    <div className="p-1.5">
                      {searchResults.map((item) => (
                        <Button
                          key={item.id}
                          type="button"
                          variant="ghost"
                          className="h-auto w-full justify-start gap-3 rounded-lg px-2.5 py-2"
                          onClick={() => handleSelectResult(item)}
                        >
                          <MapPin className="text-primary h-4 w-4 shrink-0" />
                          <div className="min-w-0 flex-1 text-left">
                            <p
                              className="text-foreground truncate text-sm font-medium"
                              title={item.name}
                            >
                              {item.name}
                            </p>
                            <p
                              className="text-muted-foreground truncate text-xs"
                              title={item.address}
                            >
                              {item.address ||
                                t('mapPage.destination.noAddress', { defaultValue: 'No address' })}
                            </p>
                          </div>
                          <ArrowUpRight className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:max-w-[60%] xl:basis-[60%] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(88px,0.8fr)_minmax(84px,0.75fr)_minmax(84px,0.75fr)]">
            <div className="relative min-w-0">
              <Input
                size="toolbar"
                value={startLocationInput.placeName}
                onChange={(event) => handleStartLocationChange(event.target.value)}
                onFocus={() => setShowStartSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowStartSuggestions(false);
                  }, 120);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleCalculateRoute();
                  }
                }}
                placeholder={t('mapPage.direction.startPlaceholder', {
                  defaultValue: 'Enter start point',
                })}
                className="text-sm"
              />
              {showStartSuggestions && (startSuggestions.length > 0 || isSearchingStart) && (
                <div className="bg-popover absolute z-20 mt-1 w-full rounded-md border p-1 shadow-md">
                  {isSearchingStart ? (
                    <p className="text-muted-foreground px-2 py-1 text-xs">
                      {t('mapPage.direction.searching', { defaultValue: 'Searching...' })}
                    </p>
                  ) : (
                    startSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        type="button"
                        variant="ghost"
                        className="hover:bg-muted h-auto w-full rounded-sm px-2 py-1.5 text-left"
                        onClick={() => handleStartSuggestionClick(suggestion)}
                        title={suggestion.placeName}
                      >
                        <p className="truncate text-xs font-semibold">{suggestion.placeName}</p>
                        {suggestion.address ? (
                          <p className="text-muted-foreground truncate text-xs">
                            {suggestion.address}
                          </p>
                        ) : null}
                      </Button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="relative min-w-0">
              <Input
                size="toolbar"
                value={endLocationInput.placeName}
                onChange={(event) => handleDestinationSearch(event.target.value)}
                onFocus={() => setShowEndSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowEndSuggestions(false);
                  }, 120);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleCalculateRoute();
                  }
                }}
                placeholder={t('mapPage.direction.endPlaceholder', {
                  defaultValue: 'Enter destination',
                })}
                className="text-sm"
              />
              {showEndSuggestions && (endSuggestions.length > 0 || isSearchingEnd) && (
                <div className="bg-popover absolute z-20 mt-1 w-full rounded-md border p-1 shadow-md">
                  {isSearchingEnd ? (
                    <p className="text-muted-foreground px-2 py-1 text-xs">
                      {t('mapPage.direction.searching', { defaultValue: 'Searching...' })}
                    </p>
                  ) : (
                    endSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        type="button"
                        variant="ghost"
                        className="hover:bg-muted h-auto w-full rounded-sm px-2 py-1.5 text-left"
                        onClick={() => handleEndSuggestionClick(suggestion)}
                        title={suggestion.placeName}
                      >
                        <p className="truncate text-xs font-semibold">{suggestion.placeName}</p>
                        {suggestion.address ? (
                          <p className="text-muted-foreground truncate text-xs">
                            {suggestion.address}
                          </p>
                        ) : null}
                      </Button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="w-full min-w-0">
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger size="toolbar" className="w-full">
                  <SelectValue
                    placeholder={t('mapPage.direction.transportType', {
                      defaultValue: 'Transport',
                    })}
                  />
                </SelectTrigger>
                <SelectContent>
                  {travelModes.map((mode) => {
                    const ModeIcon = mode.icon;

                    return (
                      <SelectItem key={mode.id} value={mode.id}>
                        <span className="inline-flex items-center gap-2">
                          <ModeIcon className="size-3.5" />
                          <span>{mode.label}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              className="h-10 min-w-0 gap-1.5 rounded-xl px-2.5 text-xs"
              onClick={handleCalculateRoute}
            >
              <Search className="h-3.5 w-3.5" />
              <span className="truncate">
                {t('mapPage.direction.calculate', { defaultValue: 'Directions' })}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-10 min-w-0 gap-1.5 rounded-xl px-2.5 text-xs"
              onClick={handleClearRoute}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="truncate">
                {t('mapPage.direction.clear', { defaultValue: 'Clear route' })}
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3 xl:flex-1">
            <span className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-xs font-medium">
              <SlidersHorizontal size={13} />
              {t('mapPage.toolbar.filter', { defaultValue: 'Filter' })}
            </span>
            <div className="flex flex-wrap gap-2">
              {filterChips.map((chip) => (
                <Button
                  key={chip.value}
                  size="sm"
                  variant={activeChip === chip.value ? 'default' : 'outline'}
                  className="rounded-full"
                  onClick={() => onChipChange(chip.value)}
                >
                  {chip.value === 'all' ? t('common.all', { defaultValue: 'All' }) : chip.label}
                </Button>
              ))}
            </div>
          </div>
          {weatherSlot ? (
            <div className="w-full max-w-full min-w-0 xl:ml-3 xl:w-[clamp(150px,25vw,350px)] xl:shrink-0">
              {weatherSlot}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
