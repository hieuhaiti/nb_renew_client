import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export default function NewsCardsGrid({ items, t, locale, formatDate }) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const slug = item?.slug || item?.id || '';
        const title = item?.title || '--';
        const summary = item?.summary || '';
        const imageSrc = withBaseUrl(item?.thumbnail_url || '');
        const author = item?.author_name || t('newsPage.list.unknown_author');
        const dateLabel = formatDate(item?.published_at || item?.created_at, locale);
        const isFeatured = Boolean(item?.is_featured);

        return (
          <Card key={item?.id || slug || title} className="gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm">
            <div className="relative h-52">
              <img
                src={imageSrc || placeholderImg}
                alt={title}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = placeholderImg;
                }}
              />
              {isFeatured ? (
                <span className="typo-badge absolute top-3 left-3 rounded-full bg-card/90 px-2.5 py-1 text-primary">
                  {t('newsPage.list.featured')}
                </span>
              ) : null}
            </div>

            <CardContent className="px-4 py-4">
              <div className="typo-meta text-muted-foreground flex items-center justify-between gap-2">
                <span className="truncate" title={author}>
                  {author}
                </span>
                <span>{dateLabel}</span>
              </div>

              <h3 className="typo-section-title mt-2 truncate text-foreground" title={title}>
                {title}
              </h3>

              <p
                className="typo-body text-muted-foreground line-clamp-3"
                title={summary || t('newsPage.list.no_summary')}
              >
                {summary || t('newsPage.list.no_summary')}
              </p>

              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => navigate(`/news/${encodeURIComponent(String(slug))}`)}
                  disabled={!slug}
                >
                  {t('newsPage.actions.read_more')}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

