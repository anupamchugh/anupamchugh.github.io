import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const exportDir =
  '/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324-2/posts';
const postsDir = path.join(process.cwd(), 'docs/_posts');

const sources = [
  '2020-08-15_Epic-Games-Baits-Apple-To-Pull-Off-The-Biggest-Marketing-Campaign-In-Recent-History-618f1b4790d9.html',
  '2020-11-25_Apple-Is-Crushing-Deep-Links-That-Were-Used-As-Ad-Tracking-Devices-807d3b889061.html',
  '2021-02-02_Facebook-Is-Gaslighting-Users-Into-Allowing-Ad-Tracking-on-iOS-14-7df7dd3f7359.html',
  '2021-02-26_Apple-vs--Facebook-Isn-t-Just-a-Matter-of-Privacy---But-Opposing-Business-Philosophies-cd7a2d443962.html',
  '2021-04-30_Mark-Zuckerberg-vs--Tim-Cook-Feud--A-War-of-Words-Over-iOS-14-s-App-Tracking-Transparency-c94b8ced709d.html',
  '2022-01-13_Big-Tech-s-2021-Year-Recap-63f6b21c2990.html',
];

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/ /g, ' ')
    .trim();
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' '));
}

function yamlString(value) {
  return JSON.stringify(value);
}

function slugFromTitle(title) {
  return title
    .replace(/[’‘]/g, "'")
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractFirst(pattern, html) {
  const match = html.match(pattern);
  return match ? match[1] : '';
}

for (const sourceFile of sources) {
  const sourcePath = path.join(exportDir, sourceFile);
  const html = fs.readFileSync(sourcePath, 'utf8');

  const title = stripTags(
    extractFirst(/<h1[^>]*class="[^"]*\bp-name\b[^"]*"[^>]*>([\s\S]*?)<\/h1>/, html) ||
      extractFirst(/<h3[^>]*class="[^"]*\bgraf--title\b[^"]*"[^>]*>([\s\S]*?)<\/h3>/, html)
  );
  const subtitle = stripTags(
    extractFirst(/<h4[^>]*class="[^"]*\bgraf--subtitle\b[^"]*"[^>]*>([\s\S]*?)<\/h4>/, html)
  );
  const published = extractFirst(/<time[^>]*class="[^"]*\bdt-published\b[^"]*"[^>]*datetime="([^"]+)"/, html);
  const canonical = extractFirst(/<a[^>]*href="([^"]+)"[^>]*class="[^"]*\bp-canonical\b[^"]*"/, html);
  const date = published.slice(0, 10) || sourceFile.slice(0, 10);
  const slug = slugFromTitle(title);
  const outputFile = `${date}-${slug}.md`;
  const outputPath = path.join(postsDir, outputFile);

  let articleHtml = extractFirst(/<article[^>]*>([\s\S]*?)<footer>/, html);
  articleHtml = articleHtml
    .replace(/<h1[^>]*class="[^"]*\bp-name\b[^"]*"[^>]*>[\s\S]*?<\/h1>/, '')
    .replace(/<h3[^>]*class="[^"]*\bgraf--title\b[^"]*"[^>]*>[\s\S]*?<\/h3>/, '');

  const markdown = execFileSync('pandoc', ['-f', 'html', '-t', 'gfm'], {
    input: articleHtml,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    subtitle ? `description: ${yamlString(subtitle)}` : '',
    `date: ${yamlString(published || `${date}T00:00:00.000Z`)}`,
    'categories:',
    '  - platform',
    '  - medium-import',
    'keywords:',
    '  - apple',
    '  - privacy',
    '  - big-tech',
    'draft: true',
    'source: medium-export',
    `source_file: ${yamlString(sourceFile)}`,
    canonical ? `canonical_url: ${yamlString(decodeHtml(canonical))}` : '',
    `slug: ${yamlString(`/${slug.toLowerCase()}`)}`,
    '---',
    '',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  if (fs.existsSync(outputPath)) {
    console.log(`skip existing ${outputFile}`);
    continue;
  }

  fs.writeFileSync(outputPath, `${frontmatter}${markdown}\n`);
  console.log(`imported ${outputFile}`);
}
