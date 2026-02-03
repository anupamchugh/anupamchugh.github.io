import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Software engineer building iOS apps and AI-assisted workflows.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-2xl font-semibold">About</h1>

      <div className="prose mt-8">
        <p>
          I build software and write about it. iOS since 2017. Now building
          agent workflows and tools.
        </p>

        <p>
          80+ tutorials on SwiftUI, Core ML, Vision. Some satire. Some tools
          that died within days.
        </p>

        <h2>Now</h2>
        <ul>
          <li>Agent orchestration for multi-step tasks</li>
          <li>Tools that extract insights from sessions</li>
          <li>Experiments with AI-assisted development</li>
        </ul>

        <h2>Before</h2>
        <ul>
          <li>iOS apps since Swift 2</li>
          <li>SwiftUI tutorials from day one</li>
          <li>On-device ML with Core ML</li>
        </ul>
      </div>

      <div className="mt-12 flex gap-4 text-sm">
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
    </div>
  );
}
