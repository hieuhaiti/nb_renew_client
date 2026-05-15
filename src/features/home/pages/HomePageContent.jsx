import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Droplets,
  Compass,
  FileText,
  MapPin,
  MapPinned,
  Search,
  Sparkles,
  Sun,
  Wind,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RootLayout from '@/components/layout/RootLayout';
import LoadingInline from '@/components/common/LoadingInline';
import placeholderImg from '@/assets/images/placeholder.png';
import {
  defaultLatLong,
  formatFestivalDateRange,
  normalizeFestivalListPayload,
  normalizeSpotsSearchResults,
  useFestivalsQuery,
  useSearchSpotsQuery,
} from '@/features/map';
import { formatVND, getLocaleFromLanguage, withBaseUrl } from '@/lib/utils';
import {
  formatHumidity,
  formatTemperature,
  formatWindSpeedKph,
  getAqiLevelMeta,
  useWeatherOverview,
} from '@/features/weather';
import { useLanguageStore } from '@/stores/useLanguageStore.js';
import { getHomeData } from '@/features/home/data/homeData';
import { useGetFeaturedSpots } from '@/services/api/tourism-points/tourismPointsApi';
import { useGetNewsList } from '@/services/api/news/newsService';
import { useGetOcopProducts } from '@/services/api/ocop/ocopService';
import { useGetAllTours } from '@/services/api/tours/tourApi';
import { useGetNearbyVouchers } from '@/services/api/businesses/businessService';

function formatNewsDate(dateStr, locale) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '--';
  return new Intl.DateTimeFormat(locale || 'vi-VN', { dateStyle: 'medium' }).format(d);
}

function formatVoucherDiscount(voucher) {
  const value = parseFloat(voucher.discount_value || 0);
  if (voucher.discount_type === 'percentage') return `-${Math.round(value)}%`;
  if (voucher.discount_type === 'fixed_amount') return `-${formatVND(value)}`;
  return '';
}

function SectionLabel({ children, color }) {
  return (
    <p
      className="mb-1 text-sm 2xl:text-base font-bold tracking-widest uppercase"
      style={{ color: color || 'var(--primary)' }}
    >
      {children}
    </p>
  );
}

