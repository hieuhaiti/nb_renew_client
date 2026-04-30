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
import { getLocaleFromLanguage } from '@/lib/utils';
import {
  formatHumidity,
  formatTemperature,
  formatWindSpeedKph,
  getAqiLevelMeta,
  useWeatherOverview,
} from '@/features/weather';
import { useLanguageStore } from '@/stores/useLanguageStore';
import {
  getHomeData,
} from '@/features/home/data/homeData';

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <div>
        <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
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
  const sectionContainerClass = 'mx-auto w-full px-4 sm:px-6 lg:w-[88%] lg:px-0';
  const cardClass = 'rounded-3xl border border-border/60 bg-card shadow-sm';
  const homeData = useMemo(() => getHomeData(lang), [lang]);
  const {
    FEATURED_DESTINATIONS,
    FOOD_BULLETS,
    FOOD_TAGS,
    HERO_EVENTS,
    HERO_STATS,
    ITINERARY_ITEMS,
    NEWS_ITEMS,
    OCOP_PRODUCTS,
    PROMO_BANNER,
    QUICK_LINKS,
    SERVICES,
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
      <div className="bg-background space-y-7 px-0 py-4 lg:py-6">
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
                <div className="absolute inset-0 bg-linear-to-r from-slate-950/55 via-slate-900/35 to-slate-900/15" />

                <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
                  <div>
                    <span className="bg-primary/20 text-primary-foreground inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                      Cổng thông tin du lịch tích hợp bản đồ GIS, thời tiết, VR360 và gợi ý hành
                      trình
                    </span>
                    <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-extrabold text-white sm:text-4xl lg:text-5xl">
                      Khám phá điểm đến đẹp hơn, trực quan hơn và dễ chọn hành trình hơn.
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
                      Trang chủ được tinh gọn theo hướng sáng, rõ và giàu thông tin thực tế: điểm
                      đến, sự kiện, tour, ẩm thực và nội dung cộng đồng.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button onClick={() => navigate('/map')} className="rounded-xl">
                        Khám phá bản đồ GIS
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => navigate('/vr360')}
                        className="rounded-xl"
                      >
                        Trải nghiệm VR360
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/tourism-point')}
                        className="rounded-xl border-white/50 bg-white/20 text-white hover:bg-white/30"
                      >
                        Xem điểm nổi bật
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative rounded-xl border border-white/40 bg-white/90 p-2.5">
                      <label className="text-muted-foreground block text-xs font-semibold">
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
                        className="mt-1 h-auto w-full border-0 bg-transparent py-0 pr-7 pl-6 text-sm text-slate-800 shadow-none focus-visible:ring-0"
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
                                      className="text-muted-foreground truncate text-xs"
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
                      {HERO_STATS.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-white/30 bg-white/85 p-3"
                        >
                          <p className="text-xs text-slate-500">{stat.label}</p>
                          <p className="mt-1 text-lg font-bold text-slate-900">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:col-span-2">
                <div className={`${cardClass} p-5`}>
                  <p className="text-primary text-xs font-semibold tracking-widest uppercase">
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
                    <div className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2">
                      <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                        <Wind size={14} /> Gió
                      </span>
                      <strong className="text-sm">
                        {weather ? formatWindSpeedKph(weather?.wind?.speed) : '--'}
                      </strong>
                    </div>
                    <div className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2">
                      <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                        <Sun size={14} /> AQI
                      </span>
                      <strong className="text-sm">
                        {weatherOverview?.aqiValue ?? '--'} · {t(aqiMeta.labelKey)}
                      </strong>
                    </div>
                    <div className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2">
                      <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                        <CloudRain size={14} /> Độ ẩm
                      </span>
                      <strong className="text-sm">
                        {weather ? formatHumidity(weather?.main?.humidity) : '--'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className={`${cardClass} p-5`}>
                  <p className="text-primary text-xs font-semibold tracking-widest uppercase">
                    Lễ hội theo mùa
                  </p>
                  <h3 className="text-foreground mt-2 text-2xl font-bold">
                    Sự kiện và lễ hội sắp diễn ra
                  </h3>
                  <div className="mt-4 grid gap-2">
                    {heroEvents.map((event) => (
                      <div
                        key={`${event.title}-${event.time}`}
                        className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2"
                      >
                        <span className="text-sm">{event.title}</span>
                        <strong className="text-sm">{event.time}</strong>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full rounded-xl"
                    onClick={() => navigate('/tourism-point')}
                  >
                    Xem điểm liên quan
                  </Button>
                </div>

                <div className={`${cardClass} p-5`}>
                  <p className="text-primary text-xs font-semibold tracking-widest uppercase">
                    Gợi ý nhanh
                  </p>
                  <h3 className="text-foreground mt-2 text-2xl font-bold">
                    Điểm nên xem trước khi đi
                  </h3>
                  <div className="mt-4 grid gap-2">
                    {FEATURED_DESTINATIONS.slice(0, 3).map((item) => (
                      <Button
                        key={item.id}
                        type="button"
                        variant="ghost"
                        className="bg-muted/40 hover:bg-muted flex h-auto w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors"
                        onClick={() => navigate('/tourism-point')}
                      >
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-primary text-sm font-semibold">Chi tiết</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className={sectionContainerClass}>
            <div className="border-primary/20 rounded-3xl border bg-linear-to-r from-sky-50 via-amber-50 to-emerald-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/85 text-white">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{PROMO_BANNER.title}</p>
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
                {QUICK_LINKS.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(item.path)}
                    className="group bg-card hover:border-primary/40 border-border/70 h-auto rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="bg-primary/10 text-primary mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                      {item.icon === 'map' && <MapPinned size={18} />}
                      {item.icon === 'vr' && <Compass size={18} />}
                      {item.icon === 'plan' && <CalendarDays size={18} />}
                      {item.icon === 'service' && <Sun size={18} />}
                      {item.icon === 'ocop' && <ArrowRight size={18} />}
                    </div>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </Button>
                ))}
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
                {FEATURED_DESTINATIONS.map((item) => (
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
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/45 to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/85 px-2 py-1 text-xs font-semibold text-slate-700">
                          {item.province}
                        </span>
                        <span className="rounded-full bg-white/85 px-2 py-1 text-xs font-semibold text-slate-700">
                          ⭐ {item.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground text-xs">{item.subtitle}</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">{item.name}</h3>
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
                  {NEWS_ITEMS.map((item) => (
                    <article
                      key={item.title}
                      className="border-border/70 border-b border-dashed pb-3 last:border-b-0"
                    >
                      <span className="border-border/70 text-muted-foreground inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold">
                        {item.date}
                      </span>
                      <h4 className="mt-2 text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {item.excerpt}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className={cardClass + ' p-5 sm:p-6'}>
                  <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                    Tour gợi ý
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    Tuyến di sản Ninh Bình 2 ngày
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Tràng An → Hoa Lư → Bái Đính → Tam Cốc → Hang Múa. Gợi ý theo logic điều phối
                    tải trọng và thời tiết.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="border-border/70 bg-muted/40 rounded-xl border p-3 text-sm">
                      <p className="font-bold">5 điểm</p>
                      <p className="text-muted-foreground text-xs">liên kết tuyến</p>
                    </div>
                    <div className="border-border/70 bg-muted/40 rounded-xl border p-3 text-sm">
                      <p className="font-bold">2 ngày</p>
                      <p className="text-muted-foreground text-xs">lịch trình tối ưu</p>
                    </div>
                    <div className="border-border/70 bg-muted/40 rounded-xl border p-3 text-sm">
                      <p className="font-bold">VR trước chuyến</p>
                      <p className="text-muted-foreground text-xs">xem trước trải nghiệm</p>
                    </div>
                  </div>
                  <Button className="mt-4 rounded-xl" onClick={() => navigate('/map')}>
                    Xem tuyến trên bản đồ
                  </Button>
                </div>

                <div className={cardClass + ' p-5 sm:p-6'}>
                  <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                    Lịch trình cá nhân
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
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
                        className="border-border/70 text-muted-foreground rounded-full border px-3 py-1 text-xs font-semibold"
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
                title="Dịch vụ và voucher đang mở trên hệ thống"
                description="Thiết kế phần thẻ dịch vụ theo hướng thương mại hơn để phù hợp khối chức năng doanh nghiệp."
              />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {SERVICES.map((service) => (
                  <article
                    key={service.name}
                    className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm"
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-52 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImg;
                      }}
                    />
                    <div className="p-4">
                      <div className="text-muted-foreground mb-2 flex flex-wrap gap-2 text-xs">
                        <span>{service.type}</span>
                        <span>⭐ {service.rating}</span>
                        <span>{service.voucher}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">{service.description}</p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-lg"
                          onClick={() => navigate('/tourism-point')}
                        >
                          Đặt ngay
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => navigate('/tourism-point')}
                        >
                          {service.price}
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
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
                {OCOP_PRODUCTS.map((product) => (
                  <article
                    key={product.name}
                    className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-52 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImg;
                      }}
                    />
                    <div className="p-4">
                      <div className="text-muted-foreground mb-2 flex flex-wrap gap-2 text-xs">
                        <span>{product.origin}</span>
                        <span>{product.stars}</span>
                        <span>{product.price}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">{product.description}</p>
                      <div className="mt-4 flex gap-2">
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
                      <div className="text-muted-foreground mb-2 text-xs">
                        Tác giả: {story.author}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{story.title}</h3>
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
                <p>
                  Du lịch số Việt Nam · Giao diện trang chủ sáng màu, nổi bật hơn và bổ sung thêm
                  thông tin
                </p>
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
