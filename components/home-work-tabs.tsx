import Image from 'next/image';
import Link from 'next/link';
import { apps, recentlyReviewedProjects, selectedWork } from '@/lib/content';

export default function HomeWorkTabs() {
  return (
    <section aria-labelledby="home-work-heading" className="home-work-tabs">
      <div className="flex items-center justify-between gap-4">
        <h2 id="home-work-heading" className="text-xl font-semibold text-primary">work</h2>
        <Link href="/work/" className="text-sm text-secondary hover:text-primary">directory →</Link>
      </div>

      <div className="mt-5 flex gap-1 border-b border-border" role="radiogroup" aria-label="work directory">
        <input id="home-work-projects" name="home-work" type="radio" defaultChecked className="home-work-tab-input" />
        <label htmlFor="home-work-projects" className="home-work-tab-label">projects</label>
        <input id="home-work-apps" name="home-work" type="radio" className="home-work-tab-input" />
        <label htmlFor="home-work-apps" className="home-work-tab-label">apps</label>
        <input id="home-work-archive" name="home-work" type="radio" className="home-work-tab-input" />
        <label htmlFor="home-work-archive" className="home-work-tab-label">archive</label>
      </div>

      <div className="mt-5 space-y-4">
        <div id="home-work-panel-projects" className="home-work-panel home-work-panel-projects">
          {recentlyReviewedProjects.map((item) => (
          <Link key={item.name} href={item.href} className="group block">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium text-primary group-hover:underline underline-offset-4">{item.name}</h3>
              <span className="text-xs text-tertiary">{item.status}</span>
            </div>
            <p className="mt-1 text-sm leading-6 text-secondary">{item.description}</p>
          </Link>
          ))}
        </div>

        <div id="home-work-panel-apps" className="home-work-panel home-work-panel-apps">
          {apps.slice(0, 5).map((app) => (
          <Link key={app.slug} href={app.href} className="group flex gap-3">
            {app.icon && <Image src={app.icon} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg border border-border" />}
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="font-medium text-primary group-hover:underline underline-offset-4">{app.name}</h3>
                <span className="text-xs text-tertiary">{app.status}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-secondary">{app.description}</p>
            </div>
          </Link>
          ))}
          <Link href="/apps/" className="inline-block text-sm text-secondary hover:text-primary">
            view all {apps.length} apps →
          </Link>
        </div>

        <div id="home-work-panel-archive" className="home-work-panel home-work-panel-archive">
          {selectedWork.map((item) => (
          <Link key={item.name} href={item.href} className="group block">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium text-primary group-hover:underline underline-offset-4">{item.name}</h3>
              <span className="text-xs text-tertiary">{item.status}</span>
            </div>
            <p className="mt-1 text-sm leading-6 text-secondary">{item.description}</p>
          </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
