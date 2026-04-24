import React from 'react';

export function TourDetailIntroSection({ description, tags, t }) {
  return (
    <section className="bg-card mb-3 rounded-[10px] border-[0.5px] border-nature-border px-4 py-3.5">
      <h2 className="text-foreground mb-2 text-sm font-medium">
        {t('tourPage.detailDescriptionTitle', 'Giới thiệu')}
      </h2>
      <p className="text-xs leading-relaxed text-nature-muted-foreground">
        {description || t('tourPage.noDescription', 'Chưa có mô tả.')}
      </p>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag, index) => {
            const isActive = index < 2;
            return (
              <span
                key={`${tag}-${index}`}
                className={`rounded-[12px] border-[0.5px] px-2.25 py-0.75 text-xs ${
                  isActive
                    ? 'border-nature-accent bg-nature-foreground text-nature-dark'
                    : 'border-nature-border bg-nature-soft text-nature-muted-foreground'
                }`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}
