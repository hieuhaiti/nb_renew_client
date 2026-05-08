import React from 'react';
import { Map, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { withBaseUrl } from '@/lib/utils';
import placeholderImg from '@/assets/images/placeholder.png';

export function TourismDetailSidebar({
  ticketDisplay,
  childTicketDisplay,
  onOpenMap,
  onContact,
  rows,
  nearbyPoints,
  t,
}) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
      {/* Ticket price — primary blue background */}
      <section className="bg-primary rounded-[10px] px-4 py-3.5">
        <div className="text-primary-foreground text-xl font-semibold">{ticketDisplay}</div>
        {childTicketDisplay && (
          <div className="text-primary-foreground/70 mt-0.5 text-sm">
            {t('tourism.ticket_child', 'Trẻ em')}: {childTicketDisplay}
          </div>
        )}
        <p className="text-primary-foreground/70 mt-1 text-sm">
          {t('tourism.price_subtitle', 'Thông tin giá vé từ điểm tham quan')}
        </p>

        <div className="mt-3 space-y-2">
          <Button
            onClick={onOpenMap}
            className="text-primary hover:text-primary bg-card hover:bg-muted h-8.5 w-full rounded-[7px] text-sm font-medium"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourism.view_on_map', 'Xem trên bản đồ')}
          </Button>
          <Button
            onClick={onContact}
            variant="ghost"
            className="border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-8.5 w-full rounded-[7px] border text-sm"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourism.contact', 'Liên hệ điểm tham quan')}
          </Button>
        </div>
      </section>

      {/* Info rows */}
      <section className="border-primary/20 bg-card rounded-[10px] border px-4 py-3.5">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-start gap-2 pb-2 ${
              index < rows.length - 1 ? 'border-border mb-2 border-b' : ''
            }`}
          >
            <div className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px]">
              <span className={`h-1.75 w-1.75 rounded-full ${row.dotClass}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground text-sm uppercase">{row.label}</div>
              <div className="mt-0.5 truncate text-sm font-medium" title={row.value}>
                {row.href ? (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {row.value}
                  </a>
                ) : (
                  <span className="text-foreground">{row.value}</span>
                )}
              </div>
            </div>
            <div className="shrink-0">{row.icon}</div>
          </div>
        ))}
      </section>

      {/* Mini map */}
      <section className="border-border bg-card rounded-[10px] border px-4 py-3.5">
        <h3 className="text-foreground mb-2 text-sm font-medium">
          {t('tourism.mini_map', 'Bản đồ mini')}
        </h3>
        <div className="bg-primary-soft relative h-25 overflow-hidden rounded-[9px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%]">
            <span className="border-primary-foreground bg-primary block h-4 w-4 rotate-45 rounded-[55%_55%_55%_0] border-2 shadow-sm" />
          </div>
        </div>
        <Button
          onClick={onOpenMap}
          variant="outline"
          className="mt-2 h-8 w-full rounded-[7px] px-3 text-sm"
        >
          {t('tourism.open_full_map', 'Mở bản đồ đầy đủ')}
        </Button>
      </section>

      {/* Nearby points */}
      <section className="border-border bg-card rounded-[10px] border px-4 py-3.5">
        <h3 className="text-foreground mb-2 text-sm font-medium">
          {t('tourism.nearby_points', '?i?m l?n c?n')}
        </h3>

        {nearbyPoints.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {nearbyPoints.map((point) => (
              <article
                key={point.id}
                className="border-border bg-card overflow-hidden rounded-[8px] border"
              >
                <img
                  src={withBaseUrl(point.image)}
                  alt={point.name}
                  className="h-12.5 w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImg;
                  }}
                />
                <div className="px-2 py-1.5">
                  <div className="text-foreground truncate text-sm font-medium" title={point.name}>
                    {point.name}
                  </div>
                  <div
                    className="text-muted-foreground mt-0.5 truncate text-sm"
                    title={point.distance}
                  >
                    {point.distance}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            {t('tourism.no_nearby_points', 'Chưa có dữ liệu điểm lân cận.')}
          </p>
        )}
      </section>
    </aside>
  );
}
