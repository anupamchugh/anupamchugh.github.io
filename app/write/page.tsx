import BlogEditor from '@/components/blog-editor';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: 'write',
  description: 'local markdown editor',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WritePage() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
        <p className="text-sm text-tertiary">local only</p>
        <h1 className="mt-2 text-2xl font-semibold">write</h1>
        <p className="mt-2 text-secondary">the markdown editor is available only in local development.</p>
      </main>
    );
  }

  const posts = getAllPosts(true)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      sourcePath: post.sourcePath,
      draft: post.draft,
    }))
    .sort((a, b) => {
      if (a.draft !== b.draft) return a.draft ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const draftCount = posts.filter((post) => post.draft).length;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6">
      <div className="border-b border-border pb-8">
        <p className="text-sm text-tertiary">local only</p>
        <h1 className="mt-2 text-2xl font-semibold">write</h1>
        <p className="mt-2 max-w-2xl text-secondary">
          edit markdown files in this repo, review drafts, and mark drafts as published when ready.
        </p>
        <p className="mt-2 text-sm text-tertiary">{draftCount} drafts first, then public posts.</p>
        <p className="mt-3 font-mono text-xs text-tertiary">
          run: npm run blog-editor
        </p>
      </div>

      <div className="mt-8">
        <BlogEditor posts={posts} />
      </div>
    </main>
  );
}
