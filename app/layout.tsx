import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/content';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ThemeProvider } from '@/lib/theme-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif' });

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
    creator: '@chughanupam',
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
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${inter.variable} ${sourceSerif.variable} flex min-h-screen flex-col font-sans subpixel-antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
