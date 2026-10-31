import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { findListingDrift, findNameLinkMismatch, hrefSlug, storeSlug } from '../script/check-store-listings.mjs';

const root = process.cwd();

function contentApps() {
  return JSON.parse(readFileSync(path.join(root, 'content', 'apps.json'), 'utf8'));
}

function record(name, href, status = 'live') {
  return { name, href, status };
}

function listing(trackName, trackViewUrl) {
  return { trackName, trackViewUrl };
}

test('every App Store link is the link the store builds from the app name', () => {
  assert.deepEqual(findNameLinkMismatch(contentApps()), []);
});

test('a name that no longer fits its link is reported', () => {
  const stale = [
    record('EchoHunt', 'https://apps.apple.com/in/app/playlist-hunter/id6756028972'),
    record('Orbits', 'https://apps.apple.com/us/app/find-common-ground/id6759101340'),
  ];
  const problems = findNameLinkMismatch(stale);
  assert.equal(problems.length, 2);
  assert.match(problems[0], /EchoHunt links to \/app\/playlist-hunter\//);
});

test('store slugs follow the store rules', () => {
  assert.equal(storeSlug('Orbits: Find Common Ground'), 'orbits-find-common-ground');
  assert.equal(storeSlug('getNod'), 'getnod');
  assert.equal(hrefSlug('https://apps.apple.com/us/app/quorion-table/id6761296328'), 'quorion-table');
  assert.equal(hrefSlug('https://github.com/anupamchugh/pastport/releases/latest'), null);
});

test('a renamed store listing is reported against the old name', () => {
  const listings = new Map([
    ['6761296328', listing('Quorion Table', 'https://apps.apple.com/us/app/quorion-table/id6761296328?uo=4')],
  ]);
  const problems = findListingDrift(
    [record('ClocktowerTable', 'https://apps.apple.com/us/app/clocktowertable/id6761296328')],
    listings,
  );
  assert.deepEqual(problems, [
    'ClocktowerTable is called Quorion Table on the App Store',
    'ClocktowerTable links to /app/clocktowertable/ but the store uses /app/quorion-table/',
  ]);
});

test('a live app with no public listing, and a listed app not marked live, are reported', () => {
  const listings = new Map([
    ['2', listing('Listed', 'https://apps.apple.com/us/app/listed/id2')],
  ]);
  const problems = findListingDrift(
    [
      record('Missing', 'https://apps.apple.com/us/app/missing/id1'),
      record('Listed', 'https://apps.apple.com/us/app/listed/id2', 'preview'),
      record('Pastport', 'https://github.com/anupamchugh/pastport/releases/latest'),
    ],
    listings,
  );
  assert.deepEqual(problems, [
    'Missing is marked live but the App Store has no public listing for 1',
    'Listed has a public App Store listing but is marked preview',
  ]);
});

test('an app that matches its listing has nothing to report', () => {
  const listings = new Map([
    ['6767064984', listing('Rifflet', 'https://apps.apple.com/us/app/rifflet/id6767064984?uo=4')],
  ]);
  assert.deepEqual(
    findListingDrift([record('Rifflet', 'https://apps.apple.com/us/app/rifflet/id6767064984')], listings),
    [],
  );
});
