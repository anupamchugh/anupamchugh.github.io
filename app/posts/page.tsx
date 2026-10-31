import { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/post-card';
import { getPublicPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'writing',
  description: 'Technical tutorials, tools, and satirical takes on software engineering.',
};

export default function PostsPage() {
  const posts = getPublicPosts();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-2xl font-semibold">writing</h1>
      <p className="mt-2 text-secondary">
        {posts.length} articles on code, tools, and the things I build.
      </p>

      <nav aria-label="Start reading" className="mt-8 border-y border-border py-5">
        <h2 className="font-semibold text-primary">start here</h2>
        <div className="mt-3 flex flex-col gap-2 text-sm text-secondary">
          <Link href="/posts/ten-years-of-doing-stuff/" className="hover:text-primary hover:underline">my career story →</Link>
          <Link href="/posts/Moving-On-From-BP/" className="hover:text-primary hover:underline">leading Better Programming →</Link>
          <Link href="/showcase/" className="hover:text-primary hover:underline">see the apps behind the writing →</Link>
        </div>
      </nav>

      <div className="mt-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
