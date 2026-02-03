import Link from 'next/link';
import { siteConfig } from '@/lib/content';

export default function Hero() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      {/* Name */}
      <h1 className="text-2xl font-semibold">
        {siteConfig.name}
      </h1>

      {/* Bio - conversational, like Brian Lovin */}
      <p className="mt-4 text-lg leading-relaxed text-secondary">
        I'm a software engineer building iOS apps and AI-assisted workflows.
        Currently exploring how agents can help with trading, writing, and tool orchestration.
      </p>

      {/* Social links - subtle, inline */}
      <div className="mt-4 flex gap-4 text-sm">
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tertiary hover:text-primary transition-colors"
        >
          GitHub
        </a>
        <a
          href={siteConfig.social.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tertiary hover:text-primary transition-colors"
        >
          X
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tertiary hover:text-primary transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
