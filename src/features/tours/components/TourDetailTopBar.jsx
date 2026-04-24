import React from 'react';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TourDetailTopBar({ onBack, isLiked, onToggleFavorite, onShare, t, shareStatus }) {
  return (
    <>
      <div className="bg-card mb-3 flex items-center justify-between rounded-[10px] border-[0.5px] border-nature-border px-2.5 py-1.5">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-primary h-8 gap-1.5 hover:bg-nature-soft"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('tourPage.back', 'Quay lại')}
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            onClick={onToggleFavorite}
            aria-pressed={isLiked}
            variant="ghost"
            size="icon-sm"
            className={`h-8 w-8 rounded-md border-[0.5px] ${
              isLiked
                ? 'text-primary-foreground border-nature bg-nature'
                : 'bg-card text-primary border-nature-border hover:bg-nature-soft'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">{t('tourPage.save', 'Lưu')}</span>
          </Button>
          <Button
            onClick={onShare}
            variant="ghost"
            size="icon-sm"
            className="bg-card text-primary h-8 w-8 rounded-md border-[0.5px] border-nature-border hover:bg-nature-soft"
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">{t('tourPage.share', 'Chia sẻ')}</span>
          </Button>
        </div>
      </div>

      {shareStatus !== 'idle' && (
        <div className="bg-card text-muted-foreground mb-3 rounded-[8px] border-[0.5px] border-nature-border px-3 py-1.5 text-xs">
          {shareStatus === 'copied'
            ? t('tourPage.copied', 'Đã sao chép liên kết')
            : t('tourPage.shared', 'Đã chia sẻ')}
        </div>
      )}
    </>
  );
}
