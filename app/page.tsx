import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import LensSections from '@/components/lens-sections';
import MediumPreviews from '@/components/medium-previews';
import { getRecentPosts } from '@/lib/posts';
import { curatedPhotos } from '@/lib/photos';

const mono = 'font-mono text-xs uppercase tracking-[0.08em] text-tertiary';
const panelTitle = 'text-4xl font-bold leading-none tracking-[-0.035em] sm:text-5xl';
const phone = 'h-[420px] w-[200px] shrink-0 rounded-[26px] object-cover object-top';
const button = 'inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold no-underline';

function Chapter({ id, kicker, status, children }: { id: string; kicker: string; status: ReactNode; children: ReactNode }) {
  return (
    <article id={id} className="scroll-mt-24 pb-20 pt-2">
      <div className={`mb-3.5 flex flex-wrap justify-between gap-2 ${mono}`}>
        <span>{kicker}</span>
        <span>{status}</span>
      </div>
      {children}
    </article>
  );
}

function Panel({ className, children }: { className: string; children: ReactNode }) {
  return <div className={`grid items-center gap-8 rounded-[26px] p-6 sm:p-12 md:grid-cols-2 ${className}`}>{children}</div>;
}

function Shot({ src, alt, className = phone, width = 460, height = 1000 }: { src: string; alt: string; className?: string; width?: number; height?: number }) {
  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}

function Clip({ src, poster, label }: { src: string; poster: string; label: string }) {
  return <video src={src} poster={poster} controls muted playsInline preload="none" aria-label={label} className={`${phone} bg-black`} />;
}

const breakline = (
  <Chapter
    id="breakline"
    kicker="vision · realitykit"
    status={<a href="https://apps.apple.com/us/app/breakline-surf/id6785873182" className="text-[#1C7A3F] no-underline">● on the app store · 1.6 in build</a>}
  >
    <Panel className="bg-[#DDE8F2] text-[#16161A]">
      <div>
        <p className={panelTitle}>Your pop-up,<br />on a robot.</p>
        <p className="mt-4 max-w-md leading-relaxed text-[#34404D]">
          Breakline reads your pose from a surf or gym clip, then a humanoid built in RealityKit replays it beside you. Measurements only,
          never a score. The clip never leaves the phone.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Clip src="/home/breakline-robot.mp4" poster="/home/breakline-robot.webp" label="Breakline robot replay of a surf pop-up" />
        <Shot src="/home/breakline-home.webp" alt="Breakline home: surf, skate, golf and tennis" />
      </div>
    </Panel>
  </Chapter>
);

const glint = (
  <Chapter id="glint" kicker="trading · live activities" status="in development">
    <Panel className="bg-[#16161A] text-[#F7F7F4]">
      <div className="flex flex-wrap justify-center gap-4">
        <Shot src="/home/glint-island.webp" alt="Glint showing a sample trade in the Dynamic Island" />
        <Shot src="/home/glint-lock.webp" alt="Glint showing a sample trade on the Lock Screen" className="h-[420px] w-[200px] shrink-0 rounded-[26px] object-cover object-bottom" />
      </div>
      <div>
        <p className={panelTitle}>Rules first,<br />then the trade.</p>
        <p className="mt-4 max-w-md leading-relaxed text-[#C8C8D0]">
          I trade by following algorithms that have worked for me, unless I end up gambling manually. TradeShot and Glint are my
          customizable tools for practicing trading and building better habits, and Glint keeps the trade on your Lock Screen.
        </p>
        <a href="https://tradeshot.co/" className={`${button} mt-5 bg-[#F7F7F4] text-[#16161A]`}>tradeshot.co ↗</a>
      </div>
    </Panel>
  </Chapter>
);

