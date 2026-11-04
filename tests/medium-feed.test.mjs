import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed, decode } from '../script/fetch-medium.mjs';

const xml = `<rss><channel>
<item><title><![CDATA[Every Wave is Not Your Wave]]></title>
<link>https://medium.com/@anupamchugh/every-wave-abc123?source=rss-1</link>
<pubDate>Tue, 14 Apr 2026 01:04:37 GMT</pubDate>
<content:encoded><![CDATA[<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/hero.jpeg" /></figure><p>Surfing taught me &amp; patience.</p><img src="https://medium.com/_/stat?event=post" />]]></content:encoded></item>
<item><title>No body</title><link>https://medium.com/p/xyz</link><pubDate>bad</pubDate><description>&lt;p&gt;Hi&lt;/p&gt;</description></item>
</channel></rss>`;

test('parses Medium items into previews', () => {
  const [a, b] = parseFeed(xml);
  assert.equal(a.title, 'Every Wave is Not Your Wave');
  assert.equal(a.link, 'https://medium.com/@anupamchugh/every-wave-abc123');
  assert.equal(a.date, '2026-04-14');
  assert.equal(a.image, 'https://cdn-images-1.medium.com/max/1024/hero.jpeg');
  assert.equal(a.excerpt, 'Surfing taught me & patience.');
  assert.equal(b.date, null);
  assert.equal(b.image, null);
  assert.equal(b.excerpt, 'Hi');
});

test('decodes numeric entities', () => {
  assert.equal(decode('It&#39;s &#x2014; ok'), "It's — ok");
});
