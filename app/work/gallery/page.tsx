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

type Chapter = { id: string; years: string; title: string; note: string; link?: { href: string; label: string }; slides: Slide[] };

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
    note: 'a Gold Coast company delivering food, convenience items, alcohol, flowers and more. My first app job: I built the Android customer and driver apps end to end, remotely. These screens are from a test run in September 2016.',
    slides: [
      { kind: 'image', src: `${g}/mobey/01-customer-welcome.webp`, width: 563, height: 1000, alt: 'MOBEY customer app welcome screen with a delivery bag', caption: 'Customer app (iOS): welcome' },
      { kind: 'image', src: `${g}/mobey/02-customer-home-categories.webp`, width: 563, height: 1000, alt: 'Home with food, convenience, alcohol, marketplace and pick-up anything', caption: 'Five kinds of delivery' },
      { kind: 'image', src: `${g}/mobey/03-customer-vendors.webp`, width: 563, height: 1000, alt: 'List of Gold Coast food vendors', caption: 'Gold Coast vendors' },
      { kind: 'image', src: `${g}/mobey/04-customer-menu.webp`, width: 563, height: 1000, alt: 'Android store menu with item photos and prices', caption: 'Customer app (Android): a store menu' },
      { kind: 'image', src: `${g}/mobey/05-customer-item-options.webp`, width: 563, height: 1000, alt: 'Item options with size upgrade and drink choice', caption: 'Options, then add to cart' },
      { kind: 'image', src: `${g}/mobey/06-customer-cart.webp`, width: 563, height: 1000, alt: 'Cart with flat-rate delivery fee and Request MOBEY', caption: 'Cart: one flat fee, then Request MOBEY' },
      { kind: 'image', src: `${g}/mobey/07-customer-coffee-tip.webp`, width: 563, height: 1000, alt: 'Prompt to shout the driver a $4 coffee', caption: '“Shout your driver a coffee”' },
      { kind: 'image', src: `${g}/mobey/08-customer-driver-en-route.webp`, width: 563, height: 1000, alt: 'Driver en route to pick-up with ETA, rating and vehicle', caption: 'Your driver is on the way (test driver)' },
      { kind: 'image', src: `${g}/mobey/10-customer-delivery-feedback.webp`, width: 563, height: 1000, alt: 'Delivery feedback with five stars and a tip', caption: 'Rate the delivery, tip the driver' },
      { kind: 'image', src: `${g}/mobey/11-driver-welcome.webp`, width: 563, height: 1000, alt: 'MOBEY Driver welcome screen', caption: 'Driver app (Android): welcome' },
      { kind: 'image', src: `${g}/mobey/12-driver-go-online.webp`, width: 563, height: 1000, alt: 'Driver goes online with vehicle and delivery types', caption: 'Go online and pick what to carry' },
      { kind: 'image', src: `${g}/mobey/13-driver-pickup-actions.webp`, width: 563, height: 1000, alt: 'Driver request map with navigate, arrived, instructions and receipt', caption: 'Driver app (iOS): at the pick-up' },
      { kind: 'image', src: `${g}/mobey/14-driver-capture-receipt.webp`, width: 563, height: 1000, alt: 'Driver captures the purchase receipt and total', caption: 'Photograph the receipt' },
      { kind: 'image', src: `${g}/mobey/15-driver-dropoff-actions.webp`, width: 563, height: 1000, alt: 'Drop-off actions: navigate, notes, report non-delivery, complete', caption: 'At the drop-off' },
      { kind: 'image', src: `${g}/mobey/16-driver-proof-of-delivery.webp`, width: 630, height: 1000, alt: 'Proof of delivery with two photos and a signature', caption: 'Proof of delivery: photos and signature' },
      { kind: 'image', src: `${g}/mobey/17-driver-non-delivery.webp`, width: 563, height: 1000, alt: 'List of non-delivery reasons', caption: 'When delivery fails, the driver says why' },
      { kind: 'image', src: `${g}/mobey/19-muber-ios-prototype-home.webp`, width: 375, height: 667, alt: 'Early MUBER prototype home, December 2015', caption: 'Before the rename: the MUBER prototype, Dec 2015' },
      { kind: 'image', src: `${g}/mobey/20-marketing-logo.webp`, width: 1000, height: 612, alt: 'MOBEY Delivery on demand logo', caption: 'The brand' },
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
    note: 'tutorials and tech essays on Medium and Substack, and three years editing Better Programming. The writer-scouting tool from those years grew into Scout in 2026, a curation desk for any open feed.',
    link: { href: '/posts/scout-code-ranks-apple-intelligence-explains/', label: 'how Scout works (written by Claude Code)' },
    slides: [
      { kind: 'image', src: `${cj}/hacker-news-frontpage.png`, width: 2874, height: 790, alt: 'Articles on the Hacker News front page', caption: 'On the Hacker News front page' },
      { kind: 'image', src: `${cj}/medium-stats.png`, width: 2880, height: 1800, alt: 'Medium lifetime views for several stories', caption: 'Medium, per story' },
      { kind: 'image', src: `${cj}/substack-popular-posts.png`, width: 2880, height: 1800, alt: 'Big Tech newsletter post stats on Substack', caption: 'Big Tech, the Substack' },
      { kind: 'image', src: `${cj}/better-programming-logo.png`, width: 1024, height: 1024, alt: 'Better Programming logo', caption: 'Better Programming, 2021–23' },
      { kind: 'video', src: '/scout/scout-demo.mp4', poster: '/scout/01-today.jpg', width: 590, height: 1282, caption: 'Scout, 2026: deck, shortlist, issue drafted by agents (fictional demo writers)' },
      { kind: 'image', src: '/scout/05-issue-agents.jpg', width: 414, height: 900, alt: 'Scout issue drafted by four on-device newsletter agents', caption: 'Scout: a newsletter issue drafted on device, checked in code' },
      { kind: 'image', src: '/scout/mac-01-today-writers.jpg', width: 1600, height: 994, alt: 'Scout on the Mac with lanes, ranked writers and a writer card', caption: 'Scout on the Mac: code ranks, the model says why' },
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
          <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">
            {c.note}
            {c.link && (
              <>
                {' '}
                <Link href={c.link.href} className="underline underline-offset-4 hover:text-primary">
                  {c.link.label}
                </Link>
              </>
            )}
          </p>
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
