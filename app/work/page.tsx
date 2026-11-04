import { Metadata } from 'next';
import Link from 'next/link';
import WorkGrid from '@/components/work-grid';

export const metadata: Metadata = {
  title: 'work',
  description: 'Apps on the App Store, code on GitHub, and the client apps from before.',
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
      <h1 className="text-5xl font-bold leading-none tracking-[-0.04em] text-primary sm:text-6xl">Work.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-secondary">
        Apps on the App Store, code on GitHub, and the client apps from before. Every card links to where you can check it.
      </p>

      <WorkGrid />

      <p className="mt-10 text-sm text-secondary">
        Screens from 2015 to 2019 are in the <Link href="/work/gallery/">work gallery</Link>. Every app with its store link is on the{' '}
        <Link href="/apps/">apps page</Link>. What my coding agents changed, and who checked it, is in the{' '}
        <Link href="/agent-journal/">agent journal</Link>.
      </p>
    </div>
  );
}
