/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
  // Next's dev server does not serve public directory indexes automatically.
  ...(process.env.NODE_ENV === 'development' ? {
    async rewrites() {
      return [{ source: '/showcase/', destination: '/showcase/index.html' }];
    },
  } : {}),
};

module.exports = nextConfig;
