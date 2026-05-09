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
      <div className="mb-4 flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm" className="h-9 gap-2 rounded-[10px] border border-[#cfe0f4] bg-white px-4 text-sm font-semibold text-foreground shadow-sm hover:bg-[#eef7ff]">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back', 'Quay lại')}
        </Button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isLiked}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#cfe0f4] bg-white shadow-sm hover:bg-[#eef7ff]"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#cfe0f4] bg-white shadow-sm hover:bg-[#eef7ff]"
          >
            <Share2 className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>

      {shareStatus !== 'idle' && (
        <div className="mb-3 rounded-[10px] border border-[#cfe0f4] bg-[#eef7ff] px-3 py-2 text-sm text-[#0b66c3]">
          {shareStatus === 'copied'
            ? t('tourism.share.copied', 'Đã sao chép liên kết')
            : t('tourism.share.shared', 'Đã chia sẻ')}
        </div>
      )}
    </>
  );
}
