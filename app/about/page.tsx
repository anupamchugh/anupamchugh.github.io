import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'iOS Developer and Technical Writer.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-bold text-white">About</h1>

      <div className="prose mt-8">
        <p>
          I'm {siteConfig.name}, an iOS developer who builds apps and writes about them.
        </p>

        <p>
          I've been working with Swift since version 2 and have watched the Apple ecosystem
          evolve from UIKit to SwiftUI, from on-device ML experiments to production-ready
          Core ML models.
        </p>

        <h2>What I Write About</h2>
        <ul>
          <li><strong>SwiftUI</strong> — Tutorials from basics to advanced patterns</li>
          <li><strong>Core ML & Vision</strong> — On-device machine learning</li>
          <li><strong>iOS Features</strong> — Exploring new APIs as they launch</li>
          <li><strong>Satire</strong> — Humorous takes on the tech industry</li>
        </ul>

        <h2>Connect</h2>
        <ul>
          <li><a href={siteConfig.social.github}>GitHub</a></li>
          <li><a href={siteConfig.social.twitter}>Twitter</a></li>
          <li><a href={siteConfig.social.linkedin}>LinkedIn</a></li>
        </ul>
      </div>

      <div className="mt-12">
        <Link
          href="/posts/"
          className="text-sky-400 hover:text-sky-300"
        >
          ← Read my writing
        </Link>
      </div>
    </div>
  );
}
