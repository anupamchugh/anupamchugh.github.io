import type { Metadata } from 'next';
const appStoreUrl = 'https://apps.apple.com/us/app/checkmate-academy/id6760925352';

export const metadata: Metadata = {
  title: 'checkmate academy',
  description: 'learn chess with lessons, puzzles, ai games, and review tools.',
};

export default function CheckmateAcademyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <meta httpEquiv="refresh" content={`0;url=${appStoreUrl}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(appStoreUrl)});`,
        }}
      />
      <p className="text-sm uppercase tracking-[0.18em] text-tertiary">ios app</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-normal text-primary sm:text-6xl">
        checkmate academy
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary">
        learn chess with lessons, puzzles, ai games, and review tools.
      </p>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <a href={appStoreUrl} className="text-primary hover:underline underline-offset-4">
          app store →
        </a>
      </div>
    </div>
  );
}
