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
      <div className="border-primary/20 bg-card mb-3 flex items-center justify-between rounded-[10px] border-[0.5px] px-2.5 py-1.5">
        <Button onClick={onBack} variant="outline" size="sm" className="h-8 gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back', 'Quay lại')}
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            onClick={onToggleFavorite}
            aria-pressed={isLiked}
            variant={isLiked ? 'default' : 'outline'}
            size="icon-sm"
            className="h-8 w-8 rounded-md"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">{t('tourism.actions.save', 'Lưu')}</span>
          </Button>
          <Button onClick={onShare} variant="outline" size="icon-sm" className="h-8 w-8 rounded-md">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">{t('tourism.actions.share', 'Chia sẻ')}</span>
          </Button>
        </div>
      </div>

      {shareStatus !== 'idle' && (
        <div className="border-primary/20 bg-card text-muted-foreground mb-3 rounded-[8px] border-[0.5px] px-3 py-1.5 text-sm">
          {shareStatus === 'copied'
            ? t('tourism.share.copied', 'Đã sao chép liên kết')
            : t('tourism.share.shared', 'Đã chia sẻ')}
        </div>
      )}
    </>
  );
}
