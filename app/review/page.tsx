import PostBody from '@/components/post-body';
import { getDraftPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'review',
  description: 'local draft review queue',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReviewPage() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
        <p className="text-sm text-tertiary">local only</p>
        <h1 className="mt-2 text-2xl font-semibold">review</h1>
        <p className="mt-2 text-secondary">draft review is available only in local development.</p>
      </main>
    );
  }

  const drafts = getDraftPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <div className="border-b border-border pb-8">
        <p className="text-sm text-tertiary">local only</p>
        <h1 className="mt-2 text-2xl font-semibold">review</h1>
        <p className="mt-2 max-w-2xl text-secondary">
          backdated drafts and imports that are in the repo but not public.
        </p>
        <Link href="/write/" className="mt-4 inline-block text-sm text-primary hover:underline underline-offset-4">
          open editor →
        </Link>
      </div>

      <div className="mt-8 space-y-5">
        {drafts.map((post) => (
          <details key={post.slug} className="border-b border-border pb-5">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center gap-3 text-sm text-tertiary">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.source && <span>{post.source}</span>}
                {post.categories?.map((category) => (
                  <span key={category}>{category}</span>
                ))}
              </div>

              <h2 className="mt-2 text-lg font-medium text-primary">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-secondary">{post.excerpt}</p>
            </summary>

            <div className="mt-5 border-l border-border pl-4">
              <div className="mb-5 space-y-1 text-sm text-secondary">
                {post.canonicalUrl && (
                  <p>
                    source:{' '}
                    <a href={post.canonicalUrl} className="underline underline-offset-4">
                      medium canonical
                    </a>
                  </p>
                )}
                {post.sourceFile && <p>file: {post.sourceFile}</p>}
                <p>
                  edit source: <code className="break-all text-primary">{post.sourcePath}</code>
                </p>
              </div>

              <div className="prose">
                <PostBody content={post.content} />
              </div>
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
