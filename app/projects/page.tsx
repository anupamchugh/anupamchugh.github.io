import { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Tutorial collections and explorations.',
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Projects</h1>
      <p className="mt-2 text-slate-400">
        Tutorial collections and explorations.
      </p>

      <div className="mt-8 space-y-6">
        {projects.map((project) => (
          <Link
            key={project.name}
            href={project.href}
            className="block rounded-lg border border-slate-700 p-6 transition-colors hover:border-slate-600"
          >
            <h3 className="text-xl font-semibold text-white">
              {project.name}
            </h3>
            <p className="mt-2 text-slate-400">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
