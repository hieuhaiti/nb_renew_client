import React from 'react';

export function TourismDetailQuickStats({ stats }) {
  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.key}
          className="border-border bg-card rounded-[9px] border-[0.5px] px-2.75 py-2.5"
        >
          <div className="text-muted-foreground mb-1 text-sm uppercase">{stat.label}</div>
          <div>{stat.value}</div>
        </article>
      ))}
    </section>
  );
}
