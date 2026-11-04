import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'work gallery',
  description: 'screens, recordings and a few people from ten years of building apps.',
};

type Slide =
  | { kind: 'image'; src: string; width: number; height: number; alt: string; caption: string }
  | { kind: 'video'; src: string; poster: string; width: number; height: number; caption: string };

type Chapter = { id: string; years: string; title: string; note: string; slides: Slide[] };

const cj = '/screenshots/career-journey';
const g = '/gallery';
const phone = { width: 562, height: 1000 };
const tall = { width: 460, height: 1000 };

const chapters: Chapter[] = [
  {
    id: 'first-apps',
    years: '2014–15',
    title: 'first apps',
    note: 'two Android apps I shipped before I had a job title. Both were later suspended, so these are the last screenshots.',
    slides: [
      { kind: 'image', src: `${cj}/gimics-app.png`, width: 335, height: 593, alt: 'Gimics, an early Android game', caption: 'Gimics' },
      { kind: 'image', src: `${cj}/movie-reviews-app.png`, width: 1320, height: 504, alt: 'Movie Reviews listed on the Play Store as suspended', caption: 'Movie Reviews, as the Play Store shows it now' },
    ],
  },
  {
    id: 'journaldev',
    years: '2015–18',
    title: 'journaldev and dourier',
    note: 'I built the JournalDev Android app, and a courier MVP called Dourier with friends. Dourier left no screenshots.',
    slides: [
      { kind: 'image', src: `${cj}/journaldev-playstore.png`, width: 1992, height: 1424, alt: 'JournalDev app on the Play Store: 4.4 stars, 10K+ downloads', caption: 'JournalDev on the Play Store: 4.4 stars, 10K+ downloads' },
    ],
  },
  {
    id: 'mobey',
    years: '2015–17',
    title: 'mobey',
    note: 'delivery for Australia, built remotely: food, convenience, alcohol, marketplace and pick-up anything. I worked on the customer and driver apps. These driver screens are from a test run in September 2016.',
    slides: [
      { kind: 'image', src: `${cj}/mobey-2016.png`, width: 1080, height: 1920, alt: 'MOBEY customer app home with five delivery categories', caption: 'Customer app: five kinds of delivery' },
      { kind: 'image', src: `${g}/mobey/driver-01.webp`, ...phone, alt: 'Driver app: go online, vehicle and request types', caption: 'Driver goes online and picks what they will carry' },
      { kind: 'image', src: `${g}/mobey/driver-03.webp`, ...phone, alt: 'Driver app: a new food request with pick-up and delivery locations', caption: 'A request: pick-up and drop-off' },
      { kind: 'image', src: `${g}/mobey/driver-04.webp`, ...phone, alt: 'Driver app: map of the current request', caption: 'On the job' },
      { kind: 'image', src: `${g}/mobey/driver-05.webp`, ...phone, alt: 'Driver app: navigate, arrived, order instructions, capture receipt', caption: 'Navigate, arrive, capture the receipt' },
      { kind: 'image', src: `${g}/mobey/driver-07.webp`, ...phone, alt: 'Driver app: the customer added a tip', caption: '“Customer bought you a $4.00 coffee as tip”' },
      { kind: 'image', src: `${g}/mobey/driver-08.webp`, ...phone, alt: 'Driver app: proof of delivery photos and signature', caption: 'Proof of delivery: photos and signature' },
      { kind: 'image', src: `${g}/mobey/driver-09.webp`, ...phone, alt: 'Driver app: list of non-delivery reasons', caption: 'When delivery fails, the driver says why' },
      { kind: 'image', src: `${g}/mobey/barry.webp`, width: 900, height: 900, alt: 'Barry from the MOBEY team in a Straight Outta MOBEY shirt', caption: 'Barry, straight outta MOBEY' },
    ],
  },
  {
    id: 'agricx',
    years: '2019',
    title: 'agricx',
    note: 'crop quality inspection on a phone. An inspector photographs a sample next to a marker; the app counts, sizes and grades it, then files a report for the vendor.',
    slides: [
      { kind: 'video', src: `${g}/agricx/agricx-inspection-2019.mp4`, poster: `${g}/agricx/agricx-inspection-poster.webp`, ...phone, caption: 'Screen recording, August 2019: reports, capture, then size and count' },
      { kind: 'image', src: `${cj}/agricx-crop-camera.jpg`, width: 600, height: 800, alt: 'Agricx crop samples prepared for capture', caption: 'Samples ready for capture' },
      { kind: 'image', src: `${cj}/agricx-crop-analysis.jpg`, width: 600, height: 720, alt: 'Agricx analysis screen with a marker and a count of 11', caption: 'Marker, count and size bands' },
    ],
  },
  {
    id: 'writing',
    years: '2019–23',
    title: 'writing',
    note: 'tutorials and tech essays on Medium and Substack, and three years editing Better Programming.',
    slides: [
      { kind: 'image', src: `${cj}/hacker-news-frontpage.png`, width: 2874, height: 790, alt: 'Articles on the Hacker News front page', caption: 'On the Hacker News front page' },
      { kind: 'image', src: `${cj}/medium-stats.png`, width: 2880, height: 1800, alt: 'Medium lifetime views for several stories', caption: 'Medium, per story' },
      { kind: 'image', src: `${cj}/substack-popular-posts.png`, width: 2880, height: 1800, alt: 'Big Tech newsletter post stats on Substack', caption: 'Big Tech, the Substack' },
      { kind: 'image', src: `${cj}/better-programming-logo.png`, width: 1024, height: 1024, alt: 'Better Programming logo', caption: 'Better Programming, 2021–23' },
    ],
  },
  {
    id: 'alcor',
    years: '2024–now',
    title: 'alcor',
    note: 'my independent studio: small Apple apps that run on the device and hand work to each other.',
    slides: [
      { kind: 'video', src: `${g}/studio/trayce-demo.mp4`, poster: `${g}/studio/trayce-01-trip.webp`, ...tall, caption: 'Trayce: newest booking copy wins, then a tray plan (open source)' },
      { kind: 'image', src: `${g}/studio/trayce-03-tray.webp`, ...tall, alt: 'Trayce tray plan', caption: 'Trayce tray plan' },
      { kind: 'image', src: `${g}/studio/breakline.webp`, width: 462, height: 1000, alt: 'Breakline surf coach chat', caption: 'Breakline: an on-device surf coach' },
      { kind: 'image', src: `${g}/studio/first-contact.webp`, ...tall, alt: 'First Contact Duet reveal screen', caption: 'First Contact Duet' },
      { kind: 'image', src: `${g}/studio/quorion.webp`, ...tall, alt: 'Quorion Table cast screen', caption: 'Quorion Table' },
      { kind: 'image', src: `${g}/studio/match-room.webp`, ...tall, alt: 'The Match Room today screen', caption: 'The Match Room' },
      { kind: 'image', src: `${g}/studio/feedloom.webp`, ...tall, alt: 'Feedloom save, find and thread', caption: 'Feedloom' },
      { kind: 'image', src: `${g}/studio/swell-window.webp`, ...tall, alt: 'Swell Window surf forecast', caption: 'Swell Window' },
      { kind: 'image', src: `${g}/studio/papersky.webp`, width: 1000, height: 562, alt: 'Papersky synthwave flight on Apple Vision Pro', caption: 'Papersky on Vision Pro' },
      { kind: 'image', src: `${g}/studio/common-ground-vision.webp`, width: 1000, height: 562, alt: 'Find Common Ground welcome on Apple Vision Pro', caption: 'Find Common Ground on Vision Pro' },
    ],
  },
];

