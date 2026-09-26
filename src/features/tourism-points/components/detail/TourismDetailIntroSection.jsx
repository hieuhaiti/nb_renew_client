import React from 'react';
import { Info, MapPin, Clock, Tag, Globe } from 'lucide-react';

export function TourismDetailIntroSection({
  description,
  address,
  categoryName,
  provinceName,
  website,
  openingHours,
  t,
}) {
  const infoBoxes = [
    {
      icon: <MapPin className="mb-2 h-5 w-5 text-primary" />,
      label: t('tourism.location'),
      value: address || t('tourism.unknown'),
    },
    {
      icon: <Globe className="mb-2 h-5 w-5 text-primary" />,
      label: t('tourism.province'),
      value: provinceName || t('tourism.unknown'),
    },
    {
      icon: <Clock className="mb-2 h-5 w-5 text-primary" />,
      label: t('tourism.opening_hours'),
      value: openingHours || t('tourism.unknown'),
    },
    {
      icon: <Tag className="mb-2 h-5 w-5 text-primary" />,
      label: t('tourism.type'),
      value: categoryName || t('tourism.unknown'),
    },
  ];

  return (
    <section className="rounded-[24px] border border-border bg-card px-5 py-5 shadow-[0_10px_28px_rgba(7,29,54,0.08)]">
      <h2 className="mb-4 flex items-center gap-2.5 text-xl font-bold text-foreground md:text-2xl">
        <Info className="h-6 w-6 text-primary" />
        {t('tourism.introduction')}
      </h2>

      {description ? (
        <p className="mb-3 text-[15px] leading-[1.8] text-muted-foreground">{description}</p>
      ) : (
        <p className="mb-3 text-sm text-muted-foreground italic">
          {t('tourism.no_description')}
        </p>
      )}

      {website && (
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-2 text-xs font-bold text-primary hover:underline"
        >
          <Globe className="h-4 w-4" />
          {website}
        </a>
      )}

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {infoBoxes.map((box) => (
          <div
            key={box.label}
            className="rounded-[18px] border border-border bg-muted/20 p-[14px]"
          >
            {box.icon}
            <b className="mb-1 block text-[14px] text-foreground">{box.label}</b>
            <span className="text-[12px] font-bold text-muted-foreground">{box.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
