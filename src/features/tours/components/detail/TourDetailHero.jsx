import React from 'react';
import { Camera } from 'lucide-react';

export function TourDetailHero({ imageSrc, title, subtitle, tags, totalImages, t }) {
  return (
    <section className="bg-card relative overflow-hidden border-[0.5px] border-[#ced4ce]">
      <img
        src={imageSrc}
        alt={title || t('tourPage.unknown', 'Tour')}
        className="h-70 w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[rgba(0,0,0,0.55)] via-[rgba(0,0,0,0.2)] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[12px] border border-[rgba(106,236,142,0.3)] bg-[rgba(46,111,64,0.7)] px-2.5 py-0.5 text-[10px] font-medium text-[#cffcd8]"
              title={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-primary-foreground truncate text-[20px] font-medium" title={title}>
          {title}
        </h1>

        <p className="mt-1 truncate text-[11px] text-[rgba(255,255,255,0.75)]" title={subtitle}>
          {subtitle || t('tourPage.locationPending', 'Đang cập nhật vị trí')}
        </p>
      </div>

      <div className="text-primary-foreground absolute right-3 bottom-3 flex items-center gap-1 rounded-[12px] bg-[rgba(0,0,0,0.45)] px-2 py-1 text-[11px]">
        <Camera className="h-3 w-3" />
        {totalImages}
      </div>
    </section>
  );
}
