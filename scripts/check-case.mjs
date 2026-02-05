import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(root, '..');

const configPath = path.join(repoRoot, 'lib', 'content.ts');
const configSource = await readFile(configPath, 'utf8');

const caseStyleMatch = configSource.match(/caseStyle:\s*"(lowercase|sentence|both)"/);
if (!caseStyleMatch) {
  throw new Error('caseStyle not found in lib/content.ts');
}

const caseStyle = caseStyleMatch[1];
if (caseStyle === 'both') {
  console.log('case style check skipped (mode: both)');
  process.exit(0);
}

const targets = [
  'components/header.tsx',
  'components/footer.tsx',
  'components/hero.tsx',
  'app/page.tsx',
  'app/notes/page.tsx',
  'app/posts/page.tsx',
  'app/projects/page.tsx',
  'app/not-found.tsx',
  'app/posts/[slug]/page.tsx',
  'lib/content.ts',
].map((file) => path.join(repoRoot, file));

const forbiddenSentence = [
  '"Home"', "'Home'",
  '"Writing"', "'Writing'",
  '"About"', "'About'",
  '"Notes"', "'Notes'",
  '"Projects"', "'Projects'",
  '"All posts"', "'All posts'",
  '"GitHub"', "'GitHub'",
  '"LinkedIn"', "'LinkedIn'",
  '"RSS"', "'RSS'",
  '"Today I learned"', "'Today I learned'",
  '"Page not found"', "'Page not found'",
];

const forbiddenLowercase = [
  '"home"', "'home'",
  '"writing"', "'writing'",
  '"about"', "'about'",
  '"notes"', "'notes'",
  '"projects"', "'projects'",
  '"all posts"', "'all posts'",
  '"github"', "'github'",
  '"linkedin"', "'linkedin'",
  '"rss"', "'rss'",
  '"today i learned"', "'today i learned'",
  '"page not found"', "'page not found'",
];

const forbidden = caseStyle === 'lowercase' ? forbiddenSentence : forbiddenLowercase;
const sources = await Promise.all(targets.map((file) => readFile(file, 'utf8')));

let failures = 0;
for (const [index, source] of sources.entries()) {
  for (const token of forbidden) {
    if (source.includes(token)) {
      failures++;
      console.error(`${path.basename(targets[index])} contains ${token}`);
    }
  }
}

if (failures > 0) {
  throw new Error(`case style violations: ${failures}`);
}

console.log(`case style check passed (${caseStyle})`);
