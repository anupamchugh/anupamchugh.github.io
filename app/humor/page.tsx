import { Metadata } from 'next';
import Link from 'next/link';
import { humorShelf } from '@/lib/content';

export const metadata: Metadata = {
  title: 'humor',
  description: 'selected satire and humor writing.',
};

export default function HumorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-semibold text-primary">humor</h1>
      <p className="mt-3 text-secondary">
        some of the old satire should stay visible. not as the whole identity, but as proof
        that the site has a pulse.
      </p>

      <div className="mt-10 space-y-6">
        {humorShelf.map((item) => (
          <Link key={item.href} href={item.href} className="group block border-b border-border pb-6 last:border-b-0">
            <h2 className="text-primary group-hover:underline underline-offset-4">
              {item.title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-secondary">{item.note}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
