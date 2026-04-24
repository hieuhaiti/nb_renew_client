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
      <section className="rounded-[10px] bg-nature px-4 py-3.5">
        <div className="text-xl font-semibold text-nature-foreground">
          {ticketDisplay === t('tourism.free', 'Miễn phí')
            ? t('tourism.free', 'Miễn phí')
            : ticketDisplay}
        </div>
        <p className="mt-1 text-xs text-nature-foreground/70">
          {t('tourism.price_subtitle', 'Thông tin giá vé từ điểm tham quan')}
        </p>

        <div className="mt-3 space-y-2">
          <Button
            onClick={onOpenMap}
            className="h-8.5 w-full rounded-[7px] bg-nature-foreground text-xs font-medium text-nature-dark hover:bg-nature-foreground-hover"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourism.view_on_map', 'Xem trên bản đồ')}
          </Button>
          <Button
            onClick={onContact}
            variant="ghost"
            className="h-8.5 w-full rounded-[7px] border-[0.5px] border-white/25 text-xs text-nature-foreground/80 hover:bg-white/10"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourism.contact', 'Liên hệ điểm tham quan')}
          </Button>
        </div>
      </section>

      <section className="rounded-[10px] border-[0.5px] border-nature-border bg-card px-4 py-3.5">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-start gap-2 pb-2 ${
              index < rows.length - 1 ? 'mb-2 border-b-[0.5px] border-nature-soft' : ''
            }`}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-nature-soft">
              <span className={`h-1.75 w-1.75 rounded-full ${row.dotClass}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-nature-label uppercase">
                {row.label}
              </div>
              <div
                className="text-foreground mt-0.5 truncate text-xs font-medium"
                title={row.value}
              >
                {row.value}
              </div>
            </div>
            <div className="shrink-0">{row.icon}</div>
          </div>
        ))}
      </section>

      <section className="rounded-[10px] border-[0.5px] border-nature-border bg-card px-4 py-3.5">
        <h3 className="text-foreground mb-2 text-xs font-medium">
          {t('tourism.mini_map', 'Bản đồ mini')}
        </h3>
        <div className="relative h-25 overflow-hidden rounded-[9px] bg-nature-map-bg">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[20px_20px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%]">
            <span className="block h-4 w-4 rotate-45 rounded-[55%_55%_55%_0] border-2 border-white bg-nature shadow-sm" />
          </div>
        </div>
        <Button
          onClick={onOpenMap}
          variant="ghost"
          className="mt-2 h-8 w-full rounded-[7px] border-[0.5px] border-nature-border bg-nature-soft px-3 text-xs text-nature hover:bg-nature-soft-hover"
        >
          {t('tourism.open_full_map', 'Mở bản đồ đầy đủ')}
        </Button>
      </section>

      <section className="rounded-[10px] border-[0.5px] border-nature-border bg-card px-4 py-3.5">
        <h3 className="text-foreground mb-2 text-xs font-medium">
          {t('tourism.nearby_points', 'Điểm lân cận')}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {nearbyPoints.map((point) => (
            <article
              key={point.id}
              className="overflow-hidden rounded-[8px] border-[0.5px] border-nature-border bg-white"
            >
              <img src={point.image} alt={point.name} className="h-12.5 w-full object-cover" />
              <div className="px-2 py-1.5">
                <div
                  className="text-foreground truncate text-xs font-medium"
                  title={point.name}
                >
                  {point.name}
                </div>
                <div className="mt-0.5 truncate text-xs text-nature-label" title={point.distance}>
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
