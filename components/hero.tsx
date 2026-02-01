import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/content';

export default function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      {/* Name */}
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {siteConfig.name}
      </h1>

      {/* Tagline */}
      <p className="mt-4 text-xl text-slate-400">
        I build apps and write about them. Sometimes funny.
      </p>

      {/* Bio */}
      <p className="mt-6 text-lg leading-relaxed text-slate-300">
        iOS developer exploring SwiftUI, Core ML, and everything Apple.
        I write technical tutorials and occasionally satirical takes on tech.
      </p>

      {/* Links */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/posts/"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500"
        >
          Read the blog
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/about/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
        >
          About me
        </Link>
      </div>

      {/* Social links */}
      <div className="mt-8 flex gap-6 text-sm text-slate-500">
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
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-300"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
