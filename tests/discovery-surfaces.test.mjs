import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const outputDirectory = path.join(process.cwd(), 'out');
const siteUrl = 'https://anupamchugh.github.io';

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

test('exports feed and crawler discovery files', () => {
  const rss = exportedFile('rss.xml');
  assert.match(rss, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(rss, /<rss version="2\.0">/);
  assert.match(rss, new RegExp(`<link>${siteUrl}/posts/`));
  assert.doesNotMatch(rss, /<draft>|private-notes/);

  const sitemap = exportedFile('sitemap.xml');
  assert.match(sitemap, new RegExp(`${siteUrl}/apps/`));
  assert.match(sitemap, new RegExp(`${siteUrl}/posts/`));

  const robots = exportedFile('robots.txt');
  assert.match(robots, /Allow: \//);
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
