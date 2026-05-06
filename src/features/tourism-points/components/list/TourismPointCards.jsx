import React from 'react';
import { Bookmark, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatVND, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export function TourismPointSkeletonCard({ isFeatured }) {
  if (isFeatured) {
    return <div className="text-primary mb-6 h-72 w-full animate-pulse rounded-2xl md:h-80" />;
  }
  return <div className="text-primary h-80 w-full animate-pulse rounded-2xl" />;
}

function getPointName(point) {
  return point?.name_vi || point?.name_en || point?.name || '';
}

function getPointDescription(point) {
  return point?.description_vi || point?.description_en || point?.description || '';
}

function getPointAddress(point) {
  return point?.address_vi || point?.address_en || point?.address || '';
}

function getPointImage(point) {
  const url = point?.primary_image || point?.main_image_url || point?.main_image || null;
  return url ? withBaseUrl(url) : placeholderImg;
}

function getPointRating(point) {
  return point?.rating_avg ?? point?.average_rating ?? null;
}

function getPointReviewCount(point) {
  return point?.rating_count ?? point?.total_reviews ?? 0;
}

function getPointTicketPrice(point) {
  return point?.ticket_price_adult ?? point?.entrance_fee ?? null;
}

function getOpeningHours(point) {
  const oh = point?.opening_hours;
  if (!oh) return null;

  const directDaily = oh?.daily || oh?.default;
  if (typeof directDaily === 'string' || typeof directDaily === 'number') {
    return String(directDaily);
  }

  const note = oh?.note_vi || oh?.note_en;
  if (typeof note === 'string' && note.trim()) return note.trim();

  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  for (const dayKey of dayKeys) {
    const dayRange = oh?.[dayKey];
    if (!dayRange || typeof dayRange !== 'object') continue;
    const open = dayRange?.open;
    const close = dayRange?.close;
    if (typeof open === 'string' && typeof close === 'string') {
      return `${open} - ${close}`;
    }
  }

  return null;
}

export function TourismPointFeaturedCard({
  point,
  onClick,
  t,
  categoryName,
  isLiked,
  onToggleLike,
}) {
  const safeImg = getPointImage(point);
  const rating = getPointRating(point);
  const reviewCount = getPointReviewCount(point);
  const price = getPointTicketPrice(point);
  const name = getPointName(point);
  const description = getPointDescription(point);
  const address = getPointAddress(point);
  const openingHours = getOpeningHours(point);

  return (
    <div
      className="group text-primary bg-card flex min-h-75 w-full cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md md:flex-row"
      onClick={onClick}
    >
      <div className="text-primary relative w-full shrink-0 overflow-hidden md:w-[60%]">
        <img
          src={safeImg}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="text-primary-foreground bg-primary/60 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md">
            {categoryName}
          </span>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col justify-center p-6 md:p-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-primary-foreground bg-primary rounded border px-2 py-0.5 text-xs font-bold shadow-sm">
            Mới
          </span>
          <div className="text-primary flex items-center text-xs font-medium">
            <Star size={13} className="mr-1 fill-yellow-400 text-yellow-400" />
            {rating ? Number(rating).toFixed(1) : '—'} - {reviewCount}{' '}
            {t('tourismPointPage.reviews', 'đánh giá')}
          </div>
        </div>
        <h2 className="group-hover:text-primary text-foreground mb-2 line-clamp-1 text-2xl font-bold transition-colors">
          {name}
        </h2>
        <div className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
          {description?.includes('<') ? (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p>{description}</p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-sm">
          <div className="text-muted-foreground flex items-center font-medium">
            <div className="bg-muted-foreground mr-2 h-1.5 w-1.5 rounded-full" />
            {address.split(',')[0] || ''}
          </div>
          {openingHours && (
            <div className="text-muted-foreground flex items-center font-medium">
              <div className="bg-muted-foreground mr-2 h-1.5 w-1.5 rounded-full" />
              {openingHours}
            </div>
          )}
          <div className="mt-4 ml-auto flex w-full items-center justify-between gap-4 md:mt-0 md:w-auto md:justify-end">
            <div className="text-primary dark:text-primary text-base font-bold">
              {price && parseInt(price) > 0
                ? formatVND(price)
                : t('tourismPointPage.free', 'Miễn phí')}
            </div>
            <div className="flex items-center gap-2">
              <Button className="rounded-full font-medium shadow-sm">
                {t('tourismPointPage.view_detail', 'Xem chi tiết')}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full shadow-sm ${isLiked ? 'text-primary' : ''}`}
                onClick={onToggleLike}
              >
                <Bookmark size={16} className={isLiked ? 'fill-destructive' : ''} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TourismPointStandardCard({
  point,
  onClick,
  viewMode,
  t,
  categoryName,
  isLiked,
  onToggleLike,
}) {
  const isList = viewMode === 'list';
  const safeImg = getPointImage(point);
  const rating = getPointRating(point);
  const price = getPointTicketPrice(point);
  const name = getPointName(point);
  const description = getPointDescription(point);
  const address = getPointAddress(point);
  const openingHours = getOpeningHours(point);

  if (isList) {
    return (
      <div
        onClick={onClick}
        className="group text-primary bg-card flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border p-3 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="text-primary relative h-32 w-32 shrink-0 overflow-hidden rounded-lg">
          <img
            src={safeImg}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImg;
            }}
          />
        </div>
        <div className="flex h-full flex-1 flex-col justify-center py-2">
          <h3 className="group-hover:text-primary text-foreground mb-1 line-clamp-1 text-lg font-bold transition-colors">
            {name}
          </h3>
          <div className="text-muted-foreground mb-2 line-clamp-2 text-sm">
            {description?.replace(/<[^>]*>?/gm, '') || ''}
          </div>
          <div className="border-border text-primary mt-auto flex items-center justify-between border-t pt-2">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <MapPin size={12} /> {address.split(',')[0] || ''}
            </div>
            <div className="text-foreground text-sm font-semibold">
              {price && parseInt(price) > 0
                ? formatVND(price)
                : t('tourismPointPage.free', 'Miễn phí')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group text-primary bg-card relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      <div className="text-primary relative h-44 w-full overflow-hidden">
        <img
          src={safeImg}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />

        <div className="text-primary pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="text-primary-foreground bg-primary/60 rounded-full border px-2.5 py-1 text-xs font-bold backdrop-blur-md">
            {categoryName}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onToggleLike}
            className={`text-primary hover:text-primary h-7 w-7 rounded-full p-0 shadow-sm backdrop-blur-md transition-colors ${isLiked ? 'text-primary' : ''}`}
          >
            <Bookmark size={13} className={isLiked ? 'fill-destructive' : ''} />
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <h3 className="shadow-sm-text group-hover:text-primary text-foreground typo-search mb-1 line-clamp-1 font-bold transition-colors">
          {name}
        </h3>

        <div className="mb-2 flex items-center gap-2">
          {point?.is_featured && (
            <span className="text-primary rounded border px-1.5 py-px text-xs font-bold">
              Nổi bật
            </span>
          )}
          <div className="text-foreground flex items-center text-xs font-semibold">
            <Star size={11} className="mr-1 fill-yellow-400 text-yellow-400" />
            {rating ? Number(rating).toFixed(1) : '—'}
          </div>
        </div>

        <div className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
          {description?.replace(/<[^>]*>?/gm, '') || ''}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="text-muted-foreground flex flex-col gap-1 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <div className="bg-muted-foreground h-1 w-1 rounded-full" />
              {address.split(',')[0] || ''}
            </span>
            {openingHours && (
              <span className="flex items-center gap-1.5">
                <div className="bg-primary h-2.5 w-0.75 rounded-sm" />
                <div className="bg-primary mr-0.5 h-2.5 w-0.75 rounded-sm" />
                {openingHours}
              </span>
            )}
          </div>

          <div className="text-primary dark:text-primary text-sm font-bold">
            {price && parseInt(price) > 0 ? (
              <span className="text-primary dark:text-primary">{formatVND(price)}</span>
            ) : (
              t('tourismPointPage.free', 'Miễn phí')
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
