import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-white">Page Not Found</h2>
        <p className="mt-2 text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-600 px-6 py-3 font-bold text-white transition-all hover:scale-105"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/posts/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-6 py-3 font-bold text-white transition-colors hover:border-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
