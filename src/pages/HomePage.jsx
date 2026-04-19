import React, { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Map,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Star,
  Tag,
  MessageCircle,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import RootLayout from '@/components/layout/RootLayout';
import trangAnVideo from '@/assets/videos/trang_an.mp4';
import placeholderImg from '@/assets/images/placeholder.png';
import {
  AD_SLIDES,
  NEWS_ITEMS,
  CATEGORIES,
  SUGGEST_POINTS,
  SUGGEST_TOURS,
  PARTNER_LOGOS,
} from '@/pages/home/homeData';

// ─── Section header helper ────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
          {eyebrow}
        </p>
        <h2 className="text-foreground text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionContainerClass = 'mx-auto w-full px-4 sm:px-6 lg:w-[80%] lg:px-0';
  const sectionPanelClass =
    'rounded-3xl border border-(--glass-border) bg-(--glass-bg) p-5 shadow-sm backdrop-blur-[var(--panel-blur)] sm:p-6';

  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // ── shortcut items for section 1 ──────────────────────────────────────────
  const shortcuts = [
    {
      id: 'map',
      icon: <Map size={22} className="text-primary" />,
      title: t('home.hero.map_title'),
      desc: t('home.hero.map_desc'),
      cta: t('home.hero.map_cta'),
      action: () => navigate('/map'),
    },
    {
      id: 'vlog',
      icon: <Video size={22} className="text-primary" />,
      title: t('home.hero.vlog_title'),
      desc: t('home.hero.vlog_desc'),
      cta: t('home.hero.vlog_cta'),
      action: () => navigate('/vlog'),
    },
    {
      id: 'chatbot',
      icon: <MessageCircle size={22} className="text-primary" />,
      title: t('home.hero.chatbot_title'),
      desc: t('home.hero.chatbot_desc'),
      cta: t('home.hero.chatbot_cta'),
      action: () => navigate('/map'),
    },
  ];

  return (
    <RootLayout>
      <div className="bg-background space-y-6 px-0 py-4 lg:py-6">
        {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — Split screen: video (left) + shortcuts (right)
      ═══════════════════════════════════════════════════════════════════ */}
        <section className="w-full">
          <div className={sectionContainerClass}>
            <div className={`${sectionPanelClass} min-h-[55vh] lg:min-h-[60vh]`}>
              <div className="flex h-full flex-col lg:flex-row">
                {/* Left — video */}
                <div className="w-full lg:w-1/2 lg:pr-4">
                  <div className="relative h-60 overflow-hidden rounded-3xl shadow-md lg:h-full">
                    <video
                      src={trangAnVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* gradient overlay */}
                    <div className="from-background/10 via-background/20 to-background/60 lg:from-background/5 lg:via-background/10 lg:to-background/40 absolute inset-0 bg-linear-to-b lg:bg-linear-to-r" />

                    {/* Bottom label */}
                    <div className="absolute bottom-4 left-5 z-10">
                      <p className="text-primary-foreground/70 text-xs font-medium drop-shadow">
                        Tràng An · Ninh Bình
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right — shortcut list */}
                <div className="mt-4 flex w-full flex-col justify-center rounded-3xl border-(--glass-border-strong) bg-(--glass-bg-strong) px-6 py-8 lg:mt-0 lg:w-1/2 lg:border lg:px-10 lg:py-12">
                  <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
                    {t('home.hero.intro')}
                  </p>
                  <h1 className="text-foreground mb-8 text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                    {t('home.hero.title')}
                  </h1>

                  <div className="divide-border flex flex-col divide-y">
                    {shortcuts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        <div className="bg-primary/10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-foreground mb-1 text-sm font-bold">{item.title}</h3>
                          <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
                            {item.desc}
                          </p>
                          <Button
                            id={`hero-${item.id}-btn`}
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-full px-4 text-xs font-semibold"
                            onClick={item.action}
                          >
                            {item.cta}
                            <ArrowRight size={12} className="ml-1.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — Dịch vụ & Sự kiện (Ad carousel)
      ═══════════════════════════════════════════════════════════════════ */}
        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className={sectionPanelClass}>
              <SectionHeader
                eyebrow={t('home.ad_carousel.subtitle')}
                title={t('home.ad_carousel.title')}
                action={
                  <div className="flex gap-2">
                    <button
                      id="ad-carousel-prev"
                      onClick={scrollPrev}
                      aria-label={t('home.ad_carousel.prev')}
                      className="border-border bg-card text-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:border-(--primary-hover) hover:bg-(--primary-hover)"
                    >
                      <ChevronLeft size={17} />
                    </button>
                    <button
                      id="ad-carousel-next"
                      onClick={scrollNext}
                      aria-label={t('home.ad_carousel.next')}
                      className="border-border bg-card text-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:border-(--primary-hover) hover:bg-(--primary-hover)"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                }
              />

              <div
                className="overflow-hidden rounded-2xl border border-(--glass-border) bg-(--glass-bg-strong) shadow-sm"
                ref={emblaRef}
              >
                <div className="flex">
                  {AD_SLIDES.map((slide) => (
                    <div
                      key={slide.id}
                      className="min-w-0 flex-[0_0_100%] pr-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                    >
                      <div
                        className="group relative h-60 cursor-pointer overflow-hidden rounded-2xl"
                        onClick={() => navigate(slide.path)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(slide.path)}
                      >
                        <img
                          src={placeholderImg}
                          alt={slide.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="from-foreground/90 via-foreground/40 to-background absolute inset-0 bg-linear-to-t" />
                        <div
                          className={`absolute inset-0 bg-linear-to-br ${slide.gradient} opacity-90 mix-blend-color`}
                        />
                        <div
                          className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-20"
                          style={{ background: slide.accent }}
                        />
                        <div
                          className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-10"
                          style={{ background: slide.accent }}
                        />
                        <div className="relative z-10 flex h-full flex-col justify-between p-5">
                          <span
                            className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{ background: `${slide.accent}30`, color: slide.accent }}
                          >
                            {slide.tagIcon}
                            {slide.tag}
                          </span>
                          <div>
                            <h3 className="text-primary-foreground mb-1 text-base leading-snug font-bold">
                              {slide.title}
                            </h3>
                            <p className="text-primary-foreground/70 mb-3 line-clamp-2 text-xs leading-relaxed">
                              {slide.desc}
                            </p>
                            <span
                              className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                              style={{ color: slide.accent }}
                            >
                              {slide.cta} <ArrowRight size={11} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — Tin tức mới nhất
      ═══════════════════════════════════════════════════════════════════ */}
        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className={sectionPanelClass}>
              <SectionHeader
                eyebrow={t('home.news.subtitle')}
                title={t('home.news.title')}
                action={
                  <button
                    id="news-see-all-btn"
                    className="text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                    onClick={() => navigate('/news')}
                  >
                    {t('home.news.see_all')} <ArrowRight size={14} />
                  </button>
                }
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Featured news */}
                <div
                  className="bg-card border-border group hover:border-primary/30 cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md md:row-span-2"
                  onClick={() => navigate('/news')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/news')}
                >
                  <div className="from-primary/20 to-primary/5 flex h-44 items-center justify-center bg-linear-to-br">
                    <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                      <Newspaper size={28} className="text-primary" />
                    </div>
                  </div>
                  <div className="p-5">
                    {NEWS_ITEMS[0].hot && (
                      <span className="text-primary mb-3 inline-flex items-center gap-1 text-xs font-semibold">
                        🔥 {t('home.news.hot')}
                      </span>
                    )}
                    <p className="text-muted-foreground mb-2 text-xs">
                      {NEWS_ITEMS[0].source} · {NEWS_ITEMS[0].date}
                    </p>
                    <h3 className="text-foreground group-hover:text-primary mb-2 text-sm leading-snug font-bold transition-colors">
                      {NEWS_ITEMS[0].title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                      {NEWS_ITEMS[0].excerpt}
                    </p>
                    <span className="text-primary mt-4 inline-flex items-center gap-1 text-xs font-medium transition-all group-hover:gap-2">
                      {t('home.news.read_more')} <ArrowRight size={11} />
                    </span>
                  </div>
                </div>

                {NEWS_ITEMS.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border-border group hover:border-primary/30 flex cursor-pointer gap-4 rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    onClick={() => navigate('/news')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/news')}
                  >
                    <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <Newspaper size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        {item.hot && <span className="text-primary text-xs font-semibold">🔥</span>}
                        <span className="text-muted-foreground text-xs">
                          {item.source} · {item.date}
                        </span>
                      </div>
                      <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-xs leading-snug font-semibold transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — Danh mục du lịch
      ═══════════════════════════════════════════════════════════════════ */}
        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className={sectionPanelClass}>
              <div className="mb-10 text-center">
                <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
                  {t('home.categories.subtitle')}
                </p>
                <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
                  {t('home.categories.title')}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    className="group bg-card border-border hover:border-primary/40 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    onClick={() => navigate(cat.path)}
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="text-foreground group-hover:text-primary text-center text-xs leading-snug font-semibold transition-colors">
                      {cat.label}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {cat.count} {t('home.categories.items')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — Điểm đến du lịch
      ═══════════════════════════════════════════════════════════════════ */}
        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className={sectionPanelClass}>
              <SectionHeader
                eyebrow={t('home.points.subtitle')}
                title={t('home.points.title')}
                action={
                  <button
                    id="points-see-all-btn"
                    className="text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                    onClick={() => navigate('/tourism-point')}
                  >
                    {t('common.see_all')} <ArrowRight size={14} />
                  </button>
                }
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {SUGGEST_POINTS.map((point) => (
                  <button
                    key={point.id}
                    id={`point-${point.id}`}
                    className="group bg-card border-border hover:border-primary/40 cursor-pointer rounded-2xl border p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    onClick={() => navigate('/tourism-point')}
                  >
                    <div className="mb-3 text-3xl">{point.emoji}</div>
                    <span className="text-primary bg-primary/10 mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                      {point.tag}
                    </span>
                    <h3 className="text-foreground group-hover:text-primary mb-1 text-sm font-bold transition-colors">
                      {point.name}
                    </h3>
                    <p className="text-muted-foreground mb-2 text-xs">{point.area}</p>
                    <div className="text-primary flex items-center gap-1 text-xs">
                      <Star size={11} fill="currentColor" />
                      <span className="font-semibold">{point.rating}</span>
                      <span className="text-muted-foreground">
                        ({point.reviews.toLocaleString()})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — Tuyến du lịch
      ═══════════════════════════════════════════════════════════════════ */}
        <section className="w-full py-8">
          <div className={sectionContainerClass}>
            <div className={sectionPanelClass}>
              <SectionHeader
                eyebrow={t('home.tours.subtitle')}
                title={t('home.tours.title')}
                action={
                  <button
                    id="tours-see-all-btn"
                    className="text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                    onClick={() => navigate('/tour')}
                  >
                    {t('common.see_all')} <ArrowRight size={14} />
                  </button>
                }
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {SUGGEST_TOURS.map((tour) => (
                  <button
                    key={tour.id}
                    id={`tour-${tour.id}`}
                    className="group bg-card border-border hover:border-primary/40 cursor-pointer rounded-2xl border p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    onClick={() => navigate('/tour')}
                  >
                    <div className="mb-3 text-3xl">{tour.emoji}</div>
                    <span className="text-primary bg-primary/10 mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                      {tour.tag}
                    </span>
                    <h3 className="text-foreground group-hover:text-primary mb-2 text-sm leading-snug font-bold transition-colors">
                      {tour.name}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-xs">⏱ {tour.duration}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary text-sm font-bold">{tour.price}</span>
                      <div className="text-primary flex items-center gap-1 text-xs">
                        <Star size={11} fill="currentColor" />
                        <span className="font-semibold">{tour.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — Voucher & Partners
      ═══════════════════════════════════════════════════════════════════ */}
        <section className="w-full py-16">
          <div className={`${sectionContainerClass} text-center`}>
            <div className={sectionPanelClass}>
              <div className="bg-primary/10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl">
                <Tag size={26} className="text-primary" />
              </div>
              <h2 className="text-foreground mb-3 text-2xl font-bold sm:text-3xl">
                {t('home.voucher.title')}
              </h2>
              <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-sm leading-relaxed">
                {t('home.voucher.desc')}
              </p>

              <Button
                id="get-voucher-btn"
                size="lg"
                className="border-primary/20 mb-12 rounded-xl border px-8 font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => navigate('/tourism-point')}
              >
                {t('home.voucher.cta')}
                <ArrowRight size={17} className="ml-2" />
              </Button>

              <div className="border-border/40 border-t pt-8">
                <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-widest uppercase">
                  {t('home.voucher.partners')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {PARTNER_LOGOS.map((partner) => (
                    <div
                      key={partner.id}
                      title={partner.name}
                      className="border-border bg-card hover:border-primary/30 flex h-12 w-24 cursor-pointer items-center justify-center rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <span className="text-muted-foreground text-xs font-bold tracking-widest">
                        {partner.abbr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}
