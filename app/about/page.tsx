import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig, timeline } from '@/lib/content';

export const metadata: Metadata = {
  title: 'about',
  description: 'software engineer, writer, and app maker.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-semibold text-primary">about</h1>

      <div className="prose mt-8">
        <p>
          i started writing on the web in 2015 because code alone was not enough. tutorials
          taught me how to explain things. apps taught me how quickly plans collapse. medium
          taught me what happens when platforms own the room.
        </p>
        <p>
          for a few years i managed better programming, one of medium&apos;s largest programming
          publications. i watched the creator economy from inside the machine: writers chasing
          distribution, editors chasing quality, algorithms deciding which one mattered that day.
        </p>
        <p>
          now i build small apps, write about the work, and keep my own archive. i tried ai
          scaffolding because it was useful. i am coming back to human writing because usefulness
          is not the same as voice.
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
        </p>
      </section>
    </div>
  );
}
