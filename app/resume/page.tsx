import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'resume',
  description: 'resume of anupam chugh, ios and macos engineer.',
};

type Resume = {
  basics: {
    name: string;
    label: string;
    email: string;
    summary: string;
    profiles: { network: string; url: string }[];
  };
  work: {
    name: string;
    position: string;
    startDate?: string;
    endDate?: string;
    summary: string;
  }[];
  projects: { name: string; description: string; url: string }[];
  skills: { name: string; keywords: string[] }[];
};

function loadResume(): Resume {
  return JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'resume.json'), 'utf8'));
}

function dates(start?: string, end?: string) {
  if (!start) return '';
  return `${start}–${end ?? 'present'}`;
}

export default function ResumePage() {
  const { basics, work, projects, skills } = loadResume();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-3xl font-semibold text-primary">{basics.name.toLowerCase()}</h1>
      <p className="mt-2 text-secondary">{basics.label.toLowerCase()}</p>
      <p className="mt-4 text-sm leading-6 text-secondary">{basics.summary}</p>
      <p className="mt-3 text-sm leading-6 text-secondary">
        <a href={`mailto:${basics.email}`}>{basics.email}</a>
        {basics.profiles.map((profile) => (
          <span key={profile.network}>
            {' · '}
            <a href={profile.url}>{profile.network.toLowerCase()}</a>
          </span>
        ))}
        {' · '}
        <a href="/resume.json">resume.json</a>
      </p>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-primary">work</h2>
        <div className="mt-5 space-y-5">
          {work.map((job) => (
            <div key={job.name} className="grid grid-cols-[6rem_1fr] gap-4">
              <div className="text-sm text-tertiary tabular-nums">{dates(job.startDate, job.endDate)}</div>
              <div>
                <h3 className="font-medium text-primary">
                  {job.position.toLowerCase()}, {job.name.toLowerCase()}
                </h3>
                <p className="mt-1 text-sm leading-6 text-secondary">{job.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-primary">projects</h2>
        <div className="mt-5 space-y-4">
          {projects.map((project) => (
            <div key={project.name}>
              <h3 className="font-medium text-primary">
                <a href={project.url}>{project.name.toLowerCase()}</a>
              </h3>
              <p className="mt-1 text-sm leading-6 text-secondary">{project.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-primary">skills</h2>
        <div className="mt-5 space-y-2 text-sm leading-6 text-secondary">
          {skills.map((skill) => (
            <p key={skill.name}>
              <span className="text-primary">{skill.name.toLowerCase()}</span>: {skill.keywords.join(', ').toLowerCase()}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
