'use client';

import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';

export type LensSection = { id: string; lenses: string[]; node: ReactNode };
export type LensTile = { id: string; label: string; src: string };

const lenses = ['all', 'ios', 'android', 'product', 'writer'];

export default function LensSections({ sections, tiles }: { sections: LensSection[]; tiles: LensTile[] }) {
  const [lens, setLens] = useState('all');
  const [target, setTarget] = useState<string | null>(null);

  // A tile always lands on its section: show every section first, then scroll once it has rendered.
  useEffect(() => {
    if (!target) return;
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTarget(null);
  }, [target, lens]);

  const jump = (id: string) => {
    setLens('all');
    setTarget(id);
  };

  return (
    <>
      <ul aria-label="Jump to a project" className="-mx-4 mb-10 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {tiles.map((tile) => (
          <li key={tile.id} className="shrink-0 snap-start">
            <button type="button" onClick={() => jump(tile.id)} className="group flex w-[88px] flex-col items-center gap-2 text-center">
              <span className="block h-[132px] w-[88px] overflow-hidden rounded-2xl ring-2 ring-[var(--border)] ring-offset-2 ring-offset-[var(--bg)] transition group-hover:ring-[#0B62A4]">
                <Image src={tile.src} alt="" width={176} height={264} className="h-full w-full object-cover object-top" />
              </span>
              <span className="text-xs text-secondary group-hover:text-primary">{tile.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-5">
        <h2 className="text-base font-semibold text-primary">Selected work</h2>
        <div role="group" aria-label="Show work for" className="flex flex-wrap gap-1 rounded-xl bg-[var(--bg-tertiary)] p-1">
          {lenses.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={lens === id}
              onClick={() => setLens(id)}
              className={`min-h-10 rounded-lg px-3.5 font-mono text-[13px] transition-colors ${
                lens === id ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-secondary hover:text-primary'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      {sections
        .filter((section) => lens === 'all' || section.lenses.includes(lens))
        .map((section) => (
          <div key={section.id}>{section.node}</div>
        ))}
    </>
  );
}
