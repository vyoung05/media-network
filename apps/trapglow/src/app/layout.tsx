import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LenisProvider } from '@/components/LenisProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { PageTransition } from '@/components/PageTransition';
import { CustomCursor } from '@/components/CustomCursor';
import { PageViewTracker } from '@/components/PageViewTracker';
import { OrganizationSchema } from '@/components/StructuredData';
import { CartProvider } from '@media-network/ui';

export const metadata: Metadata = {
  title: {
    default: 'TrapGlow — Shining Light on What\'s Next',
    template: '%s | TrapGlow',
  },
  description:
    'Discover tomorrow\'s biggest artists today. Music discovery, artist spotlights, curated playlists, and the Glow Up leaderboard.',
  keywords: ['music discovery', 'emerging artists', 'hip-hop', 'R&B', 'Afrobeats', 'artist spotlight', 'new music', 'trap', 'glow up'],
  openGraph: {
    title: 'TrapGlow — Shining Light on What\'s Next',
    description: 'Discover tomorrow\'s biggest artists today.',
    siteName: 'TrapGlow',
    type: 'website',
    url: 'https://trapglow.com',
    images: [
      {
        url: 'https://heyboss.heeyo.ai/replicate-z-image-turbo-1772241218-0ce5efbf.jpeg',
        width: 1200,
        height: 630,
        alt: 'TrapGlow - Shining Light on What\'s Next',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrapGlow',
    description: 'Shining Light on What\'s Next.',
    images: ['https://heyboss.heeyo.ai/replicate-z-image-turbo-1772241218-0ce5efbf.jpeg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" className="dark">
      <head>
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-secondary">
        <OrganizationSchema />
        <CartProvider>
          <LenisProvider>
            <CustomCursor />
            <ScrollProgress />
            <Header />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <PageViewTracker brand="trapglow" />
          </LenisProvider>
        </CartProvider>
      </body>
    </html>
  );
}
