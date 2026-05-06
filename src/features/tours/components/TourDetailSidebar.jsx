import React from 'react';
import { Map, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TourDetailSidebar({ ticketDisplay, subtitle, onOpenMap, onContact, rows, t }) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
      <section className="bg-primary rounded-[10px] px-4 py-3.5">
        <div className="text-primary-foreground text-xl font-semibold">{ticketDisplay}</div>
        <p className="text-primary-foreground/70 mt-1 text-xs">{subtitle}</p>

        <div className="mt-3 space-y-2">
          <Button
            onClick={onOpenMap}
            variant="default"
            className="h-8.5 w-full rounded-[7px] text-xs font-medium"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourPage.openMap', 'Xem trên bản đồ')}
          </Button>
          <Button
            onClick={onContact}
            variant="outline"
            className="h-8.5 w-full rounded-[7px] text-xs"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourPage.contact', 'Liên hệ tour')}
          </Button>
        </div>
      </section>

      <section className="bg-card border-border rounded-[10px] border-[0.5px] px-4 py-3.5">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-start gap-2 pb-2 ${
              index < rows.length - 1 ? 'border-muted mb-2 border-b-[0.5px]' : ''
            }`}
          >
            <div className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px]">
              <span className={`h-1.75 w-1.75 rounded-full ${row.dotClass}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground text-xs uppercase">{row.label}</div>
              <div
                className="text-foreground mt-0.5 truncate text-xs font-medium"
                title={typeof row.value === 'string' ? row.value : undefined}
              >
                {row.value}
              </div>
            </div>
          </div>
        ))}
      </section>
    </aside>
  );
}
