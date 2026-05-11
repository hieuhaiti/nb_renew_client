import React from 'react';
import { Map, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const accentBorders = [
  'border-l-primary',
  'border-l-secondary',
  'border-l-tertiary',
  'border-l-quaternary',
  'border-l-quinary',
];

export function TourDetailSidebar({ ticketDisplay, subtitle, onOpenMap, onContact, rows, t }) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
      {/* Ticket price */}
      <section className="from-primary to-secondary text-primary-foreground rounded-[10px] bg-gradient-to-r px-5 py-4">
        <div className="text-primary-foreground text-xl font-semibold">{ticketDisplay}</div>
        <p className="text-primary-foreground/70 mt-1 text-sm">{subtitle}</p>

        <div className="mt-4 space-y-2">
          <Button
            onClick={onOpenMap}
            variant="tertiary"
            className="h-8.5 w-full rounded-[7px] text-sm font-medium"
          >
            <Map className="h-3.5 w-3.5" />
            {t('tourPage.tourList', 'Open map')}
          </Button>
          <Button
            onClick={onContact}
            variant="quaternary"
            className="h-8.5 w-full rounded-[7px] text-sm font-medium"
          >
            <Phone className="h-3.5 w-3.5" />
            {t('tourPage.contact', 'Contact tour')}
          </Button>
        </div>
      </section>

      {/* Info rows */}
      <section className="bg-card border-border rounded-[10px] border px-4 py-3.5">
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className={`bg-card border-border flex items-start gap-2.5 rounded-[8px] border border-l-[3px] px-3 py-2.5 ${accentBorders[index % accentBorders.length]}`}
            >
              <div className="bg-muted/60 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px]">
                <span className={`h-2 w-2 rounded-full ${row.dotClass}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {row.label}
                </div>
                <div
                  className="text-foreground mt-0.5 truncate text-sm font-medium"
                  title={typeof row.value === 'string' ? row.value : undefined}
                >
                  {row.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

