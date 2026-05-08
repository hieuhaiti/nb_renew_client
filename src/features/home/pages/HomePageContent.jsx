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
import trangAnVideo from '@/assets/videos/trang_an.mp4';
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
import { useLanguageStore } from '@/stores/useLanguageStore';
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

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <div>
        <p className="text-primary mb-1 text-sm font-semibold tracking-widest uppercase">
          {eyebrow}
        </p>
        <h2 className="text-foreground text-2xl font-bold sm:text-3xl">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLanguageStore((state) => state.lang);
  const sectionContainerClass = 'mx-auto w-full px-4 sm:px-6 lg:w-[75%] lg:px-0';
  const cardClass = 'rounded-3xl border border-border/60 bg-card shadow-sm';
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
    isLoading,
    isError,
    isConfigured,
  } = useWeatherOverview({
    lat: defaultLatLong.lat,
    lng: defaultLatLong.lng,
    lang,
  });

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
    return festivals.slice(0, 3).map((festival) => ({
      title: festival.name,
      time: formatFestivalDateRange(festival.start_date, festival.end_date, locale),
    }));
  }, [festivalsData, lang]);

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
    {
      enabled: debouncedKeyword.length >= 2,
    }
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
    const items = Array.isArray(raw) ? raw : (raw?.spots ?? raw?.items ?? []);
    if (items.length === 0) return FEATURED_DESTINATIONS;
    return items.map((s) => ({
      id: s.id,
      name: s.name,
      subtitle: s.category_name || '',
      description: s.description || '',
      image:
        s.primary_image || s.primary_image_url
          ? withBaseUrl(s.primary_image || s.primary_image_url)
          : '',
      province: s.province_name || s.address || '',
      rating: s.rating_avg ? parseFloat(s.rating_avg).toFixed(1) : null,
    }));
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

    navigate('/map', {
      state: {
        prefillKeyword,
        selectedSearchResult: result || null,
      },
    });
  };

  const weatherSummary = (() => {
    if (!isConfigured) {
      return 'Chưa cấu hình OpenWeather API.';
    }

    if (isLoading) {
      return 'Đang cập nhật dữ liệu thời tiết thực tế...';
    }

    if (isError || !weather) {
      return 'Không thể tải dữ liệu thời tiết lúc này.';
    }

    return weatherDescription || 'Điều kiện thời tiết hiện tại đã được cập nhật.';
  })();

  return (
    <RootLayout>
      <div className="bg-background space-y-7 py-4 lg:px-30 lg:py-6">
        <section className="w-full">
          <div className={sectionContainerClass}>
            <div className="grid gap-4 lg:grid-cols-5">
              <div className={`${cardClass} relative min-h-140 overflow-hidden lg:col-span-3`}>
                <video
                  src={trangAnVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/35 to-black/15" />

                <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
                  <div>
                    <span className="bg-primary/20 text-primary-foreground inline-flex rounded-full px-3 py-1 text-sm font-semibold">
                      Cổng thông tin du lịch tích hợp bản đồ GIS, thời tiết, VR360 và gợi ý hành
                      trình
                    </span>
                    <h1 className="dark text-foreground mt-4 max-w-3xl text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl">
                      Khám phá điểm đến đẹp hơn, trực quan hơn và dễ chọn hành trình hơn.
                    </h1>
                    <p className="dark text-foreground/85 mt-3 max-w-3xl text-sm leading-relaxed sm:text-base">
                      Trang chủ được tinh gọn theo hướng sáng, rõ và giàu thông tin thực tế: điểm
                      đến, sự kiện, tour, ẩm thực và nội dung cộng đồng.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button onClick={() => navigate('/map')} className="rounded-xl shadow-sm">
                        Khám phá bản đồ GIS
                      </Button>
                      <Button
                        variant="quinary"
                        onClick={() => navigate('/vr360')}
                        className="rounded-xl shadow-sm"
                      >
                        Trải nghiệm VR360
                      </Button>
                      <Button
                        variant="gold"
                        onClick={() => navigate('/tourism-point')}
                        className="rounded-xl shadow-sm"
                      >
                        Xem điểm nổi bật
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative rounded-xl border border-(--glass-border-strong) bg-(--glass-bg-strong) p-2.5">
                      <label className="text-muted-foreground block text-sm font-semibold">
                        Tìm kiếm điểm đến, dịch vụ, sự kiện...
                      </label>
                      <Search className="text-muted-foreground pointer-events-none absolute top-[30px] left-2.5 h-3.5 w-3.5" />
                      <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => {
                          setTimeout(() => {
                            setIsSearchFocused(false);
                          }, 120);
                        }}
                        placeholder="Ví dụ: Tràng An, Hoa Lư, Bái Đính..."
                        className="text-foreground mt-1 h-auto w-full border-0 bg-transparent py-0 pr-7 pl-6 text-sm shadow-none focus-visible:ring-0"
                      />
                      {keyword ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground absolute top-[24px] right-1.5 h-7 w-7"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => setKeyword('')}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}

                      {shouldShowSearchOverlay ? (
                        <div className="bg-card border-border absolute right-0 bottom-full left-0 z-30 mb-2 max-h-72 overflow-auto rounded-xl border shadow-lg">
                          {isHomeSearchLoading || isHomeSearchFetching ? (
                            <div className="flex items-center justify-center px-3 py-6">
                              <LoadingInline size="small" />
                            </div>
                          ) : homeSearchResults.length === 0 ? (
                            <div className="text-muted-foreground flex flex-col items-center gap-2 px-3 py-6 text-sm">
                              <MapPin className="h-5 w-5 opacity-70" />
                              <p>
                                {t('mapPage.toolbar.searchNoResult', {
                                  defaultValue:
                                    'No matching destination found for current filters.',
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
                                  onMouseDown={(event) => event.preventDefault()}
                                  onClick={() => handleGoMapWithSearch(item)}
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

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {HERO_STATS.map((stat, i) => {
                        const statColors = [
                          {
                            bg: 'bg-primary/80 border-primary/60',
                            label: 'text-primary-foreground/75',
                            value: 'text-primary-foreground',
                          },
                          {
                            bg: 'bg-secondary/80 border-secondary/60',
                            label: 'text-secondary-foreground/75',
                            value: 'text-secondary-foreground',
                          },
                          {
                            bg: 'bg-tertiary/80 border-tertiary/60',
                            label: 'text-tertiary-foreground/75',
                            value: 'text-tertiary-foreground',
                          },
                          {
                            bg: 'bg-quaternary/80 border-quaternary/60',
                            label: 'text-quaternary-foreground/75',
                            value: 'text-quaternary-foreground',
                          },
                          {
                            bg: 'bg-quinary/80 border-quinary/60',
                            label: 'text-quinary-foreground/75',
                            value: 'text-quinary-foreground',
                          },
                        ];
                        const c = statColors[i % statColors.length];
                        return (
                          <div
                            key={stat.label}
                            className={`rounded-2xl border ${c.bg} p-3 backdrop-blur-sm`}
                          >
                            <p className={`text-sm ${c.label}`}>{stat.label}</p>
                            <p className={`mt-1 text-lg font-bold ${c.value}`}>{stat.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:col-span-2">
                <div className={`${cardClass} p-5`}>
                  <p className="text-primary text-sm font-semibold tracking-widest uppercase">
                    Thời tiết nhanh
                  </p>
                  <div className="mt-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-foreground text-2xl font-bold">
                        {weather?.name || 'Ninh Bình hôm nay'}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {weatherSummary}
                      </p>
                    </div>
                    <div className="text-primary text-4xl font-extrabold">
                      {weather ? formatTemperature(weather?.main?.temp) : '--'}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    <div className="bg-primary/10 flex items-center justify-between rounded-xl px-3 py-2">
                      <span className="text-primary/80 inline-flex items-center gap-2 text-sm">
                        <Wind size={14} /> Gió
                      </span>
                      <strong className="text-primary text-sm">
                        {weather ? formatWindSpeedKph(weather?.wind?.speed) : '--'}
                      </strong>
                    </div>
                    <div className="bg-gold/10 flex items-center justify-between rounded-xl px-3 py-2">
                      <span className="text-gold inline-flex items-center gap-2 text-sm opacity-80">
                        <Sun size={14} /> AQI
                      </span>
                      <strong className="text-gold text-sm">
                        {weatherOverview?.aqiValue ?? '--'} · {t(aqiMeta.labelKey)}
                      </strong>
                    </div>
                    <div className="bg-secondary/10 flex items-center justify-between rounded-xl px-3 py-2">
                      <span className="text-secondary inline-flex items-center gap-2 text-sm opacity-80">
                        <CloudRain size={14} /> Độ ẩm
                      </span>
                      <strong className="text-secondary text-sm">
                        {weather ? formatHumidity(weather?.main?.humidity) : '--'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className={`${cardClass} relative overflow-hidden p-5`}>
                  <div className="bg-tertiary/20 pointer-events-none absolute -top-8 -right-8 h-28 w-28 animate-pulse rounded-full blur-2xl" />
                  <div className="bg-gold/20 pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 animate-pulse rounded-full blur-xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <Sparkles size={13} className="text-tertiary animate-pulse" />
                      <p className="text-tertiary text-sm font-semibold tracking-widest uppercase">
                        Lễ hội theo mùa
                      </p>
                      <span className="relative flex h-2 w-2">
                        <span className="bg-tertiary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                        <span className="bg-tertiary relative inline-flex h-2 w-2 rounded-full" />
                      </span>
                    </div>
                    <h3 className="text-foreground mt-2 text-2xl font-bold">
                      Sự kiện và lễ hội sắp diễn ra
                    </h3>
                    <div className="mt-4 grid gap-2">
                      {heroEvents.map((event, i) => {
                        const eventColors = [
                          'border-l-4 border-primary/70 bg-primary/10',
                          'border-l-4 border-secondary/70 bg-secondary/10',
                          'border-l-4 border-tertiary/70 bg-tertiary/10',
                        ];
                        return (
                          <div
                            key={`${event.title}-${event.time}`}
                            className={`${eventColors[i % eventColors.length]} flex flex-col items-start gap-1 rounded-xl px-3 py-2`}
                          >
                            <span className="text-sm font-medium">{event.title}</span>
                            <strong className="text-muted-foreground text-sm">{event.time}</strong>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      className="border-tertiary/40 text-tertiary hover:bg-tertiary/10 mt-4 w-full rounded-xl"
                      onClick={() => navigate('/tourism-point')}
                    >
                      Xem điểm liên quan
                    </Button>
                  </div>
                </div>

                <div className={`${cardClass} p-5`}>
                  <p className="text-primary text-sm font-semibold tracking-widest uppercase">
                    Gợi ý nhanh
                  </p>
                  <h3 className="text-foreground mt-2 text-2xl font-bold">
                    Điểm nên xem trước khi đi
                  </h3>
                  <div className="mt-4 grid gap-2">
                    {featuredSpots.slice(0, 3).map((item, i) => {
                      const detailColors = ['text-primary', 'text-secondary', 'text-tertiary'];
                      return (
                        <Button
                          key={item.id}
                          type="button"
                          variant="ghost"
                          className="bg-muted/40 hover:bg-muted flex h-auto w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors"
                          onClick={() => navigate('/tourism-point')}
                        >
                          <span className="text-sm font-medium">{item.name}</span>
                          <span
                            className={`${detailColors[i % detailColors.length]} text-sm font-semibold`}
                          >
                            Chi tiết
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className={sectionContainerClass}>
            <div className="border-primary/20 rounded-3xl border bg-linear-to-r from-(--surface-beach) via-(--surface-city) to-(--surface-nature) p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-tertiary text-tertiary-foreground flex h-11 w-11 items-center justify-center rounded-xl">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <p className="text-foreground font-bold">{PROMO_BANNER.title}</p>
                    <p className="text-muted-foreground text-sm">{PROMO_BANNER.description}</p>
                  </div>
                </div>
                <Button className="rounded-xl" onClick={() => navigate(PROMO_BANNER.path)}>
                  {PROMO_BANNER.cta}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-2">
          <div className={sectionContainerClass}>
            <div className={cardClass + ' p-5 sm:p-6'}>
              <SectionHeader
                eyebrow="Truy cập nhanh"
                title="Các module chính của hệ thống"
                description="Thiết kế lại để người dùng vào trang chủ là thấy ngay bản đồ, VR360, lịch trình, dịch vụ và OCOP."
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {QUICK_LINKS.map((item, i) => {
                  const qlColors = [
                    {
                      iconBg: 'bg-primary/10',
                      iconText: 'text-primary',
                      hoverBorder: 'hover:border-primary/40',
                    },
                    {
                      iconBg: 'bg-secondary/10',
                      iconText: 'text-secondary',
                      hoverBorder: 'hover:border-secondary/40',
                    },
                    {
                      iconBg: 'bg-tertiary/10',
                      iconText: 'text-tertiary',
                      hoverBorder: 'hover:border-tertiary/40',
                    },
                    {
                      iconBg: 'bg-quaternary/10',
                      iconText: 'text-quaternary',
                      hoverBorder: 'hover:border-quaternary/40',
                    },
                    {
                      iconBg: 'bg-quinary/10',
                      iconText: 'text-quinary',
                      hoverBorder: 'hover:border-quinary/40',
                    },
                  ];
                  const c = qlColors[i % qlColors.length];
                  return (
                    <Button
                      key={item.id}
                      type="button"
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className={`group bg-card ${c.hoverBorder} border-border/70 h-auto flex-col items-start overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
                    >
                      <div className="mb-2 flex w-full items-center gap-2.5">
                        <div
                          className={`${c.iconBg} ${c.iconText} inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg`}
                        >
                          {item.icon === 'map' && <MapPinned size={16} />}
                          {item.icon === 'vr' && <Compass size={16} />}
                          {item.icon === 'plan' && <CalendarDays size={16} />}
                          {item.icon === 'service' && <Sun size={16} />}
                          {item.icon === 'ocop' && <ArrowRight size={16} />}
                        </div>
                        <h3 className="min-w-0 truncate text-sm font-bold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 w-full min-w-0 text-sm leading-relaxed wrap-break-word">
                        {item.description}
                      </p>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className={cardClass + ' p-5 sm:p-6'}>
              <SectionHeader
                eyebrow="Gợi ý nổi bật"
                title="Điểm đến tiêu biểu đang được quan tâm"
                description="Kết hợp hình ảnh lớn, thẻ trạng thái tải và nút hành động nhanh để đi từ trang chủ đến bản đồ hoặc trang chi tiết chỉ với một lần bấm."
              />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {featuredSpots.map((item) => (
                  <article
                    key={item.id}
                    className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm"
                  >
                    <div className="relative h-52">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderImg;
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className="text-foreground rounded-full bg-(--glass-bg-strong) px-2 py-1 text-sm font-semibold">
                          {item.province}
                        </span>
                        <span className="text-foreground rounded-full bg-(--glass-bg-strong) px-2 py-1 text-sm font-semibold">
                          ⭐ {item.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm">{item.subtitle}</p>
                      <h3 className="text-foreground mt-1 text-lg font-bold">{item.name}</h3>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-lg"
                          onClick={() => navigate('/tourism-point')}
                        >
                          Chi tiết
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => navigate('/map')}
                        >
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

        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className={cardClass + ' p-5 sm:p-6'}>
                <SectionHeader eyebrow="Tin tức ngắn" title="Thông tin mới" />
                <div className="grid gap-3">
                  {newsList.map((item) => (
                    <article
                      key={item.id}
                      className="border-border/70 flex gap-3 border-b border-dashed pb-3 last:border-b-0"
                    >
                      {item.thumbnail_url && (
                        <img
                          src={withBaseUrl(item.thumbnail_url)}
                          alt={item.title}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholderImg;
                          }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="border-border/70 text-muted-foreground inline-flex rounded-full border px-2 py-0.5 text-sm font-semibold">
                            {formatNewsDate(item.published_at || item.created_at)}
                          </span>
                          {item.author_name && (
                            <span className="text-muted-foreground text-sm">
                              {item.author_name}
                            </span>
                          )}
                        </div>
                        <h4
                          className="text-foreground mt-1 line-clamp-2 text-sm font-bold"
                          title={item.title}
                        >
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className={cardClass + ' p-5 sm:p-6'}>
                  <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                    Tour gợi ý
                  </span>
                  {featuredTour?.cover_image_url && (
                    <div className="mt-3 h-36 overflow-hidden rounded-xl">
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
                  <h3
                    className="text-foreground mt-3 line-clamp-2 text-xl font-bold"
                    title={featuredTour?.name}
                  >
                    {featuredTour
                      ? featuredTour.name || featuredTour.name_vi || 'Tour gợi ý'
                      : 'Tuyến di sản Ninh Bình 2 ngày'}
                  </h3>
                  {featuredTour?.business_name && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {featuredTour.business_name}
                    </p>
                  )}
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                    {featuredTour
                      ? featuredTour.description_vi || featuredTour.description_en || ''
                      : 'Tràng An → Hoa Lư → Bái Đính → Tam Cốc → Hang Múa. Gợi ý theo logic điều phối tải trọng và thời tiết.'}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="border-border/70 bg-muted/40 rounded-xl border p-3">
                      <p className="typo-meta font-bold">
                        {featuredTour?.duration_days
                          ? `${featuredTour.duration_days} ngày`
                          : '2 ngày'}
                      </p>
                      <p className="typo-meta text-muted-foreground">lịch trình</p>
                    </div>
                    <div className="border-border/70 bg-muted/40 rounded-xl border p-3">
                      <p className="typo-meta font-bold">
                        {featuredTour?.price_from_vnd
                          ? formatVND(Number(featuredTour.price_from_vnd))
                          : 'Liên hệ'}
                      </p>
                      <p className="typo-meta text-muted-foreground">từ / khách</p>
                    </div>
                    <div className="border-border/70 bg-muted/40 rounded-xl border p-3">
                      <p className="typo-meta font-bold">
                        {featuredTour?.rating_avg
                          ? `⭐ ${parseFloat(featuredTour.rating_avg).toFixed(1)}`
                          : 'VR360'}
                      </p>
                      <p className="typo-meta text-muted-foreground">
                        {featuredTour?.rating_count
                          ? `${featuredTour.rating_count} đánh giá`
                          : 'xem trước'}
                      </p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full rounded-xl" onClick={() => navigate('/map')}>
                    Xem tuyến trên bản đồ
                  </Button>
                </div>

                <div className={cardClass + ' p-5 sm:p-6'}>
                  <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                    Lịch trình cá nhân
                  </span>
                  <h3 className="text-foreground mt-2 text-2xl font-bold">
                    Lên kế hoạch chuyến đi trong 30 giây
                  </h3>
                  <div className="mt-4 grid gap-2">
                    {ITINERARY_ITEMS.map((item) => (
                      <div
                        key={`${item.time}-${item.activity}`}
                        className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2"
                      >
                        <span className="text-sm">{item.activity}</span>
                        <strong className="text-sm">{item.time}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className={cardClass + ' overflow-hidden'}>
              <div className="grid lg:grid-cols-[1fr_1.1fr]">
                <div
                  className="min-h-75 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80)',
                  }}
                />
                <div className="p-5 sm:p-6">
                  <SectionHeader
                    eyebrow="Ẩm thực & trải nghiệm địa phương"
                    title="Không chỉ xem bản đồ, người dùng còn có thể khám phá ẩm thực đặc sản."
                    description="Khối này được thiết kế lớn để tăng cảm hứng du lịch: món nổi bật, địa điểm ăn uống, từ khóa tìm nhanh và liên kết dịch vụ ngay trong trang chủ."
                  />
                  <div className="mb-4 flex flex-wrap gap-2">
                    {FOOD_TAGS.map((tag) => (
                      <span
                        key={tag}
                        className="border-border/70 text-muted-foreground rounded-full border px-3 py-1 text-sm font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid gap-2">
                    {FOOD_BULLETS.map((item) => (
                      <div
                        key={item.label}
                        className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2"
                      >
                        <span className="text-sm">{item.label}</span>
                        <strong className="text-sm">{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-8" id="services">
          <div className={sectionContainerClass}>
            <div className={cardClass + ' p-5 sm:p-6'}>
              <SectionHeader
                eyebrow="Doanh nghiệp du lịch"
                title="Voucher đang có gần bạn"
                description="Voucher ưu đãi từ các doanh nghiệp du lịch trong khu vực."
              />
              {nearbyVouchers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {nearbyVouchers.map((voucher) => (
                    <article
                      key={voucher.id}
                      className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm"
                    >
                      <div className="from-primary/15 to-primary/5 flex items-center justify-between gap-3 bg-linear-to-r px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="typo-badge text-muted-foreground truncate">
                            {voucher.business_name}
                          </p>
                          <p
                            className="typo-section-title text-foreground line-clamp-1 font-bold"
                            title={voucher.title_vi}
                          >
                            {voucher.title_vi}
                          </p>
                        </div>
                        <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-3 py-1 text-sm font-bold">
                          {formatVoucherDiscount(voucher)}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="border-primary/30 bg-primary/5 text-primary rounded-lg border px-3 py-2 text-center font-mono text-sm font-bold tracking-wider">
                          {voucher.code}
                        </p>
                        <div className="mt-3 grid gap-1.5">
                          {voucher.min_order_value && (
                            <div className="flex items-center justify-between">
                              <span className="typo-meta text-muted-foreground">Đơn tối thiểu</span>
                              <span className="typo-meta font-semibold">
                                {formatVND(Number(voucher.min_order_value))}
                              </span>
                            </div>
                          )}
                          {voucher.valid_until && (
                            <div className="flex items-center justify-between">
                              <span className="typo-meta text-muted-foreground">Hạn sử dụng</span>
                              <span className="typo-meta font-semibold">
                                {formatNewsDate(voucher.valid_until)}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-4 w-full rounded-lg"
                          onClick={() => navigate('/map')}
                        >
                          Xem doanh nghiệp trên bản đồ
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-6 text-center text-sm">
                  Không có voucher nào trong khu vực hiện tại.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="w-full py-8" id="ocop">
          <div className={sectionContainerClass}>
            <div className={cardClass + ' p-5 sm:p-6'}>
              <SectionHeader
                eyebrow="Sản phẩm OCOP"
                title="Gian hàng địa phương tích hợp trên trang chủ"
                description="Giới thiệu sản phẩm, chứng nhận, địa phương và liên kết đặt hàng ngay trong trang chủ."
              />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {ocopProducts.map((product) => (
                  <article
                    key={product.id}
                    className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm"
                  >
                    <img
                      src={withBaseUrl(product.cover_image_url)}
                      alt={product.name_vi || product.name_en || ''}
                      className="h-52 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImg;
                      }}
                    />
                    <div className="p-4">
                      <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-2 text-sm">
                        <span>{product.province_name || product.province_code || '--'}</span>
                        {product.star_rating && (
                          <span>{'⭐'.repeat(Number(product.star_rating))}</span>
                        )}
                      </div>
                      <h3
                        className="text-foreground text-base font-bold"
                        title={product.name_vi || product.name_en}
                      >
                        {product.name_vi || product.name_en}
                      </h3>
                      <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                        {product.description_vi || product.description_en || ''}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-foreground text-sm font-bold">
                          {product.price_vnd ? formatVND(Number(product.price_vnd)) : '--'}
                        </span>
                        {product.unit && (
                          <span className="text-muted-foreground text-sm">/ {product.unit}</span>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="rounded-lg" onClick={() => navigate('/ocop')}>
                          Xem sản phẩm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => navigate('/ocop')}
                        >
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

        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className={cardClass + ' p-5 sm:p-6'}>
              <SectionHeader
                eyebrow="Vlog & chia sẻ"
                title="Câu chuyện du lịch từ cộng đồng"
                description="Tăng chiều sâu nội dung cộng đồng với trải nghiệm thực tế, mẹo di chuyển và gợi ý lên lịch trình."
              />
              {/* TODO: create vlog API service (GET /vlogs) */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {VLOG_STORIES.map((story) => (
                  <article
                    key={story.title}
                    className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm"
                  >
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-52 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImg;
                      }}
                    />
                    <div className="p-4">
                      <div className="text-muted-foreground mb-2 text-sm">
                        Tác giả: {story.author}
                      </div>
                      <h3 className="text-foreground text-base font-bold">{story.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">{story.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full pb-8">
          <div className={sectionContainerClass}>
            <div className="border-border/70 text-muted-foreground border-t pt-5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>Du lịch số Ninh Bình</p>
                <p className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="link"
                    className="hover:text-primary h-auto p-0 text-sm"
                    onClick={() => navigate('/map')}
                  >
                    Bản đồ
                  </Button>
                  <span>·</span>
                  <Button
                    type="button"
                    variant="link"
                    className="hover:text-primary h-auto p-0 text-sm"
                    onClick={() => navigate('/vr360')}
                  >
                    VR360
                  </Button>
                  <span>·</span>
                  <Button
                    type="button"
                    variant="link"
                    className="hover:text-primary h-auto p-0 text-sm"
                    onClick={() => navigate('/tourism-point')}
                  >
                    Điểm du lịch
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}
