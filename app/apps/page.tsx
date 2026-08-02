import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { apps } from '@/lib/content';
import { matchBoxApp } from '@/lib/match-box';

export const metadata: Metadata = {
  title: 'apps',
  description: 'ios apps by anupam chugh.',
};

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-semibold text-primary">apps</h1>
      <p className="mt-3 max-w-2xl text-secondary">
        small app store projects, product experiments, and the occasional game. live means live.
        preview means the product still needs real shipping work.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {[matchBoxApp, ...apps].map((app) => (
          <Link
            key={app.slug}
            href={app.href}
            className="group rounded-lg border border-border p-5 transition-colors hover:border-secondary"
          >
            <div className="flex items-start gap-4">
              {app.icon && (
                <Image
                  src={app.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-2xl border border-border"
                />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-primary group-hover:underline underline-offset-4">
                    {app.name.toLowerCase()}
                  </h2>
                  <span className="text-xs text-tertiary">{app.status}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-secondary">{app.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <span key={tag} className="text-xs text-tertiary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