function SlideView({ slide }: { slide: Slide }) {
  const style = { aspectRatio: `${slide.width} / ${slide.height}` };
  return (
    <figure className="flex h-full flex-col">
      <div className="h-[22rem] max-w-[85vw] overflow-hidden sm:max-w-[40rem] rounded-lg border border-border bg-black/5" style={style}>
        {slide.kind === 'video' ? (
          <video
            src={slide.src}
            poster={slide.poster}
            controls
            playsInline
            muted
            preload="none"
            className="h-full w-full object-contain"
            aria-label={slide.caption}
          />
        ) : (
          <Image
            src={slide.src}
            alt={slide.alt}
            width={slide.width}
            height={slide.height}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        )}
      </div>
      <figcaption className="mt-2 max-w-[16rem] text-xs leading-5 text-tertiary">{slide.caption}</figcaption>
    </figure>
  );
}

export default function WorkGalleryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-32 sm:px-6">
      <p className="text-sm text-tertiary">
        <Link href="/work" className="underline underline-offset-4 hover:text-secondary">work</Link> / gallery
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-primary">work gallery</h1>
      <p className="mt-3 max-w-2xl text-secondary">
        what ten years of building apps looked like on screen, plus one teammate. The longer story is in{' '}
        <Link href="/posts/ten-years-of-doing-stuff" className="underline underline-offset-4 hover:text-primary">
          ten years of doing stuff
        </Link>
        .
      </p>

      <nav aria-label="chapters" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {chapters.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="text-secondary underline-offset-4 hover:text-primary hover:underline">
            {c.title}
          </a>
        ))}
      </nav>

      {chapters.map((c) => (
        <section key={c.id} id={c.id} className="mt-14 scroll-mt-24" aria-labelledby={`${c.id}-title`}>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 id={`${c.id}-title`} className="text-lg font-semibold text-primary">{c.title}</h2>
            <span className="font-mono text-xs text-tertiary">{c.years}</span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">{c.note}</p>
          <ul
            tabIndex={0}
            aria-label={`${c.title} screens, scroll sideways`}
            className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            {c.slides.map((s) => (
              <li key={s.src} className="shrink-0 snap-start">
                <SlideView slide={s} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
