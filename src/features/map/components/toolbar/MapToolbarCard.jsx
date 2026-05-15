import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowUpRight,
  Bike,
  Car,
  Layers,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  PersonStanding,
  Radius,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import LoadingInline from '@/components/common/LoadingInline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchDataPointByName } from '@/features/map/api/mapDataLayerService';
import { useDirectionsStore } from '@/features/map/store/useDirectionsStore';
import { useLanguageStore } from '@/stores/useLanguageStore.js';

function normalizeSuggestionFromPoint(item, index = 0, t) {
  const properties = item?.properties || {};
  const geometry = item?.geometry_data || item?.geometry || item?.geojson;
  const coordinates =
    geometry?.type === 'Point' && Array.isArray(geometry?.coordinates)
      ? geometry.coordinates
      : Array.isArray(item?.coordinates)
        ? item.coordinates
        : null;

  const lng = Number(coordinates?.[0] ?? item?.longitude);
  const lat = Number(coordinates?.[1] ?? item?.latitude);

  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    return null;
  }

  const unknownName = t
    ? t('mapPage.destination.unknownName', { defaultValue: 'Unknown destination' })
    : 'Unknown destination';

  return {
    id: item?.id ?? properties?.id ?? `point-suggestion-${index}`,
    placeName:
      item?.name_vi ||
      item?.name_en ||
      item?.name ||
      properties?.name_vi ||
      properties?.name_en ||
      properties?.name ||
      unknownName,
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

function normalizeSuggestionFromMapbox(item, index = 0) {
  const lng = Number(item?.coordinates?.[0]);
  const lat = Number(item?.coordinates?.[1]);

  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    return null;
  }

  return {
    id: item?.id ?? `mapbox-suggestion-${index}`,
    placeName: item?.placeName || item?.text || '',
    address: item?.address || '',
    lat,
    lng,
  };
}

function getSuggestionKey(suggestion) {
  const name = String(suggestion?.placeName || '')
    .trim()
    .toLowerCase();
  const lat = Number(suggestion?.lat);
  const lng = Number(suggestion?.lng);
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

  if (hasCoordinates) {
    return `${lat.toFixed(6)}:${lng.toFixed(6)}`;
  }

  return name;
}

