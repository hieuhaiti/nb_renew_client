import React from 'react';
import { Image } from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export function TourismDetailHero({ imageSrc, title, subtitle, tags, totalImages, t }) {
  return (
    <section className="relative mb-4 overflow-hidden rounded-[18px] shadow-[0_8px_24px_rgba(13,74,130,0.12)]">
      <img
        src={withBaseUrl(imageSrc)}
        alt={title || t('tourism.unknown', 'Địa điểm du lịch')}
        className="h-72 w-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImg;
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(3,95,172,0.88) 0%, rgba(14,165,233,0.45) 55%, transparent 100%)' }}
      />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="mb-2.5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm"
              title={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-2xl font-black leading-tight tracking-tight text-white drop-shadow" title={title}>
          {title}
        </h1>

        <p className="mt-1 text-sm font-medium text-white/80" title={subtitle}>
          {subtitle || t('tourism.location_pending', 'Đang cập nhật vị trí')}
        </p>
      </div>

      <div className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-[10px] bg-black/40 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
        <Image className="h-3.5 w-3.5" />
        {totalImages}
      </div>
    </section>
  );
}
