import React from 'react';
import { Button } from '@/components/ui/button';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export function TourismDetailGallerySection({
  images,
  title,
  onPickImage,
  onViewAll,
  totalImages = images.length,
  t,
}) {
  return (
    <section className="bg-card mb-4 rounded-[18px] border border-[#cfe0f4] px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-foreground text-base font-bold">
          {t('tourism.gallery', 'Thư viện ảnh')}
        </h2>
        <Button
          variant="link"
          size="sm"
          className="text-primary h-auto p-0 text-sm font-semibold"
          onClick={() => (typeof onViewAll === 'function' ? onViewAll() : onPickImage(0))}
        >
          {t('tourism.view_all_photos', 'Xem tất cả')} ({totalImages})
        </Button>
      </div>

      <div className="grid h-40 grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-1.5">
        {images.map((src, idx) => (
          <Button
            key={`${src}-${idx}`}
            variant="ghost"
            onClick={() => onPickImage(idx)}
            className={`h-full w-full overflow-hidden rounded-[8px] p-0 ${idx === 0 ? 'row-span-2' : ''}`}
          >
            <img
              src={withBaseUrl(src)}
              alt={`${title || 'tourism'}-${idx + 1}`}
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
