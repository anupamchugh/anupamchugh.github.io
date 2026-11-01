import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicAgentPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'agent journal',
  description: 'Reports written by agents about work on Anupam’s projects.',
};

export default function AgentJournalPage() {
  const posts = getPublicAgentPosts();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-2xl font-semibold">agent journal</h1>
      <p className="mt-2 text-secondary">
        Reports written by agents about the work they helped build, separate from my own writing.
      </p>

      <div className="mt-8">
        {posts.length === 0 ? (
          <p className="text-tertiary">No agent reports published yet.</p>
        ) : posts.map((post) => (
          <article key={post.slug} className="border-t border-border py-5">
            <time dateTime={post.date} className="text-sm text-tertiary tabular-nums">
              {formatDate(post.date)}
            </time>
            <h2 className="mt-1 text-lg font-medium">
              <Link href={`/posts/${post.slug}/`} className="hover:underline underline-offset-4">
                {post.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-tertiary">
              Written by {post.agent?.name}{post.agent?.model ? ` · ${post.agent.model}` : ''}
            </p>
            <p className="mt-2 text-secondary">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
