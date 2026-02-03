import { siteConfig } from '@/lib/content';

export default function Hero() {
  return (
    <section className="mx-auto max-w-2xl px-4 pt-32 sm:px-6">
      <p className="text-secondary">
        {siteConfig.name} — I write code, then write about it.
      </p>
      <p className="mt-2 text-tertiary text-sm">
        <a href={siteConfig.social.github} className="hover:text-primary">GitHub</a>
        {' · '}
        <a href={siteConfig.social.twitter} className="hover:text-primary">X</a>
        {' · '}
        <a href={siteConfig.social.linkedin} className="hover:text-primary">LinkedIn</a>
      </p>
    </section>
  );
}
