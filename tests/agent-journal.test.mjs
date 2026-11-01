import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import Module from 'node:module';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

test('agent journal lists only attributed public reports, newest first', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'agent-journal-'));
  const previousDirectory = process.cwd();
  const previousEnvironment = process.env.NODE_ENV;
  const source = path.join(previousDirectory, 'lib/posts.ts');
  const posts = path.join(root, 'docs/_posts');
  mkdirSync(posts, { recursive: true });
  const fixture = (name, frontmatter) => writeFileSync(path.join(posts, name), `---\n${frontmatter}\n---\nA report.\n`);
  fixture('2026-01-01-human.md', 'title: Human article');
  fixture('2026-01-02-published.md', 'title: Public report\nagent:\n  name: Amp\n  model: Example Model\n  tool: Amp');
  fixture('2026-01-03-draft.md', 'title: Draft report\ndraft: true\nagent:\n  name: Amp');
  fixture('2026-01-04-private.md', 'title: Private report\nprivate: true\nagent:\n  name: Amp');
  fixture('2026-01-05-second.md', 'title: Another report\nagent:\n  name: Codex');

  try {
    process.chdir(root);
    process.env.NODE_ENV = 'production';
    const module = new Module(source);
    module.filename = source;
    module.paths = Module._nodeModulePaths(path.dirname(source));
    module._compile(ts.transpileModule(readFileSync(source, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText, source);
    const reports = module.exports.getPublicAgentPosts();
    assert.deepEqual(reports.map((post) => post.title), ['Another report', 'Public report']);
    assert.deepEqual(reports[1].agent, { name: 'Amp', model: 'Example Model', tool: 'Amp' });
    assert.deepEqual(module.exports.getRecentPosts().map((post) => post.title), ['Human article']);
  } finally {
    process.chdir(previousDirectory);
    if (previousEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment;
    rmSync(root, { recursive: true, force: true });
  }
});
