import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig, timeline } from '@/lib/content';

export const metadata: Metadata = {
  title: 'about',
  description: 'ios and macos engineer. former editor of better programming.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-semibold text-primary">about</h1>

      <div className="prose mt-8">
        <p>
          i began building apps for fun and started an e-commerce based startup. while that
          didn&apos;t pan out well, a nice consolation prize is that i&apos;ve become a reliable
          ios and android developer who knows how to deliver results in the alignment of a
          company&apos;s mission.
        </p>
        <p>
          i led android at agricx and shipped their first ios app. from 2021 to 2023 i was
          managing editor of better programming. a small editor team and i read thousands of
          submissions a month. the job was holding a piece back until the writer understood what
          they set out to explain.
        </p>
        <p>
          since 2024 i ship small apple apps. rifflet, orbits, and echohunt are on the store.
          the essays stay here as an archive. i am not running a blog right now.
        </p>
      </div>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-primary">the short version</h2>
        <div className="mt-5 space-y-5">
          {timeline.map((item) => (
            <div key={item.year} className="grid grid-cols-[4rem_1fr] gap-4">
              <div className="text-sm text-tertiary tabular-nums">{item.year}</div>
              <div>
                <h3 className="font-medium text-primary">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-secondary">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-primary">elsewhere</h2>
        <p className="mt-3 text-sm leading-6 text-secondary">
          <a href={siteConfig.social.github}>github</a>
          {' · '}
          <a href={siteConfig.social.twitter}>x</a>
          {' · '}
          <a href={siteConfig.social.linkedin}>linkedin</a>
          {' · '}
          <Link href="/photos/">photos</Link>
          {' · '}
          <Link href="/posts/ten-years-of-doing-stuff/">ten years of doing stuff</Link>
          {' · '}
          <a href="https://medium.com/macoclock/apple-is-killing-a-billion-dollar-ad-industry-with-one-popup-2f83d182837f">
            apple is killing a billion-dollar ad industry
          </a>
        </p>
      </section>
    </div>
  );
}
