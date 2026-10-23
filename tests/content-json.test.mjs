import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { applyVersions, rememberVersions } from '../script/sync-public-json.mjs';

const root = process.cwd();

function contentApps() {
  return JSON.parse(readFileSync(path.join(root, 'content', 'apps.json'), 'utf8'));
}

test('a failed store lookup keeps the last version and says which app', () => {
  const records = [
    {
      name: 'Rifflet',
      description: 'a lesson',
      href: 'https://apps.apple.com/us/app/rifflet/id6767064984',
      platforms: ['iOS'],
      version: '1.5',
    },
    {
      name: 'Flyleaf Notes',
      description: 'a desk',
      href: 'https://apps.apple.com/us/app/flyleaf-notes/id6764307755',
      platforms: ['iOS'],
      version: '1.0',
    },
    {
      name: 'Pastport',
      description: 'history',
      href: 'https://github.com/anupamchugh/pastport/releases/latest',
      platforms: ['macOS'],
    },
  ];
  const { apps, kept, missing } = applyVersions(records, (id) => (id === '6767064984' ? '9.9' : null));
  assert.equal(apps[0].version, '9.9');
  assert.equal(apps[0].pitch, 'a lesson');
  assert.equal(apps[1].version, '1.0');
  assert.deepEqual(kept, ['Flyleaf Notes']);
  assert.equal(apps[2].version, undefined);
  assert.deepEqual(missing, []);
  assert.deepEqual(apps[2].platforms, ['macOS']);
});

test('a successful lookup becomes the last stored version', () => {
  const records = [{ name: 'Rifflet', href: 'https://apps.apple.com/us/app/rifflet/id6767064984', version: '1.5' }];
  const changed = rememberVersions(records, new Map([['6767064984', '1.6']]));
  assert.equal(changed, true);
  assert.equal(records[0].version, '1.6');
  assert.equal(rememberVersions(records, new Map([['6767064984', '1.6']])), false);
});

test('an app with no last version is named when lookup fails', () => {
  const { missing } = applyVersions(
    [{ name: 'Orbits', description: 'trips', href: 'https://apps.apple.com/us/app/find-common-ground/id6759101340', platforms: ['iOS'] }],
    () => null,
  );
  assert.deepEqual(missing, ['Orbits']);
});

test('published resume and apps match the content files', () => {
  const resume = JSON.parse(readFileSync(path.join(root, 'content', 'resume.json'), 'utf8'));
  const publishedResume = JSON.parse(readFileSync(path.join(root, 'public', 'resume.json'), 'utf8'));
  assert.deepEqual(publishedResume, resume);

  const publishedApps = JSON.parse(readFileSync(path.join(root, 'public', 'apps.json'), 'utf8'));
  const byName = new Map(publishedApps.apps.map((app) => [app.name, app]));
  for (const app of contentApps()) {
    const published = byName.get(app.name);
    assert.ok(published, app.name);
    assert.equal(published.pitch, app.description);
    assert.equal(published.appStoreUrl, app.href);
    assert.deepEqual(published.platforms, app.platforms);
    if (app.version) assert.equal(typeof published.version, 'string');
  }
});

test('the built apps page lists every content app', () => {
  const html = readFileSync(path.join(root, 'out', 'apps', 'index.html'), 'utf8');
  for (const app of contentApps()) {
    assert.ok(html.includes(app.name), app.name);
  }
});
