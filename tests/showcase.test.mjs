import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const showcase = path.join(root, 'public', 'showcase');
const page = readFileSync(path.join(showcase, 'index.html'), 'utf8');
const provenance = JSON.parse(readFileSync(path.join(root, 'tools', 'showcase', 'provenance.json'), 'utf8')).images;
const apps = JSON.parse(readFileSync(path.join(root, 'content', 'apps.json'), 'utf8'));

function allFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? allFiles(path.join(directory, entry.name)) : [path.join(directory, entry.name)],
  );
}

test('every published image has a source and a date in the provenance list, and nothing else does', () => {
  const published = readdirSync(path.join(showcase, 'img')).sort();
  assert.deepEqual(published, Object.keys(provenance).sort());
  for (const [name, entry] of Object.entries(provenance)) {
    assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/, `${name} needs a date`);
    assert.ok(entry.source && entry.kind && entry.date_basis, `${name} needs source, kind and date_basis`);
  }
});

test('every image the page uses is published, and every published image is used', () => {
  const used = new Set([...page.matchAll(/img\/([\w.-]+\.webp)/g)].map((match) => match[1]));
  assert.deepEqual([...used].sort(), readdirSync(path.join(showcase, 'img')).sort());
});

test('the provenance list stays out of the published files, and no local path is published', () => {
  const files = allFiles(showcase);
  assert.equal(files.filter((file) => file.endsWith('.json')).length, 0);
  for (const file of files.filter((name) => /\.(html|css|js)$/.test(name))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /\/Users\/|\/private\/tmp|scratch-workspaces/, file);
  }
});

test('every in-repo source named in the provenance list exists', () => {
  for (const [name, entry] of Object.entries(provenance)) {
    if (!entry.frozen) assert.ok(existsSync(path.join(root, entry.source)), `${name}: ${entry.source}`);
  }
});

test('the page uses the App Store names and links from the app list', () => {
  for (const app of apps) {
    assert.ok(page.includes(`href="${app.href}"`), `${app.name} link`);
  }
  for (const stale of ['ClocktowerTable', 'Playlist Hunter', 'playlist-hunter/id', '/app/find-common-ground/']) {
    assert.ok(!page.includes(stale), `${stale} is an old store name or link`);
  }
});

test('Work with me is a mailto link that opens a dialog, and the page makes no network request of its own', () => {
  assert.match(page, /class="dock" href="mailto:anupamchugh@gmail\.com/);
  assert.match(page, /role="dialog" aria-modal="true"/);
  const script = readFileSync(path.join(showcase, 'js', 'main.js'), 'utf8');
  assert.match(script, /window\.location\.href = "mailto:/);
  assert.match(script, /e\.key === "Escape"/);
  for (const text of [page, script]) {
    assert.doesNotMatch(text, /fetch\(|XMLHttpRequest|sendBeacon|api\.telegram/);
  }
});

test('Glint stays in development, with sample data labelled and no order claims', () => {
  assert.match(page, /Orders stay locked/);
  assert.match(page, /Sample data/);
  assert.doesNotMatch(page, /Glint[^<]{0,80}(on the App Store|download)/i);
});
