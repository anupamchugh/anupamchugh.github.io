import Link from 'next/link';

const CANONICAL_URL = '/posts/The-Tool-That-Wins-Is-The-One-With-The-Best-Constraints/';

export default function LegacyConstraintsPostRedirectPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-2xl font-semibold">This post moved</h1>
      <p className="mt-4 text-secondary">
        Redirecting to the canonical URL for this post.
      </p>
      <p className="mt-4">
        <Link href={CANONICAL_URL} className="text-primary hover:underline underline-offset-4">
          Open the post
        </Link>
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(CANONICAL_URL)});`,
        }}
      />
    </main>
  );
}
