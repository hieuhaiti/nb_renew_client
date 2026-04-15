import React from 'react';

export function TourismDetailIntroSection({ description, tags, t }) {
  return (
    <section className="mb-3 rounded-[10px] border-[0.5px] border-[#ced4ce] bg-white px-4 py-3.5">
      <h2 className="text-foreground mb-2 text-[14px] font-medium">
        {t('tourism.introduction', 'Giới thiệu')}
      </h2>
      <p className="text-[12px] leading-[1.6] text-[#51625a]">
        {description || t('tourism.no_description', 'Chưa có thông tin giới thiệu.')}
      </p>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag, index) => {
            const isActive = index < 2;
            return (
              <span
                key={`${tag}-${index}`}
                className={`rounded-[12px] border-[0.5px] px-2.25 py-0.75 text-[11px] ${
                  isActive
                    ? 'border-[#6aec8e] bg-[#cffcd8] text-[#1c4a29]'
                    : 'border-[#ced4ce] bg-[#eff1ef] text-[#606360]'
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
