import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/posts';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex items-baseline gap-4 py-2">
      {/* Date */}
      <time className="shrink-0 text-sm text-tertiary tabular-nums" dateTime={post.date}>
        {formatDate(post.date)}
      </time>

      {/* Title */}
      <Link
        href={`/posts/${post.slug}/`}
        className="text-primary hover:underline underline-offset-4"
      >
        {post.title}
      </Link>
    </article>
  );
}
