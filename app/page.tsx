import Link from 'next/link';
import Hero from '@/components/hero';
import PostCard from '@/components/post-card';
import { getRecentPosts } from '@/lib/posts';

export default function HomePage() {
  const recentPosts = getRecentPosts(10);

  return (
    <>
      <Hero />

      {/* Recent Posts */}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-bold text-white">Recent Posts</h2>

        <div className="mt-6">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Link
          href="/posts/"
          className="mt-8 inline-block text-sky-400 hover:text-sky-300"
        >
          View all posts →
        </Link>
      </section>
    </>
  );
}
