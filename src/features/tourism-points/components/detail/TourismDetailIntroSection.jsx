import React from 'react';

export function TourismDetailIntroSection({ description, tags, t }) {
  return (
    <section className="bg-card border-border mb-3 rounded-[10px] border-[0.5px] px-4 py-3.5">
      <h2 className="text-foreground mb-2 text-sm font-medium">
        {t('tourism.introduction', 'Giới thiệu')}
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description || t('tourism.no_description', 'Chưa có thông tin giới thiệu.')}
      </p>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => {
            const isActive = index < 2;
            return (
              <span
                key={`${tag}-${index}`}
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/25'
                    : 'bg-muted text-muted-foreground border border-border'
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
