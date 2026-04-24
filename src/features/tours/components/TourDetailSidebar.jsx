import React from 'react';
import { Map, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TourDetailSidebar({
  ticketDisplay,
  subtitle,
  onOpenMap,
  onContact,
  rows,
  nearbyTours,
  t,
}) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
      <section className="rounded-[10px] bg-nature px-4 py-3.5">
        <div className="text-xl font-semibold text-nature-foreground">{ticketDisplay}</div>
        <p className="mt-1 text-xs text-nature-foreground/70">{subtitle}</p>

        <div className="mt-3 space-y-2">
          <Button
            onClick={onOpenMap}
            className="h-8.5 w-full rounded-[7px] bg-nature-foreground text-xs font-medium text-nature-dark hover:bg-nature-foreground-hover"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourPage.openMap', 'Xem trên bản đồ')}
          </Button>
          <Button
            onClick={onContact}
            variant="ghost"
            className="h-8.5 w-full rounded-[7px] border-[0.5px] border-white/25 text-xs text-nature-foreground/80 hover:bg-white/10"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourPage.contact', 'Liên hệ tour')}
          </Button>
        </div>
      </section>

      <section className="bg-card rounded-[10px] border-[0.5px] border-nature-border px-4 py-3.5">
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
          </div>
        ))}
      </section>

      <section className="bg-card rounded-[10px] border-[0.5px] border-nature-border px-4 py-3.5">
        <h3 className="text-foreground mb-2 text-xs font-medium">
          {t('tourPage.nearbyTours', 'Tour gợi ý gần đây')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {nearbyTours.map((item) => (
            <article
              key={item.id}
              className="bg-card overflow-hidden rounded-[8px] border-[0.5px] border-nature-border"
            >
              <img src={item.image} alt={item.name} className="h-12.5 w-full object-cover" />
              <div className="px-2 py-1.5">
                <div className="text-foreground truncate text-xs font-medium" title={item.name}>
                  {item.name}
                </div>
                <div className="mt-0.5 truncate text-xs text-nature-label" title={item.meta}>
                  {item.meta}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
