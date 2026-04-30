import React from 'react';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TourismDetailTopBar({
  onBack,
  isLiked,
  onToggleFavorite,
  onShare,
  t,
  shareStatus,
}) {
  return (
    <>
      <div className="border-nature-border bg-card mb-3 flex items-center justify-between rounded-[10px] border-[0.5px] px-2.5 py-1.5">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-nature-soft h-8 gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back', 'Quay lại')}
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            onClick={onToggleFavorite}
            aria-pressed={isLiked}
            variant="ghost"
            size="icon-sm"
            className={`h-8 w-8 rounded-md border-[0.5px] ${
              isLiked
                ? 'border-nature bg-nature text-nature-foreground'
                : 'text-primary border-nature-border bg-card hover:bg-nature-soft'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">{t('tourism.save', 'Lưu')}</span>
          </Button>
          <Button
            onClick={onShare}
            variant="ghost"
            size="icon-sm"
            className="text-primary border-nature-border bg-card hover:bg-nature-soft h-8 w-8 rounded-md border-[0.5px]"
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">{t('tourism.share', 'Chia sẻ')}</span>
          </Button>
        </div>
      </div>

      {shareStatus !== 'idle' && (
        <div className="text-muted-foreground border-nature-border bg-card mb-3 rounded-[8px] border-[0.5px] px-3 py-1.5 text-xs">
          {shareStatus === 'copied'
            ? t('tourism.share.copied', 'Đã sao chép liên kết')
            : t('tourism.share.shared', 'Đã chia sẻ')}
        </div>
      )}
    </>
  );
}
