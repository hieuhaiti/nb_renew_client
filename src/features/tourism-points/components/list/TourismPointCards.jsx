import React from 'react';
import { Bookmark, MapPin, Clock, Star } from 'lucide-react';
import { formatVND, withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { Button } from '@/components/ui/button';

const BTN_GRADIENT = { background: 'linear-gradient(135deg, #0b66c3, #0ea5e9)' };

export function TourismPointSkeletonCard({ isFeatured }) {
  if (isFeatured) {
    return <div className="bg-muted mb-5 h-72 w-full animate-pulse rounded-3xl md:h-80" />;
  }
  return <div className="bg-muted h-72 w-full animate-pulse rounded-[22px]" />;
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
      className="group mb-5 grid cursor-pointer grid-cols-1 overflow-hidden rounded-3xl border border-[#a8bed4] bg-white shadow-[0_14px_34px_rgba(13,74,130,0.14)] md:grid-cols-[1.1fr_1fr]"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative min-h-52 overflow-hidden md:min-h-77.5">
        <img
          src={safeImg}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        <span className="bg-primary/80 absolute top-3.5 left-3.5 rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          {categoryName}
        </span>
        <Button variant="ghost"
          type="button"
          onClick={onToggleLike}
          className="text-primary absolute top-3.5 right-3.5 flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-white/75 bg-white/90"
        >
          <Bookmark size={14} className={isLiked ? 'fill-destructive text-destructive' : ''} />
        </Button>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-center p-6 md:p-8">
        {/* Top meta */}
        <div className="text-primary mb-2.5 flex flex-wrap items-center gap-2.5 text-sm font-bold">
          {point?.is_featured && (
            <span className="bg-primary rounded-[7px] px-2 py-0.5 text-xs font-bold text-white">
              Mới
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-[#d99200] text-[#d99200]" />
            {rating ? Number(rating).toFixed(1) : '—'} &mdash; {reviewCount}{' '}
            {t('tourismPointPage.reviews', 'đánh giá')}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-foreground group-hover:text-primary mb-2.5 line-clamp-2 text-3xl leading-tight font-black tracking-tight transition-colors">
          {name}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {description?.replace(/<[^>]*>?/gm, '') || ''}
        </p>

        {/* Meta row */}
        <div className="my-5 flex flex-wrap gap-4 text-sm font-bold text-[#53677e]">
          {address && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {address.split(',')[0]}
            </span>
          )}
          {openingHours && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {openingHours}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3.5">
          <div className="text-primary text-2xl font-black">
            {price && parseInt(price) > 0
              ? formatVND(price)
              : t('tourismPointPage.free', 'Miễn phí')}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost"
              className="h-10.5 rounded-full px-4.5 text-sm font-bold text-white"
              style={BTN_GRADIENT}
            >
              {t('tourismPointPage.view_detail', 'Xem chi tiết')}
            </Button>
            <Button variant="ghost"
              type="button"
              onClick={onToggleLike}
              className="flex h-10.5 w-10.5 items-center justify-center rounded-full border border-[#9db8d2] bg-white text-[#52647a]"
            >
              <Bookmark size={16} className={isLiked ? 'fill-destructive text-destructive' : ''} />
            </Button>
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
        className="group flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-[#a8bed4] bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg">
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
          <h3 className="text-foreground group-hover:text-primary mb-1 line-clamp-1 text-sm font-black transition-colors 2xl:text-base">
            {name}
          </h3>
          <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
            {description?.replace(/<[^>]*>?/gm, '') || ''}
          </p>
          <div className="border-border mt-auto flex items-center justify-between border-t pt-2 text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <MapPin size={12} /> {address.split(',')[0] || ''}
            </span>
            <span className="text-foreground font-bold">
              {price && parseInt(price) > 0
                ? formatVND(price)
                : t('tourismPointPage.free', 'Miễn phí')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-[#a8bed4] bg-white shadow-[0_8px_22px_rgba(13,74,130,0.10)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(13,74,130,0.18)]"
    >
      {/* Thumbnail */}
      <div className="relative h-43.75 overflow-hidden">
        <img
          src={safeImg}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        <span className="bg-primary/80 absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {categoryName}
        </span>
        <Button variant="ghost"
          type="button"
          onClick={onToggleLike}
          className="text-primary absolute top-3 right-3 flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-white/75 bg-white/90"
        >
          <Bookmark size={13} className={isLiked ? 'fill-destructive text-destructive' : ''} />
        </Button>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4.25">
        <h3 className="text-foreground group-hover:text-primary mb-1.5 line-clamp-1 text-lg leading-snug font-black transition-colors">
          {name}
        </h3>

        <div className="mb-2 flex items-center gap-1 font-bold text-[#d99200]">
          <Star size={13} className="fill-[#d99200]" />
          {rating ? Number(rating).toFixed(1) : '—'}
        </div>

        <p className="text-muted-foreground line-clamp-2 min-h-11.75 text-sm leading-relaxed">
          {description?.replace(/<[^>]*>?/gm, '') || ''}
        </p>

        {/* Footer */}
        <div className="mt-3.5 grid gap-1.5 text-sm font-bold text-[#52647a]">
          {address && (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#52647a]" />
              {address.split(',')[0]}
            </span>
          )}
          <div className="text-primary flex items-center justify-between font-black">
            <span className="font-semibold text-[#52647a]">{openingHours || ''}</span>
            <span>
              {price && parseInt(price) > 0
                ? formatVND(price)
                : t('tourismPointPage.free', 'Miễn phí')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


