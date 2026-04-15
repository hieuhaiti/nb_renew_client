import React from 'react';
import { Map, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TourismDetailSidebar({
  ticketDisplay,
  onOpenMap,
  onContact,
  rows,
  nearbyPoints,
  t,
}) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
      <section className="rounded-[10px] bg-[#2e6f40] px-4 py-3.5">
        <div className="text-[20px] font-medium text-[#cffcd8]">
          {ticketDisplay === t('tourism.free', 'Miễn phí')
            ? t('tourism.free', 'Miễn phí')
            : ticketDisplay}
        </div>
        <p className="mt-1 text-[11px] text-[rgba(207,252,216,0.7)]">
          {t('tourism.price_subtitle', 'Thông tin giá vé từ điểm tham quan')}
        </p>

        <div className="mt-3 space-y-2">
          <Button
            onClick={onOpenMap}
            className="h-8.5 w-full rounded-[7px] bg-[#cffcd8] text-[11px] font-medium text-[#1c4a29] hover:bg-[#bdf2ca]"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourism.view_on_map', 'Xem trên bản đồ')}
          </Button>
          <Button
            onClick={onContact}
            variant="ghost"
            className="h-8.5 w-full rounded-[7px] border-[0.5px] border-[rgba(255,255,255,0.25)] text-[11px] text-[rgba(207,252,216,0.8)] hover:bg-white/10"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourism.contact', 'Liên hệ điểm tham quan')}
          </Button>
        </div>
      </section>

      <section className="rounded-[10px] border-[0.5px] border-[#ced4ce] bg-white px-4 py-3.5">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-start gap-2 pb-2 ${
              index < rows.length - 1 ? 'mb-2 border-b-[0.5px] border-[#eff1ef]' : ''
            }`}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[#eff1ef]">
              <span className={`h-1.75 w-1.75 rounded-full ${row.dotClass}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] tracking-[0.04em] text-[#a8ada8] uppercase">
                {row.label}
              </div>
              <div
                className="text-foreground mt-0.5 truncate text-[12px] font-medium"
                title={row.value}
              >
                {row.value}
              </div>
            </div>
            <div className="shrink-0">{row.icon}</div>
          </div>
        ))}
      </section>

      <section className="rounded-[10px] border-[0.5px] border-[#ced4ce] bg-white px-4 py-3.5">
        <h3 className="text-foreground mb-2 text-[12px] font-medium">
          {t('tourism.mini_map', 'Bản đồ mini')}
        </h3>
        <div className="relative h-25 overflow-hidden rounded-[9px] bg-[#dde2e8]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[20px_20px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%]">
            <span className="block h-4 w-4 rotate-45 rounded-[55%_55%_55%_0] border-2 border-white bg-[#2e6f40] shadow-sm" />
          </div>
        </div>
        <Button
          onClick={onOpenMap}
          variant="ghost"
          className="mt-2 h-8 w-full rounded-[7px] border-[0.5px] border-[#ced4ce] bg-[#eff1ef] px-3 text-[11px] text-[#2e6f40] hover:bg-[#dfe6df]"
        >
          {t('tourism.open_full_map', 'Mở bản đồ đầy đủ')}
        </Button>
      </section>

      <section className="rounded-[10px] border-[0.5px] border-[#ced4ce] bg-white px-4 py-3.5">
        <h3 className="text-foreground mb-2 text-[12px] font-medium">
          {t('tourism.nearby_points', 'Điểm lân cận')}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {nearbyPoints.map((point) => (
            <article
              key={point.id}
              className="overflow-hidden rounded-[8px] border-[0.5px] border-[#ced4ce] bg-white"
            >
              <img src={point.image} alt={point.name} className="h-12.5 w-full object-cover" />
              <div className="px-2 py-1.5">
                <div
                  className="text-foreground truncate text-[10px] font-medium"
                  title={point.name}
                >
                  {point.name}
                </div>
                <div className="mt-0.5 truncate text-[9px] text-[#a8ada8]" title={point.distance}>
                  {point.distance}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
