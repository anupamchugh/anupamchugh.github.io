import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { scanDirectory, scanText } from '../script/scan-export.mjs';

// Fake values, assembled here so no secret-shaped literal sits in the source.
const fakeBotToken = `${'1234567890'}:${'A'.repeat(35)}`;
const fakeOpenAiKey = `${'sk'}-${'a1'.repeat(20)}`;
const fakeGithubToken = `${'ghp'}_${'b2'.repeat(20)}`;
const fakePat = `${'github_pat'}_${'c3'.repeat(20)}`;
const fakeAws = `${'AKIA'}${'D4'.repeat(8)}`;
const fakeKeyHeader = `-----BEGIN ${'RSA'} PRIVATE KEY-----`;
const fakeXai = `${'xai'}-${'A1'.repeat(20)}`;
const fakeGoogle = `${'AIza'}${'Sy'.repeat(17)}Q`;
const fakeStripe = `${'sk'}_${'live'}_${'a1B2'.repeat(5)}`;
const fakeStripeRestricted = `${'rk'}_${'live'}_${'c3D4'.repeat(5)}`;
const fakeSlack = `${'xox'}b-${'1234567890'}-${'abcdefghij'}`;
const fakeJwt = `${'eyJ'}${'hbGciOiJIUzI1NiJ9'}.${'eyJ'}${'zdWIiOiIxMjM0NTY3'}.${'sig'.repeat(5)}`;
const fakeNpm = `${'npm'}_${'a1'.repeat(18)}`;
const scanner = path.join(process.cwd(), 'script', 'scan-export.mjs');
const checker = path.join(process.cwd(), 'script', 'check-export.sh');

function exportWith(files) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'export-scan-'));
  for (const [name, content] of Object.entries(files)) {
    const full = path.join(directory, name);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  return directory;
}

test('each secret shape is named by rule', () => {
  assert.deepEqual(scanText('fetch("https://api.telegram.org/bot/sendMessage")'), ['telegram api host']);
  assert.deepEqual(scanText(`var t = "${fakeBotToken}";`), ['telegram bot token']);
  assert.deepEqual(scanText(`/bot${fakeBotToken}/send`), ['telegram bot token']);
  assert.deepEqual(scanText(fakeOpenAiKey), ['openai-style key']);
  assert.deepEqual(scanText(fakeGithubToken), ['github token']);
  assert.deepEqual(scanText(fakePat), ['github fine-grained token']);
  assert.deepEqual(scanText(fakeAws), ['aws access key id']);
  assert.deepEqual(scanText(fakeKeyHeader), ['private key header']);
});

test('ordinary page text is clean', () => {
  const page = '<a href="https://apps.apple.com/us/app/rifflet/id6767064984">Rifflet</a> 12:30 task-list disk-usage sk-a';
  assert.deepEqual(scanText(page), []);
});

