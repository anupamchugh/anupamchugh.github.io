import Link from 'next/link';
import { siteConfig } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}</p>
          <div className="flex gap-6">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              GitHub
            </a>
            <a
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Twitter
            </a>
            <Link href="/rss.xml" className="hover:text-slate-300">
              RSS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
