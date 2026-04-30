import React from 'react';
import { CalendarDays, MapPinned, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function SectionHeading({ title, description }) {
  return (
    <div>
      <h2 className="typo-card-title text-foreground truncate" title={title}>
        {title}
      </h2>
      {description ? (
        <p className="typo-body text-muted-foreground mt-1" title={description}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function NewsHeroHighlights({
  t,
  total,
  featuredCount,
  currentPage,
  totalPages,
  onGotoList,
  onGotoMap,
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
      <Card className="relative gap-0 overflow-hidden rounded-3xl border-border/70 py-0 shadow-sm">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-linear-to-r from-card/95 via-card/90 to-card/82" />
        <CardContent className="relative px-6 py-8 sm:px-8 sm:py-9">
          <span className="typo-badge inline-flex rounded-full bg-primary/10 px-3 py-1 text-primary">
            {t('newsPage.hero.badge')}
          </span>
          <h1 className="typo-hero text-foreground mt-4 max-w-4xl">{t('newsPage.hero.title')}</h1>
          <p className="typo-body text-muted-foreground mt-3 max-w-3xl leading-relaxed">
            {t('newsPage.hero.description')}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="rounded-xl" onClick={onGotoList}>
              {t('newsPage.hero.cta_latest')}
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={onGotoMap}>
              {t('newsPage.hero.cta_map')}
            </Button>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-card/90 p-4">
              <p className="typo-kpi text-foreground">{total}</p>
              <p className="typo-meta text-muted-foreground">{t('newsPage.stats.total')}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/90 p-4">
              <p className="typo-kpi text-foreground">{featuredCount}</p>
              <p className="typo-meta text-muted-foreground">{t('newsPage.stats.featured')}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/90 p-4">
              <p className="typo-kpi text-foreground">
                {currentPage}/{totalPages}
              </p>
              <p className="typo-meta text-muted-foreground">{t('newsPage.stats.page')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 rounded-3xl border-border/70 py-0 shadow-sm">
        <CardContent className="px-5 py-5">
          <SectionHeading title={t('newsPage.highlights.title')} />

          <div className="mt-4 grid gap-3">
            <div className="flex gap-3 rounded-2xl border border-border/70 bg-primary/5 p-4">
              <div className="grid h-12 w-12 place-content-center rounded-2xl bg-card">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="typo-section-title text-foreground">{t('newsPage.highlights.fast.title')}</p>
                <p className="typo-meta text-muted-foreground mt-1">{t('newsPage.highlights.fast.desc')}</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-border/70 bg-secondary/8 p-4">
              <div className="grid h-12 w-12 place-content-center rounded-2xl bg-card">
                <CalendarDays className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="typo-section-title text-foreground">{t('newsPage.highlights.time.title')}</p>
                <p className="typo-meta text-muted-foreground mt-1">{t('newsPage.highlights.time.desc')}</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-border/70 bg-warning/8 p-4">
              <div className="grid h-12 w-12 place-content-center rounded-2xl bg-card">
                <MapPinned className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="typo-section-title text-foreground">{t('newsPage.highlights.map.title')}</p>
                <p className="typo-meta text-muted-foreground mt-1">{t('newsPage.highlights.map.desc')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

