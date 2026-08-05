import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/discovery';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/review/', '/write/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
