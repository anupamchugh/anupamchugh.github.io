'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { apps, recentlyReviewedProjects, selectedWork } from '@/lib/content';

type Tab = 'projects' | 'apps' | 'archive';

export default function HomeWorkTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'projects', label: 'projects' },
    { id: 'apps', label: 'apps' },
    { id: 'archive', label: 'archive' },
  ];

  return (
    <section aria-labelledby="home-work-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="home-work-heading" className="text-xl font-semibold text-primary">work</h2>
        <Link href="/work/" className="text-sm text-secondary hover:text-primary">directory →</Link>
      </div>

      <div className="mt-5 flex gap-1 border-b border-border" role="tablist" aria-label="work directory">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`home-work-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-3 py-2 text-sm transition-colors ${
                selected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-tertiary hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div id={`home-work-panel-${activeTab}`} role="tabpanel" className="mt-5 space-y-4">
        {activeTab === 'projects' && recentlyReviewedProjects.map((item) => (
          <Link key={item.name} href={item.href} className="group block">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium text-primary group-hover:underline underline-offset-4">{item.name}</h3>
              <span className="text-xs text-tertiary">{item.status}</span>
            </div>
            <p className="mt-1 text-sm leading-6 text-secondary">{item.description}</p>
          </Link>
        ))}

        {activeTab === 'apps' && apps.slice(0, 5).map((app) => (
          <Link key={app.slug} href={app.href} className="group flex gap-3">
            {app.icon && <Image src={app.icon} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg border border-border" />}
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="font-medium text-primary group-hover:underline underline-offset-4">{app.name}</h3>
                <span className="text-xs text-tertiary">{app.status}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-secondary">{app.description}</p>
            </div>
          </Link>
        ))}

        {activeTab === 'archive' && selectedWork.map((item) => (
          <Link key={item.name} href={item.href} className="group block">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium text-primary group-hover:underline underline-offset-4">{item.name}</h3>
              <span className="text-xs text-tertiary">{item.status}</span>
            </div>
            <p className="mt-1 text-sm leading-6 text-secondary">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
