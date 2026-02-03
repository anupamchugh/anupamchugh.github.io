import { Metadata } from 'next';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Software engineer.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <div className="prose">
        <p>
          I build software and write about it.
        </p>
        <p>
          iOS since 2017. 80+ tutorials on SwiftUI, Core ML, Vision.
          Now building agent workflows.
        </p>
        <p>
          <a href={siteConfig.social.github}>github</a>
          {' · '}
          <a href={siteConfig.social.twitter}>x</a>
          {' · '}
          <a href={siteConfig.social.linkedin}>linkedin</a>
        </p>
      </div>
    </div>
  );
}
