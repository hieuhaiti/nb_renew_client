import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bot,
  CalendarDays,
  CloudLightning,
  CloudSun,
  Compass,
  Droplets,
  FileText,
  MapPin,
  MapPinned,
  Play,
  Route,
  Satellite,
  Search,
  ShoppingBasket,
  Sparkles,
  Sun,
  Users,
  Wind,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

/* ─── helpers ──────────────────────────────────────── */
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

/* ─── static module-level constants ────────────────── */
const ICON_GRADS = [
  'linear-gradient(135deg,#10b981,#2ec4b6)', // secondary teal
  'linear-gradient(135deg,#0b66c3,#0ea5e9)', // primary blue
  'linear-gradient(135deg,#f59e0b,#ffb703)', // tertiary amber
  'linear-gradient(135deg,#7c3aed,#a78bfa)', // quaternary purple
  'linear-gradient(135deg,#ef4444,#fb8500)', // quinary coral
];

const QUICK_ICON_MAP = {
  map: <MapPinned size={18} />,
  vr: <Compass size={18} />,
  plan: <Route size={18} />,
  service: <Sun size={18} />,
  ocop: <ShoppingBasket size={18} />,
};

const FEATURE_CARDS = [
  {
    icon: <MapPinned size={22} />,
    bg: ICON_GRADS[0],
    title: 'Bản đồ du lịch thông minh',
    desc: 'Lớp điểm du lịch, dịch vụ, bản đồ nền, tìm kiếm theo tên và bán kính vị trí.',
    path: '/map',
  },
  {
    icon: <CloudLightning size={22} />,
    bg: ICON_GRADS[1],
    title: 'Thời tiết, AQI, cảnh báo',
    desc: 'Cập nhật gió, mưa, chất lượng không khí và cảnh báo thời tiết cực đoan.',
    path: '/map',
  },
  {
    icon: <Users size={22} />,
    bg: ICON_GRADS[2],
    title: 'Theo dõi tải khách',
    desc: 'Hiển thị mức tải, cảnh báo quá tải và đề xuất điều hướng thay thế.',
    path: '/map',
  },
  {
    icon: <Satellite size={22} />,
    bg: ICON_GRADS[3],
    title: 'Giám sát khu bảo tồn',
    desc: 'Tìm kiếm ảnh vệ tinh, so sánh thời gian, phân loại và phát hiện biến động.',
    path: '/map',
  },
];

const ROLE_CARDS = [
  {
    icon: <MapPin size={22} />,
    bg: ICON_GRADS[0],
    title: 'Khách du lịch',
    items: ['Tìm điểm đến, tour, dịch vụ', 'Tạo và chia sẻ lịch trình', 'Xem VR 360, đánh giá'],
  },
  {
    icon: <CalendarDays size={22} />,
    bg: ICON_GRADS[1],
    title: 'Doanh nghiệp',
    items: ['Đăng tin, voucher', 'Nhận phản hồi, đánh giá', 'Dashboard doanh thu, tải khách'],
  },
  {
    icon: <FileText size={22} />,
    bg: ICON_GRADS[2],
    title: 'Nhà quản lý',
    items: ['Nhận báo cáo tự động', 'Cảnh báo quá tải', 'Giám sát khu bảo tồn'],
  },
  {
    icon: <Satellite size={22} />,
    bg: ICON_GRADS[3],
    title: 'Quản trị hệ thống',
    items: ['Quản trị tài khoản, API', 'Quản trị lớp bản đồ', 'Nhật ký và phân quyền'],
  },
];

/* ─── Skeleton ─────────────────────────────────────── */
function HomePageSkeleton() {
  const spad = { padding: '28px 5vw 22px' };
  const spad2 = { padding: '42px 5vw' };
  return (
    <div className="overflconsk-hidden" aria-busy="true">
      {/* Hero */}
      <section
        style={{ ...spad, minHeight: 'calc(100vh - 76px)' }}
        className="grid items-center gap-7 lg:grid-cols-[1.05fr_.95fr]"
      >
        <div className="space-y-5">
          <Skeleton className="h-9 w-52 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-3/4 rounded-xl" />
          </div>
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-[68px] rounded-[28px]" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[82px] rounded-[18px]" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[72px] rounded-[20px]" />
            ))}
          </div>
        </div>
        <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_.72fr]">
          <Skeleton className="min-h-[460px] rounded-[34px] lg:min-h-[560px]" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-52 rounded-[28px]" />
            <Skeleton className="h-44 rounded-[28px]" />
            <Skeleton className="h-36 rounded-[28px]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={spad2}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[188px] rounded-[26px]" />
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section style={spad2}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-80" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="col-span-2 h-[290px] rounded-[26px] sm:col-span-2" />
            <Skeleton className="h-52 rounded-[26px]" />
            <Skeleton className="h-52 rounded-[26px]" />
          </div>
          <Skeleton className="min-h-[420px] rounded-[30px]" />
        </div>
        <Skeleton className="mt-5 h-[160px] rounded-[32px]" />
      </section>

      {/* Role */}
      <section style={spad2}>
        <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
          <Skeleton className="h-[280px] rounded-[32px]" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[160px] rounded-[26px]" />
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section style={spad2}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[135px] rounded-[24px]" />
            ))}
          </div>
          <Skeleton className="min-h-[360px] rounded-[28px]" />
        </div>
      </section>
    </div>
  );
}

