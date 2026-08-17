import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Eye, Share2, Star, UserRound } from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { Button } from '@/components/ui/button';

export default function NewsDetailHero({ detail, t, locale, formatDate, onShare }) {
  const navigate = useNavigate();

  const title = detail?.title ?? '—';
  const author = detail?.author_name ?? t('newsPage.list.unknown_author');
  const thumbnail = withBaseUrl(detail?.thumbnail_url ?? '');
  const dateLabel = formatDate(detail?.published_at ?? detail?.created_at, locale);
  const isFeatured = Boolean(detail?.is_featured);
  const viewCount = detail?.view_count ?? 0;
  const tags = Array.isArray(detail?.tags) ? detail.tags.slice(0, 4) : [];

  return (
    <div className="mb-5">
      {/* Back button */}
      <Button variant="ghost"
        type="button"
        onClick={() => navigate('/news')}
        className="mb-4 flex items-center gap-1.5 rounded-[10px] border border-[#cfe0f4] bg-white px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-[#eef7ff]"
      >
        <ArrowLeft size={15} />
        {t('newsPage.detail.back')}
      </Button>

      {/* Hero image */}
      <div className="relative h-72 overflow-hidden rounded-[18px] shadow-[0_8px_24px_rgba(13,74,130,0.12)] sm:h-96 lg:h-110">
        <img
          src={thumbnail || placeholderImg}
          alt={title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent" />

        {/* Share button */}
        <Button variant="ghost"
          type="button"
          onClick={onShare}
          title={t('newsPage.detail.share')}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
        >
          <Share2 size={15} />
        </Button>

        {/* Content on image */}
        <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-7">
          {/* Badges row */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {isFeatured && (
              <span className="flex items-center gap-1 rounded-full bg-[#f59e0b]/90 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                <Star size={10} className="fill-white" />
                {t('newsPage.list.featured')}
              </span>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
              >
                {tag.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          <h1 className="text-xl font-black leading-snug tracking-tight text-white drop-shadow sm:text-2xl lg:text-3xl">
            {title}
          </h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-white/80">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <UserRound size={13} />
              {author}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <CalendarDays size={13} />
              {dateLabel}
            </span>
            {viewCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <Eye size={13} />
                {viewCount.toLocaleString(locale)} {t('newsPage.detail.views')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


