import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Map, MapPin, Route, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RootLayout from '@/components/layout/RootLayout';
import trangAnVideo from '@/assets/videos/trang_an.mp4';

/**
 * HomePage — public-facing landing page.
 * Map-first, experience-first. Video hero + feature cards.
 */
export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Map size={28} className="text-primary" />,
      title: t('common.map'),
      description: t('home.features_desc'),
      path: '/map',
    },
    {
      icon: <MapPin size={28} className="text-primary" />,
      title: t('common.tourism_points'),
      description: 'Tìm hiểu các điểm tham quan, dịch vụ và trải nghiệm độc đáo.',
      path: '/tourism-point',
    },
    {
      icon: <Route size={28} className="text-primary" />,
      title: t('common.tourist_route'),
      description: 'Lên kế hoạch hành trình hoàn hảo với các tuyến du lịch được đề xuất.',
      path: '/tour',
    },
  ];

  return (
    <RootLayout>
      {/* ===== VIDEO HERO ===== */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
        {/* Background video */}
        <video
          src={trangAnVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay — bottom-heavy for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-6">

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl">
            {t('home.hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/80 max-w-3xl leading-relaxed drop-shadow-lg">
            {t('home.hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <Button
              id="hero-map-btn"
              size="lg"
              className="rounded-full px-8 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-200"
              onClick={() => navigate('/map')}
            >
              <Map size={18} className="mr-2" />
              {t('home.hero.cta_map')}
            </Button>
            <Button
              id="hero-discover-btn"
              size="lg"
              variant="outline"
              className="rounded-full px-8 font-semibold border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
              onClick={() => navigate('/tourism-point')}
            >
              {t('home.hero.cta_discover')}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          id="hero-scroll-btn"
          onClick={scrollToFeatures}
          aria-label={t('home.hero.scroll_hint')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors duration-200 group"
        >
          <span className="text-xs font-medium tracking-wide uppercase">
            {t('home.hero.scroll_hint')}
          </span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section
        ref={featuresRef}
        className="max-w-5xl mx-auto px-4 py-16 sm:py-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t('home.features_title')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('home.features_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <button
              key={f.path}
              id={`feature-card-${f.path.replace('/', '')}`}
              className="group text-left bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-elevated hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(f.path)}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {f.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:gap-2.5 transition-all duration-200">
                {t('home.see_more')} <ArrowRight size={13} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </RootLayout>
  );
}