const contour = (
  <Chapter id="contour" kicker="open source · vision · realitykit" status="mit · since 2020">
    <Panel className="bg-[var(--bg-tertiary)] text-primary">
      <div>
        <p className={panelTitle}>51 coins.<br />One photo.</p>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-[#16161A] p-5 font-mono text-[13px] leading-relaxed text-[#E8E6DF]">
          <span className="text-[#8FB4F0]">let</span> request = <span className="text-[#E8B86B]">VNDetectContoursRequest</span>(){'\n'}
          request.detectsDarkOnLight = <span className="text-[#8FB4F0]">true</span>{'\n'}
          <span className="text-[#8A8A93]">{'// then group by size, count, measure'}</span>
        </pre>
        <p className="mt-4 leading-relaxed text-secondary">
          Contour Lab started as a 2020 sample for Vision&apos;s contour request. Now it counts coins, leaves and odd shapes, measures a
          surfboard from one photo, and lays the count out as tokens on a RealityKit table. Guess first, then ask the on-device model,
          which is never allowed to say a number.
        </p>
        <a href="https://github.com/anupamchugh/iOS14VisionContourDetection" className={`${button} mt-4 bg-[#16161A] text-[#F7F7F4]`}>Explore on GitHub</a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Shot src="/home/contour-3d.webp" alt="51 coins as tokens on a 3D table" />
        <Shot src="/home/contour-surfboard.webp" alt="A 6 foot 2 surfboard measured from one photo" />
        <Shot src="/home/contour-leaves.webp" alt="Five leaves outlined and measured" />
        <Shot src="/home/contour-anything.webp" alt="Seven objects of any shape counted" />
      </div>
    </Panel>
  </Chapter>
);

const screenRoom = (
  <Chapter id="screenroom" kicker="iphone + mac" status="live · remote is open source">
    <Panel className="bg-[#2A1414] text-[#F7F2EE]">
      <div>
        <p className={panelTitle}>Screen Room.</p>
        <p className="mt-4 max-w-md leading-relaxed text-[#E2CFC8]">
          What to watch next, from what you already browse. Recaps that stop where you stopped, and a comic of the plot drawn on the
          device. Screen Room Remote drives a Fire TV from the Mac.
        </p>
        <a href="https://github.com/anupamchugh/ScreenRoomRemote" className={`${button} mt-5 bg-[#F7F2EE] text-[#2A1414]`}>Remote on GitHub ↗</a>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Shot src="/home/screenroom-home.webp" alt="Screen Room home" />
        <Shot src="/home/screenroom-comic.webp" alt="Screen Room comic recap" />
      </div>
    </Panel>
  </Chapter>
);

const studioItems = [
  { src: '/home/feedloom-duo.webp', alt: 'Feedloom unfolded on iPhone Duo', name: 'Feedloom', line: 'save this, find the thread. On iPhone Duo.', w: 1200, h: 844 },
  { src: '/showcase/img/wearover-linen-fitted.webp', alt: 'Wearover fitted linen outfit', name: 'Wearover 3.0', line: 'a new look from one photo. In App Review.', w: 506, h: 1100 },
  { src: '/home/quorion-reveal.webp', alt: 'Quorion telling one player their role', name: 'Quorion', line: "a storyteller's table for social deduction nights.", w: 460, h: 1000 },
  { src: '/gallery/studio/trayce-01-trip.webp', alt: 'Trayce trip screen', name: 'Trayce', line: 'the newest booking copy wins. Open source.', w: 460, h: 1000 },
];

const studio = (
  <Chapter id="studio" kicker="more from the studio" status={<a href="https://getalcor.com/" className="text-tertiary">all on getalcor.com ↗</a>}>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {studioItems.map((item) => (
        <figure key={item.name}>
          <Shot src={item.src} alt={item.alt} width={item.w} height={item.h} className="h-[280px] w-full rounded-2xl border border-border object-cover object-left-top" />
          <figcaption className="mt-2 text-sm"><strong className="text-primary">{item.name}</strong> <span className="text-secondary">· {item.line}</span></figcaption>
        </figure>
      ))}
    </div>
    <figure className="mt-4">
      <Shot src="/home/checkmate-board.webp" alt="Checkmate Academy redesign, the full flow in dark and light" width={1600} height={1066} className="w-full rounded-2xl" />
      <figcaption className="mt-2 text-sm"><strong className="text-primary">Checkmate Academy</strong> <span className="text-secondary">· the redesign, every screen in dark and light.</span></figcaption>
    </figure>
  </Chapter>
);

const demos = (
  <Chapter id="demos" kicker="demos · hands, pictures, places" status="tap a video to play">
    <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3" aria-label="Demos, scroll sideways">
      <li className="w-[200px] shrink-0 snap-start">
        <Clip src="/home/rifflet.mp4" poster="/home/rifflet-poster.webp" label="Rifflet: playing piano with a hand pose" />
        <p className="mt-2 text-sm"><strong className="text-primary">Rifflet</strong> <span className="text-secondary">· play the piano with your hand in the air. Live on iPhone and Mac.</span></p>
      </li>
      <li className="w-[200px] shrink-0 snap-start">
        <Clip src="/home/folio.mp4" poster="/home/folio-poster.webp" label="Folio: the on-device model choosing which app gets a picture" />
        <p className="mt-2 text-sm"><strong className="text-primary">Folio</strong> <span className="text-secondary">· the on-device model picks which app a picture goes to. Prototype.</span></p>
      </li>
      <li className="w-[236px] shrink-0 snap-start">
        <Shot src="/home/vision-swipe.gif" alt="Swiping cards with a hand gesture using Vision hand pose" width={309} height={550} className="h-[420px] w-[236px] rounded-[26px] object-cover" />
        <p className="mt-2 text-sm"><strong className="text-primary">Vision swipe</strong> <span className="text-secondary">· Tinder-style swipes with your hand, from 2020. <a href="https://github.com/anupamchugh/iOS14VisionHandPose">29 stars</a>.</span></p>
      </li>
      <li className="w-[236px] shrink-0 snap-start">
        <Shot src="/home/pencilkit-mnist.gif" alt="Digits drawn on a PencilKit canvas, each recognised by a Core ML model" width={269} height={480} className="h-[420px] w-[236px] rounded-[26px] object-cover object-top" />
        <p className="mt-2 text-sm"><strong className="text-primary">PencilKit + Core ML</strong> <span className="text-secondary">· draw a digit and an MNIST model on the phone reads it, from 2019. <a href="https://iosdevie.substack.com/p/pencilkit-coreml-ios13">Post</a> · <a href="https://github.com/anupamchugh/iowncode/tree/master/iOSPencilKitCoreMLMNIST">code</a>.</span></p>
      </li>
      <li className="w-[200px] shrink-0 snap-start">
        <Clip src="/home/headset-tilt.mp4" poster="/home/headset-tilt-poster.webp" label="Headphone tilt: tilting your head to vote yay or nay, under a RealityKit face mask" />
        <p className="mt-2 text-sm"><strong className="text-primary">Headphone tilt</strong> <span className="text-secondary">· tilt your head to vote yay or nay. Headphone motion plus a RealityKit face mask, from 2023.</span></p>
      </li>
      <li className="w-[200px] shrink-0 snap-start">
        <Clip src="/home/cloth-segmentation.mp4" poster="/home/cloth-segmentation-poster.webp" label="Clothes segmentation: a photo, then only the dress in colour, then the model's mask" />
        <p className="mt-2 text-sm"><strong className="text-primary">Clothes segmentation</strong> <span className="text-secondary">· a Core ML model picks out the clothes in a photo, from 2022. Photo: Unsplash.</span></p>
      </li>
      <li className="w-[340px] shrink-0 snap-start">
        <Shot src="/home/pastport.webp" alt="Pastport answering from Safari history on the Mac" width={812} height={1000} className="h-[420px] w-[340px] rounded-[26px] object-cover object-top" />
        <p className="mt-2 text-sm"><strong className="text-primary">Pastport</strong> <span className="text-secondary">· answers from your own Safari history, on the Mac.</span></p>
      </li>
      <li className="w-[560px] shrink-0 snap-start">
        <Shot src="/home/orbits-duo.webp" alt="Find Common Ground unfolded on iPhone Duo with its tools sheet" width={1400} height={984} className="h-[420px] w-[560px] rounded-[26px] object-cover" />
        <p className="mt-2 text-sm"><strong className="text-primary">Find Common Ground</strong> <span className="text-secondary">· plans a meetup, and shows which tools it used. On iPhone Duo.</span></p>
      </li>
    </ul>
  </Chapter>
);

const newsletters = [
  { name: 'Coffee Bytes', href: 'https://medium.com/@coffee_bytes', line: 'putting other writers in front of readers, on Medium' },
  { name: 'Big Tech', href: 'https://thebigtech.substack.com', line: 'what the big platforms are really doing' },
  { name: 'Humor Bytes', href: 'https://humorbytes.substack.com', line: 'tech satire' },
  { name: 'iOSDevie', href: 'https://iosdevie.substack.com', line: 'iOS tutorials: SwiftUI, Core ML, Vision and ARKit' },
];

function Writing() {
  const posts = getRecentPosts(5);
  return (
    <section id="writing" className="scroll-mt-24 border-t border-border pb-20 pt-8">
      <div className="grid gap-9 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold leading-tight tracking-[-0.03em] text-primary">Notes along the way.</h2>
          <p className="mt-3 leading-relaxed text-secondary">
            Over 1 million views on Medium, a few Hacker News front pages, the Coffee Bytes newsletter, and Better Programming, which I
            edited from 2021 to 2023.
          </p>
          <p className="mt-3 flex flex-wrap gap-4 text-sm">
            <a href="https://anupamchugh.medium.com">Medium ↗</a>
            <Link href="/agent-journal/">Agent journal</Link>
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {newsletters.map((n) => (
              <a key={n.name} href={n.href} className="rounded-2xl border border-border p-4 no-underline hover:border-[var(--fg-subtle)]">
                <strong className="block text-primary">{n.name} ↗</strong>
                <span className="mt-1 block text-sm leading-snug text-secondary">{n.line}</span>
              </a>
            ))}
          </div>
        </div>
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border">
              <Link href={`/posts/${post.slug}/`} className="block py-4 font-medium text-primary no-underline hover:underline">
                {post.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/posts/" className="inline-flex min-h-11 items-center text-sm font-semibold">All writing →</Link>
          </li>
        </ul>
      </div>
      <MediumPreviews />
      <div className="mt-9 grid items-center gap-8 rounded-[26px] bg-[var(--bg-tertiary)] p-6 sm:p-12 md:grid-cols-2">
        <div>
          <p className={mono}>better programming · 2021–23</p>
          <p className="mt-2 text-3xl font-bold leading-tight tracking-[-0.03em] text-primary sm:text-4xl">Finding the writers before they find us.</p>
          <p className="mt-4 leading-relaxed text-secondary">
            I modified Zack Shapiro&apos;s Better Publishing app when I took over in 2021, then built my own, MediumRSS: each day&apos;s posts
            across 100+ Medium topics, grouped by topic or author, so we could find writers and reach out faster.
          </p>
        </div>
        <figure>
          <div className="flex justify-center gap-4">
            <Shot src="/home/mediumrss-by-tag.webp" alt="MediumRSS listing posts grouped by topic, with sample data" />
            <Shot src="/home/mediumrss-by-author.webp" alt="MediumRSS listing posts grouped by author, with sample data" />
          </div>
          <figcaption className="mt-2 text-center text-[13px] text-secondary">MediumRSS (2023), shown with sample data: Medium now blocks the feed it read.</figcaption>
          <Shot src="/home/bp-preview.webp" alt="Better Publishing review list and article screen, redrawn from the app's source" width={700} height={595} className="mt-6 w-full rounded-2xl" />
          <figcaption className="mt-2 text-center text-[13px] text-secondary">Better Publishing, Zack&apos;s app that I modified, redrawn from its source. Sample names.</figcaption>
        </figure>
      </div>
    </section>
  );
}

const alongCards = [
  { href: '/work/gallery/#mobey', src: '/gallery/mobey/02-customer-home-categories.webp', alt: 'MOBEY customer app with five kinds of delivery', when: '2015–17 · android and ios', name: 'MOBEY', line: 'Customer and driver apps for a Gold Coast company delivering alcohol, flowers and more. Built remotely.', w: 562, h: 1000 },
  { href: '/work/gallery/#agricx', src: '/gallery/agricx/agricx-inspection-poster.webp', alt: 'Agricx inspection report', when: '2019 · ios and android', name: 'Agricx', line: 'Crop inspection: photograph a sample, then count, size and grade it.', w: 562, h: 1000 },
  { href: '/work/gallery/#journaldev', src: '/screenshots/career-journey/journaldev-playstore.png', alt: 'JournalDev on the Play Store', when: '2015–18 · android', name: 'JournalDev', line: 'The Android app: 4.4 stars, 10K+ downloads.', w: 1992, h: 1424 },
];

const along = (
  <section id="along" className="scroll-mt-24 border-t border-border pb-20 pt-8">
    <h2 className="text-4xl font-bold leading-tight tracking-[-0.03em] text-primary">Along the way.</h2>
    <p className="mt-3 text-secondary">Dourier, a courier MVP with friends, was my first app. Movie Reviews, an Android app on RSS feeds, was my second.</p>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {alongCards.map((card) => (
        <Link key={card.name} href={card.href} className="flex flex-col gap-2.5 rounded-[20px] bg-[var(--bg-tertiary)] p-5 no-underline">
          <Shot src={card.src} alt={card.alt} width={card.w} height={card.h} className="h-60 w-full rounded-xl object-cover object-left-top" />
          <span className="font-mono text-xs text-tertiary">{card.when}</span>
          <strong className="text-lg text-primary">{card.name}</strong>
          <span className="text-sm leading-relaxed text-secondary">{card.line}</span>
        </Link>
      ))}
    </div>
    <Link href="/work/gallery/" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold">The whole gallery →</Link>
  </section>
);

const photos = (
  <section id="photos" className="scroll-mt-24 border-t border-border pb-20 pt-8">
    <div className="flex flex-wrap items-baseline justify-between gap-4">
      <h2 className="text-4xl font-bold leading-tight tracking-[-0.03em] text-primary">Photos.</h2>
      <Link href="/photos/" className="inline-flex min-h-11 items-center text-sm font-semibold">All photos →</Link>
    </div>
    <p className="mt-3 text-secondary">From trips and trails, Kodaikanal to Hoi An.</p>
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {curatedPhotos.slice(0, 6).map((photo) => (
        <Link key={photo.src} href="/photos/" className="group block">
          <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 640px) 50vw, 200px" className="aspect-square w-full rounded-xl object-cover transition-opacity group-hover:opacity-90" />
        </Link>
      ))}
    </div>
  </section>
);

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="pb-14 pt-28">
        <p className={mono}>apps · writing · experiments</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-7xl">
          i build random things.
        </h1>
        <p className="mt-7 text-xl font-medium text-[#0B62A4]">software engineer · app builder · editing code and words · trading with agents</p>
        <div className="mt-6 max-w-2xl space-y-3 text-lg leading-relaxed text-secondary">
          <p>avg coder, above avg manager. engineered managers and managed engineers.</p>
          <p>i started on android, moved to ios, and now build apple apps through alcor. i ran better programming, help other people tell their stories, and write about technology and films.</p>
        </div>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
          <Link href="/work/">see my work →</Link>
          <Link href="/posts/">read writing →</Link>
          <Link href="/resume/">my story →</Link>
        </p>
      </section>

      <LensSections
        tiles={[
          { id: 'breakline', label: 'Breakline', src: '/home/breakline-robot.webp' },
          { id: 'glint', label: 'Glint', src: '/home/glint-island.webp' },
          { id: 'contour', label: 'Contour Lab', src: '/home/contour-3d.webp' },
          { id: 'screenroom', label: 'Screen Room', src: '/home/screenroom-comic.webp' },
          { id: 'studio', label: 'Studio', src: '/home/quorion-reveal.webp' },
          { id: 'demos', label: 'Demos', src: '/home/rifflet-poster.webp' },
          { id: 'writing', label: 'Writing', src: '/home/mediumrss-by-tag.webp' },
          { id: 'along', label: '2015–19', src: '/gallery/mobey/02-customer-home-categories.webp' },
          { id: 'photos', label: 'Photos', src: curatedPhotos[0].src },
        ]}
        sections={[
          { id: 'breakline', lenses: ['ios', 'product'], node: breakline },
          { id: 'glint', lenses: ['ios'], node: glint },
          { id: 'contour', lenses: ['ios'], node: contour },
          { id: 'screenroom', lenses: ['ios', 'product'], node: screenRoom },
          { id: 'studio', lenses: ['ios', 'product'], node: studio },
          { id: 'demos', lenses: ['ios', 'product'], node: demos },
          { id: 'writing', lenses: ['writer'], node: <Writing /> },
          { id: 'along', lenses: ['android', 'product'], node: along },
          { id: 'photos', lenses: [], node: photos },
        ]}
      />

      <p className="border-t border-border py-8 text-sm text-tertiary">Off the clock: surfing, chess, cricket, table tennis, board games, films.</p>
    </div>
  );
}
