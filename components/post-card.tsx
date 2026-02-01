import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/posts';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-slate-800 py-6">
      <Link href={`/posts/${post.slug}/`} className="group block">
        {/* Date */}
        <time className="text-sm text-slate-500" dateTime={post.date}>
          {formatDate(post.date)}
        </time>

        {/* Title */}
        <h3 className="mt-2 text-xl font-semibold text-white group-hover:text-sky-400">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-slate-400 line-clamp-2">
          {post.excerpt}
        </p>
      </Link>
    </article>
  );
}
