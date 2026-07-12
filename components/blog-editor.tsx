'use client';

import { useMemo, useState } from 'react';

type EditablePost = {
  slug: string;
  title: string;
  date: string;
  sourcePath: string;
  draft?: boolean;
};

type SaveState = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const editorBaseUrl = 'http://127.0.0.1:3147';

export default function BlogEditor({ posts }: { posts: EditablePost[] }) {
  const [selectedPath, setSelectedPath] = useState(posts[0]?.sourcePath || '');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<SaveState>('idle');
  const [message, setMessage] = useState('start the local editor server, then open a file.');

  const selectedPost = useMemo(
    () => posts.find((post) => post.sourcePath === selectedPath),
    [posts, selectedPath],
  );

  async function loadFile(path: string) {
    setSelectedPath(path);
    setStatus('loading');
    setMessage('loading markdown...');

    try {
      const response = await fetch(`${editorBaseUrl}/file?path=${encodeURIComponent(path)}`);
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'could not load file');
      setContent(data.content);
      setStatus('idle');
      setMessage('editing local markdown. save writes to the repo.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function writeFile(nextMessage = 'saved to repo. refresh the post page to see the change.') {
    if (!selectedPath) return false;
    setStatus('saving');
    setMessage('saving markdown...');

    const response = await fetch(`${editorBaseUrl}/file`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: selectedPath, content }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || 'could not save file');
    setStatus('saved');
    setMessage(nextMessage);
    return true;
  }

  async function saveFile() {
    try {
      await writeFile();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function publishFile() {
    if (!selectedPath) return;
    setStatus('saving');
    setMessage('publishing markdown...');

    try {
      await writeFile('saved before publishing.');
      const response = await fetch(`${editorBaseUrl}/publish`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: selectedPath }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'could not publish file');
      setStatus('saved');
      setMessage('marked published. review it, then commit and push manually.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
      <aside className="border-t border-border pt-5">
        <div className="space-y-3">
          {posts.map((post) => (
            <button
              key={post.sourcePath}
              type="button"
              onClick={() => loadFile(post.sourcePath)}
              className={`block w-full border-b border-border pb-3 text-left text-sm ${
                post.sourcePath === selectedPath ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              <span className="block font-medium">{post.title}</span>
              <span className="mt-1 block text-xs text-tertiary">
                {post.draft ? 'draft' : 'public'} · {post.date.slice(0, 10)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <div className="min-w-0 text-sm">
            <p className="font-medium text-primary">{selectedPost?.title || 'select a post'}</p>
            {selectedPath && <p className="break-all text-xs text-tertiary">{selectedPath}</p>}
          </div>
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={() => selectedPath && loadFile(selectedPath)}
              className="text-primary hover:underline underline-offset-4"
            >
              load
            </button>
            <button
              type="button"
              onClick={saveFile}
              className="text-primary hover:underline underline-offset-4"
            >
              save
            </button>
            <button
              type="button"
              onClick={publishFile}
              className="text-primary hover:underline underline-offset-4"
            >
              publish
            </button>
          </div>
        </div>

        <p className={`mt-3 text-xs ${status === 'error' ? 'text-red-500' : 'text-tertiary'}`}>
          {message}
        </p>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          spellCheck
          className="mt-5 min-h-[70vh] w-full resize-y border border-border bg-secondary p-4 font-mono text-sm leading-6 text-primary outline-none"
          placeholder="load a post to edit its markdown"
        />
      </section>
    </div>
  );
}
