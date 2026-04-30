import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, MapPinned, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetNewsBySlug } from '@/services/api/news/newsService';
import { getLocaleFromLanguage, hasHtmlMarkup, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

function formatDate(value, locale) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date);
}

export default function NewsDetailPageContent() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromLanguage(i18n.language);

  const { data, isLoading, isError } = useGetNewsBySlug(slug);

  const detail = useMemo(() => {
    return data?.data?.item || data?.data?.news || data?.item || data?.news || data?.data || null;
  }, [data]);

  const title = detail?.title || '--';
  const summary = detail?.summary || '';
  const content = detail?.content || '';
  const dateLabel = formatDate(detail?.published_at || detail?.created_at, locale);
  const author = detail?.author_name || t('newsPage.list.unknown_author');
  const thumbnail = withBaseUrl(detail?.thumbnail_url || '');
  const tags = Array.isArray(detail?.tags) ? detail.tags : [];

  const isHtmlContent = hasHtmlMarkup(content);
  const sanitizedHtml = useMemo(() => {
    if (!isHtmlContent) return '';
    return DOMPurify.sanitize(content);
  }, [isHtmlContent, content]);

  if (isLoading) {
    return (
      <RootLayout>
        <div className="bg-background min-h-screen px-4 py-8">
          <div className="mx-auto max-w-6xl animate-pulse rounded-3xl border border-border/70 bg-card p-8" />
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
          <Button variant="outline" className="mb-4 rounded-xl" onClick={() => navigate('/news')}>
            {t('newsPage.detail.back')}
          </Button>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <article className="space-y-4">
              <Card className="gap-0 overflow-hidden rounded-3xl border-border/70 py-0 shadow-sm">
                <div className="h-72 bg-muted sm:h-96">
                  <img
                    src={thumbnail || placeholderImg}
                    alt={title}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = placeholderImg;
                    }}
                  />
                </div>
              </Card>

              <Card className="rounded-3xl border-border/70 shadow-sm">
                <CardContent className="space-y-4 px-6 py-6">
                  <h1 className="typo-hero text-foreground">{title}</h1>
                  {summary ? <p className="typo-body text-muted-foreground leading-relaxed">{summary}</p> : null}

                  <div className="typo-meta text-muted-foreground flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="h-4 w-4" />
                      {author}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {dateLabel}
                    </span>
                  </div>

                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="typo-badge rounded-full bg-secondary/15 px-2.5 py-1 text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {isHtmlContent ? (
                    <div
                      className="typo-body text-foreground prose prose-sm max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                    />
                  ) : (
                    <p className="typo-body text-foreground whitespace-pre-line leading-relaxed">
                      {content || t('newsPage.detail.no_content')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </article>

            <aside>
              <Card className="rounded-3xl border-border/70 shadow-sm">
                <CardContent className="space-y-4 px-5 py-5">
                  <h2 className="typo-section-title text-foreground">{t('newsPage.detail.sidebar_title')}</h2>
                  <p className="typo-body text-muted-foreground">{t('newsPage.detail.sidebar_desc')}</p>
                  <Button className="w-full rounded-xl" onClick={() => navigate('/map')}>
                    <MapPinned className="mr-1.5 h-4 w-4" />
                    {t('newsPage.detail.cta_map')}
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

