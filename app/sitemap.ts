import type { MetadataRoute } from 'next';
import { absoluteUrl, publicSiteRoutes } from '@/lib/discovery';
import { getPublicPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = publicSiteRoutes.map((route) => ({ url: absoluteUrl(route) }));
  const posts = getPublicPosts().map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}/`),
    lastModified: new Date(post.date),
  }));

  return [...pages, ...posts];
}
