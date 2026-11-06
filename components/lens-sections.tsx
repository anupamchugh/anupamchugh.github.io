'use client';

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
      <div id="selected-work" className="scroll-mt-24 flex flex-wrap items-end justify-between gap-5 border-t border-border pb-8 pt-8">
        <div><p className="font-mono text-xs uppercase tracking-widest text-secondary">A selection of things I&apos;ve made</p><h2 className="mt-3 text-4xl font-bold tracking-tight text-primary sm:text-5xl">Selected work.</h2></div>
        <div role="group" aria-label="Show work for" className="flex flex-wrap gap-1 rounded-xl bg-[var(--bg-tertiary)] p-1">
          {lenses.map((id) => <button key={id} type="button" aria-pressed={lens === id} onClick={() => setLens(id)} className={`min-h-10 rounded-lg px-3.5 font-mono text-[13px] transition-colors ${lens === id ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-secondary hover:text-primary'}`}>{id}</button>)}
        </div>
      </div>
      <ul aria-label="Jump to a project" className="mb-12 flex flex-wrap gap-x-5 gap-y-2 text-sm text-secondary">
        {tiles.map((tile) => <li key={tile.id}><button type="button" onClick={() => jump(tile.id)} className="min-h-10 hover:text-primary hover:underline">{tile.label} ↓</button></li>)}
      </ul>
      {sections
        .filter((section) => lens === 'all' || section.lenses.includes(lens))
        .map((section) => (
          <div key={section.id}>{section.node}</div>
        ))}
    </>
  );
}
