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
  note: string;
  location: string;
  year: number;
  aspect: 'portrait' | 'landscape';
};

// Three photos. Not a travel archive. The ones that hold up after I've
// forgotten the trip.
const photos: Photo[] = [
  {
    src: '/photographs/career-journey/misty-dog-kodaikanal.jpg',
    alt: 'A street dog walking out of the mist on a forest trail in Kodaikanal',
    caption: 'Kodaikanal · 2022',
    location: 'Kodaikanal',
    year: 2022,
    aspect: 'portrait',
    note:
      'Morning hike, eucalyptus forest, the fog hadn\'t lifted yet. This dog just walked out of the white and stopped. Shot on an iPhone SE with no idea what I was doing. Still the most "found" photo I\'ve ever taken — most of the frame is negative space, and that\'s the whole picture.',
  },
  {
    src: '/photographs/best-picks/hoi-an-lantern-lady-2023.jpg',
    alt: 'A woman in a white shirt sitting alone under red paper lanterns in a Hoi An cafe at night',
    caption: 'Hoi An, Vietnam · 2023',
    location: 'Hoi An',
    year: 2023,
    aspect: 'portrait',
    note:
      'Hoi An during the full-moon lantern festival. I wasn\'t trying to shoot this — I walked past an empty cafe, saw the light, stopped. Red paper lanterns along the top, a single candle on the back table, ochre wall washed in the lanterns, and her looking off-frame in a white shirt. The kind of scene that only holds together if nobody notices you. Re-graded later in Emulsion; the raw frame was close enough that the grade is basically exposure and contrast.',
  },
  {
    src: '/photographs/best-picks/surfers-walking-sri-lanka-2026.jpg',
    alt: 'Two surfers walking up the beach in Sri Lanka with boards under their arms',
    caption: 'Sri Lanka · 2026',
    location: 'Weligama',
    year: 2026,
    aspect: 'landscape',
    note:
      'Coming in after a morning session. The shot is mostly sand in the bottom half and sky in the top half; the two surfers are just the line that connects them. I like that neither of us is looking at the camera — you can read it as the session starting or ending and it doesn\'t matter. Shot handheld, no crop.',
  },
];

export default function PhotosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold text-primary">photos</h1>
        <p className="mt-3 text-secondary">
          Three photos. Mostly iPhone. The ones I keep coming back to after
          I&apos;ve forgotten the trip.
        </p>
      </header>

      <div className="space-y-16">
        {photos.map((photo) => (
          <figure key={photo.src}>
            <div
              className={
                photo.aspect === 'portrait'
                  ? 'relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg bg-secondary'
                  : 'relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-secondary'
              }
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4">
              <p className="text-sm font-medium text-primary">
                {photo.caption}
              </p>
              <p className="mt-2 text-secondary">{photo.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <footer className="mt-16 border-t border-border pt-8 text-sm text-tertiary">
        All photos shot by me. iPhone SE → iPhone 15 Pro. Pulled out of{' '}
        ~20k frames with a{' '}
        <a
          href="https://github.com/anupamchugh/emulsion/blob/main/scripts/rank_photos.swift"
          className="underline hover:text-primary"
        >
          small Vision-based script
        </a>{' '}
        (aesthetics + face quality + composition bonus, per-day dedup), then
        cut down to these three by eye.
      </footer>
    </div>
  );
}
