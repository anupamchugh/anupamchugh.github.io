import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Rules are named so the report can say what matched without printing the value.
export const rules = [
  { name: 'telegram api host', pattern: /api\.telegram\.org/ },
  { name: 'telegram bot token', pattern: /(?<![0-9])[0-9]{8,12}:[A-Za-z0-9_-]{30,}/ },
  { name: 'openai-style key', pattern: /(?<![A-Za-z0-9])sk-[A-Za-z0-9_-]{20,}/ },
  { name: 'github token', pattern: /\bgh[pousr]_[A-Za-z0-9]{30,}/ },
  { name: 'github fine-grained token', pattern: /\bgithub_pat_[A-Za-z0-9_]{30,}/ },
  { name: 'aws access key id', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'private key header', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'xai key', pattern: /(?<![A-Za-z0-9])xai-[A-Za-z0-9]{20,}/ },
  { name: 'google api key', pattern: /(?<![A-Za-z0-9])AIza[0-9A-Za-z_-]{35}/ },
  { name: 'stripe live key', pattern: /(?<![A-Za-z0-9])[sr]k_live_[0-9A-Za-z]{16,}/ },
  { name: 'slack token', pattern: /(?<![A-Za-z0-9])xox[abprs]-[0-9A-Za-z-]{10,}/ },
  { name: 'jwt', pattern: /(?<![A-Za-z0-9_-])eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}/ },
  { name: 'npm token', pattern: /(?<![A-Za-z0-9])npm_[A-Za-z0-9]{30,}/ },
];

// Media and fonts are not scanned for text patterns: random bytes only cause false hits.
const mediaExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.mov', '.pdf',
]);

// A symlink, pipe, socket or device cannot be scanned the way the publish will copy it, so each one stops the scan.
function* walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
    else throw new Error(`${full} is not a regular file or folder`);
  }
}

export function scanText(text) {
  return rules.filter((rule) => rule.pattern.test(text)).map((rule) => rule.name);
}

// Returns file paths and rule names only. Any unreadable file is an error, not a pass.
export function scanDirectory(directory) {
  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    throw new Error(`nothing to scan at ${directory}`);
  }
  const hits = [];
  let scanned = 0;
  for (const file of walk(directory)) {
    if (mediaExtensions.has(path.extname(file).toLowerCase())) continue;
    const text = readFileSync(file, 'latin1');
    scanned += 1;
    for (const name of scanText(text)) {
      hits.push({ file: path.relative(directory, file), rule: name });
    }
  }
  if (scanned === 0) throw new Error(`no scannable files in ${directory}`);
  return { scanned, hits };
}

// Compare real paths: import.meta.url is already resolved, so a run through a symlink must be resolved too.
function realpathOrNull(file) {
  try {
    return realpathSync(file);
  } catch {
    return null;
  }
}

const isDirectRun = Boolean(process.argv[1]) && realpathOrNull(path.resolve(process.argv[1])) === realpathOrNull(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const directory = path.resolve(process.argv[2] ?? path.join(root, 'out'));
  let result;
  try {
    result = scanDirectory(directory);
  } catch (error) {
    console.error(`stopping: the export scan could not run: ${error.message}`);
    process.exit(2);
  }
  for (const hit of result.hits) console.error(`secret-shaped text: ${hit.file} (${hit.rule})`);
  if (result.hits.length > 0) {
    console.error(`stopping: ${result.hits.length} secret-shaped match(es) in the export. Values are not printed.`);
    process.exit(1);
  }
  console.log(`export scan clean: ${result.scanned} files checked`);
}
