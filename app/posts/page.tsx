import { Metadata } from 'next';
import PostCard from '@/components/post-card';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'writing',
  description: 'Technical tutorials, framework explorations, and satirical takes.',
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-2xl font-semibold">writing</h1>
      <p className="mt-2 text-secondary">
        {posts.length} articles on iOS, SwiftUI, Core ML, and more.
      </p>

      <div className="mt-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
