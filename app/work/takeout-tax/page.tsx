import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'takeout tax',
  description: 'A local CLI for calculating the migration cost of Google products that disappeared.',
};

export default function TakeoutTaxPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6">
      <Link href="/work/" className="font-mono text-xs text-tertiary hover:text-primary">
        ← work
      </Link>
      <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-tertiary">archive / project</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-primary">takeout tax</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-secondary">
        Part obituary, part invoice: a local tool for measuring what it costs when a service you
        relied on disappears.
      </p>

      <div className="mt-10 grid gap-6 border-y border-border py-7 sm:grid-cols-3">
        <div><p className="font-mono text-xs text-tertiary">input</p><p className="mt-2 text-sm text-primary">Google Takeout folder</p></div>
        <div><p className="font-mono text-xs text-tertiary">output</p><p className="mt-2 text-sm text-primary">migration-time invoice</p></div>
        <div><p className="font-mono text-xs text-tertiary">privacy</p><p className="mt-2 text-sm text-primary">local processing</p></div>
      </div>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <h2>the idea</h2>
        <p>
          Export a Takeout folder, point the CLI at it, and get an estimate of the files, products,
          migration hours, opportunity cost, and risk left behind by a product shutdown.
        </p>
        <pre><code>npx takeout-tax ~/Downloads/Takeout --rate 75</code></pre>
        <p>
          The companion “Where I Was” concept correlates service-death dates with places in an
          export. It remains an experiment, not a claim that the web app or an iOS app is shipped.
        </p>
        <h2>source</h2>
        <p>
          The implementation and full README live in the public repository. The scanner reads
          folder names and file metadata; it does not upload the contents of your export.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="https://github.com/anupamchugh/google-takeout-tax"
          className="rounded-md bg-primary px-4 py-2 text-sm text-background hover:opacity-90"
        >
          view on github →
        </a>
        <Link href="/posts/google-maps-saved-places/" className="rounded-md border border-border px-4 py-2 text-sm text-secondary hover:border-secondary hover:text-primary">
          related note →
        </Link>
      </div>
    </article>
  );
}
