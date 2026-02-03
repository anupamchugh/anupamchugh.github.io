import Link from 'next/link';
import { Calendar, FileText, Lock, Lightbulb, Eye, EyeOff } from 'lucide-react';
import { getNotes, getTILs } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Notes | Anupam Chugh',
  description: 'Quick thoughts, TILs, HN engagement notes, and draft ideas',
};

export default function NotesPage() {
  // In development, show private notes too
  const isDev = process.env.NODE_ENV === 'development';
  const notes = getNotes(isDev);
  const tils = getTILs();

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-sky-400" />
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Notes
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl">
            Quick thoughts, HN engagement notes, and TILs. Less polished than blog posts,
            more raw than tweets.
          </p>
          {isDev && (
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg">
              <Eye className="h-4 w-4" />
              <span>Dev mode: showing private notes</span>
            </div>
          )}
        </header>

        {/* TIL Section */}
        {tils.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-semibold text-white">Today I Learned</h2>
            </div>
            <div className="space-y-4">
              {tils.slice(0, 5).map((til) => (
                <article
                  key={til.slug}
                  className="group rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 transition-all hover:border-amber-500/50"
                >
                  <Link href={`/posts/${til.slug}`}>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-1">
                      <time dateTime={til.date}>{formatDate(til.date)}</time>
                    </div>
                    <h3 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                      {til.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">{til.excerpt}</p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Notes Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-sky-400" />
            <h2 className="text-xl font-semibold text-white">Notes & Thoughts</h2>
          </div>
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <article
                  key={note.slug}
                  className={`group rounded-lg border p-4 transition-all ${
                    note.private
                      ? 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/50'
                      : 'border-white/10 bg-white/5 hover:border-sky-500/50'
                  }`}
                >
                  <Link href={`/posts/${note.slug}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={note.date}>{formatDate(note.date)}</time>
                          {note.private && (
                            <span className="inline-flex items-center gap-1 text-rose-400">
                              <EyeOff className="h-3 w-3" />
                              Private
                            </span>
                          )}
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex gap-2">
                              {note.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-white group-hover:text-sky-400 transition-colors">
                          {note.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400 line-clamp-2">{note.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="text-center py-12 rounded-lg border border-white/10 bg-white/5">
                <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">No public notes yet.</p>
                {!isDev && (
                  <p className="text-sm text-slate-600 mt-2">
                    Some notes are private and only visible in dev mode.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
