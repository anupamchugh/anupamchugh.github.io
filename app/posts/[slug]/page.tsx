import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

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
      </header>

      {/* Content */}
      <div className="prose mt-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            img: ({ src, alt }) => {
              const imgSrc = src?.startsWith('/') ? src : `/assets/${src}`;
              return (
                <img
                  src={imgSrc}
                  alt={alt || ''}
                  loading="lazy"
                />
              );
            },
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return <code {...props}>{children}</code>;
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
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
