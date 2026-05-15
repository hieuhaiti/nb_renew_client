import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import RootLayout from '@/components/layout/RootLayout';
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

  const detail = useMemo(
    () => data?.data?.item ?? data?.data?.news ?? data?.item ?? data?.news ?? data?.data ?? null,
    [data]
  );

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
      relatedData?.data?.items ?? relatedData?.data?.news ?? relatedData?.items ?? relatedData?.news ?? [];
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
        <div className="min-h-screen px-4 py-5 lg:py-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-4 h-9 w-32 animate-pulse rounded-[10px] border border-[#cfe0f4] bg-[#f8fbff]" />
            <div className="mb-5 h-72 animate-pulse rounded-[18px] border border-[#cfe0f4] bg-[#f8fbff] sm:h-96 lg:h-110" />
            <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-5 animate-pulse rounded-[8px] bg-[#f8fbff]" style={{ width: `${90 - i * 10}%` }} />
                ))}
              </div>
              <div className="space-y-3">
                <div className="h-36 animate-pulse rounded-[18px] border border-[#cfe0f4] bg-[#f8fbff]" />
                <div className="h-52 animate-pulse rounded-[18px] border border-[#cfe0f4] bg-[#f8fbff]" />
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
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-[18px] border border-[#cfe0f4] bg-white p-8 text-center shadow-[0_4px_16px_rgba(13,74,130,0.07)]">
            <p className="text-sm 2xl:text-base font-bold text-foreground">
              {t('newsPage.detail.not_found')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/news')}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-[#eef7ff]"
            >
              <ArrowLeft size={14} />
              {t('newsPage.detail.back')}
            </button>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="min-h-screen px-4 py-5 lg:py-6">
        <div className="mx-auto w-full max-w-7xl">
          <NewsDetailHero
            detail={detail}
            t={t}
            locale={locale}
            formatDate={formatDate}
            onShare={handleShare}
          />

          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
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
