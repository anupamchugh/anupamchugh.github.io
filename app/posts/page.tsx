import { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/post-card';
import { getPublicPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'writing',
  description: 'Technical tutorials, tools, and satirical takes on software engineering.',
};

const startingPoints = [
  {
    title: 'Apple development',
    description: 'Experiments with SwiftUI and computer vision. These tutorials are from 2020 and 2021.',
    slugs: ['SwiftUI-Vision-Contour-Request-Coin-Detection-in-iOS', 'Swipeless-Tinder-Using-iOS-14-Vision-Hand-Pose-Estimation'],
  },
  {
    title: 'Products and AI',
    description: 'A browser-history tool and a look at Apple’s Journal app.',
    slugs: ['pastport-what-safari-remembers', 'Views-On-Apple-Journal-App'],
  },
  {
    title: 'Personal stories',
    description: 'The career behind the apps and the people behind a publication.',
    slugs: ['ten-years-of-doing-stuff', 'Moving-On-From-BP'],
  },
];

export default function PostsPage() {
  const publicPosts = getPublicPosts();
  const posts = publicPosts.filter((post) => !post.agent?.name);
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
  const agentPicks = publicPosts.filter((post) => post.agent?.name && [
    'every-apple-ai-api-wwdc26-umpire-and-commentator',
    'scout-code-ranks-apple-intelligence-explains',
  ].includes(post.slug));

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

      <nav aria-label="Start reading" className="mt-8 border-y border-border py-6">
        <h2 className="text-xl font-semibold text-primary">start here</h2>
        <p className="mt-2 text-sm text-secondary">A few ways into the archive, or <a href="#all-writing" className="underline underline-offset-4">browse all writing</a>.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {startingPoints.map((group) => {
            const selections = group.slugs.map((slug) => postsBySlug.get(slug)).filter((post) => post !== undefined);
            if (!selections.length) return null;
            return (
              <section key={group.title}>
                <h3 className="font-semibold text-primary">{group.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{group.description}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {selections.map((post) => <li key={post.slug}><Link href={`/posts/${post.slug}/`} className="text-primary underline decoration-border underline-offset-4 hover:decoration-current">{post.title} →</Link></li>)}
                </ul>
              </section>
            );
          })}
        </div>
      </nav>

      {agentPicks.length > 0 && (
        <section className="mt-8 border-b border-border pb-6" aria-labelledby="agent-picks">
          <h2 id="agent-picks" className="text-xl font-semibold text-primary">from the agent journal</h2>
          <p className="mt-2 text-sm text-secondary">Reports on Apple AI and writer scouting, with authors credited.</p>
          <ul className="mt-3 space-y-2 text-sm">
            {agentPicks.map((post) => <li key={post.slug}><Link href={`/posts/${post.slug}/`} className="text-primary underline underline-offset-4">{post.title} →</Link> <span className="text-tertiary">· written by {post.agent?.name}</span></li>)}
          </ul>
        </section>
      )}

      <div id="all-writing" className="mt-8 scroll-mt-24">
        <h2 className="mb-4 text-xl font-semibold text-primary">all writing</h2>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
