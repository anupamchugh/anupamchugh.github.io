import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'docs/_posts');

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  categories?: string[];
  tags?: string[];
};

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}[-_]/, '').replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Extract date from filename or frontmatter
      const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
      const date = data.date || (dateMatch ? dateMatch[1] : '2020-01-01');

      // Generate excerpt from content
      const excerpt = data.excerpt || content.slice(0, 200).replace(/[#*_\[\]]/g, '').trim() + '...';

      return {
        slug,
        title: data.title || slug.replace(/-/g, ' '),
        date: typeof date === 'string' ? date : date.toISOString(),
        excerpt,
        content,
        categories: data.categories || [],
        tags: data.keywords || data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function getRecentPosts(count: number = 6): Post[] {
  return getAllPosts().slice(0, count);
}

export function getFeaturedPosts(): Post[] {
  const allPosts = getAllPosts();
  // Return posts with specific keywords or most recent
  const featured = allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes('swiftui') ||
      post.title.toLowerCase().includes('core ml') ||
      post.title.toLowerCase().includes('if ')
  );
  return featured.slice(0, 6);
}
