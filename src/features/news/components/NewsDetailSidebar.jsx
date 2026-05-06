import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export default function NewsDetailSidebar({ detail, relatedItems, t, locale, formatDate }) {
  const navigate = useNavigate();
  const tags = Array.isArray(detail?.tags) ? detail.tags : [];

  return (
    <aside className="space-y-4">
      {tags.length > 0 && (
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="px-5 py-5">
            <div className="mb-3 flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              <h2 className="typo-section-title text-foreground">{t('newsPage.detail.tags_title')}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="typo-badge rounded-full bg-secondary/10 px-2.5 py-1 text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl border-border/70 shadow-sm">
        <CardContent className="space-y-3 px-5 py-5">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-primary" />
            <h2 className="typo-section-title text-foreground">{t('newsPage.detail.related_title')}</h2>
          </div>

          {relatedItems.length === 0 ? (
            <p className="typo-meta text-muted-foreground">{t('newsPage.detail.no_related')}</p>
          ) : (
            <div className="space-y-2">
              {relatedItems.map((item) => {
                const itemSlug = item?.slug || item?.id || '';
                const itemTitle = item?.title || '--';
                const itemDate = formatDate(item?.published_at || item?.created_at, locale);
                const itemThumb = withBaseUrl(item?.thumbnail_url ?? '');

                return (
                  <Button
                    key={item?.id ?? itemSlug}
                    variant="ghost"
                    className="h-auto w-full justify-start rounded-2xl border border-border/60 p-3 hover:bg-muted/40"
                    onClick={() => navigate(`/news/${encodeURIComponent(String(itemSlug))}`)}
                    disabled={!itemSlug}
                  >
                    <div className="flex w-full gap-3 text-left">
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <img
                          src={itemThumb || placeholderImg}
                          alt={itemTitle}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholderImg;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="typo-meta line-clamp-2 font-semibold text-foreground"
                          title={itemTitle}
                        >
                          {itemTitle}
                        </p>
                        <p className="typo-meta mt-1 text-muted-foreground">{itemDate}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
