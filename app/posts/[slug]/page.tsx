import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostBody from '@/components/post-body';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import JsonLd from '@/components/json-ld';
import { postJsonLd } from '@/lib/discovery';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'post not found' };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <article className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <JsonLd data={postJsonLd(post)} />
      {/* Back link */}
      <Link
        href="/posts/"
        className="text-sm text-tertiary hover:text-primary transition-colors"
      >
        ← writing
      </Link>

      {/* Header */}
      <header className="mt-8">
        <div className="flex items-center gap-4 text-sm text-tertiary">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>

        <h1 className="mt-4 text-2xl font-semibold">
          {post.title}
        </h1>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-5 border-t border-border pt-4 text-xs leading-6 text-tertiary">
            <p>edit source</p>
            <code className="break-all text-primary">{post.sourcePath}</code>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose mt-8">
        <PostBody content={post.content} />
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <Link
          href="/posts/"
          className="text-sm text-tertiary hover:text-primary transition-colors"
        >
          ← back to writing
        </Link>
      </footer>
    </article>
  );
}
