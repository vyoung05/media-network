import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LenisProvider } from '@/components/LenisProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { PageTransition } from '@/components/PageTransition';
import { CustomCursor } from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: {
    default: 'SauceWire — Culture. Connected. Now.',
    template: '%s | SauceWire',
  },
  description:
    'Breaking news and culture coverage — hip-hop, fashion, entertainment, sports, and tech. Always on, always plugged in.',
  keywords: ['news', 'hip-hop', 'culture', 'entertainment', 'fashion', 'sports', 'tech'],
  openGraph: {
    title: 'SauceWire — Culture. Connected. Now.',
    description: 'Breaking culture news. Always on.',
    siteName: 'SauceWire',
    type: 'website',
    url: 'https://saucewire.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SauceWire - Culture. Connected. Now.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SauceWire',
    description: 'Culture. Connected. Now.',
    images: ['/og-image.png'],
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-secondary">
        <LenisProvider>
          <CustomCursor />
          <ScrollProgress />
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
