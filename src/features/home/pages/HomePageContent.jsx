import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CloudRain,
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

function formatNewsDate(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '--';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(d);
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
      className="mb-1 text-xs font-bold tracking-widest uppercase"
      style={{ color: color || 'var(--primary)' }}
    >
      {children}
    </p>
  );
}

export default function HomePageContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);

  const container = 'mx-auto w-full max-w-[1320px] px-4 sm:px-6';
  const card =
    'rounded-[24px] border border-[#cbdced] bg-card shadow-[0_14px_34px_rgba(0,83,161,0.10)]';

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

  const heroEvents = useMemo(() => {
    const festivals = normalizeFestivalListPayload(festivalsData, { lang });
    if (festivals.length === 0) return HERO_EVENTS;
    const locale = getLocaleFromLanguage(lang);
    return festivals.slice(0, 3).map((f) => ({
      title: f.name,
      time: formatFestivalDateRange(f.start_date, f.end_date, locale),
    }));
  }, [festivalsData, lang, HERO_EVENTS]);

  const {
    data: homeSearchData,
    isLoading: isHomeSearchLoading,
    isFetching: isHomeSearchFetching,
  } = useSearchSpotsQuery(
    { search: debouncedKeyword, page: 1, limit: 8, status: 'active', sortBy: 'created_at', sortOrder: 'DESC' },
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
      subtitle: s.category_name || '',
      description: s.description || '',
      image: (s.primary_image || s.primary_image_url)
        ? withBaseUrl(s.primary_image || s.primary_image_url)
        : '',
      province: s.province_name || s.address || '',
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
    if (!isConfigured) return 'Chưa cấu hình OpenWeather API.';
    if (isWeatherLoading) return 'Đang cập nhật dữ liệu thời tiết thực tế...';
    if (isWeatherError || !weather) return 'Không thể tải dữ liệu thời tiết lúc này.';
    return weatherDescription || 'Điều kiện thời tiết hiện tại đã được cập nhật.';
  })();

  const statGradients = [
    'linear-gradient(135deg, #0b74bd, #064f8e)',
    'linear-gradient(135deg, #21a77e, #08775a)',
    'linear-gradient(135deg, #ee9b2f, #c96a13)',
    'linear-gradient(135deg, #d95733, #a92c17)',
  ];

  const eventColors = [
    'border-l-[5px] border-primary bg-primary/10',
    'border-l-[5px] border-secondary bg-secondary/10',
    'border-l-[5px] border-tertiary bg-tertiary/10',
  ];

  const qlColors = [
    { gradient: 'linear-gradient(135deg, #0b74bd, #064f8e)', hover: 'hover:border-primary/50' },
    { gradient: 'linear-gradient(135deg, #6f61e8, #493bc7)', hover: 'hover:border-quinary/50' },
    { gradient: 'linear-gradient(135deg, #21a77e, #08775a)', hover: 'hover:border-secondary/50' },
    { gradient: 'linear-gradient(135deg, #ee9b2f, #c96a13)', hover: 'hover:border-tertiary/50' },
    { gradient: 'linear-gradient(135deg, #d95733, #a92c17)', hover: 'hover:border-quaternary/50' },
  ];

  return (
    <RootLayout>
      <div className="bg-background py-6 space-y-6">

        {/* ─── Hero + Sidebar ─── */}
        <section className="w-full">
          <div className={container}>
            <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">

              {/* Hero banner */}
              <div
                className="relative min-h-[560px] overflow-hidden rounded-[28px] shadow-[0_14px_34px_rgba(0,83,161,0.14)] flex flex-col justify-between p-8 sm:p-10 text-white"
                style={{
                  background:
                    'linear-gradient(90deg,rgba(4,39,66,.88) 0%,rgba(4,39,66,.54) 55%,rgba(4,39,66,.18) 100%), url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80") center/cover',
                }}
              >
                <div>
                  <span className="inline-flex rounded-full border border-white/35 bg-white/16 px-3.5 py-2 text-sm font-bold backdrop-blur-sm mb-5">
                    Cổng thông tin du lịch tích hợp bản đồ GIS, thời tiết, VR360 và gợi ý hành trình
                  </span>
                  <h1 className="max-w-3xl text-[clamp(30px,4vw,48px)] font-black leading-[1.16] tracking-[-1.4px]">
                    Khám phá điểm đến đẹp hơn, trực quan hơn và dễ chọn hành trình hơn.
                  </h1>
                  <p className="mt-4 max-w-2xl text-white/90 text-sm sm:text-base leading-relaxed">
                    Trang chủ được thiết kế theo hướng sáng, rõ và giàu thông tin thực tế: điểm đến,
                    sự kiện, tour, ẩm thực, OCOP, bản đồ số và nội dung cộng đồng.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      className="rounded-full h-11 px-5 font-bold shadow-md"
                      onClick={() => navigate('/map')}
                    >
                      Khám phá bản đồ GIS
                    </Button>
                    <Button
                      variant="quinary"
                      className="rounded-full h-11 px-5 font-bold shadow-md"
                      onClick={() => navigate('/vr360')}
                    >
                      Trải nghiệm VR360
                    </Button>
                    <Button
                      variant="gold"
                      className="rounded-full h-11 px-5 font-bold shadow-md"
                      onClick={() => navigate('/tourism-point')}
                    >
                      Xem điểm nổi bật
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  {/* Search */}
                  <div className="relative max-w-3xl rounded-[22px] bg-white/92 shadow-[0_10px_28px_rgba(0,0,0,.18)] px-5 py-4 text-[#22364d]">
                    <label className="text-[#667085] text-xs font-semibold block mb-1.5">
                      Tìm kiếm điểm đến, dịch vụ, sự kiện...
                    </label>
                    <div className="relative flex items-center">
                      <Search className="absolute left-0 h-4 w-4 text-[#667085]" />
                      <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
                        placeholder="Ví dụ: Tràng An, Hoa Lư, Bái Đính..."
                        className="border-0 bg-transparent pl-6 pr-7 py-0 h-auto shadow-none focus-visible:ring-0 font-semibold text-sm text-[#22364d]"
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
                      <div className="absolute right-0 bottom-full left-0 z-30 mb-2 max-h-72 overflow-auto rounded-xl border border-border bg-card shadow-lg">
                        {isHomeSearchLoading || isHomeSearchFetching ? (
                          <div className="flex items-center justify-center px-3 py-6">
                            <LoadingInline size="small" />
                          </div>
                        ) : homeSearchResults.length === 0 ? (
                          <div className="flex flex-col items-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                            <MapPin className="h-5 w-5 opacity-70" />
                            <p>{t('mapPage.toolbar.searchNoResult', { defaultValue: 'No matching destination found.' })}</p>
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
                                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                <div className="min-w-0 flex-1 text-left">
                                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                                  <p className="truncate text-sm text-muted-foreground">{item.address || t('mapPage.destination.noAddress', { defaultValue: 'No address' })}</p>
                                </div>
                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
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
                        className="rounded-[18px] p-4 shadow-md min-h-[86px]"
                        style={{ background: statGradients[i % statGradients.length] }}
                      >
                        <span className="text-sm font-bold text-white/92">{stat.label}</span>
                        <strong className="block mt-1.5 text-[23px] font-black text-white">{stat.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">

                {/* Weather card */}
                <div className={`${card} p-5`}>
                  <SectionLabel>Thời tiết nhanh</SectionLabel>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-foreground text-xl font-bold">
                        {weather?.name || 'Thành Phố Ninh Bình'}
                      </h2>
                      <p className="text-muted-foreground mt-1 text-sm">{weatherSummary}</p>
                    </div>
                    <div className="text-primary text-[44px] font-black shrink-0">
                      {weather ? formatTemperature(weather?.main?.temp) : '--'}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    <div className="flex items-center justify-between rounded-[14px] bg-primary/8 px-3.5 py-2.5">
                      <span className="flex items-center gap-2 text-sm font-semibold text-primary/80">
                        <Wind size={14} /> Gió
                      </span>
                      <strong className="text-sm text-primary">
                        {weather ? formatWindSpeedKph(weather?.wind?.speed) : '--'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between rounded-[14px] bg-gold/10 px-3.5 py-2.5">
                      <span className="flex items-center gap-2 text-sm font-semibold text-gold opacity-80">
                        <Sun size={14} /> AQI
                      </span>
                      <strong className="text-sm text-gold">
                        {weatherOverview?.aqiValue ?? '--'} · {t(aqiMeta.labelKey)}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between rounded-[14px] bg-secondary/8 px-3.5 py-2.5">
                      <span className="flex items-center gap-2 text-sm font-semibold text-secondary opacity-80">
                        <CloudRain size={14} /> Độ ẩm
                      </span>
                      <strong className="text-sm text-secondary">
                        {weather ? formatHumidity(weather?.main?.humidity) : '--'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Events card */}
                <div className={`${card} relative overflow-hidden p-5`}
                  style={{ background: 'linear-gradient(135deg, #fff 0%, #fff7ed 100%)' }}
                >
                  <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-40 bg-tertiary" />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <Sparkles size={13} className="text-tertiary animate-pulse" />
                      <SectionLabel color="var(--tertiary)">Lễ hội theo mùa</SectionLabel>
                      <span className="relative flex h-2 w-2 ml-1">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
                      </span>
                    </div>
                    <h2 className="text-foreground mt-2 text-xl font-bold">Sự kiện và lễ hội sắp diễn ra</h2>
                    <div className="mt-4 grid gap-2">
                      {heroEvents.map((event, i) => (
                        <div
                          key={`${event.title}-${i}`}
                          className={`${eventColors[i % eventColors.length]} flex flex-col gap-1 rounded-[16px] px-3.5 py-2.5`}
                        >
                          <span className="text-sm font-semibold">{event.title}</span>
                          <strong className="text-muted-foreground text-sm font-semibold">{event.time}</strong>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 w-full rounded-xl border-tertiary/40 text-tertiary hover:bg-tertiary/8"
                      onClick={() => navigate('/tourism-point')}
                    >
                      Xem điểm liên quan
                    </Button>
                  </div>
                </div>

                {/* Quick suggestions */}
                <div className={`${card} p-5`}>
                  <SectionLabel>Gợi ý nhanh</SectionLabel>
                  <h2 className="text-foreground mt-1 text-xl font-bold">Điểm nên xem trước khi đi</h2>
                  <div className="mt-4 grid gap-2">
                    {featuredSpots.slice(0, 3).map((item, i) => {
                      const colors = ['text-primary', 'text-secondary', 'text-tertiary'];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className="flex h-[42px] w-full items-center justify-between rounded-[14px] bg-muted/40 px-3.5 hover:bg-muted transition-colors"
                          onClick={() => navigate('/tourism-point')}
                        >
                          <span className="text-sm font-semibold text-foreground">{item.name}</span>
                          <span className={`text-sm font-bold ${colors[i % colors.length]}`}>Chi tiết</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Promo Banner ─── */}
        <section className="w-full">
          <div className={container}>
            <div
              className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border p-5"
              style={{
                borderColor: '#f1d8a4',
                background: 'linear-gradient(135deg, #fff8e8, #e8fbf5)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[17px] text-white text-xl shadow-md"
                  style={{ background: 'linear-gradient(135deg, #ee9b2f, #c96512)' }}
                >
                  <CalendarDays size={22} />
                </div>
                <div>
                  <p className="text-foreground font-bold">{PROMO_BANNER.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{PROMO_BANNER.description}</p>
                </div>
              </div>
              <Button className="rounded-full h-11 px-5 font-bold" onClick={() => navigate(PROMO_BANNER.path)}>
                {PROMO_BANNER.cta}
              </Button>
            </div>
          </div>
        </section>

        {/* ─── Quick Access Modules ─── */}
        <section className="w-full">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>Truy cập nhanh</SectionLabel>
              <h2 className="text-foreground text-2xl font-black mt-0.5">Các module chính của hệ thống</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Thiết kế lại để người dùng vào trang chủ là thấy ngay bản đồ, VR360, lịch trình, dịch vụ và OCOP.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {QUICK_LINKS.map((item, i) => {
                  const c = qlColors[i % qlColors.length];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`group flex flex-col items-start overflow-hidden rounded-[18px] border border-[#aac0d7] p-4 min-h-[96px] text-left bg-gradient-to-b from-white to-[#f8fbfe] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(7,78,135,.14)] ${c.hover}`}
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
                        <span className="text-sm font-black text-foreground truncate">{item.title}</span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Featured Destinations ─── */}
        <section className="w-full">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>Gợi ý nổi bật</SectionLabel>
              <h2 className="text-foreground text-2xl font-black mt-0.5">Điểm đến tiêu biểu đang được quan tâm</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Kết hợp hình ảnh lớn, thẻ trạng thái tải và nút hành động nhanh để đi từ trang chủ đến bản đồ hoặc trang chi tiết.
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
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-[#034f8d]">
                        {item.province}
                      </span>
                      {item.rating && (
                        <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black">
                          ⭐ {item.rating}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm font-semibold mb-1.5">{item.subtitle}</p>
                      <h3 className="text-foreground text-base font-black">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{item.description}</p>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="rounded-lg" onClick={() => navigate('/tourism-point')}>
                          Chi tiết
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => navigate('/map')}>
                          Bản đồ
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── News + Tour + Itinerary ─── */}
        <section className="w-full">
          <div className={container}>
            <div className="grid gap-5 lg:grid-cols-2">

              {/* News */}
              <div className={`${card} p-6`}>
                <SectionLabel>Tin tức ngắn</SectionLabel>
                <h2 className="text-foreground text-2xl font-black mt-0.5">Thông tin mới</h2>
                <div className="mt-5 grid gap-0">
                  {newsList.map((item, i) => (
                    <article
                      key={item.id}
                      className={`grid grid-cols-[46px_1fr] gap-3.5 py-3.5 ${i < newsList.length - 1 ? 'border-b border-dashed border-[#a9bdd2]' : ''}`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#e9f5fb] text-primary text-lg mt-0.5">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block rounded-full border border-[#a9bdd2] px-2.5 py-0.5 text-xs font-bold text-[#52647a] mb-1.5">
                          {formatNewsDate(item.published_at || item.created_at)}
                        </span>
                        <h4 className="text-foreground text-sm font-bold line-clamp-2">{item.title}</h4>
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.summary}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Tour + Itinerary */}
              <div className="flex flex-col gap-5">
                <div className={`${card} p-6`}>
                  <SectionLabel>Tour gợi ý</SectionLabel>
                  {featuredTour?.cover_image_url && (
                    <div className="mt-3 w-[55%] mx-auto h-[150px] overflow-hidden rounded-[18px]">
                      <img
                        src={withBaseUrl(featuredTour.cover_image_url)}
                        alt={featuredTour.name || ''}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
                      />
                    </div>
                  )}
                  <h3 className="text-foreground text-base font-black mt-3 line-clamp-2">
                    {featuredTour
                      ? (featuredTour.name || featuredTour.name_vi || 'Tour gợi ý')
                      : 'Tour Tràng An Classic – Đi Thuyền Qua 3 Tuyến Hang Động'}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                    {featuredTour
                      ? (featuredTour.description_vi || featuredTour.description_en || '')
                      : 'Khám phá Quần thể Di Tích Tràng An qua 3 tuyến du lịch nổi tiếng.'}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    <div className="rounded-[14px] border border-[#aac0d7] bg-muted/30 p-3">
                      <p className="text-sm font-black text-foreground">
                        {featuredTour?.duration_days ? `${featuredTour.duration_days} ngày` : '1 ngày'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">lịch trình</p>
                    </div>
                    <div className="rounded-[14px] border border-[#aac0d7] bg-muted/30 p-3">
                      <p className="text-sm font-black text-foreground">
                        {featuredTour?.price_from_vnd
                          ? formatVND(Number(featuredTour.price_from_vnd))
                          : 'Liên hệ'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">từ / khách</p>
                    </div>
                    <div className="rounded-[14px] border border-[#aac0d7] bg-muted/30 p-3">
                      <p className="text-sm font-black text-foreground">
                        {featuredTour?.rating_avg
                          ? `⭐ ${parseFloat(featuredTour.rating_avg).toFixed(1)}`
                          : '⭐ --'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {featuredTour?.rating_count ? `${featuredTour.rating_count} đánh giá` : 'đánh giá'}
                      </p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full rounded-xl" onClick={() => navigate('/map')}>
                    Xem tuyến trên bản đồ
                  </Button>
                </div>

                <div className={`${card} p-6`}>
                  <SectionLabel>Lịch trình cá nhân</SectionLabel>
                  <h2 className="text-foreground text-xl font-black mt-0.5">Lên kế hoạch chuyến đi trong 30 giây</h2>
                  <div className="mt-4 grid gap-2">
                    {ITINERARY_ITEMS.map((item) => (
                      <div
                        key={`${item.time}-${item.activity}`}
                        className="flex h-[42px] items-center justify-between rounded-[14px] bg-muted/40 px-3.5"
                      >
                        <span className="text-sm text-foreground">{item.activity}</span>
                        <strong className="text-sm text-foreground">{item.time}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Food Section ─── */}
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
                  <SectionLabel>Ẩm thực & trải nghiệm địa phương</SectionLabel>
                  <h2 className="text-foreground text-xl font-black mt-0.5">
                    Không chỉ xem bản đồ, người dùng còn có thể khám phá ẩm thực đặc sản.
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2">
                    Khối này được thiết kế lớn để tăng cảm hứng du lịch: món nổi bật, địa điểm ăn uống, từ khóa tìm nhanh và liên kết dịch vụ ngay trong trang chủ.
                  </p>
                  <div className="mt-4 mb-4 flex flex-wrap gap-2">
                    {FOOD_TAGS.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#9db8d2] bg-white px-3 py-1.5 text-sm font-bold text-[#42566f]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid gap-2">
                    {FOOD_BULLETS.map((item) => (
                      <div
                        key={item.label}
                        className="flex h-[42px] items-center justify-between rounded-[14px] bg-muted/40 px-3.5"
                      >
                        <span className="text-sm text-foreground">{item.label}</span>
                        <strong className="text-sm text-foreground">{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Vouchers ─── */}
        <section className="w-full" id="services">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>Doanh nghiệp du lịch</SectionLabel>
              <h2 className="text-foreground text-2xl font-black mt-0.5">Voucher đang có gần bạn</h2>
              <p className="text-muted-foreground text-sm mt-2">Voucher ưu đãi từ các doanh nghiệp du lịch trong khu vực.</p>

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
                          <p className="text-xs text-muted-foreground truncate">{voucher.business_name}</p>
                          <h3 className="text-sm font-black text-foreground mt-0.5 line-clamp-1">{voucher.title_vi}</h3>
                        </div>
                        <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-black text-white whitespace-nowrap">
                          {formatVoucherDiscount(voucher)}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="rounded-[10px] border border-[#9db8d2] bg-[#f8fbfe] py-2 text-center font-mono text-sm font-black tracking-wider text-primary mb-3">
                          {voucher.code}
                        </div>
                        <div className="grid gap-1.5">
                          {voucher.min_order_value && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Đơn tối thiểu</span>
                              <span className="text-xs font-semibold">{formatVND(Number(voucher.min_order_value))}</span>
                            </div>
                          )}
                          {voucher.valid_until && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Hạn sử dụng</span>
                              <span className="text-xs font-semibold">{formatNewsDate(voucher.valid_until)}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-4 w-full rounded-[10px]"
                          onClick={() => navigate('/map')}
                        >
                          Xem doanh nghiệp trên bản đồ
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Không có voucher nào trong khu vực hiện tại.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ─── OCOP Products ─── */}
        <section className="w-full" id="ocop">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>Sản phẩm OCOP</SectionLabel>
              <h2 className="text-foreground text-2xl font-black mt-0.5">Gian hàng địa phương tích hợp trên trang chủ</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Giới thiệu sản phẩm, chứng nhận, địa phương và liên kết đặt hàng ngay trong trang chủ.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {ocopProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[20px] border border-[#aac0d7] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(7,78,135,.14)]"
                  >
                    <div className="flex items-center justify-center py-4 px-6">
                      <img
                        src={withBaseUrl(product.cover_image_url)}
                        alt={product.name || ''}
                        className="h-[190px] w-[72%] object-cover rounded-[18px]"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
                      />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <span>{product.province_name || '--'}</span>
                        {product.star_rating && (
                          <span>{'⭐'.repeat(Number(product.star_rating))}</span>
                        )}
                      </div>
                      <h3 className="text-foreground text-base font-black">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{product.description || ''}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <strong className="text-foreground text-sm">
                          {product.price_vnd ? formatVND(Number(product.price_vnd)) : '--'}
                        </strong>
                        {product.unit && (
                          <span className="text-muted-foreground text-sm">/ {product.unit}</span>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="rounded-[10px]" onClick={() => navigate('/ocop')}>
                          Xem sản phẩm
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-[10px]" onClick={() => navigate('/ocop')}>
                          Liên hệ
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Vlog & Blog ─── */}
        <section className="w-full">
          <div className={container}>
            <div className={`${card} p-6`}>
              <SectionLabel>Vlog & chia sẻ</SectionLabel>
              <h2 className="text-foreground text-2xl font-black mt-0.5">Câu chuyện du lịch từ cộng đồng</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Tăng chiều sâu nội dung cộng đồng với trải nghiệm thực tế, mẹo di chuyển và gợi ý lên lịch trình.
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
                      onError={(e) => { e.target.onerror = null; e.target.src = placeholderImg; }}
                    />
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm mb-2">Tác giả: {story.author}</p>
                      <h3 className="text-foreground text-base font-black">{story.title}</h3>
                      <p className="text-muted-foreground text-sm mt-2">{story.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <section className="w-full pb-6">
          <div className={container}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#9db8d2] pt-5 text-sm text-[#33506d]">
              <p>Du lịch số Ninh Bình</p>
              <div className="flex items-center gap-1">
                {[
                  { label: 'Bản đồ', path: '/map' },
                  { label: 'VR360', path: '/vr360' },
                  { label: 'Điểm du lịch', path: '/tourism-point' },
                ].map((link, i, arr) => (
                  <React.Fragment key={link.path}>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm text-primary font-bold hover:underline"
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
