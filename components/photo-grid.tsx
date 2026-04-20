'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export type Photo = {
  src: string;
  alt: string;
  caption: string;
  location: string;
  year: number;
  width: number;
  height: number;
};

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const close = useCallback(() => setOpenIdx(null), []);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight')
        setOpenIdx((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft')
        setOpenIdx((i) =>
          i === null ? i : (i - 1 + photos.length) % photos.length
        );
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIdx, close, photos.length]);

  const active = openIdx === null ? null : photos[openIdx];

  return (
    <>
      {/* Pinterest-style masonry via CSS columns. No JS, no CLS. Items flow
          top→bottom, then into the next column, so array order = reading
          order on wide screens. */}
      <div className="columns-1 gap-6 sm:columns-2 sm:gap-8">
        {photos.map((photo, idx) => (
          <figure
            key={photo.src}
            className="mb-6 break-inside-avoid sm:mb-8"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(idx)}
              className="group block w-full cursor-zoom-in p-0"
              aria-label={`Open ${photo.caption} larger`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 100vw, 50vw"
                className="h-auto w-full transition-opacity duration-300 group-hover:opacity-90"
                priority={idx < 2}
                quality={90}
              />
            </button>
            <figcaption className="mt-3 flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              <span className="text-primary">{photo.caption}</span>
              <span className="text-tertiary">
                {photo.location} · {photo.year}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
          >
            close ✕
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full max-w-full flex-col items-center gap-3"
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="100vw"
              quality={95}
              className="h-auto max-h-[85vh] w-auto max-w-full object-contain"
              priority
            />
            <figcaption className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">
              <span className="text-white">{active.caption}</span>
              <span>
                {active.location} · {active.year}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
