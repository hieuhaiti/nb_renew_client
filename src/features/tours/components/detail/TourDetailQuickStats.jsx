import React from 'react';

export function TourDetailQuickStats({ stats }) {
  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.key}
          className="bg-card rounded-[9px] border-[0.5px] border-[#ced4ce] px-2.75 py-2.5"
        >
          <div className="mb-1 text-[9px] tracking-[0.04em] text-[#a8ada8] uppercase">
            {stat.label}
          </div>
          <div>{stat.value}</div>
        </article>
      ))}
    </section>
  );
}
