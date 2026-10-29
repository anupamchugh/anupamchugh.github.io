'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';
import { navItems } from '@/lib/content';

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 text-sm text-secondary">
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/" className="shrink-0 font-semibold text-primary hover:no-underline">anupam chugh</Link>
            {navItems.map((item) => item.href === '/showcase/' ? (
              <a key={item.href} href={item.href} className="hover:text-primary">{item.label}</a>
            ) : (
              <Link key={item.href} href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
