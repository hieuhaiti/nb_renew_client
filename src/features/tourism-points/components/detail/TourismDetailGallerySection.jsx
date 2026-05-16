import React from 'react';
import { Images } from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';
import { Button } from '@/components/ui/button';

export function TourismDetailGallerySection({
  images,
  title,
  onPickImage,
  onViewAll,
  totalImages = images.length,
  t,
}) {
  const pics = images.slice(0, 5);

  return (
    <section className="rounded-[24px] border-border bg-card px-5 py-5 shadow-(--ambient-shadow)">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#071d36] md:text-2xl">
          <Images className="h-6 w-6 text-secondary" />
          {t('tourism.gallery', 'Thư viện hình ảnh')}
        </h2>
        <Button
          variant="ghost"
          onClick={() => (typeof onViewAll === 'function' ? onViewAll() : onPickImage(0))}
          className="text-sm font-semibold text-[#08aeb9] hover:underline"
        >
          {t('tourism.view_all_photos', 'Xem tất cả')} ({totalImages})
        </Button>
      </div>

      <div className="grid gap-2.5" style={{ gridTemplateColumns: '1.2fr 0.8fr 0.8fr' }}>
        {pics.map((src, idx) => (
          <Button
            variant="ghost"
            key={`${src}-${idx}`}
            onClick={() => onPickImage(idx)}
            className={`relative overflow-hidden rounded-[18px] transition-transform duration-200 hover:scale-[1.01] focus:outline-none ${
              idx === 0 ? 'row-span-2 min-h-[350px]' : 'min-h-[170px]'
            }`}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/24 to-transparent" />
          </Button>
        ))}
      </div>
    </section>
  );
}
