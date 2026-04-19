import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'photos',
  description: 'Eight photos. The ones that hold up after I\'ve forgotten the trip.',
};

type Photo = {
  src: string;
  alt: string;
  caption: string;
  location: string;
  year: number;
  width: number;
  height: number;
};

// Pinterest-style masonry via CSS columns so each tile keeps its real
// aspect ratio. Real pixel dimensions go to next/image so nothing is
// upscaled and there's no layout shift.
const photos: Photo[] = [
  {
    src: '/photographs/best-picks/diwali-lights-2018.jpg',
    alt: 'Silhouette of a man in profile with a red fairy-light bulb held at his eye, surrounded by coloured Diwali bokeh in the dark',
    caption: 'diwali',
    location: 'India',
    year: 2018,
    width: 4898,
    height: 2755,
  },
  {
    src: '/photographs/best-picks/peacock-2019.jpg',
    alt: 'A peacock in profile against a dark forest backdrop, iridescent blue neck and crest in sharp focus',
    caption: 'peacock',
    location: 'Kanha',
    year: 2019,
    width: 1080,
    height: 722,
  },
  {
    src: '/photographs/career-journey/misty-dog-kodaikanal.jpg',
    alt: 'A street dog walking out of the mist on a forest trail in Kodaikanal',
    caption: 'kodaikanal',
    location: 'Tamil Nadu',
    year: 2022,
    width: 1152,
    height: 1440,
  },
  {
    src: '/photographs/best-picks/mawsmai-cave-2022.jpg',
    alt: 'A figure wedged in a narrow stalactite passage inside Mawsmai Cave, Cherrapunji',
    caption: 'mawsmai cave',
    location: 'Meghalaya',
    year: 2022,
    width: 1440,
    height: 1538,
  },
  {
    src: '/photographs/best-picks/halong-bay-boats-2023.jpg',
    alt: 'Two small wooden tour boats motoring between karst islands under an overcast sky in Ha Long Bay',
    caption: 'ha long bay',
    location: 'Vietnam',
    year: 2023,
    width: 3854,
    height: 3024,
  },
  {
    src: '/photographs/best-picks/hoi-an-lantern-lady-2023.jpg',
    alt: 'A woman in a white shirt sitting alone under red paper lanterns in a Hoi An cafe at night',
    caption: 'hoi an',
    location: 'Vietnam',
    year: 2023,
    width: 1080,
    height: 1920,
  },
  {
    src: '/photographs/best-picks/varkala-trio-2026.jpg',
    alt: 'Three surfers in black and white raising boards above their heads next to a thatched beach hut in Varkala',
    caption: 'boards over hut',
    location: 'Varkala',
    year: 2026,
    width: 2870,
    height: 4018,
  },
  {
    src: '/photographs/best-picks/varkala-couple-2026.jpg',
    alt: 'Two surfers standing at the water\'s edge in Varkala carrying longboards on their heads, dusty pink late-afternoon light',
    caption: 'mid-conversation',
    location: 'Varkala',
    year: 2026,
    width: 3024,
    height: 3024,
  },
];

export default function PhotosPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-32 pt-32 sm:px-8">
      <header className="mb-20 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-tertiary">
          a small gallery
        </p>
        <h1 className="mt-3 text-4xl font-light tracking-tight text-primary sm:text-5xl">
          photos
        </h1>
        <p className="mt-6 text-base leading-relaxed text-secondary">
          Eight frames. The ones I keep coming back to after I&apos;ve
          forgotten the trip.
        </p>
      </header>

      {/* Pinterest-style masonry via CSS columns. No JS, no CLS. Items flow
          top→bottom, then into the next column, so array order = reading
          order on wide screens. */}
      <div className="columns-1 gap-6 sm:columns-2 sm:gap-8">
        {photos.map((photo, idx) => (
          <figure
            key={photo.src}
            className="mb-6 break-inside-avoid sm:mb-8"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="h-auto w-full"
              priority={idx < 2}
              quality={90}
            />
            <figcaption className="mt-3 flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              <span className="text-primary">{photo.caption}</span>
              <span className="text-tertiary">
                {photo.location} · {photo.year}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <footer className="mx-auto mt-24 max-w-2xl border-t border-border pt-8 text-xs leading-relaxed text-tertiary">
        All shot by me. iPhone SE → iPhone 15 Pro (plus a couple of DSLR
        nights in 2018–19). Pulled out of ~20k frames with a small
        Vision-based script (aesthetics + face quality + composition
        bonus, per-day dedup), then cut down to these eight by eye. The
        Hoi An frame was re-graded in{' '}
        <a
          href="https://github.com/anupamchugh/emulsion"
          className="underline decoration-tertiary/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
        >
          Emulsion
        </a>
        .
      </footer>
    </div>
  );
}
