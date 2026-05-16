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
      icon: <MapPin className="mb-2 h-5 w-5 text-[#08aeb9]" />,
      label: t('tourism.location', 'Vị trí'),
      value: address || t('tourism.unknown', 'Chưa cập nhật'),
    },
    {
      icon: <Globe className="mb-2 h-5 w-5 text-[#08aeb9]" />,
      label: t('tourism.province', 'Tỉnh/Thành'),
      value: provinceName || t('tourism.unknown', 'Chưa cập nhật'),
    },
    {
      icon: <Clock className="mb-2 h-5 w-5 text-[#08aeb9]" />,
      label: t('tourism.opening_hours', 'Giờ mở cửa'),
      value: openingHours || t('tourism.unknown', 'Chưa cập nhật'),
    },
    {
      icon: <Tag className="mb-2 h-5 w-5 text-[#08aeb9]" />,
      label: t('tourism.type', 'Loại hình'),
      value: categoryName || t('tourism.unknown', 'Chưa cập nhật'),
    },
  ];

  return (
    <section className="rounded-[24px] border border-[#dcecf7] bg-white px-5 py-5 shadow-[0_10px_28px_rgba(7,29,54,0.08)]">
      <h2 className="mb-4 flex items-center gap-2.5 text-xl font-bold text-[#071d36] md:text-2xl">
        <Info className="h-6 w-6 text-[#08aeb9]" />
        {t('tourism.introduction', 'Giới thiệu điểm du lịch')}
      </h2>

      {description ? (
        <p className="mb-3 text-[15px] leading-[1.8] text-[#435a6e]">{description}</p>
      ) : (
        <p className="mb-3 text-sm text-[#64748b] italic">
          {t('tourism.no_description', 'Chưa có thông tin giới thiệu.')}
        </p>
      )}

      {website && (
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#dcecf7] bg-[#f6fbff] px-3 py-2 text-xs font-bold text-[#0b5f80] hover:underline"
        >
          <Globe className="h-4 w-4" />
          {website}
        </a>
      )}

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {infoBoxes.map((box) => (
          <div
            key={box.label}
            className="rounded-[18px] border border-[#e3eef7] bg-[#f6fbff] p-[14px]"
          >
            {box.icon}
            <b className="mb-1 block text-[14px] text-[#071d36]">{box.label}</b>
            <span className="text-[12px] font-bold text-[#64748b]">{box.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
