import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function appleId(href) {
  const match = String(href).match(/\/id(\d+)/);
  return match ? match[1] : null;
}

export function applyVersions(records, lookup) {
  const kept = [];
  const missing = [];
  const apps = records.map((record) => {
    const id = appleId(record.href);
    const lookedUp = id ? lookup(id) : null;
    let version = record.version || null;
    if (lookedUp) {
      version = lookedUp;
    } else if (id && version) {
      kept.push(record.name);
    } else if (id) {
      missing.push(record.name);
    }
    const app = {
      name: record.name,
      pitch: record.description,
      platforms: record.platforms?.length ? record.platforms : ['iOS'],
      appStoreUrl: record.href,
    };
    if (version) app.version = version;
    return app;
  });
  return { apps, kept, missing };
}

export function publicAppsDocument(apps, asOf) {
  return {
    owner: 'Anupam Chugh',
    source: 'https://anupamchugh.github.io/apps/',
    asOf,
    apps,
  };
}

export function rememberVersions(records, versionsById) {
  let changed = false;
  for (const record of records) {
    const id = appleId(record.href);
    const version = id ? versionsById.get(id) : null;
    if (version && record.version !== version) {
      record.version = version;
      changed = true;
    }
  }
  return changed;
}

export function writePublicJson(directory, versionsById, asOf) {
  const resume = readFileSync(path.join(directory, 'content', 'resume.json'));
  writeFileSync(path.join(directory, 'public', 'resume.json'), resume);
  const records = JSON.parse(readFileSync(path.join(directory, 'content', 'apps.json'), 'utf8'));
  const result = applyVersions(records, (id) => versionsById.get(id) ?? null);
  const document = publicAppsDocument(result.apps, asOf);
  writeFileSync(path.join(directory, 'public', 'apps.json'), `${JSON.stringify(document, null, 2)}\n`);
  return result;
}

async function lookupVersion(id) {
  try {
    const response = await fetch(`https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const body = await response.json();
    const version = body.results?.[0]?.version;
    return typeof version === 'string' && version.length > 0 ? version : null;
  } catch {
    return null;
  }
}

function todayInIndia() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const records = JSON.parse(readFileSync(path.join(root, 'content', 'apps.json'), 'utf8'));
  const versionsById = new Map();
  for (const record of records) {
    const id = appleId(record.href);
    if (!id || versionsById.has(id)) continue;
    const version = await lookupVersion(id);
    if (version) versionsById.set(id, version);
  }
  if (rememberVersions(records, versionsById)) {
    writeFileSync(path.join(root, 'content', 'apps.json'), `${JSON.stringify(records, null, 2)}\n`);
  }
  const { kept, missing } = writePublicJson(root, versionsById, todayInIndia());
  for (const name of kept) console.log(`kept last version for ${name}`);
  for (const name of missing) console.log(`no stored version for ${name}`);
  console.log(`public json written, ${versionsById.size} store versions looked up`);
}
