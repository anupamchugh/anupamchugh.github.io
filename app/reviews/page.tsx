import Link from 'next/link';
import { getReviews } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'reviews',
  description: 'Film reviews and observations',
};

export default function ReviewsPage() {
  const reviews = getReviews();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <h1 className="text-2xl font-semibold">reviews</h1>
      <p className="mt-2 text-secondary">
        Films watched, patterns noticed.
      </p>

      <section className="mt-12">
        <div className="mt-4 space-y-2">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <article key={review.slug} className="flex items-baseline gap-4 py-2">
                <time className="shrink-0 text-sm text-tertiary tabular-nums" dateTime={review.date}>
                  {formatDate(review.date)}
                </time>
                <Link
                  href={`/posts/${review.slug}`}
                  className="text-primary hover:underline underline-offset-4"
                >
                  {review.title}
                </Link>
              </article>
            ))
          ) : (
            <p className="text-tertiary py-8">No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
