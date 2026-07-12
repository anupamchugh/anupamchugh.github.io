import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/hero';
import { apps, selectedWork } from '@/lib/content';
import { curatedPhotos } from '@/lib/photos';
import { getRecentPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const recentPosts = getRecentPosts(5);
  const homePhotos = curatedPhotos.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-12 border-b border-border pb-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-primary">latest writing</h2>
              <Link href="/posts/" className="text-sm text-secondary hover:text-primary">
                view all →
              </Link>
            </div>

            <div className="mt-6 divide-y divide-border">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/posts/${post.slug}/`} className="group flex gap-4 py-4">
                  <time className="w-24 shrink-0 text-sm text-tertiary" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <div>
                    <h3 className="font-medium text-primary group-hover:underline underline-offset-4">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-secondary">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-primary">selected work</h2>
              <Link href="/work/" className="text-sm text-secondary hover:text-primary">
                view all →
              </Link>
            </div>

            <div className="mt-6 space-y-5">
              {selectedWork.slice(0, 4).map((item) => (
                <Link key={item.name} href={item.href} className="group block">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-medium text-primary group-hover:underline underline-offset-4">
                      {item.name.toLowerCase()}
                    </h3>
                    <span className="text-xs text-tertiary">{item.status}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-secondary">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-12 border-b border-border pb-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-primary">shipped apps</h2>
              <Link href="/apps/" className="text-sm text-secondary hover:text-primary">
                view all →
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {apps.slice(0, 5).map((app) => (
                <Link key={app.slug} href={app.href} className="group flex gap-4">
                  {app.icon && (
                    <Image
                      src={app.icon}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 shrink-0 rounded-lg border border-border"
                    />
                  )}
                  <div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-medium text-primary group-hover:underline underline-offset-4">
                        {app.name}
                      </h3>
                      <span className="text-xs text-tertiary">{app.status}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-secondary">{app.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-primary">photos</h2>
              <Link href="/photos/" className="text-sm text-secondary hover:text-primary">
                view all →
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {homePhotos.map((photo) => (
                <Link key={photo.src} href="/photos/" className="group block">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 1024px) 33vw, 180px"
                    className="aspect-square w-full object-cover transition-opacity group-hover:opacity-90"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
