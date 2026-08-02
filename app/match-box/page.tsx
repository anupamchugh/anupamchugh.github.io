import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Match Box',
  description: 'A private, local macOS companion for reviewing owner-selected visible dating context.',
};

const boundaries = [
  'One owner-selected visible screen at a time',
  'Review before saving local context',
  'No dating-service API, login, or cloud sync',
  'No sends, likes, swipes, matches, or background monitoring',
];

const flow = [
  ['Capture', 'Read a visible iPhone Mirroring screen locally.'],
  ['Review', 'Keep only the literal facts you approve.'],
  ['Recall', 'See profile, chat, and prompt context in one local inbox.'],
  ['Think', 'Use grounded local review without handing the conversation to a cloud agent.'],
];

export default function MatchBoxPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-tertiary">Match Box</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            Context for dating conversations. Kept on your Mac.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-secondary">
            Match Box turns the screen you choose in iPhone Mirroring into reviewable local context.
            It keeps visible prompts, chats, and uncertainty together while you keep control of every action.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#boundaries"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-80"
            >
              See the boundaries
            </Link>
            <Link
              href="/apps"
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
            >
              Back to apps
            </Link>
          </div>
          <p className="mt-5 text-sm text-tertiary">
            MIT-licensed source is being prepared for public review. No Bumble, Hinge, or dating-service affiliation.
          </p>
        </div>

        <figure className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          <img
            src="/apps/match-box-fictional-demo.png"
            alt="Fictional Match Box desktop interface showing local profile and conversation review"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-border px-4 py-3 text-sm text-tertiary">
            Fictional demo content only. No real profiles or conversations are shown.
          </figcaption>
        </figure>
      </section>

      <section id="boundaries" className="mt-16 grid gap-4 md:grid-cols-2">
        {boundaries.map((boundary) => (
          <div key={boundary} className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-base font-medium text-primary">{boundary}</p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-tertiary">Local flow</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {flow.map(([title, body], index) => (
            <article key={title} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-tertiary">0{index + 1}</p>
              <h2 className="mt-3 text-lg font-semibold text-primary">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-secondary">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-primary">What it can understand</h2>
          <p className="mt-3 text-sm leading-6 text-secondary">
            Visible profile prompts, interests, likes context, chat lists, and conversation bubbles. Local review
            points to saved facts and leaves unknowns explicit.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-primary">What it will not do</h2>
          <p className="mt-3 text-sm leading-6 text-secondary">
            It never sends a message, likes, swipes, matches, logs in, or operates a dating service on your behalf.
          </p>
        </article>
      </section>
    </main>
  );
}
