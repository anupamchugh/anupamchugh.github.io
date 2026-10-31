import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appleId } from './sync-public-json.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function isStoreApp(record) {
  return String(record.href).startsWith('https://apps.apple.com/') && appleId(record.href) !== null;
}

export function storeSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function hrefSlug(href) {
  const match = String(href).match(/\/app\/([^/]+)\/id\d+/);
  return match ? match[1] : null;
}

// Offline: the displayed name and the link must tell the same story, because the
// store builds its link from the app name.
export function findNameLinkMismatch(records) {
  return records
    .filter(isStoreApp)
    .filter((record) => storeSlug(record.name) !== hrefSlug(record.href))
    .map((record) => `${record.name} links to /app/${hrefSlug(record.href)}/ but its name would give /app/${storeSlug(record.name)}/`);
}

// Online: listings maps an Apple id to the public store record (trackName, trackViewUrl).
export function findListingDrift(records, listings) {
  const problems = [];
  for (const record of records.filter(isStoreApp)) {
    const id = appleId(record.href);
    const listing = listings.get(id);
    if (!listing) {
      if (record.status === 'live') {
        problems.push(`${record.name} is marked live but the App Store has no public listing for ${id}`);
      }
      continue;
    }
    if (record.status !== 'live') {
      problems.push(`${record.name} has a public App Store listing but is marked ${record.status}`);
    }
    if (record.name !== listing.trackName) {
      problems.push(`${record.name} is called ${listing.trackName} on the App Store`);
    }
    const storeLink = hrefSlug(listing.trackViewUrl);
    if (hrefSlug(record.href) !== storeLink) {
      problems.push(`${record.name} links to /app/${hrefSlug(record.href)}/ but the store uses /app/${storeLink}/`);
    }
  }
  return problems;
}

async function lookupListings(ids) {
  const response = await fetch(`https://itunes.apple.com/lookup?id=${ids.join(',')}&country=us`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`store lookup answered ${response.status}`);
  const body = await response.json();
  return new Map(body.results.map((result) => [String(result.trackId), result]));
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const records = JSON.parse(readFileSync(path.join(root, 'content', 'apps.json'), 'utf8'));
  const storeApps = records.filter(isStoreApp);
  let listings;
  try {
    listings = await lookupListings(storeApps.map((record) => appleId(record.href)));
  } catch (error) {
    console.error(`could not read the public App Store, so nothing was checked: ${error.message}`);
    process.exit(2);
  }
  const problems = [...findNameLinkMismatch(records), ...findListingDrift(records, listings)];
  for (const problem of problems) console.error(problem);
  if (problems.length > 0) process.exit(1);
  console.log(`${storeApps.length} App Store apps match their public listings`);
}
