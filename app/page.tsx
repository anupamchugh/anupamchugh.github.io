import Link from 'next/link';
import Hero from '@/components/hero';
import PostCard from '@/components/post-card';
import { getRecentPosts } from '@/lib/posts';
import { projects } from '@/lib/content';

export default function HomePage() {
  const recentPosts = getRecentPosts(5);
  const featuredProjects = projects.filter(p => p.featured).slice(0, 4);

  return (
    <>
      <Hero />

      {/* Writing */}
      <section className="mx-auto max-w-2xl px-4 pb-12 sm:px-6">
        <h2 className="text-sm font-medium text-tertiary uppercase tracking-wide">
          Writing
        </h2>

        <div className="mt-4">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Link
          href="/posts/"
          className="mt-4 inline-block text-sm text-tertiary hover:text-primary transition-colors"
        >
          All posts →
        </Link>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <h2 className="text-sm font-medium text-tertiary uppercase tracking-wide">
          Projects
        </h2>

        <div className="mt-4 space-y-3">
          {featuredProjects.map((project) => (
            <div key={project.name} className="group">
              <Link
                href={project.href}
                className="text-primary hover:underline underline-offset-4"
              >
                {project.name}
              </Link>
              <p className="text-sm text-secondary">
                {project.description}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/projects/"
          className="mt-4 inline-block text-sm text-tertiary hover:text-primary transition-colors"
        >
          All projects →
        </Link>
      </section>
    </>
  );
}
