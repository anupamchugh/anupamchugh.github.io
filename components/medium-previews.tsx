import medium from '@/content/medium.json';

type MediumPost = { title: string; link: string; date: string | null; image: string | null; excerpt: string };

const fmt = (d: string | null) =>
  d ? new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';

export default function MediumPreviews() {
  const posts = (medium.posts ?? []) as MediumPost[];
  if (!posts.length) return null;
  return (
    <div className="mt-9">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-tertiary">latest on medium</p>
        <a href="https://medium.com/@anupamchugh" className="inline-flex min-h-11 items-center text-sm font-semibold">All on Medium ↗</a>
      </div>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.link}>
            <a href={post.link} className="flex h-full flex-col overflow-hidden rounded-[20px] border border-border no-underline hover:border-[var(--fg-subtle)]">
              {post.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
              ) : (
                <div className="aspect-[16/9] w-full bg-[var(--bg-tertiary)]" />
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="font-mono text-xs text-tertiary">{fmt(post.date)}</span>
                <strong className="leading-snug text-primary">{post.title}</strong>
                {post.excerpt && <span className="line-clamp-3 text-sm leading-relaxed text-secondary">{post.excerpt}</span>}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
