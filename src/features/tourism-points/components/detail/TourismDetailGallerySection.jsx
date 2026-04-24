import React from 'react';
import { Button } from '@/components/ui/button';

export function TourismDetailGallerySection({ images, title, onPickImage, t }) {
  return (
    <section className="mb-3 rounded-[10px] border-[0.5px] border-nature-border bg-card px-4 py-3.5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-foreground text-sm font-medium">
          {t('tourism.gallery', 'Thư viện ảnh')}
        </h2>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs font-medium text-nature"
          onClick={() => onPickImage(0)}
        >
          {t('tourism.view_all_photos', 'Xem tất cả')} ({images.length})
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
              src={src}
              alt={`${title || 'tourism'}-${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </Button>
        ))}
      </div>
    </section>
  );
}
