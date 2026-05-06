import React from 'react';
import { Camera } from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export function TourDetailHero({ imageSrc, title, subtitle, tags, totalImages, t }) {
  return (
    <section className="border-primary/20 bg-card relative overflow-hidden border-[0.5px]">
      <img
        src={withBaseUrl(imageSrc)}
        alt={title || t('tourPage.unknown', 'Tour')}
        className="h-70 w-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImg;
        }}
      />
      <div className="from-primary/85 via-primary/45 absolute inset-0 bg-linear-to-t to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border-primary-foreground/30 bg-primary/70 typo-badge text-primary-foreground rounded-[12px] border px-2.5 py-0.5"
              title={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-primary-foreground truncate text-xl font-semibold" title={title}>
          {title}
        </h1>

        <p className="text-primary-foreground/75 mt-1 truncate text-xs" title={subtitle}>
          {subtitle || t('tourPage.locationPending', 'Đang cập nhật vị trí')}
        </p>
      </div>

      <div className="bg-primary/70 text-primary-foreground absolute right-3 bottom-3 flex items-center gap-1 rounded-[12px] px-2 py-1 text-xs">
        <Camera className="h-3 w-3" />
        {totalImages}
      </div>
    </section>
  );
}
