import React from 'react';
import { Button } from '@/components/ui/button';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export function TourDetailGallerySection({ images, title, onPickImage, t }) {
  return (
    <section className="bg-card mb-3 rounded-[10px] border-[0.5px] border-border px-4 py-3.5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-foreground text-sm font-medium">
          {t('tourPage.gallery', 'Thư viện ảnh')}
        </h2>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs font-medium text-primary"
          onClick={() => onPickImage(0)}
        >
          {t('tourPage.viewAllPhotos', 'Xem tất cả')} ({images.length})
        </Button>
      </div>

      <div className="grid h-35 grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-1.5">
        {images.map((src, idx) => (
          <Button
            key={`${src}-${idx}`}
            variant="ghost"
            onClick={() => onPickImage(idx)}
            className={`h-full w-full overflow-hidden rounded-[8px] p-0 ${idx === 0 ? 'row-span-2' : ''}`}
          >
            <img
              src={withBaseUrl(src)}
              alt={`${title || 'tour'}-${idx + 1}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImg;
              }}
            />
          </Button>
        ))}
      </div>
    </section>
  );
}
