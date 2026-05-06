import React from 'react';

export function TourismDetailIntroSection({ description, tags, t }) {
  return (
    <section className="border-primary/20 bg-card mb-3 rounded-[10px] border-[0.5px] px-4 py-3.5">
      <h2 className="text-foreground mb-2 text-sm font-medium">
        {t('tourism.introduction', 'Giới thiệu')}
      </h2>
      <p className="text-muted-foreground text-xs leading-relaxed">
        {description || t('tourism.no_description', 'Chưa có thông tin giới thiệu.')}
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
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-primary/20 bg-primary-soft text-primary-soft-foreground'
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
