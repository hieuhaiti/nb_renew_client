import React from 'react';

export function TourismDetailIntroSection({ description, tags, t }) {
  return (
    <section className="bg-card mb-4 rounded-[18px] border border-[#cfe0f4] px-5 py-4">
      <h2 className="text-foreground mb-3 text-base font-bold">
        {t('tourism.introduction', 'Giới thiệu')}
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description || t('tourism.no_description', 'Chưa có thông tin giới thiệu.')}
      </p>

      {tags.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-2">
          {tags.map((tag, index) => {
            const isActive = index < 2;
            return (
              <span
                key={`${tag}-${index}`}
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'border border-[#cfe0f4] bg-[#eef7ff] text-[#0477bf]'
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
