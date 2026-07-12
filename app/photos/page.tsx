import { Metadata } from 'next';
import PhotoGrid from '@/components/photo-grid';
import { curatedPhotos } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'photos',
  description: 'photos from the archive.',
};

export default function PhotosPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-32 pt-32 sm:px-8">
      <header className="mb-20 max-w-2xl">
        <h1 className="text-4xl font-light tracking-tight text-primary sm:text-5xl">
          photos
        </h1>
      </header>

      <PhotoGrid photos={curatedPhotos} />
    </div>
  );
}
