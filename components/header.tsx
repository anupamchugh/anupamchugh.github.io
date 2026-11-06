'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';
import { navItems } from '@/lib/content';

const primary = navItems.filter((item) => ['/work/', '/posts/', '/about/', '/resume/'].includes(item.href));
const more = navItems.filter((item) => !primary.includes(item));

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 text-sm text-secondary">
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/" className="shrink-0 font-semibold text-primary hover:no-underline">anupam chugh</Link>
            {primary.map((item) => <Link key={item.href} href={item.href} className="hover:text-primary">{item.label}</Link>)}
            <details className="relative">
              <summary className="cursor-pointer hover:text-primary">more</summary>
              <div className="absolute left-0 top-full z-50 mt-2 grid min-w-40 gap-1 rounded-xl border border-border bg-[var(--bg-secondary)] p-2 shadow-xl">
                {more.map((item) => <a key={item.href} href={item.href} className="rounded-lg px-3 py-2 hover:bg-[var(--bg-tertiary)] hover:text-primary">{item.label}</a>)}
              </div>
            </details>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
