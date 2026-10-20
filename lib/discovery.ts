import type { Post } from '@/lib/posts';
import type { AppItem } from '@/lib/content';
import { apps, siteConfig } from '@/lib/content';
import { matchBoxApp } from '@/lib/match-box';
import { getPublicPosts } from '@/lib/posts';

export const publicSiteRoutes = [
  '/',
  '/about/',
  '/apps/',
  '/checkmate-academy/',
  '/clocktower-table/',
  '/humor/',
  '/match-box/',
  '/notes/',
  '/photos/',
  '/posts/',
  '/privacy/',
  '/privacy/best-face-forward/',
  '/privacy/checkmate-academy/',
  '/privacy/common-ground/',
  '/privacy/feedloom/',
  '/privacy/stockshots/',
  '/projects/',
  '/resume/',
  '/reviews/',
  '/support/',
  '/work/',
  '/work/takeout-tax/',
] as const;

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, `${siteConfig.url}/`).toString();
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function buildRss(posts: Post[] = getPublicPosts()): string {
  const items = posts.map((post) => {
    const url = absoluteUrl(`/posts/${post.slug}/`);
    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
      `      <description>${escapeXml(post.excerpt)}</description>`,
      '    </item>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(siteConfig.title)}</title>`,
    `    <link>${escapeXml(absoluteUrl('/posts/'))}</link>`,
    `    <description>${escapeXml(siteConfig.description)}</description>`,
    '    <language>en</language>',
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

function appLine(app: AppItem): string {
  return `- [${app.name}](${absoluteUrl(app.href)}): ${app.description} Status: ${app.status}.`;
}

function postLine(post: Post): string {
  return `- [${post.title}](${absoluteUrl(`/posts/${post.slug}/`)}): ${post.excerpt}`;
}

export function buildLlmsIndex(posts: Post[] = getPublicPosts()): string {
  return [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    'This is the public portfolio and writing archive of a software engineer, writer, and independent app maker.',
    '',
    '## Primary sections',
    '',
    `- [Writing](${absoluteUrl('/posts/')}): Public essays, tutorials, notes, and reviews.`,
    `- [Apps](${absoluteUrl('/apps/')}): Publicly listed apps and product experiments.`,
    `- [Work](${absoluteUrl('/work/')}): Selected engineering work and archives.`,
    `- [About](${absoluteUrl('/about/')}): Background and public profile links.`,
    `- [RSS](${absoluteUrl('/rss.xml')}): RSS 2.0 feed of public posts.`,
    '',
    '## Public profiles',
    '',
    `- [GitHub](${siteConfig.social.github})`,
    `- [X](${siteConfig.social.twitter})`,
    `- [LinkedIn](${siteConfig.social.linkedin})`,
    '',
    '## Apps',
    '',
    ...[matchBoxApp, ...apps].map(appLine),
    '',
    '## Recent writing',
    '',
    ...posts.slice(0, 20).map(postLine),
    '',
  ].join('\n');
}

export function buildLlmsFull(posts: Post[] = getPublicPosts()): string {
  return [
    buildLlmsIndex(posts),
    '## Full public writing archive',
    '',
    ...posts.flatMap((post) => [
      `### ${post.title}`,
      '',
      `Source: ${absoluteUrl(`/posts/${post.slug}/`)}`,
      `Published: ${post.date}`,
      '',
      post.content.trim(),
      '',
    ]),
  ].join('\n');
}

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.url,
  sameAs: [siteConfig.social.github, siteConfig.social.twitter, siteConfig.social.linkedin],
};

export function appsJsonLd(appItems: AppItem[] = [matchBoxApp, ...apps]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Apps by Anupam Chugh',
    itemListElement: appItems.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: app.name,
        description: app.description,
        url: absoluteUrl(app.href),
      },
    })),
  };
}

export function postJsonLd(post: Post) {
  const url = absoluteUrl(`/posts/${post.slug}/`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    mainEntityOfPage: url,
    url,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
