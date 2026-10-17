import type { Metadata } from 'next';
import {
  Inter,
  Source_Serif_4,
  Space_Grotesk,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  IBM_Plex_Mono,
  Work_Sans,
} from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/content';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ThemeProvider } from '@/lib/theme-context';
import { activeFontPreset } from '@/lib/font-presets';
import JsonLd from '@/components/json-ld';
import { personJsonLd } from '@/lib/discovery';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '600'],
});
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  weight: ['400', '600'],
});
const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  variable: '--font-plex-serif',
  weight: ['400', '600'],
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '600'],
});
const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '600'],
});

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
        className={`${inter.variable} ${sourceSerif.variable} ${spaceGrotesk.variable} ${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${workSans.variable} flex min-h-screen flex-col font-sans subpixel-antialiased`}
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
