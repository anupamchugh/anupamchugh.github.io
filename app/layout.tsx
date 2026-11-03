import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/content';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ThemeProvider } from '@/lib/theme-context';
import { activeFontPreset } from '@/lib/font-presets';
import JsonLd from '@/components/json-ld';
import { personJsonLd } from '@/lib/discovery';

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@chughgpt',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth"
      data-font={activeFontPreset}
      data-theme="modern"
      suppressHydrationWarning
    >
      <body
        className="flex min-h-screen flex-col font-sans subpixel-antialiased"
      >
        <JsonLd data={personJsonLd} />
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
