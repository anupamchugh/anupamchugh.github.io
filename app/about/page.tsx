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
          I'm a software engineer who builds things and writes about them.
          Started with iOS apps in 2017, now exploring how AI agents can
          augment development workflows.
        </p>

        <p>
          Most of my recent work involves building tools that help me think—task
          management systems, trading signal processors, and workflows that turn
          debugging sessions into tutorials.
        </p>

        <p>
          I've written 80+ tutorials on SwiftUI, Core ML, and Vision. Sometimes
          I write satire about the tech industry. Occasionally I build tools
          that become obsolete within days.
        </p>

        <h2>What I'm working on</h2>
        <ul>
          <li>AI-assisted trading workflows with real-time signals</li>
          <li>Agent orchestration patterns for multi-step tasks</li>
          <li>Tools that help extract insights from conversations</li>
          <li>SwiftUI components and iOS development patterns</li>
        </ul>

        <h2>Previously</h2>
        <ul>
          <li>Built iOS apps professionally since Swift 2</li>
          <li>Early SwiftUI adopter, writing tutorials from beta</li>
          <li>Created Core ML tutorials for on-device ML</li>
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
