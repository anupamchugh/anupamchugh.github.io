'use client';

import Image from 'next/image';
import { useState } from 'react';
import { workItems, workKinds, type WorkKind } from '@/lib/work-items';

const tone: Record<WorkKind, string> = { live: 'text-[#1C7A3F]', oss: 'text-tertiary', lab: 'text-[#0B62A4]', client: 'text-tertiary' };

export default function WorkGrid() {
  const [kind, setKind] = useState<WorkKind | 'all'>('all');
  const items = workItems.filter((item) => kind === 'all' || item.kind === kind);

  return (
    <>
      <div role="group" aria-label="Filter work" className="mt-7 flex w-fit max-w-full flex-wrap gap-1 rounded-xl bg-[var(--bg-tertiary)] p-1">
        {workKinds.map(({ id, label }) => {
          const count = id === 'all' ? workItems.length : workItems.filter((item) => item.kind === id).length;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={kind === id}
              onClick={() => setKind(id)}
              className={`min-h-10 rounded-lg px-3.5 font-mono text-[13px] transition-colors ${
                kind === id ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-secondary hover:text-primary'
              }`}
            >
              {label} · {count}
            </button>
          );
        })}
      </div>

      <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <li key={item.name} className="flex flex-col overflow-hidden rounded-[20px] border border-border bg-[var(--card-bg)]">
            {item.image ? (
              <Image src={item.image} alt={item.alt ?? ''} width={460} height={1000} className="h-[220px] w-full bg-[var(--bg-tertiary)] object-cover object-top" />
            ) : (
              <div className="flex h-[220px] items-center justify-center bg-[var(--bg-tertiary)] font-mono text-xs text-tertiary">
                {item.href ? 'code only' : 'no screens survive'}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-[17px] font-semibold text-primary">{item.name}</h2>
                <span className={`font-mono text-[11px] uppercase ${tone[item.kind]}`}>{item.status}</span>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-secondary">{item.line}</p>
              {item.href && (
                <a href={item.href} className="inline-flex min-h-8 items-center text-[13px] font-semibold">
                  {item.cta} →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
