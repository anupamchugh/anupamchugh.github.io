import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { apps, recentlyReviewedProjects, selectedWork } from '@/lib/content';
import { matchBoxApp, matchBoxReviewedProject } from '@/lib/match-box';

export const metadata: Metadata = {
  title: 'work',
  description: 'selected apps, open source, writing, and experiments.',
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-semibold text-primary">work</h1>
      <p className="mt-3 max-w-2xl text-secondary">
        a smaller shelf for the work that still explains me: shipped apps, old ios experiments,
        writing systems, and a few things still being built.
      </p>

      <section className="mt-12 border-y border-border py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-primary">recently reviewed</h2>
            <p className="mt-1 text-sm text-tertiary">
              public projects I have checked recently for ownership, status, and a clean link.
            </p>
          </div>
          <span className="font-mono text-xs text-tertiary">reviewed shelf / 2026</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[matchBoxReviewedProject, ...recentlyReviewedProjects].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group block rounded-lg border border-border p-4 transition-colors hover:border-secondary"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium text-primary group-hover:underline underline-offset-4">
                  {item.name}
                </h3>
                <span className="text-xs text-tertiary">{item.status}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-secondary">{item.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[11px] text-tertiary">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold text-primary">apps</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[matchBoxApp, ...apps].map((app) => (
            <Link
              id={app.slug}
              key={app.slug}
              href={app.href}
              className="group flex gap-4 rounded-lg border border-border p-4 transition-colors hover:border-secondary"
            >
              {app.icon && (
                <Image
                  src={app.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl border border-border"
                />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-primary group-hover:underline underline-offset-4">
                    {app.name.toLowerCase()}
                  </h3>
                  <span className="text-xs text-tertiary">{app.status}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-secondary">{app.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold text-primary">project archive</h2>
          <span className="text-xs text-tertiary">vision, core ml, experiments</span>
        </div>
        <div className="mt-5 space-y-5">
          {selectedWork.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group block border-b border-border pb-5 last:border-b-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-primary group-hover:underline underline-offset-4">
                  {item.name.toLowerCase()}
                </h3>
                <span className="text-xs text-tertiary">{item.status}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-secondary">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs text-tertiary">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
