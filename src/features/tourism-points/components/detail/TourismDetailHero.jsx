import React from 'react';
import { Heart, Share2, Expand, MapPin, Star, Clock, Ticket } from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { Button } from '@/components/ui/button';

export function TourismDetailHero({
  imageSrc,
  title,
  subtitle,
  description,
  categoryTag,
  totalImages,
  openingTime,
  ticketDisplay,
  ratingAvg,
  ratingCount,
  capacityPct,
  maxCapacity,
  isLiked,
  onToggleFavorite,
  onShare,
  t,
}) {
  const displayRating = ratingAvg > 0 ? Number(ratingAvg).toFixed(1) : null;

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/75 bg-white shadow-[0_14px_35px_rgba(7,29,54,0.12)]">
      {/* Hero image + overlay */}
      <div className="relative flex min-h-[280px] items-end p-6 md:min-h-[420px] md:p-7">
        <img
          src={withBaseUrl(imageSrc)}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,35,50,0.72)] via-[rgba(4,35,50,0.10)] to-transparent" />

        {/* Floating action buttons */}
        <div className="absolute top-4 right-4 flex gap-2.5 md:top-6 md:right-6">
          <FloatBtn onClick={onToggleFavorite} label={t('tourism.actions.save', 'Lưu')}>
            <Heart
              className={`h-[17px] w-[17px] ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
            />
          </FloatBtn>
          <FloatBtn onClick={onShare} label={t('tourism.actions.share', 'Chia sẻ')}>
            <Share2 className="h-[17px] w-[17px]" />
          </FloatBtn>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-[880px] text-white">
          {categoryTag && (
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-[12px] font-black text-[#087d74]">
              {categoryTag}
            </div>
          )}

          <h1 className="mb-2 text-[28px] leading-[1.12] font-black tracking-tight md:text-[46px]">
            {title}
          </h1>

          {description && (
            <p className="mb-4 line-clamp-2 text-sm leading-[1.7] text-[#effffb] md:text-base">
              {description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {subtitle && (
              <MetaPill icon={<MapPin className="h-3.5 w-3.5 text-[#08aeb9]" />}>
                {subtitle}
              </MetaPill>
            )}
            {displayRating && (
              <MetaPill icon={<Star className="h-3.5 w-3.5 text-[#08aeb9]" />}>
                {displayRating}/5{ratingCount > 0 ? ` · ${ratingCount} đánh giá` : ''}
              </MetaPill>
            )}
            {openingTime && (
              <MetaPill icon={<Clock className="h-3.5 w-3.5 text-[#08aeb9]" />}>
                {openingTime}
              </MetaPill>
            )}
            {ticketDisplay && (
              <MetaPill icon={<Ticket className="h-3.5 w-3.5 text-[#08aeb9]" />}>
                {ticketDisplay}
              </MetaPill>
            )}
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 divide-x divide-[#e4f0f7] border-t border-[#e4f0f7] sm:grid-cols-5">
        <SummaryItem value={openingTime || '–'} label={t('tourism.opening', 'Giờ mở cửa')} />
        <SummaryItem
          value={ticketDisplay || 'Miễn phí'}
          label={t('tourism.ticket_price', 'Giá vé')}
        />
        <SummaryItem
          value={displayRating ? `${displayRating}★` : '–'}
          label={t('tourism.rating', 'Đánh giá')}
        />
        <SummaryItem
          value={maxCapacity ? Number(maxCapacity).toLocaleString('vi') : '–'}
          label={t('tourism.max_capacity', 'Sức chứa')}
          extraClass="hidden sm:block"
        />
        <SummaryItem
          value={capacityPct != null ? `${Math.round(Number(capacityPct))}%` : '–'}
          label={t('tourism.current_capacity', 'Tải khách')}
          extraClass="hidden sm:block"
        />
      </div>
    </section>
  );
}

function FloatBtn({ children, onClick, label }) {
  return (
    <Button variant="ghost"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#0a7f7b] shadow-[0_12px_25px_rgba(7,29,54,0.18)] transition-colors hover:bg-gray-50"
    >
      {children}
    </Button>
  );
}

function MetaPill({ children, icon }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-[13px] font-extrabold text-[#18344d]">
      {icon}
      {children}
    </span>
  );
}

function SummaryItem({ value, label, extraClass = '' }) {
  return (
    <div className={`bg-white px-2 py-4 text-center ${extraClass}`}>
      <b className="block truncate text-base font-extrabold text-[#079b91] md:text-[21px]">
        {value}
      </b>
      <span className="text-[11px] font-extrabold text-[#64748b] md:text-[12px]">{label}</span>
    </div>
  );
}


