import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'photos',
  description: 'Three photos. The ones that hold up after I\'ve forgotten the trip.',
};

type Photo = {
  src: string;
  alt: string;
  caption: string;
  location: string;
  year: number;
  width: number;
  height: number;
  note: string;
};

// Three photos. Not a travel archive. The ones that hold up after I've
// forgotten the trip. Real pixel dimensions are passed to next/image so
// nothing is upscaled and nothing is cropped.
const photos: Photo[] = [
  {
    src: '/photographs/career-journey/misty-dog-kodaikanal.jpg',
    alt: 'A street dog walking out of the mist on a forest trail in Kodaikanal',
    caption: 'kodaikanal',
    location: 'Kodaikanal, Tamil Nadu',
    year: 2022,
    width: 1152,
    height: 1440,
    note:
      'Morning hike, eucalyptus forest, the fog hadn\'t lifted yet. This dog walked out of the white and stopped. Shot on an iPhone SE with no idea what I was doing — most of the frame is negative space and that\'s the whole picture.',
  },
  {
    src: '/photographs/best-picks/hoi-an-lantern-lady-2023.jpg',
    alt: 'A woman in a white shirt sitting alone under red paper lanterns in a Hoi An cafe at night',
    caption: 'hoi an',
    location: 'Hoi An, Vietnam',
    year: 2023,
    width: 1080,
    height: 1920,
    note:
      'Hoi An during the full-moon lantern festival. Walked past an empty cafe, saw the light, stopped. Red lanterns along the top, a single candle on the back table, ochre wall washed in the lanterns, her in white looking off-frame. Re-graded later in Emulsion; the raw frame was close enough that the grade is basically exposure and contrast.',
  },
  {
    src: '/photographs/best-picks/surfers-walking-varkala-2026.jpg',
    alt: 'Two surfers walking up the beach in Varkala with boards under their arms',
    caption: 'varkala',
    location: 'Varkala, Kerala',
    year: 2026,
    width: 4032,
    height: 3024,
    note:
      'Coming in after a morning session at Varkala. Mostly sand below, sky above, two surfers as the line that connects them. Neither of us is looking at the camera — could be the start of the session or the end and it doesn\'t matter.',
  },
];

export default function PhotosPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-32 pt-32 sm:px-8">
      <header className="mb-24 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-tertiary">
          a tiny gallery
        </p>
        <h1 className="mt-3 text-4xl font-light tracking-tight text-primary sm:text-5xl">
          photos
        </h1>
        <p className="mt-6 text-base leading-relaxed text-secondary">
          Three frames. Mostly iPhone. The ones I keep coming back to after
          I&apos;ve forgotten the trip.
        </p>
      </header>

      <div className="space-y-32">
        {photos.map((photo, idx) => {
          const isPortrait = photo.height > photo.width;
          return (
            <figure key={photo.src} className="space-y-6">
              <div
                className={
                  isPortrait
                    ? 'mx-auto w-full max-w-xl'
                    : 'mx-auto w-full max-w-5xl'
                }
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={
                    isPortrait
                      ? '(max-width: 640px) 100vw, 576px'
                      : '(max-width: 1024px) 100vw, 1024px'
                  }
                  className="h-auto w-full"
                  priority={idx === 0}
                  quality={92}
                />
              </div>

              <figcaption className="mx-auto max-w-2xl">
                <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
                    {photo.caption}
                  </p>
                  <p className="font-mono text-xs text-tertiary">
                    {photo.location} · {photo.year}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-secondary">
                  {photo.note}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <footer className="mx-auto mt-32 max-w-2xl border-t border-border pt-8 text-xs leading-relaxed text-tertiary">
        All shot by me. iPhone SE → iPhone 15 Pro. Pulled out of ~20k frames
        with a{' '}
        <a
          href="https://github.com/anupamchugh/emulsion/blob/main/scripts/rank_photos.swift"
          className="underline decoration-tertiary/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
        >
          small Vision-based script
        </a>{' '}
        (aesthetics + face quality + composition bonus, per-day dedup), then
        cut down to these three by eye. The Hoi An frame was re-graded in{' '}
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
