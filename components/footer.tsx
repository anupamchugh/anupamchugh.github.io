import Link from 'next/link';
import { siteConfig } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-tertiary sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}</p>
          <div className="flex gap-6">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              github
            </a>
            <a
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              x
            </a>
            <Link href="/rss.xml" className="hover:text-primary">
              rss
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
