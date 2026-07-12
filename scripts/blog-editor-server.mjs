#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const port = Number(process.env.BLOG_EDITOR_PORT || 3147);
const allowedRoots = [
  path.join(root, 'docs/_posts'),
  path.join(root, 'private-notes'),
];

function send(res, status, body) {
  res.writeHead(status, {
    'access-control-allow-origin': 'http://127.0.0.1:3000',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'content-type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(body));
}

function resolveSafePath(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    throw new Error('missing path');
  }

  const fullPath = path.resolve(root, relativePath);
  const isAllowedRoot = allowedRoots.some((allowedRoot) => {
    const relative = path.relative(allowedRoot, fullPath);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  });

  if (!isAllowedRoot || path.extname(fullPath) !== '.md') {
    throw new Error('path is outside editable markdown folders');
  }

  return fullPath;
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function handle(req, res) {
  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });

  const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      return send(res, 200, { ok: true, root });
    }

    if (req.method === 'GET' && url.pathname === '/file') {
      const sourcePath = url.searchParams.get('path');
      const fullPath = resolveSafePath(sourcePath);
      const content = await fs.readFile(fullPath, 'utf8');
      return send(res, 200, { ok: true, path: sourcePath, content });
    }

    if (req.method === 'POST' && url.pathname === '/file') {
      const body = await readJson(req);
      const fullPath = resolveSafePath(body.path);
      if (typeof body.content !== 'string') throw new Error('missing content');
      await fs.writeFile(fullPath, body.content, 'utf8');
      return send(res, 200, { ok: true, path: body.path });
    }

    if (req.method === 'POST' && url.pathname === '/publish') {
      const body = await readJson(req);
      const fullPath = resolveSafePath(body.path);
      const raw = await fs.readFile(fullPath, 'utf8');
      const parsed = matter(raw);
      parsed.data.draft = false;
      parsed.data.published = true;
      await fs.writeFile(fullPath, matter.stringify(parsed.content, parsed.data), 'utf8');
      return send(res, 200, { ok: true, path: body.path });
    }

    return send(res, 404, { ok: false, error: 'not found' });
  } catch (error) {
    return send(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => send(res, 500, { ok: false, error: String(error) }));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`blog editor server listening on http://127.0.0.1:${port}`);
});
