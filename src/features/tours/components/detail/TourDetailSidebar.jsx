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
      <section className="rounded-[10px] bg-[#2e6f40] px-4 py-3.5">
        <div className="text-[20px] font-medium text-[#cffcd8]">{ticketDisplay}</div>
        <p className="mt-1 text-[11px] text-[rgba(207,252,216,0.7)]">{subtitle}</p>

        <div className="mt-3 space-y-2">
          <Button
            onClick={onOpenMap}
            className="h-8.5 w-full rounded-[7px] bg-[#cffcd8] text-[11px] font-medium text-[#1c4a29] hover:bg-[#bdf2ca]"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourPage.openMap', 'Xem trên bản đồ')}
          </Button>
          <Button
            onClick={onContact}
            variant="ghost"
            className="h-8.5 w-full rounded-[7px] border-[0.5px] border-[rgba(255,255,255,0.25)] text-[11px] text-[rgba(207,252,216,0.8)] hover:bg-white/10"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourPage.contact', 'Liên hệ tour')}
          </Button>
        </div>
      </section>

      <section className="bg-card rounded-[10px] border-[0.5px] border-[#ced4ce] px-4 py-3.5">
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
          </div>
        ))}
      </section>

      <section className="bg-card rounded-[10px] border-[0.5px] border-[#ced4ce] px-4 py-3.5">
        <h3 className="text-foreground mb-2 text-[12px] font-medium">
          {t('tourPage.nearbyTours', 'Tour gợi ý gần đây')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {nearbyTours.map((item) => (
            <article
              key={item.id}
              className="bg-card overflow-hidden rounded-[8px] border-[0.5px] border-[#ced4ce]"
            >
              <img src={item.image} alt={item.name} className="h-12.5 w-full object-cover" />
              <div className="px-2 py-1.5">
                <div className="text-foreground truncate text-[10px] font-medium" title={item.name}>
                  {item.name}
                </div>
                <div className="mt-0.5 truncate text-[9px] text-[#a8ada8]" title={item.meta}>
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
