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
