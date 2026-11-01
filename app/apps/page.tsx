import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { apps, portfolioArchive } from '@/lib/content';
import { matchBoxApp } from '@/lib/match-box';
import JsonLd from '@/components/json-ld';
import { appsJsonLd } from '@/lib/discovery';

export const metadata: Metadata = {
  title: 'apps',
  description: 'apps for iPhone, iPad, Mac, and other Apple platforms by Anupam Chugh.',
};

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <JsonLd data={appsJsonLd()} />
      <h1 className="text-3xl font-semibold text-primary">apps</h1>
      <p className="mt-3 max-w-2xl text-secondary">
        a shelf of apps and experiments, from music and travel to private on-device tools.
        each status says what is live and what is still being built.
      </p>
      <p className="mt-3 max-w-2xl text-secondary">
        want to see them working? the showcase has real screens from the shipped apps, their store
        links, and what is still in the studio.
      </p>
      <a
        href="/showcase/"
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
      >
        open the showcase
      </a>

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
                {app.platforms.length > 0 && (
                  <p className="mt-2 text-xs text-tertiary">{app.platforms.join(' · ')}</p>
                )}
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

      <section className="mt-16" aria-labelledby="archive-heading">
        <h2 id="archive-heading" className="text-2xl font-semibold text-primary">
          Earlier projects and experiments
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">
          These entries preserve older portfolio records. Their evidence labels describe saved material,
          not a current build or public demo. Recorded platform names are historical catalogue data.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {portfolioArchive.map((item) => (
            <article key={item.name} className="rounded-lg border border-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-primary">{item.name.toLowerCase()}</h3>
                <span className="text-xs text-tertiary">{item.category}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-secondary">{item.summary}</p>
              <p className="mt-3 text-xs text-tertiary">
                Recorded platforms: {item.recordedPlatforms.join(' · ')}
              </p>
              <p className="mt-2 text-xs text-tertiary">Evidence: {item.evidence}</p>
              <p className="mt-2 text-xs leading-5 text-tertiary">{item.evidenceNote}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
