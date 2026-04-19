import React, { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Map,
  MapPin,
  Route,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Star,
  Tag,
  Hotel,
  ShoppingBag,
  Calendar,
  Compass,
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

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const adCarouselRef = useRef(null);

  // Embla carousel — auto-play 4s (already set loop: true)
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const scrollToNextSection = () => {
    adCarouselRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <RootLayout>
      {/* ===== VIDEO HERO ===== */}
      <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden">
        <video
          src={trangAnVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="from-foreground/30 via-foreground/40 to-foreground/70 absolute inset-0 bg-linear-to-b" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
          <h1 className="text-primary-foreground text-4xl leading-tight font-extrabold tracking-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
            {t('home.hero.title')}
          </h1>
          <p className="text-primary-foreground/80 max-w-3xl text-base leading-relaxed drop-shadow-lg sm:text-lg">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Button id="hero-map-btn" size="lg" variant="default" onClick={() => navigate('/map')}>
              <Map size={18} className="mr-2" />
              {t('home.hero.cta_map')}
            </Button>
            <Button
              id="hero-discover-btn"
              size="lg"
              variant="outline"
              onClick={() => navigate('/tourism-point')}
            >
              {t('home.hero.cta_discover')}
              <ArrowRight size={18} className="ml-2" />
            </Button>
            {/* OCOP shortcut */}
            <Button
              id="hero-ocop-btn"
              size="lg"
              variant="secondary"
              onClick={() => navigate('/ocop')}
            >
              <ShoppingBag size={18} className="mr-2" />
              OCOP Ninh Bình
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <Button
            id="hero-scroll-btn"
            type="button"
            variant="ghost"
            onClick={scrollToNextSection}
            aria-label={t('home.hero.scroll_hint')}
          >
            <span className="text-xs font-medium tracking-wide uppercase">
              {t('home.hero.scroll_hint')}
            </span>
            <ChevronDown size={20} className="animate-bounce" />
          </Button>
        </div>
      </section>

      {/* ===== AD CAROUSEL (Embla) — Dịch vụ quảng cáo ===== */}
      <section
        ref={adCarouselRef}
        className="from-muted/30 to-muted/5 border-border/40 w-full border-t bg-linear-to-br py-14"
      >
        <div className="mx-auto max-w-6xl px-4">
          {/* Section header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
                {t('home.ad_carousel.subtitle')}
              </p>
              <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
                {t('home.ad_carousel.title')}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                id="ad-carousel-prev"
                type="button"
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                aria-label={t('home.ad_carousel.prev')}
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                id="ad-carousel-next"
                type="button"
                variant="outline"
                size="icon"
                onClick={scrollNext}
                aria-label={t('home.ad_carousel.next')}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>

          {/* Embla viewport */}
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {AD_SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  className="min-w-0 flex-[0_0_100%] pr-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <div
                    className={`group relative h-64 cursor-pointer overflow-hidden rounded-2xl`}
                    onClick={() => navigate(slide.path)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(slide.path)}
                  >
                    {/* Background Image */}
                    <img
                      src={placeholderImg}
                      alt={slide.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark gradient overlay + Color tint overlay */}
                    <div className="from-foreground/90 via-foreground/40 to-background absolute inset-0 bg-linear-to-t" />
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${slide.gradient} opacity-90 mix-blend-color`}
                    />
                    {/* Decorative circle */}
                    <div
                      className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-20"
                      style={{ background: slide.accent }}
                    />
                    <div
                      className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-10"
                      style={{ background: slide.accent }}
                    />

                    <div className="relative z-10 flex h-full flex-col justify-between p-6">
                      <span
                        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ background: `${slide.accent}30`, color: slide.accent }}
                      >
                        {slide.tagIcon}
                        {slide.tag}
                      </span>
                      <div>
                        <h3 className="text-primary-foreground mb-1 text-lg leading-snug font-bold">
                          {slide.title}
                        </h3>
                        <p className="text-primary-foreground/70 mb-3 line-clamp-2 text-xs leading-relaxed">
                          {slide.desc}
                        </p>
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                          style={{ color: slide.accent }}
                        >
                          {slide.cta} <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIN TỨC MỚI NHẤT ===== */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
              {t('home.news.subtitle')}
            </p>
            <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
              {t('home.news.title')}
            </h2>
          </div>
          <Button
            id="news-see-all-btn"
            type="button"
            variant="ghost"
            onClick={() => navigate('/news')}
          >
            {t('home.news.see_all')} <ArrowRight size={15} />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Featured first news */}
          <div
            className="bg-card border-border group hover:border-primary/30 cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg md:row-span-2"
            onClick={() => navigate('/news')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/news')}
          >
            <div className="from-primary/20 to-primary/5 flex h-48 items-center justify-center bg-linear-to-br">
              <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
                <Newspaper size={32} className="text-primary" />
              </div>
            </div>
            <div className="p-6">
              {NEWS_ITEMS[0].hot && (
                <span className="text-primary mb-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
                  🔥 {t('home.news.hot')}
                </span>
              )}
              <p className="text-muted-foreground mb-2 text-xs">
                {NEWS_ITEMS[0].source} · {NEWS_ITEMS[0].date}
              </p>
              <h3 className="text-foreground group-hover:text-primary mb-2 text-base leading-snug font-bold transition-colors">
                {NEWS_ITEMS[0].title}
              </h3>
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {NEWS_ITEMS[0].excerpt}
              </p>
              <span className="text-primary mt-4 inline-flex items-center gap-1 text-xs font-medium transition-all group-hover:gap-2">
                {t('home.news.read_more')} <ArrowRight size={12} />
              </span>
            </div>
          </div>

          {/* Remaining news list */}
          {NEWS_ITEMS.slice(1).map((item) => (
            <div
              key={item.id}
              className="bg-card border-border group hover:border-primary/30 flex cursor-pointer gap-4 rounded-2xl border p-5 transition-all duration-300 hover:shadow-md"
              onClick={() => navigate('/news')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/news')}
            >
              <div className="bg-primary/10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl">
                <Newspaper size={20} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  {item.hot && <span className="text-primary text-xs font-semibold">🔥</span>}
                  <span className="text-muted-foreground text-xs">
                    {item.source} · {item.date}
                  </span>
                </div>
                <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SUGGEST CATEGORIES ===== */}
      <section className="bg-muted/20 w-full py-14">
        <div className="mx-auto max-w-6xl px-4">
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
              <Button
                key={cat.id}
                id={`cat-${cat.id}`}
                type="button"
                variant="ghost"
                onClick={() => navigate(cat.path)}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-foreground group-hover:text-primary text-center text-xs leading-snug font-semibold transition-colors">
                  {cat.label}
                </span>
                <span className="text-muted-foreground text-xs">
                  {cat.count} {t('home.categories.items')}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUGGEST POINTS ===== */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
              {t('home.points.subtitle')}
            </p>
            <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
              {t('home.points.title')}
            </h2>
          </div>
          <Button
            id="points-see-all-btn"
            type="button"
            variant="ghost"
            onClick={() => navigate('/tourism-point')}
          >
            {t('common.see_all')} <ArrowRight size={15} />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SUGGEST_POINTS.map((point) => (
            <Button
              key={point.id}
              id={`point-${point.id}`}
              type="button"
              variant="ghost"
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
                <span className="text-muted-foreground">({point.reviews.toLocaleString()})</span>
              </div>
            </Button>
          ))}
        </div>
      </section>

      {/* ===== SUGGEST TOURS ===== */}
      <section className="from-primary/5 to-muted/10 w-full bg-linear-to-br py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
                {t('home.tours.subtitle')}
              </p>
              <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
                {t('home.tours.title')}
              </h2>
            </div>
            <Button
              id="tours-see-all-btn"
              type="button"
              variant="ghost"
              onClick={() => navigate('/tour')}
            >
              {t('common.see_all')} <ArrowRight size={15} />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SUGGEST_TOURS.map((tour) => (
              <Button
                key={tour.id}
                id={`tour-${tour.id}`}
                type="button"
                variant="ghost"
                onClick={() => navigate('/tour')}
              >
                <div className="mb-4 text-3xl">{tour.emoji}</div>
                <span className="text-primary bg-primary/10 mb-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
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
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VOUCHER & PARTNERS ===== */}
      <section className="bg-primary/5 border-primary/10 w-full border-y py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="bg-primary/10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl">
            <Tag size={26} className="text-primary" />
          </div>
          <h2 className="text-foreground mb-3 text-2xl font-bold sm:text-3xl">
            {t('home.voucher.title')}
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl leading-relaxed">
            {t('home.voucher.desc')}
          </p>

          <Button id="get-voucher-btn" size="lg" onClick={() => navigate('/tourism-point')}>
            {t('home.voucher.cta')}
            <ArrowRight size={18} className="ml-2" />
          </Button>

          <div className="border-border/40 border-t pt-8">
            <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-widest uppercase">
              {t('home.voucher.partners')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {PARTNER_LOGOS.map((partner) => (
                <div
                  key={partner.id}
                  title={partner.name}
                  className="border-border bg-card hover:border-primary/30 flex h-14 w-28 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 hover:shadow-md"
                >
                  <span className="text-muted-foreground text-sm font-bold tracking-widest">
                    {partner.abbr}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