test('hits report paths and rules, never values', () => {
  const directory = exportWith({
    'index.html': '<p>hello</p>',
    'showcase/index.html': `<script>var t = "${fakeBotToken}"; fetch("https://api.telegram.org/x")</script>`,
    '_next/static/chunks/app/about/page-1.js': `const k = "${fakeGithubToken}";`,
  });
  try {
    const { scanned, hits } = scanDirectory(directory);
    assert.equal(scanned, 3);
    assert.deepEqual(
      hits.map((hit) => `${hit.file} ${hit.rule}`).sort(),
      [
        `_next/static/chunks/app/about/page-1.js github token`,
        `showcase/index.html telegram api host`,
        `showcase/index.html telegram bot token`,
      ].sort(),
    );
    for (const hit of hits) {
      assert.deepEqual(Object.keys(hit).sort(), ['file', 'rule']);
      assert.ok(!JSON.stringify(hit).includes(fakeBotToken));
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('a clean export passes and media files are skipped', () => {
  const directory = exportWith({ 'index.html': '<p>ok</p>', 'img/a.png': fakeBotToken });
  try {
    const { scanned, hits } = scanDirectory(directory);
    assert.equal(scanned, 1);
    assert.deepEqual(hits, []);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('a missing or empty export is an error, not a pass', () => {
  assert.throws(() => scanDirectory(path.join(os.tmpdir(), 'export-scan-does-not-exist')), /nothing to scan/);
  const directory = exportWith({ 'img/a.png': 'x' });
  try {
    assert.throws(() => scanDirectory(directory), /no scannable files/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('more key shapes are named by rule', () => {
  assert.deepEqual(scanText(`key=${fakeXai}`), ['xai key']);
  assert.deepEqual(scanText(`"apiKey":"${fakeGoogle}"`), ['google api key']);
  assert.deepEqual(scanText(fakeStripe), ['stripe live key']);
  assert.deepEqual(scanText(fakeStripeRestricted), ['stripe live key']);
  assert.deepEqual(scanText(fakeSlack), ['slack token']);
  assert.deepEqual(scanText(`Authorization: ${fakeJwt}`), ['jwt']);
  assert.deepEqual(scanText(`//registry.npmjs.org/:_authToken=${fakeNpm}`), ['npm token']);
});

test('text that only looks a little like a key is clean', () => {
  assert.deepEqual(scanText('taxai-report AIzaShort sk_test_abcdefghijklmnop xoxo-love eyJ-only npm_install'), []);
});

function linkedRun(planted) {
  const base = mkdtempSync(path.join(os.tmpdir(), 'export-scan-link-'));
  const real = exportWith({ 'index.html': planted });
  const scriptLink = path.join(base, 'script-link');
  const outLink = path.join(base, 'out-link');
  symlinkSync(path.dirname(scanner), scriptLink);
  symlinkSync(real, outLink);
  try {
    return spawnSync(process.execPath, [path.join(scriptLink, 'scan-export.mjs'), outLink], { encoding: 'utf8' });
  } finally {
    unlinkSync(scriptLink);
    unlinkSync(outLink);
    rmSync(base, { recursive: true, force: true });
    rmSync(real, { recursive: true, force: true });
  }
}

test('run through a symlinked script and folder, a planted token still stops the scan', () => {
  const run = linkedRun(`<script>var t = "${fakeBotToken}";</script>`);
  assert.equal(run.status, 1, `stdout: ${run.stdout} stderr: ${run.stderr}`);
  assert.match(run.stderr, /index\.html \(telegram bot token\)/);
  assert.ok(!(run.stdout + run.stderr).includes(fakeBotToken));
});

test('run through a symlinked script and folder, a clean export says how many files it checked', () => {
  const run = linkedRun('<p>ok</p>');
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /^export scan clean: 1 files checked/);
});

test('a symlink inside the export is an error, not a skipped entry', () => {
  const directory = exportWith({ 'index.html': '<p>ok</p>', 'real/secret.txt': fakeBotToken });
  symlinkSync(path.join(directory, 'real'), path.join(directory, 'folder-link'));
  try {
    assert.throws(() => scanDirectory(directory), /folder-link.*not a regular file or folder/);
    unlinkSync(path.join(directory, 'folder-link'));
    symlinkSync(path.join(directory, 'real', 'secret.txt'), path.join(directory, 'file-link.html'));
    assert.throws(() => scanDirectory(directory), /file-link\.html.*not a regular file or folder/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('a named pipe inside the export is an error', (t) => {
  const directory = exportWith({ 'index.html': '<p>ok</p>' });
  try {
    if (spawnSync('mkfifo', [path.join(directory, 'pipe')]).status !== 0) return t.skip('mkfifo is not available');
    assert.throws(() => scanDirectory(directory), /pipe.*not a regular file or folder/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

function check(files, env = {}) {
  const directory = exportWith(files);
  try {
    return spawnSync('bash', [checker, directory], { encoding: 'utf8', env: { ...process.env, ...env } });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('check-export passes a clean export and says how many files it checked', () => {
  const run = check({ 'index.html': '<p>ok</p>', 'css/a.css': 'a{}' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /^export scan clean: 2 files checked/m);
});

test('check-export stops on a hit', () => {
  const run = check({ 'index.html': `var k = "${fakeGoogle}";` });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /index\.html \(google api key\)/);
});

test('check-export stops when the scanner exits 0 without saying a file was checked', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'export-scan-silent-'));
  const silent = path.join(directory, 'silent.mjs');
  writeFileSync(silent, '// exits 0 and prints nothing, like a scan that never ran\n');
  try {
    const run = check({ 'index.html': `var t = "${fakeBotToken}";` }, { EXPORT_SCANNER: silent });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /did not report/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('check-export stops on private files of every kind', () => {
  for (const name of ['.env', '.env.local', 'AuthKey_ABC123.p8', 'signing.p12', 'cert.pem', 'private-notes/a.html']) {
    const run = check({ 'index.html': '<p>ok</p>', [name]: 'x' });
    assert.equal(run.status, 1, name);
    assert.match(run.stderr, /private file/, name);
  }
});
