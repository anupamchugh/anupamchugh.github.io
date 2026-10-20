import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';

const outputDirectory = path.join(process.cwd(), 'out');
const siteUrl = 'https://anupamchugh.github.io';
const expectedPublicRoutes = [
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
];

function exportedFile(relativePath) {
  const candidates = [
    path.join(outputDirectory, relativePath),
    path.join(outputDirectory, relativePath, 'index.html'),
  ];
  const match = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  assert.ok(match, `expected exported file for /${relativePath}`);
  return readFileSync(match, 'utf8');
}

function jsonLdRecords(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => {
      const value = JSON.parse(match[1].replaceAll('&quot;', '"'));
      return Array.isArray(value) ? value : [value];
    });
}

function postFixtures() {
  const postsDirectory = path.join(process.cwd(), 'docs', '_posts');
  return readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const { data } = matter(readFileSync(path.join(postsDirectory, fileName), 'utf8'));
      const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}[-_]/, '').replace(/\.md$/, '');
      let type = data.type || 'post';
      if (!data.type && data.categories?.includes('til')) type = 'til';
      if (!data.type && (data.categories?.includes('notes') || data.tags?.includes('hn'))) type = 'note';
      if (!data.type && data.categories?.includes('reviews')) type = 'review';
      return { slug, type, draft: Boolean(data.draft), private: Boolean(data.private) };
    });
}

function urlsFromXml(xml, element) {
  return [...xml.matchAll(new RegExp(`<${element}(?: [^>]*)?>([^<]+)</${element}>`, 'g'))]
    .map((match) => match[1]);
}

test('exports feed and crawler discovery files', () => {
  const rss = exportedFile('rss.xml');
  assert.match(rss, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(rss, /<rss version="2\.0">/);
  assert.match(rss, new RegExp(`<link>${siteUrl}/posts/`));
  assert.doesNotMatch(rss, /<draft>|private-notes/);

  const fixtures = postFixtures();
  const expectedPostUrls = fixtures
    .filter((post) => post.type === 'post' && !post.draft && !post.private)
    .map((post) => `${siteUrl}/posts/${post.slug}/`)
    .sort();
  const rssItemUrls = urlsFromXml(rss, 'guid').sort();
  assert.deepEqual(rssItemUrls, expectedPostUrls, 'RSS must contain exactly the public posts');
  for (const post of fixtures.filter((fixture) => fixture.draft || fixture.private)) {
    assert.doesNotMatch(rss, new RegExp(`${siteUrl}/posts/${post.slug}/`));
  }

  const sitemap = exportedFile('sitemap.xml');
  const sitemapUrls = urlsFromXml(sitemap, 'loc').sort();
  const expectedSitemapUrls = [
    ...expectedPublicRoutes.map((route) => `${siteUrl}${route}`),
    ...expectedPostUrls,
  ].sort();
  assert.deepEqual(sitemapUrls, expectedSitemapUrls, 'sitemap must contain every indexable route');
  assert.ok(!sitemapUrls.includes(`${siteUrl}/review/`));
  assert.ok(!sitemapUrls.includes(`${siteUrl}/write/`));

  const robots = exportedFile('robots.txt');
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Disallow: \/review\//);
  assert.match(robots, /Disallow: \/write\//);
  assert.match(robots, new RegExp(`Sitemap: ${siteUrl}/sitemap.xml`));

  for (const file of ['llms.txt', 'llms-full.txt']) {
    const contents = exportedFile(file);
    assert.match(contents, /Anupam Chugh/i);
    assert.match(contents, new RegExp(`${siteUrl}/apps/`));
    assert.match(contents, /https:\/\/github\.com\/anupamchugh/);
  }
});

test('exports semantic owner and app records with ordinary links', () => {
  const homeRecords = jsonLdRecords(exportedFile('index.html'));
  assert.ok(homeRecords.some((record) => record['@type'] === 'Person'));

  const appsHtml = exportedFile('apps');
  assert.match(appsHtml, /<a[^>]+href="https:\/\/apps\.apple\.com\//);
  assert.match(appsHtml, /<a[^>]+href="https:\/\/github\.com\/anupamchugh\//);

  const appRecords = jsonLdRecords(appsHtml);
  const list = appRecords.find((record) => record['@type'] === 'ItemList');
  assert.ok(list, 'expected an ItemList JSON-LD record on /apps/');
  assert.ok(
    list.itemListElement.some((item) => item.item?.['@type'] === 'SoftwareApplication'),
    'expected SoftwareApplication entries in the app list',
  );
});

test('exports BlogPosting JSON-LD on every public post page', () => {
  const postsDirectory = path.join(outputDirectory, 'posts');
  const postDirectories = readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  assert.ok(postDirectories.length > 0, 'expected exported public posts');

  for (const slug of postDirectories) {
    const records = jsonLdRecords(exportedFile(path.join('posts', slug)));
    assert.ok(
      records.some((record) => record['@type'] === 'BlogPosting'),
      `expected BlogPosting JSON-LD for ${slug}`,
    );
  }
});