export default function HomePageContent() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);
  const locale = getLocaleFromLanguage(i18n.language);

  const container = 'mx-auto w-full max-w-[1320px] px-4 sm:px-6';
  const card =
    'rounded-[24px] border border-[#a9c0de] bg-card shadow-[0_18px_42px_rgba(13,74,130,0.14)]';

  const homeData = useMemo(() => getHomeData(lang), [lang]);
  const {
    FEATURED_DESTINATIONS,
    FOOD_BULLETS,
    FOOD_TAGS,
    HERO_EVENTS,
    HERO_STATS,
    ITINERARY_ITEMS,
    PROMO_BANNER,
    QUICK_LINKS,
    VLOG_STORIES,
  } = homeData;

  const [keyword, setKeyword] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedKeyword] = useDebounce(keyword.trim(), 350);

  const {
    data: weatherOverview,
    isLoading: isWeatherLoading,
    isError: isWeatherError,
    isConfigured,
  } = useWeatherOverview({ lat: defaultLatLong.lat, lng: defaultLatLong.lng, lang });

  const weather = weatherOverview?.weather;
  const aqiMeta = getAqiLevelMeta(weatherOverview?.aqiValue);
  const weatherDescription = weather?.weather?.[0]?.description;

  const { data: festivalsData } = useFestivalsQuery({
    page: 1,
    limit: 4,
    upcoming: true,
    sortBy: 'start_date',
    sortOrder: 'ASC',
  });

  const upcomingFestivals = useMemo(
    () => normalizeFestivalListPayload(festivalsData, { lang }).slice(0, 3),
    [festivalsData, lang]
  );

  const heroEvents = useMemo(() => {
    if (upcomingFestivals.length === 0) return HERO_EVENTS;
    return upcomingFestivals.map((f) => ({
      title: f.name,
      time: formatFestivalDateRange(f.start_date, f.end_date, locale),
      point: {
        id: f.spot_id || f.spot_slug || null,
        spot_id: f.spot_id || null,
        spot_slug: f.spot_slug || null,
        name: f.location_name || f.name || '',
        description: f.description || '',
        address: f.location_name || '',
        coordinates: f.coordinates || null,
      },
    }));
  }, [upcomingFestivals, locale, HERO_EVENTS]);

  const {
    data: homeSearchData,
    isLoading: isHomeSearchLoading,
    isFetching: isHomeSearchFetching,
  } = useSearchSpotsQuery(
    {
      search: debouncedKeyword,
      page: 1,
      limit: 8,
      status: 'active',
      sortBy: 'created_at',
      sortOrder: 'DESC',
    },
    { enabled: debouncedKeyword.length >= 2 }
  );

  const homeSearchResults = useMemo(
    () => normalizeSpotsSearchResults(homeSearchData),
    [homeSearchData]
  );

  const { data: featuredSpotsData } = useGetFeaturedSpots();
  const { data: newsListData } = useGetNewsList({ page: 1, limit: 3, is_published: true });
  const { data: ocopListData } = useGetOcopProducts({ page: 1, limit: 3 });
  const { data: toursListData } = useGetAllTours({ page: 1, limit: 1 });

  const featuredSpots = useMemo(() => {
    const raw = featuredSpotsData?.data;
    const apiItems = Array.isArray(raw) ? raw : (raw?.spots ?? raw?.items ?? []);
    const mapped = apiItems.map((s) => ({
      id: s.id,
      name: s.name,
      spot_id: s.spot_id || s.id || null,
      slug: s.slug || s.spot_slug || null,
      spot_slug: s.spot_slug || s.slug || null,
      subtitle: s.category_name || '',
      description: s.description || '',
      image:
        s.primary_image || s.primary_image_url
          ? withBaseUrl(s.primary_image || s.primary_image_url)
          : '',
      province: s.province_name || s.address || '',
      address: s.address || s.province_name || '',
      coordinates:
        Number.isFinite(Number(s.longitude ?? s.lng)) &&
        Number.isFinite(Number(s.latitude ?? s.lat))
          ? [Number(s.longitude ?? s.lng), Number(s.latitude ?? s.lat)]
          : null,
      longitude: s.longitude ?? s.lng ?? null,
      latitude: s.latitude ?? s.lat ?? null,
      rating: s.rating_avg ? parseFloat(s.rating_avg).toFixed(1) : null,
    }));
    if (mapped.length >= 3) return mapped.slice(0, 3);
    const padded = [...mapped];
    for (let i = mapped.length; i < 3 && i < FEATURED_DESTINATIONS.length; i++) {
      padded.push(FEATURED_DESTINATIONS[i]);
    }
    return padded.length > 0 ? padded : FEATURED_DESTINATIONS;
  }, [featuredSpotsData, FEATURED_DESTINATIONS]);

  const newsList = useMemo(() => {
    const raw =
      newsListData?.data?.items ||
      newsListData?.data?.news ||
      newsListData?.items ||
      newsListData?.news ||
      [];
    return Array.isArray(raw) ? raw : [];
  }, [newsListData]);

  const ocopProducts = useMemo(() => {
    const raw = ocopListData?.data?.items || ocopListData?.items || [];
    return Array.isArray(raw) ? raw : [];
  }, [ocopListData]);

  const featuredTour = toursListData?.tours?.[0] ?? null;

  const { data: nearbyVouchersData } = useGetNearbyVouchers({
    lat: defaultLatLong.lat,
    lng: defaultLatLong.lng,
    radius_m: 50000,
  });
  const nearbyVouchers = useMemo(() => {
    const raw =
      nearbyVouchersData?.data?.vouchers ||
      nearbyVouchersData?.data?.items ||
      nearbyVouchersData?.data ||
      [];
    return Array.isArray(raw) ? raw.slice(0, 3) : [];
  }, [nearbyVouchersData]);

  const shouldShowSearchOverlay = isSearchFocused && keyword.trim().length > 0;

  const handleGoMapWithSearch = (result) => {
    const prefillKeyword = result?.name || keyword.trim();
    if (!prefillKeyword) return;
    navigate('/map', { state: { prefillKeyword, selectedSearchResult: result || null } });
  };

  const weatherSummary = (() => {
    if (!isConfigured) return t('home.weather_card.not_configured');
    if (isWeatherLoading) return t('home.weather_card.loading_text');
    if (isWeatherError || !weather) return t('home.weather_card.unavailable');
    return weatherDescription || t('home.weather_card.ok');
  })();

  const statGradients = [
    'linear-gradient(135deg, #0b66c3, #0ea5e9)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ef4444, #b91c1c)',
  ];

  const eventColors = [
    'border-l-[5px] border-primary bg-primary/10',
    'border-l-[5px] border-secondary bg-secondary/10',
    'border-l-[5px] border-tertiary bg-tertiary/10',
  ];

  const qlColors = [
    { gradient: 'linear-gradient(135deg, #0b66c3, #0ea5e9)', hover: 'hover:border-primary/50' },
    { gradient: 'linear-gradient(135deg, #6f61e8, #493bc7)', hover: 'hover:border-quinary/50' },
    { gradient: 'linear-gradient(135deg, #10b981, #059669)', hover: 'hover:border-secondary/50' },
    { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', hover: 'hover:border-tertiary/50' },
    { gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)', hover: 'hover:border-quaternary/50' },
  ];

  const gradientHoverClass =
    'transition-all duration-300 hover:bg-gradient-to-r hover:from-primary hover:via-secondary hover:to-tertiary hover:text-white';

  const getPointCoordinates = (point) => {
    if (Array.isArray(point?.coordinates) && point.coordinates.length >= 2)
      return point.coordinates;
    if (Array.isArray(point?.coords) && point.coords.length >= 2) return point.coords;
    if (Number.isFinite(Number(point?.lng)) && Number.isFinite(Number(point?.lat))) {
      return [Number(point.lng), Number(point.lat)];
    }
    if (Number.isFinite(Number(point?.longitude)) && Number.isFinite(Number(point?.latitude))) {
      return [Number(point.longitude), Number(point.latitude)];
    }
    return null;
  };

  const buildPointHighlightState = (point) => {
    if (!point) return null;
    return {
      selectedSearchResult: {
        id: point.id,
        slug: point?.slug || point?.spot_slug || null,
        name: point?.name || point?.title || '',
        description: point?.description || '',
        address: point?.address || point?.location_name || point?.province || '',
        coordinates: getPointCoordinates(point),
        raw: point,
      },
    };
  };

  const buildRouteHighlightState = (tour) => {
    const rawStops = Array.isArray(tour?.stops)
      ? tour.stops
      : Array.isArray(tour?.tour_stops)
        ? tour.tour_stops
        : [];

    const points = rawStops
      .map((stop, index) => {
        const coordinates = getPointCoordinates(stop);
        if (!coordinates) return null;
        return {
          id: stop?.id ?? `${tour?.id || 'tour'}-${index}`,
          slug: stop?.slug || stop?.spot_slug || null,
          name: stop?.name || stop?.title || '',
          description: stop?.description || '',
          coordinates,
          raw: stop,
        };
      })
      .filter(Boolean);

    if (points.length < 2) return null;

    return {
      highlightedRoute: {
        type: 'tour',
        tourId: tour?.id || null,
        tourSlug: tour?.slug || null,
        tourName: tour?.name || '',
        vehicle: 'driving',
        points,
        meta: {
          tour_name: tour?.name || '',
          total_stops: points.length,
        },
      },
    };
  };

  const handleOpenPointDetail = (point) => {
    const pointSlug = point.slug;
    if (!pointSlug) return;
    navigate(`/tourism-point/point/${encodeURIComponent(String(pointSlug))}`);
  };

  const handleOpenPointOnMap = (point) => {
    const highlightState = buildPointHighlightState(point);
    navigate('/map', highlightState ? { state: highlightState } : undefined);
  };

  const handleOpenTourOnMap = (tour) => {
    const routeState = buildRouteHighlightState(tour);
    if (routeState) {
      navigate('/map', { state: routeState });
      return;
    }
    const fallbackState = buildPointHighlightState(tour);
    navigate('/map', fallbackState ? { state: fallbackState } : undefined);
  };

  return (
    <RootLayout>
      <div className="bg-background space-y-6 py-6">
        {/* Hero + Sidebar */}
        <section className="w-full">
          <div className={container}>
            <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
              {/* Hero banner */}
              <div
                className="relative flex min-h-107.5 flex-col justify-between overflow-hidden rounded-[26px] p-8 text-white shadow-[0_18px_42px_rgba(13,74,130,0.14)] sm:p-10"
                style={{
                  background:
                    'linear-gradient(135deg,rgba(3,95,172,.92),rgba(14,165,233,.86),rgba(16,185,129,.72)), url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80") center/cover',
                }}
              >
                <div>
                  <span className="mb-5 inline-flex rounded-full border border-white/35 bg-white/16 px-3.5 py-2 text-sm 2xl:text-base font-bold backdrop-blur-sm">
                    {t('home.hero.description')}
                  </span>
                  <h1 className="max-w-3xl text-[clamp(30px,4vw,48px)] leading-[1.16] font-black tracking-[-1.4px]">
                    {t('home.hero.title')}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm 2xl:text-base leading-relaxed text-white/90">
                    {t('home.hero.lead')}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      className={`h-11 rounded-full px-5 font-bold shadow-md ${gradientHoverClass}`}
                      onClick={() => navigate('/map')}
                    >
                      {t('home.hero.cta_gis')}
                    </Button>
                    <Button
                      variant="quinary"
                      className={`h-11 rounded-full px-5 font-bold shadow-md ${gradientHoverClass}`}
                      onClick={() => navigate('/vr360')}
                    >
                      {t('home.hero.cta_vr')}
                    </Button>
                    <Button
                      variant="gold"
                      className={`h-11 rounded-full px-5 font-bold shadow-md ${gradientHoverClass}`}
                      onClick={() => navigate('/tourism-point')}
                    >
                      {t('home.hero.cta_points')}
                    </Button>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {/* Search */}
                  <div className="relative max-w-3xl rounded-[22px] bg-white/92 px-5 py-4 text-[#22364d] shadow-[0_10px_28px_rgba(0,0,0,.18)]">
                    <label className="mb-1.5 block text-xs 2xl:text-sm font-semibold text-[#667085]">
                      {t('home.search.label')}
                    </label>
                    <div className="relative flex items-center">
                      <Search className="absolute left-0 h-4 w-4 text-[#667085]" />
                      <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
                        placeholder={t('home.search.placeholder')}
                        className="h-auto border-0 bg-transparent py-0 pr-7 pl-6 text-sm 2xl:text-base font-semibold text-[#22364d] shadow-none focus-visible:ring-0"
                      />
                      {keyword && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-0 h-6 w-6 text-[#667085]"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setKeyword('')}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    {shouldShowSearchOverlay && (
                      <div className="border-border bg-card absolute right-0 bottom-full left-0 z-30 mb-2 max-h-72 overflow-auto rounded-xl border shadow-lg">
                        {isHomeSearchLoading || isHomeSearchFetching ? (
                          <div className="flex items-center justify-center px-3 py-6">
                            <LoadingInline size="small" />
                          </div>
                        ) : homeSearchResults.length === 0 ? (
                          <div className="text-muted-foreground flex flex-col items-center gap-2 px-3 py-6 text-sm 2xl:text-base">
                            <MapPin className="h-5 w-5 opacity-70" />
                            <p>
                              {t('mapPage.toolbar.searchNoResult', {
                                defaultValue: 'No matching destination found.',
                              })}
                            </p>
                          </div>
                        ) : (
                          <div className="p-1.5">
                            {homeSearchResults.map((item) => (
                              <Button
                                key={item.id}
                                type="button"
                                variant="ghost"
                                className="h-auto w-full justify-start gap-3 rounded-lg px-2.5 py-2"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleGoMapWithSearch(item)}
                              >
                                <MapPin className="text-primary h-4 w-4 shrink-0" />
                                <div className="min-w-0 flex-1 text-left">
                                  <p className="text-foreground truncate text-sm 2xl:text-base font-medium">
                                    {item.name}
                                  </p>
                                  <p className="text-muted-foreground truncate text-sm 2xl:text-base">
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
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {HERO_STATS.map((stat, i) => (
                      <div
                        key={stat.label}
                        className="min-h-[86px] rounded-[18px] p-4 shadow-md"
                        style={{ background: statGradients[i % statGradients.length] }}
                      >
                        <span className="text-sm 2xl:text-base font-bold text-white/92">
                          {stat.label}
                        </span>
                        <strong className="mt-1.5 block text-xl md:text-2xl 2xl:text-[23px] font-black text-white">
                          {stat.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-3">
                {/* Weather card */}
                <div className={`${card} p-4`}>
                  <SectionLabel>{t('home.weather_card.title')}</SectionLabel>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-foreground text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                        {weather?.name || 'Ninh Bình'}
                      </h2>
                      <p className="text-muted-foreground mt-1 text-sm 2xl:text-base">
                        {weatherSummary}
                      </p>
                    </div>
                    <div className="text-primary shrink-0 text-3xl md:text-4xl 2xl:text-[44px] font-black">
                      {weather ? formatTemperature(weather?.main?.temp) : '--'}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    <div className="bg-primary/8 flex items-center justify-between rounded-[14px] px-3.5 py-2.5">
                      <span className="text-primary flex items-center gap-2 text-sm 2xl:text-base font-bold opacity-80">
                        <Droplets size={14} /> {t('home.weather_card.humidity')}
                      </span>
                      <strong className="text-primary text-sm 2xl:text-base">
                        {weather ? formatHumidity(weather?.main?.humidity) : '--'}
                      </strong>
                    </div>
                    <div className="bg-secondary/8 flex items-center justify-between rounded-[14px] px-3.5 py-2.5">
                      <span className="text-secondary/80 flex items-center gap-2 text-sm 2xl:text-base font-bold">
                        <Wind size={14} /> {t('home.weather_card.wind')}
                      </span>
                      <strong className="text-secondary text-sm 2xl:text-base">
                        {weather ? formatWindSpeedKph(weather?.wind?.speed) : '--'}
                      </strong>
                    </div>
                    <div className="bg-tertiary/10 flex items-center justify-between rounded-[14px] px-3.5 py-2.5">
                      <span className="text-tertiary flex items-center gap-2 text-sm 2xl:text-base font-bold opacity-80">
                        <img
                          src={aqiMeta.iconSrc}
                          alt={t(aqiMeta.labelKey)}
                          className="h-3.5 w-3.5 object-contain"
                        />
                        {t('home.weather_card.aqi')}
                      </span>
                      <strong className="text-tertiary text-sm 2xl:text-base">
                        {weatherOverview?.aqiValue ?? '--'} · {t(aqiMeta.labelKey)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Events card */}
                <div className={`${card} relative overflow-hidden p-4`}>
                  <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-40 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <Sparkles size={13} className="text-tertiary animate-pulse" />
                      <SectionLabel color="var(--tertiary)">
                        {t('home.festivals_card.label')}
                      </SectionLabel>
                      <span className="relative ml-1 flex h-2 w-2">
                        <span className="bg-tertiary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                        <span className="bg-tertiary relative inline-flex h-2 w-2 rounded-full" />
                      </span>
                    </div>
                    <h2 className="text-foreground mt-2 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                      {t('home.festivals_card.title')}
                    </h2>
                    <div className="mt-4 grid gap-2">
                      {heroEvents.slice(0, 2).map((event, i) => (
                        <div
                          key={`${event.title}-${i}`}
                          className={`${eventColors[i % eventColors.length]} flex flex-col gap-1 rounded-[16px] px-3.5 py-2.5`}
                        >
                          <span className="text-sm 2xl:text-base font-semibold">{event.title}</span>
                          <strong className="text-muted-foreground text-sm 2xl:text-base font-semibold">
                            {event.time}
                          </strong>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className={`border-tertiary/40 text-tertiary hover:bg-tertiary/8 mt-4 w-full rounded-xl ${gradientHoverClass}`}
                      onClick={() => navigate('/festival')}
                    >
                      {t('home.festivals_card.cta')}
                    </Button>
                  </div>
                </div>

                {/* Quick suggestions */}
                <div className={`${card} p-4`}>
                  <SectionLabel>{t('home.suggestions_card.label')}</SectionLabel>
                  <h2 className="text-foreground mt-1 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                    {t('home.suggestions_card.title')}
                  </h2>
                  <div className="mt-4 grid gap-2">
                    {featuredSpots.slice(0, 2).map((item, i) => {
                      const colors = ['text-primary', 'text-secondary', 'text-tertiary'];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className="bg-muted/40 hover:bg-muted flex h-[42px] w-full items-center justify-between rounded-[14px] px-3.5 transition-colors"
                          onClick={() => handleOpenPointDetail(item)}
                        >
                          <span className="text-foreground text-sm 2xl:text-base font-semibold">
                            {item.name}
                          </span>
                          <span className={`text-sm 2xl:text-base font-bold ${colors[i % colors.length]}`}>
                            {t('home.suggestions_card.detail_cta')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="w-full">
          <div className={container}>
            <div
              className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border p-5"
              style={{
                borderColor: '#a9c0de',
                background: 'linear-gradient(135deg, #ffffff, #eef8ff 52%, #f0fdf4)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[17px] text-2xl text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, #0b66c3, #0ea5e9, #10b981)' }}
                >
                  <CalendarDays size={22} />
                </div>
                <div>
                  <p className="text-foreground text-sm 2xl:text-base font-bold">
                    {PROMO_BANNER.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm 2xl:text-base">
                    {PROMO_BANNER.description}
                  </p>
                </div>
              </div>
              <Button
                className={`h-11 rounded-full px-5 font-bold ${gradientHoverClass}`}
                onClick={() => navigate(PROMO_BANNER.path)}
              >
                {PROMO_BANNER.cta}
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Access Modules */}
        <section className="w-full">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>{t('home.quick_access.label')}</SectionLabel>
              <h2 className="text-foreground mt-0.5 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                {t('home.quick_access.title')}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm 2xl:text-base">
                {t('home.quick_access.description')}
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {QUICK_LINKS.map((item, i) => {
                  const c = qlColors[i % qlColors.length];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`group flex min-h-[96px] flex-col items-start overflow-hidden rounded-[18px] border border-[#aac0d7] bg-gradient-to-b from-white to-[#f8fbfe] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(7,78,135,.14)] ${c.hover}`}
                    >
                      <div className="mb-3 flex items-center gap-2.5">
                        <span
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-white shadow-sm"
                          style={{ background: c.gradient }}
                        >
                          {item.icon === 'map' && <MapPinned size={15} />}
                          {item.icon === 'vr' && <Compass size={15} />}
                          {item.icon === 'plan' && <CalendarDays size={15} />}
                          {item.icon === 'service' && <Sun size={15} />}
                          {item.icon === 'ocop' && <ArrowRight size={15} />}
                        </span>
                        <span className="text-foreground truncate text-sm 2xl:text-base font-black">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm 2xl:text-base">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="w-full">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>{t('home.featured_destinations.label')}</SectionLabel>
              <h2 className="text-foreground mt-0.5 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                {t('home.featured_destinations.title')}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm 2xl:text-base">
                {t('home.featured_destinations.description')}
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {featuredSpots.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[20px] border border-[#aac0d7] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(7,78,135,.14)]"
                  >
                    <div className="relative h-[210px]">
                      <img
                        src={item.image || placeholderImg}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs 2xl:text-sm font-black text-[#034f8d]">
                        {item.province}
                      </span>
                      {item.rating && (
                        <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs 2xl:text-sm font-black">
                          ⭐ {item.rating}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground mb-1.5 text-sm 2xl:text-base font-semibold">
                        {item.subtitle}
                      </p>
                      <h3 className="text-foreground text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm 2xl:text-base">
                        {item.description}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          className={`rounded-lg ${gradientHoverClass}`}
                          onClick={() => handleOpenPointDetail(item)}
                        >
                          {t('home.featured_destinations.detail_cta')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`rounded-lg ${gradientHoverClass}`}
                          onClick={() => handleOpenPointOnMap(item)}
                        >
                          {t('common.map')}
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* News + Tour + Itinerary */}
        <section className="w-full">
          <div className={container}>
            <div className="grid gap-5 lg:grid-cols-2">
              {/* News */}
              <div className={`${card} p-6`}>
                <SectionLabel>{t('home.news_section.label')}</SectionLabel>
                <h2 className="text-foreground mt-0.5 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                  {t('home.news_section.title')}
                </h2>
                <div className="mt-5 grid gap-0">
                  {newsList.map((item, i) => (
                    <article
                      key={item.id}
                      className={`grid grid-cols-[46px_1fr] gap-3.5 py-3.5 ${i < newsList.length - 1 ? 'border-b border-dashed border-[#a9bdd2]' : ''}`}
                    >
                      <div className="text-primary mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#e9f5fb] text-lg">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <span className="mb-1.5 inline-block rounded-full border border-[#a9bdd2] px-2.5 py-0.5 text-xs 2xl:text-sm font-bold text-[#52647a]">
                          {formatNewsDate(item.published_at || item.created_at, locale)}
                        </span>
                        <h4 className="text-foreground line-clamp-2 text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold">
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm 2xl:text-base">
                          {item.summary}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Tour + Itinerary */}
              <div className="flex flex-col gap-5">
                <div className={`${card} p-6`}>
                  <SectionLabel>{t('home.tour_section.label')}</SectionLabel>
                  {featuredTour?.cover_image_url && (
                    <div className="mx-auto mt-3 h-[150px] w-[55%] overflow-hidden rounded-[18px]">
                      <img
                        src={withBaseUrl(featuredTour.cover_image_url)}
                        alt={featuredTour.name || ''}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                    </div>
                  )}
                  <h3 className="text-foreground mt-3 line-clamp-2 text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold">
                    {featuredTour
                      ? featuredTour.name || featuredTour.name_vi || t('home.tour_section.default_title')
                      : t('home.tour_section.default_title')}
                  </h3>
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm 2xl:text-base">
                    {featuredTour
                      ? featuredTour.description_vi || featuredTour.description_en || ''
                      : t('home.tour_section.default_desc')}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    <div className="bg-muted/30 rounded-[14px] border border-[#aac0d7] p-3">
                      <p className="text-foreground text-sm 2xl:text-base font-black">
                        {featuredTour?.duration_days
                          ? `${featuredTour.duration_days} ${t('home.tour_section.days')}`
                          : `1 ${t('home.tour_section.days')}`}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs 2xl:text-sm">
                        {t('home.tour_section.schedule')}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-[14px] border border-[#aac0d7] p-3">
                      <p className="text-foreground text-sm 2xl:text-base font-black">
                        {featuredTour?.price_from_vnd
                          ? formatVND(Number(featuredTour.price_from_vnd))
                          : t('home.tour_section.contact')}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs 2xl:text-sm">
                        {t('home.tour_section.per_person')}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-[14px] border border-[#aac0d7] p-3">
                      <p className="text-foreground text-sm 2xl:text-base font-black">
                        {featuredTour?.rating_avg
                          ? `⭐ ${parseFloat(featuredTour.rating_avg).toFixed(1)}`
                          : '⭐ --'}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs 2xl:text-sm">
                        {featuredTour?.rating_count
                          ? `${featuredTour.rating_count} ${t('home.tour_section.reviews')}`
                          : t('home.tour_section.reviews')}
                      </p>
                    </div>
                  </div>
                  <Button
                    className={`mt-4 w-full rounded-xl ${gradientHoverClass}`}
                    onClick={() => handleOpenTourOnMap(featuredTour)}
                  >
                    {t('home.tour_section.view_map')}
                  </Button>
                </div>

                <div className={`${card} p-6`}>
                  <SectionLabel>{t('home.itinerary_section.label')}</SectionLabel>
                  <h2 className="text-foreground mt-0.5 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                    {t('home.itinerary_section.title')}
                  </h2>
                  <div className="mt-4 grid gap-2">
                    {ITINERARY_ITEMS.map((item) => (
                      <div
                        key={`${item.time}-${item.activity}`}
                        className="bg-muted/40 flex h-[42px] items-center justify-between rounded-[14px] px-3.5"
                      >
                        <span className="text-foreground text-sm 2xl:text-base">{item.activity}</span>
                        <strong className="text-foreground text-sm 2xl:text-base">{item.time}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Food Section */}
        <section className="w-full">
          <div className={container}>
            <div className={`${card} overflow-hidden`}>
              <div className="grid lg:grid-cols-[1fr_1.1fr]">
                <div
                  className="min-h-[330px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80)',
                  }}
                />
                <div className="p-6 sm:p-8">
                  <SectionLabel>{t('home.food_section.label')}</SectionLabel>
                  <h2 className="text-foreground mt-0.5 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                    {t('home.food_section.title')}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm 2xl:text-base">
                    {t('home.food_section.description')}
                  </p>
                  <div className="mt-4 mb-4 flex flex-wrap gap-2">
                    {FOOD_TAGS.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#9db8d2] bg-white px-3 py-1.5 text-sm 2xl:text-base font-bold text-[#42566f]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid gap-2">
                    {FOOD_BULLETS.map((item) => (
                      <div
                        key={item.label}
                        className="bg-muted/40 flex h-[42px] items-center justify-between rounded-[14px] px-3.5"
                      >
                        <span className="text-foreground text-sm 2xl:text-base">{item.label}</span>
                        <strong className="text-foreground text-sm 2xl:text-base">{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vouchers */}
        <section className="w-full" id="services">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>{t('home.vouchers_section.label')}</SectionLabel>
              <h2 className="text-foreground mt-0.5 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                {t('home.vouchers_section.title')}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm 2xl:text-base">
                {t('home.vouchers_section.desc')}
              </p>

              {nearbyVouchers.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {nearbyVouchers.map((voucher) => (
                    <article
                      key={voucher.id}
                      className="overflow-hidden rounded-[20px] border border-[#aac0d7] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(7,78,135,.14)]"
                    >
                      <div
                        className="flex items-start justify-between gap-3 px-4 py-4"
                        style={{ background: 'linear-gradient(135deg, #edf7fd, #fff)' }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-muted-foreground truncate text-xs 2xl:text-sm">
                            {voucher.business_name}
                          </p>
                          <h3 className="text-foreground mt-0.5 line-clamp-1 text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold">
                            {voucher.title_vi}
                          </h3>
                        </div>
                        <span className="bg-primary shrink-0 rounded-full px-3 py-1.5 text-xs 2xl:text-sm font-black whitespace-nowrap text-white">
                          {formatVoucherDiscount(voucher)}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="text-primary mb-3 rounded-[10px] border border-[#9db8d2] bg-[#f8fbfe] py-2 text-center font-mono text-sm 2xl:text-base font-black tracking-wider">
                          {voucher.code}
                        </div>
                        <div className="grid gap-1.5">
                          {voucher.min_order_value && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs 2xl:text-sm">
                                {t('home.vouchers_section.min_order')}
                              </span>
                              <span className="text-xs 2xl:text-sm font-semibold">
                                {formatVND(Number(voucher.min_order_value))}
                              </span>
                            </div>
                          )}
                          {voucher.valid_until && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs 2xl:text-sm">
                                {t('home.vouchers_section.valid_until')}
                              </span>
                              <span className="text-xs 2xl:text-sm font-semibold">
                                {formatNewsDate(voucher.valid_until, locale)}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`mt-4 w-full rounded-[10px] ${gradientHoverClass}`}
                          onClick={() => navigate('/map')}
                        >
                          {t('home.vouchers_section.view_map')}
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-6 text-center text-sm 2xl:text-base">
                  {t('home.vouchers_section.empty')}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* OCOP Products */}
        <section className="w-full" id="ocop">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>{t('home.ocop_section.label')}</SectionLabel>
              <h2 className="text-foreground mt-0.5 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                {t('home.ocop_section.title')}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm 2xl:text-base">
                {t('home.ocop_section.description')}
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {ocopProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[20px] border border-[#aac0d7] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(7,78,135,.14)]"
                  >
                    <div className="flex items-center justify-center px-6 py-4">
                      <img
                        src={withBaseUrl(product.cover_image_url)}
                        alt={product.name || ''}
                        className="h-[190px] w-[72%] rounded-[18px] object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm 2xl:text-base">
                        <span>{product.province_name || '--'}</span>
                        {product.star_rating && (
                          <span>{'⭐'.repeat(Number(product.star_rating))}</span>
                        )}
                      </div>
                      <h3 className="text-foreground truncate text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground mt-2 line-clamp-3 text-sm 2xl:text-base">
                        {product.description || ''}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <strong className="text-foreground text-sm 2xl:text-base">
                          {product.price_vnd ? formatVND(Number(product.price_vnd)) : '--'}
                        </strong>
                        {product.unit && (
                          <span className="text-muted-foreground text-sm 2xl:text-base">
                            / {product.unit}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          className={`rounded-[10px] ${gradientHoverClass}`}
                          onClick={() => navigate('/ocop')}
                        >
                          {t('home.ocop_section.view_product')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`rounded-[10px] ${gradientHoverClass}`}
                          onClick={() => navigate('/ocop')}
                        >
                          {t('home.ocop_section.contact')}
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vlog & Blog */}
        <section className="w-full">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>{t('home.vlog_section.label')}</SectionLabel>
              <h2 className="text-foreground mt-0.5 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                {t('home.vlog_section.title')}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm 2xl:text-base">
                {t('home.vlog_section.description')}
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {VLOG_STORIES.map((story) => (
                  <article
                    key={story.title}
                    className="overflow-hidden rounded-[20px] border border-[#aac0d7] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(7,78,135,.14)]"
                  >
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-[190px] w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImg;
                      }}
                    />
                    <div className="p-4">
                      <p className="text-muted-foreground mb-2 text-sm 2xl:text-base">
                        {t('home.vlog_section.author_prefix')} {story.author}
                      </p>
                      <h3 className="text-foreground text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold">
                        {story.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-sm 2xl:text-base">
                        {story.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="w-full pb-6">
          <div className={container}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#9db8d2] pt-5 text-sm 2xl:text-base text-[#33506d]">
              <p>{t('home.footer_section.brand')}</p>
              <div className="flex items-center gap-1">
                {[
                  { label: t('common.map'), path: '/map' },
                  { label: 'VR360', path: '/vr360' },
                  { label: t('common.tourism_points'), path: '/tourism-point' },
                ].map((link, i, arr) => (
                  <React.Fragment key={link.path}>
                    <Button
                      type="button"
                      variant="link"
                      className={`text-primary h-auto p-0 text-sm 2xl:text-base font-bold hover:underline ${gradientHoverClass}`}
                      onClick={() => navigate(link.path)}
                    >
                      {link.label}
                    </Button>
                    {i < arr.length - 1 && <span className="mx-1 text-[#9db8d2]">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}
