'use client';

import { useState } from 'react';

type Role = { id: string; kicker: string; headline: string; points: [string, string][] };

const roles: Role[] = [
  {
    id: 'ios',
    kicker: 'software engineer · ios',
    headline: '19 apps live on the App Store, mostly SwiftUI and on-device AI.',
    points: [
      ['on-device AI', 'Foundation Models with typed tools, where code decides facts and the model only reads and phrases (Trayce, Landfall, Feedloom).'],
      ['vision + 3d', 'Breakline reads body pose from clips and replays it on a RealityKit robot. Contour Lab counts and measures with Vision and lays the count out in RealityKit.'],
      ['system surfaces', 'Live Activities and the Dynamic Island in Glint, App Intents across the studio, iPhone Duo layouts.'],
      ['open source', 'Trayce and Contour Lab; iOS14VisionHandPose and VisionCreditScan, 29 stars each.'],
    ],
  },
  {
    id: 'android',
    kicker: 'android · where i started',
    headline: 'My first shipped apps were Android, and I kept building for both platforms for years.',
    points: [
      ['journaldev', 'Built the JournalDev Android app: 4.4 stars, 10K+ downloads.'],
      ['movie reviews', 'My second app, on Android, built on RSS feeds.'],
      ['mobey', 'My first job: the Android customer and driver apps for a Gold Coast delivery company, end to end and remotely: requests, navigation, proof of delivery, tips.'],
      ['agricx · acd', 'Led Android at Agricx and built its first iOS app; white-label iOS and Android apps at Aged Care Decisions.'],
    ],
  },
  {
    id: 'product',
    kicker: 'consumer mobile product',
    headline: 'I take a problem from an idea to something people use, and through App Review.',
    points: [
      ['scope', 'Nineteen live apps scoped, built, listed and supported on my own, each with a single job.'],
      ['trust', 'Privacy by default: clips, photos and documents stay on the device, and the model never decides a fact.'],
      ['flows', 'Delivery flows at MOBEY, from going online to proof of delivery and why a drop failed.'],
      ['now', 'Wearover 3.0 in App Review; Landfall, a career app on Apple Intelligence, in build.'],
    ],
  },
  {
    id: 'writer',
    kicker: 'writer · editor',
    headline: 'Over 1 million views on Medium, and editing Better Programming from 2021 to 2023.',
    points: [
      ['medium', 'Tutorials and tech essays on iOS, AI and Big Tech; several reached the Hacker News front page.'],
      ['newsletters', 'Big Tech, Humor Bytes and iOSDevie on Substack; Coffee Bytes on Medium.'],
      ['editing', 'Took over Better Programming from Zack Shapiro in 2021 and ran it until 2023.'],
      ['voice', 'Sometimes funny. The long version is ten years of doing stuff.'],
    ],
  },
  {
    id: 'manager',
    kicker: 'engineering · editorial lead',
    headline: 'Good at helping manage engineers, better with engineering managers.',
    points: [
      ['outreach', "Modified Zack's Better Publishing app, and built MediumRSS, a SwiftUI app tracking each day's posts across 100+ Medium topics, to find and onboard strong writers faster."],
      ['agents', 'Today I run coding agents like a small team: briefs, reviews, and a public agent journal of what each did.'],
      ['remote', 'Built the MOBEY apps remotely for a Gold Coast company.'],
      ['standards', 'Claims checked before they ship: tests, App Review, receipts.'],
    ],
  },
];

export default function RoleLens() {
  const [id, setId] = useState('ios');
  const role = roles.find((r) => r.id === id) ?? roles[0];

  return (
    <section className="mt-10 rounded-2xl border border-border p-5 sm:p-6">
      <p className="text-sm text-secondary">Same person, same facts. Pick the lens you&apos;re hiring for.</p>
      <div role="group" aria-label="Role" className="mt-4 flex w-fit max-w-full flex-wrap gap-1 rounded-xl bg-[var(--bg-tertiary)] p-1">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={r.id === id}
            onClick={() => setId(r.id)}
            className={`min-h-10 rounded-lg px-3.5 font-mono text-[13px] transition-colors ${
              r.id === id ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-secondary hover:text-primary'
            }`}
          >
            {r.id}
          </button>
        ))}
      </div>
      <p className="mt-6 font-mono text-xs text-tertiary">{role.kicker}</p>
      <h2 className="mt-2 text-xl font-semibold leading-snug text-primary">{role.headline}</h2>
      <dl className="mt-4">
        {role.points.map(([k, v]) => (
          <div key={k} className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[130px_1fr] sm:gap-4">
            <dt className="font-mono text-[13px] text-tertiary">{k}</dt>
            <dd className="leading-relaxed text-secondary">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
