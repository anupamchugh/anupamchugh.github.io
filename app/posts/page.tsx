import { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/post-card';
import { getPublicPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'writing',
  description: 'Technical tutorials, tools, and satirical takes on software engineering.',
};

export default function PostsPage() {
  const posts = getPublicPosts().filter((post) => !post.agent?.name);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-2xl font-semibold">writing</h1>
      <p className="mt-2 text-secondary">
        {posts.length} articles on code, tools, and the things I build.
      </p>
      <p className="mt-4 text-secondary">
        Looking for reports written by my agents? Visit the{' '}
        <Link href="/agent-journal/" className="text-primary underline underline-offset-4">agent journal</Link>.
      </p>

      <div className="mt-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
