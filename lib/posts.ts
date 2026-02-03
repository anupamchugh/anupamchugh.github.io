import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'docs/_posts');
const privateNotesDirectory = path.join(process.cwd(), 'private-notes');

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  categories?: string[];
  tags?: string[];
  draft?: boolean;
  private?: boolean;
  type?: 'post' | 'note' | 'til';
};

function parsePost(fileName: string, directory: string): Post | null {
  const fullPath = path.join(directory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}[-_]/, '').replace(/\.md$/, '');

  // Extract date from filename or frontmatter
  const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = data.date || (dateMatch ? dateMatch[1] : '2020-01-01');

  // Generate excerpt from content
  const excerpt = data.excerpt || content.slice(0, 200).replace(/[#*_\[\]]/g, '').trim() + '...';

  // Determine type from categories or explicit type field
  let type: 'post' | 'note' | 'til' = 'post';
  if (data.type) {
    type = data.type;
  } else if (data.categories?.includes('til')) {
    type = 'til';
  } else if (data.categories?.includes('notes') || data.tags?.includes('hn')) {
    type = 'note';
  }

  // Notes from private-notes/ are always private
  const isPrivate = directory === privateNotesDirectory ? true : (data.private || false);

  return {
    slug,
    title: data.title || slug.replace(/-/g, ' '),
    date: typeof date === 'string' ? date : date.toISOString(),
    excerpt,
    content,
    categories: data.categories || [],
    tags: data.keywords || data.tags || [],
    draft: data.draft || false,
    private: isPrivate,
    type,
  };
}

function getPostsFromDirectory(directory: string): Post[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);
  return fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => parsePost(fileName, directory))
    .filter((post): post is Post => post !== null);
}

export function getAllPosts(includePrivate = false): Post[] {
  // Get posts from main directory
  let posts = getPostsFromDirectory(postsDirectory);

  // In development, also include private notes
  if (process.env.NODE_ENV === 'development' && includePrivate) {
    const privateNotes = getPostsFromDirectory(privateNotesDirectory);
    posts = [...posts, ...privateNotes];
  }

  return posts
    // Filter out private posts unless explicitly requested
    .filter((post) => includePrivate || !post.private)
    // Filter out drafts in production
    .filter((post) => process.env.NODE_ENV === 'development' || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPublicPosts(): Post[] {
  return getAllPosts(false).filter((post) => post.type === 'post');
}

export function getNotes(includePrivate = false): Post[] {
  return getAllPosts(includePrivate).filter(
    (post) => post.type === 'note' || post.categories?.includes('notes')
  );
}

export function getTILs(): Post[] {
  return getAllPosts(false).filter(
    (post) => post.type === 'til' || post.categories?.includes('til')
  );
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts(true); // Include private for direct access
  return posts.find((post) => post.slug === slug) || null;
}

export function getRecentPosts(count: number = 6): Post[] {
  return getPublicPosts().slice(0, count);
}

export function getFeaturedPosts(): Post[] {
  const allPosts = getPublicPosts();
  const featured = allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes('swiftui') ||
      post.title.toLowerCase().includes('core ml') ||
      post.title.toLowerCase().includes('if ')
  );
  return featured.slice(0, 6);
}
