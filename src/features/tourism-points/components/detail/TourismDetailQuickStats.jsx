import React from 'react';

const accentBorders = [
  'border-l-primary',
  'border-l-secondary',
  'border-l-tertiary',
  'border-l-quaternary',
  'border-l-quinary',
];

export function TourismDetailQuickStats({ stats }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <article
          key={stat.key}
          className={`bg-card border-border rounded-[10px] border border-l-[3px] px-3.5 py-3 ${accentBorders[index % accentBorders.length]}`}
        >
          <div className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
            {stat.label}
          </div>
          <div className="text-foreground text-sm font-semibold">{stat.value}</div>
        </article>
      ))}
    </section>
  );
}
