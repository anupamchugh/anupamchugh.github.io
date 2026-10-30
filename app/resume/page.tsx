import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'career & resume',
  description: 'Anupam Chugh: building products, scouting ideas, and helping people tell their stories.',
};

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <p className="text-sm text-secondary">product · engineering · community</p>
      <h1 className="mt-3 text-3xl font-semibold text-primary">Anupam Chugh</h1>
      <p className="mt-2 text-secondary">Average programmer. Above-average manager.</p>
      <p className="mt-6 leading-7 text-secondary">
        I build apps. I find writers. I like the work between an idea and the person it reaches.
        That has taken me from delivery apps and crop cameras to running an engineering publication, and now to building with AI agents.
      </p>
      <p className="mt-5 text-sm leading-7 text-secondary">
        <a className="underline" href="/resume-product.pdf">Download product résumé (PDF)</a>{' · '}
        <a className="underline" href="/resume.pdf">Earlier story résumé</a>{' · '}
        <a className="underline" href="/resume-wave.pdf">Wave résumé (earlier version)</a>{' · '}
        <a className="underline" href="/resume-logbook.pdf">Logbook résumé (earlier version)</a>{' · '}
        <a className="underline" href="/resume-tidechart.pdf">Tidechart résumé (earlier version)</a>{' · '}
        <a className="underline" href="/posts/ten-years-of-doing-stuff/">Read the longer career story</a>{' · '}
        <a className="underline" href="/work/">Explore selected work</a>
      </p>
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-primary">The builder</h2>
        <p className="mt-4 leading-7 text-secondary">
          At MOBEY I built customer and driver apps. At Aged Care Decisions I shipped white-label apps for different teams,
          changing layouts, skins and configurations around a shared app. At Agricx I led Android work and built its first iOS app.
        </p>
        <p className="mt-3 text-sm text-secondary"><a className="underline" href="https://www.youtube.com/watch?v=-VCwMGz0Zvw">MOBEY on 7 News</a>{' · '}<a className="underline" href="/posts/ten-years-of-doing-stuff/">MOBEY and Agricx in the career story</a></p>
      </section>
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-primary">The scout</h2>
        <p className="mt-4 leading-7 text-secondary">
          As Managing Editor of Better Programming, I worked with Medium on curation, distribution, product feedback and editorial tools.
          I found writers, reached out, helped them onboard and supported their work. Coffee Bytes grew out of the same instinct: put other people in front of readers.
        </p>
        <p className="mt-3 text-sm text-secondary"><a className="underline" href="https://medium.com/@coffee_bytes">Coffee Bytes</a>{' · '}<a className="underline" href="https://medium.com/better-programming/better-programming-has-a-new-editor-4f4ee04fa899">My farewell</a></p>
      </section>
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-primary">What I&apos;m building now</h2>
        <p className="mt-4 leading-7 text-secondary">
          Glint and TradeShot are an in-development exploration of personalized trading agents and better mental models for a trading day.
          The goal is to bring evidence, risk and context into decisions. I also take on freelance work: right now I&apos;m helping my landlord with <a className="underline" href="https://meamistays.com/">Meami Stays</a>, a personal booking platform for his homes. I help with the website, bookings, guest communication and marketing.
        </p>
        <p className="mt-4 leading-7 text-secondary">When I&apos;m not building, I write online, take photographs, watch films and follow cricket. These days I talk to agents, too.</p>
        <p className="mt-3 text-sm text-secondary"><a className="underline" href="/work/">Selected work</a>{' · '}<a className="underline" href="https://medium.com/@anupamchugh/list/my-tech-articles-like-sort-of-okay-cfc0750bb50e">My tech articles</a>{' · '}<a className="underline" href="https://iosdevie.substack.com">iOSDevie</a>{' · '}<a className="underline" href="https://humorbytes.substack.com">Humor Bytes</a>{' · '}<a className="underline" href="https://thebigtech.substack.com">Big Tech</a></p>
      </section>
    </main>
  );
}