/* ─── Main component ────────────────────────────────── */
export default function HomePageContent() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);
  const locale = getLocaleFromLanguage(i18n.language);

  const homeData = useMemo(() => getHomeData(lang), [lang]);
  const {
    FEATURED_DESTINATIONS,
    HERO_EVENTS,
    HERO_STATS,
    ITINERARY_ITEMS,
    QUICK_LINKS,
    VLOG_STORIES,
  } = homeData;

  const [keyword, setKeyword] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedKeyword] = useDebounce(keyword.trim(), 350);

  /* ── weather ─────────────────────── */
  const {
    data: weatherOverview,
    isLoading: isWeatherLoading,
    isError: isWeatherError,
    isConfigured,
  } = useWeatherOverview({ lat: defaultLatLong.lat, lng: defaultLatLong.lng, lang });
  const weather = weatherOverview?.weather;
  const aqiMeta = getAqiLevelMeta(weatherOverview?.aqiValue);
  const weatherDescription = weather?.weather?.[0]?.description;

  /* ── festivals ───────────────────── */
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
        id: f.spot_id || null,
        spot_id: f.spot_id || null,
        spot_slug: f.spot_slug || null,
        name: f.location_name || f.name || '',
        description: f.description || '',
        address: f.location_name || '',
        coordinates: f.coordinates || null,
      },
    }));
  }, [upcomingFestivals, locale, HERO_EVENTS]);

  /* ── live search ─────────────────── */
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

  /* ── API data ────────────────────── */
  const { data: featuredSpotsData, isLoading: isSpotsLoading } = useGetFeaturedSpots();
  const { data: newsListData, isLoading: isNewsLoading } = useGetNewsList({
    page: 1,
    limit: 4,
    is_published: true,
  });
  const { data: ocopListData } = useGetOcopProducts({ page: 1, limit: 3 });
  const { data: toursListData } = useGetAllTours({ page: 1, limit: 1 });
  const { data: nearbyVouchersData } = useGetNearbyVouchers({
    lat: defaultLatLong.lat,
    lng: defaultLatLong.lng,
    radius_m: 50000,
  });

  /* ── derived data ────────────────── */
  const featuredSpots = useMemo(() => {
    const raw = featuredSpotsData?.data;
    const apiItems = Array.isArray(raw) ? raw : (raw?.spots ?? raw?.items ?? []);
    const mapped = apiItems.map((s) => ({
      id: s.id,
      name: s.name,
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
    for (let i = mapped.length; i < 3 && i < FEATURED_DESTINATIONS.length; i++)
      padded.push(FEATURED_DESTINATIONS[i]);
    return padded.length > 0 ? padded : FEATURED_DESTINATIONS;
  }, [featuredSpotsData, FEATURED_DESTINATIONS]);

  const newsList = useMemo(() => {
    const raw =
      newsListData?.data?.items ||
      newsListData?.data?.news ||
      newsListData?.items ||
      newsListData?.news ||
      [];
    return Array.isArray(raw) ? raw.slice(0, 4) : [];
  }, [newsListData]);

  const ocopProducts = useMemo(() => {
    const raw = ocopListData?.data?.items || ocopListData?.items || [];
    return Array.isArray(raw) ? raw : [];
  }, [ocopListData]);

  const featuredTour = toursListData?.data?.tours?.[0] ?? toursListData?.tours?.[0] ?? null;

  const nearbyVouchers = useMemo(() => {
    const raw =
      nearbyVouchersData?.data?.vouchers ||
      nearbyVouchersData?.data?.items ||
      nearbyVouchersData?.data ||
      [];
    return Array.isArray(raw) ? raw.slice(0, 3) : [];
  }, [nearbyVouchersData]);

  /* ── ui state ────────────────────── */
  const shouldShowSearchOverlay = isSearchFocused && keyword.trim().length > 0;

  const weatherSummary = (() => {
    if (!isConfigured) return t('home.weather_card.not_configured');
    if (isWeatherLoading) return t('home.weather_card.loading_text');
    if (isWeatherError || !weather) return t('home.weather_card.unavailable');
    return weatherDescription || t('home.weather_card.ok');
  })();

  /* ── navigation helpers ──────────── */
  const getPointCoordinates = (point) => {
    if (Array.isArray(point?.coordinates) && point.coordinates.length >= 2)
      return point.coordinates;
    if (Array.isArray(point?.coords) && point.coords.length >= 2) return point.coords;
    if (Number.isFinite(Number(point?.lng)) && Number.isFinite(Number(point?.lat)))
      return [Number(point.lng), Number(point.lat)];
    if (Number.isFinite(Number(point?.longitude)) && Number.isFinite(Number(point?.latitude)))
      return [Number(point.longitude), Number(point.latitude)];
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
        meta: { tour_name: tour?.name || '', total_stops: points.length },
      },
    };
  };

  const handleGoMapWithSearch = (result) => {
    if (result) {
      const highlightState = buildPointHighlightState(result);
      navigate('/map', {
        state: { prefillKeyword: result.name, selectedSearchResult: result, ...highlightState },
      });
    } else {
      const prefillKeyword = keyword.trim();
      navigate('/map', prefillKeyword ? { state: { prefillKeyword } } : undefined);
    }
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

  const handleOpenNewsDetail = (item) => {
    if (item?.slug) navigate(`/news/${item.slug}`);
    else navigate('/news');
  };

  /* ── design tokens (theme-aligned) ── */
  // Card: bg-card border-border, radius and shadow mapped to theme
  const glassCard =
    'bg-card border border-border rounded-[28px] p-4.5 shadow-(--ambient-shadow)';
  const sectionPad = { padding: '42px 5vw' };
  const sectionSmall = 'mb-1 text-xs font-black uppercase tracking-widest text-secondary';
  const sectionH2 = 'font-black tracking-tight leading-[1.15] text-foreground';
  const sectionHead = 'mb-5 flex flex-wrap items-end justify-between gap-4';
  const cardHover =
    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--ambient-shadow-strong)';

  /* ── show skeleton on initial load ── */
  if (isSpotsLoading && isNewsLoading) {
    return (
      <RootLayout>
        <HomePageSkeleton />
      </RootLayout>
    );
  }

  /* ─────────────────── RENDER ──────────────────────── */
  return (
    <RootLayout>
      <div
        className="text-foreground overflow-x-hidden"
        style={{
          background:
            'radial-gradient(circle at 5% 8%,rgba(16,185,129,.12),transparent 26%),' +
            'radial-gradient(circle at 90% 12%,rgba(245,158,11,.14),transparent 24%),' +
            'linear-gradient(180deg,#f5fcff 0%,#ffffff 42%,#f7fbff 100%)',
        }}
      >
        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section
          className="grid items-center gap-7 lg:grid-cols-[1.05fr_.95fr]"
          style={{ padding: '28px 5vw 22px', minHeight: 'calc(100vh - 76px)' }}
        >
          {/* ── Left ── */}
          <div>
            {/* Badge */}
            <Badge
              variant="outline"
              className="mb-4 gap-2 rounded-full border-(--tertiary-soft-hover) bg-(--tertiary-soft) px-3.5 py-2.5 text-[13px] font-black text-(--tertiary-soft-foreground)"
            >
              <Sparkles size={13} />
              {t('home.hero.description')}
            </Badge>

            {/* H1 */}
            <h1
              className="text-foreground mb-4 leading-[1.06] font-black tracking-[-2.2px]"
              style={{ fontSize: 'clamp(36px,5vw,68px)' }}
            >
              {t('home.hero.title')}
            </h1>

            <p className="text-muted-foreground mb-5 max-w-xl text-[17px] leading-[1.75]">
              {t('home.hero.lead')}
            </p>

            {/* Search box */}
            <div
              className="border-border bg-card relative mb-4 rounded-[28px] border shadow-[var(--ambient-shadow-strong)]"
              style={{ padding: '14px' }}
            >
              <div className="grid grid-cols-[1fr_auto] gap-2.5 sm:grid-cols-[1.1fr_.82fr_.82fr_auto]">
                {/* Keyword */}
                <label className="border-border bg-muted text-muted-foreground flex items-center gap-2.5 rounded-[18px] border px-3.5 py-3">
                  <Search size={15} className="text-secondary shrink-0" />
                  <div className="relative min-w-0 flex-1">
                    <Input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGoMapWithSearch(null)}
                      placeholder={t('home.search.placeholder')}
                      className="text-foreground placeholder:text-muted-foreground h-auto border-0 bg-transparent p-0 text-[14px] font-bold shadow-none placeholder:font-normal focus-visible:ring-0"
                    />
                    {keyword && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground absolute top-1/2 right-0 -translate-y-1/2"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setKeyword('')}
                      >
                        <X size={13} />
                      </Button>
                    )}
                  </div>
                </label>

                {/* Category */}
                {/* TODO: connect category filter to search API – currently mock options */}
                <label className="border-border bg-muted text-muted-foreground hidden items-center gap-2.5 rounded-[18px] border px-3.5 py-3 sm:flex">
                  <ArrowRight size={14} className="text-secondary shrink-0" />
                  <Select defaultValue="experience_type">
                    <SelectTrigger className="h-auto border-0 bg-transparent px-0 text-[14px] font-bold shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="experience_type">{t('home.filters.experience_type')}</SelectItem>
                      <SelectItem value="nature">{t('home.filters.nature')}</SelectItem>
                      <SelectItem value="culture">{t('home.filters.culture')}</SelectItem>
                      <SelectItem value="cuisine">{t('home.filters.cuisine')}</SelectItem>
                      <SelectItem value="ocop">OCOP</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                {/* Radius */}
                {/* TODO: connect radius filter to geo-search API – currently mock options */}
                <label className="border-border bg-muted text-muted-foreground hidden items-center gap-2.5 rounded-[18px] border px-3.5 py-3 sm:flex">
                  <MapPin size={14} className="text-secondary shrink-0" />
                  <Select defaultValue="radius">
                    <SelectTrigger className="h-auto border-0 bg-transparent px-0 text-[14px] font-bold shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radius">{t('home.filters.radius')}</SelectItem>
                      <SelectItem value="2_km">{t('home.filters.radius_2km')}</SelectItem>
                      <SelectItem value="5_km">{t('home.filters.radius_5km')}</SelectItem>
                      <SelectItem value="10_km">{t('home.filters.radius_10km')}</SelectItem>
                      <SelectItem value="20_km">{t('home.filters.radius_20km')}</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                {/* Submit */}
                <Button
                  variant="secondary"
                  className="h-[50px] rounded-full px-5 text-[14px] font-black"
                  onClick={() => handleGoMapWithSearch(null)}
                >
                  Tìm ngay
                </Button>
              </div>

              {/* Search overlay */}
              {shouldShowSearchOverlay && (
                <div className="border-border bg-card absolute right-0 bottom-full left-0 z-30 mb-2 max-h-72 overflow-auto rounded-[18px] border shadow-[var(--ambient-shadow-strong)]">
                  {isHomeSearchLoading || isHomeSearchFetching ? (
                    <div className="flex items-center justify-center px-3 py-6">
                      <LoadingInline size="small" />
                    </div>
                  ) : homeSearchResults.length === 0 ? (
                    <div className="text-muted-foreground flex flex-col items-center gap-2 px-3 py-6 text-[13px]">
                      <MapPin className="h-5 w-5 opacity-60" />
                      <p>
                        {t('mapPage.toolbar.searchNoResult', {
                          defaultValue: 'Không tìm thấy điểm đến.',
                        })}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {homeSearchResults.map((item) => (
                        <Button
                          key={item.id}
                          type="button"
                          variant="ghost"
                          className="h-auto w-full justify-start gap-3 rounded-[12px] px-3 py-2"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleGoMapWithSearch(item)}
                        >
                          <MapPin className="text-secondary h-4 w-4 shrink-0" />
                          <div className="min-w-0 flex-1 text-left">
                            <p className="text-foreground truncate text-[14px] font-bold">
                              {item.name}
                            </p>
                            <p className="text-muted-foreground truncate text-[12px]">
                              {item.address ||
                                t('mapPage.destination.noAddress', {
                                  defaultValue: 'Không có địa chỉ',
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

            {/* Quick actions */}
            <div className="mb-4 grid grid-cols-5 gap-2">
              {QUICK_LINKS.map((item, i) => (
                <Button
                  key={item.id}
                  type="button"
                  variant="outline"
                  onClick={() => navigate(item.path)}
                  className={`border-border bg-card h-auto flex-col gap-0 rounded-[18px] p-3 shadow-[var(--ambient-shadow)] ${cardHover}`}
                >
                  <div
                    className="mx-auto mb-2 flex h-[38px] w-[38px] items-center justify-center rounded-[14px] text-white"
                    style={{ background: ICON_GRADS[i % ICON_GRADS.length] }}
                  >
                    {QUICK_ICON_MAP[item.icon] ?? <MapPinned size={18} />}
                  </div>
                  <span className="text-foreground/70 block text-[12px] font-black">
                    {item.title}
                  </span>
                </Button>
              ))}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="border-border bg-card rounded-[20px] border p-3.5 shadow-[var(--ambient-shadow)]"
                >
                  <strong className="text-secondary block text-[25px] font-black">
                    {stat.value}
                  </strong>
                  <span className="text-muted-foreground text-[12px] font-bold">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: dashboard ── */}
          <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_.72fr]">
            {/* Map preview — click to open full map */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/map')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/map')}
              className="focus-visible:ring-ring relative min-h-[420px] cursor-pointer overflow-hidden rounded-[34px] border border-white/80 shadow-[var(--ambient-shadow-strong)] focus-visible:ring-2 focus-visible:outline-none lg:min-h-[560px]"
              style={{
                background:
                  'linear-gradient(135deg,rgba(10,68,88,.18),rgba(16,185,129,.15)),' +
                  "url('https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/105.936,20.253,8.2,0/700x900?access_token=pk.eyJ1IjoibmdvY3R0ZCIsImEiOiJjbWJibmlod3MwMmluMnFyMG1xMWt0dTdrIn0.ok5SgmXGrHFLeMPf-OG5_w')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Toolbar */}
              <div className="pointer-events-none absolute top-[18px] right-[18px] left-[18px] flex items-start justify-between gap-2.5">
                <div className="bg-card/95 inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[12px] font-black shadow-[var(--ambient-shadow)]">
                  <MapPinned size={13} className="text-secondary" />
                  Bản đồ du lịch trực quan
                </div>
                <div className="pointer-events-auto flex flex-col gap-2">
                  {['+', '−'].map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="text-secondary rounded-[13px] text-[16px] font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/map');
                      }}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Decorative pins – TODO: replace with real POI markers from tourism-points API */}
              {[
                { left: '44%', top: '32%', bg: 'var(--quinary)' },
                { left: '61%', top: '46%', bg: 'var(--secondary)' },
                { left: '33%', top: '55%', bg: 'var(--tertiary)' },
                { left: '52%', top: '67%', bg: 'var(--quaternary)' },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute flex h-11 w-11 items-center justify-center rounded-[50%_50%_50%_8px] shadow-[0_8px_20px_rgba(0,0,0,.22)]"
                  style={{
                    left: p.left,
                    top: p.top,
                    background: p.bg,
                    transform: 'rotate(-45deg)',
                  }}
                >
                  <MapPin size={14} className="text-white" style={{ transform: 'rotate(45deg)' }} />
                </div>
              ))}

              {/* Map info */}
              {/* TODO: '65%' crowd load & '4 tuyến' are mock – replace with live crowd-density API */}
              <div className="bg-card/96 absolute right-[18px] bottom-[18px] left-[18px] rounded-[24px] p-4 shadow-[var(--ambient-shadow-strong)]">
                <h3 className="text-foreground mb-2 text-[15px] font-black">Trạng thái điểm đến</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: '65%', label: 'Tải khách TB' },
                    { val: `AQI ${weatherOverview?.aqiValue ?? '--'}`, label: t(aqiMeta.labelKey) },
                    { val: '4 tuyến', label: 'Đang gợi ý' },
                  ].map((cell) => (
                    <div key={cell.label} className="bg-muted rounded-[14px] p-2.5">
                      <strong className="text-foreground block text-[15px] font-black">
                        {cell.val}
                      </strong>
                      <span className="text-muted-foreground text-[12px] font-bold">
                        {cell.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side stack */}
            <div className="flex flex-col gap-4">
              {/* Weather */}
              <div
                className={glassCard}
                style={{ background: 'linear-gradient(135deg,#fff7dc,var(--card))' }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-foreground flex items-center gap-2 text-[17px] font-black">
                    <CloudSun size={16} className="text-secondary" />
                    {t('home.weather_card.title')}
                  </h3>
                  <span className="h-[11px] w-[11px] rounded-full bg-[#22c55e] shadow-[0_0_0_6px_rgba(34,197,94,.13)]" />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <strong className="text-tertiary text-[38px] font-black">
                    {weather ? formatTemperature(weather?.main?.temp) : '--'}
                  </strong>
                  <Sun size={42} className="text-tertiary" />
                </div>
                <p className="text-muted-foreground mb-3 text-[12px]">{weatherSummary}</p>
                <div className="grid gap-2">
                  {[
                    {
                      icon: <Droplets size={12} className="text-primary" />,
                      label: t('home.weather_card.humidity'),
                      val: weather ? formatHumidity(weather?.main?.humidity) : '--',
                    },
                    {
                      icon: <Wind size={12} className="text-secondary" />,
                      label: t('home.weather_card.wind'),
                      val: weather ? formatWindSpeedKph(weather?.wind?.speed) : '--',
                    },
                    {
                      icon: <img src={aqiMeta.iconSrc} alt="" className="h-3 w-3 object-contain" />,
                      label: t('home.weather_card.aqi'),
                      val: `${weatherOverview?.aqiValue ?? '--'} · ${t(aqiMeta.labelKey)}`,
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="bg-muted text-muted-foreground flex items-center justify-between rounded-[16px] px-3 py-2.5 text-[12px] font-bold"
                    >
                      <span className="flex items-center gap-1.5">
                        {row.icon}
                        {row.label}
                      </span>
                      <strong className="text-foreground">{row.val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events */}
              <div className={glassCard}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-foreground flex items-center gap-2 text-[17px] font-black">
                    <Bell size={16} className="text-secondary" />
                    {t('home.festivals_card.title')}
                  </h3>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="bg-quinary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                    <span className="bg-quinary relative inline-flex h-2.5 w-2.5 rounded-full" />
                  </span>
                </div>
                <div className="grid gap-2.5">
                  {heroEvents.slice(0, 2).map((event, i) => (
                    <div
                      key={`${event.title}-${i}`}
                      className="bg-muted rounded-[16px] px-3 py-2.5"
                    >
                      <span className="text-foreground line-clamp-1 block text-[13px] leading-snug font-bold">
                        {event.title}
                      </span>
                      <span className="text-muted-foreground text-[12px] font-bold">
                        {event.time}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full rounded-[14px]"
                  onClick={() => navigate('/festival')}
                >
                  {t('home.festivals_card.cta')}
                </Button>
              </div>

              {/* AI Chatbot */}
              {/* TODO: wire up AI chatbot – prompt text and online indicator are currently mock */}
              <div className={glassCard}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-foreground flex items-center gap-2 text-[17px] font-black">
                    <Bot size={16} className="text-secondary" />
                    AI Chatbot
                  </h3>
                  <span className="bg-secondary h-[11px] w-[11px] rounded-full shadow-[0_0_0_6px_var(--secondary-soft)]" />
                </div>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  "Gợi ý cho tôi lịch trình 1 ngày, tránh điểm đang quá tải và ưu tiên ẩm thực địa
                  phương."
                </p>
                {/* TODO: add input field + send button to open AI chat panel */}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full rounded-[14px]"
                  onClick={() => navigate('/map')}
                >
                  Mở chat AI
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURE GRID
        ══════════════════════════════════════════ */}
        <section style={sectionPad}>
          <div className={sectionHead}>
            <div>
              <p className={sectionSmall}>{t('home.quick_access.label')}</p>
              <h2 className={sectionH2} style={{ fontSize: 'clamp(26px,3vw,42px)' }}>
                {t('home.quick_access.title')}
              </h2>
            </div>
            <Button
              variant="outline"
              className="h-10 rounded-full"
              onClick={() => navigate('/map')}
            >
              Xem toàn bộ chức năng
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_CARDS.map((card, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                onClick={() => navigate(card.path)}
                className={`border-border bg-card relative h-auto min-h-[188px] w-full overflow-hidden rounded-[26px] p-[22px] text-left shadow-[var(--ambient-shadow)] ${cardHover}`}
              >
                <div
                  className="absolute -top-7 -right-7 h-24 w-24 rounded-full opacity-[.06]"
                  style={{ background: card.bg }}
                />
                <div
                  className="mb-3.5 flex h-[54px] w-[54px] items-center justify-center rounded-[19px] text-white"
                  style={{ background: card.bg }}
                >
                  {card.icon}
                </div>
                <h3 className="text-foreground mb-2 text-[17px] font-black">{card.title}</h3>
                <p className="text-muted-foreground text-[13px] leading-[1.65]">{card.desc}</p>
              </Button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            DESTINATIONS + ITINERARY
        ══════════════════════════════════════════ */}
        <section style={sectionPad} id="destinations">
          <div className={sectionHead}>
            <div>
              <p className={sectionSmall}>{t('home.featured_destinations.label')}</p>
              <h2 className={sectionH2} style={{ fontSize: 'clamp(26px,3vw,42px)' }}>
                {t('home.featured_destinations.title')}
              </h2>
            </div>
            <Button
              className="h-10 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg,#10b981,#0b66c3)' }}
              onClick={() => navigate('/map')}
            >
              <Compass size={14} /> Mở bản đồ đầy đủ
            </Button>
          </div>

          {/* Masonry */}
          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            {/* Destination grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Big card */}
              {featuredSpots[0] && (
                <article
                  className={`border-border bg-card col-span-1 overflow-hidden rounded-[26px] border shadow-[var(--ambient-shadow)] sm:col-span-2 sm:grid sm:grid-cols-[.9fr_1.1fr] ${cardHover}`}
                >
                  <div
                    className="relative min-h-[200px] bg-cover bg-center sm:min-h-[290px]"
                    style={{
                      backgroundImage: `url('${featuredSpots[0].image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80'}')`,
                    }}
                  >
                    <span className="bg-card/92 text-secondary absolute top-3 left-3 rounded-full px-3 py-1.5 text-[12px] font-black">
                      {featuredSpots[0].subtitle || featuredSpots[0].province}
                    </span>
                    {featuredSpots[0].rating && (
                      <span className="bg-card/92 text-foreground absolute top-3 right-3 rounded-full px-3 py-1.5 text-[12px] font-black">
                        ⭐ {featuredSpots[0].rating}
                      </span>
                    )}
                  </div>
                  <div className="p-[17px]">
                    <h3 className="text-foreground mb-2 text-[18px] font-black">
                      {featuredSpots[0].name}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3 text-[13px] leading-[1.6]">
                      {featuredSpots[0].description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <Button size="sm" onClick={() => handleOpenPointDetail(featuredSpots[0])}>
                        {t('home.featured_destinations.detail_cta')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenPointOnMap(featuredSpots[0])}
                      >
                        {t('common.map')}
                      </Button>
                    </div>
                  </div>
                </article>
              )}

              {/* Smaller cards */}
              {featuredSpots.slice(1, 3).map((item) => (
                <article
                  key={item.id}
                  className={`border-border bg-card overflow-hidden rounded-[26px] border shadow-[var(--ambient-shadow)] ${cardHover}`}
                >
                  <div
                    className="relative min-h-[175px] bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${item.image || 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=900&q=80'}')`,
                    }}
                  >
                    <span className="bg-card/92 text-secondary absolute top-3 left-3 rounded-full px-3 py-1.5 text-[12px] font-black">
                      {item.subtitle || item.province}
                    </span>
                  </div>
                  <div className="p-[17px]">
                    <h3 className="text-foreground mb-2 text-[18px] font-black">{item.name}</h3>
                    <p className="text-muted-foreground mb-3 line-clamp-2 text-[13px] leading-[1.6]">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-[12px] font-bold">
                        {item.rating ? `⭐ ${item.rating}` : ''}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleOpenPointDetail(item)}>
                          Chi tiết
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenPointOnMap(item)}
                        >
                          {t('common.map')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Itinerary panel */}
            <aside className="border-border bg-card rounded-[30px] border p-5 shadow-[var(--ambient-shadow-strong)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-foreground flex items-center gap-2 text-[17px] font-black">
                  <Route size={16} className="text-secondary" />
                  {t('home.itinerary_section.title')}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-[12px]"
                  onClick={() => navigate('/tour')}
                >
                  Tạo mới
                </Button>
              </div>

              {/* TODO: ITINERARY_ITEMS is static mock data – replace with user's saved itinerary from API */}
              <div className="grid gap-3.5">
                {ITINERARY_ITEMS.slice(0, 4).map((item, i) => (
                  <div key={`${item.time}-${i}`} className="grid grid-cols-[64px_1fr] gap-3">
                    <div className="rounded-[14px] bg-(--secondary-soft) px-2 py-2.5 text-center">
                      <span className="text-secondary block text-[12px] font-black">
                        {item.time}
                      </span>
                    </div>
                    <div className="border-border bg-muted rounded-[18px] border p-3">
                      <h4 className="text-foreground text-[14px] font-black">{item.activity}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured tour */}
              {featuredTour && (
                <div className="border-border bg-muted mt-4 rounded-[18px] border p-3.5">
                  <p className="text-secondary mb-0.5 text-[11px] font-black tracking-wider uppercase">
                    {t('home.tour_section.label')}
                  </p>
                  <h4 className="text-foreground line-clamp-2 text-[14px] leading-snug font-black">
                    {featuredTour.name}
                  </h4>
                  <div className="text-muted-foreground mt-2 flex items-center justify-between text-[12px]">
                    <span>
                      {featuredTour.duration_days
                        ? `${featuredTour.duration_days} ${t('home.tour_section.days')}`
                        : ''}
                    </span>
                    <span className="text-secondary font-black">
                      {featuredTour.price_from_vnd
                        ? formatVND(Number(featuredTour.price_from_vnd))
                        : t('home.tour_section.contact')}
                    </span>
                  </div>
                  <Button
                    className="mt-2.5 w-full rounded-[12px] text-white"
                    style={{ background: 'linear-gradient(135deg,#10b981,#0b66c3)' }}
                    onClick={() => handleOpenTourOnMap(featuredTour)}
                  >
                    {t('home.tour_section.view_map')}
                  </Button>
                </div>
              )}
            </aside>
          </div>

          {/* VR Banner */}
          <div
            className="mt-5 grid items-center gap-5 overflow-hidden rounded-[32px] p-[34px] shadow-[var(--ambient-shadow-strong)] lg:grid-cols-[1fr_auto]"
            style={{
              background:
                "linear-gradient(135deg,rgba(16,185,129,.94),rgba(11,102,195,.9)),url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80') center/cover",
              color: '#fff',
            }}
          >
            <div>
              <h2 className="mb-2.5 flex items-center gap-2.5 text-[28px] leading-snug font-black sm:text-[30px]">
                <Compass size={26} />
                Trải nghiệm VR 360 &amp; bản đồ toàn cảnh
              </h2>
              <p className="max-w-2xl text-[15px] leading-[1.65] opacity-90">
                Xem ảnh, video 360, thuyết minh điểm đến, chọn điểm bằng hotspot và chuyển cảnh trực
                tiếp trên bản đồ toàn cảnh.
              </p>
            </div>
            <Button
              className="bg-card text-secondary hover:bg-card/90 h-12 shrink-0 rounded-full px-6 text-[14px] font-black"
              onClick={() => navigate('/vr360')}
            >
              <Play size={15} /> Khám phá VR
            </Button>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            ROLE SECTION
        ══════════════════════════════════════════ */}
        <section style={sectionPad}>
          <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
            {/* Role intro */}
            <div
              className="rounded-[32px] p-[30px] text-white shadow-[var(--ambient-shadow-strong)]"
              style={{ background: 'linear-gradient(135deg,#083d4d,#10b981)' }}
            >
              <Badge className="mb-3 gap-1.5 border border-white/25 bg-white/15 text-[12px] text-white">
                <Users size={12} /> Phân hệ người dùng
              </Badge>
              <h2 className="mb-3 text-[30px] leading-[1.2] font-black sm:text-[34px]">
                Bố cục phục vụ đồng thời du khách, doanh nghiệp và nhà quản lý
              </h2>
              <p className="text-[14px] leading-[1.7] text-white/85">
                Trang chủ không chỉ giới thiệu điểm đến mà còn dẫn người dùng vào đúng phân hệ: tra
                cứu, đăng tin dịch vụ, nhận phản ánh, quản lý cảnh báo và xem báo cáo.
              </p>
            </div>

            {/* Role grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ROLE_CARDS.map((role, i) => (
                <div
                  key={i}
                  className="border-border bg-card rounded-[26px] border p-5 shadow-[var(--ambient-shadow)]"
                >
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-[17px] text-white"
                    style={{ background: role.bg }}
                  >
                    {role.icon}
                  </div>
                  <h3 className="text-foreground mb-2 text-[17px] font-black">{role.title}</h3>
                  <ul
                    className="text-muted-foreground space-y-0.5 pl-4 text-[13px] leading-[1.8]"
                    style={{ listStyleType: 'disc' }}
                  >
                    {role.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            NEWS + VLOG
        ══════════════════════════════════════════ */}
        <section style={sectionPad} id="news">
          <div className={sectionHead}>
            <div>
              <p className={sectionSmall}>{t('home.news_section.label')}</p>
              <h2 className={sectionH2} style={{ fontSize: 'clamp(26px,3vw,42px)' }}>
                {t('home.news_section.title')}
              </h2>
            </div>
            <Button
              variant="outline"
              className="h-10 rounded-full"
              onClick={() => navigate('/news')}
            >
              <FileText size={14} /> Xem tất cả tin
            </Button>
          </div>

          {/* Content hub */}
          <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
            {/* News grid 2×2 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {newsList.map((item) => (
                <Button
                  key={item.id}
                  asChild
                  variant="outline"
                  className={`border-border bg-card h-auto w-full rounded-[24px] p-0 shadow-[var(--ambient-shadow)] ${cardHover}`}
                >
                  <article
                    onClick={() => handleOpenNewsDetail(item)}
                    className="grid grid-cols-1 gap-3.5 p-4 text-left sm:grid-cols-[130px_1fr]"
                  >
                    <div
                      className="h-[115px] rounded-[18px] bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${
                          item.thumbnail_url
                            ? withBaseUrl(item.thumbnail_url)
                            : 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'
                        }')`,
                      }}
                    />
                    <div className="min-w-0">
                      <small className="text-tertiary text-[12px] font-black">
                        {formatNewsDate(item.published_at || item.created_at, locale)}
                      </small>
                      <h3 className="text-foreground mt-1.5 mb-1.5 line-clamp-2 text-[15px] leading-[1.45] font-black">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 text-[12px] leading-[1.55]">
                        {item.summary}
                      </p>
                    </div>
                  </article>
                </Button>
              ))}
            </div>

            {/* Vlog panel */}
            <aside className="border-border from-card rounded-[28px] border bg-gradient-to-b to-(--tertiary-soft)/30 p-[22px] shadow-[var(--ambient-shadow-strong)]">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-foreground flex items-center gap-2 text-[17px] font-black">
                  <Play size={15} className="text-tertiary" />
                  {t('home.vlog_section.title')}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-[12px]"
                  onClick={() => navigate('/news')}
                >
                  Xem thêm
                </Button>
              </div>
              <p className="text-muted-foreground mb-4 text-[13px] leading-[1.7]">
                {t('home.vlog_section.description')}
              </p>

              {/* Video thumb – TODO: replace mock image with real vlog thumbnail from API */}
              <Button
                type="button"
                variant="ghost"
                className="h-[200px] w-full rounded-[22px] text-white shadow-[var(--ambient-shadow)]"
                style={{
                  background: `linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.55)),url('${VLOG_STORIES[0]?.image || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80'}') center/cover`,
                }}
                onClick={() => navigate('/vr360')}
              >
                <Play size={52} />
              </Button>

              {VLOG_STORIES[0] && (
                <div className="mt-3">
                  <p className="text-muted-foreground text-[12px]">
                    {t('home.vlog_section.author_prefix')} {VLOG_STORIES[0].author}
                  </p>
                  <h4 className="text-foreground mt-0.5 text-[14px] leading-snug font-black">
                    {VLOG_STORIES[0].title}
                  </h4>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            VOUCHERS
        ══════════════════════════════════════════ */}
        {nearbyVouchers.length > 0 && (
          <section style={sectionPad} id="services">
            <div className={sectionHead}>
              <div>
                <p className={sectionSmall}>{t('home.vouchers_section.label')}</p>
                <h2 className={sectionH2} style={{ fontSize: 'clamp(26px,3vw,42px)' }}>
                  {t('home.vouchers_section.title')}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyVouchers.map((voucher) => (
                <article
                  key={voucher.id}
                  className={`border-border bg-card overflow-hidden rounded-[26px] border shadow-[var(--ambient-shadow)] ${cardHover}`}
                >
                  <div className="bg-primary-soft flex items-start justify-between gap-3 px-4 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground truncate text-[12px]">
                        {voucher.business_name}
                      </p>
                      <h3 className="text-foreground mt-0.5 line-clamp-1 text-[17px] font-black">
                        {voucher.title_vi}
                      </h3>
                    </div>
                    <Badge
                      variant="default"
                      className="shrink-0 rounded-full text-[12px] font-black whitespace-nowrap"
                    >
                      {formatVoucherDiscount(voucher)}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="border-border bg-muted text-secondary mb-3 rounded-[10px] border py-2 text-center font-mono text-[13px] font-black tracking-wider">
                      {voucher.code}
                    </div>
                    <div className="grid gap-1.5 text-[12px]">
                      {voucher.min_order_value && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {t('home.vouchers_section.min_order')}
                          </span>
                          <span className="text-foreground font-bold">
                            {formatVND(Number(voucher.min_order_value))}
                          </span>
                        </div>
                      )}
                      {voucher.valid_until && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {t('home.vouchers_section.valid_until')}
                          </span>
                          <span className="text-foreground font-bold">
                            {formatNewsDate(voucher.valid_until, locale)}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full rounded-[12px]"
                      onClick={() => navigate('/map')}
                    >
                      {t('home.vouchers_section.view_map')}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════
            OCOP PRODUCTS
        ══════════════════════════════════════════ */}
        {ocopProducts.length > 0 && (
          <section style={sectionPad} id="ocop">
            <div className={sectionHead}>
              <div>
                <p className={sectionSmall}>{t('home.ocop_section.label')}</p>
                <h2 className={sectionH2} style={{ fontSize: 'clamp(26px,3vw,42px)' }}>
                  {t('home.ocop_section.title')}
                </h2>
              </div>
              <Button
                variant="outline"
                className="h-10 rounded-full"
                onClick={() => navigate('/ocop')}
              >
                <ShoppingBasket size={14} /> Xem tất cả OCOP
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ocopProducts.map((product) => (
                <article
                  key={product.id}
                  className={`border-border bg-card overflow-hidden rounded-[26px] border shadow-[var(--ambient-shadow)] ${cardHover}`}
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
                    <div className="text-muted-foreground mb-2 flex items-center gap-2 text-[12px]">
                      <span>{product.province_name || '--'}</span>
                      {product.star_rating && (
                        <span>{'⭐'.repeat(Number(product.star_rating))}</span>
                      )}
                    </div>
                    <h3 className="text-foreground truncate text-[17px] font-black">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 line-clamp-2 text-[13px] leading-[1.6]">
                      {product.description || ''}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <strong className="text-secondary text-[15px] font-black">
                        {product.price_vnd ? formatVND(Number(product.price_vnd)) : '--'}
                      </strong>
                      {product.unit && (
                        <span className="text-muted-foreground text-[12px]">/ {product.unit}</span>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-[12px]"
                        onClick={() => navigate('/ocop')}
                      >
                        {t('home.ocop_section.view_product')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-[12px]"
                        onClick={() => navigate('/ocop')}
                      >
                        {t('home.ocop_section.contact')}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer
          className="mt-5 grid gap-6 text-[#d9f6f3]"
          style={{
            background: '#083d4d',
            padding: '34px 5vw',
            gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
          }}
        >
          <div>
            <h3 className="mb-2 text-[17px] font-black text-white">SmartTour WebGIS</h3>
            <p className="text-[13px] leading-[1.8] text-[#b8d6d4]">
              {t('home.footer_section.brand')}
            </p>
          </div>
          {[
            {
              title: 'Du khách',
              links: [
                { label: t('common.map'), path: '/map' },
                { label: 'Lịch trình', path: '/tour' },
                { label: 'VR 360', path: '/vr360' },
              ],
            },
            {
              title: 'Doanh nghiệp',
              links: [
                { label: 'Đăng tin dịch vụ', path: '/map' },
                { label: 'Quản lý phản hồi', path: '/map' },
                { label: 'Tạo voucher', path: '/map' },
              ],
            },
            {
              title: 'Nhà quản lý',
              links: [
                { label: 'Dashboard thống kê', path: '/map' },
                { label: t('common.tourism_points'), path: '/tourism-point' },
                { label: 'OCOP', path: '/ocop' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="mb-2 text-[15px] font-black text-white">{col.title}</h3>
              {col.links.map((lnk) => (
                <Button
                  key={lnk.label}
                  variant="link"
                  className="block h-auto p-0 text-[13px] leading-[1.8] text-[#b8d6d4] hover:text-white"
                  onClick={() => navigate(lnk.path)}
                >
                  {lnk.label}
                </Button>
              ))}
            </div>
          ))}
        </footer>
      </div>
    </RootLayout>
  );
}
