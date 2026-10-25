import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quorion Table',
  description: 'A dark storyteller console for script setup, role mapping, and live table play.',
};

const phases = [
  {
    title: 'Prep',
    body: 'Choose a script, open a player group, map roles, and keep the table ready before the session starts.',
  },
  {
    title: 'Play',
    body: 'Run night and day flow with one host view, one role manual, and one source of truth for the table.',
  },
  {
    title: 'Atlas',
    body: 'Browse role groups, ability text, reminders, and night order in a paper-manual style layout.',
  },
  {
    title: 'Practice',
    body: 'Use the AI casting and scenario tools for solo prep or rehearsal without replacing the storyteller.',
  },
];

const roleGroups = [
  { name: 'Townsfolk', count: 13, tone: 'Good info and setup' },
  { name: 'Outsiders', count: 4, tone: 'Complications and edges' },
  { name: 'Minions', count: 4, tone: 'Disruption and deception' },
  { name: 'Demons', count: 1, tone: 'The hidden threat' },
];

export default function ClocktowerTablePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-tertiary">
            Quorion Table
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            A dark storyteller console for the table.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-secondary">
            Quorion Table is the host-facing companion for script setup, player mapping, role
            reference, and phase flow. The browser version mirrors the same data model as iOS so
            the prep and play surfaces stay in sync.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#flow"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-80"
            >
              View product flow
            </Link>
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
            >
              Back to apps
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {roleGroups.map((group) => (
              <div key={group.name} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-primary">{group.name}</h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {group.count}
                  </span>
                </div>
                <p className="mt-2 text-sm text-secondary">{group.tone}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-tertiary">Table Surface</p>
                <p className="text-sm font-medium text-primary">Night sheet + role atlas</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Dark only
              </span>
            </div>
          </div>

          <div className="relative bg-[#111111] px-4 py-5">
            <div className="absolute inset-x-6 top-6 h-20 rounded-full bg-[#2a1f16] opacity-70 blur-2xl" />
            <div className="relative mx-auto aspect-[4/5] max-w-[340px] rounded-[2rem] border border-[#4b3828] bg-[#1a1410] p-4 shadow-[0_28px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#b38a60]">
                    Storyteller
                  </p>
                  <p className="text-sm font-semibold text-[#f2e7d8]">Trouble Brewing</p>
                </div>
                <span className="rounded-full border border-[#8d6a45] px-2.5 py-1 text-[11px] text-[#e8cfae]">
                  7 players
                </span>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-[#5c442f] bg-[#241b15] p-3">
                <div className="grid grid-cols-3 gap-2">
                  {['Mira', 'Dev', 'Anya', 'Kabir', 'Leah', 'Nia'].map((name, index) => (
                    <div
                      key={name}
                      className={[
                        'rounded-2xl border px-2 py-2 text-center text-xs',
                        index % 2 === 0
                          ? 'border-[#4d6b58] bg-[#102017] text-[#d8eadf]'
                          : 'border-[#6b4d3d] bg-[#211711] text-[#f2dfcf]',
                      ].join(' ')}
                    >
                      <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-black/30" />
                      <p className="truncate font-medium">{name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <MiniCard title="Prep" body="Group, script, mapping" />
                <MiniCard title="Play" body="Night, day, votes" />
                <MiniCard title="Atlas" body="Role text + reminders" />
                <MiniCard title="Practice" body="Scenario packs" />
              </div>

              <div className="mt-4 rounded-2xl border border-[#5c442f] bg-[#120d0a] px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#a57c52]">
                  Command Dock
                </p>
                <p className="mt-1 text-sm text-[#f5ebdd]">
                  Setup • Night Sheet • Script Atlas • Analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="mt-14 grid gap-4 md:grid-cols-2">
        {phases.map((phase) => (
          <div key={phase.title} className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-primary">{phase.title}</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">{phase.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-primary">How web and iOS stay unified</h2>
          <p className="mt-3 text-sm leading-6 text-secondary">
            The web companion uses the same script names, role catalog, player-group ideas, and
            prep flow as the iOS app. Live play stays host-led and local-first; the web surface is
            the browser-friendly control panel for setup, reference, and solo practice.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-primary">What it is not</h2>
          <p className="mt-3 text-sm leading-6 text-secondary">
            It is not a generic pastel game page, and it is not an automated bot replacement for a
            storyteller. The AI tools stay in prep and rehearsal.
          </p>
        </div>
      </section>
    </div>
  );
}

function MiniCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[#4b3828] bg-[#211711] p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b38a60]">{title}</p>
      <p className="mt-1 text-sm text-[#f0e4d3]">{body}</p>
    </div>
  );
}
