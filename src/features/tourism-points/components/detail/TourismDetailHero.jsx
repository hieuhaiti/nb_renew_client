import React from 'react';
import { Camera } from 'lucide-react';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export function TourismDetailHero({ imageSrc, title, subtitle, tags, totalImages, t }) {
  return (
    <section className="bg-card border-nature-border relative overflow-hidden border-[0.5px]">
      <img
        src={withBaseUrl(imageSrc)}
        alt={title || t('tourism.unknown', '??a ?i?m du l?ch')}
        className="h-70 w-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImg;
        }}
      />
      <div className="from-nature-dark/85 via-nature-dark/45 absolute inset-0 bg-linear-to-t to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border-nature-accent/30 bg-nature/70 text-nature-foreground rounded-[12px] border px-2.5 py-0.5 text-xs font-medium"
              title={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-nature-foreground truncate text-xl font-semibold" title={title}>
          {title}
        </h1>

        <p className="text-nature-foreground/75 mt-1 truncate text-xs" title={subtitle}>
          {subtitle || t('tourism.location_pending', 'Äang cập nhật vị trí')}
        </p>
      </div>

      <div className="bg-nature-dark/70 text-nature-foreground absolute right-3 bottom-3 flex items-center gap-1 rounded-[12px] px-2 py-1 text-xs">
        <Camera className="h-3 w-3" />
        {totalImages}
      </div>
    </section>
  );
}
