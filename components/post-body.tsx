import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface PostBodyProps {
  content: string;
}

export default function PostBody({ content }: PostBodyProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        a: ({ href, children, ...props }) => {
          const match = href?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
          if (match) {
            return (
              <div className="my-8 aspect-video overflow-hidden rounded-lg border border-border bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${match[1]}`}
                  title={typeof children === 'string' ? children : 'embedded video'}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            );
          }
          return <a href={href} {...props}>{children}</a>;
        },
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
      {content}
    </ReactMarkdown>
  );
}
