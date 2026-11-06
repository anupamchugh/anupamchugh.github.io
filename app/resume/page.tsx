import { Metadata } from 'next';
import RoleLens from '@/components/role-lens';

export const metadata: Metadata = {
  title: 'career & resume',
  description: 'Anupam Chugh: editorial leadership, community building, and mobile engineering.',
};

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <p className="text-sm text-secondary">editorial · community · mobile engineering</p>
      <h1 className="mt-3 text-3xl font-semibold text-primary">Anupam Chugh</h1>
      <p className="mt-2 text-secondary">Average programmer. Above-average manager.</p>
      <p className="mt-6 leading-7 text-secondary">
        I build apps and write about them. Sometimes funny. Good at helping manage engineers, better with engineering managers.
        That has taken me from delivery apps and crop cameras to running an engineering publication, and now to building with AI agents.
      </p>
      <p className="mt-5 text-sm leading-7 text-secondary">
        <a className="underline" href="/resume-product.pdf">Download product résumé (PDF)</a>{' · '}
        <a className="underline" href="/posts/ten-years-of-doing-stuff/">Read the longer career story</a>{' · '}
        <a className="underline" href="/showcase/">Explore the app showcase</a>{' · '}
        <a className="underline" href="/posts/Moving-On-From-BP/">Editorial story</a>
      </p>
      <RoleLens />
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-primary">The editor</h2>
        <p className="mt-4 leading-7 text-secondary">
          I took over Better Programming from Zack Shapiro in 2021 and ran it until 2023, while it grew from 50 million to 150 million lifetime pageviews.
          I improved the editorial workflow. Zack had built Better Publishing, an editors&apos; app for our Trello review queue. I also built MediumRSS, my own SwiftUI app
          that pulled each day&apos;s posts across more than 100 Medium topics with author details, so we could track promising writers and reach out
          and onboard them faster for the publication and its newsletters.
          I found writers, helped them onboard and supported their work. Coffee Bytes grew out of the same instinct: put other people in front of readers.
        </p>
        <p className="mt-3 text-sm text-secondary"><a className="underline" href="https://medium.com/@coffee_bytes">Coffee Bytes</a>{' · '}<a className="underline" href="https://medium.com/better-programming/better-programming-has-a-new-editor-4f4ee04fa899">My farewell</a></p>
      </section>
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-primary">The builder</h2>
        <p className="mt-4 leading-7 text-secondary">
          I started at MOBEY, a Gold Coast delivery company, building its Android customer and driver apps end to end, remotely. Thanks to{' '}
          <a className="underline" href="https://www.linkedin.com/in/nishantshrestha/">Nishant Shrestha</a> for helping me find my feet in app building
          and onboarding me into iOS. At Aged Care Decisions I shipped white-label apps for different teams,
          changing layouts, skins and configurations around a shared app. At Agricx I led Android work and built its first iOS app.
        </p>
        <p className="mt-3 text-sm text-secondary"><a className="underline" href="https://www.youtube.com/watch?v=-VCwMGz0Zvw">MOBEY on 7 News</a>{' · '}<a className="underline" href="/posts/ten-years-of-doing-stuff/">MOBEY and Agricx in the career story</a></p>
      </section>
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-primary">What I&apos;m building now</h2>
        <p className="mt-4 leading-7 text-secondary">
          Consumer apps with on-device AI, from idea to App Store: 19 live, 65 approved releases since December 2025.
          Breakline reads how your body moves in your own clips across seven sports; in testing, a 3D humanoid robot replays your surf pop-up or push-up.
          Wearover explores restyling from a photo on the iPhone and is on the App Store.
        </p>
        <p className="mt-4 leading-7 text-secondary">
          <a className="underline" href="https://tradeshot.co">TradeShot</a> and Glint are customizable tools for practicing trading and developing better habits.
          I&apos;m also developing ChughGPT, a personal toolkit exploring how agents and connected tools can support my social media, blog and work workflows.
          I write about technology and satire.
        </p>
        <p className="mt-4 leading-7 text-secondary">Off the clock: surfing, which started Breakline, Swell Window and Contour Lab&apos;s surfboard mode; chess, cricket, table tennis, board games and films. These days I talk to agents, too.</p>
        <p className="mt-3 text-sm text-secondary"><a className="underline" href="/showcase/index.html#wearover-demo">Wearover</a>{' · '}<a className="underline" href="https://getalcor.com/breakline/">Breakline</a>{' · '}<a className="underline" href="/showcase/#studio">Glint in the studio</a>{' · '}<a className="underline" href="/showcase/">Selected work</a>{' · '}<a className="underline" href="https://humorbytes.substack.com">Humor Bytes</a>{' · '}<a className="underline" href="https://thebigtech.substack.com">Big Tech</a></p>
      </section>
    </main>
  );
}
