import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'projects',
  description: 'Tutorial collections, tools, and explorations.',
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-semibold text-primary">projects</h1>
      <p className="mt-2 text-secondary">
        Tools, tutorial collections, and explorations.
      </p>

      <div className="mt-8 space-y-6">
        {projects.map((project) => (
          <Link
            key={project.name}
            href={project.href}
            className="block overflow-hidden rounded-lg border border-border transition-colors hover:border-secondary"
          >
            {project.image && (
              <div className="relative aspect-video w-full bg-secondary">
                <Image
                  src={project.image}
                  alt={`${project.name} preview`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary">
                {project.name}
              </h3>
              <p className="mt-2 text-secondary">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-secondary px-2 py-1 text-xs text-tertiary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