const RADIUS_OPTIONS = [0, 3, 5, 10, 20, 50];
const SUGGESTIONS_LIMIT = 5;

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
  radiusKm,
  onRadiusChange,
}) {
  const { t } = useTranslation();
  const lang = useLanguageStore((state) => state.lang);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
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
  const [isLocatingStart, setIsLocatingStart] = useState(false);
  const [debouncedStartLocation] = useDebounce(startLocationInput.placeName, 350);
  const [debouncedEndLocation] = useDebounce(endLocationInput.placeName, 350);

  const startInputRef = useRef(null);

  const {
    directions,
    vehicle,
    startLocation,
    endLocation,
    shouldFocusStart,
    getDirections,
    getDirectionsByLocationStrings,
    getLocationSuggestions,
    clearAllStateDirections,
    clearDirections,
    setVehicle,
    setStartLocation,
    setEndLocation,
    clearFocusStart,
  } = useDirectionsStore();

  const canCalculateRoute = Boolean(
    startLocationInput.placeName?.trim() && endLocationInput.placeName?.trim()
  );
  const hasDirections = Boolean(directions);
  const calculateRouteTooltip = canCalculateRoute
    ? t('mapPage.direction.calculateReadyHint', {
        defaultValue: 'Click to calculate directions.',
      })
    : t('mapPage.direction.calculateDisabledHint', {
        defaultValue: 'Enter both start point and destination to calculate directions.',
      });
  const clearRouteTooltip = hasDirections
    ? t('mapPage.direction.clearReadyHint', {
        defaultValue: 'Clear the current route from the map.',
      })
    : t('mapPage.direction.clearDisabledHint', {
        defaultValue: 'No route available to clear yet.',
      });

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

  useEffect(() => {
    if (!shouldFocusStart) return;
    startInputRef.current?.focus();
    clearFocusStart();
  }, [shouldFocusStart, clearFocusStart]);

  const travelModes = useMemo(
    () => [
      {
        id: 'driving',
        icon: Car,
        label: `🚗 ${t('mapPage.direction.driving', { defaultValue: 'Driving' })}`,
      },
      {
        id: 'walking',
        icon: PersonStanding,
        label: `🚶 ${t('mapPage.direction.walking', { defaultValue: 'Walking' })}`,
      },
      {
        id: 'cycling',
        icon: Bike,
        label: `🚲 ${t('mapPage.direction.cycling', { defaultValue: 'Cycling' })}`,
      },
    ],
    [t]
  );

  const handleSelectResult = (item) => {
    if (!item) return;
    onSelectSearchResult?.(item);
    setIsInputFocused(false);
  };

  useEffect(() => {
    if (!showStartSuggestions) return;

    const value = debouncedStartLocation.trim();
    if (value.length < 2) {
      setStartSuggestions([]);
      setIsSearchingStart(false);
      return;
    }

    let isActive = true;
    setIsSearchingStart(true);

    (async () => {
      try {
        const [systemPayload, mapboxSuggestions] = await Promise.all([
          searchDataPointByName({
            search: value,
            lang,
            page: 1,
            limit: SUGGESTIONS_LIMIT,
          }).catch(() => null),
          getLocationSuggestions(value, {
            language: lang,
            limit: SUGGESTIONS_LIMIT,
          }).catch(() => []),
        ]);

        if (!isActive) return;

        const root = systemPayload?.data || systemPayload;
        const systemList =
          root?.points || root?.spots || root?.features || root?.data?.points || root?.data || [];
        const systemSuggestions = (Array.isArray(systemList) ? systemList : [])
          .map((item, index) => normalizeSuggestionFromPoint(item, index, t))
          .filter(Boolean)
          .slice(0, SUGGESTIONS_LIMIT);

        const usedKeys = new Set(systemSuggestions.map((item) => getSuggestionKey(item)));
        const mapboxNormalized = (Array.isArray(mapboxSuggestions) ? mapboxSuggestions : [])
          .map((item, index) => normalizeSuggestionFromMapbox(item, index))
          .filter(Boolean)
          .filter((item) => {
            const key = getSuggestionKey(item);
            if (usedKeys.has(key)) {
              return false;
            }
            usedKeys.add(key);
            return true;
          });

        const normalized = [...systemSuggestions, ...mapboxNormalized].slice(0, SUGGESTIONS_LIMIT);

        setStartSuggestions(normalized);
      } catch (_error) {
        if (isActive) {
          setStartSuggestions([]);
        }
      } finally {
        if (isActive) {
          setIsSearchingStart(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [debouncedStartLocation, getLocationSuggestions, lang, showStartSuggestions, t]);

  useEffect(() => {
    if (!showEndSuggestions) return;

    const value = debouncedEndLocation.trim();
    if (value.length < 2) {
      setEndSuggestions([]);
      setIsSearchingEnd(false);
      return;
    }

    let isActive = true;
    setIsSearchingEnd(true);

    (async () => {
      try {
        const payload = await searchDataPointByName({
          search: value,
          lang,
          page: 1,
          limit: SUGGESTIONS_LIMIT,
        });

        if (!isActive) return;

        const root = payload?.data || payload;
        const list =
          root?.points || root?.spots || root?.features || root?.data?.points || root?.data || [];

        const normalized = (Array.isArray(list) ? list : [])
          .map((item, index) => normalizeSuggestionFromPoint(item, index, t))
          .filter(Boolean);

        setEndSuggestions(normalized);
      } catch (_error) {
        if (isActive) {
          setEndSuggestions([]);
        }
      } finally {
        if (isActive) {
          setIsSearchingEnd(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [debouncedEndLocation, lang, showEndSuggestions, t]);

  const handleStartLocationChange = (value) => {
    setStartLocationInput({ placeName: value, lat: null, lng: null });
    setShowStartSuggestions(true);
  };

  const handleUseCurrentLocation = () => {
    if (isLocatingStart || !navigator.geolocation) {
      if (!navigator.geolocation) {
        toast.error(
          t('mapPage.toolbar.locationError', {
            defaultValue: 'Could not get your location. Please enable location access.',
          })
        );
      }
      return;
    }

    setIsLocatingStart(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          placeName: t('mapPage.direction.current_location', {
            defaultValue: 'My location',
          }),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        clearDirections();
        setStartLocationInput(location);
        setStartSuggestions([]);
        setShowStartSuggestions(false);
        setStartLocation(location);
        setIsLocatingStart(false);
      },
      () => {
        toast.error(
          t('mapPage.toolbar.locationError', {
            defaultValue: 'Could not get your location. Please enable location access.',
          })
        );
        setIsLocatingStart(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleDestinationSearch = (value) => {
    setEndLocationInput({ placeName: value, lat: null, lng: null });
    setShowEndSuggestions(true);
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

  const handleRadiusChange = async (value) => {
    const radius_km = Number(value);
    if (!Number.isFinite(radius_km)) {
      return;
    }

    if (radius_km === 0) {
      onRadiusChange?.({ radius_km: 0, lat: null, lng: null });
      return;
    }

    setIsGettingLocation(true);

    try {
      if (!navigator?.geolocation) {
        throw new Error('Geolocation API is not available in this browser/environment.');
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude: lat, longitude: lng } = position.coords;
      onRadiusChange?.({ radius_km, lat, lng });
    } catch {
      toast.error(
        t('mapPage.toolbar.locationError', {
          defaultValue: 'Could not get your location. Please enable location access.',
        })
      );
      onRadiusChange?.({ radius_km, lat: null, lng: null });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const shouldShowOverlay = isInputFocused && keyword.trim().length > 0;

  return (
    <Card className="border-border rounded-3xl shadow-sm">
      <CardContent>
        <div className="flex flex-col gap-2 xl:flex-row xl:items-stretch xl:gap-3">
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[2.6fr_1.8fr_1.8fr_2fr_2fr_1fr_1.4fr_1fr]">
              {/* Search */}
              <div className="relative w-full min-w-0 sm:col-span-2 xl:col-span-1">
                <Search className="text-quaternary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
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
                                className="text-muted-foreground truncate text-sm"
                                title={item.address}
                              >
                                {item.address ||
                                  t('mapPage.destination.noAddress', {
                                    defaultValue: 'No address',
                                  })}
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

              {/* Category Select */}
              <div className="relative w-full min-w-0">
                <Select
                  value={activeChip ?? ''}
                  onValueChange={(v) => {
                    const matched = filterChips.find((c) => String(c.value) === String(v));
                    onChipChange?.(v, matched?.label ?? '');
                  }}
                  startIcon={<Layers className="text-quaternary" />}
                >
                  <SelectTrigger size="toolbar" className="w-full">
                    <SelectValue
                      placeholder={t('mapPage.toolbar.category', { defaultValue: 'Category' })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filterChips.map((chip) => (
                      <SelectItem key={chip.value} value={chip.value} label={chip.label}>
                        {chip.value === 'all'
                          ? t('common.map_all', { defaultValue: 'All' })
                          : chip.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Radius Select */}
              <div className="relative w-full min-w-0">
                <Select
                  value={String(radiusKm ?? 0)}
                  onValueChange={handleRadiusChange}
                  disabled={isGettingLocation}
                  startIcon={<Radius className="text-tertiary" />}
                >
                  <SelectTrigger size="toolbar" className="w-full">
                    <SelectValue
                      placeholder={t('mapPage.toolbar.radius', { defaultValue: 'Radius' })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {RADIUS_OPTIONS.map((km) => (
                      <SelectItem key={km} value={String(km)}>
                        {km === 0
                          ? t('mapPage.toolbar.radiusAll', { defaultValue: 'All' })
                          : `${km} km`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative w-full min-w-0">
                <Navigation className="text-secondary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 fill-current" />
                <Input
                  ref={startInputRef}
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
                  className="pr-9 pl-9 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground absolute top-1/2 right-1.5 h-7 w-7 -translate-y-1/2"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleUseCurrentLocation}
                  title={t('mapPage.direction.current_location', {
                    defaultValue: 'My location',
                  })}
                  aria-label={t('mapPage.direction.current_location', {
                    defaultValue: 'My location',
                  })}
                >
                  {isLocatingStart ? (
                    <Loader2 className="text-primary h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LocateFixed className="text-primary h-3.5 w-3.5" />
                  )}
                </Button>
                {showStartSuggestions && startLocationInput.placeName.trim().length >= 2 && (
                  <div className="bg-popover absolute z-50 mt-1 w-full rounded-md border p-1 shadow-md">
                    {isSearchingStart ||
                    startLocationInput.placeName.trim() !== debouncedStartLocation.trim() ? (
                      <div className="flex items-center justify-center px-2 py-2">
                        <LoadingInline size="small" color="muted" />
                      </div>
                    ) : startSuggestions.length === 0 ? (
                      <div className="text-muted-foreground z-50 flex flex-col items-center gap-2 px-3 py-4 text-sm">
                        <MapPin className="h-4 w-4 opacity-70" />
                        <p>
                          {t('mapPage.toolbar.searchNoResult', {
                            defaultValue: 'No matching destination found for current filters.',
                          })}
                        </p>
                      </div>
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
                          <p className="truncate text-sm font-semibold">{suggestion.placeName}</p>
                          {suggestion.address ? (
                            <p className="text-muted-foreground truncate text-sm">
                              {suggestion.address}
                            </p>
                          ) : null}
                        </Button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative w-full min-w-0">
                <MapPin className="text-destructive pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
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
                  className="pl-9 text-sm"
                />
                {showEndSuggestions && endLocationInput.placeName.trim().length >= 2 && (
                  <div className="bg-popover absolute z-50 mt-1 w-full rounded-md border p-1 shadow-md">
                    {isSearchingEnd ||
                    endLocationInput.placeName.trim() !== debouncedEndLocation.trim() ? (
                      <div className="flex items-center justify-center px-2 py-2">
                        <LoadingInline size="small" color="muted" />
                      </div>
                    ) : endSuggestions.length === 0 ? (
                      <div className="text-muted-foreground z-50 flex flex-col items-center gap-2 px-3 py-4 text-sm">
                        <MapPin className="h-4 w-4 opacity-70" />
                        <p>
                          {t('mapPage.toolbar.searchNoResult', {
                            defaultValue: 'No matching destination found for current filters.',
                          })}
                        </p>
                      </div>
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
                          <p className="truncate text-sm font-semibold">{suggestion.placeName}</p>
                          {suggestion.address ? (
                            <p className="text-muted-foreground truncate text-sm">
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
                      // const ModeIcon = mode.icon;

                      return (
                        <SelectItem key={mode.id} value={mode.id}>
                          <span className="inline-flex items-center gap-2">
                            {/* <ModeIcon className="size-3.5" /> */}
                            <span>{mode.label}</span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-full min-w-0">
                    <Button
                      type="button"
                      variant={canCalculateRoute ? 'gradient_primary' : 'outline'}
                      disabled={!canCalculateRoute}
                      className="h-10 w-full min-w-0 gap-1.5 rounded-xl px-2.5 text-sm font-semibold"
                      onClick={handleCalculateRoute}
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span className="truncate">
                        {t('mapPage.direction.calculate', { defaultValue: 'Directions' })}
                      </span>
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-64 text-sm">
                  {calculateRouteTooltip}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-full min-w-0">
                    <Button
                      type="button"
                      variant={hasDirections ? 'gradient_destructive' : 'outline'}
                      disabled={!hasDirections}
                      className="h-10 w-full min-w-0 gap-1.5 rounded-xl px-2.5 text-sm font-semibold"
                      onClick={handleClearRoute}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="truncate">
                        {t('mapPage.direction.clear', { defaultValue: 'Clear route' })}
                      </span>
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-64 text-sm">
                  {clearRouteTooltip}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {weatherSlot ? (
            <div className="hidden min-w-0 xl:flex xl:w-[clamp(260px,30vw,440px)] xl:shrink-0">
              {weatherSlot}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          {weatherSlot ? <div className="w-full min-w-0 xl:hidden">{weatherSlot}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
