import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import RootLayout from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetNewsBySlug, useGetNewsList } from '@/services/api/news/newsService';
import { getLocaleFromLanguage } from '@/lib/utils';
import NewsDetailHero from '@/features/news/components/NewsDetailHero';
import NewsDetailBody from '@/features/news/components/NewsDetailBody';
import NewsDetailSidebar from '@/features/news/components/NewsDetailSidebar';

function formatDate(value, locale) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date);
}

function formatDateMed(value, locale) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

export default function NewsDetailPageContent() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromLanguage(i18n.language);

  const { data, isLoading, isError } = useGetNewsBySlug(slug);

  const detail = useMemo(() => {
    return (
      data?.data?.item ?? data?.data?.news ?? data?.item ?? data?.news ?? data?.data ?? null
    );
  }, [data]);

  const firstTag = detail?.tags?.[0] ?? '';

  const { data: relatedData } = useGetNewsList({
    page: 1,
    limit: 4,
    is_published: true,
    tag: firstTag || undefined,
    options: { enabled: Boolean(detail) && Boolean(firstTag) },
  });

  const relatedItems = useMemo(() => {
    const raw =
      relatedData?.data?.items ??
      relatedData?.data?.news ??
      relatedData?.items ??
      relatedData?.news ??
      [];
    const all = Array.isArray(raw) ? raw : [];
    return all.filter((item) => item?.slug !== slug && item?.id !== detail?.id).slice(0, 3);
  }, [relatedData, slug, detail?.id]);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: detail?.title ?? '', url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success(t('newsPage.detail.link_copied')))
        .catch(() => {});
    }
  }

  if (isLoading) {
    return (
      <RootLayout>
        <div className="bg-background min-h-screen px-4 py-4 lg:py-6">
          <div className="mx-auto w-full lg:w-[88%]">
            <div className="mb-4 h-9 w-36 animate-pulse rounded-xl bg-muted" />
            <div className="h-72 animate-pulse rounded-3xl bg-muted sm:h-96 lg:h-110" />
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
              <div className="h-96 animate-pulse rounded-3xl bg-muted" />
              <div className="space-y-4">
                <div className="h-36 animate-pulse rounded-3xl bg-muted" />
                <div className="h-64 animate-pulse rounded-3xl bg-muted" />
                <div className="h-32 animate-pulse rounded-3xl bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (isError || !detail) {
    return (
      <RootLayout>
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-xl rounded-3xl border-border/70">
            <CardContent className="space-y-4 px-6 py-6 text-center">
              <h1 className="typo-card-title text-foreground">{t('newsPage.detail.not_found')}</h1>
              <Button className="rounded-xl" onClick={() => navigate('/news')}>
                {t('newsPage.detail.back')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="bg-background min-h-screen px-4 py-4 lg:py-6">
        <div className="mx-auto w-full lg:w-[88%]">
          <NewsDetailHero
            detail={detail}
            t={t}
            locale={locale}
            formatDate={formatDate}
            onShare={handleShare}
          />

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
            <NewsDetailBody detail={detail} t={t} />
            <NewsDetailSidebar
              detail={detail}
              relatedItems={relatedItems}
              t={t}
              locale={locale}
              formatDate={formatDateMed}
            />
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
