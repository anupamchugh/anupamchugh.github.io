// Fetches the Medium RSS feed at build time and writes content/medium.json.
// If the fetch fails (offline, Medium blocks the runner), the last committed
// snapshot is kept so the build never breaks.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'content', 'medium.json');
const FEED = process.env.MEDIUM_FEED || 'https://medium.com/feed/@anupamchugh';
const LIMIT = 6;

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'", nbsp: ' ' };

export function decode(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
      if (e[0] === '#') {
        const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return entities[e.toLowerCase()] ?? m;
    });
}

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]).trim() : '';
}

function textOnly(html) {
  return decode(html.replace(/<figure[\s\S]*?<\/figure>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function snippet(html, max = 180) {
  const text = textOnly(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : max)}…`;
}

export function parseFeed(xml, limit = LIMIT) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items.slice(0, limit).map((item) => {
    const body = tag(item, 'content:encoded') || tag(item, 'description');
    const img = body.match(/<img[^>]+src="([^"]+)"/i);
    const link = tag(item, 'link').split('?')[0];
    const date = new Date(tag(item, 'pubDate'));
    return {
      title: tag(item, 'title'),
      link,
      date: Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10),
      image: img && !img[1].includes('/_/stat') ? img[1] : null,
      excerpt: snippet(body),
    };
  }).filter((p) => p.title && p.link);
}

async function main() {
  try {
    const res = await fetch(FEED, { headers: { 'User-Agent': 'anupamchugh.github.io build (RSS reader)' }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = parseFeed(await res.text());
    if (!posts.length) throw new Error('feed had no items');
    writeFileSync(OUT, `${JSON.stringify({ source: FEED, fetchedAt: new Date().toISOString(), posts }, null, 2)}\n`);
    console.log(`medium: wrote ${posts.length} posts`);
  } catch (err) {
    const kept = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')).posts?.length ?? 0 : 0;
    if (!existsSync(OUT)) writeFileSync(OUT, `${JSON.stringify({ source: FEED, fetchedAt: null, posts: [] }, null, 2)}\n`);
    console.warn(`medium: fetch failed (${err.message}); keeping snapshot with ${kept} posts`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
