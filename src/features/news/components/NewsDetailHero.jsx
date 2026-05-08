import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Eye, Share2, Star, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export default function NewsDetailHero({ detail, t, locale, formatDate, onShare }) {
  const navigate = useNavigate();

  const title = detail?.title ?? '--';
  const author = detail?.author_name ?? t('newsPage.list.unknown_author');
  const thumbnail = withBaseUrl(detail?.thumbnail_url ?? '');
  const dateLabel = formatDate(detail?.published_at ?? detail?.created_at, locale);
  const isFeatured = Boolean(detail?.is_featured);
  const viewCount = detail?.view_count ?? 0;

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        className="mb-4 rounded-xl"
        onClick={() => navigate('/news')}
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        {t('newsPage.detail.back')}
      </Button>

      <div className="relative h-72 overflow-hidden rounded-3xl sm:h-96 lg:h-110">
        <img
          src={thumbnail || placeholderImg}
          alt={title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

        <Button
          size="icon"
          className="absolute top-4 right-4 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
          onClick={onShare}
          title={t('newsPage.detail.share')}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-7">
          {isFeatured && (
            <div className="mb-3">
              <span className="typo-badge bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {t('newsPage.list.featured')}
              </span>
            </div>
          )}

          <h1 className="typo-hero text-white">{title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/80">
            <span className="typo-meta inline-flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" />
              {author}
            </span>
            <span className="typo-meta inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateLabel}
            </span>
            {viewCount > 0 && (
              <span className="typo-meta inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {viewCount.toLocaleString(locale)} {t('newsPage.detail.views')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
