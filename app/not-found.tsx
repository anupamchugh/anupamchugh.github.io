import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="mt-4 text-secondary">
          page not found.
        </p>

        <div className="mt-8 flex justify-center gap-4 text-sm">
          <Link
            href="/"
            className="text-tertiary hover:text-primary transition-colors"
          >
            home
          </Link>
          <Link
            href="/posts/"
            className="text-tertiary hover:text-primary transition-colors"
          >
            writing
          </Link>
        </div>
      </div>
    </div>
  );
}
