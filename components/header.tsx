'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <div className="flex gap-4 text-sm text-tertiary">
          <Link href="/" className="hover:text-primary">home</Link>
          <Link href="/posts/" className="hover:text-primary">writing</Link>
          <Link href="/about/" className="hover:text-primary">about</Link>
        </div>
      </nav>
    </header>
  );
}
