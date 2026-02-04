import Link from 'next/link';
import { getNotes, getTILs } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Notes',
  description: 'Quick thoughts, TILs, and draft ideas',
};

export default function NotesPage() {
  const isDev = process.env.NODE_ENV === 'development';
  const notes = getNotes(isDev);
  const tils = getTILs();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <p className="mt-2 text-secondary">
        Quick thoughts and TILs. Less polished than blog posts.
      </p>

      {/* TILs */}
      {tils.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-medium text-tertiary tracking-wide">
            Today I learned
          </h2>
          <div className="mt-4 space-y-2">
            {tils.slice(0, 5).map((til) => (
              <article key={til.slug} className="flex items-baseline gap-4 py-2">
                <time className="shrink-0 text-sm text-tertiary tabular-nums" dateTime={til.date}>
                  {formatDate(til.date)}
                </time>
                <Link
                  href={`/posts/${til.slug}`}
                  className="text-primary hover:underline underline-offset-4"
                >
                  {til.title}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Notes */}
      <section className="mt-12">
        <h2 className="text-sm font-medium text-tertiary tracking-wide">
          Notes
        </h2>
        <div className="mt-4 space-y-2">
          {notes.length > 0 ? (
            notes.map((note) => (
              <article key={note.slug} className="flex items-baseline gap-4 py-2">
                <time className="shrink-0 text-sm text-tertiary tabular-nums" dateTime={note.date}>
                  {formatDate(note.date)}
                </time>
                <Link
                  href={`/posts/${note.slug}`}
                  className="text-primary hover:underline underline-offset-4"
                >
                  {note.title}
                </Link>
              </article>
            ))
          ) : (
            <p className="text-tertiary py-8">No public notes yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
