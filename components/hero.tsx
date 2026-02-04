import { siteConfig } from '@/lib/content';

export default function Hero() {
  return (
    <section className="mx-auto max-w-2xl px-4 pt-32 sm:px-6">
      <p className="text-secondary">
        {siteConfig.name} — I write code, then write about it.
      </p>
      <p className="mt-2 text-tertiary text-sm">
        <a href={siteConfig.social.github} className="hover:text-primary">github</a>
        {' · '}
        <a href={siteConfig.social.twitter} className="hover:text-primary">x</a>
        {' · '}
        <a href={siteConfig.social.linkedin} className="hover:text-primary">linkedin</a>
      </p>
    </section>
  );
}
