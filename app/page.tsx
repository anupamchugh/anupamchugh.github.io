import Link from 'next/link';
import Hero from '@/components/hero';
import { getRecentPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const recentPosts = getRecentPosts(8);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {recentPosts.map((post) => (
          <div key={post.slug} className="py-1">
            <Link
              href={`/posts/${post.slug}/`}
              className="text-primary hover:underline underline-offset-4"
            >
              {post.title}
            </Link>
            <span className="text-tertiary text-sm ml-2">
              {formatDate(post.date)}
            </span>
          </div>
        ))}
        <div className="mt-4">
          <Link
            href="/posts/"
            className="text-tertiary text-sm hover:text-primary"
          >
            all posts
          </Link>
        </div>
      </section>
    </>
  );
}
