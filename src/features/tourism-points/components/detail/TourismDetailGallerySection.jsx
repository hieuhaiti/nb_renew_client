import React from 'react';
import { Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

/** Shared image button used in both mobile + desktop grids */
function GalleryBtn({ src, alt, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-[18px] focus:outline-none transition-transform duration-200 hover:scale-[1.01] ${className}`}
    >
      <img
        src={withBaseUrl(src)}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImg;
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/24 to-transparent" />
    </button>
  );
}

export function TourismDetailGallerySection({
  images,
  title,
  onPickImage,
  onViewAll,
  totalImages = images.length,
  t,
}) {
  const pics = images.slice(0, 5);
  const alt = (idx) => `${title || 'tourism'}-${idx + 1}`;

  return (
    <section className="rounded-[24px] border-border bg-card px-5 py-5 shadow-(--ambient-shadow)">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-xl font-bold text-foreground md:text-2xl">
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

      {/* Mobile (< sm): first image full-width + 2 side-by-side below */}
      <div className="sm:hidden">
        {pics[0] && (
          <GalleryBtn
            src={pics[0]}
            alt={alt(0)}
            onClick={() => onPickImage(0)}
            className="mb-2 block min-h-55 w-full"
          />
        )}
        {pics.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {pics.slice(1, 3).map((src, i) => (
              <GalleryBtn
                key={src}
                src={src}
                alt={alt(i + 1)}
                onClick={() => onPickImage(i + 1)}
                className="min-h-35"
              />
            ))}
          </div>
        )}
        {/* "+N more" badge if additional images exist */}
        {totalImages > 3 && (
          <button
            onClick={() => (typeof onViewAll === 'function' ? onViewAll() : onPickImage(0))}
            className="mt-2 w-full rounded-[14px] border border-[#dcecf7] bg-[#f6fbff] py-2.5 text-xs font-extrabold text-[#08aeb9]"
          >
            +{totalImages - 3} ảnh khác
          </button>
        )}
      </div>

      {/* Tablet / Desktop (≥ sm): asymmetric 3-col grid, first image spans 2 rows */}
      <div
        className="hidden gap-2.5 sm:grid"
        style={{ gridTemplateColumns: '1.2fr 0.8fr 0.8fr' }}
      >
        {pics.map((src, idx) => (
          <GalleryBtn
            key={src}
            src={src}
            alt={alt(idx)}
            onClick={() => onPickImage(idx)}
            className={idx === 0 ? 'row-span-2 min-h-87.5' : 'min-h-42.5'}
          />
        ))}
      </div>
    </section>
  );
}
