import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'apps',
  description: 'iOS apps by Anupam Chugh.',
};

const apps = [
  {
    name: 'Find Common Ground',
    tagline: 'Decide where to go — together.',
    description:
      'Helps groups find overlapping saved places. Import from Apple Maps or Google Maps, swipe to match, and discover shared favorites instantly.',
    features: [
      'Quick Match and Swipe Flow modes',
      'Import from Apple Maps, Google Maps, or visit detection',
      'Taste profiles and freshness tracking',
      'Siri Shortcuts, Spotlight, Share Extension',
    ],
    privacy: 'No accounts. No servers. Your places stay on your device.',
    appStoreUrl: 'https://apps.apple.com/us/app/find-common-ground/id6759101340',
    category: 'Travel',
    price: 'Free',
    platform: 'iOS 17+',
  },
  {
    name: 'Playlist Hunter',
    tagline: 'Describe a vibe. Get a playlist.',
    description:
      'Uses AI to generate Apple Music playlists from a text prompt. Room Mode lets multiple people contribute to the same playlist in real time.',
    features: [
      'AI-powered playlist generation from text prompts',
      'Room Mode — collaborative playlists with friends',
      'Apple Music integration',
      'Save and share generated playlists',
    ],
    privacy: 'Your music taste stays on your device. Prompts are processed for playlist generation only.',
    appStoreUrl: 'https://apps.apple.com/app/playlist-hunter/id6740211916',
    category: 'Music',
    price: 'Free',
    platform: 'iOS 17+',
  },
];

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-semibold text-primary">apps</h1>
      <p className="mt-2 text-secondary">iOS apps I've built and shipped.</p>

      <div className="mt-10 space-y-10">
        {apps.map((app) => (
          <div
            key={app.name}
            className="overflow-hidden rounded-lg border border-border"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-primary">
                    {app.name}
                  </h2>
                  <p className="mt-1 text-lg text-secondary">{app.tagline}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-tertiary">
                  <span>{app.category}</span>
                  <span>{app.price}</span>
                  <span>{app.platform}</span>
                </div>
              </div>

              <p className="mt-4 text-secondary">{app.description}</p>

              <ul className="mt-4 space-y-1.5">
                {app.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-tertiary" />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-tertiary italic">{app.privacy}</p>

              <div className="mt-6">
                <a
                  href={app.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-80"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Download on the App Store
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
