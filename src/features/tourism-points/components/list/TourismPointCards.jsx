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

export function TourismPointFeaturedCard({
  point,
  onClick,
  t,
  categoryName,
  isLiked,
  onToggleLike,
}) {
  const imgUrl = point?.main_image_url || point?.main_image || null;
  const safeImg = imgUrl ? withBaseUrl(imgUrl) : placeholderImg;

  return (
    <div
      className="group text-primary bg-card flex min-h-75 w-full cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md md:flex-row dark:border-(--border-primary)"
      onClick={onClick}
    >
      <div className="text-primary relative w-full shrink-0 overflow-hidden md:w-[60%]">
        <img
          src={safeImg}
          alt={point.name}
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
          <span className="text-primary-foreground bg-primary rounded border px-2 py-0.5 text-[10px] font-bold shadow-sm">
            Mới
          </span>
          <div className="text-primary flex items-center text-xs font-medium">
            <Star size={13} className="text-primary mr-1" />
            {point.average_rating ? Number(point.average_rating).toFixed(1) : '4.9'} -{' '}
            {point.total_reviews || 512} {t('tourismPointPage.reviews', 'đánh giá')}
          </div>
        </div>
        <h2 className="group-hover:text-primary-foreground dark:group-hover:text-primary-foreground text-foreground mb-2 line-clamp-1 text-2xl font-bold transition-colors">
          {point.name}
        </h2>
        <div className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
          {point.description?.includes('<') ? (
            <div dangerouslySetInnerHTML={{ __html: point.description }} />
          ) : (
            <p>
              {point.description ||
                'Cố đô Hoa Lư là thủ đô đầu tiên của Việt Nam thời phong kiến...'}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-sm">
          <div className="text-muted-foreground flex items-center font-medium">
            <div className="bg-muted-foreground mr-2 h-1.5 w-1.5 rounded-full" />
            {point.address?.split(',')[0] || 'Trường Yên, Ninh Bình'}
          </div>
          <div className="text-muted-foreground flex items-center font-medium">
            <div className="bg-muted-foreground mr-2 h-1.5 w-1.5 rounded-full" />
            {point.opening_hours?.default || '07:30 - 17:00'}
          </div>
          <div className="mt-4 ml-auto flex w-full items-center justify-between gap-4 md:mt-0 md:w-auto md:justify-end">
            <div className="text-primary dark:text-primary text-base font-bold">
              {point.entrance_fee && parseInt(point.entrance_fee) > 0
                ? formatVND(point.entrance_fee)
                : '20.000 đ'}
            </div>
            <div className="flex items-center gap-2">
              <Button>{t('tourismPointPage.view_detail', 'Xem chi tiết')}</Button>
              <Button variant="outline" size="icon" onClick={onToggleLike}>
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
  const imgUrl = point?.main_image_url || point?.main_image || null;
  const safeImg = imgUrl ? withBaseUrl(imgUrl) : placeholderImg;

  if (isList) {
    return (
      <div
        onClick={onClick}
        className="group text-primary bg-card flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border p-3 shadow-sm transition-shadow hover:shadow-md dark:border-(--border-primary)"
      >
        <div className="text-primary relative h-32 w-32 shrink-0 overflow-hidden rounded-lg">
          <img
            src={safeImg}
            alt={point.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImg;
            }}
          />
        </div>
        <div className="flex h-full flex-1 flex-col justify-center py-2">
          <h3 className="group-hover:text-primary-foreground dark:group-hover:text-primary-foreground text-foreground mb-1 line-clamp-1 text-lg font-bold transition-colors">
            {point.name}
          </h3>
          <div className="text-muted-foreground mb-2 line-clamp-2 text-sm">
            {point.description?.replace(/<[^>]*>?/gm, '') || 'Mô tả ngắn gọn về điểm đến.'}
          </div>
          <div className="border-border text-primary mt-auto flex items-center justify-between border-t pt-2">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <MapPin size={12} /> {point.address?.split(',')[0] || 'Trường Yên, Hoa Lư'}
            </div>
            <div className="text-foreground text-sm font-semibold">
              {point.entrance_fee && parseInt(point.entrance_fee) > 0
                ? formatVND(point.entrance_fee)
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
          alt={point.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />

        <div className="text-primary pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="text-primary-foreground bg-primary/60 rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-md">
            {categoryName}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <Button type="button" variant="ghost" size="icon-xs" onClick={onToggleLike}>
            <Bookmark size={13} className={isLiked ? 'fill-destructive' : ''} />
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <h3 className="shadow-sm-text group-hover:text-primary-foreground dark:group-hover:text-primary-foreground text-foreground mb-1 line-clamp-1 text-[17px] font-bold transition-colors">
          {point.name}
        </h3>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-primary rounded border px-1.5 py-px text-[10px] font-bold">
            Mới
          </span>
          <div className="text-foreground flex items-center text-[11px] font-semibold">
            <Star size={11} className="text-primary mr-1" />
            {point.average_rating ? Number(point.average_rating).toFixed(1) : '4.5'}
          </div>
        </div>

        <div className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
          {point.description?.replace(/<[^>]*>?/gm, '') ||
            'Quần thể du lịch tâm linh trọng điểm...'}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="text-muted-foreground flex flex-col gap-1 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <div className="bg-muted-foreground h-1 w-1 rounded-full" />
              {point.address?.split(',')[0] || 'Hoa Lư, Ninh Bình'}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="bg-primary h-2.5 w-0.75 rounded-sm" />
              <div className="bg-primary mr-0.5 h-2.5 w-0.75 rounded-sm" />
              {point.opening_hours?.default || '07:30 - 17:00'}
            </span>
          </div>

          <div className="text-primary dark:text-primary text-sm font-bold">
            {point.entrance_fee && parseInt(point.entrance_fee) > 0 ? (
              <span className="text-primary dark:text-primary">
                {formatVND(point.entrance_fee)}
              </span>
            ) : (
              t('tourismPointPage.free', 'Miễn phí')
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
