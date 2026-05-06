import React from 'react';

export function TourDetailIntroSection({ description, includes, excludes, t }) {
  return (
    <section className="bg-card mb-3 rounded-[10px] border-[0.5px] border-border px-4 py-3.5">
      <h2 className="text-foreground mb-2 text-sm font-medium">
        {t('tourPage.detailDescriptionTitle', 'Giới thiệu')}
      </h2>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description || t('tourPage.noDescription', 'Chưa có mô tả.')}
      </p>

      {(includes?.length > 0 || excludes?.length > 0) && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {includes?.length > 0 && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold text-primary">
                {t('tourPage.includes', 'Bao gồm')}
              </h3>
              <ul className="space-y-1">
                {includes.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {excludes?.length > 0 && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold text-red-400">
                {t('tourPage.excludes', 'Không bao gồm')}
              </h3>
              <ul className="space-y-1">
                {excludes.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
